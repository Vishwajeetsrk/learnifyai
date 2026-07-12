/**
 * Seed all 30 certificate templates into canva_templates table.
 * Run: node scripts/seed-cert-templates.mjs
 *
 * Prerequisites:
 *   - Supabase project with canva_templates table created
 *   - .env.local with VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *
 * This script:
 *   1. Reads all "public/templates/*.png" files
 *   2. Uploads them to Supabase Storage (canva-templates bucket)
 *   3. Inserts rows into canva_templates with field positions
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, stat } from "fs/promises";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config({ path: ".env.local" });

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const TEMPLATES_DIR = join(__dirname, "..", "public", "templates");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Color scheme detection based on template number
function getColorScheme(num) {
  if (num <= 4)
    return {
      name: "Teal & Gold",
      primary: "#0d5c5c",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#0d5c5c",
    };
  if (num <= 8)
    return {
      name: "Navy & Gold",
      primary: "#0a1628",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#0a1628",
    };
  if (num <= 12)
    return {
      name: "Royal Blue & Gold",
      primary: "#1a3a6b",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#1a3a6b",
    };
  if (num <= 16)
    return {
      name: "Orange & Navy",
      primary: "#e67e22",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#0a1628",
    };
  if (num <= 20)
    return {
      name: "Purple & Gold",
      primary: "#2d1b69",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#2d1b69",
    };
  if (num <= 24)
    return {
      name: "Burgundy & Gold",
      primary: "#6b1d3a",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#6b1d3a",
    };
  if (num <= 28)
    return {
      name: "Pink & Gold",
      primary: "#8b1a6b",
      accent: "#c9a84c",
      background: "#f5f0e8",
      text: "#8b1a6b",
    };
  return {
    name: "Emerald & Gold",
    primary: "#065f46",
    accent: "#c9a84c",
    background: "#f5f0e8",
    text: "#065f46",
  };
}

function getCategory(num) {
  if (num <= 4) return "Technology";
  if (num <= 8) return "Professional";
  if (num <= 12) return "Academic";
  if (num <= 16) return "Achievement";
  if (num <= 20) return "Certification";
  if (num <= 24) return "Executive";
  if (num <= 28) return "Professional";
  return "Academic";
}

// Default field positions for ALL templates (same layout structure)
const DEFAULT_FIELDS = {
  studentName: {
    x: 50,
    y: 42,
    fontSize: 52,
    fontFamily: "Great Vibes",
    color: "#1a2744",
    fontWeight: "normal",
    fontStyle: "normal",
    variable: "{{student_name}}",
  },
  courseName: {
    x: 50,
    y: 55,
    fontSize: 26,
    fontFamily: "Georgia",
    color: "#0a6e8a",
    fontWeight: "bold",
    fontStyle: "normal",
    variable: "{{course_name}}",
  },
  description: {
    x: 50,
    y: 62,
    fontSize: 13,
    fontFamily: "Georgia",
    color: "#555555",
    fontWeight: "normal",
    fontStyle: "normal",
    text: "and has demonstrated the knowledge and skills\nrequired to complete the course.",
  },
  date: {
    x: 72,
    y: 78,
    fontSize: 14,
    fontFamily: "Georgia",
    color: "#333333",
    fontWeight: "normal",
    fontStyle: "normal",
    variable: "{{issue_date}}",
  },
  signatureName: {
    x: 20,
    y: 76,
    fontSize: 28,
    fontFamily: "Great Vibes",
    color: "#1a2744",
    fontWeight: "normal",
    fontStyle: "normal",
    variable: "{{signature_name}}",
  },
  signatureTitle: {
    x: 20,
    y: 80,
    fontSize: 11,
    fontFamily: "Georgia",
    color: "#666666",
    fontWeight: "normal",
    fontStyle: "normal",
    text: "Founder & CEO, Learnify AI",
  },
  certId: {
    x: 85,
    y: 8,
    fontSize: 11,
    fontFamily: "monospace",
    color: "#999999",
    fontWeight: "normal",
    fontStyle: "normal",
    variable: "{{certificate_id}}",
  },
  badgeText: {
    x: 50,
    y: 92,
    fontSize: 9,
    fontFamily: "Georgia",
    color: "#888888",
    fontWeight: "normal",
    fontStyle: "normal",
    text: "AI-Powered Learning  |  Industry Relevant  |  Career Focused  |  Lifetime Access",
  },
};

async function uploadTemplate(filePath, fileName) {
  const fileBuffer = await import("fs").then((fs) => fs.readFileSync(filePath));
  const { data, error } = await supabase.storage
    .from("canva-templates")
    .upload(fileName, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error(`  Upload failed for ${fileName}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage.from("canva-templates").getPublicUrl(fileName);

  return urlData?.publicUrl;
}

async function main() {
  console.log("Certificate Template Seeder");
  console.log("===========================\n");

  // Ensure storage bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === "canva-templates");
  if (!bucketExists) {
    console.log("Creating 'canva-templates' storage bucket...");
    const { error } = await supabase.storage.createBucket("canva-templates", {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/svg+xml"],
    });
    if (error && !error.message.includes("already exists")) {
      console.error("Failed to create bucket:", error.message);
      process.exit(1);
    }
    console.log("  Bucket created.\n");
  }

  // Read template files
  const files = (await readdir(TEMPLATES_DIR))
    .filter((f) => f.endsWith(".png") && f.startsWith("certification"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] || "0");
      const numB = parseInt(b.match(/(\d+)/)?.[1] || "0");
      return numA - numB;
    });

  console.log(`Found ${files.length} templates to seed.\n`);

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const num = parseInt(file.match(/(\d+)/)?.[1] || "0");
    const scheme = getColorScheme(num);
    const category = getCategory(num);

    console.log(`[${num}/30] ${file}`);
    console.log(`  Color: ${scheme.name} | Category: ${category}`);

    // Upload to storage
    const filePath = join(TEMPLATES_DIR, file);
    const publicUrl = await uploadTemplate(filePath, file);

    if (!publicUrl) {
      skipped++;
      continue;
    }

    console.log(`  URL: ${publicUrl}`);

    // Insert into DB
    const { error } = await supabase.from("canva_templates").upsert(
      {
        name: `${scheme.name} - Template ${num}`,
        category,
        bg_image_url: publicUrl,
        thumbnail_url: publicUrl,
        fields_json: DEFAULT_FIELDS,
        theme_colors: scheme,
        created_by: null,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error(`  DB insert failed:`, error.message);
      skipped++;
    } else {
      console.log(`  ✓ Created`);
      created++;
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main().catch(console.error);
