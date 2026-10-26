import { createServerFn } from "@tanstack/react-start";

export interface SupportUsConfig {
  enabled: boolean;
  settings: Record<string, string>;
}

export const getSupportUsPublicConfig = createServerFn({ method: "GET" })
  .handler(async (): Promise<SupportUsConfig> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabaseAdmin as any)
        .from("site_settings")
        .select("key, value")
        .like("key", "support_us%");

      if (error) {
        console.error("[getSupportUsPublicConfig] Supabase error:", error);
        return { enabled: false, settings: {} };
      }

      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => {
        if (r.key && r.value != null) map[r.key] = r.value;
      });

      return {
        enabled: map["support_us_enabled"] === "true",
        settings: map,
      };
    } catch (err) {
      console.error("[getSupportUsPublicConfig] Fetch error:", err);
      return { enabled: false, settings: {} };
    }
  });
