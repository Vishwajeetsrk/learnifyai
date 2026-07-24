import { useState, useCallback, useMemo } from "react";
import { AdvancedVideoPlayer } from "./video-player/AdvancedVideoPlayer";
import { CustomVideoPlayer } from "./CustomVideoPlayer";
import type { LessonSlide, TranscriptEntry, SubtitleTrack } from "./video-player/types";

interface CoursePlayerProps {
  url: string;
  thumbnailUrl?: string;
  startSeconds?: number;
  playbackRate?: number;
  restrictDownload?: boolean;
  restrictSpeed?: boolean;
  onReady?: () => void;
  onError?: (e: any) => void;
  onProgress?: (state: { playedSeconds: number; played: number; loaded: number }) => void;
  onEnded?: () => void;

  // Advanced mode props
  mode?: "basic" | "advanced";
  title?: string;
  lessons?: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    videoUrl?: string;
  }[];
  currentLessonId?: string;
  onLessonClick?: (id: string) => void;
  onComplete?: (lessonId: string) => void;
  transcriptEntries?: TranscriptEntry[];
  subtitleTracks?: SubtitleTrack[];
  slides?: LessonSlide[];
}

export function CoursePlayer({
  url,
  thumbnailUrl,
  startSeconds,
  playbackRate,
  restrictDownload,
  restrictSpeed,
  onReady,
  onError,
  onProgress,
  onEnded,
  mode = "basic",
  title = "",
  lessons = [],
  currentLessonId,
  onLessonClick,
  onComplete,
  transcriptEntries = [],
  subtitleTracks = [],
  slides = [],
}: CoursePlayerProps) {
  // Basic mode: use the existing CustomVideoPlayer
  if (mode === "basic") {
    return (
      <CustomVideoPlayer
        url={url}
        thumbnailUrl={thumbnailUrl}
        startSeconds={startSeconds}
        playbackRate={playbackRate}
        restrictDownload={restrictDownload}
        restrictSpeed={restrictSpeed}
        onReady={onReady}
        onError={onError}
        onProgress={onProgress}
        onEnded={onEnded}
      />
    );
  }

  // Advanced mode: use the AdvancedVideoPlayer
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

  return (
    <AdvancedVideoPlayer
      videoUrl={url}
      thumbnailUrl={thumbnailUrl}
      title={title}
      lessons={lessons}
      currentLessonId={currentLessonId || ""}
      onLessonClick={onLessonClick || (() => {})}
      onComplete={onComplete}
      transcriptEntries={transcriptEntries}
      subtitleTracks={subtitleTracks}
      slides={slides}
      isYouTube={isYouTube}
    />
  );
}
