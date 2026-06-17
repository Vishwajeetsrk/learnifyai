<div align="center">
  <img src="https://github.com/Vishwajeetsrk/learnifyai/blob/main/src%2Fassets%2Flearnify-logo.png" alt="Learnify AI Logo" width="120" />

  # Learnify AI
  
  **The Next-Generation AI-Powered Learning Management System (LMS)**

  *Learnify AI brings together course creation, automated AI tutoring, dynamic roadmaps, live cohorts, integrated payments, and a rich community experience—all in one seamless platform.*

  [Live Demo](https://learnifyai.vercel.app/) • [Report Bug](https://github.com/Vishwajeetsrk/learnifyai/issues)
</div>

<br/>

## ✨ Key Features

Learnify AI is built to empower both learners and creators by streamlining the entire educational lifecycle.

### 🎓 For Learners
- **Interactive Course Player:** Rich media support, markdown notes, and video playback with custom controls (YouTube IFrame API + non-YouTube fallback).
- **AI Tutor (Learnify AI Chat):** Context-aware conversational AI that explains concepts on the fly.
- **AI Agent:** Intelligent assistant with chat, voice I/O (Web Speech API), and tool execution — code execution via Piston and web search. Standalone page at `/ai-agent`.
- **Multi-Language Playground:** Write, compile, and run code in 40+ languages (C, C++, Java, Python, JavaScript, TypeScript, Go, Rust, and more) using Monaco Editor + Piston execution engine. Standalone page at `/playground`.
- **Smart Quizzes & Assessments:** Automated grading and real-time feedback.
- **Wallet & Integrated Payments:** Manage credits, purchase courses, and download invoices instantly.
- **Community Feed:** Share updates, post questions, attach media, and engage with peers.
- **Dynamic Roadmaps:** CMS-backed public roadmap showing shipped, in-progress, and planned features.
- **Verifiable Certificates (System 2.0):** Drag-and-drop certificate builder with text, image, and QR elements. Public verification, PDF download, and 1-click LinkedIn sharing.

### 🚀 For Creators & Coaches
- **Creator Studio:** Upload courses, manage lessons, and track enrollment.
- **Coaching Hub:** Manage 1-on-1 scheduling, async messaging, and client progression.
- **Live Cohort Manager:** Easily transition async courses into live high-ticket cohorts.
- **Automated Invoicing:** Professional billing automatically handled for wallet top-ups.
- **AI Thumbnail Generator:** Generate course thumbnails with auto-fallback across 6 providers (Lovable, Gemini, Stability AI, Fal AI, Hugging Face, Pollinations AI).

### 📬 Inbox & Notifications
- **Smart Notifications:** Wallet top-ups, withdrawals, new lessons, and certificate updates — each notification is clickable and links to the relevant page (courses, wallet, certificates, creator dashboard).
- **Interactive Flashcards:** Flashcards generated via AI Tools render as interactive flip cards directly in the inbox notification.
- **Reminders:** View, toggle, and delete scheduled reminders. Linked from AI Tools.

### ⚙️ Admin Features
- **Coupon System:** Admin-managed discount codes (percent/flat) stored in DB — applied at checkout with real-time validation and cart UI.
- **Content Manager:** Full CMS with tabs for Events, Jobs, Pricing Plans, Site Settings, Certificate Templates, FAQs, Legal Pages (Terms, Privacy, Refund), Coupons, and Roadmap.
- **Legal Pages:** Fully editable Terms of Service, Privacy Policy, and Refund Policy — rendered from the database, editable via the admin Content Manager.
- **Social Media Management:** Configurable Discord, Twitter/X, GitHub, LinkedIn, and YouTube links with icons in the footer. All managed through Site Settings.
- **Site Settings:** Key-value store for contact emails, social links, auto-delete event/job rules, and custom settings.

---

## 🛠️ Technology Stack

Learnify AI is built on the modern web stack for maximum performance and developer experience.

### Frontend
- **Framework:** [React 19](https://react.dev) + [TanStack Start](https://tanstack.com/start/latest) (SSR & Routing)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend & Infrastructure
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **File Storage:** Supabase Storage (Courses, Community Uploads)
- **Deployment:** [Vercel](https://vercel.com/) (Edge Network & Serverless Functions)

### Integrated APIs & Tools

| Category | Providers |
|----------|-----------|
| **Payments** | Razorpay (wallet, checkout, webhooks with HMAC SHA-256 verification) |
| **AI Chat / Text** | OpenRouter, Gemini, Groq (3-tier fallback) |
| **AI Embeddings** | Gemini Embeddings (text-embedding-004) |
| **Image Generation** | Pollinations AI (free) → OpenRouter (FLUX Pro) → Gemini → Stability AI → Fal AI → Hugging Face (6-tier fallback) |
| **Video Analysis** | YouTube Data API + Gemini summarization |
| **Email** | Resend (primary), Brevo/SMTP (fallback) |
| **Error Monitoring** | Sentry |
| **Analytics** | PostHog |
| **LLM Observability** | LangSmith |
| **AI Agent Framework** | CrewAI |
| **Code Execution** | Piston (self-hosted) — 40+ languages including C, C++, Java, Python, PHP, SQLite, JS/TS |
| **Vector Database** | Supabase pgvector (material_chunks, match_material_chunks RPC) |
| **OCR / Vision** | Mistral OCR (planned), Hugging Face models (fallback) |
| **PDF Generation** | jsPDF & jsPDF-Autotable |


---

## 📂 File Structure

```text
learnifyai/
├── public/                 # Static assets (images, fonts, favicons)
├── src/
│   ├── components/         # Reusable UI components (Shadcn, AppShell, CustomVideoPlayer, etc.)
│   ├── hooks/              # Custom React hooks (use-auth, etc.)
│   ├── integrations/       # API clients (Supabase, Razorpay)
│   ├── lib/                # Utility + server functions
│   │   ├── playground.functions.ts  # Code execution via Piston API (40+ languages)
│   │   └── agent.functions.ts       # AI agent with tool calling (code, web search)
│   ├── routes/             # TanStack Start route tree
│   │   ├── _authenticated/ # Protected routes
│   │   │   ├── playground.tsx  # Multi-language code playground (Monaco + Piston)
│   │   │   └── ai-agent.tsx    # AI agent with chat, voice I/O, tool execution
│   │   └── api/            # Serverless API endpoints
│   ├── routeTree.gen.ts    # Auto-generated routing tree
│   ├── router.tsx          # Router configuration
│   └── main.tsx            # Application entry point
├── supabase/
│   └── migrations/         # PostgreSQL schema definitions and RLS policies
├── package.json            # Dependencies and scripts
└── README.md               # You are here!
```

---

## 🧪 Playground & AI Agent

### Multi-Language Playground (`/playground`)
A full-featured code execution environment powered by [Piston](https://github.com/engineer-man/piston) (Docker sandbox API) supporting 40+ languages:
- **Editor:** Monaco Editor (VS Code-grade) with syntax highlighting, minimap, and multi-tab editing
- **Languages:** JavaScript, TypeScript, Python, C++, C, Java, Go, Rust, Ruby, PHP, C#, SQL, Bash, and 30+ more
- **Stdin Input:** Pass input to your programs
- **Output Panel:** Real-time stdout, stderr, and exit code display
- **Run on Demand:** Execute code with a single click

### AI Agent (`/ai-agent`)
An intelligent assistant with tool execution capabilities:
- **Chat Interface:** Conversational AI powered by OpenRouter (GPT-4o-mini)
- **Voice I/O:** Push-to-talk via Web Speech API (speech-to-text) + text-to-speech output
- **Tool Execution:** Agent can run code via Piston and search the web for up-to-date information
- **Multi-Turn Reasoning:** Agent can make multiple tool calls in a single conversation to solve complex tasks

### Architecture
```
Playground (Monaco Editor) ──► Piston API (emkc.org) ──► Output
AI Agent (Chat + Voice) ──► OpenRouter (GPT-4o-mini) ──► Tool Calls
                                  │
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
              Piston Execution              Web Search API
```

---

Follow these instructions to get the project up and running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account
- A [Razorpay](https://razorpay.com/) Sandbox account

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
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   VITE_BASE_URL=http://localhost:3000
   ```

4. **Initialize the Database:**
   Run the Supabase migrations in your project's SQL editor or via the Supabase CLI to create the necessary tables (`wallet_transactions`, `posts`, `coaching_slots`, etc.) and Storage buckets (`community-uploads`, `course-videos`).

5. **Start the development server:**
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
