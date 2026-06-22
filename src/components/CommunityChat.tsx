import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { sendCommunityMessage } from "@/lib/community-chat.functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface CommunityMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: { full_name: string | null; avatar_url: string | null };
}

export function CommunityChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const db = supabase as any;

  // Load initial messages
  useEffect(() => {
    async function load() {
      const { data: msgs } = await db
        .from("community_messages")
        .select("id, user_id, content, created_at")
        .order("created_at", { ascending: true })
        .limit(200);

      if (!msgs?.length) return;

      const castMsgs = msgs as any[];
      const userIds: string[] = [...new Set(castMsgs.map((m) => m.user_id as string))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]));
      const enriched = castMsgs.map((m: any) => ({
        ...m,
        profile: profileMap[m.user_id] ?? { full_name: "Unknown", avatar_url: null },
      }));
      setMessages(enriched);
    }
    load();
  }, []);

  // Realtime: new messages
  useEffect(() => {
    const ch = supabase
      .channel("community-chat-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages" },
        async (payload: any) => {
          const msg = payload.new as CommunityMessage;
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", msg.user_id)
            .single();
          setMessages((prev) => [
            ...prev,
            { ...msg, profile: profile ?? { full_name: "Unknown", avatar_url: null } },
          ]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  // Realtime: online presence
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("community-chat-presence", {
      config: { presence: { key: user.id } },
    });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      setOnlineCount(Object.keys(state).length);
    });
    ch.subscribe(async (status: any) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ online_at: new Date().toISOString() });
      }
    });
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    if (!user || !input.trim() || sending) return;
    setSending(true);
    try {
      await sendCommunityMessage({ data: { content: input.trim() } });
      setInput("");
    } catch (e: any) {
      toast.error(e.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-xl bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Community Chat</h3>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{onlineCount} online</span>
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.user_id === user?.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={msg.profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(msg.profile?.full_name ?? "U")}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${isMe ? "items-end" : ""} max-w-[75%]`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium">
                      {isMe ? "You" : msg.profile?.full_name ?? "Unknown"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex items-center gap-2 p-4 border-t">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={!user || sending}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!user || !input.trim() || sending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
