import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowLeft, User, Heart, MessageCircle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SafeImage } from "@/components/ui/SafeImage";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { FREE_COURSES_GUIDE_POST } from "@/lib/canonical-blog";
import { BLOG_POSTS_DATA } from "@/lib/blog-posts-data";
import { Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FALLBACK_POSTS: Record<string, any> = {
  "ultimate-guide-free-courses-certificates-2026": FREE_COURSES_GUIDE_POST,
  "free-courses-certificates-guide-2026": FREE_COURSES_GUIDE_POST,
  "the-ultimate-guide-to-free-courses-free-certificates-high-value-skills-in-2026": FREE_COURSES_GUIDE_POST,
  "free-courses-certificates-skills-2026": FREE_COURSES_GUIDE_POST,
  "guide-free-courses-2026": FREE_COURSES_GUIDE_POST,
  "free-courses-2026": FREE_COURSES_GUIDE_POST,
  ...BLOG_POSTS_DATA,
};

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const post = (loaderData as any)?.post;
    if (!post) return { meta: [{ title: "Blog Post — Learnify AI" }] };

    const canonicalUrl = `https://www.learnifyai.in/blog/${post.slug}`;
    const imageUrl = post.featured_image || "https://www.learnifyai.in/logo.png";

    // Optimized concise SEO titles (<60 chars) to prevent search snippet truncation
    const SLUG_SEO_TITLES: Record<string, string> = {
      "full-stack-ai-engineer-roadmap-2026": "Full-Stack AI Engineer Roadmap 2026 | Learnify AI",
      "ultimate-guide-free-courses-certificates-2026": "Free Courses & Certificates Guide 2026 | Learnify AI",
      "cashfree-vs-razorpay-india-saas": "Cashfree vs Razorpay for India SaaS | Learnify AI",
      "autonomous-ai-agents-langgraph-python": "Production AI Agents: LangGraph & Python | Learnify AI",
    };
    const seoTitle =
      SLUG_SEO_TITLES[post.slug] ||
      (post.title?.length > 45 ? `${post.title.slice(0, 45).trim()}... | Learnify AI` : `${post.title} | Learnify AI`);
    const seoDesc = post.excerpt
      ? post.excerpt.length > 155
        ? `${post.excerpt.slice(0, 152).trim()}...`
        : post.excerpt
      : "Read our latest article on Learnify AI.";

    return {
      meta: [
        { title: seoTitle },
        { name: "description", content: seoDesc },
        {
          name: "keywords",
          content: `${post.title}, Learnify AI, Learnify, AI Learning, Career OS, EdTech`,
        },
        { property: "og:title", content: seoTitle },
        {
          property: "og:description",
          content: seoDesc,
        },
        { property: "og:image", content: imageUrl },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seoTitle },
        {
          name: "twitter:description",
          content: seoDesc,
        },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
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
  headers: () => ({
    "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  }),
  loader: async ({ params }) => {
    // 1. Instant in-memory cache check (eliminates 1.2s cold start / DB network roundtrip for canonical articles)
    const normalizedSlug = params.slug.toLowerCase().trim();
    const fallback =
      FALLBACK_POSTS[normalizedSlug] ||
      (normalizedSlug.includes("free-course") ? FALLBACK_POSTS["ultimate-guide-free-courses-certificates-2026"] : null);

    if (fallback) {
      return { post: fallback };
    }

    // 2. Query Supabase for dynamic user/creator blog posts
    try {
      const searchSlugs = [params.slug];
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, content, excerpt, featured_image, author_id, published_at, created_at, profiles!author_id(full_name)",
        )
        .in("slug", searchSlugs)
        .eq("published", true)
        .maybeSingle();

      if (data) return { post: data };
    } catch {
      // Ignore database errors
    }

    return { post: null };
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

  if (!post) {
    return (
      <AppShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 py-16">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to blog
          </Link>
        </div>
      </AppShell>
    );
  }

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
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-tight font-display">
            {post.title}
          </h1>

          {/* Author Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <img
                src={post.author_avatar || "/avatars/Vishwajeet.jpeg"}
                alt="Vishwajeet"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30 shadow-md"
              />
              <div>
                <div className="font-bold text-foreground text-sm flex items-center gap-2">
                  <span>{post.author_name || (post as any).profiles?.full_name || "Vishwajeet"}</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-2 bg-primary/10 text-primary border-primary/20 font-semibold">
                    Author
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {post.author_role || "Founder & AI Architect · Learnify AI"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {format(new Date(post.published_at || post.created_at), "PPP")}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {post.reading_time || 12} min read
              </span>
            </div>
          </div>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-medium">{post.excerpt}</p>
          )}

          <BlogPostContent content={post.content} postTitle={post.title} />

          {/* About the Author Card */}
          <div className="my-12 p-6 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src="/avatars/Vishwajeet.jpeg"
              alt="Vishwajeet"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/30 shadow-md shrink-0"
            />
            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-display font-bold text-base text-foreground">Vishwajeet</h3>
                <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
                  Founder &amp; AI Architect
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Building Learnify AI to democratize hands-on software masteries, AI agent engineering, and verifiable career growth for millions of learners across India and globally.
              </p>
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs">
                <a
                  href="https://github.com/Vishwajeetsrk/learnifyai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  GitHub @Vishwajeetsrk
                </a>
                <span className="text-muted-foreground">·</span>
                <Link to="/courses" className="font-medium text-muted-foreground hover:text-foreground">
                  Explore Masteries
                </Link>
              </div>
            </div>
          </div>

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
          <RelatedArticles currentPostId={post.id} currentSlug={post.slug} />
        </div>
      </div>
    </AppShell>
  );
}

const CANONICAL_RELATED_POSTS = [
  {
    id: "canonical-roadmap",
    title: "Full-Stack AI Engineer Roadmap 2026: Master TanStack, LangGraph & Vector DBs",
    slug: "full-stack-ai-engineer-roadmap-2026",
    excerpt:
      "The definitive guide to mastering React 19, Supabase pgvector, LangChain, Groq, and autonomous agents in 2026.",
    featured_image: "/illustrations/code_typing.svg",
    published_at: "2026-07-20",
  },
  {
    id: "canonical-free-courses",
    title: "The Ultimate Guide to Free Courses, Free Certificates & High-Value Skills in 2026",
    slug: "ultimate-guide-free-courses-certificates-2026",
    excerpt:
      "Discover thousands of free learning resources and certificate opportunities from Google, Harvard CS50, freeCodeCamp, and more.",
    featured_image: "/illustrations/certificate_isometric.svg",
    published_at: "2026-08-01",
  },
  {
    id: "canonical-agents",
    title: "Building Production Autonomous AI Agents with LangGraph & Python in 2026",
    slug: "autonomous-ai-agents-langgraph-python",
    excerpt:
      "Step-by-step architectural breakdown to engineering fault-tolerant multi-agent loops and human-in-the-loop workflows.",
    featured_image: "/illustrations/smart_bot.svg",
    published_at: "2026-07-18",
  },
  {
    id: "canonical-payment",
    title: "Cashfree vs Razorpay in 2026: The Definitive Payment Gateway Guide for Indian SaaS",
    slug: "cashfree-vs-razorpay-india-saas",
    excerpt:
      "Deep comparison of fees, recurring subscriptions, international payments, and GST compliance for Indian businesses.",
    featured_image: "/illustrations/digital_wallet.svg",
    published_at: "2026-07-15",
  },
];

function RelatedArticles({
  currentPostId,
  currentSlug,
}: {
  currentPostId?: string;
  currentSlug?: string;
}) {
  const { data: related = [] } = useQuery({
    queryKey: ["related-blog-posts", currentPostId],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("published", true)
        .neq("id", currentPostId || "")
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
    enabled: !!currentPostId,
  });

  const displayPosts =
    related.length > 0
      ? related
      : CANONICAL_RELATED_POSTS.filter(
          (c) => c.slug !== currentSlug && c.id !== currentPostId,
        ).slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Related Articles</h3>
          <p className="text-sm text-muted-foreground">
            Expand your knowledge with more posts from Learnify AI.
          </p>
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
