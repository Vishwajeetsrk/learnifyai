-- 20280103000000_sync_razorpay_live_plans.sql
-- Synchronize exact live Razorpay plan IDs for all active tiers

-- 1. Ensure columns exist
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS razorpay_plan_id text;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS razorpay_yearly_plan_id text;

-- 2. Update Student (Monthly: ₹159, Yearly: ₹1,336)
UPDATE public.pricing_plans
SET
  price_inr = 159,
  yearly_price = 1336,
  razorpay_plan_id = 'plan_TnRlxoB15Y7rzj',
  razorpay_yearly_plan_id = 'plan_TnT1U0Bc7TuM0k',
  updated_at = now()
WHERE name = 'Student';

-- 3. Update Pro (Monthly: ₹199, Yearly: ₹1,990)
UPDATE public.pricing_plans
SET
  price_inr = 199,
  yearly_price = 1990,
  razorpay_plan_id = 'plan_TnT1E5yxst2vIS',
  razorpay_yearly_plan_id = 'plan_TmFuEmOIJyRuq0',
  updated_at = now()
WHERE name = 'Pro';

-- 4. Update Career Pro (Monthly: ₹499, Yearly: ₹4,990)
UPDATE public.pricing_plans
SET
  price_inr = 499,
  yearly_price = 4990,
  razorpay_plan_id = 'plan_TnT1ElD01xUG7u',
  razorpay_yearly_plan_id = 'plan_TnT1FLynSBE9ZL',
  updated_at = now()
WHERE name = 'Career Pro';
