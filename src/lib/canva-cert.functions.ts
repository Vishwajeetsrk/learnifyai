import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listCanvaTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("canva_templates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error && error.code !== "42P01") throw new Error(error.message);
    return data ?? [];
  });

export const saveCanvaTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1),
      category: z.string().default("Professional"),
      bg_image_url: z.string().url(),
      thumbnail_url: z.string().url().optional(),
      fields_json: z.any().optional(),
      theme_colors: z.any().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const defaultFields = {
      studentName: { x: 50, y: 42, fontSize: 48, fontFamily: "Great Vibes", color: "#1a2744" },
      courseName: { x: 50, y: 55, fontSize: 28, fontFamily: "Georgia", color: "#0a6e8a", fontWeight: "bold" },
      description: { x: 50, y: 62, fontSize: 14, fontFamily: "Georgia", color: "#555" },
      date: { x: 72, y: 78, fontSize: 14, fontFamily: "Georgia", color: "#333" },
      signatureName: { x: 20, y: 78, fontSize: 24, fontFamily: "Great Vibes", color: "#1a2744" },
      signatureTitle: { x: 20, y: 82, fontSize: 11, fontFamily: "Georgia", color: "#666" },
      certId: { x: 85, y: 8, fontSize: 10, fontFamily: "monospace", color: "#999" },
      badgeText: { x: 50, y: 90, fontSize: 9, fontFamily: "Georgia", color: "#888" },
    };
    const defaultColors = { primary: "#0a1628", accent: "#c9a84c", background: "#f5f0e8", text: "#1a2744" };

    const row = {
      name: data.name,
      category: data.category,
      bg_image_url: data.bg_image_url,
      thumbnail_url: data.thumbnail_url ?? null,
      fields_json: data.fields_json ?? defaultFields,
      theme_colors: data.theme_colors ?? defaultColors,
      updated_at: now,
    };

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("canva_templates")
        .update(row)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    } else {
      const { data: inserted, error } = await supabaseAdmin
        .from("canva_templates")
        .insert({ ...row, created_by: context.userId!, created_at: now })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: inserted!.id };
    }
  });

export const deleteCanvaTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("canva_templates")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

const COLOR_SCHEMES = [
  { min: 1, max: 4, name: "Teal & Gold", primary: "#0d5c5c", accent: "#c9a84c", background: "#f5f0e8", text: "#0d5c5c", category: "Technology" },
  { min: 5, max: 8, name: "Navy & Gold", primary: "#0a1628", accent: "#c9a84c", background: "#f5f0e8", text: "#0a1628", category: "Professional" },
  { min: 9, max: 12, name: "Royal Blue & Gold", primary: "#1a3a6b", accent: "#c9a84c", background: "#f5f0e8", text: "#1a3a6b", category: "Academic" },
  { min: 13, max: 16, name: "Orange & Navy", primary: "#e67e22", accent: "#c9a84c", background: "#f5f0e8", text: "#0a1628", category: "Achievement" },
  { min: 17, max: 20, name: "Purple & Gold", primary: "#2d1b69", accent: "#c9a84c", background: "#f5f0e8", text: "#2d1b69", category: "Certification" },
  { min: 21, max: 24, name: "Burgundy & Gold", primary: "#6b1d3a", accent: "#c9a84c", background: "#f5f0e8", text: "#6b1d3a", category: "Executive" },
  { min: 25, max: 28, name: "Pink & Gold", primary: "#8b1a6b", accent: "#c9a84c", background: "#f5f0e8", text: "#8b1a6b", category: "Professional" },
  { min: 29, max: 30, name: "Emerald & Gold", primary: "#065f46", accent: "#c9a84c", background: "#f5f0e8", text: "#065f46", category: "Academic" },
];

const DEFAULT_FIELDS = {
  studentName: { x: 50, y: 42, fontSize: 52, fontFamily: "Great Vibes", color: "#1a2744", fontWeight: "normal", variable: "{{student_name}}" },
  courseName: { x: 50, y: 55, fontSize: 26, fontFamily: "Georgia", color: "#0a6e8a", fontWeight: "bold", variable: "{{course_name}}" },
  description: { x: 50, y: 62, fontSize: 13, fontFamily: "Georgia", color: "#555555", text: "and has demonstrated the knowledge and skills\nrequired to complete the course." },
  date: { x: 72, y: 78, fontSize: 14, fontFamily: "Georgia", color: "#333333", variable: "{{issue_date}}" },
  signatureName: { x: 20, y: 76, fontSize: 28, fontFamily: "Great Vibes", color: "#1a2744", variable: "{{signature_name}}" },
  signatureTitle: { x: 20, y: 80, fontSize: 11, fontFamily: "Georgia", color: "#666666", text: "Founder & CEO, Learnify AI" },
  certId: { x: 85, y: 8, fontSize: 11, fontFamily: "monospace", color: "#999999", variable: "{{certificate_id}}" },
  badgeText: { x: 50, y: 92, fontSize: 9, fontFamily: "Georgia", color: "#888888", text: "AI-Powered Learning  |  Industry Relevant  |  Career Focused  |  Lifetime Access" },
};

export const seedAllTemplates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    for (let num = 1; num <= 30; num++) {
      const fileName = `${num} certification.png`;
      const scheme = COLOR_SCHEMES.find((s) => num >= s.min && num <= s.max) || COLOR_SCHEMES[0];

      // Check if template already exists by name
      const { data: existing } = await supabaseAdmin
        .from("canva_templates")
        .select("id")
        .eq("name", `${scheme.name} - Template ${num}`)
        .limit(1);

      if (existing && existing.length > 0) {
        results.skipped++;
        continue;
      }

      const bgUrl = `/templates/${fileName}`;

      const { error } = await supabaseAdmin.from("canva_templates").insert({
        name: `${scheme.name} - Template ${num}`,
        category: scheme.category,
        bg_image_url: bgUrl,
        thumbnail_url: bgUrl,
        fields_json: DEFAULT_FIELDS,
        theme_colors: { primary: scheme.primary, accent: scheme.accent, background: scheme.background, text: scheme.text },
        created_by: context.userId!,
      });

      if (error) {
        results.errors.push(`Template ${num}: ${error.message}`);
      } else {
        results.created++;
      }
    }

    return results;
  });
