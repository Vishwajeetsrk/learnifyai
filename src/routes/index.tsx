import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

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
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { AiToolsShowcase } from "@/components/AiToolsShowcase";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { getPlatformStats } from "@/lib/stats.functions";

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
            <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all">
              <Link to="/cohorts">
                <Users className="mr-1.5 h-4 w-4" />
                Browse groups
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hover:-translate-y-0.5 transition-all">
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

      {/* PRICING / CTA */}
      <section id="pricing" className="container mx-auto px-6 pb-10">
        <Reveal variant="scale">
          <div className="rounded-3xl border border-border bg-card p-12 md:p-16 text-center shadow-card hover:shadow-glow transition-shadow duration-500">
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">
              Your next skill is one <span className="text-gradient">conversation</span> away.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">
              Start free. Upgrade when you're ready for unlimited AI sessions and creator tools.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 shadow-glow hover:-translate-y-0.5 transition-all"
              >
                <Link to="/signup">Create your account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:-translate-y-0.5 transition-all"
              >
                <Link to="/pricing" search={{ subscribe: undefined }}>View pricing</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

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
