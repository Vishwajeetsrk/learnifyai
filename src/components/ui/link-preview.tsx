"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { encode } from "qss";
import React, { useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink, Globe } from "lucide-react";

export interface LinkPreviewProps {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
  isStatic?: boolean;
  imageSrc?: string;
  target?: string;
  rel?: string;
}

export function LinkPreview({
  children,
  url,
  className,
  width = 200,
  height = 125,
  isStatic = false,
  imageSrc = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: LinkPreviewProps) {
  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof document !== "undefined") {
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

  let domain = "";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    domain = url;
  }

  let src = "";
  if (!isStatic) {
    const params = {
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: isDark ? "dark" : "light",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 2,
      "viewport.height": height * 2,
    };
    src = `https://api.microlink.io/?${encode(params)}`;
  } else {
    src = imageSrc;
  }

  // Spring animation for subtle mouse follow
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  return (
    <>
      {isMounted ? (
        <div className="hidden">
          <img
            src={src}
            width={width}
            height={height}
            alt="hidden preloader"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </div>
      ) : null}

      <HoverCardPrimitive.Root
        openDelay={60}
        closeDelay={120}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) {
            setHasError(false);
          }
        }}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn("inline-block", className)}
          href={url}
          target={target}
          rel={rel}
        >
          {children}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="z-50 pointer-events-none [transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={8}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 280, damping: 20 },
                }}
                exit={{ opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } }}
                style={{ x: translateX }}
                className="shadow-2xl rounded-2xl p-2 bg-popover/95 backdrop-blur-md border border-border/60 text-popover-foreground pointer-events-auto"
              >
                <a
                  href={url}
                  target={target}
                  rel={rel}
                  className="block rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40 group"
                  style={{ fontSize: 0 }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg bg-muted/60 flex items-center justify-center"
                    style={{ width: `${width}px`, height: `${height}px` }}
                  >
                    {/* Skeleton loading state */}
                    {isLoading && !hasError && (
                      <div className="absolute inset-0 bg-muted/80 animate-pulse flex flex-col items-center justify-center gap-2 p-3 text-center">
                        <Globe className="h-6 w-6 text-muted-foreground/60 animate-spin" />
                        <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[170px]">
                          Loading preview...
                        </span>
                      </div>
                    )}

                    {/* Screenshot image */}
                    {!hasError && (
                      <img
                        src={src}
                        width={width}
                        height={height}
                        className={cn(
                          "w-full h-full object-cover transition-opacity duration-300 rounded-lg",
                          isLoading ? "opacity-0" : "opacity-100"
                        )}
                        alt={`${domain} preview`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                          setIsLoading(false);
                          setHasError(true);
                        }}
                      />
                    )}

                    {/* Fallback card if screenshot fails */}
                    {hasError && (
                      <div className="w-full h-full p-3.5 flex flex-col justify-between bg-card text-card-foreground border border-border/40 rounded-lg">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                            alt=""
                            className="h-5 w-5 rounded object-contain shrink-0 bg-muted/40 p-0.5"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <span className="text-xs font-semibold truncate text-foreground">
                            {domain}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                            External resource on {domain}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                            <span>Open website</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </a>

                {/* Footer preview caption */}
                <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                      alt=""
                      className="h-3.5 w-3.5 rounded-sm object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="font-medium text-foreground/90 truncate">{domain}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
}

export default LinkPreview;
