import { Link } from "@tanstack/react-router";
import { Twitter, Github, MessageSquare, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePublicMenu } from "@/hooks/use-wcms-public";

const HARDCODED_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Features", url: "/features" },
      { label: "AI Tools", url: "/ai-tools" },
      { label: "Pricing", url: "/pricing" },
      { label: "Roadmap", url: "/roadmap" },
      { label: "Blog", url: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Community", url: "/community" },
      { label: "Events", url: "/events" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", url: "/about" },
      { label: "Careers", url: "/careers" },
      { label: "Contact", url: "/contact" },
      { label: "FAQ", url: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Terms of Service", url: "/terms" },
      { label: "Refund Policy", url: "/refund-policy" },
    ],
  },
];

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  const { data: footerItems = [] } = usePublicMenu("footer");

  const hasWcmsFooter = footerItems.length > 0;
  const sections = hasWcmsFooter
    ? footerItems
        .filter((i: any) => !i.parent_id)
        .map((section: any) => ({
          title: section.label,
          links: footerItems.filter((i: any) => i.parent_id === section.id),
        }))
    : HARDCODED_SECTIONS;

  return (
    <footer className="border-t border-border/60 mt-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-6">
        <div className="space-y-4 md:col-span-2">
          <Link to="/" className="inline-flex items-center" aria-label="Learnify AI">
            <Logo height="h-10" />
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Learn smarter. Grow faster. The intelligent learning OS.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {s?.github_url && s.github_url !== "#" && (
              <a
                href={s.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {s?.discord_url && (
              <a
                href={s.discord_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            )}
            {s?.linkedin_url && s.linkedin_url !== "#" && (
              <a
                href={s.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {s?.twitter_url && (
              <a
                href={s.twitter_url}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {s?.youtube_url && s.youtube_url !== "#" && (
              <a
                href={s.youtube_url}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {sections.map((section: any) => (
          <div key={section.title}>
            <h4 className="font-display font-semibold text-sm mb-4">{section.title}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {section.links.map((link: any) => (
                <li key={link.id || link.label}>
                  {link.open_new_tab ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-foreground transition"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.url || "/"} className="hover:text-foreground transition">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Learnify AI &middot; Learn Smarter. Grow Faster.
      </div>
    </footer>
  );
}
