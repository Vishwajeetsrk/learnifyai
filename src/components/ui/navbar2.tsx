"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Languages, Menu, X } from "lucide-react";
import {
  FaXTwitter, // X
  FaInstagram, // Instagram
  FaLinkedin, // LinkedIn
  FaYoutube, // YouTube
  FaThreads, // Threads
  FaWhatsapp, // WhatsApp
} from "react-icons/fa6";

// Universal Next.js-compatible Link wrapper backed by TanStack Router
function Link({
  href,
  children,
  className,
  onClick,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={href.startsWith("#") ? undefined : "_blank"}
        rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={href as any}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </RouterLink>
  );
}

export type MegaColumn = {
  eyebrow: string;
  links: { label: string; href: string; active?: boolean; badge?: string }[];
};

export type MegaMenu = {
  columns: MegaColumn[];
  footerLinks?: { label: string; href: string }[];
  showSocials?: boolean;
  image: { src: string; alt: string };
  imageCaption?: string;
};

export const SOLUTIONS_MENU: MegaMenu = {
  columns: [
    {
      eyebrow: "Our Solutions",
      links: [
        { label: "For employees", href: "/solutions/salaries", active: true },
        { label: "For businesses", href: "/solutions/entreprises" },
      ],
    },
    {
      eyebrow: "Join us",
      links: [{ label: "Become a partner", href: "/partenaire" }],
    },
  ],
  footerLinks: [
    { label: "Legal notice", href: "/mentions-legales" },
    { label: "Privacy policy", href: "/confidentialite" },
    { label: "Terms of use", href: "/cgu" },
  ],
  showSocials: true,
  image: {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    alt: "Solution preview",
  },
  imageCaption: "See how teams use Bag\\Ui",
};

export const PRICING_MENU: MegaMenu = {
  columns: [
    {
      eyebrow: "Plans",
      links: [
        { label: "Starter", href: "/pricing/starter" },
        { label: "Pro", href: "/pricing/pro", active: true, badge: "Popular" },
        { label: "Enterprise", href: "/pricing/enterprise" },
      ],
    },
    {
      eyebrow: "Details",
      links: [
        { label: "Compare all plans", href: "/pricing/compare" },
        { label: "Billing FAQ", href: "/pricing/faq" },
        { label: "Talk to sales", href: "/contact" },
      ],
    },
  ],
  footerLinks: [
    { label: "Student & non-profit discounts", href: "/pricing/discounts" },
  ],
  image: {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    alt: "Pricing preview",
  },
  imageCaption: "Plans that grow with your team",
};

export const RESOURCES_MENU: MegaMenu = {
  columns: [
    {
      eyebrow: "Learn",
      links: [
        { label: "Blog", href: "/resources/blog" },
        { label: "Guides", href: "/resources/guides" },
        { label: "Webinars", href: "/resources/webinars", badge: "New" },
      ],
    },
    {
      eyebrow: "Support",
      links: [
        { label: "Help center", href: "/resources/help" },
        { label: "API documentation", href: "/resources/docs" },
        { label: "Community", href: "/resources/community" },
      ],
    },
  ],
  footerLinks: [{ label: "Changelog", href: "/resources/changelog" }],
  image: {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    alt: "Resources preview",
  },
  imageCaption: "Everything you need to get started",
};

export const MEGA_MENUS: Record<string, MegaMenu> = {
  Solutions: SOLUTIONS_MENU,
  Pricing: PRICING_MENU,
  Resources: RESOURCES_MENU,
};

export const NAV_ITEMS = [
  { label: "Solutions", hasMenu: true },
  { label: "Pricing", hasMenu: true },
  { label: "Resources", hasMenu: true },
  { label: "Contact", hasMenu: false, href: "/contact" },
] as const;

export const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "FR", label: "Français" },
  { code: "ES", label: "Español" },
  { code: "DE", label: "Deutsch" },
] as const;

export const SOCIALS = [
  { href: "#", label: "X", icon: FaXTwitter },
  { href: "#", label: "Instagram", icon: FaInstagram },
  { href: "#", label: "LinkedIn", icon: FaLinkedin },
  { href: "#", label: "YouTube", icon: FaYoutube },
  { href: "#", label: "Threads", icon: FaThreads },
  { href: "#", label: "WhatsApp", icon: FaWhatsapp },
];

export interface Navbar2Props {
  brandName?: string;
  brandHref?: string;
  customMenus?: Record<string, MegaMenu>;
  customNavItems?: Array<{ label: string; hasMenu: boolean; href?: string }>;
  signInHref?: string;
  signInLabel?: string;
  demoHref?: string;
  demoLabel?: string;
  className?: string;
}

