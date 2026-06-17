GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mcq_questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_assignments TO authenticated;

ALTER POLICY "Authenticated can view published courses" ON public.courses
  USING (published = true OR public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

ALTER POLICY "Super admins manage courses" ON public.courses
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

ALTER POLICY "Authenticated view lessons of published courses" ON public.lessons
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = lessons.course_id
      AND (c.published = true OR public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  ));

ALTER POLICY "Super admins manage lessons" ON public.lessons
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

ALTER POLICY "Authenticated view modules" ON public.course_modules
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_modules.course_id
      AND (c.published OR public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  ));

ALTER POLICY "Admins manage modules" ON public.course_modules
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

ALTER POLICY "Authenticated view mcq" ON public.mcq_questions
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = mcq_questions.course_id
      AND (c.published OR public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  ));

ALTER POLICY "Admins manage mcq" ON public.mcq_questions
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));

ALTER POLICY "Authenticated view assignments" ON public.course_assignments
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_assignments.course_id
      AND (c.published OR public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  ));

ALTER POLICY "Admins manage assignments" ON public.course_assignments
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));