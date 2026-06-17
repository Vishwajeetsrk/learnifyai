import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX, Sparkles, Plus, Trash2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { agentChat } from "@/lib/agent.functions";

export const Route = createFileRoute("/_authenticated/ai-agent")({
  head: () => ({ meta: [{ title: "AI Agent — Learnify AI" }] }),
  component: AiAgentPage,
});

type Message = { id: string; role: "user" | "assistant"; content: string };

function AiAgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const msgId = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!speakEnabled) return;
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#`\[\]]/g, ""));
    u.rate = 1.1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }, [speakEnabled]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || busy) return;
    const userMsg: Message = { id: String(msgId.current++), role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await agentChat({ data: { content: content.trim(), history } });
      const botMsg: Message = { id: String(msgId.current++), role: "assistant", content: res.content };
      setMessages((prev) => [...prev, botMsg]);
      speak(res.content);
    } catch (err: any) {
      const errMsg: Message = {
        id: String(msgId.current++),
        role: "assistant",
        content: `Error: ${err?.message ?? "Something went wrong"}`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setBusy(false);
    }
  }, [messages, busy, speak]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput((prev) => prev + " [Voice not supported in this browser]");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) {
        sendMessage(transcript);
      }
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);

    recognitionRef.current = recog;
    recog.start();
    setListening(true);
  }, [listening, sendMessage]);

  const newChat = useCallback(() => {
    setMessages([]);
    window.speechSynthesis?.cancel();
    msgId.current = 0;
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 px-4 py-2 border-b shrink-0">
          <Bot className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Agent</span>
          <span className="text-[11px] text-muted-foreground">— code execution &amp; web search</span>
          <div className="flex-1" />
          <button
            onClick={() => setSpeakEnabled(!speakEnabled)}
            className={cn("p-1.5 rounded-md text-muted-foreground hover:text-foreground", speakEnabled && "text-primary")}
            title={speakEnabled ? "Voice output on" : "Voice output off"}
          >
            {speakEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <Button size="sm" variant="outline" onClick={newChat}>
            <Plus className="h-3.5 w-3.5" /> New
          </Button>
        </div>

        <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
              <Sparkles className="h-8 w-8" />
              <p className="text-sm max-w-md">
                I'm your AI agent. I can write and execute code, search the web, and answer questions. Try asking me something!
              </p>
            </div>
          )}
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border",
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children }) => <pre className="bg-muted rounded-lg p-3 my-2 overflow-x-auto text-xs">{children}</pre>,
                      code: ({ className, children }) => {
                        if (className) return <code className={cn(className, "text-xs")}>{children}</code>;
                        return <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>;
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex gap-3">
                <div className="rounded-2xl px-4 py-3 bg-card border">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <button
              onClick={toggleListening}
              className={cn(
                "p-2 rounded-lg border shrink-0 transition",
                listening
                  ? "bg-destructive text-destructive-foreground border-destructive"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
              title={listening ? "Stop listening" : "Voice input"}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask me anything — I can write code, search the web, and more..."
              className="min-h-[44px] max-h-[120px] resize-none text-sm"
              rows={1}
            />
            <Button onClick={() => sendMessage(input)} disabled={!input.trim() || busy} className="shrink-0">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
