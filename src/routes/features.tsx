import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  BookOpen,
  Trophy,
  Users,
  Wallet,
  BarChart3,
  Sparkles,
  MessageSquare,
  GraduationCap,
  Bell,
  Zap,
  FileText,
} from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Learnify AI" },
      {
        name: "description",
        content:
          "Everything Learnify AI gives you: AI tutoring, smart notes, gamified progress, creator economy, wallet, and career intelligence.",
      },
      { property: "og:title", content: "Features — Learnify AI" },
      {
        property: "og:description",
        content:
          "AI tutoring, smart notes, gamified progress, wallet, and career intelligence — all in one platform.",
      },
    ],
  }),
  component: FeaturesPage,
});

const platform = [
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

const tools = [
  { icon: Sparkles, label: "Quiz Generator", desc: "Turn any topic into a 10-question MCQ set." },
  {
    icon: MessageSquare,
    label: "Doubt Solver",
    desc: "Ask any question, get a worked-out answer.",
  },
  { icon: GraduationCap, label: "Career Coach", desc: "Roadmaps tailored to your goals." },
  { icon: Bell, label: "Smart Reminders", desc: "Spaced repetition that actually fits your week." },
  { icon: Zap, label: "Lesson Synthesizer", desc: "Compress hours of video into 5-minute briefs." },
  { icon: FileText, label: "Auto Flashcards", desc: "Generate decks straight from your notes." },
];

function FeaturesPage() {
  return (
    <MarketingPage
      eyebrow="Features"
      title="Everything you need to learn faster."
      subtitle="A complete learning OS — from AI tutoring to creator tools to career growth."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {platform.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-lg transition"
          >
            <f.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div id="ai-tools" className="mt-20 scroll-mt-24">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">AI Tools</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          A growing suite of one-click utilities, available inside every course.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {tools.map((t) => (
            <div key={t.label} className="rounded-2xl border border-border/60 bg-card p-6">
              <t.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{t.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MarketingPage>
  );
}
