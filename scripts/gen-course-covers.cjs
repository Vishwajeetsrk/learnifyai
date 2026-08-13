/**
 * gen-course-covers.cjs — generates premium branded course cover SVGs
 * Output: public/course-covers/<slug>.svg (800x450)
 * Run: node scripts/gen-course-covers.cjs
 */
const fs = require("fs");
const path = require("path");

const COURSES = [
  {
    slug: "html-css-essentials",
    title: "HTML & CSS Essentials",
    tagline: "Build real pages — from skeleton to stunning layouts",
    lessons: 17,
    accent: "#f97316",
    deep: "#7c2d12",
    logos: ["html", "css"],
    topics: ["Semantic HTML structure", "Flexbox & Grid layouts", "Responsive design", "Forms & accessibility"],
  },
  {
    slug: "javascript-zero-to-pro",
    title: "JavaScript Zero to Pro",
    tagline: "Variables to real apps — counter, games and APIs",
    lessons: 16,
    accent: "#facc15",
    deep: "#713f12",
    logos: ["js"],
    topics: ["Variables & functions", "DOM & event handling", "Async & fetch APIs", "Mini projects & games"],
  },
  {
    slug: "python-for-everyone",
    title: "Python for Everyone",
    tagline: "The friendliest path into programming and AI",
    lessons: 6,
    accent: "#38bdf8",
    deep: "#0c4a6e",
    logos: ["python"],
    topics: ["Python syntax & logic", "Loops, lists & functions", "Strings & file I/O", "Basics of AI & automation"],
  },
  {
    slug: "java-fundamentals",
    title: "Java Fundamentals",
    tagline: "Strong typing, real-world apps, enterprise career",
    lessons: 6,
    accent: "#f87171",
    deep: "#7f1d1d",
    logos: ["java"],
    topics: ["Types & conditionals", "Classes & OOP", "Collections & methods", "Real-world mini apps"],
  },
  {
    slug: "excel-sheets-mastery",
    title: "Excel & Sheets Mastery",
    tagline: "Formulas, data and dashboards that impress",
    lessons: 6,
    accent: "#4ade80",
    deep: "#14532d",
    logos: ["excel"],
    topics: ["Formulas & functions", "Lookups & references", "Charts & dashboards", "Data cleaning tricks"],
  },
  {
    slug: "word-powerpoint-pro",
    title: "Word & PowerPoint Pro",
    tagline: "Documents and decks that get the job done",
    lessons: 6,
    accent: "#60a5fa",
    deep: "#1e3a8a",
    logos: ["word", "powerpoint"],
    topics: ["Styles & formatting", "Tables, images & mail merge", "Slide design & transitions", "Professional templates"],
  },
  {
    slug: "power-bi-visuals",
    title: "Power BI Visuals",
    tagline: "Turn raw data into decisions with dashboards",
    lessons: 6,
    accent: "#fbbf24",
    deep: "#78350f",
    logos: ["powerbi"],
    topics: ["Data import & modeling", "DAX essentials", "Interactive dashboards", "Charts & KPIs"],
  },
  {
    slug: "figma-ui-bootcamp",
    title: "Figma UI Bootcamp",
    tagline: "Design interfaces the modern product way",
    lessons: 6,
    accent: "#c084fc",
    deep: "#581c87",
    logos: ["figma"],
    topics: ["Frames & components", "Auto layout mastery", "Design systems", "Prototyping & handoff"],
  },
  {
    slug: "vs-code-git-essentials",
    title: "VS Code + Git Essentials",
    tagline: "The professional developer's daily workflow",
    lessons: 6,
    accent: "#22d3ee",
    deep: "#164e63",
    logos: ["vscode", "git"],
    topics: ["Editor shortcuts & settings", "Live Server & extensions", "Git commits & branches", "Push to GitHub"],
  },
  {
    slug: "chatgpt-claude-ai",
    title: "ChatGPT & Claude AI",
    tagline: "Prompt, automate and build with AI assistants",
    lessons: 6,
    accent: "#a3e635",
    deep: "#365314",
    logos: ["chatgpt", "claude"],
    topics: ["Effective prompting", "AI writing & research", "Automation with AI", "Build AI assistants"],
  },
  {
    slug: "google-workspace-pro",
    title: "Google Workspace Pro",
    tagline: "Gmail, Drive, Docs, Meet — work without chaos",
    lessons: 6,
    accent: "#34d399",
    deep: "#064e3b",
    logos: ["google"],
    topics: ["Gmail & calendar power", "Docs & Sheets workflow", "Drive organization", "Slides & Meet collab"],
  },
  {
    slug: "template-mastery",
    title: "Template Mastery",
    tagline: "Customize and launch complete websites fast",
    lessons: 13,
    accent: "#818cf8",
    deep: "#1e1b4b",
    logos: ["template"],
    topics: ["Theme customization", "Page builders & sections", "Custom CSS & widgets", "Launch & optimize sites"],
  },
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Embed the official Learnify AI logo (icon + wordmark) rendered white,
// mirroring how the app displays it on dark backgrounds (brightness(0) invert(1)).
const logoPng = fs.readFileSync(path.join(__dirname, "..", "src", "assets", "learnify-logo.png")).toString("base64");
const LOGO_W = 666;
const LOGO_H = 375;
const LOGO_WIDTH = 150;
const LOGO_HEIGHT = Math.round((LOGO_H / LOGO_W) * LOGO_WIDTH);
const LOGO_DATA_URI = `data:image/png;base64,${logoPng}`;
const LOGO_TAG =
  `<image href="${LOGO_DATA_URI}" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" x="48" y="30" ` +
  `style="filter:brightness(0) invert(1)" preserveAspectRatio="xMidYMid meet"/>`;

// Load standalone brand logo SVGs (32x32 viewBox) and inline their contents.
const LOGO_DIR = path.join(__dirname, "..", "public", "course-logos");
const logoCache = new Map();
function loadLogo(name) {
  if (logoCache.has(name)) return logoCache.get(name);
  const file = path.join(LOGO_DIR, `${name}.svg`);
  let inner = "";
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, "utf8");
    inner = raw.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
  }
  logoCache.set(name, inner);
  return inner;
}

