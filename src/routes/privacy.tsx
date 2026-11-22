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
      subtitle="Last updated: November 2026. Aligned with India's Digital Personal Data Protection (DPDP) Act 2023, DPDP Rules 2025 staged rollout, and IT Act 2000."
      defaultContent={`<h2>1. Data We Collect & DPDP Act 2023 Compliance</h2>
<p>In strict compliance with the Digital Personal Data Protection Act 2023 (DPDP Act 2023), the DPDP Rules 2025 implementation roadmap, and the Information Technology Act 2000 of India, Learnify AI operates as a Data Fiduciary. We collect only necessary personal data: account credentials (name, email address, profile avatar), transaction histories, GSTIN details, course completion logs, and technical telemetry. All payment processing is conducted exclusively through Razorpay, an RBI-regulated and PCI-DSS Level 1 compliant payment aggregator. No card details, CVVs, or UPI PINs are ever collected or stored on our servers.</p>

<h2>2. Purpose Limitation & Lawful Processing</h2>
<p>We process personal data solely for delivering online education services (SAC Code 998431), generating cryptographically verifiable digital certificates, powering interactive code and interview simulations, maintaining student enrollments, and issuing statutory GST tax invoices (CGST 9% + SGST 9% or IGST 18%).</p>

<h2>3. Data Principal Rights</h2>
<p>Under India's DPDP Act, you as a Data Principal hold enforceable rights: (a) Right to access an itemized summary of personal data processed, (b) Right to correction, completion, and updating of inaccurate data, (c) Right to withdraw consent and request account/data erasure, and (d) Right to readily accessible grievance redressal.</p>

<h2>4. Authorized Data Processors</h2>
<p>Your data is processed only by verified infrastructure partners under strict confidentiality agreements: Supabase (Encrypted PostgreSQL & Auth), Razorpay (RBI Authorized Payment Aggregator), and Cloudflare (Edge Security and DDoS mitigation). We never monetize, rent, or sell personal data to third-party ad networks or brokers.</p>

<h2>5. Grievance Redressal Officer</h2>
<p>Pursuant to Section 12 of the DPDP Act 2023, our designated Grievance Redressal Officer may be reached at <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a>. Acknowledgments are sent within 24 hours, and complaints are substantively resolved within statutory timelines (not exceeding 15 business days).</p>

<h2>6. Localization & Currency Denomination</h2>
<p>Learnify AI does NOT collect, request, or store GPS coordinates to detect language, currency, or location. Regional preferences are determined using coarse IP-country headers and saved user settings. Canonical pricing across the platform is denominated in Indian Rupees (INR ₹). International credit cards are accepted via Razorpay subject to account activation, card network approval, and currency conversion according to banking guidelines.</p>`}
    />
  ),
});
