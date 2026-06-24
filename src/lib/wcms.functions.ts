import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ═══════════════════════════════════════════════════════════════
// WCMS Server Functions — Page, Block, Media, Feature, Menu, Section
// ═══════════════════════════════════════════════════════════════

async function checkAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: roles } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: Record<string, unknown>) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin role required");
  }
  return userRoles;
}

// ──────────────── Pages ────────────────

export const wcmsListPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from("wcms_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const wcmsGetPage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: page, error } = await (supabaseAdmin as any)
      .from("wcms_pages")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw error;
    return page;
  });

export const wcmsUpsertPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        slug: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        meta_title: z.string().optional(),
        meta_description: z.string().optional(),
        og_image_url: z.string().optional(),
        published: z.boolean().optional(),
        template: z.string().optional(),
        sort_order: z.number().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const upsertData: Record<string, unknown> = {
      slug: data.slug,
      title: data.title,
      description: data.description ?? null,
      meta_title: data.meta_title ?? null,
      meta_description: data.meta_description ?? null,
      og_image_url: data.og_image_url ?? null,
      published: data.published ?? false,
      template: data.template ?? "default",
      sort_order: data.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any)
        .from("wcms_pages")
        .update(upsertData)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      upsertData.created_by = context.userId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from("wcms_pages").insert(upsertData);
      if (error) throw error;
    }
    return { success: true };
  });

export const wcmsDeletePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("wcms_pages").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── Blocks ────────────────

export const wcmsListBlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ pageId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: blocks, error } = await (supabaseAdmin as any)
      .from("wcms_blocks")
      .select("*")
      .eq("page_id", data.pageId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return blocks ?? [];
  });

export const wcmsSaveBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        pageId: z.string().uuid(),
        blocks: z.array(
          z.object({
            id: z.string().uuid().optional(),
            block_type: z.string(),
            label: z.string().optional(),
            content: z.any(),
            sort_order: z.number(),
            visible: z.boolean().optional(),
          }),
        ),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Delete existing blocks for this page, then re-insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any).from("wcms_blocks").delete().eq("page_id", data.pageId);

    if (data.blocks.length > 0) {
      const rows = data.blocks.map((b) => ({
        page_id: data.pageId,
        block_type: b.block_type,
        label: b.label ?? null,
        content: b.content,
        sort_order: b.sort_order,
        visible: b.visible ?? true,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from("wcms_blocks").insert(rows);
      if (error) throw error;
    }
    return { success: true };
  });

export const wcmsDeleteBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("wcms_blocks").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── Media Library ────────────────

export const wcmsListMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        folder: z.string().optional(),
        tags: z.array(z.string()).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseAdmin as any).from("media_library").select("*");
    if (data.folder) query = query.eq("folder", data.folder);
    if (data.tags && data.tags.length > 0) query = query.overlaps("tags", data.tags);
    query = query.order("created_at", { ascending: false });
    if (data.limit) query = query.range(data.offset ?? 0, (data.offset ?? 0) + data.limit - 1);
    const { data: media, error } = await query;
    if (error) throw error;
    return media ?? [];
  });

export const wcmsUploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        filename: z.string(),
        original_name: z.string(),
        mime_type: z.string(),
        size_bytes: z.number(),
        url: z.string(),
        alt_text: z.string().optional(),
        folder: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("media_library").insert({
      filename: data.filename,
      original_name: data.original_name,
      mime_type: data.mime_type,
      size_bytes: data.size_bytes,
      url: data.url,
      alt_text: data.alt_text ?? null,
      folder: data.folder ?? "/",
      tags: data.tags ?? [],
      uploaded_by: context.userId,
    });
    if (error) throw error;
    return { success: true };
  });

export const wcmsUpdateMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        alt_text: z.string().optional(),
        folder: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const updateData: Record<string, unknown> = {};
    if (data.alt_text !== undefined) updateData.alt_text = data.alt_text;
    if (data.folder !== undefined) updateData.folder = data.folder;
    if (data.tags !== undefined) updateData.tags = data.tags;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("media_library")
      .update(updateData)
      .eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

export const wcmsDeleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("media_library").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── Features ────────────────

export const wcmsListFeatures = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from("wcms_features")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const wcmsPublicFeatures = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from("wcms_features")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const wcmsUpsertFeature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        key: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        category: z.string().optional(),
        color: z.string().optional(),
        url: z.string().optional(),
        badge: z.string().optional(),
        sort_order: z.number().optional(),
        enabled: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const upsertData: Record<string, unknown> = {
      key: data.key,
      name: data.name,
      description: data.description ?? null,
      icon: data.icon ?? "Sparkles",
      category: data.category ?? "general",
      color: data.color ?? "#6366f1",
      url: data.url ?? null,
      badge: data.badge ?? null,
      sort_order: data.sort_order ?? 0,
      enabled: data.enabled ?? true,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any)
        .from("wcms_features")
        .update(upsertData)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from("wcms_features").insert(upsertData);
      if (error) throw error;
    }
    return { success: true };
  });

export const wcmsDeleteFeature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("wcms_features").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── Menus ────────────────

export const wcmsListMenus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ menuKey: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseAdmin as any).from("wcms_menus").select("*");
    if (data.menuKey) query = query.eq("menu_key", data.menuKey);
    query = query.order("sort_order", { ascending: true });
    const { data: menus, error } = await query;
    if (error) throw error;
    return menus ?? [];
  });

