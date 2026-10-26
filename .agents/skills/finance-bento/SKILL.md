---
name: finance-bento
description: This skill should be used when the user asks to "build a financial dashboard", "create a net worth stream chart", "render financial bento grid", "build crypto sparkline candlestick cards", "visualize cash flow mirrored waves", "personal finance dashboard with currency switcher", or "use the finance-bento component from 21st.dev". Covers SVG procedural charts, currency conversion (USD/EUR), period filtering (1M, 3M, 1Y, All), responsive bento grid layouts, and high-performance DOM/SVG animations.
version: 1.0.0
---

# Finance Bento — Pro Personal Finance Dashboard

The **Finance Bento** is a high-density, dark-mode financial dashboard that visualizes multi-asset wealth (fiat currency, equities/stocks, and crypto assets) across an interactive bento grid.

## 🌟 Visual Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Title ("Overview") + Subtitle + Period & Currency   │
├───────────────────────────────────┬─────────────────────────┤
│ Net Worth Stream (Span 8)        │ Allocation Gauge        │
│ Continuous multi-asset bands      │ 180° radial tick gauge  │
│ with interactive tooltip scrubbing│ & percentage table      │
├─────────────┬─────────────┬───────┴─────┬───────────────────┤
│ Return KPI  │ Free Cash   │ Upcoming    │ Financial Goals   │
│ Accent Tile │ Runway bar  │ Payments    │ Progress bars     │
├─────────────┴─────────────┼─────────────┼───────────────────┤
│ Cash Flow Wave (Span 5)   │ Crypto Pot  │ Stocks Volume     │
│ Mirrored income/spending  │ 7d sparkline│ Weekday capsules  │
└───────────────────────────┴─────────────┴───────────────────┘
```

---

## 📦 Component Locations

- **Main Component**: `src/components/ui/finance-bento.tsx`
- **Interactive Demo**: `src/components/ui/finance-bento.demo.tsx`

---

## 🛠️ Data Contract & Props

```typescript
export interface FinanceBentoData {
  /** Month-end balances by asset class, oldest first (24+ months for "All"). */
  history: { date: string; fiat: number; stocks: number; crypto: number }[];
  /** Upcoming scheduled expenses. */
  payments: { name: string; date: string; amount: number }[];
  /** Savings or investment milestones. */
  goals: { name: string; progress: number; target: number }[];
  /** 6 months of historical income and spending, in thousands. */
  cashflow: { months: string[]; income: number[][]; spending: number[][] };
  /** Cryptocurrencies: share, 24h change, and 7-day OHLC candles. */
  crypto: {
    name: string;
    symbol: string;
    share: number;
    change: string;
    ohlc: number[][]; // [open, high, low, close]
  }[];
  /** Weekly trading volume in thousands. */
  stocks: { days: string[]; values: number[] };
}

export interface FinanceBentoProps {
  data: FinanceBentoData;
  title?: string;
  subtitle?: string;
  avatar?: string;
  avatarAlt?: string;
  credit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

---

## 🎨 Visualization Modules Explained

### 1. Net Worth Stream (`#nw`)
- Renders an organic cubic spline area stream spanning fiat (white), stocks (indigo/periwinkle `#A9B2FF`), and crypto (orange/copper `#FFB37A`).
- Dot-matrix counter animates numerical totals on currency or period changes.
- Pointer scrubbing displays interactive crosshair (`.hl`) and floating tooltip (`#tip`).

### 2. Allocation Arc (`#alloc`)
- 56 radial vector ticks mapped across a 180° semicircle.
- Displays target asset allocation (e.g. 60/40) and breakdown percentages with inline color bullets.

### 3. Key Performance Indicators (`.kpi`)
- **Portfolio Return**: High-visibility lime accent tile (`#E8FF1F`) with arrow glyph and tweened percentage.
- **Free Cash & Runway**: Runway tick-scale measuring months of operational buffer.
- **Next Payments**: Compact list with category letter glyphs and due dates.
- **Goals Progress**: Dual-track milestone bars with animated completion percentages.

### 4. Cash Flow Wave (`#flow`)
- Mirrored sinusoidal paths: positive income arcs above baseline, spending troughs below baseline.
- Multi-year comparison layers (current year solid, previous years muted).

### 5. Crypto Sparklines (`#crypto`)
- Segmented asset distribution bar.
- Individual 7-day sparkline charts for top holdings (BTC, ETH, SOL) with gradient fills and 24h delta tags.

### 6. Stocks Volume (`#stocks`)
- Pill-shaped capsule bars for each trading day (Mon–Fri).
- Interactive hover tooltips breaking down Buy vs. Sell volume.

---

## 🚀 Quick Usage Example

```tsx
import { FinanceBento } from "@/components/ui/finance-bento";
import { sampleFinanceData } from "@/components/ui/finance-bento.demo";

export function DashboardPage() {
  return (
    <div className="w-full bg-black py-8 px-4">
      <FinanceBento
        data={sampleFinanceData}
        title="Personal Treasury"
        subtitle="Live Market Sync"
        avatar="/assets/vishwajeet-profile.png"
        avatarAlt="Vishwajeet"
        credit={false}
      />
    </div>
  );
}
```
