import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Loader2,
  Users,
  Video,
  Send,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServerFn } from "@tanstack/react-start";
import { sendGroupMessage } from "@/lib/group-chat.functions";

export const Route = createFileRoute("/_authenticated/cohorts/$id")({
  head: () => ({ meta: [{ title: "Cohort — Learnify AI" }] }),
  component: CohortDetail,
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <p className="text-lg font-semibold text-destructive">Could not load cohort</p>
        <p className="text-sm text-muted-foreground mt-2">{(error as Error)?.message || "Something went wrong. Please try again."}</p>
        <a href="/cohorts" className="inline-flex mt-4 text-sm text-primary hover:underline">← Back to cohorts</a>
      </div>
    </AppShell>
  ),
});

function CohortDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const sendMsg = useServerFn(sendGroupMessage);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const cohortQuery = useQuery({
    queryKey: ["cohort", id],
    queryFn: async () => {
      const { data: c, error } = await supabase
        .from("cohorts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!c) return null;
      const [{ data: members }, { data: creator }] = await Promise.all([
        supabase.from("cohort_members").select("user_id, role, joined_at").eq("cohort_id", id),
        supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("id", c.creator_id)
          .maybeSingle(),
      ]);
      let messages: any[] = [];
      try {
        const { data } = await (supabase as any)
          .from("group_messages")
          .select("id, sender_id, content, created_at")
          .eq("cohort_id", id)
          .order("created_at", { ascending: true })
          .limit(200);
        messages = data ?? [];
      } catch {
        // group_messages table may not exist yet
      }
      const memberIds = (members ?? []).map((m) => m.user_id);
      let memberProfiles: any[] = [];
      if (memberIds.length) {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", memberIds);
        memberProfiles = data ?? [];
      }
      const profileMap = Object.fromEntries(
        (memberProfiles as any[]).map((p: any) => [p.id, p]),
      );
      const enriched = (messages ?? []).map((m: any) => ({
        ...m,
        profile: profileMap[m.sender_id] ?? { full_name: "Unknown", avatar_url: null },
      }));
      return { cohort: c, members: members ?? [], memberProfiles, profileMap, creator, messages: enriched };
    },
  });

  const data = cohortQuery.data;
  const isMember = !!data?.members.find((m) => m.user_id === user?.id);
  const isHost = data?.cohort.creator_id === user?.id;

  // Realtime: new messages
  useEffect(() => {
    if (!id || !isMember) return;
    setMsgs(data?.messages ?? []);
    const ch = supabase
      .channel(`cohort-chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `cohort_id=eq.${id}`,
        },
        (payload: any) => {
          const msg = payload.new;
          const profile = data?.profileMap?.[msg.sender_id];
          setMsgs((prev) => [
            ...prev,
            { ...msg, profile: profile ?? { full_name: "Unknown", avatar_url: null } },
          ]);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, isMember, data?.messages?.length]);

  // Realtime: online presence
  useEffect(() => {
    if (!id || !user || !isMember) return;
    const ch = supabase.channel(`cohort-presence-${id}`, {
      config: { presence: { key: user.id } },
    });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      setOnlineUsers(new Set(Object.keys(state)));
    });
    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ online_at: new Date().toISOString() });
      }
    });
    return () => { supabase.removeChannel(ch); };
  }, [id, user, isMember]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const notifiedRef = useRef(false);
  useEffect(() => {
    const cohort = data?.cohort;
    if (!cohort || !isMember || notifiedRef.current) return;
    const diffMs = new Date(cohort.starts_at).getTime() - Date.now();
    if (diffMs > 0 && diffMs <= 30 * 60 * 1000) {
      notifiedRef.current = true;
      toast.info(`"${cohort.title}" starts in ${Math.ceil(diffMs / 60000)} min — check the meeting link!`, { duration: 10_000 });
    }
  }, [data?.cohort, isMember]);

  async function join() {
    if (!user) return navigate({ to: "/login" });
    const { error } = await supabase
      .from("cohort_members")
      .insert({ cohort_id: id, user_id: user.id });
    if (error) return toast.error(error.message);
    toast.success("Joined cohort");
    qc.invalidateQueries({ queryKey: ["cohort", id] });
  }
  async function leave() {
    if (!user) return;
    const { error } = await supabase
      .from("cohort_members")
      .delete()
      .eq("cohort_id", id)
      .eq("user_id", user.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["cohort", id] });
  }

  async function handleSend() {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setText("");
    try {
      await sendMsg({ data: { cohortId: id, content: t } });
    } catch (e: any) {
      toast.error(e?.message ?? "Send failed");
      setText(t);
    } finally {
      setSending(false);
    }
  }

  if (cohortQuery.isLoading)
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  if (!data)
    return (
      <AppShell>
        <div className="py-20 text-center text-sm text-muted-foreground">Cohort not found.</div>
      </AppShell>
    );

  const c = data.cohort;
  const memberCount = data.members.length;
  const isFull = memberCount >= c.capacity;

  function initials(name: string) {
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-6xl">
        <Link
          to="/cohorts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All cohorts
        </Link>

        {/* Cohort info card */}
        <div className="mt-6 rounded-3xl border bg-card p-6 sm:p-8 shadow-card">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <Badge variant="secondary" className="text-[10px] mb-2 capitalize">
                {c.kind.replace("_", " ")}
              </Badge>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                {c.title}
              </h1>
              {data.creator && (
                <Link
                  to="/u/$id"
                  params={{ id: data.creator.id }}
                  className="inline-flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Hosted by {data.creator.full_name ?? "Creator"}
                </Link>
              )}
            </div>
            <Badge variant={c.status === "live" ? "default" : "outline"} className="capitalize">
              {c.status}
            </Badge>
          </div>

          {c.description && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
          )}

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border p-3 relative">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Starts
              </div>
              <div className="font-medium mt-1">
                {format(new Date(c.starts_at), "dd MMM, HH:mm")}
              </div>
              {c.status !== "ended" && c.status !== "cancelled" && (() => {
                const diffMs = new Date(c.starts_at).getTime() - Date.now();
                if (diffMs < 0 && c.status === "live") {
                  return <span className="absolute top-1 right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>;
                }
                if (diffMs < 0) return null;
                const hrs = Math.floor(diffMs / 3600000);
                const mins = Math.floor((diffMs % 3600000) / 60000);
                if (hrs >= 24) return null;
                return (
                  <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">
                    {hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`} from now
                  </span>
                );
              })()}
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Members
              </div>
              <div className="font-medium mt-1">
                {memberCount}/{c.capacity}
              </div>
            </div>
            {c.meeting_url && (isMember || isHost) && (
              <a
                href={c.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-accent flex flex-col"
              >
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Video className="h-3 w-3" /> Meeting
                </div>
                <div className="font-medium mt-1 flex items-center gap-1 truncate">
                  Join call <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            )}
            {c.group_link && (isMember || isHost) && (
              <a
                href={c.group_link}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-accent flex flex-col"
              >
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Group chat
                </div>
                <div className="font-medium mt-1 flex items-center gap-1 truncate">
                  Open chat <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            {!isHost &&
              (isMember ? (
                <Button variant="outline" onClick={leave}>
                  Leave cohort
                </Button>
              ) : (
                <Button onClick={join} disabled={isFull}>
                  {isFull ? "Full" : "Join cohort"}
                </Button>
              ))}
            {isHost && <Badge variant="default">You're the host</Badge>}
          </div>
        </div>

        {/* Chat + Members (only for members) */}
        {isMember && (
          <>
            {/* Mobile toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="mt-6 flex w-full items-center justify-between rounded-xl border bg-card p-3 text-sm font-medium sm:hidden"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {showChat ? "Members" : "Group chat"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition ${showChat ? "rotate-180" : ""}`}
              />
            </button>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Chat panel */}
              {showChat && (
                <div className="sm:col-span-2 rounded-2xl border bg-card flex flex-col overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b flex items-center gap-2 text-sm font-medium">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Group chat
                    <span className="text-muted-foreground font-normal">
                      · {msgs.length} messages
                    </span>
                  </div>

                  <ScrollArea className="flex-1 h-[400px] sm:h-[480px] p-4">
                    {msgs.length === 0 ? (
                      <div className="h-full grid place-items-center text-sm text-muted-foreground">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {msgs.map((m) => {
                          const isMe = m.sender_id === user?.id;
                          return (
                            <div
                              key={m.id}
                              className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
                            >
                              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                                {m.profile?.avatar_url ? (
                                  <AvatarImage src={m.profile.avatar_url} />
                                ) : null}
                                <AvatarFallback className="text-[10px]">
                                  {initials(m.profile?.full_name ?? "?")}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`max-w-[75%] ${isMe ? "items-end" : ""} flex flex-col`}>
                                <div className="flex items-baseline gap-2 mb-0.5">
                                  <span className="text-[11px] font-medium text-muted-foreground">
                                    {isMe ? "You" : (m.profile?.full_name ?? "Unknown")}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground/60">
                                    {format(new Date(m.created_at), "HH:mm")}
                                  </span>
                                </div>
                                <div
                                  className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words ${
                                    isMe
                                      ? "bg-primary text-primary-foreground rounded-tr-md"
                                      : "bg-accent rounded-tl-md"
                                  }`}
                                >
                                  {m.content}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  <div className="border-t p-3 flex gap-2">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message..."
                      maxLength={2000}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!text.trim() || sending}
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Members panel (always visible on desktop) */}
              <div className={showChat ? "" : "sm:col-span-3"}>
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <h2 className="font-medium text-sm flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4" />{" "}
                    {memberCount}{" "}
                    {memberCount === 1 ? "member" : "members"}
                  </h2>
                  {memberCount === 0 ? (
                    <p className="text-sm text-muted-foreground">No members yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {data.memberProfiles.map((p: any) => {
                        const online = onlineUsers.has(p.id);
                        return (
                          <li key={p.id}>
                            <Link
                              to="/u/$id"
                              params={{ id: p.id }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                            >
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  {p.avatar_url ? (
                                    <AvatarImage src={p.avatar_url} />
                                  ) : null}
                                  <AvatarFallback className="text-[10px]">
                                    {initials(p.full_name ?? "U")}
                                  </AvatarFallback>
                                </Avatar>
                                {online && (
                                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                                )}
                              </div>
                              <span className="text-sm truncate">{p.full_name ?? "Learner"}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}