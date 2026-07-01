import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
// nodemailer is loaded lazily (dynamic import) — never bundled for the browser.

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function resolveOrigin(): string {
  const origin =
    process.env.APP_URL ||
    getRequestHeader("origin") ||
    getRequestHeader("referer")?.replace(/^(https?:\/\/[^/]+).*/, "$1") ||
    "https://learnifyaitool.vercel.app";
  return origin.replace(/[^a-zA-Z0-9:/.\-_]/g, "");
}

const LOGO_URL = "https://learnifyaitool.vercel.app/favicon.ico";

export function buildHtml({
  courseTitle,
  score,
  total,
  verifyUrl,
  code,
  recipientName,
  issuedDate,
}: {
  courseTitle: string;
  score: number;
  total: number;
  verifyUrl: string;
  code: string;
  recipientName?: string | null;
  issuedDate?: string;
}) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  const safeCode = escapeHtml(code);
  const safeTitle = escapeHtml(courseTitle);
  const safeUrl = escapeHtml(verifyUrl);
  const safeName = escapeHtml(recipientName ?? "there");
  const dateLine = escapeHtml(
    issuedDate ??
      new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  );

  const scoreBlock =
    total > 0
      ? `
    <tr><td style="padding:0 32px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:separate;background:#f5f3ff;border-radius:14px">
        <tr><td style="padding:18px;text-align:center">
          <div style="font-size:12px;letter-spacing:.18em;color:#4338ca;text-transform:uppercase;font-weight:600">Final score</div>
          <div style="font-size:30px;font-weight:800;color:#3730a3;margin-top:6px;font-family:Georgia,serif">${score} / ${total}</div>
          <div style="font-size:13px;color:#6366f1;margin-top:2px">${pct}% · Passing grade achieved</div>
        </td></tr>
      </table>
    </td></tr>`
      : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Learnify AI certificate</title></head>
<body style="margin:0;padding:0;background:#f4f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5fb;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08)">
        <!-- Brand bar -->
        <tr><td style="background:linear-gradient(135deg,#0f1b3d 0%,#1e3a8a 60%,#4f46e5 100%);padding:28px 32px;text-align:center">
          <img src="${LOGO_URL}" alt="Learnify AI" width="56" height="56" style="display:inline-block;border:0;background:#fff;border-radius:14px;padding:8px;margin-bottom:10px">
          <div style="color:#fde68a;font-size:11px;letter-spacing:.35em;text-transform:uppercase;font-weight:700">Learnify AI · Verified Certificate</div>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:36px 32px 8px;text-align:center">
          <div style="font-size:13px;letter-spacing:.2em;color:#4f46e5;text-transform:uppercase;font-weight:700">Congratulations 🎓</div>
          <h1 style="margin:10px 0 6px;font-size:26px;line-height:1.25;color:#0f172a;font-family:Georgia,'Playfair Display',serif">Hi ${safeName}, your certificate is ready</h1>
          <p style="margin:0;color:#475569;font-size:15px;line-height:1.55">
            You've successfully completed <strong style="color:#0f172a">${safeTitle}</strong>.
            This certificate is digitally signed and verifiable.
          </p>
        </td></tr>

        ${scoreBlock}

        <!-- CTA -->
        <tr><td style="padding:28px 32px 8px;text-align:center">
          <a href="${safeUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 6px 16px rgba(79,70,229,.35)">
            View &amp; Download Certificate
          </a>
          <div style="margin-top:10px;font-size:12px;color:#64748b">Click above to view your certificate and download it as a PDF.</div>
        </td></tr>

        <!-- Details -->
        <tr><td style="padding:24px 32px 8px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc">
            <tr><td style="padding:14px 18px;font-size:13px;color:#334155">
              <div><strong style="color:#0f172a">Course:</strong> ${safeTitle}</div>
              <div style="margin-top:6px"><strong style="color:#0f172a">Recipient:</strong> ${safeName}</div>
              <div style="margin-top:6px"><strong style="color:#0f172a">Issued:</strong> ${dateLine}</div>
              <div style="margin-top:6px"><strong style="color:#0f172a">Verification code:</strong> <code style="background:#e2e8f0;padding:2px 6px;border-radius:6px;font-family:Menlo,Consolas,monospace;font-size:12px">${safeCode}</code></div>
              <div style="margin-top:8px;font-size:12px;color:#64748b;word-break:break-all">Verify: <a href="${safeUrl}" style="color:#4f46e5;text-decoration:none">${safeUrl}</a></div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 32px 32px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9">
          <div style="margin-bottom:6px;color:#475569;font-weight:600">Learnify AI</div>
          <div>You're receiving this email because a certificate was issued to ${safeName}.</div>
          <div style="margin-top:6px">Need help? Reply to this email or visit our support page.</div>
        </td></tr>
      </table>

      <div style="max-width:600px;margin:14px auto 0;text-align:center;color:#94a3b8;font-size:11px">
        © ${new Date().getFullYear()} Learnify AI · All rights reserved
      </div>
    </td></tr>
  </table>
