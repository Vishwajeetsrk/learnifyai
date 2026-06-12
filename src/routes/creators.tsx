import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, DollarSign, Megaphone, Users } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "Creators — Learnify AI" },
      {
        name: "description",
        content:
          "Build a course, grow an audience, and earn — with AI tooling that does the heavy lifting.",
      },
      { property: "og:title", content: "Creators — Learnify AI" },
      {
        property: "og:description",
        content:
          "Launch a course in days, not months. Built-in audience, payouts, and AI co-pilot.",
      },
    ],
  }),
  component: CreatorsPage,
});

const perks = [
  {
    icon: Sparkles,
    title: "AI Course Builder",
    desc: "Generate modules, lessons, and assignments from a prompt.",
    to: "/studio" as const,
  },
  {
    icon: DollarSign,
    title: "Direct Payouts",
    desc: "Get paid to your wallet. Withdraw anytime to bank, UPI, or PayPal.",
    to: "/wallet" as const,
  },
  {
    icon: Megaphone,
    title: "Built-in Audience",
    desc: "Tap into a global community of learners.",
    to: "/community" as const,
  },
  {
    icon: Users,
    title: "Cohort Tools",
    desc: "Run live cohorts, office hours, and study groups.",
    to: "/cohorts" as const,
  },
];

function CreatorsPage() {
  return (
    <MarketingPage
      eyebrow="For Creators"
      title="Teach what you love. Earn what you're worth."
      subtitle="The creator stack designed for AI-era educators."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {perks.map((p) => (
          <Link
            key={p.title}
            to={p.to}
            className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-lg transition group"
          >
            <p.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl font-semibold group-hover:text-primary">
              {p.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Button asChild size="lg">
          <Link to="/signup">Apply to become a creator</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}
