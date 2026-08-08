# Security Policy — Learnify AI

At **Learnify AI**, security and user privacy are foundational. We follow industry best practices and comply with the **Digital Personal Data Protection Act 2023 (DPDP Act 2023)** and **Information Technology Act 2000** of India.

---

## 📢 Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly. **Do NOT open a public GitHub issue for security vulnerabilities.**

### Contact Channels
- **Email**: `vishwajeetsrk@gmail.com` / `security@learnifyai.in` / `support@learnifyai.in`
- **Private Advisory**: You can also submit a private GitHub Security Advisory on our repository.

### What to Include
1. Summary and potential impact of the vulnerability.
2. Step-by-step reproduction instructions or Proof-of-Concept (PoC).
3. Any suggested remediation or fix.

### Response SLA
- **Acknowledgment**: Within 24 hours
- **Triage & Assessment**: Within 5 business days
- **Patch Deployment**: Within 14 days for critical vulnerabilities

---

## 🛡️ Key Security Controls

| Domain | Control |
|---|---|
| **Database Security** | PostgreSQL Row Level Security (RLS) enabled on 100% of tables in Supabase |
| **Authentication & Secrets** | Argon2id password hashing, JWT refresh token rotation, zero secrets in client bundles |
| **Payment Security** | RBI-compliant Cashfree Payment Gateway (PCI-DSS Level 1 certified); Cashfree HMAC-SHA256 webhook signature verification |
| **Input Sanitation** | Strict Zod schema validation on all TanStack Start server functions (`createServerFn`) to prevent SQLi & XSS |
| **AI Prompt Firewall** | Prompt sanitization and rate-limiting per IP/user on all AI endpoints (Gemini / Groq / OpenRouter) |
| **Data Encryption** | AES-256 encryption at rest, TLS 1.3 enforced in transit with HSTS preload |
| **Content Security Policy** | Strict CSP headers in `vercel.json` restricting script execution, frame ancestors, and object sources |
| **Admin Audit Trail** | Automatic logging of administrative actions into the immutable `admin_audit_logs` table |

---

## 🌐 Covered Domains & Scope

- `https://www.learnifyai.in/`
- `https://learnifyaitool.vercel.app/`
- All associated Supabase edge functions and backend server endpoints.

---

## 📜 Compliance

Learnify AI complies with:
- **DPDP Act 2023** (India Digital Personal Data Protection Act)
- **IT Act 2000 & IT Rules 2011** (Grievance Redressal Mechanism)
- **Consumer Protection (E-Commerce) Rules 2020**
- **RBI Guidelines** for online payment aggregators and e-mandates
