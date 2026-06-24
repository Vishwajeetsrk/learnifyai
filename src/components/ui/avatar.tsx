"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

export function getProfileBorderClass(url: string | null | undefined): string {
  if (!url) return "";
  const match = url.match(/[?&]profile_border=([^&]+)/);
  if (!match) return "";
  const border = decodeURIComponent(match[1]);
  switch (border) {
    // Neon series
    case "neon-blue":
      return "ring-[3px] ring-blue-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(96,165,250,0.6),0_0_40px_rgba(96,165,250,0.3)]";
    case "neon-pink":
      return "ring-[3px] ring-pink-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(244,114,182,0.6),0_0_40px_rgba(244,114,182,0.3)]";
    case "neon-green":
      return "ring-[3px] ring-green-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(74,222,128,0.6),0_0_40px_rgba(74,222,128,0.3)]";
    case "neon-purple":
      return "ring-[3px] ring-violet-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(167,139,250,0.6),0_0_40px_rgba(167,139,250,0.3)]";
    case "neon-cyan":
      return "ring-[3px] ring-cyan-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(34,211,238,0.6),0_0_40px_rgba(34,211,238,0.3)]";

    // Gradient series
    case "gold-gradient":
      return "ring-[3px] ring-amber-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(251,191,36,0.6),0_0_40px_rgba(251,191,36,0.3)]";
    case "royal-purple":
      return "ring-[3px] ring-purple-500 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(168,85,247,0.6),0_0_40px_rgba(168,85,247,0.3)]";
    case "ocean-teal":
      return "ring-[3px] ring-teal-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(45,212,191,0.6),0_0_40px_rgba(45,212,191,0.3)]";
    case "sunset-amber":
      return "ring-[3px] ring-amber-500 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(245,158,11,0.6),0_0_40px_rgba(245,158,11,0.3)]";
    case "fire-ruby":
      return "ring-[3px] ring-rose-500 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(244,63,94,0.6),0_0_40px_rgba(244,63,94,0.3)]";

    // Premium series
    case "cyber-cyan":
      return "ring-[3px] ring-cyan-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(34,211,238,0.6),0_0_40px_rgba(34,211,238,0.3)]";
    case "midnight-glow":
      return "ring-[3px] ring-indigo-600 ring-offset-[3px] ring-offset-background shadow-[0_0_25px_rgba(79,70,229,0.7),0_0_50px_rgba(79,70,229,0.4)]";
    case "ice-crystal":
      return "ring-[3px] ring-sky-200 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(186,230,253,0.6),0_0_40px_rgba(186,230,253,0.3)]";
    case "retro-orange":
      return "ring-[3px] ring-orange-400 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(251,146,60,0.6),0_0_40px_rgba(251,146,60,0.3)]";

    // Animated
    case "rainbow-glow":
      return "ring-[3px] ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse";
    case "pulse-red":
      return "ring-[3px] ring-red-500 ring-offset-[3px] ring-offset-background shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse";

    // Dashed
    case "dashed-red":
      return "border-[3px] border-dashed border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]";

    // Double ring
    case "double-gold":
      return "ring-[3px] ring-amber-400 ring-offset-[2px] ring-offset-background ring-offset-[6px] ring-amber-200 dark:ring-amber-800";
    case "double-blue":
      return "ring-[3px] ring-blue-500 ring-offset-[2px] ring-offset-background ring-offset-[6px] ring-blue-200 dark:ring-blue-800";

    default:
      return "";
  }
}

export const PROFILE_BORDERS = [
  { id: "neon-blue", label: "Neon Blue", color: "#60a5fa" },
  { id: "neon-pink", label: "Neon Pink", color: "#f472b6" },
  { id: "neon-green", label: "Neon Green", color: "#4ade80" },
  { id: "neon-purple", label: "Neon Purple", color: "#a78bfa" },
  { id: "neon-cyan", label: "Neon Cyan", color: "#22d3ee" },
  { id: "gold-gradient", label: "Gold", color: "#fbbf24" },
  { id: "royal-purple", label: "Royal Purple", color: "#a855f7" },
  { id: "ocean-teal", label: "Ocean Teal", color: "#2dd4bf" },
  { id: "sunset-amber", label: "Sunset", color: "#f59e0b" },
  { id: "fire-ruby", label: "Fire Ruby", color: "#f43f5e" },
  { id: "cyber-cyan", label: "Cyber Cyan", color: "#22d3ee" },
  { id: "midnight-glow", label: "Midnight", color: "#4f46e5" },
  { id: "ice-crystal", label: "Ice Crystal", color: "#bae6fd" },
  { id: "retro-orange", label: "Retro Orange", color: "#fb923c" },
  { id: "rainbow-glow", label: "Rainbow", color: "#a855f7" },
  { id: "pulse-red", label: "Pulse Red", color: "#ef4444" },
  { id: "dashed-red", label: "Dashed Red", color: "#ef4444" },
  { id: "double-gold", label: "Double Gold", color: "#fbbf24" },
  { id: "double-blue", label: "Double Blue", color: "#3b82f6" },
] as const;

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  let borderClass = "";

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && (child.props as any)?.src) {
      const src = (child.props as any).src;
      if (typeof src === "string") {
        borderClass = getProfileBorderClass(src);
      }
    }
  });

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full transition-all duration-300",
        borderClass,
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, ...props }, ref) => {
  // Strip profile_border from URL before fetching — DiceBear doesn't support it
  const cleanSrc =
    typeof src === "string" && src.includes("profile_border")
      ? src.replace(/[?&]profile_border=[^&#]*/g, "").replace(/\?$/, "")
      : src;
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full rounded-full object-cover", className)}
      src={cleanSrc}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
