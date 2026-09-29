# ==============================================================================
# Learnify AI - Complete UI & UX Course Builder (Modules 2, 3 & 4)
# Arranges Videos & Generates Full Markdown Readings, Labs, and Quizzes
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$courseRoot = "C:\Users\Vishwajeet\Music\Learnify AI Courses\Designing User Interfaces and Experiences (UI & UX)"
$uxRawPath = Join-Path $courseRoot "UX\Designing User Interfaces and User Experiences (UI-UX)"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Learnify AI: Complete Course Organizer & Material Builder" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Course Root : $courseRoot" -ForegroundColor Gray
Write-Host "Raw Videos  : $uxRawPath" -ForegroundColor Gray

if (-not (Test-Path -LiteralPath $courseRoot)) {
    Write-Error "Course root directory does not exist: $courseRoot"
    exit 1
}

# ------------------------------------------------------------------------------
# 1. Directory Structure Definition
# ------------------------------------------------------------------------------
$subfolders = @(
    # Module 1 (verify existing)
    "Module 1\1. Welcome",
    "Module 1\2. Introduction to Design",
    "Module 1\3. Mockup Design Concepts",
    "Module 1\4. Module 1 Summary, Assessment and Discussion",

    # Module 2
    "Module 2\1. Responsive Web Design",
    "Module 2\2. Progressive Web Development & No Code",
    "Module 2\3. Module 2 Summary and Assessment",

    # Module 3
    "Module 3\1. Getting Started with Figma",
    "Module 3\2. Working with Figma & Design Systems",
    "Module 3\3. Module 3 Summary and Assessment",

    # Module 4
    "Module 4\1. Final Project and Assessment"
)

Write-Host "`n[1/3] Ensuring folder hierarchy..." -ForegroundColor Yellow
foreach ($sub in $subfolders) {
    $targetDir = Join-Path $courseRoot $sub
    if (-not (Test-Path -LiteralPath $targetDir)) {
        [System.IO.Directory]::CreateDirectory($targetDir) | Out-Null
        Write-Host "  [+] Created: $sub" -ForegroundColor Green
    } else {
        Write-Host "  [.] Exists : $sub" -ForegroundColor DarkGray
    }
}

# ------------------------------------------------------------------------------
# 2. Move & Rename Videos
# ------------------------------------------------------------------------------
$videoMoves = @(
    # Module 1 (in case user wants to ensure Module 1 is fully populated)
    @{
        Source = "1. Course Introduction.mp4"
        Subfolder = "Module 1\1. Welcome"
        Target = "1. Course Introduction.mp4"
    },
    @{
        Source = "4. What is Design and UI_UX_.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "4. What is Design and UI & UX.mp4"
    },
    @{
        Source = "5. Importance of UI_UX_.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "5. Importance of UI & UX.mp4"
    },
    @{
        Source = "6. Design Thinking.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "6. Design Thinking.mp4"
    },
    @{
        Source = "UX Design and Strategies.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "7. UX Design and Strategies.mp4"
    },
    @{
        Source = "Wireframing and Prototyping.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "8. Wireframing and Prototyping.mp4"
    },
    @{
        Source = "Design Methodologies and Approaches.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "9. Design Methodologies and Approaches.mp4"
    },
    @{
        Source = "Visual Design Principles in UI Design.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "10. Visual Design Principles in UI Design.mp4"
    },
    @{
        Source = "UI Design in Figma.mp4"
        Subfolder = "Module 1\2. Introduction to Design"
        Target = "11. UI Design in Figma.mp4"
    },
    @{
        Source = "Designing a User Interface.mp4"
        Subfolder = "Module 1\3. Mockup Design Concepts"
        Target = "15. Designing a User Interface.mp4"
    },
    @{
        Source = "Typography, Readability, and Color Theory in UI Design.mp4"
        Subfolder = "Module 1\3. Mockup Design Concepts"
        Target = "16. Typography, Readability, and Color Theory in UI Design.mp4"
    },
    @{
        Source = "Best Practices in UI Design for Web and Mobile.mp4"
        Subfolder = "Module 1\3. Mockup Design Concepts"
        Target = "17. Best Practices in UI Design for Web and Mobile.mp4"
    },

    # Module 2
    @{
        Source = "Introduction to Responsive Web Design (RWD) .mp4"
        Subfolder = "Module 2\1. Responsive Web Design"
        Target = "1. Introduction to Responsive Web Design (RWD).mp4"
    },
    @{
        Source = "Mobile First Design.mp4"
        Subfolder = "Module 2\1. Responsive Web Design"
        Target = "2. Mobile First Design.mp4"
    },
    @{
        Source = "Adaptive Layouts and Fluid Layouts.mp4"
        Subfolder = "Module 2\1. Responsive Web Design"
        Target = "3. Adaptive Layouts and Fluid Layouts.mp4"
    },
    @{
        Source = "Working with Media Queries.mp4"
        Subfolder = "Module 2\1. Responsive Web Design"
        Target = "4. Working with Media Queries.mp4"
    },
    @{
        Source = "Responsive Web Design Best Practices.mp4"
        Subfolder = "Module 2\1. Responsive Web Design"
        Target = "5. Responsive Web Design Best Practices.mp4"
    },
    @{
        Source = "Cross Device Validation and Testing.mp4"
        Subfolder = "Module 2\1. Responsive Web Design"
        Target = "6. Cross Device Validation and Testing.mp4"
    },
    @{
        Source = "Introduction to Progressive Web Development .mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "10. Introduction to Progressive Web Development.mp4"
    },
    @{
        Source = "Progressive Web Development Technologies.mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "11. Progressive Web Development Technologies.mp4"
    },
    @{
        Source = "Single Page Applications (SPA).mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "12. Single Page Applications (SPA).mp4"
    },
    @{
        Source = "Service Worker, Push Notifications and Caching .mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "13. Service Worker, Push Notifications and Caching.mp4"
    },
    @{
        Source = "Converting Existing App to PWA.mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "14. Converting Existing App to PWA.mp4"
    },
    @{
        Source = "Progressive Web Applications in Action.mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "15. Progressive Web Applications in Action.mp4"
    },
    @{
        Source = "No Code & Low Code Tools.mp4"
        Subfolder = "Module 2\2. Progressive Web Development & No Code"
        Target = "16. No Code & Low Code Tools.mp4"
    },

    # Module 3
    @{
        Source = "What is Figma_.mp4"
        Subfolder = "Module 3\1. Getting Started with Figma"
        Target = "1. What is Figma.mp4"
    },
    @{
        Source = "Essential Concepts of Figma.mp4"
        Subfolder = "Module 3\1. Getting Started with Figma"
        Target = "2. Essential Concepts of Figma.mp4"
    },
    @{
        Source = "Setup and Configure Figma.mp4"
        Subfolder = "Module 3\1. Getting Started with Figma"
        Target = "3. Setup and Configure Figma.mp4"
    },
    @{
        Source = "Images, Shapes, and Tools.mp4"
        Subfolder = "Module 3\1. Getting Started with Figma"
        Target = "4. Images, Shapes, and Tools.mp4"
    },
    @{
        Source = "Working with Figma.mp4"
        Subfolder = "Module 3\2. Working with Figma & Design Systems"
        Target = "9. Working with Figma.mp4"
    },
    @{
        Source = "Getting Started with Components.mp4"
        Subfolder = "Module 3\2. Working with Figma & Design Systems"
        Target = "10. Getting Started with Components.mp4"
    },
    @{
        Source = "Styles and Libraries in Figma.mp4"
        Subfolder = "Module 3\2. Working with Figma & Design Systems"
        Target = "11. Styles and Libraries in Figma.mp4"
    },
    @{
        Source = "Cards and Layout Grids in Figma .mp4"
        Subfolder = "Module 3\2. Working with Figma & Design Systems"
        Target = "12. Cards and Layout Grids in Figma.mp4"
    }
)

Write-Host "`n[2/3] Moving and organizing video files..." -ForegroundColor Yellow
$movedCount = 0
$alreadyInPlace = 0

