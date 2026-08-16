-- Speaking cloud submissions, private audio storage, and teacher review.
-- Apply manually after 006. This migration does not modify existing data.

create table public.speaking_submissions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.attempts(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  storage_path text not null unique,
  mime_type text,
  duration_seconds integer,
  task_id text,
  task_title text,
  status text not null default 'pending' check(status in ('pending','reviewed')),
  score numeric check(score is null or score>=0),
  max_score numeric check(max_score is null or max_score>0),
  teacher_comment text,
  reviewed_by uuid references public.teacher_profiles(id) on delete set null,
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  check(score is null or max_score is not null),
  check(score is null or score<=max_score)
);

create index speaking_submissions_student_id_idx on public.speaking_submissions(student_id);
create index speaking_submissions_status_created_at_idx on public.speaking_submissions(status,created_at desc);

alter table public.speaking_submissions enable row level security;
grant select,insert on public.speaking_submissions to authenticated;
revoke update,delete on public.speaking_submissions from authenticated;

create policy "Student reads own speaking submissions" on public.speaking_submissions
  for select to authenticated using(student_id=auth.uid());
create policy "Student creates own speaking submission" on public.speaking_submissions
  for insert to authenticated with check(
    student_id=auth.uid()
    and split_part(storage_path,'/',1)=auth.uid()::text
    and status='pending'
    and score is null
    and max_score is null
    and teacher_comment is null
    and reviewed_by is null
    and reviewed_at is null
    and exists(
      select 1 from public.attempts a
      where a.id=attempt_id and a.student_id=auth.uid() and a.section='speaking'
    )
  );
create policy "Teacher reads enrolled speaking submissions" on public.speaking_submissions
  for select to authenticated using(
    public.is_teacher(auth.uid())
    and public.teacher_owns_student(auth.uid(),student_id)
  );

insert into storage.buckets(id,name,public)
values('speaking-recordings','speaking-recordings',false)
on conflict(id) do update set public=false;

create policy "Student uploads own speaking recording" on storage.objects
  for insert to authenticated with check(
    bucket_id='speaking-recordings'
    and (storage.foldername(name))[1]=auth.uid()::text
  );
create policy "Student reads own speaking recording" on storage.objects
  for select to authenticated using(
    bucket_id='speaking-recordings'
    and (storage.foldername(name))[1]=auth.uid()::text
  );
create policy "Student removes own failed speaking upload" on storage.objects
  for delete to authenticated using(
    bucket_id='speaking-recordings'
    and (storage.foldername(name))[1]=auth.uid()::text
    and not exists(
      select 1 from public.speaking_submissions ss
      where ss.storage_path=storage.objects.name
    )
  );
create policy "Teacher reads enrolled speaking recording" on storage.objects
  for select to authenticated using(
    bucket_id='speaking-recordings'
    and exists(
      select 1 from public.speaking_submissions ss
      where ss.storage_path=name
        and public.is_teacher(auth.uid())
        and public.teacher_owns_student(auth.uid(),ss.student_id)
    )
  );

create or replace function public.review_speaking_attempt(
  p_attempt_id uuid,p_score numeric,p_max_score numeric,p_comment text
) returns public.speaking_submissions
language plpgsql security definer set search_path = ''
as $$
declare
  target public.attempts%rowtype;
  result public.speaking_submissions%rowtype;
begin
  if auth.uid() is null or not public.is_teacher(auth.uid()) then
    raise exception 'Teacher access required' using errcode='42501';
  end if;
  if p_max_score<=0 or p_score<0 or p_score>p_max_score then
    raise exception 'Некорректная оценка.' using errcode='22023';
  end if;
  select a.* into target from public.attempts as a
    where a.id=p_attempt_id and a.section='speaking';
  if target.id is null
    or not public.teacher_owns_student(auth.uid(),target.student_id) then
    raise exception 'Работа недоступна.' using errcode='42501';
  end if;
  update public.speaking_submissions as ss
    set score=p_score,max_score=p_max_score,teacher_comment=p_comment,
        status='reviewed',reviewed_by=auth.uid(),reviewed_at=now()
    where ss.attempt_id=target.id
    returning * into result;
  if result.id is null then
    raise exception 'Работа недоступна.' using errcode='42501';
  end if;
  update public.attempts as a
    set score=p_score,max_score=p_max_score,
        percentage=round(p_score/p_max_score*100,2)
    where a.id=target.id;
  return result;
end
$$;

revoke all on function public.review_speaking_attempt(uuid,numeric,numeric,text) from public;
revoke all on function public.review_speaking_attempt(uuid,numeric,numeric,text) from anon;
grant execute on function public.review_speaking_attempt(uuid,numeric,numeric,text) to authenticated;
