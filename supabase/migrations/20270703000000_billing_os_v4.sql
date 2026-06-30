-- Billing & Revenue OS V4.0
-- Adds: billing_refunds, billing_settings, billing_templates, billing_audit_logs, billing_exports

-- 1. Billing Refunds
CREATE TABLE IF NOT EXISTS public.billing_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  cashfree_refund_id text,
  cashfree_payment_id text,
  amount_inr numeric(12,2) NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','processing','completed','rejected','failed')),
  initiated_by uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.billing_refunds TO authenticated;
GRANT ALL ON public.billing_refunds TO service_role;
ALTER TABLE public.billing_refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own refunds"
  ON public.billing_refunds FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages refunds"
  ON public.billing_refunds FOR ALL TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_billing_refunds_user ON public.billing_refunds (user_id);
CREATE INDEX IF NOT EXISTS idx_billing_refunds_status ON public.billing_refunds (status);
CREATE INDEX IF NOT EXISTS idx_billing_refunds_invoice ON public.billing_refunds (invoice_id);

-- 2. Billing Settings (editable branding, tax config, invoice defaults)
CREATE TABLE IF NOT EXISTS public.billing_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.billing_settings TO authenticated;
GRANT ALL ON public.billing_settings TO service_role;
ALTER TABLE public.billing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read billing settings"
  ON public.billing_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage billing settings"
  ON public.billing_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Seed default billing settings
INSERT INTO public.billing_settings (key, value, description) VALUES
  ('branding', '{"company_name":"Learnify AI","legal_name":"Learnify EdTech Pvt. Ltd.","logo_url":"/logo.png","primary_color":"#4F46E5","secondary_color":"#7C3AED","success_color":"#22C55E","warning_color":"#F59E0B","danger_color":"#EF4444"}', 'Invoice and billing branding settings'),
  ('tax', '{"gst_enabled":true,"gstin":"29XXXXX1234X1Z5","cgst_rate":9,"sgst_rate":9,"igst_rate":18,"enable_tds":false,"tds_rate":1,"hsn_code":"","sac_code":""}', 'Tax configuration'),
  ('invoice', '{"prefix":"INV","footer":"This is a computer generated invoice and does not require a signature.","terms":"Payment due within 15 days.","currency":"INR","default_payment_terms":15,"watermark":"","show_qr":true}', 'Invoice defaults'),
  ('support', '{"email":"support@learnify.ai","phone":"+91-XXXXXXXXXX","address":"Learnify AI, Bangalore, India"}', 'Support contact details'),
  ('cashfree', '{"environment":"sandbox","connected_merchant":"","last_sync":"","webhook_url":"/api/webhooks/cashfree-subscription"}', 'Cashfree gateway settings')
ON CONFLICT (key) DO NOTHING;

-- 3. Invoice Templates
CREATE TABLE IF NOT EXISTS public.billing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  design jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_templates TO authenticated;
GRANT ALL ON public.billing_templates TO service_role;
ALTER TABLE public.billing_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read billing templates"
  ON public.billing_templates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage billing templates"
  ON public.billing_templates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Seed default templates
INSERT INTO public.billing_templates (name, slug, description, design, is_default, is_active) VALUES
  ('Learnify Official', 'learnify-official', 'Default Learnify AI branded invoice', '{"font":"Inter","header_style":"branded","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"primary","layout":"standard"}', true, true),
  ('Modern SaaS', 'modern-saas', 'Clean modern SaaS-style invoice', '{"font":"Inter","header_style":"minimal","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"minimal","layout":"standard"}', false, true),
  ('Corporate', 'corporate', 'Corporate formal invoice template', '{"font":"Serif","header_style":"formal","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"corporate","layout":"standard"}', false, true),
  ('Minimal', 'minimal', 'Minimal clean invoice', '{"font":"Inter","header_style":"minimal","show_logo":false,"show_gst":true,"show_qr":false,"color_scheme":"minimal","layout":"compact"}', false, true),
  ('GST Invoice', 'gst-invoice', 'GST-compliant invoice with all tax fields', '{"font":"Inter","header_style":"formal","show_logo":true,"show_gst":true,"show_qr":true,"color_scheme":"primary","layout":"standard"}', false, true),
  ('Dark Mode', 'dark-mode', 'Dark theme invoice', '{"font":"Inter","header_style":"branded","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"dark","layout":"standard"}', false, true)
