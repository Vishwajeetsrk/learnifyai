/**
 * Learnify AI — Canonical Source of Truth
 * 
 * Centralized business values, plan definitions, pricing, tax defaults,
 * refund rules, payment provider rankings, and legal policy metadata.
 * No UI component or backend action should hardcode these values independently.
 */

export interface CanonicalPlan {
  id: string;
  name: "Free" | "Student" | "Pro" | "Career Pro" | "Enterprise";
  tagline: string;
  description: string;
  price_inr: number;
  price_label: string;
  billing_interval: "month" | "year" | null;
  yearly_price: number | null;
  ai_credits_monthly: number;
  highlighted: boolean;
  badge: string | null;
  color: string;
  cta_label: string;
  cta_to: string;
  features: string[];
  max_courses: number; // -1 for unlimited
  is_custom_pricing?: boolean;
}

export const CANONICAL_BRAND = {
  name: "Learnify AI",
  legal_name: "Learnify AI", // Not Pvt Ltd/LLP unless configured by owner
  domain: "https://www.learnifyai.in",
  support_email: "support.learnifyai@gmail.com",
  careers_email: "support.learnifyai@gmail.com",
  privacy_email: "support.learnifyai@gmail.com",
  grievance_email: "support.learnifyai@gmail.com",
  app_url: "https://www.learnifyai.in",
  logo_url: "/logo.png",
  currency: "INR",
  currency_symbol: "₹",
} as const;

export const CANONICAL_PLANS: Record<string, CanonicalPlan> = {
  free: {
    id: "canonical-free",
    name: "Free",
    tagline: "Essential learning tools for curious minds",
    description: "Access all free courses, core AI learning tools, and community discussions.",
    price_inr: 0,
    price_label: "Free",
    billing_interval: null,
    yearly_price: null,
    ai_credits_monthly: 100, // Invariant: 100 AI credits/month
    highlighted: false,
    badge: null,
    color: "#2563EB",
    cta_label: "Get Started Free",
    cta_to: "/signup",
    max_courses: 3,
    features: [
      "Access to all Free courses",
      "100 AI credits / month",
      "Community & study group access",
      "Interactive code playgrounds",
      "Basic progress & quiz tracking",
      "Course notes & lesson summaries",
      "Email support",
    ],
  },
  student: {
    id: "canonical-student",
    name: "Student",
    tagline: "Special academic benefits for verified learners",
    description: "Verified college students receive 20% discount on Pro or Career Pro subscriptions.",
    price_inr: 159, // Calculated as ~20% off Pro (₹199 * 0.8)
    price_label: "₹159",
    billing_interval: "month",
    yearly_price: null,
    ai_credits_monthly: 10000,
    highlighted: false,
    badge: "Student Benefit",
    color: "#10B981",
    cta_label: "Verify Student Status",
    cta_to: "/verify-student",
    max_courses: -1,
    features: [
      "20% academic discount on all paid plans",
      "Full course library access",
      "10,000 AI credits / month with Pro tier",
      "Verified course completion certificates",
      "Resume Builder & ATS Checker access",
      "Campus peer groups & hackathons",
      "Priority student support",
    ],
  },
  pro: {
    id: "canonical-pro",
    name: "Pro",
    tagline: "For dedicated learners seeking continuous mastery",
    description: "Full course library, advanced AI tutoring, certificate generation, and core career tools.",
    price_inr: 199,
    price_label: "₹199",
    billing_interval: "month",
    yearly_price: 1990, // When yearly is supported
    ai_credits_monthly: 10000,
    highlighted: true,
    badge: "Most Popular",
    color: "#6366F1",
    cta_label: "Start Pro",
    cta_to: "/signup?plan=pro",
    max_courses: -1,
    features: [
      "Full course library (all current & future courses)",
      "10,000 AI credits / month",
      "Advanced AI tutor & doubt solver",
      "Unlimited certificate issuance with QR verification",
      "Interactive DOM Blueprints & code sandboxes",
      "Basic Resume Builder & ATS Checker",
      "Downloadable learning resources & code snippets",
      "Priority customer support",
    ],
  },
  career_pro: {
    id: "canonical-career-pro",
    name: "Career Pro",
    tagline: "Complete career acceleration & job readiness suite",
    description: "Everything in Pro plus 11-in-1 Career Studio: mock interviews, portfolio, LinkedIn optimizer & 25,000 AI credits.",
    price_inr: 499,
    price_label: "₹499",
    billing_interval: "month",
    yearly_price: 4990, // When yearly is supported
    ai_credits_monthly: 25000,
    highlighted: false,
    badge: "Best Value",
    color: "#8B5CF6",
    cta_label: "Become Job Ready",
    cta_to: "/signup?plan=career-pro",
    max_courses: -1,
    features: [
      "Everything in Pro included",
      "25,000 AI credits / month",
      "11-in-1 Career Studio suite",
      "AI Mock Interview Simulator with recording & feedback",
      "Full Resume Builder with LaTeX/PDF export & ATS Scoring",
      "Portfolio Builder & LinkedIn Profile Optimizer",
      "Skill gap analysis & customized project roadmaps",
      "Template Mastery Studio & premium project designs",
      "Internship & job application tracker",
      "VIP 1-on-1 priority support",
    ],
  },
  enterprise: {
    id: "canonical-enterprise",
    name: "Enterprise",
    tagline: "Custom training for universities, teams & institutions",
    description: "Dedicated seats, single sign-on (SSO), LMS integration, team analytics, and custom branding.",
    price_inr: 0,
    price_label: "Custom",
    billing_interval: null,
    yearly_price: null,
    ai_credits_monthly: 0,
    highlighted: false,
    badge: null,
    color: "#7C3AED",
    cta_label: "Contact Sales",
    cta_to: "/contact?inquiry=enterprise",
    is_custom_pricing: true,
    max_courses: -1,
    features: [
      "Custom seat volume & bulk student enrollment",
      "SSO (SAML, Okta, Google Workspace) & RBAC",
      "Institutional admin reporting & attendance tracking",
      "Custom white-label branding & custom domain",
      "Department-level analytics & completion reports",
      "Automated bulk certificate issuance via API",
      "Custom AI credit pool & model routing",
      "Dedicated account manager & SLA guarantee",
    ],
  },
};

