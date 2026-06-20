import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Lightbulb,
  Bug,
  Zap,
  MessageSquare,
  Repeat,
  Beaker,
  Wand2,
  Copy,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { aiCodeAssistant } from "@/lib/playground/ai";

const ACTIONS = [
  { id: "explain" as const, label: "Explain Code", icon: Lightbulb, color: "text-blue-500" },
  { id: "fix" as const, label: "Fix Bugs", icon: Bug, color: "text-red-500" },
  { id: "optimize" as const, label: "Optimize", icon: Zap, color: "text-amber-500" },
  { id: "comment" as const, label: "Add Comments", icon: MessageSquare, color: "text-green-500" },
  { id: "convert" as const, label: "Convert Language", icon: Repeat, color: "text-purple-500" },
  { id: "unittest" as const, label: "Unit Tests", icon: Beaker, color: "text-cyan-500" },
  { id: "complete" as const, label: "Complete Code", icon: Wand2, color: "text-pink-500" },
];

interface AIPanelProps {
  code: string;
  language: string;
  onCodeResult?: (code: string) => void;
}

export function AIPanel({ code, language, onCodeResult }: AIPanelProps) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState("python");
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const aiFn = useServerFn(aiCodeAssistant);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const runAction = async (actionId: string) => {
    if (!code.trim()) return toast.error("No code to analyze");
    setBusy(true);
    setResult(null);
    setActiveAction(actionId);
    try {
      const res = await aiFn({
        data: {
          action: actionId as any,
          code,
          language,
          targetLanguage: actionId === "convert" ? targetLang : undefined,
        },
      });
      setResult(res.content);
    } catch (err: any) {
      setResult(`Error: ${err?.message ?? "Failed to process"}`);
    } finally {
      setBusy(false);
    }
  };

  const extractCode = (text: string): string | null => {
    const match = text.match(/```[\w]*\n([\s\S]*?)```/);
    return match ? match[1].trim() : null;
  };

  const applyResult = () => {
    if (!result) return;
    const extracted = extractCode(result);
    if (extracted && onCodeResult) {
      onCodeResult(extracted);
      toast.success("Code applied to editor");
    } else if (onCodeResult) {
      onCodeResult(result);
      toast.success("Code applied to editor");
    }
  };

  const copyResult = async () => {
    if (!result) return;
    const extracted = extractCode(result) || result;
    await navigator.clipboard.writeText(extracted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 px-3 py-2 border-b text-xs font-medium hover:bg-accent"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        AI Assistant
        <ChevronDown className={`h-3 w-3 ml-auto transition ${collapsed ? "rotate-180" : ""}`} />
      </button>
      {!collapsed && (
        <div className="flex-1 overflow-auto p-2 space-y-1.5">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => runAction(action.id)}
              disabled={busy}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition ${
                activeAction === action.id && busy
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              } disabled:opacity-50`}
            >
              {busy && activeAction === action.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <action.icon className={`h-3.5 w-3.5 ${action.color}`} />
              )}
              <span className="flex-1 text-left">{action.label}</span>
            </button>
          ))}

          {activeAction === "convert" && (
            <div className="px-2.5 py-2">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full text-xs rounded border bg-muted px-2 py-1"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
                <option value="csharp">C#</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
              </select>
            </div>
          )}

          {result && (
            <div ref={resultRef} className="mt-2 border rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 border-b text-[10px]">
                <span className="flex-1 font-medium truncate">Result</span>
                <button
                  onClick={applyResult}
                  className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                  title="Apply to editor"
                >
                  <Wand2 className="h-3 w-3" />
                </button>
                <button
                  onClick={copyResult}
                  className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="p-2 text-xs whitespace-pre-wrap max-h-60 overflow-auto font-mono leading-relaxed">
                {result}
              </div>
            </div>
          )}

          {busy && !result && (
            <div className="flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="animate-pulse">Processing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
