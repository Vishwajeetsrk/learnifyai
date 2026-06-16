<div align="center">
  <img src="https://github.com/Vishwajeetsrk/learnifyai/blob/main/src%2Fassets%2Flearnify-logo.png" alt="Learnify AI Logo" width="120" />

  # Learnify AI
  
  **The Next-Generation AI-Powered Learning Management System (LMS)**

  *Learnify AI brings together course creation, automated AI tutoring, dynamic roadmaps, live cohorts, integrated payments, and a rich community experience—all in one seamless platform.*

  [Live Demo](https://learnifyaitool.vercel.app/) • [Documentation](https://docs.learnifyai.com) • [Report Bug](https://github.com/Vishwajeetsrk/learnifyai/issues)
</div>

<br/>

## ✨ Key Features

Learnify AI is built to empower both learners and creators by streamlining the entire educational lifecycle.

### 🎓 For Learners
- **Interactive Course Player:** Rich media support, markdown notes, and video playback.
- **AI Tutor (Learnify AI Chat):** Context-aware conversational AI that explains concepts on the fly.
- **Smart Quizzes & Assessments:** Automated grading and real-time feedback.
- **Wallet & Integrated Payments:** Manage credits, purchase courses, and download invoices instantly.
- **Community Feed:** Share updates, post questions, attach media, and engage with peers.
- **AI-Powered Roadmaps:** Dynamic learning paths adjusted to your progress.
- **Verifiable Certificates (System 2.0):** Cryptographically verifiable professional credentials with dynamic drag-and-drop templates, public `/verify` routes, QR codes, and 1-click LinkedIn sharing.

### 🚀 For Creators & Coaches
- **Creator Studio:** Upload courses, manage lessons, and track enrollment.
- **Coaching Hub:** Manage 1-on-1 scheduling, async messaging, and client progression.
- **Live Cohort Manager:** Easily transition async courses into live high-ticket cohorts.
- **Automated Invoicing:** Professional billing automatically handled for wallet top-ups.
- **Analytics Dashboard:** AI-driven insights into course demand, student performance, and revenue.

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
- **Payments:** [Razorpay](https://razorpay.com/) (Integrated Wallet Top-ups & Checkout with strict HMAC SHA-256 signature verification and idempotency keys)
- **AI Integration:** Google Gemini API / OpenAI API (For AI Tutor and Analytics)
- **PDF Generation:** jsPDF & jsPDF-Autotable (Invoice rendering)
- **Observability:** Sentry Error Tracking & PostHog Analytics

---

## 📂 File Structure

```text
learnifyai/
├── public/                 # Static assets (images, fonts, favicons)
├── src/
│   ├── components/         # Reusable UI components (Shadcn, AppShell, etc.)
│   ├── hooks/              # Custom React hooks (use-auth, etc.)
│   ├── integrations/       # API clients (Supabase, Razorpay)
│   ├── lib/                # Utility functions (cn, formatters)
│   ├── routes/             # TanStack Start Route tree
│   │   ├── _authenticated/ # Protected routes (Dashboard, Wallet, Coaching)
│   │   ├── _admin/         # Admin-only dashboard routes
│   │   ├── _creator/       # Creator studio routes
│   │   └── api/            # Serverless API endpoints
│   ├── routeTree.gen.ts    # Auto-generated routing tree
│   ├── router.tsx          # Router configuration
│   └── main.tsx            # Application entry point
├── supabase/
│   └── migrations/         # PostgreSQL schema definitions and RLS policies
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # You are here!
```

---

## 🚀 Getting Started

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
- [Terms of Service](#) (Placeholder)
- [Privacy Policy](https://learnifyaitool.vercel.app/privacy) (Placeholder)
- [Cookie Policy](https://learnifyaitool.vercel.app/about) (Placeholder)

### License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for the future of education.*
