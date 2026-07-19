# Learnify AI — Agent Rules & Persistent Memory

## 🧠 Always Remember: Platform Context

- **Project**: Learnify AI 4.0 / DreamSync / Career Platform
- **Stack**: TanStack Start + React 19 + Supabase + Tailwind v4 + Shadcn UI + Vercel + pnpm
- **Admin**: `vishwajeetsrk@gmail.com` / `12345678`
- **Repo**: `github.com/Vishwajeetsrk/learnifyai`
- **Live**: `https://learnifyaitool.vercel.app/` ; 'https://www.learnifyai.in/' 

---

## 🔁 Always Do This For Every Feature / Task

Before starting ANY task, proactively review and suggest across these 6 pillars:

### 1. 📋 REQUIREMENTS CHECK
- Clarify scope: Is this a new feature, fix, or refactor?
- Ask: Does this affect other features? (e.g., auth, payments, AI credits)
- Suggest: What's missing that the user hasn't thought of yet?
- Consider: Mobile-first? Multi-language? Role-based access?

### 2. 🔒 SECURITY CHECKLIST
For every feature, always flag if any of these are missing:
- [ ] Input validation & sanitization (XSS, SQL injection)
- [ ] Rate limiting (AI endpoints, auth, payments)
- [ ] RLS (Row Level Security) on all Supabase tables
- [ ] Auth guard on all protected routes (`_authenticated/`)
- [ ] Server function args wrapped in `{ data: { ... } }` pattern
- [ ] No secrets in client-side code (`VITE_` prefix = public)
- [ ] Audit logging for admin actions (`admin_audit_logs` table)
- [ ] Payment webhook signature verification (Cashfree secret)
- [ ] File upload: type + size validation before Supabase Storage

### 3. 🎨 UI/UX STANDARDS
Always enforce these design standards (see `DESIGN.md` for the full source of truth):
- **Premium feel**: Subtle gradients, refined shadows — never plain/flat, no neon glows, no rainbow animations
- **Micro-animations**: Hover `scale(1.02)`, focus ring in indigo, `translateY(-1px)` on active
- **Dark mode first**: All components must work in dark mode
- **Mobile responsive**: `sm:` / `md:` / `lg:` breakpoints on every layout; single column collapse <768px
- **Loading states**: Skeletal shimmer matching layout — never circular spinners for content areas
- **Empty states**: Always show a helpful message with a CTA — never just "No data"
- **Toast feedback**: Every user action must have `toast.success()` or `toast.error()`
- **Typography**: `font-display` (Space Grotesk) for headings, `font-sans` (DM Sans) for body. Weight-driven hierarchy, not just size.
- **Icons**: Always use Lucide icons — never emoji as icons in production UI
- **Accessibility**: `aria-label` on icon-only buttons, `alt` on all images; 44px minimum tap targets
- **Banned patterns**: No `h-screen` (use `min-h-[100dvh]`). No custom cursors. No 3-column equal card grids. No fake statistics/metrics. No AI copywriting clichés. No emojis. No neon glows.

### 4. ⚙️ ADMIN PANEL REQUIREMENTS
For any new feature, always ask: "Does admin need to manage this?"
- Admin CRUD for all user-facing content (courses, items, announcements)
- Audit log entry for every admin action
- Role-based: Super Admin vs Content Manager vs Support
- Export to CSV for all data tables
- Search + filter on all admin lists
- Soft delete (never hard delete without confirmation)
- Stats/analytics card at top of every admin section
- Admin routes: always under `/_authenticated/admin*`

### 5. 💰 PAYMENT & BILLING RULES
Always apply Indian market standards:
- **GST**: CGST 9% + SGST 9% = 18% total (or IGST 18% for interstate)
- **GSTIN** required on all invoices
- **HSN/SAC code**: 998431 (online education services)
- **Place of Supply** + State Code on every invoice
- **Currency**: INR (₹) — never USD unless explicitly requested
- **Gateway**: Cashfree primary (subscriptions + wallet + payouts)
- **Verification URL**: Always `https://learnifyai.com/verify/...` — never localhost
- **Webhook**: Always verify Cashfree signature before processing
- **Refund policy**: Show on checkout + email confirmation
- **Invoice PDF**: jsPDF with QR code, digital signature, company GSTIN

