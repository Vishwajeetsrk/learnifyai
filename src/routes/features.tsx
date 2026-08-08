import { useState } from "react";
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
  Loader2,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { motion } from "framer-motion";
import { AiToolsShowcase } from "@/components/AiToolsShowcase";
import { WatchDemoModal } from "@/components/interactive/WatchDemoModal";
import { usePublicFeatures } from "@/hooks/use-wcms-public";

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Zap,
  Code: FileText,
  Users,
  Award: Trophy,
  Trophy,
  Map: BookOpen,
  MessageSquare,
  Bot: Brain,
  Image: FileText,
  MessageCircle: MessageSquare,
  Smartphone: Zap,
  Folder: BookOpen,
  BookOpen,
  Rocket: Zap,
  Star: Sparkles,
  Heart: Trophy,
  Globe: Users,
  Search: Zap,
  Home: Zap,
};

const fallbackFeatures = [
  {
    icon: Brain,
    name: "AI Tutor & Agents",
    description: "Personalized 1-on-1 tutoring powered by Gemini, Groq, and OpenRouter multi-model fallbacks.",
  },
  {
    icon: BookOpen,
    name: "No-Code Block Course Builder",
    description: "Full-page Notion-style course builder at /course-builder/$courseId with 10 block types, live video embeds, quiz builder, and auto-save.",
  },
  {
    icon: Sparkles,
    name: "Interactive Block Player",
    description: "Rich block-rendered lessons featuring YouTube/Vimeo/Loom embeds, MCQ quizzes with scoring & retry, code blocks, and Mermaid diagrams.",
  },
  {
    icon: GraduationCap,
    name: "91 Developer Roadmaps",
    description: "Interactive learning tracks (AI Engineer, System Design, Frontend, Backend, DevOps, Cyber Security) grounded in roadmap.sh standards.",
  },
  {
    icon: BarChart3,
    name: "Career Studio (11-in-1)",
    description: "Resume Builder, ATS Checker, Voice Interview Coach, LinkedIn Optimizer, Career Analytics, Internship Tracker, and Ikigai Finder.",
  },
  {
    icon: Zap,
    name: "System Design Academy",
    description: "Master real-world architectures (Netflix, Uber, WhatsApp, YouTube, Twitter) with animated diagrams and knowledge graphs.",
  },
  {
    icon: Trophy,
    name: "Gamification & XP Store",
    description: "Daily streaks, XP rewards, animated rank crowns, leaderboards, and XP Store perks.",
  },
  {
    icon: Users,
    name: "Creator Economy & Cohorts",
    description: "Empowers educators to publish courses, launch cohorts, manage revenue, and automate certificate issuing.",
  },
  {
    icon: Wallet,
    name: "Cashfree GST Billing & Wallet",
    description: "RBI-compliant e-mandates, INR payouts, and automated 18% GST tax invoicing (SAC Code 998431).",
  },
];

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

function FeaturesPage() {
  const [showDemo, setShowDemo] = useState(false);
  const { data: wcmsFeatures, isLoading } = usePublicFeatures();
  const features =
    wcmsFeatures && wcmsFeatures.length > 0
      ? wcmsFeatures.map((f: any) => ({
          icon: ICON_MAP[f.icon] || Sparkles,
          name: f.name,
          description: f.description || "",
          url: f.url,
        }))
      : fallbackFeatures;

  return (
    <MarketingPage
      eyebrow="Features & Platform Tour"
      title="Everything you need to learn faster."
      subtitle="A complete learning OS — from AI tutoring to creator tools to career growth."
    >
      <WatchDemoModal open={showDemo} onOpenChange={setShowDemo} />

      {/* INTERACTIVE TOUR BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900/90 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Learnify AI Interactive Tour</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Watch & Experience Learnify AI
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-200/90 leading-relaxed">
              Discover how intelligent tutoring, 100+ career courses, and the creator economy work together seamlessly in one unified platform.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
          >
            <PlayCircle className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Watch Live Interactive Demo</span>
            <ArrowRight className="w-4 h-4 text-indigo-200" />
          </button>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center justify-center mb-6"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="w-44 h-44 cursor-pointer relative"
          whileHover={{ scale: 1.1, rotateZ: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.9 }}
          drag
          dragSnapToOrigin
          dragElastic={0.3}
        >
          <motion.div
            className="absolute -inset-3 rounded-full bg-primary/10 blur-xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -inset-3 rounded-full bg-violet-500/10 blur-2xl"
            animate={{ scale: [1.1, 1.35, 1.1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <img
            src="/illustrations/AI_Spark_Interactive_Assistant.svg"
            loading="lazy"
            alt="Features"
            className="w-full h-full relative z-10"
          />
        </motion.div>
      </motion.div>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f: any) => (
            <div
              key={f.name}
              className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-lg transition"
            >
              {f.url ? (
                <a href={f.url} target="_blank" rel="noreferrer">
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-xl font-semibold">{f.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </a>
              ) : (
                <>
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-xl font-semibold">{f.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div id="ai-tools" className="mt-20 scroll-mt-24">
        <AiToolsShowcase />
      </div>
    </MarketingPage>
  );
}
