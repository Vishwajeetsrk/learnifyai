import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CANONICAL_LEGAL_DOCS, CanonicalLegalDoc } from "@/lib/canonical-config";
import { DOC_CONTENTS } from "@/lib/legal-docs-data";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Shield,
  HelpCircle,
  Clock,
  ChevronRight,
  Search,
  ExternalLink,
  BookOpen,
  Scale,
  Sparkles,
  Users,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/legal")({
  validateSearch: (s: Record<string, unknown>): { doc?: string; q?: string } => ({
    doc: s.doc as string | undefined,
    q: s.q as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Legal Center — Learnify AI" },
      {
        name: "description",
        content:
          "Official policies, terms of service, privacy practices, refund terms, and acceptable use guidelines for Learnify AI.",
      },
      { property: "og:title", content: "Legal Center — Learnify AI" },
      {
        property: "og:description",
        content: "Transparent governance, terms of service, and privacy standards at Learnify AI.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/legal" }],
  }),
  component: LegalCenterPage,
});

function LegalCenterPage() {
  const { doc, q } = useSearch({ from: "/legal" as any });
  const [activeSlug, setActiveSlug] = useState<string>(doc || "terms");
  const [searchQuery, setSearchQuery] = useState<string>(q || "");
  const { data: s } = useSiteSettings();
  const { isAdmin } = useAuth();

  const { data: customLegalSettings = {} } = useQuery({
    queryKey: ["public-legal-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) return {};
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => {
        if (r.key && r.value != null) map[r.key] = r.value;
      });
      return map;
    },
    staleTime: 60_000,
  });

  const isCenterHidden = customLegalSettings["legal_center_enabled"] === "false" || s?.legal_center_enabled === "false";

  // Build documents list with admin overrides and visibility filters
  const allDocs = useMemo(() => {
    return CANONICAL_LEGAL_DOCS.map((d) => {
      const isHidden = customLegalSettings[`legal_doc_hidden_${d.slug}`] === "true";
      return {
        ...d,
        title: customLegalSettings[`legal_doc_title_${d.slug}`] || d.title,
        summary: customLegalSettings[`legal_doc_summary_${d.slug}`] || d.summary,
        version: customLegalSettings[`legal_doc_version_${d.slug}`] || d.version,
        lastUpdated: customLegalSettings[`legal_doc_updated_${d.slug}`] || d.lastUpdated,
        isHidden,
      };
    }).filter((d) => {
      if (d.isHidden && !isAdmin) return false;
      return true;
    });
  }, [customLegalSettings, isAdmin]);

  const activeDoc = useMemo(() => {
    return allDocs.find((d) => d.slug === activeSlug) || allDocs[0] || CANONICAL_LEGAL_DOCS[0];
  }, [activeSlug, allDocs]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return allDocs;
    const query = searchQuery.toLowerCase();
    return allDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.summary.toLowerCase().includes(query) ||
        d.slug.toLowerCase().includes(query),
    );
  }, [searchQuery, allDocs]);

  // Compute active document HTML content with fallback to DOC_CONTENTS
  const activeDocHtml = useMemo(() => {
    if (!activeDoc) return "";
    const customHtml =
      customLegalSettings[`legal_doc_content_${activeDoc.slug}`] ||
      (activeDoc.slug === "terms" ? customLegalSettings["page_terms"] : undefined) ||
      (activeDoc.slug === "privacy" ? customLegalSettings["page_privacy"] : undefined) ||
      (activeDoc.slug === "cancellation-refund" ? customLegalSettings["page_refund"] : undefined);

    return customHtml || DOC_CONTENTS[activeDoc.slug] || "<p>Policy content is being refreshed. Please check back shortly.</p>";
  }, [activeDoc, customLegalSettings]);

  // If hidden and visitor is NOT admin, show maintenance notice
  if (isCenterHidden && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 container max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6 shadow-sm">
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Legal Center Maintenance</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">
            The Legal Center is currently undergoing scheduled compliance and policy updates. For urgent legal notices, inquiries, or terms questions, please reach out directly to our support desk.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild>
              <a href={`mailto:${s?.contact_email || "support.learnifyai@gmail.com"}`}>Contact Support</a>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const centerTitle = customLegalSettings["legal_center_title"] || s?.legal_center_title || "Legal Center";
  const centerSubtitle =
    customLegalSettings["legal_center_subtitle"] ||
    s?.legal_center_subtitle ||
    "Canonical legal documents, commercial policies, data privacy terms, and acceptable use standards for Learnify AI.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Admin preview banner if hidden */}
      {isCenterHidden && isAdmin && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Admin Preview Mode:</strong> The Legal Center is currently <strong>HIDDEN</strong> from public visitors. Unhide it in{" "}
            <Link to="/admin/content" search={{ tab: "legal-center" }} className="underline font-bold hover:opacity-80">
              Content Manager &rarr; Legal Center
            </Link>
            .
          </span>
        </div>
      )}

      <main className="flex-1">
        {/* Header Banner */}
        <section className="border-b bg-muted/20 py-12 md:py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-3">
                  <Shield className="h-3.5 w-3.5" />
                  Governance &amp; Compliance
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display">{centerTitle}</h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl leading-relaxed">
                  {centerSubtitle}
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Legal Browser Grid */}
        <section className="container mx-auto px-6 py-10 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2 flex items-center justify-between">
                <span>Published Policies ({filteredDocs.length})</span>
                {isAdmin && <span className="text-[10px] text-primary lowercase">(Admin view)</span>}
              </h2>
              <div className="space-y-1">
                {filteredDocs.map((docItem) => {
                  const isActive = activeSlug === docItem.slug;
                  return (
                    <button
                      key={docItem.slug}
                      onClick={() => setActiveSlug(docItem.slug)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start justify-between gap-2 cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm leading-tight flex items-center gap-1.5">
                          <span>{docItem.title}</span>
                          {docItem.isHidden && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <div
                          className={`text-[11px] line-clamp-1 ${
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          v{docItem.version} &middot; {docItem.lastUpdated}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl border bg-card/50 text-xs text-muted-foreground space-y-2 mt-6">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Questions or Support?
                </div>
                <p>
                  Need clarification regarding any policy or billing term? Our support team is available at{" "}
                  <a href={`mailto:${s?.contact_email || "support.learnifyai@gmail.com"}`} className="text-primary underline">
                    {s?.contact_email || "support.learnifyai@gmail.com"}
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Document Content View */}
            <div className="lg:col-span-8 bg-card border rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
              {activeDoc && (
                <>
                  <div className="border-b pb-6 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-display">{activeDoc.title}</h2>
                        {activeDoc.isHidden && (
                          <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 bg-amber-500/10">
                            Hidden from public
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs px-2.5 py-0.5">
                        Version {activeDoc.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeDoc.summary}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Effective: {activeDoc.effectiveDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Last Updated: {activeDoc.lastUpdated}
                      </span>
                    </div>
                  </div>

                  {/* Render Document HTML Content */}
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-sm [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-sm [&>a]:text-primary [&>a]:underline"
                    dangerouslySetInnerHTML={{
                      __html: activeDocHtml,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
