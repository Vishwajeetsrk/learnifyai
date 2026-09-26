import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { InteractiveFolder } from "@/components/interactive/InteractiveFolder";
import rishabhAvatar from "@/assets/avatars/Rishabh-Sharma.png";
import anjaliAvatar from "@/assets/avatars/Anjali-Verma.png";
import priyaAvatar from "@/assets/avatars/Priya-Kapoor.png";
import vikramAvatar from "@/assets/avatars/Vikram-Singh.png";
import { InteractiveDemoCards } from "@/components/interactive/InteractiveDemoCards";
import { LaunchOfferBanner } from "@/components/interactive/LaunchOfferBanner";
import { ROISavingsSection } from "@/components/interactive/ROISavingsSection";
import { CompetitorComparison } from "@/components/interactive/CompetitorComparison";
import { StudentJourney } from "@/components/interactive/StudentJourney";
import { MagnificationDock } from "@/components/interactive/MagnificationDock";
import { PricingComparisonTable } from "@/components/interactive/PricingComparisonTable";
import { SavingsCalculator } from "@/components/interactive/SavingsCalculator";
import { usePublicSection } from "@/hooks/use-wcms-public";
import {
  Check,
  Loader2,
  Zap,
  Users,
  Rocket,
  ArrowRight,
  Sparkles,
  Star,
  Crown,
  Shield,
  CreditCard,
  ChevronDown,
  Play,
  Award,
  TrendingUp,
  Quote,
  GraduationCap,
  IndianRupee,
  Lock,
  Headphones,
  BarChart3,
  Briefcase,
  FileText,
  Mic,
  Map,
  Search,
  X,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import {
  initiateCheckout,
  verifyClientPayment,
  cancelUserSubscription,
} from "@/lib/payments/payment.functions";
import { ContextualLegalNotice } from "@/components/legal/ContextualLegalNotice";
import { TestimonialsMarquee } from "@/components/ui/testimonials-with-marquee";

export const Route = createFileRoute("/pricing")({
  validateSearch: (s: Record<string, unknown>): { subscribe?: string; coupon?: string } => ({
    subscribe: s.subscribe as string | undefined,
    coupon: s.coupon as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pricing — Learnify AI" },
      {
        name: "description",
        content:
          "AI-Powered Learning, Career Growth, Certificates, Resume Building, Interview Preparation and Career Coaching — All in One Platform.",
      },
      { property: "og:title", content: "Pricing — Learnify AI" },
      {
        property: "og:description",
        content:
          "Simple, transparent pricing. Start free, upgrade when you're ready. 10,000+ learners trust Learnify AI.",
      },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  id: string;
  name: string;
  price_label: string;
  description: string | null;
  features: string[];
  cta_label: string;
  cta_to: string;
  highlighted: boolean;
  price_inr: number;
  interval: string | null;
  badge: string | null;
  color: string | null;
  ai_credits_monthly: number;
  max_courses: number;
  cashfree_plan_id: string | null;
  yearly_price?: number;
  is_custom_pricing?: boolean;
};

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PLAN_ICONS = [Zap, GraduationCap, Rocket, Briefcase, Users];

const DEFAULT_TIERS: Plan[] = [
  {
    id: "default-free",
    name: "Free",
    price_label: "Free",
    description: "Access all free courses, core AI learning tools, and community discussions.",
    features: [
      "Access to all Free courses",
      "100 AI credits / month",
      "Community & study group access",
      "Interactive code playgrounds",
      "Basic progress & quiz tracking",
      "Course notes & lesson summaries",
      "Email support",
    ],
    cta_label: "Get Started Free",
    cta_to: "/signup",
    highlighted: false,
    price_inr: 0,
    interval: null,
    badge: null,
    color: "#2563EB",
    ai_credits_monthly: 100,
    max_courses: 3,
    cashfree_plan_id: null,
  },
  {
    id: "default-student",
    name: "Student",
    price_label: "₹159",
    description: "Exclusive academic pricing for verified college and university students.",
    features: [
      "Access to all Free & Student courses",
      "10,000 AI credits / month",
      "Academic verification badge",
      "AI Tutor & dynamic study summaries",
      "Resume Builder with student templates",
      "ATS Compatibility scan",
      "Practice Mock Interviews",
      "Verified course completion certificates",
      "Priority email support",
    ],
    cta_label: "Verify & Subscribe",
    cta_to: "/verify-student",
    highlighted: false,
    price_inr: 159,
    interval: "month",
    badge: "Academic",
    color: "#3B82F6",
    ai_credits_monthly: 10000,
    max_courses: -1,
    cashfree_plan_id: null,
  },
  {
    id: "default-pro",
    name: "Pro",
    price_label: "₹199",
    description: "For serious learners who want to master modern tech stacks and core career tools.",
    features: [
      "Access to all Standard courses & paths",
      "10,000 AI credits / month",
      "Interactive DOM Blueprints & labs",
      "24/7 AI Tutor with code analysis",
      "Resume Builder & ATS Scoring",
      "AI Career Coach & Mock Interviews",
      "Verifiable digital certificates",
      "Community discussion & challenges",
      "Priority support",
    ],
    cta_label: "Start Pro",
    cta_to: "/signup?plan=pro",
    highlighted: true,
    price_inr: 199,
    interval: "month",
    badge: "Most Popular",
    color: "#6366F1",
    ai_credits_monthly: 10000,
    max_courses: -1,
    cashfree_plan_id: null,
  },
  {
    id: "default-career-pro",
    name: "Career Pro",
    price_label: "₹499",
    description: "Job-seekers — everything in Pro plus 11-in-1 Career Studio suite & 25,000 AI credits.",
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
    cta_label: "Become Job Ready",
    cta_to: "/signup?plan=career-pro",
    highlighted: false,
    price_inr: 499,
    interval: "month",
    badge: "Best Value",
    color: "#8B5CF6",
    ai_credits_monthly: 25000,
    max_courses: -1,
    cashfree_plan_id: null,
  },
  {
    id: "default-team",
    name: "Enterprise",
    price_label: "Custom",
    description: "Colleges & companies — seats, SSO, admin reporting, custom branding.",
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
    cta_label: "Contact Sales",
    cta_to: "/contact?inquiry=enterprise",
    highlighted: false,
    price_inr: 0,
    interval: null,
    badge: null,
    color: "#7c3aed",
    ai_credits_monthly: 0,
    max_courses: -1,
    is_custom_pricing: true,
    cashfree_plan_id: null,
  },
];

const WHY_UPGRADE = [
  {
    icon: Zap,
    title: "Learn Faster",
    desc: "AI Tutor Available 24/7",
    color: "#2563EB",
  },
  {
    icon: TrendingUp,
    title: "Improve Scores",
    desc: "Personalized Study Plans",
    color: "#6366F1",
  },
  {
    icon: Briefcase,
    title: "Become Job Ready",
    desc: "Resume + ATS + Interview Tools",
    color: "#8B5CF6",
  },
  {
    icon: Rocket,
    title: "Launch Career",
    desc: "Roadmaps + Projects + Internships",
    color: "#10B981",
  },
];

const TESTIMONIALS = [
  {
    name: "Rishabh Sharma",
    college: "Delhi University",
    role: "CS Student",
    rating: 5,
    review:
      "Learnify AI helped me create my resume and get interview ready. The AI tutor is amazing — it explained DSA concepts way better than my textbooks.",
    achievement: "Landed Internship at Microsoft",
    avatar: rishabhAvatar,
    linkedin: "https://linkedin.com/in/rishabh-sharma",
  },
  {
    name: "Anjali Verma",
    college: "IIT Bombay",
    role: "Placement Prep",
    rating: 5,
    review:
      "I went from zero coding confidence to cracking 3 company interviews. The mock interview feature is a game changer. Best investment I made.",
    achievement: "Got Placement at Google",
    avatar: anjaliAvatar,
    linkedin: "https://linkedin.com/in/anjali-verma",
  },
  {
    name: "Priya Kapoor",
    college: "SRM University",
    role: "Final Year Student",
    rating: 5,
    review:
      "I completed 3 certifications in one month and landed my first freelance project! The career roadmap helped me stay focused.",
    achievement: "Freelance Success — Earned ₹50K/mo",
    avatar: priyaAvatar,
    linkedin: "https://linkedin.com/in/priya-kapoor",
  },
  {
    name: "Vikram Singh",
    college: "NIT Trichy",
    role: "Career Switcher",
    rating: 5,
    review:
      "Switched from mechanical engineering to software development in 6 months. The career roadmap and mock interviews were exactly what I needed.",
    achievement: "Successfully Career Switched",
    avatar: vikramAvatar,
    linkedin: "https://linkedin.com/in/vikram-singh",
  },
];

const FAQ_CATEGORIES = ["Plans", "Billing", "Features", "Technical", "Students"] as const;

const FAQ_ITEMS: { q: string; a: string; category: string }[] = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! Upgrade or downgrade anytime. When you upgrade, you get immediate access. Downgrades take effect at the end of your billing cycle.",
    category: "Plans",
  },
  {
    q: "How do credits work?",
    a: "AI credits are used for tutoring, quiz generation, resume building, and career coaching. Credits refresh monthly. Unused credits don't roll over.",
    category: "Features",
  },
  {
    q: "What is your refund policy?",
    a: "Digital access and AI credits are provisioned immediately upon purchase. Routine refunds for change-of-mind purchases are not provided, but we review extraordinary issues (duplicate charges or system failure) via our fair exception review process.",
    category: "Billing",
  },
  {
    q: "Can colleges use Learnify?",
    a: "Yes! Our Enterprise plan is designed for coaching institutes, colleges, and companies. It includes admin dashboards, team management, bulk certificates, and SSO.",
    category: "Plans",
  },
  {
    q: "Is there a free tier?",
    a: "Yes! Our Free tier provides 100 AI credits monthly and access to free courses without requiring any payment method.",
    category: "Billing",
  },
  {
    q: "Can I download certificates?",
    a: "Yes! Pro and above plans include downloadable certificates in PDF format. You can share them directly on LinkedIn.",
    category: "Features",
  },
  {
    q: "Do certificates expire?",
    a: "No, your certificates never expire. They're permanently stored and verifiable via a unique link.",
    category: "Features",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes! Verified students receive academic pricing with 20% savings. Submit verification with your college email.",
    category: "Students",
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. Payments are processed securely through Razorpay (primary) and Cashfree (secondary), PCI-DSS certified payment gateways. We never store your card or UPI credentials.",
    category: "Billing",
  },
  {
    q: "What devices does Learnify work on?",
    a: "Learnify works on any device with a modern browser — desktop, tablet, and mobile. All features are fully responsive.",
    category: "Technical",
  },
];

const TRUST_ITEMS = [
  { icon: Lock, label: "Secure Payments", color: "#2563EB" },
  { icon: Shield, label: "Verified Protection", color: "#10B981" },
  { icon: Zap, label: "Instant Activation", color: "#F59E0B" },
  { icon: Headphones, label: "Human Support", color: "#8B5CF6" },
  { icon: IndianRupee, label: "Made For India", color: "#EC4899" },
  { icon: Shield, label: "SSL Secured", color: "#6366F1" },
];

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { subscribe, coupon } = useSearch({ from: "/pricing" });
  const { data: cmsHero } = usePublicSection("pricing-hero");
  const { data: cmsFaq } = usePublicSection("pricing-faq");
  const { data: cmsTestimonials } = usePublicSection("pricing-testimonials");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [origin, setOrigin] = useState("https://learnifyai.in");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [learnerCount, setLearnerCount] = useState(2134);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (coupon) {
      setCouponCode(coupon.toUpperCase());
    }
  }, [coupon]);

  const AVATAR_MAP: Record<string, string> = {
    "Rishabh Sharma": rishabhAvatar,
    "Anjali Verma": anjaliAvatar,
    "Priya Kapoor": priyaAvatar,
    "Vikram Singh": vikramAvatar,
  };

  const cmsFaqItems = cmsFaq?.content?.items ?? FAQ_ITEMS;
  const cmsFaqCategories = cmsFaq?.content?.categories ?? FAQ_CATEGORIES;
  const rawTestimonials = cmsTestimonials?.content?.items ?? TESTIMONIALS;
  const cmsTestimonialItems = useMemo(() => {
    return rawTestimonials.map((item: any) => ({
      ...item,
      avatar:
        AVATAR_MAP[item.name] ||
        (typeof item.avatar === "string" && item.avatar.startsWith("http") ? item.avatar : null) ||
        (typeof item.avatar === "string" && item.avatar.startsWith("data:") ? item.avatar : null) ||
        `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(item.name || "Student")}`,
    }));
  }, [rawTestimonials]);
  const cmsHeroContent = cmsHero?.content;

  const faqCategories = useMemo(() => {
    const cats = new Set<string>();
    cmsFaqItems.forEach((item: any) => (item.category ? cats.add(item.category) : null));
    return Array.from(cats);
  }, [cmsFaqItems]);
  const doInitiateCheckout = useServerFn(initiateCheckout);
  const doVerifyPayment = useServerFn(verifyClientPayment);
  const doCancel = useServerFn(cancelUserSubscription);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (subscribe === "ok") {
      toast.success("Subscription verified and active! Welcome to Learnify AI.");
      navigate({ to: "/pricing", search: { subscribe: undefined }, replace: true });
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    }
  }, [subscribe]);

  const {
    data: tiers,
    isLoading,
    error,
  } = useQuery<Plan[]>({
    queryKey: ["pricing-plans"],
    queryFn: async ({ signal }) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const { data, error } = await supabase
          .from("pricing_plans")
          .select("*")
          .eq("active", true)
          .order("order_index", { ascending: true });
        if (error) throw error;
        const dbPlans: Plan[] = ((data ?? []) as any[]).map((p) => ({
          ...p,
          features: Array.isArray(p.features) ? p.features : [],
          price_inr: Number(p.price_inr || 0),
          max_courses: Number(p.max_courses ?? -1),
          ai_credits_monthly: Number(p.ai_credits_monthly || 0),
          price_label: (p.price_label || "").replace(/\/mo(nth)?$/i, ""),
        })) as Plan[];
        return DEFAULT_TIERS.map((def) => {
          const match = dbPlans.find((db) => db.name.toLowerCase() === def.name.toLowerCase());
          return match
            ? {
              ...def,
              ...match,
              id: match.id,
              price_label: match.price_label || def.price_label,
              price_inr: typeof match.price_inr === "number" ? match.price_inr : def.price_inr,
              yearly_price:
                typeof match.yearly_price === "number" ? match.yearly_price : def.yearly_price,
              interval: match.interval || def.interval,
              features: def.features,
            }
            : def;
        });
      } finally {
        clearTimeout(timeout);
      }
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 120_000,
    gcTime: 300_000,
    placeholderData: DEFAULT_TIERS,
  });

  const currentSub = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setLoadingPlan(planId);
    try {
      const checkout = await doInitiateCheckout({
        data: {
          planId,
          provider: "razorpay",
          couponCode: couponCode.trim() || undefined,
          billingCycle,
        },
      });

      if (checkout.free) {
        toast.success("Free plan activated! 100 monthly AI credits ready.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
        return;
      }

      if (checkout.isEnterprise) {
        navigate({ to: "/contact", search: { inquiry: "enterprise" } as any });
        return;
      }

      if (checkout.provider === "razorpay" && checkout.keyId && checkout.orderId) {
        const scriptLoaded = await loadRazorpay();
        if (!scriptLoaded) {
          toast.error("Unable to load Razorpay payment SDK. Please refresh or try again.");
          return;
        }

        const options = {
          key: checkout.keyId,
          amount: Math.round(checkout.amount * 100),
          currency: "INR",
          name: "Learnify AI",
          description: `${checkout.notes?.planName || "Plan"} Subscription`,
          order_id: checkout.orderId,
          prefill: checkout.prefill,
          theme: { color: "#6366f1" },
          handler: async function (response: any) {
            try {
              setLoadingPlan(planId);
              // Server-side verification & atomic activation (Invariant 1, 2, 16)
              const verified = await doVerifyPayment({
                data: {
                  provider: "razorpay",
                  orderId: checkout.orderId!,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  planId,
                  billingCycle,
                  amountInr: checkout.amount,
                },
              });
              if (verified.success) {
                toast.success("Payment verified! Subscription active.");
                qc.invalidateQueries({ queryKey: ["my-subscription"] });
                navigate({ to: "/pricing", search: { subscribe: "ok" } as any });
              } else {
                toast.error(verified.message || "Payment verification incomplete.");
              }
            } catch (err: any) {
              toast.error(err?.message || "Failed to verify payment with server.");
            } finally {
              setLoadingPlan(null);
            }
          },
          modal: {
            ondismiss: function () {
              setLoadingPlan(null);
              toast.info("Checkout dismissed. You can retry anytime.");
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      } else {
        toast.success("Subscription requested. Check your billing dashboard.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
      }
    } catch (e: any) {
      toast.error(e?.message || "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      const res = await doCancel({ data: {} });
      toast.success(res.message || "Subscription cancellation scheduled.");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Cancel failed");
    }
  };

  const activePlanId = currentSub.data?.plan_id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <LaunchOfferBanner />
      <main className="flex-1">
        {/* ========== HERO ========== */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(70% 50% at 50% 0%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 70%)",
              }}
            />
            <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
            <div className="absolute bottom-10 right-[10%] w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
            <div className="absolute top-1/3 right-[5%] w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="absolute bottom-1/4 left-[5%] w-56 h-56 rounded-full bg-emerald-500/5 blur-3xl" />
          </div>

          {/* Floating UI elements */}
          <div className="absolute inset-0 -z-5 pointer-events-none overflow-hidden hidden lg:block">
            {[
              { icon: Sparkles, label: "AI Tutor", x: "8%", y: "15%", color: "#2563EB", delay: 0 },
              {
                icon: FileText,
                label: "Resume Builder",
                x: "85%",
                y: "20%",
                color: "#6366F1",
                delay: 1,
              },
              {
                icon: BarChart3,
                label: "ATS Checker",
                x: "6%",
                y: "60%",
                color: "#F59E0B",
                delay: 2,
              },
              {
                icon: Award,
                label: "Certificate",
                x: "88%",
                y: "55%",
                color: "#7c3aed",
                delay: 0.5,
              },
              { icon: Map, label: "Roadmap", x: "12%", y: "75%", color: "#10B981", delay: 1.5 },
              {
                icon: Mic,
                label: "Mock Interview",
                x: "82%",
                y: "75%",
                color: "#EC4899",
                delay: 2.5,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="absolute flex items-center gap-1.5 bg-background/80 backdrop-blur-md border border-border/40 rounded-full px-3 py-1.5 shadow-sm transition-transform duration-200 hover:scale-105"
                style={{ left: item.x, top: item.y }}
              >
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
                <span className="text-[10px] font-semibold whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="container mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 max-w-5xl text-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                {cmsHeroContent?.badge || "Pricing"}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                {cmsHeroContent?.headline1 || "Learn Smarter."}
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {cmsHeroContent?.headline2 || "Get Career Ready."}
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {cmsHeroContent?.subheadline ||
                  "AI Tutor, Resume Builder, ATS Checker, Mock Interviews, Certificates and Career Coaching — Everything You Need To Learn, Build Skills and Get Hired."}
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-10">
              {[
                { icon: Star, label: "4.9 Rating", sub: "10,000+ Learners" },
                { icon: GraduationCap, label: "25,000+ Certificates", sub: "Issued & Verified" },
                { icon: Briefcase, label: "Career Focused", sub: "Learning that leads to jobs" },
                {
                  icon: Users,
                  label: `🔥 ${learnerCount.toLocaleString("en-IN")} Active`,
                  sub: "Students enrolled",
                },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={label} className="flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 relative">
                    <Icon className="h-5 w-5 text-primary" />
                    {i === 3 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                <Button
                  asChild
                  size="lg"
                  className="h-13 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/25"
                >
                  <Link to="/signup">
                    Start Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 text-base font-semibold rounded-xl"
                  onClick={() => {
                    document
                      .getElementById("interactive-demo")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Interactive Demo
                </Button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · Cancel anytime · 30-day money-back guarantee
            </p>
          </div>
        </section>

        {/* ========== ROI SAVINGS ========== */}
        <ROISavingsSection />

        {/* ========== BUILD YOUR PLAN ========== */}
        <section id="build-your-plan" className="container mx-auto px-6 py-12 max-w-6xl">
          <SavingsCalculator />
        </section>

        {/* ========== COMPETITOR COMPARISON (INSTANT FIX: BEFORE WHY LEARNERS UPGRADE) ========== */}
        <CompetitorComparison />

        {/* ========== WHY LEARNERS UPGRADE ========== */}
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Learners Upgrade</h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands who&apos;ve accelerated their learning and career growth.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_UPGRADE.map((item, i) => (
              <div
                key={item.title}
                className="relative rounded-2xl border bg-card p-6 text-center hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${item.color}12` }}
                >
                  <item.icon className="h-7 w-7" style={{ color: item.color }} />
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== FREE TRIAL ========== */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 border border-primary/10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-purple-500/5 blur-3xl" />
            <div className="relative px-8 py-10 md:px-12 md:py-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {learnerCount.toLocaleString("en-IN")} learners started this month
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Try Learnify Risk-Free
              </h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                Start your 30-day money-back trial. Cancel anytime.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {[
                  { label: "30-Day Money-Back", desc: "Full refund within 30 days" },
                  { label: "No Credit Card", desc: "For free plan registration" },
                  { label: "Cancel Anytime", desc: "No questions asked" },
                  { label: "Instant Access", desc: "Start learning in seconds" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/25"
              >
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========== BILLING TOGGLE ========== */}
        <section className="container mx-auto px-6 pt-8 pb-4 max-w-5xl">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 bg-muted/50 rounded-full p-1.5">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative ${billingCycle === "yearly"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Yearly
                <span className="ml-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full animate-bounce">
                  Save 30%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ========== COUPON INPUT ========== */}
        <section className="container mx-auto px-6 pb-4 max-w-lg">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Have a coupon code?"
                className="w-full h-10 pl-9 pr-4 rounded-xl border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            {couponCode && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 text-xs shrink-0"
                onClick={() => setCouponCode("")}
              >
                Clear
              </Button>
            )}
          </div>
        </section>

        {/* ========== PRICING CARDS ========== */}
        <section className="container mx-auto px-6 py-10 max-w-6xl">
          {isLoading && (!Array.isArray(tiers) || (tiers as Plan[]).length === 0) ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error && (!Array.isArray(tiers) || (tiers as Plan[]).length === 0) ? (
            <div className="space-y-4 rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
              <p className="text-lg font-semibold text-destructive">
                Pricing is temporarily unavailable
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t load the pricing details. This is usually temporary — please
                refresh or check back shortly.
              </p>
              <Button
                variant="outline"
                onClick={() => qc.invalidateQueries({ queryKey: ["pricing-plans"] })}
              >
                Try again
              </Button>
            </div>
          ) : !tiers || tiers.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Pricing coming soon.</p>
          ) : (
            <>
              <div
                className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-4 md:pb-0 scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {tiers.map((t, idx) => {
                  const isCurrent = activePlanId === t.id;
                  const isFree = t.price_inr <= 0 && !t.interval;
                  const hasPrice = t.price_inr > 0;
                  const accentColor = t.color || "#7c3aed";
                  const isPopular = t.highlighted;

                  return (
                    <PricingCard
                      key={t.id}
                      plan={t}
                      idx={idx}
                      isCurrent={isCurrent}
                      isFree={isFree}
                      hasPrice={hasPrice}
                      accentColor={accentColor}
                      isPopular={isPopular}
                      billingCycle={billingCycle}
                      loadingPlan={loadingPlan}
                      onSubscribe={handleSubscribe}
                      onCancel={handleCancel}
                    />
                  );
                })}
              </div>
              <div className="mt-8 max-w-xl mx-auto text-center">
                <ContextualLegalNotice context="checkout" />
              </div>
            </>
          )}
        </section>

        {/* ========== STUDENT DISCOUNT ========== */}
        <section className="container mx-auto px-6 pb-4 max-w-4xl">
          <div className="rounded-2xl border-2 border-violet-500/20 bg-gradient-to-r from-violet-50 via-background to-violet-50 dark:from-violet-950/20 dark:to-violet-950/20 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-8 h-8 text-violet-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold mb-1">Student Discount Available</h3>
              <p className="text-sm text-muted-foreground">
                Verify your student email or upload your college ID and get an additional 20% off on
                all paid plans.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="shrink-0 h-10 rounded-xl border-violet-500/30 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40"
            >
              <Link to="/verify-student">
                Verify Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ========== FEATURE COMPARISON ========== */}
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Compare Plans</h2>
            <p className="mt-3 text-muted-foreground">See what&apos;s included in each plan.</p>
          </div>
          <div>
            <PricingComparisonTable />
          </div>
        </section>

        {/* ========== STUDENT JOURNEY ========== */}
        <StudentJourney />

        {/* ========== INTERACTIVE DEMO (TOOLS SHOWCASE) ========== */}
        <section id="interactive-demo" className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
          <InteractiveDemoCards />
        </section>

        {/* ========== FOUNDER MESSAGE ========== */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-700/5" />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="relative border rounded-3xl bg-card/80 backdrop-blur-sm p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Quote className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Built By Learners For Learners
              </h2>
              <blockquote className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8 italic">
                &ldquo;Students shouldn&apos;t need 10 different tools for learning, certificates,
                resumes, interviews and career growth. Learnify AI combines everything into one
                intelligent platform.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img
                  src="/avatars/Vishwajeet.jpeg"
                  alt="Vishwajeet"
                  className="w-14 h-14 rounded-full object-cover shadow-lg shadow-indigo-500/25 ring-2 ring-white dark:ring-gray-800"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold">Vishwajeet</div>
                  <div className="text-xs text-muted-foreground">Founder, Learnify AI</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                      Built in India
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                      For Students Worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIALS (Marquee) ========== */}
        <section className="py-16 md:py-20 overflow-hidden">
          <div className="container mx-auto px-6 text-center mb-12 max-w-6xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              <Star className="h-3.5 w-3.5" />
              Student Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Learners</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Real stories from students who transformed their careers with Learnify AI.
            </p>
          </div>

          {/* Avatar stack */}
          <div className="flex justify-center gap-1 mb-8">
            {cmsTestimonialItems.slice(0, 5).map((t: any) => (
              <img
                key={t.name}
                src={t.avatar || `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`}
                alt={t.name}
                title={t.name}
                className="h-10 w-10 rounded-full border-2 border-background shadow-md object-cover -ml-2 first:ml-0 hover:scale-110 transition-transform"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`; }}
              />
            ))}
            <div className="h-10 w-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center -ml-2 text-[10px] font-bold text-primary">
              +{Math.max(0, cmsTestimonialItems.length - 5)}K
            </div>
          </div>

          <TestimonialsMarquee
            items={cmsTestimonialItems}
            speed={35}
            pauseOnHover
            onItemClick={(item) => setSelectedTestimonial(item)}
          />

          {/* Fake (legacy) grid for the dialog trigger only — hidden but accessible */}
          <div className="hidden">
            {cmsTestimonialItems.map((t: any, i: number) => (
              <div
                key={t.name}
                onClick={() => setSelectedTestimonial(t)}
              >
                <Quote className="h-8 w-8 text-primary/10 absolute top-4 right-4" />
                {/* Achievement badge */}
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2.5 py-0.5 mb-3 border border-emerald-500/20">
                  <Award className="w-3 h-3" />
                  {t.achievement}
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating || 5 }).map((_: any, si: number) => (
                    <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4 line-clamp-4">
                  &ldquo;{t.review}&rdquo;
                </p>
                <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -mt-2 mb-2 block">
                  Click to read full review
                </span>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover shrink-0 border border-primary/20 shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(t.name || "Student")}`;
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {t.role} · {t.college}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Dialog */}
        {selectedTestimonial && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedTestimonial(null)}
          >
            <div
              className="relative bg-background rounded-2xl border shadow-2xl max-w-lg w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 mb-4 border border-emerald-500/20">
                <Award className="w-3.5 h-3.5" />
                {selectedTestimonial.achievement}
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: selectedTestimonial.rating }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-base text-foreground/90 leading-relaxed mb-6">
                &ldquo;{selectedTestimonial.review}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t">
                <img
                  src={selectedTestimonial.avatar}
                  alt={selectedTestimonial.name}
                  className="h-12 w-12 rounded-full object-cover shrink-0 border border-primary/20 shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(selectedTestimonial.name || "Student")}`;
                  }}
                />
                <div>
                  <div className="text-base font-semibold">{selectedTestimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedTestimonial.role} · {selectedTestimonial.college}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== CERTIFICATES (InteractiveFolder) ========== */}
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-3xl">
          <div className="rounded-2xl border bg-card p-10 md:p-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <InteractiveFolder
                size={1.8}
                color="#7c3aed"
                label="CERTIFICATES"
                items={[
                  <img
                    key="1"
                    src="/certificate%2001.png"
                    alt="Certificate 1"
                    className="w-full h-full object-contain p-1"
                  />,
                  <img
                    key="2"
                    src="/certificate%2002.png"
                    alt="Certificate 2"
                    className="w-full h-full object-contain p-1"
                  />,
                  <img
                    key="3"
                    src="/certificate%200.png"
                    alt="Certificate 3"
                    className="w-full h-full object-contain p-1"
                  />,
                ]}
              />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Your Achievement Vault</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Premium certificates with QR verification, one-click LinkedIn sharing, and
                  lifetime access.
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link to="/verified-certificates">
                  Explore Certificates
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========== TRUST SECTION ========== */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border/40">
              {TRUST_ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center gap-2 p-5 bg-card transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${item.color}10` }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== MAGNIFICATION DOCK ========== */}
        <div className="sticky bottom-4 z-40 flex justify-center px-6 pointer-events-none">
          <div className="pointer-events-auto">
            <MagnificationDock
              items={[
                {
                  icon: <Star className="w-5 h-5" />,
                  label: "Demo",
                  onClick: () =>
                    document
                      .getElementById("interactive-demo")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  label: "Upgrade",
                  onClick: () =>
                    document
                      .querySelector("section:nth-of-type(3)")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  icon: <CreditCard className="w-5 h-5" />,
                  label: "Plans",
                  onClick: () =>
                    document
                      .querySelector("section:nth-of-type(5)")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  label: "Compare",
                  onClick: () =>
                    document
                      .querySelector("section:nth-of-type(6)")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  icon: <Award className="w-5 h-5" />,
                  label: "FAQ",
                  onClick: () =>
                    document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" }),
                },
              ]}
              panelHeight={56}
              baseItemSize={42}
              magnification={62}
            />
          </div>
        </div>

        {/* ========== FAQ ========== */}
        <section id="faq-section" className="container mx-auto px-6 py-16 md:py-20 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFaqCategory(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${!faqCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }`}
            >
              All
            </button>
            {cmsFaqCategories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(faqCategory === cat ? null : cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${faqCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          <div className="space-y-3">
            {cmsFaqItems.filter(
              (item: any) =>
                (!faqCategory || item.category === faqCategory) &&
                (!faqSearch ||
                  (item.q || "").toLowerCase().includes(faqSearch.toLowerCase()) ||
                  (item.a || "").toLowerCase().includes(faqSearch.toLowerCase())),
            ).length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                No matching questions found.
              </p>
            ) : (
              cmsFaqItems
                .filter(
                  (item: any) =>
                    (!faqCategory || item.category === faqCategory) &&
                    (!faqSearch ||
                      (item.q || "").toLowerCase().includes(faqSearch.toLowerCase()) ||
                      (item.a || "").toLowerCase().includes(faqSearch.toLowerCase())),
                )
                .map((item: any, i: number) => {
                  const realIdx = cmsFaqItems.indexOf(item);
                  return (
                    <div key={realIdx} className="border rounded-xl overflow-hidden bg-card">
                      <button
                        onClick={() => setOpenFaq(openFaq === realIdx ? null : realIdx)}
                        className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/30 transition-colors"
                      >
                        <span>{item.q}</span>
                        <div
                          className={`shrink-0 ml-4 transition-transform duration-200 ${openFaq === realIdx ? "rotate-180" : ""}`}
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === realIdx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 blur-3xl translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Learn Smarter?
              </h2>
              <p className="text-lg text-white/80 max-w-lg mx-auto mb-8">
                Join thousands of learners building skills with AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                  <Button
                    asChild
                    size="lg"
                    className="h-13 px-8 text-base font-semibold rounded-xl bg-white text-indigo-700 hover:bg-white/90 shadow-lg"
                  >
                    <Link to="/signup">
                      Start Free Now
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
                <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base font-semibold rounded-xl bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 shadow-lg backdrop-blur-sm"
                    onClick={() => {
                      document
                        .getElementById("interactive-demo")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>
              </div>
              <p className="mt-6 text-sm text-white/60">
                Cancel Anytime · 30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </section>

        {/* ========== SECURE PAYMENTS ========== */}
        <section className="container mx-auto px-6 pb-16 max-w-3xl">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Secure payments powered by Cashfree</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All plans include a 30-day money-back guarantee. No credit card required for Free.{" "}
              <a
                href="mailto:support.learnifyai@gmail.com"
                className="text-primary underline underline-offset-2 hover:opacity-80 transition"
              >
                Contact us
              </a>{" "}
              anytime.
            </p>
          </div>
        </section>

        {/* ========== MOBILE STICKY CTA ========== */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-background/95 backdrop-blur-lg border-t">
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 h-11 text-sm font-semibold rounded-xl"
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="flex-1 h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            >
              <Link to="/signup">
                Start Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ================================================================
   PRICING CARD
   ================================================================ */
function PricingCard({
  plan,
  idx,
  isCurrent,
  isFree,
  hasPrice,
  accentColor,
  isPopular,
  billingCycle,
  loadingPlan,
  onSubscribe,
  onCancel,
}: {
  plan: Plan;
  idx: number;
  isCurrent: boolean;
  isFree: boolean;
  hasPrice: boolean;
  accentColor: string;
  isPopular: boolean;
  billingCycle: "monthly" | "yearly";
  loadingPlan: string | null;
  onSubscribe: (id: string) => void;
  onCancel: () => void;
}) {
  const yearlyPrice = plan.yearly_price || Math.round(plan.price_inr * 12 * 0.7);
  const monthlyEquiv = hasPrice && yearlyPrice > 0 ? Math.round(yearlyPrice / 12) : 0;
  const annualSaving = hasPrice ? Math.round(plan.price_inr * 12 - yearlyPrice) : 0;
  const monthlySavings = hasPrice ? Math.round((plan.price_inr * 12 - yearlyPrice) / 12) : 0;
  const isEnterprise =
    plan.name.toLowerCase() === "enterprise" ||
    Boolean(plan.is_custom_pricing) ||
    plan.price_label.toLowerCase() === "custom";

  const displayPrice = isEnterprise
    ? "Custom"
    : billingCycle === "yearly" && hasPrice
    ? `₹${monthlyEquiv.toLocaleString("en-IN")}`
    : plan.price_label;

  return (
    <div className="relative flex flex-col snap-start shrink-0 w-[80vw] sm:w-auto">
      <div
        className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${isPopular ? "shadow-xl border-2 hover:shadow-2xl" : "border hover:shadow-lg"
          }`}
        style={{
          borderColor: isPopular ? accentColor : undefined,
          background: "hsl(var(--card))",
        }}
      >
        {/* Top bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc, ${accentColor})`,
          }}
        />

        {/* Badge */}
        {(plan.badge || isCurrent) && (
          <div
            className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-lg z-10"
            style={{ background: accentColor }}
          >
            {isCurrent ? "Your plan" : plan.badge}
          </div>
        )}

        <div className="flex flex-col flex-1 p-6">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          {plan.description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {plan.description}
            </p>
          )}

          {/* Price */}
          <div className="mt-5 mb-1 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight">{displayPrice}</span>
            {!isEnterprise && hasPrice && plan.interval && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>

          {/* Price reference + savings */}
          {isEnterprise ? (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                Institutional seats &amp; custom deployment
              </span>
            </div>
          ) : hasPrice ? (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {billingCycle === "yearly" ? (
                <>
                  <span className="text-xs text-muted-foreground">
                    ₹{yearlyPrice.toLocaleString("en-IN")}/year &middot; billed yearly
                  </span>
                  {annualSaving > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      Save ₹{annualSaving.toLocaleString("en-IN")}/yr
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  ₹{yearlyPrice.toLocaleString("en-IN")}/year
                  {monthlySavings > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
                      Save ₹{monthlySavings}/mo
                    </span>
                  )}
                </span>
              )}
            </div>
          ) : null}

          {/* Social proof: avatar stack */}
          <div className="flex items-center gap-2.5 mt-3 mb-1">
            <div className="flex -space-x-2">
              {["Arjun","Meera","Rahul","Divya"].map((seed, i) => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/10.x/avataaars/svg?seed=${plan.name}-${seed}`}
                  alt={seed}
                  className="h-6 w-6 rounded-full border-2 border-background object-cover"
                  style={{ zIndex: 4 - i }}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              {plan.name === "Enterprise"
                ? "Used by colleges & companies"
                : plan.name === "Free"
                ? "10K+ learners started here"
                : plan.name === "Pro"
                ? "5,000+ active Pro learners"
                : plan.name === "Career Pro"
                ? "2,000+ job seekers enrolled"
                : "Trusted by students"}
            </span>
          </div>

          {/* Outcome badges */}
          {!isEnterprise && hasPrice && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                { label: "Learn Faster", color: "#2563EB" },
                { label: "Build Skills", color: "#6366F1" },
                { label: "Get Hired", color: "#10B981" },
              ].map((b) => (
                <span
                  key={b.label}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: `${b.color}10`,
                    color: b.color,
                    border: `1px solid ${b.color}20`,
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-border/40 my-4" />

          <ul className="space-y-2.5 text-sm flex-1">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div
                  className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${accentColor}15` }}
                >
                  <Check className="h-2.5 w-2.5" style={{ color: accentColor }} />
                </div>
                <span className="text-foreground/80 text-[13px]">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2">
            {isCurrent ? (
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" disabled>
                  <Crown className="h-4 w-4 mr-2" />
                  Current plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            ) : isEnterprise ? (
              <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <Button
                  asChild
                  className="w-full h-11 text-sm font-semibold rounded-xl"
                  variant="outline"
                >
                  <Link to={plan.cta_to || "/contact?inquiry=enterprise"}>
                    {plan.cta_label || "Contact Sales"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : !hasPrice ? (
              <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <Button
                  asChild
                  className="w-full h-11 text-sm font-semibold rounded-xl"
                  variant={isPopular ? "default" : "outline"}
                  style={
                    isPopular
                      ? { background: accentColor, color: "#fff", border: "none" }
                      : undefined
                  }
                >
                  <Link to="/signup">
                    {plan.cta_label || "Get Started Free"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <Button
                  className="w-full h-11 text-sm font-semibold rounded-xl"
                  onClick={() => onSubscribe(plan.id)}
                  disabled={loadingPlan !== null}
                  style={
                    isPopular
                      ? { background: accentColor, color: "#fff", border: "none" }
                      : undefined
                  }
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : plan.cta_label || `Subscribe ${displayPrice}`}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Check className="h-3 h-3 text-emerald-500" /> Secure 256-bit Checkout &middot; Razorpay &amp; Cashfree
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
