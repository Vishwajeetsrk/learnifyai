import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useCursor } from "../../hooks/use-cursor";
import { useMotionPref } from "../../hooks/use-motion-pref";

export function InteractiveCursor() {
  const { variant, isTouchDevice, activeElement, setVariant, setActiveElement } = useCursor();
  const prefersReducedMotion = useMotionPref();
  
  // High-performance motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Spring config for smooth interpolation
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const [isVisible, setIsVisible] = useState(false);
  
  // 3D Tilt calculation
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const smoothVelocityX = useSpring(velocityX, { damping: 50, stiffness: 400 });
  const smoothVelocityY = useSpring(velocityY, { damping: 50, stiffness: 400 });
  
  const rotateY = useTransform(smoothVelocityX, [-1000, 1000], [-30, 30]);
  const rotateX = useTransform(smoothVelocityY, [-1000, 1000], [30, -30]);

  // Handle global mouse tracking and hover states
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    let lastTime = performance.now();
    let lastX = 0;
    let lastY = 0;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const vx = ((e.clientX - lastX) / dt) * 1000;
      const vy = ((e.clientY - lastY) / dt) * 1000;
      
      velocityX.set(vx);
      velocityY.set(vy);
      
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      // Global detection for hover states (buttons, links, text, monaco)
      const target = e.target as HTMLElement;
      
      // If hovering Monaco, sandpack or generic inputs, hide custom cursor
      if (
        target.closest(".monaco-editor") ||
        target.closest(".cm-editor") ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "INPUT" ||
        target.closest("[data-editor]")
      ) {
        setVariant("none");
        setActiveElement(null);
        return;
      }

      if (target.closest("button") || target.closest("a") || target.closest("[role='button']")) {
        // Find exact element to calculate magnetic bounds if it opts in
        const interactiveEl = target.closest("button, a, [role='button']") as HTMLElement;
        if (interactiveEl.hasAttribute("data-magnetic")) {
          setVariant("magnetic");
          setActiveElement(interactiveEl);
        } else {
          setVariant("button");
          setActiveElement(null);
        }
        return;
      }

      const computedStyle = window.getComputedStyle(target);
      if (computedStyle.cursor === "text") {
        setVariant("text");
        setActiveElement(null);
        return;
      }

      setVariant("default");
      setActiveElement(null);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (typeof document !== 'undefined') {
        document.body.classList.remove("custom-cursor-active");
      }
    };
  }, [isTouchDevice, prefersReducedMotion, mouseX, mouseY, velocityX, velocityY, setVariant, setActiveElement]);

  // Handle global class for native cursor hiding safely (SSR friendly)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isTouchDevice || prefersReducedMotion || !isVisible || variant === "none") {
      document.body.classList.remove("custom-cursor-active");
    } else {
      document.body.classList.add("custom-cursor-active");
    }
  }, [isTouchDevice, prefersReducedMotion, isVisible, variant]);

  if (isTouchDevice || prefersReducedMotion) return null;
  if (!isVisible || variant === "none") return null;

  // Variants design
  const variants = {
    default: {
      width: 24,
      height: 24,
      x: "-50%",
      y: "-50%",
      backgroundColor: "rgba(100, 100, 255, 0.2)",
      backdropFilter: "blur(2px)",
      border: "1px solid rgba(100, 150, 255, 0.4)",
      borderRadius: "50%",
      scale: 1,
    },
    button: {
      width: 48,
      height: 48,
      x: "-50%",
      y: "-50%",
      backgroundColor: "rgba(100, 150, 255, 0.15)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(100, 150, 255, 0.5)",
      borderRadius: "50%",
      scale: 1.2,
    },
    text: {
      width: 4,
      height: 24,
      x: "-50%",
      y: "-50%",
      backgroundColor: "rgba(100, 150, 255, 0.8)",
      borderRadius: "2px",
      scale: 1,
      border: "none",
      backdropFilter: "none",
    },
    magnetic: {
      width: 64,
      height: 64,
      x: "-50%",
      y: "-50%",
      backgroundColor: "transparent",
      border: "2px solid rgba(100, 150, 255, 0.5)",
      borderRadius: "50%",
      scale: 1.5,
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        style={{
          x: smoothX,
          y: smoothY,
          rotateX,
          rotateY,
          perspective: 1000,
        }}
        initial="default"
        animate={variant}
        variants={variants}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
      >
        {variant === "default" && (
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full absolute shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        )}
      </motion.div>

      {/* Particle Trail */}
      <ParticleTrail mouseX={smoothX} mouseY={smoothY} isVisible={isVisible && variant === "default"} />
    </div>
  );
}

function ParticleTrail({ mouseX, mouseY, isVisible }: { mouseX: any, mouseY: any, isVisible: boolean }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);
  const lastEmitTime = useRef(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const unsubscribe = mouseX.onChange((x: number) => {
      const y = mouseY.get();
      const now = performance.now();
      if (now - lastEmitTime.current > 40) { // Emit every 40ms
        const newParticle = { id: idRef.current++, x, y };
        setParticles(p => [...p.slice(-15), newParticle]); // keep last 15
        lastEmitTime.current = now;
      }
    });

    return () => unsubscribe();
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.6, scale: 0.8, x: p.x - 4, y: p.y - 4 }}
            animate={{ opacity: 0, scale: 0, y: p.y - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary/40 pointer-events-none mix-blend-screen blur-[1px]"
          />
        ))}
      </AnimatePresence>
    </>
  );
}
