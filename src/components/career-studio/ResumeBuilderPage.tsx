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

/* ── Live Preview ───────────────────────────────────────────── */
function ResumePreview({
  form,
  template,
}: {
  form: Record<string, string>;
  template: (typeof TEMPLATES)[0];
}) {
  const isCreative = template.id === "creative";
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
      className="w-full rounded-xl border overflow-hidden shadow-sm text-[11px] leading-relaxed bg-card"
      style={{ minHeight: 360 }}
    >
      <div
        className="px-6 py-5"
        style={{ background: template.previewBg, color: template.previewText }}
      >
        <p className="font-black text-lg">{form.fullName || "Your Name"}</p>
        {form.targetRole && <p className="opacity-90 text-sm mt-0.5">{form.targetRole}</p>}
        <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-75">
          {form.email && <span>{form.email}</span>}
          {form.phone && <span>{form.phone}</span>}
          {form.linkedin && <span>{form.linkedin}</span>}
        </div>
      </div>
      <div className="px-6 py-4 space-y-3">
        {form.summary && (
          <div>
            {sH("Summary")}
            <p className="text-xs text-muted-foreground leading-relaxed">{form.summary}</p>
          </div>
        )}
        {form.experience && (
          <div>
            {sH("Experience")}
            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
              {form.experience}
            </p>
          </div>
        )}
        {form.education && (
          <div>
            {sH("Education")}
            <p className="text-xs text-muted-foreground whitespace-pre-line">{form.education}</p>
          </div>
        )}
        {form.skills && (
          <div>
            {sH("Skills")}
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
              <p className="text-xs text-muted-foreground">{form.skills}</p>
            )}
          </div>
        )}
        {form.projects && (
          <div>
            {sH("Projects")}
            <p className="text-xs text-muted-foreground whitespace-pre-line">{form.projects}</p>
          </div>
        )}
        {form.certifications && (
          <div>
            {sH("Certifications")}
            <p className="text-xs text-muted-foreground">{form.certifications}</p>
          </div>
        )}
      </div>
    </div>
  );
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
    return "edit";
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
    const defaultForm = {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
      experience: "",
      education: "",
      skills: "",
      certifications: "",
      projects: "",
      targetRole: "",
    };
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_builder_form");
      if (saved) {
        try {
          return { ...defaultForm, ...JSON.parse(saved) };
        } catch {}
      }
    }
    return defaultForm;
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
      toast.success("Fields auto-filled!");
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
    let bodyHtml = "";
    if (result) {
      bodyHtml = markdownToHtml(result);
    } else {
      bodyHtml = `
        <div class="header">
          <div class="name">${form.fullName || "Your Name"}</div>
          <div class="title">${form.targetRole || ""}</div>
          <p>${form.email} | ${form.phone} | ${form.linkedin}</p>
        </div>
        <div>
          <h2>Professional Summary</h2>
          <p>${form.summary}</p>
          <h2>Experience</h2>
          <p style="white-space: pre-wrap;">${form.experience}</p>
          <h2>Education</h2>
          <p style="white-space: pre-wrap;">${form.education}</p>
          <h2>Skills</h2>
          <p>${form.skills}</p>
          <h2>Projects</h2>
          <p style="white-space: pre-wrap;">${form.projects}</p>
          <h2>Certifications</h2>
          <p>${form.certifications}</p>
        </div>
      `;
    }

    const docHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Resume</title><style>body { font-family: Calibri, Arial, sans-serif; line-height: 1.4; color: #333; margin: 1in; } h2 { font-family: Garamond, Georgia, serif; color: ${selectedTpl.accent}; border-bottom: 2px solid ${selectedTpl.accent}; padding-bottom: 4px; font-size: 16pt; margin-top: 18pt; } p { font-size: 11pt; margin-bottom: 6pt; } ul { margin-top: 0; } li { font-size: 11pt; margin-bottom: 4pt; } .header { text-align: center; margin-bottom: 20pt; } .name { font-size: 24pt; font-weight: bold; color: ${selectedTpl.accent}; } .title { font-size: 14pt; font-style: italic; color: #555; }</style></head><body>${bodyHtml}</body></html>`;
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
                4 premium templates · Live preview · ATS-optimized
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  <p className="text-[11px] font-bold">{t.label}</p>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: t.accent + "18", color: t.accent }}
                  >
                    {t.badge}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{t.desc}</p>
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
                      placeholder="Vishwajeet Kumar"
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
                      placeholder="Full Stack Engineer"
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
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs font-semibold mb-1 block">
                      LinkedIn / Portfolio URL
                    </Label>
                    <input
                      id="rb-linkedin"
                      name="rb-linkedin"
                      className={inp}
                      placeholder="linkedin.com/in/yourname"
                      value={form.linkedin}
                      onChange={(e) => update("linkedin", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Professional Summary</Label>
                  <textarea
                    id="rb-summary"
                    name="rb-summary"
                    className={`${inp} min-h-[72px] resize-none`}
                    placeholder="Result-driven engineer with 3+ years..."
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
                    className={`${inp} min-h-[110px] resize-none`}
                    placeholder={
                      "Software Engineer @ Rootbridge (Jan 2024)\n• Managed 200K+ records with 99%+ accuracy"
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
                    className={`${inp} min-h-[56px] resize-none`}
                    placeholder={"B.Tech Computer Science — ABC University (2020-2024)"}
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">
                    Skills (comma separated)
                  </Label>
                  <textarea
                    id="rb-skills"
                    name="rb-skills"
                    className={`${inp} min-h-[56px] resize-none`}
                    placeholder="React, TypeScript, Python, Node.js, PostgreSQL"
                    value={form.skills}
                    onChange={(e) => update("skills", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Projects</Label>
                  <textarea
                    id="rb-projects"
                    name="rb-projects"
                    className={`${inp} min-h-[72px] resize-none`}
                    placeholder={
                      "Learnify AI - AI-powered learning platform\n• React, Supabase, 500+ active users"
                    }
                    value={form.projects}
                    onChange={(e) => update("projects", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Certifications</Label>
                  <input
                    id="rb-certs"
                    name="rb-certs"
                    className={inp}
                    placeholder="AWS Solutions Architect, Google Cloud..."
                    value={form.certifications}
                    onChange={(e) => update("certifications", e.target.value)}
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
                  Generate Resume
                </button>
              </Card>
            ) : (
              <div className="space-y-3">
                {result ? (
                  <Card
                    id="resume-preview-container"
                    className="p-6 rounded-2xl border shadow-sm overflow-auto max-h-[70vh]"
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