ON CONFLICT (slug) DO NOTHING;

-- 4. Billing Audit Logs
CREATE TABLE IF NOT EXISTS public.billing_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  changes jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.billing_audit_logs TO authenticated;
GRANT ALL ON public.billing_audit_logs TO service_role;
ALTER TABLE public.billing_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit logs"
  ON public.billing_audit_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages audit logs"
  ON public.billing_audit_logs FOR ALL TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_action ON public.billing_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_entity ON public.billing_audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_created ON public.billing_audit_logs (created_at DESC);

-- 5. Billing Exports
CREATE TABLE IF NOT EXISTS public.billing_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type text NOT NULL CHECK (export_type IN ('invoices','payments','refunds','subscriptions','taxes','credits','revenue','all')),
  format text NOT NULL CHECK (format IN ('pdf','csv','xlsx','json','zip')),
  date_from timestamptz,
  date_to timestamptz,
  filters jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  file_url text,
  file_size_bytes bigint,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.billing_exports TO authenticated;
GRANT ALL ON public.billing_exports TO service_role;
ALTER TABLE public.billing_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own exports"
  ON public.billing_exports FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages exports"
  ON public.billing_exports FOR ALL TO service_role USING (true);

-- 6. Add invoice branding fields to existing invoices table
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS gstin text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS billing_address jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS invoice_template_id uuid REFERENCES public.billing_templates(id) ON DELETE SET NULL;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS terms text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS due_date timestamptz;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS refund_id uuid REFERENCES public.billing_refunds(id) ON DELETE SET NULL;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';

-- 7. Tax breakdown on invoices
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tax_breakdown jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS subtotal_inr numeric(12,2) DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS discount_inr numeric(12,2) DEFAULT 0;

-- 8. Add refund tracking to payment_logs
ALTER TABLE public.payment_logs ADD COLUMN IF NOT EXISTS refund_id uuid REFERENCES public.billing_refunds(id) ON DELETE SET NULL;
ALTER TABLE public.payment_logs ADD COLUMN IF NOT EXISTS amount numeric(12,2);
ALTER TABLE public.payment_logs ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';

