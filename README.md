<div align="center">

<img src="src/assets/learnify-logo.png" alt="Learnify AI Logo" width="160" />

# Learnify AI

**The AI-Native Learning Operating System**

[![CI](https://github.com/Vishwajeetsrk/learnifyai/actions/workflows/ci.yml/badge.svg)](https://github.com/Vishwajeetsrk/learnifyai/actions/workflows/ci.yml)
[![Playwright](https://github.com/Vishwajeetsrk/learnifyai/actions/workflows/playwright.yml/badge.svg)](https://github.com/Vishwajeetsrk/learnifyai/actions/workflows/playwright.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Live Demo](https://learnifyaitool.vercel.app/) | [Report Bug](https://github.com/Vishwajeetsrk/learnifyai/issues) | [Request Feature](https://github.com/Vishwajeetsrk/learnifyai/issues/new?template=feature_request.md)

</div>

---

## What is Learnify AI?

Learnify AI is a full-stack, AI-powered learning platform that combines intelligent tutoring, creator tools, gamification, and career growth into one premium experience.

### For Learners

- **AI Tutor** — Personalized 1-on-1 tutoring with multi-model support (Gemini, Groq, OpenRouter)
- **Interactive Course Player** — Video lessons, markdown notes, AI summaries, and practice exercises
- **Code Playground** — Monaco editor with 25+ languages, AI debug panel, web preview, SQLite, and API tester
- **Smart Notes** — Auto-generated flashcards, summaries, and quizzes from any lesson
- **Gamification** — XP, streaks, badges, leaderboards, and achievements
- **Wallet** — AI credits, course purchases, and withdrawals via Cashfree

### Supported Playground Languages

Learnify AI's playground features multi-language compilation powered by official APIs, enabling instant code runs for these runtimes:

| Language | Official Badge | Compiler / Runtime |
| :--- | :--- | :--- |
| **JavaScript** | ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript) | Node.js 20.17 |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript) | TypeScript 5.6 |
| **Python** | ![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python) | CPython 3.12.7 (Stable) |
| **Java** | ![Java](https://img.shields.io/badge/Java-22-orange?style=flat-square&logo=openjdk) | OpenJDK JDK 22 |
| **C++** | ![C++](https://img.shields.io/badge/C%2B%2B-17/20-blue?style=flat-square&logo=c%2B%2B) | GCC 14 |
| **C** | ![C](https://img.shields.io/badge/C-ISO-blue?style=flat-square&logo=c) | GCC 14 C |
| **C#** | ![C#](https://img.shields.io/badge/C%23-Mono-purple?style=flat-square&logo=c-sharp) | Mono 6.12 |
| **Go** | ![Go](https://img.shields.io/badge/Go-1.23-blue?style=flat-square&logo=go) | Go 1.23.2 |
| **Rust** | ![Rust](https://img.shields.io/badge/Rust-1.82-orange?style=flat-square&logo=rust) | Rust 1.82.0 |
| **PHP** | ![PHP](https://img.shields.io/badge/PHP-8.3-purple?style=flat-square&logo=php) | PHP 8.3.12 |
| **Ruby** | ![Ruby](https://img.shields.io/badge/Ruby-3.x-red?style=flat-square&logo=ruby) | Ruby 4.0.2 |
| **Swift** | ![Swift](https://img.shields.io/badge/Swift-6.0-orange?style=flat-square&logo=swift) | Swift 6.0.1 |
| **Kotlin** | ![Kotlin](https://img.shields.io/badge/Kotlin-2.0-purple?style=flat-square&logo=kotlin) | Kotlin 2.0.21 |
| **Bash** | ![Bash](https://img.shields.io/badge/Bash-Shell-green?style=flat-square&logo=gnu-bash) | Bash 5.2 |
| **SQL** | ![SQL](https://img.shields.io/badge/SQL-SQLite-blue?style=flat-square&logo=sqlite) | SQLite 3.46.1 |
| **Dart** | ![Dart](https://img.shields.io/badge/Dart-3.5-blue?style=flat-square&logo=dart) | Dart 3.5.3 |
| **Zig** | ![Zig](https://img.shields.io/badge/Zig-0.13-orange?style=flat-square&logo=zig) | Zig 0.13.0 |
| **Julia** | ![Julia](https://img.shields.io/badge/Julia-1.10-purple?style=flat-square&logo=julia) | Julia 1.10.5 |
| **Lua** | ![Lua](https://img.shields.io/badge/Lua-5.4-blue?style=flat-square&logo=lua) | Lua 5.4.7 |
| **Haskell** | ![Haskell](https://img.shields.io/badge/Haskell-9.10-purple?style=flat-square&logo=haskell) | GHC 9.10.1 |
| **Elixir** | ![Elixir](https://img.shields.io/badge/Elixir-1.17-purple?style=flat-square&logo=elixir) | Elixir 1.17.3 |
| **Nim** | ![Nim](https://img.shields.io/badge/Nim-2.2-yellow?style=flat-square&logo=nim) | Nim 2.2.10 |
| **R** | ![R](https://img.shields.io/badge/R-4.4-blue?style=flat-square&logo=r) | R 4.4.1 |

### For Creators

- **Creator Studio** — Build courses, add lessons, manage quizzes and assignments
- **AI Course Builder** — Auto-generate course outlines, lessons, and thumbnails
- **Coaching Hub** — Book 1-on-1 sessions, schedule slots, and chat
- **Cohorts** — Live group learning with community spaces
- **Earnings Dashboard** — Revenue tracking, payouts, and invoices

### Platform

- **Community Feed** — Social learning with posts, comments, and likes
- **Inbox** — Direct messaging between coaches and students
- **Admin Panel** — Dashboard, wallet verification, certificates, content management
- **Legal Pages** — Privacy Policy, Terms of Service, Refund Policy

---

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Framework  | React 19 + TanStack Start (SSR)                     |
| Routing    | TanStack Router (file-based)                        |
| Styling    | Tailwind CSS v4 + Shadcn UI                         |
| State      | TanStack Query + React Context                      |
| Database   | Supabase (PostgreSQL + Auth + Storage)              |
| AI         | OpenRouter, Gemini, Groq (multi-provider fallback)  |
| Payments   | Cashfree (Subscriptions + Wallet + Payouts)         |
| Embeddings | Gemini text-embedding-004 + pgvector                |
| Email      | Cloudflare Email Service                            |
| Code Exec  | Judge0 / Wandbox / Piston (multi-executor fallback) |
| Testing    | Playwright (E2E)                                    |
| Deployment | Vercel                                              |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Supabase project (free tier works)
- Cashfree merchant account (for payments)
- At least one AI provider key (OpenRouter, Gemini, or Groq)

### Setup

```bash
# Clone
git clone https://github.com/Vishwajeetsrk/learnifyai.git
cd learnifyai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase URL, keys, and API keys

# Run database migrations
npx supabase db push

# Seed sample data (optional)
npx supabase db seed

# Start dev server
npm run dev
```

### Environment Variables

| Variable                        | Required | Description                             |
| ------------------------------- | -------- | --------------------------------------- |
| `VITE_SUPABASE_URL`             | Yes      | Supabase project URL                    |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes      | Supabase anon/public key                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Supabase service role key (server-side) |
| `OPENROUTER_API_KEY`            | No       | OpenRouter API key for AI features      |
| `GEMINI_API_KEY`                | No       | Google Gemini API key                   |
| `GROQ_API_KEY`                  | No       | Groq API key                            |
| `CASHFREE_APP_ID`               | No       | Cashfree payment gateway                |
| `CASHFREE_SECRET_KEY`           | No       | Cashfree secret key                     |

---

## Available Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `npm run dev`          | Start Vite dev server    |
| `npm run build`        | Production build         |
| `npm run preview`      | Preview production build |
| `npm run lint`         | Run ESLint               |
| `npm run format`       | Run Prettier             |
| `npx playwright test`  | Run E2E tests            |
| `npx supabase db push` | Run database migrations  |
| `npx supabase db seed` | Seed sample data         |

---

## Project Structure

```
src/
├── routes/                  # File-based routing (TanStack Router)
│   ├── __root.tsx          # Root layout with providers
│   ├── index.tsx           # Landing page
│   ├── login.tsx           # Authentication
│   ├── signup.tsx          # Registration
│   ├── pricing.tsx         # Pricing plans
│   ├── _authenticated/     # Protected routes
│   │   ├── dashboard.tsx   # Learner dashboard
│   │   ├── courses.$slug.tsx  # Course player
│   │   ├── ai.tsx          # AI tutor chat
│   │   ├── playground.*.tsx   # Code playground
│   │   ├── studio.tsx      # Creator studio
│   │   ├── wallet.tsx      # Wallet & payments
│   │   └── admin.tsx       # Admin panel
│   └── api/                # Server-side API routes
├── components/             # Reusable UI components
│   ├── ui/                # Shadcn UI primitives
│   ├── SiteHeader.tsx     # Navigation header
│   ├── SiteFooter.tsx     # Footer
│   └── ...                # Feature-specific components
├── hooks/                  # Custom React hooks
│   ├── use-auth.tsx       # Authentication context
│   ├── use-theme.tsx      # Theme management
│   └── ...
├── lib/                    # Server functions & utilities
│   ├── agent.functions.ts # Coding mentor agent
│   ├── support-agent.functions.ts  # Support agent
│   ├── user-ai.ts         # Multi-provider AI fallback
│   ├── ai-tools.functions.ts  # AI quiz, flashcards, etc.
│   └── ...
├── integrations/           # External service configs
│   └── supabase/          # Supabase client & types
└── assets/                 # Static assets (logos, images)
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│  React 19 + TanStack Start + Tailwind CSS v4    │
├─────────────────────────────────────────────────┤
│                    Backend                       │
│  TanStack Server Functions + Vercel Edge        │
├─────────────────────────────────────────────────┤
│                    Database                      │
│  Supabase (PostgreSQL + Auth + Storage)         │
├─────────────────────────────────────────────────┤
│                    AI Layer                      │
│  OpenRouter ←→ Gemini ←→ Groq (fallback chain)  │
├─────────────────────────────────────────────────┤
│                   Payments                       │
│  Cashfree (Subscriptions + Wallet + Payouts)    │
├─────────────────────────────────────────────────┤
│                  Deployment                      │
│  Vercel (Edge Network + Serverless Functions)   │
└─────────────────────────────────────────────────┘
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md).

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with care by [Learnify AI](https://learnifyaitool.vercel.app/)**

</div>
