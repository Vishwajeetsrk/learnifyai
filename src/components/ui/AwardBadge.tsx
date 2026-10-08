/**
 * AwardBadge.tsx
 * Learnify AI — Animated Award Badge component.
 *
 * Desktop: subtle 3D tilt + light sweep on mouse move (requestAnimationFrame, CSS vars).
 * Mobile: auto shimmer on mount + tap scale. No continuous animation on mobile.
 * Respects prefers-reduced-motion.
 *
 * IMPORTANT: Does NOT copy any third-party branding.
 * This is a native Learnify component.
 */
import { useRef, useCallback, useEffect, useState } from "react";
import { Trophy, Star, Crown, Zap, Award, Shield, Target, Brain, Code2, CheckCircle } from "lucide-react";

export type BadgeShape = "circle" | "shield" | "medal" | "ribbon" | "seal" | "pill" | "hexagon";

export interface AwardBadgeProps {
  name: string;
  description?: string;
  iconName?: string;
  shape?: BadgeShape;
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  /** Size in pixels */
  size?: number;
  /** Disable 3D tilt animation (e.g. in lists) */
  staticMode?: boolean;
  className?: string;
  onClick?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  Crown,
  Zap,
  Award,
  Shield,
  Target,
  Brain,
  Code2,
  CheckCircle,
};

function BadgeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Award;
  return <Icon className={className} />;
}

/** SVG path for each badge shape */
function BadgeShapeSvg({
  shape,
  size,
  primaryColor,
  accentColor,
}: {
  shape: BadgeShape;
  size: number;
  primaryColor: string;
  accentColor: string;
}) {
  const cx = size / 2;
  const r = (size / 2) * 0.9;

  switch (shape) {
    case "hexagon": {
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return `${cx + r * Math.cos(angle)},${cx + r * Math.sin(angle)}`;
      }).join(" ");
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <defs>
            <linearGradient id="hx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
            <filter id="hx-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.4" />
            </filter>
          </defs>
          <polygon points={points} fill="url(#hx-grad)" filter="url(#hx-shadow)" />
          <polygon points={points} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
        </svg>
      );
    }
    case "shield": {
      const w = size;
      const h = size;
      const path = `M${w * 0.5},${h * 0.05} L${w * 0.92},${h * 0.22} L${w * 0.92},${h * 0.55} C${w * 0.92},${h * 0.78} ${w * 0.5},${h * 0.95} ${w * 0.5},${h * 0.95} C${w * 0.5},${h * 0.95} ${w * 0.08},${h * 0.78} ${w * 0.08},${h * 0.55} L${w * 0.08},${h * 0.22} Z`;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <defs>
            <linearGradient id="sh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
          </defs>
          <path d={path} fill="url(#sh-grad)" />
          <path d={path} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
        </svg>
      );
    }
    case "seal": {
      const petals = 12;
      const innerR = r * 0.75;
      const outerR = r;
      const points = Array.from({ length: petals * 2 }, (_, i) => {
        const angle = (Math.PI / petals) * i;
        const radius = i % 2 === 0 ? outerR : innerR;
        return `${cx + radius * Math.cos(angle)},${cx + radius * Math.sin(angle)}`;
      }).join(" ");
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <defs>
            <radialGradient id="sl-grad" cx="40%" cy="35%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </radialGradient>
          </defs>
          <polygon points={points} fill="url(#sl-grad)" />
          <circle cx={cx} cy={cx} r={innerR * 0.9} fill={primaryColor} />
          <circle cx={cx} cy={cx} r={innerR * 0.9} fill="none" stroke={accentColor} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    }
    case "medal": {
      const triangleH = size * 0.35;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <defs>
            <linearGradient id="md-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
          </defs>
          {/* Ribbon triangle top */}
          <polygon
            points={`${size * 0.3},0 ${size * 0.7},0 ${size * 0.5},${triangleH}`}
            fill={accentColor}
            opacity="0.8"
          />
          {/* Circle bottom */}
          <circle cx={cx} cy={cx + triangleH * 0.3} r={size * 0.38} fill="url(#md-grad)" />
          <circle cx={cx} cy={cx + triangleH * 0.3} r={size * 0.38} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
        </svg>
      );
    }
    case "ribbon": {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <defs>
            <linearGradient id="rb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cx * 0.85} r={r * 0.75} fill="url(#rb-grad)" />
          <path
            d={`M${size * 0.3},${size * 0.72} L${cx},${size * 0.95} L${size * 0.7},${size * 0.72}`}
            fill={accentColor}
            opacity="0.8"
          />
          <path
            d={`M${size * 0.3},${size * 0.72} L${size * 0.1},${size * 0.62} L${cx * 0.7},${size * 0.72}`}
            fill={primaryColor}
            opacity="0.9"
          />
          <path
            d={`M${size * 0.7},${size * 0.72} L${size * 0.9},${size * 0.62} L${cx * 1.3},${size * 0.72}`}
            fill={primaryColor}
            opacity="0.9"
          />
        </svg>
      );
    }
    case "pill": {
      const rx = size * 0.5;
      const ry = size * 0.38;
      return (
        <svg width={size} height={size * 0.8} viewBox={`0 0 ${size} ${size * 0.8}`} className="absolute inset-0">
          <defs>
            <linearGradient id="pl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
          </defs>
          <ellipse cx={cx} cy={size * 0.4} rx={rx} ry={ry} fill="url(#pl-grad)" />
        </svg>
      );
    }
    case "circle":
    default:
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <defs>
            <radialGradient id="ci-grad" cx="38%" cy="35%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="60%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.7" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cx} r={r} fill="url(#ci-grad)" />
          {/* Outer ring */}
          <circle cx={cx} cy={cx} r={r * 0.92} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
          <circle cx={cx} cy={cx} r={r * 0.84} fill="none" stroke={accentColor} strokeWidth="0.75" opacity="0.2" />
        </svg>
      );
  }
}

