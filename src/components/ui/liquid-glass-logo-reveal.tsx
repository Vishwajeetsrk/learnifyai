import type { HTMLAttributes } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface LearnifyLogoRevealProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  compact?: boolean;
}

export function LearnifyLogoReveal({
  label = "Preparing your learning space",
  compact = false,
  className,
  ...props
}: LearnifyLogoRevealProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("learnify-logo-reveal", compact && "learnify-logo-reveal--compact", className)}
      {...props}
    >
      <span className="learnify-logo-reveal__glass" aria-hidden="true">
        <Logo height={compact ? "h-7" : "h-12 sm:h-14"} />
        <span className="learnify-logo-reveal__sheen" />
      </span>
      {!compact && <span className="learnify-logo-reveal__label">{label}</span>}
      {!compact && (
        <span className="learnify-logo-reveal__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}
