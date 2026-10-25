import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

export interface CourseLessonIntroProps {
  [key: string]: unknown;
  courseTitle: string;
  lessonTitle: string;
  category: string;
  level: string;
  durationMinutes: number;
  tags?: string[];
  instructorName?: string;
}

export const CourseLessonIntro: React.FC<CourseLessonIntroProps> = ({
  courseTitle = "Course Title",
  lessonTitle = "Lesson Title",
  category = "Development",
  level = "Beginner",
  durationMinutes = 10,
  tags = ["Learnify AI", "Masterclass"],
  instructorName = "Learnify AI Curriculum",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance spring animations
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const titleProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14 },
  });

  const cardOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const badgeOffset = interpolate(frame, [15, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background ambient pulsing gradient
  const bgPulse = Math.sin(frame / 20) * 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07090E",
        color: "#F8FAFC",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Dynamic Ambient Background Glows */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: 500 + bgPulse * 3,
          height: 500 + bgPulse * 3,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: 600 - bgPulse * 2,
          height: 600 - bgPulse * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Grid line overlay for high-tech aesthetic */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.7,
        }}
      />

      {/* Central Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1100,
          width: "90%",
          textAlign: "center",
          opacity: cardOpacity,
          transform: `translateY(${badgeOffset * 0.4}px)`,
        }}
      >
        {/* Learnify AI Brand Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            transform: `scale(${logoScale})`,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
              boxShadow: "0 0 12px #22C55E",
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#94A3B8",
            }}
          >
            Learnify AI · Interactive Masterclass
          </span>
        </div>

        {/* Course Category & Level Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: "4px 14px",
              borderRadius: 6,
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818CF8",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            {category}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: "4px 14px",
              borderRadius: 6,
              background: "rgba(255, 255, 255, 0.08)",
              color: "#CBD5E1",
            }}
          >
            {level} Level
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: "4px 14px",
              borderRadius: 6,
              background: "rgba(34, 197, 94, 0.12)",
              color: "#4ADE80",
              border: "1px solid rgba(34, 197, 94, 0.25)",
            }}
          >
            {durationMinutes} Min Session
          </span>
        </div>

        {/* Course Super-Title */}
        <h3
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#94A3B8",
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          {courseTitle}
        </h3>

        {/* Main Lesson Title */}
        <h1
          style={{
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: "0 0 28px 0",
            background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: `scale(${interpolate(titleProgress, [0, 1], [0.94, 1])})`,
          }}
        >
          {lessonTitle}
        </h1>

        {/* Topic Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 8,
          }}
        >
          {tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#64748B",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Branding Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          paddingTop: 18,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
          learnifyai.in · Curriculum by {instructorName}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Full Hands-on Lab & Assessment
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
