import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useServerFn } from "@tanstack/react-start";
import { translateLessonTranscript } from "@/lib/lesson-transcript.functions";
import { cleanQuizQuestion } from "@/lib/quiz-cleaner";
import {
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  SkipBack,
  MessageSquare,
  PictureInPicture,
  List,
  Subtitles,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type VideoSettings,
  type SubtitleTrack,
  type TranscriptEntry,
  type LessonSlide,
  type QuizCheckpoint,
  type CaptionStyle,
  DEFAULT_CAPTION_STYLE,
  KEYBOARD_SHORTCUTS,
  CAPTION_FONT_SIZES,
  LANGUAGES,
  formatTimestamp,
} from "./types";
import { TranscriptPanel } from "./TranscriptPanel";
import { CaptionPanel } from "./CaptionPanel";
import { AdvancedSettingsPanel } from "./AdvancedSettingsPanel";
import { KeyboardShortcutsOverlay } from "./KeyboardShortcutsOverlay";

interface AdvancedVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  lessons: { id: string; title: string; duration: string; completed: boolean; videoUrl?: string }[];
  currentLessonId: string;
  onLessonClick: (id: string) => void;
  onComplete?: (lessonId: string) => void;
  onEnded?: () => void;
  onProgress?: (state: { playedSeconds: number; played: number; loaded: number }) => void;
  onReady?: () => void;
  onError?: (e?: unknown) => void;
  startSeconds?: number;
  playbackRate?: number;
  restrictDownload?: boolean;
  restrictSpeed?: boolean;
  transcriptEntries?: TranscriptEntry[];
  subtitleTracks?: SubtitleTrack[];
  slides?: LessonSlide[];
  isYouTube?: boolean;
  lessonId?: string;
  courseId?: string;
  quiz?: QuizCheckpoint[];
}

