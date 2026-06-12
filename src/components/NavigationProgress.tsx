import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Slim, animated top progress bar that shows while routes/loaders are pending.
 * Pure CSS — no extra deps. Pinned to the very top of the viewport.
 */
export function NavigationProgress() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading || s.isTransitioning,
  });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let hideT: ReturnType<typeof setTimeout> | undefined;
    if (isLoading) {
      setVisible(true);
      setProgress(8);
      const tick = () => {
        setProgress((p) => (p < 88 ? p + Math.max(0.5, (90 - p) * 0.04) : p));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (visible) {
      setProgress(100);
      hideT = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (hideT) clearTimeout(hideT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (!visible) return null;
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
          boxShadow: "0 0 12px hsl(var(--primary) / 0.6)",
          transition: "width 200ms ease-out, opacity 200ms ease-out",
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
