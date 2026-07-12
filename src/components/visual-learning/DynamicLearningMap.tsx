import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Code2,
  Database,
  Globe,
  Shield,
  Cpu,
  Layers,
  Server,
  Atom,
  FileJson,
  Tablet,
  Flame,
  Link2,
  FlaskConical,
  Fingerprint,
  Container,
  Cloud,
  Rocket as RocketIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillNode {
  id: string;
  title: string;
  description: string;
  category: string;
  level: number;
  prerequisites: string[];
  icon: string;
  duration: string;
  status?: "locked" | "available" | "in-progress" | "completed";
}

const SKILL_ICON_MAP: Record<string, LucideIcon> = {
  "html-css": Globe,
  javascript: FileJson,
  "react-basics": Atom,
  typescript: Tablet,
  "node-basics": Server,
  databases: Database,
  "react-advanced": Flame,
  "api-design": Link2,
  testing: FlaskConical,
  "auth-security": Fingerprint,
  devops: Container,
  architecture: Cpu,
  cloud: Cloud,
  "fullstack-mastery": RocketIcon,
};

const SKILL_TREE: SkillNode[] = [
  {
    id: "html-css",
    title: "HTML & CSS",
    description: "Build responsive web layouts with modern CSS",
    category: "frontend",
    level: 1,
    prerequisites: [],
    icon: "html-css",
    duration: "2 weeks",
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Core language fundamentals and DOM manipulation",
    category: "frontend",
    level: 1,
    prerequisites: [],
    icon: "javascript",
    duration: "3 weeks",
  },
  {
    id: "react-basics",
    title: "React Basics",
    description: "Components, props, state, and hooks",
    category: "frontend",
    level: 2,
    prerequisites: ["html-css", "javascript"],
    icon: "react-basics",
    duration: "4 weeks",
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "Type-safe JavaScript with interfaces and generics",
    category: "frontend",
    level: 2,
    prerequisites: ["javascript"],
    icon: "typescript",
    duration: "2 weeks",
  },
  {
    id: "node-basics",
    title: "Node.js",
    description: "Server-side JavaScript with Express",
    category: "backend",
    level: 2,
    prerequisites: ["javascript"],
    icon: "node-basics",
    duration: "3 weeks",
  },
  {
    id: "databases",
    title: "Databases",
    description: "SQL, PostgreSQL, and data modeling",
    category: "backend",
    level: 2,
    prerequisites: ["node-basics"],
    icon: "databases",
    duration: "3 weeks",
  },
  {
    id: "react-advanced",
    title: "React Advanced",
    description: "Context, reducers, custom hooks, performance",
    category: "frontend",
    level: 3,
    prerequisites: ["react-basics", "typescript"],
    icon: "react-advanced",
    duration: "4 weeks",
  },
  {
    id: "api-design",
    title: "API Design",
    description: "RESTful APIs, GraphQL, and best practices",
    category: "backend",
    level: 3,
    prerequisites: ["node-basics", "databases"],
    icon: "api-design",
    duration: "3 weeks",
  },
  {
    id: "testing",
    title: "Testing",
    description: "Unit, integration, and E2E testing",
    category: "quality",
    level: 3,
    prerequisites: ["react-basics", "node-basics"],
    icon: "testing",
    duration: "2 weeks",
  },
  {
    id: "auth-security",
    title: "Auth & Security",
    description: "OAuth, JWT, CSRF, and secure coding",
    category: "backend",
    level: 3,
    prerequisites: ["api-design"],
    icon: "auth-security",
    duration: "2 weeks",
  },
  {
    id: "devops",
    title: "DevOps",
    description: "CI/CD, Docker, deployment pipelines",
    category: "infra",
    level: 4,
    prerequisites: ["testing", "api-design"],
    icon: "devops",
    duration: "4 weeks",
  },
  {
    id: "architecture",
    title: "System Design",
    description: "Scalable architectures, microservices, patterns",
    category: "architecture",
    level: 4,
    prerequisites: ["react-advanced", "auth-security"],
    icon: "architecture",
    duration: "5 weeks",
  },
  {
    id: "cloud",
    title: "Cloud Services",
    description: "AWS/GCP basics, serverless, and scaling",
    category: "infra",
    level: 5,
    prerequisites: ["devops", "architecture"],
    icon: "cloud",
    duration: "4 weeks",
  },
  {
    id: "fullstack-mastery",
    title: "Full-Stack Mastery",
    description: "End-to-end application development",
    category: "architecture",
    level: 5,
    prerequisites: ["architecture", "cloud"],
    icon: "fullstack-mastery",
    duration: "6 weeks",
  },
];

