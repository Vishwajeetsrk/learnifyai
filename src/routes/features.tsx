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
} from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { AiToolsShowcase } from "@/components/AiToolsShowcase";
import { usePublicFeatures } from "@/hooks/use-wcms-public";

const ICON_MAP: Record<string, any> = {
  Sparkles, Zap, Code: FileText, Users, Award: Trophy, Trophy, Map: BookOpen,
  MessageSquare, Bot: Brain, Image: FileText, MessageCircle: MessageSquare,
  Smartphone: Zap, Folder: BookOpen, BookOpen, Rocket: Zap, Star: Sparkles,
  Heart: Trophy, Globe: Users, Search: Zap, Home: Zap,
};

const fallbackFeatures = [
  { icon: Brain, name: "AI Tutor", description: "Personalized 1-on-1 tutoring that adapts to how you learn." },
  { icon: BookOpen, name: "Smart Notes & Slides", description: "Generate flashcards, summaries, and decks from any lesson." },
  { icon: Trophy, name: "Gamified Progress", description: "Streaks, XP, badges, and leaderboards that make learning addictive." },
  { icon: Users, name: "Creator Economy", description: "Coaches and creators ship courses, cohorts, and communities." },
  { icon: Wallet, name: "Built-in Wallet", description: "Earnings, payouts, and tipping handled natively." },
  { icon: BarChart3, name: "Career Intelligence", description: "AI-guided paths, resume reviews, and skill graphs." },
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
  const { data: wcmsFeatures, isLoading } = usePublicFeatures();
  const features = wcmsFeatures && wcmsFeatures.length > 0
    ? wcmsFeatures.map((f: any) => ({
        icon: ICON_MAP[f.icon] || Sparkles,
        name: f.name,
        description: f.description || "",
        url: f.url,
      }))
    : fallbackFeatures;

  return (
    <MarketingPage
      eyebrow="Features"
      title="Everything you need to learn faster."
      subtitle="A complete learning OS — from AI tutoring to creator tools to career growth."
    >
      <div className="flex items-center justify-center mb-6">
        <div className="w-44 h-44 opacity-80">
          <img src="/illustrations/Back_to_school!.svg" alt="Features" className="w-full h-full" />
        </div>
      </div>
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
