import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const EYE_SPACING = 22;
const EYE_Y = 48;
const EYE_RADIUS = 5;
const PUPIL_RADIUS = 2.5;
const PUPIL_RANGE = 3;
const MOUTH_Y = 78;

interface InteractiveAvatarProps {
  src: string;
  name: string;
  className?: string;
  size?: number;
}

export function InteractiveAvatar({ src, name, className, size = 128 }: InteractiveAvatarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const px = (mousePos.x - 0.5) * 2 * PUPIL_RANGE;
  const py = (mousePos.y - 0.5) * 2 * PUPIL_RANGE;

  return (
    <div
      ref={ref}
      className={cn("relative inline-block select-none", className)}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
    >
      <img src={src} alt={name} className="w-full h-full rounded-full" draggable={false} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 128 128">
        <circle cx={64 - EYE_SPACING} cy={EYE_Y} r={EYE_RADIUS} fill="white" opacity={0.9} />
        <circle cx={64 + EYE_SPACING} cy={EYE_Y} r={EYE_RADIUS} fill="white" opacity={0.9} />
        <circle cx={64 - EYE_SPACING + px} cy={EYE_Y + py} r={PUPIL_RADIUS} fill="#1a1a2e" />
        <circle cx={64 + EYE_SPACING + px} cy={EYE_Y + py} r={PUPIL_RADIUS} fill="#1a1a2e" />
        <path
          d={hovered
            ? `M ${64 - 12} ${MOUTH_Y} Q ${64} ${MOUTH_Y - 10} ${64 + 12} ${MOUTH_Y}`
            : `M ${64 - 12} ${MOUTH_Y} Q ${64} ${MOUTH_Y + 2} ${64 + 12} ${MOUTH_Y}`
          }
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
}
