import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MentorRole } from "./mentorData";

export type FaceExpression = "idle" | "happy" | "excited" | "thinking" | "working" | "talking" | "wink";

interface CuteMentorFaceProps {
  mentor: MentorRole;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  expression?: FaceExpression;
  isInteractive?: boolean;
  isSpeaking?: boolean;
  showOnlineBadge?: boolean;
  customColor?: string;
  className?: string;
}

const SIZE_SPECS = {
  xs: { box: 24, stroke: 1.5 },
  sm: { box: 32, stroke: 2 },
  md: { box: 44, stroke: 2.5 },
  lg: { box: 56, stroke: 3 },
  xl: { box: 84, stroke: 3.5 },
};

/**
 * CuteMentorFace
 * Flawlessly matches Image 2:
 * - Pure round white face with subtle 3D lighting gradient
 * - High-shine vertical capsule eyes with gleaming specular highlights
 * - Soft pastel lavender/lilac blush cheeks (#B8A9FD / #C4B5FD)
 * - Periwinkle/lavender aura outline ring
 * - Bottom-right green active badge (#00C950) with crisp white border
 * - Mouse gaze tracking (eyes smoothly follow pointer)
 * - Rich emotional states: idle, happy, excited, thinking, working, talking, wink
 * - Real-time acoustic bass aura pulse
 */
