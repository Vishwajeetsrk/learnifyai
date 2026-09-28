/**
 * Canonical Technology & Software Brand Registry for Learnify AI
 * 
 * Provides verified metadata, official brand categorizations, and normalization
 * for course technologies, software suites, tools, and platforms.
 */

export type BrandType =
  | "software"
  | "language"
  | "framework"
  | "database"
  | "cloud"
  | "tool"
  | "design"
  | "productivity"
  | "ai";

export interface BrandEntry {
  id: string;
  canonicalName: string;
  shortName: string;
  brandType: BrandType;
  category: string;
  website: string;
  color: string;
  description: string;
  keywords: string[];
}

export const CANONICAL_BRANDS: BrandEntry[] = [
  {
    id: "microsoft-excel",
    canonicalName: "Microsoft Excel",
    shortName: "Excel",
    brandType: "software",
    category: "Productivity & Data",
    website: "https://www.microsoft.com/excel",
    color: "#107C41",
    description: "Spreadsheets, formulas, pivot tables, data modeling and automation.",
    keywords: ["excel", "sheets", "spreadsheet", "vba", "pivot"],
  },
  {
    id: "microsoft-word",
    canonicalName: "Microsoft Word",
    shortName: "Word",
    brandType: "software",
    category: "Productivity",
    website: "https://www.microsoft.com/word",
    color: "#185ABD",
    description: "Document creation, academic formatting, templates and professional publishing.",
    keywords: ["word", "doc", "docs", "document"],
  },
  {
    id: "microsoft-powerpoint",
    canonicalName: "Microsoft PowerPoint",
    shortName: "PowerPoint",
    brandType: "software",
    category: "Productivity & Presentation",
    website: "https://www.microsoft.com/powerpoint",
    color: "#C43E1C",
    description: "Executive presentation decks, animations, slide mastery and storytelling.",
    keywords: ["powerpoint", "ppt", "slides", "presentation"],
  },
  {
    id: "microsoft-power-bi",
    canonicalName: "Microsoft Power BI",
    shortName: "Power BI",
    brandType: "software",
    category: "Business Intelligence",
    website: "https://powerbi.microsoft.com",
    color: "#F2C811",
    description: "Interactive data visualization, DAX calculations, dashboards and analytics.",
    keywords: ["power-bi", "powerbi", "bi", "dax", "dashboards"],
  },
  {
    id: "python",
    canonicalName: "Python",
    shortName: "Python",
    brandType: "language",
    category: "Programming & Data Science",
    website: "https://www.python.org",
    color: "#3776AB",
    description: "General-purpose programming, data engineering, scripting, backend and AI.",
    keywords: ["python", "py", "pandas", "numpy", "fastapi", "django"],
  },
  {
    id: "java",
    canonicalName: "Java",
    shortName: "Java",
    brandType: "language",
    category: "Backend & Enterprise",
    website: "https://www.oracle.com/java",
    color: "#E76F00",
    description: "Object-oriented software, Spring Boot microservices and enterprise engineering.",
    keywords: ["java", "jvm", "spring", "spring boot"],
  },
  {
    id: "figma",
    canonicalName: "Figma",
    shortName: "Figma",
    brandType: "design",
    category: "UI/UX & Product Design",
    website: "https://www.figma.com",
    color: "#F24E1E",
    description: "UI/UX design systems, component libraries, responsive layouts and prototypes.",
    keywords: ["figma", "ui/ux", "design", "wireframe", "prototype"],
  },
  {
    id: "github",
    canonicalName: "GitHub",
    shortName: "GitHub",
    brandType: "tool",
    category: "DevOps & Collaboration",
    website: "https://github.com",
    color: "#24292F",
    description: "Git version control, repositories, collaboration, CI/CD Actions and code review.",
    keywords: ["git", "github", "version control", "pull request"],
  },
  {
    id: "google-workspace",
    canonicalName: "Google Workspace",
    shortName: "Google Workspace",
    brandType: "software",
    category: "Productivity & Cloud",
    website: "https://workspace.google.com",
    color: "#4285F4",
    description: "Google Docs, Sheets, Slides, Drive and cloud collaborative tools.",
    keywords: ["google", "workspace", "gsuite", "google sheets", "google docs"],
  },
  {
    id: "react",
    canonicalName: "React",
    shortName: "React",
    brandType: "framework",
    category: "Frontend Development",
    website: "https://react.dev",
    color: "#61DAFB",
    description: "Component-based web user interfaces, hooks, state and interactive SPAs.",
    keywords: ["react", "reactjs", "jsx", "tsx", "frontend"],
  },
  {
    id: "nextjs",
    canonicalName: "Next.js",
    shortName: "Next.js",
    brandType: "framework",
    category: "Full Stack Development",
    website: "https://nextjs.org",
    color: "#000000",
    description: "React framework for production with SSR, server components, and routing.",
    keywords: ["nextjs", "next.js", "next", "ssr"],
  },
  {
    id: "nodejs",
    canonicalName: "Node.js",
    shortName: "Node.js",
    brandType: "framework",
    category: "Backend Development",
    website: "https://nodejs.org",
    color: "#339933",
    description: "JavaScript runtime on Chrome V8 engine for scalable backend network apps.",
    keywords: ["nodejs", "node.js", "node", "express"],
  },
  {
    id: "html5",
    canonicalName: "HTML5",
    shortName: "HTML",
    brandType: "language",
    category: "Web Fundamentals",
    website: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    color: "#E34F26",
    description: "Semantic web structure, accessibility, forms, media and web standards.",
    keywords: ["html", "html5", "semantic"],
  },
  {
    id: "css3",
    canonicalName: "CSS3",
    shortName: "CSS",
    brandType: "language",
    category: "Web Styling",
    website: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    color: "#1572B6",
    description: "Responsive layouts, Flexbox, Grid, animations, variables and styling.",
    keywords: ["css", "css3", "flexbox", "grid", "animations"],
  },
  {
    id: "javascript",
    canonicalName: "JavaScript",
    shortName: "JavaScript",
    brandType: "language",
    category: "Web Programming",
    website: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    color: "#F7DF1E",
    description: "Modern ECMAScript, asynchronous programming, DOM, and web logic.",
    keywords: ["javascript", "js", "es6", "ecmascript"],
  },
  {
    id: "typescript",
    canonicalName: "TypeScript",
    shortName: "TypeScript",
    brandType: "language",
    category: "Typed JavaScript",
    website: "https://www.typescriptlang.org",
    color: "#3178C6",
    description: "Strongly typed programming language that builds on JavaScript at any scale.",
    keywords: ["typescript", "ts", "types"],
  },
  {
    id: "docker",
    canonicalName: "Docker",
    shortName: "Docker",
    brandType: "tool",
    category: "DevOps & Containers",
    website: "https://www.docker.com",
    color: "#2496ED",
    description: "OS-level virtualization delivering software in containers.",
    keywords: ["docker", "container", "containers", "dockerfile"],
  },
  {
    id: "aws",
    canonicalName: "Amazon Web Services",
    shortName: "AWS",
    brandType: "cloud",
    category: "Cloud Infrastructure",
    website: "https://aws.amazon.com",
    color: "#FF9900",
    description: "Cloud computing services, S3, EC2, Lambda and serverless backends.",
    keywords: ["aws", "amazon", "cloud", "ec2", "s3"],
  },
  {
    id: "azure",
    canonicalName: "Microsoft Azure",
    shortName: "Azure",
    brandType: "cloud",
    category: "Cloud Infrastructure",
    website: "https://azure.microsoft.com",
    color: "#0078D4",
    description: "Microsoft cloud platform for building, deploying and managing applications.",
    keywords: ["azure", "microsoft cloud"],
  },
  {
    id: "firebase",
    canonicalName: "Firebase",
    shortName: "Firebase",
    brandType: "cloud",
    category: "App Backend",
    website: "https://firebase.google.com",
    color: "#FFCA28",
    description: "Google cloud mobile/web app platform, Firestore, Auth and Hosting.",
    keywords: ["firebase", "firestore"],
  },
  {
    id: "supabase",
    canonicalName: "Supabase",
    shortName: "Supabase",
    brandType: "database",
    category: "Backend & Database",
    website: "https://supabase.com",
    color: "#3ECF8E",
    description: "Open source Firebase alternative with Postgres database and authentication.",
    keywords: ["supabase", "postgres", "rls"],
  },
  {
    id: "postgresql",
    canonicalName: "PostgreSQL",
    shortName: "Postgres",
    brandType: "database",
    category: "Relational Database",
    website: "https://www.postgresql.org",
    color: "#4169E1",
    description: "Advanced open source relational SQL database management system.",
    keywords: ["postgresql", "postgres", "sql", "relational"],
  },
  {
    id: "mysql",
    canonicalName: "MySQL",
    shortName: "MySQL",
    brandType: "database",
    category: "Relational Database",
    website: "https://www.mysql.com",
    color: "#4479A1",
    description: "Open-source relational database management system.",
    keywords: ["mysql", "sql", "database"],
  },
  {
    id: "tailwindcss",
    canonicalName: "Tailwind CSS",
    shortName: "Tailwind",
    brandType: "framework",
    category: "CSS Utility Framework",
    website: "https://tailwindcss.com",
    color: "#06B6D4",
    description: "Utility-first CSS framework for rapid modern UI development.",
    keywords: ["tailwind", "tailwindcss", "css utility"],
  },
  {
    id: "chatgpt",
    canonicalName: "ChatGPT",
    shortName: "ChatGPT",
    brandType: "ai",
    category: "Artificial Intelligence",
    website: "https://openai.com/chatgpt",
    color: "#10A37F",
    description: "Generative AI, prompt engineering, agentic workflows and OpenAI LLMs.",
    keywords: ["chatgpt", "openai", "gpt", "prompt engineering", "ai"],
  },
  {
    id: "claude",
    canonicalName: "Claude",
    shortName: "Claude",
    brandType: "ai",
    category: "Artificial Intelligence",
    website: "https://anthropic.com/claude",
    color: "#D97706",
    description: "Anthropic AI assistant, coding assistant, and advanced reasoning models.",
    keywords: ["claude", "anthropic", "mcp"],
  },
  {
    id: "vs-code",
    canonicalName: "Visual Studio Code",
    shortName: "VS Code",
    brandType: "tool",
    category: "Developer Environment",
    website: "https://code.visualstudio.com",
    color: "#007ACC",
    description: "Code editor redefined and optimized for building and debugging modern web apps.",
    keywords: ["vs-code", "vscode", "editor", "visual studio code"],
  },
];

