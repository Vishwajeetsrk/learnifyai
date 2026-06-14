import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn, g as getRequestHeader } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}
const LOGO_URL = "https://id-preview--295c53aa-3c80-4f45-b788-d3d2b0a36d0a.lovable.app/__l5e/assets-v1/3b594ffd-98a6-4642-9661-dba29f6bb4c5/learnify-logo.png";
function buildHtml({
  courseTitle,
  score,
  total,
  verifyUrl,
  code,
  recipientName,
  issuedDate
}) {
  const pct = total ? Math.round(score / total * 100) : 0;
  const safeCode = escapeHtml(code);
  const safeTitle = escapeHtml(courseTitle);
  const safeUrl = escapeHtml(verifyUrl);
  const safeName = escapeHtml(recipientName ?? "there");
  const dateLine = escapeHtml(issuedDate ?? (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }));
  const scoreBlock = total > 0 ? `
    <tr><td style="padding:0 32px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:separate;background:#f5f3ff;border-radius:14px">
        <tr><td style="padding:18px;text-align:center">
          <div style="font-size:12px;letter-spacing:.18em;color:#4338ca;text-transform:uppercase;font-weight:600">Final score</div>
          <div style="font-size:30px;font-weight:800;color:#3730a3;margin-top:6px;font-family:Georgia,serif">${score} / ${total}</div>
          <div style="font-size:13px;color:#6366f1;margin-top:2px">${pct}% · Passing grade achieved</div>
        </td></tr>
      </table>
    </td></tr>` : "";
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
        © ${(/* @__PURE__ */ new Date()).getFullYear()} Learnify AI · All rights reserved
      </div>
    </td></tr>
  </table>
