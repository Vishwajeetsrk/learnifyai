CREATE TABLE IF NOT EXISTS public.store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'tools',
  cost INTEGER NOT NULL DEFAULT 100,
  icon TEXT,
  color TEXT,
  perks TEXT[] DEFAULT '{}',
  is_prime BOOLEAN DEFAULT false,
  prime_price INTEGER DEFAULT 0,
  auto_claim BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read store items"
  ON public.store_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role all on store_items"
  ON public.store_items FOR ALL
  TO service_role
  USING (true);

GRANT SELECT ON public.store_items TO authenticated;
GRANT ALL ON public.store_items TO service_role;

INSERT INTO public.store_items (name, description, category, cost, icon, color, perks, is_prime, prime_price, auto_claim) VALUES
  ('Resume Builder Premium', 'Unlock premium resume templates, ATS optimization, and unlimited exports', 'tools', 500, 'FileText', 'from-blue-500 to-blue-600', '{resume_premium}', false, 0, false),
  ('Gold Avatar Frame', 'Stand out with an exclusive golden frame around your profile avatar', 'cosmetics', 250, 'Award', 'from-amber-400 to-yellow-500', '{gold_frame}', false, 0, false),
  ('Cyberpunk IDE Theme', 'Code in style with a custom cyberpunk-inspired dark theme', 'cosmetics', 300, 'Monitor', 'from-fuchsia-500 to-purple-600', '{cyberpunk_theme}', false, 0, false),
  ('10% Course Discount', 'Get 10% off any course purchase on the platform', 'discounts', 1000, 'Percent', 'from-emerald-500 to-teal-600', '{course_discount_10}', false, 0, false),
  ('500 Extra AI Credits', 'Boost your AI learning with 500 additional AI tutor credits', 'credits', 400, 'Sparkles', 'from-violet-500 to-indigo-600', '{ai_credits_500}', false, 0, true),
  ('Priority Support Badge', 'Get priority access to support with faster response times', 'badges', 200, 'Shield', 'from-rose-500 to-pink-600', '{priority_support}', false, 0, false),
  ('Prime Avatar Frame', 'Exclusive animated prime avatar frame with premium gradient', 'prime', 0, 'Crown', 'from-amber-400 to-orange-500', '{prime_frame}', true, 299, true)
ON CONFLICT DO NOTHING;
