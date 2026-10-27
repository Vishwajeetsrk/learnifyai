---
name: faq-drawer
description: Tactile card-index FAQ drawer component. Features physical index cards with staggered tabs in a recessed metal drawer tray with label holder, cup pull, aluminium/graphite finish, and native details-content spring interpolation.
---

# FAQ Drawer — Tactile Card-Index FAQ Component

A high-craft FAQ block styled like a library card-index drawer. Questions are typed along index card edges on staggered tabs; opening one card smoothly lifts it from the drawer and reveals the answer typed on the ruled stock beneath a double heading line.

## Key Features
- **Zero-runtime-overhead**: Driven by native `<details>` and `<summary>` elements with `name` grouping for single-card expansion.
- **Interpolate-size Transition**: Uses modern CSS `interpolate-size: allow-keywords` and `::details-content` transition for buttery smooth, zero-JS content unfolds.
- **Embedded Fonts**: Includes embedded `Instrument Sans` (UI framing) and `Geist Mono` (typewriter card stock) data URIs, completely independent of external CDNs.
- **Dual Finish**: Automatically responds to light and dark modes with `aluminium` and `graphite` metal drawer tones.
- **Fully Accessible**: Keyboard navigation (`Tab`, `Enter`, `Space`), `aria-labelledby`, and `prefers-reduced-motion` compliance.

## Usage

```tsx
import { FaqDrawer } from "@/components/ui/faq-drawer";

// Basic usage with platform default cards
<FaqDrawer />

// Custom cards with specific finish
<FaqDrawer
  label="Billing & Plans"
  title="Frequently Asked Questions"
  lead="Clear answers to our subscription, refund, and payment questions."
  drawer="Learnify · Pricing"
  finish="auto"
  cards={[
    {
      id: "billing",
      tab: "Pricing",
      q: "How does subscription billing work?",
      a: "Subscriptions are billed in INR (₹) monthly or annually with 18% GST invoices.",
    },
    {
      id: "refunds",
      tab: "Refunds",
      q: "Can I get a refund?",
      a: "Yes, we provide an instant 7-day money-back guarantee.",
    },
  ]}
  askLabel="Contact Support"
  askHref="mailto:support@learnifyai.in"
/>
```