const CATEGORIES = [
  { id: "frontend", label: "Frontend", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "backend", label: "Backend", color: "text-green-500", bg: "bg-green-500/10" },
  { id: "infra", label: "Infrastructure", color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "quality", label: "Quality", color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "architecture", label: "Architecture", color: "text-rose-500", bg: "bg-rose-500/10" },
];

interface DynamicLearningMapProps {
  userId?: string;
  compact?: boolean;
}

const STORAGE_KEY = "learnify_skill_progress";

function loadProgress(): Record<string, SkillNode["status"]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(p: Record<string, SkillNode["status"]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function DynamicLearningMap({ compact }: DynamicLearningMapProps) {
  const [progress, setProgress] = useState<Record<string, SkillNode["status"]>>(loadProgress);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("frontend");

  const enrichedNodes = useMemo(() => {
    return SKILL_TREE.map((node) => {
      const status =
        progress[node.id] || (node.prerequisites.length === 0 ? "available" : "locked");
      const prereqsMet = node.prerequisites.every((p) => progress[p] === "completed");
      const effectiveStatus = status === "locked" && prereqsMet ? "available" : status;
      return { ...node, status: effectiveStatus };
    });
  }, [progress]);

  const grouped = useMemo(() => {
    const map: Record<string, SkillNode[]> = {};
    for (const node of enrichedNodes) {
      if (!map[node.category]) map[node.category] = [];
      map[node.category].push(node);
    }
    return map;
  }, [enrichedNodes]);

  const markComplete = (id: string) => {
    const next = { ...progress, [id]: "completed" as SkillNode["status"] };
    setProgress(next);
    saveProgress(next);
  };

  if (compact) {
    const completed = enrichedNodes.filter((n) => n.status === "completed").length;
    const total = enrichedNodes.length;
    const pct = Math.round((completed / total) * 100);

    return (
      <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Learning Roadmap
          </h3>
          <span className="text-[10px] text-muted-foreground">
            {completed}/{total} skills
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {CATEGORIES.map((cat) => {
        const nodes = grouped[cat.id] || [];
        if (!nodes.length) return null;
        const catCompleted = nodes.filter((n) => n.status === "completed").length;
        const expanded = expandedCategory === cat.id;

        return (
          <div
            key={cat.id}
            className="rounded-xl border border-border/50 overflow-hidden bg-card/20"
          >
            <button
              onClick={() => setExpandedCategory(expanded ? null : cat.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold", cat.color)}>{cat.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {catCompleted}/{nodes.length}
                </span>
              </div>
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-1.5">
                    {nodes.map((node) => (
                      <SkillCard key={node.id} node={node} onComplete={markComplete} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function SkillCard({ node, onComplete }: { node: SkillNode; onComplete: (id: string) => void }) {
  const status = node.status || "locked";
  const isCompleted = status === "completed";
  const isAvailable = status === "available";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg border transition-all",
        isCompleted
          ? "bg-green-500/10 border-green-500/20"
          : isAvailable
            ? "bg-primary/5 border-primary/20 hover:bg-primary/10 cursor-pointer"
            : "bg-muted/20 border-border/30 opacity-60",
      )}
      onClick={() => isAvailable && onComplete(node.id)}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : isAvailable ? (
          <span className="text-primary">
            {SKILL_ICON_MAP[node.icon] ? (
              <span className="[&>svg]:h-5 [&>svg]:w-5">
                {React.createElement(SKILL_ICON_MAP[node.icon])}
              </span>
            ) : (
              <Code2 className="h-5 w-5" />
            )}
          </span>
        ) : (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              isCompleted ? "text-green-500" : "text-foreground",
            )}
          >
            {node.title}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{node.description}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">{node.duration}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1">
        {node.prerequisites.length > 0 && !isCompleted && (
          <span className="text-[9px] text-muted-foreground">{node.prerequisites.length} pre</span>
        )}
        {isAvailable && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
      </div>
    </div>
  );
}