### 6. 🚀 PERFORMANCE & BUILD RULES
Before every commit:
- [ ] Run `pnpm exec tsc --noEmit --skipLibCheck` — zero errors required
- [ ] Use `ReactNode` not `JSX.Element` for type annotations
- [ ] Server functions: args must be `{ data: { ... } }` wrapper
- [ ] Never use `head` command on Windows (PowerShell) — use `Select-Object -First`
- [ ] LightningCSS (not PostCSS) for Tailwind v4
- [ ] Always `git add -A && git commit && git push` after completing tasks
- [ ] Update `README.md` changelog with version bump on significant releases

---

## 🤖 Recommended Agent Workflow (For Any New Feature)

```
1. PLAN    → Create implementation_plan.md, get approval
2. DESIGN  → Use Stitch MCP for UI mockup if major UI change
3. SCHEMA  → Write Supabase migration first
4. BUILD   → Component → Server function → Route → Admin tab
5. SECURE  → Apply RLS, validation, rate limits
6. TEST    → pnpm exec tsc, manual test in browser
7. COMMIT  → git add -A, descriptive commit, push
8. README  → Update changelog with version bump
```

---

## 🏗️ Tech Stack Gotchas (Never Forget)

| Issue | Solution |
|-------|----------|
| Server fn args | Always `{ data: { fieldName: value } }` |
| JSX types | Use `ReactNode` not `JSX.Element` |
| Supabase Insert types | nullable→`T \| null`, required→`T`, hasDefault→`T` |
| Tailwind v4 | LightningCSS only, not PostCSS |
| Windows terminal | No `head`/`grep -E` — use PowerShell equivalents |
| TypeScript check | Always `--skipLibCheck` flag |
| Vercel env vars | `VITE_` prefix = public (browser), no prefix = server-only |

---

## 📊 Always Suggest These For New Projects

When starting a fresh project, always proactively recommend:

### Requirements
- User roles (Student / Creator / Admin / Coach)
- Auth flow (email+password, Google OAuth, magic link)
- Onboarding wizard (8-step minimum)
- Notification system (in-app + email)
- Analytics (user activity, revenue, AI usage)

### Security
- Argon2id password hashing (not bcrypt)
- JWT refresh token rotation
- Rate limiting per IP + per user
- CORS whitelist
- CSP headers
- Input firewall for AI prompts

### UI/UX
- Loading skeleton screens (not spinners)
- Error boundary components
- Toast notification system
- Mobile app banner
- Dark/light mode toggle
- Keyboard shortcuts overlay

### Admin
- User management (ban, verify, role change)
- Revenue dashboard (MRR, ARR, churn)
- Content moderation queue
- Email template editor
- Coupon/discount manager
- Audit log viewer

### Payment (India)
- Cashfree or Razorpay
- UPI + Cards + NetBanking
- GST-compliant invoices
- Wallet system (credits)
- Subscription plans (monthly/annual)
- Payout to creators

---

## 📌 MCP Tools Available (Use Proactively)

| Tool | When to Use |
|------|-------------|
| `StitchMCP` | Design screens BEFORE coding any major UI |
| `chrome-devtools-mcp` | Debug live app, check console errors, run Lighthouse |
| `firebase-mcp-server` | Quick Firebase setup (auth, Firestore, hosting) |
| `cloudrun` | Deploy to Google Cloud Run |
| `postman-mcp-server` | Generate & test API collections automatically |
| `dart-mcp-server` | Flutter mobile app development |
| `sequential-thinking` | Complex planning that needs step-by-step reasoning |
