import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

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

export function ShaderButtons({ variant = "star-portal", ...props }: ShaderButtonsProps) {
  const resolved = (
    variant in LEGACY_SHADER_BUTTON_VARIANTS
      ? LEGACY_SHADER_BUTTON_VARIANTS[variant as LegacyShaderButtonVariant]
      : variant
  ) as ShaderButtonVariant;

  if (resolved in SHADER_BUTTON_VARIANTS) {
    const Variant = SHADER_BUTTON_VARIANTS[resolved];
    return (
      <Suspense fallback={null}>
        <Variant {...props} />
      </Suspense>
    );
  }

  const studyVariant: SelectedButtonStudyVariant =
    resolved in STUDY_FALLBACK_MAP
      ? STUDY_FALLBACK_MAP[resolved as ShaderButtonStudyVariant]
      : (resolved as SelectedButtonStudyVariant);

  return (
    <Suspense fallback={null}>
      <SelectedButtonStudies variant={studyVariant} {...props} />
    </Suspense>
  );
}
