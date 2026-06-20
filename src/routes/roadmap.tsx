import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { supabase } from "@/integrations/supabase/client";

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

const defaults = [
  {
    id: "1",
    status: "done",
    title: "AI Tutor & Doubt Solver",
    desc: "Multi-model chat with course context.",
  },
  {
    id: "2",
    status: "done",
    title: "Courses, Modules & Lessons",
    desc: "Full course builder with assignments and MCQ tests.",
  },
  {
    id: "3",
    status: "done",
    title: "Wallet & Cart Checkout",
    desc: "Top-up, paid course enrollment, transaction history.",
  },
  {
    id: "4",
    status: "done",
    title: "Certificates",
    desc: "Issue, design, PDF download, QR verify, email delivery.",
  },
  {
    id: "5",
    status: "progress",
    title: "Cohort Live Sessions",
    desc: "Scheduled live rooms with recordings.",
  },
  {
    id: "6",
    status: "progress",
    title: "Creator Payouts",
    desc: "Automatic monthly creator settlements.",
  },
  { id: "7", status: "planned", title: "Mobile App", desc: "iOS + Android with offline lessons." },
  {
    id: "8",
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
  const q = useQuery({
    queryKey: ["public-roadmap"],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "roadmap_items")
          .single();
        if (data?.value) {
          try {
            return JSON.parse(data.value as string) as typeof defaults;
          } catch {
            return defaults;
          }
        }
      } catch {
        // DB not available or table missing — use defaults
      }
      return defaults;
    },
    staleTime: 60_000,
  });

  const items = q.data ?? defaults;

  return (
    <MarketingPage
      eyebrow="Roadmap"
      title="Built in the open."
      subtitle="A living view of what we're shipping next."
    >
      {q.isLoading ? (
        <div className="py-16 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it: any) => {
            const Icon = icon[it.status as keyof typeof icon];
            return (
              <div
                key={it.id}
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
      )}
    </MarketingPage>
  );
}
