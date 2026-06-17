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
  const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY;
  const BREVO_SMTP_SERVER = process.env.BREVO_SMTP_SERVER;
  const BREVO_SMTP_PORT = process.env.BREVO_SMTP_PORT;
  const BREVO_SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN;

  // Try Resend first
  if (RESEND_API_KEY) {
    try {
      const emailFrom = process.env.EMAIL_FROM || "Learnify AI <onboarding@resend.dev>";
      const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: { user: "resend", pass: RESEND_API_KEY },
      });
      await transporter.sendMail({ from: emailFrom, to: [to], subject, html });
      return;
    } catch (err: any) {
      console.warn("Resend failed, trying Brevo...", err?.message?.slice(0, 120));
    }
  }

  // Fallback: Brevo REST API (no IP restrictions)
  if (BREVO_SMTP_KEY) {
    try {
      const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_SMTP_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Learnify AI", email: "noreply@learnify.ai" },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });
      if (!resp.ok) throw new Error(`Brevo API ${resp.status}`);
      return;
    } catch (err: any) {
      console.warn("Brevo API failed, trying SMTP...", err?.message?.slice(0, 120));
    }
  }

  // Last resort: Brevo SMTP (requires authorized IP)
  if (BREVO_SMTP_KEY && BREVO_SMTP_SERVER && BREVO_SMTP_LOGIN) {
    const emailFrom = process.env.EMAIL_FROM || "Learnify AI <noreply@learnify.ai>";
    const transporter = nodemailer.createTransport({
      host: BREVO_SMTP_SERVER,
      port: Number(BREVO_SMTP_PORT) || 587,
      secure: false,
      auth: { user: BREVO_SMTP_LOGIN, pass: BREVO_SMTP_KEY },
    });
    await transporter.sendMail({ from: emailFrom, to: [to], subject, html });
    return;
  }

  throw new Error("No email service configured. Set RESEND_API_KEY or BREVO_SMTP_KEY.");
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
