import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface CourseLessonExplainerProps {
  [key: string]: unknown;
  courseTitle: string;
  lessonTitle: string;
  category: string;
  level: string;
  durationMinutes: number;
  audioFileName?: string;
  instructorName?: string;
}

export const CourseLessonExplainer: React.FC<CourseLessonExplainerProps> = ({
  courseTitle = "Designing User Interfaces and Experiences (UI & UX)",
  lessonTitle = "Mastering Intuitive UI & Design Systems",
  category = "UI/UX Design",
  level = "Beginner to Pro",
  durationMinutes = 15,
  audioFileName = "videos/lesson-narration.mp3",
  instructorName = "Learnify AI Curriculum Team",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient pulse
  const bgShift = Math.sin(frame / 25) * 20;

  // Live subtitles based on frame ranges
  const getSubtitle = () => {
    if (frame < 180) {
      return "Welcome to Learnify AI. In this masterclass, we explore the core principles of UI/UX.";
    }
    if (frame < 300) {
      return "Every great product begins with human-centered design and clear visual hierarchy.";
    }
    if (frame < 440) {
      return "Master responsive auto layout, fluid typography, and interactive design components.";
    }
    return "Let's build your next design system — right here on Learnify AI.";
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080F",
        color: "#F8FAFC",
        fontFamily: "'Space Grotesk', 'DM Sans', -apple-system, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── High-Fidelity Audio Narration ── */}
      {audioFileName && <Audio src={staticFile(audioFileName)} />}

      {/* ── Ambient Background Lighting ── */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 600 + bgShift * 2,
          height: 600 + bgShift * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 700 - bgShift * 2,
          height: 700 - bgShift * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Grid Pattern Overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.8,
        }}
      />

      {/* ── Top Header Navigation Bar ── */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Img
            src={staticFile("images/learnify-logo-dark.png")}
            style={{
              height: 44,
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 12px rgba(56, 189, 248, 0.25))",
            }}
          />
        </div>

        {/* Live Audio Activity Waveform */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginRight: 6 }}>
            AI VOICE ON
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const barHeight = Math.max(6, Math.abs(Math.sin((frame + i * 15) / 6)) * 22);
            return (
              <div
                key={i}
                style={{
                  width: 3,
                  height: barHeight,
                  backgroundColor: "#22C55E",
                  borderRadius: 2,
                  boxShadow: "0 0 6px rgba(34, 197, 94, 0.6)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SCENE 1: Welcome & Course Hook (Frames 0 - 180 / 0 - 6s)               */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={180}>
        <SceneIntro
          frame={frame}
          fps={fps}
          courseTitle={courseTitle}
          lessonTitle={lessonTitle}
          category={category}
          level={level}
          durationMinutes={durationMinutes}
        />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SCENE 2: Core Architecture & 3 Pillars (Frames 180 - 420 / 6 - 14s)    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Sequence from={180} durationInFrames={240}>
        <ScenePillars frame={frame - 180} fps={fps} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SCENE 3: Hands-on Lab & CTA Roadmap (Frames 420 - 600 / 14 - 20s)      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Sequence from={420} durationInFrames={180}>
        <SceneOutro
          frame={frame - 420}
          fps={fps}
          lessonTitle={lessonTitle}
          instructorName={instructorName}
        />
      </Sequence>

      {/* ── Bottom Subtitle Bar & Progress Tracker ── */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 48,
          right: 48,
          zIndex: 30,
        }}
      >
        {/* Subtitle Card */}
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto 18px auto",
            textAlign: "center",
            padding: "10px 24px",
            borderRadius: 12,
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 500, color: "#E2E8F0", letterSpacing: "0.01em" }}>
            {getSubtitle()}
          </span>
        </div>

        {/* Dynamic Timeline Scrub Indicator */}
        <div
          style={{
            height: 4,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(frame / 600) * 100}%`,
              background: "linear-gradient(90deg, #6366F1, #A855F7, #22C55E)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 1: Welcome & Course Hook ──────────────────────────────────────────
const SceneIntro: React.FC<{
  frame: number;
  fps: number;
  courseTitle: string;
  lessonTitle: string;
  category: string;
  level: string;
  durationMinutes: number;
}> = ({ frame, fps, courseTitle, lessonTitle, category, level, durationMinutes }) => {
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20, 160, 180], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        textAlign: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 18px",
          borderRadius: 999,
          background: "rgba(99, 102, 241, 0.12)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "#818CF8",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 20,
          transform: `scale(${scale})`,
        }}
      >
        ✦ {category} · {level}
      </div>

      <h2
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#94A3B8",
          margin: "0 0 16px 0",
        }}
      >
        {courseTitle}
      </h2>

      <h1
        style={{
          fontSize: 58,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          margin: "0 0 24px 0",
          background: "linear-gradient(135deg, #FFFFFF 20%, #CBD5E1 70%, #94A3B8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {lessonTitle}
      </h1>

      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        <span style={{ fontSize: 13, background: "rgba(255, 255, 255, 0.08)", padding: "6px 16px", borderRadius: 8, color: "#CBD5E1" }}>
          ⏱ {durationMinutes} Min Session
        </span>
        <span style={{ fontSize: 13, background: "rgba(34, 197, 94, 0.15)", padding: "6px 16px", borderRadius: 8, color: "#4ADE80", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
          ✓ Verified Certificate Track
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: 3 Pillars of Architecture ──────────────────────────────────────
const ScenePillars: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = interpolate(frame, [0, 20, 220, 240], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const card1 = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const card2 = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const card3 = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  const pillars = [
    {
      num: "01",
      title: "Visual Hierarchy",
      desc: "Guiding user attention through weight, scale, and high-contrast focal points.",
      accent: "#6366F1",
      springVal: card1,
    },
    {
      num: "02",
      title: "Auto Layout Grids",
      desc: "Responsive constraints that adapt seamlessly from mobile viewports to wide displays.",
      accent: "#A855F7",
      springVal: card2,
    },
    {
      num: "03",
      title: "Design Systems",
      desc: "Reusable component tokens, consistent typography scales, and unified micro-states.",
      accent: "#22C55E",
      springVal: card3,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        padding: "0 60px",
      }}
    >
      <div style={{ fontSize: 13, color: "#818CF8", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
        Core Foundation
      </div>
      <h2 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 44px 0", letterSpacing: "-0.02em" }}>
        The 3 Pillars of Great Design
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, width: "100%" }}>
        {pillars.map((p, i) => (
          <div
            key={i}
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              borderRadius: 18,
              padding: "32px 24px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
              transform: `scale(${interpolate(p.springVal, [0, 1], [0.85, 1])}) translateY(${interpolate(p.springVal, [0, 1], [30, 0])}px)`,
              opacity: interpolate(p.springVal, [0, 1], [0, 1]),
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: p.accent,
              }}
            />
            <div style={{ fontSize: 32, fontWeight: 800, color: p.accent, marginBottom: 16 }}>
              {p.num}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#F1F5F9" }}>
              {p.title}
            </div>
            <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Practical Lab & Call to Action ─────────────────────────────────
const SceneOutro: React.FC<{
  frame: number;
  fps: number;
  lessonTitle: string;
  instructorName: string;
}> = ({ frame, fps, lessonTitle, instructorName }) => {
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        textAlign: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          background: "rgba(34, 197, 94, 0.12)",
          border: "1px solid rgba(34, 197, 94, 0.35)",
          color: "#4ADE80",
          fontSize: 13,
          fontWeight: 700,
          padding: "6px 20px",
          borderRadius: 999,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 24,
          transform: `scale(${scale})`,
        }}
      >
        ✓ Ready for Hands-On Practice
      </div>

      <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px 0", maxWidth: 900 }}>
        Build Your Next Project with Real Confidence
      </h2>

      <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 650, margin: "0 0 36px 0", lineHeight: 1.6 }}>
        Proceed to the interactive workspace below to explore code blocks, complete the assessment, and earn verified credentials.
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 32px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          color: "#FFF",
          fontWeight: 700,
          fontSize: 16,
          boxShadow: "0 8px 28px rgba(79, 70, 229, 0.45)",
          transform: `scale(${scale})`,
        }}
      >
        <span>Begin Interactive Lesson</span>
        <span>→</span>
      </div>
    </AbsoluteFill>
  );
};
