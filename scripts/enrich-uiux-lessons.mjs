import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const sb = createClient(url, key);
const COURSE_ID = "26d71b36-1e14-4d30-b300-bf20122be60e";

export const LESSON_CONTENTS = {
  "14. Practice Quiz: Introduction to Design": `# Practice Quiz: Introduction to Design
**Estimated Time:** 10 Minutes · **Total Questions:** 5 · **Passing Score:** 80%

Test your foundational understanding of UI vs. UX design, design thinking phases, and user-centered design principles.

---

### Question 1
**What is the primary distinction between UI (User Interface) and UX (User Experience) design?**
- A) UI focuses on how a product feels and solves user problems; UX focuses on graphic design and colors.
- B) UI deals with the aesthetic, visual elements and interactive touchpoints; UX encompasses the overall user journey, ergonomics, and problem-solving experience.
- C) UI is only for mobile applications, while UX is exclusively for desktop websites.
- D) UI is handled entirely by backend software engineers, while UX is done by marketing.
* **Correct Answer:** B
* **Explanation:** UI (User Interface) focuses on the visual presentation, typography, colors, and layout that users interact with directly. UX (User Experience) is broader, encompassing user research, information architecture, workflow efficiency, and satisfaction throughout the entire user journey.

---

### Question 2
**Which stage of the 5-stage Design Thinking process focuses on formulating a clear, actionable problem statement based on user research?**
- A) Empathize
- B) Ideate
- C) Define
- D) Prototype
* **Correct Answer:** C
* **Explanation:** In the **Define** phase, designers synthesize their findings from the Empathize phase to pinpoint the core problems and formulate a human-centered Problem Statement (e.g., "Point of View" or POV).

---

### Question 3
**Which visual design principle ensures that elements that belong together are placed close to one another, helping users mentally group information?**
- A) Hierarchy
- B) Contrast
- C) Proximity
- D) Repetition
* **Correct Answer:** C
* **Explanation:** The principle of **Proximity** (one of the Gestalt laws) states that objects placed near each other are perceived as a single unified group, reducing cognitive load for the user.

---

### Question 4
**Why is Wireframing considered an essential early step before diving into high-fidelity Figma mockups?**
- A) It allows designers and stakeholders to focus on structure, content layout, and information flow without being distracted by colors and imagery.
- B) It generates automated CSS code ready for production deployment.
- C) It replaces the need for user testing.
- D) It enforces brand typography rules automatically.
* **Correct Answer:** A
* **Explanation:** Low-fidelity wireframes strip away visual distractions like color palettes and photography so the team can validate information hierarchy, navigation clarity, and functionality first.

---

### Question 5
**What is the WCAG recommended contrast ratio for normal body text against its background to ensure accessibility (AA standard)?**
- A) 1.5:1
- B) 3.0:1
- C) 4.5:1
- D) 10:1
* **Correct Answer:** C
* **Explanation:** The Web Content Accessibility Guidelines (WCAG) 2.1 AA level requires a contrast ratio of at least **4.5:1** for normal text and 3:1 for large text (18pt or 14pt bold).
`,

  "18. Do's and Don'ts of Mockup Design": `# Do's and Don'ts of Mockup Design
**Reading & Practical Guide · 10 Minutes**

Creating intuitive, professional mockups is the bridge between conceptual sketches and coded frontends. Here is a definitive guide to best practices and common anti-patterns in modern interface design.

---

## Key Principles of High-Converting Mockups

| Aspect | The Do's (Best Practices) | The Don'ts (Common Traps) |
| :--- | :--- | :--- |
| **Visual Hierarchy** | Use clear scale, font weights, and spacing so the user's eye lands on the primary CTA within 3 seconds. | Don't give every button equal weight or vibrant color, causing visual competition. |
| **Grid & Alignment** | Stick to an 8pt or 4pt grid system across all margins, paddings, and component heights. | Don't eyeball spacing or use arbitrary values like 13px or 27px padding. |
| **Color Usage** | Limit your palette to 1 primary brand color, 1 neutral dark, 1 neutral light, and functional alert tones (green/red/amber). | Don't use more than 3 accent colors or saturated neons that strain eye comfort. |
| **Typography** | Pair at most two typefaces (e.g., Space Grotesk for Headings + DM Sans for Body); maintain 1.4-1.6 line height. | Don't use more than 2 distinct font families or line heights below 1.2 on body copy. |
| **Form Design** | Keep input labels visible above fields, provide clear placeholder hints, and show inline validation feedback. | Don't rely solely on disappearing placeholders as the only label for input fields. |
| **Realism in Data** | Use realistic, localized user names, product titles, and numbers to test real-world overflow. | Don't rely on repetitive "Lorem Ipsum" or names that are always 4 letters long. |

---

## 5 Critical Rules Before Handoff to Development
1. **Design System Consistency:** Ensure every button, input, and card is an instance of a master component in Figma.
2. **Auto Layout Discipline:** Group items with Auto Layout (Flexbox logic) so elements reflow responsively across device sizes.
3. **Empty & Error States:** Always design empty states ("No courses enrolled yet") and error states ("Payment timeout") rather than only happy paths.
4. **Touch Target Sizing:** Ensure every interactive mobile button has a minimum tap target of **44x44 points** (iOS HIG) or **48x48 dp** (Material Design).
5. **Dark Mode Contrast:** When designing dark themes, use dark slate or charcoal (#0F172A / #18181B) rather than pure #000000 to prevent harsh contrast halation.
`,

  "7. Reading: Best Practices for Mobile-First Design": `# Best Practices for Mobile-First Design
**Comprehensive Reading Guide · 15 Minutes**

Mobile-first design is a progressive enhancement philosophy: design the core functionality and content hierarchy for the smallest screens first, then progressively enhance layout and features as screen real estate increases.

---

## The Philosophy of Progressive Enhancement
When you design for mobile first, severe physical constraints force ruthless prioritization:
1. **Content Priority:** What is the ONE primary task a user arrives to complete on this screen?
2. **Thumb Zone Ergonomics:** Place the primary actions (navigation, submit buttons, bottom sheets) within natural one-handed thumb reach (the bottom 40% of the screen).
3. **Performance First:** Mobile networks demand lightweight SVGs, modern WebP/AVIF images, and minimal render-blocking assets.

---

## Responsive Breakpoint Strategy

\`\`\`css
/* Tailwind CSS v4 & Standard Breakpoint Standards */
/* Mobile First Base: < 640px */
.container { padding: 1rem; }

/* sm: Tablets & Large Phones (≥ 640px) */
@media (min-width: 640px) { ... }

/* md: Small Laptops / Tablets in Landscape (≥ 768px) */
@media (min-width: 768px) { ... }

/* lg: Standard Desktop Screens (≥ 1024px) */
@media (min-width: 1024px) { ... }

/* xl: High-Res Widescreen Monitors (≥ 1280px) */
@media (min-width: 1280px) { ... }
\`\`\`

---

## Mobile Navigation Patterns
* **Bottom Navigation Bar:** Best for apps with 3-5 top-level destinations (e.g., Home, Courses, Career, Profile).
* **Search-First Header:** Crucial for large content repositories like Learnify AI or e-commerce.
* **Drawer / Bottom Sheet:** Far superior to traditional centered popups on mobile, as bottom sheets can be easily swiped down with a thumb gesture.
`,

  "8. Hands-on Lab: View in Responsive and Nonresponsive in Emulator": `# Hands-on Lab: Inspecting Responsive vs. Non-Responsive Layouts
**Lab Assignment · 20 Minutes · Interactive Browser DevTools**

In this hands-on laboratory, you will use Google Chrome or Microsoft Edge DevTools Device Mode emulator to inspect how responsive vs. fixed layouts behave across mobile, tablet, and widescreen viewports.

---

### Objectives
1. Toggle Chrome DevTools Device Mode (\`Ctrl + Shift + M\` or \`Cmd + Option + M\`).
2. Test responsive breakpoints across iPhone 14/15, iPad Air, and Full HD Desktop.
3. Identify layout defects: horizontal scrollbars, text overflows, and micro-tap target collisions.
4. Experiment with CSS Media Queries and fluid typography using \`clamp()\`.

---

### Step-by-Step Instructions

#### Step 1: Launch Device Emulation
* Open your browser and open any web page or your local Learnify AI application.
* Right click anywhere and click **Inspect** (or press \`F12\`).
* Click the **Toggle device toolbar** icon in the top left corner of DevTools.

#### Step 2: Test Mobile Breakpoints
* Select **iPhone SE (375px width)** from the device dropdown.
* Look for:
  - Does horizontal scrolling occur? (A cardinal sin of mobile web design).
  - Are headlines readable without wrapping onto 5 awkward lines?
  - Do navigation links collapse into a hamburger menu or bottom dock?

#### Step 3: Test Fluid Viewports
* Switch the device dropdown to **Responsive**.
* Drag the right edge slider smoothly from **320px** all the way to **1440px**.
* Observe the exact pixel values where columns wrap from 1 column to 2 columns to 3 columns.

---

### Lab Deliverable Checklist
- [ ] Screenshot of your test website inspected at 375px (Mobile Portrait).
- [ ] Screenshot of your test website inspected at 768px (Tablet Portrait).
- [ ] A 3-sentence summary of one responsive defect found and how a CSS media query fixes it.
`,

  "9. Practice Quiz: Responsive Design": `# Practice Quiz: Responsive Web Design (RWD)
**Practice Quiz · 10 Minutes · 5 Questions**

Validate your understanding of media queries, viewport meta tags, relative units, and responsive images.

---

### Question 1
**What is the purpose of the \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` HTML tag?**
- A) It optimizes images for high-DPI retina screens.
- B) It instructs mobile browsers to render the page at the physical width of the device screen rather than scaling down a 980px desktop canvas.
- C) It triggers hardware acceleration on CSS animations.
- D) It enables offline PWA caching automatically.
* **Correct Answer:** B
* **Explanation:** Without the viewport meta tag, mobile browsers assume the page is designed for desktop and scale it down into a tiny, unreadable 980px canvas that requires pinch-to-zoom.

