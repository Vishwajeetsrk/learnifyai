import logoUrl from "@/assets/learnify-logo.png?url";
import { cn } from "@/lib/utils";

/**
 * Brand logo displaying the official Learnify AI logo image.
 * Uses a clean dark-mode filter inversion to ensure readability on dark themes
 * without requiring a clunky white background box.
 */
export function Logo({ className, height = "h-10" }: { className?: string; height?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center transition-all", className)}>
      <img
        src={logoUrl}
        alt="Learnify AI"
        className={cn(
          height,
          "w-auto object-contain",
          "dark:brightness-0 dark:invert", // Elegant dark mode transition: renders logo white on dark backgrounds
        )}
        draggable={false}
      />
    </span>
  );
}
