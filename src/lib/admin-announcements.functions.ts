import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function checkAdminRole(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin role required");
  }
}

export const sendAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        title: z.string().min(1).max(200),
        body: z.string().min(1).max(10000),
        type: z.enum(["info", "warning", "success", "promo", "maintenance"]).default("info"),
        targetRole: z.enum(["all", "students", "creators", "admins"]).default("all"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get target user IDs based on role filter
    let targetUsers: string[] = [];

    if (data.targetRole === "all") {
      const { data: allUsers } = await supabaseAdmin.from("profiles").select("id");
      targetUsers = (allUsers ?? []).map((u: any) => u.id);
    } else {
      const roleField =
        data.targetRole === "students"
          ? "student"
          : data.targetRole === "creators"
            ? "creator"
            : "admin";
      const { data: roleUsers } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", roleField);
      targetUsers = (roleUsers ?? []).map((u: any) => u.user_id);
    }

    if (targetUsers.length === 0) {
      return { success: true, notifiedCount: 0 };
    }

    // Batch insert notifications (chunked to avoid payload limits)
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < targetUsers.length; i += BATCH_SIZE) {
      const batch = targetUsers.slice(i, i + BATCH_SIZE);
      const records = batch.map((uid) => ({
        user_id: uid,
        title: data.title,
        body: data.body,
        type: data.type,
        read: false,
      }));

      const { error } = await supabaseAdmin.from("notifications").insert(records as any);
      if (!error) inserted += batch.length;
    }

    return { success: true, notifiedCount: inserted, totalTarget: targetUsers.length };
  });

export const adminSendMarketingCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        subject: z.string().min(1).max(250),
        headline: z.string().min(1).max(200),
        offerHighlight: z.string().min(1).max(100),
        messageBody: z.string().min(1).max(10000),
        ctaText: z.string().min(1).max(100).default("Claim Exclusive Offer"),
        ctaUrl: z.string().url().default("https://www.learnifyai.in/pricing"),
        targetRole: z.enum(["all", "students", "unsubscribed"]).default("all"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmail } = await import("@/lib/welcome-email.functions");

    // 1. Fetch real user emails
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name");
    if (error) throw new Error(error.message);

    // If targeting unsubscribed only, filter out active paid subscribers
    let targetProfiles = (profiles ?? []).filter(
      (p): p is typeof p & { email: string } => typeof p.email === "string" && p.email.includes("@"),
    );

    if (data.targetRole === "unsubscribed") {
      const { data: subs } = await supabaseAdmin
        .from("user_subscriptions")
        .select("user_id")
        .eq("status", "active");
      const activeSubIds = new Set((subs ?? []).map((s: any) => s.user_id));
      targetProfiles = targetProfiles.filter((p) => !activeSubIds.has(p.id));
    }

    if (targetProfiles.length === 0) {
      return { success: true, emailsSent: 0, totalUsers: 0 };
    }

    let sentCount = 0;
    const notificationRecords: any[] = [];

    // 2. Loop through users and dispatch personalized email
    for (const profile of targetProfiles) {
      const recipientName = profile.full_name || profile.email.split("@")[0] || "Engineer";

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background: #f8fafc;">
  <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    <!-- Brand Header -->
    <div style="background: linear-gradient(135deg, #174422 0%, #245F30 50%, #347A3D 100%); padding: 28px 24px; text-align: center; color: white;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; color: #a7f3d0; margin-bottom: 6px;">Special Member Announcement</div>
      <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">${data.headline}</h1>
      <div style="display: inline-block; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; padding: 6px 16px; margin-top: 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em;">
        ${data.offerHighlight}
      </div>
    </div>

    <!-- Main Body -->
    <div style="padding: 32px 28px; color: #334155; line-height: 1.6; font-size: 14px;">
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Hi ${recipientName},</p>
      
      <div style="white-space: pre-line; margin-bottom: 24px; font-size: 14px; color: #475569;">
        ${data.messageBody}
      </div>

      <!-- Core Value Pillars Card -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
        <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #0f172a;">What You Unlock In Your Subscription:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
          <li><strong>10-Role AI Coaching Agent Studio:</strong> Real-time architecture reviews &amp; code drills with Staff &amp; Principal AI Mentors.</li>
          <li><strong>AI Mock Interview Studio:</strong> Realistic speech recognition, STAR evaluation &amp; instant hireability scoring.</li>
          <li><strong>91 Verified Engineering Roadmaps:</strong> Step-by-step career blueprints from Junior to Staff Engineer.</li>
          <li><strong>Sandpack In-Browser IDE:</strong> Zero-setup coding sandbox with instant live preview.</li>
          <li><strong>Thermal Tax Receipt &amp; 18% GST:</strong> Fully SAC 998431 compliant for corporate reimbursement.</li>
        </ul>
      </div>

      <!-- Action Button CTA -->
      <div style="text-align: center; margin: 32px 0 24px;">
        <a href="${data.ctaUrl}" style="display: inline-block; background: #347A3D; color: white; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 10px rgba(52,122,61,0.25);">
          ${data.ctaText} &rarr;
        </a>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">Instant activation &bull; 1-click cancel anytime &bull; 100% Secure via Razorpay</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      You received this exclusive update as a registered member of Learnify AI.<br>
      Learnify EdTech Pvt Ltd &bull; SAC 998431 &bull; 18% GST Included
    </div>
  </div>
</body>
</html>
      `;

      try {
        await sendEmail({
          to: profile.email,
          subject: data.subject,
          html,
        });
        sentCount++;
      } catch (e) {
        console.error(`[adminSendMarketingCampaign] Failed for ${profile.email}:`, e);
      }

      // Add to in-app notification batch
      notificationRecords.push({
        user_id: profile.id,
        title: data.headline,
        body: `${data.offerHighlight}: ${data.subject}. Visit ${data.ctaUrl} to upgrade.`,
        type: "promo",
        read: false,
      });
    }

    // Insert in-app notifications in batch
    if (notificationRecords.length > 0) {
      try {
        await supabaseAdmin.from("notifications").insert(notificationRecords as any);
      } catch (e) {
        console.error("[adminSendMarketingCampaign] Notification error:", e);
      }
    }

    // Audit log
    try {
      await supabaseAdmin.from("admin_audit_logs" as any).insert({
        admin_id: userId,
        action: "MARKETING_EMAIL_BROADCAST",
        target_type: "email_campaign",
        target_id: "all_users",
        details: {
          subject: data.subject,
          headline: data.headline,
          offerHighlight: data.offerHighlight,
          targetRole: data.targetRole,
          emailsSent: sentCount,
          totalTargeted: targetProfiles.length,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.error("[adminSendMarketingCampaign] Audit log error:", e);
    }

    return {
      success: true,
      emailsSent: sentCount,
      totalUsers: targetProfiles.length,
    };
  });
