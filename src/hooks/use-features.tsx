import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  roles: string[];
  subscription_tiers: string[];
  maintenance_mode: boolean;
}

interface FeatureContextValue {
  flags: Record<string, FeatureFlag>;
  isLoading: boolean;
  hasFeature: (key: string) => boolean;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const { roles, loading: authLoading } = useAuth();

  const { data: flagsArray, isLoading: flagsLoading } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("feature_flags" as any).select("*");
      if (error) {
        console.error("Failed to load feature flags:", error);
        return [];
      }
      return data as any[] as FeatureFlag[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const flags = useMemo(() => {
    const map: Record<string, FeatureFlag> = {};
    if (flagsArray) {
      flagsArray.forEach((f) => {
        map[f.key] = f;
      });
    }
    return map;
  }, [flagsArray]);

  const hasFeature = (key: string): boolean => {
    // If not loaded yet or flag doesn't exist, default to true to prevent accidental lockout
    if (!flagsArray || !flags[key]) return true;

    const flag = flags[key];

    // Global toggle
    if (!flag.enabled) return false;

    // Maintenance mode logic: Only admins can access features in maintenance
    if (flag.maintenance_mode) {
      if (!roles.includes("admin") && !roles.includes("super_admin")) {
        return false;
      }
    }

    // Role-based visibility
    if (flag.roles && flag.roles.length > 0) {
      // If user has no roles and guest isn't explicitly allowed (assuming guest = empty roles)
      if (roles.length === 0) {
        if (!flag.roles.includes("guest") && !flag.roles.includes("public")) {
          return false;
        }
      } else {
        // If user has roles, check if any of their roles overlap with allowed roles
        const hasMatchingRole = roles.some((r) => flag.roles.includes(r));
        if (!hasMatchingRole) return false;
      }
    }

    return true;
  };

  const value: FeatureContextValue = {
    flags,
    isLoading: authLoading || flagsLoading,
    hasFeature,
  };

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

export function useFeatures() {
  const ctx = useContext(FeatureContext);
  if (!ctx) throw new Error("useFeatures must be used within FeatureProvider");
  return ctx;
}
