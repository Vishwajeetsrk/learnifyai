import { useRef, useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Send,
  Loader2,
  Sparkles,
  Terminal,
  Search,
  Lightbulb,
  Bookmark,
  Copy,
  RotateCcw,
  FileText,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Step {
  type: string;
  thought?: string;
  name?: string;
  arguments?: any;
  result?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  steps?: Step[];
}

interface AgentChatProps {
  agentName: string;
  agentIcon: React.ReactNode;
  agentColor: string;
  accentGradient: string;
  chatFn: any;
  placeholder?: string;
  suggestions: { label: string; prompt: string }[];
  userContext?: string;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      <span
        className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}

export function AgentChat({
  agentName,
  agentIcon,
  agentColor,
  accentGradient,
  chatFn,
  placeholder,
  suggestions,
  userContext,
}: AgentChatProps) {
  const sendFn = useServerFn(chatFn);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(`learnify_agent_history_${agentName}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveStep, setLiveStep] = useState("");
  const [savedInsights, setSavedInsights] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(`learnify_saved_insights_${agentName}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSavedModal, setShowSavedModal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(`learnify_agent_history_${agentName}`, JSON.stringify(messages));
    }
  }, [messages, agentName]);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleClearHistory = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`learnify_agent_history_${agentName}`);
    }
    toast.success("Chat history cleared!");
  };

  const handleSaveInsight = (content: string) => {
    if (!content.trim()) return;
    const updated = [...new Set([...savedInsights, content])];
    setSavedInsights(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`learnify_saved_insights_${agentName}`, JSON.stringify(updated));
    }
    toast.success("Insight saved to your bookmarks!");
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setLiveStep("Thinking...");

    try {
      const res = await sendFn({
        data: {
          content: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          ...(userContext
            ? { userProfile: userContext, learningContext: userContext, marketContext: userContext }
            : {}),
        },
      });

      const steps = res.steps || [];
      const toolCalls = steps.filter((s: Step) => s.type === "tool_call");
      if (toolCalls.length > 0) {
        const lastTool = toolCalls[toolCalls.length - 1];
        if (lastTool.name === "web_search") setLiveStep("Searching & analyzing...");
        else if (lastTool.name === "execute_code") setLiveStep("Running code...");
      }
      setLiveStep("");

      const assistantMsg: Message = {
        role: "assistant",
        content: res.content || "",
        steps,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message || "Something went wrong. Please try again."}`,
        },
      ]);
    } finally {
      setLoading(false);
      setLiveStep("");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Top Header Controls Bar */}
      <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">{agentName} Session</span>
          {messages.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {messages.length} messages
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setShowSavedModal(true)}
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
            <span>Saved Insights ({savedInsights.length})</span>
          </Button>
          {messages.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={handleClearHistory}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </Button>
          )}
        </div>
      </div>

      {/* Saved Insights Modal */}
      {showSavedModal && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md p-6 overflow-y-auto space-y-4 animate-in fade-in-0">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-base">Saved {agentName} Insights</h3>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setShowSavedModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {savedInsights.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm space-y-2">
              <Bookmark className="h-10 w-10 mx-auto opacity-30" />
              <p>No saved insights yet.</p>
              <p className="text-xs">
                Click the bookmark icon on any AI response to save key career & market insights.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border bg-card text-xs leading-relaxed space-y-2 relative group shadow-sm"
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {insight}
                    </ReactMarkdown>
                  </div>
                  <div className="flex gap-2 pt-2 border-t text-[11px]">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] gap-1"
                      onClick={() => {
                        navigator.clipboard.writeText(insight);
                        toast.success("Insight copied!");
                      }}
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[10px] text-red-500 hover:text-red-600"
                      onClick={() => {
                        const updated = savedInsights.filter((_, i) => i !== idx);
                        setSavedInsights(updated);
                        localStorage.setItem(
                          `learnify_saved_insights_${agentName}`,
                          JSON.stringify(updated),
                        );
                        toast.success("Insight removed");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4",
                agentColor,
              )}
            >
              {agentIcon}
            </div>
            <h3 className="text-lg font-bold mb-1">{agentName}</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">{placeholder}</p>
            <div className="grid gap-2 w-full max-w-md">
              {suggestions.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start text-xs h-auto py-2.5 px-4 rounded-xl border-dashed hover:border-primary/50 hover:bg-accent/50 text-left"
                  onClick={() => {
                    setInput(s.prompt);
                    handleSend(s.prompt);
                  }}
                  disabled={loading}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2 shrink-0 text-primary" />
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[95%] sm:max-w-[85%] space-y-1 min-w-0",
                  msg.role === "assistant" && "flex items-start gap-2",
                )}
              >
                {msg.role === "assistant" && (
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                      agentColor,
                    )}
                  >
                    {agentIcon}
                  </div>
                )}
                <div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm relative group",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card text-card-foreground border border-border rounded-tl-sm",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div>
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        {/* Response Action Bar (Bookmark & Copy) */}
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] gap-1 hover:text-amber-500 px-1.5"
                            onClick={() => handleSaveInsight(msg.content)}
                          >
                            <Bookmark className="h-3 w-3 text-amber-500" /> Save Insight
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] gap-1 hover:text-primary px-1.5"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              toast.success("Response copied!");
                            }}
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {msg.steps
                        .filter((s) => s.type === "tool_call")
                        .map((step, si) => (
                          <ToolCallBadge key={si} step={step} />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[85%]">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                  agentColor,
                )}
              >
                {agentIcon}
              </div>
              <div className="rounded-2xl px-4 py-3 border border-border bg-card rounded-tl-sm shadow-sm">
                {liveStep ? (
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    {liveStep === "Searching & analyzing..." && (
                      <Search className="h-3 w-3 animate-pulse" />
                    )}
                    {liveStep === "Running code..." && (
                      <Terminal className="h-3 w-3 animate-pulse" />
                    )}
                    {liveStep === "Thinking..." && <Lightbulb className="h-3 w-3 animate-pulse" />}
                    {liveStep}
                    <TypingDots />
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t bg-background p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            placeholder={placeholder || "Ask anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[44px] max-h-[120px] resize-none text-sm rounded-xl"
            disabled={loading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            size="icon"
            className={cn("h-11 w-11 shrink-0 rounded-xl", accentGradient)}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToolCallBadge({ step }: { step: Step }) {
  const [open, setOpen] = useState(false);
  if (step.name === "web_search") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1 py-0.5">
        <Search className="h-3 w-3 text-blue-500" />
        <span>Searched web: "{step.arguments?.query || "tech topics"}"</span>
      </div>
    );
  }
  if (step.name === "execute_code") {
    let parsedResult: any = null;
    try {
      if (step.result) parsedResult = JSON.parse(step.result);
    } catch {
      parsedResult = { stdout: step.result };
    }
    const output =
      parsedResult?.stdout?.trim() ||
      parsedResult?.stderr?.trim() ||
      parsedResult?.error ||
      "Execution finished cleanly.";

    return (
      <div className="text-[10px] space-y-1 my-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground px-1 transition-colors font-mono cursor-pointer"
        >
          <Terminal className="h-3 w-3 text-emerald-500" />
          <span className="font-bold">Executed {step.arguments?.language || "code"}</span>
          <span className="text-[9px] opacity-75">{open ? "▲ Hide Output" : "▼ View Execution Output"}</span>
        </button>
        {open && (
          <div className="ml-2 p-3 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 text-[10px] font-mono space-y-2 max-h-[240px] overflow-auto shadow-md">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Code Input:</span>
              <pre className="text-emerald-300 font-mono mt-1 whitespace-pre-wrap">{step.arguments?.code || ""}</pre>
            </div>
            {output && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Execution Output:</span>
                <pre className="text-amber-300 font-mono mt-1 whitespace-pre-wrap">{output.slice(0, 800)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return null;
}
