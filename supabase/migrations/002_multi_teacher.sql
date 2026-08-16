-- Run manually in Supabase after reviewing. This migration is not executed by the app.
alter table public.attempts alter column score type numeric using score::numeric;
alter table public.attempts alter column max_score type numeric using max_score::numeric;

create table public.teacher_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles(id) on delete cascade,
  name text not null,
  grade integer check (grade between 7 and 11),
  class_letter text,
  join_code text not null unique check (join_code ~ '^[A-HJ-NP-Z2-9]{6,8}$'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  joined_at timestamptz default now(),
  unique (class_id, student_id)
);

create table public.writing_reviews (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.attempts(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid not null references public.teacher_profiles(id) on delete cascade,
  score numeric,
  max_score numeric,
  teacher_comment text,
  status text not null default 'pending' check (status in ('pending','reviewed')),
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  check (score is null or score >= 0),
  check (max_score is null or max_score > 0),
  check (score is null or max_score is null or score <= max_score)
);

create index classes_teacher_id_idx on public.classes(teacher_id);
create index class_enrollments_class_id_idx on public.class_enrollments(class_id);
create index class_enrollments_student_id_idx on public.class_enrollments(student_id);
create index writing_reviews_teacher_status_idx on public.writing_reviews(teacher_id,status);
create index writing_reviews_student_id_idx on public.writing_reviews(student_id);

create trigger teacher_profiles_set_updated_at before update on public.teacher_profiles for each row execute function public.set_updated_at();
create trigger classes_set_updated_at before update on public.classes for each row execute function public.set_updated_at();

create or replace function public.is_teacher(p_user_id uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.teacher_profiles where id=p_user_id) $$;

create or replace function public.teacher_owns_student(p_teacher_id uuid,p_student_id uuid) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.class_enrollments ce join public.classes c on c.id=ce.class_id where c.teacher_id=p_teacher_id and ce.student_id=p_student_id) $$;

create or replace function public.create_teacher_profile_from_signup() returns trigger
language plpgsql security definer set search_path = ''
as $$ begin
  if new.raw_user_meta_data->>'account_type'='teacher' then
    insert into public.teacher_profiles(id,display_name) values(new.id,trim(new.raw_user_meta_data->>'display_name')) on conflict(id) do nothing;
  end if;
  return new;
end $$;
create trigger create_teacher_profile_after_signup after insert on auth.users for each row execute function public.create_teacher_profile_from_signup();

create or replace function public.generate_class_join_code() returns text
language plpgsql volatile security definer set search_path = ''
as $$ declare alphabet constant text:='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';candidate text;begin
  if auth.uid() is null or not public.is_teacher(auth.uid()) then
    raise exception 'Teacher access required' using errcode='42501';
  end if;
  loop
    select string_agg(substr(alphabet,1+floor(random()*length(alphabet))::int,1),'') into candidate from generate_series(1,7);
    exit when not exists(select 1 from public.classes where join_code=candidate);
  end loop;
  return candidate;
end $$;

create or replace function public.join_class_by_code(p_code text)
returns table(class_id uuid,class_name text,grade integer,class_letter text)
language plpgsql security definer set search_path = ''
as $$ declare selected public.classes%rowtype;current_user_id uuid:=auth.uid();begin
  if current_user_id is null or not exists(select 1 from public.students s where s.id=current_user_id) then raise exception 'Требуется профиль ученика.' using errcode='P0001';end if;
  select * into selected from public.classes c where c.join_code=upper(trim(p_code));
  if selected.id is null then raise exception 'Класс с таким кодом не найден.' using errcode='P0001';end if;
  insert into public.class_enrollments(class_id,student_id) values(selected.id,current_user_id) on conflict(class_id,student_id) do nothing;
  update public.students set grade=coalesce(selected.grade,grade),class_letter=coalesce(selected.class_letter,class_letter) where id=current_user_id;
  return query select selected.id,selected.name,selected.grade,selected.class_letter;
end $$;

alter table public.teacher_profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.writing_reviews enable row level security;

