import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  Trash2,
  Play,
  Terminal,
  ArrowRight,
  MessageSquare,
  Brain,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supportChat } from "@/lib/support-agent.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Support — Learnify AI" }] }),
  component: SupportPage,
});

function BotAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-background",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
        <rect
          x="5"
          y="8"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="9" cy="13" r="1" fill="currentColor" />
        <circle cx="15" cy="13" r="1" fill="currentColor" />
        <path
          d="M12 15c0 0 1 1 2 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 5l1.5 3h3L15 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7 6l-2 3M17 6l2 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const SUGGESTIONS = [
  "How do I use the Playground?",
  "Where do I find my Certificates?",
  "How can I buy premium courses?",
  "How do I become a creator?",
  "How does AI Tutoring work?",
];

function SupportPage() {
  const { user, isAdmin, isCreator } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; steps?: any[] }>
  >([]);
  const [busy, setBusy] = useState(false);
  const [liveStep, setLiveStep] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(supportChat);

  const userContext = [
    `Name: ${user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}`,
    `Email: ${user?.email}`,
    `Role: ${isAdmin ? "Admin" : isCreator ? "Creator" : "Student"}`,
  ].join(", ");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, liveStep]);

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
      const res = await chatFn({ data: { content: q, history, userContext, currentPath: path } });
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

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-10 py-8">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Support</div>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">
            Learnify AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ask me anything about the platform — courses, playground, coaching, payments, and more.
          </p>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[500px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[600px]">
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-5">
                <div className="relative inline-flex">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center mx-auto text-white shadow-lg">
                    <Brain className="h-8 w-8" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-2xl">👋</span>
                </div>
                <h2 className="font-display font-semibold text-lg">How can I help you today?</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I'm your AI support assistant. Ask me about any feature, tool, or setting on
                  Learnify.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-left text-xs border bg-card hover:bg-accent hover:border-primary/30 rounded-xl p-3 transition-all leading-snug group"
                    >
                      <span className="flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition shrink-0" />
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 animate-in slide-in-from-bottom-2 duration-200",
                  m.role === "user" ? "flex-row-reverse" : "",
                )}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {m.role === "assistant" && <BotAvatar />}
                <div
                  className={cn(
                    "max-w-[75%] space-y-2",
                    m.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed border shadow-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                        : "bg-muted/30 text-card-foreground border-border rounded-tl-sm",
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({ children }) => (
                          <pre className="bg-muted rounded-lg p-3 my-2 overflow-x-auto text-xs">
                            {children}
                          </pre>
                        ),
                        code: ({ className, children }) => {
                          if (className)
                            return <code className={cn(className, "text-xs")}>{children}</code>;
                          return (
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
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
                  {m.steps?.map((step, si) => (
                    <div key={si} className="text-xs">
                      {step.type === "tool_call" && step.name === "execute_code" && (
                        <details className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 space-y-1.5">
                          <summary className="cursor-pointer flex items-center gap-1.5 font-medium text-primary hover:underline">
                            <Play className="h-3 w-3" /> Executed{" "}
                            {step.arguments?.language || "code"}
                          </summary>
                          {step.arguments?.code && (
                            <pre className="text-[10px] bg-black/80 text-green-400 rounded p-2 overflow-x-auto">
                              {step.arguments.code}
                            </pre>
                          )}
                          {step.result && (
                            <pre className="text-[10px] bg-black/90 text-white rounded p-2 overflow-x-auto">
                              {step.result}
                            </pre>
                          )}
                        </details>
                      )}
                      {step.type === "tool_call" && step.name === "web_search" && (
                        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2.5 flex items-center gap-1.5 text-blue-600">
                          <Terminal className="h-3 w-3" />
                          <span>
                            Searched: <strong>{step.arguments?.query}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex gap-3">
                <BotAvatar />
                <div className="rounded-lg border bg-muted/20 p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {liveStep || "Working..."}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-background flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask anything about the platform..."
              className="min-h-[44px] max-h-[100px] resize-none text-sm rounded-xl"
              rows={1}
            />
            <Button
              size="icon"
              onClick={send}
              disabled={!input.trim() || busy}
              className="shrink-0 rounded-xl h-[44px] w-[44px]"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
