<div align="center">
  <img src="https://via.placeholder.com/150/000000/FFFFFF?text=Learnify+AI" alt="Learnify AI Logo" width="150" height="150" />
  <h1>Learnify AI 🎓✨</h1>
  <p><strong>The Intelligent Learning OS for Learners, Creators, and Coaches.</strong></p>
  <p>Learnify AI is an AI-powered personalized learning and course generation platform built on top of React 19, TanStack Start, and Supabase. It enables creators to build rich courses, enrich lessons using AI, and manage student learning experience in a unified workspace.</p>

  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-file-structure">File Structure</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-apis-used">APIs</a> •
    <a href="#-how-to-run">How to Run</a> •
    <a href="#-version-history">Versions</a>
  </p>
</div>

---

## 🚀 Key Features

### Dawn V2: Platform Maturity & Monetization
- **Admin Command Center**: Real-time admin dashboard with AI cost tracking, Top-up approvals, missing video alerts, revenue tracking, and complete user role management (Super Admin, Admin, Creator, Student).
- **RazorPay Integration**: Native support for RazorPay checkout, enabling frictionless purchases for paid courses and cohort access in INR. Wallet top-ups, transaction logging, and revenue dashboards.
- **YouTube-Style Creator Profiles**: Public creator and coach profiles redesigned to feature custom wide banners, overlapping avatar displays, biographies, and expandable social media link badges.
- **Interactive Instructor Subscriptions**: Seamless student-creator connection with real-time "Subscribe" toggles, unified subscriber counts, and interactive follow actions.
- **Playwright E2E Tests**: Comprehensive browser testing workflow ensuring high reliability for enrollments and video progression tracking.
- **Automated Cloudflare Deployments**: Configured Vite with `cloudflare-pages` preset for blazing-fast Edge network delivery.

### Dawn V1: Core AI & Learning Engine
- **AI Course Builder**: Automatically generate and enrich courses, including extracting, summarizing, and translating YouTube transcripts using Google Gemini API.
- **Creator Studio**: Direct management of courses, view statistics, subscriber tracking, and student submissions.
- **Real-Time Enrichment Monitor**: Check progress of YouTube video processing in real time via Supabase Realtime subscriptions.
- **Certificate Issuance**: Dynamic PDF certificate generator using `jspdf` and `html2canvas-pro` with unique verification routes (`/certificates/$code`).
- **Interactive AI Toolkit Showcase**: Live playground simulating 6 utilities (Quiz Generator, Doubt Solver, Career Path roadmapping, Spaced Reminders, Synthesizer, and Auto Flashcards).
- **AI Tutor**: Dedicated conversational AI tutor available per user, integrating seamlessly with Gemini, Groq, and OpenRouter, complete with custom credit systems and image attachment support.
- **Custom Video Player**: Built-in React-based player overlay on YouTube streams with native progress tracking, volume, CC, and timeline controls. Accurately maps real duration formats (`MM:SS`).
- **Appearance & Color Theme Engine**: Restructured the appearance selector to support 3 mode toggles (Light, Dark, System) and 6 custom CSS theme colors (Indigo, Ocean, Sunset, Forest, Rose, and Noir).
- **Gamified Progress System**: Highly addictive learning loop incorporating XP points, daily and all-time Streaks (🔥), Badges, and an interactive Leaderboard.
- **Live Cohort Manager**: Enabling educators to seamlessly run and manage high-ticket live cohorts with RSVP tracking alongside their async courses.
- **Profile Management**: Full avatar management with Supabase Storage — upload, preview via signed URLs, and gracefully handle external Google OAuth avatar URLs.

---

## 📂 File Structure

