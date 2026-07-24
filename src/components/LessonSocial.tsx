import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatRelative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function LessonSocial({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const likesKey = ["lesson-likes", lessonId, user?.id];
  const likesQuery = useQuery({
    queryKey: likesKey,
    queryFn: async () => {
      const [{ count }, mine] = await Promise.all([
        supabase
          .from("lesson_likes")
          .select("*", { count: "exact", head: true })
          .eq("lesson_id", lessonId),
        user
          ? supabase
              .from("lesson_likes")
              .select("id")
              .eq("lesson_id", lessonId)
              .eq("user_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      return { count: count ?? 0, liked: !!mine.data };
    },
  });

  const commentsQuery = useQuery({
    queryKey: ["lesson-comments", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_comments")
        .select("id, user_id, body, created_at")
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      const userIds = Array.from(new Set((data ?? []).map((c) => c.user_id)));
      let profilesById: Record<string, { full_name: string | null; avatar_url: string | null }> =
        {};
      if (userIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", userIds);
        (profs ?? []).forEach((p) => {
          profilesById[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
        });
      }
      return (data ?? []).map((c) => ({ ...c, profile: profilesById[c.user_id] }));
    },
  });

  const toggleLike = async () => {
    if (!user) return toast.error("Sign in to like");
    if (likesQuery.data?.liked) {
      await supabase.from("lesson_likes").delete().eq("lesson_id", lessonId).eq("user_id", user.id);
    } else {
      await supabase.from("lesson_likes").insert({ lesson_id: lessonId, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: likesKey });
  };

  const postComment = async () => {
    if (!user) return toast.error("Sign in to comment");
    const text = body.trim();
    if (!text) return;
    setPosting(true);
    const { error } = await supabase
      .from("lesson_comments")
      .insert({ lesson_id: lessonId, user_id: user.id, body: text });
    setPosting(false);
    if (error) return toast.error(error.message);
    setBody("");
    qc.invalidateQueries({ queryKey: ["lesson-comments", lessonId] });
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("lesson_comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["lesson-comments", lessonId] });
  };

  return (
    <div className="border-t border-border/60 pt-5 mt-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={likesQuery.data?.liked ? "default" : "outline"}
            onClick={toggleLike}
            aria-pressed={!!likesQuery.data?.liked}
            aria-label={likesQuery.data?.liked ? "Unlike lesson" : "Like lesson"}
            className={cn(
              "rounded-full gap-1.5 font-bold cursor-pointer transition-all shadow-xs",
              likesQuery.data?.liked &&
                "bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20",
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform active:scale-125",
                likesQuery.data?.liked && "fill-current",
              )}
            />
            <span>{likesQuery.data?.count ?? 0}</span>
          </Button>
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/40">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>{commentsQuery.data?.length ?? 0} comments</span>
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-start gap-3 bg-card border border-border/80 p-3.5 rounded-2xl shadow-xs">
          <Avatar className="h-9 w-9 shrink-0 border border-primary/30">
            <AvatarImage src={user.user_metadata?.avatar_url || ""} />
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a public comment…"
              rows={2}
              maxLength={4000}
              className="resize-none text-xs sm:text-sm border-border/60 bg-muted/10 rounded-xl focus:ring-1 focus:ring-primary"
              aria-label="Write a comment"
            />
            <div className="flex justify-end">
              <Button
                onClick={postComment}
                disabled={posting || !body.trim()}
                size="sm"
                className="rounded-xl font-bold cursor-pointer px-4 gap-1.5 shadow-xs"
              >
                {posting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Comment</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-3.5">
        {(commentsQuery.data ?? []).map((c) => {
          const name = c.profile?.full_name ?? "User";
          const initials = name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return (
            <li
              key={c.id}
              className="flex gap-3 bg-muted/20 border border-border/50 p-3 rounded-2xl"
            >
              <Avatar className="h-9 w-9 shrink-0 border border-border/80">
                {c.profile?.avatar_url && <AvatarImage src={c.profile.avatar_url} alt="" />}
                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {formatRelative(c.created_at)}
                  </span>
                  {user?.id === c.user_id && (
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="ml-auto text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1 cursor-pointer transition"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap break-words mt-1 leading-relaxed font-medium">
                  {c.body}
                </p>
              </div>
            </li>
          );
        })}
        {commentsQuery.data && commentsQuery.data.length === 0 && (
          <li className="text-xs text-muted-foreground italic text-center py-6 border border-dashed border-border/60 rounded-2xl bg-muted/10 font-medium">
            Be the first to comment on this lesson!
          </li>
        )}
      </ul>
    </div>
  );
}
