import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Learnify AI" },
      { name: "description", content: "Learnify AI Terms of Service — your rights and responsibilities." },
      { property: "og:title", content: "Terms of Service — Learnify AI" },
      { property: "og:description", content: "The terms governing your use of the Learnify AI platform." },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="terms"
      title="Terms of Service"
      subtitle="Last updated: June 2, 2026. By using Learnify AI, you agree to these terms."
      defaultContent={`<h2>1. Acceptance of Terms</h2>
<p>By accessing or using Learnify AI ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>

<h2>2. Account Registration</h2>
<p>You must create an account to access certain features. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be at least 13 years old to use the Platform.</p>

<h2>3. Courses & Content</h2>
<p>Courses are provided by creators ("Instructors"). Learnify AI is not responsible for the accuracy or quality of instructor-provided content. We reserve the right to remove any content that violates our policies.</p>

<h2>4. Payments & Refunds</h2>
<p>Paid courses are processed through our payment partner Cashfree. Refunds are governed by our <a href="/refund-policy">Refund Policy</a>. Learnify AI takes a platform fee; remaining revenue is paid to Instructors.</p>

<h2>5. Prohibited Conduct</h2>
<p>You may not use the Platform to: violate laws, infringe intellectual property, distribute malware, harass others, scrape data, or bypass payment systems.</p>

<h2>6. AI Features</h2>
<p>AI tutoring, doubt solving, and content generation tools are provided "as is." Outputs may contain errors. You are responsible for reviewing AI-generated content before use.</p>

<h2>7. Termination</h2>
<p>We may suspend or terminate accounts for violations of these terms. You may delete your account at any time from Settings.</p>

<h2>8. Limitation of Liability</h2>
<p>Learnify AI is not liable for indirect, incidental, or consequential damages arising from your use of the Platform, to the maximum extent permitted by law.</p>

<h2>9. Changes</h2>
<p>We may update these terms. Continued use after changes constitutes acceptance. Material changes will be notified via email or platform notice.</p>

<h2>10. Contact</h2>
<p>Questions? Email <a href="mailto:hello@learnify.ai">hello@learnify.ai</a>.</p>`}
    />
  ),
});
