/**
 * BlockRenderer — reads lesson_content_blocks and renders each type
 * Used in the course player (student view)
 * Supports: text, video, image, quiz, code, callout, divider, embed, diagram, file
 */
import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import {
  Play, Image as ImageIcon, FileText, AlertTriangle,
  Info, Lightbulb, AlertOctagon, Code2, Download,
  ExternalLink, CheckCircle, XCircle, ChevronRight,
  Trophy, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// Lazy-load Mermaid for diagram blocks (only when needed)
const MermaidDiagram = lazy(() => import("./MermaidDiagram"));

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

export type BlockType =
  | "text" | "video" | "image" | "quiz" | "code"
  | "callout" | "divider" | "embed" | "diagram" | "file";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  order_index: number;
}

export interface BlockRendererProps {
  blocks: ContentBlock[];
  onQuizComplete?: (blockId: string, passed: boolean) => void;
  previousAttempts?: Record<string, { passed: boolean; score: number; maxScore: number }>;
  readOnly?: boolean;
  className?: string;
}

// ────────────────────────────────────────────────────────────
// MAIN RENDERER
// ────────────────────────────────────────────────────────────

export function BlockRenderer({
  blocks,
  onQuizComplete,
  previousAttempts = {},
  className,
}: BlockRendererProps) {
  if (!blocks.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No content for this lesson yet.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {blocks
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((block) => (
          <BlockSwitch
            key={block.id}
            block={block}
            onQuizComplete={onQuizComplete}
            previousAttempt={previousAttempts[block.id]}
          />
        ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// BLOCK ROUTER
// ────────────────────────────────────────────────────────────

interface BlockSwitchProps {
  block: ContentBlock;
  onQuizComplete?: (blockId: string, passed: boolean) => void;
  previousAttempt?: { passed: boolean; score: number; maxScore: number };
}

function BlockSwitch({ block, onQuizComplete, previousAttempt }: BlockSwitchProps) {
  switch (block.type) {
    case "text":    return <TextBlock content={block.content} />;
    case "video":   return <VideoBlock content={block.content} />;
    case "image":   return <ImageBlock content={block.content} />;
    case "quiz":    return <QuizBlock block={block} onComplete={onQuizComplete} previousAttempt={previousAttempt} />;
    case "code":    return <CodeBlock content={block.content} />;
    case "callout": return <CalloutBlock content={block.content} />;
    case "divider": return <DividerBlock />;
    case "embed":   return <EmbedBlock content={block.content} />;
    case "diagram": return <DiagramBlock content={block.content} />;
    case "file":    return <FileBlock content={block.content} />;
    default:        return null;
  }
}

// ────────────────────────────────────────────────────────────
// TEXT BLOCK
// ────────────────────────────────────────────────────────────

function TextBlock({ content }: { content: Record<string, any> }) {
  const html = content.html ?? content.text ?? "";
  if (!html) return null;
  return (
    <div
      className="prose prose-invert prose-sm sm:prose-base max-w-none
        prose-headings:font-display prose-headings:text-white
        prose-p:text-slate-300 prose-p:leading-relaxed
        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
        prose-code:text-violet-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10
        prose-blockquote:border-indigo-500 prose-blockquote:text-slate-400
        prose-strong:text-white prose-li:text-slate-300"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ────────────────────────────────────────────────────────────
// VIDEO BLOCK
// ────────────────────────────────────────────────────────────

function VideoBlock({ content }: { content: Record<string, any> }) {
  const url: string = content.url ?? "";
  const title: string = content.title ?? "Video";
  const startTime: number = content.startTime ?? 0;

  const embedUrl = getVideoEmbedUrl(url, startTime);
  if (!embedUrl) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <Play className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="text-slate-400 text-sm">Video URL not configured</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black shadow-xl">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {title && (
        <div className="px-4 py-2.5 bg-black/60 border-t border-white/5">
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            {title}
          </p>
        </div>
      )}
    </div>
  );
}

function getVideoEmbedUrl(url: string, startTime = 0): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    const base = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    return startTime > 0 ? `${base}&start=${startTime}` : base;
  }
  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-f0-9]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;
  // Direct mp4
  if (url.endsWith(".mp4") || url.includes("storage")) return null; // Use native video
  return null;
}

// ────────────────────────────────────────────────────────────
// IMAGE BLOCK
// ────────────────────────────────────────────────────────────

function ImageBlock({ content }: { content: Record<string, any> }) {
  const src: string = content.url ?? content.src ?? "";
  const alt: string = content.alt ?? content.caption ?? "Image";
  const caption: string = content.caption ?? "";

  if (!src) return null;
  return (
    <figure className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover max-h-[520px]"
        loading="lazy"
      />
      {caption && (
        <figcaption className="px-4 py-2.5 text-sm text-slate-400 text-center border-t border-white/5">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ────────────────────────────────────────────────────────────
// CODE BLOCK
// ────────────────────────────────────────────────────────────

function CodeBlock({ content }: { content: Record<string, any> }) {
  const code: string = content.code ?? "";
  const lang: string = content.language ?? content.lang ?? "plaintext";
  const filename: string = content.filename ?? "";
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          {filename && <span className="text-xs text-slate-400 font-mono">{filename}</span>}
          <Badge variant="outline" className="text-xs border-white/10 text-slate-400 py-0">
            {lang}
          </Badge>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${lang} text-slate-200 font-mono`}>{code}</code>
      </pre>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CALLOUT BLOCK
// ────────────────────────────────────────────────────────────

type CalloutVariant = "tip" | "note" | "warning" | "danger" | "info";

const CALLOUT_CONFIG: Record<CalloutVariant, {
  icon: ReactNode;
  label: string;
  bg: string;
  border: string;
  iconColor: string;
  textColor: string;
}> = {
  tip: {
    icon: <Lightbulb className="w-4 h-4" />,
    label: "Tip",
    bg: "bg-emerald-950/30",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    textColor: "text-emerald-100",
  },
  note: {
    icon: <Info className="w-4 h-4" />,
    label: "Note",
    bg: "bg-indigo-950/30",
    border: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    textColor: "text-indigo-100",
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    label: "Info",
    bg: "bg-sky-950/30",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
    textColor: "text-sky-100",
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    label: "Warning",
    bg: "bg-amber-950/30",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    textColor: "text-amber-100",
  },
  danger: {
    icon: <AlertOctagon className="w-4 h-4" />,
    label: "Danger",
    bg: "bg-red-950/30",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    textColor: "text-red-100",
  },
};

function CalloutBlock({ content }: { content: Record<string, any> }) {
  const variant: CalloutVariant = (content.variant ?? "note") as CalloutVariant;
  const text: string = content.text ?? "";
  const cfg = CALLOUT_CONFIG[variant] ?? CALLOUT_CONFIG.note;

  return (
    <div className={cn(
      "rounded-xl border p-4 flex gap-3",
      cfg.bg, cfg.border,
    )}>
      <span className={cn("flex-shrink-0 mt-0.5", cfg.iconColor)}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold mb-1", cfg.iconColor)}>{cfg.label}</p>
        <p className={cn("text-sm leading-relaxed", cfg.textColor)}>{text}</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// DIVIDER BLOCK
// ────────────────────────────────────────────────────────────

function DividerBlock() {
  return <hr className="border-white/10 my-2" />;
}

// ────────────────────────────────────────────────────────────
// EMBED BLOCK (iFrame)
// ────────────────────────────────────────────────────────────

function EmbedBlock({ content }: { content: Record<string, any> }) {
  const src: string = content.src ?? content.url ?? "";
  const title: string = content.title ?? "Embedded Content";
  const height: number = content.height ?? 480;

  if (!src) return null;
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-black">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-slate-900/50">
        <ExternalLink className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-400">{title}</span>
        <a href={src} target="_blank" rel="noopener noreferrer"
          className="ml-auto text-xs text-indigo-400 hover:underline">
          Open in new tab
        </a>
      </div>
      <iframe
        src={src}
        title={title}
        className="w-full border-0"
        style={{ height }}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// DIAGRAM BLOCK (Mermaid)
// ────────────────────────────────────────────────────────────

function DiagramBlock({ content }: { content: Record<string, any> }) {
  const definition: string = content.mermaid ?? content.definition ?? "";
  if (!definition.trim()) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-slate-900/50">
        <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" />
        </svg>
        <span className="text-sm text-slate-400">Diagram</span>
      </div>
      <div className="p-4">
        <Suspense fallback={
          <div className="text-center py-8 text-slate-400 text-sm">Loading diagram...</div>
        }>
          <MermaidDiagram definition={definition} />
        </Suspense>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// FILE BLOCK
// ────────────────────────────────────────────────────────────

function FileBlock({ content }: { content: Record<string, any> }) {
  const url: string = content.url ?? "";
  const name: string = content.name ?? "Download";
  const size: string = content.size ?? "";
  const type: string = content.mimeType ?? "";

  if (!url) return null;
  const isImage = type.startsWith("image/");
  const isPdf = type === "application/pdf" || name.endsWith(".pdf");

  return (
    <a
      href={url}
      download={name}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
        {isPdf ? (
          <FileText className="w-5 h-5 text-red-400" />
        ) : isImage ? (
          <ImageIcon className="w-5 h-5 text-emerald-400" />
        ) : (
          <FileText className="w-5 h-5 text-indigo-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{name}</p>
        {size && <p className="text-xs text-slate-500">{size}</p>}
      </div>
      <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
    </a>
  );
}

// ────────────────────────────────────────────────────────────
// QUIZ BLOCK — Inline MCQ with scoring
// ────────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // 0-indexed correct option
  explanation?: string;
}

interface QuizBlockProps {
  block: ContentBlock;
  onComplete?: (blockId: string, passed: boolean) => void;
  previousAttempt?: { passed: boolean; score: number; maxScore: number };
}

function QuizBlock({ block, onComplete, previousAttempt }: QuizBlockProps) {
  const questions: QuizQuestion[] = block.content.questions ?? [];
  const title: string = block.content.title ?? "Knowledge Check";
  const passingScore: number = block.content.passingScore ?? 60;
  const required: boolean = block.content.required ?? false;

  const [selected, setSelected] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(!!previousAttempt);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(previousAttempt?.score ?? 0);
  const [maxScore] = useState(questions.length);
  const [passed, setPassed] = useState(previousAttempt?.passed ?? false);

  const handleSelect = useCallback((qi: number, oi: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    const res = questions.map((q, i) => selected[i] === q.answer);
    const correct = res.filter(Boolean).length;
    const pct = Math.round((correct / questions.length) * 100);
    const pass = pct >= passingScore;
    setResults(res);
    setScore(correct);
    setPassed(pass);
    setSubmitted(true);
    onComplete?.(block.id, pass);
  }, [questions, selected, passingScore, block.id, onComplete]);

  const handleRetry = useCallback(() => {
    setSelected(new Array(questions.length).fill(null));
    setSubmitted(false);
    setResults([]);
    setScore(0);
    setPassed(false);
  }, [questions.length]);

  if (!questions.length) return null;

  const pct = Math.round((score / maxScore) * 100);
  const allAnswered = selected.every((s) => s !== null);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-indigo-950/50 to-violet-950/50">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">Quiz</span>
          {required && <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">Required</Badge>}
        </div>
        <h3 className="text-base font-semibold text-white font-display">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{questions.length} question{questions.length > 1 ? "s" : ""} • Passing: {passingScore}%</p>
      </div>

      {/* Questions */}
      <div className="p-5 space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="space-y-3">
            <p className="text-sm font-medium text-white leading-relaxed">
              <span className="text-indigo-400 font-bold mr-2">{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const isCorrect = qi < results.length && oi === q.answer;
                const isWrong = submitted && isSelected && !isCorrect;

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200",
                      "flex items-center gap-3",
                      !submitted && "hover:border-indigo-500/50 hover:bg-indigo-950/20 cursor-pointer",
                      submitted && "cursor-default",
                      isSelected && !submitted && "border-indigo-500 bg-indigo-950/30 text-white",
                      !isSelected && !submitted && "border-white/10 bg-white/3 text-slate-300",
                      isCorrect && submitted && "border-emerald-500/50 bg-emerald-950/30 text-emerald-200",
                      isWrong && "border-red-500/50 bg-red-950/30 text-red-200",
                      !isCorrect && !isWrong && submitted && "border-white/5 bg-white/2 text-slate-500",
                    )}
                  >
                    <span className={cn(
                      "w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold",
                      isCorrect && submitted ? "border-emerald-500 bg-emerald-500 text-white" :
                      isWrong ? "border-red-500 bg-red-500 text-white" :
                      isSelected ? "border-indigo-500 bg-indigo-600 text-white" :
                      "border-white/20 text-slate-500",
                    )}>
                      {isCorrect && submitted ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && submitted && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {isWrong && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            {/* Explanation */}
            {submitted && q.explanation && (
              <div className="rounded-lg bg-slate-900 border border-white/10 p-3">
                <p className="text-xs text-slate-400 font-medium mb-1">Explanation</p>
                <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5 bg-slate-900/40">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            Submit Answers
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Score */}
            <div className="flex items-center justify-between text-sm mb-2">
              <span className={cn("font-semibold", passed ? "text-emerald-400" : "text-red-400")}>
                {passed ? "🎉 Passed!" : "❌ Not Passed"}
              </span>
              <span className="text-slate-300">
                {score}/{maxScore} correct ({pct}%)
              </span>
            </div>
            <Progress value={pct} className="h-2" />
            {!passed && (
              <Button
                variant="outline"
                onClick={handleRetry}
                className="w-full border-white/10 text-slate-300 hover:border-indigo-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockRenderer;
