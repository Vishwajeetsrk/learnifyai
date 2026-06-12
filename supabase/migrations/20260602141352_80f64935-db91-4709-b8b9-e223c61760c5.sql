
DROP FUNCTION IF EXISTS public.get_certificate_by_code(text);

CREATE FUNCTION public.get_certificate_by_code(_code text)
 RETURNS TABLE(
   id uuid, code text, user_id uuid, course_id uuid, score integer, total integer, issued_at timestamp with time zone,
   learner_name text, learner_email text,
   course_title text, course_instructor text, course_category text,
   design_snapshot jsonb, recipient_name text, role_title text,
   date_from date, date_to date, notes text
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT c.id, c.code, c.user_id, c.course_id, c.score, c.total, c.issued_at,
         p.full_name, p.email,
         co.title, co.instructor, co.category,
         c.design_snapshot, c.recipient_name, c.role_title,
         c.date_from, c.date_to, c.notes
  FROM public.certificates c
  LEFT JOIN public.profiles p ON p.id = c.user_id
  LEFT JOIN public.courses co ON co.id = c.course_id
  WHERE c.code = _code
  LIMIT 1;
$function$;
