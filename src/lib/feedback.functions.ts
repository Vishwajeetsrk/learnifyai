import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEmail } from "@/lib/welcome-email.functions";

const ADMIN_EMAIL = "vishwajeetsrk@gmail.com";

export const submitUserFeedback = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        category: z.enum(["suggestion", "bug", "feature_request", "feedback", "other"]).default("suggestion"),
        subject: z.string().min(1).max(200),
        message: z.string().min(1).max(5000),
        screenshotDataUrl: z.string().optional().nullable(),
        currentUrl: z.string().optional().nullable(),
        userEmail: z.string().email().optional().nullable(),
        userName: z.string().optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // 1. Resolve user from cookie token if available
    let resolvedUserId: string | null = null;
    let resolvedEmail = data.userEmail || null;
    let resolvedName = data.userName || null;

    const request = getRequest();
    if (request?.headers) {
      const cookieHeader = request.headers.get("cookie") || "";
      const cookiesMap: Record<string, string> = {};
      cookieHeader.split(";").forEach((c) => {
        const eq = c.indexOf("=");
        if (eq > -1) cookiesMap[c.substring(0, eq).trim()] = c.substring(eq + 1).trim();
      });
      const token =
        cookiesMap["sb-access-token"] ||
        cookiesMap["supabase-auth-token"] ||
        cookiesMap["sb-auth-token"] ||
        Object.keys(cookiesMap).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
      if (token) {
        try {
          const { data: authData } = await supabaseAdmin.auth.getUser(token);
          if (authData?.user) {
            resolvedUserId = authData.user.id;
            resolvedEmail = resolvedEmail || authData.user.email || null;
            resolvedName = resolvedName || authData.user.user_metadata?.full_name || null;
          }
        } catch {
          // ignore
        }
      }
    }

    // 2. Upload screenshot to Supabase Storage if present as base64/dataURL
    let publicScreenshotUrl: string | null = null;
    if (data.screenshotDataUrl && data.screenshotDataUrl.startsWith("data:")) {
      try {
        const match = data.screenshotDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match) {
          const mime = match[1];
          const base64Data = match[2];
          const buffer = Buffer.from(base64Data, "base64");
          const ext = mime.split("/")[1] || "png";
          const filename = `feedback/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

          const { data: uploadRes, error: uploadErr } = await supabaseAdmin.storage
            .from("feedback")
            .upload(filename, buffer, { contentType: mime, upsert: true });

          if (!uploadErr && uploadRes) {
            const { data: publicUrlData } = supabaseAdmin.storage.from("feedback").getPublicUrl(filename);
            publicScreenshotUrl = publicUrlData?.publicUrl || null;
          }
        }
      } catch (err) {
        console.error("[submitUserFeedback] Storage upload fallback:", err);
      }
    } else if (data.screenshotDataUrl && data.screenshotDataUrl.startsWith("http")) {
      publicScreenshotUrl = data.screenshotDataUrl;
    }

    // 3. Record in audit logs / feedback store
    try {
      await supabaseAdmin.from("admin_audit_logs" as any).insert({
        admin_id: resolvedUserId || "00000000-0000-0000-0000-000000000000",
        action: `USER_FEEDBACK_${data.category.toUpperCase()}`,
        target_type: "user_feedback",
        target_id: resolvedUserId || "visitor",
        details: {
          category: data.category,
          subject: data.subject,
          message: data.message,
          screenshotUrl: publicScreenshotUrl,
          currentUrl: data.currentUrl,
          userEmail: resolvedEmail,
          userName: resolvedName,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.error("[submitUserFeedback] Audit log failed:", e);
    }

    // 4. Send Email Notification directly to Super Admin Vishwajeetsrk@gmail.com
    const categoryLabels: Record<string, string> = {
      suggestion: "💡 Suggestion / Idea",
      bug: "🐛 Bug Report",
      feature_request: "⚡ Feature Request",
      feedback: "💬 General Feedback",
      other: "📌 Other",
    };

    const emailSubject = `[Learnify Feedback] ${categoryLabels[data.category] || data.category}: ${data.subject}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="background: #347A3D; padding: 20px 24px; color: white;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 700;">New User Feedback Received</h2>
      <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Direct Learner Feedback &amp; Screenshot Submission</p>
    </div>
    <div style="padding: 24px; color: #334155; font-size: 13px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 130px;">Category</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${categoryLabels[data.category] || data.category}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Subject</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.subject}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">User Info</td>
          <td style="padding: 8px 0; color: #0f172a;">${resolvedName || "Learner"} (${resolvedEmail || "Not provided"})</td>
        </tr>
        ${data.currentUrl ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Page URL</td>
          <td style="padding: 8px 0; color: #2563eb;"><a href="${data.currentUrl}" style="color: #2563eb; text-decoration: underline;">${data.currentUrl}</a></td>
        </tr>` : ""}
      </table>

      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px;">User Message:</div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; white-space: pre-wrap; line-height: 1.6; font-size: 14px; color: #1e293b;">
${data.message}
        </div>
      </div>

      ${publicScreenshotUrl ? `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px;">Attached Screenshot:</div>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #0f172a;">
          <a href="${publicScreenshotUrl}" target="_blank">
            <img src="${publicScreenshotUrl}" alt="User Screenshot" style="width: 100%; height: auto; display: block;" />
          </a>
        </div>
        <div style="font-size: 11px; color: #64748b; margin-top: 6px;">
          <a href="${publicScreenshotUrl}" target="_blank" style="color: #347A3D; font-weight: 600;">Open full size screenshot &rarr;</a>
        </div>
      </div>` : ""}

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://www.learnifyai.in/admin" style="display: inline-block; background: #347A3D; color: white; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
          Open Admin Dashboard
        </a>
      </div>
    </div>
    <div style="background: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      Delivered to ${ADMIN_EMAIL} &bull; Learnify AI Customer Feedback Loop
    </div>
  </div>
</body>
</html>
    `;

    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (err) {
      console.error("[submitUserFeedback] Email alert failed:", err);
    }

    return { success: true };
  });
