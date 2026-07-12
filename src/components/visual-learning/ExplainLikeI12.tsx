import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Lightbulb,
  Sparkles,
  Loader2,
  ChevronDown,
  User,
  GraduationCap,
  Brain,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExplainLikeI12Props {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  lessonContent: string;
}

const LEVELS = [
  { id: "beginner", label: "Beginner", icon: User, desc: "Simple terms, relatable examples" },
  {
    id: "intermediate",
    label: "Intermediate",
    icon: GraduationCap,
    desc: "Deeper insight, real-world context",
  },
  { id: "expert", label: "Expert", icon: Brain, desc: "Technical depth, trade-offs" },
  { id: "analogy", label: "Analogy", icon: MessageSquare, desc: "Powerful metaphor" },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];

export function ExplainLikeI12({
  lessonId,
  courseId,
  lessonTitle,
  lessonContent,
}: ExplainLikeI12Props) {
  const [level, setLevel] = useState<LevelId>("beginner");
  const [showExplainer, setShowExplainer] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["explain-like", lessonId, level],
    queryFn: async () => {
      const { explainLike } = await import("@/lib/explain-like.functions");
      const res = await explainLike({
        data: { lessonId, courseId, lessonTitle, lessonContent, level },
      });
      return res;
    },
    enabled: showExplainer,
    staleTime: 1000 * 60 * 60,
  });

  if (!showExplainer) {
    return (
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Explain Like I'm...</h3>
            <p className="text-xs text-muted-foreground">Get this lesson explained at your level</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => setShowExplainer(true)}
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          Start Explaining
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold">AI Explain Like I'm...</span>
        </div>
        <button
          onClick={() => setShowExplainer(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="flex gap-1 p-2 border-b border-border/50 overflow-x-auto">
        {LEVELS.map((l) => {
          const Icon = l.icon;
          const active = level === l.id;
          return (
            <button
              key={l.id}
              onClick={() => {
                setLevel(l.id);
                if (data) refetch();
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0",
                active
                  ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent",
              )}
              title={l.desc}
            >
              <Icon className="h-3.5 w-3.5" />
              {l.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Generating {level} explanation...</span>
          </div>
        ) : error ? (
          <div className="text-xs text-red-500 p-2 bg-red-500/10 rounded-lg">
            Failed to generate explanation. Please try again.
          </div>
        ) : data?.content ? (
          <div className="prose prose-sm prose-invert max-w-none">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              {data.cached ? <Sparkles className="h-3 w-3" /> : <Loader2 className="h-3 w-3" />}
              {data.cached ? "Cached" : "Generated fresh"}
            </div>
            <div
              className="text-sm leading-relaxed space-y-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1 [&_strong]:text-primary [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(data.content) }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function renderMarkdown(md: string): string {
  return md
    .replace(/### (.+)/g, "<h3>$1</h3>")
    .replace(/## (.+)/g, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[ulh])/gm, (m) => (m ? m : ""));
}
