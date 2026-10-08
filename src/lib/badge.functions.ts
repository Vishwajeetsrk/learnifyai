/**
 * badge.functions.ts
 * Server functions for the Learnify AI Badge Engine.
 * Handles badge definitions (admin CRUD) and badge award logic.
 * 
 * Badge award criteria are evaluated SERVER-SIDE ONLY.
 * No eval(), no arbitrary code execution.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { BadgeCriteria } from "@/components/certificate-designer/types";

// ─── Admin guard ─────────────────────────────────────────────────────────────
async function checkAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin privileges required.");
  }
}

// ─── Badge Criteria Evaluator ─────────────────────────────────────────────────
/**
 * Evaluates a badge's criteria against a completion event.
 * Safe — no eval(), no user-controlled function execution.
 */
function evaluateCriteria(
  criteria: BadgeCriteria[],
  event: {
    score?: number;
    total?: number;
    completed?: boolean;
    completionTimeMs?: number;
    fastLearnerThresholdMs?: number;
    projectApproved?: boolean;
    communityContributions?: number;
  }
): boolean {
  const pct = event.total && event.total > 0
    ? Math.round(((event.score ?? 0) / event.total) * 100)
    : (event.score ?? 0);

  return criteria.every((c) => {
    switch (c.type) {
      case "score_gte":
        return pct >= (c.threshold ?? 0);
      case "score_eq":
        return pct === (c.threshold ?? 100);
      case "course_completed":
        return event.completed === true;
      case "fast_learner":
        return (
          event.completionTimeMs !== undefined &&
          event.fastLearnerThresholdMs !== undefined &&
          event.completionTimeMs <= event.fastLearnerThresholdMs
        );
      case "project_approved":
        return event.projectApproved === true;
      case "community_contributions_gte":
        return (event.communityContributions ?? 0) >= (c.threshold ?? 0);
      case "custom":
        // Custom criteria are evaluated server-side only via a safe allow-list.
        // Never use eval() here.
        return false;
      default:
        return false;
    }
  });
}

// ─── BADGE DEFINITIONS — Admin CRUD ──────────────────────────────────────────

export const listBadgeDefinitions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("badge_definitions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message?.includes("schema cache") ||
        error.message?.includes("does not exist")
      ) {
        console.warn("[badge.functions] badge_definitions table not in schema cache:", error.message);
        return [];
      }
      throw new Error(error.message);
    }
    return (data ?? []) as any[];
  });

const BadgeDefinitionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().default(""),
  category: z.string().default("Achievement"),
  icon_name: z.string().default("Award"),
  shape: z.enum(["circle", "shield", "medal", "ribbon", "seal", "pill", "hexagon"]).default("circle"),
  primary_color: z.string().default("#4f46e5"),
  accent_color: z.string().default("#a5b4fc"),
  text_color: z.string().default("#ffffff"),
  criteria: z.array(
    z.object({
      type: z.enum([
        "score_gte",
        "score_eq",
        "course_completed",
        "fast_learner",
        "project_approved",
        "community_contributions_gte",
        "custom",
      ]),
      threshold: z.number().optional(),
      customFn: z.string().optional(),
    })
  ).default([{ type: "course_completed" }]),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const saveBadgeDefinition = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => BadgeDefinitionSchema.parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      if (data.id) {
        const { error } = await (supabaseAdmin as any)
          .from("badge_definitions")
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", data.id);
        if (error) throw new Error(error.message);
        return { ok: true, id: data.id };
      } else {
        const { data: inserted, error } = await (supabaseAdmin as any)
          .from("badge_definitions")
          .insert({ ...data, created_by: context.userId })
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        return { ok: true, id: inserted.id };
      }
    } catch (err: any) {
      if (
        err.message?.includes("schema cache") ||
        err.message?.includes("does not exist") ||
        err.code === "PGRST205" ||
        err.code === "42P01"
      ) {
        throw new Error(
          "Table 'badge_definitions' is not yet initialized in Supabase. Please run the 20261008000000_certificate_studio_2.sql migration in Supabase SQL Editor.",
        );
      }
      throw err;
    }
  });

