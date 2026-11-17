---
name: animate-ui
description: Comprehensive design system and component library guide for `@animate-ui/react` and `motion`. Use when building, animating, or polishing interactive UI elements including animated Select, Questionnaire, PreviewLinkCard, Pagination, Menubar, InputOTP, HoverCard, DropdownMenu, Drawer, Dialog, AlertDialog, ContextMenu, Combobox, CodeBlock, Checkbox, Carousel, Toast, Tooltip, and MotionGrid across the platform.
---

# Animate UI Component Library & Motion Architecture

This skill provides the authoritative engineering standard, API references, and copy-paste component patterns for `@animate-ui/react` and `motion` in React 19 + Tailwind v4 applications.

---

## 📦 Installed Packages

```json
{
  "@animate-ui/react": "^2.4.6",
  "motion": "^12.4.0",
  "@hugeicons/react": "^1.1.10",
  "@hugeicons/core-free-icons": "^4.3.5"
}
```

---

## 📂 Component Registry (`src/components/animate-ui/`)

All components are located in `src/components/animate-ui/` and exported via `src/components/animate-ui/index.ts`.

| Component | Subpath Primitive | Key Feature |
| :--- | :--- | :--- |
| **`Select`** | `@animate-ui/react/primitives/radix-ui` | Smooth height-morphing dropdown with scroll buttons & check animations (`draw` or `pop`) |
| **`Questionnaire`** | `@animate-ui/react/primitives/questionnaire` | Multi-step interactive decision wizard with progress bar, validation, and step transitions |
| **`PreviewLinkCard`** | `@animate-ui/react/primitives/base-ui/preview-link-card` | Hover card that displays a live snapshot/screenshot of the destination link |
| **`Pagination`** | `@animate-ui/react/primitives/pagination` | Sliding layout outline indicator that glides between active page numbers |
| **`Menubar`** | `@animate-ui/react/primitives/base-ui/menubar` | Full desktop-grade application menubar with submenus, shortcuts, and indicators |
| **`InputOTP`** | `@animate-ui/react/primitives/input-otp` | High-fidelity OTP input where typed characters pop in and pasted codes stagger |
| **`HoverCard`** | `@animate-ui/react/primitives/base-ui/preview-card` | Floating popover with rich metadata preview on cursor hover |
| **`DropdownMenu`** | `@animate-ui/react/primitives/base-ui/menu` | Animated accessible dropdown menu with smooth scaling and keyboard shortcuts |
| **`Drawer`** | `@animate-ui/react/primitives/base-ui/drawer` | Mobile-first bottom sheet or side panel with snap points and swipe-to-dismiss |
| **`Dialog`** | `@animate-ui/react/primitives/base-ui/dialog` | Modal dialog with backdrop blur, scale transition, and escape key handling |
| **`AlertDialog`** | `@animate-ui/react/primitives/base-ui/alert-dialog` | Destructive or confirmation modal with focus trapping and action guards |
| **`ContextMenu`** | `@animate-ui/react/primitives/base-ui/context-menu` | Right-click cursor popup with nested groups and radio/checkbox options |
| **`Combobox`** | `@animate-ui/react/primitives/base-ui` | Searchable select with keyboard navigation, chips, and animated clear buttons |
| **`CodeBlock`** | `@animate-ui/react/primitives/code-block` | Animated typewriter code block with copy button icon swapping and line numbering |
| **`Checkbox`** | `@animate-ui/react/primitives/base-ui/checkbox` | Accessible checkbox with SVG `draw` or `pop` checkmark animation |
| **`Carousel`** | `@animate-ui/react/primitives/carousel` | Embla-powered 3D carousel with slide counter, dots, and scale transitions |
| **`Toast`** | `@animate-ui/react/primitives/base-ui/toast` | Stacked floating notifications with progress bar, undo action, and swipe dismissal |
| **`Tooltip`** | `@animate-ui/react/primitives/base-ui/tooltip` | Micro-hint tooltip with pointer arrow and delay tuning |
| **`MotionGrid`** | `@animate-ui/react/primitives/motion-grid` | 5x5 dot matrix loading, thinking, and saving indicator with rotating labels |

---

## 🛠️ Usage Examples

### 1. MotionGrid (AI Thinking / Status Indicator)
Used in `AiMentorMessenger.tsx` for real-time cognitive thinking feedback:

```tsx
import { MotionGrid, MotionGridCells } from "@/components/animate-ui/motion-grid";

<MotionGrid
  gridSize={[5, 5]}
  frames={[
    [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
    [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
    [[0, 0], [4, 4], [2, 2], [0, 4], [4, 0]],
  ]}
  className="w-fit gap-0.5"
>
  <MotionGridCells className="aspect-square size-[2.5px] rounded-full bg-primary/30 data-[active=true]:bg-primary" />
</MotionGrid>
```

### 2. Animated Select
Smooth dropdown selection with check animations:

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/animate-ui/select";

<Select defaultValue="react">
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select Framework" />
  </SelectTrigger>
  <SelectContent checkAnimation="draw">
    <SelectItem value="react">React 19</SelectItem>
    <SelectItem value="tanstack">TanStack Start</SelectItem>
    <SelectItem value="tailwind">Tailwind v4</SelectItem>
  </SelectContent>
</Select>
```

### 3. Typewriter Code Block
Animated code display with copy confirmation:

```tsx
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/animate-ui/code-block";

<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>SystemDesign.ts</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={codeText} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent lineNumbers>
    {codeLines.map((line, idx) => (
      <CodeBlockLine key={idx}>{line}</CodeBlockLine>
    ))}
  </CodeBlockContent>
</CodeBlock>
```

---

## 🛡️ Production Best Practices
1. **Always use `@/lib/utils` for `cn`**: Never import `cn` directly from `"cn"`.
2. **Subpath imports for `@animate-ui/react`**: `@animate-ui/react` exports subpath primitives (e.g. `@animate-ui/react/primitives/radix-ui`, `@animate-ui/react/primitives/base-ui/...`). Do not import from the bare root package.
3. **Hugeicons integration**: Use `<HugeiconsIcon icon={IconName} strokeWidth={2} />` for smooth icon rendering.
4. **Clean DOM disposal**: Clean up all intervals, timers, and Web Audio contexts on component unmount.
