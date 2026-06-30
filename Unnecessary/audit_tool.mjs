import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const ROOT = path.resolve("./");
const SRC_DIR = path.join(ROOT, "src");
const PUBLIC_DIR = path.join(ROOT, "public");

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "node_modules" || file === ".git" || file === "dist") continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allSrcFiles = getAllFiles(SRC_DIR).map((f) => f.replace(/\\/g, "/"));
const allPublicFiles = getAllFiles(PUBLIC_DIR).map((f) => f.replace(/\\/g, "/"));

// 1. Large Files (> 1MB)
const largeFiles = [];
[...allSrcFiles, ...allPublicFiles].forEach((f) => {
  const stat = fs.statSync(f);
  if (stat.size > 1024 * 1024) {
    largeFiles.push({
      file: f.replace(ROOT.replace(/\\/g, "/") + "/", ""),
      size: (stat.size / 1024 / 1024).toFixed(2) + " MB",
    });
  }
});
fs.writeFileSync("large-files-raw.json", JSON.stringify(largeFiles, null, 2));

// 2. Unused Files Heuristic (Very basic: is the basename mentioned anywhere else?)
// More advanced: build an import graph. For now, check if the file name (without extension) is found in other files.
const fileUsage = {};
allSrcFiles.forEach((f) => {
  fileUsage[f] = 0;
});

allSrcFiles.forEach((f) => {
  const content = fs.readFileSync(f, "utf-8");
  allSrcFiles.forEach((target) => {
    if (f === target) return;
    // Get relative path without extension
    const parsed = path.parse(target);
    const baseName = parsed.name;
    // Skip index files from this heuristic
    if (baseName === "index") return;
    if (content.includes(baseName)) {
      fileUsage[target]++;
    }
  });
});

const unusedFiles = Object.entries(fileUsage)
  .filter(([f, count]) => count === 0)
  .map(([f]) => f);

fs.writeFileSync("unused-files-raw.json", JSON.stringify(unusedFiles, null, 2));

// 3. Unused Packages
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
const deps = Object.keys(pkg.dependencies || {});
const unusedDeps = [];
deps.forEach((dep) => {
  // Try to find if dep is imported
  // very naive grep:
  try {
    // If grep returns 0 (found), it's used
    execSync(`git grep -E "from ['\\"]${dep}['\\"]|require\\(['\\"]${dep}['\\"]\\)"`, {
      cwd: ROOT,
      stdio: "ignore",
    });
  } catch (e) {
    // If grep returns 1 (not found)
    unusedDeps.push(dep);
  }
});
fs.writeFileSync("unused-deps-raw.json", JSON.stringify(unusedDeps, null, 2));

console.log("Audit script completed.");
