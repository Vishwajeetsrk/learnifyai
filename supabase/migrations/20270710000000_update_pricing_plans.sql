-- Update pricing_plans: sync with correct pricing structure
-- Pro = ₹199/mo, ₹1,990/yr | Career Pro = ₹499/mo, ₹4,990/yr | Team → Enterprise (Custom)

-- Update Pro to ₹199/mo, basic features
UPDATE pricing_plans SET
  price_label = '₹199',
  price_inr = 199,
  yearly_price = 1990,
  description = 'For casual learners who want unlimited access to courses and AI tools.',
  features = '["Unlimited courses", "Advanced AI tutor", "All certificates", "Course notes & flashcards", "Download resources", "Community challenges", "Priority support", "10,000 AI credits/month"]'::jsonb,
  order_index = 20
WHERE name = 'Pro';

-- Update Career Pro to ₹499/mo, ₹4,990/yr
UPDATE pricing_plans SET
  price_label = '₹499',
  price_inr = 499,
  yearly_price = 4990,
  description = 'Complete career toolkit for job seekers and growth-minded professionals.',
  features = '["Everything in Pro", "Custom certificate templates", "Portfolio Builder", "LinkedIn Optimizer", "Internship Tracker", "Career Analytics", "Interview recording & playback", "Advanced ATS optimization", "Skill gap analysis", "Project recommendations", "Lifetime certificate access", "Priority support", "25,000 AI credits/month"]'::jsonb,
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
  description = 'For colleges, companies, and organizations scaling learning.',
  features = '["Everything in Career Pro", "Admin dashboard", "Team management", "Bulk enrollment", "Attendance tracking", "Batch management", "SSO + RBAC", "White label", "Custom domain", "Department analytics", "Certificate automation", "API access", "Dedicated support"]'::jsonb
WHERE name = 'Team';
