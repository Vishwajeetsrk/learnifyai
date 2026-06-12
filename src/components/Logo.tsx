import logoUrl from "@/assets/learnify-logo.png?url";
import { cn } from "@/lib/utils";

/**
 * Brand logo with guaranteed visibility across light/dark themes.
 * The source PNG is dark-on-transparent; in dark mode we wrap it on a
 * subtle white plate so the mark always reads.
 */
export function Logo({ className, height = "h-10" }: { className?: string; height?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors",
        "dark:bg-white/95 dark:px-1.5 dark:py-0.5 dark:shadow-sm",
        className,
      )}
    >
      <img
        src={logoUrl}
        alt="Learnify AI"
        className={cn(height, "w-auto object-contain")}
        draggable={false}
      />
    </span>
  );
}
