import logoMarkUrl from "@/assets/learnify-mark.png?url";
import logoLightUrl from "@/assets/learnify-logo-light.png?url";
import logoDarkUrl from "@/assets/learnify-logo-dark.png?url";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: string;
  markOnly?: boolean;
  textClassName?: string;
}

/**
 * Official Learnify AI Brand Logo.
 * Displays the authentic brand logo:
 * - In Light mode: learnify-logo-light.png
 * - In Dark mode: learnify-logo-dark.png
 * Uses CSS dark: variants for seamless, zero-hydration-flicker switching.
 */
export function Logo({ className, height = "h-9", markOnly = false }: LogoProps) {
  if (markOnly) {
    return (
      <span className={cn("inline-flex items-center justify-center select-none transition-transform hover:scale-105 shrink-0", className)}>
        <img
          src={logoMarkUrl || "/assets/learnify-mark.png"}
          alt="Learnify AI"
          className={cn(height, "w-auto object-contain drop-shadow-sm")}
          draggable={false}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.src.includes("/assets/learnify-mark.png")) {
              el.src = "/assets/learnify-mark.png";
            }
          }}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center select-none transition-transform hover:scale-[1.02] shrink-0", className)}>
      {/* Dark mode logo */}
      <img
        src={logoDarkUrl || "/assets/learnify-logo-dark.png"}
        alt="Learnify AI"
        className={cn(height, "w-auto object-contain learnify-dark-logo hidden dark:block drop-shadow-sm")}
        draggable={false}
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.src.includes("/assets/learnify-logo-dark.png")) {
            el.src = "/assets/learnify-logo-dark.png";
          }
        }}
      />
      {/* Light mode logo */}
      <img
        src={logoLightUrl || "/assets/learnify-logo-light.png"}
        alt="Learnify AI"
        className={cn(height, "w-auto object-contain learnify-light-logo block dark:hidden drop-shadow-sm")}
        draggable={false}
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.src.includes("/assets/learnify-logo-light.png")) {
            el.src = "/assets/learnify-logo-light.png";
          }
        }}
      />
    </span>
  );
}
