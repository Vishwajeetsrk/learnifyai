import React from "react";
import { cn } from "@/lib/utils";
import {
  _React,
  _Vue,
  _Svelte,
  Nextjs,
  Angular,
  Typescript,
  Javascript,
  Python,
  Java,
  Wordpress,
  Tailwind,
  Nodejs,
  Docker,
  Kubernetes,
  Aws,
  MicrosoftAzure,
  GoogleCloud,
  CPlusplus,
  CSharp,
  Go,
  Rust,
  Php,
  Ruby,
  Swift,
  Kotlin,
  Flutter,
  Dart,
  Figma,
  Git,
  Github,
  VisualStudioCode,
  LinuxTux,
  Bash,
  Mongodb,
  Postgresql,
  Mysql,
  Redis,
  Supabase,
  Firebase,
  Graphql,
  Pandas,
  Numpy,
  Tensorflow,
  Pytorch,
  Spring,
  Fastapi,
  Django,
  Flask,
  Openai,
  Claude,
  GoogleGemini,
  GoogleWorkspace,
  Html5,
  Css3,
} from "@dev.icons/react";

// Canonical React Icon components exported for direct use across the app
export const ReactIcon = _React;
export const VueIcon = _Vue;
export const SvelteIcon = _Svelte;
export const NextjsIcon = Nextjs;
export const TypescriptIcon = Typescript;
export const JavascriptIcon = Javascript;
export const PythonIcon = Python;
export const JavaIcon = Java;
export const WordpressIcon = Wordpress;
export const TailwindIcon = Tailwind;
export const NodejsIcon = Nodejs;
export const DockerIcon = Docker;
export const KubernetesIcon = Kubernetes;
export const AwsIcon = Aws;
export const AzureIcon = MicrosoftAzure;
export const GoogleCloudIcon = GoogleCloud;
export const FigmaIcon = Figma;

export type KnownBrand =
  | "microsoft-excel"
  | "microsoft-word"
  | "microsoft-powerpoint"
  | "microsoft-power-bi"
  | "python"
  | "java"
  | "figma"
  | "google-workspace"
  | "chatgpt"
  | "claude"
  | "gemini"
  | "google-gemini"
  | "antigravity"
  | "google-antigravity"
  | "linear"
  | "codex"
  | "sentry"
  | "azure-sql"
  | "powershell"
  | "vite"
  | "zoom"
  | "supabase"
  | "n8n"
  | "ollama"
  | "search-console"
  | "google-search-console"
  | "google-analytics"
  | "html5"
  | "css3"
  | "javascript"
  | "typescript"
  | "vs-code"
  | "git"
  | "github"
  | "react"
  | "nextjs"
  | "vuejs"
  | "svelte"
  | "angular"
  | "nodejs"
  | "docker"
  | "kubernetes"
  | "aws"
  | "azure"
  | "googlecloud"
  | "firebase"
  | "postgresql"
  | "mysql"
  | "mongodb"
  | "redis"
  | "graphql"
  | "tailwindcss"
  | "wordpress"
  | "cplusplus"
  | "csharp"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "swift"
  | "kotlin"
  | "flutter"
  | "dart"
  | "linux"
  | "bash"
  | "pandas"
  | "numpy"
  | "tensorflow"
  | "pytorch"
  | "spring"
  | "cybersecurity"
  | "ai"
  | "ai-llms"
  | string;

interface CourseBrandLogoProps {
  brand: KnownBrand | string;
  size?: number | string;
  className?: string;
  variant?: "color" | "monochrome";
}

/**
 * Direct SVG Component mapping from @dev.icons/react.
 * Provides pixel-perfect vector SVGs with zero font loading latency.
 */
const DEVICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  react: _React,
  nextjs: Nextjs,
  "next.js": Nextjs,
  next: Nextjs,
  vue: _Vue,
  vuejs: _Vue,
  svelte: _Svelte,
  angular: Angular,
  angularjs: Angular,
  python: Python,
  javascript: Javascript,
  js: Javascript,
  typescript: Typescript,
  ts: Typescript,
  html5: Html5,
  html: Html5,
  css3: Css3,
  css: Css3,
  tailwindcss: Tailwind,
  tailwind: Tailwind,
  nodejs: Nodejs,
  node: Nodejs,
  docker: Docker,
  kubernetes: Kubernetes,
  k8s: Kubernetes,
  aws: Aws,
  amazon: Aws,
  azure: MicrosoftAzure,
  googlecloud: GoogleCloud,
  gcp: GoogleCloud,
  java: Java,
  cplusplus: CPlusplus,
  cpp: CPlusplus,
  "c++": CPlusplus,
  csharp: CSharp,
  "c#": CSharp,
  go: Go,
  golang: Go,
  rust: Rust,
  php: Php,
  ruby: Ruby,
  swift: Swift,
  kotlin: Kotlin,
  flutter: Flutter,
  dart: Dart,
  figma: Figma,
  git: Git,
  github: Github,
  vscode: VisualStudioCode,
  "vs-code": VisualStudioCode,
  linux: LinuxTux,
  bash: Bash,
  shell: Bash,
  mongodb: Mongodb,
  mongo: Mongodb,
  postgresql: Postgresql,
  postgres: Postgresql,
  mysql: Mysql,
  redis: Redis,
  supabase: Supabase,
  firebase: Firebase,
  graphql: Graphql,
  wordpress: Wordpress,
  wp: Wordpress,
  pandas: Pandas,
  numpy: Numpy,
  tensorflow: Tensorflow,
  pytorch: Pytorch,
  spring: Spring,
  fastapi: Fastapi,
  django: Django,
  flask: Flask,
  openai: Openai,
  chatgpt: Openai,
  claude: Claude,
  gemini: GoogleGemini,
  "google-workspace": GoogleWorkspace,
};

/**
 * Devicon CSS mapping table for technology and developer tool brands.
 * Maps normalized brand slugs to canonical Devicon classes.
 */
