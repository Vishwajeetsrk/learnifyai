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
  instagram_url: string;
  support_us_enabled: string;
  support_us_title: string;
  support_us_subtitle: string;
  support_us_payment_url: string;
  support_us_upi_id: string;
  support_us_description: string;
  legal_center_enabled: string;
  legal_center_title: string;
  legal_center_subtitle: string;
};

const defaults: SiteSettings = {
  contact_email: "support.learnifyai@gmail.com",
  careers_email: "support.learnifyai@gmail.com",
  discord_url: "",
  discord_label: "Chat with the community in real time.",
  twitter_url: "",
  twitter_handle: "@learnifyai",
  github_url: "",
  linkedin_url: "",
  youtube_url: "",
  instagram_url: "",
  support_us_enabled: "true",
  support_us_title: "Support Us & Sponsor a Career",
  support_us_subtitle:
    "Help us build a free career-learning ecosystem. Sponsor a career and make practical education accessible to people facing financial barriers.",
  support_us_payment_url: "https://razorpay.me/@learnifyai3660",
  support_us_upi_id: "",
  support_us_description: "",
  legal_center_enabled: "true",
  legal_center_title: "Legal Center",
  legal_center_subtitle:
    "Canonical legal documents, commercial policies, data privacy terms, and acceptable use standards for Learnify AI.",
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
