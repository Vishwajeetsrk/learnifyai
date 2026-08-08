import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// SVG Template manifest categories
const SVG_CATEGORIES = [
  {
    id: "01-uiux-design",
    name: "UI/UX Design",
    folder: "01-UIUX-Design",
    count: 17,
    color: "#6366f1",
  },
  {
    id: "02-python-programming",
    name: "Python Programming",
    folder: "02-Python-Programming",
    count: 17,
    color: "#3b82f6",
  },
  {
    id: "03-web-development",
    name: "Web Development",
    folder: "03-Web-Development",
    count: 18,
    color: "#10b981",
  },
  {
    id: "04-excel-data-analysis",
    name: "Excel Data Analysis",
    folder: "04-Excel-Data-Analysis",
    count: 23,
    color: "#f59e0b",
  },
  {
    id: "05-data-structures",
    name: "Data Structures & Algorithms",
    folder: "05-Data-Structures",
    count: 20,
    color: "#ef4444",
  },
  {
    id: "06-digital-marketing",
    name: "Digital Marketing",
    folder: "06-Digital-Marketing",
    count: 25,
    color: "#ec4899",
  },
  {
    id: "07-ai-fundamentals",
    name: "AI Fundamentals",
    folder: "07-AI-Fundamentals",
    count: 14,
    color: "#8b5cf6",
  },
  {
    id: "08-data-structures-2",
    name: "Data Structures Advanced",
    folder: "08-Data-Structures-2",
    count: 20,
    color: "#06b6d4",
  },
];

// Default editable fields for SVG-based templates (percentage-based positions)
const SVG_DEFAULT_FIELDS = {
  title: {
    x: 50,
    y: 12,
    fontSize: 48,
    fontFamily: "Playfair Display, serif",
    color: "#1a1a2e",
    fontWeight: "bold",
    text: "CERTIFICATE",
    align: "center",
  },
  subtitle: {
    x: 50,
    y: 18,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    color: "#666666",
    fontWeight: "600",
    letterSpacing: "0.25em",
    text: "OF COMPLETION",
    align: "center",
  },
  certifyText: {
    x: 50,
    y: 24,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    text: "This is to certify that",
    align: "center",
  },
  studentName: {
    x: 50,
    y: 32,
    fontSize: 42,
    fontFamily: "Great Vibes, cursive",
    color: "#1a1a2e",
    fontWeight: "normal",
    variable: "{{student_name}}",
    align: "center",
  },
  completeText: {
    x: 50,
    y: 40,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    text: "has successfully completed the course",
    align: "center",
  },
  courseName: {
    x: 50,
    y: 46,
    fontSize: 22,
    fontFamily: "Inter, sans-serif",
    color: "#1a1a2e",
    fontWeight: "bold",
    variable: "{{course_name}}",
    align: "center",
  },
  description: {
    x: 50,
    y: 52,
    fontSize: 11,
    fontFamily: "Inter, sans-serif",
    color: "#666666",
    fontWeight: "normal",
    text: "and has demonstrated the knowledge and skills required",
    align: "center",
  },
  signatureName: {
    x: 22,
    y: 68,
    fontSize: 20,
    fontFamily: "Great Vibes, cursive",
    color: "#1a1a2e",
    fontWeight: "normal",
    variable: "{{signature_name}}",
    align: "center",
  },
  signatureTitle: {
    x: 22,
    y: 72,
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    color: "#666666",
    fontWeight: "600",
    variable: "{{signature_title}}",
    align: "center",
  },
  date: {
    x: 78,
    y: 68,
    fontSize: 13,
    fontFamily: "Inter, sans-serif",
    color: "#333333",
    fontWeight: "600",
    variable: "{{issue_date}}",
    align: "center",
  },
  dateLabel: {
    x: 78,
    y: 72,
    fontSize: 9,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    text: "Date of Completion",
    align: "center",
  },
  certId: {
    x: 50,
    y: 92,
    fontSize: 9,
    fontFamily: "monospace",
    color: "#999999",
    fontWeight: "normal",
    variable: "{{certificate_id}}",
    align: "center",
  },
};

