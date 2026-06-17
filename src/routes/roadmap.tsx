import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — Learnify AI" },
      {
        name: "description",
        content:
          "What we've shipped, what's in progress, and what's next on the Learnify AI roadmap.",
      },
      { property: "og:title", content: "Roadmap — Learnify AI" },
      {
        property: "og:description",
        content: "Public roadmap: shipped, in progress, and coming soon.",
      },
    ],
  }),
  component: RoadmapPage,
});

const items = [
  {
    status: "done",
    title: "AI Tutor & Doubt Solver",
    desc: "Multi-model chat with course context.",
  },
  {
    status: "done",
    title: "Courses, Modules & Lessons",
    desc: "Full course builder with assignments and MCQ tests.",
  },
  {
    status: "done",
    title: "Wallet & Cart Checkout",
    desc: "Top-up, paid course enrollment, transaction history.",
  },
  {
    status: "done",
    title: "Certificates",
    desc: "Issue, design, PDF download, QR verify, email delivery.",
  },
  {
    status: "progress",
    title: "Cohort Live Sessions",
    desc: "Scheduled live rooms with recordings.",
  },
  { status: "progress", title: "Creator Payouts", desc: "Automatic monthly creator settlements." },
  { status: "planned", title: "Mobile App", desc: "iOS + Android with offline lessons." },
  {
    status: "planned",
    title: "Skill Graph & Career AI",
    desc: "Personalized career paths with skill gap analysis.",
  },
];

const icon = { done: CheckCircle2, progress: Loader2, planned: Circle } as const;
const labelClass = {
  done: "text-emerald-500",
  progress: "text-amber-500",
  planned: "text-muted-foreground",
} as const;
const labelText = { done: "Shipped", progress: "In progress", planned: "Planned" } as const;

function RoadmapPage() {
  return (
    <MarketingPage
      eyebrow="Roadmap"
      title="Built in the open."
      subtitle="A living view of what we're shipping next."
    >
      <div className="space-y-4">
        {items.map((it) => {
          const Icon = icon[it.status as keyof typeof icon];
          return (
            <div
              key={it.title}
              className="rounded-xl border border-border/60 bg-card p-5 flex items-start gap-4"
            >
              <Icon
                className={`h-5 w-5 mt-0.5 shrink-0 ${labelClass[it.status as keyof typeof labelClass]} ${it.status === "progress" ? "animate-spin" : ""}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{it.title}</h3>
                  <span
                    className={`text-xs uppercase tracking-wider ${labelClass[it.status as keyof typeof labelClass]}`}
                  >
                    {labelText[it.status as keyof typeof labelText]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </MarketingPage>
  );
}
