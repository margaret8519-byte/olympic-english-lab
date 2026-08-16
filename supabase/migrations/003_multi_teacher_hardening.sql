-- Reconciles an already-installed multi-teacher schema. Run manually after 002.
-- This migration does not recreate tables and does not delete application data.

alter table public.attempts alter column score type numeric using score::numeric;
alter table public.attempts alter column max_score type numeric using max_score::numeric;

create or replace function public.is_teacher(p_user_id uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_user_id=auth.uid()
    and exists(select 1 from public.teacher_profiles where id=p_user_id)
$$;

create or replace function public.teacher_owns_student(p_teacher_id uuid,p_student_id uuid) returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_teacher_id=auth.uid()
    and exists(
      select 1
      from public.class_enrollments ce
      join public.classes c on c.id=ce.class_id
      where c.teacher_id=p_teacher_id and ce.student_id=p_student_id
    )
$$;

create or replace function public.generate_class_join_code() returns text
language plpgsql volatile security definer set search_path = ''
as $$
declare
  alphabet constant text:='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
begin
  if auth.uid() is null or not public.is_teacher(auth.uid()) then
    raise exception 'Teacher access required' using errcode='42501';
  end if;
  loop
    select string_agg(substr(alphabet,1+floor(random()*length(alphabet))::int,1),'')
      into candidate from generate_series(1,7);
    exit when not exists(select 1 from public.classes where join_code=candidate);
  end loop;
  return candidate;
end
$$;

create or replace function public.join_class_by_code(p_code text)
returns table(class_id uuid,class_name text,grade integer,class_letter text)
language plpgsql security definer set search_path = ''
as $$
declare
  selected public.classes%rowtype;
  current_user_id uuid:=auth.uid();
begin
  if current_user_id is null
    or not exists(select 1 from public.students s where s.id=current_user_id) then
    raise exception 'Требуется профиль ученика.' using errcode='P0001';
  end if;
  select * into selected
    from public.classes c
    where c.join_code=upper(trim(p_code));
  if selected.id is null then
    raise exception 'Класс с таким кодом не найден.' using errcode='P0001';
  end if;
  insert into public.class_enrollments(class_id,student_id)
    values(selected.id,current_user_id)
    on conflict(class_id,student_id) do nothing;
  update public.students
    set grade=coalesce(selected.grade,grade),
        class_letter=coalesce(selected.class_letter,class_letter)
    where id=current_user_id;
  return query select selected.id,selected.name,selected.grade,selected.class_letter;
end
$$;

create or replace function public.review_writing_attempt(
  p_attempt_id uuid,p_score numeric,p_max_score numeric,p_comment text
) returns public.writing_reviews
language plpgsql security definer set search_path = ''
as $$
declare
  target public.attempts%rowtype;
  result public.writing_reviews%rowtype;
begin
  select * into target
    from public.attempts
    where id=p_attempt_id and section='writing';
  if target.id is null
    or not public.is_teacher(auth.uid())
    or not public.teacher_owns_student(auth.uid(),target.student_id) then
    raise exception 'Работа недоступна.' using errcode='42501';
  end if;
  if p_max_score<=0 or p_score<0 or p_score>p_max_score then
    raise exception 'Некорректная оценка.' using errcode='22023';
  end if;
  if exists(
    select 1 from public.writing_reviews wr
    where wr.attempt_id=target.id and wr.teacher_id<>auth.uid()
  ) then
    raise exception 'Работа недоступна.' using errcode='42501';
  end if;
  insert into public.writing_reviews(
    attempt_id,student_id,teacher_id,score,max_score,teacher_comment,status,reviewed_at
  ) values(
    target.id,target.student_id,auth.uid(),p_score,p_max_score,p_comment,'reviewed',now()
  )
  on conflict(attempt_id) do update
    set score=excluded.score,
        max_score=excluded.max_score,
        teacher_comment=excluded.teacher_comment,
        status='reviewed',
        reviewed_at=now()
    where public.writing_reviews.teacher_id=auth.uid()
  returning * into result;
  if result.id is null then
    raise exception 'Работа недоступна.' using errcode='42501';
  end if;
  update public.attempts
    set score=p_score,
        max_score=p_max_score,
        percentage=round(p_score/p_max_score*100,2)
    where id=target.id;
  return result;
end
$$;

revoke all on function public.is_teacher(uuid) from public;
revoke all on function public.is_teacher(uuid) from anon;
grant execute on function public.is_teacher(uuid) to authenticated;
revoke all on function public.teacher_owns_student(uuid,uuid) from public;
revoke all on function public.teacher_owns_student(uuid,uuid) from anon;
grant execute on function public.teacher_owns_student(uuid,uuid) to authenticated;
revoke all on function public.generate_class_join_code() from public;
revoke all on function public.generate_class_join_code() from anon;
grant execute on function public.generate_class_join_code() to authenticated;
revoke all on function public.join_class_by_code(text) from public;
revoke all on function public.join_class_by_code(text) from anon;
grant execute on function public.join_class_by_code(text) to authenticated;
revoke all on function public.review_writing_attempt(uuid,numeric,numeric,text) from public;
revoke all on function public.review_writing_attempt(uuid,numeric,numeric,text) from anon;
grant execute on function public.review_writing_attempt(uuid,numeric,numeric,text) to authenticated;

revoke insert,update,delete on public.writing_reviews from authenticated;
grant select on public.writing_reviews to authenticated;

alter table public.teacher_profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.students enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.skill_stats enable row level security;
alter table public.writing_reviews enable row level security;

drop policy if exists "Teacher reads own profile" on public.teacher_profiles;
drop policy if exists "Teacher updates own profile" on public.teacher_profiles;
create policy "Teacher reads own profile" on public.teacher_profiles
  for select to authenticated using(id=auth.uid());
create policy "Teacher updates own profile" on public.teacher_profiles
  for update to authenticated using(id=auth.uid()) with check(id=auth.uid());

drop policy if exists "Teacher manages own classes" on public.classes;
drop policy if exists "Student reads enrolled classes" on public.classes;
create policy "Teacher manages own classes" on public.classes
  for all to authenticated
  using(teacher_id=auth.uid() and public.is_teacher(auth.uid()))
  with check(teacher_id=auth.uid() and public.is_teacher(auth.uid()));
create policy "Student reads enrolled classes" on public.classes
  for select to authenticated
  using(exists(
    select 1 from public.class_enrollments ce
    where ce.class_id=classes.id and ce.student_id=auth.uid()
  ));

drop policy if exists "Student reads own enrollments" on public.class_enrollments;
drop policy if exists "Teacher reads own class enrollments" on public.class_enrollments;
create policy "Student reads own enrollments" on public.class_enrollments
  for select to authenticated using(student_id=auth.uid());
create policy "Teacher reads own class enrollments" on public.class_enrollments
  for select to authenticated
  using(exists(
    select 1 from public.classes c
    where c.id=class_id and c.teacher_id=auth.uid()
  ));

drop policy if exists "Teacher reads enrolled students" on public.students;
create policy "Teacher reads enrolled students" on public.students
  for select to authenticated
  using(public.is_teacher(auth.uid()) and public.teacher_owns_student(auth.uid(),id));

drop policy if exists "Teacher reads enrolled attempts" on public.attempts;
create policy "Teacher reads enrolled attempts" on public.attempts
  for select to authenticated
  using(public.is_teacher(auth.uid()) and public.teacher_owns_student(auth.uid(),student_id));

drop policy if exists "Teacher reads enrolled attempt answers" on public.attempt_answers;
create policy "Teacher reads enrolled attempt answers" on public.attempt_answers
  for select to authenticated
  using(public.is_teacher(auth.uid()) and public.teacher_owns_student(auth.uid(),student_id));

drop policy if exists "Teacher reads enrolled skill stats" on public.skill_stats;
create policy "Teacher reads enrolled skill stats" on public.skill_stats
  for select to authenticated
  using(public.is_teacher(auth.uid()) and public.teacher_owns_student(auth.uid(),student_id));

drop policy if exists "Student reads own writing reviews" on public.writing_reviews;
drop policy if exists "Teacher reads own student reviews" on public.writing_reviews;
drop policy if exists "Teacher creates own student reviews" on public.writing_reviews;
drop policy if exists "Teacher updates own student reviews" on public.writing_reviews;
create policy "Student reads own writing reviews" on public.writing_reviews
  for select to authenticated using(student_id=auth.uid());
create policy "Teacher reads own student reviews" on public.writing_reviews
  for select to authenticated
  using(
    teacher_id=auth.uid()
    and public.is_teacher(auth.uid())
    and public.teacher_owns_student(auth.uid(),student_id)
  );

-- Intentionally absent: broad sequence grants, table recreation, data deletion, or data reset.
