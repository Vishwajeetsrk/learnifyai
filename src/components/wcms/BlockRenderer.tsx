import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Zap,
  Code,
  Users,
  Award,
  Trophy,
  Map,
  MessageSquare,
  Bot,
  Image,
  MessageCircle,
  Smartphone,
  Folder,
  BookOpen,
  Rocket,
  Flame,
  Star,
  Palette,
  FileCode,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  Check,
  ArrowRight,
  Quote,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ═══════════════════════════════════════════════════════════════
// WCMS Block Renderer — Renders each block type for the public site
// ═══════════════════════════════════════════════════════════════

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Zap,
  Code,
  Users,
  Award,
  Trophy,
  Map,
  MessageSquare,
  Bot,
  Image,
  MessageCircle,
  Smartphone,
  Folder,
  BookOpen,
  Rocket,
  Flame,
  Star,
  Palette,
  FileCode,
};

type BlockContent = Record<string, unknown>;

type Block = {
  id: string;
  block_type: string;
  label: string | null;
  content: BlockContent;
  sort_order: number;
  visible: boolean;
};

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-0">
      {blocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function RenderBlock({ block }: { block: Block }) {
  const { block_type, content } = block;

  switch (block_type) {
    case "hero":
      return <HeroBlock content={content} />;
    case "text":
      return <TextBlock content={content} />;
    case "image":
      return <ImageBlock content={content} />;
    case "video":
      return <VideoBlock content={content} />;
    case "code":
      return <CodeBlock content={content} />;
    case "cta":
      return <CtaBlock content={content} />;
    case "features":
      return <FeaturesBlock content={content} />;
    case "list":
      return <ListBlock content={content} />;
    case "faq":
      return <FaqBlock content={content} />;
    case "pricing":
      return <PricingBlock content={content} />;
    case "testimonial":
      return <TestimonialBlock content={content} />;
    case "spacer":
      return <SpacerBlock content={content} />;
    case "html":
      return <HtmlBlock content={content} />;
    case "markdown":
      return <MarkdownBlock content={content} />;
    default:
      return null;
  }
}

// ───────── Hero Block ─────────
function HeroBlock({ content }: { content: BlockContent }) {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        backgroundColor: (content.background_color as string) ?? "#0f172a",
        color: (content.text_color as string) ?? "#ffffff",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
      <div className="relative max-w-5xl mx-auto px-6 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display">
          {(content.heading as string) ?? "Welcome"}
        </h1>
        {(content.subheading as string) && (
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
            {content.subheading as string}
          </p>
        )}
        {(content.cta_text as string) && (
          <div className="pt-4">
            <Button size="lg" asChild className="text-base px-8">
              <Link to={(content.cta_url as string) ?? "/"}>
                {content.cta_text as string}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// ───────── Text Block ─────────
function TextBlock({ content }: { content: BlockContent }) {
  const align = (content.alignment as string) ?? "left";
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          style={{ textAlign: align as "left" | "center" | "right" }}
          dangerouslySetInnerHTML={{ __html: (content.html as string) ?? "" }}
        />
      </div>
    </section>
  );
}

// ───────── Image Block ─────────
function ImageBlock({ content }: { content: BlockContent }) {
  if (!content.src) return null;
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        <figure>
          <img
            src={content.src as string}
            alt={(content.alt as string) ?? ""}
            className={`w-auto mx-auto ${content.rounded ? "rounded-xl" : ""}`}
            style={{ maxWidth: (content.width as string) ?? "100%" }}
            loading="lazy"
          />
          {(content.caption as string) && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3">
              {content.caption as string}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

// ───────── Video Block ─────────
function VideoBlock({ content }: { content: BlockContent }) {
  if (!content.url) return null;
  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={getEmbedUrl(content.url as string)}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={(content.caption as string) ?? "Video"}
          />
        </div>
        {(content.caption as string) && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            {content.caption as string}
          </p>
        )}
      </div>
    </section>
  );
}

// ───────── Code Block ─────────
function CodeBlock({ content }: { content: BlockContent }) {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-xl overflow-hidden border bg-muted/50">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b text-xs text-muted-foreground">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="ml-2 uppercase font-mono">
              {(content.language as string) ?? "code"}
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm font-mono">
            <code>{(content.code as string) ?? ""}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

// ───────── CTA Block ─────────
function CtaBlock({ content }: { content: BlockContent }) {
  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: (content.background_color as string) ?? "#6366f1" }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 text-white">
        <h2 className="text-3xl md:text-4xl font-bold font-display">
          {(content.heading as string) ?? "Ready to get started?"}
        </h2>
        {(content.subheading as string) && (
          <p className="text-lg opacity-90 max-w-xl mx-auto">{content.subheading as string}</p>
        )}
        {(content.button_text as string) && (
          <div className="pt-4">
            <Button size="lg" variant="secondary" asChild className="text-base px-8">
              <Link to={(content.button_url as string) ?? "/"}>
                {content.button_text as string}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// ───────── Features Block ─────────
function FeaturesBlock({ content }: { content: BlockContent }) {
  const cols = (content.columns as number) ?? 3;
  const items = (content.items as Record<string, unknown>[]) ?? [];
  const gridClass =
    cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any, i: number) => {
            const Icon = ICON_MAP[item.icon as string] ?? Sparkles;
            return (
              <div
                key={i}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title as string}</h3>
                <p className="text-sm text-muted-foreground">{item.description as string}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ───────── List Block ─────────
function ListBlock({ content }: { content: BlockContent }) {
  const items = (content.items as string[]) ?? [];
  const style = (content.style as string) ?? "bullet";
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        <ul className="space-y-3">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-foreground">
              {style === "checklist" ? (
                <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              ) : style === "numbered" ? (
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ───────── FAQ Block ─────────
function FaqBlock({ content }: { content: BlockContent }) {
  const items = (content.items as Record<string, unknown>[]) ?? [];
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6 space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.map((item: any, i: number) => (
          <details key={i} className="group border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors font-medium">
              <span>{item.question as string}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-4 pb-4 text-muted-foreground text-sm">{item.answer as string}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ───────── Pricing Block ─────────
function PricingBlock({ content }: { content: BlockContent }) {
  const plans = (content.plans as Record<string, unknown>[]) ?? [];
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`grid grid-cols-1 gap-6 ${plans.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : plans.length >= 3 ? "md:grid-cols-3" : "max-w-lg mx-auto"}`}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {plans.map((plan: any, i: number) => (
            <div
              key={i}
              className={`rounded-2xl border p-6 flex flex-col ${plan.featured ? "border-primary shadow-lg ring-2 ring-primary/20" : "bg-card"}`}
            >
              <h3 className="text-lg font-semibold">{plan.name as string}</h3>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-bold">{plan.price as string}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm ml-1">
                    /{plan.period as string}
                  </span>
                )}
              </div>
              {plan.features && (
                <ul className="space-y-2 mb-6 flex-1">
                  {(plan.features as string[]).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {plan.cta_text && (
                <Button className="w-full" variant={plan.featured ? "default" : "outline"} asChild>
                  <Link to={(plan.cta_url as string) ?? "/pricing"}>{plan.cta_text as string}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────── Testimonial Block ─────────
function TestimonialBlock({ content }: { content: BlockContent }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="relative p-8 rounded-2xl bg-card border text-center space-y-4">
          <Quote className="h-8 w-8 text-primary/30 mx-auto" />
          <p className="text-lg md:text-xl italic text-foreground">
            "{(content.quote as string) ?? ""}"
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(content.avatar_url as string) && (
              <img
                src={content.avatar_url as string}
                alt=""
                className="h-10 w-10 rounded-full"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="text-left">
              <div className="font-semibold text-sm">
                {(content.author as string) ?? "Anonymous"}
              </div>
              {(content.role as string) && (
                <div className="text-xs text-muted-foreground">{content.role as string}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────── Spacer Block ─────────
function SpacerBlock({ content }: { content: BlockContent }) {
  return <div style={{ height: (content.height as number) ?? 64 }} />;
}

// ───────── HTML Block ─────────
function HtmlBlock({ content }: { content: BlockContent }) {
  return (
    <section className="py-4">
      <div
        className="max-w-4xl mx-auto px-6"
        dangerouslySetInnerHTML={{ __html: (content.content as string) ?? "" }}
      />
    </section>
  );
}

// ───────── Markdown Block (basic) ─────────
function MarkdownBlock({ content }: { content: BlockContent }) {
  const md = (content.content as string) ?? "";
  // Simple markdown-like rendering (headers, bold, links, lists)
  const html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mt-4">')
    .replace(/^/gm, "");
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
        />
      </div>
    </section>
  );
}
