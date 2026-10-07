import { createServerFn } from "@tanstack/react-start";

export type PlatformStats = {
  learners: number;
  courses: number;
  creators: number;
  enrollments: number;
  certificates: number;
  countries: number;
};

import { CANONICAL_BENCHMARKS } from "@/lib/canonical-config";

export const getPlatformStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlatformStats> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const safeCount = async (table: string, filter?: (q: any) => any): Promise<number> => {
      try {
        const client = supabaseAdmin as any;
        let q = client.from(table).select("*", { count: "exact", head: true });
        if (filter) q = filter(q);
        const { count, error } = await q;
        if (error) return 0;
        return count ?? 0;
      } catch {
        return 0;
      }
    };

    const [dbLearners, dbCourses, dbCreators, enrollments, certificates] = await Promise.all([
      safeCount("profiles"),
      safeCount("courses", (q) => q.eq("published", true)),
      safeCount("user_roles", (q) => q.eq("role", "creator")),
      safeCount("enrollments"),
      safeCount("certificates"),
    ]);

    return {
      learners: Math.max(dbLearners, CANONICAL_BENCHMARKS.learners),
      courses: Math.max(dbCourses, CANONICAL_BENCHMARKS.coursesShipped),
      creators: Math.max(dbCreators, CANONICAL_BENCHMARKS.creators),
      enrollments,
      certificates,
      countries: CANONICAL_BENCHMARKS.countries,
    };
  },
);
