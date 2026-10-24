import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);

const updates = {
  "c07c5952-c8dc-4f50-8bbb-5512b7ac42d3": `# Figma's Guide to Collaboration and Sharing Prototypes
**Reading Guide · 12 Minutes**

Collaboration is Figma's greatest superpower. Learn how multi-player editing, contextual commenting, branch merges, and prototype presentation links empower cross-functional teams.

---

## 1. Multiplayer Cursors & Observation Mode
* **Live Co-editing:** Multiple designers, developers, and product managers can collaborate inside the same file simultaneously without lockouts.
* **Observation Mode:** Click any collaborator's avatar in the top-right toolbar to follow their viewport view in real time—ideal for remote design critiques and design walkthroughs.

---

## 2. Contextual Comments & Pinning
* Press \`C\` to switch to Comment Mode. Click on any specific layer, frame, or component to leave targeted feedback.
* Mention teammates with \`@username\` to notify them via email or Slack.
* Resolve comments once feedback has been incorporated to keep the canvas clean.

---

## 3. Sharing Prototypes with Stakeholders
* Click the **Share** button in the prototype player to generate view-only links.
* Configure prototype options:
  - **Device Frame:** Match the target screen (iPhone, Pixel, Desktop).
  - **Hotspot Hinting:** Enable or disable blue flash hints when users click non-interactive areas.
  - **Password Protection:** Restrict confidential client mockups behind team permissions.
`,

  "41b0b3ea-2f50-4ee6-9355-2e529062ab4c": `# Final Project Overview: Capstone Mobile Application
**Project Blueprint · 15 Minutes**

Welcome to your Capstone Project for Designing User Interfaces and Experiences (UI & UX)! This project consolidates everything you have learned into a portfolio-ready mobile application.

---

## The Challenge
You will design and prototype a mobile application from initial user research and wireframing to high-fidelity Figma components and interactive animations.

### Choose Your Project Track:
1. **Track A: Sales & CRM Mobile App (Pulse CRM)** — Focus on data visualization, pipeline management, and contact interactions.
2. **Track B: Modern E-Commerce / Marketplace** — Focus on product cards, search/filter drawers, and checkout flows.
3. **Track C: EdTech / Habit Tracking Platform** — Focus on learning paths, daily streaks, quiz checkpoints, and certificate showcases.

---

## Mandatory Deliverables
- [ ] User Persona and Problem Statement document.
- [ ] Low-fidelity paper or Draw.io wireframe flow.
- [ ] Figma Master Design System with typography scale, color tokens, and button variants.
- [ ] 3 to 5 interactive screens connected via Smart Animate transitions.
- [ ] Self-evaluation checklist completed against the course rubric.
`,

  "0a9ce053-eb9f-4ffb-a2cf-7bc27d2b46f2": `# Leveraging Figma: From Design to Code Features
**Reading Guide · 12 Minutes**

Bridging the historic divide between design and frontend engineering: explore Figma's Dev Mode, code generation, and component inspection workflows.

---

## 1. Dev Mode Essentials
* **Box Model Inspector:** Hover over any element while holding \`Alt\` / \`Option\` to display precise padding and margin distances in pixels or rems.
* **Code Export:** Inspect production-ready CSS, Swift (iOS), or XML/Compose (Android) snippets directly from the properties panel.
* **Asset Export Ready:** Designers mark vector icons as \`Export as SVG\` and photos as \`Export as WebP\` so developers can grab assets with 1-click downloads.

---

## 2. Design Tokens in Code
* Modern teams map Figma Variables directly to Tailwind CSS configuration:
\`\`\`css
/* Tailwind CSS v4 / CSS Variables Mapping */
:root {
  --color-primary: #2563eb;
  --color-surface: #09090b;
  --radius-card: 1rem;
}
\`\`\`
* Eliminates guesswork and guarantees pixel-perfect parity between design and production code.
`,

  "f17ffd82-c376-4bc4-b096-ac7efeeddba9": `# Module 3 Summary: UI Design with Figma
**Module Summary · 10 Minutes**

Congratulations on completing Module 3! You have graduated from static layouts to dynamic, scalable design systems in Figma.

---

## Core Competencies Mastered
1. **Auto Layout Hierarchy:** Structuring nested flexbox-style containers with Hug, Fill, and Fixed constraints.
2. **Component Architecture:** Creating Master Components, managing instances, and defining Component Properties (Boolean, Text, Instance Swap).
3. **Design Tokens & Variables:** Centralizing brand colors, spacing, and typography into reusable styles and libraries.
4. **Interactive Prototyping:** Connecting frames with Smart Animate, interactive variant states (Hover, Active, Focused), and overlay sheets.
`,

  "14668d58-c89b-4fbe-9007-ad072361c2be": `# About the Practice Project
**Project Guide · 10 Minutes**

The Practice Project is your testing ground to experiment, make mistakes, and build confidence before submitting your final graded capstone.

---

## Why Practice First?
* Rapid iteration: Test different color schemes and typography pairings without fear of grading penalties.
* Get peer feedback: Share your Figma draft link with fellow Learnify AI learners in the Community Hub.
* Test responsiveness: Resize parent frames to confirm your Auto Layout constraints hold up under pressure.
`,

  "e2e8a750-4b2a-4c81-94b8-d2671e06f7c8": `# Leveraging AI-Driven Features and Plugins in Figma
**Reading & Practical Guide · 12 Minutes**

AI has become an indispensable co-pilot in modern digital product design. Discover how AI-powered tools inside Figma accelerate wireframing, copywriting, and visual exploration.

---

## 1. AI Content Generation
* **Realistic Dummy Copy:** Tools like Figma AI and Content Reel replace repetitive \`Lorem Ipsum\` with realistic user bios, product titles, and prices tailored to your industry.
* **Auto-Translation:** Test how UI layouts handle German or Japanese text expansion using automated multi-language translation plugins.

---

## 2. Automated Visual & Accessibility Audits
* **Contrast Auditing:** AI plugins automatically scan every text layer on your canvas and flag any elements failing WCAG AA (4.5:1) compliance.
* **Visual Icon Generation:** Generate custom vector SVG icons on demand using prompt-driven vector models.
`,

  "ae7126af-76af-4e0c-8b69-af6ec7a7c070": `# Getting Started with Thunkable and its Features
**Practical Guide · 15 Minutes**

Explore Thunkable, a powerful no-code visual app builder that allows designers and product builders to deploy native iOS and Android apps without writing boilerplate code.

---

## Key Thunkable Concepts
1. **Design Tab:** Drag-and-drop visual canvas with mobile screen components: Buttons, Labels, Image Pickers, Maps, and WebViews.
2. **Blocks Editor:** Scratch-style visual logic blocks to handle user events (clicks, gestures, API calls, timers).
3. **Variables & State:** Manage app state locally on the device (Stored Variables) or globally across screens (App Variables).
4. **Thunkable Live:** Instant mobile testing app that syncs changes from your desktop browser to your physical phone via QR code.
`
};

async function run() {
  for (const [id, content] of Object.entries(updates)) {
    const { error } = await sb.from("lessons").update({
      content_md: content,
      description: content.slice(0, 300) + "..."
    }).eq("id", id);
    if (error) console.error("Error updating", id, error);
    else console.log("Updated ID:", id);
  }
  console.log("Done updating remaining 7 lessons!");
}

run();
