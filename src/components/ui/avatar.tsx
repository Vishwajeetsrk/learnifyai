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
    case "neon-blue":
      return "ring-2 ring-blue-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(96,165,250,0.5)]";
    case "neon-pink":
      return "ring-2 ring-pink-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(244,114,182,0.5)]";
    case "neon-green":
      return "ring-2 ring-green-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(74,222,128,0.5)]";
    case "gold-gradient":
      return "ring-2 ring-amber-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    case "rainbow-glow":
      return "ring-2 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse";
    case "dashed-red":
      return "border-2 border-dashed border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]";
    case "royal-purple":
      return "ring-2 ring-purple-500 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(168,85,247,0.5)]";
    case "retro-orange":
      return "ring-2 ring-orange-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(251,146,60,0.5)]";
    case "ocean-teal":
      return "ring-2 ring-teal-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(45,212,191,0.5)]";
    case "sunset-amber":
      return "ring-2 ring-amber-500 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    case "cyber-cyan":
      return "ring-2 ring-cyan-400 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(34,211,238,0.5)]";
    case "fire-ruby":
      return "ring-2 ring-rose-500 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(244,63,94,0.5)]";
    case "ice-crystal":
      return "ring-2 ring-sky-200 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(186,230,253,0.5)]";
    case "midnight-glow":
      return "ring-2 ring-indigo-600 ring-offset-2 ring-offset-background shadow-[0_0_20px_rgba(79,70,229,0.6)]";
    default:
      return "";
  }
}

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
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full rounded-full object-cover", className)}
    {...props}
  />
));
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
