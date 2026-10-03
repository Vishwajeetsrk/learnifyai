// Subscription email notifications
// Uses the same sendEmail pattern as welcome-email.functions.ts

import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || "Learnify AI <onboarding@resend.dev>";

  // Try Resend REST API first
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
          to: [data.to],
          subject: data.subject,
          html: data.html,
        }),
      });
      if (resp.ok) return { ok: true };
      const err = await resp.text();
      console.error("Resend email failed:", err);
    } catch (e: any) {
      console.error("Resend email error:", e?.message);
    }
  }

  // Fallback to nodemailer (SMTP)
  try {
    const moduleName = "nodemailer";
    const { default: nodemailer } = await import(/* @vite-ignore */ moduleName);
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false,
      auth: { user: "resend", pass: RESEND_API_KEY },
    });
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    return { ok: true };
  } catch (e: any) {
    console.error("SMTP email error:", e?.message);
    return { ok: false, error: e?.message };
  }
}

const BASE_URL = process.env.VITE_APP_URL || "https://learnifyaitool.vercel.app";

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">Learnify AI</h1>
    </div>
    ${content}
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} Learnify AI. All rights reserved.
      <br><a href="${BASE_URL}/settings" style="color: #6b7280;">Manage email preferences</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendSubscriptionActivatedEmail(
  userId: string,
  planName: string,
  amount: number,
) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">
      Welcome to ${planName}!
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, your <strong>${planName}</strong> subscription is now active!
    </p>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #166534;">
        <strong>Amount:</strong> ${"\u20B9"}${amount}/month<br>
        <strong>Plan:</strong> ${planName}<br>
        <strong>Status:</strong> Active
      </p>
    </div>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      You now have access to all ${planName} features. Start exploring!
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/dashboard" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 8px;">
        Go to Dashboard
      </a>
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #ffffff; color: #7c3aed; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; border: 2px solid #7c3aed; margin-top: 8px;">
        View Invoice & Download PDF
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Welcome to ${planName} — Learnify AI`,
    html,
  });
}

export async function sendPaymentSuccessEmail(
  userId: string,
  planName: string,
  amount: number,
  nextBillingDate: string,
) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">
      Payment Confirmed
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, your payment for <strong>${planName}</strong> has been processed.
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">
        <strong>Amount:</strong> ${"\u20B9"}${amount}<br>
        <strong>Next billing:</strong> ${nextBillingDate}
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View Invoice & Download PDF
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Payment confirmed — ${planName} — Learnify AI`,
    html,
  });
}

export async function sendPaymentFailedEmail(userId: string, planName: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #991b1b; margin-bottom: 16px;">
      ⚠️ Payment Failed
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, we couldn't process your payment for <strong>${planName}</strong>.
    </p>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;">
        Please update your payment method to avoid service interruption.
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Update Payment Method
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Payment failed — ${planName} — Action required`,
    html,
  });
}

export async function sendSubscriptionCancelledEmail(userId: string, planName: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">
      Subscription Cancelled
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, your <strong>${planName}</strong> subscription has been cancelled.
    </p>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      You'll continue to have access until the end of your current billing period.
      After that, you'll be moved to the free plan.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/pricing" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View Plans
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Subscription cancelled — ${planName} — Learnify AI`,
    html,
  });
}

export async function sendSubscriptionExpiringEmail(
  userId: string,
  planName: string,
  daysLeft: number,
) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #92400e; margin-bottom: 16px;">
      ⏳ Subscription Expiring Soon
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, your <strong>${planName}</strong> subscription will expire in <strong>${daysLeft} days</strong>.
    </p>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      To keep your access, please renew or update your payment method.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Renew Subscription
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Subscription expiring in ${daysLeft} days — ${planName}`,
    html,
  });
}

/**
 * Renewal Reminder Email (3-day or 1-day before renewal)
 * Used by the daily dunning cron at /api/cron/renewal-dunning
 */
export async function sendSubscriptionRenewalReminderEmail(
  userId: string,
  planName: string,
  priceInr: number,
  renewalDateStr: string,
  daysUntilRenewal: number,
) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  if (!profile?.email) return;

  const urgencyColor = daysUntilRenewal <= 1 ? "#dc2626" : "#d97706";
  const urgencyLabel = daysUntilRenewal <= 1 ? "Tomorrow!" : `in ${daysUntilRenewal} days`;
  const priceFormatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInr);

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: ${urgencyColor}; margin-bottom: 16px;">
      🔔 Your Learnify AI Subscription Renews ${urgencyLabel}
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, just a heads-up — your <strong>${planName}</strong> plan will automatically renew on <strong>${renewalDateStr}</strong>.
    </p>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Plan</td>
          <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #111827; text-align: right;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Amount</td>
          <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #111827; text-align: right;">${priceFormatted}/month</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Renewal Date</td>
          <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${urgencyColor}; text-align: right;">${renewalDateStr}</td>
        </tr>
      </table>
    </div>
    <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
      No action needed — your plan renews automatically. If you'd like to cancel or update your payment method, visit your billing page.
    </p>
    <div style="text-align: center; margin: 24px 0; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        View Billing
      </a>
      <a href="${BASE_URL}/billing?action=cancel" style="display: inline-block; background: white; color: #6b7280; border: 1px solid #e5e7eb; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Manage Plan
      </a>
    </div>
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      Questions? Email us at <a href="mailto:support.learnifyai@gmail.com" style="color: #4f46e5;">support.learnifyai@gmail.com</a>
    </p>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Your ${planName} plan renews ${urgencyLabel} — ${priceFormatted}`,
    html,
  });
}

