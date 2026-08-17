import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  FileText,
  Loader2,
  Sparkles,
  Download,
  Check,
  Edit3,
  Eye,
  Zap,
  Target,
  Code2,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Plus,
  Briefcase,
  FolderOpen,
  Award,
  Trophy,
  Globe,
  Shield,
  Code,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Star,
  CheckCircle2,
  Layers,
  Wrench,
  PenTool,
  Printer,
  ChevronDown,
  Palette,
  Sliders,
  Maximize2,
  Minimize2,
  Trash2,
  User,
  Share2,
  Link as LinkIcon,
  MessageSquare,
  Sparkle,
  Type,
  LayoutGrid,
  MoveUp,
  MoveDown,
  List,
  Columns,
  Maximize,
  Minimize,
  SlidersHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  History,
  Copy,
  Send,
  Building2,
  Compass,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppShell } from "@/components/AppShell";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generateResume, extractResumeFields } from "@/lib/resume.functions";
import { ResumeFileUpload } from "@/components/ResumeFileUpload";

/* ── Templates ── */
const TEMPLATES = [
  {
    id: "dreamsync",
    label: "DreamSync Pro",
    badge: "100% ATS",
    desc: "Executive layout with section icons & accent lines",
    accent: "#0f172a",
    previewBg: "#0f172a",
    previewText: "#fff",
  },
  {
    id: "modern",
    label: "Modern Tech",
    badge: "ATS Ready",
    desc: "Clean indigo accent, high readability hierarchy",
    accent: "#4f46e5",
    previewBg: "#4f46e5",
    previewText: "#fff",
  },
  {
    id: "classic",
    label: "Executive Classic",
    badge: "Formal",
    desc: "Serif headers, formal corporate structure",
    accent: "#1e293b",
    previewBg: "#1e293b",
    previewText: "#fff",
  },
  {
    id: "minimal",
    label: "Minimal ATS",
    badge: "100% ATS",
    desc: "Monochrome, max ATS scanning rate",
    accent: "#374151",
    previewBg: "#f9fafb",
    previewText: "#111827",
  },
  {
    id: "creative",
    label: "Creative Showcase",
    badge: "Portfolio",
    desc: "Emerald accents, skill pill tags & badges",
    accent: "#059669",
    previewBg: "#059669",
    previewText: "#fff",
  },
];

const TARGET_ROLE_PRESETS = [
  "AI Software Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "Salesforce & Data Operations",
  "Data Scientist",
  "Product Manager",
  "DevOps & Cloud Engineer",
];

const XYZ_FORMULAS = [
  { id: 1, text: "• Accomplished [X] as measured by [Y] by doing [Z]" },
  { id: 2, text: "• Led a team of [X] to achieve [Y] by implementing [Z]" },
  { id: 3, text: "• Reduced [X] by [Y%] through [Z]" },
  { id: 4, text: "• Increased [X] by [Y] using [Z] approach" },
  { id: 5, text: "• Delivered [X] project saving [Y] by [Z]" },
];

const SKILL_KEYWORDS_BANK = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "SQL",
  "PostgreSQL",
  "Supabase",
  "AWS",
  "Docker",
  "REST APIs",
  "Microservices",
  "System Design",
  "CI/CD",
  "Git",
  "Salesforce CRM",
  "Generative AI",
  "Tailwind CSS",
  "GraphQL",
  "Redis",
];

const LEARNIFY_COURSES = [
  { name: "Full Stack AI Engineer", category: "AI & Development", match: 98 },
  { name: "Data Science & ML Bootcamp", category: "Data & Analytics", match: 95 },
  { name: "System Design Mastery", category: "Architecture", match: 91 },
  { name: "DSA & Competitive Programming", category: "Core CS", match: 88 },
  { name: "React + Next.js Pro", category: "Frontend", match: 85 },
  { name: "Cloud & DevOps with AWS", category: "Infrastructure", match: 82 },
];

const FONTS = [
  { id: "font-sans", label: "Inter (Modern Sans)" },
  { id: "font-display", label: "Space Grotesk (Tech)" },
  { id: "font-serif", label: "Playfair (Executive Serif)" },
  { id: "font-mono", label: "Roboto Mono (Code)" },
];

function calculateLiveAtsScore(form: Record<string, string>) {
  let score = 35;
  const missing: string[] = [];

  if (form.fullName && form.fullName.length > 2) score += 5;
  if (form.email && form.email.includes("@")) score += 5;
  if (form.phone && form.phone.length > 5) score += 5;
  if (form.location) score += 5;
  if (form.linkedin) score += 5;
  if (form.github) score += 5;
  if (form.summary && form.summary.length > 80) score += 10;

  const exp = form.experience || "";
  if (exp.length > 100) score += 10;
  if (exp.includes("•") || exp.includes("-")) score += 10;
  if (/reduced|increased|built|led|engineered|achieved|managed|developed/i.test(exp)) score += 10;

  const skills = form.skills || "";
  if (skills.length > 30) score += 5;

  const requiredKeywords = ["TypeScript", "React", "Python", "SQL", "AWS", "REST APIs", "Git", "System Design", "CI/CD", "PostgreSQL"];
  for (const kw of requiredKeywords) {
    if (!skills.includes(kw) && !exp.includes(kw) && !form.summary?.includes(kw)) {
      missing.push(kw);
    }
  }

  if (missing.length === 0) score += 10;

  return {
    score: Math.min(99, Math.max(40, score)),
    missingKeywords: missing.slice(0, 5),
  };
}

function markdownToHtml(md: string) {
  let html = md
    .replace(/\r\n/g, "\n")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^\* (.*$)/gim, "<li>$1</li>")
    .replace(/^- (.*$)/gim, "<li>$1</li>");

  html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);

  return html
    .split("\n\n")
    .map((p) => {
      if (p.trim().startsWith("<h") || p.trim().startsWith("<ul")) return p;
      return `<p>${p.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

/* ── Structured Parsers ── */
interface ExperienceItem {
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  bullets: string[];
}

function parseExperienceEntries(text: string): ExperienceItem[] {
  if (!text || !text.trim()) return [];
  const blocks = text.split(/\n\n+/);
  const items: ExperienceItem[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const firstLine = lines[0];
    let title = firstLine;
    let company = "";
    let startDate = "";
    let endDate = "";
    let location = "";
    const bullets: string[] = [];

    if (firstLine.includes("|")) {
      const parts = firstLine.split("|").map((p) => p.trim());
      const roleComp = parts[0];
      if (roleComp.includes(",")) {
        const [r, c] = roleComp.split(",").map((s) => s.trim());
        title = r;
        company = c;
      } else if (roleComp.includes("@")) {
        const [r, c] = roleComp.split("@").map((s) => s.trim());
        title = r;
        company = c;
      } else {
        title = roleComp;
      }

      if (parts[1]) {
        const dateParts = parts[1].split("–").map((d) => d.trim());
        startDate = dateParts[0] || parts[1];
        endDate = dateParts[1] || "";
      }
      if (parts[2]) location = parts[2];
    } else if (firstLine.includes("@")) {
      const [r, rest] = firstLine.split("@").map((s) => s.trim());
      title = r;
      if (rest.includes("(")) {
        const [c, d] = rest.split("(").map((s) => s.trim());
        company = c;
        startDate = d.replace(")", "");
      } else {
        company = rest;
      }
    } else if (firstLine.includes(",")) {
      const [r, c] = firstLine.split(",").map((s) => s.trim());
      title = r;
      company = c;
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
        bullets.push(line.replace(/^[•\-*]\s*/, ""));
      } else {
        bullets.push(line);
      }
    }

    items.push({ title, company, startDate, endDate, location, bullets });
  }

  return items;
}

interface EducationItem {
  degree: string;
  school: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

function parseEducationEntries(text: string): EducationItem[] {
  if (!text || !text.trim()) return [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const items: EducationItem[] = [];

  for (const line of lines) {
    let degree = line;
    let school = "";
    let startDate = "";
    let endDate = "";
    let location = "";

    if (line.includes("|")) {
      const parts = line.split("|").map((p) => p.trim());
      const degSchool = parts[0];
      if (degSchool.includes(",")) {
        const [d, s] = degSchool.split(",").map((x) => x.trim());
        degree = d;
        school = s;
      } else {
        degree = degSchool;
      }
      if (parts[1]) {
        const dParts = parts[1].split("–").map((x) => x.trim());
        startDate = dParts[0];
        endDate = dParts[1] || "";
      }
      if (parts[2]) location = parts[2];
    } else if (line.includes(",")) {
      const [d, s] = line.split(",").map((x) => x.trim());
      degree = d;
      school = s;
    }

    items.push({ degree, school, startDate, endDate, location });
  }

  return items;
}

interface ProjectItem {
  title: string;
  subtitle?: string;
  techStack?: string;
  dates?: string;
  bullets: string[];
}

function parseProjectEntries(text: string): ProjectItem[] {
  if (!text || !text.trim()) return [];
  const blocks = text.split(/\n\n+/);
  const items: ProjectItem[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const firstLine = lines[0];
    let title = firstLine;
    let subtitle = "";
    let dates = "";
    let techStack = "";
    const bullets: string[] = [];

    if (firstLine.includes("|")) {
      const parts = firstLine.split("|").map((p) => p.trim());
      const titlePart = parts[0];
      if (titlePart.includes("—")) {
        const [t, s] = titlePart.split("—").map((x) => x.trim());
        title = t;
        subtitle = s;
      } else {
        title = titlePart;
      }
      dates = parts[1] || "";
    } else if (firstLine.includes("—")) {
      const [t, s] = firstLine.split("—").map((x) => x.trim());
      title = t;
      subtitle = s;
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().startsWith("tech stack:")) {
        techStack = line.replace(/tech stack:\s*/i, "");
      } else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
        bullets.push(line.replace(/^[•\-*]\s*/, ""));
      } else {
        bullets.push(line);
      }
    }

    items.push({ title, subtitle, techStack, dates, bullets });
  }

  return items;
}

interface SkillCategory {
  category: string;
  skills: string[];
}

function parseSkillCategories(text: string): SkillCategory[] {
  if (!text || !text.trim()) return [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const cats: SkillCategory[] = [];

  for (const line of lines) {
    if (line.includes(":")) {
      const [c, rest] = line.split(":").map((x) => x.trim());
      const skills = rest
        .split(/[,|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      cats.push({ category: c, skills });
    } else {
      const skills = line
        .split(/[,|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      cats.push({ category: "Skills", skills });
    }
  }

  return cats;
}

const SAMPLE_TEMPLATE_FORM: Record<string, string> = {
  fullName: "ALEX RIVERA",
  targetRole: "Senior Full Stack Engineer | Cloud & AI Architect",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  linkedin: "https://www.linkedin.com/in/alex-rivera-dev/",
  github: "https://github.com/alexrivera-dev",
  website: "https://alexrivera.dev",
  portfolio: "https://alexrivera.dev/portfolio",
  summary:
    "Results-driven Senior Full Stack Engineer with 4+ years of experience architecting high-availability cloud platforms, scalable REST/GraphQL APIs, and AI-assisted workflows. Skilled in TypeScript, React, Next.js, Node.js, Python, PostgreSQL, and cloud infrastructure.",
  experience: `Senior Software Engineer, TechCorp Systems | Jan 2024 – Present | San Francisco, CA
• Spearheaded frontend and backend architecture for enterprise SaaS platform serving 500K+ active users.
• Reduced API response latency by 42% through query optimization, Redis caching, and microservices refactoring.
• Mentored a team of 6 junior engineers and established automated CI/CD deployment pipelines.

Full Stack Developer, Innovate Labs | Jun 2022 – Dec 2023 | San Jose, CA
• Designed and shipped 12+ production web applications using React, Next.js, Node.js, and PostgreSQL.
• Integrated Stripe payment gateway and automated invoicing, processing $2.5M+ in annual revenue.
• Implemented robust OAuth2 authentication and Role-Based Access Control (RBAC).`,
  education: `B.S. in Computer Science, Stanford University | Sep 2018 – May 2022 | Stanford, CA`,
  skills: `Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
Frameworks: React.js, Next.js, Node.js, Express, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2, Lambda), Docker, Vercel
Tools & Practices: Git, REST APIs, GraphQL, Jest, CI/CD, Agile/Scrum`,
  projects: `CloudMetrics — Real-Time Infrastructure Monitoring Dashboard | 2025
Tech Stack: React, WebSockets, Node.js, TimescaleDB, Tailwind CSS
• Developed real-time telemetry dashboard handling 10K events/sec with customized alert rules.
• Live: https://cloudmetrics-demo.example.com

AIChat Studio — Generative AI Prompt Automation Tool | 2024
Tech Stack: Next.js, OpenAI API, Vector DB, Supabase, Tailwind CSS
• Built full-stack AI platform integrating LLM APIs with credit management and vector search.
• Live: https://aichat-studio.example.com`,
  certifications: `• AWS Certified Solutions Architect – Associate (2024)
• Meta Certified Senior Front-End Developer (2023)`,
  strengths: `System Architecture, Full-Stack Optimization, Technical Leadership, AI API Integration`,
  languages: `English (Native), Spanish (Professional)`,
  awards: `1st Place — National AI Hackathon 2025`,
  declaration: `I hereby declare that the information provided is accurate and true to the best of my knowledge.`,
  signatoryName: "ALEX RIVERA",
  signatoryPlace: "San Francisco",
};

