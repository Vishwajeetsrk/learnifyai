import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "Coaches — Learnify AI" },
      {
        name: "description",
        content: "Offer 1-on-1 coaching with built-in scheduling, messaging, and payments.",
      },
      { property: "og:title", content: "Coaches — Learnify AI" },
      {
        property: "og:description",
        content:
          "All the tools you need to run a coaching practice — without the spreadsheet juggling.",
      },
    ],
  }),
  component: CoachesPage,
});

const perks = [
  { icon: Calendar, title: "Smart Scheduling", desc: "Bookable slots synced to your calendar." },
  {
    icon: MessageCircle,
    title: "Native Messaging",
    desc: "Async chat + voice notes with every client.",
  },
  { icon: Compass, title: "Client Roadmaps", desc: "AI-generated learning paths per client." },
  { icon: TrendingUp, title: "Outcome Tracking", desc: "Show progress with real data, not vibes." },
];

function CoachesPage() {
  return (
    <MarketingPage
      eyebrow="For Coaches"
      title="Run your coaching practice on autopilot."
      subtitle="Scheduling, payments, content, and AI insight — in one place."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {perks.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border/60 bg-card p-6">
            <p.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Button asChild size="lg">
          <Link to="/contact">Talk to our coach team</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}
