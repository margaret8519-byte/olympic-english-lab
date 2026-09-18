-- QA hardening for Writing / Full Olympiad review.
-- Keeps writing_reviews focused on the teacher's Writing score while attempts stores the combined full-round result.

create or replace function public.review_writing_attempt(
  p_attempt_id uuid,p_score numeric,p_max_score numeric,p_comment text
) returns public.writing_reviews
language plpgsql security definer set search_path = ''
as $$
declare
  target public.attempts%rowtype;
  result public.writing_reviews%rowtype;
  objective_score numeric := 0;
  objective_max numeric := 0;
  final_score numeric;
  final_max numeric;
  answer_total integer := 1;
  objective_correct integer := 0;
  objective_incorrect integer := 0;
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

  select
    coalesce(sum(coalesce(points,0)),0),
    coalesce(sum(coalesce(max_points,0)),0),
    count(*) filter (where is_correct=true),
    count(*) filter (where is_correct=false)
  into objective_score,objective_max,objective_correct,objective_incorrect
  from public.attempt_answers
  where attempt_id=target.id and section<>'writing';

  select count(*) into answer_total
  from public.attempt_answers
  where attempt_id=target.id;

  final_score := p_score + objective_score;
  final_max := p_max_score + objective_max;

  update public.attempts
    set score=final_score,
        max_score=final_max,
        percentage=round(final_score/final_max*100,2),
        total_questions=greatest(answer_total,1),
        correct_answers=objective_correct,
        incorrect_answers=objective_incorrect,
        metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{reviewStatus}','"reviewed"'::jsonb,true)
    where id=target.id;

  return result;
end
$$;

revoke all on function public.review_writing_attempt(uuid,numeric,numeric,text) from public;
revoke all on function public.review_writing_attempt(uuid,numeric,numeric,text) from anon;
grant execute on function public.review_writing_attempt(uuid,numeric,numeric,text) to authenticated;

-- This function is a trigger helper and should not be callable through the API.
revoke all on function public.create_teacher_profile_from_signup() from public;
revoke all on function public.create_teacher_profile_from_signup() from anon;
revoke all on function public.create_teacher_profile_from_signup() from authenticated;