// White rounded tile + brand logo(s) replacing the old letter glyph.
function brandBadge(c) {
  const glow = `<circle cx="640" cy="225" r="118" fill="${c.accent}" fill-opacity="0.16"/>`;
  const tile = `<rect x="576" y="161" width="128" height="128" rx="28" fill="#ffffff" fill-opacity="0.97"/>
  <rect x="576" y="161" width="128" height="128" rx="28" fill="none" stroke="${c.accent}" stroke-opacity="0.9" stroke-width="3"/>`;
  const n = c.logos.length;
  if (n === 0) return glow + tile;
  if (n === 1) {
    const s = 88 / 32;
    return (
      glow +
      tile +
      `<g transform="translate(596 181) scale(${s})">${loadLogo(c.logos[0])}</g>`
    );
  }
  const s = 56 / 32;
  const parts = c.logos.map((l, i) => {
    const x = 584 + i * 62;
    return `<g transform="translate(${x} 197) scale(${s})">${loadLogo(l)}</g>`;
  });
  return glow + tile + parts.join("");
}

function topicsBlock(c) {
  const rows = c.topics
    .map(
      (t, i) =>
        `<circle cx="56" cy="${252 + i * 27}" r="5" fill="${c.accent}"/>
         <text x="70" y="${256 + i * 27}" font-family="${FONT}" font-size="14" fill="#cbd5e1">${esc(t)}</text>`,
    )
    .join("\n  ");
  return `<text x="48" y="232" font-family="${FONT}" font-size="12" font-weight="bold" letter-spacing="2.5" fill="#94a3b8">WHAT YOU'LL LEARN</text>
  ${rows}`;
}

const FONT = `"Inter", "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif`;

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
  ${brandBadge(c)}
  ${LOGO_TAG}
  <text x="48" y="122" font-family="${FONT}" font-size="42" font-weight="800" letter-spacing="-0.5" fill="#f8fafc">${esc(c.title)}</text>
  <text x="49" y="156" font-family="${FONT}" font-size="18" fill="#cbd5e1">${esc(c.tagline)}</text>
  <g font-family="${FONT}" font-size="14" font-weight="bold">
    <rect x="48" y="185" width="74" height="30" rx="15" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.55"/>
    <text x="85" y="205" text-anchor="middle" fill="${accent}">FREE</text>
    <rect x="134" y="185" width="118" height="30" rx="15" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.16"/>
    <text x="193" y="205" text-anchor="middle" fill="#cbd5e1">BEGINNER</text>
    <rect x="264" y="185" width="132" height="30" rx="15" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.16"/>
    <text x="330" y="205" text-anchor="middle" fill="#cbd5e1">${c.lessons} LESSONS</text>
  </g>
  ${topicsBlock(c)}
  <text x="48" y="376" font-family="${FONT}" font-size="12" fill="#64748b">Certificate on completion · Interactive exercises · AI assistance</text>
  <text x="48" y="414" font-family="${FONT}" font-size="13" fill="#64748b">learnifyai.in</text>
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