const DEVICON_CLASSES: Record<string, string> = {
  react: "devicon-react-original colored",
  nextjs: "devicon-nextjs-plain colored",
  "next.js": "devicon-nextjs-plain colored",
  next: "devicon-nextjs-plain colored",
  vue: "devicon-vuejs-plain colored",
  vuejs: "devicon-vuejs-plain colored",
  svelte: "devicon-svelte-plain colored",
  angular: "devicon-angularjs-plain colored",
  angularjs: "devicon-angularjs-plain colored",
  python: "devicon-python-plain colored",
  javascript: "devicon-javascript-plain colored",
  js: "devicon-javascript-plain colored",
  typescript: "devicon-typescript-plain colored",
  ts: "devicon-typescript-plain colored",
  html5: "devicon-html5-plain colored",
  html: "devicon-html5-plain colored",
  css3: "devicon-css3-plain colored",
  css: "devicon-css3-plain colored",
  tailwindcss: "devicon-tailwindcss-plain colored",
  tailwind: "devicon-tailwindcss-plain colored",
  nodejs: "devicon-nodejs-plain colored",
  node: "devicon-nodejs-plain colored",
  docker: "devicon-docker-plain colored",
  kubernetes: "devicon-kubernetes-plain colored",
  k8s: "devicon-kubernetes-plain colored",
  aws: "devicon-amazonwebservices-plain-wordmark colored",
  amazon: "devicon-amazonwebservices-plain-wordmark colored",
  azure: "devicon-azure-plain colored",
  googlecloud: "devicon-googlecloud-plain colored",
  gcp: "devicon-googlecloud-plain colored",
  java: "devicon-java-plain colored",
  cplusplus: "devicon-cplusplus-plain colored",
  cpp: "devicon-cplusplus-plain colored",
  "c++": "devicon-cplusplus-plain colored",
  csharp: "devicon-csharp-plain colored",
  "c#": "devicon-csharp-plain colored",
  go: "devicon-go-plain colored",
  golang: "devicon-go-plain colored",
  rust: "devicon-rust-original colored",
  php: "devicon-php-plain colored",
  ruby: "devicon-ruby-plain colored",
  rails: "devicon-rails-plain colored",
  swift: "devicon-swift-plain colored",
  kotlin: "devicon-kotlin-plain colored",
  flutter: "devicon-flutter-plain colored",
  dart: "devicon-dart-plain colored",
  figma: "devicon-figma-plain colored",
  git: "devicon-git-plain colored",
  github: "devicon-github-original colored",
  vscode: "devicon-vscode-plain colored",
  "vs-code": "devicon-vscode-plain colored",
  linux: "devicon-linux-plain colored",
  bash: "devicon-bash-plain colored",
  shell: "devicon-bash-plain colored",
  mongodb: "devicon-mongodb-plain colored",
  mongo: "devicon-mongodb-plain colored",
  postgresql: "devicon-postgresql-plain colored",
  postgres: "devicon-postgresql-plain colored",
  mysql: "devicon-mysql-plain colored",
  sql: "devicon-mysql-plain colored",
  redis: "devicon-redis-plain colored",
  supabase: "devicon-supabase-plain colored",
  firebase: "devicon-firebase-plain colored",
  graphql: "devicon-graphql-plain colored",
  wordpress: "devicon-wordpress-plain colored",
  pandas: "devicon-pandas-plain colored",
  numpy: "devicon-numpy-plain colored",
  tensorflow: "devicon-tensorflow-original colored",
  pytorch: "devicon-pytorch-original colored",
  bootstrap: "devicon-bootstrap-plain colored",
  sass: "devicon-sass-original colored",
  vite: "devicon-vitejs-plain colored",
  webpack: "devicon-webpack-plain colored",
  fastapi: "devicon-fastapi-plain colored",
  django: "devicon-django-plain colored",
  flask: "devicon-flask-original colored",
  spring: "devicon-spring-plain colored",
  electron: "devicon-electron-original colored",
};

export function getBrandDisplayName(brand: string): string {
  const norm = (brand || "").toLowerCase().trim();
  const map: Record<string, string> = {
    "microsoft-excel": "Microsoft Excel",
    "microsoft-word": "Microsoft Word",
    "microsoft-powerpoint": "PowerPoint",
    "microsoft-power-bi": "Power BI",
    "google-workspace": "Google Workspace",
    chatgpt: "ChatGPT",
    claude: "Claude AI",
    gemini: "Google Gemini",
    "google-gemini": "Google Gemini",
    antigravity: "Google Antigravity",
    "google-antigravity": "Google Antigravity",
    linear: "Linear",
    codex: "OpenAI Codex",
    sentry: "Sentry",
    "azure-sql": "Azure SQL",
    powershell: "PowerShell",
    vite: "Vite",
    zoom: "Zoom",
    supabase: "Supabase",
    n8n: "n8n",
    ollama: "Ollama",
    firebase: "Google Firebase",
    "google-firebase": "Google Firebase",
    "search-console": "Google Search Console",
    "google-search-console": "Google Search Console",
    "google-analytics": "Google Analytics",
    analytics: "Google Analytics",
    "ai-llms": "AI & LLMs",
    ai: "AI & LLMs",
    react: "React",
    nextjs: "Next.js",
    vuejs: "Vue.js",
    svelte: "Svelte",
    angular: "Angular",
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    html5: "HTML5",
    css3: "CSS3",
    tailwindcss: "Tailwind CSS",
    nodejs: "Node.js",
    docker: "Docker",
    kubernetes: "Kubernetes",
    aws: "AWS Cloud",
    azure: "Microsoft Azure",
    googlecloud: "Google Cloud",
    java: "Java",
    cplusplus: "C++",
    csharp: "C#",
    go: "Go",
    rust: "Rust",
    php: "PHP",
    ruby: "Ruby",
    swift: "Swift",
    kotlin: "Kotlin",
    flutter: "Flutter",
    dart: "Dart",
    figma: "Figma",
    git: "Git",
    github: "GitHub",
    "vs-code": "VS Code",
    linux: "Linux",
    bash: "Bash",
    mongodb: "MongoDB",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    redis: "Redis",
    graphql: "GraphQL",
    wordpress: "WordPress",
    pandas: "Pandas",
    numpy: "NumPy",
    tensorflow: "TensorFlow",
    pytorch: "PyTorch",
    spring: "Spring Boot",
    cybersecurity: "Cybersecurity",
  };
  return map[norm] || brand.charAt(0).toUpperCase() + brand.slice(1);
}

/**
 * Authentic, canonical technology & software brand marks powered by Devicon & vector SVGs.
 * Conforms to official guidelines, preserving accurate geometries, colors, and aspect ratios.
 */
