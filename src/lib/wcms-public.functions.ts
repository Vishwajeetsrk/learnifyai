import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// Public WCMS — No auth required. Fetches published pages + blocks.
// ═══════════════════════════════════════════════════════════════

export const wcmsGetPublicPage = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: page, error: pageErr } = await (supabaseAdmin as any)
      .from("wcms_pages")
      .select(
        "id, slug, title, description, meta_title, meta_description, og_image_url, template, sort_order",
      )
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();

    if (pageErr) throw pageErr;
    if (!page) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: blocks, error: blockErr } = await (supabaseAdmin as any)
      .from("wcms_blocks")
      .select("id, block_type, label, content, sort_order, visible")
      .eq("page_id", page.id)
      .eq("visible", true)
      .order("sort_order", { ascending: true });

    if (blockErr) throw blockErr;

    return { ...page, blocks: blocks ?? [] };
  });

export const wcmsGetPublicPages = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from("wcms_pages")
    .select("id, slug, title, description, template, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const wcmsGetPublicFeatures = createServerFn({ method: "GET" }).handler(async () => {
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

export const wcmsGetPublicMenu = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ menuKey: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: items, error } = await (supabaseAdmin as any)
      .from("wcms_menus")
      .select("id, label, url, icon, parent_id, sort_order, open_new_tab")
      .eq("menu_key", data.menuKey)
      .eq("visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return items ?? [];
  });
