"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Code2,
  Eye,
  Columns,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Laptop,
  Tablet,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Save,
  Wand2,
  FileCode,
  FolderOpen,
  Send,
  Loader2,
  X,
  FilePlus,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PortfolioFileTree, VirtualFileNode } from "./PortfolioFileTree";
import { EditTool, type ApprovalDecision } from "./EditTool";
import { refinePortfolioCode } from "@/lib/resume.functions";

export interface PortfolioIdeViewProps {
  portfolioData: {
    fullName: string;
    tagline: string;
    bio: string;
    skills: string;
    softSkills: string;
    tools: string;
    projects: string;
    socialLinks: string;
    experience: string;
    education: string;
    style: string;
  };
  projectsList: Array<{
    name: string;
    description: string;
    techStack: string;
    githubUrl: string;
    imageUrl?: string;
  }>;
  photoPreview?: string | null;
  onPublish?: () => void;
  className?: string;
}

export function PortfolioIdeView({
  portfolioData,
  projectsList,
  photoPreview,
  onPublish,
  className,
}: PortfolioIdeViewProps) {
  const refineFn = useServerFn(refinePortfolioCode);

  // --- Initial Virtual File System Generation ---
  const initialFilesMap = useMemo(() => {
    const name = portfolioData.fullName || "Developer";
    const tagline = portfolioData.tagline || "Full-Stack Software Engineer & Builder";
    const bio = portfolioData.bio || "Passionate about creating modern, resilient web applications.";
    const skills = portfolioData.skills
      ? portfolioData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["React", "TypeScript", "Node.js", "Tailwind CSS", "Python"];

    const projectCardsHtml = projectsList
      .filter((p) => p.name)
      .map(
        (p) => `
        <article class="project-card">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="project-img" />` : `<div class="project-placeholder"><span class="project-icon">⚡</span></div>`}
          <div class="project-body">
            <h3 class="project-title">${p.name}</h3>
            <p class="project-desc">${p.description || "Production-grade project built with modern best practices."}</p>
            <div class="project-tags">
              ${(p.techStack || "React, TypeScript")
                .split(",")
                .map((t) => `<span class="tag">${t.trim()}</span>`)
                .join("")}
            </div>
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">View Code &rarr;</a>` : ""}
          </div>
        </article>`,
      )
      .join("\n");

    const skillsHtml = skills
      .map(
        (s) => `
        <div class="skill-pill">
          <span class="skill-dot"></span>
          <span>${s}</span>
        </div>`,
      )
      .join("\n");

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} | Portfolio</title>
  <link rel="stylesheet" href="./css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body class="theme-dark">
  <div class="bg-mesh"></div>

  <!-- NAVIGATION -->
  <header class="navbar">
    <div class="nav-brand">${name.split(" ")[0]}<span>.dev</span></div>
    <nav class="nav-links">
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#contact" class="btn-primary-sm">Get in Touch</a>
    </nav>
    <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">◐</button>
  </header>

  <main class="container">
    <!-- HERO SECTION -->
    <section id="about" class="hero-section">
      <div class="hero-avatar-wrap">
        ${photoPreview ? `<img src="${photoPreview}" alt="${name}" class="hero-avatar" />` : `<div class="hero-avatar-fallback">${name.charAt(0)}</div>`}
        <div class="status-indicator" title="Available for opportunities"></div>
      </div>
      <div class="hero-badge">✦ Available for Engineering Roles</div>
      <h1 class="hero-title">${name}</h1>
      <p class="hero-tagline">${tagline}</p>
      <p class="hero-bio">${bio}</p>
      <div class="hero-cta-group">
        <a href="#projects" class="btn-primary">View Featured Projects</a>
        <a href="#contact" class="btn-secondary">Contact Me</a>
      </div>
    </section>

    <!-- SKILLS SECTION -->
    <section id="skills" class="section">
      <div class="section-header">
        <span class="section-subtitle">CAPABILITIES</span>
        <h2 class="section-title">Technical Expertise</h2>
      </div>
      <div class="skills-grid">
        ${skillsHtml}
      </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects" class="section">
      <div class="section-header">
        <span class="section-subtitle">PORTFOLIO</span>
        <h2 class="section-title">Featured Creations</h2>
      </div>
      <div class="projects-grid">
        ${projectCardsHtml || `<div class="empty-notice">Add your projects in the sidebar or prompt the AI to generate sample cases!</div>`}
      </div>
    </section>

    <!-- EXPERIENCE SECTION -->
    ${
      portfolioData.experience
        ? `
    <section id="experience" class="section">
      <div class="section-header">
        <span class="section-subtitle">TIMELINE</span>
        <h2 class="section-title">Work Experience</h2>
      </div>
      <div class="exp-card">
        <p class="exp-content">${portfolioData.experience.replace(/\n/g, "<br>")}</p>
      </div>
    </section>`
        : ""
    }

    <!-- CONTACT SECTION -->
    <section id="contact" class="section contact-section">
      <div class="contact-box">
        <h2 class="contact-title">Let's build something remarkable together</h2>
        <p class="contact-desc">Open for high-impact full-time roles, contracts, and exciting engineering collaborations.</p>
        <button id="contactModalTrigger" class="btn-primary">Send a Message</button>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${name}. Handcrafted with Learnify AI Portfolio Studio.</p>
  </footer>

  <script src="./js/script.js"></script>
</body>
</html>`;

    const styleCss = `/* =========================================================
   Learnify AI — Modern Glassmorphism Portfolio Design System
   ========================================================= */
:root {
  --bg-primary: #090d16;
  --bg-card: rgba(17, 24, 39, 0.7);
  --bg-card-hover: rgba(30, 41, 59, 0.85);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-glow: rgba(99, 102, 241, 0.35);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent-primary: #6366f1;
  --accent-secondary: #a855f7;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  --radius-lg: 16px;
  --radius-md: 10px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'DM Sans', -apple-system, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Background Animated Gradient Mesh */
.bg-mesh {
  position: fixed;
  top: -20%;
  left: -20%;
  width: 140vw;
  height: 140vh;
  background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 60%, rgba(168, 85, 247, 0.1) 0%, transparent 45%),
              radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%);
  pointer-events: none;
  z-index: -1;
}

/* NAVBAR */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(9, 13, 22, 0.8);
  border-bottom: 1px solid var(--border-color);
}

.nav-brand {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-brand span {
  color: var(--accent-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--text-main);
}

.theme-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-btn:hover {
  color: var(--text-main);
  border-color: var(--border-glow);
}

/* CONTAINER */
.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

/* HERO SECTION */
.hero-section {
  text-align: center;
  padding: 4rem 1rem 6rem;
  position: relative;
}

.hero-avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 1.5rem;
}

.hero-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.35);
}

.hero-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  border: 3px solid rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.35);
}

.status-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid var(--bg-primary);
  box-shadow: 0 0 8px #10b981;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #a5b4fc;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
}

.hero-tagline {
  font-size: 1.25rem;
  color: #818cf8;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-bio {
  color: var(--text-muted);
  max-width: 640px;
  margin: 0 auto 2.5rem;
  font-size: 1rem;
  line-height: 1.7;
}

.hero-cta-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-primary-sm {
  background: var(--accent-gradient);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
  cursor: pointer;
}

.btn-primary {
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
}

.btn-primary-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

.btn-primary:hover, .btn-primary-sm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* SECTION HEADERS */
.section {
  padding: 4rem 0;
}

.section-header {
  margin-bottom: 2.5rem;
}

.section-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--accent-primary);
  display: block;
  margin-bottom: 0.5rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* SKILLS GRID */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
  transition: all 0.2s ease;
}

.skill-pill:hover {
  border-color: var(--border-glow);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.skill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
}

/* PROJECTS GRID */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border-color: var(--border-glow);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.project-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
}

.project-placeholder {
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
}

.project-icon {
  font-size: 2.5rem;
  opacity: 0.6;
}

.project-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.project-desc {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  font-weight: 500;
}

.project-link {
  color: #818cf8;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.project-link:hover {
  color: #c7d2fe;
}

/* EXPERIENCE CARD */
.exp-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
}

.exp-content {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.8;
}

/* CONTACT SECTION */
.contact-box {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
  border: 1px solid var(--border-glow);
  border-radius: 20px;
  padding: 3.5rem 2rem;
  text-align: center;
}

.contact-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.contact-desc {
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto 1.75rem;
  font-size: 0.95rem;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 2.5rem 1rem;
  border-top: 1px solid var(--border-color);
  color: #64748b;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  .nav-links {
    display: none;
  }
}
`;

    const scriptJs = `// --- Interactive Portfolio Runtime Scripts ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Portfolio Runtime Initialized for ${name}");

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Contact trigger interactive feedback
  const contactBtn = document.getElementById("contactModalTrigger");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      const email = "${portfolioData.socialLinks.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "hello@" + name.toLowerCase().replace(/\s+/g, "") + ".dev"}";
      alert("Send an email to " + email);
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
    });
  }
});
`;

    const portfolioJson = JSON.stringify(
      {
        fullName: name,
        tagline,
        bio,
        skills,
        projects: projectsList,
        socials: portfolioData.socialLinks,
        experience: portfolioData.experience,
        education: portfolioData.education,
        style: portfolioData.style,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    );

    const readmeMd = `# ${name} — Developer Portfolio

Handcrafted using **Learnify AI Portfolio Builder & Code Studio**.

## 🚀 Quick Start
Open \`index.html\` directly in any browser, or run a local static web server:

\`\`\`bash
# Python 3
python -m http.server 3000

# Node.js
npx serve .
\`\`\`

## 📂 Architecture
- \`index.html\`: Semantic HTML structure with glassmorphic cards and hero
- \`css/style.css\`: Tailored design system, responsive breakpoints, and keyframe animations
- \`js/script.js\`: Runtime interactivity, smooth scroll, and handlers
- \`portfolio.json\`: Structured candidate profile metadata

## 🌐 Instant Deploy
- **Vercel**: Run \`npx vercel\` in this folder.
- **GitHub Pages**: Push this directory to your \`username.github.io\` repository.
`;

    return {
      "index.html": indexHtml,
      "css/style.css": styleCss,
      "js/script.js": scriptJs,
      "portfolio.json": portfolioJson,
      "README.md": readmeMd,
    };
  }, [portfolioData, projectsList, photoPreview]);

  // --- Workspace State ---
  const [filesMap, setFilesMap] = useState<Record<string, string>>(initialFilesMap);
  const [activeFilePath, setActiveFilePath] = useState<string>("index.html");
  const [openTabs, setOpenTabs] = useState<string[]>(["index.html", "css/style.css", "js/script.js"]);
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [clipboard, setClipboard] = useState<{ action: "cut" | "copy"; path: string } | null>(null);

  // --- AI Code Assistant State Machine ---
  // Lifecycle: idle -> generating -> review -> applying -> applied/discarded/failed
  type EditLifecycleState =
    | { phase: "idle" }
    | { phase: "generating"; filePath: string }
    | { phase: "review"; filePath: string; oldContent: string; newContent: string; summary: string }
    | { phase: "applying"; filePath: string; oldContent: string; newContent: string; summary: string }
    | { phase: "applied"; filePath: string; summary: string }
    | { phase: "discarded" }
    | { phase: "failed"; error: string };

  const [aiPrompt, setAiPrompt] = useState("");
  const [editLifecycle, setEditLifecycle] = useState<EditLifecycleState>({ phase: "idle" });

  // Derived convenience booleans
  const isAiLoading = editLifecycle.phase === "generating";

  // Auto-dismiss applied/discarded/failed state after a brief display
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (editLifecycle.phase === "applied" || editLifecycle.phase === "discarded" || editLifecycle.phase === "failed") {
      dismissTimerRef.current = setTimeout(() => {
        setEditLifecycle({ phase: "idle" });
      }, 3000);
    }
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [editLifecycle.phase]);

  // Refresh preview counter
  const [previewKey, setPreviewKey] = useState(0);

  // Keep filesMap updated if initial files change and user hasn't edited
  const isDirtyRef = useRef(false);
  useEffect(() => {
    if (!isDirtyRef.current) {
      setFilesMap(initialFilesMap);
    }
  }, [initialFilesMap]);

  // Convert flat filesMap into virtual file tree
  const fileTreeData: VirtualFileNode[] = useMemo(() => {
    const rootNodes: Record<string, VirtualFileNode> = {};

    Object.keys(filesMap).sort().forEach((fullPath) => {
      const parts = fullPath.split("/");
      if (parts.length === 1) {
        const ext = parts[0].split(".").pop();
        rootNodes[parts[0]] = {
          id: parts[0],
          name: parts[0],
          type: "file",
          path: parts[0],
          extension: ext,
          content: filesMap[parts[0]],
        };
      } else {
        const folderName = parts[0];
        const fileName = parts.slice(1).join("/");
        const ext = fileName.split(".").pop();

        if (!rootNodes[folderName]) {
          rootNodes[folderName] = {
            id: folderName,
            name: folderName,
            type: "folder",
            path: folderName,
            children: [],
          };
        }
        rootNodes[folderName].children = rootNodes[folderName].children || [];
        rootNodes[folderName].children.push({
          id: fullPath,
          name: fileName,
          type: "file",
          path: fullPath,
          extension: ext,
          content: filesMap[fullPath],
        });
      }
    });

    return Object.values(rootNodes);
  }, [filesMap]);

  // Code editor text updates
  const handleCodeChange = (newCode: string) => {
    isDirtyRef.current = true;
    setFilesMap((prev) => ({
      ...prev,
      [activeFilePath]: newCode,
    }));
  };

  // Open file tab
  const handleSelectFile = (path: string) => {
    setActiveFilePath(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
  };

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextTabs = openTabs.filter((t) => t !== path);
    setOpenTabs(nextTabs);
    if (activeFilePath === path && nextTabs.length > 0) {
      setActiveFilePath(nextTabs[nextTabs.length - 1]);
    }
  };

  // File system CRUD
  const handleCreateFile = (parentFolder?: string) => {
    const name = window.prompt("Enter new file name (e.g. styles.css, about.html):");
    if (!name?.trim()) return;
    const cleanName = name.trim();
    const newPath = parentFolder ? `${parentFolder}/${cleanName}` : cleanName;
    if (filesMap[newPath] !== undefined) {
      toast.error("A file with this name already exists");
      return;
    }
    isDirtyRef.current = true;
    setFilesMap((prev) => ({ ...prev, [newPath]: "" }));
    handleSelectFile(newPath);
    toast.success(`Created file ${newPath}`);
  };

  const handleCreateFolder = (parentFolder?: string) => {
    const name = window.prompt("Enter new folder name:");
    if (!name?.trim()) return;
    const cleanName = name.trim().replace(/\/$/, "");
    const placeholderFile = parentFolder
      ? `${parentFolder}/${cleanName}/.keep`
      : `${cleanName}/.keep`;
    isDirtyRef.current = true;
    setFilesMap((prev) => ({ ...prev, [placeholderFile]: "" }));
    toast.success(`Created folder ${cleanName}`);
  };

  const handleRename = (oldPath: string, newName: string) => {
    const parts = oldPath.split("/");
    parts[parts.length - 1] = newName;
    const newPath = parts.join("/");
    if (filesMap[newPath] !== undefined) {
      toast.error("File already exists with that name");
      return;
    }
    isDirtyRef.current = true;
    setFilesMap((prev) => {
      const next = { ...prev };
      next[newPath] = next[oldPath];
      delete next[oldPath];
      return next;
    });
    setOpenTabs((prev) => prev.map((t) => (t === oldPath ? newPath : t)));
    if (activeFilePath === oldPath) setActiveFilePath(newPath);
    toast.success(`Renamed to ${newName}`);
  };

  const handleDelete = (path: string) => {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    isDirtyRef.current = true;
    setFilesMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((p) => {
        if (p === path || p.startsWith(`${path}/`)) {
          delete next[p];
        }
      });
      return next;
    });
    setOpenTabs((prev) => prev.filter((t) => t !== path && !t.startsWith(`${path}/`)));
    const remaining = Object.keys(filesMap).filter((p) => p !== path);
    if (activeFilePath === path && remaining.length > 0) {
      setActiveFilePath(remaining[0]);
    }
    toast.success(`Deleted ${path}`);
  };

  const handleCopy = (path: string) => {
    setClipboard({ action: "copy", path });
    toast.info(`Copied ${path} to clipboard`);
  };

  const handleCut = (path: string) => {
    setClipboard({ action: "cut", path });
    toast.info(`Cut ${path} (ready to move)`);
  };

  const handlePaste = (destFolder?: string) => {
    if (!clipboard) return;
    const srcPath = clipboard.path;
    const content = filesMap[srcPath] ?? "";
    const fileName = srcPath.split("/").pop() || "copied_file";
    const destPath = destFolder ? `${destFolder}/${fileName}` : fileName;

    isDirtyRef.current = true;
    setFilesMap((prev) => {
      const next = { ...prev };
      next[destPath] = content;
      if (clipboard.action === "cut" && srcPath !== destPath) {
        delete next[srcPath];
      }
      return next;
    });

    if (clipboard.action === "cut") {
      setClipboard(null);
      toast.success(`Moved ${srcPath} to ${destPath}`);
    } else {
      toast.success(`Pasted copy to ${destPath}`);
    }
    handleSelectFile(destPath);
  };

  // --- AI Code Assistant Execution (State Machine) ---
  const handleRunAiAssist = async (customInstruction?: string) => {
    const prompt = (customInstruction || aiPrompt).trim();
    if (!prompt) {
      toast.error("Please enter what code change you want to make");
      return;
    }

    const currentCode = filesMap[activeFilePath] || "";
    setEditLifecycle({ phase: "generating", filePath: activeFilePath });
    try {
      const res = await refineFn({
        data: {
          filePath: activeFilePath,
          currentCode,
          instruction: prompt,
          candidateContext: portfolioData,
        },
      });

      setEditLifecycle({
        phase: "review",
        filePath: activeFilePath,
        oldContent: currentCode,
        newContent: res.updatedCode,
        summary: res.summary || `AI proposed code update for ${activeFilePath}`,
      });
      setAiPrompt("");
      toast.success("AI generated code proposal! Review the diff below.");
    } catch (err: any) {
      setEditLifecycle({ phase: "failed", error: err.message || "AI code refinement failed" });
      toast.error(err.message || "AI code refinement failed");
    }
  };

  const handleApplyAiDiff = () => {
    if (editLifecycle.phase !== "review") return;
    const { filePath: fp, newContent, summary: sm } = editLifecycle;

    // Transition to applying state briefly for visual feedback
    setEditLifecycle({ ...editLifecycle, phase: "applying" });

    // Apply the code change
    isDirtyRef.current = true;
    setFilesMap((prev) => ({
      ...prev,
      [fp]: newContent,
    }));
    setPreviewKey((k) => k + 1);

    // Transition to applied
    setTimeout(() => {
      setEditLifecycle({ phase: "applied", filePath: fp, summary: sm });
      toast.success(`Applied changes to ${fp}!`);
    }, 400);
  };

  const handleDiscardAiDiff = () => {
    setEditLifecycle({ phase: "discarded" });
    toast.info("Changes discarded.");
  };

  // --- Download Full Codebase (ZIP) ---
  const handleDownloadZip = async () => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      Object.entries(filesMap).forEach(([filePath, content]) => {
        if (filePath.endsWith(".keep") && !content) return;
        zip.file(filePath, content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(portfolioData.fullName || "Developer").replace(/\s+/g, "_")}_Portfolio_Codebase.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded complete codebase ZIP!");
    } catch (err: any) {
      toast.error(err.message || "Failed to package ZIP");
    }
  };

  // --- Construct Live Preview Iframe Document ---
  const compiledSrcDoc = useMemo(() => {
    const rawHtml = filesMap["index.html"] || "<h1>No index.html</h1>";
    const css = filesMap["css/style.css"] || "";
    const js = filesMap["js/script.js"] || "";

    // Replace relative links to css/style.css and js/script.js with inline injection for zero-latency preview
    let doc = rawHtml;

    if (css) {
      if (doc.includes('href="./css/style.css"') || doc.includes('href="css/style.css"')) {
        doc = doc.replace(
          /<link[^>]+href=["']\.\/css\/style\.css["'][^>]*>/i,
          `<style id="injected-style">${css}</style>`,
        );
      } else {
        doc = doc.replace("</head>", `<style id="injected-style">${css}</style></head>`);
      }
    }

    if (js) {
      if (doc.includes('src="./js/script.js"') || doc.includes('src="js/script.js"')) {
        doc = doc.replace(
          /<script[^>]+src=["']\.\/js\/script\.js["'][^>]*><\/script>/i,
          `<script id="injected-script">${js}</script>`,
        );
      } else {
        doc = doc.replace("</body>", `<script id="injected-script">${js}</script></body>`);
      }
    }

    return doc;
  }, [filesMap]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-slate-950 text-slate-100 overflow-hidden shadow-2xl flex flex-col font-sans",
        className,
      )}
    >
      {/* ================= TOP IDE TOOLBAR ================= */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-border/60 flex-wrap gap-3">
        {/* Left: Window Controls + Project Label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-border/60">
            <span className="text-xs font-mono font-bold text-foreground">
              {portfolioData.fullName || "Developer"} Studio
            </span>
            <Badge
              variant="outline"
              className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-2 py-0"
            >
              Live Editor
            </Badge>
          </div>
        </div>

        {/* Center: View Switcher (Split, Code Only, Preview Only) */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1.5",
              viewMode === "split"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Columns className="h-3.5 w-3.5" /> Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode("code")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1.5",
              viewMode === "code"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Code2 className="h-3.5 w-3.5" /> Code
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1.5",
              viewMode === "preview"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="h-3.5 w-3.5" /> Live
          </button>
        </div>

        {/* Right: Actions (Download ZIP, Re-run, Publish) */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadZip}
            className="h-8 text-xs font-bold gap-1.5 bg-slate-900 border-border/70 hover:bg-slate-800 text-slate-200 cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            Download ZIP
          </Button>
          {onPublish && (
            <Button
              size="sm"
              onClick={onPublish}
              className="h-8 text-xs font-bold gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Send className="h-3.5 w-3.5" />
              Publish Live
            </Button>
          )}
        </div>
      </header>

      {/* ================= AI QUICK CODE ASSISTANT STRIP ================= */}
      <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-500/20 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 shrink-0">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
          <span>AI Code Assistant:</span>
        </div>

        <div className="flex-1 min-w-[240px] flex items-center gap-2">
          <Input
            placeholder={`Ask AI to edit ${activeFilePath} (e.g. "Add a neon glassmorphic border to project cards")`}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleRunAiAssist();
              }
            }}
            disabled={isAiLoading}
            className="h-8 text-xs bg-slate-900/90 border-indigo-500/30 text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500"
          />
          <Button
            size="sm"
            onClick={() => handleRunAiAssist()}
            disabled={isAiLoading || !aiPrompt.trim()}
            className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shrink-0"
          >
            {isAiLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5 mr-1" /> Refactor
              </>
            )}
          </Button>
        </div>

        {/* Quick prompt pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] text-muted-foreground">
          <span className="shrink-0 text-slate-400">Recipes:</span>
          {[
            "Add neon gradient border to project cards",
            "Add typing animation effect to hero title",
            "Add contact form modal popup with validation",
            "Add 3D perspective tilt hover to cards",
          ].map((recipe, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleRunAiAssist(recipe)}
              disabled={isAiLoading}
              className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500/40 text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer"
            >
              {recipe}
            </button>
          ))}
        </div>
      </div>

      {/* ================= AI DIFF VIEWER (Lifecycle-Driven) ================= */}
      {editLifecycle.phase === "generating" && (
        <div className="p-3 bg-slate-900 border-b border-border/80">
          <EditTool
            state="waiting"
            variant="edit"
            filePath={editLifecycle.filePath}
            summary={`Generating AI code changes for ${editLifecycle.filePath}...`}
            maxDiffHeight="200px"
          />
        </div>
      )}
      {(editLifecycle.phase === "review" || editLifecycle.phase === "applying") && (
        <div className="p-3 bg-slate-900 border-b border-border/80">
          <EditTool
            state={editLifecycle.phase === "applying" ? "pending" : "completed"}
            variant="edit"
            filePath={editLifecycle.filePath}
            oldContent={editLifecycle.oldContent}
            newContent={editLifecycle.newContent}
            summary={editLifecycle.summary}
            approval={{
              approveLabel: "Apply to Code",
              rejectLabel: "Discard Diff",
              decision: editLifecycle.phase === "applying" ? "approved" : null,
              onApprove: handleApplyAiDiff,
              onReject: handleDiscardAiDiff,
            }}
            maxDiffHeight="280px"
          />
        </div>
      )}
      {editLifecycle.phase === "applied" && (
        <div className="px-3 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
          <Check className="h-3.5 w-3.5" />
          <span className="font-semibold">Applied changes to {editLifecycle.filePath}</span>
          <span className="text-emerald-500/60 ml-1">— {editLifecycle.summary}</span>
        </div>
      )}
      {editLifecycle.phase === "failed" && (
        <div className="px-3 py-2 bg-rose-950/30 border-b border-rose-500/20 flex items-center justify-between gap-2 text-xs text-rose-400">
          <div className="flex items-center gap-2">
            <X className="h-3.5 w-3.5" />
            <span className="font-semibold">AI generation failed: {editLifecycle.error}</span>
          </div>
          <button
            type="button"
            onClick={() => setEditLifecycle({ phase: "idle" })}
            className="text-rose-300 hover:text-white px-2 py-0.5 rounded hover:bg-rose-900/40 transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ================= MAIN SPLIT WORKSPACE ================= */}
      <div className="flex-1 flex min-h-[580px] overflow-hidden">
        {/* --- LEFT: ANIMATED FILE TREE --- */}
        {(viewMode === "split" || viewMode === "code") && (
          <aside className="w-56 shrink-0 border-r border-border/60 bg-slate-950/80 p-2 flex flex-col justify-between">
            <PortfolioFileTree
              files={fileTreeData}
              activeFilePath={activeFilePath}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onRename={handleRename}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onCut={handleCut}
              onPaste={handlePaste}
              canPaste={!!clipboard}
              className="h-full border-0 rounded-none bg-transparent"
            />
            <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground px-1 flex items-center justify-between">
              <span>{Object.keys(filesMap).length} files</span>
              <span>UTF-8</span>
            </div>
          </aside>
        )}

        {/* --- MIDDLE: CODE EDITOR PANE --- */}
        {(viewMode === "split" || viewMode === "code") && (
          <div
            className={cn(
              "flex flex-col bg-slate-950 min-w-0 border-r border-border/60",
              viewMode === "code" ? "flex-1" : "w-1/2",
            )}
          >
            {/* Editor File Tabs */}
            <div className="flex items-center bg-slate-900/70 border-b border-border/50 px-2 overflow-x-auto gap-1">
              {openTabs.map((tabPath) => {
                const isActive = activeFilePath === tabPath;
                return (
                  <div
                    key={tabPath}
                    onClick={() => setActiveFilePath(tabPath)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border-b-2 transition cursor-pointer select-none",
                      isActive
                        ? "bg-slate-950 text-primary border-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-900",
                    )}
                  >
                    <span>{tabPath.split("/").pop()}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCloseTab(tabPath, e)}
                      className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Code Textarea with line numbers */}
            <div className="flex-1 relative flex overflow-hidden">
              {/* Line numbers gutter */}
              <div className="w-10 bg-slate-950/80 border-r border-border/30 text-right pr-2 pt-3 font-mono text-[11px] text-slate-600 select-none">
                {Array.from({
                  length: Math.max(1, (filesMap[activeFilePath] || "").split("\n").length),
                })
                  .slice(0, 1000)
                  .map((_, i) => (
                    <div key={i} className="leading-[1.5rem]">
                      {i + 1}
                    </div>
                  ))}
              </div>

              {/* Textarea */}
              <textarea
                value={filesMap[activeFilePath] || ""}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                className="flex-1 p-3 font-mono text-[12px] leading-[1.5rem] bg-transparent text-slate-200 outline-none resize-none overflow-y-auto selection:bg-indigo-500/30"
              />
            </div>

            {/* Editor Status Bar */}
            <div className="flex items-center justify-between px-3 py-1 bg-slate-900/80 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FileCode className="h-3 w-3 text-indigo-400" />
                  {activeFilePath}
                </span>
                <span>
                  Lines: {(filesMap[activeFilePath] || "").split("\n").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(filesMap[activeFilePath] || "");
                    toast.success(`Copied ${activeFilePath} code!`);
                  }}
                  className="hover:text-foreground flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="hover:text-foreground flex items-center gap-1 text-emerald-400 font-semibold"
                >
                  <Play className="h-3 w-3" /> Run
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- RIGHT: LIVE PREVIEW PANE --- */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div
            className={cn(
              "flex flex-col bg-slate-900/60 min-w-0 flex-1",
              viewMode === "preview" ? "w-full" : "",
            )}
          >
            {/* Live Preview Controls Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-foreground">
                  Interactive Live Preview
                </span>
              </div>

              {/* Device view switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "p-1 rounded text-xs transition cursor-pointer",
                    previewDevice === "desktop"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Desktop View"
                >
                  <Laptop className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={cn(
                    "p-1 rounded text-xs transition cursor-pointer",
                    previewDevice === "tablet"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Tablet View (768px)"
                >
                  <Tablet className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn(
                    "p-1 rounded text-xs transition cursor-pointer",
                    previewDevice === "mobile"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-slate-800 transition cursor-pointer"
                  title="Reload Preview"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([compiledSrcDoc], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-slate-800 transition cursor-pointer"
                  title="Open Preview in New Tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Iframe viewport frame */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 overflow-auto">
              <div
                className={cn(
                  "h-full w-full bg-background rounded-xl overflow-hidden shadow-2xl border border-border/80 transition-all duration-300",
                  previewDevice === "tablet" && "max-w-[768px] border-4 border-slate-700",
                  previewDevice === "mobile" && "max-w-[390px] border-8 border-slate-800 rounded-3xl",
                )}
              >
                <iframe
                  key={previewKey}
                  srcDoc={compiledSrcDoc}
                  title="Portfolio Live Preview"
                  sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                  className="w-full h-full border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