---

### Question 2
**Which CSS unit is relative to the root element's font size, making it ideal for scalable typography and consistent rem-based design systems?**
- A) px
- B) em
- C) rem
- D) vh
* **Correct Answer:** C
* **Explanation:** \`rem\` stands for "Root EM". It scales relative to the \`<html>\` root font size (usually 16px by default), allowing users who adjust their browser accessibility font sizes to see the entire site scale cleanly.

---

### Question 3
**In modern CSS, which function allows you to define a fluid value that stays between a minimum and maximum bound based on viewport width?**
- A) \`calc(100% - 20px)\`
- B) \`clamp(1rem, 2.5vw, 2.5rem)\`
- C) \`minmax(200px, 1fr)\`
- D) \`scale(1.2)\`
* **Correct Answer:** B
* **Explanation:** \`clamp(MIN, VAL, MAX)\` clamps an ideal value (often using viewport units like \`vw\`) between an accessible floor and ceiling without needing multiple media query lines.

---

### Question 4
**What distinguishes a "Fluid Layout" from an "Adaptive Layout"?**
- A) Fluid layouts use percentages or fractional units (\`fr\`) to resize continuously, while adaptive layouts jump between fixed widths at specific media query breakpoints.
- B) Fluid layouts only work on iOS devices.
- C) Adaptive layouts do not use CSS.
- D) Fluid layouts require JavaScript resize listeners.
* **Correct Answer:** A
* **Explanation:** Fluid design scales continuously like liquid filling a container. Adaptive design loads distinct fixed layouts at discrete width thresholds.

---

### Question 5
**What is the CSS media query condition to detect if a user prefers reduced motion for accessibility?**
- A) \`@media (pointer: coarse)\`
- B) \`@media (prefers-reduced-motion: reduce)\`
- C) \`@media (color-gamut: p3)\`
- D) \`@media (display-mode: standalone)\`
* **Correct Answer:** B
* **Explanation:** \`@media (prefers-reduced-motion: reduce)\` allows designers and developers to disable or tone down dramatic animations for vestibular-disorder-sensitive users.
`,

  "17. Hands-on Lab: Design a Progressive Web App": `# Hands-on Lab: Design a Progressive Web App (PWA)
**Lab Assignment · 25 Minutes · Modern Web Architecture**

Progressive Web Applications combine the broad reach of the web with the deep engagement, offline reliability, and fast performance of native mobile applications.

---

### Lab Objectives
1. Formulate the Web App Manifest configuration (\`manifest.webmanifest\`).
2. Design PWA App Shell architecture with offline fallback and skeleton states.
3. Configure Service Worker caching strategies: Cache First, Network First, and Stale-While-Revalidate.
4. Verify PWA installability using the Chrome DevTools Application & Lighthouse audits.

---

### Architectural Blueprint: The PWA Triangle
\`\`\`
+--------------------------------------------------------------+
|                       PWA CORE TRIANGLE                      |
+--------------------------------------------------------------+
|                                                              |
|        [ 1. Web App Manifest ]                               |
|        - App Name, Icons, Theme Colors, Start URL            |
|        - Standalone Display Mode (No browser URL bar)        |
|                                                              |
|        [ 2. Service Worker (Offline Engine) ]                |
|        - Background worker thread intercepting network fetch |
|        - Caching static assets & offline fallbacks           |
|        - Web Push Notifications                              |
|                                                              |
|        [ 3. HTTPS Secure Context ]                           |
|        - Encrypted transmission required for Service Workers |
|                                                              |
+--------------------------------------------------------------+
\`\`\`

---

### Step-by-Step Exercise

#### Step 1: Create a Production Web App Manifest
\`\`\`json
{
  "name": "Learnify AI Learning Platform",
  "short_name": "Learnify AI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
\`\`\`

#### Step 2: Implement a Caching Strategy
* **Cache First (Static Assets):** Fonts, icons, brand logos, pre-compiled bundles.
* **Network First with Cache Fallback (User Profile & Dynamic Data):** Course progress, certificates, quiz attempts.
* **Stale-While-Revalidate (Catalog & Course Feeds):** Instant render from cache while fetching latest updates in the background.

---

### Lab Submission Deliverables
- [ ] Completed \`manifest.webmanifest\` JSON snippet for your portfolio or capstone app.
- [ ] Definition of which caching strategy fits Course Video Thumbnails vs. Real-time Chat.
`,

  "18. Practice Quiz: Progressive Web Development (PWD)": `# Practice Quiz: Progressive Web Applications (PWA)
**Practice Quiz · 10 Minutes · 5 Questions**

Assess your knowledge of service workers, manifest requirements, offline caching strategies, and native device capabilities.

---

### Question 1
**Where do Service Workers execute within the browser runtime?**
- A) In the main UI thread blocking user interactions.
- B) On a separate background worker thread completely independent of web page DOM access.
- C) Inside the server database engine.
- D) Within an iframe on the user's desktop.
* **Correct Answer:** B
* **Explanation:** Service workers run in an isolated background thread. Because they cannot access the DOM directly, they communicate with web pages using the \`postMessage\` API, ensuring smooth, non-blocking UI performance.

---

### Question 2
**Which caching strategy delivers immediate zero-latency load from the local cache while simultaneously updating the cache with fresh network data for the next visit?**
- A) Cache Only
- B) Network Only
- C) Stale-While-Revalidate
- D) Network First
* **Correct Answer:** C
* **Explanation:** Stale-While-Revalidate serves cached content immediately to the user while asynchronously dispatching a network request to update the cache with fresh data in the background.

---

### Question 3
**Which manifest display mode hides the browser address bar and navigation controls, providing a true native full-screen app appearance?**
- A) \`browser\`
- B) \`minimal-ui\`
- C) \`standalone\`
- D) \`inline\`
* **Correct Answer:** C
* **Explanation:** \`"display": "standalone"\` gives the installed web app its own dedicated application window without the browser URL bar or back/forward buttons.

---

### Question 4
**Why is HTTPS an absolute non-negotiable prerequisite for running Service Workers in production?**
- A) HTTPS reduces the file size of images.
- B) Because Service Workers can intercept, inspect, and modify network requests, allowing HTTP would expose users to devastating Man-In-The-Middle (MITM) attacks.
- C) HTTPS is required only for Google Chrome.
- D) Service workers cannot run on local development machines.
* **Correct Answer:** B
* **Explanation:** A service worker has powerful proxy privileges to intercept all network traffic. On unencrypted connections, an attacker could inject malicious scripts permanently into the cache.

---

### Question 5
**Which audit tool built directly into Chrome DevTools allows developers to verify if a site meets all PWA installability criteria?**
- A) Network Tab
- B) Lighthouse
- C) Memory Tab
- D) Elements Inspector
* **Correct Answer:** B
* **Explanation:** Google Lighthouse audits progressive web apps against PWA criteria: installability, service worker registration, offline response, and splash screen support.
`,

  "19. Module 2 Summary: Web Design Methodologies": `# Module 2 Summary: Web Design Methodologies
**Module Summary · 10 Minutes**

Congratulations on completing Module 2: Web Design Methodologies! Here is a synthesis of core architectural models and mental frameworks mastered.

---

## Key Takeaways

### 1. Responsive Web Design (RWD)
* Responsive design is rooted in three pillars: **Fluid Grids**, **Flexible Media**, and **CSS Media Queries**.
* Designing mobile-first minimizes technical bloat, enforces clarity of purpose, and ensures accessibility for smartphone users.
* Use \`min-width\` queries for progressive enhancement rather than \`max-width\` desktop-down overrides.

### 2. Single Page Applications (SPAs)
* SPAs dynamically rewrite the current page using JavaScript routing (e.g. TanStack Router) instead of loading entire new HTML documents from the server.
* Benefits: Instant screen transitions, preserved client-side state, and app-like responsiveness.

### 3. Progressive Web Applications (PWAs)
* Modern web apps can install directly to a user's home screen or desktop without third-party app store commissions.
* Service Workers act as programmable network proxies, enabling offline caching and instant boot times.
`,

  "20. Module 2 Graded Quiz: Web Design Methodologies": `# Module 2 Graded Quiz: Web Design Methodologies
**Graded Assessment · 15 Minutes · 6 Questions · 80% to Pass**

Demonstrate your proficiency across Responsive Web Design, Media Queries, Single Page Applications, and Progressive Web App mechanics.

---

### Question 1
**A mobile developer notices that elements overflow horizontally on iPhone screens. What is the most effective CSS property to ensure padding and borders do not add to an element's total declared width?**
- A) \`box-sizing: content-box;\`
- B) \`box-sizing: border-box;\`
- C) \`overflow: visible;\`
- D) \`display: inline;\`
* **Correct Answer:** B
* **Explanation:** \`box-sizing: border-box\` ensures that declared widths include padding and borders, eliminating unexpected horizontal layout blowout.

---

### Question 2
**What is the core benefit of designing using a Mobile-First approach over a Desktop-First approach?**
- A) It guarantees 100% SEO rank on Google without any content.
- B) It forces prioritization of essential user journeys and core content under strict screen real-estate constraints before layering complexity for larger displays.
- C) It eliminates the need for CSS media queries.
- D) It only supports touchscreens.
* **Correct Answer:** B
* **Explanation:** Mobile-First is a strategy of progressive enhancement: solve the user's primary goal under severe visual constraints first, then enhance layout as screen space grows.

---

### Question 3
**Which HTTP header or HTML element enables responsive images by allowing browsers to choose different image sources based on screen resolution and device pixel ratio?**
- A) \`<img src="..." />\` only
- B) \`<picture>\` element paired with \`<source srcset="..." media="...">\`
- C) \`<canvas>\`
- D) \`<svg>\`
* **Correct Answer:** B
* **Explanation:** The \`<picture>\` element and \`srcset\` attribute let the browser download only the optimally sized image for the user's viewport and screen density.

---

### Question 4
**What is the primary function of a Service Worker in a Progressive Web Application?**
- A) To render 3D WebGL scenes.
- B) To intercept network requests, manage offline cache storage, and handle background push events.
- C) To manage relational database queries on the server.
- D) To minify JavaScript source code.
* **Correct Answer:** B
* **Explanation:** Service workers act as programmable client-side network proxies, sitting between the web app and the network to intercept requests and serve cached assets offline.

---

### Question 5
**In Single Page Applications (SPAs), how is navigation handled without reloading the entire page?**
- A) The browser downloads a new HTML document on every link click.
- B) Client-side JavaScript intercepting URL changes via the HTML5 History API (\`pushState\` / \`replaceState\`) and swapping DOM components in-place.
- C) Through hardcoded server redirects.
- D) By reloading the page inside a hidden iframe.
* **Correct Answer:** B
* **Explanation:** SPAs use the HTML5 History API to alter the browser URL without triggering a full page refresh, dynamically mounting the appropriate component for that route.

---

### Question 6
**Which of the following is NOT a mandatory requirement for a PWA to be installable on mobile devices?**
- A) Served over HTTPS
- B) Web App Manifest with icons, \`name\`, and \`start_url\`
- C) Registered Service Worker with a fetch handler
- D) A paid subscription to the Apple App Store or Google Play Store
* **Correct Answer:** D
* **Explanation:** PWAs bypass app store gatekeepers and developer accounts entirely. They install directly from the web browser provided HTTPS, Manifest, and Service Worker criteria are met.
`,

  "5. Getting Started with Figma and its Features": `# Getting Started with Figma and its Features
**Reading & Practical Guide · 10 Minutes**

Figma has revolutionized UI/UX engineering by unifying vector design, interactive prototyping, and design system governance into a real-time collaborative cloud platform.

---

## The 4 Core Workspaces of Figma
1. **Design Canvas:** Infinite 2D space where frames, components, and artboards reside.
2. **FigJam:** Digital whiteboard designed for brainstorming, user story mapping, and sprint retrospectives.
3. **Figma Community:** Open-source ecosystem of design systems, icon packs, and automation plugins.
4. **Dev Mode:** Specialized inspection environment for frontend engineers to view CSS properties, box-model spacing, and token variables.

---

## The 8 Foundational Figma Concepts
* **Frames:** Unlike simple bounding boxes, Frames represent screens or containers with clipping, auto layout, and responsive resizing rules.
* **Components & Instances:** Master components (\`❖\`) define source properties; instances (\`◇\`) inherit updates globally.
* **Auto Layout (Flexbox in Design):** Organizes elements into vertical or horizontal stacks with fluid padding, gap, and distribution rules.
* **Variables & Tokens:** Centralized variables for colors, typography sizes, corner radii, and spacing.
* **Constraints:** Tells elements how to behave when a parent frame is resized (e.g., Pin to Left, Pin to Right, Center, Scale).
* **Smart Animate:** Automatically interpolates identical layers across screens to produce realistic micro-interactions and transitions.
* **Figma Plugins:** Community utilities that automate asset generation, contrast auditing, and content population.
* **Version History:** Automatic cloud checkpoints allowing teams to rollback or branch design changes safely.
`,

  "6. Hands-on Lab: Getting started with Figma": `# Hands-on Lab: Getting Started with Figma
**Lab Assignment · 20 Minutes · Hands-on Figma Workspace**

In this introductory lab, you will set up a Figma account, configure a design file, and construct your first responsive card component utilizing Auto Layout and Constraints.

---

### Objectives
1. Create a new Figma file and define desktop & mobile device frames.
2. Build an accessible product card component with an image, title, badge, and CTA button.
3. Apply Auto Layout (\`Shift + A\`) with padding, spacing, and Hug/Fill constraints.
4. Convert your card into a reusable Master Component (\`Ctrl + Alt + K\` / \`Cmd + Option + K\`).

---

### Step-by-Step Exercise

#### Step 1: Create Frames
* Press \`F\` on your keyboard to open the Frame tool.
* In the right inspector, select **Desktop > MacBook Air (1280 x 832)** or **Desktop (1440 x 1024)**.
* Rename the frame to \`Home / Desktop\`.

#### Step 2: Build a Course Card Component
* Draw a rectangle for the cover image (width 320px, height 180px, corner radius 12px).
* Add a text layer: \`"Designing UI/UX with Figma"\` (Space Grotesk, Bold, 16px).
* Add a secondary description text layer: \`"Master auto layout, components, and interactive prototypes"\` (DM Sans, Regular, 13px, color: #64748B).
* Add a pill badge: Text \`"Free Preview"\` wrapped in Auto Layout with 4px vertical / 8px horizontal padding, radius 9999px, bg: #ECFDF5, text: #059669.

#### Step 3: Apply Auto Layout
* Select the badge, title, and description, and press \`Shift + A\`.
* In the right panel, set direction to **Vertical**, item spacing to **8px**, and alignment to **Top Left**.
* Set horizontal resizing on the text layers to **Fill container**.

---

### Lab Deliverable Checklist
- [ ] Shareable Figma link (view-only) containing your completed card component.
- [ ] Proof of Auto Layout applied with "Fill container" behavior verified.
`,

  "8. Practice Quiz: Figma Introduction": `# Practice Quiz: Figma Introduction
**Practice Quiz · 10 Minutes · 5 Questions**

Assess your foundational knowledge of Figma canvas tools, keyboard shortcuts, frames, and vectors.

---

### Question 1
**What is the keyboard shortcut to automatically add Auto Layout to a group of selected layers in Figma?**
- A) \`Ctrl + G\` (or \`Cmd + G\`)
- B) \`Shift + A\`
- C) \`Ctrl + Alt + K\`
- D) \`Spacebar + A\`
* **Correct Answer:** B
* **Explanation:** \`Shift + A\` applies Auto Layout to the selected layers, immediately converting them into a flexible flexbox-style container.

---

### Question 2
**What is the key difference between a "Group" and a "Frame" in Figma?**
- A) Groups can contain Auto Layout, whereas Frames cannot.
- B) Frames act as independent canvas artboards with their own dimensions, constraints, and clipping rules; Groups simply bundle layers together based on the bounding box of their children.
- C) Groups are only for vector paths.
- D) Frames cannot contain text.
* **Correct Answer:** B
* **Explanation:** A Frame is an autonomous layout container with explicit dimensions, constraints, auto layout, and clipping abilities. Groups have no independent dimensions and shrink/grow based on their children.

---

### Question 3
**Which icon indicates a Master Component in Figma vs. an Instance?**
- A) A solid diamond (\`◆\`) vs. a hollow diamond (\`◇\`)
- B) Four filled diamonds forming a larger diamond (\`❖\`) represents a Master Component; a single hollow diamond (\`◇\`) represents an Instance.
- C) A folder icon vs. a file icon.
- D) A circle vs. a square.
* **Correct Answer:** B
* **Explanation:** In Figma's layer panel, the 4-diamond symbol (\`❖\`) denotes a Master Component. An Instance is represented by a single outline diamond (\`◇\`).

---

### Question 4
**When designing a responsive component in Auto Layout, which resizing setting makes the element stretch to occupy all available width within its parent container?**
- A) Fixed width
- B) Hug contents
- C) Fill container
- D) Scale proportionally
* **Correct Answer:** C
* **Explanation:** **Fill container** instructs the child element to expand dynamically to fill the available space allocated by its parent Auto Layout container.

---

### Question 5
**What tool in Figma allows frontend engineers to inspect CSS box-model specs, copy design tokens, and view component properties without editing rights?**
- A) Design Mode
- B) Dev Mode
- C) Vector Pen
- D) FigJam Whiteboard
* **Correct Answer:** B
* **Explanation:** Figma's Dev Mode provides dedicated developer-centric tools: unit switching (px to rem), CSS code snippets, asset export, and change diffing.
`,

  "13. Hands-on Lab: Design a landing page for a travel website using Figma": `# Hands-on Lab: Design a Responsive Travel Website Landing Page
**Lab Assignment · 30 Minutes · Figma Project**

Put your visual design principles, typography hierarchy, and auto layout mastery into practice by designing a high-converting Travel Landing Page in Figma.

---

### Project Brief & Scenario
**Client:** Wanderlust Travel Co.
**Target Audience:** Digital nomads and adventure travelers looking for curated remote work destinations.
**Brand Tone:** Adventurous, clean, modern, inspiring.

---

### Required Landing Page Sections
1. **Sticky Navigation Bar:** Logo, Links (Destinations, Experiences, Workspaces, About), and "Book Trip" primary CTA.
2. **Hero Section:** High-impact background photo, compelling value proposition headline, subtitle, and an interactive Search/Filter bar (Destination, Date, Guests).
3. **Popular Destinations Grid:** 3-card responsive grid showcasing curated locations with price badge, star rating, and location tag.
4. **Value Proposition Feature Row:** 3 feature icons with micro-copy (e.g., "High-Speed WiFi Verified", "Community Events", "Flexible Stays").
5. **Footer:** Brand copyright, social links, and newsletter signup input.

---

### Rubric & Evaluation Criteria
| Criteria | Weight | Requirements |
| :--- | :--- | :--- |
| **Grid & Alignment** | 25% | All elements aligned to a 12-column desktop grid with consistent 24px gutters. |
| **Component Reusability** | 25% | Navigation bar, buttons, and destination cards built as reusable master components. |
| **Auto Layout Mastery** | 25% | All cards and sections reflow cleanly without broken bounding boxes or overlapping text. |
| **Visual Aesthetics** | 25% | Clean typography pairing, WCAG AA color contrast, and refined subtle shadows. |
`,

  "16. Practice Quiz: Intermediate Figma": `# Practice Quiz: Intermediate Figma
**Practice Quiz · 10 Minutes · 5 Questions**

Test your mastery of component variants, component properties (boolean, text, instance swap), interactive states, and auto layout wrapping.

---

### Question 1
**What is the purpose of Component Variants in Figma?**
- A) To compress image files for web export.
- B) To group related component states (e.g. Default, Hover, Focused, Disabled, Error) under a single master component set for clean design system management.
- C) To translate copy into multiple languages automatically.
- D) To convert Figma files into Adobe Photoshop format.
* **Correct Answer:** B
* **Explanation:** Variants allow designers to organize multiple visual states (like buttons in primary, secondary, danger, or hover/active) into one unified component with toggles in the right inspector.

---

### Question 2
**Which Figma component property allows designers to toggle the visibility of a layer (like an icon in a button) on or off from the properties panel without detaching the instance?**
- A) Text Property
- B) Boolean Property
- C) Instance Swap Property
- D) Variant Property
* **Correct Answer:** B
* **Explanation:** A **Boolean Property** exposes a True/False switch in the inspector that controls whether a sub-layer (e.g., a left icon or badge) is visible or hidden.

---

### Question 3
**In Figma prototyping, which transition type intelligently matches layer names between two frames to animate position, scale, and opacity differences smoothly?**
- A) Instant
- B) Dissolve
- C) Smart Animate
- D) Push
* **Correct Answer:** C
* **Explanation:** **Smart Animate** detects layers with identical names across starting and ending frames and automatically calculates intermediate frames for position, size, rotation, and opacity.

---

### Question 4
**What does the "Auto Layout Wrap" feature in Figma accomplish?**
- A) It wraps long text inside a single line.
- B) It allows child items in an Auto Layout container to wrap onto a new row or column when they exceed the container width, mimicking CSS \`flex-wrap: wrap\`.
- C) It wraps images in a circular mask.
- D) It encrypts the Figma file for export.
* **Correct Answer:** B
* **Explanation:** Auto Layout Wrap mirrors CSS \`flex-wrap\`, automatically moving items that exceed container width to the next line—ideal for tag clouds, skill badges, and responsive grids.

---

### Question 5
**What is the primary danger of "Detaching an Instance" (\`Ctrl + Alt + B\` / \`Cmd + Option + B\`) in a team design system?**
- A) It deletes the master component from the file.
- B) The layer permanently breaks its connection to the master component, meaning future brand updates, color changes, and bug fixes will never propagate to that element.
- C) It crashes Figma's cloud servers.
- D) It locks the layer from being edited.
* **Correct Answer:** B
* **Explanation:** Detaching an instance severs the link to the design system. If the design system changes, detached instances remain stale, creating design debt and inconsistencies.
`,

  "18. Module 3 Graded Quiz: UI Design with Figma": `# Module 3 Graded Quiz: UI Design with Figma
**Graded Assessment · 15 Minutes · 6 Questions · 80% to Pass**

Demonstrate comprehensive proficiency in Figma components, auto layout physics, component variants, and interactive prototyping.

---

### Question 1
**When creating an 8pt Grid design system, what should your spacing, padding, and dimension values ideally be?**
- A) Any arbitrary odd number like 13px, 17px, 21px.
- B) Multiples of 8 (e.g., 8px, 16px, 24px, 32px, 48px, 64px) with occasional 4px half-steps for micro-spacing.
- C) Exactly 10px, 20px, 30px, 40px.
- D) Values determined entirely by browser randomizers.
* **Correct Answer:** B
* **Explanation:** The 8pt grid system enforces visual rhythm and mathematical predictability across all screen densities (1x, 2x, 3x displays), minimizing rendering rounding errors.

---

### Question 2
**A designer wants a navigation header to remain locked at the top of the mobile viewport while the user scrolls down the page in Figma prototype mode. Which setting must be enabled on the header frame?**
- A) Hug contents
- B) "Fix position when scrolling" (or "Stay in place")
- C) Detach instance
- D) Smart Animate
* **Correct Answer:** B
* **Explanation:** "Fix position when scrolling" pins the layer to the prototype viewport coordinates, ensuring it remains visible regardless of page scroll position.

---

### Question 3
**What is the role of Design Tokens in modern design systems?**
- A) They are cryptocurrency coins used to purchase Figma plugins.
- B) They are platform-agnostic design variables (colors, typography, spacing, shadows) stored as key-value pairs that translate design decisions directly into CSS, iOS, and Android code.
- C) They are security passwords for Figma files.
- D) They are vector icons used exclusively in wireframing.
* **Correct Answer:** B
* **Explanation:** Design tokens bridge the gap between design and development by codifying decisions (e.g. \`color-primary-500: #2563EB\`) into reusable variables consumed by code.

---

### Question 4
**In Figma, when setting up an interactive hover state on a button component, where should the interaction be connected?**
- A) Inside the master component set between the "Default" variant and the "Hover" variant using the "While hovering" trigger.
- B) On every single screen where the button is pasted throughout the file.
- C) In the CSS style sheet.
- D) Inside the file comment thread.
* **Correct Answer:** A
* **Explanation:** Creating component-level interactions (Interactive Components) between variants ensures that every instance in your prototype automatically inherits the hover interaction.

---

### Question 5
**Which constraint setting ensures that a floating action button (FAB) stays 24px from the bottom-right corner of a screen when viewed on different phone sizes?**
- A) Top and Left
- B) Center and Center
- C) Bottom and Right
- D) Scale and Scale
* **Correct Answer:** C
* **Explanation:** Pinning constraints to **Right** and **Bottom** maintains fixed 24px margins relative to the right and bottom edges of the parent frame as it resizes.

---

### Question 6
**What is the primary benefit of using "Auto Layout Min/Max Width" in responsive card design?**
- A) It prevents cards from becoming unreadably narrow on small phones or excessively stretched on ultrawide monitors.
- B) It forces text to render in uppercase.
- C) It disables dark mode automatically.
- D) It exports vector SVG files.
* **Correct Answer:** A
* **Explanation:** Setting min-width and max-width on an Auto Layout component guarantees that fluid layouts remain within ergonomically sound bounds across all device form factors.
`,

  "2. Hands-On Lab: Building a Sales App with Figma's Interactive Design Tools": `# Hands-On Lab: Building a Sales App with Figma's Interactive Design Tools
**Capstone Lab · 40 Minutes · Interactive Prototyping**

In this comprehensive hands-on lab, you will design and prototype a mobile Sales & CRM Dashboard featuring revenue charts, lead cards, and an interactive conversion flow.

---

### Scenario & Business Objectives
**App Name:** Pulse CRM Mobile
**Key Screens to Construct:**
1. **Dashboard Home:** Monthly Revenue KPI card, bar chart visual, recent sales notifications.
2. **Lead Detail View:** Contact avatar, stage pipeline tracker (Prospect → Qualified → Demo → Closed), interaction timeline.
3. **Add Deal Modal / Bottom Sheet:** Input form with Deal Value, Client Name, and "Save Deal" CTA.

---

### Step-by-Step Instructions
* Construct the bottom navigation dock with 4 icons: Home, Leads, Analytics, Profile.
* Build the Stage Pipeline Tracker using a 4-step segmented pill with conditional coloring.
* Connect a prototype trigger: Tapping a lead card opens the Lead Detail View with **Slide In** transition.
* Connect the floating \`+\` action button to open the Add Deal Bottom Sheet with **Open Overlay** positioned at the bottom with a 50% dark backdrop.

---

### Lab Deliverable Checklist
- [ ] Figma prototype link with at least 3 connected interactive screens.
- [ ] Working interactive hover states and overlay transitions demonstrated.
`,

  "4. Hands-on Lab: Thunkable-UI from Hand Drawn Images": `# Hands-on Lab: Thunkable UI from Hand Drawn Wireframes
**Lab Assignment · 30 Minutes · Low-Code App Prototyping**

Transform paper-and-pencil wireframes into an interactive, functional mobile application using Thunkable's drag-and-drop low-code builder.

---

### Lab Objectives
1. Sketch a 3-screen mobile interface on paper (Paper Prototyping).
2. Digitize the wireframe layout using Thunkable visual component blocks.
3. Connect interactive navigation blocks without writing traditional backend code.
4. Test the live application on your mobile device via the Thunkable Live companion app.

---

### Exercise Steps
1. **Paper Sketch:** Draw screen 1 (Login/Splash), screen 2 (Dashboard Feed), screen 3 (Detail View).
2. **Thunkable Canvas:** Add a Column container, insert a Button, Label, and Image component.
3. **Block Logic:** In the Thunkable Blocks editor, attach:
   \`\`\`
   When Button1 Clicked do:
     Navigate to Screen2
   \`\`\`
4. **Live Preview:** Scan the QR code with Thunkable Live on your smartphone to test real-device touch interactions and responsiveness.
`,

  "6. Final Project Enhancement: Scenario and Self Evaluation Criteria": `# Final Project Enhancement: Scenario and Self Evaluation Criteria
**Final Project Guide & Rubric · 15 Minutes**

Ensure your capstone project fulfills all industry-standard benchmarks before submitting for peer and instructor grading.

---

## 4-Pillar Evaluation Rubric

### 1. User-Centered Problem Solving (25 Points)
- Clear problem definition: What real-world user pain point does your design solve?
- User persona and journey map clearly identified.

### 2. Design System & Auto Layout Discipline (25 Points)
- 100% of components built with Auto Layout and constraints.
- No detached instances or hardcoded raw colors outside the design system palette.
- Accessible contrast ratios meeting WCAG 2.1 AA (4.5:1).

### 3. Interactive Prototyping Quality (25 Points)
- Smooth navigation flows between all major user journeys.
- Micro-interactions (hover states, active taps, animated toggles) implemented.
- Bottom sheet or modal overlays with dark dismissible backdrops.

### 4. Code & Dev Handoff Readiness (25 Points)
- Clear layer naming hierarchy (e.g. \`Card / Course / Default\` rather than \`Frame 492\`).
- Exportable SVG icons and web-optimized assets prepared.
- Complete documentation of spacing tokens and typography scale.
`,

  "7. Final Project Enhancement: Sales App using Figma": `# Final Project Enhancement: Sales App using Figma
**Lab Project · 25 Minutes · Design Polish & Prototyping**

Refine your Sales App prototype with advanced Figma capabilities: Variables, Component Properties, and Interactive Micro-interactions.

---

### Enhancement Requirements
1. **Dark & Light Mode Variable Modes:** Create a color token collection with \`Surface\`, \`Text-Primary\`, and \`Brand-Accent\` modes to allow 1-click theme switching.
2. **Component Property Simplification:** Replace repetitive nested variants with boolean and text properties to reduce master component complexity.
3. **Interactive Chart Tooltips:** Add micro-interactions where hovering or tapping a data point in the revenue chart reveals an interactive tooltip with exact rupee / dollar values.
`,

  "8. Final Project Enhancement: Sales App using Thunkable": `# Final Project Enhancement: Sales App using Thunkable
**Lab Project · 25 Minutes · Logic & Data Binding**

Enhance your Thunkable mobile application with live data binding, local storage persistence, and form validation.

---

### Enhancement Requirements
1. **Local Data Persistence:** Use Thunkable's Stored Variables to persist user preferences and recent sales entries across app restarts.
2. **Form Validation Logic:** If a user submits an empty deal value, trigger a mobile alert dialog preventing submission until valid inputs are provided.
3. **List Viewer Data Binding:** Dynamically populate a sales lead list from a structured JSON data table rather than hardcoded static labels.
`,

  "9. Useful UI/UX Resources and References": `# Useful UI/UX Resources and References
**Curated Resource Guide · 10 Minutes**

A hand-picked collection of world-class design systems, accessibility tools, typography platforms, and icon libraries to bookmark for your career.

---

## Industry Benchmark Design Systems
* **Shopify Polaris:** \`polaris.shopify.com\` — The golden standard for e-commerce, forms, and admin interface design.
* **Apple Human Interface Guidelines (HIG):** \`developer.apple.com/design\` — Unmatched ergonomics for iOS, macOS, and iPadOS.
* **Google Material Design 3:** \`m3.material.io\` — Dynamic color theming, motion tokens, and adaptive layout specifications.
* **Tailwind UI & Shadcn UI:** Modern component primitives and accessible React components.

---

## Typography & Color Tools
* **Google Fonts:** Clean, open-source typography (Space Grotesk, DM Sans, Inter, Outfit).
* **Coolors & Realtime Colors:** Contrast-checked harmonious color palette generators.
* **WebAIM Contrast Checker:** \`webaim.org/resources/contrastchecker\` — Essential for WCAG AA/AAA verification.

---

## Icons & Free High-Res Media
* **Lucide Icons:** \`lucide.dev\` — Consistent, clean 24x24 vector stroke icons.
* **Unsplash & Pexels:** License-free high-resolution imagery for mockups.
* **Draw.io:** Free diagrams, user flows, and low-fidelity wireframing.
`,

  "10. Congratulations and Next Steps": `# Congratulations and Next Steps
**Course Milestone · 10 Minutes**

Congratulations on completing the Designing User Interfaces and Experiences (UI/UX) course!

---

## What You Have Accomplished
Over the course of these 4 comprehensive modules, you have:
1. Mastered the fundamentals of User-Centered Design, Visual Hierarchy, and Color Theory.
2. Built responsive wireframes and tested cross-device mobile-first layouts.
3. Mastered Figma: Auto Layout, Component Sets, Variants, Variables, and Smart Animate.
4. Prototyped interactive sales and mobile applications with low-code and design-to-code workflows.

---

## Recommended Next Steps
* **Generate Your Official Certificate:** Visit your Learnify AI Certificates tab to download and verify your credential with QR verification.
* **Add to LinkedIn:** Share your verified certificate and capstone portfolio link with recruiters.
* **Explore Career Studio:** Use the **Resume Builder**, **ATS Checker**, and **Portfolio Builder** to package your new UI/UX skills for top tech jobs.
`,

  "11. Thanks from the Course Team": `# Thanks from the Course Team
**Course Team Farewell · 5 Minutes**

Thank you for choosing Learnify AI as your learning companion on this UI/UX design journey!

---

Our team of product designers, engineering mentors, and educators is thrilled to witness your growth. Remember that exceptional design is not an innate talent—it is a continuous habit of curiosity, empathy for user frustration, and ruthless attention to detail.

Keep building, keep iterating, and never hesitate to share your work with the Learnify AI community.

*— The Learnify AI Product & Curriculum Team*
`,

  "12. Module 4 Graded Final Comprehensive Assessment": `# Module 4 Graded Final Comprehensive Assessment
**Final Exam · 20 Minutes · 8 Questions · 80% Passing Grade**

This comprehensive final assessment evaluates your mastery across all four course modules: UX Strategy, Visual Design, Responsive/PWA Architecture, and Figma Prototyping.

---

### Question 1
**What is the core distinction between Low-Fidelity and High-Fidelity prototypes?**
- A) Low-fidelity prototypes are coded in Python; high-fidelity are in JavaScript.
- B) Low-fidelity prototypes focus on user flow and layout structure using basic shapes and grayscale; high-fidelity prototypes incorporate production-ready typography, branding, actual copy, and realistic micro-interactions.
- C) Low-fidelity prototypes are only used after a product launches.
- D) High-fidelity prototypes never require user testing.
* **Correct Answer:** B
* **Explanation:** Low-fidelity wireframes strip away cosmetic distractions to test core navigation and structure, while high-fidelity prototypes test emotional resonance, visual hierarchy, and precise interaction timing.

---

### Question 2
**Under the Gestalt law of Common Region, how do users perceive elements enclosed within a visible border or background card?**
- A) As unrelated individual items.
- B) As belonging to a single, unified conceptual group.
- C) As broken links.
- D) As inactive disabled elements.
* **Correct Answer:** B
* **Explanation:** The principle of Common Region demonstrates that enclosing items within a shared border or background surface creates an immediate visual association that they belong to the same category.

---

### Question 3
**Which metric in Google Core Web Vitals measures visual stability by tracking unexpected layout shifts during page load?**
- A) LCP (Largest Contentful Paint)
- B) INP (Interaction to Next Paint)
- C) CLS (Cumulative Layout Shift)
- D) TTFB (Time to First Byte)
* **Correct Answer:** C
* **Explanation:** CLS (Cumulative Layout Shift) measures unexpected shifts in visual content as images, fonts, or ads load, directly impacting user frustration.

---

### Question 4
**In Figma, how does "Hug contents" differ from "Fill container"?**
- A) "Hug contents" shrinks the container to tightly fit the size of its children; "Fill container" stretches the element to occupy the full available width of its parent container.
- B) "Hug contents" is for images only.
- C) "Fill container" deletes the padding.
- D) They are identical in every way.
* **Correct Answer:** A
* **Explanation:** In Auto Layout, "Hug" sets dimensions determined by the content inside, while "Fill" tells the layer to expand into whatever space the parent offers.

---

### Question 5
**What is the minimum recommended touch target size specified by Google's Material Design guidelines for mobile user interfaces?**
- A) 24 x 24 dp
- B) 32 x 32 dp
- C) 48 x 48 dp
- D) 96 x 96 dp
* **Correct Answer:** C
* **Explanation:** Material Design guidelines recommend at least 48x48 dp with adequate spacing to prevent accidental mis-taps on touchscreens.

---

### Question 6
**Which accessibility standard must be met to ensure text is legible for users with moderate vision loss (WCAG 2.1 AA)?**
- A) 1.5:1 for all text
- B) 4.5:1 for normal body text, and 3:1 for large text (18pt+ or 14pt bold)
- C) 10:1 for everything
- D) 2.0:1 for links
* **Correct Answer:** B
* **Explanation:** WCAG 2.1 Level AA establishes a 4.5:1 minimum contrast ratio for normal text and 3:1 for large typography against their backgrounds.

---

### Question 7
**Why are Design Tokens considered the gold standard for maintaining consistency between Figma and production code?**
- A) They eliminate the need for designers and developers to communicate.
- B) They store design decisions (colors, radii, spacing, font weights) in platform-agnostic format, allowing automatic sync to CSS variables, Tailwind themes, and mobile style sheets.
- C) They automatically write server SQL databases.
- D) They convert vector icons into JPEG images.
* **Correct Answer:** B
* **Explanation:** Tokens act as the single source of truth: when a token value is updated, it propagates automatically across both Figma libraries and production codebases.

---

### Question 8
**In Progressive Web Applications, what is the role of the Web App Manifest file?**
- A) It compiles React components into binary code.
- B) It provides metadata (app name, start URL, theme color, icons, display mode) that tells the operating system how to install and launch the web app.
- C) It connects the client to a payment gateway.
- D) It tracks user analytics.
* **Correct Answer:** B
* **Explanation:** The Web App Manifest (\`manifest.webmanifest\`) informs browsers how your PWA should present itself on mobile or desktop home screens and application launchers.
`
};

async function main() {
  console.log("Starting lesson enrichment for Course:", COURSE_ID);
  const { data: lessons, error } = await sb.from("lessons")
    .select("id, title")
    .eq("course_id", COURSE_ID);

  if (error) {
    console.error("Error fetching lessons:", error);
    process.exit(1);
  }

  let updatedCount = 0;
  for (const [keyTitle, content] of Object.entries(LESSON_CONTENTS)) {
    // Find matching lesson
    const match = lessons.find(l => l.title.trim().toLowerCase() === keyTitle.trim().toLowerCase() || l.title.includes(keyTitle));
    if (!match) {
      console.warn("Could not find lesson matching:", keyTitle);
      continue;
    }

    const { error: upErr } = await sb.from("lessons")
      .update({
        content_md: content,
        description: content.slice(0, 300) + "..."
      })
      .eq("id", match.id);

    if (upErr) {
      console.error("Failed to update lesson:", match.title, upErr);
    } else {
      updatedCount++;
      console.log(`Updated [${updatedCount}]: ${match.title}`);
    }
  }

  console.log(`Successfully enriched ${updatedCount} lessons with Assignments, MCQs, and Guides!`);
}

main().catch(console.error);