-- 9. Function to log billing audit events
CREATE OR REPLACE FUNCTION public.log_billing_audit(
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_user_id uuid,
  p_changes jsonb DEFAULT '{}'::jsonb,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_ip_address text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.billing_audit_logs (action, entity_type, entity_id, user_id, changes, metadata, ip_address)
  VALUES (p_action, p_entity_type, p_entity_id, p_user_id, p_changes, p_metadata, p_ip_address)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Function to generate invoice with tax breakdown
CREATE OR REPLACE FUNCTION public.generate_invoice_with_tax(
  p_user_id uuid,
  p_amount_inr numeric,
  p_subscription_id uuid DEFAULT NULL,
  p_tax_inr numeric DEFAULT 0,
  p_line_items jsonb DEFAULT '[]'::jsonb,
  p_payment_method text DEFAULT NULL,
  p_cashfree_order_id text DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_invoice_number text;
  v_total numeric;
  v_subtotal numeric;
  v_id uuid;
  v_settings jsonb;
  v_gstin text;
  v_prefix text;
  v_terms text;
BEGIN
  -- Get settings
  SELECT value->>'prefix' INTO v_prefix FROM public.billing_settings WHERE key = 'invoice';
  SELECT value->>'gstin' INTO v_gstin FROM public.billing_settings WHERE key = 'tax';
  SELECT value->>'terms' INTO v_terms FROM public.billing_settings WHERE key = 'invoice';

  -- Generate invoice number
  v_invoice_number := COALESCE(v_prefix, 'INV') || '-' || TO_CHAR(now(), 'YYYYMM') || '-' || LPAD(nextval('invoice_number_seq')::text, 5, '0');

  v_subtotal := p_amount_inr;
  v_total := p_amount_inr + COALESCE(p_tax_inr, 0);

  INSERT INTO public.invoices (
    user_id, subscription_id, invoice_number, amount_inr, tax_inr, total_inr,
    subtotal_inr, status, payment_method, cashfree_order_id,
    line_items, gstin, notes, terms, due_date, created_at
  ) VALUES (
    p_user_id, p_subscription_id, v_invoice_number, p_amount_inr, COALESCE(p_tax_inr, 0), v_total,
    v_subtotal, 'pending', p_payment_method, p_cashfree_order_id,
    p_line_items, v_gstin, p_notes, v_terms, now() + interval '15 days', now()
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Auto invoice generation on subscription status change to 'active'
CREATE OR REPLACE FUNCTION public.auto_generate_invoice()
RETURNS trigger AS $$
DECLARE
  v_plan_name text;
  v_plan_price numeric;
  v_plan_interval text;
  v_line_items jsonb;
  v_invoice_id uuid;
  v_tax_rate numeric := 18;
  v_tax_amount numeric;
  v_settings jsonb;
BEGIN
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    SELECT name, price_inr, interval INTO v_plan_name, v_plan_price, v_plan_interval
    FROM public.pricing_plans WHERE id = NEW.plan_id;
    IF v_plan_price > 0 AND v_plan_interval IS NOT NULL THEN
      SELECT value INTO v_settings FROM public.billing_settings WHERE key = 'tax';
      v_tax_rate := COALESCE((v_settings->>'igst_rate')::numeric, 18);
      v_tax_amount := ROUND(v_plan_price * v_tax_rate / 100, 2);
      v_line_items := jsonb_build_array(
        jsonb_build_object('description', v_plan_name || ' Plan Subscription (' || v_plan_interval || ')', 'amount', v_plan_price, 'quantity', 1, 'type', 'subscription')
      );
      v_invoice_id := public.generate_invoice_with_tax(NEW.user_id, v_plan_price, NEW.id, v_tax_amount, v_line_items, 'card', NEW.cashfree_order_id);
      UPDATE public.invoices SET status = 'paid', paid_at = now() WHERE id = v_invoice_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_auto_generate_invoice
  AFTER INSERT OR UPDATE OF status ON public.user_subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION public.auto_generate_invoice();

-- 12. Backfill invoices for existing active paid subscriptions that lack them
INSERT INTO public.invoices (user_id, subscription_id, invoice_number, amount_inr, tax_inr, total_inr, subtotal_inr, status, line_items, created_at, paid_at)
SELECT
  us.user_id, us.id,
  'INV-' || TO_CHAR(now(), 'YYYYMM') || '-' || LPAD(ROW_NUMBER() OVER ()::text, 5, '0'),
  COALESCE(pp.price_inr, 0),
  ROUND(COALESCE(pp.price_inr, 0) * 18 / 100, 2),
  COALESCE(pp.price_inr, 0) + ROUND(COALESCE(pp.price_inr, 0) * 18 / 100, 2),
  COALESCE(pp.price_inr, 0),
  'paid',
  jsonb_build_array(jsonb_build_object('description', pp.name || ' Plan (backfill)', 'amount', pp.price_inr, 'quantity', 1)),
  us.created_at, us.created_at
FROM public.user_subscriptions us
JOIN public.pricing_plans pp ON pp.id = us.plan_id
WHERE us.status = 'active' AND pp.price_inr > 0
  AND NOT EXISTS (SELECT 1 FROM public.invoices i WHERE i.subscription_id = us.id)
ON CONFLICT DO NOTHING;
