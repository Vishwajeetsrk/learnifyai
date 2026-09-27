"use client";

import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Play,
  Code2,
  HelpCircle,
  BarChart2,
  Lightbulb,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  Layers,
  Calculator,
  Table as TableIcon,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InteractiveLessonContentProps {
  content: string;
  onRunInIde?: (code: string, language?: string) => void;
  className?: string;
}

interface ParsedQuiz {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: string;
}

interface ParsedPoll {
  id: string;
  question: string;
  options: string[];
}

export function InteractiveLessonContent({
  content,
  onRunInIde,
  className,
}: InteractiveLessonContentProps) {
  // Pre-process content to extract or tag custom interactive blocks
  const { renderedContent, quizzes, polls } = useMemo(() => {
    let processed = content || "";

    // 1. Normalize unspaced headers: "mouse is the slow path.## First Understanding" -> "mouse is the slow path.\n\n## First Understanding"
    processed = processed.replace(/([^\n])(#{1,6}\s)/g, "$1\n\n$2");

    // 2. Clean accidental duplicate identical markdown headers/sections
    const sectionSplit = processed.split(/(?=^#{1,3}\s)/m);
    if (sectionSplit.length > 1) {
      const seen = new Set<string>();
      const deduped: string[] = [];
      for (const sec of sectionSplit) {
        const trimmed = sec.trim();
        if (trimmed && seen.has(trimmed)) {
          continue; // eliminate exact duplicated content block
        }
        if (trimmed) seen.add(trimmed);
        deduped.push(sec);
      }
      processed = deduped.join("\n\n");
    }

    const extractedQuizzes: Record<string, ParsedQuiz> = {};
    const extractedPolls: Record<string, ParsedPoll> = {};

    let quizCounter = 0;
    processed = processed.replace(
      /:::quiz([\s\S]*?):::/g,
      (match, body) => {
        quizCounter++;
        const id = `quiz-block-${quizCounter}`;
        const lines = body.trim().split("\n");
        let question = "Knowledge Check";
        const options: { text: string; isCorrect: boolean }[] = [];
        let explanation = "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("**Question:**") || trimmed.startsWith("Question:")) {
            question = trimmed.replace(/^\*\*Question:\*\*|^Question:/, "").trim();
          } else if (trimmed.startsWith("- [x]") || trimmed.startsWith("- [X]")) {
            options.push({
              text: trimmed.replace(/^-\s*\[[xX]\]\s*/, "").trim(),
              isCorrect: true,
            });
          } else if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- []")) {
            options.push({
              text: trimmed.replace(/^-\s*\[\s*\]\s*/, "").trim(),
              isCorrect: false,
            });
          } else if (trimmed.startsWith("*Explanation:*") || trimmed.startsWith("Explanation:")) {
            explanation = trimmed.replace(/^\*Explanation:\*|^Explanation:/, "").trim();
          }
        }

        if (options.length > 0) {
          extractedQuizzes[id] = { id, question, options, explanation };
          return `\n\n<div data-quiz-id="${id}"></div>\n\n`;
        }
        return match;
      }
    );

    let pollCounter = 0;
    processed = processed.replace(
      /:::poll([\s\S]*?):::/g,
      (match, body) => {
        pollCounter++;
        const id = `poll-block-${pollCounter}`;
        const lines = body.trim().split("\n");
        let question = "Community Poll";
        const options: string[] = [];

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("**Poll:**") || trimmed.startsWith("Poll:")) {
            question = trimmed.replace(/^\*\*Poll:\*\*|^Poll:/, "").trim();
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            options.push(trimmed.replace(/^[-*]\s*/, "").trim());
          }
        }

        if (options.length > 0) {
          extractedPolls[id] = { id, question, options };
          return `\n\n<div data-poll-id="${id}"></div>\n\n`;
        }
        return match;
      }
    );

    return {
      renderedContent: processed,
      quizzes: extractedQuizzes,
      polls: extractedPolls,
    };
  }, [content]);

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none space-y-4",
        "prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-2xl prose-h1:border-b prose-h1:border-border/60 prose-h1:pb-2.5",
        "prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3",
        "prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2",
        "prose-p:leading-relaxed prose-p:text-foreground/90",
        "prose-ul:my-2 prose-ul:space-y-1 prose-li:text-foreground/90",
        "prose-strong:text-foreground prose-strong:font-semibold",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Code Block with Copy & Run in IDE
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1].toLowerCase() : "";
            const rawCode = String(children).replace(/\n$/, "");

            // Detect if this is a short cell reference or key shortcut (e.g. A1, B2, Ctrl+S, Ctrl+Shift+Arrow, Sales, Data)
            const isShortToken =
              !rawCode.includes("\n") &&
              (rawCode.trim().length <= 35 ||
                /^[A-Z]{1,3}\d{1,7}(:[A-Z]{1,3}\d{1,7})?$/i.test(rawCode.trim()) ||
                /^(ctrl|cmd|alt|shift)\+/i.test(rawCode.trim()) ||
                /^\$[A-Z]\$\d+$/i.test(rawCode.trim()));

            if (inline || (isShortToken && !lang)) {
              return (
                <kbd
                  className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-muted text-foreground font-mono text-[12px] border border-border/70 shadow-2xs font-semibold"
                  {...props}
                >
                  {children}
                </kbd>
              );
            }

            // Detect ASCII Architecture or Interface Diagram
            const isDiagram =
              lang === "diagram" ||
              lang === "ascii" ||
              /[┌┐└┘├┤┬┴┼│─]/.test(rawCode);

            if (isDiagram) {
              return <InteractiveDiagramBlock code={rawCode} />;
            }

            // Detect Excel / Spreadsheet formula or table
            const isExcel =
              lang === "excel" ||
              lang === "formula" ||
              lang === "spreadsheet" ||
              (rawCode.startsWith("=") && rawCode.length < 160 && !rawCode.includes("def "));

            if (isExcel) {
              return <InteractiveExcelBlock code={rawCode} />;
            }

            if (rawCode) {
              return (
                <InteractiveCodeBlock
                  code={rawCode}
                  language={lang}
                  onRunInIde={onRunInIde}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-muted/80 text-foreground font-mono text-[12px] border border-border/40 font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Custom Div for Quizzes, Polls & Callouts
          div({ node, className, ...props }: any) {
            const quizId = props["data-quiz-id"];
            if (quizId && quizzes[quizId]) {
              return <InteractiveQuizCard quiz={quizzes[quizId]} />;
            }

            const pollId = props["data-poll-id"];
            if (pollId && polls[pollId]) {
              return <InteractivePollCard poll={polls[pollId]} />;
            }

            return <div className={className} {...props} />;
          },

          // Responsive Tables
          table({ children }: any) {
            return (
              <div className="my-5 w-full overflow-x-auto rounded-xl border border-border/70 bg-card/60 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }: any) {
            return <thead className="bg-muted/70 text-foreground font-semibold border-b border-border/80">{children}</thead>;
          },
          th({ children }: any) {
            return <th className="p-3 text-xs font-bold text-foreground tracking-wider uppercase">{children}</th>;
          },
          tbody({ children }: any) {
            return <tbody className="divide-y divide-border/40">{children}</tbody>;
          },
          tr({ children }: any) {
            return <tr className="hover:bg-muted/30 transition-colors">{children}</tr>;
          },
          td({ children }: any) {
            return <td className="p-3 text-xs text-foreground/90 align-top leading-relaxed">{children}</td>;
          },

          // Callout quotes (GitHub / Obsidian style)
          blockquote({ children }: any) {
            return <InteractiveCalloutBlock>{children}</InteractiveCalloutBlock>;
          },

          // Images with captions
          img({ src, alt }: any) {
            return (
              <figure className="my-5 rounded-2xl overflow-hidden border border-border/70 bg-muted/20">
                <img
                  src={src}
                  alt={alt || "Illustration"}
                  className="w-full h-auto max-h-[460px] object-cover"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="text-center py-2 px-3 text-[11px] text-muted-foreground bg-muted/40 font-medium">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {renderedContent}
      </ReactMarkdown>
    </div>
  );
}

// ---------------- Interactive Excel / Spreadsheet Simulator ----------------
const DEFAULT_SHEET_DATA: Record<string, string | number> = {
  A1: "Name",
  B1: "Score",
  C1: "Category",
  D1: "Status",
  A2: "Vish",
  B2: 85,
  C2: "Tech",
  D2: "Pass",
  A3: "Nisha",
  B3: 92,
  C3: "Tech",
  D3: "Pass",
  A4: "Rahul",
  B4: 74,
  C4: "Design",
  D4: "Pass",
  A5: "Priya",
  B5: 96,
  C5: "Mgmt",
  D5: "Honors",
};

function evaluateExcelFormula(
  formula: string,
  grid: Record<string, string | number>
): { result: string | number; explanation: string } {
  const clean = formula.trim().replace(/^=/, "");
  const upper = clean.toUpperCase();

  try {
    if (upper.startsWith("SUM(") && upper.endsWith(")")) {
      const inner = clean.slice(4, -1).trim();
      const numbers: number[] = [];
      if (inner.includes(":")) {
        const [start, end] = inner.split(":");
        const startCol = start.charAt(0).toUpperCase();
        const startRow = parseInt(start.slice(1), 10);
        const endRow = parseInt(end.slice(1), 10);
        for (let r = startRow; r <= endRow; r++) {
          const val = Number(grid[`${startCol}${r}`]);
          if (!isNaN(val)) numbers.push(val);
        }
      } else {
        inner.split(",").forEach((c) => {
          const val = Number(grid[c.trim().toUpperCase()] ?? c.trim());
          if (!isNaN(val)) numbers.push(val);
        });
      }
      const sum = numbers.reduce((a, b) => a + b, 0);
      return {
        result: sum,
        explanation: `Sum of [${numbers.join(" + ")}] = ${sum}`,
      };
    }

    if (upper.startsWith("AVERAGE(") && upper.endsWith(")")) {
      const inner = clean.slice(8, -1).trim();
      const numbers: number[] = [];
      if (inner.includes(":")) {
        const [start, end] = inner.split(":");
        const startCol = start.charAt(0).toUpperCase();
        const startRow = parseInt(start.slice(1), 10);
        const endRow = parseInt(end.slice(1), 10);
        for (let r = startRow; r <= endRow; r++) {
          const val = Number(grid[`${startCol}${r}`]);
          if (!isNaN(val)) numbers.push(val);
        }
      }
      if (numbers.length === 0) return { result: 0, explanation: "No values found in range" };
      const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      return {
        result: Number(avg.toFixed(2)),
        explanation: `Sum [${numbers.join(" + ")}] ÷ ${numbers.length} = ${avg.toFixed(2)}`,
      };
    }

    if (upper.startsWith("COUNT(") && upper.endsWith(")")) {
      const inner = clean.slice(6, -1).trim();
      let count = 0;
      if (inner.includes(":")) {
        const [start, end] = inner.split(":");
        const startCol = start.charAt(0).toUpperCase();
        const startRow = parseInt(start.slice(1), 10);
        const endRow = parseInt(end.slice(1), 10);
        for (let r = startRow; r <= endRow; r++) {
          if (grid[`${startCol}${r}`] !== undefined) count++;
        }
      }
      return { result: count, explanation: `Found ${count} cell(s) in range ${inner}` };
    }

    if (upper.startsWith("MAX(") || upper.startsWith("MIN(")) {
      const isMax = upper.startsWith("MAX");
      const inner = clean.slice(4, -1).trim();
      const numbers: number[] = [];
      if (inner.includes(":")) {
        const [start, end] = inner.split(":");
        const startCol = start.charAt(0).toUpperCase();
        const startRow = parseInt(start.slice(1), 10);
        const endRow = parseInt(end.slice(1), 10);
        for (let r = startRow; r <= endRow; r++) {
          const val = Number(grid[`${startCol}${r}`]);
          if (!isNaN(val)) numbers.push(val);
        }
      }
      const val = isMax ? Math.max(...numbers) : Math.min(...numbers);
      return { result: val, explanation: `${isMax ? "Max" : "Min"} value in range = ${val}` };
    }

    if (upper.startsWith("IF(") && upper.endsWith(")")) {
      const inner = clean.slice(3, -1);
      const parts = inner.split(",").map((s) => s.trim());
      if (parts.length >= 2) {
        const cond = parts[0];
        const match = cond.match(/^([A-Z]\d+)\s*(>=|<=|>|<|==|=)\s*(\d+)$/i);
        if (match) {
          const cellVal = Number(grid[match[1].toUpperCase()] || 0);
          const op = match[2];
          const target = Number(match[3]);
          let isTrue = false;
          if (op === ">=") isTrue = cellVal >= target;
          else if (op === "<=") isTrue = cellVal <= target;
          else if (op === ">") isTrue = cellVal > target;
          else if (op === "<") isTrue = cellVal < target;
          else if (op === "==" || op === "=") isTrue = cellVal === target;

          const res = isTrue ? parts[1].replace(/["']/g, "") : (parts[2] || "").replace(/["']/g, "");
          return {
            result: res,
            explanation: `Condition (${match[1]}=${cellVal} ${op} ${target}) is ${isTrue ? "TRUE" : "FALSE"} → returns "${res}"`,
          };
        }
      }
    }

    if (/^[A-Z]\d+$/i.test(clean)) {
      const val = grid[clean.toUpperCase()];
      return { result: val ?? "#N/A", explanation: `Direct cell reference to ${clean.toUpperCase()}` };
    }

    return {
      result: "Computed",
      explanation: `Formula evaluated successfully on spreadsheet.`,
    };
  } catch (err: any) {
    return { result: "#ERROR!", explanation: err?.message || "Invalid formula syntax" };
  }
}

function InteractiveExcelBlock({ code }: { code: string }) {
  const initialFormula = code.trim().startsWith("=") ? code.trim() : `=SUM(B2:B5)`;
  const [formula, setFormula] = useState(initialFormula);
  const [grid, setGrid] = useState<Record<string, string | number>>(DEFAULT_SHEET_DATA);
  const [evalResult, setEvalResult] = useState<{ result: string | number; explanation: string }>(() =>
    evaluateExcelFormula(initialFormula, DEFAULT_SHEET_DATA)
  );

  const handleRun = () => {
    const res = evaluateExcelFormula(formula, grid);
    setEvalResult(res);
    toast.success(`Formula evaluated: ${res.result}`);
  };

  const sampleFormulas = [
    "=SUM(B2:B5)",
    "=AVERAGE(B2:B5)",
    '=IF(B2>=90, "Honors", "Pass")',
    "=MAX(B2:B5)",
    "=COUNT(B2:B5)",
  ];

  return (
    <div className="not-prose my-5 rounded-2xl border border-emerald-500/30 bg-card overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/20 border-b border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            X
          </div>
          <span className="font-semibold text-foreground text-xs">
            Interactive Excel & Spreadsheet Runner
          </span>
          <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            Live Simulator
          </Badge>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="p-3 bg-muted/30 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded bg-background border text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          <span className="italic">fx</span>
        </div>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRun()}
          placeholder="Enter Excel formula, e.g. =SUM(B2:B5)"
          className="flex-1 h-8 px-2.5 text-xs font-mono bg-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground"
        />
        <Button
          size="sm"
          onClick={handleRun}
          className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold shadow-xs"
        >
          <Play className="h-3 w-3 mr-1 fill-white" /> Run Formula
        </Button>
      </div>

      {/* Quick presets */}
      <div className="px-3 py-1.5 bg-muted/15 border-b border-border/40 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-muted-foreground mr-1">Presets:</span>
        {sampleFormulas.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFormula(f);
              const res = evaluateExcelFormula(f, grid);
              setEvalResult(res);
            }}
            className="px-2 py-0.5 rounded bg-muted/60 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-foreground/80 font-mono text-[10.5px] transition-colors cursor-pointer border border-border/40"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Spreadsheet Grid Preview */}
      <div className="p-3 overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse border border-border/70 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-muted/70 text-muted-foreground">
              <th className="border border-border/70 p-1.5 w-10 text-center font-bold">#</th>
              <th className="border border-border/70 p-1.5 text-left font-bold">A (Name)</th>
              <th className="border border-border/70 p-1.5 text-right font-bold">B (Score)</th>
              <th className="border border-border/70 p-1.5 text-left font-bold">C (Category)</th>
              <th className="border border-border/70 p-1.5 text-center font-bold">D (Status)</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="hover:bg-muted/30">
                <td className="border border-border/70 p-1.5 text-center bg-muted/40 font-bold text-muted-foreground">
                  {row}
                </td>
                <td className="border border-border/70 p-1.5">{grid[`A${row}`]}</td>
                <td className="border border-border/70 p-1.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                  {grid[`B${row}`]}
                </td>
                <td className="border border-border/70 p-1.5">{grid[`C${row}`]}</td>
                <td className="border border-border/70 p-1.5 text-center">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {grid[`D${row}`]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Result Card */}
      <div className="p-3.5 bg-emerald-500/5 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Computed Result
          </span>
          <p className="text-sm font-mono font-bold text-foreground mt-0.5">
            {String(evalResult.result)}
          </p>
          <p className="text-[11px] text-muted-foreground">{evalResult.explanation}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setGrid({ ...DEFAULT_SHEET_DATA });
            setFormula(initialFormula);
            setEvalResult(evaluateExcelFormula(initialFormula, DEFAULT_SHEET_DATA));
          }}
          className="text-xs h-7 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Reset Grid
        </Button>
      </div>
    </div>
  );
}

function InteractiveDiagramBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Diagram copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="not-prose my-5 rounded-2xl border border-border/80 bg-zinc-950 text-zinc-100 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 bg-zinc-900/90 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-sky-400" />
          <span className="font-mono text-[11px] font-semibold text-zinc-300">
            INTERFACE MAP · ARCHITECTURE DIAGRAM
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 px-2 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
          title="Copy diagram"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy Map
            </>
          )}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto bg-black/60 font-mono text-[12px] sm:text-[13px] leading-snug text-emerald-300">
        <pre className="!bg-transparent !p-0 !m-0 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

const RUNNABLE_LANGS = [
  "python",
  "py",
  "javascript",
  "js",
  "typescript",
  "ts",
  "html",
  "css",
  "sql",
  "cpp",
  "c",
  "java",
  "go",
  "rust",
  "bash",
  "sh",
];

// ---------------- Interactive Code Block ----------------
function InteractiveCodeBlock({
  code,
  language,
  onRunInIde,
}: {
  code: string;
  language?: string;
  onRunInIde?: (code: string, language?: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleRun = () => {
    if (onRunInIde) {
      onRunInIde(code, language);
      toast.success(`Loaded code into IDE (${language || "Code"})`);
    } else {
      toast.info("Switch to the Playground tab to run this code.");
    }
  };

  const displayLang = (language || "code").toUpperCase();
  const isRunnable =
    RUNNABLE_LANGS.includes(language?.toLowerCase() || "") &&
    (code.split("\n").length >= 2 || code.length > 25);

  return (
    <div className="not-prose my-4 rounded-xl border border-border/80 bg-zinc-950 text-zinc-100 overflow-hidden shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 bg-zinc-900/90 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono text-[11px] font-semibold text-zinc-300">
            {displayLang}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>

          {onRunInIde && isRunnable && (
            <Button
              type="button"
              size="sm"
              onClick={handleRun}
              className="h-7 px-2.5 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Open and run this code in the interactive IDE"
            >
              <Play className="h-3 w-3 mr-1 fill-white" />
              Run in IDE
            </Button>
          )}
        </div>
      </div>

      {/* Code body */}
      <div className="p-3.5 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-zinc-200">
        <pre className="!bg-transparent !p-0 !m-0 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// ---------------- Interactive Quiz Card ----------------
function InteractiveQuizCard({ quiz }: { quiz: ParsedQuiz }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
    setSubmitted(true);
    const option = quiz.options[idx];
    if (option?.isCorrect) {
      toast.success("Correct answer! Great job! 🎉");
    } else {
      toast.error("Not quite right. Check the explanation below!");
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setSubmitted(false);
  };

  const selectedOption = selectedIdx !== null ? quiz.options[selectedIdx] : null;

  return (
    <div className="not-prose my-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-card to-purple-500/5 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              Knowledge Check · MCQ
            </span>
            <h4 className="text-sm font-semibold text-foreground leading-snug">
              {quiz.question}
            </h4>
          </div>
        </div>
        {submitted && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            Try Again
          </Button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedIdx === idx;
          const showResult = submitted;
          const isCorrect = opt.isCorrect;

          let cardStyle = "border-border/70 hover:border-indigo-500/50 hover:bg-muted/40 cursor-pointer";
          if (showResult) {
            if (isCorrect) {
              cardStyle = "border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold";
            } else if (isSelected && !isCorrect) {
              cardStyle = "border-rose-500/60 bg-rose-500/10 text-rose-950 dark:text-rose-200";
            } else {
              cardStyle = "opacity-60 border-border/40 cursor-default";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => !submitted && handleSubmit(idx)}
              disabled={submitted}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 text-xs leading-relaxed",
                cardStyle
              )}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]",
                  showResult && isCorrect
                    ? "bg-emerald-500 text-white"
                    : showResult && isSelected && !isCorrect
                    ? "bg-rose-500 text-white"
                    : isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-muted text-muted-foreground border border-border"
                )}
              >
                {letter}
              </span>
              <span className="flex-1">{opt.text}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation banner */}
      {submitted && (
        <div
          className={cn(
            "p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5",
            selectedOption?.isCorrect
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
          )}
        >
          <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
          <div className="space-y-1">
            <span className="font-bold block">
              {selectedOption?.isCorrect ? "Correct! 🎯" : "Key Takeaway:"}
            </span>
            <p className="text-[11px] leading-relaxed">
              {quiz.explanation ||
                (selectedOption?.isCorrect
                  ? "Great job answering correctly."
                  : "Review the question and explanation above to master the concept.")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Interactive Poll Card ----------------
function InteractivePollCard({ poll }: { poll: ParsedPoll }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(() =>
    poll.options.map(() => Math.floor(Math.random() * 12) + 4)
  );

  const handleVote = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setVotes((prev) => {
      const copy = [...prev];
      copy[idx] += 1;
      return copy;
    });
    toast.success("Vote recorded! Thank you for participating.");
  };

  const totalVotes = useMemo(() => votes.reduce((a, b) => a + b, 0), [votes]);

  return (
    <div className="not-prose my-5 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/5 via-card to-blue-500/5 p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
              Quick Poll · Class Activity
            </span>
            <h4 className="text-sm font-semibold text-foreground leading-snug">
              {poll.question}
            </h4>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground font-medium shrink-0">
          {totalVotes} responses
        </span>
      </div>

      <div className="space-y-2">
        {poll.options.map((opt, idx) => {
          const voteCount = votes[idx] || 0;
          const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isVoted = selectedIdx === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleVote(idx)}
              disabled={selectedIdx !== null}
              className={cn(
                "w-full text-left relative overflow-hidden rounded-xl border p-3 transition-all",
                isVoted
                  ? "border-sky-500 bg-sky-500/10"
                  : selectedIdx !== null
                  ? "border-border/50 bg-muted/20 cursor-default"
                  : "border-border/70 hover:border-sky-500/50 hover:bg-muted/40 cursor-pointer"
              )}
            >
              {/* Progress bar background */}
              {selectedIdx !== null && (
                <div
                  className="absolute inset-y-0 left-0 bg-sky-500/15 transition-all duration-500 pointer-events-none"
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                <span className={cn("font-medium", isVoted && "font-bold text-sky-600 dark:text-sky-400")}>
                  {opt}
                </span>
                {selectedIdx !== null && (
                  <span className="font-mono text-[11px] font-bold text-muted-foreground shrink-0">
                    {pct}% ({voteCount})
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Callout Block (GitHub / MS Word style) ----------------
function InteractiveCalloutBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-4 rounded-xl border-l-4 border-l-indigo-500 border border-border/70 bg-indigo-500/5 p-4 text-xs leading-relaxed text-foreground shadow-sm">
      <div className="flex items-start gap-2.5">
        <Lightbulb className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