</body></html>`;
}

async function sendViaBrevoApi({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@learnify.ai";
  const senderName = process.env.BREVO_SENDER_NAME || "Learnify AI";
  if (!apiKey) throw new Error("No Brevo API key configured (BREVO_API_KEY or BREVO_SMTP_KEY)");
  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    if (resp.status === 401) {
      console.warn("Brevo API auth failed. Set BREVO_API_KEY (v3 API key), not an SMTP password.");
    }
    throw new Error(`Brevo API ${resp.status}: ${body.slice(0, 200)}`);
  }
  const json = await resp.json();
  return { messageId: json.messageId, provider: "brevo-api" };
}

export async function sendEmail({
  to,
  subject,
  html,
  idempotencyKey,
}: {
  to: string;
  subject: string;
  html: string;
  idempotencyKey?: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
  const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY;
  const BREVO_SMTP_SERVER = process.env.BREVO_SMTP_SERVER;
  const BREVO_SMTP_PORT = process.env.BREVO_SMTP_PORT;
  const BREVO_SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN;
  const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM || "Learnify AI <noreply@learnify.ai>";

  // 1. Try Gmail SMTP (app password, most reliable)
  if (GMAIL_EMAIL && GMAIL_APP_PASSWORD) {
    try {
      const moduleName = "nodemailer";
      const { default: nodemailer } = await import(moduleName);
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });
      const info = await transporter.sendMail({
        from: `"Learnify AI" <${GMAIL_EMAIL}>`,
        to: [to],
        subject,
        html,
      });
      console.log("Email sent via Gmail SMTP:", info.messageId);
      return { messageId: info.messageId, provider: "gmail" };
    } catch (err: any) {
      console.warn("Gmail SMTP failed, trying Resend...", err?.message);
    }
  }

  let domainUnverified = false;

  // 2. Try Resend REST API
  if (RESEND_API_KEY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [to],
          subject,
          html,
          headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
        }),
      });
      clearTimeout(timeout);
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        console.warn(`Resend REST API error ${resp.status}:`, body.slice(0, 200));
        if (resp.status === 422 && body.includes("verified")) {
          domainUnverified = true;
          console.warn("Resend REST: sender domain not verified, trying alternatives...");
        } else {
          throw new Error(`Resend API ${resp.status}: ${body.slice(0, 200)}`);
        }
      } else {
        const json = await resp.json();
        console.log("Email sent via Resend API:", json.id);
        return { messageId: json.id, provider: "resend-api" };
      }
    } catch (err: any) {
      console.warn("Resend REST API failed, trying Brevo...", err?.message?.slice(0, 120));
    }
  }

  // 3. Try Brevo API
  if (BREVO_API_KEY) {
    try {
      const result = await sendViaBrevoApi({ to, subject, html });
      console.log("Email sent via Brevo API:", result.messageId);
      return result;
    } catch (err: any) {
      console.warn("Brevo API failed, trying alternatives...", err?.message?.slice(0, 120));
    }
  }

  // 4. Try Resend SMTP (always try, even if REST failed with domain verification)
  if (RESEND_API_KEY) {
    try {
      const moduleName = "nodemailer";
      const { default: nodemailer } = await import(moduleName);
      const transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: { user: "resend", pass: RESEND_API_KEY },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });
      const info = await transporter.sendMail({
        from: emailFrom,
        to: [to],
        subject,
        html,
        headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
      });
      console.log("Email sent via Resend SMTP:", info.messageId);
      return { messageId: info.messageId, provider: "resend-smtp" };
    } catch (err: any) {
      console.warn("Resend SMTP failed, trying alternatives...", err?.message?.slice(0, 120));
    }
  }

  // 5. Try Brevo SMTP (requires authorized IP in Brevo dashboard)
  if (BREVO_SMTP_KEY && BREVO_SMTP_SERVER && BREVO_SMTP_LOGIN) {
    try {
      const moduleName = "nodemailer";
      const { default: nodemailer } = await import(moduleName);
      const transporter = nodemailer.createTransport({
        host: BREVO_SMTP_SERVER,
        port: Number(BREVO_SMTP_PORT) || 587,
        secure: false,
        auth: { user: BREVO_SMTP_LOGIN, pass: BREVO_SMTP_KEY },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });
      const info = await transporter.sendMail({
        from: emailFrom,
        to: [to],
        subject,
        html,
      });
      console.log("Email sent via Brevo SMTP:", info.messageId);
      return { messageId: info.messageId, provider: "brevo-smtp" };
    } catch (err: any) {
      console.warn("Brevo SMTP failed, trying Gmail...", err?.message?.slice(0, 120));
    }
  }

  const hints: string[] = [];
  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
    hints.push("Missing GMAIL_EMAIL or GMAIL_APP_PASSWORD");
  }
  if (RESEND_API_KEY) {
    hints.push("Resend sender domain not verified — add/verify a domain at resend.com/domains");
  } else {
    hints.push("Missing RESEND_API_KEY");
  }
  if (!BREVO_API_KEY) hints.push("Missing BREVO_API_KEY");
  throw new Error(
    `Email delivery failed! Please configure an email provider in your .env file (${hints.join(", ")}).`,
  );
}

/** Test email sending — reports detailed provider results. */
export const testEmailSending = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ email1: z.string().email(), email2: z.string().email() }).parse(d),
  )
  .handler(async ({ data }) => {
    const results: { provider: string; ok: boolean; error?: string }[] = [];
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
    const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const emailFrom = process.env.EMAIL_FROM || "Learnify AI <noreply@learnify.ai>";
    const testHtml = `<div style="font-family:sans-serif;padding:24px"><h2>Test email from Learnify AI</h2><p>If you received this, email sending is working.</p></div>`;

    for (const email of [data.email1, data.email2]) {
      // Test Resend REST API
      if (RESEND_API_KEY) {
        try {
          const r = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: emailFrom,
              to: [email],
              subject: "Learnify AI — test email",
              html: testHtml,
            }),
          });
          const body = await r.text().catch(() => "");
          results.push({
            provider: `Resend REST → ${email}`,
            ok: r.ok,
            error: r.ok ? undefined : `${r.status}: ${body.slice(0, 120)}`,
          });
        } catch (e: any) {
          results.push({ provider: `Resend REST → ${email}`, ok: false, error: e?.message });
        }
      } else {
        results.push({
          provider: `Resend REST → ${email}`,
          ok: false,
          error: "No RESEND_API_KEY set",
        });
      }

      // Test Brevo API
      if (BREVO_API_KEY) {
        try {
          const r = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              sender: { name: "Learnify AI", email: "noreply@learnify.ai" },
              to: [{ email }],
              subject: "Learnify AI — test email",
              htmlContent: `<p>Test email</p>`,
            }),
          });
          const body = await r.text().catch(() => "");
          results.push({
            provider: `Brevo API → ${email}`,
            ok: r.ok,
            error: r.ok ? undefined : `${r.status}: ${body.slice(0, 120)}`,
          });
        } catch (e: any) {
          results.push({ provider: `Brevo API → ${email}`, ok: false, error: e?.message });
        }
      } else {
        results.push({
          provider: `Brevo API → ${email}`,
          ok: false,
          error: "No BREVO_API_KEY set",
        });
      }

      // Test Gmail SMTP
      if (GMAIL_EMAIL && GMAIL_APP_PASSWORD) {
        try {
          const moduleName = "nodemailer";
          const { default: nodemailer } = await import(moduleName);
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
          });
          const info = await transporter.sendMail({
            from: `"Learnify AI" <${GMAIL_EMAIL}>`,
            to: [email],
            subject: "Learnify AI — test email",
            html: `<p>Test email from Gmail</p>`,
          });
          results.push({ provider: `Gmail SMTP → ${email}`, ok: true, error: undefined });
        } catch (e: any) {
          results.push({ provider: `Gmail SMTP → ${email}`, ok: false, error: e?.message });
        }
      } else {
        results.push({
          provider: `Gmail SMTP → ${email}`,
          ok: false,
          error: "GMAIL_EMAIL or GMAIL_APP_PASSWORD not set",
        });
      }
    }

    return { results };
  });

/** Email a certificate link to the recipient (learner's own cert). */
export const emailCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        code: z
          .string()
          .min(4)
          .max(64)
          .regex(/^[A-Za-z0-9-]+$/),
        to: z.string().email().max(254),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: cert, error } = await supabase
      .from("certificates")
      .select("id, code, user_id, course_id, score, total, recipient_name")
      .eq("code", data.code)
      .single();
    if (error) throw new Error(error.message);
    if (cert.user_id !== userId) throw new Error("Not your certificate.");

    const { data: course } = await supabase
      .from("courses")
      .select("title")
      .eq("id", cert.course_id)
      .single();

    const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(cert.code)}`;
    const html = buildHtml({
      courseTitle: course?.title ?? "your course",
      score: cert.score,
      total: cert.total,
      verifyUrl,
      code: cert.code,
      recipientName: cert.recipient_name,
    });
    await sendEmail({
      to: data.to,
      subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
      html,
    });
    return { ok: true };
  });

