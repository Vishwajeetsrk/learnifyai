
-- 1) Certificates: drop open SELECT + user INSERT, expose lookup via SECURITY DEFINER RPC
DROP POLICY IF EXISTS "Public can view certificates by code" ON public.certificates;
DROP POLICY IF EXISTS "Users insert own certificates" ON public.certificates;

CREATE OR REPLACE FUNCTION public.get_certificate_by_code(_code text)
RETURNS TABLE (
  id uuid, code text, user_id uuid, course_id uuid,
  score int, total int, issued_at timestamptz,
  learner_name text, learner_email text,
  course_title text, course_instructor text, course_category text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.code, c.user_id, c.course_id, c.score, c.total, c.issued_at,
         p.full_name, p.email,
         co.title, co.instructor, co.category
  FROM public.certificates c
  LEFT JOIN public.profiles p ON p.id = c.user_id
  LEFT JOIN public.courses co ON co.id = c.course_id
  WHERE c.code = _code
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_certificate_by_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_certificate_by_code(text) TO anon, authenticated;

-- 2) Wallet transactions: remove self-credit ability
DROP POLICY IF EXISTS "Users insert own transactions" ON public.wallet_transactions;

-- 3) MCQ questions: hide correct answer + explanation columns from students
REVOKE SELECT ON public.mcq_questions FROM authenticated, anon;
GRANT SELECT (id, course_id, question, options, order_index, created_at)
  ON public.mcq_questions TO authenticated;

-- 4) Server-side grading + cert issuance
CREATE OR REPLACE FUNCTION public.submit_final_test(_course_id uuid, _answers jsonb)
RETURNS TABLE (score int, total int, passed boolean, cert_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_total int := 0;
  v_score int := 0;
  v_passed boolean := false;
  v_code text := null;
  v_existing text;
  r record;
  v_pick int;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Require enrollment
  IF NOT EXISTS (SELECT 1 FROM public.enrollments e
                 WHERE e.user_id = v_user AND e.course_id = _course_id) THEN
    RAISE EXCEPTION 'Not enrolled in this course';
  END IF;

  FOR r IN
    SELECT id, answer, order_index
    FROM public.mcq_questions
    WHERE course_id = _course_id
    ORDER BY order_index
  LOOP
    v_total := v_total + 1;
    BEGIN
      v_pick := (_answers ->> r.order_index::text)::int;
    EXCEPTION WHEN others THEN
      v_pick := -1;
    END;
    IF v_pick = r.answer THEN
      v_score := v_score + 1;
    END IF;
  END LOOP;

  v_passed := v_total > 0 AND (v_score::numeric / v_total) >= 0.7;

  INSERT INTO public.mcq_attempts (user_id, course_id, score, total, passed, answers)
  VALUES (v_user, _course_id, v_score, v_total, v_passed, _answers);

  IF v_passed THEN
    -- Reuse any existing certificate for this user+course
    SELECT code INTO v_existing FROM public.certificates
      WHERE user_id = v_user AND course_id = _course_id LIMIT 1;
    IF v_existing IS NOT NULL THEN
      v_code := v_existing;
    ELSE
      v_code := 'LRN-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6))
                || '-' || upper(to_hex(extract(epoch from now())::bigint));
      INSERT INTO public.certificates (user_id, course_id, code, score, total)
      VALUES (v_user, _course_id, v_code, v_score, v_total);
    END IF;
  END IF;

  RETURN QUERY SELECT v_score, v_total, v_passed, v_code;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_final_test(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_final_test(uuid, jsonb) TO authenticated;

-- 5) Lock down the new-lesson notification trigger function (trigger fires regardless of EXECUTE)
REVOKE ALL ON FUNCTION public.notify_subscribers_new_lesson() FROM PUBLIC, anon, authenticated;
