-- Fixes classes <-> class_enrollments RLS recursion after migration 003.
-- Run manually. No tables or application data are modified.

create or replace function public.student_is_enrolled_in_class(
  p_student_id uuid,
  p_class_id uuid
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_student_id=auth.uid()
    and exists(
      select 1
      from public.class_enrollments ce
      where ce.student_id=p_student_id
        and ce.class_id=p_class_id
    )
$$;

create or replace function public.teacher_owns_class(
  p_teacher_id uuid,
  p_class_id uuid
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_teacher_id=auth.uid()
    and public.is_teacher(p_teacher_id)
    and exists(
      select 1
      from public.classes c
      where c.teacher_id=p_teacher_id
        and c.id=p_class_id
    )
$$;

revoke all on function public.student_is_enrolled_in_class(uuid,uuid) from public;
revoke all on function public.student_is_enrolled_in_class(uuid,uuid) from anon;
grant execute on function public.student_is_enrolled_in_class(uuid,uuid) to authenticated;
revoke all on function public.teacher_owns_class(uuid,uuid) from public;
revoke all on function public.teacher_owns_class(uuid,uuid) from anon;
grant execute on function public.teacher_owns_class(uuid,uuid) to authenticated;

alter table public.classes enable row level security;
alter table public.class_enrollments enable row level security;

drop policy if exists "Teacher manages own classes" on public.classes;
drop policy if exists "Student reads enrolled classes" on public.classes;

create policy "Teacher manages own classes"
on public.classes
for all
to authenticated
using(
  teacher_id=auth.uid()
  and public.is_teacher(auth.uid())
)
with check(
  teacher_id=auth.uid()
  and public.is_teacher(auth.uid())
);

create policy "Student reads enrolled classes"
on public.classes
for select
to authenticated
using(public.student_is_enrolled_in_class(auth.uid(),id));

drop policy if exists "Student reads own enrollments" on public.class_enrollments;
drop policy if exists "Teacher reads own class enrollments" on public.class_enrollments;

create policy "Student reads own enrollments"
on public.class_enrollments
for select
to authenticated
using(student_id=auth.uid());

create policy "Teacher reads own class enrollments"
on public.class_enrollments
for select
to authenticated
using(public.teacher_owns_class(auth.uid(),class_id));

-- join_class_by_code and teacher_owns_student remain unchanged. Both are
-- SECURITY DEFINER functions and therefore do not re-enter these RLS policies.
