-- Auto-issue certificates with full data: recipient name from profile, template
-- from the course (canva_templates), recipient email column, and audit trail.

alter table public.certificates add column if not exists recipient_email text;

create or replace function public.submit_final_test(_course_id uuid, _answers jsonb)
returns table (score int, total int, passed boolean, cert_code text, template_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_total int := 0;
  v_score int := 0;
  v_passed boolean := false;
  v_code text := null;
  v_template_id uuid;
  v_cert_id uuid;
  v_recipient_name text;
  v_recipient_email text;
  v_course_title text;
  v_existing text;
  r record;
  v_pick int;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (select 1 from public.enrollments e
                 where e.user_id = v_user and e.course_id = _course_id) then
    raise exception 'Not enrolled in this course';
  end if;

  select full_name, email into v_recipient_name, v_recipient_email
  from public.profiles where id = v_user;

  select certificate_template_id, title into v_template_id, v_course_title
  from public.courses where id = _course_id;

  for r in
    select id, answer, order_index
    from public.mcq_questions
    where course_id = _course_id
    order by order_index
  loop
    v_total := v_total + 1;
    begin
      v_pick := (_answers ->> r.order_index::text)::int;
    exception when others then
      v_pick := -1;
    end;
    if v_pick = r.answer then
      v_score := v_score + 1;
    end if;
  end loop;

  v_passed := v_total > 0 and (v_score::numeric / v_total) >= 0.7;

  insert into public.mcq_attempts (user_id, course_id, score, total, passed, answers)
  values (v_user, _course_id, v_score, v_total, v_passed, _answers);

  if v_passed then
    select code into v_existing from public.certificates
      where user_id = v_user and course_id = _course_id limit 1;
    if v_existing is not null then
      v_code := v_existing;
    else
      v_code := 'LRN-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6))
                || '-' || upper(to_hex(extract(epoch from now())::bigint));
      insert into public.certificates
        (user_id, course_id, code, score, total, template_id, recipient_name, recipient_email)
      values
        (v_user, _course_id, v_code, v_score, v_total, v_template_id,
         coalesce(v_recipient_name, 'Learner'), v_recipient_email)
      returning id into v_cert_id;

      insert into public.certificate_audit_log
        (certificate_id, user_id, action, course_title, details)
      values
        (v_cert_id, v_user, 'auto_issued', v_course_title,
         jsonb_build_object('score', v_score, 'total', v_total));
    end if;
  end if;

  return query select v_score, v_total, v_passed, v_code, v_template_id;
end;
$$;

revoke all on function public.submit_final_test(uuid, jsonb) from public;
grant execute on function public.submit_final_test(uuid, jsonb) to authenticated;
