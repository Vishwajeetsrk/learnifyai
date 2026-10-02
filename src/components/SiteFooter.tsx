import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Twitter, Github, MessageSquare, Linkedin, Youtube, Instagram, ChevronDown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePublicMenu } from "@/hooks/use-wcms-public";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  url: string;
  open_new_tab?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const APPROVED_SECTIONS: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Courses & Masteries", url: "/courses" },
      { label: "Verified Certificates", url: "/verified-certificates" },
      { label: "Features", url: "/features" },
      { label: "Creators", url: "/creators" },
      { label: "Coaches & Mentors", url: "/coaches" },
      { label: "Pricing & Plans", url: "/pricing" },
      { label: "Platform Roadmap", url: "/roadmap" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "AI Engineer Roadmap", url: "/blog/full-stack-ai-engineer-roadmap-2026" },
      { label: "Free Courses", url: "/courses?filter=free" },
      { label: "Learning Resources", url: "/docs" },
      { label: "Blog", url: "/blog" },
      { label: "Guides", url: "/blog/ultimate-guide-free-courses-certificates-2026" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community Hub", url: "/community" },
      { label: "Events & AMAs", url: "/events" },
      { label: "Student Verification", url: "/verify-student" },
      { label: "Project Showcase", url: "/showcase" },
      { label: "Support", url: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", url: "/about" },
      { label: "Careers", url: "/careers" },
      { label: "Contact", url: "/contact" },
      { label: "FAQ", url: "/faq" },
      { label: "Legal Center", url: "/legal" },
    ],
  },
];

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  const { data: footerItems = [] } = usePublicMenu("footer");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const hasWcmsFooter = footerItems.length > 0;
  const wcmsSections: FooterSection[] = hasWcmsFooter
    ? footerItems
        .filter((i: any) => !i.parent_id)
        .map((section: any) => ({
          title: section.label,
          links: footerItems.filter((i: any) => i.parent_id === section.id),
        }))
    : [];

  const rawSections: FooterSection[] = hasWcmsFooter && wcmsSections.length > 0
    ? wcmsSections
    : APPROVED_SECTIONS;

  const sections: FooterSection[] = useMemo(() => {
    return rawSections.map((sec) => ({
      ...sec,
      links: (sec.links || []).filter((link) => {
        if (link.url === "/support-us" && s?.support_us_enabled === "false") return false;
        if (link.url === "/legal" && s?.legal_center_enabled === "false") return false;
        return true;
      }),
    }));
  }, [rawSections, s]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 mt-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 items-start">
          {/* Brand & Mission column */}
          <div className="space-y-4 md:col-span-4 lg:col-span-4">
            <Link to="/" className="inline-flex items-center" aria-label="Learnify AI">
              <Logo height="h-9" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Learn smarter. Grow faster. The intelligent learning OS for developers, AI engineers, and modern creators.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {s?.github_url && s.github_url !== "#" && s.github_url.trim() !== "" && (
                <a
                  href={s.github_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {s?.discord_url && s.discord_url !== "#" && s.discord_url.trim() !== "" && (
                <a
                  href={s.discord_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
                >
                  <MessageSquare className="h-4 w-4" />
                </a>
              )}
              {s?.linkedin_url && s.linkedin_url !== "#" && s.linkedin_url.trim() !== "" && (
                <a
                  href={s.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {s?.twitter_url && s.twitter_url !== "#" && s.twitter_url.trim() !== "" && (
                <a
                  href={s.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {s?.youtube_url && s.youtube_url !== "#" && s.youtube_url.trim() !== "" && (
                <a
                  href={s.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {s?.instagram_url && s.instagram_url !== "#" && s.instagram_url.trim() !== "" && (
                <a
                  href={s.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Desktop Navigation Columns (4 Columns) */}
          <div className="hidden md:grid md:grid-cols-4 gap-8 md:col-span-8 lg:col-span-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="font-display font-semibold text-sm tracking-tight text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.open_new_tab ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.url || "/"}
                          className="hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Accordion Groups (Compact & Premium) */}
          <div className="block md:hidden col-span-1 divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            {sections.map((section) => {
              const isOpen = Boolean(openSections[section.title]);
              return (
                <div key={section.title} className="p-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-foreground py-1"
                    aria-expanded={isOpen}
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <ul className="mt-2.5 pl-1 space-y-2 text-xs text-muted-foreground border-t border-border/40 pt-2 animate-in fade-in duration-200">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          {link.open_new_tab ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-foreground transition-colors block py-0.5"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              to={link.url || "/"}
                              className="hover:text-foreground transition-colors block py-0.5"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Bottom Bar with Legal Links & Dynamic Copyright */}
        <div className="border-t border-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {currentYear} Learnify AI &middot; Learn Smarter. Grow Faster. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>&middot;</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link to="/refund-policy" className="hover:text-foreground transition-colors">
              Refund Policy
            </Link>
            <span>&middot;</span>
            <Link
              to="/legal"
              search={{ doc: "digital-delivery" }}
              className="hover:text-foreground transition-colors"
            >
              Shipping &amp; Delivery Policy
            </Link>
            <span>&middot;</span>
            <Link to="/legal" className="hover:text-foreground transition-colors">
              Legal Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
