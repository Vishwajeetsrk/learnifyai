import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { createSubscription, cancelSubscription } from "@/lib/subscription.functions";

import {
  ArrowRight,
  Sparkles,
  Brain,
  BookOpen,
  Users,
  Trophy,
  Wallet,
  Bell,
  Zap,
  GraduationCap,
  MessageSquare,
  BarChart3,
  PlayCircle,
  Check,
  Loader2,
  LogIn,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { AiToolsShowcase } from "@/components/AiToolsShowcase";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { getPlatformStats } from "@/lib/stats.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learnify AI — Learn Smarter. Grow Faster." },
      {
        name: "description",
        content:
          "The AI-native learning OS: intelligent tutoring, creator economy, gamification, and career growth — all in one platform.",
      },
      { property: "og:title", content: "Learnify AI — The Intelligent Learning OS" },
      {
        property: "og:description",
        content:
          "AI tutoring, notes, quizzes, community, and career growth in one cohesive platform.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Brain,
    title: "AI Tutor",
    desc: "Personalized 1-on-1 tutoring that adapts to how you learn.",
  },
  {
    icon: BookOpen,
    title: "Smart Notes & Slides",
    desc: "Generate flashcards, summaries, and decks from any lesson.",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    desc: "Streaks, XP, badges, and leaderboards that make learning addictive.",
  },
  {
    icon: Users,
    title: "Creator Economy",
    desc: "Coaches and creators ship courses, cohorts, and communities.",
  },
  {
    icon: Wallet,
    title: "Built-in Wallet",
    desc: "Earnings, payouts, and tipping handled natively.",
  },
  {
    icon: BarChart3,
    title: "Career Intelligence",
    desc: "AI-guided paths, resume reviews, and skill graphs.",
  },
];

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="bg-hero relative overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--gradient-glow)] pointer-events-none"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-6 pt-24 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-background/60 backdrop-blur text-xs font-medium text-muted-foreground mb-8 hover:border-primary/50 hover:bg-background/80 transition cursor-default"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              The AI-Native Learning OS
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05]"
            >
              Learn <span className="text-gradient">smarter</span>.<br />
              Grow faster.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Learnify AI fuses intelligent tutoring, creator-powered courses, and a thriving
              learning community into one premium experience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 shadow-glow group hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <Link to="/signup">
                  Start learning free
                  <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:-translate-y-0.5 transition-all"
              >
                <a href="#demo">
                  <PlayCircle className="mr-1.5 h-4 w-4" />
                  Watch demo
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="container mx-auto px-6 py-24 scroll-mt-24">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3">See it in action</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Try the product. No signup.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Click through a live AI Tutor chat, generate a quiz, and flip through auto-made
            flashcards.
          </p>
        </Reveal>
        <Reveal variant="scale" delay={0.1}>
          <InteractiveDemo />
        </Reveal>
      </section>

      {/* STATS */}
      <LiveStats />

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-6 py-28">
        <Reveal className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-primary mb-3">Everything in one OS</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            An ecosystem, not a course catalog.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Six pillars working together so learners, creators, and institutions all win.
          </p>
        </Reveal>
        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group p-7 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-card transition-all h-full"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* COMMUNITY */}
      <section className="container mx-auto px-6 py-28">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3">Study together</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Join a learning community.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Live cohorts, study groups, and office hours with dedicated WhatsApp and Discord
            channels.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all"
            >
              <Link to="/cohorts">
                <Users className="mr-1.5 h-4 w-4" />
                Browse groups
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hover:-translate-y-0.5 transition-all"
            >
              <Link to="/community">
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Community feed
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* AI TOOLS */}
      <section id="ai" className="relative">
        <div className="container mx-auto px-6 py-28">
          <Reveal variant="scale">
            <AiToolsShowcase />
          </Reveal>
        </div>
      </section>

      {/* CREATORS */}
      <section id="creators" className="container mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal variant="left">
            <p className="text-sm font-medium text-primary mb-3">For creators & coaches</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Build a learning business, not just a course.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              Cohorts, communities, drops, and digital products — with a wallet, analytics, and AI
              co-pilot built in.
            </p>
            <StaggerGroup className="mt-8 space-y-3" stagger={0.07}>
              {[
                "Native payouts in 40+ countries",
                "Cohort + 1-on-1 + async, in one place",
                "AI assistant that drafts lessons with your voice",
                "Community spaces with realtime presence",
              ].map((t) => (
                <StaggerItem key={t} variant="left">
                  <div className="flex items-start gap-3 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{t}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Button
              asChild
              className="mt-10 bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all"
            >
              <Link to="/apply-creator">Apply to Creator Program</Link>
            </Button>
          </Reveal>
          <Reveal variant="right" delay={0.1}>
            <div className="relative">
              <StaggerGroup
                className="aspect-square rounded-3xl border border-border bg-card shadow-card p-8 grid grid-cols-2 gap-4"
                stagger={0.1}
              >
                {[Trophy, Wallet, Users, BarChart3].map((Icon, i) => (
                  <StaggerItem key={i} variant="scale">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="rounded-2xl bg-secondary p-6 flex flex-col justify-between h-full hover:bg-secondary/80 transition cursor-default"
                    >
                      <Icon className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-display text-2xl font-semibold">
                          {["1,284", "$12.4K", "892", "+38%"][i]}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {["Streak XP", "This month", "Members", "Engagement"][i]}
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
              <motion.div
                className="absolute -inset-4 -z-10 rounded-[2rem]"
                style={{ background: "var(--gradient-glow)" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRICING PLANS FROM DB */}
      <section id="pricing" className="container mx-auto px-6 pb-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Pricing
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you're ready for unlimited AI sessions and creator tools.
          </p>
        </div>
        <PricingPlans />
      </section>

      {/* FINAL CTA */}

      <SiteFooter />
    </div>
  );
}

function LiveStats() {
  const { data } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: () => getPlatformStats(),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  const learners = Math.max(data?.learners ?? 0, 120_000);
  const creators = Math.max(data?.creators ?? 0, 4_200);
  const sessions = Math.max((data?.enrollments ?? 0) * 12, 18_000_000);
  const completion = 96;

  const items: Array<{ value: number; suffix?: string; label: string; compact?: boolean }> = [
    { value: learners, label: "Active learners" },
    { value: creators, label: "Creators" },
    { value: sessions, label: "AI sessions" },
    { value: completion, label: "Completion lift", suffix: "%", compact: false },
  ];

  return (
    <section className="border-y border-border/60 bg-card">
      <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((s) => (
          <div key={s.label} className="group">
            <AnimatedCounter
              value={s.value}
              suffix={s.suffix ?? "+"}
              compact={s.compact ?? true}
              className="font-display text-3xl md:text-4xl font-semibold text-gradient inline-block transition-transform group-hover:scale-110"
            />
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
};

function PricingPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const doSubscribe = useServerFn(createSubscription);
  const doCancel = useServerFn(cancelSubscription);

  const { data: tiers, isLoading } = useQuery<Plan[]>({
    queryKey: ["pricing-plans-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((p) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : [],
        price_inr: Number(p.price_inr || 0),
      })) as Plan[];
    },
    staleTime: 60_000,
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
      const sub = await doSubscribe({ data: { planId } });
      if (sub.auth_link) window.location.href = sub.auth_link;
      else toast.success("Subscription created! Check your dashboard.");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Subscription failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      await doCancel({ data: {} });
      toast.success("Subscription cancelled");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Cancel failed");
    }
  };

  const activePlanId = currentSub.data?.plan_id;

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  if (!tiers?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {tiers.map((t) => {
        const isCurrent = activePlanId === t.id;
        const isFree = t.price_inr <= 0 && !t.interval;
        const showSubscribe = !isFree && !isCurrent;
        const showLogin = !user && !isFree;

        return (
          <div
            key={t.id}
            className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 hover:shadow-lg ${
              t.highlighted
                ? "border-primary/50 bg-card shadow-xl shadow-primary/5 ring-1 ring-primary/20"
                : "border-border/60 bg-card"
            }`}
            style={t.color ? { borderColor: isCurrent ? t.color : undefined } : undefined}
          >
            {(t.badge || isCurrent) && (
              <div
                className={`inline-flex self-start rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider mb-4 text-white shadow-sm`}
                style={{ background: t.color || "#7c3aed" }}
              >
                {isCurrent ? "Your plan" : t.badge || "Most popular"}
              </div>
            )}
            <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
            <div className="mt-3 text-4xl font-bold tracking-tight">{t.price_label}</div>
            {t.description && (
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
            )}
            {t.ai_credits_monthly > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {t.ai_credits_monthly.toLocaleString("en-IN")} AI credits / mo
              </p>
            )}
            <ul className="mt-6 space-y-3 text-sm flex-1 mb-6">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 w-full space-y-2">
              {isCurrent ? (
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline" disabled>
                    Active
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              ) : isFree ? (
                <Button asChild className="w-full" variant="outline">
                  <Link to="/signup">Get started free</Link>
                </Button>
              ) : showLogin ? (
                <Button asChild className="w-full">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1" /> Sign in to subscribe
                  </Link>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={t.highlighted ? "default" : "outline"}
                  onClick={() => handleSubscribe(t.id)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loadingPlan === t.id
                    ? "Processing..."
                    : `Subscribe ₹${t.price_inr}/${t.interval}`}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
