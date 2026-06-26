import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, Calendar, ArrowLeft, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Post not found</h1>
      <Link to="/blog" className="text-primary hover:underline">← Back to blog</Link>
    </div>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

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
      </div>
      </div>
    </AppShell>
  );
}
