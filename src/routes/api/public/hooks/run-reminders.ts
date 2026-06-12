import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function advance(frequency: string, current: Date): Date | null {
  const d = new Date(current);
  if (frequency === "daily") {
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (frequency === "weekly") {
    d.setDate(d.getDate() + 7);
    return d;
  }
  if (frequency === "hourly") {
    d.setHours(d.getHours() + 1);
    return d;
  }
  return null;
}

async function sendEmail(to: string, subject: string, html: string) {
  const lovKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovKey || !resendKey) return;
  try {
    await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: "Learnify AI <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
  } catch (e) {
    console.error("resend send failed", e);
  }
}

export const Route = createFileRoute("/api/public/hooks/run-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Cron secret check — prevents anonymous abuse / email-bombing.
        const expected = process.env.CRON_SECRET;
        if (!expected) {
          return new Response(JSON.stringify({ error: "CRON_SECRET not configured" }), {
            status: 503,
          });
        }
        const provided =
          request.headers.get("x-cron-secret") ??
          (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (!provided || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const nowIso = new Date().toISOString();
        const { data: due, error } = await supabaseAdmin
          .from("scheduled_reminders")
          .select("id, user_id, title, body, frequency, next_run_at")
          .eq("active", true)
          .lte("next_run_at", nowIso)
          .limit(200);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

        const list = due ?? [];
        let processed = 0;

        for (const r of list) {
          // 1. notification
          await supabaseAdmin.from("notifications").insert({
            user_id: r.user_id,
            title: r.title,
            body: r.body,
            type: "reminder",
          });

          // 2. email (best-effort)
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("email, full_name")
            .eq("id", r.user_id)
            .single();
          if (profile?.email) {
            const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#fff;color:#111">
              <h2 style="color:#4f46e5;margin:0 0 12px">${r.title}</h2>
              <p style="line-height:1.6;white-space:pre-wrap">${(r.body ?? "").replace(/</g, "&lt;")}</p>
              <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />
              <p style="font-size:12px;color:#888">— Learnify AI reminders</p>
            </div>`;
            await sendEmail(profile.email, r.title, html);
          }

          // 3. reschedule
          const next = advance(r.frequency, new Date(r.next_run_at));
          if (next) {
            await supabaseAdmin
              .from("scheduled_reminders")
              .update({ next_run_at: next.toISOString(), last_sent_at: nowIso })
              .eq("id", r.id);
          } else {
            await supabaseAdmin
              .from("scheduled_reminders")
              .update({ active: false, last_sent_at: nowIso })
              .eq("id", r.id);
          }
          processed++;
        }

        return new Response(JSON.stringify({ ok: true, processed }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      GET: async () =>
        new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        }),
    },
  },
});
