-- Org branding for Team plan / admin users
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS org_name text,
  ADD COLUMN IF NOT EXISTS org_logo_url text,
  ADD COLUMN IF NOT EXISTS brand_color text DEFAULT '#7c3aed',
  ADD COLUMN IF NOT EXISTS invoice_company_name text,
  ADD COLUMN IF NOT EXISTS invoice_legal_name text,
  ADD COLUMN IF NOT EXISTS invoice_gstin text,
  ADD COLUMN IF NOT EXISTS invoice_prefix text DEFAULT 'INV',
  ADD COLUMN IF NOT EXISTS invoice_footer text,
  ADD COLUMN IF NOT EXISTS invoice_logo_url text,
  ADD COLUMN IF NOT EXISTS invoice_contact text;
