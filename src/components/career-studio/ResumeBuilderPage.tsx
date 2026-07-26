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

/* ── Templates ─────────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: "dreamsync",
    label: "DreamSync Pro",
    badge: "100% ATS",
    desc: "Vishwajeet ATS Executive Layout with Icons & Dividers",
    accent: "#0f172a",
    previewBg: "#0f172a",
    previewText: "#fff",
  },
  {
    id: "modern",
    label: "Modern Tech",
    badge: "ATS Ready",
    desc: "Clean indigo accent, high readability",
    accent: "#4f46e5",
    previewBg: "#4f46e5",
    previewText: "#fff",
  },
  {
    id: "classic",
    label: "Executive Classic",
    badge: "Formal",
    desc: "Serif headers, formal structure",
    accent: "#1e293b",
    previewBg: "#1e293b",
    previewText: "#fff",
  },
  {
    id: "minimal",
    label: "Minimal ATS",
    badge: "100% ATS",
    desc: "Monochrome, max parse rate",
    accent: "#374151",
    previewBg: "#f9fafb",
    previewText: "#111827",
  },
  {
    id: "creative",
    label: "Creative Showcase",
    badge: "Portfolio",
    desc: "Emerald accents, skill badges",
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

const KEYWORD_BANK: Record<string, string[]> = {
  general: [
    "Problem-solving",
    "Collaboration",
    "Leadership",
    "Agile",
    "Scrum",
    "Git",
    "REST APIs",
    "Microservices",
    "CI/CD",
    "Communication",
  ],
  tech: [
    "React",
    "TypeScript",
    "Python",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "GraphQL",
    "Redis",
  ],
  data: [
    "SQL",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Power BI",
    "Tableau",
    "Spark",
    "Kafka",
    "dbt",
  ],
};

const TOP_SKILLS = [
  "TypeScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "Docker",
  "AWS",
  "Machine Learning",
  "System Design",
  "REST APIs",
  "GraphQL",
  "PostgreSQL",
];
const TOP_TOOLS = [
  "VS Code",
  "Figma",
  "Postman",
  "GitHub",
  "Jira",
  "Notion",
  "Vercel",
  "Supabase",
  "Firebase",
  "MongoDB Atlas",
  "Slack",
  "Netlify",
];

const VISHWAJEET_DEFAULT_FORM = {
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

/* ── Live Preview ───────────────────────────────────────────── */
function ResumePreview({
  form,
  template,
}: {
  form: Record<string, string>;
  template: (typeof TEMPLATES)[0];
}) {
  const isCreative = template.id === "creative";
  const isDreamSync = template.id === "dreamsync";

  const renderSectionHeader = (icon: any, label: string) => {
    const IconComponent = icon;
    return (
      <div className="flex items-center gap-1.5 mb-2 pb-1 border-b-2 border-slate-900 dark:border-slate-100">
        <IconComponent className="h-4 w-4 text-slate-900 dark:text-slate-100" />
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
          {label}
        </h3>
      </div>
    );
  };

  const sH = (label: string) => (
    <p
      className="text-[10px] font-extrabold uppercase tracking-widest mb-1.5 pb-1 border-b"
      style={{ color: template.accent }}
    >
      {label}
    </p>
  );

  return (
    <div
      id="resume-preview-document"
      className="w-full rounded-xl border overflow-hidden shadow-sm text-xs leading-relaxed bg-white text-slate-900 font-sans"
      style={{ minHeight: 600 }}
    >
      {/* Header */}
      {isDreamSync ? (
        <div className="px-8 py-6 text-center border-b space-y-2 bg-slate-50/50">
          <h1 className="text-2xl font-black tracking-wide text-slate-950 uppercase">
            {form.fullName || "VISHWAJEET"}
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
          </div>
        </div>
      ) : (
        <div
          className="px-6 py-5"
          style={{ background: template.previewBg, color: template.previewText }}
        >
          <p className="font-black text-lg">{form.fullName || "Your Name"}</p>
          {form.targetRole && <p className="opacity-90 text-sm mt-0.5">{form.targetRole}</p>}
          <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-75">
            {form.email && <span>{form.email}</span>}
            {form.phone && <span>{form.phone}</span>}
            {form.linkedin && (
              <span>
                {form.linkedin.startsWith("http") ? (
                  <a href={form.linkedin} target="_blank" rel="noreferrer" className="underline">
                    {form.linkedin}
                  </a>
                ) : (
                  form.linkedin
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Body Content */}
      <div className="px-8 py-6 space-y-5">
        {/* Objective / Summary */}
        {form.summary && (
          <div>
            {isDreamSync ? renderSectionHeader(FileText, "OBJECTIVE") : sH("Summary")}
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
            {isDreamSync ? renderSectionHeader(Star, "STRENGTHS") : sH("Strengths")}
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

        {/* Declaration */}
        {form.declaration && (
          <div className="pt-2">
            {isDreamSync ? renderSectionHeader(PenTool, "DECLARATION") : sH("Declaration")}
            <p className="text-[11px] text-slate-600 italic mb-4 leading-relaxed">
              {form.declaration}
            </p>
            <div className="pt-2 border-t border-slate-200 w-48">
              <p className="font-serif italic text-lg text-indigo-900 font-bold leading-none">
                {form.fullName || "Vishwajeet"}
              </p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                {form.fullName || "Vishwajeet"} ({form.location?.split(",")[0] || "Bangalore"})
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

/* ── Main ── */
export function ResumeBuilderPage({ embedded = false }: { embedded?: boolean }) {
  const generateFn = useServerFn(generateResume);
  const extractFn = useServerFn(extractResumeFields);

  const [view, setView] = useState<"edit" | "preview">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_view");
      if (saved === "edit" || saved === "preview") return saved;
    }
    return "preview";
  });
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("resume_builder_result");
    }
    return null;
  });
  const [selectedTpl, setSelectedTpl] = useState(TEMPLATES[0]);
  const [kwCategory, setKwCategory] = useState("general");

  const [form, setForm] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_form");
      if (saved) {
        try {
          return { ...VISHWAJEET_DEFAULT_FORM, ...JSON.parse(saved) };
        } catch {}
      }
    }
    return VISHWAJEET_DEFAULT_FORM;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("resume_builder_form", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (result) {
      localStorage.setItem("resume_builder_result", result);
    }
  }, [result]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("resume_builder_view", view);
  }, [view]);

  const update = (field: string, value: string) => setForm((f: any) => ({ ...f, [field]: value }));

  const handleFileExtracted = async (text: string) => {
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: text } });
      setForm((f: any) => ({
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
      toast.success("Fields auto-filled from resume!");
    } catch {
      toast.error("Failed to parse resume");
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!form.fullName.trim()) return toast.error("Enter your full name");
    if (!form.targetRole.trim()) return toast.error("Enter your target role");
    setLoading(true);
    try {
      const res = await generateFn({ data: { ...form, template: selectedTpl.id } });
      setResult(res.content);
      setView("preview");
      toast.success("Resume generated!");
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

    const docHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Resume</title><style>body { font-family: Arial, sans-serif; line-height: 1.5; color: #111; margin: 0.8in; } h1 { font-size: 22pt; font-weight: bold; text-align: center; margin-bottom: 4pt; } h3 { font-size: 13pt; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt; } p, div { font-size: 10pt; margin-bottom: 4pt; } a { color: #0284c7; text-decoration: underline; }</style></head><body>${bodyHtml}</body></html>`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob(["\ufeff" + docHtml], { type: "application/msword" })),
      download: `${(form.fullName || "Resume").replace(/\s+/g, "_")}_Resume.doc`,
    });
    a.click();
    toast.success("Word Document downloaded!");
  };

  const handleDownloadPdf = () => {
    const style = document.createElement("style");
    style.id = "print-override-style";
    style.textContent = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #resume-preview-container, #resume-preview-container * {
          visibility: visible !important;
        }
        #resume-preview-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          border: none !important;
          box-shadow: none !important;
          background: white !important;
          color: black !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.getElementById("print-override-style")?.remove();
    }, 500);
  };

  const addKw = (kw: string) => {
    update("skills", form.skills ? form.skills + ", " + kw : kw);
    toast.success(`Added "${kw}"`);
  };

  const resetToVishwajeetTemplate = () => {
    setForm(VISHWAJEET_DEFAULT_FORM);
    setResult(null);
    toast.success("Reset to Vishwajeet Platinum ATS Resume Template!");
  };

  const inp =
    "w-full text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const Wrapper = embedded ? "div" : AppShell;

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resume Builder</h2>
              <p className="text-xs text-muted-foreground">
                5 premium templates · Live preview · Vishwajeet Executive ATS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={resetToVishwajeetTemplate}
              className="px-3 py-1.5 rounded-xl border bg-muted/30 hover:bg-muted text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Reset to Vishwajeet Resume
            </button>
            <ResumeFileUpload onTextExtracted={handleFileExtracted} />
            {extracting && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Parsing...
              </span>
            )}
          </div>
        </div>

        {/* Template Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTpl(t)}
              className={cn(
                "relative rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-md active:scale-[0.98]",
                selectedTpl.id === t.id
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-border/60 hover:border-primary/40",
              )}
            >
              <div className="h-14 w-full relative" style={{ background: t.previewBg }}>
                <div className="absolute inset-0 p-2 flex flex-col justify-end">
                  <div
                    className="h-1.5 w-16 rounded-full mb-1 opacity-80"
                    style={{ background: t.previewText }}
                  />
                  <div
                    className="h-1 w-10 rounded-full opacity-40"
                    style={{ background: t.previewText }}
                  />
                </div>
                {selectedTpl.id === t.id && (
                  <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>
              <div className="p-2.5 bg-card">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[11px] font-bold truncate">{t.label}</p>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: t.accent + "18", color: t.accent }}
                  >
                    {t.badge}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                  {t.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* View toggle & Direct Downloads */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                  view === v
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/40 border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {v === "edit" ? <Edit3 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {v === "edit" ? "Edit Form" : "Live Preview"}
              </button>
            ))}
          </div>

          {(result || form.fullName.trim()) && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-bold">Download format:</span>
              <button
                onClick={handleDownloadWord}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Download className="h-3 w-3" /> Word (.doc)
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Download className="h-3 w-3" /> PDF
              </button>
            </div>
          )}
        </div>

        <div className="grid xl:grid-cols-[1fr_360px] gap-5">
          {/* Form / Preview */}
          <div>
            {view === "edit" ? (
              <Card className="p-5 rounded-2xl border shadow-sm space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Personal Info
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Full Name *</Label>
                    <input
                      id="rb-name"
                      name="rb-name"
                      className={inp}
                      placeholder="VISHWAJEET"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Target Role *</Label>
                    <input
                      id="rb-role"
                      name="rb-role"
                      className={inp}
                      placeholder="AI Software Engineer | Full Stack Developer"
                      value={form.targetRole}
                      onChange={(e) => update("targetRole", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Email</Label>
                    <input
                      id="rb-email"
                      name="rb-email"
                      className={inp}
                      placeholder="name@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Phone</Label>
                    <input
                      id="rb-phone"
                      name="rb-phone"
                      className={inp}
                      placeholder="+91 85952 02922"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Location</Label>
                    <input
                      id="rb-loc"
                      name="rb-loc"
                      className={inp}
                      placeholder="Bengaluru, India"
                      value={form.location || ""}
                      onChange={(e) => update("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">LinkedIn URL</Label>
                    <input
                      id="rb-linkedin"
                      name="rb-linkedin"
                      className={inp}
                      placeholder="https://linkedin.com/in/..."
                      value={form.linkedin}
                      onChange={(e) => update("linkedin", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">GitHub URL</Label>
                    <input
                      id="rb-github"
                      name="rb-github"
                      className={inp}
                      placeholder="https://github.com/..."
                      value={form.github || ""}
                      onChange={(e) => update("github", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Website / Portfolio</Label>
                    <input
                      id="rb-web"
                      name="rb-web"
                      className={inp}
                      placeholder="https://www.learnifyai.in"
                      value={form.website || ""}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Objective / Summary</Label>
                  <textarea
                    id="rb-summary"
                    name="rb-summary"
                    className={`${inp} min-h-[72px] resize-none`}
                    placeholder="AI-focused Full Stack Developer..."
                    value={form.summary}
                    onChange={(e) => update("summary", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">
                    Experience (use XYZ Formula)
                  </Label>
                  <textarea
                    id="rb-exp"
                    name="rb-exp"
                    className={`${inp} min-h-[140px] resize-none`}
                    placeholder={
                      "Reconciliation & Data Management, Rootbridge Academy Pvt Ltd | Dec 2024 – Present | Bengaluru\n• Entered, verified, and maintained over 200,000 records with exceptional accuracy."
                    }
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Education</Label>
                  <textarea
                    id="rb-edu"
                    name="rb-edu"
                    className={`${inp} min-h-[64px] resize-none`}
                    placeholder={"Bachelor of Computer Applications (BCA), St. Aloysius Degree College | Apr 2023 – Jul 2026"}
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">
                    Categorized Technical Skills
                  </Label>
                  <textarea
                    id="rb-skills"
                    name="rb-skills"
                    className={`${inp} min-h-[90px] resize-none`}
                    placeholder="Programming: HTML5 | CSS3 | JavaScript | Python | SQL\nFrontend: React.js | Next.js | Tailwind CSS"
                    value={form.skills}
                    onChange={(e) => update("skills", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Projects</Label>
                  <textarea
                    id="rb-projects"
                    name="rb-projects"
                    className={`${inp} min-h-[110px] resize-none`}
                    placeholder={
                      "Learnify AI | May 2026 – Present\nTech Stack: React 19, TypeScript, Supabase\n• Built a full-stack AI platform..."
                    }
                    value={form.projects}
                    onChange={(e) => update("projects", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Certifications</Label>
                  <textarea
                    id="rb-certs"
                    name="rb-certs"
                    className={`${inp} min-h-[72px] resize-none`}
                    placeholder="• Full Stack Development Internship Certificate\n• Excel certificate verifies - GreatLearning Academy"
                    value={form.certifications}
                    onChange={(e) => update("certifications", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Strengths</Label>
                  <textarea
                    id="rb-strengths"
                    name="rb-strengths"
                    className={`${inp} min-h-[56px] resize-none`}
                    placeholder="Analytical Thinking: Skilled in identifying trends..."
                    value={form.strengths || ""}
                    onChange={(e) => update("strengths", e.target.value)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Languages</Label>
                    <input
                      id="rb-lang"
                      name="rb-lang"
                      className={inp}
                      placeholder="Hindi (Native), English"
                      value={form.languages || ""}
                      onChange={(e) => update("languages", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Awards</Label>
                    <input
                      id="rb-awards"
                      name="rb-awards"
                      className={inp}
                      placeholder="Won 1st Prize in Web Design Competition..."
                      value={form.awards || ""}
                      onChange={(e) => update("awards", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Declaration</Label>
                  <textarea
                    id="rb-dec"
                    name="rb-dec"
                    className={`${inp} min-h-[48px] resize-none`}
                    placeholder="I hereby declare that the information provided is true..."
                    value={form.declaration || ""}
                    onChange={(e) => update("declaration", e.target.value)}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}{" "}
                  AI Optimize & Format Resume
                </button>
              </Card>
            ) : (
              <div className="space-y-3">
                {result ? (
                  <Card
                    id="resume-preview-container"
                    className="p-6 rounded-2xl border shadow-sm overflow-auto max-h-[80vh]"
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                    </div>
                  </Card>
                ) : (
                  <div id="resume-preview-container">
                    <ResumePreview form={form} template={selectedTpl} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-4 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold">XYZ Formula Tips</h3>
              </div>
              <div className="space-y-2">
                {XYZ_TIPS.map((tip, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs leading-relaxed"
                  >
                    <span className="font-bold text-amber-700 dark:text-amber-400">#{i + 1}</span>{" "}
                    <span className="text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold">Keyword Suggestions</h3>
              </div>
              <div className="flex gap-1 mb-3">
                {Object.keys(KEYWORD_BANK).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKwCategory(k)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition border",
                      kwCategory === k
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {KEYWORD_BANK[kwCategory].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => addKw(kw)}
                    className="px-2 py-1 rounded-full border border-border/60 bg-muted/30 text-xs font-medium hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition flex items-center gap-1"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    {kw}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-4 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold">Top Skills & Tools</h3>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {TOP_SKILLS.map((s) => (
                  <button
                    key={s}
                    onClick={() => addKw(s)}
                    className="px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
                  >
                    <Plus className="h-2 w-2" />
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TOP_TOOLS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      update(
                        "certifications",
                        form.certifications ? form.certifications + ", " + s : s,
                      );
                      toast.success(`Added ${s}`);
                    }}
                    className="px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 text-[10px] font-semibold hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <Plus className="h-2 w-2" />
                    {s}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-4 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-bold">Recommended Courses</h3>
              </div>
              <div className="space-y-2">
                {LEARNIFY_COURSES.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl border bg-muted/20 hover:border-primary/40 transition"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.category}</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 shrink-0">
                      {c.match}%
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/courses"
                className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-dashed text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/40 transition"
              >
                View All Learnify Courses <ChevronRight className="h-3 w-3" />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
