import { Link } from "@tanstack/react-router";
import { Twitter, Github, MessageSquare, Linkedin, Youtube, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePublicMenu } from "@/hooks/use-wcms-public";

const HARDCODED_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Courses & Masteries", url: "/courses" },
      { label: "Verified Certificates", url: "/verified-certificates" },
      { label: "Features", url: "/features" },
      { label: "Creators Program", url: "/creators" },
      { label: "Coaches & Mentors", url: "/coaches" },
      { label: "Pricing & Plans", url: "/pricing" },
      { label: "Platform Roadmap", url: "/roadmap" },
    ],
  },
  {
    title: "Editorial & Guides",
    links: [
      { label: "AI Engineer Roadmap 2026", url: "/blog/full-stack-ai-engineer-roadmap-2026" },
      { label: "Free Courses & Certificates", url: "/blog/ultimate-guide-free-courses-certificates-2026" },
      { label: "Cashfree vs Razorpay SaaS", url: "/blog/cashfree-vs-razorpay-india-saas" },
      { label: "Autonomous AI Agents", url: "/blog/autonomous-ai-agents-langgraph-python" },
      { label: "All Blog Posts", url: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Community Hub", url: "/community" },
      { label: "Live Events & AMAs", url: "/events" },
      { label: "Student Verification", url: "/verify-student" },
      { label: "Platform Documentation", url: "/docs" },
      { label: "Project Showcase", url: "/showcase" },
    ],
  },
  {
    title: "Company & Legal",
    links: [
      { label: "Legal Center", url: "/legal" },
      { label: "About Us", url: "/about" },
      { label: "Careers", url: "/careers" },
      { label: "Support Us / Sponsor", url: "/support-us" },
      { label: "Contact Support", url: "/contact" },
      { label: "FAQ", url: "/faq" },
      { label: "Terms of Service", url: "/terms" },
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Cancellation & Refund", url: "/refund-policy" },
    ],
  },
];

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  const { data: footerItems = [] } = usePublicMenu("footer");

  const hasWcmsFooter = footerItems.length > 0;
  const wcmsSections = hasWcmsFooter
    ? footerItems
        .filter((i: any) => !i.parent_id)
        .map((section: any) => ({
          title: section.label,
          links: footerItems.filter((i: any) => i.parent_id === section.id),
        }))
    : [];

  const hasEditorialSection = wcmsSections.some(
    (sec: any) =>
      sec.title?.toLowerCase().includes("editorial") ||
      sec.title?.toLowerCase().includes("guide") ||
      sec.title?.toLowerCase().includes("blog"),
  );

  const sections = hasWcmsFooter
    ? hasEditorialSection
      ? wcmsSections
      : [...wcmsSections, HARDCODED_SECTIONS[1]] // Always include Editorial & Guides for SEO internal inlinks
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
            {s?.github_url && s.github_url !== "#" && s.github_url.trim() !== "" && (
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
            {s?.discord_url && s.discord_url !== "#" && s.discord_url.trim() !== "" && (
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
            {s?.linkedin_url && s.linkedin_url !== "#" && s.linkedin_url.trim() !== "" && (
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
            {s?.twitter_url && s.twitter_url !== "#" && s.twitter_url.trim() !== "" && (
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
            {s?.youtube_url && s.youtube_url !== "#" && s.youtube_url.trim() !== "" && (
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
            {s?.instagram_url && s.instagram_url !== "#" && s.instagram_url.trim() !== "" && (
              <a
                href={s.instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:col-span-4">
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
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Learnify AI &middot; Learn Smarter. Grow Faster.
      </div>
    </footer>
  );
}
