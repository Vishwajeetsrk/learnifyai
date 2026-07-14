# Design System: Learnify AI

## 1. Visual Theme & Atmosphere

A restrained, confident learning platform with generous whitespace and controlled asymmetry. The atmosphere is "premium ed-tech" — clinical enough for focus, warm enough for engagement. Density is moderate (5/10), variance is medium (5/10), motion is fluid (6/10). The interface should feel like a well-lit modern library crossed with a creative studio — nothing cartoonish, nothing corporate-bland.

## 2. Color Palette & Roles

- **Canvas** (#FAFAFA) — Primary background surface
- **Pure White** (#FFFFFF) — Card and container fill
- **Deep Ink** (#18181B) — Primary text, headings
- **Muted Slate** (#71717A) — Secondary text, descriptions, metadata
- **Soft Border** (rgba(226,232,240,0.6)) — Card borders, 1px structural lines
- **Electric Cobalt** (#4F46E5) — Single accent for CTAs, active states, focus rings, interactive elements
- **Cobalt Glow** (rgba(79,70,229,0.2)) — Subtle glow on hover states (no neon)
- **Success Teal** (#059669) — Completion, verification badges
- **Warning Amber** (#D97706) — Alerts, pending states
- **Error Rose** (#DC2626) — Destructive actions, error states

Dark mode:
- **Deep Surface** (#0F0F11) — Primary dark background
- **Card Dark** (#1A1A1E) — Dark card fill
- **Light Text** (#F4F4F5) — Primary text in dark mode
- **Dim Text** (#A1A1AA) — Secondary text in dark mode
- **Border Dark** (rgba(255,255,255,0.08)) — Subtle dark borders

## 3. Typography Rules

- **Display:** Space Grotesk — Track-tight, weight-driven hierarchy. Headings use font-weight 700 with letter-spacing -0.02em. Never use font-size alone for hierarchy — pair with weight and color.
- **Body:** DM Sans — Relaxed leading (1.5), 65ch max-width on reading content. Neutral secondary color for descriptions.
- **Mono:** JetBrains Mono (via Tailwind) — For code blocks, inline code, timestamps, metrics.
- **Scale:** 48px (display) → 36px (h1) → 30px (h2) → 24px (h3) → 20px (h4) → 16px (body) → 14px (caption) → 12px (tiny).
- **Banned:** Inter for premium contexts. Georgia/Times New Roman/Garamond. Pure black text (#000). All-caps body text.

## 4. Component Stylings

- **Buttons:** Flat by default, no outer glow. Indigo fill for primary (`bg-indigo-600`), ghost/outline for secondary. 0.875rem radius. Hover: subtle scale(1.02) + deeper shadow. Active: translateY(-1px) tactile feedback.
- **Cards:** 0.875rem radius. White fill in light mode, dark fill in dark mode. Diffused border (1px solid). Shadow only when elevation communicates hierarchy. For high-density lists (dashboard), replace with border-top dividers instead of card containers.
- **Inputs:** Label above input, helper text optional, error text below in Rose. Focus ring in indigo-500 at 2px. No floating labels. Minimum touch target 44px.
- **Loaders:** Skeletal shimmer matching exact layout dimensions — never circular spinners for content areas. Spinners only for non-content operations (auth, payments).
- **Empty States:** Composed illustrations with clear copy and a single CTA. Never just "No data" text centered on a blank page.
- **Navigation:** Fixed sidebar on desktop (dashboard), top nav for marketing pages. Mobile: bottom tab bar or slide-out drawer. Active state: subtle indigo accent on left border for sidebar items.

## 5. Layout Principles

- CSS Grid over Flexbox math — never `calc()` for width distribution.
- Contain layouts at 1400px max-width centered. Dashboard can go full-bleed to 1600px.
- Hero sections: left-aligned or split-screen. Centered heroes allowed only on landing pages with low variance.
- Feature rows: 2-column zig-zag or asymmetric grid. Never "3 equal cards horizontally" — that pattern is banned.
- Full-height sections use `min-h-[100dvh]` — never `h-screen` (prevents iOS Safari catastrophic jump).
- Mobile-first: all multi-column collapses to single column below 768px. No exceptions. No horizontal overflow.

## 6. Motion & Interaction

- **Spring Physics:** stiffness 100, damping 20 for all interactive elements. No linear easing.
- **Staggered Orchestration:** Mount lists with cascade delays (50ms per item). Never mount all items instantly.
- **Performance:** Animate exclusively via `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`.
- **Micro-interactions:** Hover: `scale(1.02)` + subtle shadow lift. Focus: indigo ring at 2px. Active: `translateY(-1px)`.
- **Page transitions:** Fade + subtle slide-up (translateY(4px) → 0). 200ms duration.
- **Scrolling:** Smooth scroll behavior on html. No custom scrollbars that break platform conventions.
- **No perpetual animation on static elements:** Only loading/active states animate infinitely. No rainbow glows, no pulsing backgrounds unless indicating active processing.

## 7. Responsive Rules

- **<768px (Mobile):** Single column for all layouts. Navigation collapses to bottom tab bar or drawer.
- **768-1024px (Tablet):** 2-column grids where appropriate. Sidebar collapses to icons only.
- **>1024px (Desktop):** Full layouts with sidebar.
- **Typography:** Headlines scale via `clamp()`. Display: `clamp(2rem, 5vw, 3rem)`. Body minimum 14px.
- **Touch:** 44px minimum tap target on all interactive elements. 8px minimum gap between touch targets.
- **Images:** Inline images stack below text on mobile. No horizontal scrolling ever.

## 8. Anti-Patterns (Banned)

- No emojis in production UI
- No Inter font family
- No pure black (#000000)
- No neon/outer glow shadows (`box-shadow` with spread + high opacity color)
- No oversaturated accents (saturation > 80%)
- No excessive gradient text on large headers (headings should be legible, not decorative)
- No custom mouse cursors — platform-native only
- No overlapping elements — every element occupies its own clean spatial zone
- No 3-column equal card layouts
- No generic names ("John Doe", "Acme", "Nexus", "Startup")
- No fake statistics or fabricated metrics
- No "LABEL // YEAR" formatting conventions
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "Supercharge")
- No filler UI text ("Scroll to explore", "Swipe down", bouncing chevrons)
- No broken image links — prefer SVG illustrations over Unsplash URLs
- No `h-screen` — use `min-h-[100dvh]` instead
- No rainbow/cycling glow animations on production UI elements
