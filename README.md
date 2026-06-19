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
- **Interactive Course Player:** Rich media support, markdown notes, and video playback with custom controls (YouTube IFrame API + non-YouTube fallback). Notes tab includes a **Listen** button that reads instructor notes aloud via Web Speech API (TTS).
- **AI Tutor (Learnify AI Chat):** Context-aware conversational AI that explains concepts on the fly.
- **AI Agent:** Intelligent assistant with chat, voice I/O (Web Speech API), and tool execution — code execution (Piston / local VM) and web search. Inline in course player.
- **Multi-Language Playground:** Write, compile, and run code in 40+ languages (C, C++, Java, Python, JavaScript, TypeScript, Go, Rust, and more) using Monaco Editor. JS/TS runs locally via Node.js VM; other languages use Piston execution engine.
- **Smart Quizzes & Assessments:** Automated grading and real-time feedback.
- **Wallet & Integrated Payments:** Manage credits, top-up via Cashfree (UPI/card/netbanking), withdraw via Cashfree Payouts, purchase courses, and download invoices instantly.
- **Pro Subscription Plans:** Monthly/yearly subscription plans powered by Cashfree Subscriptions API. Auto-credits AI credits every billing cycle.
- **Community Feed:** Share updates, post questions, attach media, create polls, post announcements, and engage with peers. Rich text editor with Bold, Italic, Underline, text color, font size, font family, heading dropdown, bullet/ordered lists, emoji picker, and text alignment. Complete with comment author avatars, live poll voting, and pinned announcements.
- **Dashboard — My Learning:** Enrolled courses grid with responsive layout (1-4 columns), progress bars, test attempt stats, Continue/Playground buttons. Responsive card design with `min-w-0`, `break-words`, and `flex-wrap` for small screens.
- **Dynamic Roadmaps:** CMS-backed public roadmap showing shipped, in-progress, and planned features.
- **Verifiable Certificates (System 2.0):** Drag-and-drop WYSIWYG certificate designer with 10 distinct theme presets (Executive Gold, Modern Corporate, University Style, Creator Academy, Nature Green, Royal Purple, Sunset Orange, Ocean Teal, Midnight Amber, Rose Gold), visual border pickers (double/solid/dashed/ornate/none), corner styles (diagonal/ribbon/none), background patterns (solid/dots/grid/stripes/gradient), color pickers, font selectors, and QR code integration. Live canvas preview with framer-motion drag-and-drop. Public verification and PDF download.

