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
  Pen,
  Zap,
  Star,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { getCleanBannerUrl } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { FREE_COURSES_GUIDE_POST } from "@/lib/canonical-blog";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { useRef } from "react";

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

function readingTime(text: string) {
  const words = (text || "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const FALLBACK_POSTS = [
  FREE_COURSES_GUIDE_POST,
  {
    id: "fb-1",
    title: "How to Become a Full-Stack AI Engineer in 2026: The Complete Roadmap",
    slug: "full-stack-ai-engineer-roadmap-2026",
    excerpt:
      "Master TanStack Start, React 19, Supabase, LangChain, and Vercel AI SDK to build production-grade AI SaaS applications.",
    featured_image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-07-20T10:00:00Z",
    created_at: "2026-07-20T10:00:00Z",
    tags: ["Career", "AI Engineering"],
    content:
      "The role of the software engineer is evolving rapidly. In 2026, Full-Stack AI Engineering combines traditional frontend and backend architecture with autonomous LLM agents, vector database RAG pipelines, and serverless edge functions...",
  },
  {
    id: "fb-2",
    title: "Building Production Autonomous AI Agents with LangGraph & Python",
    slug: "autonomous-ai-agents-langgraph-python",
    excerpt:
      "Step-by-step guide to stateful multi-agent systems, human-in-the-loop workflows, and error handling in Python.",
    featured_image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-07-18T10:00:00Z",
    created_at: "2026-07-18T10:00:00Z",
    tags: ["Tutorials", "Python AI"],
    content:
      "Autonomous agents are no longer just demo scripts. Learn how to architect stateful multi-agent systems using LangGraph...",
  },
  {
    id: "fb-3",
    title: "Comparing Cashfree vs Razorpay for Indian EdTech & SaaS Applications",
    slug: "cashfree-vs-razorpay-india-saas",
    excerpt:
      "A deep dive into transaction fees, GST invoicing compliance, subscription APIs, and merchant domain whitelisting in India.",
    featured_image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-07-15T10:00:00Z",
    created_at: "2026-07-15T10:00:00Z",
    tags: ["Finance", "Payment Systems"],
    content:
      "Choosing the right payment gateway for Indian SaaS and EdTech startups requires evaluating transaction fees, GST compliance...",
  },
];

const EDITORIAL_HIGHLIGHTS = [
  {
    title: "Free AI Course Directory — 100+ Resources",
    badge: "New",
    badgeColor: "#6366F1",
    date: "Sep 2026",
    description: "Curated list of the best free AI & ML resources across Coursera, edX, and more.",
    icon: <Sparkles className="h-4 w-4 text-indigo-500" />,
  },
  {
    title: "Full-Stack AI Engineer Roadmap",
    badge: "Trending",
    badgeColor: "#10B981",
    date: "Jul 2026",
    description: "TanStack Start + React 19 + Supabase — the 2026 production stack guide.",
    icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
  },
  {
    title: "LangGraph Autonomous Agent Tutorial",
    badge: "Deep Dive",
    badgeColor: "#F59E0B",
    date: "Jul 2026",
    description: "Multi-agent systems, human-in-the-loop, and production error handling patterns.",
    icon: <Zap className="h-4 w-4 text-amber-500" />,
  },
  {
    title: "Cashfree vs Razorpay: India SaaS Guide",
    badge: "Research",
    badgeColor: "#8B5CF6",
    date: "Jul 2026",
    description: "Fees, GST compliance, and subscription APIs compared for Indian developers.",
    icon: <Star className="h-4 w-4 text-violet-500" />,
  },
];

function BlogIndexPage() {
  const {
    data: rawPosts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blog-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at, content, tags")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) {
        if (error.code === "42P01" || error.message?.includes("does not exist")) {
          return FALLBACK_POSTS;
        }
        throw error;
      }
      return data && data.length > 0 ? data : FALLBACK_POSTS;
    },
    staleTime: 60_000,
    retry: 3,
  });

  const posts = rawPosts && rawPosts.length > 0 ? rawPosts : FALLBACK_POSTS;
  const featured = posts[0];
  const rest = posts.slice(1);

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* ===== PREMIUM HERO ===== */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background py-24 md:py-32">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-[100px]" />
            <div className="absolute top-10 right-1/4 h-64 w-64 rounded-full bg-indigo-400/6 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-5xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left — headline + CTA */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary"
                >
                  <Rss className="h-3.5 w-3.5" />
                  Learnify AI Editorial
                </motion.div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
                  <VerticalCutReveal delay={0.1}>Learn. Build.</VerticalCutReveal>{" "}
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">
                    <VerticalCutReveal delay={0.45}>Launch Your Career.</VerticalCutReveal>
                  </span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
                >
                  Insights, tutorials, career guides, and platform updates —
                  written by the team building the future of learning.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-[color,background-color,border-color,box-shadow,transform]"
                  >
                    <BookOpen className="h-4 w-4" />
                    Browse All Articles
                  </Link>
                  <a
                    href="mailto:support.learnifyai@gmail.com?subject=Blog Contribution"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5 transition-all"
                  >
                    <Pen className="h-4 w-4" />
                    Write for Us
                  </a>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85 }}
                  className="mt-8 flex items-center gap-6 text-xs text-muted-foreground"
                >
                  {[
                    { value: `${posts.length}+`, label: "Articles" },
                    { value: "10K+", label: "Monthly Readers" },
                    { value: "Weekly", label: "New Posts" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-0.5 text-center">
                      <span className="text-base font-bold text-foreground">{s.value}</span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Editorial Timeline */}
              <div ref={timelineRef}>
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    What's Hot
                  </div>
                  <TimelineContent
                    items={EDITORIAL_HIGHLIGHTS}
                    dotColor="hsl(262 83% 58%)"
                    lineColor="hsl(262 83% 58%)"
                  />
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      View all articles <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MAIN CONTENT ===== */}
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
                className="group grid gap-0 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition hover:shadow-2xl hover:border-primary/30 md:grid-cols-[1.1fr_0.9fr]"
              >
                {/* Cover image */}
                <div className="relative h-64 md:h-auto overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                  {(featured as any).featured_image ? (
                    <img
                      src={getCleanBannerUrl((featured as any).featured_image) ?? undefined}
                      alt={(featured as any).title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/20" />
                    </div>
                  )}
                  {/* Overlay badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 px-3 py-1.5 text-[10px] font-semibold">
                    <Tag className="h-3 w-3 text-primary" />
                    {(featured as any).tags?.[0] || "Article"}
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

                  <h2 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {(featured as any).title}
                  </h2>

                  {(featured as any).excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {(featured as any).excerpt}
                    </p>
                  )}

                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-2">
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
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:shadow-xl hover:border-primary/30 hover:-translate-y-0.5"
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

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/6 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-indigo-400/6 blur-2xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
                <Rss className="h-3.5 w-3.5" />
                Stay Updated
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Get the Best Articles Delivered
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Join 10,000+ learners who get weekly career tips, AI tutorials, and course updates
                from the Learnify AI team.
              </p>
              <a
                href="mailto:support.learnifyai@gmail.com?subject=Newsletter Subscription"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Subscribe via Email
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
