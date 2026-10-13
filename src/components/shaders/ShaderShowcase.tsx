import { useState, useRef, useCallback } from "react";
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
  Cpu,
  AlertTriangle,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { ShaderButtons, type ShaderButtonVariant } from "./ShaderButtons";
import { SHADER_REGISTRY, SHADER_VARIANTS_LIST, type ShaderVariantMetadata } from "./shaderRegistry";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type RendererState = "initializing" | "compiling" | "ready" | "switching" | "error";

export function ShaderShowcase({ className = "" }: { className?: string }) {
  const [selectedVariant, setSelectedVariant] = useState<ShaderButtonVariant>("raking-light-pill");
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"canvas" | "code">("canvas");
  const [rendererState, setRendererState] = useState<RendererState>("ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generationRef = useRef<number>(0);

  const currentVariantInfo: ShaderVariantMetadata =
    SHADER_REGISTRY[selectedVariant] || SHADER_REGISTRY["raking-light-pill"];

  // Handle switching shader variant safely with generational token
  const handleSelectVariant = useCallback((variantId: ShaderButtonVariant) => {
    if (variantId === selectedVariant) return;
    generationRef.current += 1;
    const nextMeta = SHADER_REGISTRY[variantId];

    setRendererState("switching");
    setErrorMessage(null);
    setSelectedVariant(variantId);

    // Synchronize dials with the new shader defaults to prevent stale leak
    if (nextMeta) {
      setMode(nextMeta.defaultMode);
      setHue(nextMeta.defaultHue);
      setSaturation(nextMeta.defaultSaturation);
      setBrightness(nextMeta.defaultBrightness);
    }
  }, [selectedVariant]);

  const handleShaderReady = useCallback(() => {
    setRendererState("ready");
    setErrorMessage(null);
  }, []);

  const handleShaderError = useCallback((err: string) => {
    console.warn(`[ShaderShowcase] Error for ${selectedVariant}:`, err);
    setRendererState("error");
    setErrorMessage(err);
  }, [selectedVariant]);

  const handleRetry = useCallback(() => {
    generationRef.current += 1;
    setRendererState("initializing");
    setErrorMessage(null);
    // Force re-trigger by resetting to default dials
    setHue(currentVariantInfo.defaultHue);
    setSaturation(currentVariantInfo.defaultSaturation);
    setMode(currentVariantInfo.defaultMode);
    toast.info("Retrying shader initialization…");
  }, [currentVariantInfo]);

  // Code to display and copy: actual GLSL shader and source for active variant
  const activeCode = currentVariantInfo.glslFragment
    ? `// ============================================================================
// ${currentVariantInfo.label} — Live GLSL Fragment Shader
// Renderer: ${currentVariantInfo.type}
// ============================================================================

${currentVariantInfo.glslFragment}

// Vertex Shader:
${currentVariantInfo.glslVertex || `attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`}

// React Integration:
import { ShaderButtons } from "@/components/shaders";

export function HeroButton() {
  return (
    <ShaderButtons
      variant="${selectedVariant}"
      mode="${mode}"
      ${hue !== 0 ? `hue={${hue}}\n      ` : ""}${saturation !== 1 ? `saturation={${saturation}}\n      ` : ""}
    />
  );
}`
    : `// ============================================================================
// ${currentVariantInfo.label} — Implementation Source
// Renderer: ${currentVariantInfo.type}
// ============================================================================

${currentVariantInfo.sourceCode}

// React Integration:
import { ShaderButtons } from "@/components/shaders";

export function HeroButton() {
  return (
    <ShaderButtons
      variant="${selectedVariant}"
      mode="${mode}"
      ${hue !== 0 ? `hue={${hue}}\n      ` : ""}${saturation !== 1 ? `saturation={${saturation}}\n      ` : ""}
    />
  );
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    toast.success(`${currentVariantInfo.label} shader code copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setHue(currentVariantInfo.defaultHue);
    setSaturation(currentVariantInfo.defaultSaturation);
    setBrightness(currentVariantInfo.defaultBrightness);
    setMode(currentVariantInfo.defaultMode);
    toast.info("Shader dials restored to default configuration");
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
              Production Runtime (WebGL + Three.js + GLSL)
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "canvas"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Live Canvas
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
            className="gap-1.5 text-xs h-9 border-border/70 cursor-pointer"
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
            <span>Available Shader Variants ({SHADER_VARIANTS_LIST.length})</span>
            <Cpu className="h-3.5 w-3.5 text-primary" />
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1 focus-visible:outline-none">
            {SHADER_VARIANTS_LIST.map((v) => {
              const isActive = selectedVariant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectVariant(v.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
                      : "border-border/70 bg-card/60 hover:bg-muted/40 hover:border-border text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
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
          <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-zinc-950 min-h-[380px] sm:min-h-[440px] flex flex-col shadow-inner">
            {/* Stage Status Bar */}
            <div className="w-full px-4 py-2.5 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{currentVariantInfo.label}</span>
                <span className="text-[11px] font-mono text-muted-foreground">({currentVariantInfo.type})</span>
              </div>
              <div className="flex items-center gap-2">
                {rendererState === "error" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[11px] font-medium">
                    <AlertTriangle className="h-3 w-3" /> Error
                  </span>
                ) : rendererState === "switching" || rendererState === "initializing" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-medium">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Compiling WebGL
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Renderer Ready
                  </span>
                )}
              </div>
            </div>

            {activeTab === "canvas" ? (
              <div className="relative w-full flex-1 flex flex-col items-center justify-center p-4">
                {/* Error recovery overlay if renderer fails */}
                {rendererState === "error" ? (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 text-center max-w-md my-auto">
                    <AlertTriangle className="h-10 w-10 text-amber-400" />
                    <h3 className="text-base font-semibold text-foreground">
                      Shader Initialization Interrupted
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {errorMessage || "The WebGL context could not be acquired or context quota was exceeded."}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" onClick={handleRetry} className="gap-1.5 text-xs">
                        <RefreshCw className="h-3.5 w-3.5" /> Retry Renderer
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleReset} className="gap-1.5 text-xs">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset Dials
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[340px] flex items-center justify-center my-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedVariant}-${generationRef.current}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full min-h-[340px] flex items-center justify-center"
                      >
                        <ShaderButtons
                          variant={selectedVariant}
                          mode={mode}
                          hue={hue}
                          saturation={saturation}
                          brightness={brightness}
                          onReady={handleShaderReady}
                          onError={handleShaderError}
                          className="w-full h-full"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* Footer hints */}
                <div className="mt-auto pt-3 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-muted-foreground/80">
                  <span>Hover to intensify light bands</span>
                  <span>•</span>
                  <span>Click to interact</span>
                  <span>•</span>
                  <span>Rendered via raw WebGL / ThreeUI</span>
                </div>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs text-zinc-400 bg-zinc-900/50">
                  <span className="font-mono flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    {currentVariantInfo.label} — GLSL / Source Architecture
                  </span>
                  <button
                    onClick={handleCopy}
                    className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-emerald-400 overflow-auto max-h-[380px] whitespace-pre leading-relaxed select-all bg-black/60">
                  {activeCode}
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
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
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
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
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
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              title="Reset Dials to Default"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
