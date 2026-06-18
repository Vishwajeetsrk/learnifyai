-- Extend pricing_plans with subscription billing fields
ALTER TABLE public.pricing_plans
  ADD COLUMN IF NOT EXISTS price_inr numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS interval text CHECK (interval IN ('month', 'year', NULL)),
  ADD COLUMN IF NOT EXISTS cashfree_plan_id text,
  ADD COLUMN IF NOT EXISTS ai_credits_monthly integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS max_courses integer DEFAULT -1;

UPDATE public.pricing_plans SET
  price_inr = 0, interval = NULL, ai_credits_monthly = 50, max_courses = 3, badge = NULL, color = NULL
WHERE name = 'Starter';

UPDATE public.pricing_plans SET
  price_inr = 499, interval = 'month', ai_credits_monthly = 10000, max_courses = -1, badge = 'Most popular', color = '#7c3aed'
WHERE name = 'Pro';

UPDATE public.pricing_plans SET
  price_inr = 0, interval = NULL, ai_credits_monthly = 50000, max_courses = -1, badge = NULL, color = NULL
WHERE name = 'Team';

-- user_subscriptions
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES pricing_plans(id) ON DELETE RESTRICT,
  cashfree_subscription_id text,
  cashfree_order_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled','expired','past_due','paused')),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz,
  cancelled_at timestamptz,
  will_renew boolean NOT NULL DEFAULT true,
  ai_credits_used_this_month integer NOT NULL DEFAULT 0,
  ai_credits_reset_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_user_subscriptions_active ON public.user_subscriptions (user_id) WHERE status = 'active';

GRANT SELECT, INSERT, UPDATE ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscription"
  ON public.user_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users manage own subscription"
  ON public.user_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update subscriptions"
  ON public.user_subscriptions FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;

-- subscription_events (audit log)
CREATE TABLE public.subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  user_id uuid,
  event_type text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.subscription_events TO authenticated;
GRANT ALL ON public.subscription_events TO service_role;

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own events"
  ON public.subscription_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role insert events"
  ON public.subscription_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
