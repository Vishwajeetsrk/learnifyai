import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowLeft, User, Heart, MessageCircle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => ({
    meta: [
      { title: `${(loaderData as any)?.post?.title || "Post"} — Learnify AI Blog` },
    ],
  }),
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, content, excerpt, featured_image, author_id, published_at, created_at, profiles!author_id(full_name)")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    return { post: data };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-48 h-48">
          <img src="/illustrations/404_Page_not_found.svg" alt="Not found" className="w-full h-full" />
        </div>
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
      </div>
    </AppShell>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: likes = [] } = useQuery({
    queryKey: ["blog-likes", post?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_likes")
        .select("id, user_id")
        .eq("post_id", post!.id);
      return data ?? [];
    },
    enabled: !!post,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["blog-comments", post?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_comments")
        .select("id, content, user_id, created_at, profiles!user_id(full_name)")
        .eq("post_id", post!.id)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
    enabled: !!post,
  });

  const userLike = likes.find((l: any) => l.user_id === user?.id);

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (userLike) {
        await supabase.from("blog_likes").delete().eq("id", userLike.id);
      } else {
        await supabase.from("blog_likes").insert({ post_id: post!.id, user_id: user.id });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-likes", post?.id] });
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      if (!user || !commentText.trim()) return;
      const { error } = await supabase.from("blog_comments").insert({
        post_id: post!.id,
        user_id: user.id,
        content: commentText.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCommentText("");
      qc.invalidateQueries({ queryKey: ["blog-comments", post?.id] });
      toast.success("Comment posted");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to post comment"),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("blog_comments").delete().eq("id", commentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-comments", post?.id] });
    },
  });

  if (!post) {
    return (
      <AppShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl mb-8"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(post.published_at || post.created_at), "PPP")}
          </span>
          {(post as any).profiles?.full_name && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {(post as any).profiles.full_name}
            </span>
          )}
        </div>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t flex items-center gap-6">
          <button
            onClick={() => {
              if (!user) { toast.error("Sign in to like posts"); return; }
              toggleLike.mutate();
            }}
            className={`flex items-center gap-1.5 text-sm transition-colors ${userLike ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
          >
            <Heart className={`h-5 w-5 ${userLike ? "fill-current" : ""}`} />
            <span>{likes.length}</span>
          </button>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </span>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </h2>

          <div className="space-y-4 mb-8">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((c: any) => (
                <div key={c.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {(c.profiles?.full_name || "A")[0]}
                      </div>
                      <span className="font-medium">{c.profiles?.full_name || "Anonymous"}</span>
                      <span className="text-muted-foreground">· {format(new Date(c.created_at), "PPp")}</span>
                    </div>
                    {(c.user_id === user?.id) && (
                      <button onClick={() => deleteComment.mutate(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))
            )}
          </div>

          {user ? (
            <div className="space-y-3">
              <Textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
              />
              <Button onClick={() => addComment.mutate()} disabled={!commentText.trim() || addComment.isPending}>
                {addComment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Post Comment
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              <Link to="/login" className="text-primary hover:underline">Sign in</Link> to join the conversation.
            </p>
          )}
        </div>
      </div>
      </div>
    </AppShell>
  );
}
