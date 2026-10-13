import { lazy, Suspense, Component, type ComponentType, type LazyExoticComponent, type ErrorInfo, type ReactNode } from "react";
import { Sparkles, AlertTriangle, RotateCcw } from "lucide-react";

import type { NeuformIsolatedEffectProps } from "./NeuformIsolatedEffects";
import type { SelectedButtonStudyVariant } from "./SelectedButtonStudies";

export type ShaderButtonStudyVariant =
  | "liquid-glass"
  | "intelligence"
  | "holo-foil"
  | "particles"
  | "voice-orb"
  | "water"
  | "dither-hold"
  | "lava-lamp"
  | "gold"
  | "ink";

export type ShaderButtonVariant =
  | "star-portal"
  | "ignition-button"
  | "induction-button"
  | "plasma-button"
  | "tactile-button"
  | "thinking-button"
  | "raking-light-pill"
  | ShaderButtonStudyVariant
  | SelectedButtonStudyVariant;

/** @deprecated Variant names that shipped before a rename. Use {@link ShaderButtonVariant}. */
export type LegacyShaderButtonVariant = "uploading-button";

export type ShaderButtonsProps = NeuformIsolatedEffectProps & {
  variant?: ShaderButtonVariant | LegacyShaderButtonVariant;
  children?: React.ReactNode;
  onClick?: () => void;
  onReady?: () => void;
  onError?: (error: string) => void;
};

const LEGACY_SHADER_BUTTON_VARIANTS = {
  "uploading-button": "thinking-button",
} satisfies Record<LegacyShaderButtonVariant, ShaderButtonVariant>;

const STUDY_FALLBACK_MAP: Record<ShaderButtonStudyVariant, SelectedButtonStudyVariant> = {
  "liquid-glass": "glassy-split",
  intelligence: "generate-site",
  "holo-foil": "iridescent-glass",
  particles: "create-and-get-started",
  "voice-orb": "soft-surface",
  water: "glassy-split",
  "dither-hold": "chrome-upload",
  "lava-lamp": "balloon",
  gold: "start-growing",
  ink: "car-controls",
};

export function ShaderLoadingFallback({ label = "shader" }: { label?: string }) {
  return (
    <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-6 bg-zinc-950/90 rounded-2xl border border-white/5 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-primary/30 border-t-primary animate-spin" />
          <Sparkles className="w-4 h-4 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-mono font-medium text-foreground tracking-wide">
            Initializing {label}…
          </p>
          <p className="text-[11px] text-muted-foreground">
            Compiling WebGL shaders & allocating buffers
          </p>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  onError?: (err: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ShaderErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ShaderErrorBoundary] Caught shader error:", error, errorInfo);
    this.props.onError?.(error.message || "Shader rendering failed");
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[340px] flex flex-col items-center justify-center p-6 text-center bg-zinc-950 rounded-2xl border border-destructive/30">
          <AlertTriangle className="h-8 w-8 text-amber-400 mb-3" />
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Shader Failed to Initialize
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            {this.state.error?.message || "The WebGL context could not be acquired or was lost."}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            <RotateCcw className="h-3 w-3" /> Retry Shader
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SelectedButtonStudies = lazy(() =>
  import("./SelectedButtonStudies").then((module) => ({ default: module.SelectedButtonStudies })),
);

const SHADER_BUTTON_VARIANTS: Record<
  string,
  LazyExoticComponent<ComponentType<NeuformIsolatedEffectProps & { children?: React.ReactNode; onClick?: () => void }>>
> = {
  "star-portal": lazy(() =>
    import("./NeuformIsolatedEffects").then((module) => ({ default: module.StarPortal })),
  ),
  "ignition-button": lazy(() =>
    import("./NeuformIsolatedEffects").then((module) => ({ default: module.IgnitionButton })),
  ),
  "induction-button": lazy(() =>
    import("./NeuformIsolatedEffects").then((module) => ({ default: module.InductionButton })),
  ),
  "plasma-button": lazy(() =>
    import("./NeuformIsolatedEffects").then((module) => ({ default: module.PlasmaButton })),
  ),
  "tactile-button": lazy(() =>
    import("./NeuformIsolatedEffects").then((module) => ({ default: module.TactileButton })),
  ),
  "thinking-button": lazy(() =>
    import("./NeuformIsolatedEffects").then((module) => ({ default: module.ThinkingButton })),
  ),
  "raking-light-pill": lazy(() =>
    import("./RakingLightPillButton").then((module) => ({ default: module.RakingLightPillButton })),
  ),
};

export function ShaderButtons({
  variant = "star-portal",
  onReady,
  onError,
  ...props
}: ShaderButtonsProps) {
  const resolved = (
    variant in LEGACY_SHADER_BUTTON_VARIANTS
      ? LEGACY_SHADER_BUTTON_VARIANTS[variant as LegacyShaderButtonVariant]
      : variant
  ) as ShaderButtonVariant;

  const content = (() => {
    if (resolved in SHADER_BUTTON_VARIANTS) {
      const Variant = SHADER_BUTTON_VARIANTS[resolved];
      return (
        <Suspense fallback={<ShaderLoadingFallback label={resolved} />}>
          <Variant onReady={onReady} onError={onError} {...props} />
        </Suspense>
      );
    }

    const studyVariant: SelectedButtonStudyVariant =
      resolved in STUDY_FALLBACK_MAP
        ? STUDY_FALLBACK_MAP[resolved as ShaderButtonStudyVariant]
        : (resolved as SelectedButtonStudyVariant);

    return (
      <Suspense fallback={<ShaderLoadingFallback label={studyVariant} />}>
        <SelectedButtonStudies
          variant={studyVariant}
          onReady={onReady}
          onError={onError}
          {...props}
        />
      </Suspense>
    );
  })();

  return (
    <ShaderErrorBoundary onError={onError}>
      {content}
    </ShaderErrorBoundary>
  );
}
