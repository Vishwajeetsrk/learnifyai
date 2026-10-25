import logoLightUrl from "@/assets/learnify-logo-light.png?url";
import logoDarkUrl from "@/assets/learnify-logo-dark.png?url";
import logoMarkUrl from "@/assets/learnify-mark.png?url";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: string;
  markOnly?: boolean;
}

/**
 * Official Learnify AI Brand Logo.
 * Displays the authentic vibrant electric blue & cyan brand emblem with
 * pixel-perfect contrast typography tailored for both dark and light modes.
 * Zero distortion, zero wash-out, and tightly cropped bounding box.
 */
export function Logo({ className, height = "h-9", markOnly = false }: LogoProps) {
  if (markOnly) {
    return (
      <span className={cn("inline-flex items-center justify-center select-none transition-transform hover:scale-105", className)}>
        <img
          src={logoMarkUrl}
          alt="Learnify AI Emblem"
          className={cn(height, "w-auto object-contain drop-shadow-sm")}
          draggable={false}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center justify-center select-none transition-transform hover:scale-[1.02]", className)}>
      {/* Light Mode: Original Electric Blue Emblem + Dark Navy Text */}
      <img
        src={logoLightUrl}
        alt="Learnify AI"
        className={cn(
          height,
          "w-auto object-contain block dark:hidden drop-shadow-sm",
        )}
        draggable={false}
      />
      {/* Dark Mode: Vibrant Electric Blue Emblem + Crisp White & Sky-400 Text */}
      <img
        src={logoDarkUrl}
        alt="Learnify AI"
        className={cn(
          height,
          "w-auto object-contain hidden dark:block drop-shadow-[0_2px_12px_rgba(56,189,248,0.2)]",
        )}
        draggable={false}
      />
    </span>
  );
}

