// Billing email notifications for invoices, payments, and refunds
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || "Learnify AI <billing@learnify.ai>";

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
      console.error("Resend billing email failed:", err);
    } catch (e: any) {
      console.error("Resend billing email error:", e?.message);
    }
  }

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
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    return { ok: true };
  } catch (e: any) {
    console.error("SMTP billing email error:", e?.message);
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
      <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0;">Billing</p>
    </div>
    ${content}
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      ${new Date().getFullYear()} Learnify AI. All rights reserved.
      <br><a href="${BASE_URL}/billing" style="color: #6b7280;">View billing history</a>
    </p>
  </div>
</body>
</html>`;
}

async function getProfile(userId: string): Promise<{ email: string | null; full_name: string | null } | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
  return data;
}

export async function sendInvoiceCreatedEmail(
  userId: string,
  invoiceNumber: string,
  amount: number,
  dueDate: string,
) {
  const profile = await getProfile(userId);
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">
      New Invoice Ready
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, a new invoice has been generated for your account.
    </p>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #166534;">
        <strong>Invoice:</strong> ${invoiceNumber}<br>
        <strong>Amount:</strong> ${"\u20B9"}${amount.toLocaleString("en-IN")}<br>
        <strong>Due Date:</strong> ${dueDate}
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View &amp; Download Invoice
      </a>
      <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">Open the billing page to view details and download as PDF.</div>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `New invoice ${invoiceNumber} — Learnify AI`,
    html,
  });
}

export async function sendPaymentSuccessEmail(
  userId: string,
  invoiceNumber: string,
  amount: number,
  paymentMethod: string,
) {
  const profile = await getProfile(userId);
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">
      Payment Confirmed
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, your payment has been processed successfully.
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;">
        <strong>Invoice:</strong> ${invoiceNumber}<br>
        <strong>Amount:</strong> ${"\u20B9"}${amount.toLocaleString("en-IN")}<br>
        <strong>Method:</strong> ${paymentMethod}
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View &amp; Download Invoice
      </a>
      <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">Open the billing page to download your invoice as PDF.</div>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Payment confirmed — ${invoiceNumber} — Learnify AI`,
    html,
  });
}

export async function sendPaymentFailedEmail(
  userId: string,
  invoiceNumber: string,
  amount: number,
) {
  const profile = await getProfile(userId);
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #991b1b; margin-bottom: 16px;">
      Payment Failed
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, we couldn't process your payment for invoice <strong>${invoiceNumber}</strong>.
    </p>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;">
        <strong>Amount due:</strong> ₹${amount.toLocaleString("en-IN")}<br>
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
    subject: `Payment failed — ${invoiceNumber} — Action required`,
    html,
  });
}

export async function sendRefundProcessedEmail(
  userId: string,
  invoiceNumber: string,
  amount: number,
  reason?: string,
) {
  const profile = await getProfile(userId);
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">
      Refund Processed
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, a refund has been processed for your account.
    </p>
    <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Invoice:</strong> ${invoiceNumber}<br>
        <strong>Refund Amount:</strong> ₹${amount.toLocaleString("en-IN")}<br>
        ${reason ? `<strong>Reason:</strong> ${reason}` : ""}
      </p>
    </div>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      The refund will be credited to your original payment method within 5-7 business days.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View Billing History
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Refund processed — ${invoiceNumber} — Learnify AI`,
    html,
  });
}

export async function sendInvoiceOverdueEmail(
  userId: string,
  invoiceNumber: string,
  amount: number,
  daysOverdue: number,
) {
  const profile = await getProfile(userId);
  if (!profile?.email) return;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 600; color: #92400e; margin-bottom: 16px;">
      Invoice Overdue
    </h2>
    <p style="font-size: 15px; color: #374151; line-height: 1.6;">
      Hi ${profile.full_name || "there"}, invoice <strong>${invoiceNumber}</strong> is now <strong>${daysOverdue} days overdue</strong>.
    </p>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;">
        <strong>Amount due:</strong> ₹${amount.toLocaleString("en-IN")}<br>
        Please pay immediately to avoid service suspension.
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/billing" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Pay Now
      </a>
    </div>
  `);

  await sendEmail({
    to: profile.email,
    subject: `Overdue: ${invoiceNumber} — ${daysOverdue} days past due`,
    html,
  });
}
