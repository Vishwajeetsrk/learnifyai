import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Sparkles,
  BookOpen,
  Wrench,
  Zap,
  RefreshCcw,
  FileText,
  FlaskConical,
  Pencil,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { playgroundAiDebug } from "@/lib/playground-ai.functions";

type ActionKey =
  "diagnose" | "explain" | "fix" | "optimize" | "convert" | "tests" | "docs" | "generate";

const ACTIONS: {
  key: ActionKey;
  label: string;
  Icon: typeof Sparkles;
  prompt: (lang: string, q: string) => string;
}[] = [
  {
    key: "diagnose",
    label: "Diagnose",
    Icon: Sparkles,
    prompt: (_l, q) =>
      q ||
      "Diagnose why this program fails using the stderr and exit code. State the root cause in 2-3 bullets, then return the complete corrected program in one fenced code block.",
  },
  {
    key: "explain",
    label: "Explain",
    Icon: BookOpen,
    prompt: (_l) =>
      "Explain what this code does step by step in plain language, including inputs, outputs, and any edge cases it handles. Then re-output the same code unchanged so the editor stays intact.",
  },
  {
    key: "fix",
    label: "Fix errors",
    Icon: Wrench,
    prompt: () =>
      "Find and fix all bugs and runtime errors in this program. Return the complete corrected program in one fenced code block, then 1-3 bullets on what changed and why.",
  },
  {
    key: "optimize",
    label: "Optimize",
    Icon: Zap,
    prompt: () =>
      "Refactor this program for readability and performance while keeping behaviour identical. Return the complete optimized program in one fenced code block, then brief bullets on the improvements.",
  },
  {
    key: "convert",
    label: "Convert",
    Icon: RefreshCcw,
    prompt: (_l, q) =>
      `Convert this program to ${q || "TypeScript"}, preserving behaviour and using idiomatic constructs and the standard library of the target language. Return the converted full program in one fenced code block tagged with the target language.`,
  },
  {
    key: "tests",
    label: "Tests",
    Icon: FlaskConical,
    prompt: (l) =>
      `Write unit tests for this ${l} program using the language's standard test framework and conventions (include the command to run them). Return the complete test file as one fenced code block.`,
  },
  {
    key: "docs",
    label: "Docs",
    Icon: FileText,
    prompt: () =>
      "Add concise docstrings and comments to every public function, type, and exported symbol without changing any logic. Return the documented full program in one fenced code block.",
  },
  {
    key: "generate",
    label: "Generate",
    Icon: Pencil,
    prompt: (l, q) =>
      `Generate ${l} code that does the following: ${q || "describe what you want in the input box."} Return only the complete program in one fenced code block. If details are missing, make reasonable assumptions and list them in 1-2 bullets after the code.`,
  },
];

interface Props {
  language: string;
  code: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  stdin: string;
  onApplyFix: (next: string) => void;
}

function extractFix(reply: string, language: string): string | null {
  if (!reply) return null;
  const fence = /```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g;
  let best: { body: string } | null = null;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(reply)) !== null) {
    const tag = (m[1] || "").toLowerCase();
    const body = m[2];
    if (!body.trim()) continue;
    if (tag === language.toLowerCase() || (tag === "tsx" && language === "typescript")) {
      best = { body };
      break;
    }
    if (!best) best = { body };
  }
  return best?.body.trimEnd() ?? null;
}

export function PlaygroundAiDebugPanel({
  language,
  code,
  stdout,
  stderr,
  exitCode,
  stdin,
  onApplyFix,
}: Props) {
  const ask = useServerFn(playgroundAiDebug);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [action, setAction] = useState<ActionKey>("diagnose");

  const fix = useMemo(() => extractFix(reply, language), [reply, language]);
  const currentAction = ACTIONS.find((a) => a.key === action)!;

  async function run(actionKey: ActionKey = action) {
    if (!code.trim() && actionKey !== "generate") {
      toast.error("Write some code first");
      return;
    }
    const act = ACTIONS.find((a) => a.key === actionKey)!;
    setAction(actionKey);
    setLoading(true);
    setReply("");
    setErrorMsg(null);
    setApplied(false);
    try {
      const res = await ask({
        data: {
          language,
          code: code || "(empty)",
          stdout,
          stderr,
          exitCode,
          question: act.prompt(language, question.trim()),
        },
      });
      setReply(res.reply);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    if (!fix) return;
    onApplyFix(fix);
    setApplied(true);
    toast.success("Applied to editor");
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border/60 bg-card/30 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" /> AI assistant
        <span className="ml-auto rounded-md border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-foreground">
          {language}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {ACTIONS.map((a) => {
          const Icon = a.Icon;
          const active = a.key === action;
          return (
            <button
              key={a.key}
              onClick={() => setAction(a.key)}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition ${
                active
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "border-border bg-background text-foreground/80 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" /> {a.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            action === "convert"
              ? "Target language (e.g. Rust, TypeScript)…"
              : action === "generate"
                ? "Describe what you want to build…"
                : "Optional details (or leave blank)…"
          }
          className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) run();
          }}
        />
        <Button size="sm" onClick={() => run()} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <currentAction.Icon className="mr-1 h-3.5 w-3.5" />
          )}
          {currentAction.label}
        </Button>
      </div>
      {errorMsg && !loading && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="flex-1">
            <div className="font-semibold text-destructive">AI request failed</div>
            <div className="mt-0.5 break-words text-foreground/80">{errorMsg}</div>
          </div>
          <Button size="sm" variant="outline" className="h-7 shrink-0" onClick={() => run()}>
            <RefreshCcw className="mr-1 h-3 w-3" /> Retry
          </Button>
        </div>
      )}
      {reply && (
        <>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border/60 bg-background p-2 text-xs leading-relaxed text-foreground">
            {reply}
          </pre>
          {fix && (
            <div className="flex items-center justify-between rounded-md border border-primary/40 bg-primary/5 px-2 py-1.5">
              <span className="text-[11px] text-muted-foreground">
                Suggested {language} fix detected ({fix.split("\n").length} lines)
              </span>
              <Button size="sm" variant="secondary" onClick={apply} disabled={applied}>
                {applied ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
                {applied ? "Applied" : "Apply fix"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
