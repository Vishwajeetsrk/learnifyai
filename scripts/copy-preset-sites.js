import fs from "node:fs";
import path from "node:path";

console.log("[copy-preset-sites] Starting static preset-sites post-processor...");

const srcDir = path.resolve(process.cwd(), "public/preset-sites");
const distPublicDir = path.resolve(process.cwd(), "dist/public/preset-sites");
const distClientDir = path.resolve(process.cwd(), "dist/client/preset-sites");
const vercelStaticDir = path.resolve(process.cwd(), ".vercel/output/static/preset-sites");
const dotOutputPublicDir = path.resolve(process.cwd(), ".output/public/preset-sites");

if (fs.existsSync(srcDir)) {
  // 1. Copy to local dist/public
  fs.cpSync(srcDir, distPublicDir, { recursive: true, force: true });
  console.log(`[copy-preset-sites] Successfully copied to: ${distPublicDir}`);

  // 2. Copy to local dist/client
  fs.cpSync(srcDir, distClientDir, { recursive: true, force: true });
  console.log(`[copy-preset-sites] Successfully copied to: ${distClientDir}`);

  // 3. Copy to Vercel Build Output API directory (if it exists)
  const vercelOutDir = path.resolve(process.cwd(), ".vercel/output/static");
  if (fs.existsSync(vercelOutDir)) {
    fs.cpSync(srcDir, vercelStaticDir, { recursive: true, force: true });
    console.log(`[copy-preset-sites] Successfully copied to Vercel output: ${vercelStaticDir}`);
  } else {
    console.log("[copy-preset-sites] .vercel/output/static not found, skipping Vercel copy.");
  }

  // 4. Copy to standard Nitro output directory (if it exists)
  const dotOutputDir = path.resolve(process.cwd(), ".output/public");
  if (fs.existsSync(dotOutputDir)) {
    fs.cpSync(srcDir, dotOutputPublicDir, { recursive: true, force: true });
    console.log(`[copy-preset-sites] Successfully copied to Nitro output: ${dotOutputPublicDir}`);
  }
} else {
  console.warn(`[copy-preset-sites] Warning: Source directory ${srcDir} does not exist.`);
}
