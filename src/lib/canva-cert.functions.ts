import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function checkAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin privileges required.");
  }
}


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

// List all available SVG templates from the master suite
export const listSvgTemplates = createServerFn({ method: "GET" }).handler(async () => {
  return [
    {
      id: "tpl-grand-chancellor",
      name: "The Grand Chancellor — Executive Navy & 24K Gold",
      category: "Executive",
      categoryId: "executive",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#D4AF37",
    },
    {
      id: "tpl-silicon-laureate",
      name: "The Silicon Laureate — Obsidian AI & Quantum Cyan",
      category: "Technology",
      categoryId: "technology",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#00F2FE",
    },
    {
      id: "tpl-oxfordian-imperial",
      name: "The Oxfordian Imperial — Heritage Ivory & Crimson Vellum",
      category: "Academic",
      categoryId: "academic",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#8B6914",
    },
    {
      id: "tpl-swiss-vanguard",
      name: "The Swiss Vanguard — Architectural Minimalist Monolith",
      category: "Design",
      categoryId: "design",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#0F172A",
    },
    {
      id: "tpl-emerald-sovereign",
      name: "The Emerald Sovereign — Royal Forest & Mint Filigree",
      category: "Corporate",
      categoryId: "corporate",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#10B981",
    },
    {
      id: "tpl-rose-royale",
      name: "The Rose Royale — Midnight Velvet & Rose Gold Foil",
      category: "Creative",
      categoryId: "creative",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#FB7185",
    },
    {
      id: "tpl-quantum-cloud",
      name: "The Quantum Cloud — Enterprise Cobalt & Sky Horizon",
      category: "Technology",
      categoryId: "technology",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#38BDF8",
    },
    {
      id: "tpl-banknote-rosette",
      name: "The Banknote Rosette — Mathematical Guilloche Engine",
      category: "Finance",
      categoryId: "finance",
      bg_image_url: "",
      thumbnail_url: "",
      color: "#48CAE4",
    },
  ];
});

// List SVG categories
export const listSvgCategories = createServerFn({ method: "GET" }).handler(
  async () => [
    { id: "executive", name: "Executive", color: "#D4AF37" },
    { id: "technology", name: "Technology", color: "#00F2FE" },
    { id: "academic", name: "Academic", color: "#8B6914" },
    { id: "design", name: "Design", color: "#0F172A" },
    { id: "corporate", name: "Corporate", color: "#10B981" },
    { id: "creative", name: "Creative", color: "#FB7185" },
    { id: "finance", name: "Finance", color: "#48CAE4" },
  ],
);