/** Admin: send/resend any certificate by id, logging the attempt. */
export const adminEmailCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        certificateId: z.string().uuid(),
        to: z.string().email().max(254).optional(),
        idempotencyKey: z
          .string()
          .min(8)
          .max(128)
          .regex(/^[A-Za-z0-9:_-]+$/)
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["super_admin", "admin"])
      .limit(1)
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { data: cert, error } = await supabase
      .from("certificates")
      .select("id, code, user_id, course_id, score, total, recipient_name")
      .eq("id", data.certificateId)
      .single();
    if (error || !cert) throw new Error(error?.message || "Certificate not found");

    let recipient = data.to;
    if (!recipient) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", cert.user_id)
        .maybeSingle();
      recipient = prof?.email ?? undefined;
    }
    if (!recipient) throw new Error("No recipient email on file");

    // Idempotency: if a row with this key already exists, short-circuit.
    // BUT allow retries if the previous attempt failed (not sent).
    if (data.idempotencyKey) {
      const { data: existing } = await supabase
        .from("certificate_email_log")
        .select("id, status, provider_message_id, recipient_email")
        .eq("idempotency_key", data.idempotencyKey)
        .maybeSingle();
      if (existing && existing.status === "sent") {
        return {
          ok: true,
          status: existing.status as "sent",
          recipient: existing.recipient_email,
          messageId: existing.provider_message_id,
          deduped: true,
        };
      }
      // If previous attempt was "pending" or "failed", delete it and re-send
      if (existing && (existing.status === "pending" || existing.status === "failed")) {
        await supabase.from("certificate_email_log").delete().eq("id", existing.id);
      }
    }

    const { data: course } = await supabase
      .from("courses")
      .select("title")
      .eq("id", cert.course_id)
      .maybeSingle();

    const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(cert.code)}`;
    const html = buildHtml({
      courseTitle: course?.title ?? "your course",
      score: cert.score,
      total: cert.total,
      verifyUrl,
      code: cert.code,
      recipientName: cert.recipient_name,
    });

    // Reserve a pending row first (unique idempotency key protects against duplicate inserts).
    let logId: string | null = null;
    if (data.idempotencyKey) {
      const { data: pending, error: insErr } = await supabase
        .from("certificate_email_log")
        .insert({
          certificate_id: cert.id,
          recipient_email: recipient,
          status: "pending",
          sent_by: userId,
          attempt: 0,
          max_attempts: 5,
          next_retry_at: new Date(Date.now() + 30_000).toISOString(),
          idempotency_key: data.idempotencyKey,
        })
        .select("id")
        .single();
      if (insErr) {
        // Race: another caller reserved the same key — return its current state.
        const { data: existing } = await supabase
          .from("certificate_email_log")
          .select("id, status, provider_message_id, recipient_email")
          .eq("idempotency_key", data.idempotencyKey)
          .maybeSingle();
        if (existing) {
          return {
            ok: true,
            status: existing.status as any,
            recipient: existing.recipient_email,
            messageId: existing.provider_message_id,
            deduped: true,
          };
        }
        throw new Error(insErr.message);
      }
      logId = pending.id;
    }

    try {
      const emailPromise = sendEmail({
        to: recipient,
        subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
        html,
        idempotencyKey: data.idempotencyKey,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Email send timed out (20s limit)")), 20_000),
      );
      const { messageId } = await Promise.race([emailPromise, timeoutPromise]);
      if (logId) {
        await supabase
          .from("certificate_email_log")
          .update({
            status: "sent",
            provider_message_id: messageId,
            error: null,
            next_retry_at: null,
          })
          .eq("id", logId);
      } else {
        await supabase.from("certificate_email_log").insert({
          certificate_id: cert.id,
          recipient_email: recipient,
          status: "sent",
          provider_message_id: messageId,
          sent_by: userId,
        });
      }
      return { ok: true, status: "sent" as const, recipient, messageId };
    } catch (e: any) {
      const errMsg = String(e?.message ?? e).slice(0, 500);
      // Schedule exponential backoff retry: 30s * 2^attempt, capped to 1h.
      const backoffMs = Math.min(30_000 * Math.pow(2, 0), 60 * 60_000);
      const nextRetry = new Date(Date.now() + backoffMs).toISOString();
      if (logId) {
        await supabase
          .from("certificate_email_log")
          .update({
            status: "failed",
            error: errMsg,
            next_retry_at: nextRetry,
          })
          .eq("id", logId);
      } else {
        await supabase.from("certificate_email_log").insert({
          certificate_id: cert.id,
          recipient_email: recipient,
          status: "failed",
          error: errMsg,
          sent_by: userId,
          next_retry_at: nextRetry,
        });
      }
      throw new Error(errMsg);
    }
  });

/** Admin: retry any pending/failed email rows whose next_retry_at has elapsed. */
export const retryPendingCertificateEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["super_admin", "admin"])
      .limit(1)
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const nowIso = new Date().toISOString();
    const { data: rows } = await supabase
      .from("certificate_email_log")
      .select("id, certificate_id, recipient_email, attempt, max_attempts, idempotency_key")
      .in("status", ["pending", "failed"])
      .lte("next_retry_at", nowIso)
      .order("created_at", { ascending: true })
      .limit(20);

    let retried = 0,
      succeeded = 0,
      failed = 0;
    for (const row of rows ?? []) {
      const maxAttempts = row.max_attempts ?? 5;
      if (row.attempt >= maxAttempts) continue;
      retried++;
      const { data: cert } = await supabase
        .from("certificates")
        .select("id, code, course_id, score, total, recipient_name")
        .eq("id", row.certificate_id)
        .single();
      if (!cert) {
        failed++;
        continue;
      }
      const { data: course } = await supabase
        .from("courses")
        .select("title")
        .eq("id", cert.course_id)
        .maybeSingle();

      const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(cert.code)}`;
      const html = buildHtml({
        courseTitle: course?.title ?? "your course",
        score: cert.score,
        total: cert.total,
        verifyUrl,
        code: cert.code,
        recipientName: cert.recipient_name,
      });

      try {
        const emailPromise = sendEmail({
          to: row.recipient_email,
          subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
          html,
          idempotencyKey: row.idempotency_key ?? undefined,
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Email send timed out")), 20_000),
        );
        const { messageId } = await Promise.race([emailPromise, timeoutPromise]);
        await supabase
          .from("certificate_email_log")
          .update({
            status: "sent",
            provider_message_id: messageId,
            error: null,
            attempt: row.attempt + 1,
            next_retry_at: null,
          })
          .eq("id", row.id);
        succeeded++;
      } catch (e: any) {
        const nextAttempt = row.attempt + 1;
        const backoffMs = Math.min(30_000 * Math.pow(2, nextAttempt), 60 * 60_000);
        await supabase
          .from("certificate_email_log")
          .update({
            status: nextAttempt >= maxAttempts ? "failed" : "pending",
            error: String(e?.message ?? e).slice(0, 500),
            attempt: nextAttempt,
            next_retry_at:
              nextAttempt >= maxAttempts ? null : new Date(Date.now() + backoffMs).toISOString(),
          })
          .eq("id", row.id);
        failed++;
      }
    }
    return { retried, succeeded, failed };
  });

