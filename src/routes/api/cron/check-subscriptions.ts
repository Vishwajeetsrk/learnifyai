import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/cron/check-subscriptions")({
  server: {
    handlers: {
      GET: async () => {
        const authHeader = Bun.env.CRON_SECRET
          ? undefined
          : undefined;

        try {
          const { data, error } = await supabaseAdmin.rpc("check_expired_subscriptions");

          if (error) {
            console.error("Cron check-subscriptions error:", error);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({ success: true, timestamp: new Date().toISOString() }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("Cron check-subscriptions exception:", err);
          return new Response(
            JSON.stringify({ success: false, error: err?.message || "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
