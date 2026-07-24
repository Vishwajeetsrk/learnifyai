import { useState } from "react";
import {
  ChevronLeft,
  Check,
  Camera,
  Type,
  Palette,
  Monitor,
  Settings,
  X,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  type VideoSettings,
  type CaptionStyle,
  DEFAULT_CAPTION_STYLE,
  CAPTION_FONT_SIZES,
  CAPTION_FONTS,
  CAPTION_COLORS,
} from "./types";

interface AdvancedSettingsPanelProps {
  settings: VideoSettings;
  onUpdate: (settings: Partial<VideoSettings>) => void;
  onScreenshot: () => void;
  qualities: { id: string; label: string; width: number }[];
  currentQuality: string;
  onQualityChange: (quality: string) => void;
  audioLanguage: string;
  onAudioLanguageChange: (lang: string) => void;
  translationLanguage: string;
  onTranslationLanguageChange: (lang: string) => void;
  onClose: () => void;
}

type SettingsView = "main" | "quality" | "captions" | "display" | "language";

export function AdvancedSettingsPanel({
  settings,
  onUpdate,
  onScreenshot,
  qualities,
  currentQuality,
  onQualityChange,
  audioLanguage,
  onAudioLanguageChange,
  translationLanguage,
  onTranslationLanguageChange,
  onClose,
}: AdvancedSettingsPanelProps) {
  const [view, setView] = useState<SettingsView>("main");

  const Header = () => (
    <div className="flex items-center justify-between p-3 border-b border-border">
      <div className="flex items-center gap-2">
        {view !== "main" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setView("main")}
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h3 className="font-semibold text-sm">
          {view === "main" && "Settings"}
          {view === "quality" && "Quality"}
          {view === "captions" && "Captions"}
          {view === "display" && "Display"}
          {view === "language" && "Audio & Language"}
        </h3>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={onClose}
        aria-label="Close settings"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  return (
    <div
      className="flex flex-col bg-background border-l border-border w-full max-w-xs"
      role="dialog"
      aria-label="Video settings"
    >
      <Header />

      {view === "main" && (
        <div className="p-2 space-y-1">
          <SettingsRow
            icon={<Monitor className="h-4 w-4" />}
            label="Quality"
            value={currentQuality}
            onClick={() => setView("quality")}
          />
          <SettingsRow
            icon={<Globe className="h-4 w-4" />}
            label="Audio & Language"
            value={audioLanguage === "original" ? "English" : audioLanguage.toUpperCase()}
            onClick={() => setView("language")}
          />
          <SettingsRow
            icon={<Type className="h-4 w-4" />}
            label="Captions"
            value={settings.captionsEnabled ? "On" : "Off"}
            onClick={() => setView("captions")}
          />
          <SettingsRow
            icon={<Palette className="h-4 w-4" />}
            label="Display"
            onClick={() => setView("display")}
          />
          <div className="border-t border-border mt-2 pt-2">
            <SettingsRow
              icon={<Camera className="h-4 w-4" />}
              label="Screenshot"
              onClick={onScreenshot}
            />
          </div>
          <div className="border-t border-border mt-2 pt-2 px-3">
            <div className="flex items-center justify-between">
              <span className="text-xs">Auto-next lesson</span>
              <Switch
                checked={settings.autoNextLesson}
                onCheckedChange={(v) => onUpdate({ autoNextLesson: v })}
                aria-label="Auto-next lesson"
              />
            </div>
          </div>
          <div className="px-3 py-1">
            <div className="flex items-center justify-between">
              <span className="text-xs">Resume playback</span>
              <Switch
                checked={settings.resumePlayback}
                onCheckedChange={(v) => onUpdate({ resumePlayback: v })}
                aria-label="Resume playback"
              />
            </div>
          </div>
        </div>
      )}

      {view === "language" && (
        <div className="p-3 space-y-4 overflow-y-auto max-h-[350px]">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              AI Audio Track
            </p>
            <div className="space-y-1">
              {[
                { code: "original", label: "Original Audio (English)" },
                { code: "hi", label: "Hindi AI Dubbing" },
                { code: "es", label: "Spanish AI Dubbing" },
                { code: "fr", label: "French AI Dubbing" },
                { code: "de", label: "German AI Dubbing" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onAudioLanguageChange(lang.code);
                    setView("main");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between transition ${
                    audioLanguage === lang.code
                      ? "bg-primary/15 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <span>{lang.label}</span>
                  {audioLanguage === lang.code && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              CC Translation
            </p>
            <div className="space-y-1">
              {[
                { code: "off", label: "Original (English)" },
                { code: "hi", label: "Hindi (हिंदी)" },
                { code: "es", label: "Spanish (Español)" },
                { code: "fr", label: "French (Français)" },
                { code: "de", label: "German (Deutsch)" },
                { code: "te", label: "Telugu (తెలుగు)" },
                { code: "ta", label: "Tamil (தமிழ்)" },
                { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onTranslationLanguageChange(lang.code);
                    setView("main");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between transition ${
                    translationLanguage === lang.code
                      ? "bg-primary/15 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <span>{lang.label}</span>
                  {translationLanguage === lang.code && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "quality" && (
        <div className="p-2 space-y-1">
          {qualities.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                onQualityChange(q.id);
                setView("main");
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition ${
                currentQuality === q.id
                  ? "bg-primary/15 text-primary font-medium"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
              aria-label={`Set quality to ${q.label}`}
            >
              <span className="w-4">
                {currentQuality === q.id && <Check className="h-3 w-3" />}
              </span>
              <span>{q.label}</span>
            </button>
          ))}
          <p className="text-[10px] text-muted-foreground text-center mt-2 px-2">
            Higher quality uses more bandwidth
          </p>
        </div>
      )}

      {view === "captions" && (
        <CaptionStyleEditor
          enabled={settings.captionsEnabled}
          onToggle={(v) => onUpdate({ captionsEnabled: v })}
          style={settings.captionStyle}
          onUpdateStyle={(s) => onUpdate({ captionStyle: { ...settings.captionStyle, ...s } })}
        />
      )}

      {view === "display" && (
        <div className="p-3 space-y-4">
          <div>
            <p className="text-xs font-medium mb-2">Playback Speed</p>
            <div className="flex items-center gap-3">
              <Slider
                value={[settings.playbackRate]}
                onValueChange={(v) => onUpdate({ playbackRate: v[0] })}
                min={0.25}
                max={2}
                step={0.25}
                aria-label="Playback speed"
              />
              <span className="text-xs font-mono w-8 text-right">{settings.playbackRate}x</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>0.25x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Theater mode</span>
              <Switch
                checked={settings.theaterMode}
                onCheckedChange={(v) => onUpdate({ theaterMode: v })}
                aria-label="Theater mode"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Focus mode (hide controls)</span>
              <Switch
                checked={settings.focusMode}
                onCheckedChange={(v) => onUpdate({ focusMode: v })}
                aria-label="Focus mode"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition text-xs"
      onClick={onClick}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {value && <span className="text-muted-foreground">{value}</span>}
      <ChevronLeft className="h-3 w-3 rotate-180 text-muted-foreground" />
    </button>
  );
}

function CaptionStyleEditor({
  enabled,
  onToggle,
  style,
  onUpdateStyle,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  style: CaptionStyle;
  onUpdateStyle: (s: Partial<CaptionStyle>) => void;
}) {
  return (
    <div className="p-3 space-y-4 overflow-y-auto max-h-80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Enable captions</span>
        <Switch checked={enabled} onCheckedChange={onToggle} aria-label="Enable captions" />
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Font size</p>
        <div className="flex gap-1.5">
          {CAPTION_FONT_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => onUpdateStyle({ fontSize: size.value })}
              className={`flex-1 py-1.5 rounded text-[10px] font-medium transition ${
                style.fontSize === size.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-label={`Set font size to ${size.label}`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Font</p>
        <div className="space-y-1">
          {CAPTION_FONTS.map((font) => (
            <button
              key={font}
              onClick={() => onUpdateStyle({ fontFamily: font })}
              className={`w-full text-left px-3 py-1.5 rounded text-xs transition ${
                style.fontFamily === font
                  ? "bg-primary/15 text-primary"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
              style={{ fontFamily: font }}
              aria-label={`Set font to ${font.split(",")[0]}`}
            >
              {font.split(",")[0]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Font weight</p>
        <div className="flex gap-1.5">
          {(["regular", "medium", "bold"] as const).map((weight) => (
            <button
              key={weight}
              onClick={() => onUpdateStyle({ fontWeight: weight })}
              className={`flex-1 py-1.5 rounded text-[10px] capitalize transition ${
                style.fontWeight === weight
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-label={`Set font weight to ${weight}`}
            >
              {weight}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Text color</p>
        <div className="flex gap-1.5">
          {CAPTION_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdateStyle({ color: color.value })}
              className={`w-7 h-7 rounded-full border-2 transition ${
                style.color === color.value ? "border-primary" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Set text color to ${color.label}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Background color</p>
        <div className="flex gap-1.5">
          {CAPTION_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdateStyle({ backgroundColor: color.value })}
              className={`w-7 h-7 rounded-full border-2 transition ${
                style.backgroundColor === color.value ? "border-primary" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Set background color to ${color.label}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Background opacity</p>
        <div className="flex items-center gap-3">
          <Slider
            value={[style.backgroundOpacity]}
            onValueChange={(v) => onUpdateStyle({ backgroundOpacity: v[0] })}
            min={0}
            max={100}
            step={5}
            aria-label="Background opacity"
          />
          <span className="text-xs font-mono w-8 text-right">{style.backgroundOpacity}%</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Position</p>
        <div className="flex gap-1.5">
          {(["top", "center", "bottom"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onUpdateStyle({ position: pos })}
              className={`flex-1 py-1.5 rounded text-[10px] capitalize transition ${
                style.position === pos
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-label={`Set caption position to ${pos}`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs">Blur background</span>
          <Switch
            checked={style.blur}
            onCheckedChange={(v) => onUpdateStyle({ blur: v })}
            aria-label="Blur background"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Rounded corners</span>
          <Switch
            checked={style.rounded}
            onCheckedChange={(v) => onUpdateStyle({ rounded: v })}
            aria-label="Rounded corners"
          />
        </div>
      </div>

      {/* Preview */}
      <div>
        <p className="text-xs font-medium mb-2">Preview</p>
        <div className="relative bg-black rounded-lg h-16 flex items-center justify-center overflow-hidden">
          <div
            className={`px-3 py-1 max-w-[90%] text-center ${
              style.rounded ? "rounded-lg" : ""
            } ${style.blur ? "backdrop-blur-sm" : ""}`}
            style={{
              fontSize: `${CAPTION_FONT_SIZES.find((s) => s.value === style.fontSize)?.px || 18}px`,
              fontFamily: style.fontFamily,
              fontWeight:
                style.fontWeight === "bold" ? 700 : style.fontWeight === "medium" ? 500 : 400,
              color: style.color,
              backgroundColor: `${style.backgroundColor}${Math.round(style.backgroundOpacity * 2.55)
                .toString(16)
                .padStart(2, "0")}`,
            }}
          >
            This is a caption preview
          </div>
        </div>
      </div>
    </div>
  );
}
