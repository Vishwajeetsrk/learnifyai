---
name: motion-video-director
description: AI-directed deterministic motion-graphics explainer video director and Scrimba generator. Transforms topics, questions, codebases, or reference videos into high-retention motion-graphics explainer videos with storyboards, SVG/Remotion frames, diagrams (quadrant infographics, deep learning architecture networks), synthesized audio & ambient soundtrack, timeline locking, synchronized transcript cues, and seamless Scrimba Split (Watch & Code) interactive IDE integration.
---

# Motion Video Director (MVD) & Scrimba Explainer Engine

MVD is an AI-directed motion-graphics production system and interactive learning runtime for Learnify AI. It turns natural language prompts, code repositories, or reference videos into high-retention explainer videos paired with interactive Scrimba code environments.

---

## 🎯 Core Production Loop

```
Prompt / Topic / Code / Reference Video
   │
   ▼
1. Creative Brief & Audience Mapping (Identify hook, core concept, payoff)
   │
   ▼
2. Retention Map & Storyboard Generation (Scene sequence: Hook → Diagram → Deep Dive → Payoff → Code)
   │
   ▼
3. Frame Architecture & Visual Diagrams:
   • Quadrant Infographic Cards (e.g. 4-quadrant pinned infographic with vector illustrations)
   • Deep Learning Graphs (Neural network layers, weights, attention heads, loss curves)
   • Dynamic Code Highlights & UI Mockups
   │
   ▼
4. Audio Engine:
   • Voiceover Narration (7 teaching personas: Explain, Standard, Per, Tom, LOL, Professor, TLDR)
   • Ambient Music Synthesizer (Web Audio API harmonic chords, low-pass filter, volume ducking)
   • Audio cues & SFX (subtle pops, whooshes, chapter chimes)
   │
   ▼
5. Dual-Mode Playback Engine:
   • [Watch Mode] Immersive Explainer Theater (segmented timeline, scrub preview, zoom camera, transcript)
   • [Watch & Code Mode] Scrimba Split (synchronized explainer playback + Monaco live coding & cloud runner)
   • Top-Right "🔭 GO DEEPER" button triggering instant transition into code exploration
```

---

## 🧩 Visual Diagram & Deep Learning Schemas

### 1. The Pinned 4-Quadrant Infographic (`diagram-quadrant`)
- **Structure**: Center card pinned with an illustrated push-pin.
- **Quadrants**: 4 distinct quadrants (e.g., The Two Poles, Push & Pull, The Field, Always Two).
- **Camera Focus**: Smooth CSS transform `scale(1.8) translate(x, y)` zooming into the active quadrant as the narrator explains that section.
- **Badge**: Clean "Generated image" or "Neural Diagram" badge in bottom right.

### 2. Deep Learning Neural Architecture (`diagram-deep-learning`)
- **Layers**: Input Layer (features), Hidden Layers (dense weights, activation functions ReLU/GELU), Output Layer (logits/probabilities).
- **Interactive Forward/Backward Pass**: Highlighted pulse moving through synapses during forward pass; gradient descent vectors glowing on backpropagation.
- **Attention Matrix**: Visual heatmaps for Transformer attention heads.

### 3. Kinetic Concept & Formula Cards (`diagram-formula`)
- **Typography**: Clean math formulas with LaTeX-style layout, clear variable callouts, and intuitive real-world analogies.

---

## 🎬 Explainer Player UI Standards (Based on Reference Recording)

Every explainer video produced MUST conform to the Explain / Unpack reference design:
1. **Top Bar**:
   - Primary Title (e.g. `Introduction to Magnetism 🧲` or `Deep Learning: Neural Networks 🧠`)
   - Category / Breadcrumb
   - `[ 🔭 GO DEEPER ]` or `[ ⚡ CODE THIS IN SCRIMBA ]` action button
2. **Video Stage**:
   - Gradient backdrop with organic layered waves
   - Centered visual graphic (infographic card, earth orbit, neural net, or Monaco editor)
   - Smooth zoom-in focus transitions
   - High-contrast centered floating subtitle pill with active word highlight
3. **Player Controls Bar**:
   - Play / Pause button
   - Segmented Progress Bar: discrete segments matching each storyboard chapter with active glow
   - Timeline Scrubbing Tooltip: hover thumbnail preview with chapter title and timecode
   - Current time / Total time (`0:09 / 2:17`)
   - Playback speed switcher (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`)
   - Ambient music mute/volume toggle with audio ducking
   - Fullscreen / Theater expand button
4. **Metadata & Live Transcript**:
   - Creator info (`avatar`, username, `+ FOLLOW`, `👍 LIKE`, `🔖 SAVE`, `🚩 REPORT ISSUE`)
   - Metrics: duration, views, timestamp
   - Synchronized Transcript with clickable chapter headings that jump video timecode

---

## 💻 Scrimba Split (Watch & Code) Dual Engine

When coding is relevant to the topic:
- Provide an instantaneous mode switch between:
  - `[Watch Only]`: Full explainer theater
  - `[Watch & Code]`: Side-by-side or stacked split with live Monaco editor and instant sandbox runner
  - `[Full IDE]`: Maximized coding canvas
- **Teacher Pause on Edit**: When the learner begins typing, the video automatically pauses, and a glowing `↺ BACK TO TEACHER` button appears to resume teacher playback and reset code if desired.
