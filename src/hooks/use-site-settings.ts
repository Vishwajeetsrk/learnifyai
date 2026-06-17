import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  contact_email: string;
  careers_email: string;
  discord_url: string;
  discord_label: string;
  twitter_url: string;
  twitter_handle: string;
  github_url: string;
  linkedin_url: string;
  youtube_url: string;
};

const defaults: SiteSettings = {
  contact_email: "hello@learnify.ai",
  careers_email: "careers@learnify.ai",
  discord_url: "https://discord.gg/learnify",
  discord_label: "Chat with the community in real time.",
  twitter_url: "https://x.com/learnifyai",
  twitter_handle: "@learnifyai",
  github_url: "https://github.com/Vishwajeetsrk/learnifyai",
  linkedin_url: "",
  youtube_url: "",
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => {
        if (r.value != null && r.value !== "#" && r.value !== "") map[r.key] = r.value;
      });
      return { ...defaults, ...(map as Partial<SiteSettings>) };
    },
    staleTime: 60_000,
  });
}
