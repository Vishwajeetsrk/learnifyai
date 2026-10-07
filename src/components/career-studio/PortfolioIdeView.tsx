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
  FolderTree,
  Lock,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PortfolioFileTree, VirtualFileNode } from "./PortfolioFileTree";
import { EditTool, type ApprovalDecision } from "./EditTool";
import { refinePortfolioCode } from "@/lib/resume.functions";
import { TechnologyIcon, getTechnologyRawSvg } from "@/components/icons/TechnologyIcon";
import { SocialIcon, getSocialRawSvg, detectSocialPlatform, normalizeSocialUrl } from "@/components/icons/SocialIcon";
import { ProjectLivePreviewModal } from "./ProjectLivePreviewModal";

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
    liveUrl?: string;
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
    const rawName = (portfolioData.fullName || "Developer").trim();
    const name = rawName && rawName.toUpperCase() !== "PROFESSIONAL" ? rawName : "Developer";
    const tagline = portfolioData.tagline || "Full-Stack Software Engineer & Builder";
    const bio = portfolioData.bio || "Passionate about creating modern, resilient web applications.";
    const skills = portfolioData.skills
      ? portfolioData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["React", "TypeScript", "Node.js", "Tailwind CSS", "Python"];

    // Social Links
    const socialUrls = (portfolioData.socialLinks || "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const heroSocialLinksHtml =
      socialUrls.length > 0
        ? `
        <div class="hero-socials">
          ${socialUrls
            .map((url) => {
              const platform = detectSocialPlatform(url);
              const normalized = normalizeSocialUrl(url);
              return `<a href="${normalized}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="${platform}">
                ${getSocialRawSvg(platform, 18)}
                <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </a>`;
            })
            .join("\n")}
        </div>`
        : "";

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
                .map((t) => {
                  const tag = t.trim();
                  return `<span class="tag">${getTechnologyRawSvg(tag, 14)}<span>${tag}</span></span>`;
                })
                .join("")}
            </div>
            <div class="project-actions">
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-live-demo"><span>Live Demo</span> &nearr;</a>` : ""}
              ${p.liveUrl ? `<button type="button" class="btn-preview-modal" data-project-name="${p.name}" data-live-url="${p.liveUrl}" data-github-url="${p.githubUrl || ""}">Preview</button>` : ""}
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-github">${getSocialRawSvg("github", 15)}<span>Source</span></a>` : ""}
            </div>
          </div>
        </article>`,
      )
      .join("\n");

    const skillsHtml = skills
      .map(
        (s) => `
        <div class="skill-pill">
          ${getTechnologyRawSvg(s, 16)}
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
    <div class="nav-brand">${name}<span> / Portfolio</span></div>
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
      ${heroSocialLinksHtml}
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

/* Light Theme Variables & High-Contrast Overrides */
body.theme-light {
  --bg-primary: #f8fafc;
  --bg-card: rgba(255, 255, 255, 0.95);
  --bg-card-hover: #ffffff;
  --border-color: rgba(15, 23, 42, 0.1);
  --border-glow: rgba(99, 102, 241, 0.3);
  --text-main: #0f172a;
  --text-muted: #475569;
}