export const deleteBadgeDefinition = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    try {
      const { error } = await (supabaseAdmin as any)
        .from("badge_definitions")
        .delete()
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    } catch (err: any) {
      if (
        err.message?.includes("schema cache") ||
        err.message?.includes("does not exist") ||
        err.code === "PGRST205" ||
        err.code === "42P01"
      ) {
        throw new Error(
          "Table 'badge_definitions' is not yet initialized in Supabase. Please run the migration first.",
        );
      }
      throw err;
    }
  });

// ─── BADGE AWARDS ─────────────────────────────────────────────────────────────

const AwardBadgesSchema = z.object({
  certificateCode: z.string(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  score: z.number().default(0),
  total: z.number().default(100),
  completed: z.boolean().default(true),
  completionTimeMs: z.number().optional(),
  fastLearnerThresholdMs: z.number().optional(),
  projectApproved: z.boolean().optional(),
  communityContributions: z.number().optional(),
});

/**
 * Evaluates all active badge definitions against a completion event
 * and awards any that pass the criteria.
 * Called server-side only — never from the browser directly.
 */
export const awardBadgesForCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => AwardBadgesSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load active badge definitions
    const { data: defs, error: defsErr } = await (supabaseAdmin as any)
      .from("badge_definitions")
      .select("*")
      .eq("status", "active");

    if (defsErr) {
      if (
        defsErr.code === "42P01" ||
        defsErr.code === "PGRST205" ||
        defsErr.message?.includes("schema cache") ||
        defsErr.message?.includes("does not exist")
      ) {
        console.warn("[badge.functions] badge_definitions not in schema cache:", defsErr.message);
        return { awarded: [], errors: [] };
      }
      return { awarded: [], errors: [defsErr.message] };
    }

    const awarded: string[] = [];
    const errors: string[] = [];

    for (const def of (defs ?? [])) {
      const criteria: BadgeCriteria[] = def.criteria ?? [];
      const passes = evaluateCriteria(criteria, {
        score: data.score,
        total: data.total,
        completed: data.completed,
        completionTimeMs: data.completionTimeMs,
        fastLearnerThresholdMs: data.fastLearnerThresholdMs,
        projectApproved: data.projectApproved,
        communityContributions: data.communityContributions,
      });

      if (!passes) continue;

      // Check idempotency: don't award the same badge twice for same cert
      const { data: existing } = await (supabaseAdmin as any)
        .from("badge_awards")
        .select("id")
        .eq("user_id", data.userId)
        .eq("badge_definition_id", def.id)
        .eq("certificate_code", data.certificateCode)
        .maybeSingle();

      if (existing) continue;

      const { error: awardErr } = await (supabaseAdmin as any)
        .from("badge_awards")
        .insert({
          badge_definition_id: def.id,
          badge_name: def.name,
          badge_icon: def.icon_name,
          badge_color: def.primary_color,
          certificate_code: data.certificateCode,
          user_id: data.userId,
          course_id: data.courseId,
          earned_at: new Date().toISOString(),
        });

      if (awardErr) {
        errors.push(`Failed to award "${def.name}": ${awardErr.message}`);
      } else {
        awarded.push(def.name);
        // Audit log
        try {
          await supabaseAdmin
            .from("certificate_audit_log")
            .insert({
              certificate_id: data.certificateCode,
              code: data.certificateCode,
              action: "badge_awarded",
              issued_by: context.userId,
              recipient_user_id: data.userId,
              course_id: data.courseId,
            });
        } catch {
          // ignore
        }
      }
    }

    return { awarded, errors };
  });

/**
 * Lists all badges earned by a specific user.
 */
export const getUserBadges = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("badge_awards")
      .select("*, badge_definitions(name, description, icon_name, shape, primary_color, accent_color)")
      .eq("user_id", context.userId)
      .order("earned_at", { ascending: false });

    if (error && error.code !== "42P01") {
      return [] as any[];
    }
    return (data ?? []) as any[];
  });