foreach ($vm in $videoMoves) {
    $targetDir = Join-Path $courseRoot $vm.Subfolder
    $finalDst = Join-Path $targetDir $vm.Target

    if (Test-Path -LiteralPath $finalDst) {
        $alreadyInPlace++
        Write-Host "  [=] In place: $($vm.Subfolder)\$($vm.Target)" -ForegroundColor DarkGray
        continue
    }

    # Search in raw folder
    $actualSrc = $null
    if (Test-Path -LiteralPath $uxRawPath) {
        $candidate = Join-Path $uxRawPath $vm.Source
        if (Test-Path -LiteralPath $candidate) {
            $actualSrc = $candidate
        } else {
            $m = Get-ChildItem -LiteralPath $uxRawPath -File | Where-Object { $_.Name.Trim() -eq $vm.Source.Trim() } | Select-Object -First 1
            if ($m) { $actualSrc = $m.FullName }
        }
    }

    if ($actualSrc) {
        Move-Item -LiteralPath $actualSrc -Destination $finalDst -Force
        $movedCount++
        Write-Host "  [✓] Moved: $($vm.Target) -> $($vm.Subfolder)" -ForegroundColor Green
    } else {
        Write-Host "  [?] Source not found in raw folder: $($vm.Source)" -ForegroundColor DarkYellow
    }
}

Write-Host "`nVideos: $movedCount moved, $alreadyInPlace already organized." -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# 3. Helper to write Markdown file safely
# ------------------------------------------------------------------------------
function Save-CourseDoc {
    param(
        [string]$Subfolder,
        [string]$FileName,
        [string]$Content
    )
    $destDir = Join-Path $courseRoot $Subfolder
    if (-not (Test-Path -LiteralPath $destDir)) {
        [System.IO.Directory]::CreateDirectory($destDir) | Out-Null
    }
    $destFile = Join-Path $destDir $FileName
    if (-not (Test-Path -LiteralPath $destFile)) {
        [System.IO.File]::WriteAllText($destFile, $Content.Trim(), [System.Text.Encoding]::UTF8)
        Write-Host "  [+] Created Doc: $Subfolder\$FileName" -ForegroundColor Green
    } else {
        Write-Host "  [.] Doc Exists : $Subfolder\$FileName" -ForegroundColor DarkGray
    }
}

Write-Host "`n[3/3] Generating comprehensive Markdown Readings, Labs & Quizzes..." -ForegroundColor Yellow

# ==============================================================================
# MODULE 2 READINGS, LABS & QUIZZES
# ==============================================================================

# 7. Best Practices for Mobile-First Design
$docM2_7 = @"
# Reading: Best Practices for Mobile-First Design

## Overview
Mobile-First design is a design philosophy and development methodology that begins designing an online experience from the smallest screen constraints (mobile devices) and progressively enhances the experience as viewport sizes grow (tablets, desktops, large displays).

---

## Why Mobile-First Matters
1. **Traffic Dominance**: More than 60% of all global web traffic originates from mobile devices.
2. **Bandwidth Efficiency**: Mobile users frequently operate on variable cellular connections (3G/4G/5G). Mobile-first forces optimization of assets, typography, and script execution.
3. **Core Content Prioritization**: Small screen real estate compels teams to ruthlessly prioritize primary user actions, cutting unnecessary clutter.

---

## Core Best Practices
- **Content Hierarchy**: Place the most critical information and high-value conversion elements above the fold on mobile.
- **Touch-Friendly Tap Targets**: Maintain minimum clickable areas of at least **48x48 CSS pixels** with adequate spacing (minimum 8px) between interactive elements to prevent mis-clicks.
- **Fluid Grid Layouts**: Utilize modern CSS Grid and Flexbox with relative units (`rem`, `%`, `vw`, `vh`) instead of fixed pixel widths.
- **Typography & Readability**: Set base body text to a minimum of **16px** to avoid automatic zoom triggers in mobile browsers (like iOS Safari). Maintain line height (`line-height: 1.5` to `1.6`).
- **Responsive Images**: Employ `<picture>` tags and `srcset` attributes with modern web formats (`.webp`, `.avif`) to serve appropriately sized assets based on device pixel ratio (DPR).
- **Graceful Degradation vs Progressive Enhancement**: Start with core HTML structure and styling that functions universally, then layer on advanced interactive features using CSS `@media (min-width: ...)` breakpoints.
"@
Save-CourseDoc -Subfolder "Module 2\1. Responsive Web Design" -FileName "7. Ungraded Plugin Reading Best Practices for Mobile-First Design.md" -Content $docM2_7

# 8. Hands-on Lab: View in Responsive and Nonresponsive in Emulator
$docM2_8 = @"
# Hands-on Lab: View in Responsive and Nonresponsive in Emulator

## Lab Overview
In this hands-on lab, you will explore how modern web browsers emulate diverse mobile and tablet screen viewports. You will compare non-responsive legacy layouts with responsive fluid layouts.

## Objectives
- Use Chrome DevTools / Edge Developer Tools Device Mode.
- Inspect viewport meta tags and evaluate their impact on mobile rendering.
- Simulate network throttling (Fast 3G / Slow 3G) and touch interactions.
- Identify common responsive defects such as horizontal overflow and microscopic typography.

---

## Step-by-Step Instructions

### Step 1: Open Developer Tools
1. Open your web browser (Google Chrome, Microsoft Edge, or Firefox).
2. Press `F12` or `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac).
3. Toggle the **Device Toolbar** by clicking the mobile/tablet icon or pressing `Ctrl + Shift + M`.

### Step 2: Testing Non-Responsive Behavior
1. Navigate to a legacy or fixed-width test page.
2. Notice how without the `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag, the mobile browser renders the full desktop page at 980px and zooms out, making text unreadable without pinch-zooming.
3. Observe horizontal scrolling artifacts.

### Step 3: Testing Responsive Behavior
1. Inspect a modern responsive website (such as Learnify AI).
2. Test common device presets:
   - iPhone 14 / 15 Pro (393 x 852)
   - Samsung Galaxy S20 (360 x 800)
   - iPad Air (820 x 1180)
3. Rotate the viewport between Portrait and Landscape orientations.
4. Verify that navigation menus collapse into accessible drawer/hamburger menus and columns stack smoothly into a single-column layout.

### Step 4: Network and Sensor Emulation
1. In DevTools, open the **Network** tab and select throttling profile: **Fast 3G**.
2. Refresh and record the First Contentful Paint (FCP) and visual loading order.
3. Verify that critical text renders before heavy background images load.
"@
Save-CourseDoc -Subfolder "Module 2\1. Responsive Web Design" -FileName "8. Ungraded Plugin Hands-on Lab View in Responsive and Nonresponsive in Emulator.md" -Content $docM2_8

# 9. Practice Quiz: Responsive Design
$docM2_9 = @"
# Practice Quiz: Responsive Design

**Attempts**: Unlimited
This practice assignment helps you evaluate your understanding of Responsive Web Design (RWD) and Mobile-First concepts.

---

### Question 1
Which viewport meta tag configuration is essential for enabling responsive layouts on mobile devices?
- [ ] `<meta name="viewport" content="width=1024, user-scalable=no">`
- [x] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] `<meta name="screen" content="responsive=true">`
- [ ] `<meta name="mobile-first" content="active">`

