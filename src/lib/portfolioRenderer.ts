/**
 * LEARNIFY AI — CANONICAL PORTFOLIO RENDERER
 * Powered by Portfolio Factory 4.0
 * Generates the unified HTML, CSS, and JS files for portfolios, ensuring 100% parity
 * between Builder Preview, Code Studio IDE, Standalone Preview, and ZIP exports.
 */

import {
  generatePortfolioFromFactory,
  type FactoryGenerationConfig,
  type GeneratedPortfolioResult,
} from "./portfolio-factory";

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

/**
 * Generates canonical files using the Portfolio Factory 4.0 engine.
 */
export function generateCanonicalPortfolioFiles(
  portfolioData: PortfolioDataInput,
  projectsList: ProjectItemInput[] = [],
  photoPreview?: string | null,
  factoryConfig?: FactoryGenerationConfig,
): GeneratedPortfolioFiles {
  const result: GeneratedPortfolioResult = generatePortfolioFromFactory(
    {
      ...portfolioData,
      photoUrl: photoPreview,
      projects: projectsList.map((p) => ({
        name: p.name,
        description: p.description,
        techStack: p.techStack,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        imageUrl: p.imageUrl,
      })),
      experienceRaw: portfolioData.experience,
      educationRaw: portfolioData.education,
    },
    factoryConfig,
  );

  return result.files;
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
        `<style id="injected-style">\n${css}\n</style>`,
      );
    } else {
      doc = doc.replace("</head>", `<style id="injected-style">\n${css}\n</style></head>`);
    }
  }

  if (js) {
    if (doc.includes('src="./js/script.js"') || doc.includes('src="js/script.js"')) {
      doc = doc.replace(
        /<script[^>]+src=["']\.\/js\/script\.js["'][^>]*><\/script>/i,
        `<script id="injected-script">\n${js}\n</script>`,
      );
    } else {
      doc = doc.replace("</body>", `<script id="injected-script">\n${js}\n</script></body>`);
    }
  }

  return doc;
}
