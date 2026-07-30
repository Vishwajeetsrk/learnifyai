import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { cn } from "@/lib/utils";
import { Hand } from "lucide-react";

interface ThreeAvatarCanvasProps {
  modelUrl?: string;
  textureUrl?: string;
  aiSpeaking?: boolean;
  viseme?: string;
  avatarName?: string;
  avatarTitle?: string;
  className?: string;
}

export function ThreeAvatarCanvas({
  modelUrl = "/avatars/eric/rp_eric_rigged_001_yup_a.fbx",
  textureUrl = "/avatars/eric/tex/rp_eric_rigged_001_dif.jpg",
  aiSpeaking = false,
  viseme = "X",
  avatarName = "Eric Vance",
  avatarTitle = "3D Technical Lead",
  className = "w-full h-full",
}: ThreeAvatarCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isWaving, setIsWaving] = useState(true);

  // Trigger a friendly initial wave when avatar mounts
  useEffect(() => {
    setIsWaving(true);
    const timer = setTimeout(() => setIsWaving(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Studio Gradient Background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, h / 1.1);
      bgGrad.addColorStop(0, "#1e1b4b");
      bgGrad.addColorStop(0.6, "#0f172a");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ambient Glowing Studio Lights
      const glowGrad = ctx.createRadialGradient(w / 2, 90, 5, w / 2, 90, 110);
      glowGrad.addColorStop(0, "rgba(99, 102, 241, 0.3)");
      glowGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      const time = frame * 0.05;
      const headTilt = Math.sin(time * 0.8) * 4;
      const headBob = Math.cos(time * 1.2) * 2.5;

      const centerX = w / 2 + headTilt;
      const centerY = 100 + headBob;

      // Body / Suit Shoulders
      ctx.save();
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.ellipse(w / 2, 230, 95, 65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shirt Collar & Tie
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(w / 2 - 22, 170);
      ctx.lineTo(w / 2, 210);
      ctx.lineTo(w / 2 + 22, 170);
      ctx.fill();

      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.moveTo(w / 2 - 6, 175);
      ctx.lineTo(w / 2 + 6, 175);
      ctx.lineTo(w / 2 + 8, 220);
      ctx.lineTo(w / 2, 235);
      ctx.lineTo(w / 2 - 8, 220);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Waving Right Arm (Wave Animation)
      ctx.save();
      const waveAngle = isWaving ? Math.sin(time * 6) * 0.35 : 0;
      ctx.translate(w / 2 + 65, 170);
      ctx.rotate(waveAngle - 0.4);

      // Arm Suit
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(-10, -5, 20, 60, 8);
      ctx.fill();

      // Hand Waving
      ctx.fillStyle = "#fdba74";
      ctx.beginPath();
      ctx.arc(0, 62, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Head Base / Skin
      ctx.save();
      ctx.fillStyle = "#fdba74";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 44, 52, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair (Professional Cut)
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 24, 46, 26, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      // Eyes & Blinking Animation
      const blink = Math.sin(time * 0.5) > 0.96 ? 0.1 : 1;
      ctx.fillStyle = "#0f172a";
      // Left Eye
      ctx.beginPath();
      ctx.ellipse(centerX - 16, centerY - 6, 5, 6 * blink, 0, 0, Math.PI * 2);
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.ellipse(centerX + 16, centerY - 6, 5, 6 * blink, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye Catchlights
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX - 18, centerY - 8, 1.8, 0, Math.PI * 2);
      ctx.arc(centerX + 14, centerY - 8, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX - 16, centerY - 16, 9, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(centerX + 16, centerY - 16, 9, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Professional Smile Curve
      const mouthOpen = aiSpeaking ? Math.abs(Math.sin(time * 12)) * 12 + 4 : 2;
      ctx.fillStyle = "#be123c";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 22, 14, mouthOpen, 0, 0, Math.PI);
      ctx.fill();

      // Smile Curve Lips Outline
      ctx.strokeStyle = "#9f1239";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY + 18, 16, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      ctx.restore();

      // Audio Equalizer Wave Animation (When AI is speaking)
      if (aiSpeaking) {
        ctx.save();
        const bars = 18;
        const startX = w / 2 - (bars * 6) / 2;
        ctx.fillStyle = "#6366f1";
        for (let i = 0; i < bars; i++) {
          const barH = Math.abs(Math.sin(time * 10 + i * 0.5)) * 18 + 4;
          ctx.fillRect(startX + i * 6, h - 22 - barH / 2, 4, barH);
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [aiSpeaking, isWaving]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 2.5D/3D Avatar Canvas */}
      <div className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-950 flex items-center justify-center">
        <canvas ref={canvasRef} width={340} height={240} className="w-full h-full object-cover" />

        {/* Live Speaking / Waving Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white shadow-md">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              aiSpeaking ? "bg-emerald-400 animate-ping" : "bg-indigo-400",
            )}
          />
          <span>{aiSpeaking ? "Speaking & Explaining..." : isWaving ? "Waving Hello!" : "Listening & Observing"}</span>
        </div>

        {/* Interactive Wave Trigger Button */}
        <button
          onClick={() => setIsWaving((w) => !w)}
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-bold transition backdrop-blur-sm cursor-pointer shadow"
          title="Trigger Friendly Wave"
        >
          <Hand className="h-3 w-3" /> Wave
        </button>
      </div>

      {/* Avatar Identity Footer */}
      <div className="mt-2.5 text-center space-y-0.5">
        <div className="text-xs font-black text-foreground flex items-center justify-center gap-1.5">
          <span>{avatarName}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[9px] font-extrabold border border-indigo-200 dark:border-indigo-800">
            3D AI Lead
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground font-semibold">{avatarTitle}</p>
      </div>
    </div>
  );
}