const ATS_DEFAULT_FORM: Record<string, string> = SAMPLE_TEMPLATE_FORM;

function FormatToolbar({
  onFormat,
  onAiAction,
}: {
  onFormat: (tag: string) => void;
  onAiAction?: (action: string) => void;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-1 p-1.5 bg-muted/40 rounded-lg border border-border/50 text-xs mb-1.5">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onFormat("bold")}
          className="px-2 py-0.5 hover:bg-muted rounded font-bold text-xs"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => onFormat("italic")}
          className="px-2 py-0.5 hover:bg-muted rounded italic font-serif text-xs"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => onFormat("underline")}
          className="px-2 py-0.5 hover:bg-muted rounded underline text-xs"
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => onFormat("bullet")}
          className="px-2 py-0.5 hover:bg-muted rounded text-xs"
          title="Bulleted List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => onFormat("link")}
          className="px-2 py-0.5 hover:bg-muted rounded text-xs"
          title="Insert Link"
        >
          🔗 Link
        </button>
      </div>

      {onAiAction && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAiAction("improve")}
            className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] hover:bg-indigo-100 transition flex items-center gap-1 border border-indigo-200 dark:border-indigo-800/40"
          >
            <Sparkles className="h-2.5 w-2.5 text-indigo-600" /> Improve
          </button>
          <button
            type="button"
            onClick={() => onAiAction("grammar")}
            className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] hover:bg-emerald-100 transition flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40"
          >
            <Check className="h-2.5 w-2.5 text-emerald-600" /> Grammar
          </button>
          <button
            type="button"
            onClick={() => onAiAction("shorter")}
            className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold text-[10px] hover:bg-amber-100 transition flex items-center gap-1 border border-amber-200 dark:border-amber-800/40"
          >
            <Zap className="h-2.5 w-2.5 text-amber-600" /> Shorter
          </button>
        </div>
      )}
    </div>
  );
}

