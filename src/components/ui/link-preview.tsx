"use client";

import React, { useState, useEffect, useRef } from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink, Globe, ShieldCheck, Sparkles, X } from "lucide-react";

export interface LinkPreviewProps {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  isStatic?: boolean;
  imageSrc?: string;
  target?: string;
  rel?: string;
}

type CuratedPreview = {
  title: string;
  description: string;
  category: string;
  badge?: string;
  accent: string;
  image: string;
};

// Curated high-performance instant preview database for top learning & developer domains
const CURATED_PREVIEWS: Record<string, CuratedPreview> = {
  "classcentral.com": {
    title: "Class Central",
    description:
      "The Free-Certificate Directory: Aggregates 10,000+ free online courses, certificates, and badges from top global institutions.",
    category: "Course Directory",
    badge: "Free Certificates",
    accent: "#0056D2",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  },
  "skillshop.withgoogle.com": {
    title: "Google Skillshop",
    description:
      "Free official training and certifications from Google covering AI, Cloud, Google Analytics, Ads, Android, and Firebase.",
    category: "Google Official",
    badge: "Official Certifications",
    accent: "#4285F4",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
  },
  "cloud.google.com": {
    title: "Google Cloud Skills Boost",
    description:
      "Hands-on labs, generative AI training, and cloud architecture certifications with Google Cloud verifiable badges.",
    category: "Cloud & AI",
    badge: "Google Cloud",
    accent: "#4285F4",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  },
  "cs50.harvard.edu": {
    title: "Harvard CS50",
    description:
      "Harvard University's open introduction to the intellectual enterprises of computer science, C, Python, SQL, web development, and AI.",
    category: "Harvard University",
    badge: "Ivy League Open Course",
    accent: "#A51C30",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  },
  "harvard.edu": {
    title: "Harvard University Open Learning",
    description:
      "World-class open educational courses, computer science curriculum, and verified learning from Harvard University.",
    category: "University Education",
    badge: "Harvard Online",
    accent: "#A51C30",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  },
  "freecodecamp.org": {
    title: "freeCodeCamp",
    description:
      "Non-profit full-stack developer community offering 3,000+ hours of hands-on coding curriculum and verified free certifications.",
    category: "Developer Learning",
    badge: "100% Free Certifications",
    accent: "#0A0A23",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  },
  "codesignal.com": {
    title: "CodeSignal Learn",
    description:
      "Practice coding, AI/ML concepts, prompt engineering, and technical interview skills with real-time feedback.",
    category: "Interview Prep & AI",
    badge: "Skill Certification",
    accent: "#1565C0",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
  },
  "github.com": {
    title: "GitHub",
    description:
      "The world's leading developer and open-source platform. Code repositories, collaboration, workflows, and documentation.",
    category: "Open Source Code",
    badge: "Developer Hub",
    accent: "#24292F",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
  },
  "kaggle.com": {
    title: "Kaggle",
    description:
      "The world's largest data science community with free micro-courses, GPU notebooks, and real-world ML competitions.",
    category: "Data Science & ML",
    badge: "Free GPU Notebooks",
    accent: "#20BEFF",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  "huggingface.co": {
    title: "Hugging Face",
    description:
      "The open-source AI platform collaborating on models, datasets, Spaces, and state-of-the-art machine learning.",
    category: "AI & ML Community",
    badge: "Open Models",
    accent: "#FFD21E",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
  },
  "openai.com": {
    title: "OpenAI Academy & Docs",
    description:
      "Official developer resources, ChatGPT API documentation, prompt engineering guides, and AI research.",
    category: "Generative AI",
    badge: "Official AI Research",
    accent: "#10A37F",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
  },
  "learnifyai.in": {
    title: "Learnify AI — AI-Native Career OS",
    description:
      "Interactive AI tutoring, verifiable tamper-proof certificates, 91 career roadmaps, and portfolio builder.",
    category: "Career Platform",
    badge: "Learnify AI Official",
    accent: "#6366F1",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  },
  "learnifyaitool.vercel.app": {
    title: "Learnify AI — Official Mirror",
    description:
      "Interactive AI tutoring, verifiable tamper-proof certificates, 91 career roadmaps, and portfolio builder.",
    category: "Career Platform",
    badge: "Learnify AI Official",
    accent: "#6366F1",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  },
};

function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return urlStr.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
  }
}

function findCurated(domain: string): CuratedPreview | null {
  if (CURATED_PREVIEWS[domain]) return CURATED_PREVIEWS[domain];
  // Subdomain match (e.g. cs50.harvard.edu matches harvard.edu if not found)
  for (const [key, value] of Object.entries(CURATED_PREVIEWS)) {
    if (domain === key || domain.endsWith(`.${key}`)) {
      return value;
    }
  }
  return null;
}