**Explanation**: The `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag instructs the browser to match the screen's width in device-independent pixels and sets the initial zoom level to 1.0.

---

### Question 2
What is the primary difference between Adaptive Design and Responsive Design?
- [ ] Adaptive design uses CSS only, while responsive design requires JavaScript.
- [ ] Responsive design uses fixed pixel break points, while adaptive design is 100% fluid.
- [x] Responsive design uses fluid grids and flexible media to adapt smoothly to any screen size, whereas adaptive design serves distinct static layouts tailored to specific predefined breakpoints.
- [ ] Adaptive design only works on mobile devices.

**Explanation**: Responsive design uses fluid percentages and media queries to adapt continuously across any resolution. Adaptive design detects the device and serves one of several predefined fixed layouts.

---

### Question 3
In a Mobile-First CSS architecture, which media query strategy is primarily utilized?
- [ ] `@media (max-width: ...)` (Desktop-down)
- [x] `@media (min-width: ...)` (Mobile-up)
- [ ] `@media (orientation: portrait)` exclusively
- [ ] `@media (resolution: 300dpi)`

**Explanation**: Mobile-First begins with default base styles for the smallest viewport and progressively introduces enhancements for larger screens using `@media (min-width: ...)` rules.

---

### Question 4
True or False: According to Apple and Google human interface guidelines, interactive mobile touch targets should measure at least 44x44 to 48x48 CSS pixels.
- [x] True
- [ ] False

**Explanation**: Touch targets must accommodate human finger pads (average 10-14mm), making 44-48px the standard minimum recommended dimension.

---

### Question 5
Which CSS units are considered relative units ideal for scalable responsive typography and layouts?
- [ ] `px` and `pt`
- [ ] `cm` and `in`
- [x] `rem`, `em`, `vw`, and `%`
- [ ] `dp` and `sp`

**Explanation**: `rem`, `em`, viewport units (`vw`, `vh`), and percentages are relative units that adapt dynamically based on user font preferences and viewport size.
"@
Save-CourseDoc -Subfolder "Module 2\1. Responsive Web Design" -FileName "9. Graded Assignment Practice Quiz Responsive Design.md" -Content $docM2_9

# 17. Hands-on Lab: Design a Progressive Web App
$docM2_17 = @"
# Hands-on Lab: Design a Progressive Web App (PWA)

## Overview
Progressive Web Apps combine the universal reach of the open web with the rich capabilities of native mobile applications. In this lab, you will configure the core components that transform a standard web app into an installable PWA.

## Learning Objectives
1. Construct and validate a `manifest.json` file.
2. Register and configure a basic Service Worker (`sw.js`).
3. Implement an offline fallback caching strategy using the Cache Storage API.
4. Test installation readiness using Chrome DevTools Lighthouse and Application panel.

---

## Step 1: Web App Manifest (`manifest.json`)
Create a `manifest.json` file with standard properties:
```json
{
  "short_name": "LearnifyUI",
  "name": "Learnify AI - UI/UX Studio",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/icons/icon-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "#090d16",
  "theme_color": "#4f46e5",
  "display": "standalone",
  "orientation": "portrait-primary"
}
```

## Step 2: Registering the Service Worker
Add the following registration script in your main HTML / JavaScript entry point:
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('ServiceWorker registered with scope:', reg.scope))
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
}
```

## Step 3: Implementing Cache-First Service Worker (`sw.js`)
```javascript
const CACHE_NAME = 'learnify-ui-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => caches.match('/offline.html'));
    })
  );
});
```

## Step 4: Verification in DevTools
1. Open DevTools (`F12`) -> **Application** tab.
2. Click **Manifest**: Verify identity, icons, theme colors, and installation triggers.
3. Click **Service Workers**: Verify status is **Activated and running**. Check the "Offline" checkbox and reload to verify offline functionality.
"@
Save-CourseDoc -Subfolder "Module 2\2. Progressive Web Development & No Code" -FileName "17. App Item Hands-on Lab Design a Progressive Web App.md" -Content $docM2_17

# 18. Practice Quiz: Progressive Web Development (PWD)
$docM2_18 = @"
# Practice Quiz: Progressive Web Development (PWD)

**Attempts**: Unlimited

---

### Question 1
What is the core role of a Service Worker in a Progressive Web Application?
- [ ] It renders DOM components directly on the screen.
- [ ] It manages relational database transactions in PostgreSQL.
- [x] It acts as a programmable network proxy that intercepts network requests, manages client-side caching, and enables background sync and push notifications.
- [ ] It replaces CSS style sheets with native device styling.

**Explanation**: Service Workers run on a background thread separate from the webpage, intercepting HTTP requests to deliver offline content and push notifications.

---

### Question 2
Which file provides metadata about a PWA (such as app name, icons, start URL, and display mode) to allow the browser to prompt the user for installation?
- [ ] `package.json`
- [ ] `sw.js`
- [x] `manifest.json`
- [ ] `robots.txt`

**Explanation**: The Web App Manifest (`manifest.json`) defines how the PWA appears to the user when installed on home screens and application drawers.

---

### Question 3
What are the defining characteristics of a Single Page Application (SPA)?
- [ ] Every user action requires a full page refresh from the server.
- [x] It loads a single HTML shell and dynamically updates content as the user interacts with the app, providing faster, app-like transitions without full reloads.
- [ ] It only functions when disconnected from the Internet.
- [ ] It cannot make API calls.

**Explanation**: SPAs update the view dynamically using client-side JavaScript routers and asynchronous API calls (`fetch`/XHR), avoiding white-screen page refreshes.

---

### Question 4
Under which protocol MUST a Progressive Web Application be served to enable Service Workers in production?
- [ ] HTTP/1.0
- [ ] FTP
- [x] HTTPS (SSL/TLS)
- [ ] Telnet

**Explanation**: Due to the powerful interception capabilities of Service Workers, browsers mandate HTTPS for security (with an exception only for `localhost` during development).

---

### Question 5
What advantage do No-Code and Low-Code tools (such as Figma to code plugins, Webflow, or Thunkable) provide in modern product workflows?
- [ ] They eliminate the need for designers to understand user requirements.
- [x] They accelerate rapid prototyping, visual validation, and minimum viable product (MVP) delivery with minimal manual boilerplate code.
- [ ] They prevent software from ever needing security updates.
- [ ] They can only produce static text files.

**Explanation**: Low-code/no-code platforms enable rapid visual ideation, testing, and deployment, bridging the gap between designers and production engineering.
"@
Save-CourseDoc -Subfolder "Module 2\2. Progressive Web Development & No Code" -FileName "18. Graded Assignment Practice Quiz Progressive Web Development (PWD).md" -Content $docM2_18

# 19. Module 2 Summary: Web Design Methodologies
$docM2_19 = @"
# Module 2 Summary: Web Design Methodologies

## Key Takeaways
In this module, you explored modern web design methodologies that allow digital experiences to adapt effortlessly across the vast landscape of devices and screen resolutions.

### 1. Responsive Web Design (RWD) & Mobile-First
- **Responsive Web Design**: Built on three pillars:
  1. Fluid Grid Layouts (`%`, `fr`, Flexbox, CSS Grid).
  2. Flexible Media (`max-width: 100%`, `srcset`, `<picture>`).
  3. CSS3 Media Queries (`@media (min-width: ...)`).
- **Mobile-First Approach**: Designing for constraints first forces ruthless prioritization of features and bandwidth optimization before expanding to desktop real estate.

### 2. Adaptive vs Fluid vs Responsive
- **Fluid Layouts**: Proportional scaling that shrinks and stretches elements without changing structural arrangements.
- **Adaptive Layouts**: Static layouts that switch at distinct breakpoint thresholds.
- **Responsive Layouts**: Combines fluid scaling with adaptive media queries for seamless transition across all dimensions.

### 3. Progressive Web Applications (PWA)
- **App-Like Experience**: Combines web reach with native app capabilities (offline access, push notifications, home screen icon).
- **Service Workers**: Background scripts acting as client proxies to cache critical assets and API responses.
- **Web App Manifest**: Enables installation prompts and standalone window presentation.
- **Single Page Applications (SPA)**: Deliver seamless transitions without disruptive full-page reloads.
"@
Save-CourseDoc -Subfolder "Module 2\3. Module 2 Summary and Assessment" -FileName "19. Module 2 Summary Web Design Methodologies.md" -Content $docM2_19

# 20. Module 2 Graded Quiz: Web Design Methodologies
$docM2_20 = @"
# Module 2 Graded Quiz: Web Design Methodologies

**Passing Score**: 80% or higher
**Total Questions**: 10

---

### Question 1
Which CSS media query targets devices with a viewport width of 768px or greater?
- [x] `@media screen and (min-width: 768px)`
- [ ] `@media screen and (max-width: 768px)`
- [ ] `@media screen and (device-width: 768px)`
- [ ] `@media only (width < 768px)`

**Correct Answer**: A
**Feedback**: In mobile-first development, `min-width: 768px` applies styles to tablet and desktop screens larger than mobile devices.

---

### Question 2
What is the effect of omitting the viewport meta tag on mobile devices?
- [ ] The web page will refuse to load.
- [x] The mobile browser assumes a virtual desktop viewport (typically 980px) and scales the page down, causing microscopic text and requiring pinch-to-zoom.
- [ ] The browser converts the web page into native Android / iOS widgets automatically.
- [ ] CSS animations will crash the browser thread.

