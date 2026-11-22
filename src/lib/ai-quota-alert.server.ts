// Server-side AI Quota, Low Credit & Upstream API Failure Alert System
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_ALERT_EMAIL = "vishwajeetsrk@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Learnify AI System <support.learnifyai@gmail.com>";
const BASE_URL = process.env.VITE_APP_URL || "https://www.learnifyai.in";

export type AiAlertEventType = "credits_exhausted" | "credits_low" | "api_failure" | "rate_limited";

interface AiAlertPayload {
  eventType: AiAlertEventType;
  userId?: string;
  userEmail?: string;
  endpoint?: string;
  remainingCredits?: number;
  errorDetails?: string;
  modelUsed?: string;
}

// In-memory alert throttling (Max 1 alert per 5 minutes per unique event/user signature)
const alertCooldownMap = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000;

export async function notifyAdminOnAiAlert(payload: AiAlertPayload): Promise<void> {
  const { eventType, userId, userEmail, endpoint, remainingCredits, errorDetails, modelUsed } = payload;
  const signature = `${eventType}_${userId || "system"}_${endpoint || "all"}`;
  const now = Date.now();
  const lastSent = alertCooldownMap.get(signature);

  if (lastSent && now - lastSent < COOLDOWN_MS) {
    // Throttled to prevent flooding admin inbox
    return;
  }
  alertCooldownMap.set(signature, now);

  // 1. Audit Log in Database
  try {
    await supabaseAdmin.from("admin_audit_logs" as any).insert({
      admin_id: userId || "00000000-0000-0000-0000-000000000000",
      action: `AI_ALERT_${eventType.toUpperCase()}`,
      target_type: "ai_service",
      target_id: userId || "system",
      details: {
        eventType,
        endpoint,
        userEmail,
        remainingCredits,
        errorDetails: errorDetails ? errorDetails.slice(0, 500) : null,
        modelUsed,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[notifyAdminOnAiAlert] Failed to insert audit log:", err);
  }

  // 2. Format HTML Email Notification
  const subject =
    eventType === "api_failure"
      ? `🚨 [CRITICAL ALERT] Learnify AI: Upstream AI API Failure at ${endpoint || "API"}`
      : eventType === "credits_exhausted"
        ? `⚠️ [QUOTA ALERT] User Out of AI Credits: ${userEmail || userId || "User"}`
        : `🔔 [INFO] Low AI Credits Warning (${remainingCredits ?? 0} left): ${userEmail || userId || "User"}`;

  const headerBg = eventType === "api_failure" ? "#dc2626" : eventType === "credits_exhausted" ? "#d97706" : "#2563eb";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #f8fafc;">
  <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: ${headerBg}; padding: 20px 24px; color: white;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Learnify AI Platform Diagnostics</h2>
      <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.95;">Automated System Monitor &bull; Alert Dispatch</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 140px;">Alert Type</td>
          <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${eventType.toUpperCase()}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Endpoint / Service</td>
          <td style="padding: 10px 0; color: #0f172a; font-family: monospace;">${endpoint || "/api/chat"}</td>
        </tr>
        ${userEmail ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Affected User</td>
          <td style="padding: 10px 0; color: #0f172a;">${userEmail} <span style="color: #64748b; font-size: 11px;">(${userId || ""})</span></td>
        </tr>` : ""}
        ${remainingCredits !== undefined ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Credits Remaining</td>
          <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${remainingCredits} Credits</td>
        </tr>` : ""}
        ${modelUsed ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Model Engine</td>
          <td style="padding: 10px 0; color: #0f172a;">${modelUsed}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Timestamp</td>
          <td style="padding: 10px 0; color: #0f172a;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
        </tr>
      </table>

      ${errorDetails ? `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Error Stack / Upstream Response</div>
        <pre style="background: #0f172a; color: #f8fafc; padding: 14px; border-radius: 8px; font-size: 12px; line-height: 1.5; overflow-x: auto; font-family: ui-monospace, Menlo, Consolas, monospace;">${errorDetails.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      </div>` : ""}

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #1e293b;">Recommended Admin Actions</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569; line-height: 1.6;">
          ${eventType === "credits_exhausted" ? `
            <li>Send a personalized upgrade offer with a 20% discount coupon to the user.</li>
            <li>Grant temporary bonus credits in Admin User Management if the user is in the middle of an interview.</li>
          ` : eventType === "api_failure" ? `
            <li>Check Gemini API quota or rate limits in Google Cloud Console / AI Studio.</li>
            <li>Verify GEMINI_API_KEY environment variable in Vercel project settings.</li>
            <li>Check fallback mock/cached responses to ensure user journey is not blocked.</li>
          ` : `
            <li>Monitor user activity in Admin Dashboard.</li>
          `}
        </ul>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${BASE_URL}/admin/users" style="display: inline-block; background: #347A3D; color: white; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; margin-right: 10px;">
          Manage Users in Admin
        </a>
        <a href="${BASE_URL}/admin/subscriptions" style="display: inline-block; background: #0f172a; color: white; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
          View Subscriptions &amp; Plans
        </a>
      </div>
    </div>
    <div style="background: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      Automated security &amp; quota monitor sent to ${ADMIN_ALERT_EMAIL} &bull; Learnify AI Infrastructure
    </div>
  </div>
</body>
</html>
  `;

  // 3. Dispatch Email via Resend or Nodemailer
  if (RESEND_API_KEY) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [ADMIN_ALERT_EMAIL],
          subject,
          html,
        }),
      });
      if (resp.ok) return;
      const err = await resp.text();
      console.error("[notifyAdminOnAiAlert] Resend email dispatch failed:", err);
    } catch (e: any) {
      console.error("[notifyAdminOnAiAlert] Resend error:", e?.message);
    }
  }

  // Fallback to Nodemailer SMTP
  try {
    const { default: nodemailer } = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false,
      auth: { user: "resend", pass: RESEND_API_KEY },
    });
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: ADMIN_ALERT_EMAIL,
      subject,
      html,
    });
  } catch (e: any) {
    console.error("[notifyAdminOnAiAlert] SMTP fallback error:", e?.message);
  }
}
