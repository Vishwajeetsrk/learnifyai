-- Add is_default column to canva_templates and ensure a system default exists

-- 1. Add is_default column
ALTER TABLE public.canva_templates
  ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;

-- 2. Add org_logo_url column if not present (used by cert renderer)
ALTER TABLE public.canva_templates
  ADD COLUMN IF NOT EXISTS org_logo_url text;

-- 3. Ensure only one default at a time via partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_canva_templates_single_default
  ON public.canva_templates (is_default)
  WHERE is_default = true;

-- 4. Function to set a template as default (unsets previous)
CREATE OR REPLACE FUNCTION public.set_default_cert_template(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.canva_templates SET is_default = false WHERE is_default = true;
  UPDATE public.canva_templates SET is_default = true WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_default_cert_template(uuid) TO authenticated;
