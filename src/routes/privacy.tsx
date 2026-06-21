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
  }),
  component: () => (
    <CustomPageContent
      pageKey="privacy"
      title="Your data, your control."
      subtitle="Last updated: June 21, 2026."
      defaultContent={`<h2>1. Data We Collect</h2>
<p>We collect account credentials (name, email, avatar seed), transaction histories, subscription statuses, billing info (GSTIN, legal name for team accounts), course progress, playground code snippets, and workspace metadata. We do not store credit card credentials; all payments are processed securely by Cashfree.</p>

<h2>2. How We Use Your Data</h2>
<p>To personalize learning paths, run automated code playground executions, issue certificates, process Cashfree subscription renewals, verify payment webhooks, and provide fallback AI queries. AI prompts sent to Groq, Gemini, or OpenRouter are not used for third-party training.</p>

<h2>3. Sharing with Third Parties</h2>
<p>We share necessary transactional and subscription tokens with Cashfree to manage mandates and renewals. We do not sell or lease user data to third-party advertisers.</p>

<h2>4. Storage & Security</h2>
<p>Data is stored in encrypted databases with row-level security. Files live in private buckets accessible only to you and authorized admins.</p>

<h2>5. Your Rights</h2>
<p>You can export, edit, or delete your data at any time from Settings. Email <a href="mailto:privacy@learnify.ai">privacy@learnify.ai</a> for any data request.</p>`}
    />
  ),
});
