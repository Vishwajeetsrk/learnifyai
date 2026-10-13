// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force production environment during Vercel builds to prevent jsxDEV runtime errors
if (process.env.VERCEL || !process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

export default defineConfig({
  nitro: {
    preset: process.env.VERCEL ? "vercel" : "node-server",
    output: process.env.VERCEL ? undefined : { dir: "dist", serverDir: "dist/server" },
    // @ts-ignore
    publicAssets: [
      {
        dir: "public",
        maxAge: 31536000,
        ignore: ["**/preset-sites/**"],
      },
    ],
    serveStatic: true,
  },
  vite: {
    resolve: {
      alias: {
        "@designcodeio/threeui/style.css": path.resolve(__dirname, "src/shaders/threeui.css"),
        "@designcodeio/threeui": path.resolve(__dirname, "src/shaders/threeui-entry.ts"),
      },
    },
    css: {
      transformer: "lightningcss",
    },
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    // Exclude nodemailer from client-side pre-bundling (dev server)
    optimizeDeps: {
      exclude: ["nodemailer"],
    },
    // Mark nodemailer as external for SSR so it's never evaluated in browser
    ssr: {
      external: ["nodemailer"],
    },
    build: {
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        maxParallelFileOps: 2,
        external: ["nodemailer", "nodemailer/lib/mailer/index.js"],
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, "/");
            if (!normalizedId.includes("node_modules")) return;

            // Core React runtime must be initialized together
            if (
              normalizedId.includes("/node_modules/react/") ||
              normalizedId.includes("/node_modules/react-dom/") ||
              normalizedId.includes("/node_modules/scheduler/")
            ) {
              return "vendor-react";
            }

            // Heavy 3D Canvas libraries
            if (
              normalizedId.includes("/node_modules/three/") ||
              normalizedId.includes("/node_modules/@react-three/")
            ) {
              return "vendor-three";
            }

            // Heavy PDF & Canvas Export tools
            if (
              normalizedId.includes("/node_modules/jspdf/") ||
              normalizedId.includes("/node_modules/html2canvas/") ||
              normalizedId.includes("/node_modules/html2canvas-pro/") ||
              normalizedId.includes("/node_modules/html-to-image/")
            ) {
              return "vendor-pdf";
            }
            if (normalizedId.includes("/node_modules/pdfjs-dist/")) return "vendor-pdfjs";

            // Code & Data Table Editors
            if (
              normalizedId.includes("/node_modules/monaco-editor/") ||
              normalizedId.includes("/node_modules/@monaco-editor/")
            ) {
              return "vendor-monaco";
            }
            if (normalizedId.includes("/node_modules/xlsx/") || normalizedId.includes("/node_modules/exceljs/")) {
              return "vendor-excel";
            }
            if (normalizedId.includes("/node_modules/sql.js/")) return "vendor-sql";
            if (normalizedId.includes("/node_modules/highlight.js/")) return "vendor-highlight";
            if (normalizedId.includes("/node_modules/@tiptap/")) return "vendor-editor";
            if (
              normalizedId.includes("/node_modules/@codesandbox/") ||
              normalizedId.includes("/node_modules/sandpack")
            ) {
              return "vendor-sandpack";
            }
          },
        },
      },
    },
  },
  tanstackStart: {},
});