// List all available SVG templates from the manifest
export const listSvgTemplates = createServerFn({ method: "GET" }).handler(async () => {
  const templates: any[] = [];
  for (const cat of SVG_CATEGORIES) {
    for (let i = 1; i <= cat.count; i++) {
      templates.push({
        id: `${cat.folder}-${i}`,
        name: `${cat.name} Template ${i}`,
        category: cat.name,
        categoryId: cat.id,
        bg_image_url: `/templates/${cat.folder}/${i}.svg`,
        thumbnail_url: `/templates/${cat.folder}/${i}.svg`,
        color: cat.color,
      });
    }
  }
  return templates;
});

// List SVG categories
export const listSvgCategories = createServerFn({ method: "GET" }).handler(
  async () => SVG_CATEGORIES,
);

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
    z
      .object({
        id: z.string().optional(),
        name: z.string().min(1),
        category: z.string().default("Professional"),
        bg_image_url: z.string().default(""),
        thumbnail_url: z.string().optional().nullable(),
        fields_json: z.any().optional(),
        theme_colors: z.any().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const defaultFields = { ...DEFAULT_FIELDS };
    const defaultColors = {
      primary: "#0a1628",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#1a2744",
    };

    const row = {
      name: data.name,
      category: data.category,
      bg_image_url: data.bg_image_url,
      thumbnail_url: data.thumbnail_url ?? null,
      fields_json: data.fields_json ?? defaultFields,
      theme_colors: data.theme_colors ?? defaultColors,
      updated_at: now,
    };

    if (data.id && data.id !== "new" && data.id !== "") {
      const { error } = await supabaseAdmin.from("canva_templates").update(row).eq("id", data.id);
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
    const { error } = await supabaseAdmin.from("canva_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// SVG Template categories (replaces old COLOR_SCHEMES)

// Default editable fields for SVG-based templates (percentage-based positions)
export const DEFAULT_FIELDS = SVG_DEFAULT_FIELDS;

// Get default fields for SVG templates
export function getTemplateFields(_templateNum?: number): Record<string, any> {
  return JSON.parse(JSON.stringify(SVG_DEFAULT_FIELDS)) as Record<string, any>;
}

export const seedAllTemplates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] };

    // First, delete ALL old templates to start fresh
    const { error: deleteError } = await supabaseAdmin
      .from("canva_templates")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) {
      results.errors.push(`Clear old templates: ${deleteError.message}`);
    }

    const PREMIUM_TEMPLATES = [
      {
        name: "Google Professional Certificate",
        category: "Professional",
        bg_image_url: "/templates/premium/google-cert.svg",
        thumbnail_url: "/templates/premium/google-cert.svg",
        theme_colors: {
          primary: "#4285f4",
          accent: "#fbbc05",
          background: "#fafafa",
          text: "#0f172a",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "Google Cloud",
            fontFamily: "Outfit, sans-serif",
            fontSize: 36,
            color: "#4285f4",
            x: 50,
            y: 12,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "PROFESSIONAL CERTIFICATE SPECIALIZATION",
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            color: "#64748b",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#0f172a",
            x: 50,
            y: 32,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Outfit, sans-serif",
            fontSize: 24,
            color: "#4285f4",
            x: 50,
            y: 46,
            align: "center",
          },
          learnifyLogo: {
            x: 88,
            y: 46,
            width: 70,
            height: 25,
            type: "image",
            src: "/templates/Logo Learnify AI.svg",
            align: "center",
          },
          qrCode: {
            x: 10,
            y: 75,
            width: 60,
            height: 60,
            type: "image",
            src: "/templates/Logo Learnify AI.svg",
            align: "center",
          },
        },
      },
      {
        name: "Microsoft Technical Specialist",
        category: "Technology",
        bg_image_url: "/templates/premium/microsoft-cert.svg",
        thumbnail_url: "/templates/premium/microsoft-cert.svg",
        theme_colors: {
          primary: "#0078d4",
          accent: "#f25f22",
          background: "#fcfdfd",
          text: "#1e293b",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "Microsoft Certified",
            fontFamily: "Inter, sans-serif",
            fontSize: 34,
            color: "#0078d4",
            x: 50,
            y: 12,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "TECHNICAL ASSOCIATE CREDENTIAL",
            fontFamily: "Inter, sans-serif",
            fontSize: 10,
            color: "#475569",
            x: 50,
            y: 18,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Inter, sans-serif",
            fontWeight: "bold",
            fontSize: 32,
            color: "#1e293b",
            x: 50,
            y: 32,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            color: "#0078d4",
            x: 50,
            y: 46,
            align: "center",
          },
          qrCode: {
            x: 12,
            y: 75,
            width: 60,
            height: 60,
            type: "image",
            src: "/templates/Logo Learnify AI.svg",
            align: "center",
          },
        },
      },
      {
        name: "Coursera Honors Specialization",
        category: "Academic",
        bg_image_url: "/templates/premium/coursera-cert.svg",
        thumbnail_url: "/templates/premium/coursera-cert.svg",
        theme_colors: {
          primary: "#d4af37",
          accent: "#8a6d2b",
          background: "#fdfaf4",
          text: "#1e1e1e",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "University Specialization",
            fontFamily: "Cinzel, serif",
            fontSize: 32,
            color: "#8a6d2b",
            x: 50,
            y: 12,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "HONORS CERTIFICATE OF ACCOMPLISHMENT",
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            color: "#555555",
            x: 50,
            y: 18,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#1a1a1a",
            x: 50,
            y: 32,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Cinzel, serif",
            fontSize: 20,
            color: "#8a6d2b",
            x: 50,
            y: 46,
            align: "center",
          },
          qrCode: {
            x: 83.5,
            y: 77,
            width: 60,
            height: 60,
            type: "image",
            src: "/templates/Logo Learnify AI.svg",
            align: "center",
          },
        },
      },
      {
        name: "Claude AI Prompt Engineer",
        category: "AI & Engineering",
        bg_image_url: "/templates/premium/claude-cert.svg",
        thumbnail_url: "/templates/premium/claude-cert.svg",
        theme_colors: {
          primary: "#8a7e6b",
          accent: "#d0c7b6",
          background: "#faf8f5",
          text: "#292524",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "Claude Engineering",
            fontFamily: "Playfair Display, serif",
            fontSize: 34,
            color: "#8a7e6b",
            x: 50,
            y: 12,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "ADVANCED PROMPT ARCHITECT CERTIFICATION",
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            color: "#78716c",
            x: 50,
            y: 18,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: "bold",
            fontSize: 32,
            color: "#292524",
            x: 50,
            y: 32,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Playfair Display, serif",
            fontSize: 22,
            color: "#8a7e6b",
            x: 50,
            y: 46,
            align: "center",
          },
          qrCode: {
            x: 11,
            y: 75,
            width: 60,
            height: 60,
            type: "image",
            src: "/templates/Logo Learnify AI.svg",
            align: "center",
          },
        },
      },
      {
        name: "Codex Advanced Developer",
        category: "Code & Algorithms",
        bg_image_url: "/templates/premium/codex-cert.svg",
        thumbnail_url: "/templates/premium/codex-cert.svg",
        theme_colors: {
          primary: "#00f2fe",
          accent: "#fe007c",
          background: "#080a13",
          text: "#ffffff",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "CODEX ACADEMY",
            fontFamily: "monospace",
            fontSize: 36,
            color: "#00f2fe",
            x: 50,
            y: 12,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "ADVANCED SOFTWARE ENGINEERING SPECIALIST",
            fontFamily: "monospace",
            fontSize: 9,
            color: "#a78bfa",
            x: 50,
            y: 18,
            align: "center",
          },
          certifyText: {
            ...SVG_DEFAULT_FIELDS.certifyText,
            color: "#94a3b8",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: 30,
            color: "#ffffff",
            x: 50,
            y: 32,
            align: "center",
          },
          completeText: {
            ...SVG_DEFAULT_FIELDS.completeText,
            color: "#94a3b8",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "monospace",
            fontSize: 20,
            color: "#fe007c",
            x: 50,
            y: 46,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            color: "#94a3b8",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            color: "#00f2fe",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            color: "#94a3b8",
          },
          date: {
            ...SVG_DEFAULT_FIELDS.date,
            color: "#ffffff",
          },
          dateLabel: {
            ...SVG_DEFAULT_FIELDS.dateLabel,
            color: "#94a3b8",
          },
          certId: {
            ...SVG_DEFAULT_FIELDS.certId,
            color: "#64748b",
          },
          qrCode: {
            x: 11,
            y: 75,
            width: 60,
            height: 60,
            type: "image",
            src: "/templates/Logo Learnify AI.svg",
            align: "center",
          },
        },
      },
    ];

    // Seed premium templates first
    for (const tpl of PREMIUM_TEMPLATES) {
      const { error } = await supabaseAdmin.from("canva_templates").insert({
        name: tpl.name,
        category: tpl.category,
        bg_image_url: tpl.bg_image_url,
        thumbnail_url: tpl.thumbnail_url,
        fields_json: tpl.fields_json,
        theme_colors: tpl.theme_colors,
        created_by: context.userId!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (error) {
        results.errors.push(`Premium Template ${tpl.name}: ${error.message}`);
      } else {
        results.created++;
      }
    }

    // Seed all 155 SVG templates from the 8 categories
    for (const cat of SVG_CATEGORIES) {
      for (let i = 1; i <= cat.count; i++) {
        const templateName = `${cat.name} Template ${i}`;
        const bgUrl = `/templates/${cat.folder}/${i}.svg`;
        const fields = getTemplateFields(i);
        const themeColors = {
          primary: cat.color,
          accent: cat.color,
          background: "#ffffff",
          text: "#1a1a2e",
        };

        const { error } = await supabaseAdmin.from("canva_templates").insert({
          name: templateName,
          category: cat.name,
          bg_image_url: bgUrl,
          thumbnail_url: bgUrl,
          fields_json: fields,
          theme_colors: themeColors,
          created_by: context.userId!,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) {
          results.errors.push(`${templateName}: ${error.message}`);
        } else {
          results.created++;
        }
      }
    }

    return results;
  });

export const updateAllTemplateFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const results = { updated: 0, skipped: 0, errors: [] as string[] };

    const { data: all } = await supabaseAdmin
      .from("canva_templates")
      .select("id, name, fields_json");

    if (!all || all.length === 0) {
      return { ...results, message: "No templates found" };
    }

    for (const tpl of all) {
      const existingKeys = Object.keys(tpl.fields_json || {});
      if (existingKeys.length >= 12) {
        results.skipped++;
        continue;
      }

      const newFields = { ...DEFAULT_FIELDS, ...((tpl.fields_json as Record<string, any>) || {}) };
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

// Convert field-based template data to element-based data for DesignerWorkspace
const CANVAS_W = 842;
const CANVAS_H = 595;

export function fieldsToElements(fieldsJson: Record<string, any>): {
  elements: Record<string, any>[];
  design: Record<string, any>;
} {
  let idx = 0;
  const elements: Record<string, any>[] = [];

  for (const [name, f] of Object.entries(fieldsJson)) {
    idx++;
    const id = String(idx);
    const align = f.align || "center";

    if (f.type === "image" || name === "learnifyLogo" || name === "centerLogo") {
      let elType = "image";
      if (name === "learnifyLogo" || name === "centerLogo") elType = "org_logo";
      if (name === "signatureImage") elType = "signature";
      if (name === "qrCode") elType = "qr";
      if (name.startsWith("badge")) elType = "badge";

      const width = f.width || (elType === "org_logo" ? 120 : elType === "qr" ? 80 : 100);
      const height = f.height || (elType === "org_logo" ? 50 : elType === "qr" ? 80 : 40);
      const rawX = Math.round((f.x / 100) * CANVAS_W);
      const rawY = Math.round((f.y / 100) * CANVAS_H);
      const x = align === "center" ? Math.max(10, Math.round(rawX - width / 2)) : rawX;

      elements.push({
        id,
        type: elType,
        content: f.text || f.variable || "",
        url: f.src || null,
        x,
        y: rawY,
        width,
        height,
        align,
      });
    } else {
      const isFullWidthText =
        name === "title" ||
        name === "subtitle" ||
        name === "certifyText" ||
        name === "studentName" ||
        name === "completeText" ||
        name === "courseName" ||
        name === "description";
      const boxWidth = isFullWidthText ? 640 : f.width || 200;
      const rawX = Math.round((f.x / 100) * CANVAS_W);
      const rawY = Math.round((f.y / 100) * CANVAS_H);
      const x = align === "center" ? Math.max(10, Math.round(rawX - boxWidth / 2)) : rawX;

      elements.push({
        id,
        type: "text",
        content: f.text || f.variable || name,
        x,
        y: rawY,
        width: boxWidth,
        fontSize: f.fontSize || 16,
        fontFamily: f.fontFamily?.split(",")[0]?.trim() || "Inter",
        color: f.color || "#000000",
        align,
        fontWeight: f.fontWeight || "normal",
        fontStyle: f.fontStyle || "normal",
        textDecoration: f.textDecoration || "none",
      });
    }
  }

  return { elements, design: {} };
}

export const aiOptimizeDesign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        elements: z.any(),
        design: z.any(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { callUserAiChat } = await import("./user-ai");

    const elementsSummary = (data.elements || [])
      .map(
        (el: any) =>
          `${el.type} at (${el.x},${el.y}) font=${el.fontFamily || "inherit"} size=${el.fontSize || "auto"} color=${el.color || "inherit"}`,
      )
      .join("\n");

    const prompt = `You are a professional certificate designer. Given the following certificate elements and design, suggest specific improvements to make it look more premium and professional. CRITICAL: Do NOT use any emojis under any circumstances.

Current design:
- Border style: ${data.design?.border_style || "none"}
- Background pattern: ${data.design?.background_pattern || "none"}
- Corner style: ${data.design?.corner_style || "none"}
- Font family: ${data.design?.font_family || "Playfair Display"}
- Accent color: ${data.design?.accent_color || "#c9a84c"}
- Background color: ${data.design?.bg_color || "#ffffff"}
- Text color: ${data.design?.text_color || "#000000"}

Elements:
${elementsSummary}

Respond with a JSON object only (no markdown, no code fences):
{
  "design_updates": {
    "border_style": "one of none, solid, double, dashed, ornate, luxury",
    "corner_style": "one of none, diagonal, ribbon",
    "background_pattern": "one of none, dots, grid, gradient, mesh, noise, glass",
    "accent_color": "a hex color",
    "bg_color": "a hex color",
    "text_color": "a hex color",
    "font_family": "a Google font name"
  },
  "reasoning": "brief explanation of changes"
}`;

    const response = await callUserAiChat(
      {
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      "fast",
    );

    const responseText = await response.text();
    try {
      let cleaned = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleaned = jsonMatch[0];
      return JSON.parse(cleaned);
    } catch {
      try {
        const fallback = responseText.replace(/^[^{]*/, "").replace(/[^}]*$/, "");
        const parsed = JSON.parse(fallback);
        if (parsed.design_updates) return parsed;
      } catch {
        /* ignore */
      }
      return {
        design_updates: null,
        reasoning: "AI returned unparseable response. Please try again.",
      };
    }
  });

export function themeToDesign(themeColors?: Record<string, any>): Record<string, any> {
  const bg = themeColors?.background || "#f5f0e8";
  const accent = themeColors?.accent || "#c9a84c";
  const text = themeColors?.text || "#0a1628";
  const primary = themeColors?.primary || "#0a1628";
  return {
    accent_color: accent,
    bg_color: bg,
    text_color: text,
    accent_color_2: primary,
    font_family: "Playfair Display",
    border_style: "none",
    border_width: 0,
    corner_style: "none",
    background_pattern: "none",
    layout: "classic",
  };
}
