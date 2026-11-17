import React from "react";
import { cn } from "@/lib/utils";
import type { MentorRole } from "./mentorData";
import { CuteMentorFace, type FaceExpression } from "./CuteMentorFace";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type MentorStatus = "available" | "thinking" | "responding" | "idle";

interface MentorAvatarProps {
  mentor: MentorRole;
  size?: AvatarSize;
  status?: MentorStatus;
  selected?: boolean;
  showStatusIndicator?: boolean;
  isSpeaking?: boolean;
  customColor?: string;
  className?: string;
  onClick?: () => void;
}

const BADGE_MAP: Record<AvatarSize, string> = {
  xs: "w-2 h-2 -bottom-0.5 -right-0.5",
  sm: "w-2.5 h-2.5 -bottom-0.5 -right-0.5",
  md: "w-3.5 h-3.5 -bottom-0.5 -right-0.5",
  lg: "w-4 h-4 bottom-0 right-0",
  xl: "w-5 h-5 bottom-0.5 right-0.5",
};

export function MentorAvatar({
  mentor,
  size = "md",
  status = "available",
  selected = false,
  showStatusIndicator = true,
  isSpeaking = false,
  customColor,
  className,
  onClick,
}: MentorAvatarProps) {
  const badgeCls = BADGE_MAP[size];

  // Map status to cute face expression
  let expression: FaceExpression = "idle";
  if (status === "thinking") expression = "thinking";
  else if (status === "responding") expression = "happy";
  if (isSpeaking) expression = "talking";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative shrink-0 flex items-center justify-center rounded-full select-none transition-all duration-300",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105",
        onClick && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
      title={`${mentor.name} · ${mentor.title}`}
    >
      {/* Animated Cute Character Face directly modeled after user reference image */}
      <CuteMentorFace
        mentor={mentor}
        size={size}
        expression={expression}
        isSpeaking={isSpeaking}
        customColor={customColor}
        showOnlineBadge={showStatusIndicator && status === "available"}
      />

      {/* Special status indicator for non-idle states (thinking / responding) */}
      {showStatusIndicator && status !== "available" && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-background z-20 flex items-center justify-center transition-all",
            badgeCls,
            status === "thinking" && "bg-amber-400 animate-pulse",
            status === "responding" && "bg-indigo-400 animate-ping",
            status === "idle" && "bg-slate-400"
          )}
          title={`AI Mentor · ${status}`}
        >
          {size === "xl" && (
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
          )}
        </span>
      )}
    </div>
  );
}

export default MentorAvatar;
