// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
      chunkSizeWarningLimit: 2500,
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
            if (!id.includes("node_modules")) return;

            // Core React runtime must be initialized together
            if (
              id.includes("/node_modules/react/") ||
              id.includes("/node_modules/react-dom/") ||
              id.includes("/node_modules/scheduler/")
            ) {
              return "vendor-react";
            }

            // Heavy 3D Canvas libraries
            if (
              id.includes("/node_modules/three/") ||
              id.includes("/node_modules/@react-three/")
            ) {
              return "vendor-three";
            }

            // Heavy PDF & Canvas Export tools
            if (
              id.includes("/node_modules/jspdf/") ||
              id.includes("/node_modules/html2canvas/") ||
              id.includes("/node_modules/html2canvas-pro/") ||
              id.includes("/node_modules/html-to-image/")
            ) {
              return "vendor-pdf";
            }
            if (id.includes("/node_modules/pdfjs-dist/")) return "vendor-pdfjs";

            // Code & Data Table Editors
            if (
              id.includes("/node_modules/monaco-editor/") ||
              id.includes("/node_modules/@monaco-editor/")
            ) {
              return "vendor-monaco";
            }
            if (id.includes("/node_modules/xlsx/") || id.includes("/node_modules/exceljs/")) {
              return "vendor-excel";
            }
            if (id.includes("/node_modules/sql.js/")) return "vendor-sql";
            if (id.includes("/node_modules/highlight.js/")) return "vendor-highlight";
            if (id.includes("/node_modules/@tiptap/")) return "vendor-editor";
            if (
              id.includes("/node_modules/@codesandbox/") ||
              id.includes("/node_modules/sandpack")
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
