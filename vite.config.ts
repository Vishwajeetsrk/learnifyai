// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Force production environment during Vercel builds to prevent jsxDEV runtime errors
if (process.env.VERCEL) {
  process.env.NODE_ENV = "production";
}

export default defineConfig({
  nitro: {
    preset: process.env.VERCEL ? "vercel" : "node-server",
    output: process.env.VERCEL
      ? undefined
      : { dir: "dist", serverDir: "dist/server" },
  },
  vite: {
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
      chunkSizeWarningLimit: 500,
      rollupOptions: {
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
            if (id.includes("xlsx")) return "vendor-xlsx";
            if (id.includes("jspdf") || id.includes("html2canvas-pro")) return "vendor-pdf";
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("highlight.js")) return "vendor-highlight";
            if (id.includes("@tiptap")) return "vendor-editor";
            if (id.includes("monaco-editor")) return "vendor-monaco";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("pdfjs-dist")) return "vendor-pdfjs";
            if (id.includes("react-markdown") || id.includes("remark-") || id.includes("rehype-")) return "vendor-markdown";
            if (id.includes("lucide-react")) return "vendor-icons";
            return "vendor";
          },
        },
      },
    },
  },
  tanstackStart: {},
});
