-- ============================================================
-- SUPABASE SQL SETUP FOR BILLING OS, BRANDING, AND EMAIL TEMPLATES
-- ============================================================

-- 1. Create App Role check function if not exists (for policy checks)
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id AND role = p_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Email Templates Table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  description TEXT,
  variables TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read email templates" ON public.email_templates;
CREATE POLICY "Admins read email templates" ON public.email_templates
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage email templates" ON public.email_templates;
CREATE POLICY "Admins manage email templates" ON public.email_templates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- Seed default email templates
INSERT INTO public.email_templates (id, name, subject, description, variables, html_body) VALUES
('welcome', 'Welcome Email', 'Welcome to Learnify AI, {{name}}! 🎉',
 'Sent when a new user signs up',
 ARRAY['name', 'email'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Welcome to Learnify AI</h1>
          <p style="margin:8px 0 0;color:#a5b4fc;font-size:16px;">Your AI-Powered Learning Journey Starts Now</p>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:18px;font-weight:600;">Hello, {{name}}! 👋</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">We''re thrilled to have you join <strong>Learnify AI</strong> — the AI-native learning platform built for modern learners.</p>
          <div style="text-align:center;margin-top:32px;">
            <a href="https://learnifyaitool.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Start Learning Now →</a>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© Learnify AI · learnifyaitool.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('password_reset', 'Password Reset', 'Reset your Learnify AI password 🔐',
 'Sent when a user requests a password reset',
 ARRAY['name', 'reset_link'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Password Reset Request</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">We received a request to reset your password. Click the button below to continue.</p>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="{{reset_link}}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Reset My Password</a>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© Learnify AI · learnifyaitool.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('course_enrolled', 'Course Enrollment Confirmation', 'You''re enrolled in {{course_title}}! 🎓',
 'Sent when a user purchases or enrolls in a course',
 ARRAY['name', 'course_title', 'course_url'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Course Enrollment - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#064e3b 0%,#065f46 50%,#064e3b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">You''re all set! 🎉</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;">You are officially enrolled in <strong>{{course_title}}</strong>.</p>
          <div style="text-align:center;margin-bottom:28px;margin-top:28px;">
            <a href="{{course_url}}" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Start Learning →</a>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© Learnify AI · learnifyaitool.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('certificate_issued', 'Certificate Issued', 'Your certificate is ready! 🏆 {{course_title}}',
 'Sent when a course completion certificate is generated',
 ARRAY['name', 'course_title', 'certificate_url'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate Issued - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#451a03 0%,#78350f 50%,#451a03 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Your Certificate is Ready!</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">Congratulations on completing <strong>{{course_title}}</strong>! Your certificate of completion is now ready for download.</p>
          <div style="text-align:center;margin-bottom:28px;margin-top:28px;">
            <a href="{{certificate_url}}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Download Certificate</a>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© Learnify AI · learnifyaitool.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('subscription_activated', 'Subscription Activated', 'Your {{plan_name}} plan is now active! ⚡',
 'Sent when a user successfully subscribes to a plan',
 ARRAY['name', 'plan_name', 'plan_price', 'next_billing_date'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Subscription Active - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">{{plan_name}} Plan Activated</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.7;">Your <strong>{{plan_name}}</strong> subscription is active. Enjoy unlimited access to all platform features!</p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;margin:0 0 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#64748b;font-size:13px;padding:6px 0;">Plan</td>
                <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;padding:6px 0;">{{plan_name}}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #1e293b;">Amount</td>
                <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;padding:6px 0;border-top:1px solid #1e293b;">{{plan_price}}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #1e293b;">Next Renewal</td>
                <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;padding:6px 0;border-top:1px solid #1e293b;">{{next_billing_date}}</td>
              </tr>
            </table>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© Learnify AI · learnifyaitool.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  html_body = EXCLUDED.html_body,
  description = EXCLUDED.description,
  variables = EXCLUDED.variables,
  updated_at = now();


-- 3. Billing Settings Table (for branding presets, tax details, defaults, support)
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

DROP POLICY IF EXISTS "Anyone can read billing settings" ON public.billing_settings;
CREATE POLICY "Anyone can read billing settings"
  ON public.billing_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage billing settings" ON public.billing_settings;
CREATE POLICY "Admins manage billing settings"
  ON public.billing_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- Seed default billing settings incorporating brand details, defaults and support
INSERT INTO public.billing_settings (key, value, description) VALUES
  ('branding', '{
    "company_name": "Learnify AI",
    "legal_name": "Learnify EdTech Pvt. Ltd.",
    "logo_url": "/logo.png",
    "brand_color": "#6366f1",
    "primary_color": "#6366f1",
    "secondary_color": "#7C3AED",
    "success_color": "#22C55E",
    "warning_color": "#F59E0B",
    "danger_color": "#EF4444"
  }', 'Invoice and billing branding settings'),
  ('tax', '{
    "gst_enabled": true,
    "gstin": "29XXXXX1234X1Z5",
    "cgst_rate": 9,
    "sgst_rate": 9,
    "igst_rate": 18,
    "enable_tds": false,
    "tds_rate": 1,
    "hsn_code": "",
    "sac_code": ""
  }', 'Tax configuration'),
  ('invoice', '{
    "prefix": "INV",
    "footer": "Thank you for your business!",
    "terms": "Payment due within 30 days.",
    "currency": "INR",
    "default_payment_terms": 30,
    "watermark": "",
    "show_qr": true
  }', 'Invoice defaults'),
  ('support', '{
    "support_email": "support@learnify.ai",
    "support_phone": "+91 1800-XXX-XXXX",
    "support_address": "123, Main Street, City, State - 000000",
    "email": "support@learnify.ai",
    "phone": "+91 1800-XXX-XXXX",
    "address": "123, Main Street, City, State - 000000"
  }', 'Support contact details'),
  ('cashfree', '{
    "environment": "sandbox",
    "connected_merchant": "",
    "last_sync": "",
    "webhook_url": "/api/webhooks/cashfree-subscription"
  }', 'Cashfree gateway settings')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();


-- 4. Billing Refunds Table
CREATE TABLE IF NOT EXISTS public.billing_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id uuid,
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

DROP POLICY IF EXISTS "Users view own refunds" ON public.billing_refunds;
CREATE POLICY "Users view own refunds"
  ON public.billing_refunds FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Service role manages refunds" ON public.billing_refunds;
CREATE POLICY "Service role manages refunds"
  ON public.billing_refunds FOR ALL TO service_role USING (true);


-- 5. Invoice Templates Table
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

DROP POLICY IF EXISTS "Anyone can read billing templates" ON public.billing_templates;
CREATE POLICY "Anyone can read billing templates"
  ON public.billing_templates FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage billing templates" ON public.billing_templates;
CREATE POLICY "Admins manage billing templates"
  ON public.billing_templates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

INSERT INTO public.billing_templates (name, slug, description, design, is_default, is_active) VALUES
  ('Learnify Official', 'learnify-official', 'Default Learnify AI branded invoice', '{"font":"Inter","header_style":"branded","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"primary","layout":"standard"}', true, true),
  ('Modern SaaS', 'modern-saas', 'Clean modern SaaS-style invoice', '{"font":"Inter","header_style":"minimal","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"minimal","layout":"standard"}', false, true),
  ('Corporate', 'corporate', 'Corporate formal invoice template', '{"font":"Serif","header_style":"formal","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"corporate","layout":"standard"}', false, true),
  ('Minimal', 'minimal', 'Minimal clean invoice', '{"font":"Inter","header_style":"minimal","show_logo":false,"show_gst":true,"show_qr":false,"color_scheme":"minimal","layout":"compact"}', false, true),
  ('GST Invoice', 'gst-invoice', 'GST-compliant invoice with all tax fields', '{"font":"Inter","header_style":"formal","show_logo":true,"show_gst":true,"show_qr":true,"color_scheme":"primary","layout":"standard"}', false, true),
  ('Dark Mode', 'dark-mode', 'Dark theme invoice', '{"font":"Inter","header_style":"branded","show_logo":true,"show_gst":true,"show_qr":false,"color_scheme":"dark","layout":"standard"}', false, true)
ON CONFLICT (slug) DO NOTHING;


-- 6. Billing Audit Logs
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

DROP POLICY IF EXISTS "Admins view audit logs" ON public.billing_audit_logs;
CREATE POLICY "Admins view audit logs"
  ON public.billing_audit_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Service role manages audit logs" ON public.billing_audit_logs;
CREATE POLICY "Service role manages audit logs"
  ON public.billing_audit_logs FOR ALL TO service_role USING (true);


-- 7. Billing Exports Table
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

DROP POLICY IF EXISTS "Users view own exports" ON public.billing_exports;
CREATE POLICY "Users view own exports"
  ON public.billing_exports FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Service role manages exports" ON public.billing_exports;
CREATE POLICY "Service role manages exports"
  ON public.billing_exports FOR ALL TO service_role USING (true);


-- 8. Alter Existing Invoices and Payments Logs with new invoice fields
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS gstin text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS billing_address jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS invoice_template_id uuid REFERENCES public.billing_templates(id) ON DELETE SET NULL;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS terms text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS due_date timestamptz;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS refund_id uuid REFERENCES public.billing_refunds(id) ON DELETE SET NULL;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tax_breakdown jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS subtotal_inr numeric(12,2) DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS discount_inr numeric(12,2) DEFAULT 0;

ALTER TABLE public.payment_logs ADD COLUMN IF NOT EXISTS refund_id uuid REFERENCES public.billing_refunds(id) ON DELETE SET NULL;
ALTER TABLE public.payment_logs ADD COLUMN IF NOT EXISTS amount numeric(12,2);
ALTER TABLE public.payment_logs ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';


-- 9. Setup Sequence for Invoice Numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1001;


-- 10. Audit Logging helper function
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


-- 11. Custom Invoice Generation function (using prefix from settings)
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
  v_gstin text;
  v_prefix text;
  v_terms text;
BEGIN
  SELECT value->>'prefix' INTO v_prefix FROM public.billing_settings WHERE key = 'invoice';
  SELECT value->>'gstin' INTO v_gstin FROM public.billing_settings WHERE key = 'tax';
  SELECT value->>'terms' INTO v_terms FROM public.billing_settings WHERE key = 'invoice';

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
    p_line_items, v_gstin, p_notes, v_terms, now() + interval '30 days', now()
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 12. Automated subscription invoice generator function
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

-- 13. Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trg_auto_generate_invoice ON public.user_subscriptions;

CREATE TRIGGER trg_auto_generate_invoice
  AFTER INSERT OR UPDATE OF status ON public.user_subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION public.auto_generate_invoice();
