-- A teacher may remove enrollment from an owned class. Student records and
-- completed attempts remain intact and can be associated with another class.
create or replace function public.remove_student_from_class(
  p_class_id uuid, p_student_id uuid
) returns boolean
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.teacher_owns_class(auth.uid(), p_class_id) then
    raise exception 'Класс недоступен.' using errcode='42501';
  end if;
  delete from public.class_enrollments as ce where ce.class_id = p_class_id and ce.student_id = p_student_id;
  return found;
end
$$;

revoke all on function public.remove_student_from_class(uuid,uuid) from public;
revoke all on function public.remove_student_from_class(uuid,uuid) from anon;
grant execute on function public.remove_student_from_class(uuid,uuid) to authenticated;
