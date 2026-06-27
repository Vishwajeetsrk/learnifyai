import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Blog — Learnify AI" }] }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["blog-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 0,
    gcTime: 0,
    retry: 2,
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Learnify AI Blog</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Insights, tutorials, and updates from the Learnify team.
          </p>
        </div>

        {!posts?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No posts yet.</p>
            <p className="text-sm mt-1">Check back soon for new content.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                {post.featured_image && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(post.published_at || post.created_at), "PPP")}</span>
                  </div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm font-medium text-primary mt-4">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
