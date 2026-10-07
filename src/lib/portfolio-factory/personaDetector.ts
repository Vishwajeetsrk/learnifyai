/**
 * LEARNIFY AI — PORTFOLIO FACTORY 4.0
 * Role & Persona Detection Engine
 */

import type { PersonaId, PersonaDetectionResult, PortfolioData, DesignFamilyId } from "./types";

interface KeywordRule {
  persona: PersonaId;
  label: string;
  recommendedFamily: DesignFamilyId;
  alternatives: [DesignFamilyId, DesignFamilyId];
  keywords: string[];
}

const PERSONA_RULES: KeywordRule[] = [
  {
    persona: "ai-engineer",
    label: "AI & Machine Learning Engineer",
    recommendedFamily: "ai-engineer",
    alternatives: ["bento-grid", "developer-dark"],
    keywords: [
      "ai", "machine learning", "ml", "deep learning", "llm", "pytorch", "tensorflow",
      "neural", "langchain", "rag", "hugging face", "computer vision", "nlp", "prompt",
      "model", "data science", "openai", "gemini", "claude", "scikit",
    ],
  },
  {
    persona: "product-designer",
    label: "Product & UI/UX Designer",
    recommendedFamily: "product-designer",
    alternatives: ["creative-portfolio", "minimal-editorial"],
    keywords: [
      "ui", "ux", "design", "figma", "product design", "wireframe", "prototype",
      "user research", "interaction", "design system", "visual design", "framer",
      "typography", "canva", "adobe",
    ],
  },
  {
    persona: "academic-researcher",
    label: "Researcher & Academic",
    recommendedFamily: "academic-research",
    alternatives: ["minimal-editorial", "modern-swiss"],
    keywords: [
      "research", "paper", "publication", "phd", "master", "thesis", "latex", "arxiv",
      "algorithm", "professor", "postdoc", "study", "journal", "academic", "conference",
    ],
  },
  {
    persona: "student-fresher",
    label: "Student & Aspiring Builder",
    recommendedFamily: "student-fresher",
    alternatives: ["modern-swiss", "developer-dark"],
    keywords: [
      "student", "fresher", "intern", "undergraduate", "graduate", "university",
      "college", "bachelor", "entry level", "junior", "learning", "coursework",
    ],
  },
  {
    persona: "freelancer",
    label: "Independent Consultant / Freelancer",
    recommendedFamily: "freelancer",
    alternatives: ["premium-saas", "creative-portfolio"],
    keywords: [
      "freelance", "contract", "consultant", "services", "client", "agency",
      "rates", "available for hire", "independent", "solutions",
    ],
  },
  {
    persona: "creator",
    label: "Content Creator & Educator",
    recommendedFamily: "creator",
    alternatives: ["creative-portfolio", "bento-grid"],
    keywords: [
      "youtube", "creator", "content", "educator", "writer", "streamer",
      "community", "podcast", "newsletter", "audience", "instructor",
    ],
  },
  {
    persona: "executive-pro",
    label: "Engineering Leader / Executive",
    recommendedFamily: "executive-pro",
    alternatives: ["premium-saas", "modern-swiss"],
    keywords: [
      "lead", "head of", "director", "manager", "vp", "chief", "cto",
      "executive", "leadership", "scale", "architect", "strategy", "management",
    ],
  },
  {
    persona: "frontend-dev",
    label: "Frontend & Web Architect",
    recommendedFamily: "bento-grid",
    alternatives: ["modern-swiss", "creative-portfolio"],
    keywords: [
      "frontend", "front-end", "css", "html", "tailwind", "vue", "angular",
      "svelte", "ui components", "animation", "motion", "web design",
    ],
  },
  {
    persona: "full-stack-dev",
    label: "Full-Stack Software Engineer",
    recommendedFamily: "full-stack-dev",
    alternatives: ["developer-dark", "premium-saas"],
    keywords: [
      "full stack", "fullstack", "react", "next.js", "node", "typescript",
      "javascript", "express", "sql", "postgresql", "mongodb", "docker",
      "api", "backend", "web development", "cloud",
    ],
  },
];

export function detectPersona(data: Partial<PortfolioData>): PersonaDetectionResult {
  const corpus = [
    data.fullName || "",
    data.tagline || "",
    data.bio || "",
    data.skills || "",
    data.tools || "",
    ...(data.projects || []).map((p) => `${p.name} ${p.description} ${p.techStack || ""}`),
  ]
    .join(" ")
    .toLowerCase();

  const scores: Record<PersonaId, number> = {
    "ai-engineer": 0,
    "product-designer": 0,
    "academic-researcher": 0,
    "student-fresher": 0,
    freelancer: 0,
    creator: 0,
    "executive-pro": 0,
    "frontend-dev": 0,
    "full-stack-dev": 0,
    "general-builder": 0,
  };

  const matchedKeywords: Record<PersonaId, string[]> = {
    "ai-engineer": [],
    "product-designer": [],
    "academic-researcher": [],
    "student-fresher": [],
    freelancer: [],
    creator: [],
    "executive-pro": [],
    "frontend-dev": [],
    "full-stack-dev": [],
    "general-builder": [],
  };

  PERSONA_RULES.forEach((rule) => {
    rule.keywords.forEach((kw) => {
      // Regex match on whole word or phrase boundary
      const regex = new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i");
      if (regex.test(corpus)) {
        scores[rule.persona] += 1;
        matchedKeywords[rule.persona].push(kw);
      }
    });
  });

  // Find highest scoring rule
  let highestPersona: PersonaId = "full-stack-dev";
  let maxScore = 0;

  (Object.keys(scores) as PersonaId[]).forEach((p) => {
    if (scores[p] > maxScore) {
      maxScore = scores[p];
      highestPersona = p;
    }
  });

  const matchedRule = PERSONA_RULES.find((r) => r.persona === highestPersona) || PERSONA_RULES[8]; // Full-Stack fallback
  const topKw = matchedKeywords[highestPersona].slice(0, 4);
  const confidence = maxScore >= 4 ? 0.95 : maxScore >= 2 ? 0.75 : 0.5;

  const reasoning =
    topKw.length > 0
      ? `Identified focus in ${topKw.join(", ")}.`
      : "Profile presents a versatile engineering and development background.";

  return {
    persona: matchedRule.persona,
    confidence,
    label: matchedRule.label,
    reasoning,
    recommendedFamily: matchedRule.recommendedFamily,
    alternativeFamilies: matchedRule.alternatives,
  };
}
