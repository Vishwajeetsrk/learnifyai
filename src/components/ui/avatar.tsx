"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  let borderClass = "";

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && (child.props as any)?.src) {
      const src = (child.props as any).src;
      if (typeof src === "string") {
        const match = src.match(/[?&]profile_border=([^&]+)/);
        if (match) {
          const borderType = match[1];
          switch (borderType) {
            case "neon-blue":
              borderClass = "ring-2 ring-cyan-400 ring-offset-2 ring-offset-background";
              break;
            case "neon-pink":
              borderClass = "ring-2 ring-pink-500 ring-offset-2 ring-offset-background";
              break;
            case "neon-green":
              borderClass = "ring-2 ring-emerald-400 ring-offset-2 ring-offset-background";
              break;
            case "gold-gradient":
              borderClass =
                "ring-2 ring-amber-400 ring-offset-2 ring-offset-background animate-pulse";
              break;
            case "rainbow-glow":
              borderClass =
                "ring-2 ring-violet-500 ring-offset-2 ring-offset-background animate-pulse";
              break;
            case "dashed-red":
              borderClass = "ring-2 ring-rose-500 ring-dashed ring-offset-2 ring-offset-background";
              break;
            case "royal-purple":
              borderClass = "ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-background";
              break;
            case "retro-orange":
              borderClass = "ring-2 ring-orange-500 ring-offset-2 ring-offset-background";
              break;
            default:
              break;
          }
        }
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
