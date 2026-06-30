import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowRight, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Blog — Learnify AI" }] }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
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
          <div className="grid gap-4">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}</span>
                  </div>
                  <h2 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-3" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