export function LinkPreview({
  children,
  url,
  className,
  width = 280,
  height = 150,
  isStatic = false,
  imageSrc = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: LinkPreviewProps) {
  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const containerRef = useRef<HTMLSpanElement>(null);

  const domain = getDomain(url);
  const curated = findCurated(domain);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(hover: none)").matches;
      setIsTouchDevice(touch);

      setIsDark(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  }, []);

  // Close preview on click outside for touch devices
  useEffect(() => {
    if (!isOpen || !isTouchDevice) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, isTouchDevice]);

  // Image source resolution
  let previewImage = "";
  if (isStatic && imageSrc) {
    previewImage = imageSrc;
  } else if (curated) {
    previewImage = curated.image;
  } else {
    // Dynamic screenshot via microlink with fallback
    const searchParams = new URLSearchParams({
      url,
      screenshot: "true",
      meta: "false",
      embed: "screenshot.url",
      colorScheme: isDark ? "dark" : "light",
      "viewport.isMobile": "true",
      "viewport.deviceScaleFactor": "1",
      "viewport.width": "560",
      "viewport.height": "300",
    });
    previewImage = `https://api.microlink.io/?${searchParams.toString()}`;
  }

  // Smooth mouse follow spring physics on desktop
  const springConfig = { stiffness: 120, damping: 18 };
  const mouseX = useMotionValue(0);
  const translateX = useSpring(mouseX, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetFromCenter = (offsetX - rect.width / 2) / 2;
    mouseX.set(offsetFromCenter);
  };

  // Touch handler for mobile/tablet: first tap opens preview, second tap visits link
  const handleTouchTrigger = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTouchDevice) return;
    if (!isOpen) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
    // If already open, let the click propagate to open the link
  };

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const renderCardContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 320, damping: 24 },
      }}
      exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.15 } }}
      style={{ x: isTouchDevice ? 0 : translateX }}
      className="shadow-2xl rounded-2xl p-2.5 bg-popover/95 backdrop-blur-xl border border-border/80 text-popover-foreground pointer-events-auto w-[280px] sm:w-[320px] max-w-[calc(100vw-32px)]"
    >
      {/* Mobile close button */}
      {isTouchDevice && (
        <div className="flex items-center justify-between pb-2 mb-1 px-1 border-b border-border/40">
          <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Link Preview
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
            aria-label="Close preview"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <a
        href={url}
        target={target}
        rel={rel}
        className="block rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40 group"
      >
        {/* Visual Banner */}
        <div
          className="relative overflow-hidden rounded-xl bg-muted/60 flex items-center justify-center border border-border/40"
          style={{ height: `${height}px` }}
        >
          {/* Skeleton placeholder while loading non-curated */}
          {!curated && !imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-muted/80 animate-pulse flex flex-col items-center justify-center gap-2 p-3 text-center">
              <Globe className="h-6 w-6 text-muted-foreground/60 animate-spin" />
              <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">
                Previewing {domain}...
              </span>
            </div>
          )}

          {/* Screenshot or Curated Image */}
          {!imgError ? (
            <img
              src={previewImage}
              alt={`${domain} preview`}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                !curated && !imgLoaded ? "opacity-0" : "opacity-100",
              )}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback branded card if screenshot fails */
            <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-card via-muted/40 to-background">
              <div className="flex items-center gap-2">
                <img
                  src={faviconUrl}
                  alt=""
                  className="h-6 w-6 rounded-md object-contain shrink-0 bg-background p-0.5 border border-border/50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-bold text-foreground truncate">{domain}</span>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Verified external resource on {domain}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-primary font-semibold">
                  <span>Visit website</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </div>
              </div>
            </div>
          )}

          {/* Category Tag pill */}
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-sm">
              <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
              {curated?.category || "Verified Resource"}
            </span>
          </div>
        </div>

        {/* Content footer */}
        <div className="mt-2.5 px-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <img
                src={faviconUrl}
                alt=""
                className="h-4 w-4 rounded-sm object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-display font-semibold text-xs text-foreground truncate">
                {curated?.title || domain}
              </span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>

          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
            {curated?.description || `Explore learning materials and official tools hosted on ${domain}.`}
          </p>

          {/* Action button on mobile */}
          {isTouchDevice && (
            <div className="pt-2">
              <span className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md active:scale-95 transition">
                <span>Visit {domain}</span>
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          )}
        </div>
      </a>
    </motion.div>
  );

  return (
    <span ref={containerRef} className="relative inline-block">
      {/* Desktop implementation via Radix HoverCard */}
      {!isTouchDevice ? (
        <HoverCardPrimitive.Root
          openDelay={75}
          closeDelay={120}
          open={isOpen}
          onOpenChange={setOpen}
        >
          <HoverCardPrimitive.Trigger
            onMouseMove={handleMouseMove}
            className={cn(
              "inline-flex items-center gap-1 text-primary hover:underline font-medium cursor-pointer transition-colors",
              className,
            )}
            href={url}
            target={target}
            rel={rel}
          >
            {children}
            <ExternalLink className="h-3 w-3 inline ml-0.5 opacity-70 shrink-0" aria-hidden="true" />
          </HoverCardPrimitive.Trigger>

          <HoverCardPrimitive.Portal>
            <HoverCardPrimitive.Content
              className="z-50 pointer-events-none [transform-origin:var(--radix-hover-card-content-transform-origin)]"
              side="top"
              align="center"
              sideOffset={10}
            >
              <AnimatePresence>{isOpen && renderCardContent()}</AnimatePresence>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        </HoverCardPrimitive.Root>
      ) : (
        /* Mobile / Touchscreen implementation with touch peek */
        <>
          <a
            href={url}
            onClick={handleTouchTrigger}
            className={cn(
              "inline-flex items-center gap-1 text-primary underline font-medium cursor-pointer transition-colors active:opacity-70",
              className,
            )}
            target={target}
            rel={rel}
          >
            {children}
            <ExternalLink className="h-3 w-3 inline ml-0.5 opacity-70 shrink-0" aria-hidden="true" />
          </a>

          {/* Mobile floating popover */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop overlay for dismissing */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                />

                {/* Popover Card docked above or centered */}
                <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    {renderCardContent()}
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </span>
  );
}

export default LinkPreview;
