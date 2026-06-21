-- Subscription billing enhancements
-- Adds: invoices, payment logs, webhook idempotency, grace period, coupon codes

-- 1. Extend pricing_plans with grace period
ALTER TABLE public.pricing_plans
  ADD COLUMN IF NOT EXISTS grace_period_days integer DEFAULT 3,
  ADD COLUMN IF NOT EXISTS trial_days integer DEFAULT 0;

-- 2. Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  invoice_number text NOT NULL UNIQUE,
  amount_inr numeric(12,2) NOT NULL,
  tax_inr numeric(12,2) DEFAULT 0,
  total_inr numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','void')),
  payment_method text,
  cashfree_order_id text,
  period_start timestamptz,
  period_end timestamptz,
  line_items jsonb DEFAULT '[]'::jsonb,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

GRANT SELECT, INSERT, UPDATE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages invoices"
  ON public.invoices FOR ALL TO service_role
  USING (true);

-- 3. Payment logs (every Cashfree interaction)
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  cashfree_event_id text,
  request_payload jsonb,
  response_payload jsonb,
  status text DEFAULT 'received' CHECK (status IN ('received','processed','failed','ignored')),
  error_message text,
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_logs_idempotency ON public.payment_logs (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payment_logs_user ON public.payment_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created ON public.payment_logs (created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.payment_logs TO authenticated;
GRANT ALL ON public.payment_logs TO service_role;

ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payment logs"
  ON public.payment_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages payment logs"
  ON public.payment_logs FOR ALL TO service_role
  USING (true);

-- 4. Coupon codes
CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_percent integer CHECK (discount_percent BETWEEN 1 AND 100),
  discount_amount_inr numeric(12,2) CHECK (discount_amount_inr >= 0),
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  applicable_plan_ids uuid[],
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupon_codes TO authenticated;
GRANT ALL ON public.coupon_codes TO service_role;

ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check coupon validity"
  ON public.coupon_codes FOR SELECT TO authenticated
  USING (active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Admins manage coupons"
  ON public.coupon_codes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 5. Subscription analytics view for admin
CREATE OR REPLACE VIEW public.subscription_analytics AS
SELECT
  pp.id AS plan_id,
  pp.name AS plan_name,
  pp.price_inr,
  COUNT(us.id) FILTER (WHERE us.status = 'active') AS active_subscribers,
  COUNT(us.id) FILTER (WHERE us.status = 'cancelled') AS cancelled_count,
  COUNT(us.id) FILTER (WHERE us.status = 'expired') AS expired_count,
  COUNT(us.id) AS total_subscriptions,
  SUM(pp.price_inr) FILTER (WHERE us.status = 'active') AS mrr,
  SUM(pp.price_inr) FILTER (WHERE us.status = 'active') * 12 AS arr
FROM public.pricing_plans pp
LEFT JOIN public.user_subscriptions us ON us.plan_id = pp.id
GROUP BY pp.id, pp.name, pp.price_inr;

GRANT SELECT ON public.subscription_analytics TO authenticated;

-- 6. Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1001;

-- 7. Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text AS $$
BEGIN
  RETURN 'INV-' || TO_CHAR(now(), 'YYYYMM') || '-' || LPAD(nextval('invoice_number_seq')::text, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- 8. Function to check and downgrade expired subscriptions
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET status = 'expired', will_renew = false, updated_at = now()
  WHERE status = 'active'
    AND current_period_end < now() - (SELECT COALESCE(grace_period_days, 3) || ' days' FROM public.pricing_plans pp WHERE pp.id = plan_id)::interval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
