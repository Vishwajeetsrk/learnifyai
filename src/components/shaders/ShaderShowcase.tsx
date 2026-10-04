import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  Code2,
  Copy,
  Check,
  Sun,
  Moon,
  RotateCcw,
  Sliders,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { ShaderButtons, type ShaderButtonVariant } from "./ShaderButtons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SHADER_VARIANTS: { id: ShaderButtonVariant; label: string; desc: string; type: string }[] = [
  {
    id: "raking-light-pill",
    label: "Raking Light Pill",
    desc: "Raw WebGL GLSL raking light bands, procedural twinkle motes, and soft glowing border.",
    type: "Raw WebGL GLSL",
  },
  {
    id: "ignition-button",
    label: "Ignition Terminal",
    desc: "Sub-atomic ignition terminal glow with particle acceleration.",
    type: "Three.js / Canvas",
  },
  {
    id: "thinking-button",
    label: "Thinking State",
    desc: "AI cognitive braille spinner and glowing border microinteraction.",
    type: "Canvas 2D / Microinteraction",
  },
  {
    id: "star-portal",
    label: "Star Portal",
    desc: "Deep-space cosmic portal with orbiting stars and gravitational drift.",
    type: "WebGL Starfield",
  },
  {
    id: "plasma-button",
    label: "Plasma Reactor",
    desc: "High-energy plasma reactor with ionized light trails.",
    type: "WebGL Fluid",
  },
  {
    id: "tactile-button",
    label: "Nexus Tactile",
    desc: "Tactile haptic surface simulation with raymarching depth.",
    type: "Raymarching Study",
  },
  {
    id: "glassy-split",
    label: "Glassy Split",
    desc: "Frosted refractive glass split button with realistic caustics.",
    type: "CSS + WebGL Caustics",
  },
  {
    id: "generate-site",
    label: "Generate Site",
    desc: "Cinematic prompt trigger button with prismatic perimeter sweep.",
    type: "Prismatic Microinteraction",
  },
  {
    id: "chrome-upload",
    label: "Chrome Upload",
    desc: "Specular chrome edge with dynamic specular reflection on cursor move.",
    type: "Chrome Shader",
  },
  {
    id: "iridescent-glass",
    label: "Iridescent Glass",
    desc: "Multi-layered thin-film interference with prismatic color dispersion.",
    type: "Thin-Film Shader",
  },
];

export function ShaderShowcase({ className = "" }: { className?: string }) {
  const [selectedVariant, setSelectedVariant] = useState<ShaderButtonVariant>("raking-light-pill");
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"canvas" | "code">("canvas");

  const currentVariantInfo =
    SHADER_VARIANTS.find((v) => v.id === selectedVariant) || SHADER_VARIANTS[0];

  const codeSnippet = `import { ShaderButtons } from "@/components/shaders";
import "@/components/shaders/threeui.css";

export function HeroCta() {
  return (
    <div className="shader-frame">
      <ShaderButtons
        variant="${selectedVariant}"
        mode="${mode}"
        ${hue !== 0 ? `hue={${hue}}\n        ` : ""}${saturation !== 1 ? `saturation={${saturation}}\n        ` : ""}${brightness !== 1 ? `brightness={${brightness}}\n        ` : ""}
      />
    </div>
  );
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    toast.success("Shader component code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setHue(0);
    setSaturation(1);
    setBrightness(1);
    toast.info("Shader dials reset to default values");
  };

  return (
    <div
      className={`relative rounded-3xl border border-border/80 bg-gradient-to-b from-card/90 via-card/70 to-background/90 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
              <Sparkles className="h-3.5 w-3.5" />
              ThreeUI WebGL & Shader Lab
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">
              v1.0 (WebGL + GLSL)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
            Interactive Shader Buttons & Micro-Interactions
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Integrated from ThreeUI exact engine runtime. Experience procedural GLSL lightbands,
            floating motes, reactive raymarching, and cinematic click states.
          </p>
        </div>

        {/* View mode toggle & Copy action */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="flex rounded-xl bg-muted/60 p-1 border border-border/60">
            <button
              onClick={() => setActiveTab("canvas")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "canvas"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Live Canvas
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "code"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> Code & Shaders
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-1.5 text-xs h-9 border-border/70"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy Code"}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left column: Variant selectors */}
        <div className="lg:col-span-4 space-y-2.5 order-2 lg:order-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center justify-between">
            <span>Available Shader Variants ({SHADER_VARIANTS.length})</span>
            <Cpu className="h-3.5 w-3.5 text-primary" />
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 focus-visible:outline-none">
            {SHADER_VARIANTS.map((v) => {
              const isActive = selectedVariant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
                      : "border-border/70 bg-card/60 hover:bg-muted/40 hover:border-border text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      {v.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground">
                      {v.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{v.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Interactive Stage & Customizer */}
        <div className="lg:col-span-8 flex flex-col gap-4 order-1 lg:order-2">
          {/* Stage Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-zinc-950 min-h-[340px] sm:min-h-[380px] flex flex-col items-center justify-center p-6 shadow-inner">
            {activeTab === "canvas" ? (
              <div className="w-full h-full flex flex-col items-center justify-center my-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedVariant}-${mode}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex items-center justify-center py-8"
                  >
                    <div className="w-full max-w-sm flex items-center justify-center">
                      <ShaderButtons
                        variant={selectedVariant}
                        mode={mode}
                        hue={hue}
                        saturation={saturation}
                        brightness={brightness}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-auto pt-4 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-muted-foreground/80">
                  <span>Hover to intensify light bands</span>
                  <span>•</span>
                  <span>Click to interact</span>
                  <span>•</span>
                  <span>Rendered via raw WebGL / ThreeUI</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400">
                  <span className="font-mono">React Component Integration</span>
                  <button
                    onClick={handleCopy}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed select-all">
                  {codeSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Shader Customization Controls */}
          <div className="p-4 rounded-2xl bg-card/60 border border-border/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Shader Dials:</span>
            </div>

            {/* Mode switch */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => setMode("dark")}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  mode === "dark"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("light")}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  mode === "light"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Light Mode"
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light</span>
              </button>
            </div>

            {/* Hue Slider */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-mono">Hue:</span>
              <input
                type="range"
                min="-180"
                max="180"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-20 sm:w-24 accent-primary cursor-pointer"
              />
              <span className="font-mono text-[11px] w-8">{hue}°</span>
            </div>

            {/* Saturation Slider */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-mono">Sat:</span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-20 sm:w-24 accent-primary cursor-pointer"
              />
              <span className="font-mono text-[11px] w-6">{saturation}x</span>
            </div>

            {/* Reset Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              title="Reset Dials"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
