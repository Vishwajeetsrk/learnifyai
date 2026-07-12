import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Code,
  Palette,
  Share2,
  Brain,
  Sparkles,
  Database,
  Server,
  Cpu,
  Layers,
} from "lucide-react";

export const SKILL_LOGOS: Record<
  string,
  { devicon?: string; simpleIcons?: string; lucide?: React.ElementType }
> = {
  // Programming Languages
  Python: { devicon: "python/python-original.svg" },
  JavaScript: { devicon: "javascript/javascript-original.svg" },
  TypeScript: { devicon: "typescript/typescript-original.svg" },
  Java: { devicon: "java/java-original.svg" },
  "C++": { devicon: "cplusplus/cplusplus-original.svg" },
  "C#": { devicon: "csharp/csharp-original.svg" },
  C: { devicon: "c/c-original.svg" },
  Go: { devicon: "go/go-original-wordmark.svg" },
  Golang: { devicon: "go/go-original-wordmark.svg" },
  Rust: { devicon: "rust/rust-original.svg" },
  PHP: { devicon: "php/php-original.svg" },
  Ruby: { devicon: "ruby/ruby-original.svg" },
  Swift: { devicon: "swift/swift-original.svg" },
  Kotlin: { devicon: "kotlin/kotlin-original.svg" },
  Dart: { devicon: "dart/dart-original.svg" },
  Scala: { devicon: "scala/scala-original.svg" },
  R: { devicon: "r/r-original.svg" },
  HTML: { devicon: "html5/html5-original.svg" },
  HTML5: { devicon: "html5/html5-original.svg" },
  CSS: { devicon: "css3/css3-original.svg" },
  CSS3: { devicon: "css3/css3-original.svg" },
  SQL: { devicon: "azuresqldatabase/azuresqldatabase-original.svg" },

  // Web Frameworks & Frontend
  React: { devicon: "react/react-original.svg" },
  "React.js": { devicon: "react/react-original.svg" },
  "Next.js": { devicon: "nextjs/nextjs-original.svg" },
  Nextjs: { devicon: "nextjs/nextjs-original.svg" },
  Vue: { devicon: "vuejs/vuejs-original.svg" },
  "Vue.js": { devicon: "vuejs/vuejs-original.svg" },
  Angular: { devicon: "angular/angular-original.svg" },
  Svelte: { devicon: "svelte/svelte-original.svg" },
  "Tailwind CSS": { devicon: "tailwindcss/tailwindcss-original.svg" },
  Tailwind: { devicon: "tailwindcss/tailwindcss-original.svg" },
  Bootstrap: { devicon: "bootstrap/bootstrap-original.svg" },
  Sass: { devicon: "sass/sass-original.svg" },
  Webpack: { devicon: "webpack/webpack-original.svg" },
  Vite: { devicon: "vite/vite-original.svg" },

  // Backend & Databases
  "Node.js": { devicon: "nodejs/nodejs-original.svg" },
  Node: { devicon: "nodejs/nodejs-original.svg" },
  Express: { devicon: "express/express-original.svg" },
  "Express.js": { devicon: "express/express-original.svg" },
  Django: { devicon: "django/django-plain.svg" },
  Flask: { devicon: "flask/flask-original.svg" },
  FastAPI: { devicon: "fastapi/fastapi-original.svg" },
  Spring: { devicon: "spring/spring-original.svg" },
  "Spring Boot": { devicon: "spring/spring-original.svg" },
  Laravel: { devicon: "laravel/laravel-original.svg" },
  PostgreSQL: { devicon: "postgresql/postgresql-original.svg" },
  Postgres: { devicon: "postgresql/postgresql-original.svg" },
  MySQL: { devicon: "mysql/mysql-original.svg" },
  MongoDB: { devicon: "mongodb/mongodb-original.svg" },
  Redis: { devicon: "redis/redis-original.svg" },
  GraphQL: { devicon: "graphql/graphql-plain.svg" },

  // DevOps & Cloud
  Docker: { devicon: "docker/docker-original.svg" },
  Kubernetes: { devicon: "kubernetes/kubernetes-original.svg" },
  K8s: { devicon: "kubernetes/kubernetes-original.svg" },
  AWS: { devicon: "amazonwebservices/amazonwebservices-original-wordmark.svg" },
  "Amazon Web Services": { devicon: "amazonwebservices/amazonwebservices-original-wordmark.svg" },
  Azure: { devicon: "azure/azure-original.svg" },
  GCP: { simpleIcons: "googlecloud" },
  "Google Cloud": { simpleIcons: "googlecloud" },
  Linux: { devicon: "linux/linux-original.svg" },
  Git: { devicon: "git/git-original.svg" },
  GitHub: { devicon: "github/github-original.svg" },
  "Git & GitHub": { devicon: "github/github-original.svg" },
  GitLab: { devicon: "gitlab/gitlab-original.svg" },
  Nginx: { devicon: "nginx/nginx-original.svg" },
  Terraform: { devicon: "terraform/terraform-original.svg" },
  Jenkins: { devicon: "jenkins/jenkins-original.svg" },

  // AI & Data Science
  "Prompt Engineering": { lucide: Sparkles },
  "Generative AI": { lucide: Brain },
  "Agentic AI": { lucide: Brain },
  AI: { lucide: Brain },
  ML: { lucide: Cpu },
  NumPy: { devicon: "numpy/numpy-original.svg" },
  Pandas: { devicon: "pandas/pandas-original.svg" },
  TensorFlow: { devicon: "tensorflow/tensorflow-original.svg" },
  PyTorch: { devicon: "pytorch/pytorch-original.svg" },
  OpenAI: { simpleIcons: "openai" },
  Claude: { simpleIcons: "anthropic" },
  Anthropic: { simpleIcons: "anthropic" },
  HuggingFace: { simpleIcons: "huggingface" },
  LangChain: { simpleIcons: "langchain" },

  // Mobile & Other Tools
  "React Native": { devicon: "react/react-original.svg" },
  Flutter: { devicon: "flutter/flutter-original.svg" },
  Android: { devicon: "android/android-original.svg" },
  iOS: { devicon: "apple/apple-original.svg" },
  Figma: { devicon: "figma/figma-original.svg" },
  Canva: { simpleIcons: "canva" },
  Supabase: { simpleIcons: "supabase" },
  Firebase: { simpleIcons: "firebase" },
  Vercel: { simpleIcons: "vercel" },
  Netlify: { simpleIcons: "netlify" },
  "VS Code": { devicon: "vscode/vscode-original.svg" },
  "Command Line": { lucide: Terminal },
  "UI/UX": { lucide: Palette },
  "API Design": { lucide: Share2 },
};

