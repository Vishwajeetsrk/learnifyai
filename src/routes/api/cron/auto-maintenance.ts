import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/cron/auto-maintenance")({
  server: {
    handlers: {
      GET: async () => {
        const results: Record<string, unknown> = {};

        try {
          // 1. Auto-delete past events (24h after they end)
          const { data: settings } = await supabaseAdmin
            .from("site_settings")
            .select("key,value")
            .in("key", ["events_auto_delete_enabled", "events_auto_delete_hours"]);

          const settingsMap = Object.fromEntries(
            (settings ?? []).map((s: { key: string; value: string | null }) => [s.key, s.value]),
          );

          if (settingsMap.events_auto_delete_enabled === "true") {
            const hours = parseInt(settingsMap.events_auto_delete_hours || "24", 10);
            const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

            const { data: expiredEvents, error: fetchErr } = await supabaseAdmin
              .from("events")
              .select("id")
              .lt("starts_at", cutoff);

            if (!fetchErr && expiredEvents && expiredEvents.length > 0) {
              const { error: deleteErr } = await supabaseAdmin
                .from("events")
                .delete()
                .in(
                  "id",
                  expiredEvents.map((e: { id: string }) => e.id),
                );

              results.events_deleted = expiredEvents.length;
              results.events_error = deleteErr?.message || null;
            } else {
              results.events_deleted = 0;
            }
          }

          // 2. Auto-close jobs past their close date
          const { data: jobSettings } = await supabaseAdmin
            .from("site_settings")
            .select("key,value")
            .in("key", ["jobs_auto_close_enabled"]);

          const jobSettingsMap = Object.fromEntries(
            (jobSettings ?? []).map((s: { key: string; value: string | null }) => [s.key, s.value]),
          );

          if (jobSettingsMap.jobs_auto_close_enabled === "true") {
            const now = new Date().toISOString();

            // Find jobs that are active and past their auto_close_at date
            const { data: expiredJobs, error: jobFetchErr } = await supabaseAdmin
              .from("job_postings")
              .select("id")
              .eq("active", true)
              .not("auto_close_at", "is", null)
              .lt("auto_close_at", now);

            if (!jobFetchErr && expiredJobs && expiredJobs.length > 0) {
              const { error: closeErr } = await supabaseAdmin
                .from("job_postings")
                .update({ active: false })
                .in(
                  "id",
                  expiredJobs.map((j: { id: string }) => j.id),
                );

              results.jobs_closed = expiredJobs.length;
              results.jobs_error = closeErr?.message || null;
            } else {
              results.jobs_closed = 0;
            }
          }

          return new Response(
            JSON.stringify({ success: true, timestamp: new Date().toISOString(), results }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.error("Cron auto-maintenance exception:", err);
          return new Response(JSON.stringify({ success: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
