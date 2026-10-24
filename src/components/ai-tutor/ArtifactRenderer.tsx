import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Copy, Check, Bookmark, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { parseTutorResponse } from "./artifactParser";
import { InteractiveQuizCard } from "./InteractiveQuizCard";
import { InteractiveDiagramCard } from "./InteractiveDiagramCard";
import { InteractiveFlashcardCard } from "./InteractiveFlashcardCard";
import { InteractiveExamCard } from "./InteractiveExamCard";
import { InteractiveStudyPlanCard } from "./InteractiveStudyPlanCard";
import { InteractiveChartCard } from "./InteractiveChartCard";
import { QuickActionsBar } from "./QuickActionsBar";
import { VoicePlayer } from "./VoicePlayer";

interface ArtifactRendererProps {
  content: string;
  isStreaming?: boolean;
  onSendQuery?: (query: string) => void;
}

export function ArtifactRenderer({
  content,
  isStreaming = false,
  onSendQuery,
}: ArtifactRendererProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const segments = parseTutorResponse(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Response copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Bookmark removed" : "Saved to your learning library");
  };

  // Find explicit action artifact if present
  const explicitActionsSegment = segments.find(
    (s) => s.type === "artifact" && s.artifact?.type === "actions",
  );
  const explicitActions: string[] = explicitActionsSegment?.artifact?.data ?? [];

  // Default smart follow-ups when response is substantial and not streaming
  const showDefaultFollowups =
    !isStreaming &&
    content.length > 150 &&
    explicitActions.length === 0;

  const defaultActions = [
    "Explain this simpler with an analogy",
    "Show a step-by-step visual diagram",
    "Test my understanding with 3 questions",
    "Give me an exam-ready 10-mark answer",
  ];

  return (
    <div className="space-y-3">
      {segments.map((segment, idx) => {
        if (segment.type === "markdown") {
          return (
            <div
              key={idx}
              className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted/90 prose-pre:border prose-pre:border-border/60 prose-pre:text-foreground prose-code:before:hidden prose-code:after:hidden prose-img:rounded-xl prose-img:my-3 prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  table: ({ node, ...props }) => (
                    <div className="my-4 overflow-x-auto rounded-xl border border-border/70 bg-card/60 backdrop-blur shadow-xs">
                      <table className="w-full text-left text-xs border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-muted/60 text-foreground font-semibold border-b border-border/70" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="p-3 font-display font-semibold text-foreground tracking-tight text-xs whitespace-nowrap" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="p-3 border-t border-border/40 text-foreground/90 text-xs align-top leading-relaxed" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-muted/20 transition-colors" {...props} />
                  ),
                  pre: ({ node, children, ...props }) => {
                    const text = String(node?.children?.[0] && "value" in node.children[0] ? (node.children[0] as any).value : "");
                    const isAsciiDiagram = text.includes("+---") || text.includes("|  ") || text.includes("+=====");
                    return (
                      <div className="relative group my-3">
                        <pre
                          className={cn(
                            "rounded-xl border p-4 overflow-x-auto font-mono text-xs shadow-xs",
                            isAsciiDiagram
                              ? "bg-slate-950 text-slate-100 border-slate-800 leading-tight tracking-tight whitespace-pre font-mono"
                              : "bg-muted/80 text-foreground border-border/60",
                          )}
                          {...props}
                        >
                          {children}
                        </pre>
                      </div>
                    );
                  },
                }}
              >
                {segment.content}
              </ReactMarkdown>
            </div>
          );
        }

        if (segment.type === "artifact" && segment.artifact) {
          const { type, data } = segment.artifact;

          switch (type) {
            case "quiz":
              return (
                <InteractiveQuizCard
                  key={idx}
                  quiz={data}
                  onFollowUp={onSendQuery}
                />
              );
            case "diagram":
              return (
                <InteractiveDiagramCard
                  key={idx}
                  diagram={data}
                  onFollowUp={onSendQuery}
                />
              );
            case "chart":
              return (
                <InteractiveChartCard
                  key={idx}
                  chart={data}
                />
              );
            case "flashcards":
              return <InteractiveFlashcardCard key={idx} flashcards={data} />;
            case "exam":
              return <InteractiveExamCard key={idx} exam={data} />;
            case "plan":
              return <InteractiveStudyPlanCard key={idx} plan={data} />;
            case "actions":
              return (
                <QuickActionsBar
                  key={idx}
                  actions={data}
                  onSelectAction={(action) => onSendQuery?.(action)}
                />
              );
            default:
              return null;
          }
        }

        return null;
      })}

      {/* Default smart follow-ups if model didn't emit actions block */}
      {showDefaultFollowups && onSendQuery && (
        <QuickActionsBar
          actions={defaultActions}
          onSelectAction={(action) => onSendQuery(action)}
        />
      )}

      {/* Floating or Inline Response Action Bar */}
      {!isStreaming && content && (
        <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-border/40 text-xs text-muted-foreground">
          <VoicePlayer content={content} />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
              title="Copy markdown"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
              title="Bookmark insight"
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  bookmarked ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
