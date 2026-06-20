import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error && error.code !== "42P01") {
      throw new Error(error.message);
    }
    return data ?? [];
  });

export const saveTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string(),
        type: z.string(),
        layout: z.string(),
        bg_image_url: z.string().optional().nullable(),
        config_json: z.any(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    if (data.id) {
      const { error } = await (supabaseAdmin as any)
        .from("certificate_templates")
        .update({
          name: data.name,
          type: data.type,
          layout: data.layout,
          bg_image_url: data.bg_image_url,
          config_json: data.config_json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: inserted, error } = await (supabaseAdmin as any)
        .from("certificate_templates")
        .insert({
          name: data.name,
          type: data.type,
          layout: data.layout,
          bg_image_url: data.bg_image_url,
          config_json: data.config_json,
          created_by: userId,
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { ok: true, id: inserted.id };
    }
  });

export const deleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("certificate_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
