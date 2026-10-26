---
name: doodle-crew-footer
description: This skill should be used when the user asks to "build an animated doodle footer", "add a sketchbook footer with characters", "create a living wordmark footer", "stamp brand letters with hand-drawn characters", "implement interactive pointer-tracking cartoon eyes in footer", or "use the doodle-crew-footer component from 21st.dev". Covers SVG procedural characters, wordmark letter advances, gaze tracking, falling doodle physics, line-boil filters, and responsive layout.
version: 1.0.0
---

# Doodle Crew Footer — Sketchbook Living Site Footer

The **Doodle Crew Footer** renders a site footer styled like the final sketchbook page of a creative project. The brand name or wordmark is stamped across the canvas in dry-brush ink, accompanied by an animated crew of hand-drawn vector characters who sit, lean, or peek over the glyphs.

## 🌟 Key Features

1. **Procedural Storyboard Timeline**:
   - Ground line draws itself dynamically with pebbles and tufts.
   - Letters stamp down sequentially with puff-of-dust ink particles.
   - Crew characters pop up, plop down, or peek over top edges.
   - Floating doodles (stars, flames, sandwiches, lightning bolts, hearts) drift down gently.
   - Copy tagline and action CTA buttons rise into place.
2. **Interactive Living Loop**:
   - Every character's eyes follow the cursor with natural lag and periodic organic blinking.
   - 8 FPS SVG turbulence line-boil simulation gives authentic hand-drawn ink vibration.
   - Clicking characters triggers a bounce animation and customized speech bubble.
   - Doodles scatter from the pointer and pop when tapped.
   - Squiggle SVG underlines draw themselves on link hover.
3. **Zero Heavy External Dependencies**:
   - Inline SVG paths with procedural calculations.
   - No external physics engines required.
   - Fully accessible: reduced motion queries respect user OS preferences.

---

## 📦 Component Location

- **Reusable Component**: `src/components/ui/doodle-crew-footer.tsx`
- **Demo / Sandbox**: `src/components/ui/doodle-crew-footer.demo.tsx`

---

## 🛠️ Props Reference

```typescript
export interface DoodleCrewFooterProps {
  /** The giant stamped wordmark (e.g. "LEARNIFY", "MISCHIEF"). 4-9 letters recommended. */
  wordmark?: string;
  /** Brand text title. */
  brand?: string;
  /** Custom logo image path (e.g. "/assets/learnify-logo.png"). */
  logoUrl?: string;
  /** Custom logo ReactNode for complex marks or icon components. */
  logoNode?: React.ReactNode;
  /** Toggle brand name text display next to logo. Default false when full logo mark is provided. */
  showBrandText?: boolean;
  /** Brand blurb under the logo. */
  blurb?: string;
  /** Extra element injected under the blurb (creator badge, live indicators, etc.). */
  extraBrandContent?: React.ReactNode;
  /** Editorial tagline under the wordmark. */
  tagline?: string;
  /** Navigation columns array with title and links. */
  columns?: FooterColumn[];
  /** Pill action CTA buttons under the tagline. */
  actions?: FooterAction[];
  /** Copyright string. */
  copyright?: string;
  /** Legal links in the bottom bar. */
  legal?: FooterLink[];
  /** Social links in the bottom bar. */
  socials?: FooterLink[];
  /** Show back-to-top button. Defaults to true. */
  backToTop?: boolean;
  /** Custom crew character array placed on specific letter indices. */
  crew?: CrewMember[];
  /** Doodles drifting in background. */
  doodles?: DoodleKind[];
  /** Number of concurrent doodles. Default: 12. */
  doodleCount?: number;
  /** Color preset: "night" | "auto" | "paper" | "riso" | "sunny". */
  preset?: DoodleCrewPreset;
  /** Custom palette overrides: { background, ink, accent }. */
  palette?: { background?: string; ink?: string; accent?: string };
  /** Display font family for the giant wordmark. */
  fontFamily?: string;
  /** Font family for tagline and body copy. */
  serifFamily?: string;
  /** Tracking between wordmark letters in em. Default: -0.02. */
  tracking?: number;
  /** Enable mouse interactions, eye tracking, and pop clicks. Defaults to true. */
  interactive?: boolean;
  /** Minimum footer height. Defaults to "760px". */
  height?: string;
  className?: string;
}
```

---

## 🎨 Crew Positioning Guide

Crew members map to wordmark letters by index (0-indexed):

```typescript
const LEARNIFY_CREW: CrewMember[] = [
  { kind: "yeti", letter: 0, seat: "front", offset: -0.32, name: "Bruno", says: "Hungry for knowledge? Build something great!" },
  { kind: "bird", letter: 1, seat: "top", offset: 0.02, name: "Pip", says: "Tweet us! Launch Studio v4.2." },
  { kind: "mushroom", letter: 2, seat: "front", offset: 0.12, scale: 0.95, name: "Morel", says: "AI Engineers belong here." },
  { kind: "kid", letter: 4, seat: "top", offset: -0.05, name: "Juno", says: "Best seat in the house. Welcome to Learnify AI!" },
  { kind: "ghost", letter: 6, seat: "behind", offset: 0, name: "Boo", says: "Zero bugs in production!" },
  { kind: "cat", letter: 7, seat: "front", offset: 0.42, flip: true, name: "Patch", says: "Purrfect prompts make perfect models." },
];
```

* `seat`: `"front"` (stands in front), `"top"` (sits on letter cap), or `"behind"` (peeks over top edge).
* `offset`: Horizontal slide relative to letter center (-0.5 to 0.5).
* `flip`: Boolean to mirror direction.
* `says`: Speech bubble text displayed on click.

---

## 🚀 Quick Usage Example

```tsx
import { DoodleCrewFooter } from "@/components/ui/doodle-crew-footer";

export function CustomFooter() {
  return (
    <DoodleCrewFooter
      wordmark="LEARNIFY"
      brand="Learnify AI"
      logoUrl="/assets/learnify-logo.png"
      preset="night"
      tagline="Learn smarter. Grow faster. Built for developers and creators."
      blurb="The AI-native learning & career operating system."
    />
  );
}
```
