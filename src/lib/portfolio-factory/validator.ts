/**
 * LEARNIFY AI — PORTFOLIO FACTORY 4.0
 * Data Validation, Link Sanitization, and WCAG Contrast Verification
 */

import { z } from "zod";
import type { PortfolioData, FactoryValidationResult, ValidationIssue, ColorTokens } from "./types";

export const ProjectSchema = z.object({
  name: z.string().default("Project"),
  description: z.string().default(""),
  techStack: z.string().optional().default(""),
  githubUrl: z.string().optional().default(""),
  liveUrl: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  category: z.string().optional(),
  role: z.string().optional(),
  duration: z.string().optional(),
});

export const PortfolioDataSchema = z.object({
  fullName: z.string().default("Developer"),
  tagline: z.string().default("Software Engineer & Builder"),
  bio: z.string().default("Building modern web software with high performance and clean architecture."),
  location: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  skills: z.string().default(""),
  softSkills: z.string().optional().default(""),
  tools: z.string().optional().default(""),
  socialLinks: z.string().default(""),
  resumeUrl: z.string().optional(),
  photoUrl: z.string().nullable().optional(),
  projects: z.array(ProjectSchema).default([]),
  experienceRaw: z.string().optional(),
  educationRaw: z.string().optional(),
  certificatesRaw: z.string().optional(),
  servicesRaw: z.string().optional(),
  achievementsRaw: z.string().optional(),
});

/**
 * Calculates relative luminance of an RGB/Hex color according to WCAG 2.1 specifications
 */
function getRelativeLuminance(hexColor: string): number {
  const cleanHex = hexColor.replace("#", "").trim();
  let r = 0;
  let g = 0;
  let b = 0;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  } else {
    return 0.5;
  }

  const adjust = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const R = adjust(r);
  const G = adjust(g);
  const B = adjust(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates WCAG contrast ratio between text and background color
 */
export function calculateContrastRatio(foregroundHex: string, backgroundHex: string): number {
  try {
    const l1 = getRelativeLuminance(foregroundHex);
    const l2 = getRelativeLuminance(backgroundHex);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 4.5;
  }
}

/**
 * Sanitizes external URLs: prevents javascript:, data:, and malformed protocols
 */
export function sanitizeSafeUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return null;

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return null;
  }

  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("mailto:")) {
    return trimmed;
  }

  // If user provided github.com/... or similar without protocol
  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Comprehensive Portfolio Data Validation & Quality Check
 */
export function validateAndSanitizePortfolioData(
  input: Partial<PortfolioData>,
  colors?: ColorTokens,
): FactoryValidationResult {
  const issues: ValidationIssue[] = [];

  const rawName = input.fullName?.trim() || "";
  if (!rawName) {
    issues.push({
      type: "info",
      field: "fullName",
      message: "Full name was missing; defaulted to 'Developer'.",
    });
  }

  // Sanitize projects
  const rawProjects = Array.isArray(input.projects) ? input.projects : [];
  const sanitizedProjects = rawProjects
    .map((p) => {
      const name = (p?.name || "").trim();
      const liveUrl = sanitizeSafeUrl(p?.liveUrl) || undefined;
      const githubUrl = sanitizeSafeUrl(p?.githubUrl) || undefined;
      return {
        ...p,
        name: name || "Featured Project",
        description: (p?.description || "").trim(),
        techStack: (p?.techStack || "").trim(),
        liveUrl,
        githubUrl,
        imageUrl: sanitizeSafeUrl(p?.imageUrl) || undefined,
      };
    })
    .filter((p) => p.name.length > 0);

  if (sanitizedProjects.length === 0) {
    issues.push({
      type: "warning",
      field: "projects",
      message: "No projects provided. A guided starter project will be rendered.",
    });
  }

  // Check WCAG contrast
  let contrastRatio = 7.5;
  let contrastValid = true;
  if (colors?.text && colors?.background) {
    contrastRatio = calculateContrastRatio(colors.text, colors.background);
    if (contrastRatio < 4.5) {
      contrastValid = false;
      issues.push({
        type: "warning",
        field: "contrast",
        message: `Color contrast ratio (${contrastRatio.toFixed(1)}:1) is below WCAG AA recommendation (4.5:1).`,
      });
    }
  }

  const sanitizedData: PortfolioData = {
    fullName: rawName || "Developer",
    tagline: input.tagline?.trim() || "Full-Stack Software Engineer & Builder",
    bio: input.bio?.trim() || "Designing and building reliable, scalable digital products and web systems.",
    location: input.location?.trim() || undefined,
    email: sanitizeSafeUrl(input.email) || undefined,
    phone: input.phone?.trim() || undefined,
    skills: input.skills?.trim() || "React, TypeScript, Node.js, Tailwind CSS, Python",
    softSkills: input.softSkills?.trim() || undefined,
    tools: input.tools?.trim() || undefined,
    socialLinks: input.socialLinks?.trim() || "",
    resumeUrl: sanitizeSafeUrl(input.resumeUrl) || undefined,
    photoUrl: sanitizeSafeUrl(input.photoUrl ?? undefined),
    projects: sanitizedProjects,
    experienceRaw: input.experienceRaw?.trim() || undefined,
    educationRaw: input.educationRaw?.trim() || undefined,
    certificatesRaw: input.certificatesRaw?.trim() || undefined,
    servicesRaw: input.servicesRaw?.trim() || undefined,
    achievementsRaw: input.achievementsRaw?.trim() || undefined,
  };

  return {
    valid: issues.filter((i) => i.type === "error").length === 0,
    issues,
    wcagContrastValid: contrastValid,
    wcagContrastScore: Number(contrastRatio.toFixed(2)),
    sanitizedData,
  };
}