**Correct Answer**: B
**Feedback**: Without `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, mobile browsers default to desktop fallback scaling.

---

### Question 3
Which caching strategy in a Service Worker serves assets from cache immediately, and if absent, fetches from the network and saves it to the cache for future use?
- [ ] Network-Only
- [ ] Cache-Only
- [x] Cache-First (Fallback to Network)
- [ ] Stale-While-Revalidate

**Correct Answer**: C
**Feedback**: Cache-First prioritizes offline speed by checking cache first and falling back to network if the asset is missing.

---

### Question 4
Which PWA display mode in `manifest.json` provides an interface that looks and feels like a standalone native app (hiding browser URL bar and navigation buttons)?
- [ ] `browser`
- [ ] `minimal-ui`
- [x] `standalone`
- [ ] `fullscreen-lock`

**Correct Answer**: C
**Feedback**: `standalone` opens the app without browser chrome (URL bar, navigation controls), giving it an authentic native app appearance.

---

### Question 5
What does the concept of "Progressive Enhancement" emphasize?
- [ ] Building for high-end gaming laptops first, then disabling features for phones.
- [x] Providing a baseline of accessible content and core functionality to all browsers, while serving advanced visuals and interactions to modern browsers capable of supporting them.
- [ ] Upgrading user hardware remotely.
- [ ] Requiring users to pay subscription tiers to see responsive layouts.

**Correct Answer**: B
**Feedback**: Progressive enhancement guarantees access to content on any browser, layering enhanced features where supported.

---

### Question 6
Which tool inside Google Chrome DevTools audits web pages for Performance, Accessibility, Best Practices, SEO, and PWA criteria?
- [ ] Elements Inspector
- [ ] Memory Profiler
- [x] Lighthouse
- [ ] Security Panel

**Correct Answer**: C
**Feedback**: Lighthouse is the automated open-source auditing tool built into Chrome DevTools.

---

### Question 7
When testing a responsive website across multiple devices, what is cross-browser validation?
- [ ] Ensuring code runs on both Windows and Linux servers.
- [x] Verifying that layout, typography, input controls, and JavaScript features behave predictably across different browser rendering engines (Blink, WebKit, Gecko).
- [ ] Translating website text into different foreign languages.
- [ ] Checking if the database connects across multiple cloud providers.

**Correct Answer**: B
**Feedback**: Cross-browser testing validates rendering consistency across Chrome/Edge (Blink), Safari (WebKit), and Firefox (Gecko).

---

### Question 8
Why are Single Page Applications (SPAs) favored for complex web dashboards and modern SaaS interfaces?
- [ ] They eliminate the need for server hosting.
- [x] They provide fast, fluid user experiences by dynamically re-rendering components without reloading the entire HTML document on every route change.
- [ ] They automatically generate native Swift code for iOS.
- [ ] They prevent any network traffic after the initial download.

**Correct Answer**: B
**Feedback**: SPAs load assets once and dynamically swap UI views, reducing latency and visual page flickers.

---

### Question 9
In CSS Grid and Flexbox, which property allows items to wrap onto multiple lines when horizontal space is constrained?
- [ ] `flex-direction: column-reverse;`
- [x] `flex-wrap: wrap;`
- [ ] `overflow: scroll;`
- [ ] `display: block-inline;`

**Correct Answer**: B
**Feedback**: `flex-wrap: wrap;` instructs flex children to break onto new lines rather than overflowing or shrinking excessively.

---

### Question 10
What role do Low-Code and No-Code platforms play in modern product engineering cycles?
- [ ] They completely replace senior software engineers in production systems.
- [x] They enable rapid prototyping, user testing, and validation of product concepts before committing extensive engineering resources.
- [ ] They increase development time by adding manual boilerplate.
- [ ] They can only be executed offline without internet access.

**Correct Answer**: B
**Feedback**: No-code/low-code tools empower teams to test and validate ideas quickly with real users before full-scale engineering.
"@
Save-CourseDoc -Subfolder "Module 2\3. Module 2 Summary and Assessment" -FileName "20. Module 2 Graded Quiz Web Design Methodologies.md" -Content $docM2_20

# ==============================================================================
# MODULE 3 READINGS, LABS & QUIZZES
# ==============================================================================

# 5. Getting Started with Figma and its Features
$docM3_5 = @"
# Reading: Getting Started with Figma and its Features

## Overview
Figma is a collaborative cloud-based interface design and vector graphics tool. Unlike legacy desktop applications, Figma runs directly inside the web browser as well as via dedicated desktop clients for macOS and Windows.

---

## Key Core Architectural Concepts
1. **Cloud-Native Collaboration**: Multiple team members can view, edit, and comment on the same file in real-time, similar to Google Docs.
2. **Frames vs Groups**:
   - **Groups** simply combine elements for bulk movement; their bounding box is strictly determined by their children.
   - **Frames** act like HTML `<div>` containers. They have their own independent dimensions, background fills, clipping boundaries (`Clip content`), and layout constraints.
3. **Auto Layout**: Emulates CSS Flexbox in visual design, allowing buttons and card containers to automatically expand or contract based on their text length and padding.
4. **Components and Variants**: Reusable UI elements that can be instantiated across multiple screens. Updating the Master Component automatically propagates changes across all instances.
"@
Save-CourseDoc -Subfolder "Module 3\1. Getting Started with Figma" -FileName "5. Getting Started with Figma and its Features.md" -Content $docM3_5

# 6. Hands-on Lab: Getting started with Figma
$docM3_6 = @"
# Hands-on Lab: Getting Started with Figma

## Lab Goal
Create your first Figma workspace, configure personal preferences, create artboard frames for mobile and desktop, and practice using basic vector and text tools.

---

## Exercise Steps

### Step 1: Sign up & Workspace Setup
1. Navigate to [figma.com](https://www.figma.com) and sign in to your free account.
2. From the file browser, click **+ Design file** in the top right corner.
3. Name your file: `Learnify AI - UI Practice`.

### Step 2: Creating Frames
1. Press `F` or select the **Frame tool** from the toolbar.
2. In the right-hand Inspector panel, select presets:
   - **Desktop**: MacBook Pro 14" (1512 x 982)
   - **Phone**: iPhone 14 / 15 Pro (393 x 852)
3. Rename the frames to `Desktop - Home` and `Mobile - Home`.

### Step 3: Drawing Basic Shapes & Styling
1. Press `R` (Rectangle tool) and draw a navigation bar rectangle (Width: `100%`, Height: `72px`).
2. Add a Fill color: `#0F172A` (Slate 900).
3. Press `T` (Text tool), click on the nav bar, and type `Learnify AI`. Set font to **Inter**, weight **Bold**, size **20px**, color `#FFFFFF`.

### Step 4: Prototyping Hotspots
1. Draw a button shape with rounded corners (`Corner radius: 8px`), fill `#4F46E5` (Indigo 600).
2. Add text: `Get Started`.
3. Switch to the **Prototype** tab on the top-right inspector.
4. Drag the blue interaction node from the button on the desktop frame to the mobile frame.
5. Set interaction: `On click` -> `Navigate to` -> `Instant`.
6. Click the **Present** (Play) button in the upper right toolbar to test your prototype!
"@
Save-CourseDoc -Subfolder "Module 3\1. Getting Started with Figma" -FileName "6. Ungraded Plugin Hands-on Lab Getting started with Figma.md" -Content $docM3_6

# 7. Figma's Guide to Collaboration and Sharing Prototypes
$docM3_7 = @"
# Reading: Figma's Guide to Collaboration and Sharing Prototypes

## Collaborative Workflows
Figma’s multi-player collaboration model fundamentally transformed how product teams, designers, and software engineers work together.

### 1. Multiplayer Cursors & Observation Mode
- Each collaborator displays a labeled cursor with their avatar and name.
- Clicking an avatar in the toolbar enters **Observation Mode**, mirroring their exact screen viewpoint and zoom level—ideal for design walkthroughs.

### 2. Contextual Commenting
- Press `C` to drop a comment directly on any frame, vector point, or component.
- Mention team members using `@username` to trigger instant notifications.
- Resolve comments once feedback is integrated to maintain a clean canvas.

### 3. Share Permissions & Security
- **Can View**: Allows stakeholders and developers to inspect layers, copy CSS values, and test interactive prototypes without altering design layers.
- **Can Edit**: Full authoring capabilities for design system team members.
- **Password Protection**: Restrict sensitive client prototypes behind passwords.

### 4. Dev Mode
- Dev Mode provides engineers with inspect tools, CSS/Tailwind token generation, asset export (SVG, PNG, WebP), and component change diffs.
"@
Save-CourseDoc -Subfolder "Module 3\1. Getting Started with Figma" -FileName "7. Ungraded Plugin Reading Figma's Guide to Collaboration and Sharing Prototypes.md" -Content $docM3_7

