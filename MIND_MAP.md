# Learnify AI — Project Mind Map (AI Agent Navigation Guide)

> Purpose: Help an AI agent locate the right file/folder FAST to fix, extend, or debug a feature.
> Stack: React 19 + TanStack Start + TanStack Router + Tailwind v4 + Shadcn UI + Supabase + Vercel.
> Updated: v4.8.0 — 104 route files, 178 components, 67 lib files, 91 migrations, 11 locales.

## 0. TOP-LEVEL LAYOUT

```
/
├── src/                      # All application code
│   ├── routes/               # File-based routes (TanStack Router)  ← PRIMARY UI
│   ├── components/           # Reusable UI + feature components
│   ├── lib/                  # Server functions + utilities (DB/AI/payments)
│   ├── hooks/                # React hooks (use-auth, use-toast, etc.)
│   ├── integrations/         # Supabase client + generated types
│   ├── views/                # Lazy-loaded heavy view components (extracted from routes)
│   ├── data/                 # Static data / fixtures
│   ├── types/                # Shared TS types
│   ├── assets/               # Static assets (avatars)
│   └── styles/               # CSS (sections, etc.)
├── supabase/
│   └── migrations/           # 91 SQL migrations (source of truth for DB schema)
├── public/locales/           # i18n JSON (en, hi, bn, te, ta, mr, gu, kn, es, fr, de)
├── scripts/                  # Build/release scripts
├── tests/                    # Playwright E2E
├── *.config.ts               # vite, tailwind, tsconfig
├── vercel.json               # Deploy + security headers + CSP
├── package.json              # Deps + scripts
└── .env                      # Secrets (DO NOT COMMIT — currently tracked; rotate)
```

## 1. ROUTES — `src/routes/`

### 1.1 Root / Layout / Auth

| File                                                                  | Role                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `__root.tsx`                                                          | App shell: QueryClient, AuthProvider, Theme, Tour, GlobalSupportAgent, error boundary |
| `_authenticated.tsx`                                                  | Auth guard layout; onboarding redirect; role gating                                   |
| `index.tsx`                                                           | **Landing page** (hero, features, stats, watch-demo modal)                            |
| `login.tsx` / `signup.tsx`                                            | Auth (email + Google OAuth)                                                           |
| `forgot-password.tsx` / `reset-password.tsx`                          | Password reset flow                                                                   |
| `verify-student.tsx` / `verify.$id.tsx` / `verified-certificates.tsx` | Email/cert verification                                                               |
| `certificates.$code.tsx`                                              | Certificate by code                                                                   |

### 1.2 Public marketing / info

`about.tsx, careers.tsx, contact.tsx, community.tsx, coaches.tsx, creators.tsx,
docs.tsx, faq.tsx, features.tsx, pricing.tsx, privacy.tsx, terms.tsx, refund-policy.tsx,
roadmap.tsx, showcase.tsx, events.tsx, projects.tsx, blog.index.tsx, blog.$slug.tsx,
p.$slug.tsx (WCMS dynamic page), u.$id.tsx / u.@$username.tsx (public profiles),
studio.$projectId.tsx, course.$projectId.tsx (public course detail), sitemap.xml.tsx`

### 1.3 Authenticated — Learner

`dashboard.tsx, onboarding.tsx, courses.index.tsx (catalog), courses.$slug.tsx (COURSE PLAYER),
achievements.tsx, leaderboard.tsx, certificates.tsx, challenges.tsx, store.tsx, wallet.tsx,
billing.tsx, cart.tsx, settings.tsx, submissions.tsx, support.tsx, workspace.tsx,
inbox.tsx, community-feed.tsx, community-hub.tsx, coaching.tsx, cohorts.tsx, cohorts.$id.tsx`

### 1.4 Authenticated — AI / Playground

`ai.tsx (AI TUTOR CHAT), ai-tools.tsx,
playground.tsx, playground.editor.tsx (Monaco), playground.web.tsx (Sandpack),
playground.react.tsx, playground.challenges.tsx, playground.interview.tsx,
playground.projects.tsx, playground.leaderboard.tsx,
system-design.tsx, system-design.index.tsx, system-design.$topic.tsx`

### 1.5 Authenticated — Career

`career-studio.tsx (11-tab suite), resume-builder.tsx, ats-checker.tsx,
career-roadmap.tsx, portfolio-builder.tsx, interview.tsx, apply-creator.tsx, apply-coach.tsx`

### 1.6 Authenticated — Creator

`creator.tsx, creator.earnings.tsx, creator.subscribers.tsx, creator.comments.tsx,
creators.$id.tsx, studio.tsx`

### 1.7 Authenticated — Admin (`_authenticated/admin.*`)

