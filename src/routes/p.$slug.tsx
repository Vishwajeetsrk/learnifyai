import { createFileRoute, useParams, HeadContent } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BlockRenderer } from "@/components/wcms/BlockRenderer";
import { wcmsGetPublicPage } from "@/lib/wcms-public.functions";

export const Route = createFileRoute("/p/$slug")({
  head: ({ loaderData }) => {
    if (!(loaderData as any)?.page) return {};
    const p = (loaderData as any).page;
    return {
      meta: [
        { title: p.meta_title || `${p.title} — Learnify AI` },
        { name: "description", content: p.meta_description || p.description || "" },
        { property: "og:title", content: p.meta_title || p.title },
        { property: "og:description", content: p.meta_description || p.description || "" },
        ...(p.og_image_url ? [{ property: "og:image", content: p.og_image_url }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const page = await wcmsGetPublicPage({ data: { slug: params.slug } });
    return { page };
  },
  component: WcmsPage,
});

function WcmsPage() {
  const { slug } = useParams({ from: "/p/$slug" });
  const { page } = Route.useLoaderData() as { page: any };

  if (!page) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-black text-muted-foreground/30">404</h1>
            <p className="text-muted-foreground">Page not found or not published yet.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <HeadContent />
      <article>
        {/* Page Header */}
        <header className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{page.description}</p>
            )}
          </div>
        </header>

        {/* Rendered Blocks */}
        {page.blocks && page.blocks.length > 0 ? (
          <BlockRenderer blocks={page.blocks} />
        ) : (
          <div className="max-w-5xl mx-auto px-6 py-20 text-center text-muted-foreground">
            <p>This page has no content blocks yet.</p>
          </div>
        )}
      </article>
    </AppShell>
  );
}
