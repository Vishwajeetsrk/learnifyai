/**
 * gen-course-covers.cjs — generates premium branded course cover SVGs
 * Output: public/course-covers/<slug>.svg (800x450)
 * Run: node scripts/gen-course-covers.cjs
 */
const fs = require("fs");
const path = require("path");

const COURSES = [
  { slug: "html-css-essentials", title: "HTML & CSS Essentials", tagline: "Build real pages — from skeleton to stunning layouts", lessons: 17, accent: "#f97316", deep: "#7c2d12", glyph: "HC" },
  { slug: "javascript-zero-to-pro", title: "JavaScript Zero to Pro", tagline: "Variables to real apps — counter, games and APIs", lessons: 16, accent: "#facc15", deep: "#713f12", glyph: "JS" },
  { slug: "python-for-everyone", title: "Python for Everyone", tagline: "The friendliest path into programming and AI", lessons: 6, accent: "#38bdf8", deep: "#0c4a6e", glyph: "PY" },
  { slug: "java-fundamentals", title: "Java Fundamentals", tagline: "Strong typing, real-world apps, enterprise career", lessons: 6, accent: "#f87171", deep: "#7f1d1d", glyph: "JV" },
  { slug: "excel-sheets-mastery", title: "Excel & Sheets Mastery", tagline: "Formulas, data and dashboards that impress", lessons: 6, accent: "#4ade80", deep: "#14532d", glyph: "XL" },
  { slug: "word-powerpoint-pro", title: "Word & PowerPoint Pro", tagline: "Documents and decks that get the job done", lessons: 6, accent: "#60a5fa", deep: "#1e3a8a", glyph: "WP" },
  { slug: "power-bi-visuals", title: "Power BI Visuals", tagline: "Turn raw data into decisions with dashboards", lessons: 6, accent: "#fbbf24", deep: "#78350f", glyph: "PB" },
  { slug: "figma-ui-bootcamp", title: "Figma UI Bootcamp", tagline: "Design interfaces the modern product way", lessons: 6, accent: "#c084fc", deep: "#581c87", glyph: "FG" },
  { slug: "vs-code-git-essentials", title: "VS Code + Git Essentials", tagline: "The professional developer's daily workflow", lessons: 6, accent: "#22d3ee", deep: "#164e63", glyph: "VC" },
  { slug: "chatgpt-claude-ai", title: "ChatGPT & Claude AI", tagline: "Prompt, automate and build with AI assistants", lessons: 6, accent: "#a3e635", deep: "#365314", glyph: "AI" },
  { slug: "google-workspace-pro", title: "Google Workspace Pro", tagline: "Gmail, Drive, Docs, Meet — work without chaos", lessons: 6, accent: "#34d399", deep: "#064e3b", glyph: "GW" },
  { slug: "template-mastery", title: "Template Mastery", tagline: "Customize and launch complete websites fast", lessons: 13, accent: "#818cf8", deep: "#1e1b4b", glyph: "TM" },
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cover(c) {
  const accent = c.accent;
  const deep = c.deep;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1120"/>
      <stop offset="1" stop-color="${deep}"/>
    </linearGradient>
    <linearGradient id="glyph" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.28" cy="0.22" r="0.95">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity="0.08"/>
    </pattern>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${accent}" stroke-opacity="0.14" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="450" rx="28" fill="url(#bg)"/>
  <rect width="800" height="450" rx="28" fill="url(#glow)"/>
  <rect width="800" height="450" rx="28" fill="url(#dots)"/>
  <rect width="400" height="450" x="400" fill="url(#grid)" opacity="0.6"/>
  <circle cx="640" cy="120" r="220" fill="none" stroke="${accent}" stroke-opacity="0.16" stroke-width="2"/>
  <circle cx="640" cy="120" r="170" fill="none" stroke="${accent}" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="640" cy="225" r="98" fill="#0b1120" fill-opacity="0.65"/>
  <circle cx="640" cy="225" r="98" fill="none" stroke="${accent}" stroke-opacity="0.6" stroke-width="8"/>
  <text x="640" y="262" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="bold" fill="url(#glyph)">${esc(c.glyph)}</text>
  <g transform="translate(48, 40)">
    <rect x="0" y="0" width="34" height="34" rx="9" fill="${accent}"/>
    <path d="M 9 22 L 15 13 L 20 19 L 25 9 L 30 22 Z" fill="#0b1120"/>
  </g>
  <text x="92" y="64" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#e2e8f0">Learnify AI</text>
  <text x="48" y="120" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="#f8fafc">${esc(c.title)}</text>
  <text x="49" y="154" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#cbd5e1">${esc(c.tagline)}</text>
  <g font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold">
    <rect x="48" y="185" width="74" height="30" rx="15" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.55"/>
    <text x="85" y="205" text-anchor="middle" fill="${accent}">FREE</text>
    <rect x="134" y="185" width="118" height="30" rx="15" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.16"/>
    <text x="193" y="205" text-anchor="middle" fill="#cbd5e1">BEGINNER</text>
    <rect x="264" y="185" width="132" height="30" rx="15" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.16"/>
    <text x="330" y="205" text-anchor="middle" fill="#cbd5e1">${c.lessons} LESSONS</text>
  </g>
  <text x="48" y="330" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#94a3b8">Certificate on completion · Interactive exercises · AI assistance</text>
  <text x="48" y="414" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#64748b">learnifyai.in</text>
</svg>
`;
}

const outDir = path.join(__dirname, "..", "public", "course-covers");
fs.mkdirSync(outDir, { recursive: true });
for (const c of COURSES) {
  fs.writeFileSync(path.join(outDir, `${c.slug}.svg`), cover(c).trim() + "\n");
  console.log("wrote", `public/course-covers/${c.slug}.svg`);
}
console.log("done —", COURSES.length, "covers");
