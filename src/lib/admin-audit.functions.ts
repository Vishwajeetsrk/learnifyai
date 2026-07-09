import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function checkAdminRole(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin role required");
  }
  return userRoles;
}

export const logAdminAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        action: z.string().min(1).max(100),
        entityType: z.string().min(1).max(100),
        entityId: z.string().optional(),
        changes: z.any().optional(),
        metadata: z.any().optional(),
        ipAddress: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    const { error } = await supabaseAdmin.from("admin_audit_logs").insert({
      actor_id: userId,
      actor_email: (profile as any)?.email || null,
      action: data.action,
      entity_type: data.entityType,
      entity_id: data.entityId || null,
      changes: data.changes ? JSON.stringify(data.changes) : null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      ip_address: data.ipAddress || null,
    });

    if (error) {
      console.error("Failed to log admin action:", error.message);
    }
    return { success: true };
  });

export const queryAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        limit: z.number().min(1).max(500).default(100),
        offset: z.number().min(0).default(0),
        action: z.string().optional(),
        entityType: z.string().optional(),
        actorId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("admin_audit_logs")
      .select("*, actor:actor_id(id, full_name, avatar_url)", { count: "exact" });

    if (data.action) query = query.eq("action", data.action);
    if (data.entityType) query = query.eq("entity_type", data.entityType);
    if (data.actorId) query = query.eq("actor_id", data.actorId);
    if (data.startDate) query = query.gte("created_at", data.startDate);
    if (data.endDate) query = query.lte("created_at", data.endDate);

    const { data: logs, error, count } = await query
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);

    if (error) throw error;
    return { logs: logs ?? [], total: count ?? 0 };
  });

export const getAuditSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: actionCounts } = await supabaseAdmin
      .from("admin_audit_logs")
      .select("action, count:action.count()")
      .order("count", { ascending: false })
      .limit(20);

    const { data: recentActivity } = await supabaseAdmin
      .from("admin_audit_logs")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { count: totalLogs } = await supabaseAdmin
      .from("admin_audit_logs")
      .select("*", { count: "exact", head: true });

    const today = new Date().toISOString().slice(0, 10);
    const { count: todayCount } = await supabaseAdmin
      .from("admin_audit_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today);

    return {
      totalLogs: totalLogs ?? 0,
      todayCount: todayCount ?? 0,
      lastActivity: (recentActivity as any)?.created_at || null,
      topActions: actionCounts ?? [],
    };
  });
