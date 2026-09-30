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
  | "supabase"
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
    supabase: "Supabase",
    firebase: "Firebase",
    graphql: "GraphQL",
    wordpress: "WordPress",
    pandas: "Pandas",
    numpy: "NumPy",
    tensorflow: "TensorFlow",
    pytorch: "PyTorch",
    spring: "Spring Boot",
    cybersecurity: "Cybersecurity",
    ai: "Artificial Intelligence",
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

  // 2. AI Foundations
  if (norm.includes("chatgpt") || norm.includes("openai")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="ChatGPT Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#10A37F" />
        <path
          d="M24 14.2A5.3 5.3 0 0 0 21.8 9.5A5.4 5.4 0 0 0 15 9.1V10.7A3.8 3.8 0 0 1 19.8 12.6L20 13.3L19.4 13.6A5.4 5.4 0 0 0 16.5 18.6L16.5 20.3A5.4 5.4 0 0 0 21.5 22.8A5.3 5.3 0 0 0 24 14.2ZM12.2 22.5A5.3 5.3 0 0 0 17 22.9V21.3A3.8 3.8 0 0 1 12.2 19.4L12 18.7L12.6 18.4A5.4 5.4 0 0 0 15.5 13.4L15.5 11.7A5.4 5.4 0 0 0 10.5 9.2A5.3 5.3 0 0 0 8 17.8A5.3 5.3 0 0 0 12.2 22.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (norm.includes("claude") || norm.includes("anthropic")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Claude AI Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#CC785C" />
        <path
          d="M16 7L18.4 13.6L25 16L18.4 18.4L16 25L13.6 18.4L7 16L13.6 13.6L16 7Z"
          fill="#FFFFFF"
        />
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

  // 5. Artificial Intelligence
  if (norm === "ai" || norm.includes("machine-learning") || norm.includes("deep-learning")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Artificial Intelligence Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#4F46E5" />
        <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" />
        <circle cx="9" cy="10" r="2.2" fill="#A5B4FC" />
        <circle cx="23" cy="10" r="2.2" fill="#A5B4FC" />
        <circle cx="9" cy="22" r="2.2" fill="#A5B4FC" />
        <circle cx="23" cy="22" r="2.2" fill="#A5B4FC" />
        <path
          d="M10.8 11.5L13.8 14M21.2 11.5L18.2 14M10.8 20.5L13.8 18M21.2 20.5L18.2 18M16 6.5V12.5M16 19.5V25.5"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
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
