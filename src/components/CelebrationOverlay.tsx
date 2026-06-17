import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

type CelebrationOverlayProps = {
  show: boolean;
  title: string;
  message?: string;
  withSound?: boolean;
  durationMs?: number;
  onDone?: () => void;
};

export function CelebrationOverlay({
  show,
  title,
  message,
  withSound = false,
  durationMs,
  onDone,
}: CelebrationOverlayProps) {
  useEffect(() => {
    if (!show || !durationMs || !onDone) return;
    const timer = window.setTimeout(onDone, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onDone, show]);

  useEffect(() => {
    if (!show || !withSound) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.09);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + index * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.09 + 0.24);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime + index * 0.09);
      oscillator.stop(ctx.currentTime + index * 0.09 + 0.26);
    });
    const closeTimer = window.setTimeout(() => void ctx.close(), 900);
    return () => window.clearTimeout(closeTimer);
  }, [show, withSound]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none grid place-items-center overflow-hidden bg-background/20 backdrop-blur-sm">
      {Array.from({ length: 26 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-glow"
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: Math.cos(i * 0.75) * (160 + (i % 6) * 28),
            y: Math.sin(i * 0.75) * (130 + (i % 5) * 24),
            scale: [0, 1, 0.3],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.2, ease: "easeOut", delay: (i % 5) * 0.025 }}
        />
      ))}
      <motion.div
        className="rounded-2xl border bg-card px-8 py-7 text-center shadow-card max-w-sm mx-4"
        initial={{ y: 24, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <div className="mx-auto h-14 w-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center">
          <Trophy className="h-7 w-7" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs uppercase tracking-widest font-semibold">Congratulations</span>
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>
        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
      </motion.div>
    </div>
  );
}