/**
 * Resolves one or more canonical brands matching a course's slug, title, or category.
 */
export function resolveCourseBrands(course: {
  slug?: string;
  title?: string;
  category?: string;
  technology?: string;
}): BrandEntry[] {
  const norm = `${course.slug || ""} ${course.title || ""} ${course.category || ""} ${course.technology || ""}`
    .toLowerCase()
    .trim();

  const matched: BrandEntry[] = [];

  // Special multi-brand pairs
  if (norm.includes("word") && norm.includes("powerpoint")) {
    const word = CANONICAL_BRANDS.find((b) => b.id === "microsoft-word");
    const ppt = CANONICAL_BRANDS.find((b) => b.id === "microsoft-powerpoint");
    if (word && ppt) return [word, ppt];
  }
  if (norm.includes("html") && norm.includes("css")) {
    const h = CANONICAL_BRANDS.find((b) => b.id === "html5");
    const c = CANONICAL_BRANDS.find((b) => b.id === "css3");
    if (h && c) return [h, c];
  }
  if (norm.includes("chatgpt") && norm.includes("claude")) {
    const cg = CANONICAL_BRANDS.find((b) => b.id === "chatgpt");
    const cl = CANONICAL_BRANDS.find((b) => b.id === "claude");
    if (cg && cl) return [cg, cl];
  }

  for (const b of CANONICAL_BRANDS) {
    if (b.keywords.some((kw) => norm.includes(kw))) {
      matched.push(b);
    }
  }

  // Deduplicate and return top matches
  return matched.slice(0, 2);
}