# 8. Practice Quiz: Figma Introduction
$docM3_8 = @"
# Practice Quiz: Figma Introduction

**Attempts**: Unlimited

---

### Question 1
What is the fundamental difference between a Group and a Frame in Figma?
- [ ] Groups can have independent background fills, while frames cannot.
- [x] Frames act like independent layout containers with their own dimensions, clipping options, and layout constraints, whereas groups are simply collections whose bounds strictly match their child elements.
- [ ] Frames can only be used on mobile screens.
- [ ] Groups can hold components, while frames cannot.

**Explanation**: Frames in Figma correspond closely to container elements in web development (`div`), supporting independent width, height, auto layout, and constraints.

---

### Question 2
Which shortcut key activates the Frame tool in Figma?
- [ ] `R`
- [x] `F`
- [ ] `T`
- [ ] `V`

**Explanation**: `F` or `A` opens the Frame selection panel with preset dimensions for phones, tablets, desktops, and social media.

---

### Question 3
How do you enter Observation Mode in Figma during a live design review?
- [ ] Press `Ctrl + Alt + Del`.
- [x] Click on the avatar of the collaborator in the top-right toolbar.
- [ ] Export the file to PDF.
- [ ] Press the Spacebar twice.

**Explanation**: Clicking any collaborator’s avatar automatically follows their viewport and zoom across the canvas.

---

### Question 4
True or False: Figma requires installing local software on Windows and cannot run in a browser.
- [ ] True
- [x] False

**Explanation**: Figma was built from the ground up on WebGL and WebAssembly to run fully in modern web browsers.

---

### Question 5
What does the "Clip content" checkbox on a Figma Frame accomplish?
- [ ] It deletes all objects outside the frame.
- [x] It hides any child layers that extend beyond the physical boundaries of the frame (equivalent to CSS `overflow: hidden`).
- [ ] It turns the frame into a video file.
- [ ] It locks all layers inside the frame.

**Explanation**: "Clip content" prevents overflow from rendering outside the container, matching CSS `overflow: hidden`.
"@
Save-CourseDoc -Subfolder "Module 3\1. Getting Started with Figma" -FileName "8. Graded Assignment Practice Quiz Figma Introduction.md" -Content $docM3_8

# 13. Hands-on Lab: Design a landing page for a travel website using Figma
$docM3_9 = @"
# Hands-on Lab: Design a Landing Page for a Travel Website using Figma

## Goal
Design a responsive, visually compelling landing page for a travel discovery platform using Figma’s Auto Layout, Component Variants, and Layout Grids.

---

## Specifications & Requirements

### 1. Frame Setup & Layout Grid
- Frame: Desktop (1440 x 900)
- Layout Grid: 12-column Grid
  - Margin: `80px`
  - Gutter: `24px`
  - Column Type: Stretch

### 2. Navigation Header (Auto Layout)
- Logo text: **Wanderlust AI** (24px, Bold, `#0EA5E9`)
- Navigation Links: `Destinations`, `Adventures`, `Experiences`, `About Us` (16px, Regular, `#475569`)
- CTA Button: `Book a Trip` (Auto Layout: padding horizontal `24px`, vertical `12px`, corner radius `9999px`, background `#0EA5E9`, text white)

### 3. Hero Section
- Heading: *“Discover Hidden Paradigms Across the Globe”* (56px, Extra Bold, Line height: `1.15`)
- Subtitle: *“Personalized itineraries curated by AI, tailored to your budget and travel pace.”* (20px, Regular, `#64748B`)
- Search Bar Component: Form inputs for *Destination*, *Dates*, and *Guests* with a Search icon button.

### 4. Destination Cards (Reusable Components)
- Create a Master Component: `DestinationCard`
  - Image frame with rounded top corners (`16px`).
  - Card Body (Auto Layout):
    - Location title (20px, Semi-Bold)
    - Rating pill (`⭐ 4.9`)
    - Price tag (`$1,299 / person`)
- Create 3 instances from the master component and populate them with distinct cities (e.g., Kyoto, Amalfi Coast, Banff).
"@
Save-CourseDoc -Subfolder "Module 3\2. Working with Figma & Design Systems" -FileName "13. Ungraded Plugin Hands-on Lab Design a landing page for a travel website using Figma.md" -Content $docM3_9

# 14. Leveraging Figma: From Design to Code Features
$docM3_14 = @"
# Reading: Leveraging Figma: From Design to Code Features

## Introduction
The traditional handoff process between designers and developers was often fraught with ambiguities, redline documents, and manual asset slicing. Modern Figma bridges this divide through Dev Mode and automated token export.

---

## 1. Dev Mode
- **Inspect Properties**: Engineers can view CSS box model values, spacing, flex direction, and exact hex/RGBA colors.
- **Unit Switching**: Switch between CSS `px`, `rem`, Android `dp`/`sp`, or iOS `pt`.
- **Change Tracking**: View visual diffs between design iterations to pinpoint exactly what changed since the last sprint.

## 2. Design Tokens
- Design tokens represent the atomic design decisions of a brand (colors, typography scales, border radii, shadows).
- Using Figma Variables, designers can define tokens that map directly to Tailwind CSS configuration files or CSS custom properties (`--color-primary-500`).

## 3. Asset Export Best Practices
- **SVGs**: Use for vector icons and logos. Ensure paths are outlined and clean up extraneous group wrappers.
- **WebP / AVIF**: Use for photographic assets to ensure optimal web compression.
- **Export Presets**: Set `@1x`, `@2x`, and `@3x` exports to support high-density Retina displays.
"@
Save-CourseDoc -Subfolder "Module 3\2. Working with Figma & Design Systems" -FileName "14. Ungraded Plugin Reading Leveraging Figma From Design to Code Features.md" -Content $docM3_14

# 15. Leveraging AI-Driven Features and Plugins
$docM3_15 = @"
# Reading: Leveraging AI-Driven Features and Plugins in Figma

## Overview
Figma’s ecosystem features powerful AI capabilities and community plugins that streamline repetitive design tasks and empower designers to focus on high-level problem solving.

---

## 1. Native Figma AI Capabilities
- **First Draft Generation**: Create wireframe layouts and user flow explorations from natural language prompts.
- **Visual Search**: Locate existing components in large enterprise design systems simply by image similarity or description.
- **Automated Copywriting**: Generate realistic copy, localized translations, and contextually appropriate placeholder text to replace generic "Lorem Ipsum".
- **Background Removal**: Remove image backgrounds with a single click.

## 2. Essential Community Plugins
- **Unsplash / Pexels**: Instant high-resolution royalty-free imagery inserted directly into image fills.
- **Lucide / Feather Icons**: Vector icon sets searchable directly within the canvas.
- **Contrast Checker**: Evaluates WCAG 2.1 AA/AAA compliance for text against background colors.
- **Content Reel**: Populates realistic avatars, names, dates, and addresses into component instances in seconds.
"@
Save-CourseDoc -Subfolder "Module 3\2. Working with Figma & Design Systems" -FileName "15. Ungraded Plugin Reading Leveraging AI-Driven Features and Plugins.md" -Content $docM3_15

# 16. Practice Quiz: Intermediate Figma
$docM3_16 = @"
# Practice Quiz: Intermediate Figma

**Attempts**: Unlimited

---

### Question 1
What happens when you edit the properties of a Master Component in Figma?
- [ ] Only the master component changes; instances must be updated manually.
- [x] All instances of that component across the entire project automatically reflect the changes, unless a specific property has been explicitly overridden.
- [ ] All instances are detached and converted into standard vector rectangles.
- [ ] Figma creates a duplicate file.

**Explanation**: Master components propagate changes to all instances, maintaining consistency across design systems.

---

### Question 2
What is the primary benefit of Auto Layout in Figma?
- [ ] It generates 3D models.
- [x] It dynamically adjusts element dimensions, margins, and padding based on content changes, replicating CSS Flexbox behavior.
- [ ] It compresses video files.
- [ ] It automatically translates text into 50 languages.

**Explanation**: Auto Layout allows containers to automatically resize and re-flow when text length changes or items are added/removed.

---

### Question 3
Which feature allows designers to bundle multiple states of a component (such as Default, Hover, Focused, Disabled) into a single unified component?
- [ ] Frames
- [ ] Groups
- [x] Component Variants
- [ ] Masks