`admin.tsx (dashboard), admin.content.tsx (16-tab content manager),
admin.certificates.tsx, admin.courses.tsx, admin.billing.tsx, admin.subscriptions,
admin.store.tsx (XP Store), admin.system-health.tsx, admin.audit-logs.tsx,
admin.announcements.tsx, admin.enrichment-runs.tsx, admin.missing-videos.tsx`

### 1.8 API routes — `src/routes/api/`

`chat.ts (AI chat, rate-limited, multi-provider, credit tracking),
webhooks/cashfree.ts, webhooks/cashfree-subscription.ts,
cron/check-subscriptions.ts, cron/retry-cert-emails.ts, cron/auto-maintenance.ts,
public/hooks/run-reminders.ts`

## 2. COMPONENTS — `src/components/`

| Folder / File                                                                                                                                         | Domain                                                       | Used in                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------- |
| `AppShell.tsx, SiteHeader.tsx, SiteFooter.tsx, MobileBottomNav.tsx`                                                                                   | Layout/nav                                                   | `__root.tsx`               |
| `ProductTour.tsx, Reveal.tsx, NavigationProgress.tsx, PageTransition.tsx`                                                                             | UX                                                           | global                     |
| `ThemeToggle.tsx, ThemeSync.tsx, LanguageSwitcher.tsx, CookieConsent.tsx`                                                                             | Prefs                                                        | header                     |
| `GlobalSupportAgent.tsx`                                                                                                                              | AI support chat                                              | `__root.tsx`               |
| `CustomVideoPlayer.tsx, CoursePlayer.tsx`                                                                                                             | Video                                                        | course player              |
| `video-player/` (7)                                                                                                                                   | Advanced video player (captions, transcript, PiP, shortcuts) | course player              |
| `visual-learning/` (6): `ConceptGraph, ExplainLikeI12, VisualLearningPanel, DynamicLearningMap, GamificationDashboard`                                | **Visual Learning tab**                                      | `courses.$slug.tsx`        |
| `cheat-sheet/`                                                                                                                                        | Cheat sheet generator                                        | course player              |
| `certificate-designer/` (21)                                                                                                                          | Canva-like cert designer                                     | admin.certificates, studio |
| `system-design/` (10)                                                                                                                                 | System Design Academy                                        | system-design routes       |
| `playground/` (12)                                                                                                                                    | Code playground IDEs                                         | playground routes          |
| `agents/` (5)                                                                                                                                         | AI agent chats                                               | various                    |
| `admin/` (18): `PageManager, MediaLibrary, BlogManager, CouponManager, RevenueDashboard, SystemHealthView, AuditLogsView, AnnouncementBroadcast, ...` | Admin panels                                                 | admin routes               |
| `career/` (if any)                                                                                                                                    | Career tools                                                 | career-studio              |
| `ui/`                                                                                                                                                 | Shadcn primitives (30+)                                      | everywhere                 |
| `interactive/`                                                                                                                                        | Pricing/competitor comparison                                | pricing                    |
| `wcms/`                                                                                                                                               | Block renderer                                               | p.$slug, admin.content     |
| `studio/`                                                                                                                                             | Cert designer wrapper                                        | studio                     |

## 3. LIB — Server Functions & Utilities — `src/lib/`

### 3.1 Auth / Profiles

`profile.functions.ts, profile-save.functions.ts, user-ai.ts, stats.ts`

### 3.2 Courses / Learning

`course.functions.ts, course-builder.functions.ts, course-generator.functions.ts,
course-player.ts, lesson-ai.functions.ts, recommendations.functions.ts,
concept-graph.functions.ts (⚠ table missing in DB), explain-like.functions.ts (⚠ table missing),
exercise-grader.functions.ts, rag.functions.ts`

### 3.3 Certificates

`cert.functions.ts, cert-auto-gen.ts, cert-email.functions.ts, certificate-admin.functions.ts,
certificate-pdf.ts, canva-cert.functions.ts, open-badges.functions.ts`

### 3.4 Billing / Payments / Subscriptions

`payment.functions.ts, subscription.functions.ts, billing.functions.ts,
billing-email.functions.ts, subscription-email.functions.ts, invoice-pdf.ts`

### 3.5 AI (tutoring / agents)

`ai-tools.functions.ts, agent.functions.ts, career-coach.functions.ts,
learning-assistant.functions.ts, market-intel.functions.ts, support-agent.functions.ts,
user-ai.ts, thumbnail.ts, gamification.functions.ts`

### 3.6 Playground / Code exec

`playground.functions.ts, playground-ai.functions.ts, executors.ts,
playground/ (ai.ts, challenges.ts, execution.ts, projects.ts, snippet.ts)`

### 3.7 Community / Coaching / Chat

`community-chat.functions.ts, group-chat.functions.ts`

### 3.8 Admin

