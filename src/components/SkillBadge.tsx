import { Badge } from "@/components/ui/badge";
import { Terminal, Database, Code, Palette, Share2, Layers } from "lucide-react";

export const SKILL_LOGOS: Record<string, { devicon?: string; lucide?: React.ElementType }> = {
  "HTML": { devicon: "html5/html5-original.svg" },
  "CSS": { devicon: "css3/css3-original.svg" },
  "JavaScript": { devicon: "javascript/javascript-original.svg" },
  "Python": { devicon: "python/python-original.svg" },
  "Java": { devicon: "java/java-original.svg" },
  "C++": { devicon: "cplusplus/cplusplus-original.svg" },
  "SQL": { devicon: "azuresqldatabase/azuresqldatabase-original.svg" },
  "Command Line": { lucide: Terminal },
  "React": { devicon: "react/react-original.svg" },
  "Git & GitHub": { devicon: "github/github-original.svg" },
  "NumPy": { devicon: "numpy/numpy-original.svg" },
  "TypeScript": { devicon: "typescript/typescript-original.svg" },
  "Node.js": { devicon: "nodejs/nodejs-original.svg" },
  "Next.js": { devicon: "nextjs/nextjs-original.svg" },
  "Tailwind CSS": { devicon: "tailwindcss/tailwindcss-original.svg" },
  "Docker": { devicon: "docker/docker-original.svg" },
  "AWS": { devicon: "amazonwebservices/amazonwebservices-original-wordmark.svg" },
  "MongoDB": { devicon: "mongodb/mongodb-original.svg" },
  "PostgreSQL": { devicon: "postgresql/postgresql-original.svg" },
  "GraphQL": { devicon: "graphql/graphql-plain.svg" },
  "Figma": { devicon: "figma/figma-original.svg" },
  "UI/UX": { lucide: Palette },
  "API Design": { lucide: Share2 },
};

export function SkillBadge({ skill, className, variant = "secondary" }: { skill: string, className?: string, variant?: "default" | "secondary" | "destructive" | "outline" }) {
  const iconInfo = SKILL_LOGOS[skill];

  return (
    <Badge variant={variant} className={`flex items-center gap-1.5 py-0.5 ${className}`}>
      {iconInfo?.devicon && (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconInfo.devicon}`}
          alt={`${skill} logo`}
          className="w-3.5 h-3.5 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {iconInfo?.lucide && (
        <iconInfo.lucide className="w-3.5 h-3.5" />
      )}
      {!iconInfo && <Code className="w-3.5 h-3.5" />}
      {skill}
    </Badge>
  );
}
