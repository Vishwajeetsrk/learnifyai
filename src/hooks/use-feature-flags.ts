import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type FeatureFlag = {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  maintenance_mode: boolean;
  roles: string[];
};

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("id, key, name, enabled, maintenance_mode, roles");
      if (error) throw error;
      return (data ?? []) as FeatureFlag[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeatureEnabled(featureKey: string) {
  const { data: flags } = useFeatureFlags();
  const flag = flags?.find((f) => f.key === featureKey);
  return flag?.enabled === true && flag?.maintenance_mode !== true;
}
