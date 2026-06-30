import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveFolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  label?: string;
}

function darken(hex: string, p: number) {
  let c = hex.startsWith("#") ? hex.slice(1) : hex;
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const n = parseInt(c, 16);
  const r = Math.max(0, Math.min(255, Math.floor(((n >> 16) & 0xff) * (1 - p))));
  const g = Math.max(0, Math.min(255, Math.floor(((n >> 8) & 0xff) * (1 - p))));
  const b = Math.max(0, Math.min(255, Math.floor((n & 0xff) * (1 - p))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function InteractiveFolder({
  color = "#7c3aed",
  size = 1,
  items = [],
  className,
  label,
}: InteractiveFolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const maxVisible = 3;
  const display = items.slice(0, maxVisible);
  while (display.length < maxVisible) display.push(null);

  const backColor = darken(color, 0.12);
  const paperColors = ["#e8e8e8", "#f0f0f0", "#f8f8f8"];

  const handleMouseMove = (e: React.MouseEvent, i: number) => {
    if (!isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.2,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.2,
    });
    setHoveredIndex(i);
  };

  const getTransform = (i: number) => {
    if (!isOpen) return { x: "-50%", y: "10%", rotate: 0, scale: 1 };
    const base = [
      { x: "-120%", y: "-75%", rotate: -15 },
      { x: "10%", y: "-75%", rotate: 15 },
      { x: "-50%", y: "-105%", rotate: 5 },
    ][i] || { x: "-50%", y: "-50%", rotate: 0 };
    if (hoveredIndex === i) {
      return {
        x: `calc(${base.x} + ${mousePos.x}px)`,
        y: `calc(${base.y} + ${mousePos.y}px)`,
        rotate: base.rotate,
        scale: 1.1,
      };
    }
    return base;
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={{ transform: `scale(${size})`, width: 120, height: 100 }}
    >
      <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div
          className="relative w-[110px] h-[85px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] transition-shadow duration-500"
          style={{
            backgroundColor: backColor,
            boxShadow: isOpen
              ? "0 10px 30px -5px rgba(0,0,0,0.1)"
              : "0 4px 12px -2px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="absolute bottom-full left-0 w-[35px] h-[12px] rounded-t-[6px]"
            style={{ backgroundColor: backColor }}
          />

          {display.map((item, i) => (
            <motion.div
              key={i}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => {
                setMousePos({ x: 0, y: 0 });
                setHoveredIndex(null);
              }}
              animate={getTransform(i)}
              transition={{ type: "spring", stiffness: 260, damping: 20, mass: 1 }}
              className="absolute left-1/2 flex items-center justify-center overflow-hidden"
              style={{
                zIndex: 20,
                backgroundColor: paperColors[i],
                borderRadius: "8px",
                width: i === 0 ? "75px" : i === 1 ? "85px" : "95px",
                height: i === 0 ? "65px" : i === 1 ? "70px" : "75px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.03)",
              }}
            >
              {item || (
                <div className="w-full h-full p-2 flex flex-col gap-1.5 opacity-20">
                  <div className="w-3/4 h-1 bg-current rounded-full" />
                  <div className="w-1/2 h-1 bg-current rounded-full" />
                  <div className="w-2/3 h-1 bg-current rounded-full" />
                </div>
              )}
            </motion.div>
          ))}

          <motion.div
            animate={{
              skewX: isOpen ? 15 : 0,
              scaleY: isOpen ? 0.6 : 1,
              translateY: isOpen ? 4 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-30 origin-bottom"
            style={{
              backgroundColor: color,
              borderRadius: "6px 12px 12px 12px",
              clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
            }}
          />
          <motion.div
            animate={{
              skewX: isOpen ? -15 : 0,
              scaleY: isOpen ? 0.6 : 1,
              translateY: isOpen ? 4 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-30 origin-bottom"
            style={{
              backgroundColor: color,
              borderRadius: "6px 12px 12px 12px",
              clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
            }}
          >
            {label && !isOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 text-[10px] font-medium tracking-tight whitespace-nowrap px-2">
                {label}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
