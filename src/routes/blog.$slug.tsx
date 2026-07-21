import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowLeft, User, Heart, MessageCircle, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { AppShell } from "@/components/AppShell";
import { SafeImage } from "@/components/ui/SafeImage";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const post = (loaderData as any)?.post;
    if (!post) return { meta: [{ title: "Blog Post — Learnify AI" }] };

    const canonicalUrl = `https://www.learnifyai.in/blog/${post.slug}`;
    const imageUrl = post.featured_image || "https://www.learnifyai.in/logo.png";

    return {
      meta: [
        { title: `${post.title} — Learnify AI Blog` },
        { name: "description", content: post.excerpt || "Read our latest article on Learnify AI." },
        { name: "keywords", content: `${post.title}, Learnify AI, Learnify, AI Learning, Career OS, EdTech` },
        { property: "og:title", content: `${post.title} — Learnify AI Blog` },
        {
          property: "og:description",
          content: post.excerpt || "Read our latest article on Learnify AI.",
        },
        { property: "og:image", content: imageUrl },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${post.title} — Learnify AI Blog` },
        { name: "twitter:description", content: post.excerpt || "Read our latest article on Learnify AI." },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            headline: post.title,
            image: [imageUrl],
            datePublished: post.published_at || post.created_at,
            dateModified: post.published_at || post.created_at,
            description: post.excerpt || "",
            author: {
              "@type": "Organization",
              name: post.profiles?.full_name || "Learnify AI Editorial Team",
              url: "https://www.learnifyai.in",
            },
            publisher: {
              "@type": "Organization",
              name: "Learnify AI",
              logo: {
                "@type": "ImageObject",
                url: "https://www.learnifyai.in/logo.png",
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.learnifyai.in",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.learnifyai.in/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: canonicalUrl,
              },
            ],
          }),
        },
      ],
    };
  },
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, content, excerpt, featured_image, author_id, published_at, created_at, profiles!author_id(full_name)",
      )
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
          <img
            src="/illustrations/404_Page_not_found.svg"
            loading="lazy"
            alt="Not found"
            className="w-full h-full"
          />
        </div>
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="text-primary hover:underline">
          ← Back to blog
        </Link>
      </div>
    </AppShell>
  ),
});

function BlogPostPage() {
  const { post } = (Route.useLoaderData() ?? {}) as { post: any };
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
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to blog
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Helmet>
        <title>{post.title} — Learnify AI Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} — Learnify AI Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:type" content="article" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

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
                if (!user) {
                  toast.error("Sign in to like posts");
                  return;
                }
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

          {/* Comments Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({comments.length})
            </h2>

            <div className="space-y-4 mb-8">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((c: any) => (
                  <div key={c.id} className="rounded-xl border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {(c.profiles?.full_name || "A")[0]}
                        </div>
                        <span className="font-medium">{c.profiles?.full_name || "Anonymous"}</span>
                        <span className="text-muted-foreground">
                          · {format(new Date(c.created_at), "PPp")}
                        </span>
                      </div>
                      {c.user_id === user?.id && (
                        <button
                          onClick={() => deleteComment.mutate(c.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
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
                <Button
                  onClick={() => addComment.mutate()}
                  disabled={!commentText.trim() || addComment.isPending}
                >
                  {addComment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Post Comment
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to join the conversation.
              </p>
            )}
          </div>

          {/* Related Articles (SEO Internal Link Network) */}
          <RelatedArticles currentPostId={post.id} />
        </div>
      </div>
    </AppShell>
  );
}

function RelatedArticles({ currentPostId }: { currentPostId: string }) {
  const { data: related = [] } = useQuery({
    queryKey: ["related-blog-posts", currentPostId],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("published", true)
        .neq("id", currentPostId)
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
    enabled: !!currentPostId,
  });

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Related Articles</h3>
          <p className="text-sm text-muted-foreground">Expand your knowledge with more posts from Learnify AI.</p>
        </div>
        <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
          View all blog posts →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {related.map((rel: any) => (
          <Link
            key={rel.id}
            to="/blog/$slug"
            params={{ slug: rel.slug }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg"
          >
            {rel.featured_image && (
              <div className="relative h-36 overflow-hidden rounded-xl mb-3 bg-muted">
                <img
                  src={rel.featured_image}
                  alt={rel.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <span className="text-[11px] text-muted-foreground mb-1">
              {format(new Date(rel.published_at || rel.created_at), "MMM d, yyyy")}
            </span>
            <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {rel.title}
            </h4>
            {rel.excerpt && (
              <p className="text-xs text-muted-foreground line-clamp-2">{rel.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
