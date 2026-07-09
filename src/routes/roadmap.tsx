import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, Loader2, Smartphone, Tablet, Monitor,
  ArrowRight, ExternalLink,
} from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
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
  {
    id: "7",
    status: "planned",
    title: "Mobile App",
    desc: "iOS + Android with offline lessons.",
  },
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

type Device = "mobile" | "tablet" | "laptop";

const deviceFrames: Record<Device, { icon: typeof Smartphone; label: string; width: string; height: string; outer: string; inner: string }> = {
  mobile: {
    icon: Smartphone,
    label: "Mobile",
    width: "w-[220px]",
    height: "h-[440px]",
    outer: "rounded-[2rem]",
    inner: "rounded-[1.5rem]",
  },
  tablet: {
    icon: Tablet,
    label: "Tablet",
    width: "w-[340px]",
    height: "h-[460px]",
    outer: "rounded-2xl",
    inner: "rounded-xl",
  },
  laptop: {
    icon: Monitor,
    label: "Laptop",
    width: "w-full max-w-[520px]",
    height: "h-[320px]",
    outer: "rounded-xl",
    inner: "rounded-t-lg",
  },
};

function DevicePreview({ device }: { device: Device }) {
  const f = deviceFrames[device];
  return (
    <motion.div
      key={device}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center"
    >
      {device === "laptop" && (
        <div className={`bg-slate-800 ${f.width} ${f.outer} p-2 pb-0 shadow-2xl`}>
          <div className="flex items-center gap-1.5 px-2 pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className={`bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ${f.inner} ${f.height} flex items-center justify-center overflow-hidden`}>
            <div className="text-center text-white px-4">
              <div className="text-lg font-bold mb-1">Learnify AI</div>
              <div className="text-xs text-white/70">Full Desktop Experience</div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {["AI Tutor", "Courses", "Career", "Certificates", "Wallet", "Cohorts"].map((l) => (
                  <div key={l} className="bg-white/10 backdrop-blur rounded-md p-1.5 text-[8px] text-white/80">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className={`bg-slate-800 h-3 ${f.inner}`} />
        </div>
      )}
      {device === "tablet" && (
        <div className={`bg-slate-800 ${f.width} ${f.outer} p-3 shadow-2xl`}>
          <div className="flex items-center justify-center pb-2">
            <div className="w-8 h-1 rounded-full bg-slate-600" />
          </div>
          <div className={`bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ${f.inner} ${f.height} flex items-center justify-center overflow-hidden`}>
            <div className="text-center text-white px-4">
              <div className="text-base font-bold mb-1">Learnify AI</div>
              <div className="text-[10px] text-white/70">Tablet Experience</div>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {["AI Tutor", "Courses", "Career", "Certificates"].map((l) => (
                  <div key={l} className="bg-white/10 backdrop-blur rounded-md p-2 text-[9px] text-white/80">{l}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {device === "mobile" && (
        <div className={`bg-slate-800 ${f.width} ${f.outer} p-2.5 shadow-2xl`}>
          <div className="flex items-center justify-center pb-2">
            <div className="w-12 h-2 rounded-full bg-slate-600" />
          </div>
          <div className={`bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ${f.inner} ${f.height} flex items-center justify-center overflow-hidden`}>
            <div className="text-center text-white px-3">
              <div className="text-sm font-bold mb-0.5">Learnify AI</div>
              <div className="text-[9px] text-white/70">Mobile App</div>
              <div className="mt-2 space-y-1">
                {["AI Tutor", "Courses", "Career"].map((l) => (
                  <div key={l} className="bg-white/10 backdrop-blur rounded-md p-1.5 text-[8px] text-white/80">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <div className="w-8 h-1 rounded-full bg-slate-600" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function RoadmapPage() {
  const [activeDevice, setActiveDevice] = useState<Device>("laptop");

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

  const shipped = items.filter((i) => i.status === "done");
  const inProgress = items.filter((i) => i.status === "progress");
  const planned = items.filter((i) => i.status === "planned");

  return (
    <MarketingPage
      eyebrow="Roadmap"
      title="Built in the open."
      subtitle="A living view of what we're shipping next."
    >
      {/* Device Preview Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Preview across devices
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            See how Learnify AI looks on mobile, tablet, and desktop. Fully responsive, always accessible.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {(["mobile", "tablet", "laptop"] as Device[]).map((d) => {
            const DIcon = deviceFrames[d].icon;
            return (
              <button
                key={d}
                onClick={() => setActiveDevice(d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeDevice === d
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <DIcon className="h-3.5 w-3.5" />
                {deviceFrames[d].label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center min-h-[480px]">
          <DevicePreview device={activeDevice} />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
            <Link to="/signup">
              Start Building Now <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/" target="_blank" rel="noopener noreferrer">
              View Live Template <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* Roadmap Timeline */}
      {q.isLoading ? (
        <div className="py-16 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Shipped */}
          {shipped.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-500">Shipped</h3>
                <span className="text-xs text-muted-foreground">({shipped.length})</span>
              </div>
              <div className="space-y-3">
                {shipped.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-border/60 bg-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-500" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{it.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {inProgress.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">In Progress</h3>
                <span className="text-xs text-muted-foreground">({inProgress.length})</span>
              </div>
              <div className="space-y-3">
                {inProgress.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <Loader2 className="h-5 w-5 mt-0.5 shrink-0 text-amber-500 animate-spin" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{it.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planned */}
          {planned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Planned</h3>
                <span className="text-xs text-muted-foreground">({planned.length})</span>
              </div>
              <div className="space-y-3">
                {planned.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-border/40 bg-card/50 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <Circle className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-muted-foreground">{it.title}</h3>
                      <p className="text-sm text-muted-foreground/70 mt-1">{it.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </MarketingPage>
  );
}
