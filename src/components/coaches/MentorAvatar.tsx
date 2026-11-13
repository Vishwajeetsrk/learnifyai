import React from "react";
import { cn } from "@/lib/utils";
import type { MentorRole } from "./mentorData";
import { Sparkles } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type MentorStatus = "available" | "thinking" | "responding" | "idle";

interface MentorAvatarProps {
  mentor: MentorRole;
  size?: AvatarSize;
  status?: MentorStatus;
  selected?: boolean;
  showStatusIndicator?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP: Record<AvatarSize, { container: string; icon: string; badge: string; text: string; ring: string }> = {
  xs: { container: "w-6 h-6", icon: "w-3 h-3", badge: "w-2 h-2 -bottom-0.5 -right-0.5", text: "text-[10px]", ring: "ring-1" },
  sm: { container: "w-8 h-8", icon: "w-4 h-4", badge: "w-2.5 h-2.5 -bottom-0.5 -right-0.5", text: "text-xs font-bold", ring: "ring-2" },
  md: { container: "w-11 h-11", icon: "w-5 h-5", badge: "w-3 h-3 -bottom-0.5 -right-0.5", text: "text-sm font-bold", ring: "ring-2" },
  lg: { container: "w-14 h-14", icon: "w-7 h-7", badge: "w-3.5 h-3.5 bottom-0 right-0", text: "text-base font-bold", ring: "ring-2" },
  xl: { container: "w-20 h-20", icon: "w-10 h-10", badge: "w-4 h-4 bottom-0.5 right-0.5", text: "text-xl font-bold", ring: "ring-4" },
};

export function MentorAvatar({
  mentor,
  size = "md",
  status = "available",
  selected = false,
  showStatusIndicator = true,
  className,
  onClick,
}: MentorAvatarProps) {
  const cfg = SIZE_MAP[size];
  const IconComp = mentor.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative shrink-0 flex items-center justify-center rounded-2xl select-none transition-all duration-200",
        cfg.container,
        mentor.avatarBg,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105",
        onClick && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
      style={{
        boxShadow: `0 4px 20px -2px ${mentor.accentHex}33`,
      }}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

      {/* Thinking animated ring */}
      {status === "thinking" && (
        <span
          className="absolute -inset-1 rounded-2xl animate-spin border-2 border-dashed pointer-events-none"
          style={{ borderColor: mentor.accentHex }}
        />
      )}

      {/* Responding subtle pulse glow */}
      {status === "responding" && (
        <span
          className="absolute -inset-1 rounded-2xl animate-pulse bg-current/20 pointer-events-none"
          style={{ color: mentor.accentHex }}
        />
      )}

      {/* Mentor Icon / Identifier */}
      <div className="relative z-10 flex items-center justify-center">
        <IconComp className={cn(cfg.icon, "drop-shadow-sm transition-transform")} />
      </div>

      {/* Status indicator: AI Mentor Presence */}
      {showStatusIndicator && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-background z-20 flex items-center justify-center",
            cfg.badge,
            status === "available" && "bg-emerald-500",
            status === "thinking" && "bg-amber-400 animate-pulse",
            status === "responding" && "bg-indigo-400 animate-ping",
            status === "idle" && "bg-slate-400"
          )}
          title={`AI Mentor · ${status}`}
        >
          {size === "xl" && (
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
          )}
        </span>
      )}
    </div>
  );
}

export default MentorAvatar;
