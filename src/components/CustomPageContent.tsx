import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

type Props = {
  pageKey: string;
  title: string;
  subtitle: string;
  defaultContent: string;
  meta?: { title: string; description: string };
};

export function CustomPageContent({ pageKey, title, subtitle, defaultContent, meta }: Props) {
  const q = useQuery({
    queryKey: ["page-content", pageKey],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", `page_${pageKey}`)
        .single();
      return (data as { value?: string } | null)?.value;
    },
    staleTime: 60_000,
  });

  const content = q.data || defaultContent;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-8">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-1">
              {pageKey === "privacy" ? "Privacy" : pageKey === "terms" ? "Terms" : "Refund Policy"}
            </p>
            <h1 className="text-3xl font-display font-bold">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          </div>
          <div
            className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {q.isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
