import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Learnify AI" },
      { name: "description", content: "How Learnify AI collects, uses, and protects your data under the India DPDP Act 2023. You retain full rights to export, edit, or delete your data." },
      { property: "og:title", content: "Privacy Policy — Learnify AI" },
      { property: "og:description", content: "Our privacy practices, data rights, and security protocols in plain language." },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="privacy"
      title="Your data, your control."
      subtitle="Last updated: August 2026. Fully compliant with India DPDP Act 2023 & Information Technology Act 2000."
      defaultContent={`<h2>1. Data We Collect & DPDP Act 2023 Compliance</h2>
<p>In compliance with the Digital Personal Data Protection Act 2023 (DPDP Act 2023) and Information Technology Act 2000 of India, Learnify AI collects essential user data including account credentials (full name, email address, profile avatar), transaction histories, GSTIN details, course progress, quiz completion records, AI prompt logs, and technical telemetry. All online payments are processed securely via RBI-authorized Cashfree Payment Gateway (PCI-DSS Level 1 certified); no raw credit or debit card details are stored on our servers.</p>

<h2>2. Purpose of Data Processing</h2>
<p>We process personal data solely for providing online higher education and technical training services (SAC Code 998431), issuing verifiable cryptographic digital certificates, executing interactive code playgrounds, managing Cashfree subscription mandates, generating GST-compliant tax invoices, and personalizing AI learning recommendations.</p>

<h2>3. Complete Data Rights: Export, Edit & Delete Your Data</h2>
<p>Under the DPDP Act 2023 and IT Rules 2021, you retain full ownership and control over your personal information. <strong>You can export, edit, or delete your data at any time:</strong></p>
<ul>
  <li><strong>Export Your Data:</strong> Request a complete digital export of your account profile, course progress, saved notes, code playground projects, and billing history in JSON/CSV formats by emailing <a href="mailto:support@learnifyai.in">support@learnifyai.in</a>.</li>
  <li><strong>Edit Your Data:</strong> Modify or correct your profile details, display name, avatar, bio, and GSTIN information at any time directly through your Account Settings.</li>
  <li><strong>Delete Your Account & Erasure:</strong> Request permanent account deletion. Upon receiving an erasure request, all personal identifiers, auth credentials, and stored content are permanently purged within 7 business days, excluding legally mandated GST tax invoices retained for statutory auditing.</li>
</ul>

<h2>4. Data Sharing & Third-Party Fiduciaries</h2>
<p>Data is shared strictly on a need-to-know basis with verified infrastructure providers required to operate the platform: Supabase (Encrypted Database & Authentication), Cashfree (RBI Authorized Payment Aggregator), Google Cloud (AI Models), and Vercel/Cloudflare (Global CDN & Edge Security). We strictly do not sell, rent, or monetize your personal data to third-party advertisers.</p>

<h2>5. Cookies & Telemetry</h2>
<p>We use essential functional cookies and local storage to maintain authenticated sessions, store code playground states, and save theme preferences. Session telemetry is used exclusively to improve platform speed and maintain system stability.</p>

<h2>6. Grievance Redressal Officer & Contact</h2>
<p>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, for any privacy inquiries, data export requests, consent revocation, or data grievances, contact our designated Grievance Redressal Officer at <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> or <a href="mailto:vishwajeetsrk@gmail.com">vishwajeetsrk@gmail.com</a>. Grievance acknowledgments are dispatched within 24 hours and resolved within 15 days.</p>`}
    />
  ),
});