export function AwardBadge({
  name,
  description,
  iconName = "Award",
  shape = "circle",
  primaryColor = "#4f46e5",
  accentColor = "#a5b4fc",
  textColor = "#ffffff",
  size = 96,
  staticMode = false,
  className = "",
  onClick,
}: AwardBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [shimmer, setShimmer] = useState(false);

  // Check for reduced motion preference
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Check for touch/mobile
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  // Desktop: 3D tilt via CSS custom properties — no React state on every frame
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (staticMode || prefersReduced || isMobile) return;
      const el = containerRef.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        // Max 12° tilt
        const rotateX = -dy * 12;
        const rotateY = dx * 12;
        const shimX = 50 + dx * 30;
        const shimY = 50 + dy * 30;

        el.style.setProperty("--rx", `${rotateX}deg`);
        el.style.setProperty("--ry", `${rotateY}deg`);
        el.style.setProperty("--shim-x", `${shimX}%`);
        el.style.setProperty("--shim-y", `${shimY}%`);
        el.style.setProperty("--scale", "1.05");
      });
    },
    [staticMode, prefersReduced, isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--shim-x", "50%");
    el.style.setProperty("--shim-y", "50%");
    el.style.setProperty("--scale", "1");
  }, []);

  // Mobile: trigger shimmer once on mount
  useEffect(() => {
    if (!isMobile || prefersReduced || staticMode) return;
    const t = setTimeout(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 800);
    }, 300);
    return () => clearTimeout(t);
  }, [isMobile, prefersReduced, staticMode]);

  // Mobile: tap shimmer
  const handleTap = useCallback(() => {
    if (!isMobile || prefersReduced) return;
    setShimmer(true);
    setTimeout(() => setShimmer(false), 600);
  }, [isMobile, prefersReduced]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const iconSize = Math.round(size * 0.38);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={
        {
          width: size,
          height: size,
          "--rx": "0deg",
          "--ry": "0deg",
          "--shim-x": "50%",
          "--shim-y": "50%",
          "--scale": "1",
          transform: staticMode || prefersReduced
            ? undefined
            : "perspective(400px) rotateX(var(--rx)) rotateY(var(--ry)) scale(var(--scale))",
          transition: "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
          willChange: "transform",
        } as unknown as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick ?? handleTap}
      role={onClick ? "button" : undefined}
      aria-label={`${name} badge${description ? ` — ${description}` : ""}`}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
    >
      {/* Shape background */}
      <BadgeShapeSvg
        shape={shape}
        size={size}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      {/* Light shimmer overlay */}
      {!prefersReduced && (
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: staticMode
              ? undefined
              : `radial-gradient(ellipse 60% 60% at var(--shim-x, 50%) var(--shim-y, 50%), rgba(255,255,255,0.22) 0%, transparent 65%)`,
            opacity: shimmer ? 1 : 0.7,
            transition: shimmer ? "opacity 0.1s" : "opacity 0.4s",
          }}
        />
      )}

      {/* Mobile shimmer sweep */}
      {shimmer && !prefersReduced && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          style={{ zIndex: 2 }}
        >
          <div
            className="absolute inset-y-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              animation: "badgeShimmerSweep 0.7s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* Icon */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 3 }}
      >
        <BadgeIcon
          name={iconName}
          className="drop-shadow-sm"
          // @ts-expect-error — size prop via style
          style={{ width: iconSize, height: iconSize, color: textColor }}
        />
      </div>

      {/* Shine ring */}
      {!prefersReduced && shape === "circle" && (
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 0 1.5px ${accentColor}44, inset 0 1px 0 ${accentColor}66`,
            zIndex: 4,
          }}
        />
      )}

      <style>{`
        @keyframes badgeShimmerSweep {
          from { left: -40%; opacity: 1; }
          to   { left: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** A row of badges with label — used in certificate hub and profile */
export function BadgeRow({
  badges,
  max = 5,
  size = 48,
}: {
  badges: { name: string; iconName?: string; shape?: BadgeShape; primaryColor?: string; accentColor?: string; description?: string }[];
  max?: number;
  size?: number;
}) {
  const visible = badges.slice(0, max);
  const overflow = badges.length - max;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visible.map((b, i) => (
        <div key={i} className="group relative flex flex-col items-center gap-1">
          <AwardBadge
            name={b.name}
            iconName={b.iconName ?? "Award"}
            shape={b.shape ?? "circle"}
            primaryColor={b.primaryColor ?? "#4f46e5"}
            accentColor={b.accentColor ?? "#a5b4fc"}
            size={size}
            staticMode
          />
          {/* Tooltip */}
          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
            {b.name}
            {b.description && (
              <div className="text-gray-400 text-[10px] mt-0.5 max-w-[160px] whitespace-normal">{b.description}</div>
            )}
          </div>
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold"
          style={{ width: size, height: size }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