**Explanation**: Component Variants allow multiple states and sizes of a component to be organized under a clean property dropdown in the inspector.

---

### Question 4
In Figma, what are Layout Grids used for?
- [ ] Coloring vector paths.
- [x] Establishing consistent spatial structure, margins, and column alignment across screen sizes.
- [ ] Cropping photos.
- [ ] Exporting SVG code.

**Explanation**: Layout Grids (columns, rows, and grid squares) ensure visual alignment, modular balance, and consistent spatial rhythm.

---

### Question 5
What does "Dev Mode" in Figma enable developers to do?
- [ ] Change the visual branding colors of the company.
- [x] Inspect CSS/code properties, measure spatial distances, track file version diffs, and export assets without accidental modifications to the design.
- [ ] Rewrite database schemas.
- [ ] Compile C++ applications.

**Explanation**: Dev Mode is a dedicated workspace for developers to inspect, measure, and export assets safely.
"@
Save-CourseDoc -Subfolder "Module 3\2. Working with Figma & Design Systems" -FileName "16. Graded Assignment Practice Quiz Intermediate Figma.md" -Content $docM3_16

# 17. Module 3 Summary: UI Design with Figma
$docM3_17 = @"
# Module 3 Summary: UI Design with Figma

## Key Takeaways
In this module, you mastered the industry-standard UI design tool, Figma, from initial setup to intermediate design system architecture.

### 1. Fundamentals
- **Frames vs Groups**: Frames act as responsive containers with clip boundaries and constraints.
- **Vector Tools**: Precision pen, shape tools, Boolean operations (Union, Subtract, Intersect, Exclude).

### 2. Auto Layout & Spatial Discipline
- Emulating CSS Flexbox in UI design.
- Applying uniform padding, gap spacing (4px / 8px scale), and alignment.
- Designing responsive cards, navigation headers, and modal dialogs that flex with content.

### 3. Design Systems & Component Architecture
- **Master Components & Instances**: Reusability with granular override capabilities.
- **Component Variants**: Grouping interactive states (`Hover`, `Pressed`, `Disabled`).
- **Color & Typography Styles**: Centralized tokens for theme switching and brand consistency.
- **Layout Grids**: 12-column responsive grid setups for web and 4-column setups for mobile.
"@
Save-CourseDoc -Subfolder "Module 3\3. Module 3 Summary and Assessment" -FileName "17. Module 3 Summary UI Design with Figma.md" -Content $docM3_17

# 18. Module 3 Graded Quiz: UI Design with Figma
$docM3_18 = @"
# Module 3 Graded Quiz: UI Design with Figma

**Passing Score**: 80% or higher
**Total Questions**: 10

---

### Question 1
Which Boolean operation combines two overlapping shapes into a single unified vector path?
- [x] Union selection
- [ ] Subtract selection
- [ ] Intersect selection
- [ ] Exclude selection

**Correct Answer**: A
**Feedback**: Union combines all overlapping vectors into a single continuous shape.

---

### Question 2
When creating a button using Auto Layout, what setting ensures that the button grows horizontally as longer text is typed?
- [ ] Fixed width
- [x] Hug contents
- [ ] Fill container
- [ ] Clip content

**Correct Answer**: B
**Feedback**: "Hug contents" ensures the parent container shrinks or expands to snugly fit its child elements plus defined padding.

---

### Question 3
What is a Figma Component Instance?
- [ ] The original master template of a UI element.
- [x] A copy of a master component linked to its parent, which inherits changes made to the master while allowing specific local overrides.
- [ ] A static screenshot of a website.
- [ ] An exported PDF document.

**Correct Answer**: B
**Feedback**: Instances are linked copies of a master component.

---

### Question 4
In Figma, how are design tokens (such as primary brand color or body font) best managed for scalability?
- [ ] By manually typing the hex code into every individual layer.
- [x] By defining Color Styles, Text Styles, and Figma Variables.
- [ ] By locking all layers in the file.
- [ ] By taking screenshots of the style guide.

**Correct Answer**: B
**Feedback**: Centralized Styles and Variables make global style updates instant and error-free.

---

### Question 5
What is the standard grid column count typically used for desktop web design layouts?
- [ ] 3 columns
- [ ] 5 columns
- [x] 12 columns
- [ ] 32 columns

**Correct Answer**: C
**Feedback**: 12 columns provide flexible division by 2, 3, 4, and 6, making it the industry standard for responsive web grids.

---

### Question 6
Which constraint setting ensures that a navigation bar stays anchored to both the left and right edges when a frame is resized?
- [ ] Left
- [ ] Center
- [x] Left and Right (or Scale)
- [ ] Top only

**Correct Answer**: C
**Feedback**: "Left and Right" pins the element to both margins, stretching it dynamically with the frame.

---

### Question 7
How does Figma handle vector assets for SVG export?
- [ ] It converts all SVGs into raster PNGs automatically.
- [x] It generates clean, scalable vector paths that can be directly pasted into code or downloaded as .svg files.
- [ ] It encrypts the vector points.
- [ ] It requires an external Photoshop plugin.

**Correct Answer**: B
**Feedback**: Figma has native vector support and outputs clean SVG markup directly to the clipboard.

---

### Question 8
What is the purpose of Component Properties (such as Boolean, Text, and Instance Swap)?
- [ ] They allow non-technical stakeholders to write Python code in Figma.
- [x] They simplify the component configuration in the Inspector, allowing users to toggle elements on/off, change copy, or swap icons without detaching the component.
- [ ] They reduce file size by deleting unselected layers permanently.
- [ ] They prevent any developer from inspecting the layer.

**Correct Answer**: B
**Feedback**: Component properties provide an intuitive, high-level control interface for design system consumers.

---

### Question 9
Which layout option in Auto Layout distributes items evenly across the full width of a container, pushing the first item to the start and the last item to the end?
- [ ] Packed
- [x] Space between (Auto gap)
- [ ] Align top left
- [ ] Align bottom center

**Correct Answer**: B
**Feedback**: Setting gap to "Auto" (Space between) pushes items to opposite edges, ideal for nav bars and headers.

---

### Question 10
Why is real-time cloud collaboration in Figma considered superior to traditional file-sharing methods (like emailing `.psd` or `.sketch` files)?
- [ ] It consumes more storage on local hard drives.
- [x] It establishes a single source of truth, eliminates version conflicts ("final_v2_final.fig"), and enables simultaneous co-designing.
- [ ] It prevents anyone from commenting on the design.
- [ ] It forces all designers to use the same computer.

**Correct Answer**: B
**Feedback**: Cloud-native files maintain a unified, real-time single source of truth for the entire product team.
"@
Save-CourseDoc -Subfolder "Module 3\3. Module 3 Summary and Assessment" -FileName "18. Module 3 Graded Quiz UI Design with Figma.md" -Content $docM3_18

# ==============================================================================
# MODULE 4 READINGS, LABS & QUIZZES
# ==============================================================================

# 1. Final Project Overview
$docM4_1 = @"
# Project Guide: Final Project Overview

## Welcome to the Capstone Project!
In this final project, you will synthesize everything you have learned across the UI/UX certificate program. You will design, prototype, and build an interactive mobile application: the **Sales Pro Interactive Mobile App**.

---

## Project Workflow
1. **Phase 1: Research & Wireframing**:
   - Define user personas and journey maps for a modern field sales representative.
   - Sketch low-fidelity wireframes mapping the primary task flows.
2. **Phase 2: High-Fidelity UI Design in Figma**:
   - Build a comprehensive design system (typography scale, color palette, component library).
   - Design 4 core screens:
     - Authentication / Login
     - Sales Dashboard (KPI metrics, chart visual, recent leads)
     - Product Catalog / Order Entry
     - Client Profile & Activity Timeline
3. **Phase 3: Interactive Prototyping & No-Code Implementation**:
   - Connect prototype transitions and micro-interactions in Figma.
   - Use Thunkable or export assets to test the application on physical mobile hardware.
4. **Phase 4: Evaluation & Submission**:
   - Complete the self-evaluation rubric.
   - Submit your interactive prototype link and design documentation.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "1. Ungraded Plugin Final Project Overview.md" -Content $docM4_1

# 2. Hands-On Lab: Building a Sales App with Figma's Interactive Design Tools
$docM4_2 = @"
# Hands-On Lab: Building a Sales App with Figma's Interactive Design Tools