grant select,update on public.teacher_profiles to authenticated;
grant select,insert,update,delete on public.classes to authenticated;
grant select on public.class_enrollments to authenticated;
grant select on public.writing_reviews to authenticated;
revoke all on function public.is_teacher(uuid) from public;
revoke all on function public.is_teacher(uuid) from anon;
grant execute on function public.is_teacher(uuid) to authenticated;
revoke all on function public.teacher_owns_student(uuid,uuid) from public;
revoke all on function public.teacher_owns_student(uuid,uuid) from anon;
grant execute on function public.teacher_owns_student(uuid,uuid) to authenticated;
revoke all on function public.generate_class_join_code() from public;
revoke all on function public.generate_class_join_code() from anon;
revoke all on function public.join_class_by_code(text) from public;
revoke all on function public.join_class_by_code(text) from anon;
grant execute on function public.join_class_by_code(text) to authenticated;
grant execute on function public.generate_class_join_code() to authenticated;

create policy "Teacher reads own profile" on public.teacher_profiles for select to authenticated using(id=auth.uid());
create policy "Teacher updates own profile" on public.teacher_profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy "Teacher manages own classes" on public.classes for all to authenticated using(teacher_id=auth.uid() and public.is_teacher()) with check(teacher_id=auth.uid() and public.is_teacher());
create policy "Student reads enrolled classes" on public.classes for select to authenticated using(exists(select 1 from public.class_enrollments ce where ce.class_id=classes.id and ce.student_id=auth.uid()));
create policy "Student reads own enrollments" on public.class_enrollments for select to authenticated using(student_id=auth.uid());
create policy "Teacher reads own class enrollments" on public.class_enrollments for select to authenticated using(exists(select 1 from public.classes c where c.id=class_id and c.teacher_id=auth.uid()));

create policy "Teacher reads enrolled students" on public.students for select to authenticated using(public.is_teacher() and public.teacher_owns_student(auth.uid(),id));
create policy "Teacher reads enrolled attempts" on public.attempts for select to authenticated using(public.is_teacher() and public.teacher_owns_student(auth.uid(),student_id));
create policy "Teacher reads enrolled attempt answers" on public.attempt_answers for select to authenticated using(public.is_teacher() and public.teacher_owns_student(auth.uid(),student_id));
create policy "Teacher reads enrolled skill stats" on public.skill_stats for select to authenticated using(public.is_teacher() and public.teacher_owns_student(auth.uid(),student_id));

create policy "Student reads own writing reviews" on public.writing_reviews for select to authenticated using(student_id=auth.uid());
create policy "Teacher reads own student reviews" on public.writing_reviews for select to authenticated using(teacher_id=auth.uid() and public.teacher_owns_student(auth.uid(),student_id));

create or replace function public.review_writing_attempt(p_attempt_id uuid,p_score numeric,p_max_score numeric,p_comment text)
returns public.writing_reviews language plpgsql security definer set search_path=''
as $$ declare target public.attempts%rowtype;result public.writing_reviews%rowtype;begin
  select * into target from public.attempts where id=p_attempt_id and section='writing';
  if target.id is null or not public.is_teacher(auth.uid()) or not public.teacher_owns_student(auth.uid(),target.student_id) then raise exception 'Работа недоступна.' using errcode='42501';end if;
  if p_max_score<=0 or p_score<0 or p_score>p_max_score then raise exception 'Некорректная оценка.' using errcode='22023';end if;
  if exists(select 1 from public.writing_reviews wr where wr.attempt_id=target.id and wr.teacher_id<>auth.uid()) then raise exception 'Работа недоступна.' using errcode='42501';end if;
  insert into public.writing_reviews(attempt_id,student_id,teacher_id,score,max_score,teacher_comment,status,reviewed_at) values(target.id,target.student_id,auth.uid(),p_score,p_max_score,p_comment,'reviewed',now())
  on conflict(attempt_id) do update set score=excluded.score,max_score=excluded.max_score,teacher_comment=excluded.teacher_comment,status='reviewed',reviewed_at=now()
  where public.writing_reviews.teacher_id=auth.uid() returning * into result;
  if result.id is null then raise exception 'Работа недоступна.' using errcode='42501';end if;
  update public.attempts set score=p_score,max_score=p_max_score,percentage=round(p_score/p_max_score*100,2) where id=target.id;
  return result;
end $$;
revoke all on function public.review_writing_attempt(uuid,numeric,numeric,text) from public;
revoke all on function public.review_writing_attempt(uuid,numeric,numeric,text) from anon;
grant execute on function public.review_writing_attempt(uuid,numeric,numeric,text) to authenticated;