export const CANONICAL_PAYMENT_PROVIDERS = {
  PRIMARY: "razorpay",
  SECONDARY: "cashfree",
} as const;

export const DEFAULT_TAX_CONFIG = {
  tax_enabled: false,
  tax_registered: false,
  gstin: null as string | null,
  tax_rate: 0,
  tax_label: "GST",
  cgst_rate: 0,
  sgst_rate: 0,
  igst_rate: 0,
  invoice_mode: "receipt", // "receipt" | "tax_invoice"
} as const;

export const DEFAULT_REFUND_CONFIG = {
  routine_refunds_enabled: false, // Invariant: No routine change-of-mind refunds
  allow_exception_requests: true,
  exception_window_days: 7,
  max_ai_credits_consumed: 100,
  max_course_progress_percent: 20,
} as const;

export const AI_OPERATION_COSTS: Record<string, { credits: number; description: string }> = {
  simple_chat: { credits: 1, description: "General AI conversation message" },
  advanced_chat: { credits: 2, description: "High-reasoning / complex context chat" },
  tutor: { credits: 2, description: "AI tutor lesson query & interactive hint" },
  quiz_generation: { credits: 3, description: "Generate dynamic quiz from lesson" },
  course_summary: { credits: 2, description: "Synthesize module or video notes" },
  resume_generation: { credits: 5, description: "AI resume tailoring or section rewrite" },
  ats_analysis: { credits: 5, description: "Full ATS compatibility & keyword scan" },
  mock_interview: { credits: 8, description: "Live AI behavioral/technical interview question & feedback" },
  document_analysis: { credits: 4, description: "PDF or syllabus deep parsing" },
  image_analysis: { credits: 4, description: "Diagram or visual learning question" },
};

export interface CanonicalLegalDoc {
  slug: string;
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  isMandatoryOnCheckout?: boolean;
}

export const CANONICAL_LEGAL_DOCS: CanonicalLegalDoc[] = [
  {
    slug: "terms",
    title: "Terms & Conditions",
    version: "2.1",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Rules, user responsibilities, account management, and governing law for using Learnify AI.",
    isMandatoryOnCheckout: true,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    version: "2.1",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "How Learnify AI collects, safeguards, and respects user data under Indian DPDP Act 2023.",
    isMandatoryOnCheckout: true,
  },
  {
    slug: "cancellation-refund",
    title: "Cancellation & Refund Policy",
    version: "3.0",
    effectiveDate: "2026-10-01",
    lastUpdated: "2026-10-01",
    summary:
      "No-refund policy for digital purchases with limited exceptions for failed payments, duplicate charges, delivery failures, and remedies required by law.",
    isMandatoryOnCheckout: true,
  },
  {
    slug: "digital-delivery",
    title: "Digital Delivery Policy",
    version: "2.0",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Immediate electronic fulfillment of digital subscriptions, courses, AI credits, and certificates.",
    isMandatoryOnCheckout: true,
  },
  {
    slug: "cookie-policy",
    title: "Cookie & Tracking Policy",
    version: "1.1",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Information on essential authentication cookies and session telemetry.",
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    version: "1.2",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Standards of conduct, platform security, and prohibited system misuse.",
  },
  {
    slug: "intellectual-property",
    title: "Intellectual Property Policy",
    version: "1.1",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Ownership of course materials, certificate rights, and user-generated code uploads.",
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    version: "1.2",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Mutual respect, academic honesty, and collaborative etiquette in discussion channels.",
  },
  {
    slug: "ai-disclaimer",
    title: "AI Use & AI Disclaimer",
    version: "1.1",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Advisory regarding probabilistic AI outputs, tutoring assistance, and verification recommendations.",
  },
  {
    slug: "grievance",
    title: "Grievance Redressal & Support",
    version: "1.2",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Designated support channels, ticket escalation, and dispute resolution timeframes.",
  },
  {
    slug: "student-parent-notice",
    title: "Student & Parent Notice",
    version: "1.1",
    effectiveDate: "2026-09-01",
    lastUpdated: "2026-09-25",
    summary: "Important information for collegiate learners, minor accounts, and guardian consent.",
  },
];