export function AdvancedVideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  lessons,
  currentLessonId,
  onLessonClick,
  onComplete,
  onEnded,
  onProgress,
  onReady,
  onError,
  startSeconds = 0,
  playbackRate = 1,
  restrictDownload = false,
  restrictSpeed = false,
  transcriptEntries = [],
  subtitleTracks = [],
  slides = [],
  isYouTube = false,
  lessonId,
  courseId,
  quiz = [],
}: AdvancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoveringProgress, setHoveringProgress] = useState(false);
  const [progressHoverX, setProgressHoverX] = useState(0);

  // Panel states
  const [showSettings, setShowSettings] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSlides, setShowSlides] = useState(slides.length > 0);
  const [isPiP, setIsPiP] = useState(false);

  // Quiz checkpoints
  const [doneCheckpoints, setDoneCheckpoints] = useState<Set<string>>(new Set());
  const [activeCheckpoint, setActiveCheckpoint] = useState<QuizCheckpoint | null>(null);
  const [pickedOption, setPickedOption] = useState<number | null>(null);

  // Settings
  const [settings, setSettings] = useState<VideoSettings>({
    playbackRate,
    captionsEnabled: false,
    captionStyle: DEFAULT_CAPTION_STYLE,
    autoNextLesson: true,
    resumePlayback: true,
    focusMode: false,
    theaterMode: false,
  });

  // Subtitle tracks
  const [tracks, setTracks] = useState<SubtitleTrack[]>(subtitleTracks);
  const [activeTrack, setActiveTrack] = useState<SubtitleTrack | null>(null);
  const [audioLanguage, setAudioLanguage] = useState<string>("original");

  // Install caption tracks from real sources: explicit subtitle tracks, or the lesson transcript.
  const installedTracksRef = useRef<string>("");
  useEffect(() => {
    const sig = subtitleTracks.length
      ? `st:${subtitleTracks.map((t) => t.id).join(",")}`
      : transcriptEntries.length > 0
        ? `te:${transcriptEntries.length}:${transcriptEntries[0]?.text ?? ""}:${transcriptEntries[transcriptEntries.length - 1]?.text ?? ""}`
        : "none";
    if (installedTracksRef.current === sig) return;
    const wasEmpty = !installedTracksRef.current || installedTracksRef.current === "none";
    installedTracksRef.current = sig;

    if (subtitleTracks.length > 0) {
      const first = subtitleTracks.find((t) => t.isDefault) ?? subtitleTracks[0];
      setTracks(subtitleTracks);
      setActiveTrack(first);
      if (wasEmpty) setSettings((s) => ({ ...s, captionsEnabled: true }));
    } else if (transcriptEntries.length > 0) {
      const derived: SubtitleTrack = {
        id: "lesson-transcript",
        label: "Lesson transcript",
        language: "en",
        cues: transcriptEntries,
        isDefault: true,
      };
      setTracks([derived]);
      setActiveTrack(derived);
      if (wasEmpty) setSettings((s) => ({ ...s, captionsEnabled: true }));
    } else {
      setTracks([]);
      setActiveTrack(null);
    }
  }, [subtitleTracks, transcriptEntries]);

  // Active caption cue
  const activeCue = useMemo(() => {
    if (!activeTrack) return null;
    return activeTrack.cues.find((cue) => currentTime >= cue.start && currentTime <= cue.end);
  }, [activeTrack, currentTime]);

  const activeSlideIndex = useMemo(() => {
    return slides.findIndex(
      (slide) => currentTime >= slide.start && (!slide.end || currentTime < slide.end),
    );
  }, [slides, currentTime]);

  const activeSlide = activeSlideIndex >= 0 ? slides[activeSlideIndex] : slides[0];

  const seekToSlide = useCallback(
    (index: number) => {
      const video = videoRef.current;
      const slide = slides[index];
      if (!video || !slide || isYouTube) return;
      video.currentTime = slide.start;
    },
    [slides, isYouTube],
  );

  // Speech synthesis speaking loop (AI audio track reads the real cue text in the target voice)
  const spokenCueRef = useRef<string | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || audioLanguage === "original" || isYouTube) {
      if (video && audioLanguage === "original") {
        video.muted = muted;
      }
      return;
    }

    video.muted = true;

    if (!activeCue) {
      speechSynthesis.cancel();
      spokenCueRef.current = null;
      return;
    }

    if (spokenCueRef.current !== activeCue.text) {
      speechSynthesis.cancel();
      if (playing) {
        const utterance = new SpeechSynthesisUtterance(activeCue.text);
        utterance.lang = audioLanguage;
        const voices = speechSynthesis.getVoices();
        const matchingVoice = voices.find((v) => v.lang.startsWith(audioLanguage));
        if (matchingVoice) utterance.voice = matchingVoice;
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
        spokenCueRef.current = activeCue.text;
      }
    }
  }, [activeCue, audioLanguage, playing, isYouTube, muted]);

  // Pause/Resume SpeechSynthesis with player play/pause
  useEffect(() => {
    if (audioLanguage === "original") return;
    if (playing) {
      if (speechSynthesis.paused) speechSynthesis.resume();
    } else {
      if (speechSynthesis.speaking) speechSynthesis.pause();
    }
  }, [playing, audioLanguage]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  // Quiz checkpoint trigger: pause at the checkpoint time until answered
  const translateFn = useServerFn(translateLessonTranscript);

  const handleTranslate = useCallback(
    async (targetLang: string): Promise<SubtitleTrack | null> => {
      if (!lessonId || !courseId) return null;
      const res = await translateFn({ data: { lessonId, courseId, targetLang } });
      const text = ((res as any)?.text ?? "") as string;
      if (!text) return null;
      const segs = (((res as any)?.segments ?? []) as TranscriptEntry[]).filter(
        (c) => c && typeof c.text === "string" && c.text.length > 0,
      );
      let cues = segs;
      if (cues.length === 0) {
        const total = duration > 0 ? duration : 600;
        const sentences = text
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (!sentences.length) return null;
        const per = total / sentences.length;
        cues = sentences.map((s, i) => ({ start: i * per, end: (i + 1) * per, text: s }));
      }
      const label = LANGUAGES.find((l) => l.code === targetLang)?.label ?? targetLang;
      const track: SubtitleTrack = {
        id: `translated-${targetLang}`,
        label: `${label} (AI translated)`,
        language: targetLang,
        cues,
        isDefault: false,
      };
      setTracks((prev) => [...prev.filter((t) => t.id !== track.id), track]);
      setActiveTrack(track);
      setSettings((s) => ({ ...s, captionsEnabled: true }));
      return track;
    },
    [lessonId, courseId, duration],
  );

  const currentLessonIndex = lessons.findIndex((l) => l.id === currentLessonId);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    let readyFired = false;
    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      if (
        settings.resumePlayback &&
        startSeconds > 1 &&
        video.duration > 0 &&
        startSeconds < video.duration * 0.95
      ) {
        video.currentTime = startSeconds;
      }
      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.({
        playedSeconds: video.currentTime,
        played: video.duration ? video.currentTime / video.duration : 0,
        loaded: video.duration ? video.buffered.length ? video.buffered.end(video.buffered.length - 1) / video.duration : 0 : 0,
      });
    };
    const onDurationChange = () => setDuration(video.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      onComplete?.(currentLessonId);
      if (settings.autoNextLesson) {
        if (onEndedRef.current) {
          onEndedRef.current();
        } else if (currentLessonIndex < lessons.length - 1) {
          onLessonClick(lessons[currentLessonIndex + 1].id);
        }
      }
    };
    const onErrorEvent = () => onError?.();
    const onBuffered = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onErrorEvent);
    video.addEventListener("progress", onBuffered);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onErrorEvent);
      video.removeEventListener("progress", onBuffered);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [
    isYouTube,
    currentLessonId,
    settings.autoNextLesson,
    settings.resumePlayback,
    startSeconds,
    currentLessonIndex,
    lessons,
    onLessonClick,
    onComplete,
    onProgress,
    onReady,
    onError,
  ]);

  // Playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (video && !isYouTube) video.playbackRate = settings.playbackRate;
  }, [settings.playbackRate, isYouTube]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (playing && !showSettings && !showTranscript && !showCaptions && !showPlaylist) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 4000);
    }
  }, [playing, showSettings, showTranscript, showCaptions, showPlaylist]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [playing, showSettings, showTranscript, showCaptions, showPlaylist, resetControlsTimer]);

  // Fullscreen
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // PiP
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    const onEnterPiP = () => setIsPiP(true);
    const onLeavePiP = () => setIsPiP(false);
    video.addEventListener("enterpictureinpicture", onEnterPiP);
    video.addEventListener("leavepictureinpicture", onLeavePiP);
    return () => {
      video.removeEventListener("enterpictureinpicture", onEnterPiP);
      video.removeEventListener("leavepictureinpicture", onLeavePiP);
    };
  }, [isYouTube]);

  // YouTube iframe: track time/state via the JS postMessage API and support programmatic seek
  const sendYtCommand = useCallback((func: string, args: unknown[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*",
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!isYouTube) return;
    const onMessage = (e: MessageEvent) => {
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d?.event !== "infoDelivery" || !d?.info) return;
        if (typeof d.info.currentTime === "number") setCurrentTime(d.info.currentTime);
        if (typeof d.info.duration === "number" && d.info.duration > 0)
          setDuration(d.info.duration);
        if (typeof d.info.playerState === "number") setPlaying(d.info.playerState === 1);
      } catch {
        /* ignore non-JSON messages */
      }
    };
    window.addEventListener("message", onMessage);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: "learnify-player" }),
        "*",
      );
    } catch {
      /* ignore */
    }
    const poll = setInterval(() => {
      sendYtCommand("getCurrentTime");
      sendYtCommand("getDuration");
      sendYtCommand("getPlayerState");
    }, 1000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(poll);
    };
  }, [isYouTube, sendYtCommand]);

  // Quiz checkpoint trigger: pause at the checkpoint time until answered
  const pauseMedia = useCallback(() => {
    if (isYouTube) sendYtCommand("pauseVideo");
    else videoRef.current?.pause();
  }, [isYouTube, sendYtCommand]);
  const resumeMedia = useCallback(() => {
    if (isYouTube) sendYtCommand("playVideo");
    else videoRef.current?.play().catch(() => {});
  }, [isYouTube, sendYtCommand]);

  useEffect(() => {
    if (quiz.length === 0 || activeCheckpoint || !playing) return;
    const hit = quiz.find((cp) => !doneCheckpoints.has(cp.id) && currentTime >= cp.time - 0.3);
    if (hit) {
      pauseMedia();
      setPickedOption(null);
      setActiveCheckpoint(hit);
    }
  }, [currentTime, playing, quiz, activeCheckpoint, doneCheckpoints, pauseMedia]);

  const closeCheckpoint = useCallback(() => {
    if (activeCheckpoint) {
      setDoneCheckpoints((prev) => new Set(prev).add(activeCheckpoint.id));
    }
    setActiveCheckpoint(null);
    setPickedOption(null);
    resumeMedia();
  }, [activeCheckpoint, resumeMedia]);

  // Lock background scroll when quiz checkpoint or mobile bottom sheets are open
  useEffect(() => {
    const isModalOpen = Boolean(
      activeCheckpoint ||
        showSettings ||
        showTranscript ||
        showPlaylist ||
        showCaptions,
    );
    if (!isModalOpen || typeof document === "undefined") return;

    if (activeCheckpoint || window.innerWidth < 768) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [activeCheckpoint, showSettings, showTranscript, showPlaylist, showCaptions]);

  // Global Escape key listener to close open panels
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSettings) setShowSettings(false);
        if (showTranscript) setShowTranscript(false);
        if (showPlaylist) setShowPlaylist(false);
        if (showCaptions) setShowCaptions(false);
        if (showShortcuts) setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, [showSettings, showTranscript, showPlaylist, showCaptions, showShortcuts]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      const container = containerRef.current;
      const inPlayer =
        !!container &&
        (container.contains(document.activeElement) ||
          container.matches(":hover") ||
          document.fullscreenElement === container);
      if (!inPlayer) return;
      if (isYouTube) {
        if (e.key === "Escape") setShowTranscript(false);
        return;
      }

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      for (const shortcut of KEYBOARD_SHORTCUTS) {
        if (
          shortcut.key.toLowerCase() === key &&
          !!shortcut.ctrl === ctrl &&
          !!shortcut.shift === e.shiftKey &&
          !!shortcut.alt === e.altKey
        ) {
          e.preventDefault();
          handleShortcutAction(shortcut.action);
          break;
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [settings, currentLessonIndex, lessons, showTranscript, showSettings, showCaptions, restrictDownload, isYouTube]);

  const handleShortcutAction = (action: string) => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    switch (action) {
      case "togglePlay":
        video.paused ? video.play() : video.pause();
        break;
      case "toggleMute":
        video.muted = !video.muted;
        break;
      case "volumeUp":
        video.volume = Math.min(1, video.volume + 0.1);
        break;
      case "volumeDown":
        video.volume = Math.max(0, video.volume - 0.1);
        break;
      case "seekForward":
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        break;
      case "seekBackward":
        video.currentTime = Math.max(0, video.currentTime - 5);
        break;
      case "skipBack10":
        video.currentTime = Math.max(0, video.currentTime - 10);
        break;
      case "skipForward10":
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
        break;
      case "toggleCaptions":
        setSettings((s) => ({ ...s, captionsEnabled: !s.captionsEnabled }));
        break;
      case "toggleFullscreen":
        toggleFullscreen();
        break;
      case "toggleTranscript":
        setShowTranscript((v) => !v);
        break;
      case "screenshot":
        if (!restrictDownload) takeScreenshot();
        break;
      case "restart":
        video.currentTime = 0;
        break;
      case "nextLesson":
        if (currentLessonIndex < lessons.length - 1)
          onLessonClick(lessons[currentLessonIndex + 1].id);
        break;
      case "prevLesson":
        if (currentLessonIndex > 0) onLessonClick(lessons[currentLessonIndex - 1].id);
        break;
      case "openSettings":
        setShowSettings((v) => !v);
        break;
      case "closeModal":
        setShowSettings(false);
        setShowTranscript(false);
        setShowCaptions(false);
        setShowShortcuts(false);
        setShowPlaylist(false);
        break;
      default:
        if (action.startsWith("jump")) {
          const pct = parseInt(action.replace("jump", "")) / 100;
          video.currentTime = video.duration * pct;
        }
    }
  };

  // Progress bar interaction
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar || isYouTube) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    setProgressHoverX(((e.clientX - rect.left) / rect.width) * 100);
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await container.requestFullscreen();
    }
  };

  // Toggle PiP
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP error:", err);
    }
  };

  // Screenshot
  const takeScreenshot = () => {
    const video = videoRef.current;
    if (!video || isYouTube || restrictDownload) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_screenshot.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.warn("Screenshot not available for this video:", err);
    }
  };

  // Volume icon
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Format progress time
  const progressTime = formatTimestamp(
    hoveringProgress ? (progressHoverX / 100) * duration : currentTime,
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-xl overflow-hidden select-none",
        settings.theaterMode ? "max-w-[1800px] mx-auto" : "max-w-5xl mx-auto",
        settings.focusMode && !showControls && "cursor-none",
      )}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      tabIndex={0}
      role="application"
      aria-label={`Video player: ${title}`}
    >
      {/* YouTube iframe */}
      {isYouTube ? (
        <div className="relative w-full aspect-video">
          <iframe
            ref={iframeRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={title}
          />
        </div>
      ) : (
        <>
          {/* HTML5 Video */}
          <video
            ref={videoRef}
            className="w-full aspect-video object-contain"
            src={videoUrl}
            poster={thumbnailUrl}
            preload="metadata"
            onClick={() => {
              const video = videoRef.current;
              if (video) video.paused ? video.play() : video.pause();
            }}
            onDoubleClick={toggleFullscreen}
          >
            Your browser does not support the video tag.
          </video>

          {/* Slide overlay */}
          {showSlides && activeSlide && (
            <div className="absolute inset-0 z-10 pointer-events-none bg-slate-950/92">
              {activeSlide.imageUrl && (
                <img
                  src={activeSlide.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-35"
                />
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.9))]" />
              <div className="relative h-full p-6 sm:p-8 flex flex-col justify-center">
                <div className="max-w-3xl">
                  <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-cyan-200/80">
                    <span>Slide {activeSlideIndex >= 0 ? activeSlideIndex + 1 : 1}</span>
                    <span className="h-1 w-1 rounded-full bg-cyan-200/60" />
                    <span>{formatTimestamp(activeSlide.start)}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-4xl font-bold leading-tight text-white">
                    {activeSlide.title}
                  </h3>
                  {activeSlide.body && (
                    <p className="mt-4 max-w-2xl whitespace-pre-line text-sm sm:text-base leading-7 text-slate-200">
                      {activeSlide.body}
                    </p>
                  )}
                </div>
              </div>
              {slides.length > 1 && (
                <div className="absolute right-4 top-4 z-20 flex items-center gap-2 pointer-events-auto">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
                    onClick={() => seekToSlide(Math.max(0, activeSlideIndex - 1))}
                    disabled={activeSlideIndex <= 0}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="mx-auto h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
                    onClick={() => seekToSlide(Math.min(slides.length - 1, activeSlideIndex + 1))}
                    disabled={activeSlideIndex < 0 || activeSlideIndex >= slides.length - 1}
                    aria-label="Next slide"
                  >
                    <ChevronRight className="mx-auto h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Caption overlay — floating non-obtrusively near bottom by default */}
          {activeCue && settings.captionsEnabled && (
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 max-w-[92%] sm:max-w-[85%] text-center pointer-events-none z-20 transition-all duration-150 leading-snug select-none",
                settings.captionStyle.rounded ? "rounded-xl" : "rounded-md",
                settings.captionStyle.blur && "backdrop-blur-md",
                settings.captionStyle.position === "top" && "top-3 sm:top-5",
                settings.captionStyle.position === "center" && "top-1/2 -translate-y-1/2 max-h-[35%] overflow-hidden line-clamp-3",
                settings.captionStyle.position === "bottom" && "bottom-14 sm:bottom-16",
              )}
              style={{
                fontSize: `${Math.min(CAPTION_FONT_SIZES.find((s) => s.value === settings.captionStyle.fontSize)?.px || 16, 20)}px`,
                fontFamily: settings.captionStyle.fontFamily,
                fontWeight:
                  settings.captionStyle.fontWeight === "bold"
                    ? 700
                    : settings.captionStyle.fontWeight === "medium"
                      ? 500
                      : 400,
                color: settings.captionStyle.color,
                backgroundColor: `${settings.captionStyle.backgroundColor}${Math.round(
                  settings.captionStyle.backgroundOpacity * 2.55,
                )
                  .toString(16)
                  .padStart(2, "0")}`,
              }}
              aria-live="polite"
            >
              {activeCue.text}
            </div>
          )}
        </>
      )}

      {/* Play overlay */}
      {!playing && !isYouTube && !activeCheckpoint && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => videoRef.current?.play()}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition">
            <Play className="h-8 w-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Quiz checkpoint overlay (rendered via Portal to guarantee 0px clipping on mobile devices) */}
      {activeCheckpoint && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-check-title"
        >
          <div className="w-full max-w-lg bg-card text-card-foreground border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xl my-auto max-h-[92dvh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <p id="quick-check-title" className="text-xs font-bold uppercase tracking-wider text-primary">
                  Quick Check
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-mono font-medium">
                Question {doneCheckpoints.size + 1} of {quiz.length}
              </p>
            </div>

            <div className="overflow-y-auto flex-1 py-4 pr-1 space-y-4">
              <h4 className="text-sm sm:text-base font-semibold leading-relaxed text-foreground">
                {cleanQuizQuestion(activeCheckpoint.question)}
              </h4>

              <div className="space-y-2">
                {activeCheckpoint.options.map((opt, i) => {
                  const isAnswer = i === activeCheckpoint.answer;
                  const isPicked = i === pickedOption;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={pickedOption !== null}
                      onClick={() => setPickedOption(i)}
                      className={cn(
                        "w-full text-left px-4 py-3 min-h-[46px] rounded-xl text-xs sm:text-sm border transition-all duration-200 flex items-center justify-between gap-3",
                        pickedOption === null
                          ? "border-border hover:border-primary/60 hover:bg-primary/5 active:scale-[0.99] cursor-pointer"
                          : isAnswer
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium shadow-sm ring-1 ring-emerald-500/30"
                            : isPicked
                              ? "border-destructive bg-destructive/15 text-destructive font-medium shadow-sm ring-1 ring-destructive/30"
                              : "border-border/60 opacity-50 bg-muted/20",
                      )}
                    >
                      <span className="flex-1 leading-snug">{opt}</span>
                      {pickedOption !== null && isAnswer && (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {pickedOption !== null && isPicked && !isAnswer && (
                        <X className="h-4 w-4 text-destructive shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {pickedOption !== null && activeCheckpoint.explanation && (
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs leading-relaxed text-muted-foreground animate-in fade-in duration-150">
                  <span className="font-semibold text-foreground mr-1.5">Explanation:</span>
                  {activeCheckpoint.explanation}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 mt-auto shrink-0">
              <button
                type="button"
                disabled={pickedOption === null}
                onClick={closeCheckpoint}
                className="w-full h-11 min-h-[44px] rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold disabled:opacity-40 transition-all duration-200 hover:bg-primary/90 active:scale-[0.99] shadow-md flex items-center justify-center gap-2"
              >
                {pickedOption === null
                  ? "Pick an answer to continue"
                  : pickedOption === activeCheckpoint.answer
                    ? "Correct — continue watching"
                    : "Got it — continue watching"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Controls overlay */}
      {showControls && !isYouTube && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 pb-3 px-3 z-20">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group mb-3"
            onClick={handleProgressClick}
            onMouseEnter={() => setHoveringProgress(true)}
            onMouseLeave={() => setHoveringProgress(false)}
            onMouseMove={handleProgressHover}
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((currentTime / (duration || 1)) * 100)}
          >
            {/* Buffered */}
            <div
              className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
              style={{ width: `${(buffered / (duration || 1)) * 100}%` }}
            />
            {/* Progress */}
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            {/* Hover indicator */}
            {hoveringProgress && (
              <>
                <div
                  className="absolute top-0 h-full bg-white/20 rounded-full"
                  style={{ width: `${progressHoverX}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow"
                  style={{ left: `calc(${progressHoverX}% - 6px)` }}
                />
                <div
                  className="absolute -top-8 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono -translate-x-1/2"
                  style={{ left: `${progressHoverX}%` }}
                >
                  {progressTime}
                </div>
              </>
            )}
          </div>

          {/* Controls row — responsive layout prioritized for mobile, tablet, and desktop */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap overflow-hidden">
            {/* Left controls */}
            <ControlButton
              className="hidden sm:flex"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => handleShortcutAction("prevLesson")}
              disabled={currentLessonIndex <= 0}
              tooltip="Previous lesson"
            />
            <ControlButton
              icon={<SkipBack className="h-4 w-4" />}
              onClick={() => handleShortcutAction("skipBack10")}
              tooltip="Back 10 seconds"
            />
            <ControlButton
              className="h-9 w-9 sm:h-10 sm:w-10 bg-white/10 text-white hover:bg-white/20 active:scale-90"
              icon={
                playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />
              }
              onClick={() => handleShortcutAction("togglePlay")}
              tooltip={playing ? "Pause" : "Play"}
            />
            <ControlButton
              icon={<SkipForward className="h-4 w-4" />}
              onClick={() => handleShortcutAction("skipForward10")}
              tooltip="Forward 10 seconds"
            />
            <ControlButton
              className="hidden sm:flex"
              icon={<ChevronRight className="h-4 w-4" />}
              onClick={() => handleShortcutAction("nextLesson")}
              disabled={currentLessonIndex < 0 || currentLessonIndex >= lessons.length - 1}
              tooltip="Next lesson"
            />

            {/* Volume — hidden on small mobile, accessible via device buttons or tablet/desktop hover */}
            <div className="hidden sm:flex items-center gap-1 group/vol">
              <ControlButton
                icon={<VolumeIcon className="h-4 w-4" />}
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
                }}
                tooltip={muted ? "Unmute" : "Mute"}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.volume = v;
                    videoRef.current.muted = v === 0;
                  }
                }}
                className="w-0 group-hover/vol:w-16 md:group-hover/vol:w-20 transition-all duration-200 accent-primary h-1 cursor-pointer opacity-0 group-hover/vol:opacity-100"
                aria-label="Volume"
              />
            </div>

            {/* Time */}
            <span className="text-[10px] sm:text-[11px] text-white/90 font-mono ml-1 sm:ml-2 tabular-nums shrink-0">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1 min-w-0" />

            {/* Right controls */}
            <ControlButton
              className="hidden md:flex"
              icon={<PictureInPicture className="h-4 w-4" />}
              onClick={togglePiP}
              disabled={typeof document === "undefined" || !document.pictureInPictureEnabled}
              tooltip={isPiP ? "Exit picture-in-picture" : "Picture-in-Picture"}
              active={isPiP}
            />
            <ControlButton
              className="hidden md:flex"
              icon={<List className="h-4 w-4" />}
              onClick={() => {
                setShowPlaylist((v) => !v);
                setShowSettings(false);
                setShowCaptions(false);
                setShowTranscript(false);
              }}
              tooltip="Playlist"
              active={showPlaylist}
            />
            <ControlButton
              icon={<Subtitles className="h-4 w-4" />}
              onClick={() => {
                setShowCaptions((v) => !v);
                setShowSettings(false);
                setShowTranscript(false);
                setShowPlaylist(false);
              }}
              tooltip="Subtitles"
              active={showCaptions || settings.captionsEnabled}
            />
            {transcriptEntries.length > 0 && (
              <ControlButton
                className="hidden sm:flex"
                icon={<MessageSquare className="h-4 w-4" />}
                onClick={() => {
                  setShowTranscript((v) => !v);
                  setShowCaptions(false);
                  setShowSettings(false);
                  setShowPlaylist(false);
                }}
                tooltip="Transcript"
                active={showTranscript}
              />
            )}
            <ControlButton
              icon={<Settings className="h-4 w-4" />}
              onClick={() => {
                setShowSettings((v) => !v);
                setShowCaptions(false);
                setShowTranscript(false);
                setShowPlaylist(false);
              }}
              tooltip="Settings"
              active={showSettings}
            />
            <ControlButton
              icon={
                isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />
              }
              onClick={toggleFullscreen}
              tooltip={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            />
          </div>
        </div>
      )}

      {/* Side panels (Desktop drawer + Mobile bottom-sheet portal) */}
      {showTranscript && (
        <>
          <div className="hidden md:flex absolute top-0 right-0 bottom-0 w-80 z-40">
            <TranscriptPanel
              entries={transcriptEntries}
              currentTime={currentTime}
              onSeek={(time) => {
                if (isYouTube) {
                  sendYtCommand("seekTo", [time, true]);
                  setCurrentTime(time);
                } else if (videoRef.current) {
                  videoRef.current.currentTime = time;
                }
              }}
              onClose={() => setShowTranscript(false)}
              videoTitle={title}
            />
          </div>
          {typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end md:hidden animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowTranscript(false);
                }}
              >
                <div
                  className="w-full bg-background border-t border-border rounded-t-2xl shadow-2xl h-[78dvh] max-h-[85dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Video transcript"
                >
                  <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto my-2.5 shrink-0" />
                  <TranscriptPanel
                    entries={transcriptEntries}
                    currentTime={currentTime}
                    onSeek={(time) => {
                      if (isYouTube) {
                        sendYtCommand("seekTo", [time, true]);
                        setCurrentTime(time);
                      } else if (videoRef.current) {
                        videoRef.current.currentTime = time;
                      }
                      setShowTranscript(false);
                    }}
                    onClose={() => setShowTranscript(false)}
                    videoTitle={title}
                  />
                </div>
              </div>,
              document.body,
            )}
        </>
      )}

      {/* Floating transcript toggle for YouTube lessons (native player has no custom bar) */}
      {isYouTube && transcriptEntries.length > 0 && !showTranscript && (
        <button
          type="button"
          onClick={() => setShowTranscript(true)}
          className="absolute top-3 right-3 z-40 flex items-center gap-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[11px] font-medium px-2.5 py-1.5 backdrop-blur-sm transition"
          title="Open transcript"
          aria-label="Open transcript"
        >
          <MessageSquare className="h-3.5 w-3.5" /> Transcript
        </button>
      )}

      {showCaptions && !isYouTube && (
        <>
          <div className="hidden md:flex absolute top-0 right-0 bottom-0 w-80 z-30">
            <CaptionPanel
              tracks={tracks}
              activeTrackId={activeTrack?.id || null}
              onSelectTrack={(track) => {
                setActiveTrack(track);
                setSettings((prev) => ({ ...prev, captionsEnabled: !!track }));
              }}
              onAddTrack={(track) => setTracks((prev) => [...prev, track])}
              onRemoveTrack={(id) => {
                setTracks((prev) => prev.filter((t) => t.id !== id));
                if (activeTrack?.id === id) setActiveTrack(null);
              }}
              onClose={() => setShowCaptions(false)}
              sourceLanguage={activeTrack?.language ?? tracks[0]?.language ?? "en"}
              onTranslate={lessonId && courseId ? handleTranslate : undefined}
            />
          </div>
          {typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end md:hidden animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowCaptions(false);
                }}
              >
                <div
                  className="w-full bg-background border-t border-border rounded-t-2xl shadow-2xl h-[78dvh] max-h-[85dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Captions and Subtitles"
                >
                  <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto my-2.5 shrink-0" />
                  <CaptionPanel
                    tracks={tracks}
                    activeTrackId={activeTrack?.id || null}
                    onSelectTrack={(track) => {
                      setActiveTrack(track);
                      setSettings((prev) => ({ ...prev, captionsEnabled: !!track }));
                    }}
                    onAddTrack={(track) => setTracks((prev) => [...prev, track])}
                    onRemoveTrack={(id) => {
                      setTracks((prev) => prev.filter((t) => t.id !== id));
                      if (activeTrack?.id === id) setActiveTrack(null);
                    }}
                    onClose={() => setShowCaptions(false)}
                    sourceLanguage={activeTrack?.language ?? tracks[0]?.language ?? "en"}
                    onTranslate={lessonId && courseId ? handleTranslate : undefined}
                  />
                </div>
              </div>,
              document.body,
            )}
        </>
      )}

      {showSettings && !isYouTube && (
        <>
          <div className="hidden md:flex absolute top-0 right-0 bottom-0 w-80 z-30">
            <AdvancedSettingsPanel
              settings={settings}
              onUpdate={(s) => setSettings((prev) => ({ ...prev, ...s }))}
              onScreenshot={takeScreenshot}
              restrictDownload={restrictDownload}
              restrictSpeed={restrictSpeed}
              audioLanguage={audioLanguage}
              onAudioLanguageChange={setAudioLanguage}
              hasTranscript={transcriptEntries.length > 0}
              showTranscript={showTranscript}
              onToggleTranscript={() => setShowTranscript((v) => !v)}
              hasSlides={slides.length > 0}
              showSlides={showSlides}
              onToggleSlides={() => setShowSlides((v) => !v)}
              showPlaylist={showPlaylist}
              onTogglePlaylist={() => setShowPlaylist((v) => !v)}
              onShowShortcuts={() => {
                setShowSettings(false);
                setShowShortcuts(true);
              }}
              onClose={() => setShowSettings(false)}
            />
          </div>
          {typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end md:hidden animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowSettings(false);
                }}
              >
                <div
                  className="w-full bg-background border-t border-border rounded-t-2xl shadow-2xl h-[78dvh] max-h-[85dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Video settings"
                >
                  <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto my-2.5 shrink-0" />
                  <AdvancedSettingsPanel
                    className="border-l-0"
                    settings={settings}
                    onUpdate={(s) => setSettings((prev) => ({ ...prev, ...s }))}
                    onScreenshot={takeScreenshot}
                    restrictDownload={restrictDownload}
                    restrictSpeed={restrictSpeed}
                    audioLanguage={audioLanguage}
                    onAudioLanguageChange={setAudioLanguage}
                    hasTranscript={transcriptEntries.length > 0}
                    showTranscript={showTranscript}
                    onToggleTranscript={() => {
                      setShowSettings(false);
                      setShowTranscript(true);
                    }}
                    hasSlides={slides.length > 0}
                    showSlides={showSlides}
                    onToggleSlides={() => setShowSlides((v) => !v)}
                    showPlaylist={showPlaylist}
                    onTogglePlaylist={() => {
                      setShowSettings(false);
                      setShowPlaylist(true);
                    }}
                    onShowShortcuts={() => {
                      setShowSettings(false);
                      setShowShortcuts(true);
                    }}
                    onClose={() => setShowSettings(false)}
                  />
                </div>
              </div>,
              document.body,
            )}
        </>
      )}

      {/* Playlist overlay */}
      {showPlaylist && (
        <>
          <div className="hidden md:flex absolute top-0 right-0 bottom-0 w-80 bg-background/98 backdrop-blur-md border-l border-border z-30 flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-3.5 border-b border-border shrink-0">
              <h3 className="font-semibold text-sm">Course Lessons</h3>
              <button
                onClick={() => setShowPlaylist(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Close playlist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    onLessonClick(lesson.id);
                    setShowPlaylist(false);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-3 text-xs border-b border-border/40 transition flex items-center gap-3",
                    lesson.id === currentLessonId
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground",
                  )}
                >
                  <span className="w-5 text-[11px] text-center font-mono opacity-60">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs sm:text-sm font-medium">{lesson.title}</p>
                    <p className="text-[10px] opacity-70">{lesson.duration}</p>
                  </div>
                  {lesson.completed && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
          {typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end md:hidden animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowPlaylist(false);
                }}
              >
                <div
                  className="w-full bg-background border-t border-border rounded-t-2xl shadow-2xl h-[78dvh] max-h-[85dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Course Lessons"
                >
                  <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto my-2.5 shrink-0" />
                  <div className="flex items-center justify-between p-3.5 border-b border-border shrink-0">
                    <h3 className="font-semibold text-sm">Course Lessons</h3>
                    <button
                      onClick={() => setShowPlaylist(false)}
                      className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                      aria-label="Close playlist"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {lessons.map((lesson, i) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          onLessonClick(lesson.id);
                          setShowPlaylist(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3.5 min-h-[48px] text-xs sm:text-sm border-b border-border/40 transition flex items-center gap-3",
                          lesson.id === currentLessonId
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/50 text-muted-foreground active:bg-muted",
                        )}
                      >
                        <span className="w-5 text-xs text-center font-mono opacity-60">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{lesson.title}</p>
                          <p className="text-[11px] opacity-70">{lesson.duration}</p>
                        </div>
                        {lesson.completed && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </>
      )}

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && <KeyboardShortcutsOverlay onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

// Reusable control button
function ControlButton({
  icon,
  onClick,
  disabled,
  tooltip,
  active,
  className,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "relative h-8 w-8 min-w-[32px] sm:h-9 sm:w-9 sm:min-w-[36px] flex items-center justify-center rounded-lg transition-all",
        disabled && "opacity-30 cursor-not-allowed",
        active ? "text-primary bg-primary/15" : "text-white/85 hover:text-white hover:bg-white/10 active:scale-95",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      aria-label={tooltip}
    >
      {icon}
    </button>
  );
}
