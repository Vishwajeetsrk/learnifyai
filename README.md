# Learnify AI 🎓✨

Learnify AI is an AI-powered personalized learning and course generation platform built on top of React 19, TanStack Start, and Supabase. It enables creators to build rich courses, enrich lessons using AI, and manage student learning experience in a unified workspace.

---

## 🚀 Key Features

- **AI Course Builder**: Automatically generate and enrich courses, including extracting, summarizing, and translating YouTube transcripts using Google Gemini API.
- **Creator Studio**: Direct management of courses, view statistics, subscriber tracking, and student submissions.
- **Real-Time Enrichment Monitor**: Check progress of YouTube video processing in real time via Supabase Realtime subscriptions.
- **Creator Wallet**: Direct credit/debit transaction log, automatic earning shares, and manual withdrawal requests (UPI, bank, PayPal).
- **Certificate Issuance**: Dynamic PDF certificate generator using `jspdf` and `html2canvas-pro` with unique verification routes (`/certificates/$code`).
- **Interactive AI Toolkit Showcase**: Live playground simulating 6 utilities (Quiz Generator, Doubt Solver, Career Path roadmapping, Spaced Reminders, Synthesizer, and Auto Flashcards) available directly on both the Landing Page and Features Page.
- **Interactive Coach & Creator Suites**: Responsive sandboxes for booking slot schedules, generating AI courses from prompts, withdrawing mock earnings to wallet, and running AI outcomes/skill audits.
- **Custom Video Player**: Built-in React-based player overlay on YouTube streams with a natively integrated Subscribe button, progress tracking, volume, CC, and timeline controls.
- **Smart YouTube Engine**: Fetches actual exact duration timeline (calculated in minutes) via secondary YouTube Data API requests, guarantees NO music/songs by restricting to Education categories, and prioritizes bilingual Hindi/English courses.
- **Resilient Fallback Pages**: Implemented database query try-catch handlers for the FAQ and Events routes. If database connections fail or tables are empty, pages seamlessly fall back to beautiful, pre-populated lists rather than throwing an error page.
- **Appearance & Color Theme Engine**: Restructured the appearance selector to support 3 mode toggles (Light, Dark, System), 3 motion preferences (Match System, Full, Reduced), and 6 custom CSS theme colors (Indigo, Ocean, Sunset, Forest, Rose, and Noir) with custom variable maps.
- **Expanded Admin Capabilities**: Admin panel grants full control (add, edit, update, reset password, ban, delete) to both `admin` and `super_admin` roles gracefully integrated via `assertAdmin`, alongside AI demand forecasting.
- **Optimized Build Deployments**: Improved Vite and Rollup configurations to suppress non-critical module-level directives (like `use client` spam) and successfully externalize package dependencies for clean cloud deployments on Vercel/Cloudflare Pages.
- **Graceful Profile Edge Case Handling**: Safe query lookups via `.maybeSingle()` across Avatar menus and Dashboards to natively handle newly-signed up profiles without triggering `406 Not Acceptable` payload warnings.
- **Gamified Progress System**: Highly addictive learning loop incorporating XP points, daily and all-time Streaks (🔥), Badges, and an interactive Leaderboard to rank top learners based on module completions.
- **Live Cohort Manager**: Integrated directly into Creator and Coach suites, enabling educators to seamlessly run and manage high-ticket live cohorts with RSVP tracking alongside their async courses.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19, TypeScript, Vite
- **Routing & SSR**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (file-based routing with server-side rendering support)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL database, authentication, real-time channels)
- **Styling & UI**: Tailwind CSS, Framer Motion (animations), Radix UI primitives, Lucide React (icons)
- **State Management**: TanStack Query (React Query)
- **AI Integrations**: Gemini API (course outline, quiz, summary, and lesson generation)
- **Media & Caching**: Upstash Redis (caching), Cloudinary (asset storage), YouTube Data API (enrichment)
- **Testing**: Vitest for unit & integration tests

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project with database credentials
- External API keys (Gemini API, YouTube API, Cloudinary, Upstash Redis, Resend)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Vishwajeetsrk/learnifyai.git
   cd learnifyai
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables by creating `.env.local` or editing `.env`:

   ```env
   # Database & Supabase
   DATABASE_URL="your-postgresql-url"
   SUPABASE_URL="your-supabase-url"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-publishable-key"

   # AI & APIs
   GEMINI_API_KEY="your-gemini-key"
   YOUTUBE_API_KEY="your-youtube-key"
   UPSTASH_REDIS_REST_URL="your-redis-url"
   UPSTASH_REDIS_REST_TOKEN="your-redis-token"
   ```

### Development

To start the development server locally:

```bash
npm run dev
```

To run lint checks:

```bash
npm run lint
```

To run code formatting with Prettier:

```bash
npm run format
```

### Testing

Verify that all unit and integration tests pass by running:

```bash
npx vitest run
```

---

## 🚀 Deployment

The project is configured for Cloudflare deployment using [Nitro](https://nitro.unjs.io).

1. Build the production application:

   ```bash
   npm run build
   ```

   This generates a static build under `.output/public` and a server runtime under `.output/server`, as well as configuration for Cloudflare (`wrangler.json`).

2. Deploy using Wrangler:
   ```bash
   npx wrangler deploy
   ```
   _(Ensure you run `npx wrangler login` first to authenticate with your Cloudflare account)._
