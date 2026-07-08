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
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string(),
        type: z.string().optional().default("Certificate"),
        layout: z.string().optional().default("classic"),
        bg_image_url: z.string().optional().nullable(),
        config_json: z.any(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;
    const templateType = data.type ?? "Certificate";
    const templateLayout = data.layout ?? "classic";

    if (data.id) {
      const { error } = await (supabaseAdmin as any)
        .from("certificate_templates")
        .update({
          name: data.name,
          type: templateType,
          layout: templateLayout,
          bg_image_url: data.bg_image_url ?? null,
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
          type: templateType,
          layout: templateLayout,
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
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("certificate_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listCertificates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("certificates")
      .select("id, code, user_id, score, created_at, course:course_id(title), user:user_id(email)")
      .order("created_at", { ascending: false });

    if (error && error.code !== "42P01") throw new Error(error.message);
    return data ?? [];
  });

export const verifyCertificateByCode = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ code: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cert, error } = await supabaseAdmin
      .from("certificates")
      .select("id, code, score, created_at, user_id, course:course_id(title)")
      .eq("code", data.code)
      .single();

    if (error) return { found: false, cert: null };
    return { found: true, cert };
  });
