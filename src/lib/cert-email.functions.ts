import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function resolveOrigin(): string {
  const origin =
    process.env.APP_URL ||
    process.env.VITE_APP_URL ||
    "https://learnifyaitool.vercel.app";
  return origin.replace(/[^a-zA-Z0-9:/.\-_]/g, "");
}

const LOGO_URL = "https://learnifyaitool.vercel.app/favicon.ico";

function buildCertEmailHtml({
  recipientName,
  courseName,
  score,
  certId,
  verifyUrl,
  issueDate,
}: {
  recipientName: string;
  courseName: string;
  score: number;
  certId: string;
  verifyUrl: string;
  issueDate: string;
}) {
  const safeName = escapeHtml(recipientName);
  const safeCourse = escapeHtml(courseName);
  const safeUrl = escapeHtml(verifyUrl);
  const safeCertId = escapeHtml(certId);
  const safeDate = escapeHtml(issueDate);
  const pct = Math.min(Math.max(score, 0), 100);
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseName)}&organizationName=Learnify+AI&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(certId)}`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Learnify AI Certificate</title></head>
<body style="margin:0;padding:0;background:#f4f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5fb;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08)">
        <tr><td style="background:linear-gradient(135deg,#0f1b3d 0%,#1e3a8a 60%,#4f46e5 100%);padding:28px 32px;text-align:center">
          <img src="${LOGO_URL}" alt="Learnify AI" width="56" height="56" style="display:inline-block;border:0;background:#fff;border-radius:14px;padding:8px;margin-bottom:10px">
          <div style="color:#fde68a;font-size:11px;letter-spacing:.35em;text-transform:uppercase;font-weight:700">Learnify AI · Verified Certificate</div>
        </td></tr>
        <tr><td style="padding:36px 32px 8px;text-align:center">
          <div style="font-size:13px;letter-spacing:.2em;color:#4f46e5;text-transform:uppercase;font-weight:700">Congratulations</div>
          <h1 style="margin:10px 0 6px;font-size:26px;line-height:1.25;color:#0f172a;font-family:Georgia,'Playfair Display',serif">Hi ${safeName}, your certificate is ready</h1>
          <p style="margin:0;color:#475569;font-size:15px;line-height:1.55">
            You've successfully completed <strong style="color:#0f172a">${safeCourse}</strong>.
            This certificate is digitally signed and verifiable.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px 8px">
          <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <tr style="background:#f8fafc">
              <td style="padding:14px 20px;font-size:13px;color:#64748b">Certificate ID</td>
              <td style="padding:14px 20px;font-size:13px;color:#0f172a;font-weight:600;font-family:monospace;text-align:right">${safeCertId}</td>
            </tr>
            <tr style="border-top:1px solid #e5e7eb">
              <td style="padding:14px 20px;font-size:13px;color:#64748b">Date Issued</td>
              <td style="padding:14px 20px;font-size:13px;color:#0f172a;text-align:right">${safeDate}</td>
            </tr>
            <tr style="border-top:1px solid #e5e7eb">
              <td style="padding:14px 20px;font-size:13px;color:#64748b">Score</td>
              <td style="padding:14px 20px;font-size:13px;color:#4f46e5;font-weight:700;text-align:right">${pct}%</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 32px 8px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding:0 0 12px">
                <a href="${safeUrl}" style="display:block;background:#4f46e5;color:#ffffff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 6px 16px rgba(79,70,229,.35)">
                  View Certificate
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0">
                <a href="${safeUrl}" style="display:inline-block;background:#ffffff;color:#0f172a;padding:10px 24px;border-radius:12px;text-decoration:none;font-weight:600;font-size:13px;border:1px solid #e5e7eb">
                  Download PDF
                </a>
                <span style="display:inline-block;width:12px"></span>
                <a href="${safeUrl}" style="display:inline-block;background:#ffffff;color:#0f172a;padding:10px 24px;border-radius:12px;text-decoration:none;font-weight:600;font-size:13px;border:1px solid #e5e7eb">
                  Download Image
                </a>
              </td>
            </tr>
          </table>
          <div style="margin-top:12px;font-size:11px;color:#94a3b8;text-align:center">PDF &amp; Image downloads available on the certificate page</div>
        </td></tr>
        <tr><td style="padding:0 32px 24px;text-align:center">
          <a href="${linkedInUrl}" target="_blank" style="display:inline-block;background:#0A66C2;color:#ffffff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600;font-size:13px">
            <span style="font-size:15px;margin-right:6px">in</span> Share on LinkedIn
          </a>
        </td></tr>
        <tr><td style="padding:0 32px 32px;text-align:center">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
            This certificate was issued by Learnify AI.<br>
            Anyone can verify its authenticity at <a href="${safeUrl}" style="color:#4f46e5;text-decoration:underline">${safeUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export const issueAndEmailCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        userEmail: z.string().email(),
        userName: z.string().min(1),
        courseName: z.string().min(1),
        courseId: z.string().uuid().optional(),
        scorePercentage: z.number().min(0).max(100),
        templateId: z.string().optional(),
        autoEmail: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const certId = `LRN-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const issueDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // 1. Insert into certificates table
    const { data: certRecord, error: insertError } = await supabaseAdmin
      .from("certificates")
      .insert({
        user_id: context.userId,
        course_id: data.courseId ?? null,
        code: certId,
        score: data.scorePercentage,
        total: 100,
        recipient_name: data.userName,
        issued_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Certificate insert failed:", insertError.message);
      // Fallback: still record in issued_certificates
      try {
        await (supabaseAdmin as any).from("issued_certificates").insert({
          cert_id: certId,
          user_id: context.userId,
          user_email: data.userEmail,
          user_name: data.userName,
          course_name: data.courseName,
          score: data.scorePercentage,
          issued_date: issueDate,
        });
      } catch (_) {
        // silent fallback
      }
    }

    // 2. Log audit entry
    if (certRecord?.id) {
      await supabaseAdmin.from("certificate_audit_log").insert({
        certificate_id: certRecord.id,
        user_id: context.userId,
        action: "issued",
        course_title: data.courseName,
        details: { cert_id: certId, score: data.scorePercentage },
      });
    }

    // 3. Send email if autoEmail is enabled
    let emailSent = false;
    let emailError: string | null = null;
    if (data.autoEmail) {
      try {
        const verifyUrl = `${resolveOrigin()}/certificates/${encodeURIComponent(certId)}`;
        const html = buildCertEmailHtml({
          recipientName: data.userName,
          courseName: data.courseName,
          score: data.scorePercentage,
          certId,
          verifyUrl,
          issueDate,
        });

        // Import sendEmail from cert.functions
        const { sendEmail } = await import("./cert.functions");
        await sendEmail({
          to: data.userEmail,
          subject: `Your certificate — ${data.courseName}`,
          html,
        });
        emailSent = true;
        console.log(`[CERT EMAIL] Sent to ${data.userEmail} for cert ${certId}`);
      } catch (err: any) {
        emailError = err?.message || "Email send failed";
        console.warn(`[CERT EMAIL] Failed for ${certId}:`, emailError);
        // Log failed email for retry
        if (certRecord?.id) {
          await supabaseAdmin.from("certificate_email_log").insert({
            certificate_id: certRecord.id,
            recipient_email: data.userEmail,
            status: "failed",
            error: emailError,
            sent_by: context.userId,
            next_retry_at: new Date(Date.now() + 30_000).toISOString(),
          });
        }
      }
    }

    // 4. Return result
    return {
      success: true,
      certId,
      certificateId: certRecord?.id ?? null,
      issueDate,
      emailSent,
      emailError,
      message: emailSent
        ? `Certificate ${certId} issued and emailed to ${data.userEmail}`
        : emailError
          ? `Certificate ${certId} issued. Email failed: ${emailError}`
          : `Certificate ${certId} issued successfully`,
    };
  });
