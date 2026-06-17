import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import nodemailer from "nodemailer";

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

const LOGO_URL =
<<<<<<< HEAD
  "https://id-preview--295c53aa-3c80-4f45-b788-d3d2b0a36d0a.lovable.app/__l5e/assets-v1/3b594ffd-98a6-4642-9661-dba29f6bb4c5/learnify-logo.png";
=======
  "/favicon.ico";
>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87

function buildHtml({
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
            View &amp; download certificate
          </a>
          <div style="margin-top:10px;font-size:12px;color:#64748b">Open the link to download as PDF, print, or share.</div>
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

async function sendResend({
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

  const headers = idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined;

  const info = await transporter.sendMail({
    from: "Learnify AI <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
    headers,
  });
  
  return { messageId: info.messageId };
}

function resolveOrigin(): string {
  const origin =
    process.env.APP_URL ||
    getRequestHeader("origin") ||
    getRequestHeader("referer")?.replace(/^(https?:\/\/[^/]+).*/, "$1") ||
    "https://learnify.ai";
  return origin.replace(/[^a-zA-Z0-9:/.\-_]/g, "");
}

/** Email a certificate link to the recipient (learner's own cert). */
export const emailCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
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
    await sendResend({
      to: data.to,
      subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
      html,
    });
    return { ok: true };
  });

/** Admin: send/resend any certificate by id, logging the attempt. */
export const adminEmailCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
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
    if (data.idempotencyKey) {
      const { data: existing } = await supabase
        .from("certificate_email_log")
        .select("id, status, provider_message_id, recipient_email")
        .eq("idempotency_key", data.idempotencyKey)
        .maybeSingle();
      if (existing && (existing.status === "sent" || existing.status === "pending")) {
        return {
          ok: true,
          status: existing.status as "sent" | "pending",
          recipient: existing.recipient_email,
          messageId: existing.provider_message_id,
          deduped: true,
        };
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
      const { messageId } = await sendResend({
        to: recipient,
        subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
        html,
        idempotencyKey: data.idempotencyKey,
      });
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
      if (row.attempt >= row.max_attempts) continue;
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
        const { messageId } = await sendResend({
          to: row.recipient_email,
          subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
          html,
          idempotencyKey: row.idempotency_key ?? undefined,
        });
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
            status: nextAttempt >= row.max_attempts ? "failed" : "pending",
            error: String(e?.message ?? e).slice(0, 500),
            attempt: nextAttempt,
            next_retry_at:
              nextAttempt >= row.max_attempts
                ? null
                : new Date(Date.now() + backoffMs).toISOString(),
          })
          .eq("id", row.id);
        failed++;
      }
    }
    return { retried, succeeded, failed };
  });