export const getCertificateAnalytics = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = (await import("@/integrations/supabase/client")).supabase;

    const [certsResult, templatesResult, emailResult, auditResult] = await Promise.all([
      supabase.from("certificates").select("id, issued_at, course_id, courses:course_id(title)"),
      supabase.from("certificate_templates").select("id"),
      supabase.from("certificate_email_log").select("id, status"),
      supabase.from("certificate_audit_log").select("id, action, course_title, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const certs = certsResult.data ?? [];
    const totalIssued = certs.length;
    const activeTemplates = (templatesResult.data ?? []).length;
    const totalVerified = (emailResult.data ?? []).filter((r) => r.status === "sent").length;

    const monthlyCounts: Record<string, number> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyCounts[key] = 0;
    }
    certs.forEach((c) => {
      if (!c.issued_at) return;
      const d = new Date(c.issued_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key in monthlyCounts) monthlyCounts[key] = (monthlyCounts[key] ?? 0) + 1;
    });
    const monthlyGrowth = Object.values(monthlyCounts);

    const recentIssues = (auditResult.data ?? [])
      .filter((r) => r.action === "issued" || r.action === "bulk_issued")
      .slice(0, 5)
      .map((r) => ({
        date: r.created_at?.slice(0, 10) ?? "",
        course: r.course_title ?? "Unknown",
        count: 1,
      }));

    return {
      totalIssued,
      totalVerified,
      activeTemplates,
      monthlyGrowth,
      recentIssues,
    };
  }
);
