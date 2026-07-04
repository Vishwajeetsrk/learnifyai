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
    const defaultFields = { ...DEFAULT_FIELDS };
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

// All 22 field definitions with accurate positions matching the 30 template images
export const DEFAULT_FIELDS = {
  // Top section - Logo and Certificate ID
  learnifyLogo: { x: 38, y: 8, width: 150, height: 50, type: "image", src: "/Logo Learnify AI.png", align: "center" },
  certIdLabel: { x: 82, y: 5.5, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#666666", fontWeight: "normal", text: "Certificate ID", align: "center" },
  certId: { x: 82, y: 7.5, fontSize: 13, fontFamily: "monospace", color: "#0a1628", fontWeight: "bold", variable: "{{certificate_id}}", align: "center" },

  // Title section
  title: { x: 50, y: 17, fontSize: 52, fontFamily: "Playfair Display, Georgia, serif", color: "#0a1628", fontWeight: "bold", text: "CERTIFICATE", align: "center" },
  subtitle: { x: 50, y: 22.5, fontSize: 16, fontFamily: "Inter, sans-serif", color: "#c9a84c", fontWeight: "600", letterSpacing: "0.2em", text: "OF COMPLETION", align: "center" },

  // Certify text and student name
  certifyText: { x: 50, y: 27, fontSize: 13, fontFamily: "Inter, sans-serif", color: "#555555", fontWeight: "normal", text: "This is to certify that", align: "center" },
  studentName: { x: 50, y: 34, fontSize: 52, fontFamily: "Great Vibes, cursive", color: "#0a1628", fontWeight: "normal", variable: "{{student_name}}", align: "center" },

  // Course completion text
  completeText: { x: 50, y: 42, fontSize: 13, fontFamily: "Inter, sans-serif", color: "#555555", fontWeight: "normal", text: "has successfully completed the course", align: "center" },
  courseName: { x: 50, y: 47, fontSize: 24, fontFamily: "Inter, sans-serif", color: "#0a6e8a", fontWeight: "bold", variable: "{{course_name}}", align: "center" },
  description: { x: 50, y: 52, fontSize: 12, fontFamily: "Inter, sans-serif", color: "#666666", fontWeight: "normal", text: "and has demonstrated the knowledge and skills\nrequired to complete the course.", align: "center" },

  // Signature section (bottom left)
  signatureImage: { x: 22, y: 66, width: 100, height: 40, type: "image", src: null, align: "center" },
  signatureName: { x: 22, y: 70, fontSize: 24, fontFamily: "Great Vibes, cursive", color: "#0a1628", fontWeight: "normal", variable: "{{signature_name}}", align: "center" },
  signatureTitle: { x: 22, y: 73.5, fontSize: 11, fontFamily: "Inter, sans-serif", color: "#333333", fontWeight: "600", variable: "{{signature_title}}", align: "center" },
  signatureRole: { x: 22, y: 76, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#666666", fontWeight: "normal", text: "Founder & CEO, Learnify AI", align: "center" },

  // Center logo (bottom center)
  centerLogo: { x: 50, y: 68, width: 80, height: 80, type: "image", src: "/Logo Learnify AI.png", align: "center" },

  // Date section (bottom right)
  date: { x: 72, y: 68, fontSize: 14, fontFamily: "Inter, sans-serif", color: "#333333", fontWeight: "600", variable: "{{issue_date}}", align: "center" },
  dateLabel: { x: 72, y: 71.5, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#888888", fontWeight: "normal", text: "Date of Completion", align: "center" },

  // QR Code section (bottom right)
  qrCode: { x: 87, y: 65, width: 80, height: 80, type: "qr", align: "center" },
  verifyLabel: { x: 87, y: 74, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#0a6e8a", fontWeight: "600", text: "Verify Certificate", align: "center" },

  // Bottom badge bar
  badgeAi: { x: 15, y: 88, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#555555", fontWeight: "500", text: "AI-Powered Learning", align: "center" },
  badgeIndustry: { x: 37, y: 88, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#555555", fontWeight: "500", text: "Industry Relevant", align: "center" },
  badgeCareer: { x: 60, y: 88, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#555555", fontWeight: "500", text: "Career Focused", align: "center" },
  badgeAccess: { x: 82, y: 88, fontSize: 10, fontFamily: "Inter, sans-serif", color: "#555555", fontWeight: "500", text: "Lifetime Access", align: "center" },
};

// Per-template position adjustments based on color scheme group
export function getTemplateFields(templateNum: number): Record<string, any> {
  const fields = JSON.parse(JSON.stringify(DEFAULT_FIELDS)) as Record<string, any>;

  if (templateNum >= 1 && templateNum <= 4) {
    fields.learnifyLogo.y = 9.5; fields.certIdLabel.y = 4.5; fields.certId.y = 6.5;
    fields.title.y = 19; fields.subtitle.y = 24;
    fields.studentName.y = 36; fields.courseName.y = 49;
  }
  else if (templateNum >= 5 && templateNum <= 8) { /* default */ }
  else if (templateNum >= 9 && templateNum <= 12) {
    fields.title.y = 16; fields.subtitle.y = 21.5;
    fields.studentName.y = 33; fields.courseName.y = 46;
    fields.signatureName.x = 24; fields.signatureTitle.x = 24; fields.signatureRole.x = 24;
  }
  else if (templateNum >= 13 && templateNum <= 16) {
    fields.learnifyLogo.y = 10; fields.title.y = 20; fields.subtitle.y = 25.5;
    fields.studentName.y = 37; fields.date.y = 70; fields.dateLabel.y = 73.5;
  }
  else if (templateNum >= 17 && templateNum <= 20) { /* default */ }
  else if (templateNum >= 21 && templateNum <= 24) {
    fields.learnifyLogo.x = 36; fields.learnifyLogo.y = 9;
    fields.title.y = 19; fields.subtitle.y = 24.5;
    fields.date.x = 70; fields.qrCode.x = 85;
  }
  else if (templateNum >= 25 && templateNum <= 28) { /* default */ }
  else if (templateNum >= 29 && templateNum <= 30) {
    fields.studentName.y = 35; fields.courseName.y = 48;
    fields.signatureName.x = 24;
  }

  return fields;
}

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
        fields_json: getTemplateFields(num),
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

export const updateAllTemplateFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const results = { updated: 0, skipped: 0, errors: [] as string[] };

    const { data: all } = await supabaseAdmin
      .from("canva_templates")
      .select("id, name, fields_json");

    if (!all || all.length === 0) {
      return { ...results, message: "No templates found" };
    }

    for (const tpl of all) {
      const numMatch = tpl.name.match(/Template (\d+)/);
      const num = numMatch ? parseInt(numMatch[1]) : 0;

      if (num < 1 || num > 30) {
        const existingKeys = Object.keys(tpl.fields_json || {});
        if (existingKeys.length >= 22) {
          results.skipped++;
          continue;
        }
        const newFields = { ...DEFAULT_FIELDS, ...tpl.fields_json };
        const { error } = await supabaseAdmin
          .from("canva_templates")
          .update({ fields_json: newFields })
          .eq("id", tpl.id);
        if (error) {
          results.errors.push(`${tpl.name}: ${error.message}`);
        } else {
          results.updated++;
        }
        continue;
      }

      const newFields = getTemplateFields(num);
      const { error } = await supabaseAdmin
        .from("canva_templates")
        .update({ fields_json: newFields })
        .eq("id", tpl.id);

      if (error) {
        results.errors.push(`${tpl.name}: ${error.message}`);
      } else {
        results.updated++;
      }
    }

    return results;
  });
