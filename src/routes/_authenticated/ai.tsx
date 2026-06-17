import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Send, Sparkles, Trash2, MessageSquare, ImagePlus, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/ai")({
  head: () => ({ meta: [{ title: "AI Tutor — Learnify AI" }] }),
  component: AIPage,
});

type Message = { id: string; role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; updated_at: string };

const MODELS = [
  { id: "gemini/gemini-2.5-flash", label: "My Gemini API — Flash (fast)", vision: true },
  { id: "gemini/gemini-2.5-pro", label: "My Gemini API — Pro (reasoning)", vision: true },
  { id: "groq/llama-3.3-70b-versatile", label: "My Groq API — Llama 3.3 70B (ultra fast)", vision: false },
  { id: "openrouter/google/gemini-2.5-flash", label: "My OpenRouter API — Gemini Flash", vision: true },
  { id: "openrouter/deepseek/deepseek-chat", label: "My OpenRouter API — DeepSeek", vision: false },
];

function AIPage() {
  const { user } = useAuth();
  const userAvatar = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined;
  const userName =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split("@")[0] ?? "You";
  const userInitial = userName.trim().charAt(0).toUpperCase() || "Y";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [streaming, setStreaming] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadCredits = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("ai_credits")
      .select("credits_remaining")
      .eq("user_id", user.id)
      .maybeSingle();
    setCredits(data?.credits_remaining ?? 500);
  };

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large (max 4MB)");
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const max = 720;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        setAttachedImage(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Load conversations + credits
  useEffect(() => {
    void loadConversations();
    void loadCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streaming]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (error) return toast.error(error.message);
    setConversations(data ?? []);
  };

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setLoadingMessages(false);
    if (error) return toast.error(error.message);
    setMessages(
      (data ?? []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    );
  };

  const selectConversation = async (id: string) => {
    setActiveId(id);
    await loadMessages(id);
  };

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setInput("");
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("chat_messages").delete().eq("conversation_id", id);
    const { error } = await supabase.from("chat_conversations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (activeId === id) newChat();
    void loadConversations();
  };

  const deleteAllChats = async () => {
    const { data: convs } = await supabase.from("chat_conversations").select("id");
    const ids = (convs ?? []).map((c) => c.id);
    if (ids.length === 0) return toast.info("No chats to delete");
    await supabase.from("chat_messages").delete().in("conversation_id", ids);
    const { error } = await supabase.from("chat_conversations").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success("All chat history deleted");
    newChat();
    void loadConversations();
  };

  const send = async () => {
    const text = input.trim();
    if ((!text && !attachedImage) || streaming) return;
    const photo = attachedImage;
    // Auto-switch to first vision-capable model when image is attached
    let activeModel = model;
    if (photo) {
      const current = MODELS.find((m) => m.id === activeModel);
      if (current && !current.vision) {
        const fallback = MODELS.find((m) => m.vision);
        if (fallback) {
          activeModel = fallback.id;
          setModel(fallback.id);
          toast.info(`Switched to ${fallback.label} — ${current.label} doesn't support images`);
        }
      }
    }
    setInput("");
    setAttachedImage(null);
    setStreaming(true);

    // Embed image as markdown so it shows in bubble and gives assistant context.
    const content = photo
      ? `![attached photo from ${userName}](${photo})\n\n${text || "(Please look at the attached photo.)"}`
      : text;

    const tempUserId = crypto.randomUUID();
    const tempAssistantId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: tempUserId, role: "user", content },
      { id: tempAssistantId, role: "assistant", content: "" },
    ]);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId: activeId, model: activeModel, content }),
      });

      if (!resp.ok || !resp.body) {
        const errBody = await resp.text();
        throw new Error(errBody || `Request failed (${resp.status})`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let convoId = activeId;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            if (json.conversationId && !convoId) {
              convoId = json.conversationId;
              setActiveId(convoId);
            }
            if (json.delta) {
              setMessages((m) =>
                m.map((msg) =>
                  msg.id === tempAssistantId ? { ...msg, content: msg.content + json.delta } : msg,
                ),
              );
            }
            if (typeof json.credits_remaining === "number") {
              setCredits(json.credits_remaining);
            }
            if (json.error) throw new Error(json.error);
          } catch {
            // ignore partial json
          }
        }
      }
      void loadConversations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setMessages((m) => m.filter((x) => x.id !== tempAssistantId));
    } finally {
      setStreaming(false);
    }
  };

  return (
    <AppShell>
      <div className="flex h-screen">
        {/* Conversations sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card/30">
          <div className="p-3 space-y-2">
            <Button onClick={newChat} className="w-full justify-start gap-2" variant="outline">
              <Plus className="h-4 w-4" /> New chat
            </Button>
            {conversations.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete all history
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete all chat conversations?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove all {conversations.length} conversation
                      {conversations.length === 1 ? "" : "s"} and their messages. This cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => void deleteAllChats()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 py-4 text-center">
                  No conversations yet.
                </p>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent",
                      activeId === c.id && "bg-accent",
                    )}
                    onClick={() => void selectConversation(c.id)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">{c.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteConversation(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between gap-2 border-b px-4 sm:px-6 h-16 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <h1 className="font-display font-semibold truncate">AI Tutor</h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  credits === null
                    ? "text-muted-foreground"
                    : credits <= 0
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : credits < 50
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                )}
                title="AI credits remaining (free 500 / account)"
              >
                <Sparkles className="h-3 w-3" />
                {credits === null ? "…" : credits.toLocaleString("en-IN")} credits
              </span>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-[160px] sm:w-[260px] text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="flex items-center gap-2">
                        {m.label}
                        {m.vision && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            Vision
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
              {loadingMessages ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-display font-semibold">Ask anything</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get explanations, code reviews, study plans, and more.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 max-w-xl mx-auto">
                    {[
                      "Explain quantum entanglement like I'm 12",
                      "Write a Python script to scrape a webpage",
                      "Create a 4-week study plan for AWS Solutions Architect",
                      "What's the difference between SQL and NoSQL?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="text-left text-sm border rounded-lg p-3 hover:bg-accent transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                  >
                    {m.role === "user" ? (
                      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
                        {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                        <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 shrink-0 rounded-full grid place-items-center text-xs font-semibold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                        AI
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-[85%]",
                        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border",
                      )}
                    >
                      <div
                        className={cn(
                          "prose prose-sm max-w-none prose-pre:bg-muted prose-pre:text-foreground prose-code:before:hidden prose-code:after:hidden prose-img:rounded-lg prose-img:my-2",
                          m.role === "user"
                            ? "prose-invert prose-p:text-primary-foreground"
                            : "dark:prose-invert",
                        )}
                      >
                        {m.content ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={m.role === "assistant" ? [rehypeHighlight] : []}
                          >
                            {m.content}
                          </ReactMarkdown>
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t bg-background p-4">
            <div className="max-w-3xl mx-auto">
              {attachedImage && (
                <div className="mb-2 inline-flex items-center gap-2 rounded-lg border bg-card p-2 pr-3 shadow-sm">
                  <img
                    src={attachedImage}
                    alt="attached"
                    className="h-12 w-12 rounded object-cover"
                  />
                  <span className="text-xs text-muted-foreground">Photo attached</span>
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="relative rounded-2xl border bg-card focus-within:ring-2 focus-within:ring-primary/40">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Ask your AI tutor… (Shift+Enter for newline)"
                  rows={2}
                  className="resize-none border-0 focus-visible:ring-0 pl-12 pr-14 bg-transparent"
                  disabled={streaming}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onPickPhoto}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 bottom-2"
                  onClick={() => {
                    const current = MODELS.find((m) => m.id === model);
                    if (current && !current.vision) {
                      const fallback = MODELS.find((m) => m.vision);
                      if (fallback) {
                        setModel(fallback.id);
                        toast.info(`Switched to ${fallback.label} for photo support`);
                      }
                    }
                    fileInputRef.current?.click();
                  }}
                  disabled={streaming}
                  title={
                    MODELS.find((m) => m.id === model)?.vision
                      ? "Attach a photo"
                      : "Switch to a Vision-capable model to attach photos"
                  }
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  className="absolute right-2 bottom-2"
                  onClick={() => void send()}
                  disabled={streaming || (!input.trim() && !attachedImage)}
                >
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