export default function Navbar2({
  brandName = "Bag\\Ui",
  brandHref = "/",
  customMenus,
  customNavItems,
  signInHref = "/connexion",
  signInLabel = "Sign in",
  demoHref = "/demo",
  demoLabel = "Request a demo",
  className = "",
}: Navbar2Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>(
    LANGUAGES[0],
  );
  const langRef = useRef<HTMLDivElement>(null);

  const activeMenus = customMenus || MEGA_MENUS;
  const navItems = customNavItems || NAV_ITEMS;

  const toggleMenu = (label: string, hasMenu: boolean) => {
    if (!hasMenu) {
      setOpenMenu(null);
      return;
    }
    setLangOpen(false);
    setOpenMenu((current) => (current === label ? null : label));
  };

  // Close the language dropdown on outside click.
  useEffect(() => {
    if (!langOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langOpen]);

  const activeMenu = openMenu ? activeMenus[openMenu] : null;

  return (
    <header className={`relative flex justify-center px-4 py-4 ${className}`}>
      <div className="w-full max-w-7xl">
        <motion.div
          layout
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.10)] dark:border-zinc-800/80 dark:bg-zinc-950/95 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_12px_32px_-8px_rgba(0,0,0,0.5)]"
        >
          {/* Top row */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
            {/* Logo */}
            <Link href={brandHref} className="flex shrink-0 items-center gap-2">
              <span className="text-[1.35rem] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {brandName}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isOpen = openMenu === item.label;
                if (!item.hasMenu) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href ?? "#"}
                      onClick={() => toggleMenu(item.label, false)}
                      className="rounded-full px-4 py-2 text-[15px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleMenu(item.label, item.hasMenu)}
                    aria-expanded={isOpen}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                      isOpen
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              {/* Language switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setLangOpen((v) => !v);
                  }}
                  aria-expanded={langOpen}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    langOpen
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                  }`}
                >
                  <Languages className="h-4 w-4" />
                  {language.code}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      langOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.15)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]"
                    >
                      {LANGUAGES.map((lng) => (
                        <button
                          key={lng.code}
                          onClick={() => {
                            setLanguage(lng);
                            setLangOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                        >
                          <span>
                            {lng.label}{" "}
                            <span className="text-zinc-400 dark:text-zinc-500">({lng.code})</span>
                          </span>
                          {lng.code === language.code && (
                            <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href={signInHref}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {signInLabel}
              </Link>

              <Link
                href={demoHref}
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {demoLabel}
              </Link>
            </div>

            {/* Mobile trigger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center rounded-full p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop mega dropdown — shared across Solutions / Pricing / Resources */}
          <AnimatePresence initial={false}>
            {activeMenu && (
              <motion.div
                key={openMenu}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="hidden overflow-hidden lg:block border-t border-zinc-100 dark:border-zinc-800/60"
              >
                <div className="grid grid-cols-[1fr_1fr_auto] gap-10 px-8 pb-8 pt-4">
                  {activeMenu.columns.map((col, colIdx) => (
                    <div key={col.eyebrow} className="flex flex-col gap-6">
                      <span className="w-fit rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                        {col.eyebrow}
                      </span>
                      <ul className="flex flex-col gap-4">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className={`group flex items-center gap-2 text-xl font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300 ${
                                link.active
                                  ? "underline underline-offset-4 text-primary dark:text-primary"
                                  : ""
                              }`}
                            >
                              {link.label}
                              {link.badge && (
                                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white group-hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Footer links sit under the last column */}
                      {colIdx === activeMenu.columns.length - 1 &&
                        activeMenu.footerLinks && (
                          <div className="mt-auto flex flex-col gap-2 pt-12">
                            {activeMenu.footerLinks.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}

                  {/* Preview image */}
                  <div className="relative hidden h-64 w-72 flex-col justify-end overflow-hidden rounded-2xl md:flex shadow-md border border-zinc-200/50 dark:border-zinc-800">
                    <img
                      src={activeMenu.image.src}
                      alt={activeMenu.image.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    {activeMenu.imageCaption && (
                      <div className="relative z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10">
                        <p className="text-sm font-medium text-white drop-shadow-sm">
                          {activeMenu.imageCaption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Socials — only shown when the menu opts in */}
                {activeMenu.showSocials && (
                  <div className="flex items-center gap-4 px-8 pb-8 pt-2 border-t border-zinc-100/70 dark:border-zinc-800/40">
                    {SOCIALS.map(({ href, label, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile panel */}
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                key="mobile-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden lg:hidden border-t border-zinc-100 dark:border-zinc-800"
              >
                <div className="flex flex-col gap-1 px-6 pb-6 pt-3">
                  {navItems.map((item) =>
                    item.hasMenu ? (
                      <button
                        key={item.label}
                        onClick={() => toggleMenu(item.label, true)}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openMenu === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href ?? "#"}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}

                  {activeMenu && (
                    <div className="ml-3 flex flex-col gap-3 border-l border-zinc-200 pl-4 pt-2 dark:border-zinc-800">
                      {activeMenu.columns.flatMap((c) =>
                        c.links.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                          >
                            {link.label}
                            {link.badge && (
                              <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white dark:bg-zinc-100 dark:text-zinc-900">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        )),
                      )}
                    </div>
                  )}

                  {/* Mobile language switcher */}
                  <div className="mt-2 flex flex-col gap-1 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <span className="px-3 text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      Language
                    </span>
                    <div className="flex flex-wrap gap-2 px-3 pt-1">
                      {LANGUAGES.map((lng) => (
                        <button
                          key={lng.code}
                          onClick={() => setLanguage(lng)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            lng.code === language.code
                              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                              : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {lng.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <Link
                      href={signInHref}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-5 py-2.5 text-center text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {signInLabel}
                    </Link>
                    <Link
                      href={demoHref}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full bg-zinc-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      {demoLabel}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