`admin-audit.functions.ts (⚠ table missing), admin-announcements.functions.ts,
admin-content.functions.ts, admin-courses.functions.ts, admin-features.functions.ts,
admin-users.functions.ts, system-health.functions.ts (⚠ table missing),
admin-courses.functions.ts`

### 3.9 WCMS

`wcms.functions.ts, wcms-public.functions.ts`

### 3.10 Career

`resume.functions.ts, forecast.functions.ts`

### 3.11 Misc / Infra

`utils.ts, calendar.ts, error-page.ts, file-parser.ts, upload-validation.ts,
welcome-email.functions.ts, youtube.functions.ts, workspace.functions.ts,
student-verification.functions.ts, lovable-error-reporting.ts`

## 4. STATE / CONTEXT / HOOKS

`src/hooks/use-auth.tsx` — **AuthProvider + useAuth** (session, role, profile).
TanStack Query (`@tanstack/react-query`) for server state.
All server functions use `createServerFn` from `@tanstack/react-start`.

## 5. DATABASE — `src/integrations/supabase/`

| File        | Role                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `client.ts` | Browser (`anon`) + server (`service_role`) Supabase clients            |
| `types.ts`  | **Generated DB types** (regenerate via `supabase gen types` or script) |

`supabase/migrations/` — **91 SQL files. 51 applied, 40 PENDING** (see §8).
Pending includes: billing, pricing, wcms, onboarding, blog, design_projects,
concept_graphs, admin_audit_logs, store_items, xp_store_purchases, cron_jobs, etc.

## 6. STYLES / THEME

`src/styles.css` — Tailwind v4 entry (CSS-first: `@theme`, `@utility`).
`src/components/ui/` — Shadcn tokens.
`vite.config.ts` — `css.transformer: "lightningcss"` (required for Tailwind v4 build).

## 7. i18n — `public/locales/`

11 locales: `en, hi, bn, te, ta, mr, gu, kn, es, fr, de`.
Keys only cover nav/hero/features. ~30+ pages are HARDCODED English (not translated).
`useTranslation()` used in only 4 files: `dashboard.tsx, index.tsx, settings.view.tsx, SiteHeader.tsx`.

## 8. KNOWN TECHNICAL DEBT (for fixing)

| Area                       | Detail                                                                                                                                               | Fix location                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **40 pending migrations**  | DB schema lags code by 40 migrations                                                                                                                 | `supabase/migrations/` → apply to DB, then regenerate `types.ts`                                                  |
| **53 TS errors**           | Root cause: missing Supabase tables in `types.ts` (admin_audit_logs, concept_graphs, explanations_cache, store_items, etc.) + minor import/type bugs | regenerate `types.ts`; fix `career-studio.tsx`, `admin.tsx`, `AnnouncementBroadcast.tsx`, `portfolio-builder.tsx` |
| **Exposed `.env`**         | 20+ prod secrets committed (user opted NOT to rotate)                                                                                                | `.gitignore` + history purge (separate task)                                                                      |
| **Hardcoded placeholders** | `customer_phone: "9999999999"` (subscription.functions.ts:233,278), GSTIN `"29XXXXX1234X1Z5"` (invoice-pdf.ts:42)                                    | read from `profiles.phone` (column exists in DB, missing in types)                                                |
| **i18n gap**               | Only 4 pages translated                                                                                                                              | add keys per page                                                                                                 |

## 9. QUICK "WHERE IS X" INDEX

- **Course video player**: `src/components/CustomVideoPlayer.tsx` + `video-player/`
- **Course page layout/tabs**: `src/routes/_authenticated/courses.$slug.tsx`
- **AI tutor chat**: `src/routes/_authenticated/ai.tsx` + `src/lib/ai-tools.functions.ts` + `src/routes/api/chat.ts`
- **Certificates**: `src/lib/cert*.ts` + `src/components/certificate-designer/`
- **Payments/subscriptions**: `src/lib/payment.functions.ts`, `subscription.functions.ts`, `billing.functions.ts`
- **Admin panel**: `src/routes/_authenticated/admin*.tsx` + `src/components/admin/`
- **Visual Learning**: `src/components/visual-learning/`
- **Supabase types**: `src/integrations/supabase/types.ts`
- **Landing page**: `src/routes/index.tsx`
- **Settings**: `src/routes/_authenticated/settings.tsx` + `src/views/settings.view.tsx`
- **Audit logs page**: `src/routes/_authenticated/admin.audit-logs.tsx` + `src/components/admin/AuditLogsView.tsx`

## 10. BUILD / VERIFY

- `npm run build` → Vite build (does NOT run tsc typecheck).
- `npx tsc --noEmit` → full typecheck (currently 53 errors).
- `npm run dev` → local dev.
- Deploy target: **Vercel** (`vercel.json`).
