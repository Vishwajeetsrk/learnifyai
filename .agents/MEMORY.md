# 🧠 Learnify AI 4.6 — Master Memory & Platform Task List

> **Single Source of Truth** for platform memory, architectural rules, engineering standards, and all active/planned feature tasks.

---

## 🏛️ Platform Context & Memory Core

| Attribute | Details |
| :--- | :--- |
| **Project** | Learnify AI 4.6 / DreamSync / Career Operating System |
| **Primary Domain** | [https://www.learnifyai.in/](https://www.learnifyai.in/) |
| **Backup Domain** | [https://learnifyaitool.vercel.app/](https://learnifyaitool.vercel.app/) |
| **GitHub Repo** | `github.com/Vishwajeetsrk/learnifyai` (Branch: `main`) |
| **Admin Superuser** | `vishwajeetsrk@gmail.com` (Internal only — NEVER expose publicly) |
| **Public Support Email** | `support.learnifyai@gmail.com` (Canonical for support, contact, legal, refunds) |
| **Product Nature** | **100% Digital Products & Online Services** (Zero physical shipping or goods) |
| **Primary Gateway** | **Razorpay** (UPI, RuPay/Cards, NetBanking, EMI) · Backup: **Cashfree** |
| **Supabase Project** | `gnvsqwyexjuuwkjibxrr` (Region: `ap-south-1` Mumbai) |
| **Tech Stack** | TanStack Start (SSR) + React 19 + Supabase PostgreSQL + Tailwind CSS v4 + LightningCSS + Shadcn UI + Vercel |

---

## 🔁 The 6 Engineering Pillars (Enforced on Every Task)

### 1. Requirements Check
- Scope clarity: Feature, bug fix, or refactor.
- Downstream effects: Check auth guards, credit deductions, and database triggers.
- Device responsiveness: Mobile-first breakdown (`<768px` collapse).

### 2. Security Checklist
- RLS enabled on all Supabase tables (`has_role('admin')` for administrative actions).
- Server function inputs strictly validated via Zod schemas.
- Search path secured on all PostgreSQL functions: `SET search_path = public, pg_temp`.
- All database views use `security_invoker = true`.
- Zero public exposure of server secrets (only `VITE_` prefixed variables in browser bundle).

### 3. UI/UX Standards
- Space Grotesk (`font-display`) for headings, DM Sans (`font-sans`) for body copy.
- Lucide React icons only (no bare emojis in production controls).
- Dark-mode first styling with high contrast tokens and zero neon glow.
- Micro-interactions: `scale(1.02)` hover, active translation `translateY(-1px)`.
- Loading states: Skeletal shimmers matching target layout.
- Feedback: Toast notifications (`sonner`) on every action outcome.

### 4. Admin Panel Standards
- All admin views housed under `/_authenticated/admin*` routes with role guards.
- Search, filter, pagination, and CSV export for data tables.
- Soft-delete patterns for critical resources.
- Real-time stats card headers for every administrative view.

### 5. Indian Payment & Billing Standards
- **Currency**: Indian Rupee (`₹` / INR).
- **Primary Gateway**: **Razorpay** (Standard Checkout, UPI Intent, NetBanking, Cards, EMI).
- **Secondary Gateway**: **Cashfree** (Backup provider).
- **Tax Mode (Current)**: Unregistered Individual / Sole Proprietor (`invoice_mode = "receipt"`, no GST charged, compliant payment receipt issued).
- **Tax Mode (Post-GST Registration)**: Flip to `tax_invoice` with 18% GST (CGST 9% + SGST 9% or IGST 18%), SAC code `998431`, and GSTIN.
- **Fulfillment**: 100% Digital Delivery — instant account provisioning upon webhook / payment verification (Zero physical shipping).
- **Invoicing**: PDF receipt generation with transaction reference numbers.

### 6. Build & Compilation Standards
- TypeScript typecheck command: `node ./node_modules/typescript/bin/tsc --noEmit --skipLibCheck`.
- TanStack Start server functions: Args must be wrapped in `{ data: { ... } }`.
- Component types: Use `ReactNode` instead of `JSX.Element`.

---

## 🛠️ Critical Gotchas & Tech Stack Quirks

| Topic | Gotcha | Required Solution |
| :--- | :--- | :--- |
| **Server Functions** | TanStack Start requires an object wrapper for arguments. | Always use `createServerFn().validator((d) => ...).handler(({ data }) => ...)` |
| **TypeScript Run** | Global `pnpm` or `npx tsc` may fail or conflict in Windows PowerShell. | Use `node ./node_modules/typescript/bin/tsc --noEmit --skipLibCheck` |
| **Tailwind v4** | Uses `@tailwindcss/vite` and LightningCSS. | Do not configure `postcss.config.js`. Define custom colors in `globals.css` with `@theme` |
| **Supabase Inserts** | TypeScript strict mode flags nullable database columns. | Explicitly specify `null` for nullable fields: `col: val ?? null` |
| **PowerShell Commands** | Windows shell does not recognize Unix commands like `head` or `grep -E`. | Use PowerShell `Select-Object -First N` or `Select-String` |

---

## 📋 Comprehensive Platform Task Matrix

### Module 1: Certificate Studio & Verification Hub
- [x] **Database Schema**: `certificates`, `canva_templates`, `certificate_audit_log`, and `certificate_verifications` tables created with RLS.
- [x] **Admin Analytics**: Monthly issuance growth, verification rate, download counts, and category distribution in `certificate-admin.functions.ts`.
- [x] **Public Verification**: Fast QR code verification route with cryptographic hash matching.
- [ ] **Canva Integration**: Direct sync of Canva API webhooks to import customized template frames.
- [ ] **Automated Bulk Issuance**: Batch CSV upload with email notifications for institution cohorts.
- [ ] **Social Sharing**: One-click "Add to LinkedIn Profile" certification deep-link integration.

### Module 2: Course Studio & Interactive Lesson Player
- [x] **Course Taxonomy**: 109 interactive lessons across Python, React, Next.js, and System Design.
- [x] **Word-Style Rich Editor**: Ribbon toolbar, font selection, interactive tables, callouts, and MCQs.
- [x] **In-Browser Code Execution**: Sandpack & Monaco IDE with real-time JavaScript, Python, and TypeScript sandbox runner.
- [x] **Custom Video Player**: HLS streaming, playback speed controls, and timestamp bookmarks.
- [x] **Real Transcripts + Captions (v5.8.3)**: `lesson_transcripts` table (migration `20271004000000_lesson_transcripts.sql` — MUST run in Supabase SQL editor); unified `getLessonTranscriptFull` (YouTube captions / MP4 Whisper ≤24MB); fabricated caption cues + fake TTS translation dicts removed; lifecycle wired (`onProgress` watch-saving, resume seek, advance-only `onEnded`); YouTube `&start=`/`origin`/`enablejsapi` + JS-API time sync; consolidated control bar; dead Quality menu / `speed` state / `ai-agent` tab removed.
- [ ] **Interactive Lesson Checkpoints**: Mid-video interactive quizzes locking progress until passed.
- [ ] **Offline Reading Cache**: IndexedDB caching for downloaded text lessons.

### Module 3: Admin Content & Studio CMS
- [x] **Course & Module CRUD**: Comprehensive admin course creation, module reordering, and lesson publishing.
- [x] **Offline Draft System**: IndexedDB + LocalStorage auto-save draft manager in `admin-editor-workspace.tsx`.
- [x] **Blog Management**: Post authoring, tag assignment, featured image uploads, and SEO previews in `BlogManager.tsx`.
- [x] **Creator & Coach CMS**: Complete profile curation, service tier management, and booking settings.
- [ ] **Revision History**: Visual diffing between current live content and autosaved drafts.
- [ ] **Scheduled Publishing**: Auto-release blog posts and lessons on a future scheduled date.

### Module 4: Resilient AI Gateway & Autonomous Agents
- [x] **Multi-Tier AI Routing**: Automatic failover chain: Gemini 2.5/3.1 -> Groq LLaMA 3.3 70B -> OpenRouter.
- [x] **Fast Gateway (v5.8.3)**: 25s abort timeout per provider attempt, per-task temperature (summary 0.3 / doubt+exercise 0.5), task token budgets, in-memory LRU (100 entries / 10-min TTL) for instant repeats — in `src/lib/user-ai.ts`.
- [x] **Transcript-Aware Lesson AI (v5.8.3)**: `lessonAiHelper` injects remembered transcript into Summary/Exercise/Ask-AI; summaries cached in `lesson_transcripts.summary_md` (`cached: true` fast path); Visual Blueprint gets transcript appended; 8 playground AI modes use sharper task-aware prompts.
- [x] **AI Agent Skills Hub**: Dedicated Career Coach, Tutor, and Market Intelligence agents in `AgentHub.tsx`.
- [x] **Global Support Agent**: Context-aware floating assistant in `GlobalSupportAgent.tsx`.
- [x] **Voice Mock Interviewer**: WebSpeech API speech-to-text with real-time feedback scoring.
- [ ] **Streaming Token Metering**: Real-time per-user token consumption and credit exhaustion alerts.
- [ ] **Vector RAG Memory**: PostgreSQL `vector` chunk searching on course materials for pinpoint answers.

### Module 5: Career Studio & Growth Tools
- [x] **ATS Resume Scorer**: PDF parsing with keyword match percentage and section-by-section recommendations.
- [x] **Portfolio Builder**: Dynamic web portfolio generator with vanity URLs (`/u/{username}`).
- [x] **91 Developer Roadmaps**: Step-by-step career path guides with progress checkoffs.
- [x] **LinkedIn Post Studio**: Post idea generator with hook optimization and hashtag recommendations.
- [ ] **Direct Job Board Sync**: Aggregated job feeds from Indian tech portals matching student skills.
- [ ] **GitHub Profile Auditor**: Instant analysis of public GitHub repos and contribution graphs.

### Module 6: Payments, Billing & Indian Compliance
- [x] **Cashfree Integration**: Payment checkout session creation and status verification endpoints.
- [x] **Plan Matrix**: Starter (₹199), Pro (₹499), and Lifetime (₹1,499) tiers.
- [x] **Indian Market Compliance**: 18% GST calculation with SAC code `998431`.
- [ ] **Automated PDF Invoice**: Server-side jsPDF invoice generator with digital signature and GSTIN.
- [ ] **Webhook Signature Verification**: Strict Cashfree timestamp & signature check in webhook endpoint.
- [ ] **Subscription Renewal Dunning**: Automated email reminders 3 days before renewal.

### Module 7: Security, Infrastructure & Database Health
- [x] **Supabase Security Advisor Remediation**: 3 critical view/table vulnerabilities resolved; RLS enabled on all tables.
- [x] **PostgreSQL Function Hardening**: `search_path = public, pg_temp` enforced on all stored procedures.
- [x] **Extension Isolation**: `vector` extension moved to isolated `extensions` schema.
- [x] **Zero TypeScript Errors**: Verified clean build via `tsc --noEmit --skipLibCheck`.
- [x] **TanStack De-skew (v5.8.3)**: Exact devDep pins — `router-core 1.171.34`, `start-server-core 1.169.39` (CVE-2026-102989 patched), `start-client-core 1.170.34`, `history 1.162.4` — fixes Nitro SSR build; `error: unknown` errorComponents + `isTransitioning` removal.
- [ ] **Leaked Password Protection**: Enable HaveIBeenPwned toggle in Supabase Dashboard.
- [ ] **Rate Limiting**: Redis/Upstash rate limiter on `/api/chat` and `/api/ai/*` endpoints.

### Module 8: Marketing, Conversion & SEO
- [x] **Competitor Comparison**: Interactive pricing and feature matrix in `CompetitorComparison.tsx`.
- [x] **Meta & OG Tags**: Canonical URLs and rich social previews on all public routes.
- [x] **Social Proof & Testimonials**: Real student outcomes and verified platform stats.
- [ ] **Dynamic Sitemap Generator**: Automated `sitemap.xml` for all courses, blogs, and roadmaps.
- [ ] **Interactive ROI Calculator**: Salary hike and career switch calculator for prospective learners.

---

## 🚀 Immediate Next Action Items

1. **Run `lesson_transcripts` migration**: Execute `supabase/migrations/20271004000000_lesson_transcripts.sql` in the Supabase SQL editor (DB host unresolvable locally) — unlocks MP4 transcripts + summary cache.
2. **Verify GROQ_API_KEY in Vercel**: Required for MP4 Whisper transcription (≤24MB files). Large MP4s return `status: "too-large"` — consider CDN-chunked upload or pre-transcribed VTT later.
3. **Rotate pasted keys**: Upstash token + `tvly-dev-...` Tavily key seen in chat — rotate, set `TAVILY_API_KEY` + `CRON_SECRET` in Vercel and local `.env`.
4. **Certificate Verification & Stats Refinement**: Finalize dynamic verification counting in `certificate-admin.functions.ts`.
5. **Blog & Rich Content Polish**: Connect image uploads in `BlogManager.tsx` directly to Supabase Storage bucket `blog-assets`.
6. **Cashfree Webhook Signature**: Implement HMAC-SHA256 signature verification in `src/routes/api/cashfree-webhook.ts`.
7. **Dashboard Setting**: Enable Leaked Password Protection in Supabase dashboard.