export const listCanvaTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);
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
        id: z.string().uuid().optional(),
        name: z.string().min(1),
        category: z.string().default("Professional"),
        bg_image_url: z.string().url(),
        thumbnail_url: z.string().url().optional(),
        fields_json: z.any().optional(),
        theme_colors: z.any().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
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

    if (data.id) {
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
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
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
    await checkAdmin(context.userId);
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

    const MASTER_TEMPLATES = [
      {
        name: "The Grand Chancellor — Executive Navy & 24K Gold",
        category: "Executive",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#0A1128",
          accent: "#D4AF37",
          background: "#FCFDFE",
          text: "#0F172A",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "CERTIFICATE OF EXECUTIVE DISTINCTION",
            fontFamily: "Playfair Display, serif",
            fontSize: 32,
            color: "#0A1128",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "OFFICIAL CREDENTIAL OF MERIT & STRATEGIC LEADERSHIP",
            fontFamily: "Inter, sans-serif",
            fontSize: 10,
            color: "#D4AF37",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#0A1128",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 22,
            color: "#D4AF37",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "For demonstrating exceptional mastery of executive competencies, strategic leadership principles, and standards of academic excellence established by Learnify AI.",
            color: "#475569",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Vishwajeet S.",
            color: "#0A1128",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Founder & Chief AI Architect, Learnify AI",
            color: "#64748b",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Silicon Laureate — Obsidian AI & Quantum Cyan",
        category: "Technology",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#00F2FE",
          accent: "#8B5CF6",
          background: "#080B14",
          text: "#F8FAFC",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "FELLOWSHIP IN ARTIFICIAL INTELLIGENCE",
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 30,
            color: "#00F2FE",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "ADVANCED AGENTIC SYSTEMS & ML ARCHITECTURE SPECIALIZATION",
            fontFamily: "monospace",
            fontSize: 10,
            color: "#8B5CF6",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#FFFFFF",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 22,
            color: "#00F2FE",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "Awarded for pioneering excellence in autonomous AI workflows, neural model fine-tuning, and scalable multi-agent systems orchestration.",
            color: "#94a3b8",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Vishwajeet S.",
            color: "#00F2FE",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Lead Research Scientist & AI Director",
            color: "#94a3b8",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Oxfordian Imperial — Classic Academic Honors",
        category: "Academic",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#1C1917",
          accent: "#991B1B",
          background: "#FAF8F3",
          text: "#292524",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "HONORS DIPLOMA OF ACADEMIC EXCELLENCE",
            fontFamily: "Cinzel, serif",
            fontSize: 28,
            color: "#1C1917",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "CONFERRED BY THE BOARD OF ACADEMIC AFFAIRS & EXCELLENCE",
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            color: "#991B1B",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#1C1917",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Cinzel, serif",
            fontSize: 22,
            color: "#991B1B",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "Having satisfied all rigorous curricular requirements and distinguished scholarly benchmarks with supreme distinction.",
            color: "#57534E",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Dr. Aaron Sterling",
            color: "#1C1917",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Academic Dean & Registrar, Learnify AI",
            color: "#78716C",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Swiss Vanguard — Modern Architectural Minimalist",
        category: "Design",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#0F172A",
          accent: "#2563EB",
          background: "#FFFFFF",
          text: "#0F172A",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "PROFESSIONAL PRODUCT & UX PRACTITIONER",
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 26,
            fontWeight: "bold",
            color: "#0F172A",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "HUMAN-CENTERED DESIGN & DESIGN SYSTEMS EXCELLENCE",
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            color: "#64748B",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#0F172A",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 22,
            color: "#2563EB",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "For demonstrating advanced proficiency in user research methodologies, responsive interface systems, and enterprise design engineering.",
            color: "#475569",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Elena Vance",
            color: "#0F172A",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "VP of Product Design, Learnify AI",
            color: "#64748B",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Emerald Sovereign — Distinction & Sustainable Leadership",
        category: "Distinction",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#064E3B",
          accent: "#10B981",
          background: "#F4FBF7",
          text: "#064E3B",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "CERTIFICATE OF SPECIAL DISTINCTION & MERIT",
            fontFamily: "Playfair Display, serif",
            fontSize: 28,
            color: "#064E3B",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "SUSTAINABILITY & ADVANCED PRACTICE COUNCIL",
            fontFamily: "Inter, sans-serif",
            fontSize: 10,
            color: "#10B981",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#064E3B",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Playfair Display, serif",
            fontSize: 22,
            color: "#059669",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "In recognition of outstanding performance, exemplary leadership, and adherence to top tier standards of innovation.",
            color: "#064E3B",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Marcus Aurel",
            color: "#064E3B",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Distinction Board Chairman",
            color: "#059669",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Rose Royale — Fine Arts & Creative Direction",
        category: "Creative",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#FB7185",
          accent: "#F43F5E",
          background: "#18181B",
          text: "#FFFFFF",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "MASTERCLASS IN CREATIVE DIRECTION",
            fontFamily: "Playfair Display, serif",
            fontSize: 28,
            color: "#FB7185",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "ACADEMY OF DIGITAL ARTS & DESIGN LEADERSHIP",
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            color: "#FDA4AF",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#FFFFFF",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Playfair Display, serif",
            fontSize: 22,
            color: "#FB7185",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "Demonstrating mastery of cinematic art direction, brand narrative composition, and creative production workflows.",
            color: "#A1A1AA",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Chloe Fontaine",
            color: "#FB7185",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Creative Director & Lead Curator",
            color: "#71717A",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Quantum Cloud — Certified Solutions Architect",
        category: "Engineering",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#1D4ED8",
          accent: "#0284C7",
          background: "#F8FAFC",
          text: "#0F172A",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "CERTIFIED CLOUD SOLUTIONS ARCHITECT",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 28,
            color: "#1D4ED8",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "ENTERPRISE CLOUD ARCHITECTURE & DEVOPS STANDARDS",
            fontFamily: "monospace",
            fontSize: 9,
            color: "#0284C7",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#0F172A",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 22,
            color: "#1D4ED8",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "Validated technical capabilities in distributed cloud infrastructure, microservices orchestration, and resilient fault-tolerant systems.",
            color: "#475569",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Vishwajeet S.",
            color: "#1D4ED8",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Cloud Engineering Practice Head",
            color: "#64748B",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
      {
        name: "The Banknote Rosette — ThreeUI Harmonic Live Engine",
        category: "Live 3D",
        bg_image_url: "",
        thumbnail_url: "",
        theme_colors: {
          primary: "#0A1128",
          accent: "#00A6FB",
          background: "#FAF9F6",
          text: "#0A1128",
        },
        fields_json: {
          ...SVG_DEFAULT_FIELDS,
          title: {
            ...SVG_DEFAULT_FIELDS.title,
            text: "VERIFIABLE CREDENTIAL OF MERIT",
            fontFamily: "Cinzel, serif",
            fontSize: 28,
            color: "#0A1128",
            x: 50,
            y: 13,
            align: "center",
          },
          subtitle: {
            ...SVG_DEFAULT_FIELDS.subtitle,
            text: "OFFICIAL DIGITAL ASSET WITH THREEUI 3D GUILLOCHE ENGINE",
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            color: "#00A6FB",
            x: 50,
            y: 19,
            align: "center",
          },
          studentName: {
            ...SVG_DEFAULT_FIELDS.studentName,
            fontFamily: "Playfair Display, serif",
            fontWeight: "bold",
            fontSize: 34,
            color: "#0A1128",
            x: 50,
            y: 33,
            align: "center",
          },
          courseName: {
            ...SVG_DEFAULT_FIELDS.courseName,
            fontFamily: "Cinzel, serif",
            fontSize: 22,
            color: "#00A6FB",
            x: 50,
            y: 47,
            align: "center",
          },
          description: {
            ...SVG_DEFAULT_FIELDS.description,
            text: "Equipped with dual harmonic rosettes, cryptographic microprint verification, and W3C tamper-proof verifiable credential integrity.",
            color: "#334155",
          },
          signatureName: {
            ...SVG_DEFAULT_FIELDS.signatureName,
            text: "Vishwajeet S.",
            color: "#0A1128",
          },
          signatureTitle: {
            ...SVG_DEFAULT_FIELDS.signatureTitle,
            text: "Chief Innovation Officer, Learnify AI",
            color: "#64748B",
          },
          qrCode: {
            x: 88,
            y: 76,
            width: 60,
            height: 60,
            type: "image",
            src: "https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png",
            align: "center",
          },
        },
      },
    ];

    // Seed master luxury templates
    for (const tpl of MASTER_TEMPLATES) {
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
        results.errors.push(`Template ${tpl.name}: ${error.message}`);
      } else {
        results.created++;
      }
    }

    return results;
  });

export const updateAllTemplateFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);
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
