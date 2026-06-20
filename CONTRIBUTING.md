# Contributing to Learnify AI

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/your-username/learnify-ai.git
cd learnify-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and API keys

# Start dev server
npm run dev
```

## Tech Stack

- **Framework:** React 19 + TanStack Start (SSR)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** OpenRouter, Gemini, Groq (multi-provider fallback)
- **Payments:** Cashfree (Subscriptions + Wallet)
- **Testing:** Playwright (E2E)

## Project Structure

```
src/
  routes/          # TanStack Router file-based routes
    _authenticated # Protected routes (require auth)
    api/           # Server-side API routes
  components/      # Reusable UI components
  hooks/           # Custom React hooks
  lib/             # Server functions, utilities, AI agents
  integrations/    # Supabase client config
public/            # Static assets (favicon, robots.txt)
```

## Scripts

| Command               | Description           |
| --------------------- | --------------------- |
| `npm run dev`         | Start Vite dev server |
| `npm run build`       | Production build      |
| `npm run lint`        | Run ESLint            |
| `npm run format`      | Run Prettier          |
| `npx playwright test` | Run E2E tests         |

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` and `npm run build`
4. Run `npx playwright test` to ensure E2E tests pass
5. Submit a PR with a clear description

## Code Style

- Use TypeScript strict mode
- Follow existing patterns (TanStack Router, Shadcn UI)
- Server functions use `createServerFn` from TanStack Start
- AI features go through `user-ai.ts` multi-provider fallback
- Validate all inputs with Zod

## Reporting Issues

- Use [GitHub Issues](https://github.com/your-username/learnify-ai/issues)
- For security issues, see [SECURITY.md](SECURITY.md)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
