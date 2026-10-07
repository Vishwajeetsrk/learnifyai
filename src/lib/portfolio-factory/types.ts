/**
 * LEARNIFY AI — PORTFOLIO FACTORY 4.0
 * Core Type Definitions & Architectural Interfaces
 */

export type DesignFamilyId =
  | "minimal-editorial"
  | "modern-swiss"
  | "developer-dark"
  | "premium-saas"
  | "neo-brutalist"
  | "bento-grid"
  | "creative-portfolio"
  | "academic-research"
  | "product-designer"
  | "ai-engineer"
  | "full-stack-dev"
  | "student-fresher"
  | "freelancer"
  | "creator"
  | "executive-pro";

export type PersonaId =
  | "ai-engineer"
  | "full-stack-dev"
  | "frontend-dev"
  | "product-designer"
  | "academic-researcher"
  | "student-fresher"
  | "freelancer"
  | "creator"
  | "executive-pro"
  | "general-builder";

export type ColorPaletteId =
  | "learnify-brand"
  | "midnight-developer"
  | "swiss-monochrome"
  | "warm-editorial"
  | "nordic-slate"
  | "cyber-neon"
  | "minimal-light"
  | "tokyo-night"
  | "emerald-growth"
  | "sunset-coral";

export type TypographyPairingId =
  | "modern-sans"
  | "editorial-serif"
  | "tech-mono"
  | "clean-swiss"
  | "geometric-display"
  | "humanist";

export type HeroLayoutId =
  | "split-profile"
  | "centered-minimal"
  | "bento-hero"
  | "developer-terminal"
  | "editorial-headline";

export type ProjectsLayoutId =
  | "grid-bento"
  | "image-top-cards"
  | "image-side-rows"
  | "minimal-numbered"
  | "featured-showcase";

export type SkillsLayoutId =
  | "categorized-grid"
  | "dock-pills"
  | "bento-chips"
  | "minimal-cloud";

export type MotionPresetId = "subtle" | "smooth-spring" | "clean-fade" | "none";

export interface ColorTokens {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  contrastRatioText: number;
}

export interface TypographyTokens {
  displayFont: string;
  bodyFont: string;
  codeFont: string;
  displayFontFamily: string;
  bodyFontFamily: string;
  codeFontFamily: string;
}

export interface DesignFamilyMeta {
  id: DesignFamilyId;
  name: string;
  subtitle: string;
  description: string;
  category: "tech" | "editorial" | "creative" | "corporate";
  defaultPalette: ColorPaletteId;
  defaultTypography: TypographyPairingId;
  defaultHero: HeroLayoutId;
  defaultProjectsLayout: ProjectsLayoutId;
  defaultSkillsLayout: SkillsLayoutId;
  defaultMotion: MotionPresetId;
  tags: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  techStack?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  category?: string;
  role?: string;
  duration?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description?: string;
  location?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  duration?: string;
  description?: string;
}

export interface CertificateEntry {
  name: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface PortfolioData {
  fullName: string;
  tagline: string;
  bio: string;
  location?: string;
  email?: string;
  phone?: string;
  skills: string;
  softSkills?: string;
  tools?: string;
  socialLinks: string;
  resumeUrl?: string;
  photoUrl?: string | null;
  projects: ProjectEntry[];
  experienceList?: ExperienceEntry[];
  educationList?: EducationEntry[];
  certificatesList?: CertificateEntry[];
  experienceRaw?: string;
  educationRaw?: string;
  certificatesRaw?: string;
  servicesRaw?: string;
  achievementsRaw?: string;
}

export interface DesignLocks {
  content?: boolean;
  color?: boolean;
  font?: boolean;
  layout?: boolean;
  hero?: boolean;
}

export interface FactoryGenerationConfig {
  familyId?: DesignFamilyId;
  paletteId?: ColorPaletteId;
  typographyId?: TypographyPairingId;
  heroId?: HeroLayoutId;
  projectsLayoutId?: ProjectsLayoutId;
  skillsLayoutId?: SkillsLayoutId;
  motionId?: MotionPresetId;
  locks?: DesignLocks;
  mode?: "dark" | "light" | "system";
}

export interface PersonaDetectionResult {
  persona: PersonaId;
  confidence: number;
  label: string;
  reasoning: string;
  recommendedFamily: DesignFamilyId;
  alternativeFamilies: [DesignFamilyId, DesignFamilyId];
}

export interface ValidationIssue {
  type: "warning" | "error" | "info";
  field: string;
  message: string;
}

export interface FactoryValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  wcagContrastValid: boolean;
  wcagContrastScore: number;
  sanitizedData: PortfolioData;
}

export interface GeneratedPortfolioResult {
  files: {
    "index.html": string;
    "css/style.css": string;
    "js/script.js": string;
    "README.md": string;
    [key: string]: string;
  };
  htmlSrcDoc: string;
  meta: {
    familyId: DesignFamilyId;
    paletteId: ColorPaletteId;
    typographyId: TypographyPairingId;
    persona: PersonaId;
    generatedAt: string;
    contrastRatio: number;
  };
}
