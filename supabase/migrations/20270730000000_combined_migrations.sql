CREATE TABLE IF NOT EXISTS public.concept_graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id)
);

ALTER TABLE public.concept_graphs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "concept_graphs_select" ON public.concept_graphs FOR SELECT USING (true);
CREATE POLICY "concept_graphs_insert" ON public.concept_graphs FOR INSERT WITH CHECK (true);
CREATE POLICY "concept_graphs_update" ON public.concept_graphs FOR UPDATE USING (true);

CREATE TABLE IF NOT EXISTS public.explanations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('beginner','intermediate','expert','analogy')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, level)
);

ALTER TABLE public.explanations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "explanations_cache_select" ON public.explanations_cache FOR SELECT USING (true);
CREATE POLICY "explanations_cache_insert" ON public.explanations_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "explanations_cache_update" ON public.explanations_cache FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_concept_graphs_lesson ON public.concept_graphs(lesson_id);
CREATE INDEX IF NOT EXISTS idx_concept_graphs_course ON public.concept_graphs(course_id);
CREATE INDEX IF NOT EXISTS idx_explanations_cache_lesson ON public.explanations_cache(lesson_id);
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  changes JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at ON public.admin_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_actor ON public.admin_audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_entity ON public.admin_audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON public.admin_audit_logs (action);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Service role can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

GRANT SELECT ON public.admin_audit_logs TO authenticated;
GRANT ALL ON public.admin_audit_logs TO service_role;
CREATE TABLE IF NOT EXISTS public.cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  handler TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  last_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled ON public.cron_jobs (enabled);
CREATE INDEX IF NOT EXISTS idx_cron_jobs_last_run ON public.cron_jobs (last_run_at DESC);

ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role all on cron_jobs"
  ON public.cron_jobs FOR ALL
  TO service_role
  USING (true);

GRANT ALL ON public.cron_jobs TO service_role;

INSERT INTO public.cron_jobs (name, schedule, handler, enabled) VALUES
  ('Auto Maintenance', '0 3 * * *', '/api/cron/auto-maintenance', true),
  ('Check Subscriptions', '0 */6 * * *', '/api/cron/check-subscriptions', true),
  ('Retry Certificate Emails', '*/30 * * * *', '/api/cron/retry-cert-emails', true),
  ('Run Reminders', '*/15 * * * *', '/api/public/hooks/run-reminders', true)
ON CONFLICT DO NOTHING;
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
