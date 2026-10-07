import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MarketingPage } from "@/components/MarketingPage";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { getPlatformStats } from "@/lib/stats.functions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Learnify AI" },
      {
        name: "description",
        content:
          "We're building the intelligent learning OS — a single home for learners, creators, and coaches.",
      },
      { property: "og:title", content: "About — Learnify AI" },
      { property: "og:url", content: "https://www.learnifyai.in/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": "https://www.learnifyai.in/about#webpage",
          url: "https://www.learnifyai.in/about",
          name: "About Learnify AI",
          description: "Our mission, story, and the intelligent learning OS behind Learnify AI.",
          mainEntity: {
            "@type": "EducationalOrganization",
            name: "Learnify AI",
            url: "https://www.learnifyai.in",
            slogan: "#1 AI-Native Learning & Career OS in India",
            founder: {
              "@type": "Person",
              name: "Vishwajeet",
              jobTitle: "Founder & Lead Architect",
            },
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

import { CANONICAL_BENCHMARKS } from "@/lib/canonical-config";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  Rocket,
  Users,
  BookOpen,
  Globe,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AboutPage() {
  const { data } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: () => getPlatformStats(),
    initialData: {
      learners: CANONICAL_BENCHMARKS.learners,
      courses: CANONICAL_BENCHMARKS.coursesShipped,
      creators: CANONICAL_BENCHMARKS.creators,
      enrollments: 25000,
      certificates: 18000,
      countries: CANONICAL_BENCHMARKS.countries,
    },
    refetchInterval: 15_000,
  });

  const stats = [
    {
      value: data?.learners ?? CANONICAL_BENCHMARKS.learners,
      suffix: "+",
      label: "Active learners",
      compact: true,
      icon: Users,
      color: "text-blue-500",
      bgGlow: "from-blue-500/10 to-indigo-500/5",
    },
    {
      value: data?.courses ?? CANONICAL_BENCHMARKS.coursesShipped,
      suffix: "+",
      label: "Courses shipped",
      compact: true,
      icon: BookOpen,
      color: "text-cyan-500",
      bgGlow: "from-cyan-500/10 to-blue-500/5",
    },
    {
      value: data?.countries ?? CANONICAL_BENCHMARKS.countries,
      suffix: "+",
      label: "Countries",
      compact: false,
      icon: Globe,
      color: "text-emerald-500",
      bgGlow: "from-emerald-500/10 to-teal-500/5",
    },
  ];

  const pillars = [
    {
      title: "Our mission",
      icon: Compass,
      gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      badge: "Core North Star",
      content:
        "Make world-class learning accessible to every curious mind on the planet. We're building the intelligent learning OS — one platform where learners study, creators teach, and coaches grow careers.",
      highlights: [
        "Learners study with personalized, adaptive AI companions",
        "Creators teach and monetize with full intellectual ownership",
        "Coaches grow student careers into verifiable industry roles",
      ],
    },
    {
      title: "Why now",
      icon: Sparkles,
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      badge: "The Shift",
      content:
        "AI has changed what a single teacher can do, what a single learner can absorb, and what a single creator can ship. Learnify is the home for that shift.",
      highlights: [
        "10x teacher reach with generative curriculum drafting",
        "Instant conceptual mastery with multimodal interactive sandboxes",
        "Rapid shipping for creators from idea to live monetized cohort",
      ],
    },
    {
      title: "Where we're going",
      icon: Rocket,
      gradient: "from-emerald-500/20 via-cyan-500/10 to-transparent",
      badge: "Vision & Roadmap",
      content:
        "From AI tutoring to live cohorts, certificates, career coaching, and a fully native creator economy — all in one cohesive product.",
      highlights: [
        "Real-time voice and code AI tutoring on every concept",
        "High-trust engraved & cryptographically verifiable certificates",
        "Full-stack career studio, portfolio factory & job placement ecosystem",
      ],
    },
  ];

  const capabilities = [
    { label: "AI Tutoring", status: "Active" },
    { label: "Live Cohorts", status: "Active" },
    { label: "Engraved Certificates", status: "Active" },
    { label: "Career Coaching", status: "Active" },
    { label: "Native Creator Economy", status: "Active" },
  ];

  return (
    <MarketingPage
      eyebrow="About"
      title="Learning, reimagined."
      subtitle="We believe the next generation of education is personal, AI-augmented, and creator-driven."
    >
      <div className="space-y-16">
        {/* Core Narrative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="relative group rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-8 h-full flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                >
                  <div
                    aria-hidden
                    className={`absolute inset-0 bg-gradient-to-b ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                  />
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase bg-background/50"
                      >
                        {pillar.badge}
                      </Badge>
                    </div>

                    <h2 className="font-display text-2xl font-semibold tracking-tight mb-3 text-foreground">
                      {pillar.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-muted-foreground font-normal mb-6">
                      {pillar.content}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-border/40">
                    {pillar.highlights.map((h) => (
                      <li key={h} className="text-xs text-foreground/80 flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Global Impact Numbers */}
        <Reveal>
          <div className="relative rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl p-8 md:p-10 shadow-lg">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
                Global Scale & Proven Traction
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mt-1">
                Empowering learners across every continent
              </h3>
            </div>

            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s) => {
                const StatIcon = s.icon;
                return (
                  <StaggerItem key={s.label} variant="scale">
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="relative rounded-2xl border border-border/60 bg-background/60 p-8 text-center hover:border-primary/40 hover:shadow-glow transition h-full flex flex-col items-center justify-center"
                    >
                      <div
                        className={`h-12 w-12 rounded-2xl bg-muted/70 flex items-center justify-center ${s.color} mb-4 shadow-sm`}
                      >
                        <StatIcon className="h-6 w-6" />
                      </div>
                      <AnimatedCounter
                        value={s.value}
                        suffix={s.suffix}
                        compact={s.compact}
                        className="font-display text-4xl md:text-5xl font-bold text-foreground inline-block tracking-tight"
                      />
                      <div className="text-sm font-medium text-muted-foreground mt-2">
                        {s.label}
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </Reveal>

        {/* Cohesive Product Architecture Spotlight */}
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>One Cohesive Platform</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                From curiosity to career-ready mastery
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learnify AI unifies learning, creation, and professional credentials into one ecosystem.
                Every completion yields tamper-proof credentials with live guilloche rosette engraving,
                verifiable anywhere in the world.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {capabilities.map((c) => (
                  <Badge
                    key={c.label}
                    variant="secondary"
                    className="text-xs py-1 px-3 border border-border/50 bg-muted/60"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    {c.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <Button asChild size="lg" className="gap-2 shadow-md hover:shadow-lg font-medium">
                <Link to="/courses">
                  <span>Explore Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 font-medium">
                <Link to="/pricing">
                  <span>View Membership Plans</span>
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </MarketingPage>
  );
}
