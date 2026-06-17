
-- Certificate templates
CREATE TABLE public.certificate_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title_text text NOT NULL DEFAULT 'Certificate of Completion',
  subtitle text NOT NULL DEFAULT 'This is to certify that',
  body_template text NOT NULL DEFAULT 'has successfully completed the course {course} on {date}.',
  signatory_name text NOT NULL DEFAULT 'Learnify AI',
  signatory_title text NOT NULL DEFAULT 'Director of Learning',
  accent_color text NOT NULL DEFAULT '#c9a84c',
  bg_color text NOT NULL DEFAULT '#fdfbf5',
  text_color text NOT NULL DEFAULT '#0f1b3d',
  font_family text NOT NULL DEFAULT 'Playfair Display',
  logo_url text,
  signature_url text,
  stamp_url text,
  is_default boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.certificate_templates TO anon, authenticated;
GRANT ALL ON public.certificate_templates TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.certificate_templates TO authenticated;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view templates" ON public.certificate_templates FOR SELECT USING (true);
CREATE POLICY "Admins manage templates" ON public.certificate_templates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));
CREATE TRIGGER cert_templates_updated_at BEFORE UPDATE ON public.certificate_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Extend certificates for manual issue + frozen template snapshot
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS template_id uuid,
  ADD COLUMN IF NOT EXISTS design_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS recipient_name text,
  ADD COLUMN IF NOT EXISTS role_title text,
  ADD COLUMN IF NOT EXISTS date_from date,
  ADD COLUMN IF NOT EXISTS date_to date,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS issued_by uuid;

-- Allow admins to insert/update/delete certificates (and view all)
DROP POLICY IF EXISTS "Admins manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Anyone can view certificate by code" ON public.certificates;

CREATE POLICY "Admins manage certificates" ON public.certificates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Users view own certificates" ON public.certificates FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

-- FAQs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  order_index integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published faqs" ON public.faqs FOR SELECT
  USING (published OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed a default certificate template
INSERT INTO public.certificate_templates (name, is_default)
VALUES ('Classic Navy & Gold', true);

-- Seed a few FAQs
INSERT INTO public.faqs (question, answer, category, order_index) VALUES
  ('How do I earn a certificate?', 'Complete every lesson in a course and pass the final test with 70% or higher. Your certificate is minted automatically and available under Certificates.', 'Certificates', 1),
  ('How does the wallet work?', 'Top up your Learnify wallet from /wallet, then purchase paid courses from the cart in one click. Balances are held in INR.', 'Billing', 2),
  ('Are courses free?', 'Many starter courses are completely free. Premium courses are priced in INR; preview lessons stay free for everyone.', 'Pricing', 3),
  ('Can I become a creator?', 'Yes — apply from Apply as Creator. Once approved you can publish courses, run tests, and earn revenue.', 'Creators', 4);
