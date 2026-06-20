<div align="center">
  <img src="https://github.com/Vishwajeetsrk/learnifyai/blob/main/src%2Fassets%2Flearnify-logo.png" alt="Learnify AI Logo" width="120" />

  # Learnify AI
  
  **The Next-Generation AI-Powered Learning Management System (LMS)**

  *Learnify AI brings together course creation, automated AI tutoring, dynamic roadmaps, live cohorts, integrated payments (Cashfree), and a rich community experience—all in one seamless platform.*

  [Live Demo](https://learnifyaitool.vercel.app/) • [Report Bug](https://github.com/Vishwajeetsrk/learnifyai/issues)
</div>

<br/>

## ✨ Key Features

Learnify AI is built to empower both learners and creators by streamlining the entire educational lifecycle.

### 🎓 For Learners
- **Interactive Course Player:** Rich media support, markdown notes, and video playback with custom controls (YouTube IFrame API + non-YouTube fallback). Notes tab includes a **Listen** button that reads instructor notes aloud via Web Speech API (TTS). Auto-plays next unlocked lesson on video end (800ms delay).
- **Integrated In-Course Playground:** Code, Web, **Database**, **API Tester**, and **Dev Tools** playgrounds embedded directly in lesson tabs — write Python/JS/C++/Java/Rust and more with **multi-executor fallback** (Judge0 → Wandbox → Piston), build HTML/CSS/JS sandboxes with live preview, run in-browser **SQLite** queries with a visual Schema Builder, test REST APIs with custom headers, query body, and request history, or use 18+ client-side utility tools (Image Compressor, Base64, JWT decoder, Diff checker, etc.) offline. Each code playground comes with an **AI Debug Panel** (8 modes: Diagnose, Explain, Fix, Optimize, Convert, Tests, Docs, Generate) powered by OpenRouter. Adaptive default mode (e.g. Web mode for WordPress/Frontend courses, Database mode for SQL courses) and course-aware programming language selection automatically adjust based on the current course title or slug.
- **AI Tutor (Learnify AI Chat):** Context-aware conversational AI that explains concepts on the fly.
- **AI Agent:** Intelligent assistant with chat, voice I/O (Web Speech API), and tool execution — code execution (Judge0/Wandbox) and web search. Inline in course player.
- **Playground Hub:** Standalone coding IDE at `/playground` with Monaco editor, AI assistant, web preview, React sandbox, projects management, DSA challenges, interview mode, and leaderboard. See **🎮 Playground** section below.
- **Smart Quizzes & Assessments:** Automated grading and real-time feedback.
- **Wallet & Integrated Payments:** Manage credits, top-up via Cashfree (UPI/card/netbanking), withdraw via Cashfree Payouts, purchase courses, and download invoices instantly.
- **Pro Subscription Plans:** Monthly/yearly subscription plans powered by Cashfree Subscriptions API. Auto-credits AI credits every billing cycle.
- **Leaderboard & Achievements:** XP-based leaderboard at `/leaderboard` with weekly/all-time tabs, custom left-to-right podium display (Ranks 1, 2, and 3) for both Weekly and All-time periods, rank badges (Crown/Medal), level system (Bronze/Silver/Gold/Platinum/Diamond), XP progress bar, and streak tracking. Achievements page at `/achievements` with categorized badges (XP Milestones, Course Badges, Streak Mastery, Test Champion, Challenge Solver) showing earned/locked state, date earned, and progress bars.
- **Community Feed:** Share updates, post questions, attach media, create polls, post announcements, and engage with peers. Rich text editor with Bold, Italic, Underline, text color, font size, font family, heading dropdown, bullet/ordered lists, emoji picker, and text alignment. Complete with comment author avatars, live poll voting, and pinned announcements. Authors can edit/delete their own posts and comments; admins can edit/delete any post or comment.
- **Dashboard — My Learning:** Enrolled courses grid with responsive layout (1-4 columns), progress bars, test attempt stats, Continue/Playground buttons. Responsive card design with `min-w-0`, `break-words`, and `flex-wrap` for small screens.
- **Profile Cartoon Character Customization:** Custom design personalized cartoon avatars in the Profile tab in Settings, selecting from multiple cartoon styles (Casual Character, Adventurer, Robot, Pixel Art, Fun Emoji, Lorelei) using custom seeds or randomized values powered by the Dicebear API.
- **Dynamic Roadmaps:** CMS-backed public roadmap showing shipped, in-progress, and planned features.
- **Verifiable Certificates (System 2.0):** Drag-and-drop WYSIWYG certificate designer with 10 distinct theme presets (Executive Gold, Modern Corporate, University Style, Creator Academy, Nature Green, Royal Purple, Sunset Orange, Ocean Teal, Midnight Amber, Rose Gold), visual border pickers (double/solid/dashed/ornate/none), corner styles (diagonal/ribbon/none), background patterns (solid/dots/grid/stripes/gradient), color pickers, font selectors, and QR code integration. Rich text formatting bar (Bold/Italic/Underline, text presets H1-H4/Body/Small, emoji picker, 20-color preset grid, per-element font overrides from 12 fonts). **Organization Logo** element type renders the issuer's org branding on certificates. Z-index layering, duplicate, and delete controls. Live canvas preview with fixed framer-motion drag-and-drop (no CSS transform conflicts). Public verification and PDF download.

### 🎮 Playground (Coding IDE)
- **Code Editor:** Full-featured Monaco editor with syntax highlighting, autocomplete, themes, line numbers, bracket pair colorization, and font ligatures. Supports 30+ languages with real SVG logos via Simple Icons CDN. Fullscreen mode. Inline project title editing with rename support. Unsaved change indicator.
- **Code Execution:** Multi-provider fallback chain — **Judge0 CE** (primary) → **Wandbox** (fallback) → **Piston** (tertiary, self-hosted only). JS/TS run locally via Node.js VM for instant results. Output console with stdout/stderr tabs, exit code, execution time. Copy and clear buttons.
- **AI Assistant:** 8 AI tools — Diagnose, Explain, Fix Errors, Optimize, Convert Language, Generate Unit Tests, Add Docs, Generate Code. Powered by OpenRouter (4 fallback models). Results can be applied directly to editor via "Apply fix" button.
- **Web Playground:** Split-screen HTML/CSS/JS editor with live iframe preview. Mobile/desktop preview toggle. Refresh and download as HTML. Responsive layout stacks editors vertically on mobile.
- **Database Playground (SQLite):** In-browser SQLite via sql.js WASM — run queries, view results, create/alter tables visually with Schema Builder. Persists database state in localStorage. Integrated into course player as a lesson tab.
- **API Tester:** Postman-style HTTP request builder and response inspector. Includes customizable request headers, JSON request body editor, execution response duration (in ms), response body formatting, history tracking (last 30 requests), request saving/bookmarking, and automatic multi-language request snippet generation (cURL, fetch, Axios, Node.js, Python, Swift, Dart, Kotlin).
- **Dev Tools (18+ Utilities):** Client-side offline-ready developer utilities: Image Compressor, JSON ↔ CSV converter, Base64 encoder/decoder, URL encoder/decoder, JWT decoder, cryptographically secure UUID generator, SHA hash calculator, password generator, HEX/RGB/HSL color converter, RegExp tester with live highlights, Text Extractor (emails, URLs, numbers), Case Converter (camelCase, snake_case, etc.), URL Slugify, Timestamp Converter, Word/Character Counter, Lorem Ipsum generator, Text Diff comparison, and Number Base converter.
- **React Sandbox:** Sandpack-powered React playground with multi-file support, live preview, and dependency management (React 18).
- **Projects System:** Full CRUD for coding projects with Supabase persistence. Save directly from editor, reopen projects, rename inline, delete with confirmation. Templates: blank, HTML-CSS-JS, React, Node.js. File explorer with create/rename/delete.
- **Coding Challenges:** 7 pre-seeded DSA problems (Two Sum, FizzBuzz, Valid Parentheses, Binary Search, etc.). Difficulty/category filtering. Points and solved tracking.
- **Interview Mode:** Timed coding assessments with difficulty selection (easy/medium/hard) and adjustable duration. Score tracking and history.
- **Leaderboard:** Points-based ranking with easy/medium/hard breakdown. Profile avatars and user identification.
- **Responsive Design:** All playground pages adapt to mobile — editor stacks AI panel vertically, web playground stacks editors, projects show actions without hover on touch devices.

### 🚀 For Creators & Coaches
- **Creator Studio:** Upload courses, manage lessons (with video URL validation), add practical assignments/projects, and create final test MCQs that students must pass (≥70%) to claim their certificate.
- **Course Catalog:** Browse courses with responsive card grid (1-4 columns), category/level badges, price, duration, rating, and contextual CTA (Continue / View cart / Enroll free / Add to cart). Metadata row uses `flex-wrap` for small screens with price right-aligned.
- **Coaching Hub (5-tab production):** Scheduling (slot creation with Google Meet/Zoom — add/edit/delete, booking with user info collection), Messaging (real-time Supabase subscription, chat bubbles with timestamps, contact list from bookings), Client Roadmaps (milestone-based with progress bar, creator assigns to learner), Outcomes (quiz analytics, enrollment progress, cross-learner stats for creators), Cohorts (CRUD with learner management, WhatsApp share, live/scheduled/draft status).
- **Live Cohort Manager:** Easily transition async courses into live high-ticket cohorts with cohort member management. Member avatars shown in list view (up to 5 faces with overflow count). Live countdown timer with ping dot when live, pre-meeting toast notification (30 min window). Group chat (WhatsApp) and meeting (Google Meet) link display in detail view restricted to members/hosts. Auto-open WhatsApp/Meet links in new tabs on successful cohort join. Responsive card grid (1-4 columns) with truncation and flex-wrap actions.
- **Creator Payouts:** Withdraw earnings via Cashfree Payouts (UPI or bank account).
- **Automated Invoicing:** Professional PDF invoices with configurable company name, legal name, GSTIN, invoice prefix, footer text, **logo URL**, and **contact info** — downloadable from the wallet page. Team plan admins can set their own invoice branding (overrides global defaults) from **Settings → Branding**.
- **AI Thumbnail Generator:** Generate course thumbnails with auto-fallback across 6 API providers (Gemini, Stability AI, OpenRouter FLUX, Hugging Face, Pollinations, Fal AI) plus a **local SVG fallback** that always works — with word-wrapped title rendered on dark pill backgrounds (rounded semi-transparent black pills per line) for guaranteed readability, large Arial fonts at weight 900, and no clipping.
- **AI Auto-Complete Course:** One-click button in Creator Studio that automatically fills missing videos (YouTube search filtered to Education category, skipping music/meme content), pulls transcripts & AI-summarizes into lesson content, generates 8 MCQs if none exist, creates 2 assignments + 1 project, and auto-generates a course thumbnail. Course creation defaults pre-fill from your profile settings. Uses `supabaseAdmin` for reads to bypass RLS restrictions.

### 📬 Inbox & Notifications
- **Smart Notifications:** Wallet top-ups, withdrawals, new lessons, and certificate updates — each notification is clickable and links to the relevant page (courses, wallet, certificates, creator dashboard).
- **Interactive Flashcards:** Flashcards generated via AI Tools render as interactive flip cards directly in the inbox notification.
- **Reminders:** View, toggle, and delete scheduled reminders. Linked from AI Tools.

### ⚙️ Admin Features
- **Transactions Dashboard:** Filter transactions by type (All, Top-up, Subscription, Course purchase, Creator earning, Withdrawal) with date range presets. Export to Excel (multi-sheet report) or CSV (filtered or all data). Per-transaction delete with confirmation dialog. Bulk "Clear demo" button removes transactions matching demo/test/sample descriptions.
- **Coupon System:** Admin-managed discount codes (percent/flat) stored in DB — applied at checkout with real-time validation and cart UI.
- **Pricing Plans Management:** Full CRUD for subscription plans (name, price INR, interval, features, badge, color, max courses, AI credits). One-click sync to Cashfree Subscriptions API. Free/one-time plans show "No recurring billing" instead of sync button.
- **Cohort Management:** Create and manage cohorts of all types (live cohort, office hours, study group) with title, description, type, capacity, status, and date range. Table view with delete.
- **Content Manager:** Full CMS with tabs for Events, Jobs, Pricing Plans, Site Settings, Certificate Templates (with "Open Designer" link to full WYSIWYG builder), FAQs, Legal Pages (Terms, Privacy, Refund), Coupons, Community Groups, and Roadmap.
- **Legal Pages:** Fully editable Terms of Service, Privacy Policy, and Refund Policy — rendered from the database, editable via the admin Content Manager.
- **Social Media Management:** Configurable Discord, Twitter/X, GitHub, LinkedIn, and YouTube links with icons in the footer. All managed through Site Settings.
- **Site Settings:** Key-value store for contact emails, social links, auto-delete event/job rules, invoice customisation (company name, legal name, GSTIN, invoice prefix, footer, **logo URL**, **contact info**), and custom settings.
- **Admin QA — Missing Videos:** Automated detection of lessons with empty/invalid video URLs and courses with zero lessons — table view with course name, lesson index, issue description, current URL, and direct link to Studio to fix.
- **Transactions Management:** Full transaction table with date range presets (7d/30d/90d/month), type filter, status display (all statuses shown). Export to Excel (multi-sheet) or CSV. Per-transaction delete + bulk "Clear demo" button. Download all or filtered CSV.
- **Certificate Issuance (System 2.0):** Full certificate lifecycle — issue certificates with score, course, template placeholders, and auto-email to learner. Audit log with filters (date, issuer, learner), CSV export, email delivery tracking (sent/pending/failed with retry), and per-certificate resend. Polling-based retry mechanism with exponential backoff (max 5 attempts). 5-tier email cascade (Resend REST → Brevo API → Resend SMTP → Brevo SMTP → Gmail SMTP) with 15s per-provider timeout and `domainUnverified` flag to skip SMTP tier when domain verification fails.

---

## 🛠️ Technology Stack

Learnify AI is built on the modern web stack for maximum performance and developer experience.

### Frontend
- **Framework:** [React 19](https://react.dev) + [TanStack Start](https://tanstack.com/start/latest) (SSR & Routing)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Wallet & Payments:** Cashfree Payments (order create + checkout + webhook verification) with pending transaction flow

### Backend & Infrastructure
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **File Storage:** Supabase Storage (Courses, Community Uploads)
- **Deployment:** [Vercel](https://vercel.com/) (Edge Network & Serverless Functions)
- **Subscriptions:** Cashfree Subscriptions API (recurring billing, webhook at `/api/webhooks/cashfree-subscription`)
- **Payouts:** Cashfree Payouts API (withdrawals to UPI/bank)

### Integrated APIs & Tools

| Category | Providers |
|----------|-----------|
| **Payments** | Cashfree (wallet, checkout, subscriptions, payouts — no PayPal/manual) |
| **AI Chat / Text** | OpenRouter, Gemini, Groq (3-tier fallback) |
| **AI Embeddings** | Gemini Embeddings (text-embedding-004) |
| **Image Generation** | Gemini 2.0 Flash → Stability AI → OpenRouter (FLUX Pro) → Hugging Face → Pollinations AI → Fal AI → Local SVG pill-background text (7-tier fallback, always works) |
| **Video Analysis** | YouTube Data API (Education category filter, music/meme content exclusion) + Gemini summarization |
| **Email** | Resend REST API (primary, 15s timeout) → Brevo API → Resend SMTP → Brevo SMTP → Gmail SMTP (5-tier cascade, tracks `domainUnverified` to skip SMTP tier; max 5 retries with exponential backoff) |
| **Error Monitoring** | Sentry |
| **Analytics** | PostHog |
| **LLM Observability** | LangSmith |
| **AI Agent Framework** | CrewAI |
| **Code Execution** | Judge0 CE (primary) → Wandbox (fallback) → Piston (self-hosted) — 30+ languages; JS/TS via local Node.js VM |
| **Vector Database** | Supabase pgvector (material_chunks, match_material_chunks RPC) |
| **OCR / Vision** | Mistral OCR (planned), Hugging Face models (fallback) |
| **PDF Generation** | jsPDF & jsPDF-Autotable |


---

## 📂 File Structure

```text
learnifyai/
├── public/                 # Static assets (images, fonts, favicons)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── admin/
│   │   │   └── IssueCertificate.tsx  # Certificate issuance (form, preview, email log, retry)
│   │   ├── playground/             # Playground components
│   │   │   ├── CodeEditor.tsx       # Monaco editor wrapper (30+ languages, fullscreen)
│   │   │   ├── LanguageSelector.tsx # Searchable language dropdown with SVG logos
│   │   │   ├── OutputConsole.tsx    # Terminal output with stdout/stderr tabs, copy, clear
│   │   │   ├── AIPanel.tsx          # AI assistant sidebar (explain, fix, optimize, etc.)
│   │   │   ├── WebPlayground.tsx    # HTML/CSS/JS editor with live preview
│   │   │   ├── ReactPlayground.tsx  # Sandpack React sandbox
│   │   │   └── FileExplorer.tsx     # Project file tree (create/rename/delete)
│   │   ├── playground-ai-debug-panel.tsx  # AI Debug Panel (8 modes) for in-course playground
│   │   ├── playground-database.tsx        # In-browser SQLite playground with Schema Builder
│   │   ├── CertificateDesign.tsx     # Cert renderer with 10 theme presets + drag-and-drop
│   │   ├── AppShell.tsx              # App shell layout
│   │   └── ui/                      # Shadcn UI primitives
│   ├── hooks/              # Custom React hooks (use-auth, etc.)
│   ├── integrations/       # API clients (Supabase, Cashfree)
│   ├── lib/                # Utility + server functions
│   │   ├── gamification.functions.ts   # XP award, leaderboard (weekly/all-time), achievements, level/rank helpers
│   │   ├── payment.functions.ts        # Cashfree order create + verify (pending/completed)
│   │   ├── subscription.functions.ts   # Cashfree Subscriptions CRUD (sync plan, create/cancel/get subscription)
│   │   ├── executors.ts                # Multi-executor language definitions (Judge0/Wandbox/Piston configs)
│   │   ├── playground.functions.ts     # Code execution with multi-provider fallback (Judge0→Wandbox→Piston)
│   │   ├── playground-ai.functions.ts  # AI Debug Panel server function (OpenRouter + Vercel AI SDK)
│   │   ├── playground/                 # Playground server functions
│   │   │   ├── projects.ts             # Project CRUD (create, get, update, delete, duplicate, saveEditorCode)
│   │   │   ├── execution.ts            # Code execution via Wandbox API (30+ languages)
│   │   │   ├── ai.ts                   # AI code assistant (Explain, Fix, Optimize, etc.)
│   │   │   └── challenges.ts           # Challenges, submissions, leaderboard, interviews
│   │   ├── course.functions.ts         # Course purchase logic with duplicate enrollment protection
│   │   ├── course-builder.functions.ts # AI Auto-Complete course generation
│   │   ├── thumbnail.functions.ts      # AI thumbnail generation (7-tier fallback + SVG)
│   │   ├── youtube.functions.ts        # YouTube search, transcript fetch
│   │   ├── cert.functions.ts           # Certificate email (5-tier cascade), adminEmailCertificate, retryPending
│   │   ├── welcome-email.functions.ts  # Welcome email with same 5-tier cascade
│   │   └── agent.functions.ts          # AI agent with tool calling (code, web search)
│   ├── routes/             # TanStack Start route tree
│   │   ├── _authenticated/ # Protected routes
│   │   │   ├── admin.tsx             # Admin overview: transactions dashboard (type filter, date range), user management, cohorts, withdrawals, export (Excel + CSV)
│   │   │   ├── admin.content.tsx     # Content Manager: Events, Jobs, Pricing Plans, Site Settings, Cert Templates, FAQs, Pages, Coupons, Community Groups, Roadmap
│   │   │   ├── admin.missing-videos.tsx  # Admin QA: detects lessons with empty/invalid video URLs + courses with no lessons
│   │   │   ├── admin.certificates.tsx  # Drag-and-drop certificate designer (10 themes, borders, patterns, rich text formatting bar, org_logo element)
│   │   │   ├── cohorts.tsx     # Cohort list view — member avatars, group chat links, countdown timers
│   │   │   ├── cohorts.$id.tsx # Cohort detail + chat + members panel + meeting links + pre-start notification
│   │   │   ├── wallet.tsx      # Wallet top-up (Cashfree) + withdrawal (Cashfree Payouts) + invoice PDF download
│   │   │   ├── cart.tsx        # Cart with coupon support, Cashfree checkout, enrollment
│   │   │   ├── leaderboard.tsx # XP leaderboard with weekly/all-time tabs, podium, level badges, progress bar
│   │   │   ├── achievements.tsx # Achievements page with categorized badges, earned/locked state, progress bars
│   │   │   ├── settings.tsx    # Unified 5-tab settings: Profile, Billing, Notifications, Settings, Branding (org name, logo, brand color, invoice customization — admin/Team only)
│   │   │   ├── pricing.tsx     # Subscription plans page with subscribe/cancel flow
│   │   │   ├── playlist.tsx    # Course player with inline AI tutor + agent
│   │   │   ├── studio.tsx      # Creator Studio — AI Auto-Complete + course defaults from profile settings
│   │   │   ├── playground.tsx            # Playground hub landing page
│   │   │   ├── playground.editor.tsx     # Code editor with Monaco, save/load/rename/delete projects
│   │   │   ├── playground.web.tsx        # Web playground (HTML/CSS/JS live preview)
│   │   │   ├── playground.react.tsx      # React sandbox (Sandpack)
│   │   │   ├── playground.projects.tsx   # Project management (CRUD, duplicate, delete)
│   │   │   ├── playground.challenges.tsx # DSA challenges browser
│   │   │   ├── playground.interview.tsx  # Timed coding interview mode
│   │   │   └── playground.leaderboard.tsx# Points-based leaderboard
│   │   │   └── ai-agent.tsx    # AI agent with chat, voice I/O, tool execution
│   │   └── api/            # Serverless API endpoints
│   │       └── webhooks/
│   │           ├── cashfree.ts               # Cashfree payment webhook (HMAC verify, upgrade pending → completed)
│   │           └── cashfree-subscription.ts  # Cashfree subscription webhook (payment success, cancel, expire)
│   ├── routeTree.gen.ts    # Auto-generated routing tree
│   ├── router.tsx          # Router configuration
│   └── main.tsx            # Application entry point
├── supabase/
│   └── migrations/         # PostgreSQL schema definitions and RLS policies
│       ├── 20260618000001_group_link.sql             # Adds group_link column to cohorts
│       ├── 20260618000002_subscriptions.sql          # Subscription tables (user_subscriptions, subscription_events, pricing_plans columns)
│       ├── 20260619000000_playground_system.sql      # Playground tables (projects, files, runs, challenges, submissions, leaderboard, interviews)
│       ├── 20260619000001_cascade_delete.sql         # Cascade delete for certificate-related tables
│       ├── 20260620000000_leaderboard_ranks.sql      # xp_log table for weekly XP tracking
│       ├── 20260620000001_achievements_badges.sql    # Badges category & course_id columns
│       ├── 20260620000002_settings_profile_fields.sql # Profiles: username, location, work, education, website, skills
│       ├── 20260620000003_withdrawal_delete_policy.sql # RLS policy for withdrawal delete
│       ├── 20260620000004_badges_seed.sql              # 24 badges across 5 categories, streak/course/test/challenge requirement columns
│       └── 20260620000005_org_branding.sql             # Profiles: org_name, org_logo_url, brand_color, invoice customization fields
├── package.json            # Dependencies and scripts
├── scripts/                # Utility scripts
│   └── seed_courses.mjs    # Seed database with real courses
└── README.md               # You are here!
```

---

## 🧪 Playground & AI Agent

### Coding Playground (`/playground`)
A full-featured multi-module coding environment with 8 routes:

#### Code Editor (`/playground/editor`)
- **Editor:** Monaco Editor (VS Code-grade) with syntax highlighting, minimap, bracket pair colorization, font ligatures, and fullscreen mode
- **Languages:** JavaScript, TypeScript, Python, C++, C, Java, Go, Rust, Ruby, PHP, C#, SQL, Bash, and 30+ more with real SVG logos
- **Local JS/TS Execution:** JavaScript and TypeScript run locally via Node.js `vm.runInNewContext()` — no external API needed. TypeScript is auto-transpiled before execution.
- **All Languages:** Powered by Wandbox API — no self-hosting required. Supports JavaScript, TypeScript, Python, Java, C++, C, C#, Go, Rust, PHP, Ruby, Swift, Scala, Haskell, Lua, Perl, Bash, SQL, Julia, Nim, Groovy, Elixir, R, Zig, OCaml, Erlang, D, Kotlin, Dart, and more.
- **Stdin Input:** Pass input to your programs
- **Output Panel:** Real-time stdout, stderr, exit code, and execution time display with copy/clear
- **Save/Load Projects:** Save code to Supabase as a project; reopen from URL param. Inline rename with confirmation. Delete with confirm dialog. Unsaved changes indicator.
- **AI Assistant:** 7 AI tools (Explain Code, Fix Bugs, Optimize, Add Comments, Convert Language, Generate Unit Tests, Complete Code) via OpenRouter. Results applyable to editor.

#### Web Playground (`/playground/web`)
- Split-screen HTML/CSS/JS editor with live iframe preview
- Mobile/desktop preview toggle (375px mobile viewport)
- Responsive stacked layout on mobile
- Download as standalone HTML file

#### React Sandbox (`/playground/react`)
- Sandpack-powered React sandbox with file explorer and live preview
- React 18 setup with multi-file support (App.jsx, index.jsx)

#### Projects (`/playground/projects`)
- Full CRUD project management with Supabase persistence
- Cards with language icon, title, template badge, timestamp
- Open, duplicate, and delete actions (always visible on touch devices)
- Templates: blank, HTML-CSS-JS, React, Node.js

#### Challenges (`/playground/challenges`)
- 7 pre-seeded DSA problems: Two Sum, FizzBuzz, Valid Parentheses, Binary Search, Reverse Linked List, Palindrome Check, Fibonacci
- Easy/medium/hard difficulty and category (algorithms, data-structures, javascript, python) filtering
- Solved tracking with green checkmark badges

#### Interview Mode (`/playground/interview`)
- Timed coding assessments with configurable difficulty and duration (15-90 min)
- Past assessments history with score tracking
- Opens editor in new tab with interview context

#### Leaderboard (`/playground/leaderboard`)
- Points-based ranking with easy/medium/hard breakdown
- Profile avatars and user identification
- Medal indicators for top 3

#### API Tester (In-Course Playground)
- **HTTP Request Builder:** Custom HTTP headers, request body editor, method selector (GET, POST, PUT, DELETE, etc.).
- **Response Inspector:** Formatted body output, status code with status text, execution time duration, and full response headers.
- **Snippet Generator:** Generate ready-to-run client request snippets in cURL, JavaScript fetch, Axios, Node.js HTTPS, Python requests, Kotlin OkHttp, Swift URLSession, and Dart http.
- **Saved Requests & History:** Save and rename favorite requests, and look back at a history of the last 30 executed requests.

#### Dev Tools / Utilities (In-Course Playground)
- **18+ Utilities:** Includes Image Compressor, JSON ↔ CSV, Base64 tool, URL encoder, JWT decoder, UUID generator, Hash generator, Password generator, Color converter, Regex tester, Text extractor, Case converter, Slugify, Timestamp converter, Word counter, Lorem Ipsum, Text diff, and Number Base converter.
- **Privacy & Security:** Runs 100% locally in the browser with no remote servers or trackers involved.

### AI Agent
An intelligent assistant embedded in the course player with tool execution capabilities:
- **Chat Interface:** Conversational AI powered by OpenRouter (GPT-4o-mini)
- **Voice I/O:** Push-to-talk via Web Speech API (speech-to-text) + text-to-speech output
- **Tool Execution:** Agent can run code and search the web for up-to-date information
- **Multi-Turn Reasoning:** Agent can make multiple tool calls in a single conversation

### Architecture
```
Playground (8 routes)
├── /editor        Monaco Editor + Output Console + AI Panel + Save/Load/Delete
│   └── Execution: Wandbox API (30+ languages)
├── /web           HTML/CSS/JS with live iframe preview
├── /react         Sandpack React sandbox
├── /projects      CRUD project management with Supabase
├── /challenges    DSA problems with solved tracking
├── /interview     Timed coding assessments
├── /leaderboard   Points ranking with profiles
└── / (hub)        Feature cards and quick start guide

AI Assistant (Chat + Voice) ──► OpenRouter (GPT-4o-mini) ──► Tool Calls
                                   │
                      ┌──────────────┴──────────────┐
                      ▼                              ▼
                Code Execution                Web Search API
```

## 💳 Payment & Subscription Architecture

```
Wallet Top-up              ──► Cashfree Checkout ──► Webhook /api/webhooks/cashfree
Course Purchase            ──► Cashfree Checkout ──► Webhook (duplicate enrollment prevented)
Withdrawal (Creators)      ──► Cashfree Payouts API (UPI / bank)
Pro Subscription           ──► Cashfree Subscriptions API ──► Webhook /api/webhooks/cashfree-subscription
Admin Sync Plan to Cashfree ──► POST /subscription/plans
```

---

## 🚀 Getting Started

Follow these instructions to get the project up and running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account
- A [Cashfree](https://cashfree.com/) merchant account (with Subscriptions API and Payouts API enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vishwajeetsrk/learnifyai.git
   cd learnifyai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   CASHFREE_APP_ID=your_cashfree_app_id
   CASHFREE_SECRET_KEY=your_cashfree_secret_key
   VITE_APP_URL=http://localhost:3000
   VITE_BASE_URL=http://localhost:3000

   # Playground — all languages run via Wandbox API (free, no self-hosting)

   # Email — Resend API (primary) → Gmail SMTP (reliable fallback)
   RESEND_API_KEY=re_xxx
   GMAIL_EMAIL=your.email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   BREVO_SMTP_KEY=your_v3_api_key
   BREVO_SMTP_SERVER=smtp-relay.brevo.com
   BREVO_SMTP_PORT=587
   BREVO_SMTP_LOGIN=your_brevo_login
   ```

4. **Initialize the Database:**
   Run the Supabase migrations in your project's SQL editor or via the Supabase CLI to create all necessary tables (`wallet_transactions`, `posts`, `coaching_slots`, `user_subscriptions`, `subscription_events`, etc.) and Storage buckets (`community-uploads`, `course-videos`).

5. **Seed the database with sample courses:**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/seed_courses.mjs
   ```
   This populates the courses table with real course data (Full-Stack Next.js, UI/UX Design, WordPress, AI Prompt Engineering, Python Data Science, TypeScript Mastery).

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 📄 Legal & Authorship

**Developed and Maintained by:** Vishwajeet

### Legal Documents
- [Terms of Service](https://learnifyaitool.vercel.app/terms)
- [Privacy Policy](https://learnifyaitool.vercel.app/privacy)
- [Refund Policy](https://learnifyaitool.vercel.app/refund-policy)

### License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for the future of education.*