## Objectives
- Construct interactive component variants with Smart Animate.
- Build sticky navigation bars and scrolling content areas.
- Create dynamic overlays for modal popups and filter sheets.

---

## Step-by-Step Instructions

### Step 1: Design the Sales Dashboard Frame
1. Frame preset: **iPhone 15 Pro** (`393 x 852 px`).
2. Add Header:
   - Greeting: *“Good morning, Alex”* (14px, Regular, `#94A3B8`).
   - Title: *“Q3 Sales Performance”* (24px, Bold, `#0F172A`).
   - Notification Bell icon with unread badge pill.
3. KPI Metric Cards:
   - Revenue: `$124,500` (`+12.4% vs last month`).
   - Deals Closed: `48 deals`.
   - Conversion Rate: `24.6%`.
   - Use Auto Layout with `#F8FAFC` background and subtle border `#E2E8F0`.

### Step 2: Configure Prototype Scrolling
1. For the content container, set vertical resizing to **Overflow: Vertical scrolling**.
2. Select the Bottom Navigation Bar: In the Prototype tab, set position to **Fixed (Stay in place)** so it remains anchored while the cards scroll underneath.

### Step 3: Interactive Modal Overlay
1. Create a separate frame: `Add New Lead Modal` (Width: `393px`, Height: `450px`, rounded top corners `24px`).
2. On the Dashboard frame, select the floating action button (`+`).
3. Drag the prototype connector to the Modal frame.
4. Set Interaction:
   - Trigger: `On click`
   - Action: `Open overlay`
   - Overlay Position: `Bottom center`
   - Animation: `Move in (from bottom)` with `Ease out 300ms`
   - Check: `Close when clicking outside` and `Add background blur`.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "2. Ungraded Plugin Hands-On Lab Building a Sales App with Figma's Interactive Design Tools.md" -Content $docM4_2

# 3. Video / Guide: Getting started with Thunkable and its features
$docM4_3 = @"
# Reading & Guide: Getting Started with Thunkable and its Features

## Introduction to Thunkable
Thunkable is a drag-and-drop no-code development platform that enables creators to build native iOS, Android, and mobile web applications directly from visual assets and logical block-based programming.

---

## Key Features
1. **Drag-and-Drop Designer**: Place buttons, lists, maps, cameras, and web views visually on a mobile canvas.
2. **Block-Based Logic**: Uses puzzle-piece programming blocks (similar to Scratch / Blockly) to handle state, events (`when Button1 Click do...`), and API calls without syntax errors.
3. **Figma Asset Integration**: Direct import of visual layouts created in Figma.
4. **Live Device Testing**: The **Thunkable Live** companion app on iOS and Android mirrors your application instantly over Wi-Fi as you build.
5. **Native Hardware Access**: Direct access to camera, GPS geolocation, push notifications, and Bluetooth.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "3. Video Getting started with Thunkable and its features.md" -Content $docM4_3

# 4. Hands-on Lab: Thunkable-UI from Hand Drawn Images
$docM4_4 = @"
# Hands-on Lab: Thunkable-UI from Hand Drawn Images

## Goal
Experience the transition from analog paper sketches into functional, interactive digital app components inside Thunkable.

---

## Steps

### Step 1: Paper Sketching
1. Sketch a 3-element mobile screen on paper:
   - A header image / logo.
   - Two input fields: *Username* and *Password*.
   - A large *Login* button.
2. Photograph or scan your sketch.

### Step 2: Uploading & Visual Translation
1. In Thunkable, create a new project named `SalesApp_Prototype`.
2. Add an `Image` component and set its background to your sketch.
3. Overlay responsive native Thunkable components directly over the sketch coordinates:
   - `Text Input` for Email / Username.
   - `Text Input` (Secure Text Entry = True) for Password.
   - `Button` styled with rounded corners matching your sketch.

### Step 3: Adding Logic Blocks
1. Navigate to the **Blocks** tab.
2. Add event:
   ```text
   when Login_Button Click do:
     if TextInput_Password Text = "1234" then:
       navigate to Screen_Dashboard
     else:
       set Label_Error Text to "Invalid credentials. Try again."
   ```
3. Test using the Web Preview or Thunkable Live mobile app.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "4. Ungraded Plugin Hands-on Lab Thunkable-UI from Hand Drawn Images.md" -Content $docM4_4

# 5. About the Practice Project
$docM4_5 = @"
# Reading: About the Practice Project

## Project Scenario
You have been hired as a Lead Product Designer by **Apex Retail Solutions**, a commercial logistics enterprise. Their sales team currently logs client visits and inventory orders manually on physical paper forms, leading to lost invoices and delayed shipments.

---

## Your Mission
Design an intuitive, high-speed mobile sales interface that enables agents to:
1. View daily client routes and appointments.
2. Check real-time warehouse inventory levels.
3. Submit customer orders in under 60 seconds with digital signatures.
4. Work smoothly in low-connectivity warehouse environments.

## Deliverables
- **Low-Fidelity User Flows**: Documenting happy and error states.
- **Figma Prototype Link**: Full clickable prototype with at least 4 interactive screens.
- **Design System Tokens**: Colors, typography, and button states.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "5. Ungraded Plugin About the Practice Project.md" -Content $docM4_5

# 6. Final Project Enhancement: Scenario and Self Evaluation Criteria
$docM4_6 = @"
# Rubric: Final Project Enhancement Scenario & Self Evaluation Criteria

## Evaluation Matrix (Total: 100 Points)

| Evaluation Category | Excellent (25 pts) | Proficient (20 pts) | Developing (10 pts) | Unsatisfactory (0 pts) |
|---|---|---|---|---|
| **User-Centered Design** | Clear evidence of user empathy; intuitive task flows; zero cognitive friction. | Solid navigation flow; minor friction in secondary actions. | Confusing navigation; key actions buried. | Unusable flow; lacks structure. |
| **Visual Design & System** | Strict adherence to 8px spatial grid, cohesive typography, high contrast (WCAG AA). | Good visual hierarchy; occasional inconsistent margins or font sizes. | Cluttered layout; poor contrast; misaligned components. | No visual hierarchy; illegible typography. |
| **Component Architecture** | Modular master components, variants, Auto Layout on all dynamic frames. | Components used for major items; some hardcoded static boxes. | Few reusable components; manual positioning. | No components used. |
| **Interactivity & Polish** | Fluid transitions, Smart Animate, realistic micro-interactions, working back buttons. | Basic instant transitions between main screens. | Incomplete hotspot links; dead ends. | Non-functional prototype. |

---

## Submission Checklist
- [ ] Figma prototype share link configured with "Anyone with link can view".
- [ ] All 4 core screens present and styled.
- [ ] Interactive hotspots verified for primary user flows.
- [ ] Responsive constraints configured for target mobile viewport.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "6. Ungraded Plugin Final Project Enhancement Scenario and Self Evaluation Criteria.md" -Content $docM4_6

# 7. Final Project Enhancement: Sales App using Figma
$docM4_7 = @"
# Guide: Final Project Enhancement: Sales App using Figma

## Advanced Polish Techniques
To earn top marks on your final sales application, incorporate these professional design system techniques:

### 1. Interactive Form Validation
- Create a text input component with variants:
  - `State=Default` (Border: `#CBD5E1`)
  - `State=Active/Focused` (Border: `#4F46E5`, Ring: `4px` with `20%` opacity)
  - `State=Error` (Border: `#EF4444`, Error icon + red caption text)
  - `State=Success` (Border: `#10B981`, Green checkmark)

### 2. Micro-Interactions with Smart Animate
- Toggle switches: Smoothly animate the toggle thumb from left to right on click with `Ease Out 200ms`.
- Accordion expansion: Expanding an order detail row pushes subsequent rows down naturally using Auto Layout.

### 3. Dark Mode Palette
- Design a dark-mode alternative for evening field work:
  - Background: `#0B0F19`
  - Card Surface: `#1E293B`
  - Text Primary: `#F8FAFC`
  - Text Secondary: `#94A3B8`
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "7. Ungraded Plugin Final Project Enhancement Sales App using Figma.md" -Content $docM4_7

# 8. Final Project Enhancement: Sales App using Thunkable
$docM4_8 = @"
# Guide: Final Project Enhancement: Sales App using Thunkable

## Exporting & Assembling in No-Code
Take your approved Figma prototype and bring it to life as an installable smartphone application:

