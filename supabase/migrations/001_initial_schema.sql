create table public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  grade integer not null,
  class_letter text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.attempts (
  id uuid primary key,
  student_id uuid references public.students(id) on delete cascade,
  mode text,
  section text,
  source text,
  started_at timestamptz default now(),
  completed_at timestamptz,
  score integer,
  max_score integer,
  percentage numeric,
  total_questions integer,
  correct_answers integer,
  incorrect_answers integer,
  weak_subskill text,
  metadata jsonb default '{}'::jsonb
);

create table public.attempt_answers (
  id bigint generated always as identity primary key,
  attempt_id uuid references public.attempts(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  question_id text not null,
  section text,
  skill text,
  subskill text,
  answer_text text,
  is_correct boolean,
  points numeric,
  max_points numeric,
  created_at timestamptz default now()
);

create table public.skill_stats (
  student_id uuid references public.students(id) on delete cascade,
  skill text not null,
  subskill text not null,
  attempts integer default 0,
  correct integer default 0,
  incorrect integer default 0,
  accuracy numeric default 0,
  updated_at timestamptz default now(),
  primary key (student_id, skill, subskill)
);

create index attempts_student_id_idx on public.attempts (student_id);
create index attempts_student_started_at_idx
  on public.attempts (student_id, started_at desc);
create index attempt_answers_attempt_id_idx
  on public.attempt_answers (attempt_id);
create index attempt_answers_student_id_idx
  on public.attempt_answers (student_id);
create index attempt_answers_student_skill_subskill_idx
  on public.attempt_answers (student_id, skill, subskill);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger students_set_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

create trigger skill_stats_set_updated_at
before update on public.skill_stats
for each row
execute function public.set_updated_at();

alter table public.students enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.skill_stats enable row level security;

grant select, insert, update on table public.students to authenticated, anon;
grant select, insert, update on table public.attempts to authenticated, anon;
grant select, insert, update on table public.attempt_answers to authenticated, anon;
grant select, insert, update on table public.skill_stats to authenticated, anon;
grant usage, select on sequence public.attempt_answers_id_seq to authenticated, anon;

create policy "Users can read their own student profile"
on public.students
for select
to authenticated, anon
using (id = (select auth.uid()));

create policy "Users can create their own student profile"
on public.students
for insert
to authenticated, anon
with check (id = (select auth.uid()));

create policy "Users can update their own student profile"
on public.students
for update
to authenticated, anon
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Users can read their own attempts"
on public.attempts
for select
to authenticated, anon
using (student_id = (select auth.uid()));

create policy "Users can create their own attempts"
on public.attempts
for insert
to authenticated, anon
with check (student_id = (select auth.uid()));

create policy "Users can update their own attempts"
on public.attempts
for update
to authenticated, anon
using (student_id = (select auth.uid()))
with check (student_id = (select auth.uid()));

create policy "Users can read their own attempt answers"
on public.attempt_answers
for select
to authenticated, anon
using (student_id = (select auth.uid()));

create policy "Users can create their own attempt answers"
on public.attempt_answers
for insert
to authenticated, anon
with check (student_id = (select auth.uid()));

create policy "Users can update their own attempt answers"
on public.attempt_answers
for update
to authenticated, anon
using (student_id = (select auth.uid()))
with check (student_id = (select auth.uid()));

create policy "Users can read their own skill stats"
on public.skill_stats
for select
to authenticated, anon
using (student_id = (select auth.uid()));

create policy "Users can create their own skill stats"
on public.skill_stats
for insert
to authenticated, anon
with check (student_id = (select auth.uid()));

create policy "Users can update their own skill stats"
on public.skill_stats
for update
to authenticated, anon
using (student_id = (select auth.uid()))
with check (student_id = (select auth.uid()));
