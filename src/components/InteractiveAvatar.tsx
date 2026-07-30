import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const EYE_SPACING = 20;
const EYE_Y = 48;
const EYE_RADIUS = 6;
const PUPIL_RADIUS = 3;
const PUPIL_RANGE = 4.5;
const MOUTH_Y = 76;

interface InteractiveAvatarProps {
  src: string;
  name: string;
  className?: string;
  size?: number;
  onClick?: () => void;
}

export function InteractiveAvatar({
  src,
  name,
  className,
  size = 128,
  onClick,
}: InteractiveAvatarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;
      const distance = Math.hypot(deltaX, deltaY) || 1;

      // Limit pupil displacement to PUPIL_RANGE
      const clampedDist = Math.min(distance / 200, 1) * PUPIL_RANGE;
      const angle = Math.atan2(deltaY, deltaX);

      setPupilPos({
        x: Math.cos(angle) * clampedDist,
        y: Math.sin(angle) * clampedDist,
      });
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn("relative inline-block select-none overflow-hidden rounded-full group cursor-pointer", className)}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {/* Base Avatar Image */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
        draggable={false}
      />

      {/* SVG Overlay for Interactive Tracking Eyes & Smile */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm"
        viewBox="0 0 128 128"
      >
        {/* Left Eye White & Pupil */}
        <circle cx={64 - EYE_SPACING} cy={EYE_Y} r={EYE_RADIUS} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
        <circle
          cx={64 - EYE_SPACING + pupilPos.x}
          cy={EYE_Y + pupilPos.y}
          r={PUPIL_RADIUS}
          fill="#1E293B"
          className="transition-transform duration-75 ease-out"
        />
        {/* Eye Specular Catchlight */}
        <circle
          cx={64 - EYE_SPACING + pupilPos.x - 1}
          cy={EYE_Y + pupilPos.y - 1}
          r={1}
          fill="#FFFFFF"
        />

        {/* Right Eye White & Pupil */}
        <circle cx={64 + EYE_SPACING} cy={EYE_Y} r={EYE_RADIUS} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
        <circle
          cx={64 + EYE_SPACING + pupilPos.x}
          cy={EYE_Y + pupilPos.y}
          r={PUPIL_RADIUS}
          fill="#1E293B"
          className="transition-transform duration-75 ease-out"
        />
        {/* Eye Specular Catchlight */}
        <circle
          cx={64 + EYE_SPACING + pupilPos.x - 1}
          cy={EYE_Y + pupilPos.y - 1}
          r={1}
          fill="#FFFFFF"
        />

        {/* Animated Smile Curve on Hover */}
        <path
          d={
            hovered
              ? `M ${64 - 14} ${MOUTH_Y} Q ${64} ${MOUTH_Y + 14} ${64 + 14} ${MOUTH_Y}`
              : `M ${64 - 10} ${MOUTH_Y} Q ${64} ${MOUTH_Y + 4} ${64 + 10} ${MOUTH_Y}`
          }
          fill={hovered ? "#EF4444" : "none"}
          stroke="#0F172A"
          strokeWidth={hovered ? "2.5" : "2"}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />

        {/* Hover Dimple Accent */}
        {hovered && (
          <>
            <circle cx={64 - 16} cy={MOUTH_Y + 2} r={1.5} fill="#F43F5E" opacity={0.6} />
            <circle cx={64 + 16} cy={MOUTH_Y + 2} r={1.5} fill="#F43F5E" opacity={0.6} />
          </>
        )}
      </svg>
    </div>
  );
}
