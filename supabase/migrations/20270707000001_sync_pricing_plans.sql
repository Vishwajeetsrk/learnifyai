-- Fix pricing_plans: sync with frontend DEFAULT_TIERS
-- Pro = ₹199/mo, ₹1,999/yr | Career Pro = ₹399/mo, ₹3,999/yr | Team = ₹4,999/mo, ₹47,990/yr

DELETE FROM pricing_plans WHERE name IN ('Vishajeet', 'Vishwajeet') OR price_label IN ('Unfortunately', 'Planned');

-- Upsert Starter
INSERT INTO pricing_plans (
  id, name, price_label, description, features,
  cta_label, cta_to, highlighted, order_index, active,
  price_inr, interval, ai_credits_monthly, max_courses,
  badge, color, cashfree_plan_id, yearly_price
) VALUES (
  '4bed4e36-c085-4223-a654-58c9f042fbcc',
  'Starter', 'Free',
  'Everything you need to start your learning journey.',
  '["500 AI credits/mo", "3 free courses", "Basic AI tutor", "Community access", "Progress tracking", "Basic certificates", "Email support", "Course notes & summaries", "Basic quiz access"]'::jsonb,
  'Get started free', '/signup', false, 10, true,
  0, null, 500, 3, null, '#2563EB', null, null
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, price_label = EXCLUDED.price_label, description = EXCLUDED.description,
  features = EXCLUDED.features, price_inr = EXCLUDED.price_inr, interval = EXCLUDED.interval,
  ai_credits_monthly = EXCLUDED.ai_credits_monthly, max_courses = EXCLUDED.max_courses,
  badge = EXCLUDED.badge, color = EXCLUDED.color, yearly_price = EXCLUDED.yearly_price;

-- Upsert Pro (₹199/mo, ₹1,999/yr)
INSERT INTO pricing_plans (
  id, name, price_label, description, features,
  cta_label, cta_to, highlighted, order_index, active,
  price_inr, interval, ai_credits_monthly, max_courses,
  badge, color, cashfree_plan_id, yearly_price
) VALUES (
  'a31a32f2-4d6d-41d4-9a8c-a06d1041a47a',
  'Pro', '₹199',
  'For serious learners and creators who want unlimited access.',
  '["Unlimited courses", "Advanced AI tutor", "10,000 AI credits/month", "All certificates", "Resume Builder", "ATS Checker", "AI Career Coach", "Mock Interviews", "Learning Roadmaps", "Download resources", "Community challenges", "Priority support"]'::jsonb,
  'Start Pro', '/signup', true, 20, true,
  199, 'month', 10000, -1, 'Most Popular', '#6366F1', null, 1999
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, price_label = EXCLUDED.price_label, description = EXCLUDED.description,
  features = EXCLUDED.features, price_inr = EXCLUDED.price_inr, interval = EXCLUDED.interval,
  ai_credits_monthly = EXCLUDED.ai_credits_monthly, max_courses = EXCLUDED.max_courses,
  badge = EXCLUDED.badge, color = EXCLUDED.color, yearly_price = EXCLUDED.yearly_price;

-- Upsert Career Pro (₹399/mo, ₹3,999/yr) — NEW plan
INSERT INTO pricing_plans (
  id, name, price_label, description, features,
  cta_label, cta_to, highlighted, order_index, active,
  price_inr, interval, ai_credits_monthly, max_courses,
  badge, color, cashfree_plan_id, yearly_price
) VALUES (
  'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
  'Career Pro', '₹399',
  'Complete career toolkit for job seekers and professionals.',
  '["Everything in Pro", "25,000 AI credits/month", "Custom certificate templates", "Portfolio Builder", "LinkedIn Optimizer", "Internship Tracker", "Career Analytics", "Interview recording & playback", "Advanced ATS optimization", "Skill gap analysis", "Project recommendations", "Lifetime certificate access", "Priority support"]'::jsonb,
  'Become Job Ready', '/signup', false, 25, true,
  399, 'month', 25000, -1, 'Best Value', '#8B5CF6', null, 3999
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, price_label = EXCLUDED.price_label, description = EXCLUDED.description,
  features = EXCLUDED.features, price_inr = EXCLUDED.price_inr, interval = EXCLUDED.interval,
  ai_credits_monthly = EXCLUDED.ai_credits_monthly, max_courses = EXCLUDED.max_courses,
  badge = EXCLUDED.badge, color = EXCLUDED.color, yearly_price = EXCLUDED.yearly_price;

-- Upsert Team (₹4,999/mo, ₹47,990/yr)
INSERT INTO pricing_plans (
  id, name, price_label, description, features,
  cta_label, cta_to, highlighted, order_index, active,
  price_inr, interval, ai_credits_monthly, max_courses,
  badge, color, cashfree_plan_id, yearly_price
) VALUES (
  'a2f8a0cf-f819-4414-a085-1195d13755ca',
  'Team', '₹4,999',
  'For cohorts, schools, and companies scaling learning.',
  '["Everything in Career Pro", "50,000 AI credits/month", "Admin dashboard", "Team management", "Bulk enrollment", "Attendance tracking", "Batch management", "SSO + RBAC", "White label", "Custom domain", "Department analytics", "Certificate automation", "API access", "Dedicated support"]'::jsonb,
  'Book Demo', '/contact', false, 30, true,
  4999, 'month', 50000, -1, null, '#7c3aed', null, 47990
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, price_label = EXCLUDED.price_label, description = EXCLUDED.description,
  features = EXCLUDED.features, price_inr = EXCLUDED.price_inr, interval = EXCLUDED.interval,
  ai_credits_monthly = EXCLUDED.ai_credits_monthly, max_courses = EXCLUDED.max_courses,
  badge = EXCLUDED.badge, color = EXCLUDED.color, yearly_price = EXCLUDED.yearly_price;