</body></html>`;
}
async function sendResend({
  to,
  subject,
  html,
  idempotencyKey
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) throw new Error("Email service not configured.");
  const body = JSON.stringify({
    from: "Learnify AI <onboarding@resend.dev>",
    to: [to],
    subject,
    html
  });
  const idemHeaders = idempotencyKey ? {
    "Idempotency-Key": idempotencyKey
  } : {};
  const gw = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LOVABLE_API_KEY ?? ""}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
      ...idemHeaders
    },
    body
  }).catch(() => null);
  if (gw && gw.ok) {
    const j2 = await gw.json().catch(() => ({}));
    return {
      messageId: j2?.id ?? null
    };
  }
  const direct = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
      ...idemHeaders
    },
    body
  });
  if (!direct.ok) {
    const t = await direct.text();
    throw new Error(`Email failed: ${direct.status} ${t.slice(0, 200)}`);
  }
  const j = await direct.json().catch(() => ({}));
  return {
    messageId: j?.id ?? null
  };
}
function resolveOrigin() {
  const origin = process.env.APP_URL || getRequestHeader("origin") || getRequestHeader("referer")?.replace(/^(https?:\/\/[^/]+).*/, "$1") || "https://learnify.ai";
  return origin.replace(/[^a-zA-Z0-9:/.\-_]/g, "");
}
const emailCertificate_createServerFn_handler = createServerRpc({
  id: "afdf7f4e89351c40abdc7faeec59a2afe24db5dbdf17bc8d2ca638aa04e73aae",
  name: "emailCertificate",
  filename: "src/lib/cert.functions.ts"
}, (opts) => emailCertificate.__executeServer(opts));
const emailCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  code: stringType().min(4).max(64).regex(/^[A-Za-z0-9-]+$/),
  to: stringType().email().max(254)
}).parse(d)).handler(emailCertificate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: cert,
    error
  } = await supabase.from("certificates").select("id, code, user_id, course_id, score, total, recipient_name").eq("code", data.code).single();
  if (error) throw new Error(error.message);
  if (cert.user_id !== userId) throw new Error("Not your certificate.");
  const {
    data: course
  } = await supabase.from("courses").select("title").eq("id", cert.course_id).single();
  const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(cert.code)}`;
  const html = buildHtml({
    courseTitle: course?.title ?? "your course",
    score: cert.score,
    total: cert.total,
    verifyUrl,
    code: cert.code,
    recipientName: cert.recipient_name
  });
  await sendResend({
    to: data.to,
    subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
    html
  });
  return {
    ok: true
  };
});
const adminEmailCertificate_createServerFn_handler = createServerRpc({
  id: "601c59f1d3b91e129f466dadc80c22dad8300800318af8ea507e69648fe75805",
  name: "adminEmailCertificate",
  filename: "src/lib/cert.functions.ts"
}, (opts) => adminEmailCertificate.__executeServer(opts));
const adminEmailCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  certificateId: stringType().uuid(),
  to: stringType().email().max(254).optional(),
  idempotencyKey: stringType().min(8).max(128).regex(/^[A-Za-z0-9:_-]+$/).optional()
}).parse(d)).handler(adminEmailCertificate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: roleRow
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).in("role", ["super_admin", "admin"]).limit(1).maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  const {
    data: cert,
    error
  } = await supabase.from("certificates").select("id, code, user_id, course_id, score, total, recipient_name").eq("id", data.certificateId).single();
  if (error || !cert) throw new Error(error?.message || "Certificate not found");
  let recipient = data.to;
  if (!recipient) {
    const {
      data: prof
    } = await supabase.from("profiles").select("email").eq("id", cert.user_id).maybeSingle();
    recipient = prof?.email ?? void 0;
  }
  if (!recipient) throw new Error("No recipient email on file");
  if (data.idempotencyKey) {
    const {
      data: existing
    } = await supabase.from("certificate_email_log").select("id, status, provider_message_id, recipient_email").eq("idempotency_key", data.idempotencyKey).maybeSingle();
    if (existing && (existing.status === "sent" || existing.status === "pending")) {
      return {
        ok: true,
        status: existing.status,
        recipient: existing.recipient_email,
        messageId: existing.provider_message_id,
        deduped: true
      };
    }
  }
  const {
    data: course
  } = await supabase.from("courses").select("title").eq("id", cert.course_id).maybeSingle();
  const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(cert.code)}`;
  const html = buildHtml({
    courseTitle: course?.title ?? "your course",
    score: cert.score,
    total: cert.total,
    verifyUrl,
    code: cert.code,
    recipientName: cert.recipient_name
  });
  let logId = null;
  if (data.idempotencyKey) {
    const {
      data: pending,
      error: insErr
    } = await supabase.from("certificate_email_log").insert({
      certificate_id: cert.id,
      recipient_email: recipient,
      status: "pending",
      sent_by: userId,
      idempotency_key: data.idempotencyKey
    }).select("id").single();
    if (insErr) {
      const {
        data: existing
      } = await supabase.from("certificate_email_log").select("id, status, provider_message_id, recipient_email").eq("idempotency_key", data.idempotencyKey).maybeSingle();
      if (existing) {
        return {
          ok: true,
          status: existing.status,
          recipient: existing.recipient_email,
          messageId: existing.provider_message_id,
          deduped: true
        };
      }
      throw new Error(insErr.message);
    }
    logId = pending.id;
  }
  try {
    const {
      messageId
    } = await sendResend({
      to: recipient,
      subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
      html,
      idempotencyKey: data.idempotencyKey
    });
    if (logId) {
      await supabase.from("certificate_email_log").update({
        status: "sent",
        provider_message_id: messageId,
        error: null,
        next_retry_at: null
      }).eq("id", logId);
    } else {
      await supabase.from("certificate_email_log").insert({
        certificate_id: cert.id,
        recipient_email: recipient,
        status: "sent",
        provider_message_id: messageId,
        sent_by: userId
      });
    }
    return {
      ok: true,
      status: "sent",
      recipient,
      messageId
    };
  } catch (e) {
    const errMsg = String(e?.message ?? e).slice(0, 500);
    const backoffMs = Math.min(3e4 * Math.pow(2, 0), 60 * 6e4);
    const nextRetry = new Date(Date.now() + backoffMs).toISOString();
    if (logId) {
      await supabase.from("certificate_email_log").update({
        status: "failed",
        error: errMsg,
        next_retry_at: nextRetry
      }).eq("id", logId);
    } else {
      await supabase.from("certificate_email_log").insert({
        certificate_id: cert.id,
        recipient_email: recipient,
        status: "failed",
        error: errMsg,
        sent_by: userId,
        next_retry_at: nextRetry
      });
    }
    throw new Error(errMsg);
  }
});
const retryPendingCertificateEmails_createServerFn_handler = createServerRpc({
  id: "504e67b3aad4cab0e2cfb54e1fcade68aadaf5924df935bd335cf29d093733bd",
  name: "retryPendingCertificateEmails",
  filename: "src/lib/cert.functions.ts"
}, (opts) => retryPendingCertificateEmails.__executeServer(opts));
const retryPendingCertificateEmails = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(retryPendingCertificateEmails_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: roleRow
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).in("role", ["super_admin", "admin"]).limit(1).maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: rows
  } = await supabase.from("certificate_email_log").select("id, certificate_id, recipient_email, attempt, max_attempts, idempotency_key").in("status", ["pending", "failed"]).lte("next_retry_at", nowIso).order("created_at", {
    ascending: true
  }).limit(20);
  let retried = 0, succeeded = 0, failed = 0;
  for (const row of rows ?? []) {
    if (row.attempt >= row.max_attempts) continue;
    retried++;
    const {
      data: cert
    } = await supabase.from("certificates").select("id, code, course_id, score, total, recipient_name").eq("id", row.certificate_id).single();
    if (!cert) {
      failed++;
      continue;
    }
    const {
      data: course
    } = await supabase.from("courses").select("title").eq("id", cert.course_id).maybeSingle();
    const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(cert.code)}`;
    const html = buildHtml({
      courseTitle: course?.title ?? "your course",
      score: cert.score,
      total: cert.total,
      verifyUrl,
      code: cert.code,
      recipientName: cert.recipient_name
    });
    try {
      const {
        messageId
      } = await sendResend({
        to: row.recipient_email,
        subject: `Your certificate — ${course?.title ?? "Learnify AI"}`,
        html,
        idempotencyKey: row.idempotency_key ?? void 0
      });
      await supabase.from("certificate_email_log").update({
        status: "sent",
        provider_message_id: messageId,
        error: null,
        attempt: row.attempt + 1,
        next_retry_at: null
      }).eq("id", row.id);
      succeeded++;
    } catch (e) {
      const nextAttempt = row.attempt + 1;
      const backoffMs = Math.min(3e4 * Math.pow(2, nextAttempt), 60 * 6e4);
      await supabase.from("certificate_email_log").update({
        status: nextAttempt >= row.max_attempts ? "failed" : "pending",
        error: String(e?.message ?? e).slice(0, 500),
        attempt: nextAttempt,
        next_retry_at: nextAttempt >= row.max_attempts ? null : new Date(Date.now() + backoffMs).toISOString()
      }).eq("id", row.id);
      failed++;
    }
  }
  return {
    retried,
    succeeded,
    failed
  };
});
export {
  adminEmailCertificate_createServerFn_handler,
  emailCertificate_createServerFn_handler,
  retryPendingCertificateEmails_createServerFn_handler
};
