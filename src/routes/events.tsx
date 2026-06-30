import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { MarketingPage } from "@/components/MarketingPage";
import { supabase } from "@/integrations/supabase/client";
import { SafeImage } from "@/components/ui/SafeImage";
import { getCleanBannerUrl } from "@/lib/utils";

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
  const [brokenEvents, setBrokenEvents] = useState<Set<string>>(new Set());
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events-public"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("starts_at", new Date(Date.now() - 86400_000 * 30).toISOString())
          .order("starts_at", { ascending: true });
        if (error) {
          console.warn("Events DB query failed:", error);
          return [];
        }
        return (data ?? []) as EventRow[];
      } catch (err) {
        console.warn("Events fetch caught exception:", err);
        return [];
      }
    },
  });

  return (
    <MarketingPage
      eyebrow="Events"
      title="Learn together. In real time."
      subtitle="Workshops, AMAs, and creator showcases — both online and IRL."
    >
      <motion.div
        className="flex items-center justify-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="w-40 h-40 cursor-pointer relative"
          whileHover={{ scale: 1.15, rotate: [0, -5, 5, -3, 0] }}
          whileTap={{ scale: 0.95 }}
          drag
          dragSnapToOrigin
          dragElastic={0.3}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <img
            src="/illustrations/Globe_World.svg" loading="lazy"
            alt="Events"
            className="w-full h-full relative z-10"
          />
        </motion.div>
      </motion.div>
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
                {e.image_url && !brokenEvents.has(e.id) && (
                  <div className="shrink-0 w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-muted">
                    <SafeImage
                      src={getCleanBannerUrl(e.image_url) ?? e.image_url}
                      alt={e.title}
                      className="w-full h-full object-cover"
                      onError={() => setBrokenEvents((p) => new Set(p).add(e.id))}
                    />
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
