import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read environment variables directly from .env file
const env = fs.readFileSync(".env", "utf8");
let supabaseUrl = "";
let supabaseKey = "";
for (const line of env.split("\n")) {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=") || line.startsWith("SUPABASE_URL="))
    supabaseUrl = line.split("=")[1].trim().replace(/^"|"$/g, "");
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY="))
    supabaseKey = line.split("=")[1].trim().replace(/^"|"$/g, "");
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Curated high-quality Unsplash cover images for different topics
const COVERS = {
  react:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
  design:
    "https://images.unsplash.com/photo-1561070791-26c113006238?w=1200&auto=format&fit=crop&q=80",
  wordpress:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80",
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
  code: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=1200&auto=format&fit=crop&q=80",
};

async function main() {
  const { data: courses, error } = await supabaseAdmin
    .from("courses")
    .select("id, title, slug, category, cover_url");

  if (error) {
    console.error("Failed to fetch courses:", error.message);
    process.exit(1);
  }

  console.log(`Found ${courses.length} courses in the database.`);

  for (const c of courses) {
    if (!c.cover_url || c.cover_url.trim() === "") {
      const titleLower = c.title.toLowerCase();
      const slugLower = c.slug.toLowerCase();
      const catLower = c.category.toLowerCase();

      let selectedCover = "";

      if (
        titleLower.includes("next.js") ||
        titleLower.includes("nextjs") ||
        titleLower.includes("react") ||
        slugLower.includes("nextjs") ||
        slugLower.includes("react")
      ) {
        selectedCover = COVERS.react;
      } else if (
        titleLower.includes("design") ||
        titleLower.includes("ui") ||
        titleLower.includes("ux") ||
        catLower.includes("design")
      ) {
        selectedCover = COVERS.design;
      } else if (titleLower.includes("wordpress") || slugLower.includes("wordpress")) {
        selectedCover = COVERS.wordpress;
      } else if (
        titleLower.includes("ai") ||
        titleLower.includes("prompt") ||
        catLower.includes("ai") ||
        titleLower.includes("intelligence")
      ) {
        selectedCover = COVERS.ai;
      } else if (
        titleLower.includes("python") ||
        titleLower.includes("data") ||
        titleLower.includes("science") ||
        catLower.includes("data")
      ) {
        selectedCover = COVERS.data;
      } else if (
        titleLower.includes("typescript") ||
        titleLower.includes("programming") ||
        titleLower.includes("coding") ||
        titleLower.includes("crud") ||
        slugLower.includes("crud") ||
        slugLower.includes("supabase")
      ) {
        selectedCover = COVERS.code;
      } else {
        selectedCover = `https://picsum.photos/seed/${c.slug}/1200/800`;
      }

      console.log(`Updating "${c.title}" with cover URL...`);
      const { error: updateError } = await supabaseAdmin
        .from("courses")
        .update({ cover_url: selectedCover })
        .eq("id", c.id);

      if (updateError) {
        console.error(`  Failed to update course ${c.id}:`, updateError.message);
      } else {
        console.log(`  Successfully updated cover image for "${c.title}"`);
      }
    } else {
      console.log(`Course "${c.title}" already has a cover URL: ${c.cover_url}`);
    }
  }

  console.log("\nDatabase update completed!");
}

main().catch(console.error);
