import { Badge } from "@/components/ui/badge";
import { Terminal, Code, Palette, Share2, Brain } from "lucide-react";

export const SKILL_LOGOS: Record<string, { devicon?: string; simpleIcons?: string; lucide?: React.ElementType }> = {
  HTML: { devicon: "html5/html5-original.svg" },
  CSS: { devicon: "css3/css3-original.svg" },
  JavaScript: { devicon: "javascript/javascript-original.svg" },
  Python: { devicon: "python/python-original.svg" },
  Java: { devicon: "java/java-original.svg" },
  "C++": { devicon: "cplusplus/cplusplus-original.svg" },
  SQL: { devicon: "azuresqldatabase/azuresqldatabase-original.svg" },
  "Command Line": { lucide: Terminal },
  React: { devicon: "react/react-original.svg" },
  "Git & GitHub": { devicon: "github/github-original.svg" },
  Git: { devicon: "git/git-original.svg" },
  GitHub: { devicon: "github/github-original.svg" },
  NumPy: { devicon: "numpy/numpy-original.svg" },
  TypeScript: { devicon: "typescript/typescript-original.svg" },
  "Node.js": { devicon: "nodejs/nodejs-original.svg" },
  "Next.js": { devicon: "nextjs/nextjs-original.svg" },
  "Tailwind CSS": { devicon: "tailwindcss/tailwindcss-original.svg" },
  Docker: { devicon: "docker/docker-original.svg" },
  AWS: { devicon: "amazonwebservices/amazonwebservices-original-wordmark.svg" },
  MongoDB: { devicon: "mongodb/mongodb-original.svg" },
  PostgreSQL: { devicon: "postgresql/postgresql-original.svg" },
  GraphQL: { devicon: "graphql/graphql-plain.svg" },
  Figma: { devicon: "figma/figma-original.svg" },
  Canva: { simpleIcons: "canva" },
  Supabase: { simpleIcons: "supabase" },
  Firebase: { simpleIcons: "firebase" },
  "VS Code": { devicon: "vscode/vscode-original.svg" },
  Linux: { devicon: "linux/linux-original.svg" },
  Nginx: { devicon: "nginx/nginx-original.svg" },
  Redis: { devicon: "redis/redis-original.svg" },
  Selenium: { devicon: "selenium/selenium-original.svg" },
  TensorFlow: { devicon: "tensorflow/tensorflow-original.svg" },
  PyTorch: { devicon: "pytorch/pytorch-original.svg" },
  Arduino: { devicon: "arduino/arduino-original.svg" },
  "UI/UX": { lucide: Palette },
  "API Design": { lucide: Share2 },
  AI: { lucide: Brain },
  Claude: { simpleIcons: "anthropic" },
  OpenAI: { simpleIcons: "openai" },
  Vercel: { simpleIcons: "vercel" },
  Netlify: { simpleIcons: "netlify" },
  Blender: { simpleIcons: "blender" },
  Notion: { simpleIcons: "notion" },
  Slack: { simpleIcons: "slack" },
  "Google Cloud": { simpleIcons: "googlecloud" },
  Azure: { devicon: "azure/azure-original.svg" },
  Heroku: { devicon: "heroku/heroku-original.svg" },
};

export function SkillBadge({
  skill,
  className,
  variant = "secondary",
  size = "sm",
}: {
  skill: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const iconInfo = SKILL_LOGOS[skill];
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";

  return (
    <Badge variant={variant} className={`flex items-center gap-1.5 py-0.5 ${className}`}>
      {iconInfo?.devicon && (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconInfo.devicon}`}
          alt={`${skill} logo`}
          className={`${sizeClass} object-contain`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {iconInfo?.simpleIcons && (
        <img
          src={`https://cdn.simpleicons.org/${iconInfo.simpleIcons}`}
          alt={`${skill} logo`}
          className={`${sizeClass} object-contain`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {iconInfo?.lucide && <iconInfo.lucide className={sizeClass} />}
      {!iconInfo && <Code className={sizeClass} />}
      {skill}
    </Badge>
  );
}
