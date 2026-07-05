import fs from "node:fs";
import path from "node:path";

console.log("[copy-preset-sites] Starting static preset-sites post-processor...");

const srcDir = path.resolve(process.cwd(), "public/preset-sites");
const distPublicDir = path.resolve(process.cwd(), "dist/public/preset-sites");
const distClientDir = path.resolve(process.cwd(), "dist/client/preset-sites");

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, distPublicDir, { recursive: true, force: true });
  console.log(`[copy-preset-sites] Successfully copied to: ${distPublicDir}`);

  fs.cpSync(srcDir, distClientDir, { recursive: true, force: true });
  console.log(`[copy-preset-sites] Successfully copied to: ${distClientDir}`);
} else {
  console.warn(`[copy-preset-sites] Warning: Source directory ${srcDir} does not exist.`);
}
