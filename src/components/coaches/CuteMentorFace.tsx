import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MentorRole } from "./mentorData";

export type FaceExpression = "idle" | "happy" | "thinking" | "talking" | "wink";

interface CuteMentorFaceProps {
  mentor: MentorRole;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  expression?: FaceExpression;
  isInteractive?: boolean;
  isSpeaking?: boolean;
  customColor?: string;
  className?: string;
}

const SIZE_SPECS = {
  xs: { box: 24, eyeW: 2.2, eyeH: 6, eyeGap: 6, radius: 10, stroke: 1.5 },
  sm: { box: 32, eyeW: 3, eyeH: 8, eyeGap: 8, radius: 14, stroke: 2 },
  md: { box: 44, eyeW: 4, eyeH: 11, eyeGap: 11, radius: 20, stroke: 2.5 },
  lg: { box: 56, eyeW: 5, eyeH: 14, eyeGap: 14, radius: 26, stroke: 3 },
  xl: { box: 80, eyeW: 7, eyeH: 20, eyeGap: 20, radius: 36, stroke: 3.5 },
};

export function CuteMentorFace({
  mentor,
  size = "md",
  expression = "idle",
  isInteractive = true,
  isSpeaking = false,
  customColor,
  className,
}: CuteMentorFaceProps) {
  const spec = SIZE_SPECS[size];
  const [isBlinking, setIsBlinking] = useState(false);
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = customColor || mentor.accentHex || "#6366f1";

  // Natural spontaneous blinking loop
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextInterval = 2500 + Math.random() * 3500;
        blinkTimeout = setTimeout(triggerBlink, nextInterval);
      }, 140);
    };

    blinkTimeout = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Mouse eye-tracking when interactive
  useEffect(() => {
    if (!isInteractive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      const maxOffset = size === "xl" ? 5 : size === "lg" ? 3.5 : 2;
      setLookOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX * maxOffset)),
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY * maxOffset)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInteractive, size]);

  const currentExpr = isSpeaking ? "talking" : expression;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-full flex items-center justify-center select-none shrink-0 transition-transform duration-300",
        className
      )}
      style={{
        width: spec.box,
        height: spec.box,
      }}
    >
      {/* Outer Glow Halo matching Mentor Accent */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-30 transition-all duration-300"
        style={{ backgroundColor: accentColor }}
      />

      {/* Main Circular Character Face */}
      <svg
        width={spec.box}
        height={spec.box}
        viewBox="0 0 100 100"
        className="relative z-10 w-full h-full overflow-visible drop-shadow-sm"
      >
        <defs>
          {/* Subtle 3D Spherical Radial Face Gradient */}
          <radialGradient id={`face-grad-${mentor.id}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>

          {/* Eye Shiny Specular Filter */}
          <linearGradient id={`eye-grad-${mentor.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Outer Dark Ring (Matches uploaded image circular bezel) */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#0F172A"
          strokeWidth="4"
          className="dark:stroke-slate-900"
        />

        {/* Thin Mentor Color Aura Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity="0.85"
        />

        {/* Clean Bright White Face Base */}
        <circle
          cx="50"
          cy="50"
          r="44.5"
          fill={`url(#face-grad-${mentor.id})`}
        />

        {/* Cute Pastel Blush Cheeks */}
        <circle
          cx="28"
          cy="58"
          r="6.5"
          fill={accentColor}
          fillOpacity="0.25"
          className="transition-opacity duration-300"
        />
        <circle
          cx="72"
          cy="58"
          r="6.5"
          fill={accentColor}
          fillOpacity="0.25"
          className="transition-opacity duration-300"
        />

        {/* Eyes Group with Eye Tracking Offset */}
        <g
          transform={`translate(${lookOffset.x}, ${lookOffset.y})`}
          className="transition-transform duration-100 ease-out"
        >
          {/* Expression: BLINKING */}
          {isBlinking ? (
            <>
              {/* Left Eye closed slit */}
              <line x1="33" y1="46" x2="43" y2="46" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              {/* Right Eye closed slit */}
              <line x1="57" y1="46" x2="67" y2="46" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : currentExpr === "happy" ? (
            /* Expression: HAPPY (^ ^) */
            <>
              <path
                d="M 32 48 Q 38 38 44 48"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 56 48 Q 62 38 68 48"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          ) : currentExpr === "thinking" ? (
            /* Expression: THINKING (o o scanning) */
            <>
              <circle cx="38" cy="46" r="6" fill="#0F172A" />
              <circle cx="39.5" cy="44.5" r="2" fill="#FFFFFF" />
              <circle cx="62" cy="46" r="6" fill="#0F172A" />
              <circle cx="63.5" cy="44.5" r="2" fill="#FFFFFF" />
            </>
          ) : (
            /* Expression: IDLE / DEFAULT (| | two vertical capsule eyes as in user image) */
            <>
              {/* Left Eye: Vertical Pill Capsule */}
              <rect
                x="34.5"
                y="35"
                width="7"
                height="22"
                rx="3.5"
                fill={`url(#eye-grad-${mentor.id})`}
              />
              {/* Left Eye Specular Reflection Dot */}
              <circle cx="36.5" cy="39" r="1.5" fill="#FFFFFF" opacity="0.9" />

              {/* Right Eye: Vertical Pill Capsule */}
              <rect
                x="58.5"
                y="35"
                width="7"
                height="22"
                rx="3.5"
                fill={`url(#eye-grad-${mentor.id})`}
              />
              {/* Right Eye Specular Reflection Dot */}
              <circle cx="60.5" cy="39" r="1.5" fill="#FFFFFF" opacity="0.9" />
            </>
          )}

          {/* Cute Mouth when Talking / Speaking */}
          {currentExpr === "talking" && (
            <path
              d="M 45 61 Q 50 67 55 61"
              fill="#0F172A"
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}
        </g>
      </svg>

      {/* Speaking Voice Aura Wave */}
      {isSpeaking && (
        <span
          className="absolute -inset-1 rounded-full animate-ping pointer-events-none opacity-40"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
}

export default CuteMentorFace;
