import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  email: z.string().email(),
  fullName: z.string().max(120).optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

import nodemailer from "nodemailer";

async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) throw new Error("Email service not configured.");

  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: RESEND_API_KEY,
    },
  });

  await transporter.sendMail({
    from: "Learnify AI <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  });
}

export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const name = data.fullName?.trim() || "Learner";
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(data.email);
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;color:#0f172a;line-height:1.6">
        <h1 style="font-size:24px;margin-bottom:12px;color:#111827">Welcome to Learnify AI, ${safeName}!</h1>
        <p style="font-size:16px;margin-bottom:16px">Your account is ready. Start exploring courses, building skills, and creating content in your Creator Studio.</p>
        <p style="font-size:16px;margin-bottom:16px">If you need help, just reply to this email or visit Learnify AI anytime.</p>
        <p style="font-size:16px;margin-bottom:0;font-weight:600">Happy learning,</p>
        <p style="font-size:16px;margin-top:4px;color:#475569">The Learnify AI team</p>
      </div>
    `;

    await sendResendEmail({
      to: safeEmail,
      subject: "Welcome to Learnify AI",
      html,
    });

    return { ok: true };
  });
