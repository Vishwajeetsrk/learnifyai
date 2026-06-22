-- Add certificate_template_id to courses so creators can pick which template to use
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS certificate_template_id UUID REFERENCES public.certificate_templates(id);

-- Allow creators to manage their own courses (not just super_admins)
DROP POLICY IF EXISTS "Creators manage own courses" ON public.courses;
CREATE POLICY "Creators manage own courses" ON public.courses
  FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Allow creators to view all templates (for certificate selection)
DROP POLICY IF EXISTS "Creators can view all templates for course" ON public.certificate_templates;
CREATE POLICY "Creators can view all templates for course" ON public.certificate_templates
  FOR SELECT TO authenticated
  USING (true);
