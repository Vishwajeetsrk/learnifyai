import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MentorRole } from "./mentorData";

export type FaceExpression = "idle" | "happy" | "excited" | "thinking" | "working" | "talking" | "wink";
export type FaceVariant = "base" | "cute";

interface CuteMentorFaceProps {
  mentor: MentorRole;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  expression?: FaceExpression;
  variant?: FaceVariant;
  isInteractive?: boolean;
  isSpeaking?: boolean;
  showOnlineBadge?: boolean;
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
  variant = "cute",
  isInteractive = true,
  isSpeaking = false,
  showOnlineBadge = true,
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

  // Mouse eye-tracking when interactive - both eyes follow mouse cursor smoothly
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
  const isCute = variant === "cute";

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
      {/* Outer Glow Halo matching Mentor Accent / Lavender Periwinkle (Image 2) */}
      {isCute && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-35 transition-all duration-300 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Main Circular Character Face SVG */}
      <svg
        width={spec.box}
        height={spec.box}
        viewBox="0 0 100 100"
        className="relative z-10 w-full h-full overflow-visible drop-shadow-sm"
      >
        <defs>
          {/* 3D Radial Face Gradient - Pure White with subtle soft depth */}
          <radialGradient id={`face-grad-${mentor.id}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EEF2F6" />
          </radialGradient>

          {/* Eye Gradient - Deep obsidian navy */}
          <linearGradient id={`eye-grad-${mentor.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Soft Lavender Airbrushed Blush Gradient (Matches Image 2 exactly) */}
          <radialGradient id={`blush-grad-${mentor.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Dark Ring (Matches Image 1 & 2 circular bezel) */}
        <circle
          cx="50"
          cy="50"
          r="47.5"
          fill="none"
          stroke="#0F172A"
          strokeWidth="3.5"
        />

        {/* Inner Periwinkle / Accent Aura Ring (Matches Image 2 subtle violet-blue glow border) */}
        {isCute && (
          <circle
            cx="50"
            cy="50"
            r="45.5"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeOpacity="0.75"
          />
        )}

        {/* Clean Bright White Face Base */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={`url(#face-grad-${mentor.id})`}
        />

        {/* Cute Pastel Lavender Blush Cheeks (Image 2: positioned directly next to eyes) */}
        {isCute && (
          <>
            <circle
              cx="27"
              cy="53"
              r="8"
              fill={`url(#blush-grad-${mentor.id})`}
            />
            <circle
              cx="73"
              cy="53"
              r="8"
              fill={`url(#blush-grad-${mentor.id})`}
            />
          </>
        )}

        {/* Eyes Group with Mouse Gaze Tracking Offset */}
        <g
          transform={`translate(${lookOffset.x}, ${lookOffset.y})`}
          className="transition-transform duration-100 ease-out"
        >
          {/* Expression: BLINKING (Eyes close to cute horizontal slits) */}
          {isBlinking ? (
            <>
              <line x1="33" y1="46" x2="43" y2="46" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="57" y1="46" x2="67" y2="46" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : currentExpr === "happy" || currentExpr === "excited" ? (
            /* Expression: HAPPY / EXCITED (^ ^) */
            <>
              <path
                d="M 33 48 Q 38.5 38 44 48"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 56 48 Q 61.5 38 67 48"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          ) : currentExpr === "thinking" || currentExpr === "working" ? (
            /* Expression: THINKING / WORKING (o o inquisitive scan) */
            <>
              <circle cx="38.5" cy="46" r="6.5" fill="#0F172A" />
              <circle cx="40" cy="44" r="2" fill="#FFFFFF" />
              <circle cx="61.5" cy="46" r="6.5" fill="#0F172A" />
              <circle cx="63" cy="44" r="2" fill="#FFFFFF" />
            </>
          ) : (
            /* Expression: IDLE / DEFAULT (Two bold vertical capsules with shiny anime highlights) */
            <>
              {/* Left Eye: Vertical Pill Capsule */}
              <rect
                x="35"
                y="35"
                width="7"
                height="22"
                rx="3.5"
                fill={`url(#eye-grad-${mentor.id})`}
              />
              {/* Left Eye Specular Reflection - Vertical oval highlight matching Image 2 */}
              {isCute && (
                <rect
                  x="36.5"
                  y="37.5"
                  width="2.2"
                  height="6"
                  rx="1.1"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              )}

              {/* Right Eye: Vertical Pill Capsule */}
              <rect
                x="58"
                y="35"
                width="7"
                height="22"
                rx="3.5"
                fill={`url(#eye-grad-${mentor.id})`}
              />
              {/* Right Eye Specular Reflection - Vertical oval highlight matching Image 2 */}
              {isCute && (
                <rect
                  x="59.5"
                  y="37.5"
                  width="2.2"
                  height="6"
                  rx="1.1"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              )}
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

        {/* Online Status Badge inside SVG (Matches Image 2: bottom right green dot with crisp white border) */}
        {showOnlineBadge && isCute && (
          <g>
            <circle
              cx="80"
              cy="79"
              r="11"
              fill="#FFFFFF"
            />
            <circle
              cx="80"
              cy="79"
              r="8.5"
              fill="#00C950"
            />
          </g>
        )}
      </svg>

      {/* Speaking Voice Bass Aura Wave */}
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
