import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  Rocket,
  Star,
  Loader2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { getPlatformStats } from "@/lib/stats.functions";

const AiToolsShowcase = lazy(() =>
  import("@/components/AiToolsShowcase").then((m) => ({ default: m.AiToolsShowcase })),
);
const InteractiveDemo = lazy(() =>
  import("@/components/InteractiveDemo").then((m) => ({ default: m.InteractiveDemo })),
);
const AnimatedCounter = lazy(() =>
  import("@/components/AnimatedCounter").then((m) => ({ default: m.AnimatedCounter })),
);

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

function Index() {
  const { t } = useTranslation();

  const features = useMemo(() => [
    {
      icon: Brain,
      title: t("home.ecosystem.aiTutor.title"),
      desc: t("home.ecosystem.aiTutor.desc"),
    },
    {
      icon: BookOpen,
      title: t("home.ecosystem.smartNotes.title"),
      desc: t("home.ecosystem.smartNotes.desc"),
    },
    {
      icon: Trophy,
      title: t("home.ecosystem.gamified.title"),
      desc: t("home.ecosystem.gamified.desc"),
    },
    {
      icon: Users,
      title: t("home.ecosystem.creatorEconomy.title"),
      desc: t("home.ecosystem.creatorEconomy.desc"),
    },
    {
      icon: Wallet,
      title: t("home.ecosystem.wallet.title"),
      desc: t("home.ecosystem.wallet.desc"),
    },
    {
      icon: BarChart3,
      title: t("home.ecosystem.career.title"),
      desc: t("home.ecosystem.career.desc"),
    },
  ], [t]);

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
              {t("hero.badge")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05]"
            >
              {t("hero.title")} <span className="text-gradient">{t("hero.titleHighlight")}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {t("hero.subtitle")}
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
                  {t("common.startFree")}
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
                  {t("common.watchDemo")}
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="container mx-auto px-6 py-24 scroll-mt-24">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3">{t("home.demo.badge")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("home.demo.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("home.demo.subtitle")}
          </p>
        </Reveal>
        <Reveal variant="scale" delay={0.1}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <InteractiveDemo />
          </Suspense>
        </Reveal>
      </section>

      {/* STATS */}
      <LiveStats />

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-6 py-28">
        <Reveal className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-primary mb-3">{t("home.ecosystem.badge")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("home.ecosystem.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("home.ecosystem.subtitle")}
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
          <p className="text-sm font-medium text-primary mb-3">{t("home.community.badge")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("home.community.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("home.community.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all"
            >
              <Link to="/cohorts">
                <Users className="mr-1.5 h-4 w-4" />
                {t("home.community.browseGroups")}
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
                {t("home.community.communityFeed")}
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* AI TOOLS */}
      <section id="ai" className="relative">
        <div className="container mx-auto px-6 py-28">
          <Reveal variant="scale">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <AiToolsShowcase />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* CREATORS */}
      <section id="creators" className="container mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal variant="left">
            <p className="text-sm font-medium text-primary mb-3">{t("home.creators.badge")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {t("home.creators.title")}
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              {t("home.creators.subtitle")}
            </p>
            <StaggerGroup className="mt-8 space-y-3" stagger={0.07}>
              {[
                t("home.creators.payouts"),
                t("home.creators.cohorts"),
                t("home.creators.aiAssistant"),
                t("home.creators.communitySpaces"),
              ].map((text) => (
                <StaggerItem key={text} variant="left">
                  <div className="flex items-start gap-3 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{text}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Button
              asChild
              className="mt-10 bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all"
            >
              <Link to="/apply-creator">{t("home.creators.applyCta")}</Link>
            </Button>
          </Reveal>
          <Reveal variant="right" delay={0.1}>
            <div className="relative">
              <StaggerGroup
                className="aspect-square rounded-3xl border border-border bg-card shadow-card p-6 sm:p-8 grid grid-cols-2 gap-3 sm:gap-4"
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

      {/* FINAL CTA */}

      <SiteFooter />
    </div>
  );
}

function LiveStats() {
  const { t } = useTranslation();
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
    { value: learners, label: t("home.stats.activeLearners") },
    { value: creators, label: t("home.stats.creators") },
    { value: sessions, label: t("home.stats.aiSessions") },
    { value: completion, label: t("home.stats.completionLift"), suffix: "%", compact: false },
  ];

  return (
    <section className="border-y border-border/60 bg-card">
      <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((s) => (
          <div key={s.label} className="group">
            <Suspense
              fallback={
                <span className="font-display text-3xl md:text-4xl font-semibold text-gradient inline-block">
                  0
                </span>
              }
            >
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix ?? "+"}
                compact={s.compact ?? true}
                className="font-display text-3xl md:text-4xl font-semibold text-gradient inline-block transition-transform group-hover:scale-110"
              />
            </Suspense>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
