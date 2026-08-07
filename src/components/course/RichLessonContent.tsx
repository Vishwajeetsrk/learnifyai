import { useState, useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check,
  Copy,
  ExternalLink,
  Lightbulb,
  Info,
  AlertTriangle,
  Rocket,
  Terminal,
  Code2,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { saveEditorCode } from "@/lib/playground/projects";

const IDE_LANGS = new Set(["html", "css", "javascript", "jsx", "typescript", "tsx", "python", "node"]);

function normalizeUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;
  if (src.startsWith("/")) return `${window.location.origin}${src}`;
  return `${window.location.origin}/${src}`;
}

function CodeBlock({
  language,
  code,
  onOpenInIde,
}: {
  language: string;
  code: string;
  onOpenInIde: (code: string, lang: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed");
    }
  };
  const canIde = IDE_LANGS.has(language);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-[#0d1117]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {language || "code"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {canIde && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[11px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
              onClick={() => onOpenInIde(code, language)}
            >
              <Code2 className="h-3 w-3 mr-1" /> Open in IDE
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-[11px] text-slate-300 hover:text-white hover:bg-white/10"
            onClick={copy}
          >
            {copied ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed text-slate-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function parseQuiz(md: string): { question: string; options: string[]; correct: number; explain?: string } | null {
  const lines = md.split("\n").map((l) => l.trim()).filter(Boolean);
  const question = lines.find((l) => /^Q\s*:/i.test(l))?.replace(/^Q\s*:/i, "").trim();
  if (!question) return null;
  const options: string[] = [];
  for (const line of lines) {
    const m = line.match(/^([A-Ha-h])[.)]\s+(.+)$/);
    if (m) options.push(m[2]);
  }
  const correctMatch = lines.find((l) => /^Correct\s*:\s*([A-Ha-h])/i.test(l));
  if (!correctMatch || options.length < 2) return null;
  const letter = correctMatch.match(/^Correct\s*:\s*([A-Ha-h])/i)![1].toUpperCase();
  const correct = letter.charCodeAt(0) - 65;
  if (correct >= options.length) return null;
  const explain = lines.find((l) => /^Explain\s*:/i.test(l))?.replace(/^Explain\s*:/i, "").trim();
  return { question, options, correct, explain };
}

function QuizCard({ md }: { md: string }) {
  const quiz = useMemo(() => parseQuiz(md), [md]);
  const [selected, setSelected] = useState<number | null>(null);
  if (!quiz) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
        Invalid quiz block — expected <code>Q: question</code>, <code>A. option</code>…, <code>Correct: A</code>
      </div>
    );
  }
  const answered = selected !== null;
  const isCorrect = answered && selected === quiz.correct;
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
          <Layers className="h-4 w-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Quick Check</span>
      </div>
      <p className="mb-4 font-semibold text-foreground">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const isAnswer = i === quiz.correct;
          const picked = i === selected;
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                !answered && "border-border/70 bg-background/60 hover:border-indigo-400/60 hover:bg-indigo-500/10 cursor-pointer",
                answered && isAnswer && "border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
                answered && !isAnswer && picked && "border-red-500/60 bg-red-500/10 text-red-200",
                answered && !isAnswer && !picked && "border-border/40 opacity-60",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold">
                {letter}
              </span>
              <span>{opt}</span>
              {answered && isAnswer && <Check className="ml-auto h-4 w-4 text-emerald-400" />}
              {answered && !isAnswer && picked && <AlertTriangle className="ml-auto h-4 w-4 text-red-400" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={cn(
            "mt-4 rounded-xl border p-3 text-sm",
            isCorrect
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/40 bg-red-500/10 text-red-200",
          )}
        >
          {isCorrect ? (
            <span className="flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Correct! {quiz.explain && <span className="text-foreground/80">{quiz.explain}</span>}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Not quite — the answer is{" "}
              <b>{String.fromCharCode(65 + quiz.correct)}</b>. {quiz.explain && <span className="text-foreground/80">{quiz.explain}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Flashcards({ md }: { md: string }) {
  const cards = useMemo(
    () =>
      md
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l.split("|").map((s) => s.trim()))
        .filter((parts) => parts.length === 2 && parts[0]),
    [md],
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
        Invalid flashcards block — one per line: <code>front | back</code>
      </div>
    );
  }
  const card = cards[index];
  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Flashcards — {index + 1}/{cards.length}
          </span>
        </div>
      </div>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full cursor-pointer rounded-2xl border border-border/70 bg-background/70 p-6 text-center transition-all hover:border-purple-400/50"
        style={{ perspective: "800px" }}
      >
        <div
          className="transition-transform duration-500"
          style={{ transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)" }}
        >
          <div className="text-5xl font-bold text-purple-300/30">{flipped ? "🙃" : "💡"}</div>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {flipped ? card[1] : card[0]}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Tap to {flipped ? "see question" : "reveal answer"}</p>
        </div>
      </button>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setFlipped(false);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={index === cards.length - 1}
          onClick={() => {
            setIndex((i) => Math.min(cards.length - 1, i + 1));
            setFlipped(false);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Callout({ children, type }: { children: ReactNode; type: "note" | "tip" | "warning" | "info" }) {
  const config = {
    note: { icon: Info, classes: "border-sky-500/40 bg-sky-500/10 text-sky-200", label: "Note" },
    tip: { icon: Lightbulb, classes: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200", label: "Tip" },
    warning: { icon: AlertTriangle, classes: "border-amber-500/40 bg-amber-500/10 text-amber-200", label: "Warning" },
    info: { icon: Rocket, classes: "border-indigo-500/40 bg-indigo-500/10 text-indigo-200", label: "In Depth" },
  }[type];
  const Icon = config.icon;
  return (
    <div className={cn("my-4 flex gap-3 rounded-xl border p-4", config.classes)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-sm leading-relaxed [&_p]:my-0 [&_a]:underline">{children}</div>
    </div>
  );
}

export function RichLessonContent({ content }: { content: string }) {
  const navigate = useNavigate();
  const saveEditorFn = useServerFn(saveEditorCode);

  const openInIde = async (code: string, lang: string) => {
    const normalized = lang === "jsx" || lang === "tsx" ? "javascript" : lang;
    try {
      toast.loading("Preparing your workspace…", { id: "lesson-ide" });
      const res = await saveEditorFn({
        data: {
          title: "Course Practice",
          code,
          language: normalized === "node" ? "javascript" : normalized,
        },
      });
      toast.success("Workspace ready!", { id: "lesson-ide" });
      navigate({ to: "/playground/editor", search: { project: res.projectId } });
    } catch (e: any) {
      toast.error(e?.message ?? "Please sign in to open the IDE", { id: "lesson-ide" });
    }
  };

  const resolveCallout = (children: ReactNode, isAlert: boolean) => {
    const raw = Array.isArray(children)
      ? children
          .map((c) =>
            typeof c === "object" && c !== null && "props" in c
              ? String((c as any).props?.children ?? "")
              : String(c),
          )
          .join("")
      : "";
    const trimmed = raw.trim();
    const alertMatch = /^\[!?(note|tip|warning|info|important)\]/i.exec(trimmed);
    if (isAlert && alertMatch) {
      const kind = alertMatch[1].toLowerCase();
      const type: "note" | "tip" | "warning" | "info" = kind === "important" ? "info" : (kind as "note" | "tip" | "warning" | "info");
      return (
        <Callout type={type}>
          {trimmed.replace(/^\[!?(note|tip|warning|info|important)\]\s*/i, "")}
        </Callout>
      );
    }
    if (!isAlert && /\[!tip\]/i.test(trimmed)) {
      return <Callout type="tip">{children}</Callout>;
    }
    if (!isAlert && /\[!warning\]/i.test(trimmed)) {
      return <Callout type="warning">{children}</Callout>;
    }
    if (!isAlert && /\[!info\]/i.test(trimmed)) {
      return <Callout type="info">{children}</Callout>;
    }
    return <blockquote className="border-l-4 border-indigo-400/60 bg-muted/30 py-2 pl-4 pr-3 italic text-muted-foreground">{children}</blockquote>;
  };

  return (
    <div className="rich-lesson-content space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, node }) => {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match?.[1] ?? "";
            const code = String(children).replace(/\n$/, "");
            if (lang === "quiz") return <QuizCard md={code} />;
            if (lang === "flashcards") return <Flashcards md={code} />;
            if (lang === "diagram") {
              return (
                <div className="overflow-x-auto rounded-xl border border-border/70 bg-[#0d1117] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <Terminal className="h-3 w-3" /> Diagram
                  </div>
                  <pre className="font-mono text-[12.5px] leading-relaxed text-emerald-300">{code}</pre>
                </div>
              );
            }
            return <CodeBlock language={lang || "text"} code={code} onOpenInIde={openInIde} />;
          },
          blockquote: ({ children }) => resolveCallout(children, false),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
                <th className="border-b border-border/70 bg-muted/60 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-foreground">
                  {children}
                </th>
              ),
          td: ({ children }) => (
            <td className="border-b border-border/40 px-3 py-2 text-[13px] text-foreground/85">{children}</td>
          ),
          img: ({ src, alt }) => (
            <figure className="my-4 overflow-hidden rounded-2xl border border-border/60">
              <img
                src={normalizeUrl(src ?? "")}
                alt={alt ?? ""}
                className="w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml;utf8," +
                    encodeURIComponent(
                      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='#1e1b4b'/><text x='50%' y='50%' fill='#818cf8' font-family='sans-serif' font-size='20' text-anchor='middle'>${alt ?? "Illustration"}</text></svg>`,
                    );
                }}
              />
              {alt && <figcaption className="border-t border-border/50 bg-muted/30 px-3 py-1.5 text-center text-xs text-muted-foreground">{alt}</figcaption>}
            </figure>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="font-medium text-indigo-400 underline decoration-indigo-400/40 underline-offset-2 hover:text-indigo-300"
            >
              {children} {href?.startsWith("http") && <ExternalLink className="inline h-3 w-3" />}
            </a>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 flex items-center gap-2 border-b border-border/50 pb-2 text-lg font-bold text-foreground first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => <h3 className="mt-6 text-base font-bold text-foreground first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="leading-relaxed text-foreground/85">{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5 marker:text-indigo-400">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5 marker:text-indigo-400">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-foreground/85">{children}</li>,
          hr: () => <hr className="border-border/60" />,
          input: ({ checked, disabled }) => (
            <input type="checkbox" checked={!!checked} disabled={!!disabled} className="mr-2 accent-indigo-500" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
