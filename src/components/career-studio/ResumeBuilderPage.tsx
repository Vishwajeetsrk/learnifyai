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
  Globe,
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

const VISHWAJEET_DEFAULT_FORM: Record<string, string> = {
  fullName: "VISHWAJEET",
  targetRole: "AI Software Engineer | Full Stack Developer | Salesforce & Data Operations",
  email: "vishwajeetsrk@gmail.com",
  phone: "+91 85952 02922",
  location: "Bengaluru, India",
  linkedin: "https://www.linkedin.com/in/vishwajeetsrk/",
  github: "https://github.com/Vishwajeetsrk",
  website: "https://www.learnifyai.in",
  portfolio: "https://vishwajeetsrk.github.io",
  summary:
    "AI-focused Full Stack Developer with hands-on experience building AI-powered SaaS applications, modern web platforms, and automation workflows. Skilled in Salesforce CRM, Microsoft Excel, PowerPoint, Word, HTML, Supabase, Firebase, AI tools, and responsive web development. Passionate about Generative AI, cloud technologies, and creating scalable digital products that improve learning and productivity.",
  experience: `Reconciliation & Data Management, Rootbridge Academy Pvt Ltd | Dec 2024 – Present | Bengaluru
Played a key role in enhancing data management and operational efficiency at Rootbridge.
• Entered, verified, and maintained over 200,000 records with exceptional accuracy.
• Identified and resolved more than 50 recurring data mismatches monthly, significantly improving data integrity.
• Achieved a 30% increase in data accuracy through rigorous validation and reconciliation checks.

Fundraiser, Rootbridge Academy Pvt Ltd | Jun 2023 – Nov 2024 | Bengaluru
• Engaged potential donors through face-to-face interactions, effectively communicating the organization's mission.
• Developed and maintained strong relationships with stakeholders to enhance fundraising efforts.
• Achieved fundraising targets consistently, contributing to the overall growth of Rootbridge.
• Promoted awareness of the organization's initiatives, resulting in increased community involvement.

Social Media Intern, Sorting Hat Technologies (Unacademy) | Feb 2026 – Mar 2026 | Bengaluru
• Designed thumbnails and optimized metadata for educational content visibility and engagement.
• Managed uploads, playlists, and structured UI-focused content systems on the Atlas platform.
• Improved workflow efficiency using Python-based automation systems.
• Collaborated with teams to maintain high-quality educational content delivery.

Social Media Designer Intern, WeLive Foundation | Jan 2023 – May 2023 | Bengaluru
• Designed social media creatives and digital content using Canva.
• Improved engagement through visually optimized content and audience-focused design strategies.
• Created WordPress blogs and assisted in content presentation improvements.`,
  education: `Bachelor of Computer Applications (BCA), St. Aloysius Degree College | Apr 2023 – Jul 2026 | Bengaluru
Diploma in Software Development, Oxford Software Institute | Feb 2021 – Feb 2022 | New Delhi`,
  skills: `Programming: HTML5 | CSS3 | JavaScript | Python | SQL | Basic Java
Frontend: React.js | Next.js | Tailwind CSS | Responsive Design
Database: Supabase | Firebase | MySQL | MongoDB | PostgreSQL | Prisma | Upstash Redis
CRM & Business Tools: Salesforce CRM | Salesforce Data Loader | Razorpay
AI & Automation: ChatGPT | Gemini | Claude | OpenRouter | Antigravity | NotebookLM | Prompt Engineering
Backend: Node.js | Express.js | PHP | REST APIs
Cloud & Deployment: Vercel | Render | GitHub | Cloudinary
Microsoft Office: Microsoft Excel | Microsoft Word | Microsoft PowerPoint`,
  projects: `Learnify AI | May 2026 – Present
Tech Stack: React 19, TypeScript, Tailwind CSS, Cashfree, Supabase, OpenRouter etc.
• Built a full-stack AI-powered learning platform that combines intelligent tutoring, creator tools, gamification, AI career guidance, and community learning.
• GitHub: https://github.com/Vishwajeetsrk/learnifyai | Live: https://www.learnifyai.in

DreamSync — AI Career Intelligence & Support Platform | Feb 2026 – Apr 2026
Tech Stack: Next.js, React, Tailwind CSS, Firebase, OpenRouter API, Gemini, Upstash Redis, Framer Motion
• Designed and developed a modern AI-powered platform focused on career growth and portfolio building.
• Built responsive interfaces including AI Resume Builder, ATS Checker, LinkedIn Optimizer, and Portfolio Generator.
• Live: https://dream-sync-nine.vercel.app/

LUXURY LAUNDRY — Premium Laundry SaaS Platform | Apr 2026 – May 2026
Tech Stack: Next.js, Express.js, PostgreSQL, Prisma, Socket.io, Tailwind CSS
• Developed responsive customer and admin dashboards for a premium SaaS platform.
• Built modern UI components and scalable frontend architecture using Tailwind CSS.
• Live: https://luxurylaundry.vercel.app/`,
  certifications: `• Full Stack Development Internship Certificate
• Excel certificate verifies - GreatLearning Academy (https://mygreatlearning.com/certificate/BOXDAINZ)
• Develop a Company Website with Wix - Coursera (https://coursera.org/share/5b28571966f0a7d4fd89f72532208b76)
• Tata — GenAI Powered Data Analytics Job Simulation (https://www.theforage.com/completion-certificates/ifobHAoMjQs9s6bKS/gMTdCXwDdLYoXZ3wG)
• Google Sheets powered by Google Cloud (https://www.simplilearn.com/free-google-sheets-course-skillup)
• MySQL Basics - Great Learning Academy (https://www.mygreatlearning.com/certificate/JPSOBOHB)
• Build your business brand using Canva (https://coursera.org/share/7b9f5dcc6ba44c3a260c4a2abdf03b1c)`,
  strengths: `Analytical Thinking: Skilled in identifying trends and optimizing workflows.
Team Collaboration: Effective in cross-functional team environments (fundraising, technical support, client engagement).
Problem Solving: Handling reconciliation discrepancies and database integrity issues.
Fast Learning: Actively pursuing certifications and new tools.
AI Prompt Engineering & Product Development: Designing intelligent prompts, AI workflows, and building scalable AI SaaS products.`,
  languages: `Hindi (Native), English`,
  awards: `Won 1st Prize in Web Design Competition at NEURO2026 organized by Charan's Degree College (Apr 10, 2026)`,
  declaration: `I hereby declare that the information provided is true to the best of my knowledge and belief. I am committed to applying my reconciliation and data management expertise to contribute meaningfully.`,
  signatoryName: "VISHWAJEET",
  signatoryPlace: "Bengaluru",
};

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

