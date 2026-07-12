import fs from "fs";
import path from "path";

const PRESET_SITES_DIR = "C:/Users/vishw/Music/Learnify AI/public/preset-sites";
const OUTPUT_FILE = "C:/Users/vishw/Music/Learnify AI/src/data/projects.json";

function getTitleAndDesc(htmlPath) {
  const content = fs.readFileSync(htmlPath, "utf-8");

  // Simple regex matching for title and description meta tag
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const descMatch =
    content.match(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
    content.match(/<meta\s+content="([^"]+)"\s+name="description"/i);

  let title = titleMatch ? titleMatch[1].trim() : "";
  let description = descMatch ? descMatch[1].trim() : "";

  return { title, description };
}

async function main() {
  console.log("Generating projects.json from public/preset-sites...");

  if (!fs.existsSync(PRESET_SITES_DIR)) {
    console.error(`Directory not found: ${PRESET_SITES_DIR}`);
    process.exit(1);
  }

  const folders = fs.readdirSync(PRESET_SITES_DIR);
  const projects = [];

  for (const name of folders) {
    if (name === "_shared" || name.startsWith(".")) continue;

    const folderPath = path.join(PRESET_SITES_DIR, name);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const indexPath = path.join(folderPath, "index.html");
    if (fs.existsSync(indexPath)) {
      const { title, description } = getTitleAndDesc(indexPath);

      // Clean up the name from kebab-case to Title Case
      const cleanName = name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      projects.push({
        id: name,
        name: cleanName,
        title: title || cleanName,
        description:
          description ||
          "Interactive UI/UX design project template showcasing next-generation aesthetics and web design.",
        path: `/preset-sites/${name}/index.html`,
      });
    }
  }

  // Sort projects alphabetically
  projects.sort((a, b) => a.name.localeCompare(b.name));

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2), "utf-8");
  console.log(`Successfully generated ${projects.length} project definitions in ${OUTPUT_FILE}`);
}

main().catch(console.error);
