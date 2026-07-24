import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  FolderOpen,
  Loader2,
  Sparkles,
  Download,
  Check,
  ChevronRight,
  Upload,
  ImagePlus,
  Github,
  ExternalLink,
  Heart,
  Settings,
  Code2,
  Camera,
  Send,
  Trash2,
  Plus,
  X,
  Eye,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generatePortfolio, extractResumeFields } from "@/lib/resume.functions";
import { ResumeFileUpload } from "@/components/ResumeFileUpload";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "minimal", label: "Minimal" },
  { value: "creative", label: "Creative" },
];

type ProjectEntry = {
  name: string;
  description: string;
  techStack: string;
  githubUrl: string;
  imageUrl?: string;
};

type BrandInfo = { color: string; label: string };

const SKILL_BRANDS: Record<string, BrandInfo> = {
  python: { color: "#3776AB", label: "Py" },
  sql: { color: "#336791", label: "SQL" },
  "ms excel": { color: "#217346", label: "EX" },
  excel: { color: "#217346", label: "EX" },
  "ms word": { color: "#2B579A", label: "WD" },
  word: { color: "#2B579A", label: "WD" },
  "ms powerpoint": { color: "#D24726", label: "PP" },
  powerpoint: { color: "#D24726", label: "PP" },
  "power bi": { color: "#F2C811", label: "PB" },
  salesforce: { color: "#00A1E0", label: "SF" },
  "razor pay": { color: "#7B3FE4", label: "Rz" },
  "data loader": { color: "#FF6B35", label: "DL" },
  "data visualization": { color: "#0EA5E9", label: "DV" },
  "ai research": { color: "#8B5CF6", label: "AI" },
  chatgpt: { color: "#10A37F", label: "CG" },
  gemini: { color: "#8E44AD", label: "Ge" },
  perplexity: { color: "#FF6D01", label: "Px" },
  notebooklm: { color: "#D97706", label: "NL" },
  html: { color: "#E34F26", label: "H" },
  css: { color: "#1572B6", label: "CSS" },
  javascript: { color: "#F7DF1E", label: "JS" },
  js: { color: "#F7DF1E", label: "JS" },
  wordpress: { color: "#464342", label: "WP" },
  wix: { color: "#0C6EFC", label: "Wx" },
  github: { color: "#181717", label: "GH" },
  "vs code": { color: "#007ACC", label: "VS" },
  vscode: { color: "#007ACC", label: "VS" },
  canva: { color: "#00C4CC", label: "Ca" },
  capcut: { color: "#FF2D55", label: "CC" },
  "email handling": { color: "#6B7280", label: "@" },
  email: { color: "#6B7280", label: "@" },
  react: { color: "#61DAFB", label: "Rx" },
  node: { color: "#339933", label: "N" },
  nodejs: { color: "#339933", label: "N" },
  typescript: { color: "#3178C6", label: "TS" },
  mongodb: { color: "#47A248", label: "MD" },
  docker: { color: "#2496ED", label: "D" },
  git: { color: "#F05032", label: "G" },
  figma: { color: "#F24E1E", label: "Fi" },
  tailwind: { color: "#06B6D4", label: "TW" },
  nextjs: { color: "#000000", label: "N" },
  aws: { color: "#FF9900", label: "AWS" },
};

function findBrand(name: string): BrandInfo | null {
  const n = name.toLowerCase().trim();
  if (SKILL_BRANDS[n]) return SKILL_BRANDS[n];
  for (const [key, brand] of Object.entries(SKILL_BRANDS))
    if (n.includes(key) || key.includes(n)) return brand;
  return null;
}

function SkillLogo({ name, size = 14 }: { name: string; size?: number }) {
  const brand = findBrand(name);
  const c = brand?.color || "#6366f1";
  const label = brand?.label || name.trim()[0].toUpperCase();
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="shrink-0">
      <rect width={20} height={20} rx={4} fill={c} />
      <text
        x={10}
        y={10}
        textAnchor="middle"
        dominantBaseline="central"
        fill={c === "#F7DF1E" || c === "#F2C811" ? "#1e293b" : "#fff"}
        fontSize={9}
        fontWeight={800}
        fontFamily="system-ui"
      >
        {label}
      </text>
    </svg>
  );
}

