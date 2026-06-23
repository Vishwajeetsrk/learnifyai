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
  nitro: { preset: "vercel" },
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
      chunkSizeWarningLimit: 2500,
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
            // Split out large, self-contained libraries to reduce vendor chunk size.
            // Core libraries (react, react-dom, @tanstack, @supabase) must remain in the default 'vendor'
            // chunk to avoid circular dependencies and runtime initialization crashes.
            if (id.includes("xlsx")) return "vendor-xlsx";
            if (id.includes("jspdf") || id.includes("html2canvas-pro")) return "vendor-pdf";
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("highlight.js")) return "vendor-highlight";
            if (id.includes("@tiptap")) return "vendor-editor";
            return "vendor";
          },
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/start.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "start" },
  },
});
