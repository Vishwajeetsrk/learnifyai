import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs";
import JSZip from "jszip";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const exportProjectSchema = z.object({
  projectId: z.string().min(1),
});

/**
 * Server function to securely export full project source code as a ZIP archive.
 * Restricted to users with active "Career Pro" or "Enterprise" subscription (or admins).
 */
export const exportProjectZip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => exportProjectSchema.parse(d))
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    if (!userId) {
      throw new Error("Authentication required to export source code");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Check if user is admin
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const userRoles = (roles ?? []).map((r: any) => r.role);
    const isAdmin = userRoles.includes("super_admin") || userRoles.includes("admin");

    // 2. Check active subscription
    const { data: sub } = await supabaseAdmin
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(name)")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    const planName = (sub as any)?.plan?.name?.toLowerCase() || "";
    const hasCareerPro = isAdmin || planName === "career pro" || planName === "enterprise";

    if (!hasCareerPro) {
      return {
        success: false,
        error: "Career Pro subscription required to download project source code.",
        needsUpgrade: true,
      };
    }

    const { projectId } = data;
    const cleanId = path.basename(projectId.replace(/[^a-zA-Z0-9_-]/g, ""));

    // Locate preset directory
    const candidates = [
      path.resolve(process.cwd(), "public/preset-sites", cleanId),
      path.resolve(process.cwd(), "dist/client/preset-sites", cleanId),
      path.resolve(process.cwd(), ".output/public/preset-sites", cleanId),
      path.resolve(process.cwd(), ".vercel/output/static/preset-sites", cleanId),
    ];

    let targetDir = candidates.find((dir) => fs.existsSync(dir));

    const zip = new JSZip();

    if (targetDir && fs.existsSync(targetDir)) {
      // Recursively add all files from project folder
      function addFolderToZip(currentDir: string, zipFolder: JSZip) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            const sub = zipFolder.folder(entry.name);
            if (sub) addFolderToZip(fullPath, sub);
          } else if (entry.isFile()) {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(entry.name, content);
          }
        }
      }
      addFolderToZip(targetDir, zip);
    }

    // Always ensure a production-ready package.json, vite.config.js, and README.md are included
    zip.file(
      "package.json",
      JSON.stringify(
        {
          name: `${cleanId}-template`,
          private: true,
          version: "1.0.0",
          type: "module",
          scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview",
          },
          devDependencies: {
            vite: "^6.0.0",
          },
        },
        null,
        2,
      ),
    );

    zip.file(
      "vite.config.js",
      `import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
});
`,
    );

    zip.file(
      "README.md",
      `# ${cleanId.toUpperCase()} — Next-Gen Website Design Template

Exported from **Learnify AI Design Mastery Studio** (Career Pro Exclusive).

## Quick Start
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization
- Edit \`index.html\` and files in \`./assets/\` to customize copy, colors, and layout.
- GSAP, 3D, and Tailwind animations are self-contained and pre-configured.
`,
    );

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return {
      success: true,
      filename: `${cleanId}-learnify-template.zip`,
      base64: zipBuffer.toString("base64"),
    };
  });
