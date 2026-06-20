import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, MessageSquare, Send, X, Loader2, Sparkles, Trash2, ArrowRight, Play, Terminal } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supportChat } from "@/lib/support-agent.functions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = {
  type: string;
  thought?: string;
  name?: string;
  arguments?: any;
  result?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  steps?: Step[];
};

export function GlobalSupportAgent() {
  const { user, isAdmin, isCreator } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [liveStep, setLiveStep] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(supportChat);

  const userContext = useMemo(() => {
    if (!user) return "Anonymous Visitor";
    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const role = isAdmin ? "Admin" : isCreator ? "Creator" : "Student";
    return `Name: ${name}, Email: ${user.email}, Role: ${role}`;
  }, [user, isAdmin, isCreator]);

  function useMemo<T>(fn: () => T, deps: any[]): T {
    return fn(); // Simple inline fallback since useMemo is not imported
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [open, messages, liveStep]);

  const send = useCallback(async () => {
    if (!input.trim() || busy) return;
    const q = input.trim();
    setInput("");
    setMessages((p) => [...p, { role: "user", content: q }]);
    setBusy(true);
    setLiveStep("Thinking...");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    try {
      setLiveStep("Searching & analyzing...");
      const res = await chatFn({
        data: {
          content: q,
          history,
          userContext,
          currentPath: path,
        },
      });
      setMessages((p) => [...p, { role: "assistant", content: res.content, steps: res.steps }]);
    } catch (err: any) {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: `Error: ${err?.message ?? "Something went wrong"}` },
      ]);
    } finally {
      setBusy(false);
      setLiveStep(null);
    }
  }, [input, busy, messages, userContext, path, chatFn]);

  const clear = () => {
    if (confirm("Clear support chat history?")) {
      setMessages([]);
      toast.success("History cleared");
    }
  };

  if (!user) return null; // Only show support widget to authenticated users

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open ? (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <header className="bg-gradient-to-r from-primary to-violet-600 text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 animate-pulse" />
              <div>
                <h3 className="font-display font-semibold text-sm">Learnify Support</h3>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] opacity-90">Online Assistant</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  onClick={clear}
                  className="p-1 rounded-md hover:bg-white/10 transition text-primary-foreground/80 hover:text-white"
                  title="Clear history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 transition text-primary-foreground/80 hover:text-white"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 grid place-items-center mx-auto text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-display font-semibold text-sm">How can I help you today?</h4>
                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                  Ask me about courses, playground modes, assignments, coaching slots, or navigating around the website.
                </p>
                <div className="grid gap-1.5 max-w-[240px] mx-auto pt-2">
                  {[
                    "How do I use the Playground?",
                    "Where do I find my Certificates?",
                    "How can I buy premium courses?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-left text-[11px] border bg-card hover:bg-accent rounded-lg p-2.5 transition leading-snug"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col gap-1.5", m.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[85%] border shadow-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-border"
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children }) => (
                        <pre className="bg-muted rounded-lg p-2 my-1 overflow-x-auto text-[10px]">
                          {children}
                        </pre>
                      ),
                      code: ({ className, children }) => {
                        if (className)
                          return <code className={cn(className, "text-[10px]")}>{children}</code>;
                        return (
                          <code className="bg-muted px-1 py-0.5 rounded text-[10px]">
                            {children}
                          </code>
                        );
                      },
                      a: ({ href, children }) => (
                        <a href={href} className="text-primary underline hover:text-primary/80 font-medium">
                          {children}
                        </a>
                      )
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>

                {m.steps && m.steps.length > 0 && (
                  <div className="w-full max-w-[85%] space-y-1.5">
                    {m.steps.map((step, si) => (
                      <div key={si} className="text-[10px]">
                        {step.type === "tool_call" && step.name === "execute_code" && (
                          <details className="rounded-lg border border-primary/20 bg-primary/5 p-2 space-y-1.5">
                            <summary className="cursor-pointer flex items-center gap-1.5 font-medium text-primary hover:underline">
                              <Play className="h-3 w-3" /> Executed {step.arguments?.language || "code"}
                            </summary>
                            {step.arguments?.code && (
                              <pre className="text-[9px] bg-black/80 text-green-400 rounded p-1.5 overflow-x-auto">
                                {step.arguments.code}
                              </pre>
                            )}
                            {step.result && (
                              <pre className="text-[9px] bg-black/90 text-white rounded p-1.5 overflow-x-auto">
                                {step.result}
                              </pre>
                            )}
                          </details>
                        )}
                        {step.type === "tool_call" && step.name === "web_search" && (
                          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 flex items-center gap-1.5 text-blue-600">
                            <Terminal className="h-3 w-3" />
                            <span>Searched: <strong>{step.arguments?.query}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="rounded-lg border border-muted bg-muted/20 p-2.5 animate-pulse max-w-[85%]">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> {liveStep || "Working..."}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t shrink-0 bg-background flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask anything..."
              className="min-h-[38px] max-h-[70px] resize-none text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
              rows={1}
            />
            <Button
              size="icon"
              onClick={send}
              disabled={!input.trim() || busy}
              className="shrink-0 rounded-xl h-[38px] w-[38px]"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-105 hover:shadow-primary/25 hover:rotate-3 transition duration-300"
          title="Open Help & Support"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
