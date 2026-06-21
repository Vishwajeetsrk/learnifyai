import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Bot,
  MessageSquare,
  Send,
  X,
  Loader2,
  Sparkles,
  Trash2,
  ArrowRight,
  Play,
  Terminal,
  Brain,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supportChat } from "@/lib/support-agent.functions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, useDragControls } from "framer-motion";

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

function BotAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 via-primary to-cyan-500 p-[1.5px] shrink-0 shadow-lg relative flex items-center justify-center",
        className,
      )}
    >
      <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.4),transparent_70%)]" />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4.5 w-4.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        >
          <rect
            x="4"
            y="7"
            width="16"
            height="11"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="9" cy="12" r="1.2" fill="currentColor" />
          <circle cx="15" cy="12" r="1.2" fill="currentColor" />
          <path
            d="M10 15c0.5 0.5 1.5 0.5 4 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M12 7V4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
          <rect x="2" y="11" width="2" height="3" rx="0.5" fill="currentColor" />
          <rect x="20" y="11" width="2" height="3" rx="0.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
        />
      ))}
    </div>
  );
}

export function GlobalSupportAgent() {
  const { user, isAdmin, isCreator } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLeft = path.startsWith("/studio") || path.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [liveStep, setLiveStep] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(supportChat);
  const [showIntro, setShowIntro] = useState(true);
  const dragControls = useDragControls();

  const userContext = useMemo(() => {
    if (!user) return "Anonymous Visitor";
    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const role = isAdmin ? "Admin" : isCreator ? "Creator" : "Student";
    return `Name: ${name}, Email: ${user.email}, Role: ${role}`;
  }, [user, isAdmin, isCreator]);

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
    setShowIntro(false);
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
      setShowIntro(true);
      toast.success("History cleared");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.1}
      className={cn(
        "fixed bottom-6 z-[99] flex flex-col pointer-events-auto",
        isLeft ? "left-6 items-start" : "right-6 items-end",
      )}
      style={{ touchAction: "none" }}
    >
      {open ? (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <header
            className="bg-gradient-to-r from-violet-600 via-primary to-fuchsia-600 text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
            <div className="flex items-center gap-2.5 relative">
              <div className="relative">
                <BotAvatar />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                  Learnify Support
                  <Sparkles className="h-3 w-3 text-yellow-200" />
                </h3>
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span className="text-[10px] opacity-90">Online Assistant</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 relative">
              {messages.length > 0 && (
                <button
                  onClick={clear}
                  className="p-1.5 rounded-md hover:bg-white/10 transition text-primary-foreground/80 hover:text-white"
                  title="Clear history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 transition text-primary-foreground/80 hover:text-white"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scrollbar-thin"
          >
            {messages.length === 0 && showIntro && (
              <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
                <div className="relative inline-flex">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center mx-auto text-white shadow-lg">
                    <Brain className="h-7 w-7" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-lg">👋</span>
                </div>
                <h4 className="font-display font-semibold text-sm">How can I help you today?</h4>
                <p className="text-xs text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
                  Ask me about courses, playground modes, assignments, coaching slots, or navigating
                  the website.
                </p>
                <div className="grid gap-1.5 max-w-[240px] mx-auto pt-2">
                  {[
                    "How do I use the Playground?",
                    "Where do I find my Certificates?",
                    "How can I buy premium courses?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setInput(s);
                        setShowIntro(false);
                      }}
                      className="text-left text-[11px] border bg-card hover:bg-accent hover:border-primary/30 rounded-lg p-2.5 transition-all leading-snug group"
                    >
                      <span className="flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition -ml-0.5" />
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 duration-200",
                  m.role === "user" ? "items-end" : "items-start",
                )}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 pl-0.5">
                    <BotAvatar className="h-6 w-6" />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Learnify AI
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[85%] border shadow-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                      : "bg-card text-card-foreground border-border rounded-tl-sm",
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
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
                        <a
                          href={href}
                          className="text-primary underline hover:text-primary/80 font-medium"
                        >
                          {children}
                        </a>
                      ),
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
                              <Play className="h-3 w-3" /> Executed{" "}
                              {step.arguments?.language || "code"}
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
                            <span>
                              Searched: <strong>{step.arguments?.query}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex items-start gap-2">
                <BotAvatar className="h-6 w-6" />
                <div className="rounded-lg border bg-card p-1 shadow-sm max-w-[85%]">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    {liveStep === "Thinking..." ? (
                      <TypingDots />
                    ) : (
                      <Loader2 className="h-3 w-3 animate-spin ml-2" />
                    )}
                    {liveStep && liveStep !== "Thinking..." && (
                      <span className="pr-2">{liveStep}</span>
                    )}
                  </div>
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
              className="shrink-0 rounded-xl h-[38px] w-[38px] bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn("flex flex-col gap-2 group/widget", isLeft ? "items-start" : "items-end")}
        >
          {/* A small premium greeting pill that glows and bounces */}
          <div
            className="bg-card/95 border shadow-xl rounded-2xl py-1.5 px-3 flex items-center gap-2 border-primary/30 backdrop-blur-md animate-bounce duration-[3000ms] cursor-pointer hover:border-primary transition"
            onClick={() => setOpen(true)}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <div className="text-left leading-tight pr-1">
              <div className="text-[10px] font-bold text-foreground">Learnify Support</div>
              <div className="text-[8px] text-muted-foreground">Online Assistant</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 via-primary to-fuchsia-500 text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group relative border border-white/10 cursor-pointer"
            title="Open Help & Support"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 via-primary to-fuchsia-500 animate-ping opacity-20 group-hover:opacity-30" />
            <BotAvatar className="h-11 w-11 border border-white/10" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
