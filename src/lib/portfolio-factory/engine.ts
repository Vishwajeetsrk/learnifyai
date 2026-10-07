/**
 * LEARNIFY AI — PORTFOLIO FACTORY 4.0
 * Master Generation Engine
 * Synthesizes validated user data, detected personas, design families,
 * color tokens, responsive typography, and canonical CSS/HTML/JS.
 */

import { getTechnologyRawSvg } from "@/components/icons/TechnologyIcon";
import { getSocialRawSvg, detectSocialPlatform, normalizeSocialUrl } from "@/components/icons/SocialIcon";
import { detectPersona } from "./personaDetector";
import { validateAndSanitizePortfolioData } from "./validator";
import { DESIGN_FAMILIES, COLOR_PALETTES, TYPOGRAPHY_PAIRINGS } from "./presets";
import type {
  PortfolioData,
  FactoryGenerationConfig,
  GeneratedPortfolioResult,
  DesignFamilyId,
  ColorPaletteId,
  TypographyPairingId,
  HeroLayoutId,
  ProjectsLayoutId,
  SkillsLayoutId,
} from "./types";

export function generatePortfolioFromFactory(
  rawInput: Partial<PortfolioData>,
  config: FactoryGenerationConfig = {},
): GeneratedPortfolioResult {
  // 1. Detect Persona from data
  const personaInfo = detectPersona(rawInput);

  // 2. Resolve Design Family (user lock or persona recommendation)
  const familyId: DesignFamilyId =
    config.familyId && DESIGN_FAMILIES[config.familyId]
      ? config.familyId
      : personaInfo.recommendedFamily;

  const family = DESIGN_FAMILIES[familyId];

  // 3. Resolve Color Palette (user lock or family default)
  const paletteId: ColorPaletteId =
    config.paletteId && COLOR_PALETTES[config.paletteId]
      ? config.paletteId
      : family.defaultPalette;

  const colors = COLOR_PALETTES[paletteId];

  // 4. Validate and Sanitize Data
  const validation = validateAndSanitizePortfolioData(rawInput, colors);
  const data = validation.sanitizedData;

  // 5. Resolve Typography Pairing
  const typographyId: TypographyPairingId =
    config.typographyId && TYPOGRAPHY_PAIRINGS[config.typographyId]
      ? config.typographyId
      : family.defaultTypography;

  const typography = TYPOGRAPHY_PAIRINGS[typographyId];

  // 6. Resolve Layouts
  const heroId: HeroLayoutId = config.heroId || family.defaultHero;
  const projectsLayoutId: ProjectsLayoutId =
    config.projectsLayoutId || family.defaultProjectsLayout;
  const skillsLayoutId: SkillsLayoutId =
    config.skillsLayoutId || family.defaultSkillsLayout;

  // Parse Skills & Tools
  const techSkills = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : ["React", "TypeScript", "Node.js", "Tailwind CSS", "Python"];

  const softSkills = data.softSkills
    ? data.softSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const toolsList = data.tools
    ? data.tools.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Parse Social Links
  const socialUrls = (data.socialLinks || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Generate Social Buttons HTML
  const socialLinksHtml = socialUrls
    .map((url) => {
      const platform = detectSocialPlatform(url);
      const normalized = normalizeSocialUrl(url);
      return `<a href="${normalized}" target="_blank" rel="noopener noreferrer" class="social-link-pill" aria-label="${platform}">
        ${getSocialRawSvg(platform, 18)}
        <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
      </a>`;
    })
    .join("\n");

  // Generate Projects HTML based on layout
  const projectsHtml = data.projects
    .map((p, idx) => {
      const actions: string[] = [];

      if (p.liveUrl) {
        actions.push(
          `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-live-demo" aria-label="Open live demo for ${p.name}">
            <span>Live Demo</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
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
          `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-github" aria-label="View source code on GitHub for ${p.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>GitHub</span>
          </a>`,
        );
      }

      const tags = (p.techStack || "React, TypeScript")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map(
          (t) =>
            `<span class="tag-pill">${getTechnologyRawSvg(t, 14)}<span>${t}</span></span>`,
        )
        .join("");

      return `
      <article class="project-card ${p.featured ? "project-card-featured" : ""}" data-index="${idx}">
        ${
          p.imageUrl
            ? `<div class="project-img-wrap"><img src="${p.imageUrl}" alt="${p.name}" class="project-img" loading="lazy" /></div>`
            : `<div class="project-placeholder"><span class="project-icon">⚡</span></div>`
        }
        <div class="project-body">
          <div class="project-meta-line">
            <h3 class="project-title">${p.name}</h3>
            ${p.featured ? `<span class="badge-featured">Featured</span>` : ""}
          </div>
          <p class="project-desc">${p.description || "Scalable architecture designed for high throughput and clean interfaces."}</p>
          <div class="project-tags">${tags}</div>
          ${actions.length > 0 ? `<div class="project-actions">${actions.join("\n")}</div>` : ""}
        </div>
      </article>`;
    })
    .join("\n");

  // Generate Skills HTML
  const techSkillsHtml = techSkills
    .map(
      (s) => `
      <div class="skill-pill" data-skill="${s}">
        ${getTechnologyRawSvg(s, 16)}
        <span>${s}</span>
      </div>`,
    )
    .join("\n");

  const softSkillsHtml =
    softSkills.length > 0
      ? `
      <div class="skills-subgroup">
        <h3 class="skills-subtitle">Collaborative &amp; Soft Strengths</h3>
        <div class="skills-row">
          ${softSkills.map((s) => `<span class="soft-skill-pill">${s}</span>`).join("\n")}
        </div>
      </div>`
      : "";

  const toolsHtml =
    toolsList.length > 0
      ? `
      <div class="skills-subgroup">
        <h3 class="skills-subtitle">Tools &amp; Workflows</h3>
        <div class="skills-row">
          ${toolsList.map((t) => `<span class="tool-pill">${getTechnologyRawSvg(t, 14)}<span>${t}</span></span>`).join("\n")}
        </div>
      </div>`
      : "";

  // Hero Avatar or Fallback
  const heroAvatarHtml = data.photoUrl
    ? `<div class="hero-avatar-frame"><img src="${data.photoUrl}" alt="${data.fullName}" class="hero-avatar-img" /></div>`
    : `<div class="hero-avatar-fallback"><span>${data.fullName.charAt(0).toUpperCase()}</span></div>`;

  // Hero Section Layout
  let heroContentHtml = "";
  if (heroId === "developer-terminal") {
    heroContentHtml = `
      <div class="terminal-window">
        <div class="terminal-bar">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
          <span class="terminal-title">~/learnify/${data.fullName.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
        <div class="terminal-body">
          <p class="term-line"><span class="term-prompt">$</span> whoami</p>
          <h1 class="hero-name">${data.fullName}</h1>
          <p class="hero-tagline">${data.tagline}</p>
          <p class="hero-bio">${data.bio}</p>
          ${data.location ? `<p class="term-line"><span class="term-prompt">$</span> location --current <span class="term-val">📍 ${data.location}</span></p>` : ""}
          <div class="hero-actions">
            <a href="#projects" class="btn-primary">View Projects</a>
            <a href="#contact" class="btn-secondary">Get in Touch</a>
            ${data.resumeUrl ? `<a href="${data.resumeUrl}" target="_blank" rel="noopener noreferrer" class="btn-outline">Download Resume</a>` : ""}
          </div>
          ${socialLinksHtml ? `<div class="hero-social-strip">${socialLinksHtml}</div>` : ""}
        </div>
      </div>`;
  } else if (heroId === "centered-minimal") {
    heroContentHtml = `
      <div class="hero-centered">
        ${heroAvatarHtml}
        <h1 class="hero-name">${data.fullName}</h1>
        <p class="hero-tagline">${data.tagline}</p>
        <p class="hero-bio">${data.bio}</p>
        <div class="hero-actions justify-center">
          <a href="#projects" class="btn-primary">View Projects</a>
          <a href="#contact" class="btn-secondary">Contact</a>
        </div>
        ${socialLinksHtml ? `<div class="hero-social-strip justify-center">${socialLinksHtml}</div>` : ""}
      </div>`;
  } else if (heroId === "editorial-headline") {
    heroContentHtml = `
      <div class="hero-editorial">
        <span class="editorial-issue">Portfolio &bull; Selected Works</span>
        <h1 class="hero-name editorial-title">${data.fullName}</h1>
        <div class="editorial-grid">
          <div class="editorial-left">
            <p class="hero-tagline">${data.tagline}</p>
            <p class="hero-bio">${data.bio}</p>
            <div class="hero-actions">
              <a href="#projects" class="btn-primary">Explore Work</a>
              <a href="#contact" class="btn-secondary">Inquiries</a>
            </div>
            ${socialLinksHtml ? `<div class="hero-social-strip">${socialLinksHtml}</div>` : ""}
          </div>
          <div class="editorial-right">
            ${heroAvatarHtml}
          </div>
        </div>
      </div>`;
  } else {
    // Default: split-profile
    heroContentHtml = `
      <div class="hero-split">
        <div class="hero-left">
          <span class="hero-badge">● Available for opportunities</span>
          <h1 class="hero-name">${data.fullName}</h1>
          <p class="hero-tagline">${data.tagline}</p>
          <p class="hero-bio">${data.bio}</p>
          <div class="hero-actions">
            <a href="#projects" class="btn-primary">View Projects</a>
            <a href="#contact" class="btn-secondary">Contact Me</a>
            ${data.resumeUrl ? `<a href="${data.resumeUrl}" target="_blank" rel="noopener noreferrer" class="btn-outline">Resume</a>` : ""}
          </div>
          ${socialLinksHtml ? `<div class="hero-social-strip">${socialLinksHtml}</div>` : ""}
        </div>
        <div class="hero-right">
          ${heroAvatarHtml}
        </div>
      </div>`;
  }

  // Experience Section
  const experienceHtml = data.experienceRaw
    ? `
    <section id="experience" class="section">
      <div class="section-header">
        <h2 class="section-title">Experience &amp; Leadership</h2>
        <p class="section-subtitle">Track record of building and scaling software</p>
      </div>
      <div class="timeline-container">
        <div class="timeline-card">
          <p class="timeline-body">${data.experienceRaw.replace(/\n/g, "<br/>")}</p>
        </div>
      </div>
    </section>`
    : "";

  // Education Section
  const educationHtml = data.educationRaw
    ? `
    <section id="education" class="section">
      <div class="section-header">
        <h2 class="section-title">Education &amp; Credentials</h2>
      </div>
      <div class="timeline-container">
        <div class="timeline-card">
          <p class="timeline-body">${data.educationRaw.replace(/\n/g, "<br/>")}</p>
        </div>
      </div>
    </section>`
    : "";

  // Index HTML
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${data.fullName} &mdash; ${data.tagline}</title>
  <meta name="description" content="${data.bio.slice(0, 155)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Sora:wght@100..800&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./css/style.css">
</head>
<body data-family="${familyId}" data-palette="${paletteId}">
  <!-- Accessible Skip Link -->
  <a href="#main-content" class="skip-to-content">Skip to content</a>

  <!-- Header & Navigation -->
  <header class="site-header">
    <div class="nav-container">
      <a href="#" class="brand-link">
        <span class="brand-spark">✦</span>
        <span class="brand-text">${data.fullName}</span>
      </a>
      <nav class="nav-links" aria-label="Main Navigation">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        ${data.experienceRaw ? `<a href="#experience">Experience</a>` : ""}
        <a href="#contact">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="#contact" class="btn-nav-cta">Get in Touch</a>
        <button type="button" class="mobile-menu-btn" aria-label="Toggle navigation menu" id="menuToggle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>
    <!-- Mobile Drawer -->
    <div class="mobile-drawer" id="mobileDrawer">
      <a href="#about" class="drawer-link">About</a>
      <a href="#projects" class="drawer-link">Projects</a>
      <a href="#skills" class="drawer-link">Skills</a>
      ${data.experienceRaw ? `<a href="#experience" class="drawer-link">Experience</a>` : ""}
      <a href="#contact" class="drawer-link">Contact</a>
    </div>
  </header>

  <!-- Main Content -->
  <main id="main-content">
    <!-- Hero Section -->
    <section id="about" class="hero-section">
      <div class="container">
        ${heroContentHtml}
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Featured Work</div>
          <h2 class="section-title">Engineered Projects</h2>
          <p class="section-subtitle">Real applications, open-source repositories, and digital architectures</p>
        </div>
        <div class="projects-grid layout-${projectsLayoutId}">
          ${projectsHtml}
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Capabilities</div>
          <h2 class="section-title">Technical Skills &amp; Tools</h2>
          <p class="section-subtitle">Core stack, modern frameworks, databases, and developer environments</p>
        </div>
        <div class="skills-grid layout-${skillsLayoutId}">
          ${techSkillsHtml}
        </div>
        ${softSkillsHtml}
        ${toolsHtml}
      </div>
    </section>

    ${experienceHtml}
    ${educationHtml}

    <!-- Contact Section -->
    <section id="contact" class="section">
      <div class="container">
        <div class="contact-card">
          <span class="contact-spark">✦</span>
          <h2 class="contact-title">Let&rsquo;s Build Something Resilient</h2>
          <p class="contact-subtitle">Have an exciting role, project, or technical initiative in mind? Let&rsquo;s connect.</p>
          <div class="contact-details">
            ${data.email ? `<a href="mailto:${data.email}" class="contact-btn">✉ ${data.email}</a>` : ""}
            ${data.phone ? `<span class="contact-pill">📞 ${data.phone}</span>` : ""}
            ${data.location ? `<span class="contact-pill">📍 ${data.location}</span>` : ""}
          </div>
          ${socialLinksHtml ? `<div class="contact-social-strip">${socialLinksHtml}</div>` : ""}
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-content">
      <p>&copy; ${new Date().getFullYear()} ${data.fullName}. Built with Learnify AI Portfolio Factory.</p>
      <div class="footer-links">
        <a href="#about">Back to top ↑</a>
      </div>
    </div>
  </footer>

  <script src="./js/script.js"></script>
</body>
</html>`;

  // Canonical CSS
  const cssContent = `/* LEARNIFY AI PORTFOLIO FACTORY 4.0 STYLESHEET */
/* Design Family: ${family.name} | Palette: ${paletteId} | Typography: ${typography.displayFont} + ${typography.bodyFont} */

:root {
  --color-bg: ${colors.background};
  --color-surface: ${colors.surface};
  --color-surface-alt: ${colors.surfaceAlt};
  --color-border: ${colors.border};
  --color-text: ${colors.text};
  --color-muted: ${colors.muted};
  --color-primary: ${colors.primary};
  --color-primary-hover: ${colors.primaryHover};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-danger: ${colors.danger};

  --font-display: ${typography.displayFontFamily};
  --font-body: ${typography.bodyFontFamily};
  --font-code: ${typography.codeFontFamily};

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.15);
  --shadow-elevated: 0 12px 36px -4px rgba(0, 0, 0, 0.25);
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal: 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.skip-to-content {
  position: absolute;
  top: -100px;
  left: 16px;
  background: var(--color-primary);
  color: #fff;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  z-index: 1000;
  transition: top var(--transition-fast);
  text-decoration: none;
  font-weight: 600;
}
.skip-to-content:focus {
  top: 16px;
}

.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Site Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background-color: rgba(10, 17, 40, 0.85);
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}
.nav-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-text);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}
.brand-spark {
  color: var(--color-primary);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-links a {
  text-decoration: none;
  color: var(--color-muted);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}
.nav-links a:hover {
  color: var(--color-text);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-nav-cta {
  background: var(--color-primary);
  color: #fff;
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
}
.btn-nav-cta:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
.mobile-menu-btn {
  display: none;
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.mobile-drawer {
  display: none;
  flex-direction: column;
  padding: 16px 24px 20px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}
.mobile-drawer.active {
  display: flex;
}
.drawer-link {
  color: var(--color-muted);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 6px 0;
}
.drawer-link:hover {
  color: var(--color-primary);
}

/* Hero Section */
.hero-section {
  padding: clamp(48px, 10vw, 100px) 0;
  position: relative;
}
.hero-split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: center;
}
.hero-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  width: fit-content;
}
.hero-name {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-text);
}
.hero-tagline {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.4;
}
.hero-bio {
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  color: var(--color-muted);
  max-width: 580px;
  line-height: 1.6;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}
.btn-primary {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 166, 251, 0.35);
}
.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.btn-secondary:hover {
  background: var(--color-surface-alt);
  transform: translateY(-2px);
}
.btn-outline {
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  font-weight: 500;
  font-size: 0.95rem;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.btn-outline:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}
.hero-avatar-frame {
  width: clamp(200px, 30vw, 320px);
  height: clamp(200px, 30vw, 320px);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-elevated);
  margin: 0 auto;
}
.hero-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-avatar-fallback {
  width: clamp(160px, 25vw, 240px);
  height: clamp(160px, 25vw, 240px);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt));
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 auto;
}
.hero-social-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.social-link-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}
.social-link-pill:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* Terminal Hero Variant */
.terminal-window {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  overflow: hidden;
}
.terminal-bar {
  background: var(--color-surface-alt);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--color-border);
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }
.terminal-title {
  font-family: var(--font-code);
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-left: 8px;
}
.terminal-body {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.term-line {
  font-family: var(--font-code);
  font-size: 0.9rem;
  color: var(--color-muted);
}
.term-prompt {
  color: var(--color-primary);
  font-weight: 700;
  margin-right: 6px;
}
.term-val {
  color: var(--color-text);
}

/* Centered & Editorial Hero Variants */
.hero-centered {
  text-align: center;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.hero-editorial {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.editorial-issue {
  font-family: var(--font-code);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}
.editorial-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
}

/* Sections */
.section {
  padding: clamp(60px, 8vw, 96px) 0;
}
.section-alt {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.section-header {
  margin-bottom: 40px;
}
.section-tag {
  font-family: var(--font-code);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 6px;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
}
.section-subtitle {
  color: var(--color-muted);
  font-size: 1rem;
  margin-top: 4px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  gap: 24px;
}
.projects-grid.layout-grid-bento {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
.projects-grid.layout-image-top-cards {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
.projects-grid.layout-image-side-rows {
  grid-template-columns: 1fr;
}
.projects-grid.layout-featured-showcase {
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
}

.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
}
.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 166, 251, 0.4);
  box-shadow: var(--shadow-card);
}
.project-img-wrap {
  height: 200px;
  overflow: hidden;
  background: var(--color-surface-alt);
}
.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}
.project-card:hover .project-img {
  transform: scale(1.03);
}
.project-placeholder {
  height: 160px;
  background: linear-gradient(135deg, var(--color-surface-alt), var(--color-surface));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}
.project-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
}
.project-meta-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.project-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}
.badge-featured {
  background: rgba(251, 113, 133, 0.15);
  color: var(--color-accent);
  border: 1px solid rgba(251, 113, 133, 0.3);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}
.project-desc {
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-text);
  font-family: var(--font-code);
}
.project-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}
.btn-live-demo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.btn-live-demo:hover {
  background: var(--color-primary-hover);
}
.btn-preview-modal {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-preview-modal:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}
.btn-github {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  margin-left: auto;
}
.btn-github:hover {
  background: var(--color-surface);
  border-color: var(--color-text);
}

/* Skills */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  transition: all var(--transition-fast);
}
.skill-pill:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.skills-subgroup {
  margin-top: 32px;
}
.skills-subtitle {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: 12px;
}
.skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.soft-skill-pill {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  color: var(--color-text);
}
.tool-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--color-text);
}

/* Experience / Education Timelines */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.timeline-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
}
.timeline-body {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.7;
}

/* Contact Card */
.contact-card {
  background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: clamp(36px, 6vw, 64px) 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.contact-spark {
  color: var(--color-primary);
  font-size: 1.8rem;
}
.contact-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.contact-subtitle {
  color: var(--color-muted);
  max-width: 520px;
  font-size: 1rem;
}
.contact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}
.contact-btn {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.contact-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}
.contact-pill {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}
.contact-social-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 8px;
}

/* Site Footer */
.site-footer {
  border-top: 1px solid var(--color-border);
  padding: 32px 0;
  background: var(--color-bg);
}
.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--color-muted);
}
.footer-links a {
  color: var(--color-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.footer-links a:hover {
  color: var(--color-primary);
}

/* Responsive Media Queries */
@media (max-width: 768px) {
  .nav-links, .btn-nav-cta {
    display: none;
  }
  .mobile-menu-btn {
    display: block;
  }
  .hero-split, .editorial-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
  .hero-actions, .hero-social-strip {
    justify-content: center;
  }
  .hero-avatar-frame, .hero-avatar-fallback {
    order: -1;
  }
  .projects-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .hero-actions a {
    width: 100%;
    text-align: center;
  }
}
`;

  // Canonical JavaScript
  const jsContent = `/* LEARNIFY AI PORTFOLIO FACTORY 4.0 SCRIPT */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });
    // Close drawer when link clicked
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // Handle smooth hash transitions
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('Portfolio Factory 4.0 active.');
});
`;

  const readmeContent = `# ${data.fullName}'s Portfolio
Generated by **Learnify AI Portfolio Factory 4.0**

## Profile
- **Role**: ${data.tagline}
- **Persona**: ${personaInfo.label}
- **Design Family**: ${family.name}
- **Color Palette**: ${paletteId}
- **Typography**: ${typography.displayFont} & ${typography.bodyFont}

## Files
- \`index.html\`: Semantic HTML5 markup
- \`css/style.css\`: Responsive CSS tokens and layout
- \`js/script.js\`: Navigation and interaction scripts

## Deploy
You can host this static portfolio anywhere:
- Vercel: \`vercel deploy\`
- GitHub Pages: Commit to \`gh-pages\` branch
- Netlify: Drag and drop folder
`;

  // Compile to single HTML for sandboxed iframe live preview
  const singleHtml = indexHtml
    .replace('<link rel="stylesheet" href="./css/style.css">', `<style>\n${cssContent}\n</style>`)
    .replace('<script src="./js/script.js"></script>', `<script>\n${jsContent}\n</script>`);

  return {
    files: {
      "index.html": indexHtml,
      "css/style.css": cssContent,
      "js/script.js": jsContent,
      "README.md": readmeContent,
    },
    htmlSrcDoc: singleHtml,
    meta: {
      familyId,
      paletteId,
      typographyId,
      persona: personaInfo.persona,
      generatedAt: new Date().toISOString(),
      contrastRatio: colors.contrastRatioText,
    },
  };
}
