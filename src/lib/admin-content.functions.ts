import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALLOWED_TABLES = [
  "events",
  "job_postings",
  "faqs",
  "site_settings",
  "certificate_templates",
  "cohorts",
  "pricing_plans",
] as const;

const actionSchema = z.object({
  table: z.enum(ALLOWED_TABLES),
  action: z.enum(["insert", "update", "delete"]),
  data: z.any().optional(),
  id: z.string().optional(),
  matchKey: z.string().optional(),
});

async function checkAdminRole(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin role required");
  }
  return userRoles;
}

export const adminContentAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => actionSchema.parse(d))
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.action === "delete") {
      if (!data.id) throw new Error("id required for delete");
      const { error } = await (supabaseAdmin as any)
        .from(data.table)
        .delete()
        .eq(data.matchKey || "id", data.id);
      if (error) throw error;
      return { success: true };
    }

    if (data.action === "insert") {
      const { error } = await (supabaseAdmin as any).from(data.table).insert(data.data);
      if (error) throw error;
      return { success: true };
    }

    if (data.action === "update") {
      if (!data.id) throw new Error("id required for update");
      const { error } = await (supabaseAdmin as any)
        .from(data.table)
        .update(data.data)
        .eq(data.matchKey || "id", data.id);
      if (error) throw error;
      return { success: true };
    }

    throw new Error("Invalid action");
  });

export const adminContentUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        table: z.enum(ALLOWED_TABLES),
        data: z.any(),
        onConflict: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const opts: any = {};
    if (data.onConflict) opts.onConflict = data.onConflict;

    const { error } = await (supabaseAdmin as any)
      .from(data.table)
      .upsert(data.data, opts);
    if (error) throw error;
    return { success: true };
  });
