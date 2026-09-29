import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Learnify AI" },
      { name: "description", content: "How Learnify AI collects, uses, and protects your data." },
      { property: "og:title", content: "Privacy Policy — Learnify AI" },
      { property: "og:description", content: "Our privacy practices, in plain language." },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/privacy" }],
  }),
  component: () => (
    <CustomPageContent
      pageKey="privacy"
      title="Your data, your control."
      subtitle="Last updated: July 2026. Fully compliant with India DPDP Act 2023 & Information Technology Act 2000."
      defaultContent={`<h2>1. Data We Collect & DPDP Act 2023 Compliance</h2>
<p>In compliance with the Digital Personal Data Protection Act 2023 (DPDP Act 2023) and Information Technology Act 2000 of India, Learnify AI collects account credentials (name, email address, profile avatar), transaction histories, GSTIN details, course progress, AI prompt logs, and technical telemetry. Payments are processed securely via RBI-compliant Cashfree Payment Gateway; no raw credit/debit card numbers are stored on our servers.</p>

<h2>2. Purpose of Data Processing</h2>
<p>We process personal data solely for providing online education services (SAC Code 998431), generating verifiable digital certificates, executing interactive code playgrounds, managing Cashfree subscription mandates, and issuing GST-compliant tax invoices.</p>

<h2>3. User Data Rights</h2>
<p>Under the DPDP Act 2023, users retain the right to: (a) Access and export personal data, (b) Correct, update, or complete inaccurate data, (c) Withdraw consent and request data erasure, and (d) Seek grievance redressal.</p>

<h2>4. Data Sharing & Third-Party Fiduciaries</h2>
<p>Data is shared only with verified infrastructure providers required for operation: Supabase (Encrypted Database & Auth), Cashfree (RBI Authorized Payment Aggregator), and Cloudflare (Edge Security). We do not sell or monetize personal data to third-party advertisers.</p>

<h2>5. Grievance Officer & Contact</h2>
<p>For data inquiries, consent revocation, or privacy grievances, contact our designated Grievance Redressal Officer at <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a>. Grievances are acknowledged within 24 hours and resolved within 15 days as required by Indian regulations.</p>

<h2>6. Localization & Zero-GPS Regional Detection</h2>
<p>Learnify AI does NOT collect, request, or store precise GPS coordinates, latitude, or longitude to determine your language, country, or currency. Regional context is determined strictly using privacy-preserving signals: your saved account preferences, browser locale headers, and coarse network IP-country headers. Canonical pricing across the platform is denominated in Indian Rupees (INR ₹); international payment card settlement and currency conversion are handled by certified payment gateways (Razorpay and Cashfree) without storing card credentials on our servers.</p>`}
    />
  ),
});
