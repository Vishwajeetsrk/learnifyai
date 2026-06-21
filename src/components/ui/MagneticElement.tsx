import React, { useRef, useState, ReactNode } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useCursor } from "../../hooks/use-cursor";
import { useMotionPref } from "../../hooks/use-motion-pref";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  magneticPull?: number; // How much the element moves towards the cursor
  lift3D?: boolean; // Enable 3D tilt effect
}

export function MagneticElement({ children, className = "", magneticPull = 15, lift3D = false }: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { isTouchDevice } = useCursor();
  const prefersReducedMotion = useMotionPref();

  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || prefersReducedMotion || !ref.current) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * (magneticPull / 100));
    y.set(distanceY * (magneticPull / 100));
  };

  const handleMouseEnter = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (isTouchDevice || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      data-magnetic="true"
      style={{
        x,
        y,
        rotateX: lift3D ? rotateX : 0,
        rotateY: lift3D ? rotateY : 0,
        z: isHovered && lift3D ? 20 : 0,
        perspective: lift3D ? 1000 : "none",
        transformStyle: lift3D ? "preserve-3d" : "flat",
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
      
      {/* Soft spotlight overlay when hovered (if lift3D is enabled) */}
      {lift3D && isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 80%)",
            x: useTransform(x, (val) => val * -0.5),
            y: useTransform(y, (val) => val * -0.5),
          }}
        />
      )}
    </motion.div>
  );
}
