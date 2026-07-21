import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAdminAction } from "./admin-audit.functions";

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
  "design_projects",
  "system_design_topics",
  "concept_graphs",
  "explanations_cache",
  "store_items",
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

export const adminContentAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => actionSchema.parse(d))
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const tableName: string = data.table;

    if (data.action === "delete") {
      if (!data.id) throw new Error("id required for delete");
      const { error } = await (supabaseAdmin.from(tableName as any) as any)
        .delete()
        .eq(data.matchKey || "id", data.id);
      if (error) {
        console.error("Delete failed:", error.message);
        throw error;
      }
      logAdminAction({
        data: { action: "delete", entityType: tableName, entityId: data.id },
      }).catch(() => {});
      return { success: true };
    }

    if (data.action === "insert") {
      const { error } = await supabaseAdmin.from(tableName as never).insert(data.data);
      if (error) throw error;
      logAdminAction({
        data: {
          action: "insert",
          entityType: tableName,
          metadata: { title: data.data?.title || data.data?.slug },
        },
      }).catch(() => {});
      return { success: true };
    }

    if (data.action === "update") {
      if (!data.id) throw new Error("id required for update");
      // Strip yearly_price for pricing_plans — column may not exist in schema yet
      let updateData = data.data as any;
      if (tableName === "pricing_plans" && updateData) {
        const { yearly_price, ...rest } = updateData;
        updateData = rest;
      }
      const { error } = await (supabaseAdmin.from(tableName as any) as any)
        .update(updateData)
        .eq(data.matchKey || "id", data.id);
      if (error) throw error;
      logAdminAction({
        data: {
          action: "update",
          entityType: tableName,
          entityId: data.id,
          metadata: { title: data.data?.title },
        },
      }).catch(() => {});
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
    let query = supabaseAdmin.from(data.table as any).select(data.columns || "*");
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

    const { error } = await supabaseAdmin.from(data.table as any).upsert(data.data, opts);
    if (error) throw error;
    return { success: true };
  });

export const cleanupTestEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: testEvents, error: fetchError } = await (supabaseAdmin.from("events") as any)
      .select("id, title")
      .or("title.ilike.%Test Event%,title.ilike.%test%");

    if (fetchError) throw fetchError;
    if (!testEvents || testEvents.length === 0) return { deleted: 0 };

    const ids = testEvents.map((e: any) => e.id);
    const { error: deleteError } = await supabaseAdmin.from("events").delete().in("id", ids);

    if (deleteError) throw deleteError;
    return { deleted: ids.length };
  });

export const cleanDuplicateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch all current settings
    const { data: settings, error } = await supabaseAdmin
      .from("site_settings")
      .select("key,value");

    if (error) throw error;
    if (!settings) return { success: true, message: "No settings to clean" };

    const originalSettings = settings as { key: string; value: string | null }[];

    // Map labels in SETTING_FIELDS to their correct keys
    const labelToKeyMap: Record<string, string> = {
      "Contact email": "contact_email",
      "Careers email": "careers_email",
      "Discord URL": "discord_url",
      "Discord tagline": "discord_label",
      "X (Twitter) URL": "twitter_url",
      "X handle": "twitter_handle",
      "GitHub URL": "github_url",
      "LinkedIn URL": "linkedin_url",
      "YouTube URL": "youtube_url",
      "Instagram URL": "instagram_url",
      "Auto-delete past events (true/false)": "events_auto_delete_enabled",
      "Auto-delete events after (hours)": "events_auto_delete_hours",
      "Auto-close jobs past close date (true/false)": "jobs_auto_close_enabled",
      "Invoice company name": "invoice_company_name",
      "Invoice legal name": "invoice_legal_name",
      "Invoice GSTIN": "invoice_gstin",
      "Invoice number prefix": "invoice_prefix",
      "Invoice footer text": "invoice_footer",
      "Invoice logo URL": "invoice_logo_url",
      "Invoice contact (email/phone)": "invoice_contact",
      "Tour / Demo video URL": "tour_video_url",
      "Hero title": "hero_title",
      "Hero subtitle": "hero_subtitle",
    };

    const mergedValues: Record<string, string> = {};
    const keysToDelete: string[] = [];

    for (const item of originalSettings) {
      const origKey = item.key;
      const val = item.value ?? "";

      let cleanKey = origKey;

      if (labelToKeyMap[origKey]) {
        cleanKey = labelToKeyMap[origKey];
      } else {
        cleanKey = origKey
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "_")
          .replace(/__+/g, "_");
      }

      if (cleanKey !== origKey) {
        keysToDelete.push(origKey);

        if (!mergedValues[cleanKey]) {
          const existingCleanItem = originalSettings.find(s => s.key === cleanKey);
          const existingCleanVal = existingCleanItem?.value ?? "";
          mergedValues[cleanKey] = existingCleanVal || val;
        } else if (val) {
          mergedValues[cleanKey] = mergedValues[cleanKey] || val;
        }
      } else {
        if (mergedValues[cleanKey] === undefined) {
          mergedValues[cleanKey] = val;
        }
      }
    }

    // A. Delete duplicate/unclean keys
    if (keysToDelete.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from("site_settings")
        .delete()
        .in("key", keysToDelete);
      if (deleteError) throw deleteError;
    }

    // B. Upsert merged clean keys
    const upsertData = Object.entries(mergedValues).map(([key, value]) => ({
      key,
      value,
    }));

    if (upsertData.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from("site_settings")
        .upsert(upsertData, { onConflict: "key" });
      if (upsertError) throw upsertError;
    }

    return {
      success: true,
      deletedKeys: keysToDelete,
      updatedKeys: Object.keys(mergedValues),
    };
  });

