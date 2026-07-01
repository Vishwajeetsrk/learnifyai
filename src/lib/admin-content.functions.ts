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
  "wcms_pages",
  "wcms_blocks",
  "wcms_features",
  "wcms_menus",
  "wcms_sections",
  "media_library",
  "coaching_roadmaps",
  "blog_posts",
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
  .validator((d: unknown) => actionSchema.parse(d))
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

export const adminContentQuery = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        table: z.enum(ALLOWED_TABLES),
        columns: z.string().optional(),
        orderBy: z.string().optional(),
        ascending: z.boolean().optional(),
        orderBy2: z.string().optional(),
        ascending2: z.boolean().optional(),
        limit: z.number().optional(),
        eqFilter: z.object({ column: z.string(), value: z.string() }).optional(),
        eqFilter2: z.object({ column: z.string(), value: z.string() }).optional(),
        inFilter: z.object({ column: z.string(), values: z.array(z.string()) }).optional(),
        single: z.boolean().optional(),
        maybeSingle: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = (supabaseAdmin as any).from(data.table).select(data.columns || "*");
    if (data.eqFilter) {
      query = query.eq(data.eqFilter.column, data.eqFilter.value);
    }
    if (data.eqFilter2) {
      query = query.eq(data.eqFilter2.column, data.eqFilter2.value);
    }
    if (data.inFilter) {
      query = query.in(data.inFilter.column, data.inFilter.values);
    }
    if (data.orderBy) {
      query = query.order(data.orderBy, { ascending: data.ascending ?? true });
    }
    if (data.orderBy2) {
      query = query.order(data.orderBy2, { ascending: data.ascending2 ?? true });
    }
    if (data.limit) {
      query = query.limit(data.limit);
    }
    if (data.single) {
      const { data: result, error } = await query.single();
      if (error) throw error;
      return result ?? null;
    }
    if (data.maybeSingle) {
      const { data: result, error } = await query.maybeSingle();
      if (error) throw error;
      return result ?? null;
    }
    const { data: result, error } = await query;
    if (error) throw error;
    return result ?? [];
  });

export const adminContentUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
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

    const { error } = await (supabaseAdmin as any).from(data.table).upsert(data.data, opts);
    if (error) throw error;
    return { success: true };
  });

export const cleanupTestEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: testEvents, error: fetchError } = await (supabaseAdmin as any)
      .from("events")
      .select("id, title")
      .like("title", "Test Event%");

    if (fetchError) throw fetchError;
    if (!testEvents || testEvents.length === 0) return { deleted: 0 };

    const ids = testEvents.map((e: any) => e.id);
    const { error: deleteError } = await (supabaseAdmin as any)
      .from("events")
      .delete()
      .in("id", ids);

    if (deleteError) throw deleteError;
    return { deleted: ids.length };
  });
