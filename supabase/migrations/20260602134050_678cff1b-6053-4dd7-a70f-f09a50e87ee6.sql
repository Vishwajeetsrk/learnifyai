
-- site_settings: simple key/value store
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

INSERT INTO public.site_settings (key, value) VALUES
  ('contact_email', 'hello@learnify.ai'),
  ('discord_url', 'https://discord.gg/learnify'),
  ('discord_label', 'Chat with the community in real time.'),
  ('twitter_url', 'https://x.com/learnifyai'),
  ('twitter_handle', '@learnifyai'),
  ('github_url', '#'),
  ('careers_email', 'careers@learnify.ai')
ON CONFLICT (key) DO NOTHING;

-- pricing_plans
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_label text NOT NULL,
  description text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_label text NOT NULL DEFAULT 'Get started',
  cta_to text NOT NULL DEFAULT '/signup',
  highlighted boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pricing_plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
GRANT ALL ON public.pricing_plans TO service_role;

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing plans"
  ON public.pricing_plans FOR SELECT USING (true);

CREATE POLICY "Admins manage pricing plans"
  ON public.pricing_plans FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER set_pricing_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.pricing_plans (name, price_label, description, features, cta_label, cta_to, highlighted, order_index) VALUES
  ('Starter', 'Free', 'Everything you need to start learning.',
    '["3 free courses","Basic AI tutor","Community access","Progress tracking"]'::jsonb,
    'Get started', '/signup', false, 1),
  ('Pro', '₹499/mo', 'For serious learners and creators.',
    '["Unlimited courses","Advanced AI tools","Certificates","Priority support","Creator monetization"]'::jsonb,
    'Start Pro', '/signup', true, 2),
  ('Team', 'Custom', 'Cohorts, schools, and companies.',
    '["Seat-based billing","Admin dashboard","SSO + RBAC","Custom branding","Dedicated success"]'::jsonb,
    'Contact sales', '/contact', false, 3);
