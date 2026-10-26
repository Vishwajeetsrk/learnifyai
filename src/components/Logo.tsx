import logoMarkUrl from "@/assets/learnify-mark.png?url";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: string;
  markOnly?: boolean;
  textClassName?: string;
}

/**
 * Official Learnify AI Brand Logo.
 * Displays the high-resolution vibrant brand emblem paired with crisp,
 * pixel-perfect vector typography tailored for both dark and light modes.
 * Zero distortion, zero wash-out, and no blurry raster sub-taglines.
 */
export function Logo({ className, height = "h-9", markOnly = false, textClassName }: LogoProps) {
  if (markOnly) {
    return (
      <span className={cn("inline-flex items-center justify-center select-none transition-transform hover:scale-105 shrink-0", className)}>
        <img
          src={logoMarkUrl}
          alt="Learnify AI"
          className={cn(height, "w-auto object-contain drop-shadow-sm")}
          draggable={false}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none transition-transform hover:scale-[1.02] shrink-0", className)}>
      <img
        src={logoMarkUrl}
        alt="Learnify AI"
        className={cn(height, "w-auto object-contain drop-shadow-sm shrink-0")}
        draggable={false}
      />
      <span className={cn("font-display font-black text-xl tracking-tight text-foreground flex items-baseline drop-shadow-sm", textClassName)}>
        Learnify<span className="text-sky-500 ml-0.5">AI</span>
      </span>
    </span>
  );
}


