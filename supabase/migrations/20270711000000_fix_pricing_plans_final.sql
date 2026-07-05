-- ============================================================
-- DEFINITIVE PRICING PLANS FIX
-- Free = ₹0 | Pro = ₹199/mo | Career Pro = ₹499/mo | Enterprise = Custom
-- Run this after all previous migrations to correct stale DB data.
-- ============================================================

-- Step 1: Deactivate any plans with old/wrong names so they don't show up
UPDATE pricing_plans SET active = false
WHERE name IN ('Starter', 'Team', 'Basic', 'Growth')
  AND name NOT IN ('Free', 'Pro', 'Career Pro', 'Enterprise');

-- Step 2: Rename 'Starter' → 'Free' if still present
UPDATE pricing_plans SET
  name        = 'Free',
  price_label = 'Free',
  price_inr   = 0,
  yearly_price = null,
  interval    = null,
  ai_credits_monthly = 500,
  max_courses = 3,
  description = '1–3 free courses, limited daily AI credits, community access.',
  features    = '["1–3 free courses","Limited daily AI credits","Community access","Basic progress tracking","Basic certificates","Email support","500 AI credits / month","Course notes & summaries","Basic quiz access"]'::jsonb,
  cta_label   = 'Get started free',
  cta_to      = '/signup',
  highlighted = false,
  order_index = 10,
  active      = true,
  badge       = null,
  color       = '#2563EB',
  cashfree_plan_id = null,
  updated_at  = now()
WHERE name = 'Starter';

-- Step 3: Fix Pro → ₹199/mo (correct name match, update price)
UPDATE pricing_plans SET
  name        = 'Pro',
  price_label = '₹199',
  price_inr   = 199,
  yearly_price = 1990,
  interval    = 'month',
  ai_credits_monthly = 10000,
  max_courses = -1,
  description = 'Casual learners — full course library, higher AI credit cap, notes & flashcards.',
  features    = '["Full course library","Higher AI credit cap","Notes & flashcards","Unlimited courses","Advanced AI tutor","All certificates","Download resources","Community challenges","Priority support","10,000 AI credits / month"]'::jsonb,
  cta_label   = 'Start Pro',
  cta_to      = '/signup?plan=pro',
  highlighted = true,
  order_index = 20,
  active      = true,
  badge       = 'Most Popular',
  color       = '#6366F1',
  cashfree_plan_id = null,
  updated_at  = now()
WHERE name = 'Pro';

-- Step 4: Fix Career Pro → ₹499/mo
UPDATE pricing_plans SET
  name        = 'Career Pro',
  price_label = '₹499',
  price_inr   = 499,
  yearly_price = 4990,
  interval    = 'month',
  ai_credits_monthly = 25000,
  max_courses = -1,
  description = 'Job-seekers — everything in Pro + Resume / ATS / Interview Prep / Career Roadmap, verified certificates included.',
  features    = '["Everything in Pro","Resume Builder","ATS Checker","Interview Prep","Career Roadmap","Verified certificates included","Custom certificate templates","Portfolio Builder","LinkedIn Optimizer","Internship Tracker","Career Analytics","Interview recording & playback","Advanced ATS optimization","Skill gap analysis","Project recommendations","Lifetime certificate access","Priority support","25,000 AI credits / month"]'::jsonb,
  cta_label   = 'Become Job Ready',
  cta_to      = '/signup?plan=career-pro',
  highlighted = false,
  order_index = 30,
  active      = true,
  badge       = 'Best Value',
  color       = '#8B5CF6',
  cashfree_plan_id = null,
  updated_at  = now()
WHERE name IN ('Career Pro', 'Career Pro');

-- Step 5: Rename 'Team' → 'Enterprise' (Custom pricing)
UPDATE pricing_plans SET
  name        = 'Enterprise',
  price_label = 'Custom',
  price_inr   = 0,
  yearly_price = null,
  interval    = null,
  ai_credits_monthly = 0,
  max_courses = -1,
  description = 'Colleges & companies — seats, SSO, admin reporting, custom branding.',
  features    = '["Everything in Career Pro","Seats","SSO + RBAC","Admin reporting","Custom branding","Admin dashboard","Team management","Bulk enrollment","Attendance tracking","Batch management","White label","Custom domain","Department analytics","Certificate automation","API access","Dedicated support","Custom AI credits"]'::jsonb,
  cta_label   = 'Book Demo',
  cta_to      = '/contact',
  highlighted = false,
  order_index = 40,
  active      = true,
  badge       = null,
  color       = '#7c3aed',
  cashfree_plan_id = null,
  updated_at  = now()