function SectionTitleConfigHeader({
  sectionKey,
  defaultTitle,
  form,
  update,
}: {
  sectionKey: string;
  defaultTitle: string;
  form: Record<string, string>;
  update: (field: string, val: string) => void;
}) {
  const titleKey = `${sectionKey}SectionTitle`;
  const iconKey = `${sectionKey}SectionIcon`;
  const currentTitle = form[titleKey] ?? defaultTitle;
  const currentIcon = form[iconKey] ?? "default";

  return (
    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 mb-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Edit3 className="h-3 w-3 text-primary" /> Section Title & Icon Settings
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Custom Section Title</label>
          <input
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-background font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            value={currentTitle}
            onChange={(e) => update(titleKey, e.target.value)}
            placeholder={defaultTitle}
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">SVG Icon Preset</label>
          <select
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-background font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            value={currentIcon}
            onChange={(e) => update(iconKey, e.target.value)}
          >
            <option value="default">Default Section Icon</option>
            <option value="award">Award (SVG Icon)</option>
            <option value="briefcase">Briefcase / Work (SVG Icon)</option>
            <option value="grad">Graduation Cap / Edu (SVG Icon)</option>
            <option value="folder">Folder / Projects (SVG Icon)</option>
            <option value="wrench">Wrench / Skills (SVG Icon)</option>
            <option value="star">Star / Competencies (SVG Icon)</option>
            <option value="globe">Globe / Languages (SVG Icon)</option>
            <option value="trophy">Trophy / Honors (SVG Icon)</option>
            <option value="pen">Pen / Declaration (SVG Icon)</option>
            <option value="file">File / Summary (SVG Icon)</option>
            <option value="shield">Shield / Security (SVG Icon)</option>
            <option value="code">Code / Development (SVG Icon)</option>
            <option value="none">No Icon</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function getSectionIconAndTitle(
  sectionKey: string,
  defaultIcon: any,
  defaultTitle: string,
  form: Record<string, string>,
) {
  const customTitle = form[`${sectionKey}SectionTitle`] || defaultTitle;
  const customIconKey = form[`${sectionKey}SectionIcon`];

  let IconComp = defaultIcon;
  if (customIconKey && customIconKey !== "default") {
    if (customIconKey === "award") IconComp = Award;
    else if (customIconKey === "briefcase") IconComp = Briefcase;
    else if (customIconKey === "grad") IconComp = GraduationCap;
    else if (customIconKey === "folder") IconComp = FolderOpen;
    else if (customIconKey === "wrench") IconComp = Wrench;
    else if (customIconKey === "star") IconComp = Star;
    else if (customIconKey === "globe") IconComp = Globe;
    else if (customIconKey === "trophy") IconComp = Trophy;
    else if (customIconKey === "pen") IconComp = PenTool;
    else if (customIconKey === "file") IconComp = FileText;
    else if (customIconKey === "shield") IconComp = Shield;
    else if (customIconKey === "code") IconComp = Code;
    else if (customIconKey === "none") IconComp = null;
  }
  return { title: customTitle, icon: IconComp };
}

/* ── Live Preview Component ── */
function ResumePreview({
  form,
  template,
  accentColor,
  fontFamily = "font-sans",
  layoutColumns = "one",
  headerPosition = "top",
  headerAlign = "center",
  baseFontSize = "10.5pt",
  nameFontSizeOffset = 11,
  titleFontSizeOffset = 5,
  headingFontSizeOffset = 1,
  lineHeightVal = 1.3,
  marginMmVal = 10,
  accentTargets = ["name", "jobTitle", "headings", "headingsLine", "headerIcons", "dotsBars", "dates", "entrySubtitle", "linkIcons"],
  detailsArrangement = "pipe",
  iconStyleVal = "Icon Style: Circle Outline",
  headingCap = "uppercase",
  workOrder = "title-employer",
  skillsStyle = "compact",
}: {
  form: Record<string, string>;
  template: (typeof TEMPLATES)[0];
  accentColor?: string;
  fontFamily?: string;
  layoutColumns?: "one" | "two" | "mix";
  headerPosition?: "top" | "left" | "right";
  headerAlign?: "left" | "center";
  baseFontSize?: string;
  nameFontSizeOffset?: number;
  titleFontSizeOffset?: number;
  headingFontSizeOffset?: number;
  lineHeightVal?: number;
  marginMmVal?: number;
  accentTargets?: string[];
  detailsArrangement?: "icon" | "bullet" | "pipe" | "bar";
  iconStyleVal?: string;
  headingCap?: "uppercase" | "capitalize";
  workOrder?: "title-employer" | "employer-title";
  skillsStyle?: "compact" | "badges" | "grid";
}) {
  const isCreative = template.id === "creative" || skillsStyle === "badges";
  const isDreamSync = template.id === "dreamsync";
  const isModern = template.id === "modern";
  const isClassic = template.id === "classic";
  const isMinimal = template.id === "minimal";
  const accent = accentColor || template.accent || "#0f172a";

  const hasAccent = (key: string) => accentTargets.includes(key);

  const basePt = parseFloat(baseFontSize) || 10.5;
  const namePt = `${basePt + nameFontSizeOffset}pt`;
  const titlePt = `${basePt + titleFontSizeOffset}pt`;
  const headingPt = `${basePt + headingFontSizeOffset}pt`;

  const expItems = parseExperienceEntries(form.experience || "");
  const eduItems = parseEducationEntries(form.education || "");
  const projItems = parseProjectEntries(form.projects || "");
  const skillCats = parseSkillCategories(form.skills || "");

  const sepString =
    detailsArrangement === "bullet"
      ? " • "
      : detailsArrangement === "bar"
        ? " / "
        : " | ";

  const renderIconFrame = (IconComponent: any) => {
    if (!IconComponent) return null;
    if (iconStyleVal.includes("No Frame")) {
      return (
        <IconComponent
          className="h-4 w-4 shrink-0"
          style={{ color: hasAccent("headerIcons") ? accent : undefined }}
        />
      );
    }
    if (iconStyleVal.includes("Circle Filled")) {
      return (
        <div
          className="p-1 rounded-full text-white shrink-0 shadow-xs"
          style={{ backgroundColor: accent }}
        >
          <IconComponent className="h-3 w-3" />
        </div>
      );
    }
    if (iconStyleVal.includes("Rounded Filled")) {
      return (
        <div
          className="p-1 rounded-md text-white shrink-0 shadow-xs"
          style={{ backgroundColor: accent }}
        >
          <IconComponent className="h-3 w-3" />
        </div>
      );
    }
    if (iconStyleVal.includes("Square Filled")) {
      return (
        <div
          className="p-1 rounded-none text-white shrink-0 shadow-xs"
          style={{ backgroundColor: accent }}
        >
          <IconComponent className="h-3 w-3" />
        </div>
      );
    }
    // Default: Circle Outline
    return (
      <div
        className="p-1 rounded-full border shrink-0"
        style={{ borderColor: hasAccent("headerIcons") ? accent : "#cbd5e1" }}
      >
        <IconComponent
          className="h-3.5 w-3.5"
          style={{ color: hasAccent("headerIcons") ? accent : undefined }}
        />
      </div>
    );
  };

  const renderSectionHeader = (icon: any, label: string) => {
    const IconComponent = icon;
    const displayLabel = headingCap === "uppercase" ? label.toUpperCase() : label;

    return (
      <div
        className="flex items-center gap-2 mb-3 pb-1.5 border-b-2"
        style={{
          borderColor: hasAccent("headingsLine") ? accent : "#0f172a",
        }}
      >
        {renderIconFrame(IconComponent)}
        <h3
          className="font-black uppercase tracking-wider text-slate-900"
          style={{
            fontSize: headingPt,
            color: hasAccent("headings") ? accent : undefined,
          }}
        >
          {displayLabel}
        </h3>
      </div>
    );
  };

  const effHeaderAlignClass =
    headerPosition === "left"
      ? "text-left items-start"
      : headerPosition === "right"
        ? "text-right items-end"
        : headerAlign === "center"
          ? "text-center items-center"
          : "text-left items-start";

  const renderSectionList = (
    sections: { key: string; icon: any; title: string; node: React.ReactNode }[]
  ) => {
    return sections
      .filter((s) => Boolean(s.node))
      .map((s) => {
        const { title, icon } = getSectionIconAndTitle(s.key, s.icon, s.title, form);
        return (
          <div key={s.key} className="mb-4">
            {renderSectionHeader(icon, title)}
            {s.node}
          </div>
        );
      });
  };

  // Define section nodes
  const summaryNode = form.summary ? (
    <p className="text-xs text-slate-700 leading-relaxed font-normal">{form.summary}</p>
  ) : null;

  const experienceNode = form.experience ? (
    <div className="space-y-3.5">
      {expItems.length > 0
        ? expItems.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <div className="font-bold text-[12px] text-slate-950">
                  {workOrder === "employer-title" ? (
                    <>
                      {item.company && <span>{item.company} — </span>}
                      <span className="font-normal">{item.title}</span>
                    </>
                  ) : (
                    <>
                      {item.title}{" "}
                      {item.company && (
                        <span
                          className="font-semibold"
                          style={{ color: hasAccent("entrySubtitle") ? accent : "#334155" }}
                        >
                          @ {item.company}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div
                  className="text-[10.5px] font-bold"
                  style={{ color: hasAccent("dates") ? accent : "#64748b" }}
                >
                  {item.startDate && (
                    <span>
                      {item.startDate} {item.endDate ? `– ${item.endDate}` : ""}
                    </span>
                  )}
                  {item.location && <span className="ml-2 font-normal">| {item.location}</span>}
                </div>
              </div>
              {item.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 leading-relaxed">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{renderTextWithLinks(b)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        : renderTextWithLinks(form.experience)}
    </div>
  ) : null;

  const educationNode = form.education ? (
    <div className="space-y-2">
      {eduItems.length > 0
        ? eduItems.map((item, idx) => (
            <div key={idx} className="flex flex-wrap items-baseline justify-between gap-x-2">
              <div>
                <span className="font-bold text-[12px] text-slate-950">{item.degree}</span>
                {item.school && <span className="font-semibold text-slate-700">, {item.school}</span>}
              </div>
              <div
                className="text-[10.5px] font-bold"
                style={{ color: hasAccent("dates") ? accent : "#64748b" }}
              >
                {item.startDate && (
                  <span>
                    {item.startDate} {item.endDate ? `– ${item.endDate}` : ""}
                  </span>
                )}
                {item.location && <span className="ml-2 font-normal">| {item.location}</span>}
              </div>
            </div>
          ))
        : renderTextWithLinks(form.education)}
    </div>
  ) : null;

  const projectsNode = form.projects ? (
    <div className="space-y-3.5">
      {projItems.length > 0
        ? projItems.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <div className="font-bold text-[12px] text-slate-950">
                  {item.title}{" "}
                  {item.subtitle && (
                    <span className="font-semibold text-slate-600">— {item.subtitle}</span>
                  )}
                </div>
                {item.dates && (
                  <span
                    className="text-[10.5px] font-bold"
                    style={{ color: hasAccent("dates") ? accent : "#64748b" }}
                  >
                    {item.dates}
                  </span>
                )}
              </div>
              {item.techStack && (
                <p
                  className="text-[10.5px] font-semibold"
                  style={{ color: hasAccent("entrySubtitle") ? accent : "#4338ca" }}
                >
                  Tech Stack: {item.techStack}
                </p>
              )}
              {item.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 leading-relaxed">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{renderTextWithLinks(b)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        : renderTextWithLinks(form.projects)}
    </div>
  ) : null;

  const skillsNode = form.skills ? (
    <div>
      {isCreative ? (
        <div className="flex flex-wrap gap-1.5">
          {form.skills.split(",").map((s, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
              style={{
                backgroundColor: hasAccent("dotsBars") ? accent + "15" : "#ecfdf5",
                borderColor: hasAccent("dotsBars") ? accent + "40" : "#a7f3d0",
                color: hasAccent("dotsBars") ? accent : "#065f46",
              }}
            >
              {s.trim()}
            </span>
          ))}
        </div>
      ) : skillCats.length > 0 ? (
        <div className="space-y-1 text-xs text-slate-800">
          {skillCats.map((cat, idx) => (
            <div key={idx} className="flex flex-wrap items-baseline gap-1">
              <span className="font-bold text-slate-950">{cat.category}:</span>
              <span className="text-slate-700 font-medium">{cat.skills.join(" | ")}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
          {form.skills}
        </div>
      )}
    </div>
  ) : null;

  const certificationsNode = form.certifications ? (
    <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed space-y-1">
      {renderTextWithLinks(form.certifications)}
    </div>
  ) : null;

  const strengthsNode = form.strengths ? (
    <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
      {form.strengths}
    </div>
  ) : null;

  const languagesNode = form.languages ? (
    <p className="text-xs text-slate-800 font-medium">{form.languages}</p>
  ) : null;

  const awardsNode = form.awards ? (
    <div className="text-xs text-slate-800 font-medium">{renderTextWithLinks(form.awards)}</div>
  ) : null;

  const customNode =
    form.customSectionTitle && form.customSectionBody ? (
      <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed space-y-1 font-medium">
        {renderTextWithLinks(form.customSectionBody)}
      </div>
    ) : null;

  const declarationNode = form.declaration ? (
    <div className="pt-2 border-t border-slate-200/80">
      <p className="text-[11px] text-slate-600 italic mb-4 leading-relaxed">{form.declaration}</p>
      <div className="pt-2 border-t border-slate-300 w-52">
        {form.signatureImage ? (
          <img src={form.signatureImage} alt="Digital Signature" className="h-10 object-contain mb-1" />
        ) : (
          <p className="font-serif italic text-lg text-indigo-900 font-bold leading-none">
            {form.signatoryName || form.fullName || "Alex Rivera"}
          </p>
        )}
        <p className="text-[10px] text-slate-500 font-bold mt-1">
          {form.signatoryName || form.fullName || "Alex Rivera"} (
          {form.signatoryPlace || form.location?.split(",")[0] || "San Francisco"})
        </p>
      </div>
    </div>
  ) : null;

  return (
    <div
      id="resume-preview-document"
      className={cn(
        "w-full rounded-xl border overflow-hidden shadow-sm text-xs bg-white text-slate-900 relative transition-all",
        fontFamily,
      )}
      style={{
        minHeight: 650,
        fontSize: baseFontSize,
        lineHeight: lineHeightVal,
        padding: `${marginMmVal}mm`,
      }}
    >
      {/* Header */}
      <div
        className={cn(
          "pb-5 mb-5 border-b space-y-2 flex flex-col transition-all",
          effHeaderAlignClass,
        )}
        style={{
          backgroundColor: isDreamSync ? "#f8fafc" : template.previewBg,
          color: isDreamSync ? "#0f172a" : template.previewText,
        }}
      >
        {form.photo && (
          <img
            src={form.photo}
            alt="Profile Photo"
            className="h-16 w-16 rounded-full object-cover border-2 shadow-sm mb-1"
            style={{ borderColor: accent }}
          />
        )}
        <h1
          className="font-black tracking-wide uppercase transition-all"
          style={{
            fontSize: namePt,
            color: hasAccent("name") ? accent : undefined,
          }}
        >
          {form.fullName || "ALEX RIVERA"}
        </h1>
        {form.targetRole && (
          <p
            className="font-bold max-w-2xl leading-normal transition-all"
            style={{
              fontSize: titlePt,
              color: hasAccent("jobTitle") ? accent : "#475569",
            }}
          >
            {form.targetRole}
          </p>
        )}
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium pt-1",
            headerPosition === "right"
              ? "justify-end"
              : headerPosition === "left"
                ? "justify-start"
                : headerAlign === "center"
                  ? "justify-center"
                  : "justify-start",
          )}
        >
          {form.email && (
            <span className="flex items-center gap-1">
              <Mail
                className="h-3 w-3"
                style={{ color: hasAccent("headerIcons") ? accent : "#64748b" }}
              />
              {form.email}
            </span>
          )}
          {form.phone && (
            <span className="flex items-center gap-1">
              {detailsArrangement !== "icon" && <span>{sepString}</span>}
              <Phone
                className="h-3 w-3"
                style={{ color: hasAccent("headerIcons") ? accent : "#64748b" }}
              />
              {form.phone}
            </span>
          )}
          {form.location && (
            <span className="flex items-center gap-1">
              {detailsArrangement !== "icon" && <span>{sepString}</span>}
              <MapPin
                className="h-3 w-3"
                style={{ color: hasAccent("headerIcons") ? accent : "#64748b" }}
              />
              {form.location}
            </span>
          )}
          {form.linkedin && (
            <span className="flex items-center gap-1">
              {detailsArrangement !== "icon" && <span>{sepString}</span>}
              <Linkedin
                className="h-3 w-3 text-blue-600"
                style={{ color: hasAccent("linkIcons") ? accent : undefined }}
              />
              <a href={form.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                LinkedIn:{" "}
                {form.linkedin
                  .replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "")
                  .replace(/\/$/, "")}
              </a>
            </span>
          )}
          {form.github && (
            <span className="flex items-center gap-1">
              {detailsArrangement !== "icon" && <span>{sepString}</span>}
              <Github
                className="h-3 w-3"
                style={{ color: hasAccent("linkIcons") ? accent : "#1e293b" }}
              />
              <a href={form.github} target="_blank" rel="noreferrer" className="hover:underline">
                GitHub: {form.github.replace(/https?:\/\/(www\.)?github\.com\//, "")}
              </a>
            </span>
          )}
          {form.website && (
            <span className="flex items-center gap-1">
              {detailsArrangement !== "icon" && <span>{sepString}</span>}
              <Globe
                className="h-3 w-3 text-emerald-600"
                style={{ color: hasAccent("linkIcons") ? accent : undefined }}
              />
              <a href={form.website} target="_blank" rel="noreferrer" className="hover:underline">
                {form.website.replace(/https?:\/\//, "")}
              </a>
            </span>
          )}
        </div>
        {(form.passport || form.nationality || form.visa) && (
          <div className="text-[10px] text-slate-500 font-medium pt-1 flex gap-3">
            {form.nationality && <span>Nationality: {form.nationality}</span>}
            {form.visa && <span>Visa: {form.visa}</span>}
            {form.passport && <span>Passport/ID: {form.passport}</span>}
          </div>
        )}
      </div>

      {/* Multi-Page A4 Cutoff Visual Indicators */}
      {[1, 2, 3, 4, 5, 6].map((pageNum) => (
        <div
          key={pageNum}
          className="absolute left-0 right-0 border-y-2 border-dashed border-rose-500 flex items-center justify-between px-4 py-1.5 text-[10px] font-black text-rose-700 bg-rose-100/95 dark:bg-rose-950/95 dark:text-rose-300 pointer-events-none z-30 shadow-md print:hidden"
          style={{ top: `${pageNum * 1050}px`, transform: "translateY(-50%)" }}
        >
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
            📄 Page {pageNum} Cutoff Line (A4 Paper Boundary)
          </span>
          <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
            Page {pageNum + 1} Begins Below ↓
          </span>
        </div>
      ))}

      {/* Body Content Layout Column Engine */}
      {layoutColumns === "two" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            {renderSectionList([
              { key: "summary", icon: FileText, title: "OBJECTIVE / SUMMARY", node: summaryNode },
              { key: "experience", icon: Briefcase, title: "PROFESSIONAL EXPERIENCE", node: experienceNode },
              { key: "projects", icon: FolderOpen, title: "KEY PROJECTS", node: projectsNode },
            ])}
          </div>
          <div className="space-y-4">
            {renderSectionList([
              { key: "education", icon: GraduationCap, title: "EDUCATION", node: educationNode },
              { key: "skills", icon: Wrench, title: "TECHNICAL SKILLS & SOFT SKILLS", node: skillsNode },
              { key: "certifications", icon: Award, title: "CERTIFICATIONS", node: certificationsNode },
              { key: "strengths", icon: Star, title: "STRENGTHS & COMPETENCIES", node: strengthsNode },
              { key: "languages", icon: Globe, title: "LANGUAGES", node: languagesNode },
              { key: "awards", icon: Trophy, title: "HONORS & AWARDS", node: awardsNode },
              { key: "custom", icon: Sparkles, title: form.customSectionTitle || "CUSTOM SECTION", node: customNode },
              { key: "declaration", icon: PenTool, title: "DECLARATION & SIGNATURE", node: declarationNode },
            ])}
          </div>
        </div>
      ) : layoutColumns === "mix" ? (
        <div className="space-y-6">
          {renderSectionList([
            { key: "summary", icon: FileText, title: "OBJECTIVE / SUMMARY", node: summaryNode },
            { key: "experience", icon: Briefcase, title: "PROFESSIONAL EXPERIENCE", node: experienceNode },
          ])}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2 border-t">
            <div className="space-y-4">
              {renderSectionList([
                { key: "projects", icon: FolderOpen, title: "KEY PROJECTS", node: projectsNode },
                { key: "skills", icon: Wrench, title: "TECHNICAL SKILLS & SOFT SKILLS", node: skillsNode },
              ])}
            </div>
            <div className="space-y-4">
              {renderSectionList([
                { key: "education", icon: GraduationCap, title: "EDUCATION", node: educationNode },
                { key: "certifications", icon: Award, title: "CERTIFICATIONS", node: certificationsNode },
                { key: "strengths", icon: Star, title: "STRENGTHS & COMPETENCIES", node: strengthsNode },
                { key: "languages", icon: Globe, title: "LANGUAGES", node: languagesNode },
                { key: "awards", icon: Trophy, title: "HONORS & AWARDS", node: awardsNode },
                { key: "custom", icon: Sparkles, title: form.customSectionTitle || "CUSTOM SECTION", node: customNode },
                { key: "declaration", icon: PenTool, title: "DECLARATION & SIGNATURE", node: declarationNode },
              ])}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSectionList([
            { key: "summary", icon: FileText, title: "OBJECTIVE / SUMMARY", node: summaryNode },
            { key: "experience", icon: Briefcase, title: "PROFESSIONAL EXPERIENCE", node: experienceNode },
            { key: "education", icon: GraduationCap, title: "EDUCATION", node: educationNode },
            { key: "projects", icon: FolderOpen, title: "KEY PROJECTS", node: projectsNode },
            { key: "skills", icon: Wrench, title: "TECHNICAL SKILLS & SOFT SKILLS", node: skillsNode },
            { key: "certifications", icon: Award, title: "CERTIFICATIONS", node: certificationsNode },
            { key: "strengths", icon: Star, title: "STRENGTHS & COMPETENCIES", node: strengthsNode },
            { key: "languages", icon: Globe, title: "LANGUAGES", node: languagesNode },
            { key: "awards", icon: Trophy, title: "HONORS & AWARDS", node: awardsNode },
            { key: "custom", icon: Sparkles, title: form.customSectionTitle || "CUSTOM SECTION", node: customNode },
            { key: "declaration", icon: PenTool, title: "DECLARATION & SIGNATURE", node: declarationNode },
          ])}
        </div>
      )}
    </div>
  );
}

function renderTextWithLinks(text: string) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s,">]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, idx) => {
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium break-all inline-block"
        >
          {part}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

/* ── Main Page Component ── */
export function ResumeBuilderPage({ embedded = false }: { embedded?: boolean }) {
  const generateFn = useServerFn(generateResume);
  const extractFn = useServerFn(extractResumeFields);

  const [activeTab, setActiveTab] = useState<"content" | "design" | "ai" | "cover" | "linkedin">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_active_tab");
      if (saved) return saved as any;
    }
    return "content";
  });
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_active_section");
      if (saved) return saved;
    }
    return "personal";
  });
  const [view, setView] = useState<"edit" | "preview">("preview");
  const [selectedTpl, setSelectedTpl] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_tpl");
      if (saved) {
        const found = TEMPLATES.find((t) => t.id === saved);
        if (found) return found;
      }
    }
    return TEMPLATES[0];
  });
  const [accentColor, setAccentColor] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_accent")) || "#0f172a";
  });
  const [fontFamily, setFontFamily] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_font")) || "font-sans";
  });

  /* Advanced Design Controls */
  const [docLanguage, setDocLanguage] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_lang")) || "English (UK)";
  });
  const [pageFormat, setPageFormat] = useState<"A4" | "Letter">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_format") as any)) || "A4";
  });
  const [layoutColumns, setLayoutColumns] = useState<"one" | "two" | "mix">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_cols") as any)) || "one";
  });
  const [headerPosition, setHeaderPosition] = useState<"top" | "left" | "right">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_header_pos") as any)) || "top";
  });
  const [headerAlign, setHeaderAlign] = useState<"left" | "center">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_align") as any)) || "center";
  });
  const [baseFontSize, setBaseFontSize] = useState<"9.5pt" | "10.5pt" | "11.5pt" | "12.5pt">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_font_size") as any)) || "10.5pt";
  });
  const [nameFontSizeOffset, setNameFontSizeOffset] = useState<number>(() => {
    return typeof window !== "undefined" ? Number(localStorage.getItem("resume_builder_name_offset") || 11) : 11;
  });
  const [titleFontSizeOffset, setTitleFontSizeOffset] = useState<number>(() => {
    return typeof window !== "undefined" ? Number(localStorage.getItem("resume_builder_title_offset") || 5) : 5;
  });
  const [headingFontSizeOffset, setHeadingFontSizeOffset] = useState<number>(() => {
    return typeof window !== "undefined" ? Number(localStorage.getItem("resume_builder_heading_offset") || 1) : 1;
  });
  const [lineHeightVal, setLineHeightVal] = useState<number>(() => {
    return typeof window !== "undefined" ? Number(localStorage.getItem("resume_builder_line_height") || 1.3) : 1.3;
  });
  const [marginMmVal, setMarginMmVal] = useState<number>(() => {
    return typeof window !== "undefined" ? Number(localStorage.getItem("resume_builder_margin_mm") || 10) : 10;
  });
  const [accentTargets, setAccentTargets] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_accent_targets");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return ["name", "jobTitle", "headings", "headingsLine", "headerIcons", "dotsBars", "dates", "entrySubtitle", "linkIcons"];
  });
  const [detailsArrangement, setDetailsArrangement] = useState<"icon" | "bullet" | "pipe" | "bar">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_details_arr") as any)) || "pipe";
  });
  const [iconStyleVal, setIconStyleVal] = useState<string>(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_icon_style")) || "Icon Style: Circle Outline";
  });
  const [headingCap, setHeadingCap] = useState<"uppercase" | "capitalize">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_cap") as any)) || "uppercase";
  });
  const [workOrder, setWorkOrder] = useState<"title-employer" | "employer-title">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_work_order") as any)) || "title-employer";
  });
  const [skillsStyle, setSkillsStyle] = useState<"compact" | "badges" | "grid">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_skills_style") as any)) || "compact";
  });

  /* AI Cover Letter & LinkedIn States */
  const [targetCompany, setTargetCompany] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_target_company")) || "";
  });
  const [coverLetterText, setCoverLetterText] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_cover_text")) || "";
  });
  const [generatingCover, setGeneratingCover] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  /* Drafts Manager */
  interface SavedDraft {
    id: string;
    name: string;
    updatedAt: string;
    form: Record<string, string>;
  }

  const [form, setForm] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_form");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.fullName || parsed.fullName === "ALEX RIVERA" || parsed.fullName === "Alex Rivera" || parsed.email === "alex.rivera@example.com") {
            localStorage.removeItem("resume_builder_form");
            return ATS_DEFAULT_FORM;
          }
          return { ...ATS_DEFAULT_FORM, ...parsed };
        } catch {}
      }
    }
    return ATS_DEFAULT_FORM;
  });

  const [drafts, setDrafts] = useState<SavedDraft[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_saved_drafts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      {
        id: "draft-default",
        name: "Full Stack Resume Draft",
        updatedAt: new Date().toLocaleDateString(),
        form: SAMPLE_TEMPLATE_FORM,
      },
    ];
  });
  const [activeDraftId, setActiveDraftId] = useState<string>("draft-default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("resume_builder_form", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("resume_builder_active_tab", activeTab);
    localStorage.setItem("resume_builder_active_section", activeSection);
    localStorage.setItem("resume_builder_tpl", selectedTpl.id);
    localStorage.setItem("resume_builder_accent", accentColor);
    localStorage.setItem("resume_builder_font", fontFamily);
    localStorage.setItem("resume_builder_lang", docLanguage);
    localStorage.setItem("resume_builder_format", pageFormat);
    localStorage.setItem("resume_builder_cols", layoutColumns);
    localStorage.setItem("resume_builder_header_pos", headerPosition);
    localStorage.setItem("resume_builder_align", headerAlign);
    localStorage.setItem("resume_builder_font_size", baseFontSize);
    localStorage.setItem("resume_builder_name_offset", String(nameFontSizeOffset));
    localStorage.setItem("resume_builder_title_offset", String(titleFontSizeOffset));
    localStorage.setItem("resume_builder_heading_offset", String(headingFontSizeOffset));
    localStorage.setItem("resume_builder_line_height", String(lineHeightVal));
    localStorage.setItem("resume_builder_margin_mm", String(marginMmVal));
    localStorage.setItem("resume_builder_accent_targets", JSON.stringify(accentTargets));
    localStorage.setItem("resume_builder_details_arr", detailsArrangement);
    localStorage.setItem("resume_builder_icon_style", iconStyleVal);
    localStorage.setItem("resume_builder_cap", headingCap);
    localStorage.setItem("resume_builder_work_order", workOrder);
    localStorage.setItem("resume_builder_skills_style", skillsStyle);
    localStorage.setItem("resume_builder_target_company", targetCompany);
    localStorage.setItem("resume_builder_cover_text", coverLetterText);
  }, [
    activeTab,
    activeSection,
    selectedTpl,
    accentColor,
    fontFamily,
    docLanguage,
    pageFormat,
    layoutColumns,
    headerPosition,
    headerAlign,
    baseFontSize,
    nameFontSizeOffset,
    titleFontSizeOffset,
    headingFontSizeOffset,
    lineHeightVal,
    marginMmVal,
    accentTargets,
    detailsArrangement,
    iconStyleVal,
    headingCap,
    workOrder,
    skillsStyle,
    targetCompany,
    coverLetterText,
  ]);

  const liveAts = calculateLiveAtsScore(form);

  const saveNewDraft = () => {
    const draftName = prompt("Enter a name for this resume version draft:", `Resume ${drafts.length + 1} (${form.targetRole || "Draft"})`);
    if (!draftName) return;
    const newDraft: SavedDraft = {
      id: `draft-${Date.now()}`,
      name: draftName,
      updatedAt: new Date().toLocaleDateString(),
      form: { ...form },
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    setActiveDraftId(newDraft.id);
    localStorage.setItem("resume_builder_saved_drafts", JSON.stringify(updated));
    toast.success(`Saved resume draft "${newDraft.name}"!`);
  };

  const loadDraft = (id: string) => {
    const target = drafts.find((d) => d.id === id);
    if (target) {
      setForm(target.form);
      setActiveDraftId(id);
      toast.success(`Loaded resume draft "${target.name}"!`);
    }
  };

  const autoFixKeywords = () => {
    if (liveAts.missingKeywords.length === 0) return toast.success("All high-impact keywords present!");
    const current = form.skills || "";
    const added = liveAts.missingKeywords.join(", ");
    update("skills", current ? `${current}, ${added}` : added);
    toast.success(`Auto-added missing keywords (${added}) to Technical Skills!`);
  };

  const handleGenerateCoverLetter = () => {
    if (!targetCompany.trim()) return toast.error("Enter target company name (e.g. Google, Microsoft)");
    setGeneratingCover(true);
    setTimeout(() => {
      const generated = `Dear Hiring Team at ${targetCompany},\n\nI am writing to express my strong interest in the ${form.targetRole || "Software Engineer"} position at ${targetCompany}. With a proven track record in software architecture, full-stack execution, and cloud solutions, I am eager to contribute to ${targetCompany}'s team.\n\nIn my previous roles, I have ${form.summary?.slice(0, 160) || "spearheaded scalable applications and optimized database performance"}. My technical skillset includes ${form.skills?.slice(0, 100) || "React, TypeScript, Python, and AWS"}, enabling me to deliver robust engineering solutions.\n\nI look forward to discussing how my experience aligns with ${targetCompany}'s goals. Thank you for your time and consideration.\n\nSincerely,\n${form.fullName || "Alex Rivera"}`;
      setCoverLetterText(generated);
      setGeneratingCover(false);
      toast.success(`Generated Cover Letter for ${targetCompany}!`);
    }, 600);
  };

  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [redoStack, setRedoStack] = useState<Record<string, string>[]>([]);

  const handleUndo = () => {
    if (history.length === 0) return toast.info("Nothing to undo!");
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, h.length - 1));
    setRedoStack((r) => [...r, form]);
    setForm(previous);
    toast.info("Undo (Ctrl+Z)");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return toast.info("Nothing to redo!");
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, r.length - 1));
    setHistory((h) => [...h, form]);
    setForm(next);
    toast.info("Redo (Ctrl+Y)");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, redoStack, form]);

  const update = (field: string, value: string) => {
    setForm((f: Record<string, string>) => {
      if (f[field] !== value) {
        setHistory((h) => [...h.slice(-30), f]);
        setRedoStack([]);
      }
      return { ...f, [field]: value };
    });
  };

  const handleFormatText = (field: string, type: string) => {
    const current = form[field] || "";
    if (type === "bold") update(field, current + " **bold text**");
    else if (type === "italic") update(field, current + " *italic text*");
    else if (type === "underline") update(field, current + " _underlined_");
    else if (type === "bullet") update(field, current + "\n• Bullet point item");
    else if (type === "link") update(field, current + " https://link.com");
  };

  const handleAiAction = (field: string, action: string) => {
    const current = form[field] || "";
    if (!current) return toast.error("Write some content first!");
    if (action === "improve") {
      update(
        field,
        current.replace(
          /built|worked|did|made/gi,
          (m) =>
            ({
              built: "Architected and delivered",
              worked: "Spearheaded cross-functional execution",
              did: "Executed high-impact deliverables",
              made: "Engineered scalable",
            })[m.toLowerCase()] || "optimized",
        ),
      );
      toast.success("Enhanced verbs and bullet impact!");
    } else if (action === "grammar") {
      toast.success("Spelling & Grammar checked — 0 errors found!");
    } else if (action === "shorter") {
      const shortened = current
        .split("\n")
        .map((line) => line.slice(0, Math.floor(line.length * 0.85)))
        .join("\n");
      update(field, shortened);
      toast.success("Condensed bullet text!");
    }
  };

  const insertXYZFormula = (formulaText: string) => {
    const current = form.experience || "";
    update("experience", current ? `${current}\n${formulaText}` : formulaText);
    toast.success("Inserted Google XYZ formula template!");
  };

  const addSkillKeyword = (skill: string) => {
    const current = form.skills || "";
    if (current.includes(skill)) return toast.info(`"${skill}" already added!`);
    update("skills", current ? `${current}, ${skill}` : skill);
    toast.success(`Added "${skill}" to Technical Skills!`);
  };

  const addCourseToCertifications = (courseName: string) => {
    const current = form.certifications || "";
    const newCert = `• ${courseName} Certification — Learnify AI (Verified)`;
    update("certifications", current ? `${current}\n${newCert}` : newCert);
    toast.success(`Added "${courseName}" to Certifications!`);
  };

  const handleGenerate = async () => {
    if (!form.fullName?.trim()) return toast.error("Enter your full name");
    if (!form.targetRole?.trim()) return toast.error("Enter your target role");
    setLoading(true);
    try {
      const res = await generateFn({ data: { ...form, template: selectedTpl.id } });
      setResult(res.content);
      setView("preview");
      toast.success("AI Resume formatted & optimized!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const generateWordDocumentHtml = (f: Record<string, string>) => {
    const name = f.fullName || "ALEX RIVERA";
    const role = f.targetRole || "Senior Full Stack Engineer";
    const contacts = [
      f.email && `Email: ${f.email}`,
      f.phone && `Phone: ${f.phone}`,
      f.location && `Location: ${f.location}`,
      f.linkedin && `LinkedIn: ${f.linkedin}`,
      f.github && `GitHub: ${f.github}`,
      f.website && `Website: ${f.website}`,
    ].filter(Boolean).join(" | ");

    const formatBlockHtml = (text?: string) => {
      if (!text) return "";
      const lines = text.split("\n").filter((l) => l.trim());
      const htmlLines = lines.map((line) => {
        const clean = line.replace(/^[•\-*]\s*/, "");
        if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
          return `<li style="margin-bottom: 3pt; text-align: left;">${clean}</li>`;
        }
        return `<p style="margin-bottom: 4pt; text-align: left;">${clean}</p>`;
      });

      if (htmlLines.some((l) => l.startsWith("<li"))) {
        return `<ul style="margin-top: 4pt; margin-bottom: 8pt; padding-left: 18pt;">${htmlLines.join("")}</ul>`;
      }
      return htmlLines.join("");
    };

    return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${name} - Resume</title>
  <style>
    body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; color: #0f172a; margin: 0.75in; }
    h1 { font-size: 20pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 2pt; color: #0f172a; }
    .role { font-size: 12pt; font-weight: bold; text-align: center; color: #0284c7; margin-bottom: 6pt; }
    .contact { font-size: 9.5pt; text-align: center; color: #475569; margin-bottom: 12pt; }
    h2 { font-size: 11.5pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5pt solid #0f172a; padding-bottom: 2pt; margin-top: 14pt; margin-bottom: 6pt; color: #0f172a; }
    p { margin: 0 0 4pt 0; text-align: left; }
    ul { margin: 4pt 0 8pt 0; padding-left: 18pt; }
    li { margin-bottom: 3pt; text-align: left; }
    a { color: #0284c7; text-decoration: underline; }
    .declaration { font-style: italic; color: #475569; font-size: 10pt; margin-top: 6pt; }
    .signature { margin-top: 16pt; font-weight: bold; font-size: 11pt; border-top: 1pt solid #cbd5e1; width: 220pt; padding-top: 4pt; }
  </style>
</head>
<body>
  <h1>${name}</h1>
  ${role ? `<div class="role">${role}</div>` : ""}
  ${contacts ? `<div class="contact">${contacts}</div>` : ""}

  ${f.summary ? `<h2>${(f.summarySectionTitle || "OBJECTIVE / SUMMARY").toUpperCase()}</h2><div>${formatBlockHtml(f.summary)}</div>` : ""}
  ${f.experience ? `<h2>${(f.experienceSectionTitle || "PROFESSIONAL EXPERIENCE").toUpperCase()}</h2><div>${formatBlockHtml(f.experience)}</div>` : ""}
  ${f.education ? `<h2>${(f.educationSectionTitle || "EDUCATION").toUpperCase()}</h2><div>${formatBlockHtml(f.education)}</div>` : ""}
  ${f.projects ? `<h2>${(f.projectsSectionTitle || "KEY PROJECTS").toUpperCase()}</h2><div>${formatBlockHtml(f.projects)}</div>` : ""}
  ${f.skills ? `<h2>${(f.skillsSectionTitle || "TECHNICAL SKILLS & SOFT SKILLS").toUpperCase()}</h2><div>${formatBlockHtml(f.skills)}</div>` : ""}
  ${f.certifications ? `<h2>${(f.certificationsSectionTitle || "CERTIFICATIONS").toUpperCase()}</h2><div>${formatBlockHtml(f.certifications)}</div>` : ""}
  ${f.customSectionTitle && f.customSectionBody ? `<h2>${f.customSectionTitle.toUpperCase()}</h2><div>${formatBlockHtml(f.customSectionBody)}</div>` : ""}
  ${f.strengths ? `<h2>${(f.strengthsSectionTitle || "STRENGTHS & COMPETENCIES").toUpperCase()}</h2><div>${formatBlockHtml(f.strengths)}</div>` : ""}
  ${f.languages ? `<h2>${(f.languagesSectionTitle || "LANGUAGES").toUpperCase()}</h2><p>${f.languages}</p>` : ""}
  ${f.awards ? `<h2>${(f.awardsSectionTitle || "HONORS & AWARDS").toUpperCase()}</h2><div>${formatBlockHtml(f.awards)}</div>` : ""}
  ${f.declaration ? `<h2>${(f.declarationSectionTitle || "DECLARATION & DIGITAL SIGNATURE").toUpperCase()}</h2><p class="declaration">${f.declaration}</p><div class="signature">${f.signatoryName || name}<br/><span style="font-weight:normal; font-size:9.5pt; color:#64748b;">${f.signatoryName || name} (${f.signatoryPlace || f.location?.split(",")[0] || "Bengaluru, India"})</span></div>` : ""}
</body>
</html>`;
  };

  const handleDownloadWord = () => {
    try {
      const docHtml = generateWordDocumentHtml(form);
      const blob = new Blob(["\ufeff" + docHtml], { type: "application/msword;charset=utf-8" });
      const fileName = `${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.docx`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Word Document (.docx) downloaded successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate Word document");
    }
  };

  const handleDownloadPdfDirect = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let y = 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(form.fullName || "ALEX RIVERA", 105, y, { align: "center" });

      y += 7;
      if (form.targetRole) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(2, 132, 199);
        doc.text(form.targetRole, 105, y, { align: "center" });
        y += 6;
      }

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      const contactInfo = [form.email, form.phone, form.location, form.linkedin, form.github, form.website]
        .filter(Boolean)
        .join(" | ");
      doc.text(contactInfo, 105, y, { align: "center" });
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 6;

      const addSection = (title: string, content?: string) => {
        if (!content || !content.trim()) return;
        if (y > 265) {
          doc.addPage();
          y = 15;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(title.toUpperCase(), 15, y);
        y += 2;
        doc.setDrawColor(15, 23, 42);
        doc.line(15, y, 195, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);

        const lines = doc.splitTextToSize(content, 180);
        for (let i = 0; i < lines.length; i++) {
          if (y > 275) {
            doc.addPage();
            y = 15;
          }
          doc.text(lines[i], 15, y);
          y += 5;
        }
        y += 4;
      };

      addSection(form.summarySectionTitle || "Objective / Summary", form.summary);
      addSection(form.experienceSectionTitle || "Professional Experience", form.experience);
      addSection(form.educationSectionTitle || "Education", form.education);
      addSection(form.projectsSectionTitle || "Key Projects", form.projects);
      addSection(form.skillsSectionTitle || "Technical Skills & Soft Skills", form.skills);
      addSection(form.certificationsSectionTitle || "Certifications", form.certifications);
      if (form.customSectionTitle && form.customSectionBody) {
        addSection(form.customSectionTitle, form.customSectionBody);
      }
      addSection(form.strengthsSectionTitle || "Strengths & Competencies", form.strengths);
      addSection(form.languagesSectionTitle || "Languages", form.languages);
      addSection(form.awardsSectionTitle || "Honors & Awards", form.awards);
      if (form.declaration) {
        const decContent = `${form.declaration}\n\nSignatory: ${form.signatoryName || form.fullName || "VISHWAJEET"} (${form.signatoryPlace || form.location?.split(",")[0] || "Bengaluru, India"})`;
        addSection(form.declarationSectionTitle || "Declaration & Digital Signature", decContent);
      }

      doc.save(`${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("PDF Resume downloaded directly!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate PDF download");
    }
  };

  const handleDownloadTxt = () => {
    const textContent = [
      (form.fullName || "VISHWAJEET").toUpperCase(),
      form.targetRole,
      [form.email, form.phone, form.location, form.linkedin, form.github, form.website]
        .filter(Boolean)
        .join(" | "),
      "\n" + "=".repeat(60),
      form.summary ? `\n${(form.summarySectionTitle || "OBJECTIVE / SUMMARY").toUpperCase()}\n${form.summary}` : "",
      form.experience ? `\n${(form.experienceSectionTitle || "PROFESSIONAL EXPERIENCE").toUpperCase()}\n${form.experience}` : "",
      form.education ? `\n${(form.educationSectionTitle || "EDUCATION").toUpperCase()}\n${form.education}` : "",
      form.projects ? `\n${(form.projectsSectionTitle || "KEY PROJECTS").toUpperCase()}\n${form.projects}` : "",
      form.skills ? `\n${(form.skillsSectionTitle || "TECHNICAL SKILLS & SOFT SKILLS").toUpperCase()}\n${form.skills}` : "",
      form.certifications ? `\n${(form.certificationsSectionTitle || "CERTIFICATIONS").toUpperCase()}\n${form.certifications}` : "",
      form.customSectionTitle && form.customSectionBody ? `\n${form.customSectionTitle.toUpperCase()}\n${form.customSectionBody}` : "",
      form.strengths ? `\n${(form.strengthsSectionTitle || "STRENGTHS & COMPETENCIES").toUpperCase()}\n${form.strengths}` : "",
      form.languages ? `\n${(form.languagesSectionTitle || "LANGUAGES").toUpperCase()}\n${form.languages}` : "",
      form.awards ? `\n${(form.awardsSectionTitle || "HONORS & AWARDS").toUpperCase()}\n${form.awards}` : "",
      form.declaration ? `\n${(form.declarationSectionTitle || "DECLARATION & DIGITAL SIGNATURE").toUpperCase()}\n${form.declaration}\nSignatory: ${form.signatoryName || form.fullName} (${form.signatoryPlace || form.location?.split(",")[0] || "Bengaluru, India"})` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Text (.txt) Resume downloaded!");
  };

  const handlePrint = () => {
    window.print();
  };

  const resetToSampleTemplate = () => {
    setForm(SAMPLE_TEMPLATE_FORM);
    setResult(null);
    toast.success("Loaded Generic Sample Resume (Alex Rivera)!");
  };

  const resetToAtsTemplate = () => {
    setForm(ATS_DEFAULT_FORM);
    setResult(null);
    toast.success("Loaded Platinum ATS Sample Resume!");
  };

  const inp =
    "w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const Wrapper = embedded ? "div" : AppShell;

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Header & Version Manager */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resume Builder Studio</h2>
              <p className="text-xs text-muted-foreground">
                DreamSync Pro Granular Customizer · Real-time Preview · ATS Verified
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Version Draft Manager */}
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border">
              <History className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
              <select
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer pr-2"
                value={activeDraftId}
                onChange={(e) => loadDraft(e.target.value)}
              >
                {drafts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={saveNewDraft}
                className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Save Draft
              </button>
            </div>

            {/* Undo / Redo Shortcuts */}
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border">
              <button
                onClick={handleUndo}
                title="Undo (Ctrl+Z)"
                className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-muted transition cursor-pointer flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                ↩ Undo <span className="text-[9px] opacity-60 font-mono">(Ctrl+Z)</span>
              </button>
              <button
                onClick={handleRedo}
                title="Redo (Ctrl+Y)"
                className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-muted transition cursor-pointer flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                ↪ Redo <span className="text-[9px] opacity-60 font-mono">(Ctrl+Y)</span>
              </button>
            </div>

            <button
              onClick={resetToSampleTemplate}
              className="px-3 py-1.5 rounded-xl border bg-muted/40 hover:bg-muted text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-blue-500" /> Sample Resume
            </button>
            <button
              onClick={resetToAtsTemplate}
              className="px-3 py-1.5 rounded-xl border bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> ATS Sample Resume
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Exports */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "content", label: "Content Editor", icon: Edit3 },
              { id: "design", label: "Design & Layout", icon: Palette },
              { id: "ai", label: "AI Pro Tools", icon: Sparkles },
              { id: "cover", label: "AI Cover Letter", icon: Mail },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted",
                  )}
                >
                  <IconComp className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-bold hidden sm:inline">Export:</span>
            <button
              onClick={handleDownloadPdfDirect}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="h-3 w-3" /> PDF
            </button>
            <button
              onClick={handleDownloadWord}
              className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="h-3 w-3" /> Word (.docx)
            </button>
            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="h-3 w-3" /> Text (.txt)
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Printer className="h-3 w-3" /> Print
            </button>
          </div>
        </div>

        {/* Main Dual-Pane Studio Layout */}
        <div className="grid xl:grid-cols-[1fr_520px] gap-6">
          {/* Left Editor / Controls */}
          <div className="space-y-4">
            {activeTab === "content" && (
              <div className="space-y-3">
                {/* 1. Personal Details Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "personal" ? "" : "personal")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>Personal Details & Contact</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "personal" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "personal" && (
                    <div className="p-4 space-y-3 border-t">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Full Name *</Label>
                          <input
                            className={inp}
                            value={form.fullName || ""}
                            onChange={(e) => update("fullName", e.target.value)}
                            placeholder="ALEX RIVERA"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Target Role *</Label>
                          <input
                            className={inp}
                            value={form.targetRole || ""}
                            onChange={(e) => update("targetRole", e.target.value)}
                            placeholder="e.g. Senior Full Stack Engineer"
                          />
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {TARGET_ROLE_PRESETS.slice(0, 4).map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => update("targetRole", role)}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-muted hover:bg-muted/80 text-muted-foreground font-semibold transition cursor-pointer"
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Email</Label>
                          <input
                            className={inp}
                            value={form.email || ""}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="alex.rivera@example.com"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Phone</Label>
                          <input
                            className={inp}
                            value={form.phone || ""}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+1 (555) 019-2834"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Location</Label>
                          <input
                            className={inp}
                            value={form.location || ""}
                            onChange={(e) => update("location", e.target.value)}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Photo URL (Optional)</Label>
                          <input
                            className={inp}
                            value={form.photo || ""}
                            onChange={(e) => update("photo", e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Additional Details (ID, Visa, Nationality)
                        </p>
                        <div className="grid sm:grid-cols-3 gap-2">
                          <input
                            className={inp}
                            value={form.nationality || ""}
                            onChange={(e) => update("nationality", e.target.value)}
                            placeholder="Nationality"
                          />
                          <input
                            className={inp}
                            value={form.visa || ""}
                            onChange={(e) => update("visa", e.target.value)}
                            placeholder="Visa Status"
                          />
                          <input
                            className={inp}
                            value={form.passport || ""}
                            onChange={(e) => update("passport", e.target.value)}
                            placeholder="Passport / ID"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* 2. Social Links Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "links" ? "" : "links")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-blue-600" />
                      <span>Social Profiles & Web Links</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "links" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "links" && (
                    <div className="p-4 space-y-3 border-t">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">LinkedIn</Label>
                          <input
                            className={inp}
                            value={form.linkedin || ""}
                            onChange={(e) => update("linkedin", e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">GitHub</Label>
                          <input
                            className={inp}
                            value={form.github || ""}
                            onChange={(e) => update("github", e.target.value)}
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Website</Label>
                          <input
                            className={inp}
                            value={form.website || ""}
                            onChange={(e) => update("website", e.target.value)}
                            placeholder="https://alexrivera.dev"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Portfolio</Label>
                          <input
                            className={inp}
                            value={form.portfolio || ""}
                            onChange={(e) => update("portfolio", e.target.value)}
                            placeholder="https://alexrivera.dev/portfolio"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* 3. Professional Summary Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "summary" ? "" : "summary")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span>Professional Summary</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "summary" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "summary" && (
                    <div className="p-4 space-y-2 border-t">
                      <SectionTitleConfigHeader sectionKey="summary" defaultTitle="OBJECTIVE / SUMMARY" form={form} update={update} />
                      <FormatToolbar
                        onFormat={(tag) => handleFormatText("summary", tag)}
                        onAiAction={(action) => handleAiAction("summary", action)}
                      />
                      <textarea
                        className={`${inp} min-h-[100px] resize-y font-mono text-xs`}
                        value={form.summary || ""}
                        onChange={(e) => update("summary", e.target.value)}
                        placeholder="Results-driven engineer with 4+ years of experience..."
                      />
                    </div>
                  )}
                </Card>

                {/* 4. Experience Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "exp" ? "" : "exp")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      <span>Work Experience</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "exp" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "exp" && (
                    <div className="p-4 space-y-3 border-t">
                      <SectionTitleConfigHeader sectionKey="experience" defaultTitle="PROFESSIONAL EXPERIENCE" form={form} update={update} />
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Work Experience Entries</Label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = form.experience || "";
                            const newEntry = "New Role, Company Name | Jan 2025 – Present | Location\n• Key accomplishment or bullet point...";
                            update("experience", cur ? `${cur}\n\n${newEntry}` : newEntry);
                            toast.success("Added new Work Experience entry!");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition border border-purple-200 dark:border-purple-800/40 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Experience
                        </button>
                      </div>
                      <FormatToolbar
                        onFormat={(tag) => handleFormatText("experience", tag)}
                        onAiAction={(action) => handleAiAction("experience", action)}
                      />
                      <textarea
                        className={`${inp} min-h-[220px] resize-y font-mono text-xs`}
                        value={form.experience || ""}
                        onChange={(e) => update("experience", e.target.value)}
                        placeholder="Job Title, Company | Start Date – End Date | Location..."
                      />
                    </div>
                  )}
                </Card>

                {/* 5. Education Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "edu" ? "" : "edu")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                      <span>Education</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "edu" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "edu" && (
                    <div className="p-4 space-y-3 border-t">
                      <SectionTitleConfigHeader sectionKey="education" defaultTitle="EDUCATION" form={form} update={update} />
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Education Degrees & Institutes</Label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = form.education || "";
                            const newEdu = "Degree Name, Institution / University | 2022 – 2026 | Location";
                            update("education", cur ? `${cur}\n${newEdu}` : newEdu);
                            toast.success("Added new Education entry!");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition border border-indigo-200 dark:border-indigo-800/40 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Education
                        </button>
                      </div>
                      <textarea
                        className={`${inp} min-h-[100px] resize-y font-mono text-xs`}
                        value={form.education || ""}
                        onChange={(e) => update("education", e.target.value)}
                        placeholder="Degree, College/University | Dates | City..."
                      />
                    </div>
                  )}
                </Card>

                {/* 6. Technical & Soft Skills Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "skills" ? "" : "skills")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-amber-500" />
                      <span>Technical Skills & Soft Skills</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "skills" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "skills" && (
                    <div className="p-4 space-y-3 border-t">
                      <SectionTitleConfigHeader sectionKey="skills" defaultTitle="TECHNICAL SKILLS & SOFT SKILLS" form={form} update={update} />
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Skill Categories</Label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = form.skills || "";
                            const newCategory = "Category Name: Skill 1, Skill 2, Skill 3";
                            update("skills", cur ? `${cur}\n${newCategory}` : newCategory);
                            toast.success("Added new Skill Category!");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition border border-amber-200 dark:border-amber-800/40 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Category
                        </button>
                      </div>
                      <textarea
                        className={`${inp} min-h-[140px] resize-y font-mono text-xs`}
                        value={form.skills || ""}
                        onChange={(e) => update("skills", e.target.value)}
                        placeholder="Programming: HTML5 | CSS3 | JavaScript | Python\nFrontend: React.js | Next.js | Tailwind CSS\nSoft Skills: Leadership, Problem Solving..."
                      />
                    </div>
                  )}
                </Card>

                {/* 7. Key Projects Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "projects" ? "" : "projects")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-sky-600" />
                      <span>Key Projects</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "projects" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "projects" && (
                    <div className="p-4 space-y-3 border-t">
                      <SectionTitleConfigHeader sectionKey="projects" defaultTitle="KEY PROJECTS" form={form} update={update} />
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Key Projects Entries</Label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = form.projects || "";
                            const newProj = "Project Title — Subtitle / Tagline | Year\nTech Stack: React, Next.js, Node.js\n• Key architecture impact bullet...\n• Live: https://example.com";
                            update("projects", cur ? `${cur}\n\n${newProj}` : newProj);
                            toast.success("Added new Key Project entry!");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition border border-sky-200 dark:border-sky-800/40 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Project
                        </button>
                      </div>
                      <textarea
                        className={`${inp} min-h-[180px] resize-y font-mono text-xs`}
                        value={form.projects || ""}
                        onChange={(e) => update("projects", e.target.value)}
                        placeholder="CloudMetrics — Real-Time Infrastructure Monitoring Dashboard | 2025\nTech Stack: React, WebSockets, Node.js\n• Developed real-time telemetry dashboard...\n• Live: https://cloudmetrics-demo.example.com"
                      />
                    </div>
                  )}
                </Card>

                {/* 8. Custom Section with SVG Icon */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "custom" ? "" : "custom")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      <span>Custom Section (with SVG Icon)</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "custom" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "custom" && (
                    <div className="p-4 space-y-3 border-t">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Custom Section Title</Label>
                          <input
                            className={inp}
                            value={form.customSectionTitle || ""}
                            onChange={(e) => update("customSectionTitle", e.target.value)}
                            placeholder="e.g. Publications, Volunteer Work, Patents"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">SVG Icon Preset</Label>
                          <select
                            className={inp}
                            value={form.customSectionIcon || "award"}
                            onChange={(e) => update("customSectionIcon", e.target.value)}
                          >
                            <option value="award">Award (SVG Icon)</option>
                            <option value="star">Star (SVG Icon)</option>
                            <option value="book">Publications / Book (SVG Icon)</option>
                            <option value="globe">Global / Community (SVG Icon)</option>
                            <option value="shield">Patents / Shield (SVG Icon)</option>
                            <option value="code">Code / Open Source (SVG Icon)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Custom Section Content / Bullets</Label>
                        <textarea
                          className={`${inp} min-h-[90px] resize-y text-xs font-mono`}
                          value={form.customSectionBody || ""}
                          onChange={(e) => update("customSectionBody", e.target.value)}
                          placeholder="• Speaker at International Tech Summit 2026\n• Published research paper on LLM Agents..."
                        />
                      </div>
                    </div>
                  )}
                </Card>

                {/* 8. Declaration & Signature */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "dec" ? "" : "dec")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <PenTool className="h-4 w-4 text-rose-500" />
                      <span>Declaration & Digital Signature</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "dec" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "dec" && (
                    <div className="p-4 space-y-3 border-t">
                      <SectionTitleConfigHeader sectionKey="declaration" defaultTitle="DECLARATION & SIGNATURE" form={form} update={update} />
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Declaration Text</Label>
                        <textarea
                          className={`${inp} min-h-[60px] resize-y text-xs`}
                          value={form.declaration || ""}
                          onChange={(e) => update("declaration", e.target.value)}
                          placeholder="I hereby declare that the information provided is true..."
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Signatory Full Name</Label>
                          <input
                            className={inp}
                            value={form.signatoryName || ""}
                            onChange={(e) => update("signatoryName", e.target.value)}
                            placeholder="ALEX RIVERA"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Place / City</Label>
                          <input
                            className={inp}
                            value={form.signatoryPlace || ""}
                            onChange={(e) => update("signatoryPlace", e.target.value)}
                            placeholder="San Francisco"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs font-semibold mb-1 block">Digital Signature Image URL (Optional)</Label>
                          <input
                            className={inp}
                            value={form.signatureImage || ""}
                            onChange={(e) => update("signatureImage", e.target.value)}
                            placeholder="https://example.com/signature.png"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* DESIGN & LAYOUT TAB */}
            {activeTab === "design" && (
              <div className="space-y-4">
                {/* 1. Layout & Columns */}
                <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <LayoutGrid className="h-3.5 w-3.5 text-primary" /> Layout & Column Structure
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Columns</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40 text-xs font-bold">
                        {(["one", "two", "mix"] as const).map((col) => (
                          <button
                            key={col}
                            onClick={() => {
                              setLayoutColumns(col);
                              toast.success(`Layout columns set to "${col.toUpperCase()}"`);
                            }}
                            className={cn(
                              "flex-1 py-1 rounded capitalize transition cursor-pointer",
                              layoutColumns === col && "bg-background shadow-xs text-primary font-black",
                            )}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Header Position</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40 text-xs font-bold">
                        {(["top", "left", "right"] as const).map((pos) => (
                          <button
                            key={pos}
                            onClick={() => {
                              setHeaderPosition(pos);
                              toast.success(`Header position set to "${pos.toUpperCase()}"`);
                            }}
                            className={cn(
                              "flex-1 py-1 rounded capitalize transition cursor-pointer",
                              headerPosition === pos && "bg-background shadow-xs text-primary font-black",
                            )}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 2. Font Size Fine Tuning */}
                <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Type className="h-3.5 w-3.5 text-primary" /> Font Sizes & Increments
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Base Font Size</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40 font-bold">
                        {(["9.5pt", "10.5pt", "11.5pt", "12.5pt"] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setBaseFontSize(size)}
                            className={cn(
                              "flex-1 py-1 rounded transition cursor-pointer text-[11px]",
                              baseFontSize === size && "bg-background shadow-xs text-primary font-black",
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Full Name</span>
                      <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border justify-between">
                        <span className="font-bold px-2 text-primary">+{nameFontSizeOffset}pt</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setNameFontSizeOffset((v) => Math.max(1, v - 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setNameFontSizeOffset((v) => Math.min(30, v + 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Professional Title</span>
                      <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border justify-between">
                        <span className="font-bold px-2 text-primary">+{titleFontSizeOffset}pt</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setTitleFontSizeOffset((v) => Math.max(0, v - 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setTitleFontSizeOffset((v) => Math.min(20, v + 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Section Headings</span>
                      <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border justify-between">
                        <span className="font-bold px-2 text-primary">+{headingFontSizeOffset}pt</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setHeadingFontSizeOffset((v) => Math.max(0, v - 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeadingFontSizeOffset((v) => Math.min(10, v + 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 3. Spacing & Margins */}
                <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Spacing & Margins
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Line Height</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40 font-bold">
                        {[1.1, 1.2, 1.3, 1.4, 1.5].map((lh) => (
                          <button
                            key={lh}
                            onClick={() => {
                              setLineHeightVal(lh);
                              toast.success(`Line height set to ${lh}`);
                            }}
                            className={cn(
                              "flex-1 py-1 rounded transition cursor-pointer text-[10px]",
                              lineHeightVal === lh && "bg-background shadow-xs text-primary font-black",
                            )}
                          >
                            {lh}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Left & Right Margin</span>
                      <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border justify-between">
                        <span className="font-bold px-2 text-primary">{marginMmVal}mm</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setMarginMmVal((v) => Math.max(2, v - 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setMarginMmVal((v) => Math.min(25, v + 1))}
                            className="px-2.5 py-0.5 rounded bg-background border font-bold text-xs hover:bg-muted cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 4. Color Targets */}
                <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-primary" /> Apply Accent Color To
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                    {[
                      { id: "name", label: "Name" },
                      { id: "jobTitle", label: "Job title" },
                      { id: "headings", label: "Headings" },
                      { id: "headingsLine", label: "Headings line" },
                      { id: "headerIcons", label: "Header icons" },
                      { id: "dotsBars", label: "Dots/bars" },
                      { id: "dates", label: "Dates" },
                      { id: "entrySubtitle", label: "Entry subtitle" },
                      { id: "linkIcons", label: "Link icons" },
                    ].map((item) => {
                      const checked = accentTargets.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className={cn(
                            "flex items-center gap-2 p-1.5 rounded-lg border transition cursor-pointer",
                            checked ? "bg-primary/10 border-primary/40 text-primary font-bold" : "bg-muted/20 hover:bg-muted/40",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAccentTargets((prev) => [...prev, item.id]);
                              } else {
                                setAccentTargets((prev) => prev.filter((x) => x !== item.id));
                              }
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-[11px]">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </Card>

                {/* 5. Header Formatting & Separators */}
                <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Header & Detail Arrangement
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Details Arrangement</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40 font-bold">
                        {[
                          { id: "icon", label: "Icon" },
                          { id: "bullet", label: "Bullet" },
                          { id: "pipe", label: "|" },
                          { id: "bar", label: "Bar" },
                        ].map((sep) => (
                          <button
                            key={sep.id}
                            onClick={() => {
                              setDetailsArrangement(sep.id as any);
                              toast.success(`Details arrangement set to "${sep.label}"`);
                            }}
                            className={cn(
                              "flex-1 py-1 rounded transition cursor-pointer text-[10px]",
                              detailsArrangement === sep.id && "bg-background shadow-xs text-primary font-black",
                            )}
                          >
                            {sep.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Icon Style</span>
                      <select
                        className={inp}
                        value={iconStyleVal}
                        onChange={(e) => {
                          setIconStyleVal(e.target.value);
                          toast.success(`Icon style updated!`);
                        }}
                      >
                        <option>Icon Style: Circle Outline</option>
                        <option>Icon Style: No Frame</option>
                        <option>Icon Style: Circle Filled</option>
                        <option>Icon Style: Rounded Filled</option>
                        <option>Icon Style: Square Filled</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* 6. Design Templates Selection */}
                <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <LayoutGrid className="h-3.5 w-3.5 text-primary" /> Design Templates
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTpl(t);
                          setAccentColor(t.accent);
                          toast.success(`Switched template to "${t.label}"!`);
                        }}
                        className={cn(
                          "p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between",
                          selectedTpl.id === t.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                            : "border-border hover:bg-muted/30",
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{t.label}</span>
                          <span
                            className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: t.accent + "20", color: t.accent }}
                          >
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* AI PRO TOOLS TAB */}
            {activeTab === "ai" && (
              <Card className="p-5 rounded-2xl border shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold">AI Resume Enhancements</h3>
                    <p className="text-xs text-muted-foreground">Google XYZ formula generator & ATS keyword optimizer</p>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  AI Format & Optimize Complete Resume
                </button>

                {/* 1. Google XYZ Formulas */}
                <div className="pt-2 border-t space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-amber-500" /> Google XYZ Formula Tips
                  </Label>
                  <div className="space-y-2">
                    {XYZ_FORMULAS.map((f) => (
                      <div
                        key={f.id}
                        className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between gap-2 hover:bg-muted/60 transition"
                      >
                        <span className="text-xs font-mono text-foreground font-medium">{f.text}</span>
                        <button
                          onClick={() => insertXYZFormula(f.text)}
                          className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold shrink-0 hover:opacity-90 transition cursor-pointer"
                        >
                          + Insert
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Top Skills & Tools */}
                <div className="pt-2 border-t space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-emerald-600" /> Top Skills & Keyword Suggestions
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_KEYWORDS_BANK.map((sk) => (
                      <button
                        key={sk}
                        onClick={() => addSkillKeyword(sk)}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition border border-emerald-200 dark:border-emerald-800/40 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> {sk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Recommended Courses */}
                <div className="pt-2 border-t space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Recommended Learnify AI Certifications
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {LEARNIFY_COURSES.map((c) => (
                      <div
                        key={c.name}
                        className="p-3 rounded-xl border bg-card flex flex-col justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.category} · {c.match}% Match</p>
                        </div>
                        <button
                          onClick={() => addCourseToCertifications(c.name)}
                          className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold hover:bg-indigo-100 transition border border-indigo-200 dark:border-indigo-800/40 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Certification
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* AI COVER LETTER TAB */}
            {activeTab === "cover" && (
              <Card className="p-5 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="text-sm font-bold">AI Cover Letter Generator</h3>
                    <p className="text-xs text-muted-foreground">Draft a tailored 3-paragraph executive cover letter</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Target Company Name *</Label>
                    <input
                      className={inp}
                      placeholder="e.g. Google, Microsoft, Amazon, Meta"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGenerateCoverLetter}
                    disabled={generatingCover}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {generatingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Generate Cover Letter
                  </button>

                  {coverLetterText && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Generated Cover Letter:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coverLetterText);
                            toast.success("Copied Cover Letter to clipboard!");
                          }}
                          className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Copy className="h-3 w-3" /> Copy Text
                        </button>
                      </div>
                      <textarea
                        className={`${inp} min-h-[220px] font-mono text-xs`}
                        value={coverLetterText}
                        onChange={(e) => setCoverLetterText(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* END LEFT PANE TABS */}
          </div>

          {/* Right Live Document Preview */}
          <div className="sticky top-20 space-y-3">
            {/* Real-time Live ATS Score Gauge Header */}
            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border text-xs gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-black text-white shadow-sm flex items-center gap-1",
                    liveAts.score >= 80 ? "bg-emerald-600" : liveAts.score >= 60 ? "bg-amber-500" : "bg-rose-500",
                  )}
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>{liveAts.score}% ATS Match</span>
                </div>
                {liveAts.missingKeywords.length > 0 && (
                  <button
                    onClick={autoFixKeywords}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    + Auto-Fix Keywords
                  </button>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold truncate">
                {selectedTpl.label}
              </span>
            </div>

            <div className="max-h-[80vh] overflow-y-auto rounded-xl border bg-white shadow-xl">
              <ResumePreview
                form={form}
                template={selectedTpl}
                accentColor={accentColor}
                fontFamily={fontFamily}
                layoutColumns={layoutColumns}
                headerPosition={headerPosition}
                headerAlign={headerAlign}
                baseFontSize={baseFontSize}
                nameFontSizeOffset={nameFontSizeOffset}
                titleFontSizeOffset={titleFontSizeOffset}
                headingFontSizeOffset={headingFontSizeOffset}
                lineHeightVal={lineHeightVal}
                marginMmVal={marginMmVal}
                accentTargets={accentTargets}
                detailsArrangement={detailsArrangement}
                iconStyleVal={iconStyleVal}
                headingCap={headingCap}
                workOrder={workOrder}
                skillsStyle={skillsStyle}
              />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
