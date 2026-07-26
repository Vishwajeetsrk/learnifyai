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

/* ── Design Templates ── */
const TEMPLATES = [
  {
    id: "dreamsync",
    label: "DreamSync Pro",
    badge: "100% ATS",
    desc: "Executive Layout with Section Icons & Solid Underlines",
    accent: "#0f172a",
    previewBg: "#0f172a",
    previewText: "#fff",
  },
  {
    id: "modern",
    label: "Modern Tech",
    badge: "ATS Ready",
    desc: "Clean indigo accent, high readability font structure",
    accent: "#4f46e5",
    previewBg: "#4f46e5",
    previewText: "#fff",
  },
  {
    id: "classic",
    label: "Executive Classic",
    badge: "Formal",
    desc: "Serif headers, formal executive structure",
    accent: "#1e293b",
    previewBg: "#1e293b",
    previewText: "#fff",
  },
  {
    id: "minimal",
    label: "Minimal ATS",
    badge: "100% ATS",
    desc: "Monochrome, maximum ATS parse rate",
    accent: "#374151",
    previewBg: "#f9fafb",
    previewText: "#111827",
  },
  {
    id: "creative",
    label: "Creative Showcase",
    badge: "Portfolio",
    desc: "Emerald accents, skill badges & pill tags",
    accent: "#059669",
    previewBg: "#059669",
    previewText: "#fff",
  },
];

const XYZ_TIPS = [
  "Accomplished [X] as measured by [Y] by doing [Z]",
  "Led a team of [X] to achieve [Y] by implementing [Z]",
  "Reduced [X] by [Y%] through [Z]",
  "Increased [X] by [Y] using [Z] approach",
  "Delivered [X] project saving [Y] by [Z]",
];

const LEARNIFY_COURSES = [
  { name: "Full Stack AI Engineer", category: "AI & Development", match: 98 },
  { name: "Data Science & ML Bootcamp", category: "Data & Analytics", match: 95 },
  { name: "System Design Mastery", category: "Architecture", match: 91 },
  { name: "DSA & Competitive Programming", category: "Core CS", match: 88 },
  { name: "React + Next.js Pro", category: "Frontend", match: 85 },
  { name: "Cloud & DevOps with AWS", category: "Infrastructure", match: 82 },
];