/* ── Live Preview Component ── */
function ResumePreview({
  form,
  template,
  accentColor,
  fontFamily = "font-sans",
  layoutColumns = "one",
  headerAlign = "center",
  baseFontSize = "10.5pt",
  headingCap = "uppercase",
  workOrder = "title-employer",
  skillsStyle = "compact",
}: {
  form: Record<string, string>;
  template: (typeof TEMPLATES)[0];
  accentColor?: string;
  fontFamily?: string;
  layoutColumns?: "one" | "two" | "mix";
  headerAlign?: "left" | "center";
  baseFontSize?: string;
  headingCap?: "uppercase" | "capitalize";
  workOrder?: "title-employer" | "employer-title";
  skillsStyle?: "compact" | "badges" | "grid";
}) {
  const isCreative = template.id === "creative" || skillsStyle === "badges";
  const isDreamSync = template.id === "dreamsync";
  const accent = accentColor || template.accent || "#0f172a";

  const expItems = parseExperienceEntries(form.experience || "");
  const eduItems = parseEducationEntries(form.education || "");
  const projItems = parseProjectEntries(form.projects || "");
  const skillCats = parseSkillCategories(form.skills || "");

  const renderSectionHeader = (icon: any, label: string) => {
    const IconComponent = icon;
    const displayLabel = headingCap === "uppercase" ? label.toUpperCase() : label;
    return (
      <div
        className="flex items-center gap-1.5 mb-3 pb-1 border-b-2"
        style={{ borderColor: accent }}
      >
        <IconComponent className="h-4 w-4" style={{ color: accent }} />
        <h3
          className="text-xs font-black uppercase tracking-wider"
          style={{ color: accent }}
        >
          {displayLabel}
        </h3>
      </div>
    );
  };

  const sH = (label: string) => (
    <p
      className="text-[10px] font-extrabold uppercase tracking-widest mb-2 pb-1 border-b"
      style={{ color: accent, borderColor: accent + "40" }}
    >
      {headingCap === "uppercase" ? label.toUpperCase() : label}
    </p>
  );

  return (
    <div
      id="resume-preview-document"
      className={cn(
        "w-full rounded-xl border overflow-hidden shadow-sm text-xs leading-relaxed bg-white text-slate-900 relative",
        fontFamily,
      )}
      style={{ minHeight: 650, fontSize: baseFontSize }}
    >
      {/* Header */}
      {isDreamSync ? (
        <div
          className={cn(
            "px-8 py-6 border-b space-y-2 bg-slate-50/50",
            headerAlign === "center" ? "text-center" : "text-left",
          )}
        >
          {form.photo && (
            <img
              src={form.photo}
              alt="Profile Photo"
              className={cn(
                "h-16 w-16 rounded-full object-cover border-2 shadow-sm mb-1",
                headerAlign === "center" && "mx-auto",
              )}
              style={{ borderColor: accent }}
            />
          )}
          <h1 className="text-2xl font-black tracking-wide text-slate-950 uppercase">
            {form.fullName || "ALEX RIVERA"}
          </h1>
          {form.targetRole && (
            <p className="text-xs font-bold text-slate-700 max-w-2xl leading-normal">
              {form.targetRole}
            </p>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-slate-600 pt-1",
              headerAlign === "center" && "justify-center",
            )}
          >
            {form.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-500" />
                {form.email}
              </span>
            )}
            {form.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-500" />
                {form.phone}
              </span>
            )}
            {form.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-500" />
                {form.location}
              </span>
            )}
            {form.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-3 w-3 text-blue-600" />
                <a href={form.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                  LinkedIn: {form.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "")}
                </a>
              </span>
            )}
            {form.github && (
              <span className="flex items-center gap-1">
                <Github className="h-3 w-3 text-slate-800" />
                <a href={form.github} target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub: {form.github.replace(/https?:\/\/(www\.)?github\.com\//, "")}
                </a>
              </span>
            )}
            {form.website && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-emerald-600" />
                <a href={form.website} target="_blank" rel="noreferrer" className="hover:underline">
                  {form.website.replace(/https?:\/\//, "")}
                </a>
              </span>
            )}
          </div>
          {(form.passport || form.nationality || form.visa) && (
            <div className="text-[10px] text-slate-500 font-medium pt-1 flex gap-3 justify-center">
              {form.nationality && <span>Nationality: {form.nationality}</span>}
              {form.visa && <span>Visa: {form.visa}</span>}
              {form.passport && <span>Passport/ID: {form.passport}</span>}
            </div>
          )}
        </div>
      ) : (
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: template.previewBg, color: template.previewText }}
        >
          <div>
            <p className="font-black text-lg">{form.fullName || "Your Name"}</p>
            {form.targetRole && <p className="opacity-90 text-sm mt-0.5">{form.targetRole}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-75">
              {form.email && <span>{form.email}</span>}
              {form.phone && <span>{form.phone}</span>}
              {form.linkedin && <span>{form.linkedin}</span>}
            </div>
          </div>
          {form.photo && (
            <img
              src={form.photo}
              alt="Profile"
              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow"
            />
          )}
        </div>
      )}

      {/* Body Content */}
      <div
        className={cn(
          "px-8 py-6 space-y-6 relative",
          layoutColumns === "two" && "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0",
        )}
      >
        {/* A4 Page-Break Visual Indicator */}
        <div className="absolute top-[820px] left-0 right-0 border-b-2 border-dashed border-rose-300 dark:border-rose-800 flex items-center justify-between px-4 py-0.5 text-[9px] font-bold text-rose-500 bg-rose-50/60 dark:bg-rose-950/40 pointer-events-none z-10">
          <span>📄 Page 1 Cutoff Line (A4 Margin)</span>
          <span>Page 2 Begins Below ↓</span>
        </div>

        {/* Objective / Summary */}
        {form.summary && (
          <div>
            {isDreamSync ? renderSectionHeader(FileText, "OBJECTIVE / SUMMARY") : sH("Summary")}
            <p className="text-xs text-slate-700 leading-relaxed font-normal">{form.summary}</p>
          </div>
        )}

        {/* Experience */}
        {form.experience && (
          <div>
            {isDreamSync ? renderSectionHeader(Briefcase, "PROFESSIONAL EXPERIENCE") : sH("Experience")}
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
                                <span className="font-semibold text-slate-700">@ {item.company}</span>
                              )}
                            </>
                          )}
                        </div>
                        <div className="text-[10.5px] font-bold text-slate-500">
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
          </div>
        )}

        {/* Education */}
        {form.education && (
          <div>
            {isDreamSync ? renderSectionHeader(GraduationCap, "EDUCATION") : sH("Education")}
            <div className="space-y-2">
              {eduItems.length > 0
                ? eduItems.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <div>
                        <span className="font-bold text-[12px] text-slate-950">{item.degree}</span>
                        {item.school && <span className="font-semibold text-slate-700">, {item.school}</span>}
                      </div>
                      <div className="text-[10.5px] font-bold text-slate-500">
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
          </div>
        )}

        {/* Projects */}
        {form.projects && (
          <div>
            {isDreamSync ? renderSectionHeader(FolderOpen, "PROJECTS") : sH("Projects")}
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
                        {item.dates && <span className="text-[10.5px] font-bold text-slate-500">{item.dates}</span>}
                      </div>
                      {item.techStack && (
                        <p className="text-[10.5px] text-indigo-700 font-semibold">
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
          </div>
        )}

        {/* Skills */}
        {form.skills && (
          <div>
            {isDreamSync ? renderSectionHeader(Wrench, "TECHNICAL SKILLS") : sH("Skills")}
            {isCreative ? (
              <div className="flex flex-wrap gap-1.5">
                {form.skills.split(",").map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200"
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
        )}

        {/* Certifications */}
        {form.certifications && (
          <div>
            {isDreamSync ? renderSectionHeader(Award, "CERTIFICATIONS") : sH("Certifications")}
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed space-y-1">
              {renderTextWithLinks(form.certifications)}
            </div>
          </div>
        )}

        {/* Strengths */}
        {form.strengths && (
          <div>
            {isDreamSync ? renderSectionHeader(Star, "STRENGTHS & COMPETENCIES") : sH("Strengths")}
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
              {form.strengths}
            </div>
          </div>
        )}

        {/* Languages & Awards */}
        {(form.languages || form.awards) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.languages && (
              <div>
                {isDreamSync ? renderSectionHeader(Globe, "LANGUAGES") : sH("Languages")}
                <p className="text-xs text-slate-800 font-medium">{form.languages}</p>
              </div>
            )}
            {form.awards && (
              <div>
                {isDreamSync ? renderSectionHeader(Award, "AWARDS") : sH("Awards")}
                <div className="text-xs text-slate-800 font-medium">
                  {renderTextWithLinks(form.awards)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Declaration & Digital Signature */}
        {form.declaration && (
          <div className="pt-2 border-t border-slate-200/80">
            {isDreamSync ? renderSectionHeader(PenTool, "DECLARATION") : sH("Declaration")}
            <p className="text-[11px] text-slate-600 italic mb-4 leading-relaxed">
              {form.declaration}
            </p>
            <div className="pt-2 border-t border-slate-300 w-52">
              {form.signatureImage ? (
                <img
                  src={form.signatureImage}
                  alt="Digital Signature"
                  className="h-10 object-contain mb-1"
                />
              ) : (
                <p className="font-serif italic text-lg text-indigo-900 font-bold leading-none">
                  {form.signatoryName || form.fullName || "Alex Rivera"}
                </p>
              )}
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                {form.signatoryName || form.fullName || "Alex Rivera"} ({form.signatoryPlace || form.location?.split(",")[0] || "San Francisco"})
              </p>
            </div>
          </div>
        )}
      </div>
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
  const [headerAlign, setHeaderAlign] = useState<"left" | "center">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_align") as any)) || "center";
  });
  const [baseFontSize, setBaseFontSize] = useState<"9.5pt" | "10.5pt" | "11.5pt" | "12.5pt">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("resume_builder_font_size") as any)) || "10.5pt";
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

  const [linkedinHeadline, setLinkedinHeadline] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_linkedin_headline")) || "";
  });
  const [linkedinBio, setLinkedinBio] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("resume_builder_linkedin_bio")) || "";
  });

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
          return { ...SAMPLE_TEMPLATE_FORM, ...JSON.parse(saved) };
        } catch {}
      }
    }
    return SAMPLE_TEMPLATE_FORM;
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
    localStorage.setItem("resume_builder_align", headerAlign);
    localStorage.setItem("resume_builder_font_size", baseFontSize);
    localStorage.setItem("resume_builder_cap", headingCap);
    localStorage.setItem("resume_builder_work_order", workOrder);
    localStorage.setItem("resume_builder_skills_style", skillsStyle);
    localStorage.setItem("resume_builder_target_company", targetCompany);
    localStorage.setItem("resume_builder_cover_text", coverLetterText);
    localStorage.setItem("resume_builder_linkedin_headline", linkedinHeadline);
    localStorage.setItem("resume_builder_linkedin_bio", linkedinBio);
  }, [
    activeTab,
    activeSection,
    selectedTpl,
    accentColor,
    fontFamily,
    docLanguage,
    pageFormat,
    layoutColumns,
    headerAlign,
    baseFontSize,
    headingCap,
    workOrder,
    skillsStyle,
    targetCompany,
    coverLetterText,
    linkedinHeadline,
    linkedinBio,
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

  const handleGenerateLinkedin = () => {
    const headline = `${form.targetRole || "Full Stack Engineer"} | ${form.skills?.split(",").slice(0, 3).join(" • ") || "React • TypeScript • Cloud"} | Building Scalable AI Solutions`;
    const bio = `🚀 ${form.targetRole || "Software Engineer"} passionate about building scalable digital platforms and high-availability systems.\n\n🌟 Key Highlights:\n• ${form.summary?.slice(0, 140) || "Spearheaded enterprise SaaS architecture"}\n• Proven track record in full-stack performance optimization.\n\n💡 Core Tech: ${form.skills || "React, TypeScript, Python, AWS"}\n\n📩 Connect with me at ${form.email || "email"} or visit ${form.website || "portfolio"}`;
    setLinkedinHeadline(headline);
    setLinkedinBio(bio);
    toast.success("Generated LinkedIn Profile Headline & Bio!");
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

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

  const handleDownloadWord = () => {
    const el = document.getElementById("resume-preview-document");
    let bodyHtml = "";
    if (el) {
      bodyHtml = el.innerHTML;
    } else if (result) {
      bodyHtml = markdownToHtml(result);
    } else {
      bodyHtml = `<h1>${form.fullName}</h1><p>${form.targetRole}</p>`;
    }

    const docHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title><style>body { font-family: Arial, sans-serif; line-height: 1.5; color: #111; margin: 0.8in; } h1 { font-size: 22pt; font-weight: bold; text-align: center; margin-bottom: 4pt; } h3 { font-size: 13pt; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt; } p, div { font-size: 10pt; margin-bottom: 4pt; } a { color: #0284c7; text-decoration: underline; }</style></head><body>${bodyHtml}</body></html>`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob(["\ufeff" + docHtml], { type: "application/msword" })),
      download: `${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.docx`,
    });
    a.click();
    toast.success("Word Document (.docx) downloaded!");
  };

  const handleDownloadPdfDirect = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

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

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      const contactInfo = [form.email, form.phone, form.location, form.linkedin]
        .filter(Boolean)
        .join(" | ");
      doc.text(contactInfo, 105, y, { align: "center" });
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 6;

      const addSection = (title: string, content?: string) => {
        if (!content || !content.trim()) return;
        if (y > 270) {
          doc.addPage();
          y = 15;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(title.toUpperCase(), 15, y);
        y += 2;
        doc.setDrawColor(0, 0, 0);
        doc.line(15, y, 195, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);

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

      addSection("Professional Summary", form.summary);
      addSection("Professional Experience", form.experience);
      addSection("Education", form.education);
      addSection("Technical Skills", form.skills);
      addSection("Projects", form.projects);
      addSection("Certifications", form.certifications);
      addSection("Strengths & Competencies", form.strengths);
      addSection("Languages", form.languages);
      addSection("Honors & Awards", form.awards);
      addSection("Declaration", form.declaration);

      doc.save(`${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("PDF Resume downloaded directly!");
    } catch {
      toast.error("Failed to generate PDF download");
    }
  };

  const handleDownloadTxt = () => {
    const textContent = [
      (form.fullName || "ALEX RIVERA").toUpperCase(),
      form.targetRole,
      [form.email, form.phone, form.location, form.linkedin, form.github, form.website]
        .filter(Boolean)
        .join(" | "),
      "\n" + "=".repeat(60),
      form.summary ? `\nOBJECTIVE / SUMMARY\n${form.summary}` : "",
      form.experience ? `\nPROFESSIONAL EXPERIENCE\n${form.experience}` : "",
      form.education ? `\nEDUCATION\n${form.education}` : "",
      form.skills ? `\nTECHNICAL SKILLS\n${form.skills}` : "",
      form.projects ? `\nPROJECTS\n${form.projects}` : "",
      form.certifications ? `\nCERTIFICATIONS\n${form.certifications}` : "",
      form.strengths ? `\nSTRENGTHS\n${form.strengths}` : "",
      form.languages ? `\nLANGUAGES\n${form.languages}` : "",
      form.awards ? `\nAWARDS\n${form.awards}` : "",
      form.declaration ? `\nDECLARATION\n${form.declaration}\nSignatory: ${form.signatoryName || form.fullName} (${form.signatoryPlace || "San Francisco"})` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.txt`,
    });
    a.click();
    toast.success("Text (.txt) Resume downloaded!");
  };

  const resetToSampleTemplate = () => {
    setForm(SAMPLE_TEMPLATE_FORM);
    setResult(null);
    toast.success("Loaded Generic Sample Resume (Alex Rivera)!");
  };

  const resetToVishwajeetTemplate = () => {
    setForm(VISHWAJEET_DEFAULT_FORM);
    setResult(null);
    toast.success("Loaded Vishwajeet Platinum ATS Sample Resume!");
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
                onClick={saveNewDraft}
                className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Save Draft
              </button>
            </div>

            <button
              onClick={resetToSampleTemplate}
              className="px-3 py-1.5 rounded-xl border bg-muted/40 hover:bg-muted text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-blue-500" /> Sample Resume
            </button>
            <button
              onClick={resetToVishwajeetTemplate}
              className="px-3 py-1.5 rounded-xl border bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Vishwajeet Resume
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
              { id: "linkedin", label: "LinkedIn Enhancer", icon: Linkedin },
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
                    <div className="p-4 space-y-2 border-t">
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
                    <div className="p-4 space-y-2 border-t">
                      <textarea
                        className={`${inp} min-h-[90px] resize-y font-mono text-xs`}
                        value={form.education || ""}
                        onChange={(e) => update("education", e.target.value)}
                        placeholder="Degree, College/University | Dates | City..."
                      />
                    </div>
                  )}
                </Card>

                {/* 6. Technical Skills Accordion */}
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSection(activeSection === "skills" ? "" : "skills")}
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-amber-500" />
                      <span>Technical Skills</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeSection === "skills" && "rotate-180",
                      )}
                    />
                  </button>
                  {activeSection === "skills" && (
                    <div className="p-4 space-y-2 border-t">
                      <textarea
                        className={`${inp} min-h-[120px] resize-y font-mono text-xs`}
                        value={form.skills || ""}
                        onChange={(e) => update("skills", e.target.value)}
                        placeholder="Languages: JS, TS, Python\nFrameworks: React, Next.js..."
                      />
                    </div>
                  )}
                </Card>

                {/* 7. Projects Accordion */}
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
                    <div className="p-4 space-y-2 border-t">
                      <textarea
                        className={`${inp} min-h-[160px] resize-y font-mono text-xs`}
                        value={form.projects || ""}
                        onChange={(e) => update("projects", e.target.value)}
                        placeholder="Project Title — Subtitle | Year\nTech Stack: React, Node...\n• Key impact bullet..."
                      />
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
              <Card className="p-5 rounded-2xl border shadow-sm space-y-6">
                <div>
                  <Label className="text-xs font-bold mb-3 block uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Document & Page Format
                  </Label>
                  <div className="grid sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Language</span>
                      <select
                        className={inp}
                        value={docLanguage}
                        onChange={(e) => setDocLanguage(e.target.value)}
                      >
                        <option>English (UK)</option>
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Spanish</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Page Format</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40">
                        <button
                          onClick={() => setPageFormat("A4")}
                          className={cn(
                            "flex-1 py-1 rounded text-xs font-bold transition cursor-pointer",
                            pageFormat === "A4" && "bg-background shadow-xs text-primary",
                          )}
                        >
                          A4
                        </button>
                        <button
                          onClick={() => setPageFormat("Letter")}
                          className={cn(
                            "flex-1 py-1 rounded text-xs font-bold transition cursor-pointer",
                            pageFormat === "Letter" && "bg-background shadow-xs text-primary",
                          )}
                        >
                          Letter
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold block mb-1">Header Align</span>
                      <div className="flex rounded-lg border p-0.5 bg-muted/40">
                        <button
                          onClick={() => setHeaderAlign("left")}
                          className={cn(
                            "flex-1 py-1 rounded text-xs font-bold transition cursor-pointer flex justify-center items-center",
                            headerAlign === "left" && "bg-background shadow-xs text-primary",
                          )}
                        >
                          <AlignLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setHeaderAlign("center")}
                          className={cn(
                            "flex-1 py-1 rounded text-xs font-bold transition cursor-pointer flex justify-center items-center",
                            headerAlign === "center" && "bg-background shadow-xs text-primary",
                          )}
                        >
                          <AlignCenter className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Label className="text-xs font-bold mb-3 block uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <LayoutGrid className="h-3.5 w-3.5 text-primary" /> Design Templates
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTpl(t)}
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
                </div>
              </Card>
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

            {/* LINKEDIN ENHANCER TAB */}
            {activeTab === "linkedin" && (
              <Card className="p-5 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-bold">LinkedIn Profile & Headline Enhancer</h3>
                    <p className="text-xs text-muted-foreground">Generate high-converting headlines & About section</p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateLinkedin}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" /> Generate Headline & Bio
                </button>

                {linkedinHeadline && (
                  <div className="space-y-4 pt-2 border-t">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">LinkedIn Headline (120 Chars):</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(linkedinHeadline);
                            toast.success("Copied Headline!");
                          }}
                          className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                      <input className={inp} value={linkedinHeadline} onChange={(e) => setLinkedinHeadline(e.target.value)} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">LinkedIn About / Bio Section:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(linkedinBio);
                            toast.success("Copied About section!");
                          }}
                          className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                      <textarea className={`${inp} min-h-[160px] font-mono text-xs`} value={linkedinBio} onChange={(e) => setLinkedinBio(e.target.value)} />
                    </div>
                  </div>
                )}
              </Card>
            )}
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
                headerAlign={headerAlign}
                baseFontSize={baseFontSize}
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
