import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = 'C:/Users/vishw/Music/Learnify AI/Projects';
const DEST_DIR = 'C:/Users/vishw/Music/Learnify AI/public/preset-sites';

// Exclude build/code source files and node modules
const EXCLUDE_NAMES = [
  'node_modules',
  'src',
  '.git',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'postcss.config.js',
  'tailwind.config.js',
  '.gitignore',
  'index.source.html',
  'scripts',
  'pnpm-lock.yaml'
];

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  const entries = fs.readdirSync(from, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_NAMES.includes(entry.name)) continue;
    
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);
    
    if (entry.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

async function main() {
  console.log("Starting to copy project files to public/preset-sites...");
  
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`Projects directory not found at: ${PROJECTS_DIR}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  // Create empty dummy _shared files to prevent browser console 404s
  const sharedDir = path.join(DEST_DIR, '_shared');
  if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true });
  }
  fs.writeFileSync(path.join(sharedDir, 'preset-sections.css'), '/* Shared sections styles placeholder */');
  fs.writeFileSync(path.join(sharedDir, 'preset-nav-fix.js'), '// Navigation fix helper placeholder\nconsole.log("preset-nav-fix loaded");');
  
  const projectFolders = fs.readdirSync(PROJECTS_DIR);
  let count = 0;
  
  for (const name of projectFolders) {
    const parentPath = path.join(PROJECTS_DIR, name);
    if (!fs.statSync(parentPath).isDirectory()) continue;
    
    // Check if there is a subfolder with the same name containing index.html
    const projectSubfolder = path.join(parentPath, name);
    if (fs.existsSync(projectSubfolder) && fs.statSync(projectSubfolder).isDirectory()) {
      const indexPath = path.join(projectSubfolder, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`Copying built project: ${name}`);
        copyFolderSync(projectSubfolder, path.join(DEST_DIR, name));
        count++;
      }
    }
  }
  
  console.log(`Successfully copied ${count} projects to public/preset-sites!`);
}

main().catch(console.error);
