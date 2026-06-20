-- Seed pricing plans if table is empty
-- First ensure the table exists (it should already be there)

INSERT INTO pricing_plans (id, name, price_label, description, features, cta_label, cta_to, highlighted, price_inr, interval, badge, color, ai_credits_monthly, max_courses, cashfree_plan_id, active, order_index)
VALUES
  (
    gen_random_uuid(),
    'Free',
    '₹0 / forever',
    'Everything you need to start your learning journey.',
    '["5 AI tutor sessions/month","Access to free courses","Code playground (5 languages)","Community access","Basic profile & achievements","Verified certificates"]',
    'Get started free',
    '/signup',
    false,
    0,
    NULL,
    NULL,
    '#6366f1',
    50,
    3,
    NULL,
    true,
    1
  ),
  (
    gen_random_uuid(),
    'Pro',
    '₹499 / month',
    'Unlimited AI, all courses, and priority support.',
    '["Unlimited AI tutor sessions","All courses & new releases","Code playground (25+ languages)","AI Quiz & Smart Notes generator","Career coach & skill graph","Priority support","PDF certificates with QR verify","Creator studio (1 course)","50,000 AI credits/month"]',
    'Start Pro',
    '/signup',
    true,
    499,
    'month',
    'Most Popular',
    '#7c3aed',
    50000,
    -1,
    NULL,
    true,
    2
  ),
  (
    gen_random_uuid(),
    'Team',
    '₹1,999 / month',
    'For power learners, creators, and growing teams.',
    '["Everything in Pro","Unlimited courses & cohorts","Full creator studio (unlimited courses)","Team analytics dashboard","Custom branding on certificates","Dedicated account manager","API access","500,000 AI credits/month","White-label certificates"]',
    'Start Team',
    '/signup',
    false,
    1999,
    'month',
    'Best Value',
    '#0891b2',
    500000,
    -1,
    NULL,
    true,
    3
  )
ON CONFLICT DO NOTHING;
