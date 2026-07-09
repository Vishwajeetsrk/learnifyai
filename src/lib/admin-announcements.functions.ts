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
}

export const sendAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        title: z.string().min(1).max(200),
        body: z.string().min(1).max(10000),
        type: z.enum(["info", "warning", "success", "promo", "maintenance"]).default("info"),
        targetRole: z.enum(["all", "students", "creators", "admins"]).default("all"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get target user IDs based on role filter
    let targetUsers: string[] = [];

    if (data.targetRole === "all") {
      const { data: allUsers } = await supabaseAdmin
        .from("profiles")
        .select("id");
      targetUsers = (allUsers ?? []).map((u: any) => u.id);
    } else {
      const roleField =
        data.targetRole === "students" ? "student" :
        data.targetRole === "creators" ? "creator" :
        "admin";
      const { data: roleUsers } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", roleField);
      targetUsers = (roleUsers ?? []).map((u: any) => u.user_id);
    }

    if (targetUsers.length === 0) {
      return { success: true, notifiedCount: 0 };
    }

    // Batch insert notifications (chunked to avoid payload limits)
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < targetUsers.length; i += BATCH_SIZE) {
      const batch = targetUsers.slice(i, i + BATCH_SIZE);
      const records = batch.map((uid) => ({
        user_id: uid,
        title: data.title,
        body: data.body,
        type: data.type,
        read: false,
      }));

      const { error } = await supabaseAdmin.from("notifications").insert(records as any);
      if (!error) inserted += batch.length;
    }

    return { success: true, notifiedCount: inserted, totalTarget: targetUsers.length };
  });