export function CuteMentorFace({
  mentor,
  size = "md",
  expression = "idle",
  isInteractive = true,
  isSpeaking = false,
  showOnlineBadge = true,
  customColor,
  className,
}: CuteMentorFaceProps) {
  const spec = SIZE_SPECS[size];
  const [isBlinking, setIsBlinking] = useState(false);
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });
  const [scanOffset, setScanOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = customColor || mentor.accentHex || "#818CF8";
  const uniqueId = `${mentor.id}-${size}`;

  // Natural spontaneous blinking loop
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextInterval = 2800 + Math.random() * 3200;
        blinkTimeout = setTimeout(triggerBlink, nextInterval);
      }, 130);
    };

    blinkTimeout = setTimeout(triggerBlink, 2200);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Subtle cognitive scan motion when thinking / working
  useEffect(() => {
    if (expression !== "thinking" && expression !== "working") {
      setScanOffset(0);
      return;
    }
    let frame = 0;
    const interval = setInterval(() => {
      frame += 1;
      setScanOffset(Math.sin(frame * 0.4) * 2.5);
    }, 120);
    return () => clearInterval(interval);
  }, [expression]);

  // Smooth mouse gaze tracking across the entire screen
  useEffect(() => {
    if (!isInteractive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      const maxOffset = size === "xl" ? 5.5 : size === "lg" ? 4 : 2.5;
      setLookOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX * maxOffset)),
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY * maxOffset)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInteractive, size]);

  const currentExpr = isSpeaking ? "talking" : expression;
  const effectiveLookX = lookOffset.x + scanOffset;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-full flex items-center justify-center select-none shrink-0 transition-transform duration-300",
        currentExpr === "happy" && "animate-bounce-short",
        className
      )}
      style={{
        width: spec.box,
        height: spec.box,
      }}
    >
      {/* Outer Atmospheric Glow Halo (Lavender periwinkle aura from Image 2) */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-md pointer-events-none transition-all duration-300",
          isSpeaking ? "opacity-60 scale-110" : "opacity-35"
        )}
        style={{ backgroundColor: accentColor }}
      />

      {/* Acoustic Bass Soundwave Ripples (Pulsing outwards when speaking) */}
      {isSpeaking && (
        <>
          <span
            className="absolute -inset-1.5 rounded-full animate-ping pointer-events-none opacity-45"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="absolute -inset-3 rounded-full animate-pulse pointer-events-none opacity-25"
            style={{ border: `2px solid ${accentColor}` }}
          />
        </>
      )}

      {/* SVG Face - Scaled cleanly to viewBox 0 0 100 100 */}
      <svg
        width={spec.box}
        height={spec.box}
        viewBox="0 0 100 100"
        className="relative z-10 w-full h-full overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Face 3D Soft Lighting Gradient */}
          <radialGradient id={`face-grad-${uniqueId}`} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>

          {/* Eye Gradient - Deep obsidian */}
          <linearGradient id={`eye-grad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Soft Lilac/Lavender Blush Cheeks (Exact match to Image 2) */}
          <radialGradient id={`blush-grad-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B8A9FD" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#C4B5FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0" />
          </radialGradient>

          {/* Soft bottom rim shadow filter */}
          <filter id={`rim-shadow-${uniqueId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Dark Bezel Ring (Image 2 circular border) */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="#0F172A"
          strokeWidth="3.2"
        />

        {/* Glowing Lavender/Indigo Rim Ring (Image 2 inner accent border) */}
        <circle
          cx="50"
          cy="50"
          r="45.2"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeOpacity="0.8"
        />

        {/* Face Base Disc */}
        <circle
          cx="50"
          cy="50"
          r="43.8"
          fill={`url(#face-grad-${uniqueId})`}
        />

        {/* Cute Pastel Lavender Blush Cheeks (Image 2: circles flanking the eyes) */}
        <circle
          cx="26"
          cy="53"
          r="8.5"
          fill={`url(#blush-grad-${uniqueId})`}
          className="transition-all duration-300"
          style={{
            transform: currentExpr === "happy" || currentExpr === "excited" ? "scale(1.15)" : "scale(1)",
            transformOrigin: "26px 53px",
          }}
        />
        <circle
          cx="74"
          cy="53"
          r="8.5"
          fill={`url(#blush-grad-${uniqueId})`}
          className="transition-all duration-300"
          style={{
            transform: currentExpr === "happy" || currentExpr === "excited" ? "scale(1.15)" : "scale(1)",
            transformOrigin: "74px 53px",
          }}
        />

        {/* Interactive Eyes Group with Mouse Gaze Tracking */}
        <g
          transform={`translate(${effectiveLookX}, ${lookOffset.y})`}
          className="transition-transform duration-100 ease-out"
        >
          {isBlinking ? (
            /* BLINK: Closed cute horizontal slits */
            <>
              <line x1="33" y1="46" x2="43" y2="46" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="57" y1="46" x2="67" y2="46" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : currentExpr === "happy" ? (
            /* HAPPY: Joyful upward curve arcs (^ ^) */
            <>
              <path
                d="M 32 49 Q 38 39 44 49"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 56 49 Q 62 39 68 49"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          ) : currentExpr === "excited" ? (
            /* EXCITED: Joyful arc eyes with sparkling stars */
            <>
              <path
                d="M 31 49 Q 38 37 45 49"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <path
                d="M 55 49 Q 62 37 69 49"
                fill="none"
                stroke="#0F172A"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              {/* Joy sparkle dots */}
              <circle cx="38" cy="34" r="1.5" fill={accentColor} />
              <circle cx="62" cy="34" r="1.5" fill={accentColor} />
            </>
          ) : currentExpr === "thinking" || currentExpr === "working" ? (
            /* THINKING / WORKING: Attentive inquisitive scan with specular shine */
            <>
              <rect
                x="35"
                y="37"
                width="7"
                height="19"
                rx="3.5"
                fill={`url(#eye-grad-${uniqueId})`}
              />
              <circle cx="37.5" cy="40.5" r="1.8" fill="#FFFFFF" />
              <rect
                x="58"
                y="37"
                width="7"
                height="19"
                rx="3.5"
                fill={`url(#eye-grad-${uniqueId})`}
              />
              <circle cx="60.5" cy="40.5" r="1.8" fill="#FFFFFF" />
            </>
          ) : currentExpr === "wink" ? (
            /* WINK: Left eye closed arc, right eye gleaming pill */
            <>
              <path
                d="M 33 48 Q 38.5 42 44 48"
                fill="none"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <rect
                x="58"
                y="35"
                width="7.2"
                height="22"
                rx="3.6"
                fill={`url(#eye-grad-${uniqueId})`}
              />
              <rect
                x="59.8"
                y="37.5"
                width="2.4"
                height="7"
                rx="1.2"
                fill="#FFFFFF"
                opacity="0.95"
              />
            </>
          ) : (
            /* IDLE / TALKING (Default Image 2): Two bold vertical capsules with gleaming white reflections */
            <>
              {/* Left Eye: Vertical Pill Capsule */}
              <rect
                x="35"
                y="35"
                width="7.2"
                height="22"
                rx="3.6"
                fill={`url(#eye-grad-${uniqueId})`}
              />
              {/* Left Eye Primary White Specular Highlight */}
              <rect
                x="36.8"
                y="37.5"
                width="2.4"
                height="7"
                rx="1.2"
                fill="#FFFFFF"
                opacity="0.95"
              />
              {/* Left Eye Subtle Bottom Specular Dot */}
              <circle cx="38" cy="51" r="0.9" fill="#FFFFFF" opacity="0.8" />

              {/* Right Eye: Vertical Pill Capsule */}
              <rect
                x="58"
                y="35"
                width="7.2"
                height="22"
                rx="3.6"
                fill={`url(#eye-grad-${uniqueId})`}
              />
              {/* Right Eye Primary White Specular Highlight */}
              <rect
                x="59.8"
                y="37.5"
                width="2.4"
                height="7"
                rx="1.2"
                fill="#FFFFFF"
                opacity="0.95"
              />
              {/* Right Eye Subtle Bottom Specular Dot */}
              <circle cx="61" cy="51" r="0.9" fill="#FFFFFF" opacity="0.8" />
            </>
          )}

          {/* Cute subtle mouth when speaking or happy */}
          {currentExpr === "talking" && (
            <path
              d="M 46 62 Q 50 67 54 62"
              fill="#0F172A"
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}
        </g>

        {/* Online Status Badge inside SVG (Exact match to Image 2: bottom right green dot with white ring) */}
        {showOnlineBadge && (
          <g className="transition-all duration-300">
            {/* White outer border circle */}
            <circle
              cx="80"
              cy="79"
              r="11.5"
              fill="#FFFFFF"
              filter={`url(#rim-shadow-${uniqueId})`}
            />
            {/* Vibrant Emerald Green Status Circle (#00C950) */}
            <circle
              cx="80"
              cy="79"
              r="8.5"
              fill="#00C950"
            />
            {/* Subtle inner gloss highlight on badge */}
            <circle
              cx="78.2"
              cy="77.2"
              r="2"
              fill="#FFFFFF"
              opacity="0.55"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

export default CuteMentorFace;