export function CourseBrandLogo({
  brand,
  size = 32,
  className,
  variant = "color",
}: CourseBrandLogoProps) {
  const raw = (brand || "").trim();
  const norm = raw.toLowerCase().replace(/\s+/g, "-");

  // Direct Devicon class pass-through (e.g. <i class="devicon devicon-react" />)
  if (raw.startsWith("devicon-") || raw.startsWith("devicon ")) {
    return (
      <i
        className={cn("shrink-0 leading-none inline-block", raw, className)}
        style={{ fontSize: typeof size === "number" ? `${size}px` : size }}
        role="img"
        aria-label={raw}
      />
    );
  }

  // 1. Microsoft Suite Authentic Marks (Official Guidelines)
  if (norm.includes("excel") || norm === "microsoft-excel") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Excel Logo"
      >
        <rect x="2" y="4" width="28" height="24" rx="3" fill="#107C41" />
        <rect x="14" y="8" width="13" height="16" rx="1.5" fill="#21A366" />
        <path d="M14 13.5H27M14 18.5H27M20.5 8V24" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
        <rect x="4" y="7" width="14" height="18" rx="2" fill="#0E6435" />
        <path
          d="M7.5 11.5L14.5 20.5M14.5 11.5L7.5 20.5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm.includes("word") && !norm.includes("wordpress") || norm === "microsoft-word") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Word Logo"
      >
        <rect x="2" y="4" width="28" height="24" rx="3" fill="#185ABD" />
        <rect x="14" y="8" width="13" height="16" rx="1.5" fill="#2B79D9" />
        <path d="M17 12H24M17 16H24M17 20H22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
        <rect x="4" y="7" width="14" height="18" rx="2" fill="#103F91" />
        <path
          d="M6.5 12L8.5 20L11 13.5L13.5 20L15.5 12"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm.includes("powerpoint") || norm === "microsoft-powerpoint") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft PowerPoint Logo"
      >
        <rect x="2" y="4" width="28" height="24" rx="3" fill="#C43E1C" />
        <rect x="14" y="8" width="13" height="16" rx="1.5" fill="#D83B01" />
        <circle cx="20.5" cy="16" r="5" fill="#F8A88A" />
        <path d="M20.5 16V11A5 5 0 0 1 25.5 16H20.5Z" fill="#FFFFFF" />
        <rect x="4" y="7" width="14" height="18" rx="2" fill="#982C12" />
        <path
          d="M8.5 12H12C13.5 12 14.5 13 14.5 14.5C14.5 16 13.5 17 12 17H8.5V20M8.5 12V20"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm.includes("power-bi") || norm.includes("powerbi") || norm === "microsoft-power-bi") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Power BI Logo"
      >
        <rect x="2" y="3" width="28" height="26" rx="4" fill="#201F1E" />
        <rect x="7" y="16" width="4.5" height="10" rx="1.2" fill="#E6AD10" />
        <rect x="13.5" y="11" width="4.5" height="15" rx="1.2" fill="#F2C811" />
        <rect x="20" y="6" width="4.5" height="20" rx="1.2" fill="#F9DE59" />
      </svg>
    );
  }

  if (norm.includes("google") || norm.includes("workspace")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Workspace Logo"
      >
        <path
          d="M26.5 16.3C26.5 15.5 26.4 14.8 26.3 14H16V18.2H21.9C21.6 19.7 20.8 20.9 19.5 21.8V24.8H23.4C25.7 22.7 26.5 19.8 26.5 16.3Z"
          fill="#4285F4"
        />
        <path
          d="M16 27C19 27 21.5 26 23.4 24.8L19.5 21.8C18.4 22.5 17.3 22.9 16 22.9C13.1 22.9 10.7 21 9.8 18.4H5.8V21.5C7.7 25.1 11.5 27 16 27Z"
          fill="#34A853"
        />
        <path
          d="M9.8 18.4C9.6 17.6 9.5 16.8 9.5 16C9.5 15.2 9.6 14.4 9.8 13.6V10.5H5.8C5 12.1 4.5 14 4.5 16C4.5 18 5 19.9 5.8 21.5L9.8 18.4Z"
          fill="#FBBC05"
        />
        <path
          d="M16 9.1C17.6 9.1 19.1 9.7 20.2 10.7L23.4 7.5C21.4 5.7 18.9 4.6 16 4.6C11.5 4.6 7.7 6.9 5.8 10.5L9.8 13.6C10.7 11 13.1 9.1 16 9.1Z"
          fill="#EA4335"
        />
      </svg>
    );
  }

  // 2. Modern Developer, Cloud & AI Tool Marks (Official Vectors)

  // Linear App
  if (norm === "linear" || norm.includes("linear-app")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="#5E6AD2"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Linear Logo"
      >
        <path d="M66.12 83.85c-2.709 2.976-2.53 7.54.313 10.383l351.336 351.33c2.843 2.843 7.406 3.022 10.377.318 51.516-46.876 83.856-114.464 83.856-189.602C512.002 114.74 397.26 0 255.718 0 180.579 0 112.996 32.335 66.12 83.85zm-43.914 66.677c-1.296 2.863-.64 6.223 1.582 8.441l329.24 329.245c2.223 2.223 5.578 2.879 8.441 1.578a254.663 254.663 0 0022.204-11.407c4.271-2.468 4.927-8.297 1.439-11.785L45.397 126.889c-3.488-3.487-9.311-2.832-11.78 1.44a256.04 256.04 0 00-11.411 22.198zm-19.97 94.279c-1.542-1.542-2.367-3.667-2.218-5.844a255.212 255.212 0 013.79-30.04c1.1-5.89 8.302-7.934 12.538-3.698l290.427 290.431c4.24 4.236 2.197 11.438-3.698 12.539a257.391 257.391 0 01-30.04 3.79 7.559 7.559 0 01-5.84-2.218L2.236 244.806zm17.818 71.517c-5.29-5.291-13.829-.733-11.893 6.494 23.612 88.061 92.957 157.411 181.018 181.018 7.232 1.941 11.79-6.597 6.5-11.893L20.054 316.322z" />
      </svg>
    );
  }

  // Codex
  if (norm === "codex" || norm.includes("openai-codex")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Codex Logo"
      >
        <g transform="scale(32)">
          <path d="M13.003 0H2.997A3.012 3.012 0 000 2.997v10.006A3.012 3.012 0 002.997 16h10.006A3.012 3.012 0 0016 13.003V2.997A3.012 3.012 0 0013.003 0z" fill="#0d1117" fillRule="nonzero" />
          <path d="M9.064 3.344a4.578 4.578 0 012.285-.312c1 .115 1.891.54 2.673 1.275.01.01.024.017.037.021a.104.104 0 00.043 0 4.556 4.556 0 013.046.275l.047.022.116.057a4.585 4.585 0 012.188 2.399c.209.51.313 1.041.315 1.595.015.412-.03.824-.134 1.223a.124.124 0 00.03.115c.594.607.988 1.33 1.183 2.17.289 1.425-.007 2.71-.887 3.854l-.136.166a4.548 4.548 0 01-2.201 1.388.12.12 0 00-.081.076c-.191.551-.383 1.023-.74 1.494-.9 1.187-2.222 1.846-3.711 1.838-1.187-.006-2.239-.44-3.157-1.302a.109.109 0 00-.105-.024c-.388.125-.78.143-1.204.138a4.438 4.438 0 01-1.945-.466 4.553 4.553 0 01-1.61-1.335c-.152-.202-.303-.392-.414-.617a5.797 5.797 0 01-.37-.961 4.575 4.575 0 01-.014-2.298.133.133 0 00.006-.056.083.083 0 00-.027-.048 4.467 4.467 0 01-1.034-1.651 3.898 3.898 0 01-.251-1.192 5.193 5.193 0 01.141-1.6c.337-1.112.982-1.985 1.933-2.618.212-.141.413-.251.601-.33a6.29 6.29 0 01.646-.227.1.1 0 00.065-.066 4.512 4.512 0 01.829-1.615 4.54 4.54 0 011.837-1.388zm3.482 10.565a.64.64 0 00-.601.636.64.64 0 00.601.636h3.636l.036.001a.64.64 0 00.637-.637.64.64 0 00-.637-.637l-.036.001h-3.636zM8.462 9.23a.64.64 0 00-.543-.304.64.64 0 00-.563.935l1.272 2.224-1.266 2.136a.638.638 0 001.095.649l1.454-2.455a.637.637 0 00.005-.64L8.462 9.23z" fill="url(#brand_codex_grad)" fillRule="nonzero" transform="scale(.66667)" />
        </g>
        <defs>
          <linearGradient id="brand_codex_grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 18 -18 0 12 3)">
            <stop offset="0" stopColor="#b1a7ff" />
            <stop offset=".5" stopColor="#7a9dff" />
            <stop offset="1" stopColor="#3941ff" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Sentry
  if (norm === "sentry") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Sentry Logo"
      >
        <path d="M295.78 58.193a46.797 46.797 0 00-40.042-22.624 46.797 46.797 0 00-40.041 22.624L149.828 171.01c102.267 51.063 170.027 152.829 177.685 266.877h-46.248c-7.648-97.761-66.63-184.442-154.761-227.436L65.541 315.86c49.491 22.192 84.367 68.18 92.396 121.826H51.727c-3.965-.28-7.068-3.614-7.068-7.588 0-1.231.29-2.433.86-3.524l29.431-50.052a107.422 107.422 0 00-33.634-19.02l-29.13 50.053a45.41 45.41 0 00-6.187 22.893c0 16.367 8.849 31.523 23.104 39.571a46.665 46.665 0 0022.623 6.007h145.451c5.486-67.72-24.945-133.58-80.083-173.28l23.124-40.042c69.603 47.8 108.883 129.084 103.107 213.322h123.228c5.836-127.633-56.859-249.13-164.27-318.331l46.748-80.083c2.153-3.614 6.887-4.825 10.511-2.703 5.306 2.903 203.111 348.062 206.815 352.066a7.623 7.623 0 01.961 3.704c0 4.174-3.433 7.607-7.608 7.607H411.9c.601 12.744.601 25.457 0 38.14h48.15c25.207 0 45.948-20.741 45.948-45.948v-.2a44.95 44.95 0 00-6.206-22.824L295.78 58.193z" fill="#362d59" fillRule="nonzero" />
      </svg>
    );
  }

  // Azure SQL Database
  if (norm === "azure-sql" || norm === "azuresql" || norm === "azure-database") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Azure SQL Logo"
      >
        <path d="M14 7.996c-5.507 0-9.971-1.556-9.971-3.609v19.226c0 1.976 4.386 3.578 9.831 3.609H14c5.507 0 9.971-1.555 9.971-3.609V4.387c0 2.006-4.464 3.609-9.971 3.609z" fill="url(#brand_azuresql_linear)" fillRule="nonzero" transform="matrix(17.85716 0 0 17.85716 5.999 5.999)" />
        <path d="M434.053 84.338c0 35.822-79.715 64.447-178.054 64.447-98.34 0-178.054-27.786-178.054-64.447 0-36.679 79.715-64.446 178.054-64.446 98.34 0 178.054 27.767 178.054 64.446z" fill="#e8e8e8" fillRule="nonzero" />
        <path d="M392.66 79.052c0 22.786-61.375 41.108-136.661 41.108s-136.66-18.322-136.66-41.108c0-22.767 61.374-40.839 136.66-40.839s136.66 18.34 136.66 40.84z" fill="#50e6ff" fillRule="nonzero" />
        <path d="M255.999 89.338a320.67 320.67 0 00-108.054 15.822 316.711 316.711 0 00108.054 15 309.268 309.268 0 00108.054-16.108 328.607 328.607 0 00-108.054-14.714z" fill="#198ab3" fillRule="nonzero" />
        <path d="M20.067 17.733v-5.289h-1.4v6.425h3.826v-1.136h-2.426zM8.96 15.136a2.864 2.864 0 01-.793-.483.672.672 0 01-.187-.497.528.528 0 01.233-.467c.192-.132.421-.198.654-.187.554-.025 1.1.134 1.555.451v-1.337a4.005 4.005 0 00-1.555-.249 2.548 2.548 0 00-1.696.529 1.67 1.67 0 00-.653 1.384c0 .793.497 1.415 1.555 1.882.344.146.668.334.965.56a.656.656 0 01.233.498.583.583 0 01-.249.482 1.255 1.255 0 01-.7.171 2.578 2.578 0 01-1.695-.653v1.447a3.37 3.37 0 001.664.373 2.926 2.926 0 001.836-.513 1.69 1.69 0 00.513-1.416 1.638 1.638 0 00-.389-1.089 3.743 3.743 0 00-1.291-.886zm8.151 2.473a3.64 3.64 0 00.513-1.96A3.608 3.608 0 0017.111 14a2.817 2.817 0 00-1.089-1.167 3.113 3.113 0 00-1.555-.404 3.278 3.278 0 00-1.68.42A2.892 2.892 0 0011.651 14a3.826 3.826 0 00-.404 1.773c.003.541.131 1.073.373 1.556.237.48.61.881 1.073 1.151.47.287 1.006.447 1.556.467l1.338 1.555h1.882l-1.913-1.711a2.784 2.784 0 001.555-1.182zm-1.555-.389a1.463 1.463 0 01-1.183.544 1.424 1.424 0 01-1.182-.56c-.329-.449-.488-1-.451-1.555a2.38 2.38 0 01.451-1.556 1.548 1.548 0 011.213-.575 1.353 1.353 0 011.167.575c.307.459.454 1.005.42 1.556a2.276 2.276 0 01-.435 1.571z" fill="url(#brand_azuresql_radial)" fillRule="nonzero" transform="matrix(17.85716 0 0 17.85716 5.999 5.999)" />
        <defs>
          <radialGradient id="brand_azuresql_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14.56 16.442) scale(10.9978)">
            <stop offset="0" stopColor="#f2f2f2" />
            <stop offset=".58" stopColor="#eee" />
            <stop offset="1" stopColor="#e6e6e6" />
          </radialGradient>
          <linearGradient id="brand_azuresql_linear" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.029 15.805) scale(19.9422)">
            <stop offset="0" stopColor="#005ba1" />
            <stop offset=".07" stopColor="#0060a9" />
            <stop offset=".36" stopColor="#0071c8" />
            <stop offset=".52" stopColor="#0078d4" />
            <stop offset=".64" stopColor="#0074cd" />
            <stop offset=".82" stopColor="#006abb" />
            <stop offset="1" stopColor="#005ba1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // PowerShell
  if (norm === "powershell" || norm === "pwsh") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="PowerShell Logo"
      >
        <path d="M6 506V6" fill="none" />
        <path d="M9.033 109c-1.633 0-3.046-.638-3.978-1.798-.952-1.185-1.279-2.814-.896-4.47l17.986-77.911C22.899 21.557 26.062 19 29.349 19h89.623c1.634 0 3.047.638 3.978 1.798.952 1.184 1.279 2.814.896 4.47l-17.986 77.911c-.753 3.264-3.917 5.822-7.203 5.822H9.033V109z" fill="url(#brand_pwsh_linear1)" transform="matrix(3.90624 0 0 3.90624 6 6)" />
        <path d="M118.5 20H29.634c-2.769 0-5.53 2.259-6.168 5.045l-17.834 77.91C4.995 105.742 6.722 108 9.491 108h88.865c2.769 0 5.53-2.258 6.168-5.045l17.834-77.911c.638-2.785-1.09-5.044-3.858-5.044z" fill="url(#brand_pwsh_linear2)" transform="matrix(3.90624 0 0 3.90624 6 6)" />
        <path d="M256.644 348.023h84.426c9.816 0 17.773 8.3 17.773 18.539 0 10.238-7.957 18.543-17.773 18.543h-84.426c-9.816 0-17.773-8.301-17.773-18.543 0-10.238 7.957-18.54 17.773-18.54zM311.406 265.59c-1.453 2.925-4.47 6.152-9.801 9.898L144.914 388.023c-8.555 6.215-20.836 3.91-27.426-5.153-6.59-9.062-5-21.445 3.555-27.664l141.3-102.32v-2.101l-88.78-94.446c-7.243-7.703-6.49-20.16 1.683-27.828 8.172-7.664 20.664-7.632 27.906.07L309.679 241.91c6.047 6.433 6.496 16.175 1.727 23.68z" fill="#2c5591" />
        <path d="M307.5 261.683c-1.454 2.926-4.47 6.152-9.801 9.898L141.007 384.116c-8.554 6.215-20.835 3.91-27.425-5.152-6.59-9.062-5-21.445 3.554-27.664l141.301-102.32v-2.102l-88.781-94.445c-7.242-7.703-6.488-20.16 1.683-27.828 8.172-7.664 20.664-7.633 27.907.07l106.527 113.328c6.047 6.434 6.496 16.176 1.726 23.68z" fill="#fff" />
        <path d="M254.242 345.843h84.425c9.817 0 17.774 7.871 17.774 17.578 0 9.707-7.957 17.578-17.774 17.578h-84.425c-9.817 0-17.774-7.87-17.774-17.578 0-9.707 7.957-17.578 17.774-17.578z" fill="#fff" />
        <defs>
          <linearGradient id="brand_pwsh_linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(-138.228 65.172 27.787) scale(91.9375)">
            <stop offset="0" stopColor="#a9c8ff" stopOpacity=".8" />
            <stop offset="1" stopColor="#c7e6ff" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id="brand_pwsh_linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(67 59.5 -59.5 67 26.585 30.778)">
            <stop offset="0" stopColor="#2d4664" />
            <stop offset=".17" stopColor="#29405b" />
            <stop offset=".44" stopColor="#1e2f43" />
            <stop offset=".79" stopColor="#0c131b" />
            <stop offset="1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Vite Dev
  if (norm === "vite" || norm.includes("vitejs")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Vite Logo"
      >
        <path d="M399.641 59.525l-183.998 329.02c-3.799 6.793-13.559 6.833-17.415.073L10.582 59.556C6.381 52.19 12.68 43.267 21.028 44.759l184.195 32.923c1.175.21 2.378.208 3.553-.006l180.343-32.87c8.32-1.517 14.649 7.337 10.522 14.719z" fill="url(#brand_vite_linear1)" fillRule="nonzero" transform="translate(-5.47 4.116) scale(1.2749)" />
        <path d="M292.965 1.574L156.801 28.255a5 5 0 00-4.03 4.611l-8.376 141.464c-.197 3.332 2.863 5.918 6.115 5.168l37.91-8.749c3.547-.818 6.752 2.306 6.023 5.873l-11.263 55.153c-.758 3.712 2.727 6.886 6.352 5.785l23.415-7.114c3.63-1.102 7.118 2.081 6.35 5.796l-17.899 86.633c-1.12 5.419 6.088 8.374 9.094 3.728l2.008-3.103 110.954-221.428c1.858-3.707-1.346-7.935-5.418-7.149l-39.022 7.531c-3.667.707-6.787-2.708-5.752-6.296l25.469-88.291c1.036-3.594-2.095-7.012-5.766-6.293z" fill="url(#brand_vite_linear2)" fillRule="nonzero" transform="translate(-5.47 4.116) scale(1.2749)" />
        <defs>
          <linearGradient id="brand_vite_linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(229 311 -311 229 6 33)">
            <stop offset="0" stopColor="#41d1ff" />
            <stop offset="1" stopColor="#bd34fe" />
          </linearGradient>
          <linearGradient id="brand_vite_linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="scale(287.174) rotate(81.706 .321 .407)">
            <stop offset="0" stopColor="#ffea83" />
            <stop offset=".08" stopColor="#ffdd35" />
            <stop offset="1" stopColor="#ffa800" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Zoom Communications
  if (norm === "zoom" || norm.includes("zoom-communications")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Zoom Logo"
      >
        <rect width="512" height="512" rx="100" fill="url(#brand_zoom_linear)" />
        <path d="M152.08 295.512H88.07c-4.489 0-8.501-2.677-10.223-6.825a11.048 11.048 0 012.4-12.063l44.335-44.335H92.806c-8.728 0-15.805-7.077-15.805-15.804h59.03c4.49 0 8.502 2.683 10.218 6.831a11.024 11.024 0 01-2.393 12.056l-44.335 44.336h36.75c8.733 0 15.81 7.076 15.81 15.804zM435 246.119c0-16.99-13.83-30.821-30.821-30.821-9.089 0-17.275 3.96-22.92 10.243-5.644-6.282-13.83-10.243-22.918-10.243-16.991 0-30.822 13.83-30.822 30.821v49.393c8.728 0 15.804-7.077 15.804-15.804v-33.589c0-8.276 6.741-15.01 15.018-15.01 8.282 0 15.017 6.734 15.017 15.01v33.589c0 8.727 7.076 15.804 15.804 15.804v-49.393c0-8.276 6.734-15.01 15.017-15.01 8.276 0 15.017 6.734 15.017 15.01v33.589c0 8.727 7.07 15.804 15.804 15.804v-49.393zm-115.383 9.882c0 22.475-18.223 40.698-40.697 40.698-22.48 0-40.704-18.223-40.704-40.698 0-22.48 18.223-40.703 40.704-40.703 22.474 0 40.697 18.223 40.697 40.703zm-15.804 0c0-13.752-11.147-24.893-24.893-24.893-13.753 0-24.893 11.14-24.893 24.893 0 13.747 11.14 24.894 24.893 24.894 13.746 0 24.893-11.147 24.893-24.894zm-71.918 0c0 22.475-18.217 40.698-40.697 40.698-22.481 0-40.698-18.223-40.698-40.698 0-22.48 18.217-40.703 40.698-40.703 22.48 0 40.697 18.223 40.697 40.703zm-15.804 0c0-13.752-11.147-24.893-24.893-24.893-13.747 0-24.894 11.14-24.894 24.893 0 13.747 11.147 24.894 24.894 24.894 13.746 0 24.893-11.147 24.893-24.894z" fill="#fff" fillRule="nonzero" />
        <defs>
          <linearGradient id="brand_zoom_linear" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(-60 88.792 30.85) scale(109.282)">
            <stop offset="0" stopColor="#0845bf" />
            <stop offset=".6" stopColor="#0b5cff" />
            <stop offset="1" stopColor="#4f90ee" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Supabase
  if (norm === "supabase") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Supabase Logo"
      >
        <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#brand_supabase_linear1)" fillRule="nonzero" transform="translate(19.834 12.62) scale(4.33237)" />
        <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#brand_supabase_linear2)" fillRule="nonzero" transform="translate(19.834 12.62) scale(4.33237)" />
        <path d="M216.165 21.593c12.386-15.6 37.51-7.053 37.804 12.867l1.915 291.356H62.426c-35.486 0-55.277-40.984-33.208-68.776L216.165 21.593z" fill="#3ecf8e" fillRule="nonzero" />
        <defs>
          <linearGradient id="brand_supabase_linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(22.753 -109.622 161.61) scale(43.5812)">
            <stop offset="0" stopColor="#249361" />
            <stop offset="1" stopColor="#3ecf8e" />
          </linearGradient>
          <linearGradient id="brand_supabase_linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="scale(39.0687) rotate(62.022 -.188 1.161)">
            <stop offset="0" stopOpacity=".2" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // n8n
  if (norm === "n8n") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="n8n Logo"
      >
        <path d="M512 179.2c0 28.267-23.51 51.2-52.522 51.2-24.448 0-45.014-16.32-50.86-38.4h-73.3c-12.843 0-23.787 9.045-25.9 21.397l-2.154 12.63A50.917 50.917 0 01290.197 256c8.79 7.552 15.02 18.005 17.067 29.973l2.133 12.63c2.262 12.458 13.291 21.546 25.942 21.397h20.8c5.824-22.08 26.39-38.4 50.859-38.4 29.013 0 52.5 22.933 52.5 51.2 0 28.267-23.53 51.2-52.5 51.2-24.47 0-45.014-16.32-50.86-38.4h-20.8c-25.685 0-47.573-18.09-51.797-42.773l-2.154-12.63c-2.262-12.437-13.27-21.525-25.899-21.397h-21.461c-6.57 20.992-26.582 36.267-50.262 36.267s-43.69-15.275-50.24-36.267h-30.762c-6.571 20.992-26.582 36.267-50.24 36.267-29.014 0-52.523-22.934-52.523-51.2 0-28.267 23.51-51.2 52.523-51.2 25.237 0 46.336 17.386 51.37 40.533h28.523c5.035-23.147 26.133-40.533 51.37-40.533 25.26 0 46.337 17.386 51.371 40.533h20.31c12.821 0 23.786-9.045 25.877-21.397l2.176-12.63c4.224-24.682 26.133-42.773 51.798-42.773h73.3c5.846-22.08 26.412-38.4 50.86-38.4C488.49 128 512 150.933 512 179.2zm-26.24 0c0 14.144-11.776 25.6-26.282 25.6-14.507 0-26.24-11.456-26.24-25.6 0-14.144 11.733-25.6 26.24-25.6 14.506 0 26.26 11.456 26.26 25.6h.022zM52.501 279.467c14.507 0 26.24-11.456 26.24-25.6 0-14.144-11.733-25.6-26.24-25.6-14.506 0-26.261 11.456-26.261 25.6 0 14.144 11.733 25.6 26.24 25.6h.021zm131.264 0c14.507 0 26.262-11.456 26.262-25.6 0-14.144-11.734-25.6-26.24-25.6-14.507 0-26.262 11.456-26.262 25.6 0 14.144 11.734 25.6 26.24 25.6zm223.19 78.933c14.507 0 26.24-11.456 26.24-25.6 0-14.144-11.733-25.6-26.24-25.6-14.507 0-26.24 11.456-26.24 25.6 0 14.144 11.733 25.6 26.24 25.6z" fill="#ea4b71" />
      </svg>
    );
  }

  // Ollama
  if (norm === "ollama") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Ollama Logo"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M168.64 23.253c4.608 1.814 8.768 4.8 12.544 8.747 6.293 6.528 11.605 15.872 15.659 26.944 4.074 11.136 6.72 23.467 7.722 35.84a107.824 107.824 0 0143.712-13.568l1.088-.085c18.56-1.494 36.907 1.856 52.907 10.112a103.091 103.091 0 016.336 3.626c1.067-12.138 3.669-24.192 7.68-35.072 4.053-11.093 9.365-20.416 15.637-26.965a35.628 35.628 0 0112.566-8.747c5.482-2.133 11.306-2.517 16.981-.896 8.555 2.432 15.893 7.851 21.675 15.723 5.29 7.19 9.258 16.405 11.968 27.456 4.906 19.925 5.76 46.144 2.453 77.76l1.131.853.554.406c16.15 12.288 27.392 29.802 33.344 50.133 9.28 31.723 4.608 67.307-11.392 87.211l-.384.448.043.064c8.896 16.256 14.293 33.429 15.445 51.2l.043.64c1.365 22.72-4.267 45.589-17.365 68.053l-.15.213.214.512c10.069 24.683 13.226 49.536 9.344 74.368l-.128.832a13.888 13.888 0 01-15.936 11.435 13.83 13.83 0 01-11.31-10.43 13.828 13.828 0 01-.21-5.399c3.562-22.038.213-44.139-10.24-66.624a13.713 13.713 0 01.853-13.163l.085-.128c12.886-19.712 18.219-39.04 17.067-58.027-.981-16.618-6.933-32.938-17.067-48.49a13.737 13.737 0 013.84-18.902l.192-.128c5.184-3.392 9.963-12.053 12.374-23.893a90.218 90.218 0 00-2.027-42.112c-4.373-14.933-12.373-27.392-23.573-35.904-12.694-9.685-29.504-14.357-50.774-13.013a13.93 13.93 0 01-13.482-7.915c-6.699-14.187-16.47-24.341-28.651-30.635a70.145 70.145 0 00-37.803-7.082c-26.56 2.112-49.984 17.088-56.96 35.968a13.91 13.91 0 01-13.013 9.066c-22.763.043-40.384 5.376-53.269 14.998-11.136 8.32-18.731 19.946-22.742 33.877a86.824 86.824 0 00-1.45 40.235c2.389 11.904 7.061 21.76 12.416 27.072l.17.149c4.523 4.416 5.483 11.307 2.326 16.747-7.68 13.269-13.419 33.045-14.358 52.053-1.066 21.717 3.968 40.576 15.339 54.101l.341.406a13.711 13.711 0 012.027 14.72c-12.288 26.368-16.064 48.042-11.989 65.109a13.91 13.91 0 01-27.072 6.357c-5.184-21.717-1.664-46.592 10.09-74.624l.299-.746-.17-.256a92.574 92.574 0 01-12.758-27.926l-.107-.405a122.965 122.965 0 01-3.776-38.08c.939-19.413 5.931-39.296 13.27-55.253l.256-.555-.043-.043c-6.25-8.917-10.88-20.33-13.44-32.96l-.107-.512a114.176 114.176 0 011.984-53.12c5.59-19.52 16.576-36.288 32.768-48.405 1.28-.96 2.624-1.92 3.968-2.816-3.392-31.851-2.538-58.24 2.39-78.293 2.709-11.051 6.698-20.267 11.989-27.456 5.76-7.851 13.099-13.27 21.653-15.723 5.675-1.621 11.52-1.259 17.003.896v.021zm87.808 193.92c19.968 0 38.4 6.678 52.181 18.24 13.44 11.243 21.44 26.347 21.44 41.387 0 18.944-8.661 33.707-24.17 43.136-13.227 8-30.955 11.883-51.264 11.883-21.526 0-39.915-5.526-53.184-15.659-13.163-10.027-20.544-24.107-20.544-39.36 0-15.083 8.49-30.229 22.528-41.515 14.25-11.456 33.066-18.112 53.013-18.112zm0 19.115a65.498 65.498 0 00-40.875 13.867c-9.834 7.893-15.402 17.813-15.402 26.666 0 9.131 4.48 17.686 13.013 24.192 9.707 7.403 23.979 11.691 41.451 11.691 17.045 0 31.424-3.136 41.216-9.088 9.877-5.973 14.933-14.635 14.933-26.816 0-9.024-5.248-18.987-14.571-26.795-10.325-8.64-24.32-13.717-39.765-13.717zm14.123 25.813l.085.086a7.431 7.431 0 01-1.195 10.453l-6.229 4.907v9.514a7.999 7.999 0 01-8.021 7.958 8.004 8.004 0 01-8.022-7.958v-9.813l-5.781-4.651a7.4 7.4 0 01-1.109-10.453 7.53 7.53 0 0110.538-1.088l4.587 3.669 4.693-3.712a7.533 7.533 0 0110.454 1.088zm-107.52-40.938c10.197 0 18.496 8.32 18.496 18.581a18.564 18.564 0 01-18.518 18.581 18.559 18.559 0 01-18.496-18.56 18.565 18.565 0 015.399-13.129 18.609 18.609 0 0113.119-5.473zm185.728 0c10.24 0 18.517 8.32 18.517 18.581a18.559 18.559 0 01-18.517 18.581 18.56 18.56 0 01-18.496-18.56 18.56 18.56 0 0118.496-18.602zM158.72 49.067l-.064.042a14.06 14.06 0 00-6.08 5.078l-.107.128c-2.944 4.032-5.504 9.962-7.424 17.749-3.626 14.763-4.608 34.795-2.645 59.349 9.173-2.73 19.179-4.437 29.952-5.056l.213-.021.406-.725a69.41 69.41 0 013.157-5.099c2.624-16.448.469-36.096-5.397-52.139-2.859-7.765-6.336-13.866-9.664-17.344a13.403 13.403 0 00-2.283-1.92l-.064-.042zm195.712.853l-.043.021a13.396 13.396 0 00-2.282 1.92c-3.328 3.478-6.827 9.6-9.664 17.366-6.187 16.938-8.256 37.888-4.907 54.869l1.237 2.069.171.299h.64a110.599 110.599 0 0131.275 4.523c1.834-23.979.81-43.584-2.731-58.07-1.92-7.786-4.48-13.717-7.445-17.749l-.086-.128a14.054 14.054 0 00-6.08-5.099h-.085v-.021z" />
      </svg>
    );
  }

  // Google Firebase (https://uxwing.com/google-firebase-icon/)
  if (norm.includes("firebase") || norm === "google-firebase") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Firebase Logo"
      >
        <path d="M85.4 382.7L212.7 44.9c4.3-11.4 20-11.8 24.9-.7l56.8 108.6-209 229.9z" fill="#FFA000" />
        <path d="M85.4 382.7l30.2-184.2c2.4-14.4 20.8-19.4 30.3-8.2l66.8 79.6-127.3 112.8z" fill="#F57C00" />
        <path d="M260.8 488.3c8.9 5.3 19.9 5.3 28.8 0L426.6 409 308.2 165.7 85.4 382.7l175.4 105.6z" fill="#FFCA28" />
        <path d="M426.6 409L308.2 165.7c-4.5-9.3-17.4-10.4-23.5-2.1L85.4 382.7l175.4 105.6c8.9 5.3 19.9 5.3 28.8 0L426.6 409z" fill="#FFA000" fillOpacity="0.1" />
      </svg>
    );
  }

  // Google Gemini (https://uxwing.com/google-gemini-icon/)
  if (norm === "gemini" || norm.includes("google-gemini")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Gemini Logo"
      >
        <path
          d="M256 24C256 152.126 359.874 256 488 256C359.874 256 256 359.874 256 488C256 359.874 152.126 256 24 256C152.126 256 256 152.126 256 24Z"
          fill="url(#brand_gemini_spark_grad)"
        />
        <defs>
          <linearGradient id="brand_gemini_spark_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1BA1E3" />
            <stop offset="35%" stopColor="#5B76F7" />
            <stop offset="65%" stopColor="#9B59B6" />
            <stop offset="100%" stopColor="#E0629A" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Google Antigravity (https://uxwing.com/google-antigravity-icon/)
  if (norm === "antigravity" || norm.includes("google-antigravity") || norm === "agy") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Antigravity Logo"
      >
        <circle cx="256" cy="256" r="236" fill="#0F172A" />
        <circle cx="256" cy="256" r="84" fill="url(#brand_antigravity_grad)" />
        <ellipse cx="256" cy="256" rx="190" ry="76" stroke="#4285F4" strokeWidth="20" strokeLinecap="round" transform="rotate(-30 256 256)" />
        <ellipse cx="256" cy="256" rx="190" ry="76" stroke="#EA4335" strokeWidth="20" strokeLinecap="round" transform="rotate(30 256 256)" />
        <circle cx="130" cy="180" r="18" fill="#34A853" />
        <circle cx="382" cy="332" r="18" fill="#FBBC05" />
        <defs>
          <linearGradient id="brand_antigravity_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="35%" stopColor="#34A853" />
            <stop offset="70%" stopColor="#FBBC05" />
            <stop offset="100%" stopColor="#EA4335" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Google Search Console (https://uxwing.com/google-search-console-icon/)
  if (norm.includes("search-console") || norm === "gsc") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Search Console Logo"
      >
        <rect width="512" height="512" rx="112" fill="#F8FAFC" />
        <path d="M374.4 330.4l-75.1-75.1c9.3-17.5 14.7-37.4 14.7-58.7C314 133.5 262.5 82 199 82S84 133.5 84 196.6s51.5 114.6 115 114.6c21.3 0 41.2-5.4 58.7-14.7l75.1 75.1c12.2 12.2 31.9 12.2 44.1 0l-2.5-41.2z" fill="#4285F4" />
        <path d="M199 122c-41.2 0-74.6 33.4-74.6 74.6 0 10.9 2.4 21.3 6.6 30.6l98.6-98.6c-9.3-4.2-19.7-6.6-30.6-6.6z" fill="#34A853" />
        <path d="M199 271.2c20.3 0 39.1-8.1 52.8-21.8l-74.6-74.6-21.8 52.8c11.6 27.2 38.2 43.6 43.6 43.6z" fill="#FBBC05" />
        <path d="M322 368l86 86c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-86-86-45.3 45.3z" fill="#EA4335" />
      </svg>
    );
  }

  // Google Analytics (https://uxwing.com/google-analytics-icon/)
  if (norm.includes("analytics") || norm === "google-analytics" || norm === "ga4") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Analytics Logo"
      >
        <path d="M436 448c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48s-48 21.5-48 48v288c0 26.5 21.5 48 48 48z" fill="#F9AB00" />
        <path d="M256 448c26.5 0 48-21.5 48-48V256c0-26.5-21.5-48-48-48s-48 21.5-48 48v144c0 26.5 21.5 48 48 48z" fill="#E37400" />
        <circle cx="76" cy="400" r="48" fill="#F9AB00" />
        <path d="M76 448c26.5 0 48-21.5 48-48s-21.5-48-48-48-48 21.5-48 48 21.5 48 48 48z" fill="#E37400" />
      </svg>
    );
  }

  // ChatGPT (https://uxwing.com/chatgpt-icon/)
  if (norm.includes("chatgpt") || norm === "openai" || norm === "gpt-4" || norm === "gpt") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="ChatGPT Logo"
      >
        <rect width="512" height="512" rx="112" fill="#10A37F" />
        <path
          d="M410.6 220.8c-3.5-28.7-21-53.7-47-67.6-4.4-17.2-13.8-32.6-27.3-44.6-22-19.6-51.7-28.6-80.9-24.5-16.6-22.1-42-35.4-69.6-36.1-29.1-.7-56.6 12.6-73.8 35.6-25.2-6.8-52.4-1.7-73.4 13.8-21.7 16-35.1 41.1-36.1 68-21.9 12.3-36 35-37.5 60.4-1.6 27 10.9 52.9 33.2 69-3.5 28.7 21 53.7 47 67.6 4.4 17.2 13.8 32.6 27.3 44.6 22 19.6 51.7 28.6 80.9 24.5 16.6 22.1 42 35.4 69.6 36.1 29.1.7 56.6-12.6 73.8-35.6 25.2 6.8 52.4 1.7 73.4-13.8 21.7-16 35.1-41.1 36.1-68 21.9-12.3 36-35 37.5-60.4 1.5-27-11-52.9-33.3-69zm-153.2 216c-13.2 0-26-3.8-37.2-11l1.5-2.6 62.7-36.2c3.2-1.8 5.1-5.3 5.1-9v-88.3l26.4 15.2c.3.2.4.5.4.8v72.5c0 32.3-26.3 58.6-58.9 58.6zm-143.4-64.8c-6.6-11.5-10.1-24.6-10.1-37.9 0-3.3.2-6.5.7-9.7l2.6 1.5 62.7 36.2c3.2 1.8 7.2 1.8 10.3 0l76.5-44.2v30.5c0 .3-.2.7-.4.8l-62.8 36.3c-28 16.1-63.5 6.6-79.5-23.5zm-33.1-157c6.6-11.5 16.5-20.9 28.3-27.1l-1.5 2.6v72.4c0 3.7 2 7.1 5.1 9l76.5 44.2-26.4 15.2c-.3.2-.7.2-1 0l-62.8-36.3c-28-16.2-37.5-51.8-18.2-80zm237.9-34.9l-62.7 36.2c-3.2 1.8-5.1 5.3-5.1 9v88.3l-26.4-15.2c-.3-.2-.4-.5-.4-.8v-72.5c0-32.3 26.3-58.6 58.9-58.6 13.2 0 26 3.8 37.2 11l-1.5 2.6zm63.9 106.9l-2.6-1.5-62.7-36.2c-3.2-1.8-7.2-1.8-10.3 0l-76.5 44.2v-30.5c0-.3.2-.7.4-.8l62.8-36.3c28-16.1 63.5-6.6 79.5 23.5 6.6 11.5 10.1 24.6 10.1 37.9 0 3.3-.2 6.5-.7 9.7zm-27.2 81.3l-76.5-44.2 26.4-15.2c.3-.2.7-.2 1 0l62.8 36.3c28 16.2 37.5 51.8 18.2 80-6.6 11.5-16.5 20.9-28.3 27.1l1.5-2.6v-72.4c0-3.7-2-7.1-5.1-9zm-101.9-25.1l36.5-21.1 36.5 21.1v42.1l-36.5 21.1-36.5-21.1v-42.1z"
          fill="#FFF"
        />
      </svg>
    );
  }

  // Claude AI (https://uxwing.com/claude-ai-icon/)
  if (norm.includes("claude") || norm.includes("anthropic")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Claude AI Logo"
      >
        <rect width="512" height="512" rx="112" fill="#D97706" />
        <path
          d="M256 80l28 116 116 28-116 28-28 116-28-116-116-28 116-28 28-116z"
          fill="#FFF"
        />
        <circle cx="256" cy="224" r="16" fill="#D97706" />
        <circle cx="340" cy="140" r="14" fill="#FFF" fillOpacity="0.8" />
        <circle cx="172" cy="308" r="14" fill="#FFF" fillOpacity="0.8" />
      </svg>
    );
  }

  // AI & LLMs (Unified Artificial Intelligence mark)
  if (norm === "ai" || norm === "ai-llms" || norm.includes("llm") || norm.includes("machine-learning")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="AI & LLMs Logo"
      >
        <rect width="512" height="512" rx="112" fill="url(#brand_ai_llm_grad)" />
        <path
          d="M256 96c14 72 74 132 146 144-72 12-132 72-146 144-14-72-74-132-146-144 72-12 132-72 146-144z"
          fill="#FFF"
        />
        <circle cx="372" cy="136" r="28" fill="#FFF" fillOpacity="0.9" />
        <circle cx="140" cy="356" r="20" fill="#FFF" fillOpacity="0.8" />
        <defs>
          <linearGradient id="brand_ai_llm_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10A37F" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 3. WordPress (Specific check using @dev.icons/react)
  if (norm.includes("wordpress") || norm === "wp") {
    return (
      <div
        className={cn("inline-flex items-center justify-center shrink-0", className)}
        style={{ width: size, height: size }}
        title="WordPress"
      >
        <Wordpress size={size} />
      </div>
    );
  }

  // 4. Cybersecurity
  if (norm.includes("cyber") || norm.includes("security")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Cybersecurity Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#0F172A" />
        <path
          d="M16 6L24 9.5V16C24 21.2 20.6 25 16 26.5C11.4 25 8 21.2 8 16V9.5L16 6Z"
          fill="#10B981"
        />
        <path
          d="M16 10L21 12.5V16.5C21 19.5 18.8 22 16 23.2C13.2 22 11 19.5 11 16.5V12.5L16 10Z"
          fill="#064E3B"
        />
        <path
          d="M14 16L15.5 17.5L18.5 14.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 6. Direct @dev.icons/react Vector SVG Component
  const DeviconSvgComp =
    DEVICON_COMPONENTS[norm] ||
    Object.entries(DEVICON_COMPONENTS).find(([key]) => norm.includes(key))?.[1];

  if (DeviconSvgComp) {
    return (
      <div
        className={cn("inline-flex items-center justify-center shrink-0 leading-none select-none", className)}
        style={{ width: size, height: size }}
        title={getBrandDisplayName(norm)}
      >
        <DeviconSvgComp size={size} />
      </div>
    );
  }

  // 7. Devicon CSS Font Match (Fallback for any custom devicon class)
  const deviconMatch =
    DEVICON_CLASSES[norm] ||
    Object.entries(DEVICON_CLASSES).find(([key]) => norm.includes(key))?.[1];

  if (deviconMatch) {
    return (
      <div
        className={cn("flex items-center justify-center shrink-0 leading-none select-none", className)}
        style={{ width: size, height: size }}
        title={getBrandDisplayName(norm)}
      >
        <i
          className={deviconMatch}
          style={{ fontSize: typeof size === "number" ? `${size * 0.9}px` : size }}
        />
      </div>
    );
  }

  // 8. Generic Fallback Badge
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-foreground font-bold text-xs uppercase shadow-sm shrink-0 select-none",
        className,
      )}
      title={raw}
    >
      {norm.slice(0, 2) || "DEV"}
    </div>
  );
}
