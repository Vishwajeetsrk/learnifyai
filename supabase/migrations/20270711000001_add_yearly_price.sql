-- Add yearly_price column to pricing_plans (missing from original schema)
ALTER TABLE public.pricing_plans
  ADD COLUMN IF NOT EXISTS yearly_price numeric DEFAULT null;