```text
learnifyai/
├── public/                 # Static public assets (images, icons, etc.)
├── src/                    # Main application source code
│   ├── components/         # Reusable React components (UI, layout, shared widgets)
│   ├── hooks/              # Custom React hooks (auth, theme, etc.)
│   ├── integrations/       # External service adapters (Supabase clients, Analytics)
│   ├── lib/                # Utility functions, API wrappers, schemas, server functions
│   ├── routes/             # TanStack Start file-based routing architecture
│   │   ├── _authenticated/ # Protected routes (Dashboard, Studio, Admin, Courses)
│   │   └── api/            # Server API endpoints
│   ├── styles/             # Global CSS, Tailwind configurations, design tokens
│   ├── routeTree.gen.ts    # Auto-generated routing tree by TanStack
│   └── start.ts            # Application entry point and middleware configuration
├── supabase/
│   ├── migrations/         # PostgreSQL schema definitions and database migrations
│   └── seed.sql            # Initial database seed records
├── tests/                  # E2E test suites (Playwright)
├── vite.config.ts          # Vite build and deployment configurations
├── tailwind.config.ts      # Tailwind styling maps
└── package.json            # Node.js dependencies and run scripts
```

---

## 🛠️ Technology Stack

- **Core Framework**: React 19, TypeScript, Vite
- **Routing & SSR**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (file-based routing with server-side rendering support)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL database, authentication, real-time channels, edge functions)
- **Styling & UI**: Tailwind CSS, Framer Motion (animations), Radix UI primitives, Lucide React (icons)
- **State Management**: TanStack Query (React Query)
- **Media & Storage**: Cloudinary (asset storage), Supabase Storage
- **Testing**: Vitest (Unit), Playwright (E2E)

---

## 🔌 APIs Used

Learnify AI leverages several powerful external APIs to deliver an intelligent experience:

1. **Google Gemini API**: Powers the AI Course Builder, generating lesson summaries, parsing transcripts, answering queries, and powering the AI Tutor.
2. **YouTube Data API v3**: Fetches exact video durations, restricts content to verified educational channels, and streams video payloads.
3. **RazorPay API**: Facilitates INR checkout operations, wallet top-ups, and creator earnings distribution.
4. **Resend API**: Handles transactional emails, user verifications, and digital certificate deliveries.
5. **Upstash Redis REST API**: Handles fast, ephemeral caching for the AI endpoints to prevent aggressive rate limiting.
6. **Noembed API**: Fetches channel URL metadata to automatically build instructor profiles based on YouTube links.

---

## 📦 How to Run

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project with database credentials
- External API keys (Gemini API, YouTube API, RazorPay, Resend)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vishwajeetsrk/learnifyai.git
   cd learnifyai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables:**
   Create a `.env` or `.env.local` file in the root directory:
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
   RAZORPAY_KEY_ID="your-razorpay-key"
   RAZORPAY_KEY_SECRET="your-razorpay-secret"
   ```

### Development

To start the local development server:
```bash
npm run dev
```

To run linting and formatting:
```bash
npm run lint
npm run format
```

To execute test suites:
```bash
npx playwright test
npx vitest run
```

---

## 🚀 Deployment

The project is configured for Vercel deployment using [Nitro](https://nitro.unjs.io).

1. **Deploy to Vercel:**
   You can easily deploy to Vercel by pushing your repository to GitHub and importing it into Vercel. Vercel will automatically detect the configuration and build it.
   
   Alternatively, deploy using the Vercel CLI:
   ```bash
   npx vercel
   ```

---

## 📅 Version History

- **Dawn V1**: The initial core engine featuring the AI course builder, student dashboard, Supabase real-time tracking, certificates, and the foundation of the custom video player.
- **Dawn V2** (Current): The monetization and scale update, introducing RazorPay integrations, the comprehensive Admin Command Center, YouTube-style Creator channel views, subscriptions, Playwright testing, and Edge-ready Cloudflare deployments.

---

## ⚖️ Legal & Copyright

**Created & Maintained by Vishwajeet SRK**

By using Learnify AI, you agree to our standard terms of service.
- **License**: MIT License
- **Privacy Policy**: Data is handled securely via Supabase and external API partners adhering to local privacy laws.
- **Terms of Service**: Content generated via AI APIs may be subject to the terms dictated by Google Gemini and YouTube Data API frameworks.

<div align="center">
  <p>© 2026 Vishwajeet SRK. All rights reserved.</p>
</div>
