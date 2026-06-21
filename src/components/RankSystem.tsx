import React from "react";
import { cn } from "@/lib/utils";

// Animated Rank System Component
// Maps a rank level to an animated SVG icon

export function AnimatedRankCrown({
  rankName,
  className,
}: {
  rankName: string;
  className?: string;
}) {
  const getRankDetails = () => {
    const name = rankName.toLowerCase();
    if (name.includes("diamond") || name.includes("master")) {
      return {
        gradId: "rankDiamond",
        stops: [
          <stop key="1" offset="0%" stopColor="#00c6ff" />,
          <stop key="2" offset="100%" stopColor="#0072ff" />,
        ],
        glow: "rgba(0, 198, 255, 0.6)",
      };
    }
    if (name.includes("platinum") || name.includes("elite")) {
      return {
        gradId: "rankPlat",
        stops: [
          <stop key="1" offset="0%" stopColor="#E0EAFC" />,
          <stop key="2" offset="100%" stopColor="#CFDEF3" />,
        ],
        glow: "rgba(224, 234, 252, 0.6)",
      };
    }
    if (name.includes("gold")) {
      return {
        gradId: "rankGold",
        stops: [
          <stop key="1" offset="0%" stopColor="#F2C94C" />,
          <stop key="2" offset="100%" stopColor="#F2994A" />,
        ],
        glow: "rgba(242, 201, 76, 0.6)",
      };
    }
    if (name.includes("silver")) {
      return {
        gradId: "rankSilver",
        stops: [
          <stop key="1" offset="0%" stopColor="#bdc3c7" />,
          <stop key="2" offset="100%" stopColor="#2c3e50" />,
        ],
        glow: "rgba(189, 195, 199, 0.6)",
      };
    }
    // Bronze/Default
    return {
      gradId: "rankBronze",
      stops: [
        <stop key="1" offset="0%" stopColor="#b06ab3" />,
        <stop key="2" offset="100%" stopColor="#4568dc" />,
      ],
      glow: "rgba(176, 106, 179, 0.6)",
    };
  };

  const { gradId, stops, glow } = getRankDetails();

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
    >
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xl animate-bounce-slow">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {stops}
          </linearGradient>
        </filter>
        </defs>
        <path
          d="M10 40 L30 80 L70 80 L90 40 L65 55 L50 20 L35 55 Z"
          fill={`url(#${gradId})`}
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="40" r="4" fill="#fff" className="animate-pulse" />
        <circle cx="50" cy="20" r="5" fill="#fff" className="animate-pulse" />
        <circle cx="90" cy="40" r="4" fill="#fff" className="animate-pulse" />
      </svg>
    </div>
  );
}