function skillHtmlLogo(name: string): string {
  const brand = findBrand(name);
  const c = brand?.color || "#6366f1";
  const label = brand?.label || name.trim()[0].toUpperCase();
  const textColor = c === "#F7DF1E" || c === "#F2C811" ? "#1e293b" : "#fff";
  return `<svg width="14" height="14" viewBox="0 0 20 20" fill="none" style="display:inline-block;vertical-align:middle;margin-right:4px;flex-shrink:0"><rect width="20" height="20" rx="4" fill="${c}"/><text x="10" y="10" text-anchor="middle" dominant-baseline="central" fill="${textColor}" font-size="9" font-weight="800" font-family="system-ui,sans-serif">${label}</text></svg>`;
}

export function PortfolioBuilderPage({ embedded = false }: { embedded?: boolean }) {
  const generateFn = useServerFn(generatePortfolio);
  const extractFn = useServerFn(extractResumeFields);
  const [tab, setTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    tagline: "",
    bio: "",
    skills: "",
    softSkills: "",
    tools: "",
    projects: "",
    socialLinks: "",
    experience: "",
    education: "",
    style: "developer",
  });

  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [published, setPublished] = useState(false);
  const [exportFormat, setExportFormat] = useState<"md" | "html">("md");

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleFileExtracted = async (text: string) => {
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: text } });

      const normalizeLinkedin = (val: string) => {
        if (!val) return "";
        const cleaned = val
          .replace(/^https?:\/\//, "")
          .replace(/^linkedin\.com\/in\//, "")
          .replace(/\/$/, "");
        return cleaned ? `https://linkedin.com/in/${cleaned}` : "";
      };

      setForm((f) => ({
        ...f,
        fullName: fields.fullName || f.fullName,
        bio: fields.summary || f.bio,
        tagline: fields.targetRole || f.tagline,
        socialLinks: fields.linkedin
          ? [
              ...new Set([
                normalizeLinkedin(fields.linkedin),
                ...f.socialLinks.split("\n").filter(Boolean),
              ]),
            ]
              .filter(Boolean)
              .join("\n")
          : f.socialLinks,
        skills: fields.skills || f.skills,
        experience: fields.experience || f.experience,
        education: fields.education || f.education,
        projects: fields.projects || f.projects,
      }));

      if (fields.projects) {
        const projectLines = fields.projects.split("\n").filter(Boolean);
        const parsedProjects: ProjectEntry[] = projectLines
          .map((line: string) => {
            const content = (line.match(/^\s*[-*]\s*(.+)/)?.[1] || line).trim();
            const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
            const name =
              content
                .replace(/(https?:\/\/[^\s]+)/, "")
                .replace(/[:\-–]\s*$/, "")
                .trim()
                .split(/[:\-–]/)[0]
                ?.trim() || content.trim();
            return { name, description: "", techStack: "", githubUrl: urlMatch ? urlMatch[1] : "" };
          })
          .filter((p: ProjectEntry) => p.name.length > 1);
        setProjects(parsedProjects);
      }

      toast.success("Profile auto-filled from uploaded resume!");
    } catch (err: any) {
      toast.error(err.message || "Failed to parse resume");
    } finally {
      setExtracting(false);
    }
  };

  const addProject = () => {
    setProjects((p) => [
      ...p,
      { name: "", description: "", techStack: "", githubUrl: "", imageUrl: "" },
    ]);
  };

  const updateProject = (idx: number, field: keyof ProjectEntry, value: string) => {
    setProjects((p) => p.map((proj, i) => (i === idx ? { ...proj, [field]: value } : proj)));
  };

  const removeProject = (idx: number) => {
    setProjects((p) => p.filter((_, i) => i !== idx));
  };

  const handleProjectImage = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateProject(idx, "imageUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large. Max 5MB.");
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    toast.success("Photo uploaded!");
  };

  const projectsText = projects
    .filter((p) => p.name)
    .map(
      (p) =>
        `${p.name}${p.githubUrl ? ` (${p.githubUrl})` : ""}: ${p.description} [${p.techStack}]`,
    )
    .join("\n");

  const fullProjectsValue = [form.projects, projectsText].filter(Boolean).join("\n");

  const handleGenerate = async () => {
    if (!form.fullName.trim()) return toast.error("Enter your full name");
    if (!form.skills.trim()) return toast.error("Enter your skills");

    const portfolioForm = { ...form, projects: fullProjectsValue };
    setLoading(true);
    try {
      const res = await generateFn({ data: portfolioForm });
      setResult(res.content);
      setTab("preview");
      toast.success("Portfolio plan generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.fullName.replace(/\s+/g, "_")}_Portfolio.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio plan downloaded!");
  };

  const handleExportHtml = () => {
    const skills = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const projectCards = projects
      .filter((p) => p.name)
      .map((p) => {
        const img = p.imageUrl
          ? '<img src="' + p.imageUrl + '" alt="' + p.name + '" class="project-img" />'
          : "";
        const tags = p.techStack
          ? '<div class="tags">' +
            p.techStack
              .split(",")
              .map((t) => '<span class="tag">' + t.trim() + "</span>")
              .join("") +
            "</div>"
          : "";
        const gh = p.githubUrl
          ? '<a href="' + p.githubUrl + '" target="_blank" class="btn">View on GitHub</a>'
          : "";
        return (
          '<div class="project-card">' +
          img +
          "<h3>" +
          p.name +
          "</h3><p>" +
          (p.description || "") +
          "</p>" +
          tags +
          gh +
          "</div>"
        );
      })
      .join("\n");
    const socialHtml = form.socialLinks
      ? '<div class="social">' +
        form.socialLinks
          .split("\n")
          .filter(Boolean)
          .map((l) => l.trim())
          .map(
            (l) =>
              '<a href="' +
              l +
              '" target="_blank">' +
              l.replace(/https?:\/\//, "").split("/")[0] +
              "</a>",
          )
          .join("") +
        "</div>"
      : "";
    const avatarHtml = photoPreview
      ? '<img src="' + photoPreview + '" alt="' + form.fullName + '" class="avatar" />'
      : '<div class="avatar" style="background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#94a3b8;">' +
        (form.fullName?.charAt(0) || "?") +
        "</div>";
    const expHtml = form.experience
      ? '<section class="section"><h2>Experience</h2><p>' +
        form.experience.replace(/\n/g, "<br>") +
        "</p></section>"
      : "";
    const eduHtml = form.education
      ? '<section class="section"><h2>Education</h2><p>' + form.education + "</p></section>"
      : "";
    const skillsHtml =
      skills.length > 0
        ? '<section class="section"><h2>Skills</h2><div class="skills">' +
          skills
            .map(
              (s) =>
                '<span class="skill" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#f1f5f9;border-radius:9999px;font-size:.875rem;font-weight:500">' +
                skillHtmlLogo(s) +
                "<span>" +
                s +
                "</span></span>",
            )
            .join("") +
          "</div></section>"
        : "";
    const projHtml = projectCards
      ? '<section class="section"><h2>Projects</h2>' + projectCards + "</section>"
      : "";

    const html =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' +
      form.fullName +
      ' | Portfolio</title>\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#f8fafc;color:#0f172a;line-height:1.6}\n.container{max-width:1000px;margin:0 auto;padding:2rem}\nheader{text-align:center;padding:3rem 0}\n.avatar{width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:1rem;border:4px solid #e2e8f0}\nh1{font-size:2.5rem;font-weight:700}\n.tagline{color:#64748b;font-size:1.1rem;margin-top:.25rem}\n.bio{color:#475569;max-width:600px;margin:1rem auto}\n.section{margin:3rem 0}\n.section h2{font-size:1.5rem;font-weight:600;margin-bottom:1.5rem;border-bottom:2px solid #e2e8f0;padding-bottom:.5rem}\n.skills{display:flex;flex-wrap:wrap;gap:.75rem}\n.skill{background:#f1f5f9;padding:.5rem 1rem;border-radius:9999px;font-size:.875rem;font-weight:500}\n.project-card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.5rem;margin-bottom:1.5rem}\n.project-img{width:100%;height:200px;object-fit:cover;border-radius:.75rem;margin-bottom:1rem}\n.project-card h3{font-size:1.25rem;font-weight:600}\n.tags{display:flex;flex-wrap:wrap;gap:.5rem;margin:.75rem 0}\n.tag{background:#e0f2fe;color:#0369a1;padding:.25rem .75rem;border-radius:9999px;font-size:.75rem;font-weight:500}\n.btn{display:inline-block;background:#0f172a;color:#fff;padding:.5rem 1.5rem;border-radius:.5rem;text-decoration:none;font-size:.875rem;font-weight:500;margin-top:.5rem}\n.social{display:flex;justify-content:center;gap:1rem;margin-top:1rem}\n.social a{color:#64748b;text-decoration:none;font-size:.875rem}\n.social a:hover{color:#0f172a}\nfooter{text-align:center;padding:2rem 0;color:#94a3b8;font-size:.875rem}\n</style>\n</head>\n<body>\n<div class="container">\n<header>\n' +
      avatarHtml +
      "\n<h1>" +
      (form.fullName || "Your Name") +
      "</h1>\n" +
      (form.tagline ? '<p class="tagline">' + form.tagline + "</p>" : "") +
      "\n" +
      (form.bio ? '<p class="bio">' + form.bio + "</p>" : "") +
      "\n" +
      socialHtml +
      "\n</header>\n" +
      skillsHtml +
      "\n" +
      projHtml +
      "\n" +
      expHtml +
      "\n" +
      eduHtml +
      "\n<footer>Built with Learnify AI Portfolio Builder &copy; " +
      new Date().getFullYear() +
      "</footer>\n</div>\n</body>\n</html>";

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = form.fullName.replace(/\s+/g, "_") + "_Portfolio.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio HTML exported!");
  };

  const handleExportZip = async () => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const skills = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const projectCards = projects
        .filter((p) => p.name)
        .map(
          (p) => `
        <div class="project-card border border-slate-800 bg-slate-900/80 p-6 rounded-2xl shadow-lg hover:border-indigo-500/50 transition duration-300">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="w-full h-48 object-cover rounded-xl mb-4" />` : ""}
          <h3 class="text-xl font-bold text-slate-100 mb-2">${p.name}</h3>
          <p class="text-sm text-slate-400 mb-4 leading-relaxed">${p.description || ""}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${
              p.techStack
                ? p.techStack
                    .split(",")
                    .map(
                      (t) =>
                        `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${t.trim()}</span>`,
                    )
                    .join("")
                : ""
            }
          </div>
          ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline">View Source Code &rarr;</a>` : ""}
        </div>
      `,
        )
        .join("\n");

      const skillsHtml = skills
        .map(
          (s) => `
        <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 hover:border-indigo-500/50 transition">
          <span>${s}</span>
        </div>
      `,
        )
        .join("\n");

      const indexHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${form.fullName || "Portfolio"} | Developer Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="./css/style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
  <div class="max-w-5xl mx-auto px-6 py-12">
    <!-- HERO HEADER -->
    <header class="text-center py-16 space-y-4">
      ${photoPreview ? `<img src="./assets/avatar.png" alt="${form.fullName}" class="w-28 h-28 rounded-full mx-auto object-cover border-4 border-indigo-500/30 shadow-xl" />` : `<div class="w-28 h-28 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center text-4xl font-extrabold text-indigo-400 mx-auto">${form.fullName?.charAt(0) || "P"}</div>`}
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">${form.fullName || "Your Name"}</h1>
      <p class="text-lg text-indigo-300 font-semibold max-w-xl mx-auto">${form.tagline || "Software Engineer & Builder"}</p>
      <p class="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">${form.bio || ""}</p>
    </header>

    <!-- SKILLS SECTION -->
    ${
      skills.length > 0
        ? `
    <section className="py-10">
      <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2"><span className="text-indigo-500">#</span> Technical Skills</h2>
      <div className="flex flex-wrap gap-3">${skillsHtml}</div>
    </section>`
        : ""
    }

    <!-- PROJECTS SECTION -->
    ${
      projectCards
        ? `
    <section className="py-10">
      <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2"><span className="text-indigo-500">#</span> Featured Projects</h2>
      <div className="grid sm:grid-cols-2 gap-6">${projectCards}</div>
    </section>`
        : ""
    }

    <!-- EXPERIENCE SECTION -->
    ${
      form.experience
        ? `
    <section className="py-10">
      <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2"><span className="text-indigo-500">#</span> Experience</h2>
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">${form.experience}</div>
    </section>`
        : ""
    }

    <!-- FOOTER -->
    <footer class="text-center py-12 border-t border-slate-900 text-xs text-slate-500">
      &copy; ${new Date().getFullYear()} ${form.fullName}. Built with Learnify AI Portfolio Builder.
    </footer>
  </div>
  <script src="./js/script.js"></script>
</body>
</html>`;

      const styleCss = `/* Custom Portfolio CSS */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
body { font-family: 'Space Grotesk', sans-serif; }
.project-card:hover { transform: translateY(-4px); }
`;

      const scriptJs = `// Interactive Scroll Reveal & Animations
console.log("Loaded ${form.fullName} Portfolio!");
`;

      const readmeMd = `# ${form.fullName} — Portfolio Website

This portfolio website was generated with Learnify AI Portfolio Builder.

## Folder Structure
- \`index.html\` - Primary portfolio webpage
- \`css/style.css\` - Custom styling
- \`js/script.js\` - Interactivity script
- \`assets/\` - Portfolio assets

## How to Deploy
1. **GitHub Pages**: Upload all files to a repository named \`username.github.io\`.
2. **Vercel / Netlify**: Drag & drop this folder directly to Vercel dashboard.
`;

      zip.file("index.html", indexHtml);
      zip.folder("css")?.file("style.css", styleCss);
      zip.folder("js")?.file("script.js", scriptJs);
      zip.file("README.md", readmeMd);

      if (photoPreview) {
        const base64Data = photoPreview.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        zip.folder("assets")?.file("avatar.png", base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.fullName.replace(/\s+/g, "_")}_Portfolio_Website.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Full Website ZIP with Folders downloaded!");
    } catch (err: any) {
      console.error("ZIP creation failed:", err);
      toast.error(err.message || "Failed to generate ZIP");
    }
  };

  const handlePublish = () => {
    if (!form.fullName.trim()) {
      toast.error("Enter your name first");
      return;
    }
    try {
      const portfolio = { ...form, projects, photoPreview, publishedAt: new Date().toISOString() };
      const username = form.fullName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      localStorage.setItem(`learnify_portfolio_${username}`, JSON.stringify(portfolio));
      setPublished(true);
      toast.success(`Published at learnify.ai/${username}`);
    } catch {
      toast.error("Publish failed");
    }
  };

  const mainContent = (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between gap-4 flex-wrap mb-6"
      >
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" /> Career Tools
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
            Portfolio Builder
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create a stunning portfolio with projects, skills, and export to HTML.
          </p>
        </div>
        {published && (
          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200 gap-1 px-3 py-1.5 text-xs">
            <Check className="h-3 w-3" /> Published
          </Badge>
        )}
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="mt-2">
        <TabsList>
          <TabsTrigger value="form" className="text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Build
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!result} className="text-xs sm:text-sm">
            <FolderOpen className="h-3.5 w-3.5 mr-1.5" /> Plan
          </TabsTrigger>
          <TabsTrigger value="live" disabled={!form.fullName} className="text-xs sm:text-sm">
            <Eye className="h-3.5 w-3.5 mr-1.5" /> Live Preview
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="form" className="pt-4 space-y-6 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="h-4 w-4 text-primary" />
                  Upload resume to auto-fill
                  {extracting && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                </div>
                <ResumeFileUpload onTextExtracted={handleFileExtracted} />
                {extracting && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Extracting info...
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card>
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <Label className="flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5" /> Profile Photo
                    </Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 rounded-full border-2 border-border ring-2 ring-primary/10">
                        {photoPreview ? (
                          <AvatarImage src={photoPreview} alt="Profile" />
                        ) : (
                          <AvatarFallback className="text-lg bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                            {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => photoInputRef.current?.click()}
                        >
                          <ImagePlus className="h-4 w-4 mr-1.5" />
                          {photoPreview ? "Change" : "Upload Photo"}
                        </Button>
                        <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="Jane Doe"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      placeholder="Full-Stack Developer | UI/UX Enthusiast"
                      value={form.tagline}
                      onChange={(e) => update("tagline", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio / About Me</Label>
                  <Textarea
                    rows={3}
                    placeholder="Tell visitors about yourself, your passion, and what you do"
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Code2 className="h-3 w-3 text-blue-500" /> Tech Skills
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="React, Node.js, Python..."
                      value={form.skills}
                      onChange={(e) => update("skills", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Heart className="h-3 w-3 text-rose-500" /> Soft Skills
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="Leadership, Communication..."
                      value={form.softSkills}
                      onChange={(e) => update("softSkills", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Settings className="h-3 w-3 text-amber-500" /> Tools
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="Figma, VS Code, Git..."
                      value={form.tools}
                      onChange={(e) => update("tools", e.target.value)}
                    />
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5">
                      <FolderOpen className="h-3.5 w-3.5 text-primary" /> Projects
                    </Label>
                    <Button variant="outline" size="sm" onClick={addProject}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  <AnimatePresence>
                    {projects.map((proj, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-3 sm:p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">
                                Project {idx + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-destructive"
                                onClick={() => removeProject(idx)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            </div>
                            {proj.imageUrl && (
                              <div className="relative rounded-lg overflow-hidden h-24 bg-muted">
                                <img
                                  src={proj.imageUrl}
                                  alt={proj.name}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 bg-background/80"
                                  onClick={() => updateProject(idx, "imageUrl", "")}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Input
                                placeholder="Project name"
                                value={proj.name}
                                onChange={(e) => updateProject(idx, "name", e.target.value)}
                              />
                              <Input
                                placeholder="GitHub URL"
                                value={proj.githubUrl}
                                onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Tech stack (e.g. React, Node)"
                                value={proj.techStack}
                                onChange={(e) => updateProject(idx, "techStack", e.target.value)}
                                className="flex-1"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                id={`proj-img-${idx}`}
                                className="hidden"
                                onChange={(e) => handleProjectImage(idx, e)}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 shrink-0"
                                onClick={() => document.getElementById(`proj-img-${idx}`)?.click()}
                              >
                                <ImagePlus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <Textarea
                              rows={1}
                              placeholder="Brief description"
                              value={proj.description}
                              onChange={(e) => updateProject(idx, "description", e.target.value)}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Textarea
                    rows={2}
                    placeholder="Or paste projects as free text..."
                    value={form.projects}
                    onChange={(e) => update("projects", e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Social Links</Label>
                    <Textarea
                      rows={2}
                      placeholder="GitHub, LinkedIn, Twitter URLs..."
                      value={form.socialLinks}
                      onChange={(e) => update("socialLinks", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Experience</Label>
                    <Textarea
                      rows={2}
                      placeholder="Company, role, duration, achievements"
                      value={form.experience}
                      onChange={(e) => update("experience", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Input
                      placeholder="Degree, University, Year"
                      value={form.education}
                      onChange={(e) => update("education", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <Label className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      Select Design Template or Create Your Own
                    </span>
                    <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                      5 Design Modes
                    </span>
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      {
                        value: "developer",
                        label: "Cyberpunk Tech",
                        desc: "Dark mode + glassmorphism glow",
                      },
                      {
                        value: "minimal",
                        label: "Executive Minimal",
                        desc: "Clean serif/sans typography",
                      },
                      {
                        value: "creative",
                        label: "3D Creative",
                        desc: "Motion cards & skill badges",
                      },
                      {
                        value: "designer",
                        label: "Designer Gallery",
                        desc: "Portfolio grid & media focus",
                      },
                    ].map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => update("style", t.value)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden",
                          form.style === t.value
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                            : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
                        )}
                      >
                        <div className="font-bold text-xs text-foreground">{t.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {t.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Create Your Own Theme Accent Picker */}
                  <div className="p-3 bg-muted/30 border border-border/70 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> Create Your Own Custom
                        Color Theme
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        CSS Colors
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"].map(
                        (hex) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => toast.success(`Custom theme accent set to ${hex}`)}
                            className="w-6 h-6 rounded-full border border-white/20 shadow-sm transition hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: hex }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={handleGenerate} disabled={loading} className="flex-1">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Generating..." : "Generate Portfolio"}
                </Button>
                <Button size="lg" variant="outline" onClick={handlePublish} className="gap-2">
                  <Send className="h-4 w-4" /> Publish
                </Button>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>

        <TabsContent value="preview" className="pt-4">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex gap-1 bg-muted rounded-lg p-0.5">
                  <Button
                    size="sm"
                    variant={exportFormat === "md" ? "default" : "ghost"}
                    onClick={() => setExportFormat("md")}
                    className="text-xs h-7"
                  >
                    Markdown
                  </Button>
                  <Button
                    size="sm"
                    variant={exportFormat === "html" ? "default" : "ghost"}
                    onClick={() => setExportFormat("html")}
                    className="text-xs h-7"
                  >
                    HTML
                  </Button>
                </div>
                <Button
                  onClick={exportFormat === "html" ? handleExportHtml : handleDownload}
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1.5" /> Export{" "}
                  {exportFormat === "html" ? "HTML+CSS" : "MD"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    toast.success("Copied!");
                  }}
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-1.5" /> Copy
                </Button>
                <Button variant="ghost" onClick={() => setTab("form")} size="sm">
                  <ChevronRight className="h-4 w-4 mr-1.5" /> Edit
                </Button>
              </div>
              <div className="border rounded-xl p-6 bg-card prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="live" className="pt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto border rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="h-10 bg-muted border-b flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground ml-2 font-mono">
                portfolio-preview
              </span>
            </div>
            <div className="bg-gradient-to-br from-background to-muted/30 p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <Avatar className="h-24 w-24 rounded-full ring-4 ring-primary/20">
                    {photoPreview ? (
                      <AvatarImage src={photoPreview} alt={form.fullName} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                        {form.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </motion.div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{form.fullName || "Your Name"}</h2>
                  <p className="text-muted-foreground">{form.tagline || "Your Tagline"}</p>
                  {form.bio && (
                    <p className="text-sm text-muted-foreground/80 mt-2 max-w-lg">{form.bio}</p>
                  )}
                  {form.socialLinks && (
                    <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start flex-wrap">
                      {form.socialLinks
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((link, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {link.replace(/https?:\/\//, "").split("/")[0]}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {form.skills && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-blue-500" /> Tech Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.split(",").map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge variant="secondary" className="text-xs px-3 py-1.5 gap-1.5 pl-1.5">
                          <SkillLogo name={s.trim()} size={14} />
                          {s.trim()}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {form.softSkills && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-rose-500" /> Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.softSkills.split(",").map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="outline"
                          className="text-xs border-rose-200 text-rose-600 bg-rose-50/50"
                        >
                          {s.trim()}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {form.tools && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 text-amber-500" /> Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.tools.split(",").map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="secondary"
                          className="text-xs bg-amber-50/50 text-amber-700 border-amber-200"
                        >
                          {s.trim()}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {projects.filter((p) => p.name).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Projects
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {projects
                      .filter((p) => p.name)
                      .map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-all group">
                            {p.imageUrl && (
                              <div className="h-40 overflow-hidden">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold">{p.name}</h4>
                                  {p.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {p.description}
                                    </p>
                                  )}
                                  {p.techStack && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {p.techStack.split(",").map((t) => (
                                        <Badge
                                          key={t.trim()}
                                          variant="outline"
                                          className="text-[10px]"
                                        >
                                          {t.trim()}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {p.githubUrl && (
                                  <a
                                    href={p.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0"
                                  >
                                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
                                  </a>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}

              {form.experience && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Experience
                  </h3>
                  <div className="p-4 rounded-xl border bg-card">
                    <p className="text-sm whitespace-pre-wrap">{form.experience}</p>
                  </div>
                </motion.div>
              )}

              {form.education && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Education
                  </h3>
                  <div className="p-4 rounded-xl border bg-card">
                    <p className="text-sm">{form.education}</p>
                  </div>
                </motion.div>
              )}

              {!form.fullName && (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Fill in the form to see your live preview.</p>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3 pt-6 border-t mt-8">
                <Button
                  size="sm"
                  onClick={handleExportZip}
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download Full Website (ZIP)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportHtml}
                  className="gap-2 font-bold rounded-xl cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Export HTML
                </Button>
                <Button
                  size="sm"
                  onClick={handlePublish}
                  className="gap-2 font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md cursor-pointer"
                >
                  <Send className="h-4 w-4" /> {published ? "Update Publish" : "Publish Live URL"}
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (embedded) return mainContent;
  return <AppShell>{mainContent}</AppShell>;
}
