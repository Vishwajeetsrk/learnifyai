/**
 * Learnify AI - Canonical Portfolio Renderer
 * Generates the unified HTML, CSS, and JS files for portfolios, ensuring 100% parity
 * between Builder Preview, Code Studio IDE, Standalone Preview, and ZIP exports.
 */

import { getTechnologyRawSvg } from "@/components/icons/TechnologyIcon";
import { getSocialRawSvg, detectSocialPlatform, normalizeSocialUrl } from "@/components/icons/SocialIcon";

export interface PortfolioDataInput {
  fullName?: string;
  tagline?: string;
  bio?: string;
  skills?: string;
  softSkills?: string;
  tools?: string;
  projects?: string;
  socialLinks?: string;
  experience?: string;
  education?: string;
  style?: string;
}

export interface ProjectItemInput {
  name: string;
  description: string;
  techStack?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface GeneratedPortfolioFiles {
  "index.html": string;
  "css/style.css": string;
  "js/script.js": string;
  "README.md": string;
  [key: string]: string;
}

export function generateCanonicalPortfolioFiles(
  portfolioData: PortfolioDataInput,
  projectsList: ProjectItemInput[] = [],
  photoPreview?: string | null,
): GeneratedPortfolioFiles {
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
    .map((p) => {
      const actions: string[] = [];

      if (p.liveUrl) {
        actions.push(
          `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-live-demo">
            <span>Live Demo</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>`,
        );
        actions.push(
          `<button type="button" class="btn-preview-modal" onclick="window.parent.postMessage({type:'OPEN_PROJECT_PREVIEW',url:'${p.liveUrl}',title:'${p.name}'},'*')">
            <span>Preview</span>
          </button>`,
        );
      }

      if (p.githubUrl) {
        actions.push(
          `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-github">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>GitHub</span>
          </a>`,
        );
      }

      return `
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
            ${actions.join("\n")}
          </div>
        </div>
      </article>`;
    })
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

  <footer class="footer">
    <p>© ${new Date().getFullYear()} ${name}. Built with Learnify AI Portfolio Engine.</p>
  </footer>

  <script src="./js/script.js"></script>
</body>
</html>`;

  const cssContent = `:root {
  --font-heading: 'Space Grotesk', -apple-system, sans-serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
  --bg-color: #0b1120;
  --bg-card: rgba(17, 24, 39, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
  --border-glow: rgba(99, 102, 241, 0.4);
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --radius-lg: 16px;
  --radius-sm: 8px;
}

body.theme-light {
  --bg-color: #f8fafc;
  --bg-card: #ffffff;
  --border-color: rgba(0, 0, 0, 0.08);
  --border-glow: rgba(99, 102, 241, 0.25);
  --text-main: #0f172a;
  --text-muted: #64748b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-color);
  color: var(--text-main);
  min-height: 100vh;
  line-height: 1.6;
  position: relative;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.bg-mesh {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 85% 85%, rgba(168, 85, 247, 0.12) 0%, transparent 45%);
  pointer-events: none;
  z-index: -1;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  backdrop-filter: blur(12px);
  background: rgba(11, 17, 32, 0.75);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-brand {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-brand span {
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
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

.btn-primary-sm {
  background: var(--accent-gradient);
  color: #fff !important;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.theme-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

/* HERO */
.hero-section {
  padding: 6rem 0 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-avatar-wrap {
  position: relative;
  margin-bottom: 1.5rem;
}

.hero-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
  box-shadow: 0 0 24px rgba(99, 102, 241, 0.35);
}

.hero-avatar-fallback {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
}

.status-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid var(--bg-color);
  border-radius: 50%;
}

.hero-badge {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 3.25rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
}

.hero-tagline {
  font-size: 1.25rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
}

.hero-bio {
  max-width: 650px;
  color: var(--text-muted);
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
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

.hero-cta-group {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: var(--accent-gradient);
  color: #fff;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.92;
}

.btn-secondary {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
}

/* SECTIONS */
.section {
  padding: 4rem 0;
}

.section-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.section-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--primary-color);
  text-transform: uppercase;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* SKILLS */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.6rem 1.15rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, border-color 0.2s;
}

.skill-pill:hover {
  transform: translateY(-2px);
  border-color: var(--border-glow);
}

/* PROJECTS */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  border-color: var(--border-glow);
}

.project-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
}

.project-placeholder {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
}

.project-icon {
  font-size: 2.5rem;
}

.project-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-title {
  font-family: var(--font-heading);
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

.contact-box {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
  border: 1px solid var(--border-glow);
  border-radius: 20px;
  padding: 3.5rem 2rem;
  text-align: center;
}

.contact-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.contact-desc {
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.footer {
  text-align: center;
  padding: 3rem 1.5rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem;
  }
  .nav-links {
    display: none;
  }
}`;

  const jsContent = `document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      document.body.classList.toggle('theme-dark');
    });
  }

  const modalTrigger = document.getElementById('contactModalTrigger');
  if (modalTrigger) {
    modalTrigger.addEventListener('click', () => {
      alert("Thanks for visiting! Feel free to connect via the social links above.");
    });
  }
});`;

  const readmeContent = `# ${name} — Portfolio Codebase
Generated automatically by Learnify AI Portfolio Engine.

## Structure
- \`index.html\` Entry HTML
- \`css/style.css\` Stylesheet
- \`js/script.js\` Interactive functionality

Deploy directly to GitHub Pages, Vercel, or Netlify.`;

  return {
    "index.html": indexHtml,
    "css/style.css": cssContent,
    "js/script.js": jsContent,
    "README.md": readmeContent,
  };
}

/**
 * Combines virtual files into a standalone sandboxed HTML string for zero-latency iframe preview.
 */
export function compilePortfolioToSingleHtml(filesMap: Record<string, string>): string {
  const rawHtml = filesMap["index.html"] || "<h1>No index.html</h1>";
  const css = filesMap["css/style.css"] || "";
  const js = filesMap["js/script.js"] || "";

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
}