/**
 * Retrieve a single brand entry by identifier.
 */
export function getCanonicalBrand(id: string): BrandEntry | null {
  const norm = (id || "").toLowerCase().trim();
  return CANONICAL_BRANDS.find((b) => b.id === norm || b.shortName.toLowerCase() === norm) ?? null;
}

/**
 * Returns all canonical brands for admin selection.
 */
export function getAllBrands(): BrandEntry[] {
  return CANONICAL_BRANDS;
}

/**
 * Normalized duration and schedule formatter.
 * Separates total content duration from recommended study schedule pacing.
 */
export function formatCourseDuration(
  durationMinutes: number = 0,
  recommendedDays?: number,
): {
  totalDuration: string;
  schedulePace: string;
  badgeLabel: string;
} {
  const mins = Math.max(0, Number(durationMinutes) || 0);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  let totalDuration = "";
  if (hours > 0 && remainingMins > 0) {
    totalDuration = `${hours}h ${remainingMins}m total`;
  } else if (hours > 0) {
    totalDuration = `${hours} hr${hours > 1 ? "s" : ""} total`;
  } else if (remainingMins > 0) {
    totalDuration = `${remainingMins} mins total`;
  } else {
    totalDuration = "Self-paced";
  }

  // Compute recommended days based on ~30-45 minutes per day study schedule if not explicitly given
  const days = recommendedDays || Math.max(2, Math.ceil(mins / 40));
  const dailyMins = Math.round(mins / days) || 30;

  const schedulePace = mins > 0 ? `${days}-day pace (${dailyMins}m/day)` : "Self-paced study";
  const badgeLabel = mins > 0 ? `${totalDuration} · ${days}-day pace` : "Self-paced";

  return {
    totalDuration,
    schedulePace,
    badgeLabel,
  };
}
