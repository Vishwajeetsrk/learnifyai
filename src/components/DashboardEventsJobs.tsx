import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Briefcase, ArrowRight, MapPin } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { getCleanBannerUrl } from "@/lib/utils";

export function DashboardEventsJobs() {
  const [brokenImgs, setBrokenImgs] = useState<Set<string>>(new Set());
  const markBroken = (id: string) => setBrokenImgs((p) => new Set(p).add(id));

  const eventsQ = useQuery({
    queryKey: ["dashboard-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, starts_at, location, image_url, rsvp_url")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(3);
      return data ?? [];
    },
  });

  const jobsQ = useQuery({
    queryKey: ["dashboard-jobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("job_postings")
        .select("id, title, team, location, apply_url, created_at")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const events = eventsQ.data ?? [];
  const jobs = jobsQ.data ?? [];
  if (events.length === 0 && jobs.length === 0) return null;

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Events */}
      <section className="rounded-2xl border bg-card shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-primary" /> Upcoming Events
          </h2>
          <Link
            to="/events"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">No upcoming events.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((e: any) => (
              <li key={e.id} className="flex gap-3">
                {e.image_url && !brokenImgs.has(e.id) ? (
                  <img
                    src={getCleanBannerUrl(e.image_url) ?? e.image_url}
                    alt=""
                    className="h-14 w-20 rounded-md object-cover shrink-0 border"
                    loading="lazy"
                    onError={() => markBroken(e.id)}
                  />
                ) : (
                  <div className="h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-foreground truncate">{e.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-2">
                    <span>{format(new Date(e.starts_at), "dd MMM · p")}</span>
                    {e.location && (
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {e.location}
                      </span>
                    )}
                  </div>
                  {e.rsvp_url && (
                    <a
                      href={e.rsvp_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline"
                    >
                      RSVP →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Jobs */}
      <section className="rounded-2xl border bg-card shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-foreground">
            <Briefcase className="h-4 w-4 text-primary" /> Latest Jobs
          </h2>
          <Link
            to="/careers"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">No open roles right now.</p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((j: any) => (
              <li
                key={j.id}
                className="rounded-lg border border-border/60 p-3 hover:border-primary/40 transition-colors"
              >
                <div className="font-medium text-sm text-foreground">{j.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-2">
                  <span>{j.team}</span>
                  <span>· {j.location}</span>
                </div>
                {j.apply_url && (
                  <a
                    href={j.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline mt-1 inline-block"
                  >
                    Apply →
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
