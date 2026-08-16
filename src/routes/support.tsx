import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  Wrench,
  MonitorPlay,
  Compass,
  Rocket,
  Heart,
  ArrowUpRight,
  Share2,
  MessageSquare,
  Users,
  HandCoins,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import {
  getContributionSummary,
  SUPPORT_PAYMENT_PAGE_URL,
} from "@/lib/support.functions";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Learnify AI — Keep Learning Free" },
      {
        name: "description",
        content:
          "Support Learnify AI and help us keep courses, AI tools and certificates free for every learner. Learn, Build, Present, Guidance & Launch — one donation funds it all.",
      },
      { property: "og:title", content: "Support Learnify AI" },
      {
        property: "og:description",
        content:
          "A small contribution keeps courses, AI tools and certificates free for learners around the world.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SupportPage,
});

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Learn",
    desc: "Free, structured courses with real projects, quizzes and verified certificates.",
  },
  {
    icon: Wrench,
    title: "Build",
    desc: "Sandboxed coding labs, interactive playgrounds and portfolio-ready assignments.",
  },
  {
    icon: MonitorPlay,
    title: "Present",
    desc: "AI-assisted slide decks, resumes and portfolios that make learners stand out.",
  },
  {
    icon: Compass,
    title: "Guidance",
    desc: "1:1 coaching, office hours and study groups led by verified creators and coaches.",
  },
  {
    icon: Rocket,
    title: "Launch",
    desc: "Roadmaps, job boards and career support that turn skills into opportunities.",
  },
];

const OTHER_WAYS = [
  {
    icon: Share2,
    title: "Spread the word",
    desc: "Share Learnify with a friend or on social media — free growth, huge impact.",
    link: { label: "Share now", to: "/features" },
  },
  {
    icon: MessageSquare,
    title: "Give feedback",
    desc: "Tell us what to build next. Your feedback shapes the roadmap.",
    link: { label: "Contact us", to: "/contact" },
  },
  {
    icon: Users,
    title: "Join the community",
    desc: "Cohorts, study groups and events where everyone levels up together.",
    link: { label: "Explore community", to: "/community" },
  },
  {
    icon: HandCoins,
    title: "Teach or coach",
    desc: "Publish a course or offer coaching — earn while helping others.",
    link: { label: "Apply to create", to: "/apply-creator" },
  },
];

function SupportPage() {
  const impact = useQuery({
    queryKey: ["support-impact"],
    queryFn: () => getContributionSummary(),
  });

  const summary = impact.data;
  const hasImpact = !!summary && summary.count > 0 && summary.total_inr > 0;

  return (
    <MarketingPage
      eyebrow="Support"
      title="Help us keep learning free"
      subtitle="Learnify AI is built for learners, not locked behind paywalls. A small contribution helps us keep courses, AI tools and certificates free."
    >
      {/* CTA */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all text-base px-8 py-6"
        >
          <a href={SUPPORT_PAYMENT_PAGE_URL} target="_blank" rel="noreferrer">
            <Heart className="h-5 w-5 mr-2 fill-current" /> Support Learnify AI
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Secure payment via Razorpay · One-time or recurring · 100% goes to the platform
        </p>
      </div>

      {/* 5 Pillars */}
      <section className="mt-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
          What your support powers
        </h2>
        <p className="text-center text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
          Every contribution directly funds the five pillars of the Learnify experience.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border/60 bg-card p-5 text-center hover:border-primary/40 hover:shadow-card transition-all"
            >
              <div className="h-10 w-10 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">{p.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="mt-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
          Impact — real numbers, real transparency
        </h2>
        <p className="text-center text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
          Live totals from the platform. No estimates, no vanity metrics.
        </p>

        {impact.isLoading ? (
          <div className="mt-10 flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : hasImpact ? (
          <div className="mt-10 grid md:grid-cols-2 gap-6 items-start">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
                <div className="font-display text-4xl font-semibold text-gradient">
                  {summary!.count}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Supporters</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
                <div className="font-display text-4xl font-semibold text-gradient">
                  ₹{summary!.total_inr.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Contributed</div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <h3 className="text-sm font-semibold mb-4">Recent supporters</h3>
              <ul className="space-y-3">
                {summary!.recent.map((r: any, i: number) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 text-rose-500" />
                      {r.name ? r.name : "Anonymous"}
                    </span>
                    <span className="font-semibold">₹{r.amount_inr.toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border/70 bg-card/50 p-10 text-center">
            <Heart className="h-8 w-8 mx-auto text-rose-500/60" />
            <p className="mt-4 font-display text-lg font-semibold">We're just getting started</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Be the first supporter — your contribution will show up here live.
            </p>
            <Button asChild size="sm" className="mt-5 rounded-full">
              <a href={SUPPORT_PAYMENT_PAGE_URL} target="_blank" rel="noreferrer">
                <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" /> Be the first
              </a>
            </Button>
          </div>
        )}
      </section>

      {/* Transparency */}
      <section className="mt-20 rounded-2xl border border-border/60 bg-card p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-500" /> Transparency
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Your support goes into:
        </p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          {[
            "Server & hosting infrastructure",
            "AI model API credits for free AI tools",
            "Verified certificate infrastructure (QR + verification)",
            "Creator & coach payouts so they keep teaching",
            "Free course development and content",
            "Student discounts and scholarships",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-5">
          Contributions are separate from subscriptions and wallets — we never mix supporter
          funds with course payments.
        </p>
      </section>

      {/* Other ways to help */}
      <section className="mt-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
          Other ways to help
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {OTHER_WAYS.map((w) => (
            <a
              key={w.title}
              href={w.link.to}
              className="group rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/40 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <w.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm">{w.title}</h3>
                <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{w.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </MarketingPage>
  );
}
