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
      subtitle="Last updated: June 2, 2026."
      defaultContent={`<h2>1. What we collect</h2>
<p>Account info (name, email, avatar), learning activity (courses, progress, quiz answers), and content you create (notes, submissions). We never sell your data.</p>

<h2>2. How we use it</h2>
<p>To personalize your learning experience, power AI tutoring, issue certificates, and improve the platform. AI prompts are processed by trusted model providers and are not used to train third-party models.</p>

<h2>3. Storage & security</h2>
<p>Data is stored in encrypted databases with row-level security. Files live in private buckets accessible only to you and authorized admins.</p>

<h2>4. Your rights</h2>
<p>You can export, edit, or delete your data at any time from <em>Settings</em>. Email <a href="mailto:privacy@learnify.ai">privacy@learnify.ai</a> for any data request.</p>

<h2>5. Cookies</h2>
<p>We use essential cookies for authentication and minimal analytics to improve the product. No third-party advertising cookies.</p>

<h2>6. Children</h2>
<p>Learnify AI is not directed at children under 13. We do not knowingly collect data from minors without parental consent.</p>

<h2>7. Contact</h2>
<p>Questions? Reach <a href="mailto:privacy@learnify.ai">privacy@learnify.ai</a>.</p>`}
    />
  ),
});