WHERE name = 'Team';

-- Step 6: Ensure Enterprise is up-to-date if already renamed
UPDATE pricing_plans SET
  price_label = 'Custom',
  price_inr   = 0,
  yearly_price = null,
  interval    = null,
  ai_credits_monthly = 0,
  description = 'Colleges & companies — seats, SSO, admin reporting, custom branding.',
  features    = '["Everything in Career Pro","Seats","SSO + RBAC","Admin reporting","Custom branding","Admin dashboard","Team management","Bulk enrollment","Attendance tracking","Batch management","White label","Custom domain","Department analytics","Certificate automation","API access","Dedicated support","Custom AI credits"]'::jsonb,
  order_index = 40,
  active      = true,
  badge       = null,
  color       = '#7c3aed',
  updated_at  = now()
WHERE name = 'Enterprise';

-- Step 7: Insert any missing plans that don't exist yet (idempotent via ON CONFLICT DO NOTHING)
INSERT INTO pricing_plans (
  name, price_label, price_inr, yearly_price, interval,
  ai_credits_monthly, max_courses, description, features,
  cta_label, cta_to, highlighted, order_index, active, badge, color, cashfree_plan_id
)
SELECT 'Free','Free',0,null,null,500,3,
  '1–3 free courses, limited daily AI credits, community access.',
  '["1–3 free courses","Limited daily AI credits","Community access","Basic progress tracking","Basic certificates","Email support","500 AI credits / month","Course notes & summaries","Basic quiz access"]'::jsonb,
  'Get started free','/signup',false,10,true,null,'#2563EB',null
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Free');

INSERT INTO pricing_plans (
  name, price_label, price_inr, yearly_price, interval,
  ai_credits_monthly, max_courses, description, features,
  cta_label, cta_to, highlighted, order_index, active, badge, color, cashfree_plan_id
)
SELECT 'Pro','₹199',199,1990,'month',10000,-1,
  'Casual learners — full course library, higher AI credit cap, notes & flashcards.',
  '["Full course library","Higher AI credit cap","Notes & flashcards","Unlimited courses","Advanced AI tutor","All certificates","Download resources","Community challenges","Priority support","10,000 AI credits / month"]'::jsonb,
  'Start Pro','/signup?plan=pro',true,20,true,'Most Popular','#6366F1',null
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Pro');

INSERT INTO pricing_plans (
  name, price_label, price_inr, yearly_price, interval,
  ai_credits_monthly, max_courses, description, features,
  cta_label, cta_to, highlighted, order_index, active, badge, color, cashfree_plan_id
)
SELECT 'Career Pro','₹499',499,4990,'month',25000,-1,
  'Job-seekers — everything in Pro + Resume / ATS / Interview Prep / Career Roadmap, verified certificates included.',
  '["Everything in Pro","Resume Builder","ATS Checker","Interview Prep","Career Roadmap","Verified certificates included","Custom certificate templates","Portfolio Builder","LinkedIn Optimizer","Internship Tracker","Career Analytics","Interview recording & playback","Advanced ATS optimization","Skill gap analysis","Project recommendations","Lifetime certificate access","Priority support","25,000 AI credits / month"]'::jsonb,
  'Become Job Ready','/signup?plan=career-pro',false,30,true,'Best Value','#8B5CF6',null
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Career Pro');

INSERT INTO pricing_plans (
  name, price_label, price_inr, yearly_price, interval,
  ai_credits_monthly, max_courses, description, features,
  cta_label, cta_to, highlighted, order_index, active, badge, color, cashfree_plan_id
)
SELECT 'Enterprise','Custom',0,null,null,0,-1,
  'Colleges & companies — seats, SSO, admin reporting, custom branding.',
  '["Everything in Career Pro","Seats","SSO + RBAC","Admin reporting","Custom branding","Admin dashboard","Team management","Bulk enrollment","Attendance tracking","Batch management","White label","Custom domain","Department analytics","Certificate automation","API access","Dedicated support","Custom AI credits"]'::jsonb,
  'Book Demo','/contact',false,40,true,null,'#7c3aed',null
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Enterprise');
