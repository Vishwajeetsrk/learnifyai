-- Courses: owner-creator can manage own
DROP POLICY IF EXISTS "Creators manage own courses" ON public.courses;
CREATE POLICY "Creators manage own courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid() AND has_role(auth.uid(), 'creator'::app_role))
  WITH CHECK (created_by = auth.uid() AND has_role(auth.uid(), 'creator'::app_role));

-- Lessons: owner-creator of parent course can manage
DROP POLICY IF EXISTS "Creators manage own lessons" ON public.lessons;
CREATE POLICY "Creators manage own lessons"
  ON public.lessons
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c
                 WHERE c.id = lessons.course_id
                   AND c.created_by = auth.uid()
                   AND has_role(auth.uid(), 'creator'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c
                      WHERE c.id = lessons.course_id
                        AND c.created_by = auth.uid()
                        AND has_role(auth.uid(), 'creator'::app_role)));

-- Modules
DROP POLICY IF EXISTS "Creators manage own modules" ON public.course_modules;
CREATE POLICY "Creators manage own modules"
  ON public.course_modules
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c
                 WHERE c.id = course_modules.course_id
                   AND c.created_by = auth.uid()
                   AND has_role(auth.uid(), 'creator'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c
                      WHERE c.id = course_modules.course_id
                        AND c.created_by = auth.uid()
                        AND has_role(auth.uid(), 'creator'::app_role)));

-- MCQ
DROP POLICY IF EXISTS "Creators manage own mcq" ON public.mcq_questions;
CREATE POLICY "Creators manage own mcq"
  ON public.mcq_questions
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c
                 WHERE c.id = mcq_questions.course_id
                   AND c.created_by = auth.uid()
                   AND has_role(auth.uid(), 'creator'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c
                      WHERE c.id = mcq_questions.course_id
                        AND c.created_by = auth.uid()
                        AND has_role(auth.uid(), 'creator'::app_role)));

-- Assignments
DROP POLICY IF EXISTS "Creators manage own assignments" ON public.course_assignments;
CREATE POLICY "Creators manage own assignments"
  ON public.course_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c
                 WHERE c.id = course_assignments.course_id
                   AND c.created_by = auth.uid()
                   AND has_role(auth.uid(), 'creator'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.courses c
                      WHERE c.id = course_assignments.course_id
                        AND c.created_by = auth.uid()
                        AND has_role(auth.uid(), 'creator'::app_role)));