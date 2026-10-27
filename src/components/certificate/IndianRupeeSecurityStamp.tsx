import React from "react";
import { cn } from "@/lib/utils";

export interface IndianRupeeSecurityStampProps {
  variant?: "gold" | "platinum" | "emerald" | "purple";
  size?: number;
  className?: string;
}

/**
 * Banknote-grade Uncopyable Security Stamp inspired by Indian Rupee currency seals.
 * Features 32 scalloped starburst teeth, circular micro-lettering, 16-spoke lathe wheel,
 * 3D metallic foil gradient shading, and the sovereign Rupee (₹) security knotwork with mortarboard crest.
 */
export function IndianRupeeSecurityStamp({
  variant = "gold",
  size = 54,
  className,
}: IndianRupeeSecurityStampProps) {
  const stampId = React.useId().replace(/:/g, "");

  const colors = {
    gold: {
      metal1: "#FFFBEB",
      metal2: "#FBBF24",
      metal3: "#D97706",
      metal4: "#92400E",
      rim: "#F59E0B",
      text: "#78350F",
      glyph: "#78350F",
      ribbon: "#D97706",
      ribbonBorder: "#FDE68A",
    },
    platinum: {
      metal1: "#FFFFFF",
      metal2: "#E2E8F0",
      metal3: "#94A3B8",
      metal4: "#475569",
      rim: "#CBD5E1",
      text: "#0F172A",
      glyph: "#0F172A",
      ribbon: "#64748B",
      ribbonBorder: "#F1F5F9",
    },
    emerald: {
      metal1: "#ECFDF5",
      metal2: "#34D399",
      metal3: "#059669",
      metal4: "#064E3B",
      rim: "#10B981",
      text: "#064E3B",
      glyph: "#022C22",
      ribbon: "#059669",
      ribbonBorder: "#A7F3D0",
    },
    purple: {
      metal1: "#FAF5FF",
      metal2: "#C084FC",
      metal3: "#9333EA",
      metal4: "#581C87",
      rim: "#A855F7",
      text: "#581C87",
      glyph: "#3B0764",
      ribbon: "#9333EA",
      ribbonBorder: "#E9D5FF",
    },
  }[variant];

  // 32-point rosette coordinates
  const rosettePoints = Array.from({ length: 32 })
    .map((_, i) => {
      const angle = (i * Math.PI) / 16;
      const r = i % 2 === 0 ? 46 : 41;
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // 16 radial spokes
  const spokes = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * Math.PI) / 8;
    const x1 = 50 + 17 * Math.cos(angle);
    const y1 = 50 + 17 * Math.sin(angle);
    const x2 = 50 + 26 * Math.cos(angle);
    const y2 = 50 + 26 * Math.sin(angle);
    return { x1, y1, x2, y2 };
  });

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none group shrink-0", className)}
      style={{ width: size, height: size * 1.15 }}
      title="Bank-Grade Tamper-Proof Security Seal with Rupee-Grade Lathe Knotwork"
    >
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-metal-${stampId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.metal1} />
            <stop offset="35%" stopColor={colors.metal2} />
            <stop offset="70%" stopColor={colors.metal3} />
            <stop offset="100%" stopColor={colors.metal4} />
          </linearGradient>
          <linearGradient id={`grad-rim-${stampId}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.metal4} />
            <stop offset="50%" stopColor={colors.metal1} />
            <stop offset="100%" stopColor={colors.metal3} />
          </linearGradient>
          <radialGradient id={`grad-inner-${stampId}`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={colors.metal1} />
            <stop offset="75%" stopColor={colors.metal2} />
            <stop offset="100%" stopColor={colors.metal3} />
          </radialGradient>
          <path
            id={`text-path-${stampId}`}
            d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
          />
        </defs>

        {/* Notched Ribbon Tails */}
        <g opacity="0.95">
          <polygon
            points="38,82 28,110 38,104 46,110 46,82"
            fill={colors.ribbon}
            stroke={colors.ribbonBorder}
            strokeWidth="0.8"
          />
          <polygon
            points="54,82 54,110 62,104 72,110 62,82"
            fill={colors.ribbon}
            stroke={colors.ribbonBorder}
            strokeWidth="0.8"
          />
        </g>

        {/* Outer 32-point Rosette Serration */}
        <polygon
          points={rosettePoints}
          fill={`url(#grad-metal-${stampId})`}
          stroke={`url(#grad-rim-${stampId})`}
          strokeWidth="1.2"
        />

        {/* Concentric Guilloche Rings */}
        <circle cx="50" cy="50" r="39" fill="none" stroke={colors.metal4} strokeWidth="0.6" strokeDasharray="1,1" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke={colors.metal1} strokeWidth="0.8" />
        <circle cx="50" cy="50" r="35" fill={`url(#grad-inner-${stampId})`} stroke={colors.rim} strokeWidth="1" />

        {/* Circular Micro-lettering Security Ring */}
        <circle cx="50" cy="50" r="28" fill="none" stroke={colors.metal4} strokeWidth="0.4" strokeDasharray="2,1" />
        <text
          fontSize="4.2"
          fontWeight="bold"
          fill={colors.text}
          letterSpacing="0.8"
        >
          <textPath href={`#text-path-${stampId}`} startOffset="50%" textAnchor="middle">
            ★ LEARNIFY AI • VERIFIED RUPEE SPECIMEN ★
          </textPath>
        </text>

        {/* Center Intaglio Medallion */}
        <circle cx="50" cy="50" r="18" fill={`url(#grad-metal-${stampId})`} stroke={colors.metal4} strokeWidth="0.8" />
        <circle cx="50" cy="50" r="16.5" fill="none" stroke={colors.metal1} strokeWidth="0.5" strokeDasharray="1,0.8" />

        {/* 16 Radial Lathe Spokes */}
        {spokes.map((s, idx) => (
          <line
            key={idx}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={colors.metal4}
            strokeWidth="0.4"
            opacity="0.6"
          />
        ))}

        {/* Sovereign Rupee Symbol (₹) + Mortarboard Crown */}
        <g transform="translate(50, 50) scale(0.95) translate(-50, -50)">
          <path
            d="M 50,40 L 55,42.5 L 50,45 L 45,42.5 Z"
            fill={colors.glyph}
            opacity="0.85"
          />
          <circle cx="50" cy="38" r="0.8" fill={colors.metal1} />

          <text
            x="50"
            y="56"
            textAnchor="middle"
            fontSize="14"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fill={colors.glyph}
            className="select-none"
            style={{ textShadow: "0 1px 1px rgba(255,255,255,0.7)" }}
          >
            ₹
          </text>
        </g>

        {/* Specular 3D highlight */}
        <ellipse
          cx="42"
          cy="38"
          rx="18"
          ry="10"
          fill="white"
          opacity="0.25"
          transform="rotate(-25 42 38)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}

export default IndianRupeeSecurityStamp;
