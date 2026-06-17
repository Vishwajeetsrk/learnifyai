import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Loader2 } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Learnify AI" },
      {
        name: "description",
        content:
          "Help us build the intelligent learning OS. Open roles across engineering, design, and content.",
      },
      { property: "og:title", content: "Careers — Learnify AI" },
      {
        property: "og:description",
        content: "Join Learnify AI — open roles across engineering, design, content, and growth.",
      },
    ],
  }),
  component: CareersPage,
});

type JobRow = {
  id: string;
  title: string;
  team: string;
  location: string;
  description: string | null;
  apply_url: string | null;
};

function CareersPage() {
  const { data: settings } = useSiteSettings();
  const careersEmail = settings?.careers_email || "careers@learnify.ai";
  const { data: roles, isLoading } = useQuery({
    queryKey: ["jobs-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("id,title,team,location,description,apply_url")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JobRow[];
    },
  });

  return (
    <MarketingPage
      eyebrow="Careers"
      title="Build the future of learning with us."
      subtitle="A small, ambitious team building tools for a billion learners."
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !roles || roles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No open roles right now. Email us anytime.
        </p>
      ) : (
        <StaggerGroup className="space-y-3" stagger={0.06}>
          {roles.map((r) => (
            <StaggerItem key={r.id}>
              <motion.a
                href={r.apply_url || `mailto:${careersEmail}?subject=Application`}
                target={r.apply_url?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                whileHover={{ x: 4, y: -2 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="block rounded-xl border border-border/60 bg-card p-5 hover:shadow-glow hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    {r.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {r.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {r.team}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {r.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-primary shrink-0 transition-transform group-hover:translate-x-1">
                    Apply →
                  </span>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
      <Reveal delay={0.2}>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Don't see your role? Email{" "}
          <a className="text-primary hover:underline" href={`mailto:${careersEmail}`}>
            {careersEmail}
          </a>
          .
        </p>
      </Reveal>
    </MarketingPage>
  );
}
