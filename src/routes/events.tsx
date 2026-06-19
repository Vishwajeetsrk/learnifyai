import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Learnify AI" },
      {
        name: "description",
        content: "Live workshops, AMAs, and creator showcases — join us in person and online.",
      },
      { property: "og:title", content: "Events — Learnify AI" },
      {
        property: "og:description",
        content: "Upcoming Learnify AI workshops, AMAs, and creator meetups.",
      },
    ],
  }),
  component: EventsPage,
});

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  rsvp_url: string | null;
  image_url?: string | null;
};

function EventsPage() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("starts_at", new Date(Date.now() - 86400_000 * 30).toISOString())
        .order("starts_at", { ascending: true });
      if (error) {
        console.warn("Events DB query failed:", error);
        throw error;
      }
      return (data ?? []) as EventRow[];
    },
  });

  return (
    <MarketingPage
      eyebrow="Events"
      title="Learn together. In real time."
      subtitle="Workshops, AMAs, and creator showcases — both online and IRL."
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No upcoming events. Check back soon.
        </p>
      ) : (
        <div className="space-y-5">
          {events.map((e) => {
            const d = new Date(e.starts_at);
            return (
              <div
                key={e.id}
                className="rounded-2xl border border-border/60 bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {e.image_url && (
                  <div className="shrink-0 w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-muted">
                    <img src={e.image_url} alt={e.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-semibold">{e.title}</h3>
                  {e.description && (
                    <p className="text-sm text-muted-foreground mt-1">{e.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(d, "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {format(d, "p")}
                    </span>
                    {e.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {e.location}
                      </span>
                    )}
                  </div>
                </div>
                {e.rsvp_url ? (
                  <a
                    href={e.rsvp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition self-start md:self-center shrink-0"
                  >
                    RSVP
                  </a>
                ) : (
                  <span className="rounded-full bg-muted text-muted-foreground px-5 py-2 text-sm font-medium self-start md:self-center shrink-0">
                    Details soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MarketingPage>
  );
}
