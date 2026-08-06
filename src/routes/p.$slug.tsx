import { createFileRoute, Link, HeadContent } from "@tanstack/react-router";
import { getPortfolioBySlug } from "@/lib/portfolio.functions";
import { wcmsGetPublicPage } from "@/lib/wcms-public.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlockRenderer } from "@/components/wcms/BlockRenderer";
import {
  Code2,
  Heart,
  Settings,
  Github,
  ExternalLink,
  Mail,
  Globe,
  Linkedin,
  FolderOpen,
  GraduationCap,
  Briefcase,
  Eye,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    const [portfolioRes, wcmsPage] = await Promise.all([
      getPortfolioBySlug({ data: { slug: params.slug } }),
      wcmsGetPublicPage({ data: { slug: params.slug } }),
    ]);
    return { portfolio: portfolioRes.portfolio, wcmsPage };
  },
  head: ({ loaderData }) => {
    const p = (loaderData as any)?.portfolio;
    if (p) {
      return {
        meta: [
          { title: `${p.username} — Portfolio | Learnify AI` },
          { name: "description", content: `Public portfolio of ${p.username} on Learnify AI.` },
        ],
      };
    }
    const wcms = (loaderData as any)?.wcmsPage;
    if (wcms) {
      return {
        meta: [
          { title: wcms.meta_title || `${wcms.title} — Learnify AI` },
          { name: "description", content: wcms.meta_description || wcms.description || "" },
          { property: "og:title", content: wcms.meta_title || wcms.title },
          { property: "og:description", content: wcms.meta_description || wcms.description || "" },
          ...(wcms.og_image_url ? [{ property: "og:image", content: wcms.og_image_url }] : []),
        ],
      };
    }
    return {
      meta: [
        { title: `Not found — Learnify AI` },
        { name: "description", content: `Page not found on Learnify AI.` },
      ],
    };
  },
  component: PublicPortfolioPage,
});

interface ProjectEntry {
  name: string;
  description?: string;
  techStack?: string;
  githubUrl?: string;
  imageUrl?: string | null;
}

interface PortfolioData {
  fullName?: string;
  tagline?: string;
  bio?: string;
  skills?: string;
  softSkills?: string;
  tools?: string;
  socialLinks?: string;
  experience?: string;
  education?: string;
  style?: string;
  accentColor?: string;
  photoUrl?: string | null;
  projectsList?: ProjectEntry[];
  updatedAt?: string;
}

function PublicPortfolioPage() {
  const { portfolio, wcmsPage } = Route.useLoaderData() as any;

  if (portfolio) return <PortfolioView data={portfolio} />;
  if (wcmsPage) return <WcmsPageView page={wcmsPage} />;

  return (
    <AppShell>
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
          <FolderOpen className="h-9 w-9 text-primary/60" />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          This page hasn't been published yet, or the link is incorrect.
        </p>
        <Button asChild variant="outline" className="mt-2 cursor-pointer">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function PortfolioView({ data }: { data: any }) {
  const pd = (data.data as PortfolioData) || {};
  const viewCount = data.views ?? 0;
  const projects = Array.isArray(pd.projectsList) ? pd.projectsList : [];
  const accent = pd.accentColor || "#6366f1";

  const skills = (pd.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const softSkills = (pd.softSkills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const tools = (pd.tools || "").split(",").map((s) => s.trim()).filter(Boolean);
  const socialLinks = (pd.socialLinks || "").split("\n").map((s) => s.trim()).filter(Boolean);

  const initials = (pd.fullName || "P")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell>
      <div className="min-h-[80vh]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-3 rounded-full blur-xl"
                  style={{ backgroundColor: `${accent}40` }}
                />
                <Avatar
                  className="h-32 w-32 rounded-full shadow-2xl"
                  style={{ boxShadow: `0 0 0 4px ${accent}40, 0 8px 30px ${accent}30` }}
                >
                  {pd.photoUrl ? (
                    <AvatarImage src={pd.photoUrl} alt={pd.fullName || "Portfolio"} />
                  ) : (
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-indigo-500/20 text-primary">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="text-center sm:text-left">
                <Badge
                  variant="outline"
                  className="mb-3 gap-1.5 text-primary border-primary/30 bg-primary/5"
                >
                  <Sparkles className="h-3 w-3" /> Published Portfolio
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {pd.fullName || "Portfolio"}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">{pd.tagline}</p>
                {pd.bio && <p className="text-sm text-muted-foreground/80 mt-3 max-w-xl">{pd.bio}</p>}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    {socialLinks.slice(0, 6).map((link: string, i: number) => {
                      const Icon =
                        link.includes("linkedin")
                          ? Linkedin
                          : link.includes("github")
                            ? Github
                            : link.includes("mailto")
                              ? Mail
                              : Globe;
                      return (
                        <a
                          key={i}
                          href={link.startsWith("mailto") ? link : link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-card hover:border-primary/40 hover:bg-primary/5 transition cursor-pointer"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {link.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}
                        </a>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-5 justify-center sm:justify-start text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {viewCount.toLocaleString()} views
                  </span>
                  {pd.updatedAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Updated {new Date(pd.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          {skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-500" /> Tech Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs px-3 py-1.5 hover:scale-105 transition-transform"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {softSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" /> Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((s: string, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs border-rose-200 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {tools.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-amber-500" /> Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((s: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs bg-amber-50/50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" /> Projects
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {p.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold">{p.name}</h4>
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted-foreground hover:text-foreground transition cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                      )}
                      {p.techStack && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {p.techStack.split(",").map((t: string, j: number) => (
                            <Badge key={j} variant="outline" className="text-[10px]">
                              {t.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pd.experience && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-500" /> Experience
              </h3>
              <div className="p-5 rounded-2xl border bg-card">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{pd.experience}</p>
              </div>
            </div>
          )}

          {pd.education && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-500" /> Education
              </h3>
              <div className="p-5 rounded-2xl border bg-card">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{pd.education}</p>
              </div>
            </div>
          )}

          <footer className="pt-8 border-t text-center text-xs text-muted-foreground">
            Built with{" "}
            <Link to="/career-studio" className="text-primary hover:underline font-semibold">
              Learnify AI Portfolio Builder
            </Link>{" "}
            — {pd.fullName || "Portfolio"} © {new Date().getFullYear()}
          </footer>
        </section>
      </div>
    </AppShell>
  );
}

function WcmsPageView({ page }: { page: any }) {
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
