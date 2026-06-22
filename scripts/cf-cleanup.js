import { existsSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

const dist = join(process.cwd(), "dist");

// Remove the Worker bundle — Cloudflare Pages free plan has a 3 MiB Worker limit.
// The TanStack Start SSR worker is ~16 MiB. Since the app is a client-side SPA
// (Supabase handles all data on the client), we deploy static-only.
const workerPath = join(dist, "_worker.js");
if (existsSync(workerPath)) {
  rmSync(workerPath, { recursive: true, force: true });
  console.log("✓ Removed _worker.js (static-only Cloudflare Pages deploy)");
}

// Write a simple SPA fallback route so Cloudflare Pages serves index.html for all paths.
writeFileSync(
  join(dist, "_routes.json"),
  JSON.stringify({
    version: 1,
    routes: [{ src: "(.*)", dest: "/index.html" }],
  })
);
console.log("✓ Wrote SPA _routes.json");
