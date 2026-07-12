import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Loader2, Sparkles, Terminal, Search, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveStep, setLiveStep] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

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
    <div className="flex flex-col h-full">
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
                  "max-w-[85%] space-y-1",
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
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card text-card-foreground border border-border rounded-tl-sm",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {msg.content}
                        </ReactMarkdown>
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
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
        <Search className="h-3 w-3" />
        <span>Searched: {step.arguments?.query || "web"}</span>
      </div>
    );
  }
  if (step.name === "execute_code") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground px-1 transition-colors"
        >
          <Terminal className="h-3 w-3" />
          <span>Executed {step.arguments?.language || "code"}</span>
          <span className="text-[8px]">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <div className="mt-1 ml-3 p-2 bg-muted rounded-lg border text-[10px] font-mono whitespace-pre-wrap max-h-[200px] overflow-auto">
            <div className="text-muted-foreground mb-1">Input:</div>
            <pre className="text-foreground">{step.arguments?.code || ""}</pre>
            {step.result && (
              <>
                <div className="text-muted-foreground mt-2 mb-1">Output:</div>
                <pre className="text-foreground">
                  {(JSON.parse(step.result)?.stdout || step.result || "").slice(0, 500)}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
  return null;
}
