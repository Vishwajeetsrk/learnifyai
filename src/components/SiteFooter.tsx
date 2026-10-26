import { useMemo } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePublicMenu } from "@/hooks/use-wcms-public";
import {
  DoodleCrewFooter,
  FooterColumn,
  FooterLink,
  FooterAction,
  CrewMember,
} from "@/components/ui/doodle-crew-footer";

interface WcmsFooterLink {
  label: string;
  url: string;
  open_new_tab?: boolean;
}

interface WcmsFooterSection {
  title: string;
  links: WcmsFooterLink[];
}

const APPROVED_SECTIONS: WcmsFooterSection[] = [
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

const LEARNIFY_CREW: CrewMember[] = [
  { kind: "yeti", letter: 0, seat: "front", offset: -0.32, name: "Bruno", says: "Hungry for knowledge? Build something great!" },
  { kind: "bird", letter: 1, seat: "top", offset: 0.02, name: "Pip", says: "Tweet us! Launch Studio v4.2." },
  { kind: "mushroom", letter: 2, seat: "front", offset: 0.12, scale: 0.95, name: "Morel", says: "AI Engineers belong here." },
  { kind: "kid", letter: 4, seat: "top", offset: -0.05, name: "Juno", says: "Best seat in the house. Welcome to Learnify AI!" },
  { kind: "ghost", letter: 6, seat: "behind", offset: 0, name: "Boo", says: "Zero bugs in production!" },
  { kind: "cat", letter: 7, seat: "front", offset: 0.42, flip: true, name: "Patch", says: "Purrfect prompts make perfect models." },
];

const ACTIONS: FooterAction[] = [
  { label: "Launch Studio IDE v4.2", href: "/studio", icon: "bolt", variant: "solid" },
  { label: "What's New", href: "/updates", icon: "sparkle", variant: "outline" },
];

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  const { data: footerItems = [] } = usePublicMenu("footer");

  const hasWcmsFooter = footerItems.length > 0;
  const wcmsSections: WcmsFooterSection[] = hasWcmsFooter
    ? footerItems
        .filter((i: any) => !i.parent_id)
        .map((section: any) => ({
          title: section.label,
          links: footerItems.filter((i: any) => i.parent_id === section.id),
        }))
    : [];

  const rawSections: WcmsFooterSection[] =
    hasWcmsFooter && wcmsSections.length > 0 ? wcmsSections : APPROVED_SECTIONS;

  const columns: FooterColumn[] = useMemo(() => {
    const isSupportVisible = s?.support_us_enabled === "true";
    return rawSections.map((sec) => ({
      title: sec.title,
      links: (sec.links || [])
        .filter((link) => {
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
        })
        .map((link) => ({
          label: link.label,
          href: link.url,
          openNewTab: link.open_new_tab,
        })),
    }));
  }, [rawSections, s]);

  const socials: FooterLink[] = useMemo(() => {
    const list: FooterLink[] = [];
    if (s?.github_url && s.github_url !== "#" && s.github_url.trim() !== "") {
      list.push({ label: "GitHub", href: s.github_url, openNewTab: true });
    }
    if (s?.discord_url && s.discord_url !== "#" && s.discord_url.trim() !== "") {
      list.push({ label: "Discord", href: s.discord_url, openNewTab: true });
    }
    if (s?.linkedin_url && s.linkedin_url !== "#" && s.linkedin_url.trim() !== "") {
      list.push({ label: "LinkedIn", href: s.linkedin_url, openNewTab: true });
    }
    if (s?.twitter_url && s.twitter_url !== "#" && s.twitter_url.trim() !== "") {
      list.push({ label: "X (Twitter)", href: s.twitter_url, openNewTab: true });
    }
    if (s?.youtube_url && s.youtube_url !== "#" && s.youtube_url.trim() !== "") {
      list.push({ label: "YouTube", href: s.youtube_url, openNewTab: true });
    }
    if (s?.instagram_url && s.instagram_url !== "#" && s.instagram_url.trim() !== "") {
      list.push({ label: "Instagram", href: s.instagram_url, openNewTab: true });
    }

    if (list.length === 0) {
      list.push(
        { label: "GitHub", href: "https://github.com/Vishwajeetsrk/learnifyai", openNewTab: true },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/vishwajeetsrk", openNewTab: true },
        { label: "Discord", href: "https://discord.gg/learnify", openNewTab: true }
      );
    }
    return list;
  }, [s]);

  const legal: FooterLink[] = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Shipping & Delivery", href: "/legal" },
    { label: "Legal Center", href: "/legal" },
  ];

  const currentYear = new Date().getFullYear();

  const extraBrandContent = (
    <div className="pt-2 flex flex-col gap-3">
      <div className="flex items-center gap-2.5 text-xs text-slate-400">
        <span>Built with 💙 by</span>
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
    </div>
  );

  return (
    <div className="relative mt-20 border-t border-white/10 bg-[#05060a]">
      {/* ─── Ambient Glow Gradients ─── */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <DoodleCrewFooter
        wordmark="LEARNIFY"
        brand="Learnify AI"
        logoUrl="/assets/learnify-logo.png"
        blurb="Learn smarter. Grow faster. The AI-native learning & career operating system for developers, AI engineers, and modern creators."
        extraBrandContent={extraBrandContent}
        tagline="Hand-drawn intelligence for the builders and learners of tomorrow."
        columns={columns}
        actions={ACTIONS}
        copyright={`© ${currentYear} Learnify AI Inc. All rights reserved.`}
        legal={legal}
        socials={socials}
        crew={LEARNIFY_CREW}
        preset="night"
        palette={{
          background: "#05060a",
          ink: "#f8fafc",
          accent: "#38bdf8",
        }}
        interactive={true}
        backToTop={true}
      />
    </div>
  );
}

export default SiteFooter;
