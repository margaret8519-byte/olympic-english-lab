-- Qualifies table-column references that collide with RETURNS TABLE output
-- variables in join_class_by_code. Apply manually after 005.

create or replace function public.join_class_by_code(p_code text)
returns table(class_id uuid,class_name text,grade integer,class_letter text)
language plpgsql security definer set search_path = ''
as $$
declare
  selected public.classes%rowtype;
  current_user_id uuid:=auth.uid();
begin
  if current_user_id is null
    or not exists(
      select 1
      from public.students as s
      where s.id=current_user_id
    ) then
    raise exception 'Требуется профиль ученика.' using errcode='P0001';
  end if;

  select c.*
    into selected
    from public.classes as c
    where c.join_code=upper(trim(p_code));

  if selected.id is null then
    raise exception 'Класс с таким кодом не найден.' using errcode='P0001';
  end if;

  insert into public.class_enrollments(
    class_id,
    student_id
  ) values(
    selected.id,
    current_user_id
  )
  on conflict on constraint class_enrollments_class_id_student_id_key
  do nothing;

  update public.students as s
    set grade=coalesce(selected.grade,s.grade),
        class_letter=coalesce(selected.class_letter,s.class_letter)
    where s.id=current_user_id;

  return query
    select
      selected.id,
      selected.name,
      selected.grade,
      selected.class_letter;
end
$$;

revoke all on function public.join_class_by_code(text) from public;
revoke all on function public.join_class_by_code(text) from anon;
grant execute on function public.join_class_by_code(text) to authenticated;
