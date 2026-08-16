import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Learnify AI" },
      {
        name: "description",
        content: "Learnify AI Privacy Policy regarding data protection, user privacy, and security standards.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="privacy"
      title="Privacy Policy"
      subtitle="Last updated: August 2026. How we collect, store, and protect your personal information."
      defaultContent={`<h2>1. Information We Collect</h2>
<p>We collect essential information required to deliver our educational services, including your name, email address, profile data, and course progress. All payment processing is handled securely by PCI-DSS compliant partners (Razorpay & Cashfree). We do NOT store your full credit/debit card numbers or net banking passwords.</p>

<h2>2. Data Security & Storage</h2>
<p>Your data is stored using industry-standard encryption, Row Level Security (RLS), and HTTPS/TLS encryption during transmission. We comply with the Digital Personal Data Protection Act 2023 (DPDP).</p>

<h2>3. Third-Party Services</h2>
<p>We share minimal necessary data with authorized payment gateways (Razorpay, Cashfree) and cloud service providers solely for payment verification, invoice issuance, and platform delivery.</p>

<h2>4. Your Rights & Data Erasure</h2>
<p>You have the right to inspect, update, or request deletion of your personal data at any time. Contact <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> for privacy inquiries.</p>`}
    />
  ),
});