function getNormalizedLogo(skill: string) {
  if (SKILL_LOGOS[skill]) return SKILL_LOGOS[skill];

  // Fuzzy match
  const clean = skill.trim();
  const lower = clean.toLowerCase();

  for (const [key, val] of Object.entries(SKILL_LOGOS)) {
    if (key.toLowerCase() === lower) return val;
  }

  // Common keyword matchers
  if (lower.includes("python")) return SKILL_LOGOS["Python"];
  if (lower.includes("react")) return SKILL_LOGOS["React"];
  if (lower.includes("next")) return SKILL_LOGOS["Next.js"];
  if (lower.includes("node")) return SKILL_LOGOS["Node.js"];
  if (lower.includes("docker")) return SKILL_LOGOS["Docker"];
  if (lower.includes("aws") || lower.includes("amazon")) return SKILL_LOGOS["AWS"];
  if (lower.includes("sql") || lower.includes("database")) return SKILL_LOGOS["SQL"];
  if (lower.includes("tailwind")) return SKILL_LOGOS["Tailwind CSS"];
  if (lower.includes("git")) return SKILL_LOGOS["Git"];
  if (lower.includes("figma") || lower.includes("design")) return SKILL_LOGOS["Figma"];
  if (lower.includes("ai") || lower.includes("llm") || lower.includes("prompt"))
    return SKILL_LOGOS["Generative AI"];

  // Direct simpleicon slug attempt
  const simpleSlug = lower.replace(/[^a-z0-9]/g, "");
  return { simpleIcons: simpleSlug };
}

export function SkillBadge({
  skill,
  className = "",
  variant = "secondary",
  size = "sm",
}: {
  skill: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const iconInfo = getNormalizedLogo(skill);
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";

  return (
    <Badge
      variant={variant}
      className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg shadow-xs border transition-all hover:scale-105 ${className}`}
    >
      {iconInfo?.devicon && (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconInfo.devicon}`}
          alt={`${skill} logo`}
          className={`${sizeClass} object-contain shrink-0`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {iconInfo?.simpleIcons && !iconInfo.devicon && (
        <img
          src={`https://cdn.simpleicons.org/${iconInfo.simpleIcons}`}
          alt={`${skill} logo`}
          className={`${sizeClass} object-contain shrink-0`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {iconInfo?.lucide && <iconInfo.lucide className={`${sizeClass} shrink-0 text-primary`} />}
      <span className="font-semibold text-[11px] tracking-tight">{skill}</span>
    </Badge>
  );
}
