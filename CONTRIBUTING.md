# Contributing to Learnify AI

Thanks for your interest in contributing to **Learnify AI** — the AI-Native Learning Operating System! Here's how to get started.

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `pnpm` (`v10.x` or `v11.x`)
- **Git**: Installed and configured

### 2. Quick Start

```bash
# Clone the repository
git clone https://github.com/Vishwajeetsrk/learnifyai.git
cd learnifyai

# Install dependencies using pnpm
pnpm install

# Copy environment template
cp .env.example .env.local

# Start local development server
pnpm dev
```

The application will launch at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React 19 + TanStack Start (SSR) + Vite |
| **Routing** | TanStack Router (File-based routing under `src/routes/`) |
| **State & Data Fetching** | TanStack Query + TanStack Start Server Functions (`createServerFn`) |
| **Styling & UI** | Tailwind CSS v4 (LightningCSS) + Shadcn UI + Framer Motion |
| **Database & Auth** | Supabase PostgreSQL + Row Level Security (RLS) + Storage |
| **AI Multi-Model Engine** | Gemini (Google GenAI) + Groq + OpenRouter |
| **Payments & Invoicing** | Cashfree Gateway (Subscriptions + Wallet + GST 18% Invoices) |
| **Code Execution** | Monaco Editor + CodeSandbox Sandpack |
| **Testing** | Playwright (E2E) + TypeScript Strict Checks |

---

## 📂 Project Structure

```
src/
  routes/          # TanStack Router file-based routes
    _authenticated/ # Protected routes requiring Supabase auth session
    api/           # Server-side API endpoints & webhooks (Cashfree, PDF)
  components/      # Reusable UI components (Shadcn UI, Course Builder, Player)
    course/        # Student course player & BlockRenderer components
    course-builder/ # Notion-style no-code block editor & curriculum sidebar
  hooks/           # Custom React hooks (useAuth, useSiteSettings, etc.)
  lib/             # Server functions (`createServerFn`), utilities, AI agents
  integrations/    # Supabase client & auth middleware
supabase/
  migrations/      # Immutable SQL schema migrations
```

---

## 📜 Development Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite development server |
| `pnpm build` | Production build (compiles client & SSR bundles) |
| `pnpm exec tsc --noEmit --skipLibCheck` | Run TypeScript strict typecheck |
| `pnpm exec supabase migration list` | Check Supabase migration sync status |
| `pnpm exec supabase db push` | Apply local SQL migrations to remote database |

---

## 🔒 Code & Security Rules

Before submitting any Pull Request, verify:
- [x] **Zero TypeScript Errors**: Run `pnpm exec tsc --noEmit --skipLibCheck`.
- [x] **Server Function Wrappers**: Server function arguments must follow the `{ data: { ... } }` wrapper pattern.
- [x] **Strict RLS**: All new database tables must enable Row Level Security (RLS) and define policies for `authenticated` and `admin` roles.
- [x] **No Secret Leakage**: Client-side environment variables must use `VITE_` prefix. Server-only keys (e.g. Cashfree Secret, Supabase Service Role Key) must never be prefixed with `VITE_`.
- [x] **Mobile Responsiveness**: Layouts must collapse cleanly to single-column on screens `<768px`.

---

## 📬 Reporting Issues & Vulnerabilities

- **Bug Reports & Feature Requests**: Open an issue on [GitHub Issues](https://github.com/Vishwajeetsrk/learnifyai/issues).
- **Security Vulnerabilities**: See [SECURITY.md](SECURITY.md) or email **vishwajeetsrk@gmail.com** / **support@learnifyai.in**.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
