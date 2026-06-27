import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Loader2, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { MarketingPage } from "@/components/MarketingPage";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Learnify AI" },
      {
        name: "description",
        content:
          "Join live cohorts, office hours, and study groups led by creators on Learnify AI.",
      },
      { property: "og:title", content: "Learnify AI Community" },
      {
        property: "og:description",
        content: "Live cohorts, office hours, and study groups for AI-era learners.",
      },
    ],
  }),
  component: CommunityPage,
});

const KIND_LABEL: Record<string, string> = {
  cohort: "Live cohort",
  office_hours: "Office hours",
  study_group: "Study group",
};

function CommunityPage() {
  const q = useQuery({
    queryKey: ["community-cohorts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cohorts")
        .select("id, title, description, kind, starts_at, capacity, status")
        .eq("status", "live")
        .order("starts_at", { ascending: true })
        .limit(50);
      return data ?? [];
    },
  });

  const sessions = q.data ?? [];

  return (
    <MarketingPage
      eyebrow="Community"
      title="Learn together, build together"
      subtitle="Browse live cohorts, drop into office hours, or join a study group."
    >
      <div className="flex items-center justify-center mb-8">
        <div className="w-48 h-48 opacity-80">
          <img src="/illustrations/Globe_World.svg" alt="Community" className="w-full h-full" />
        </div>
      </div>
      <div className="flex items-center justify-end mb-6">
        <Button asChild>
          <Link to="/cohorts">
            Open community dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {q.isLoading ? (
        <div className="py-16 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No active groups right now. Check back soon or open the community dashboard.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {sessions.map((c: any) => (
            <Link
              key={c.id}
              to={("/cohorts/" + c.id) as any}
              className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <Badge variant="secondary" className="text-[10px]">
                  {KIND_LABEL[c.kind] ?? c.kind}
                </Badge>
                <Badge variant={c.status === "live" ? "default" : "outline"} className="capitalize">
                  {c.status}
                </Badge>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold group-hover:text-primary">
                {c.title}
              </h3>
              {c.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {format(new Date(c.starts_at), "dd MMM, HH:mm")}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {c.capacity} seats
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </MarketingPage>
  );
}