body.theme-light .hero-title {
  background: linear-gradient(180deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

body.theme-light .navbar {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(15, 23, 42, 0.1);
}

body.theme-light .skill-pill {
  background: #ffffff;
  border-color: rgba(15, 23, 42, 0.12);
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

body.theme-light .skill-pill:hover {
  background: #f1f5f9;
  border-color: var(--accent-primary);
}

body.theme-light .project-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

body.theme-light .btn-secondary {
  background: rgba(15, 23, 42, 0.05);
  border-color: rgba(15, 23, 42, 0.15);
  color: #0f172a;
}

body.theme-light .btn-secondary:hover {
  background: rgba(15, 23, 42, 0.1);
}

body.theme-light .exp-content {
  color: #334155;
}

body.theme-light .footer {
  color: #64748b;
  border-top-color: rgba(15, 23, 42, 0.08);
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  font-weight: 500;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 0.5rem;
}

.btn-live-demo {
  background: var(--accent-gradient);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.btn-live-demo:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.45);
}

.btn-preview-modal {
  background: rgba(99, 102, 241, 0.12);
  color: #c7d2fe;
  border: 1px solid rgba(99, 102, 241, 0.25);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-preview-modal:hover {
  background: rgba(99, 102, 241, 0.22);
  color: #fff;
}

.btn-github {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s;
}

.btn-github:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.hero-socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--border-glow);
  color: #fff;
  transform: translateY(-2px);
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
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .nav-links {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    width: 100%;
    padding: 0.25rem 0;
    gap: 1rem;
    -webkit-overflow-scrolling: touch;
  }
  .nav-links a {
    white-space: nowrap;
    font-size: 0.825rem;
  }
  .container {
    padding: 2rem 1rem;
  }
  .hero-section {
    padding: 2.5rem 0.5rem 3.5rem;
  }
  .hero-title {
    font-size: 2.25rem;
  }
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .contact-box {
    padding: 2rem 1rem;
  }
  .contact-title {
    font-size: 1.5rem;
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

  // Contact trigger
  const contactBtn = document.getElementById("contactModalTrigger");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      const email = "${(portfolioData.socialLinks.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'connect@' + name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.me')}";
      window.location.href = "mailto:" + email;
    });
  }

  // Interactive Live Preview Modal bridge
  document.querySelectorAll(".btn-preview-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const liveUrl = btn.getAttribute("data-live-url");
      const projectName = btn.getAttribute("data-project-name");
      const githubUrl = btn.getAttribute("data-github-url");
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: "OPEN_PROJECT_PREVIEW",
          liveUrl,
          projectName,
          githubUrl,
        }, "*");
      } else if (liveUrl) {
        window.open(liveUrl, "_blank");
      }
    });
  });

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

  // --- Storage Key for Workspace Persistence ---
  const storageKey = useMemo(() => {
    const safeName = portfolioData.fullName
      ? portfolioData.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "default";
    return `portfolio_codebase_${safeName}`;
  }, [portfolioData.fullName]);

  // --- Workspace State (With LocalStorage Restoration) ---
  const [filesMap, setFilesMap] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const safeName = portfolioData.fullName
          ? portfolioData.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_")
          : "default";
        const saved = localStorage.getItem(`portfolio_codebase_${safeName}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            return parsed;
          }
        }
      } catch {}
    }
    return initialFilesMap;
  });

  const [activeFilePath, setActiveFilePath] = useState<string>("index.html");
  const [openTabs, setOpenTabs] = useState<string[]>(["index.html", "css/style.css", "js/script.js"]);
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [clipboard, setClipboard] = useState<{ action: "cut" | "copy"; path: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<"files" | "code" | "preview">("code");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(() => Date.now());
  const [relativeSavedStr, setRelativeSavedStr] = useState<string>("Saved just now");
  const [multiTabConflict, setMultiTabConflict] = useState<boolean>(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);

  // --- Interactive Project Live Preview Modal State & Message Listener ---
  const [previewModalProject, setPreviewModalProject] = useState<{
    isOpen: boolean;
    projectName: string;
    liveUrl: string;
    githubUrl?: string;
  }>({
    isOpen: false,
    projectName: "",
    liveUrl: "",
  });

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "OPEN_PROJECT_PREVIEW") {
        setPreviewModalProject({
          isOpen: true,
          projectName: e.data.projectName || "Project Live Preview",
          liveUrl: e.data.liveUrl || "",
          githubUrl: e.data.githubUrl || "",
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // --- Run / Build State Machine & Diagnostics ---
  type BuildStatus = "idle" | "building" | "ready" | "failed";
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("ready");
  const [buildError, setBuildError] = useState<{ message: string; file?: string; line?: number } | null>(null);

  // Truthful relative time timer (updates every 5s)
  useEffect(() => {
    const updateRelative = () => {
      if (!lastSavedTimestamp) return;
      const diffSec = Math.floor((Date.now() - lastSavedTimestamp) / 1000);
      if (diffSec < 5) setRelativeSavedStr("Saved just now");
      else if (diffSec < 60) setRelativeSavedStr(`Saved ${diffSec}s ago`);
      else {
        const diffMin = Math.floor(diffSec / 60);
        setRelativeSavedStr(`Saved ${diffMin}m ago`);
      }
    };
    updateRelative();
    const interval = setInterval(updateRelative, 5000);
    return () => clearInterval(interval);
  }, [lastSavedTimestamp]);

  // Multi-tab sync conflict listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setMultiTabConflict(true);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  const handleLoadExternalCode = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFilesMap(parsed);
          setPreviewKey((k) => k + 1);
          setMultiTabConflict(false);
          isDirtyRef.current = false;
          setSaveStatus("saved");
          setLastSavedTimestamp(Date.now());
          toast.success("Loaded updated code from another tab.");
        }
      }
    } catch {
      toast.error("Failed to load external updates");
    }
  };

  const handleKeepLocalEdits = () => {
    setMultiTabConflict(false);
    handleManualSave();
  };

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

  // Dirty state tracking & debounced auto-save
  const isDirtyRef = useRef(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDirtyRef.current) return;
    setSaveStatus("unsaved");

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (typeof window !== "undefined") {
        setSaveStatus("saving");
        try {
          localStorage.setItem(storageKey, JSON.stringify(filesMap));
          setSaveStatus("saved");
          setLastSavedTimestamp(Date.now());
          isDirtyRef.current = false;
        } catch (e) {
          console.error("Auto-save failed", e);
          setSaveStatus("error");
        }
      }
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [filesMap, storageKey]);

  // Deep Codebase Validation
  const validateCodebase = (): { valid: boolean; error?: string; file?: string; line?: number } => {
    const html = filesMap["index.html"];
    if (!html || !html.trim()) {
      return { valid: false, error: "index.html is missing or empty. Portfolio requires an entry HTML document.", file: "index.html" };
    }

    const js = filesMap["js/script.js"];
    if (js && js.trim()) {
      try {
        new Function(js);
      } catch (err: any) {
        const msg = err.message || "JavaScript syntax error";
        return { valid: false, error: msg, file: "js/script.js" };
      }
    }

    const css = filesMap["css/style.css"];
    if (css) {
      const openBraces = (css.match(/\{/g) || []).length;
      const closeBraces = (css.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return {
          valid: false,
          error: `Mismatched CSS braces: found ${openBraces} opening '{' vs ${closeBraces} closing '}' braces.`,
          file: "css/style.css",
        };
      }
    }

    return { valid: true };
  };

  // Manual save and rebuild handlers
  const handleManualSave = () => {
    if (typeof window !== "undefined") {
      setSaveStatus("saving");
      try {
        localStorage.setItem(storageKey, JSON.stringify(filesMap));
        setSaveStatus("saved");
        setLastSavedTimestamp(Date.now());
        isDirtyRef.current = false;
        setPreviewKey((k) => k + 1);
        toast.success("Code saved & live preview updated!");
      } catch (err: any) {
        setSaveStatus("error");
        toast.error("Failed to save: " + err.message);
      }
    }
  };

  const handleRunRebuild = () => {
    setBuildStatus("building");
    setBuildError(null);

    // Save codebase
    try {
      localStorage.setItem(storageKey, JSON.stringify(filesMap));
      setSaveStatus("saved");
      setLastSavedTimestamp(Date.now());
      isDirtyRef.current = false;
    } catch {
      setSaveStatus("error");
    }

    // Run validation pass
    setTimeout(() => {
      const validation = validateCodebase();
      if (!validation.valid) {
        setBuildStatus("failed");
        setBuildError({
          message: validation.error || "Build validation failed",
          file: validation.file,
          line: validation.line,
        });
        toast.error(`Build failed: ${validation.error}`);
      } else {
        setBuildStatus("ready");
        setBuildError(null);
        setPreviewKey((k) => k + 1);
        toast.success("Build succeeded! Live preview is up to date.");
      }
    }, 300);
  };

  const handleConfirmReset = () => {
    isDirtyRef.current = false;
    setFilesMap(initialFilesMap);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    setActiveFilePath("index.html");
    setOpenTabs(["index.html", "css/style.css", "js/script.js"]);
    setBuildStatus("ready");
    setBuildError(null);
    setPreviewKey((k) => k + 1);
    setSaveStatus("saved");
    setLastSavedTimestamp(Date.now());
    setIsResetDialogOpen(false);
    toast.info("Reset files to default template.");
  };

  const handleResetToTemplate = () => {
    setIsResetDialogOpen(true);
  };

  // Keyboard Shortcuts (Ctrl+S to save/run, Ctrl+B to toggle explorer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleRunRebuild();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filesMap, storageKey]);

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
    // On mobile, auto-navigate to code editor when file is selected
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileTab("code");
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

    const isFile = filesMap[oldPath] !== undefined;
    const matchingPrefix = `${oldPath}/`;
    const folderFiles = Object.keys(filesMap).filter((p) => p.startsWith(matchingPrefix));

    if (filesMap[newPath] !== undefined) {
      toast.error("File or folder already exists with that name");
      return;
    }

    isDirtyRef.current = true;
    setFilesMap((prev) => {
      const next = { ...prev };
      if (isFile) {
        next[newPath] = next[oldPath];
        delete next[oldPath];
      }
      folderFiles.forEach((oldSub) => {
        const newSub = newPath + oldSub.slice(oldPath.length);
        next[newSub] = next[oldSub];
        delete next[oldSub];
      });
      return next;
    });

    setOpenTabs((prev) =>
      prev.map((t) => {
        if (t === oldPath) return newPath;
        if (t.startsWith(matchingPrefix)) return newPath + t.slice(oldPath.length);
        return t;
      }),
    );

    if (activeFilePath === oldPath) {
      setActiveFilePath(newPath);
    } else if (activeFilePath.startsWith(matchingPrefix)) {
      setActiveFilePath(newPath + activeFilePath.slice(oldPath.length));
    }

    toast.success(`Renamed to ${newName}`);
  };

  const handleDelete = (path: string) => {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    isDirtyRef.current = true;
    const matchingPrefix = `${path}/`;

    setFilesMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((p) => {
        if (p === path || p.startsWith(matchingPrefix)) {
          delete next[p];
        }
      });
      // Safety: If zero files remain, restore minimal clean index.html
      const remaining = Object.keys(next);
      if (remaining.length === 0) {
        next["index.html"] =
          initialFilesMap["index.html"] ||
          "<!DOCTYPE html>\n<html>\n<head><title>Portfolio</title></head>\n<body>\n<h1>Welcome to my Portfolio</h1>\n</body>\n</html>";
      }
      return next;
    });

    setOpenTabs((prev) => {
      const remainingTabs = prev.filter((t) => t !== path && !t.startsWith(matchingPrefix));
      return remainingTabs.length > 0 ? remainingTabs : ["index.html"];
    });

    if (activeFilePath === path || activeFilePath.startsWith(matchingPrefix)) {
      const remainingKeys = Object.keys(filesMap).filter((p) => p !== path && !p.startsWith(matchingPrefix));
      setActiveFilePath(remainingKeys.length > 0 ? remainingKeys[0] : "index.html");
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
        "rounded-2xl border border-border/80 bg-slate-950 text-slate-100 overflow-hidden shadow-2xl flex flex-col font-sans h-[calc(100dvh-120px)] min-h-[640px]",
        className,
      )}
    >
      {/* ================= TOP IDE TOOLBAR ================= */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-900 border-b border-border/70 flex-wrap gap-2.5 shrink-0">
        {/* Left: Window Controls + Project Label + Save Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((v) => !v)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-muted-foreground hover:text-foreground border border-border/50 transition cursor-pointer"
            title={isSidebarOpen ? "Collapse Explorer (Ctrl+B)" : "Expand Explorer (Ctrl+B)"}
          >
            <FolderTree className="h-3.5 w-3.5 text-indigo-400" />
          </button>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-foreground truncate max-w-[140px] sm:max-w-none">
              {portfolioData.fullName || "Developer"} Studio
            </span>
          </div>

          {/* Unified Save Status Indicator */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-border/60 text-[11px] font-mono">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="hidden sm:inline">Saving...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="hidden sm:inline">{relativeSavedStr}</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="hidden sm:inline">Unsaved edits</span>
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1 text-rose-400">
                <AlertCircle className="h-3 w-3 text-rose-400" />
                <span className="hidden sm:inline">Save failed</span>
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="underline hover:text-white ml-0.5 cursor-pointer font-bold"
                >
                  Retry
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Center: Desktop View Switcher (Split, Code Only, Preview Only) — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-border/60">
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

        {/* Right: Actions with strong visual hierarchy */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Primary Action: Run / Rebuild */}
          <Button
            size="sm"
            onClick={handleRunRebuild}
            disabled={buildStatus === "building"}
            className="h-8 text-xs font-bold gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-xs disabled:opacity-70"
            title="Rebuild & Run Validation (Ctrl+S)"
          >
            {buildStatus === "building" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="hidden sm:inline">Building...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </Button>

          {/* Secondary Action: Save */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualSave}
            className="h-8 text-xs font-semibold gap-1.5 bg-slate-900 border-border/70 hover:bg-slate-800 text-slate-200 cursor-pointer shadow-xs"
            title="Save Codebase (Ctrl+S)"
          >
            <Save className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          {/* Download ZIP */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadZip}
            className="h-8 text-xs font-semibold gap-1.5 bg-slate-900 border-border/70 hover:bg-slate-800 text-slate-200 cursor-pointer shadow-xs"
            title="Download Full Codebase (ZIP)"
          >
            <Download className="h-3.5 w-3.5 text-slate-300" />
            <span className="hidden md:inline">ZIP</span>
          </Button>

          {/* Reset Template */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleResetToTemplate}
            className="h-8 w-8 p-0 text-xs text-muted-foreground hover:text-foreground hover:bg-slate-800 cursor-pointer"
            title="Reset to Template Defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {/* Publish */}
          {onPublish && (
            <Button
              size="sm"
              onClick={onPublish}
              className="h-8 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs ml-1"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Publish</span>
            </Button>
          )}
        </div>
      </header>

      {/* Multi-Tab Conflict Notification Banner */}
      {multiTabConflict && (
        <div className="px-3 py-2 bg-amber-950/70 border-b border-amber-500/40 flex items-center justify-between text-xs text-amber-200 gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Codebase was modified in another browser tab.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoadExternalCode}
              className="h-7 text-xs bg-amber-900/60 hover:bg-amber-800 text-amber-100 border-amber-600/50 cursor-pointer"
            >
              Load External Changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleKeepLocalEdits}
              className="h-7 text-xs text-amber-300 hover:text-white cursor-pointer"
            >
              Keep Local Edits
            </Button>
          </div>
        </div>
      )}

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
        <div className="px-3 py-1.5 bg-slate-900/90 border-b border-border/70 flex items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[11px] font-mono text-slate-300 truncate">
              AI Assistant: Temporarily busy. File editing, code execution, and live preview remain active.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleRunAiAssist()}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => setEditLifecycle({ phase: "idle" })}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
              aria-label="Dismiss status"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ================= MOBILE WORKSPACE TABS (< lg) ================= */}
      <div className="lg:hidden flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-border/60">
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setMobileTab("files")}
            className={cn(
              "px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition cursor-pointer",
              mobileTab === "files"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <FolderTree className="h-3 w-3" /> Files
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("code")}
            className={cn(
              "px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition cursor-pointer",
              mobileTab === "code"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Code2 className="h-3 w-3" /> Code
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={cn(
              "px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition cursor-pointer",
              mobileTab === "preview"
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 font-semibold truncate max-w-[140px]">
          {activeFilePath}
        </span>
      </div>

      {/* ================= MAIN RESPONSIVE WORKSPACE ================= */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-[580px] overflow-hidden">
        {/* --- LEFT: ANIMATED FILE TREE --- */}
        <aside
          className={cn(
            "border-r border-border/60 bg-slate-950/80 p-2 flex flex-col justify-between shrink-0",
            isSidebarOpen && (viewMode === "split" || viewMode === "code") ? "lg:flex lg:w-56" : "lg:hidden",
            mobileTab === "files" ? "flex flex-1 w-full" : "hidden",
          )}
        >
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
            isDirty={isDirtyRef.current || saveStatus === "unsaved"}
            className="h-full border-0 rounded-none bg-transparent"
          />
          <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground px-1 flex items-center justify-between">
            <span>{Object.keys(filesMap).length} files</span>
            <span>UTF-8</span>
          </div>
        </aside>

        {/* --- MIDDLE: CODE EDITOR PANE --- */}
        <div
          className={cn(
            "flex flex-col bg-slate-950 min-w-0 border-r border-border/60",
            viewMode === "code" ? "lg:flex lg:flex-1" : viewMode === "split" ? "lg:flex lg:w-1/2" : "lg:hidden",
            mobileTab === "code" ? "flex flex-1 w-full" : "hidden",
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
          <div className="flex-1 relative flex overflow-hidden min-h-[350px]">
            {/* Line numbers gutter */}
            <div className="w-10 bg-slate-950/90 border-r border-border/30 text-right pr-2 pt-3 font-mono text-[11px] text-slate-500 select-none">
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
              className="flex-1 p-3 font-mono text-[12px] leading-[1.5rem] bg-transparent text-slate-100 outline-none resize-none overflow-y-auto selection:bg-indigo-500/30"
            />
          </div>

          {/* Editor Status Bar */}
          <div className="flex items-center justify-between px-3 py-1 bg-slate-900/80 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300">
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
                className="hover:text-foreground flex items-center gap-1 text-slate-300 cursor-pointer"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="hover:text-foreground flex items-center gap-1 text-emerald-400 font-semibold cursor-pointer"
              >
                <Play className="h-3 w-3" /> Run
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT: LIVE PREVIEW PANE --- */}
        <div
          className={cn(
            "flex flex-col bg-slate-900/60 min-w-0 flex-1",
            viewMode === "preview" ? "lg:flex lg:w-full" : viewMode === "split" ? "lg:flex lg:flex-1" : "lg:hidden",
            mobileTab === "preview" ? "flex flex-1 w-full" : "hidden",
          )}
        >
            {/* Live Preview Controls Header (Simulated Browser Bar) */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-border/70 gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      buildStatus === "ready" && "bg-emerald-500 animate-pulse",
                      buildStatus === "building" && "bg-amber-400 animate-ping",
                      buildStatus === "failed" && "bg-rose-500",
                    )}
                  />
                  <span className="text-[11px] font-mono font-medium text-slate-300">
                    {buildStatus === "building" && "Building..."}
                    {buildStatus === "ready" && "Preview ready"}
                    {buildStatus === "failed" && "Build failed"}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-border/60 text-[11px] font-mono text-slate-300 truncate max-w-[240px]">
                  <Lock className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    learnifyai.in/p/{portfolioData.fullName
                      ? portfolioData.fullName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                      : "preview"}
                  </span>
                </div>
              </div>

              {/* Device view switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn(
                    "p-1.5 rounded text-xs transition cursor-pointer",
                    previewDevice === "desktop"
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Desktop View (100%)"
                >
                  <Laptop className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={cn(
                    "p-1.5 rounded text-xs transition cursor-pointer",
                    previewDevice === "tablet"
                      ? "bg-primary text-white shadow-xs"
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
                    "p-1.5 rounded text-xs transition cursor-pointer",
                    previewDevice === "mobile"
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleRunRebuild}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-slate-800 transition cursor-pointer"
                  title="Rebuild & Refresh Preview (Ctrl+S)"
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
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-slate-800 transition cursor-pointer"
                  title="Open Preview in New Window"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Iframe viewport or Error Diagnostic Terminal */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto">
              {buildStatus === "failed" && buildError ? (
                <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-rose-500/40 text-slate-100 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-rose-400">Build Validation Error</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        A syntax or structural issue was detected in your codebase. Fix the issue below and click Rebuild.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/20 font-mono text-xs text-rose-300 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{buildError.file || "Codebase"}</span>
                    </div>
                    {buildError.message}
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {buildError.file && (
                      <Button
                        size="sm"
                        onClick={() => {
                          handleSelectFile(buildError.file!);
                          setMobileTab("code");
                        }}
                        className="h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                      >
                        <Code2 className="h-3.5 w-3.5 mr-1.5" /> Jump to {buildError.file}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRunRebuild}
                      className="h-8 text-xs font-semibold bg-slate-800 border-border/70 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Build
                    </Button>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
      </div>

      {/* Mobile Bottom Quick-Action Bar (< lg) with safe-area inset */}
      <div className="lg:hidden flex items-center justify-between p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] bg-slate-900 border-t border-border/70 gap-2 shrink-0">
        <Button
          size="sm"
          onClick={handleRunRebuild}
          disabled={buildStatus === "building"}
          className="flex-1 min-h-[44px] text-xs font-bold gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
        >
          {buildStatus === "building" ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
          Run Preview
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleManualSave}
          className="min-h-[44px] px-3.5 text-xs font-semibold gap-1.5 bg-slate-800 border-border/70 text-slate-200 cursor-pointer"
        >
          <Save className="h-4 w-4 text-indigo-400" /> Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadZip}
          className="min-h-[44px] px-3.5 text-xs font-semibold gap-1.5 bg-slate-800 border-border/70 text-slate-200 cursor-pointer"
        >
          <Download className="h-4 w-4" /> ZIP
        </Button>
        {onPublish && (
          <Button
            size="sm"
            onClick={onPublish}
            className="min-h-[44px] px-3.5 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Safe Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-border/80 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-5 w-5" /> Reset Codebase to Template?
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs leading-relaxed pt-2">
              This will replace all current files and custom edits in this portfolio with the default template. Any unsaved edits or custom files will be overwritten.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetDialogOpen(false)}
              className="bg-slate-800 border-border/70 text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmReset}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
            >
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interactive Project Live Preview Modal */}
      <ProjectLivePreviewModal
        isOpen={previewModalProject.isOpen}
        onClose={() => setPreviewModalProject((prev) => ({ ...prev, isOpen: false }))}
        projectName={previewModalProject.projectName}
        liveUrl={previewModalProject.liveUrl}
        githubUrl={previewModalProject.githubUrl}
      />
    </div>
  );
}

