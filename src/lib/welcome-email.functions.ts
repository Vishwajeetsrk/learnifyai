import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ─── HTML escape ──────────────────────────────────────────────────
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Template variable interpolation ─────────────────────────────
function renderTemplate(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? escapeHtml(vars[key]) : `{{${key}}}`,
  );
}

// ─── Core sendEmail with fallback chain ───────────────────────────
export async function sendEmail({
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
  const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM || "Learnify AI <noreply@learnify.ai>";
  const gmailFrom = GMAIL_EMAIL
    ? `"Learnify AI" <${GMAIL_EMAIL}>`
    : emailFrom;

  // 1. Try Resend REST API (most reliable, domain-verified)
  if (RESEND_API_KEY) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: emailFrom, to: [to], subject, html }),
      });
      const body = await resp.text().catch(() => "");
      if (resp.ok) {
        console.log("[Email] Sent via Resend REST");
        return { provider: "resend-rest" };
      }
      if (!body.includes("not_verified") && !body.includes("validation_error")) {
        throw new Error(`Resend API ${resp.status}: ${body.slice(0, 120)}`);
      }
      console.warn("[Email] Resend: domain not verified, trying next...");
    } catch (err: any) {
      console.warn("[Email] Resend REST failed:", err?.message?.slice(0, 120));
    }
  }

  // 2. Try Brevo REST API
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
      if (resp.ok) {
        console.log("[Email] Sent via Brevo REST");
        return { provider: "brevo-rest" };
      }
      const body = await resp.text().catch(() => "");
      if (!body.includes("not_verified") && !body.includes("unauthorized")) {
        throw new Error(`Brevo API ${resp.status}: ${body.slice(0, 120)}`);
      }
      console.warn("[Email] Brevo: sender not verified, trying SMTP...");
    } catch (err: any) {
      console.warn("[Email] Brevo REST failed:", err?.message?.slice(0, 120));
    }
  }

  // 3. Try Brevo SMTP
  if (BREVO_SMTP_KEY && BREVO_SMTP_SERVER && BREVO_SMTP_LOGIN) {
    try {
      const transporter = nodemailer.createTransport({
        host: BREVO_SMTP_SERVER,
        port: Number(BREVO_SMTP_PORT) || 587,
        secure: false,
        auth: { user: BREVO_SMTP_LOGIN, pass: BREVO_SMTP_KEY },
      });
      await transporter.sendMail({ from: emailFrom, to: [to], subject, html });
      console.log("[Email] Sent via Brevo SMTP");
      return { provider: "brevo-smtp" };
    } catch (err: any) {
      console.warn("[Email] Brevo SMTP failed:", err?.message?.slice(0, 120));
    }
  }

  // 4. Try Gmail SMTP (most reliable fallback)
  if (GMAIL_EMAIL && GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
      });
      await transporter.sendMail({ from: gmailFrom, to: [to], subject, html });
      console.log("[Email] Sent via Gmail SMTP");
      return { provider: "gmail-smtp" };
    } catch (err: any) {
      console.warn("[Email] Gmail SMTP failed:", err?.message?.slice(0, 120));
      throw err;
    }
  }

  throw new Error(
    "Email failed: No working email provider configured. Set RESEND_API_KEY, BREVO_SMTP_KEY, or GMAIL_EMAIL + GMAIL_APP_PASSWORD.",
  );
}

// ─── Load template from DB ────────────────────────────────────────
async function loadTemplate(id: string): Promise<{ subject: string; html_body: string } | null> {
  const { data } = await (supabaseAdmin as any)
    .from("email_templates")
    .select("subject, html_body")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

// ─── Server Functions ─────────────────────────────────────────────

export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().email(), fullName: z.string().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const name = data.fullName?.trim() || "Learner";
    const tpl = await loadTemplate("welcome");

    let subject = `Welcome to Learnify AI, ${name}! 🎉`;
    let html: string;

    if (tpl) {
      subject = renderTemplate(tpl.subject, { name });
      html = renderTemplate(tpl.html_body, { name, email: data.email });
    } else {
      // Inline fallback — same premium template
      html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><title>Welcome to Learnify AI</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;">
<tr><td align="center" style="padding:48px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
<img src="https://learnifyaitool.vercel.app/logo.png" alt="Learnify AI" width="120" style="display:block;margin:0 auto 16px;"/>
<h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Welcome to Learnify AI</h1>
<p style="margin:8px 0 0;color:#a5b4fc;font-size:16px;">Your AI-Powered Learning Journey Starts Now</p>
</td></tr>
<tr><td style="background:#1e293b;padding:40px;">
<p style="margin:0 0 20px;color:#e2e8f0;font-size:18px;font-weight:600;">Hello, ${escapeHtml(name)}! 👋</p>
<p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">We're thrilled to have you join <strong style="color:#6366f1;">Learnify AI</strong> — the AI-native learning platform built for modern learners.</p>
<div style="text-align:center;margin-top:32px;">
<a href="https://learnifyaitool.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Start Learning Now →</a>
</div>
</td></tr>
<tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
<p style="margin:0;color:#475569;font-size:12px;">© 2025 Learnify AI · <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;">learnifyaitool.vercel.app</a></p>
</td></tr>
</table></td></tr></table>
</body></html>`;
    }

    await sendEmail({ to: data.email, subject, html });
    return { ok: true };
  });

// ─── Admin: list templates ─────────────────────────────────────────
export const adminListEmailTemplates = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await (supabaseAdmin as any)
    .from("email_templates")
    .select("id, name, subject, description, variables, updated_at")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as any[];
});

// ─── Admin: get single template ────────────────────────────────────
export const adminGetEmailTemplate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { data: tpl, error } = await (supabaseAdmin as any)
      .from("email_templates")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return tpl as { id: string; name: string; subject: string; html_body: string; description: string; variables: string[] } | null;
  });

// ─── Admin: save (upsert) template ────────────────────────────────
export const adminSaveEmailTemplate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        name: z.string().min(1),
        subject: z.string().min(1),
        html_body: z.string().min(1),
        description: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await (supabaseAdmin as any).from("email_templates").upsert(
      {
        id: data.id,
        name: data.name,
        subject: data.subject,
        html_body: data.html_body,
        description: data.description ?? "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ─── Admin: send test email ────────────────────────────────────────
export const adminSendTestEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        templateId: z.string(),
        to: z.string().email(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const tpl = await loadTemplate(data.templateId);
    if (!tpl) throw new Error("Template not found");

    // Fill all variables with sample data
    const sampleVars: Record<string, string> = {
      name: "Test User",
      email: data.to,
      course_title: "Introduction to AI",
      course_url: "https://learnifyaitool.vercel.app/courses/intro-ai",
      certificate_url: "https://learnifyaitool.vercel.app/certificates/demo",
      plan_name: "Pro Plan",
      plan_price: "₹999/month",
      next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-IN",
      ),
      reset_link: "https://learnifyaitool.vercel.app/reset-password?token=demo",
    };

    const subject = renderTemplate(tpl.subject, sampleVars);
    const html = renderTemplate(tpl.html_body, sampleVars);

    const result = await sendEmail({ to: data.to, subject, html });
    return { ok: true, provider: result.provider };
  });
