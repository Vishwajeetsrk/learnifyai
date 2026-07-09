import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Pause,
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
  Bookmark,
  PictureInPicture,
  Camera,
  HelpCircle,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type VideoSettings,
  type SubtitleTrack,
  type TranscriptEntry,
  type CaptionStyle,
  DEFAULT_CAPTION_STYLE,
  KEYBOARD_SHORTCUTS,
  CAPTION_FONT_SIZES,
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
  transcriptEntries?: TranscriptEntry[];
  subtitleTracks?: SubtitleTrack[];
  isYouTube?: boolean;
}

export function AdvancedVideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  lessons,
  currentLessonId,
  onLessonClick,
  onComplete,
  transcriptEntries = [],
  subtitleTracks = [],
  isYouTube = false,
}: AdvancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(null);

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
  const [isPiP, setIsPiP] = useState(false);

  // Settings
  const [settings, setSettings] = useState<VideoSettings>({
    quality: "auto",
    playbackRate: 1,
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

  // Active caption cue
  const activeCue = useMemo(() => {
    if (!settings.captionsEnabled || !activeTrack) return null;
    return activeTrack.cues.find(
      (cue) => currentTime >= cue.start && currentTime <= cue.end
    );
  }, [activeTrack, currentTime, settings.captionsEnabled]);

  const currentLessonIndex = lessons.findIndex((l) => l.id === currentLessonId);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      onComplete?.(currentLessonId);
      if (settings.autoNextLesson && currentLessonIndex < lessons.length - 1) {
        onLessonClick(lessons[currentLessonIndex + 1].id);
      }
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("progress", onProgress);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [isYouTube, currentLessonId, settings.autoNextLesson, currentLessonIndex, lessons, onLessonClick, onComplete]);

  // Playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (video && !isYouTube) video.playbackRate = settings.playbackRate;
  }, [settings.playbackRate, isYouTube]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (playing && !showSettings && !showTranscript && !showCaptions) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 4000);
    }
  }, [playing, showSettings, showTranscript, showCaptions]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [playing, showSettings, showTranscript, showCaptions, resetControlsTimer]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) return;

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
  }, [settings, currentLessonIndex, lessons, showTranscript, showSettings, showCaptions]);

  const handleShortcutAction = (action: string) => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    switch (action) {
      case "togglePlay": video.paused ? video.play() : video.pause(); break;
      case "toggleMute": video.muted = !video.muted; break;
      case "volumeUp": video.volume = Math.min(1, video.volume + 0.1); break;
      case "volumeDown": video.volume = Math.max(0, video.volume - 0.1); break;
      case "seekForward": video.currentTime = Math.min(video.duration, video.currentTime + 5); break;
      case "seekBackward": video.currentTime = Math.max(0, video.currentTime - 5); break;
      case "skipBack10": video.currentTime = Math.max(0, video.currentTime - 10); break;
      case "skipForward10": video.currentTime = Math.min(video.duration, video.currentTime + 10); break;
      case "toggleCaptions": setSettings((s) => ({ ...s, captionsEnabled: !s.captionsEnabled })); break;
      case "toggleFullscreen": toggleFullscreen(); break;
      case "toggleTranscript": setShowTranscript((v) => !v); break;
      case "screenshot": takeScreenshot(); break;
      case "restart": video.currentTime = 0; break;
      case "nextLesson": if (currentLessonIndex < lessons.length - 1) onLessonClick(lessons[currentLessonIndex + 1].id); break;
      case "prevLesson": if (currentLessonIndex > 0) onLessonClick(lessons[currentLessonIndex - 1].id); break;
      case "openSettings": setShowSettings((v) => !v); break;
      case "closeModal": setShowSettings(false); setShowTranscript(false); setShowCaptions(false); setShowShortcuts(false); setShowPlaylist(false); break;
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
    if (!video || isYouTube) return;
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
  };

  // Volume icon
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume2 : Volume2;

  // Format progress time
  const progressTime = formatTimestamp(hoveringProgress ? (progressHoverX / 100) * duration : currentTime);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-xl overflow-hidden select-none",
        settings.theaterMode ? "max-w-[1800px] mx-auto" : "max-w-5xl mx-auto",
        settings.focusMode && !showControls && "cursor-none"
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
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

          {/* Caption overlay */}
          {activeCue && settings.captionsEnabled && (
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 px-3 py-1 max-w-[80%] text-center pointer-events-none z-10",
                settings.captionStyle.rounded && "rounded-lg",
                settings.captionStyle.blur && "backdrop-blur-sm",
                settings.captionStyle.position === "top" && "top-4",
                settings.captionStyle.position === "center" && "top-1/2 -translate-y-1/2",
                settings.captionStyle.position === "bottom" && "bottom-16"
              )}
              style={{
                fontSize: `${CAPTION_FONT_SIZES.find((s) => s.value === settings.captionStyle.fontSize)?.px || 18}px`,
                fontFamily: settings.captionStyle.fontFamily,
                fontWeight: settings.captionStyle.fontWeight === "bold" ? 700 : settings.captionStyle.fontWeight === "medium" ? 500 : 400,
                color: settings.captionStyle.color,
                backgroundColor: `${settings.captionStyle.backgroundColor}${Math.round(settings.captionStyle.backgroundOpacity * 2.55).toString(16).padStart(2, "0")}`,
              }}
              aria-live="polite"
            >
              {activeCue.text}
            </div>
          )}
        </>
      )}

      {/* Play overlay */}
      {!playing && !isYouTube && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => videoRef.current?.play()}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition">
            <Play className="h-8 w-8 text-white fill-white ml-1" />
          </div>
        </div>
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

          {/* Controls row */}
          <div className="flex items-center gap-1">
            {/* Left controls */}
            <ControlButton
              icon={<SkipBack className="h-4 w-4" />}
              onClick={() => handleShortcutAction("prevLesson")}
              disabled={currentLessonIndex === 0}
              tooltip="Previous lesson"
            />
            <ControlButton
              icon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              onClick={() => videoRef.current?.play()}
              tooltip={playing ? "Pause" : "Play"}
            />
            <ControlButton
              icon={<SkipForward className="h-4 w-4" />}
              onClick={() => handleShortcutAction("nextLesson")}
              disabled={currentLessonIndex === lessons.length - 1}
              tooltip="Next lesson"
            />

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <ControlButton
                icon={<VolumeIcon className="h-4 w-4" />}
                onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; }}
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
                className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-primary h-1 cursor-pointer opacity-0 group-hover/vol:opacity-100"
                aria-label="Volume"
              />
            </div>

            {/* Time */}
            <span className="text-[11px] text-white/80 font-mono ml-2 tabular-nums">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right controls */}
            <ControlButton
              icon={<Bookmark className="h-4 w-4" />}
              onClick={() => {}}
              tooltip="Bookmark"
            />
            <ControlButton
              icon={<Camera className="h-4 w-4" />}
              onClick={takeScreenshot}
              tooltip="Screenshot"
            />
            <ControlButton
              icon={<PictureInPicture className="h-4 w-4" />}
              onClick={togglePiP}
              disabled={isPiP || !document.pictureInPictureEnabled}
              tooltip="Picture-in-Picture"
              active={isPiP}
            />
            <ControlButton
              icon={<List className="h-4 w-4" />}
              onClick={() => setShowPlaylist((v) => !v)}
              tooltip="Playlist"
              active={showPlaylist}
            />
            <ControlButton
              icon={<MessageSquare className="h-4 w-4" />}
              onClick={() => { setShowTranscript((v) => !v); setShowCaptions(false); }}
              tooltip="Transcript"
              active={showTranscript}
            />
            <ControlButton
              icon={<Settings className="h-4 w-4" />}
              onClick={() => { setShowSettings((v) => !v); setShowCaptions(false); setShowTranscript(false); }}
              tooltip="Settings"
              active={showSettings}
            />
            <ControlButton
              icon={<HelpCircle className="h-4 w-4" />}
              onClick={() => setShowShortcuts(true)}
              tooltip="Keyboard shortcuts"
            />
            <ControlButton
              icon={isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              onClick={toggleFullscreen}
              tooltip={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            />
          </div>
        </div>
      )}

      {/* Side panels */}
      {showTranscript && !isYouTube && (
        <div className="absolute top-0 right-0 bottom-0 w-72 z-30">
          <TranscriptPanel
            entries={transcriptEntries}
            currentTime={currentTime}
            onSeek={(time) => { if (videoRef.current) videoRef.current.currentTime = time; }}
            onClose={() => setShowTranscript(false)}
            videoTitle={title}
          />
        </div>
      )}

      {showCaptions && !isYouTube && (
        <div className="absolute top-0 right-0 bottom-0 w-72 z-30">
          <CaptionPanel
            tracks={tracks}
            activeTrackId={activeTrack?.id || null}
            onSelectTrack={setActiveTrack}
            onAddTrack={(track) => setTracks((prev) => [...prev, track])}
            onRemoveTrack={(id) => {
              setTracks((prev) => prev.filter((t) => t.id !== id));
              if (activeTrack?.id === id) setActiveTrack(null);
            }}
            onClose={() => setShowCaptions(false)}
          />
        </div>
      )}

      {showSettings && !isYouTube && (
        <div className="absolute top-0 right-0 bottom-0 z-30">
          <AdvancedSettingsPanel
            settings={settings}
            onUpdate={(s) => setSettings((prev) => ({ ...prev, ...s }))}
            onScreenshot={takeScreenshot}
            qualities={[
              { id: "auto", label: "Auto", width: 0 },
              { id: "2160", label: "2160p (4K)", width: 3840 },
              { id: "1440", label: "1440p (2K)", width: 2560 },
              { id: "1080", label: "1080p (Full HD)", width: 1920 },
              { id: "720", label: "720p (HD)", width: 1280 },
              { id: "480", label: "480p (SD)", width: 854 },
              { id: "360", label: "360p", width: 640 },
              { id: "240", label: "240p", width: 426 },
              { id: "144", label: "144p", width: 256 },
            ]}
            currentQuality={settings.quality}
            onQualityChange={(q) => setSettings((prev) => ({ ...prev, quality: q }))}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {/* Playlist overlay */}
      {showPlaylist && (
        <div className="absolute top-0 right-0 bottom-0 w-72 bg-background/95 backdrop-blur-sm border-l border-border z-30 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Lessons</h3>
            <button onClick={() => setShowPlaylist(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close playlist">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => { onLessonClick(lesson.id); setShowPlaylist(false); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-xs border-b border-border/50 transition",
                  lesson.id === currentLessonId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-[10px] text-center font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{lesson.title}</p>
                    <p className="text-[10px] opacity-60">{lesson.duration}</p>
                  </div>
                  {lesson.completed && <span className="text-green-500 text-[10px]">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
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
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "relative h-8 w-8 flex items-center justify-center rounded-lg transition",
        disabled && "opacity-30 cursor-not-allowed",
        active ? "text-primary" : "text-white/80 hover:text-white hover:bg-white/10"
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