export const wcmsSaveMenus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        menuKey: z.string(),
        items: z.array(
          z.object({
            id: z.string().uuid().optional(),
            label: z.string(),
            url: z.string().optional(),
            icon: z.string().optional(),
            parent_id: z.string().uuid().optional().nullable(),
            sort_order: z.number(),
            visible: z.boolean().optional(),
            open_new_tab: z.boolean().optional(),
          }),
        ),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any).from("wcms_menus").delete().eq("menu_key", data.menuKey);

    if (data.items.length > 0) {
      const rows = data.items.map((item) => ({
        menu_key: data.menuKey,
        label: item.label,
        url: item.url ?? null,
        icon: item.icon ?? null,
        parent_id: item.parent_id ?? null,
        sort_order: item.sort_order,
        visible: item.visible ?? true,
        open_new_tab: item.open_new_tab ?? false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from("wcms_menus").insert(rows);
      if (error) throw error;
    }
    return { success: true };
  });

export const wcmsDeleteMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("wcms_menus").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── Sections (Reusable Blocks) ────────────────

export const wcmsListSections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from("wcms_sections")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const wcmsUpsertSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        key: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        block_type: z.string(),
        content: z.any(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const upsertData: Record<string, unknown> = {
      key: data.key,
      name: data.name,
      description: data.description ?? null,
      block_type: data.block_type,
      content: data.content,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any)
        .from("wcms_sections")
        .update(upsertData)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from("wcms_sections").insert(upsertData);
      if (error) throw error;
    }
    return { success: true };
  });

export const wcmsDeleteSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId!);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("wcms_sections").delete().eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── Roadmaps ────────────────

export const wcmsListRoadmaps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        learnerId: z.string().uuid().optional(),
        templatesOnly: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseAdmin as any).from("coaching_roadmaps").select("*");

    if (data.templatesOnly) {
      query = query.eq("is_template", true).not("published_at", "is", null);
    } else if (data.learnerId) {
      query = query.or(`learner_id.eq.${data.learnerId},creator_id.eq.${context.userId}`);
    } else {
      query = query.eq("creator_id", context.userId!);
    }

    query = query.order("created_at", { ascending: false });
    const { data: roadmaps, error } = await query;
    if (error) throw error;
    return roadmaps ?? [];
  });

export const wcmsSaveRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        learner_id: z.string().uuid().optional().nullable(),
        title: z.string().min(1),
        description: z.string().optional(),
        skill_level: z.string().optional(),
        estimated_hours: z.number().optional(),
        status: z.string().optional(),
        source: z.string().optional(),
        ai_prompt: z.string().optional(),
        phases: z.any(),
        tags: z.array(z.string()).optional(),
        is_template: z.boolean().optional(),
        published_at: z.string().optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const upsertData: Record<string, unknown> = {
      creator_id: context.userId,
      learner_id: data.learner_id ?? null,
      title: data.title,
      description: data.description ?? null,
      skill_level: data.skill_level ?? "beginner",
      estimated_hours: data.estimated_hours ?? 10,
      status: data.status ?? "draft",
      source: data.source ?? "manual",
      ai_prompt: data.ai_prompt ?? null,
      phases: data.phases,
      tags: data.tags ?? [],
      is_template: data.is_template ?? false,
      published_at: data.published_at ?? null,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any)
        .from("coaching_roadmaps")
        .update(upsertData)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from("coaching_roadmaps").insert(upsertData);
      if (error) throw error;
    }
    return { success: true };
  });

export const wcmsDeleteRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("coaching_roadmaps")
      .delete()
      .eq("id", data.id)
      .eq("creator_id", context.userId!);
    if (error) throw error;
    return { success: true };
  });

export const wcmsDuplicateRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: original, error: fetchErr } = await (supabaseAdmin as any)
      .from("coaching_roadmaps")
      .select("*")
      .eq("id", data.id)
      .single();
    if (fetchErr) throw fetchErr;

    const { id: _oldId, created_at: _ca, updated_at: _ua, ...rest } = original;
    rest.title = `${rest.title} (Copy)`;
    rest.creator_id = context.userId;
    rest.status = "draft";
    rest.is_template = false;
    rest.published_at = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("coaching_roadmaps").insert(rest);
    if (error) throw error;
    return { success: true };
  });

// ──────────────── AI Roadmap Generation ────────────────

export const wcmsGenerateAiRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ prompt: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { generateText } = await import("ai");
    const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");

    const key = process.env.OPENROUTER_API_KEY?.trim();
    if (!key) throw new Error("AI not configured. Add OPENROUTER_API_KEY.");

    const provider = createOpenAICompatible({
      name: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://learnify.ai",
        "X-Title": "Learnify AI Roadmap Generator",
      },
    });

    const result = await generateText({
      model: provider("meta-llama/llama-3.3-70b-instruct:free"),
      prompt: `You are an expert learning coach. Create a detailed, structured learning roadmap for: "${data.prompt}"

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "title": "Roadmap title",
  "description": "Brief overview",
  "skill_level": "beginner|intermediate|advanced|expert",
  "estimated_hours": 40,
  "tags": ["tag1", "tag2"],
  "phases": [
    {
      "title": "Phase title",
      "description": "What this phase covers",
      "skills": ["skill1", "skill2"],
      "estimated_hours": 10,
      "resources": [
        { "title": "Resource name", "url": "https://...", "type": "video|article|course|book|practice" }
      ],
      "milestones": [
        { "title": "Milestone to complete", "completed": false }
      ]
    }
  ]
}

Make 3-6 phases. Each phase should have 2-5 skills, 2-3 resources, and 2-4 milestones.
Be specific and practical. Include real resource suggestions where possible.`,
    });

    let text = result.text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    return JSON.parse(text);
  });
