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
  nitro: process.env.VERCEL ? { preset: "vercel" } : { preset: "vercel" },
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
            if (id.includes("react-dom") || id.includes("react") || id.includes("scheduler")) return "vendor-react";
            if (id.includes("@tanstack")) return "vendor-tanstack";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (
              id.includes("react-markdown") ||
              id.includes("remark-gfm") ||
              id.includes("rehype-highlight") ||
              id.includes("highlight.js")
            )
              return "vendor-markdown";
            if (id.includes("xlsx")) return "vendor-xlsx";
            if (id.includes("jspdf") || id.includes("html2canvas-pro")) return "vendor-pdf";
            if (id.includes("youtube-transcript")) return "vendor-youtube";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("sonner")) return "vendor-toast";
            if (id.includes("date-fns")) return "vendor-dates";
            if (id.includes("react-day-picker")) return "vendor-daypicker";
            if (id.includes("zod")) return "vendor-zod";
            if (id.includes("axios")) return "vendor-axios";
            if (id.includes("cmdk") || id.includes("@radix-ui")) return "vendor-radix";
            return "vendor";
          },
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
