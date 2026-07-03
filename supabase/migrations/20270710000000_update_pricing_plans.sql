-- Update pricing_plans: sync with monetization architecture
-- Free = ₹0 (Acquisition) | Pro = ₹199/mo (Casual learners) | Career Pro = ₹499/mo (Job-seekers) | Enterprise = Custom

-- Update Free plan: acquisition
UPDATE pricing_plans SET
  name = 'Free',
  price_label = 'Free',
  price_inr = 0,
  yearly_price = null,
  interval = null,
  ai_credits_monthly = 500,
  max_courses = 3,
  description = '1–3 free courses, limited daily AI credits, community access.',
  features = '["1–3 free courses", "Limited daily AI credits", "Community access", "Basic progress tracking", "Basic certificates", "Email support", "500 AI credits/month", "Course notes & summaries", "Basic quiz access"]'::jsonb,
  order_index = 10
WHERE name = 'Starter';

-- Update Pro to ₹199/mo, casual learner features
UPDATE pricing_plans SET
  name = 'Pro',
  price_label = '₹199',
  price_inr = 199,
  yearly_price = 1990,
  interval = 'month',
  ai_credits_monthly = 10000,
  max_courses = -1,
  description = 'Casual learners — full course library, higher AI credit cap, notes & flashcards.',
  features = '["Full course library", "Higher AI credit cap", "Notes & flashcards", "Unlimited courses", "Advanced AI tutor", "All certificates", "Download resources", "Community challenges", "Priority support", "10,000 AI credits/month"]'::jsonb,
  order_index = 20,
  badge = 'Most Popular',
  color = '#6366F1'
WHERE name = 'Pro';

-- Update Career Pro to ₹499/mo, job-seeker features
UPDATE pricing_plans SET
  name = 'Career Pro',
  price_label = '₹499',
  price_inr = 499,
  yearly_price = 4990,
  interval = 'month',
  ai_credits_monthly = 25000,
  max_courses = -1,
  badge = 'Best Value',
  color = '#8B5CF6',
  description = 'Job-seekers — everything in Pro + Resume / ATS / Interview Prep / Career Roadmap, verified certificates included.',
  features = '["Everything in Pro", "Resume Builder", "ATS Checker", "Interview Prep", "Career Roadmap", "Verified certificates included", "Custom certificate templates", "Portfolio Builder", "LinkedIn Optimizer", "Internship Tracker", "Career Analytics", "Interview recording & playback", "Advanced ATS optimization", "Skill gap analysis", "Project recommendations", "Lifetime certificate access", "Priority support", "25,000 AI credits/month"]'::jsonb,
  order_index = 30
WHERE name = 'Career Pro';

-- Rename Team → Enterprise, set to Custom pricing
UPDATE pricing_plans SET
  name = 'Enterprise',
  price_label = 'Custom',
  price_inr = 0,
  yearly_price = null,
  interval = null,
  ai_credits_monthly = 0,
  order_index = 40,
  badge = null,
  description = 'Colleges & companies — seats, SSO, admin reporting, custom branding.',
  features = '["Everything in Career Pro", "Seats", "SSO + RBAC", "Admin reporting", "Custom branding", "Admin dashboard", "Team management", "Bulk enrollment", "Attendance tracking", "Batch management", "White label", "Custom domain", "Department analytics", "Certificate automation", "API access", "Dedicated support"]'::jsonb
WHERE name = 'Team';
