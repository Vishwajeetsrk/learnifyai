import React from "react";
import { cn } from "@/lib/utils";

export type MascotVariant = "idle" | "thinking" | "success" | "error" | "wave";
export type MascotSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LearnifyMascotProps {
  variant?: MascotVariant;
  size?: MascotSize;
  animated?: boolean;
  className?: string;
  label?: string;
}

const SIZE_MAP: Record<MascotSize, { width: number; height: number; class: string }> = {
  xs: { width: 32, height: 32, class: "w-8 h-8" },
  sm: { width: 48, height: 48, class: "w-12 h-12" },
  md: { width: 72, height: 72, class: "w-[72px] h-[72px]" },
  lg: { width: 110, height: 110, class: "w-[110px] h-[110px]" },
  xl: { width: 160, height: 160, class: "w-40 h-40" },
};

/**
 * Learnify Spark - Official Learnify AI Learning Companion & Mascot.
 * A friendly, compact AI learning spark equipped with a graduation mortarboard,
 * vivid blue/cyan energy body, deep navy details, and subtle coral & violet accents.
 */
export function LearnifyMascot({
  variant = "idle",
  size = "md",
  animated = true,
  className = "",
  label = "Learnify Spark",
}: LearnifyMascotProps) {
  const { width, height } = SIZE_MAP[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none flex-shrink-0",
        SIZE_MAP[size].class,
        className,
      )}
      role="img"
      aria-label={label}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-transform duration-300",
          animated && variant === "idle" && "animate-[bounce_3s_ease-in-out_infinite]",
          animated && variant === "thinking" && "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]",
          animated && variant === "success" && "animate-[bounce_1.5s_ease-in-out_infinite]",
          animated && variant === "wave" && "hover:rotate-6 transition-transform",
        )}
      >
        <defs>
          {/* Spark Body Gradient: Vivid Royal Blue to Electric Sky Cyan */}
          <linearGradient id="spark_body" x1="20" y1="20" x2="100" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00A6FB" />
            <stop offset="0.6" stopColor="#1D4ED8" />
            <stop offset="1" stopColor="#0A1128" />
          </linearGradient>

          {/* Core Spark Glow */}
          <radialGradient id="spark_core" cx="60" cy="65" r="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="0.65" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="1" stopColor="#1D4ED8" stopOpacity="0" />
          </radialGradient>

          {/* Accent Coral Highlight */}
          <linearGradient id="coral_accent" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FB7185" />
            <stop offset="1" stopColor="#F43F5E" />
          </linearGradient>

          {/* Accent Violet Highlight */}
          <linearGradient id="violet_accent" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#A78BFA" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="mascot_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0A1128" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="60" cy="112" rx="34" ry="5.5" fill="#0A1128" opacity="0.12" />

        {/* Main Body: Learnify 4-Point Sparkle Morphology */}
        <g filter="url(#mascot_shadow)">
          <path
            d="M60 22 C64 45 78 58 100 62 C78 66 64 80 60 102 C56 80 42 66 20 62 C42 58 56 45 60 22 Z"
            fill="url(#spark_body)"
          />
          {/* Inner Light Core */}
          <circle cx="60" cy="62" r="28" fill="url(#spark_core)" />
        </g>

        {/* Floating AI Cheeks - Subtle Coral Glow */}
        <ellipse cx="44" cy="69" rx="4.5" ry="3" fill="url(#coral_accent)" opacity="0.75" />
        <ellipse cx="76" cy="69" rx="4.5" ry="3" fill="url(#coral_accent)" opacity="0.75" />

        {/* Expressive Digital Eyes */}
        {variant === "thinking" ? (
          // Thinking: Left eye wide, right eye tilted
          <g>
            <circle cx="48" cy="60" r="4.5" fill="#FFFFFF" />
            <circle cx="49.5" cy="58.5" r="1.8" fill="#00A6FB" />
            <circle cx="72" cy="58" r="3.8" fill="#FFFFFF" />
            <circle cx="73.5" cy="56.5" r="1.5" fill="#00A6FB" />
          </g>
        ) : variant === "success" ? (
          // Success: Happy Curved Eyes ^ ^
          <g stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
            <path d="M44 63 Q48 57 52 63" />
            <path d="M68 63 Q72 57 76 63" />
          </g>
        ) : variant === "error" ? (
          // Error: Concerned Eyes
          <g>
            <ellipse cx="48" cy="62" rx="4" ry="4.5" fill="#FFFFFF" />
            <circle cx="49" cy="63" r="2" fill="#0A1128" />
            <ellipse cx="72" cy="62" rx="4" ry="4.5" fill="#FFFFFF" />
            <circle cx="71" cy="63" r="2" fill="#0A1128" />
            <path d="M44 54 L52 57" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M76 54 L68 57" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        ) : (
          // Default / Wave / Idle: Bright, friendly open eyes
          <g>
            <ellipse cx="48" cy="61" rx="4.5" ry="5.5" fill="#FFFFFF" />
            <circle cx="49.5" cy="59.5" r="2" fill="#0A1128" />
            <circle cx="51" cy="58" r="0.9" fill="#FFFFFF" />

            <ellipse cx="72" cy="61" rx="4.5" ry="5.5" fill="#FFFFFF" />
            <circle cx="73.5" cy="59.5" r="2" fill="#0A1128" />
            <circle cx="75" cy="58" r="0.9" fill="#FFFFFF" />
          </g>
        )}

        {/* Friendly Digital Smile */}
        {variant === "error" ? (
          <path d="M54 74 Q60 70 66 74" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        ) : (
          <path d="M54 71 Q60 76 66 71" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        )}

        {/* Mascot Mortarboard (Graduation Cap) in Deep Navy with Cyan Trim */}
        <g transform="translate(18, 2)">
          {/* Cap Skull Base */}
          <path d="M30 20 Q42 25 54 20 L52 27 Q42 31 32 27 Z" fill="#0A1128" />
          {/* Diamond Top */}
          <polygon points="42,8 74,18 42,28 10,18" fill="#0A1128" stroke="#1D4ED8" strokeWidth="1" />
          {/* Mortarboard Button */}
          <circle cx="42" cy="18" r="2.5" fill="#00A6FB" />
          {/* Hanging Tassel */}
          <path d="M42 18 Q50 24 53 32" stroke="#00A6FB" strokeWidth="1.8" fill="none" />
          <circle cx="53" cy="33.5" r="2" fill="url(#violet_accent)" />
        </g>

        {/* Special Variant Accents */}
        {variant === "thinking" && (
          // Thinking Sparkles above head
          <g>
            <path d="M88 30 L90 24 L92 30 L98 32 L92 34 L90 40 L88 34 L82 32 Z" fill="#38BDF8" opacity="0.9" />
            <path d="M26 34 L27.5 30 L29 34 L33 35 L29 36.5 L27.5 40 L26 36.5 L22 35 Z" fill="#A78BFA" opacity="0.8" />
          </g>
        )}

        {variant === "success" && (
          // Celebration Twinkles
          <g>
            <path d="M96 24 L98 18 L100 24 L106 26 L100 28 L98 34 L96 28 L90 26 Z" fill="#FFD700" />
            <path d="M16 26 L18 20 L20 26 L26 28 L20 30 L18 36 L16 30 L10 28 Z" fill="#38BDF8" />
          </g>
        )}

        {variant === "wave" && (
          // Friendly Waving Hand
          <g transform="translate(90, 56)">
            <ellipse cx="6" cy="2" rx="4.5" ry="3.5" fill="#00A6FB" transform="rotate(-25 6 2)" />
            <circle cx="8" cy="1" r="1.5" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
}
