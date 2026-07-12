import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  Loader2,
  Calendar,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  TrendingUp,
  Rss,
  Tag,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { getCleanBannerUrl } from "@/lib/utils";
import { motion } from "framer-motion";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Learnify AI" },
      {
        name: "description",
        content:
          "Insights, tutorials, career advice, and platform updates from the Learnify AI team.",
      },
    ],
  }),
  component: BlogIndexPage,
});

const CATEGORIES = [
  { label: "All", value: "all", icon: Rss },
  { label: "Career", value: "career", icon: TrendingUp },
  { label: "AI & Learning", value: "ai", icon: Sparkles },
  { label: "Tutorials", value: "tutorial", icon: BookOpen },
];

function readingTime(text: string) {
  const words = (text || "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function BlogIndexPage() {
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blog-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at, content")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) {
        // Table doesn't exist → return empty (don't crash)
        if (error.code === "42P01" || error.message?.includes("does not exist")) {
          console.warn("[Blog] blog_posts table not found, returning empty");
          return [];
        }
        throw error;
      }
      return data ?? [];
    },
    staleTime: 60_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const featured = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 to-background py-20 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-2xl px-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Rss className="h-3.5 w-3.5" />
              Learnify AI Blog
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Learn. Build. Launch.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Insights, tutorials, career advice, and platform updates — written by the team
              building the future of learning.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-16 space-y-16">
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center text-muted-foreground">
              <p className="font-medium text-destructive">Failed to load posts</p>
              <p className="text-sm mt-1 mb-4">Please try again in a moment.</p>
              <button
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && posts?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-24 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No posts yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Check back soon — great content is on the way.
              </p>
            </div>
          )}

          {/* Featured Post */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                Featured Post
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: (featured as any).slug }}
                className="group grid gap-6 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition hover:shadow-xl hover:border-primary/30 md:grid-cols-2"
              >
                {/* Cover image */}
                <div className="relative h-64 md:h-auto overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                  {(featured as any).featured_image ? (
                    <img
                      src={getCleanBannerUrl((featured as any).featured_image) ?? undefined}
                      alt={(featured as any).title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/20" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center gap-4 p-8">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <Tag className="h-3 w-3" />
                      {(featured as any).tags?.[0] || "Article"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(
                        parseISO((featured as any).published_at || (featured as any).created_at),
                        "MMM d, yyyy",
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime(
                        (featured as any).content || (featured as any).excerpt || "",
                      )}{" "}
                      min read
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {(featured as any).title}
                  </h2>

                  {(featured as any).excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {(featured as any).excerpt}
                    </p>
                  )}

                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid of remaining posts */}
          {rest.length > 0 && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">More Articles</h3>
                <span className="text-sm text-muted-foreground">{rest.length} articles</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post: any, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-lg hover:border-primary/30"
                    >
                      {/* Cover image */}
                      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/8 to-primary/4">
                        {post.featured_image ? (
                          <img
                            src={getCleanBannerUrl(post.featured_image) ?? undefined}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-10 w-10 text-primary/20" />
                          </div>
                        )}
                        {post.tags?.[0] && (
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full border border-white/30 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-foreground">
                              {post.tags[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(parseISO(post.published_at || post.created_at), "MMM d, yyyy")}
                          </span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>{readingTime(post.content || post.excerpt || "")} min</span>
                        </div>

                        <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          Read more
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