### 🚀 For Creators & Coaches
- **Creator Studio:** Upload courses, manage lessons (with video URL validation), add practical assignments/projects, and create final test MCQs that students must pass (≥70%) to claim their certificate.
- **Course Catalog:** Browse courses with responsive card grid (1-4 columns), category/level badges, price, duration, rating, and contextual CTA (Continue / View cart / Enroll free / Add to cart). Metadata row uses `flex-wrap` for small screens with price right-aligned.
- **Coaching Hub (5-tab production):** Scheduling (slot creation with Google Meet/Zoom — add/edit/delete, booking with user info collection), Messaging (real-time Supabase subscription, chat bubbles with timestamps, contact list from bookings), Client Roadmaps (milestone-based with progress bar, creator assigns to learner), Outcomes (quiz analytics, enrollment progress, cross-learner stats for creators), Cohorts (CRUD with learner management, WhatsApp share, live/scheduled/draft status).
- **Live Cohort Manager:** Easily transition async courses into live high-ticket cohorts with cohort member management. Member avatars shown in list view (up to 5 faces with overflow count). Live countdown timer with ping dot when live, pre-meeting toast notification (30 min window). Group chat (WhatsApp) and meeting (Google Meet) link display in detail view restricted to members/hosts. Auto-open WhatsApp/Meet links in new tabs on successful cohort join. Responsive card grid (1-4 columns) with truncation and flex-wrap actions.
- **Creator Payouts:** Withdraw earnings via Cashfree Payouts (UPI or bank account).
- **Automated Invoicing:** Professional PDF invoices with configurable company name, legal name, GSTIN, invoice prefix, footer text, **logo URL**, and **contact info** — downloadable from the wallet page.
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
| **Code Execution** | Piston (self-hosted) — 40+ languages including C, C++, Java, Python, PHP, SQLite. JS/TS runs locally via Node.js `vm` |
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
│   │   ├── CertificateDesign.tsx     # Cert renderer with 10 theme presets + drag-and-drop
│   │   ├── AppShell.tsx              # App shell layout
│   │   └── ui/                      # Shadcn UI primitives
│   ├── hooks/              # Custom React hooks (use-auth, etc.)
│   ├── integrations/       # API clients (Supabase, Cashfree)
│   ├── lib/                # Utility + server functions
│   │   ├── payment.functions.ts        # Cashfree order create + verify (pending/completed)
│   │   ├── subscription.functions.ts   # Cashfree Subscriptions CRUD (sync plan, create/cancel/get subscription)
│   │   ├── playground.functions.ts     # Code execution via Piston API (40+ languages)
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
│   │   │   ├── admin.certificates.tsx  # Drag-and-drop certificate designer (10 themes, borders, patterns)
│   │   │   ├── cohorts.tsx     # Cohort list view — member avatars, group chat links, countdown timers
│   │   │   ├── cohorts.$id.tsx # Cohort detail + chat + members panel + meeting links + pre-start notification
│   │   │   ├── wallet.tsx      # Wallet top-up (Cashfree) + withdrawal (Cashfree Payouts) + invoice PDF download
│   │   │   ├── cart.tsx        # Cart with coupon support, Cashfree checkout, enrollment
│   │   │   ├── pricing.tsx     # Subscription plans page with subscribe/cancel flow
│   │   │   ├── playlist.tsx    # Course player with inline AI tutor + agent
│   │   │   ├── studio.tsx      # Creator Studio — AI Auto-Complete + course defaults from profile settings
│   │   │   ├── playground.tsx  # Multi-language code playground (Monaco + Piston)
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
│       └── 20260619000001_cascade_delete.sql         # Cascade delete for certificate-related tables
├── package.json            # Dependencies and scripts
├── scripts/                # Utility scripts
│   └── seed_courses.mjs    # Seed database with real courses
└── README.md               # You are here!
```

---

## 🧪 Playground & AI Agent

### Multi-Language Playground (`/playground`)
A full-featured code execution environment supporting 40+ languages:
- **Editor:** Monaco Editor (VS Code-grade) with syntax highlighting, minimap, and multi-tab editing
- **Languages:** JavaScript, TypeScript, Python, C++, C, Java, Go, Rust, Ruby, PHP, C#, SQL, Bash, and 30+ more
- **Local JS/TS Execution:** JavaScript and TypeScript run locally via Node.js `vm.runInNewContext()` — no external API needed. TypeScript is auto-transpiled before execution.
- **Stdin Input:** Pass input to your programs
- **Output Panel:** Real-time stdout, stderr, and exit code display
- **Run on Demand:** Execute code with a single click

### AI Agent
An intelligent assistant embedded in the course player with tool execution capabilities:
- **Chat Interface:** Conversational AI powered by OpenRouter (GPT-4o-mini)
- **Voice I/O:** Push-to-talk via Web Speech API (speech-to-text) + text-to-speech output
- **Tool Execution:** Agent can run code and search the web for up-to-date information
- **Multi-Turn Reasoning:** Agent can make multiple tool calls in a single conversation

### Architecture
```
Playground (Monaco Editor) ──► Node.js VM (JS/TS) or Piston API (other langs) ──► Output
AI Agent (Chat + Voice) ──► OpenRouter (GPT-4o-mini) ──► Tool Calls
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

   # Email — Resend API (primary), uncomment Gmail for reliable fallback
   RESEND_API_KEY=re_xxx
   # BREVO_API_KEY=your_v3_api_key
   # GMAIL_EMAIL=your.email@gmail.com
   # GMAIL_APP_PASSWORD=your-16-char-app-password
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