/**
 * Lists all badges for a specific certificate code (public).
 */
export const getCertificateBadges = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ certificateCode: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: awards, error } = await (supabaseAdmin as any)
      .from("badge_awards")
      .select("badge_name, badge_icon, badge_color, earned_at")
      .eq("certificate_code", data.certificateCode)
      .order("earned_at", { ascending: false });

    if (error && error.code !== "42P01") {
      return [] as any[];
    }
    return (awards ?? []) as any[];
  });

// ─── BUILT-IN DEFAULT BADGES ──────────────────────────────────────────────────
/**
 * Seeds the default Learnify badge definitions.
 * Idempotent — only inserts if not already present.
 */
export const seedDefaultBadges = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const defaultBadges = [
      {
        name: "Course Champion",
        description: "Awarded for completing any course",
        category: "Completion",
        icon_name: "Trophy",
        shape: "circle",
        primary_color: "#4f46e5",
        accent_color: "#a5b4fc",
        text_color: "#ffffff",
        criteria: [{ type: "course_completed" }],
        status: "active",
      },
      {
        name: "High Achiever",
        description: "Awarded for scoring 90% or above",
        category: "Achievement",
        icon_name: "Star",
        shape: "medal",
        primary_color: "#d97706",
        accent_color: "#fcd34d",
        text_color: "#ffffff",
        criteria: [{ type: "score_gte", threshold: 90 }],
        status: "active",
      },
      {
        name: "Perfect Score",
        description: "Awarded for a perfect 100% score",
        category: "Achievement",
        icon_name: "Crown",
        shape: "seal",
        primary_color: "#059669",
        accent_color: "#6ee7b7",
        text_color: "#ffffff",
        criteria: [{ type: "score_gte", threshold: 100 }],
        status: "active",
      },
      {
        name: "Fast Learner",
        description: "Completed the course in record time",
        category: "Speed",
        icon_name: "Zap",
        shape: "shield",
        primary_color: "#0891b2",
        accent_color: "#67e8f9",
        text_color: "#ffffff",
        criteria: [{ type: "fast_learner" }],
        status: "active",
      },
      {
        name: "AI Mastery",
        description: "Awarded for completing an AI course with distinction",
        category: "Specialization",
        icon_name: "Brain",
        shape: "hexagon",
        primary_color: "#7c3aed",
        accent_color: "#c4b5fd",
        text_color: "#ffffff",
        criteria: [{ type: "score_gte", threshold: 85 }],
        status: "active",
      },
    ];

    let inserted = 0;
    try {
      for (const badge of defaultBadges) {
        const { data: existing, error: selErr } = await (supabaseAdmin as any)
          .from("badge_definitions")
          .select("id")
          .eq("name", badge.name)
          .maybeSingle();

        if (selErr) {
          if (
            selErr.code === "42P01" ||
            selErr.code === "PGRST205" ||
            selErr.message?.includes("schema cache") ||
            selErr.message?.includes("does not exist")
          ) {
            return {
              inserted: 0,
              message:
                "Table 'badge_definitions' is not yet created in Supabase. Please apply migration 20261008000000_certificate_studio_2.sql in your Supabase SQL Editor.",
            };
          }
          throw new Error(selErr.message);
        }

        if (!existing) {
          const { error: insErr } = await (supabaseAdmin as any)
            .from("badge_definitions")
            .insert({ ...badge, created_by: context.userId })
            .maybeSingle();
          if (insErr) {
            console.warn("[badge.functions] seed badge error:", insErr.message);
          } else {
            inserted++;
          }
        }
      }

      return { inserted, message: `${inserted} default badges seeded` };
    } catch (err: any) {
      if (
        err.message?.includes("schema cache") ||
        err.message?.includes("does not exist") ||
        err.code === "PGRST205" ||
        err.code === "42P01"
      ) {
        return {
          inserted: 0,
          message:
            "Table 'badge_definitions' is not yet created in Supabase. Please apply migration 20261008000000_certificate_studio_2.sql in your Supabase SQL Editor.",
        };
      }
      throw err;
    }
  });
