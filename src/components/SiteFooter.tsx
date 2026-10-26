import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Twitter,
  Github,
  MessageSquare,
  Linkedin,
  Youtube,
  Instagram,
  ChevronDown,
  Zap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
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
      { label: "What's New (Updates)", url: "/updates" },
      { label: "Learnify Studio (Watch & Code)", url: "/studio" },
      { label: "AI Explainer Engine", url: "/ai-tools" },
      { label: "Courses & Masteries", url: "/courses" },
      { label: "Verified Certificates", url: "/verified-certificates" },
      { label: "Pricing & Plans", url: "/pricing" },
      { label: "Platform Roadmap", url: "/roadmap" },
    ],
  },
  {
    title: "Learn & Grow",
    links: [
      { label: "AI Engineer Roadmap", url: "/blog/full-stack-ai-engineer-roadmap-2026" },
      { label: "Free Foundation Courses", url: "/courses?filter=free" },
      { label: "Interactive Code Playground", url: "/playground" },
      { label: "Developer Documentation", url: "/docs" },
      { label: "Engineering Blog", url: "/blog" },
      { label: "System Design Guide", url: "/system-design" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Community Hub & AMAs", url: "/community" },
      { label: "Verified Coaches & Mentors", url: "/coaches" },
      { label: "Course Creators Program", url: "/creators" },
      { label: "Student Verification", url: "/verify-student" },
      { label: "Digital Store & XP Market", url: "/store" },
      { label: "Showcase & Projects", url: "/showcase" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Learnify AI", url: "/about" },
      { label: "Careers & Internships", url: "/careers" },
      { label: "Support & Help Center", url: "/contact" },
      { label: "Frequently Asked Questions", url: "/faq" },
      { label: "Legal Center & Policies", url: "/legal" },
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

  const rawSections: FooterSection[] =
    hasWcmsFooter && wcmsSections.length > 0 ? wcmsSections : APPROVED_SECTIONS;

  const sections: FooterSection[] = useMemo(() => {
    const isSupportVisible = s?.support_us_enabled === "true";
    return rawSections.map((sec) => ({
      ...sec,
      links: (sec.links || []).filter((link) => {
        const url = (link.url || "").toLowerCase().trim();
        const label = (link.label || "").toLowerCase().trim();

        if (
          !isSupportVisible &&
          (url === "/support-us" ||
            url === "/sponsor" ||
            url.includes("support-us") ||
            label.includes("support us") ||
            label === "sponsor" ||
            label.includes("sponsor"))
        ) {
          return false;
        }

        if (link.url === "/legal" && s?.legal_center_enabled === "false") return false;
        return true;
      }),
    }));
  }, [rawSections, s]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#05060a] text-slate-100 overflow-hidden">
      {/* ─── Ambient Glow Gradients ─── */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Main Footer Content ─── */}
      <div className="container relative z-10 mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 items-start">
          {/* Brand & Creator Identity (Left Column - Matches Reference Video) */}
          <div className="space-y-6 md:col-span-4 lg:col-span-4">
            <Link to="/" className="inline-flex items-center" aria-label="Learnify AI">
              <Logo height="h-9" textClassName="text-white font-bold" />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Learn smarter. Grow faster. The AI-native learning &amp; career operating system for developers, AI engineers, and modern creators.
            </p>

            {/* CTA Button matching video */}
            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs transition shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                <span>Launch Studio IDE</span>
                <span className="text-[10px] font-mono font-bold bg-slate-950/10 px-1.5 py-0.5 rounded">v4.2</span>
              </Link>
              <Link
                to="/updates"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:border-sky-500/40 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition"
              >
                <Sparkles className="h-3 w-3 text-sky-400" />
                <span>What's New</span>
              </Link>
            </div>

            {/* Creator Attribution */}
            <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-400">
              <span className="text-slate-400">Built with 💙 by</span>
              <a
                href="https://www.linkedin.com/in/vishwajeetsrk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-200 shadow-md hover:border-sky-500/60 hover:bg-slate-800 hover:scale-105 transition-all group"
                title="Connect with Vishwajeet on LinkedIn"
              >
                <img
                  src="/assets/vishwajeet-profile.png"
                  alt="Vishwajeet"
                  className="w-5 h-5 rounded-full object-cover object-top ring-1 ring-sky-400/50 group-hover:ring-sky-400 transition"
                />
                <span className="font-semibold text-xs text-white group-hover:text-sky-300 transition-colors">Vishwajeet</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {s?.github_url && s.github_url !== "#" && s.github_url.trim() !== "" && (
                <a
                  href={s.github_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:border-sky-500/50 hover:text-white transition"
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
                  className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:border-sky-500/50 hover:text-white transition"
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
                  className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:border-sky-500/50 hover:text-white transition"
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
                  className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:border-sky-500/50 hover:text-white transition"
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
                  className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:border-sky-500/50 hover:text-white transition"
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
                  className="h-8 w-8 rounded-full border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:border-sky-500/50 hover:text-white transition"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Desktop Navigation Columns (4 Columns) */}
          <div className="hidden md:grid md:grid-cols-4 gap-8 md:col-span-8 lg:col-span-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-3.5">
                <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-200">
                  {section.title}
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.open_new_tab ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white hover:translate-x-0.5 inline-block transition-all"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.url || "/"}
                          className="hover:text-white hover:translate-x-0.5 inline-block transition-all"
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

          {/* Mobile Accordion Groups */}
          <div className="block md:hidden col-span-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden">
            {sections.map((section) => {
              const isOpen = Boolean(openSections[section.title]);
              return (
                <div key={section.title} className="p-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-200 py-1"
                    aria-expanded={isOpen}
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <ul className="mt-2.5 pl-1 space-y-2 text-xs text-slate-400 border-t border-white/5 pt-2 animate-in fade-in duration-200">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          {link.open_new_tab ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-white transition-colors block py-0.5"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              to={link.url || "/"}
                              className="hover:text-white transition-colors block py-0.5"
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

        {/* Footer Bottom Bar with Legal Links & Official Logo */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity" aria-label="Learnify AI">
              <Logo height="h-6" textClassName="text-slate-200 font-bold text-sm" />
            </Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <p className="font-mono text-[11px] text-slate-400">
              &copy; {currentYear} Learnify AI Inc. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>&middot;</span>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
            <span>&middot;</span>
            <Link
              to="/legal"
              search={{ doc: "digital-delivery" }}
              className="hover:text-white transition-colors"
            >
              Shipping &amp; Delivery
            </Link>
            <span>&middot;</span>
            <Link to="/legal" className="hover:text-white transition-colors">
              Legal Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