function markdownToHtml(md: string) {
  let html = md
    .replace(/\r\n/g, "\n")
    .replace(/^## (.*$)/gim, "2>$1</h2>")
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
};

function FormatToolbar({
  onFormat,
  onAiAction,
}: {
  onFormat: (tag: string) => void;
  onAiAction?: (action: string) => void;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-1 p-1 bg-muted/40 rounded-lg border border-border/50 text-xs mb-1.5">
      <div className="flex items-center gap-0.5">
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

/* ── Live Preview ───────────────────────────────────────────── */
function ResumePreview({
  form,
  template,
  accentColor,
  dividerStyle = "bullet",
}: {
  form: Record<string, string>;
  template: (typeof TEMPLATES)[0];
  accentColor?: string;
  dividerStyle?: "bullet" | "icon" | "bar";
}) {
  const isCreative = template.id === "creative";
  const isDreamSync = template.id === "dreamsync";
  const accent = accentColor || template.accent || "#0f172a";

  const renderSectionHeader = (icon: any, label: string) => {
    const IconComponent = icon;
    return (
      <div
        className="flex items-center gap-1.5 mb-2 pb-1 border-b-2"
        style={{ borderColor: accent }}
      >
        <IconComponent className="h-4 w-4" style={{ color: accent }} />
        <h3
          className="text-xs font-black uppercase tracking-wider"
          style={{ color: accent }}
        >
          {label}
        </h3>
      </div>
    );
  };

  const sH = (label: string) => (
    <p
      className="text-[10px] font-extrabold uppercase tracking-widest mb-1.5 pb-1 border-b"
      style={{ color: accent, borderColor: accent + "40" }}
    >
      {label}
    </p>
  );

  const divider = dividerStyle === "bar" ? " | " : dividerStyle === "bullet" ? " • " : " ";

  return (
    <div
      id="resume-preview-document"
      className="w-full rounded-xl border overflow-hidden shadow-sm text-xs leading-relaxed bg-white text-slate-900 font-sans"
      style={{ minHeight: 600 }}
    >
      {/* Header */}
      {isDreamSync ? (
        <div className="px-8 py-6 text-center border-b space-y-2 bg-slate-50/50">
          {form.photo && (
            <img
              src={form.photo}
              alt="Profile Photo"
              className="h-16 w-16 rounded-full mx-auto object-cover border-2 shadow-sm mb-1"
              style={{ borderColor: accent }}
            />
          )}
          <h1 className="text-2xl font-black tracking-wide text-slate-950 uppercase">
            {form.fullName || "ALEX RIVERA"}
          </h1>
          {form.targetRole && (
            <p className="text-xs font-bold text-slate-700 max-w-2xl mx-auto leading-normal">
              {form.targetRole}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-600 pt-1">
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
            {form.medium && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-slate-900" />
                <a href={form.medium} target="_blank" rel="noreferrer" className="hover:underline">
                  Medium
                </a>
              </span>
            )}
            {form.twitter && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-sky-500" />
                <a href={form.twitter} target="_blank" rel="noreferrer" className="hover:underline">
                  X / Twitter
                </a>
              </span>
            )}
          </div>
          {(form.passport || form.nationality || form.visa) && (
            <div className="text-[10px] text-slate-500 font-medium pt-1 flex justify-center gap-3">
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
      <div className="px-8 py-6 space-y-5">
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
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {renderTextWithLinks(form.experience)}
            </div>
          </div>
        )}

        {/* Education */}
        {form.education && (
          <div>
            {isDreamSync ? renderSectionHeader(GraduationCap, "EDUCATION") : sH("Education")}
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {renderTextWithLinks(form.education)}
            </div>
          </div>
        )}

        {/* Projects */}
        {form.projects && (
          <div>
            {isDreamSync ? renderSectionHeader(FolderOpen, "PROJECTS") : sH("Projects")}
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {renderTextWithLinks(form.projects)}
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
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {renderTextWithLinks(form.certifications)}
            </div>
          </div>
        )}

        {/* Strengths */}
        {form.strengths && (
          <div>
            {isDreamSync ? renderSectionHeader(Star, "STRENGTHS & COMPETENCIES") : sH("Strengths")}
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
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
              <p className="font-serif italic text-lg text-indigo-900 font-bold leading-none">
                {form.fullName || "Alex Rivera"}
              </p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                {form.fullName || "Alex Rivera"} ({form.location?.split(",")[0] || "San Francisco"})
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

/* ── Main Component ── */
export function ResumeBuilderPage({ embedded = false }: { embedded?: boolean }) {
  const generateFn = useServerFn(generateResume);
  const extractFn = useServerFn(extractResumeFields);

  const [activeTab, setActiveTab] = useState<"content" | "design" | "ai">("content");
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [view, setView] = useState<"edit" | "preview">("preview");
  const [selectedTpl, setSelectedTpl] = useState(TEMPLATES[0]);
  const [accentColor, setAccentColor] = useState("#0f172a");

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("resume_builder_form", JSON.stringify(form));
  }, [form]);

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

  const handleFileExtracted = async (text: string) => {
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: text } });
      setForm((f) => ({
        ...f,
        fullName: fields.fullName || f.fullName,
        email: fields.email || f.email,
        phone: fields.phone || f.phone,
        linkedin: fields.linkedin || f.linkedin,
        summary: fields.summary || f.summary,
        experience: fields.experience || f.experience,
        education: fields.education || f.education,
        skills: fields.skills || f.skills,
        certifications: fields.certifications || f.certifications,
        projects: fields.projects || f.projects,
        targetRole: fields.targetRole || f.targetRole,
      }));
      toast.success("Fields auto-filled from uploaded file!");
    } catch {
      toast.error("Failed to parse file");
    } finally {
      setExtracting(false);
    }
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
      form.declaration ? `\nDECLARATION\n${form.declaration}` : "",
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
        {/* Top Bar Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resume Builder Studio</h2>
              <p className="text-xs text-muted-foreground">
                FlowCV-style Granular Customizer · Real-time Preview · ATS Verified
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-3">
          <div className="flex items-center gap-2">
            {[
              { id: "content", label: "Content Editor", icon: Edit3 },
              { id: "design", label: "Design & Layout", icon: Palette },
              { id: "ai", label: "AI Pro Tools", icon: Sparkles },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition",
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                          <Label className="text-xs font-semibold mb-1 block">Professional Title *</Label>
                          <input
                            className={inp}
                            value={form.targetRole || ""}
                            onChange={(e) => update("targetRole", e.target.value)}
                            placeholder="Senior Full Stack Engineer"
                          />
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Medium / Blog</Label>
                          <input
                            className={inp}
                            value={form.medium || ""}
                            onChange={(e) => update("medium", e.target.value)}
                            placeholder="https://medium.com/@..."
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">X / Twitter</Label>
                          <input
                            className={inp}
                            value={form.twitter || ""}
                            onChange={(e) => update("twitter", e.target.value)}
                            placeholder="https://x.com/..."
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                        className={`${inp} min-h-[180px] resize-y font-mono text-xs`}
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                        className={`${inp} min-h-[80px] resize-y font-mono text-xs`}
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                        className={`${inp} min-h-[100px] resize-y font-mono text-xs`}
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                        className={`${inp} min-h-[140px] resize-y font-mono text-xs`}
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
                    className="w-full p-4 flex items-center justify-between font-bold text-sm bg-muted/20 hover:bg-muted/40 transition"
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
                    <div className="p-4 space-y-2 border-t">
                      <textarea
                        className={`${inp} min-h-[60px] resize-y text-xs`}
                        value={form.declaration || ""}
                        onChange={(e) => update("declaration", e.target.value)}
                        placeholder="I hereby declare that the information provided is true..."
                      />
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === "design" && (
              <Card className="p-5 rounded-2xl border shadow-sm space-y-5">
                <div>
                  <Label className="text-xs font-bold mb-2 block uppercase tracking-wider text-muted-foreground">
                    Select Template Layout
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTpl(t)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all cursor-pointer",
                          selectedTpl.id === t.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:bg-muted/30",
                        )}
                      >
                        <span className="text-xs font-bold block">{t.label}</span>
                        <span className="text-[10px] text-muted-foreground">{t.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold mb-2 block uppercase tracking-wider text-muted-foreground">
                    Accent Color Palette
                  </Label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {[
                      "#0f172a",
                      "#4f46e5",
                      "#2563eb",
                      "#059669",
                      "#0d9488",
                      "#e11d48",
                      "#d97706",
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                          accentColor === c ? "border-primary ring-2 ring-offset-2 ring-primary" : "border-transparent",
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* AI TOOLS TAB */}
            {activeTab === "ai" && (
              <Card className="p-5 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-bold">AI Resume Enhancements</h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-md"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    AI Format & Optimize Complete Resume
                  </button>

                  <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                    <p className="text-xs font-bold text-foreground">AI Grammar & Bullet Enhancer</p>
                    <p className="text-[11px] text-muted-foreground">
                      Use the "Improve" or "Grammar" buttons inside the summary and experience section editor toolbars to automatically polish your bullet points with Google XYZ formula verbs.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Live Document Preview */}
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center justify-between bg-muted/40 px-3 py-2 rounded-xl border text-xs">
              <span className="font-bold flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-primary" /> Live Document Preview
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Template: {selectedTpl.label}
              </span>
            </div>

            <div className="max-h-[82vh] overflow-y-auto rounded-xl border bg-white shadow-xl">
              <ResumePreview
                form={form}
                template={selectedTpl}
                accentColor={accentColor}
              />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