### Step 1: Asset Exporting
1. In Figma, export all custom SVG icons with clean transparent backgrounds.
2. Export product photos at `@2x` WebP/PNG for crisp mobile presentation.

### Step 2: Database / Spreadsheet Connection
1. In Thunkable, add a **Data Source** connecting to a Google Sheet or Airtable base containing:
   - `Product_ID`
   - `Product_Name`
   - `Price`
   - `Stock_Quantity`
   - `Image_URL`
2. Use a `Data Viewer List` to automatically populate real catalog data onto the screen!

### Step 3: Checkout Calculation Logic
```text
when AddToCart_Button Click do:
  set app variable TotalPrice to (app variable TotalPrice + Data_Viewer_List Selected Price)
  set Label_CartTotal Text to (join "$" (app variable TotalPrice))
```
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "8. Ungraded Plugin Final Project Enhancement Sales App using Thunkable.md" -Content $docM4_8

# 9. Useful UI/UX Resources and References
$docM4_9 = @"
# Reading: Useful UI/UX Resources and References

## Essential Bookmarking Guide for UI/UX Designers

### 1. Design Systems & Guidelines
- **Material Design 3 (Google)**: [m3.material.io](https://m3.material.io)
- **Human Interface Guidelines (Apple)**: [developer.apple.com/design](https://developer.apple.com/design)
- **Atlassian Design System**: [atlassian.design](https://atlassian.design)
- **Shopify Polaris**: [polaris.shopify.com](https://polaris.shopify.com)

### 2. Design Inspiration & Patterns
- **Mobbin**: Extensive library of real iOS and Android UI screenshots.
- **PageFlows**: Recorded user flow videos of onboarding, upgrading, and settings.
- **Dribbble & Behance**: Visual trends and portfolio inspirations.

### 3. Accessibility & Usability Research
- **Nielsen Norman Group (NN/g)**: The gold standard for empirical user research articles.
- **WebAIM**: Web accessibility standards and contrast checker utilities.
- **Laws of UX**: Visual compendium of cognitive psychology heuristics.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "9. Reading Useful UI UX Resources and References.md" -Content $docM4_9

# 10. Congratulations and Next Steps
$docM4_10 = @"
# Reading: Congratulations and Next Steps!

## 🎓 Congratulations on Completing the Course!
You have successfully completed **Designing User Interfaces and Experiences (UI & UX)**!

---

## What You Have Accomplished
- Mastered user-centered design frameworks and design thinking processes.
- Applied core visual design principles: hierarchy, contrast, balance, typography, and color theory.
- Mastered modern responsive web design methodologies and progressive web app fundamentals.
- Developed professional-grade proficiency in Figma, from wireframing to Auto Layout and interactive prototypes.
- Built a functional sales application prototype using visual design and no-code tools.

## Next Steps in Your Career Journey
1. **Polish Your Portfolio**: Document your final capstone project as a case study highlighting the problem statement, user personas, wireframes, iterations, and final prototype link.
2. **Engage with the Community**: Share your Figma prototype in the Figma Community and on LinkedIn.
3. **Continue Learning**: Dive deeper into advanced topics such as Design Tokens in code, User Research Testing methodologies, and Front-End Development (HTML/CSS/React).
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "10. Reading Congratulations and Next Steps.md" -Content $docM4_10

# 11. Thanks from the Course Team
$docM4_11 = @"
# Reading: Thanks from the Course Team

## A Sincere Thank You!
On behalf of the entire Learnify AI curriculum and engineering team, thank you for dedicating your time, focus, and energy to mastering the craft of UI/UX design.

Great design is not simply about making things look beautiful—it is about empathy, clarity, accessibility, and solving meaningful problems for real human beings.

Keep creating, keep iterating, and never stop learning!

*— The Learnify AI Education & Design Team*
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "11. Reading Thanks from the Course Team.md" -Content $docM4_11

# 12. Final Graded Assessment
$docM4_12 = @"
# Module 4 Graded Final Comprehensive Assessment

**Passing Score**: 80% or higher
**Total Questions**: 10

---

### Question 1
In the User-Centered Design (UCD) process, why is early usability testing with low-fidelity prototypes recommended?
- [ ] It guarantees 100% test coverage for backend unit tests.
- [x] It uncovers navigational flaws and usability bottlenecks early when changes are fast and inexpensive to implement.
- [ ] It eliminates the need for visual designers.
- [ ] It forces the client to pay the final project invoice early.

**Correct Answer**: B
**Feedback**: Testing early with low-fidelity wireframes saves time and resources by validating user flows before committing to high-fidelity visual design and code.

---

### Question 2
Which visual design principle establishes a clear path for the user’s eye by differentiating elements through size, weight, and color?
- [ ] Symmetry
- [x] Visual Hierarchy
- [ ] Proximity
- [ ] Aspect Ratio

**Correct Answer**: B
**Feedback**: Visual hierarchy directs user attention to the most important content first through scale, color contrast, and typographic weight.

---

### Question 3
What is the primary benefit of designing mobile-first?
- [ ] It allows designers to avoid creating desktop screens altogether.
- [x] It forces focus on core content and essential user tasks under strict screen and bandwidth constraints before progressively enhancing for larger viewports.
- [ ] It guarantees that an app will be featured on the Apple App Store.
- [ ] It automatically removes the need for web hosting.

**Correct Answer**: B
**Feedback**: Mobile-first design ensures essential content is prioritized for small viewports and variable network conditions.

---

### Question 4
In Figma, what feature makes it possible to maintain reusable UI components that automatically resize when text length changes?
- [ ] Smart Guide
- [x] Auto Layout
- [ ] Group selection
- [ ] Boolean difference

**Correct Answer**: B
**Feedback**: Auto Layout dynamically adjusts container dimensions and spacing based on internal content.

---

### Question 5
What is the role of a Service Worker in enabling Progressive Web Applications?
- [ ] It writes Swift code for iOS compilation.
- [x] It runs in the background as a client network proxy to cache assets, handle offline requests, and manage push notifications.
- [ ] It replaces CSS style sheets.
- [ ] It manages database migrations on PostgreSQL.

**Correct Answer**: B
**Feedback**: Service Workers provide the network interception foundation required for offline functionality and background sync.

---

### Question 6
When designing accessible interfaces (WCAG 2.1 AA), what is the minimum required color contrast ratio for normal body text against its background?
- [ ] 2:1
- [ ] 3:1
- [x] 4.5:1
- [ ] 10:1

**Correct Answer**: C
**Feedback**: WCAG AA standards require a minimum contrast ratio of 4.5:1 for normal body text and 3:1 for large text.

---

### Question 7
Which component variant state indicates to a user that their mouse cursor is hovering over an interactive button?
- [ ] Focused state
- [ ] Disabled state
- [x] Hover state
- [ ] Error state

**Correct Answer**: C
**Feedback**: The Hover state provides vital visual feedback that an element is interactive.

---

### Question 8
In Thunkable, how is application logic programmed without writing syntax-heavy traditional code?
- [ ] By drawing sketches with colored markers.
- [x] By connecting visual block-based logic components representing events, conditions, and actions.
- [ ] By submitting voice memos to the cloud.
- [ ] By exporting static PDF pages.

**Correct Answer**: B
**Feedback**: Thunkable utilizes visual puzzle-piece logic blocks to control app behavior.

---

### Question 9
What is a Design Token?
- [ ] A cryptocurrency used to purchase stock photos.
- [x] A named variable storing an atomic design decision (such as a color, font size, border radius, or spacing value) shared between design files and production code.
- [ ] A physical token given to designers at conferences.
- [ ] A copyright watermark on an image.

**Correct Answer**: B
**Feedback**: Design tokens bridge design and development by providing a single source of truth for design attributes across platforms.

---

### Question 10
What is the ultimate goal of effective UI and UX design?
- [ ] To create the most complex animation possible regardless of user comprehension.
- [x] To deliver seamless, intuitive, and accessible experiences that solve user problems efficiently while achieving business objectives.
- [ ] To win design awards even if users cannot navigate the interface.
- [ ] To ensure every page has at least 50 buttons.

**Correct Answer**: B
**Feedback**: Great UI/UX design balances human usability, accessibility, and business value.
"@
Save-CourseDoc -Subfolder "Module 4\1. Final Project and Assessment" -FileName "12. Module 4 Final Graded Assessment.md" -Content $docM4_12

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  Course Assembly & Material Generation Completed Successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
