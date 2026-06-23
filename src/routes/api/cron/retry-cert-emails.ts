import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEmail, buildHtml } from "@/lib/cert.functions";

function resolveOrigin(): string {
  return (process.env.APP_URL || "https://learnifyaitool.vercel.app").replace(
    /[^a-zA-Z0-9:/.\-_]/g,
    "",
  );
}

export const Route = createFileRoute("/api/cron/retry-cert-emails")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const nowIso = new Date().toISOString();
          const { data: rows, error: queryErr } = await (supabaseAdmin as any)
            .from("certificate_email_log")
            .select("id, certificate_id, recipient_email, attempt, max_attempts, idempotency_key")
            .in("status", ["pending", "failed"])
            .lte("next_retry_at", nowIso)
            .order("created_at", { ascending: true })
            .limit(20);

          if (queryErr) {
            console.error("retry-cert-emails query error:", queryErr);
            return new Response(JSON.stringify({ success: false, error: queryErr.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          let retried = 0,
            succeeded = 0,
            failed = 0;

          for (const row of rows ?? []) {
            const maxAttempts = row.max_attempts ?? 5;
            if (row.attempt >= maxAttempts) continue;
            retried++;

            const { data: cert } = await (supabaseAdmin as any)
              .from("certificates")
              .select("id, code, course_id, score, total, recipient_name")
              .eq("id", row.certificate_id)
              .single();

            if (!cert) {
              await (supabaseAdmin as any)
                .from("certificate_email_log")
                .update({
                  status: "failed",
                  error: "Certificate not found",
                  attempt: row.attempt + 1,
                })
                .eq("id", row.id);
              failed++;
              continue;
            }

            const { data: course } = await (supabaseAdmin as any)
              .from("courses")
              .select("title")
              .eq("id", cert.course_id)
              .maybeSingle();

            const origin = resolveOrigin();
            const verifyUrl = `${origin}/certificates/${encodeURIComponent(cert.code)}`;
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

              await (supabaseAdmin as any)
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
              await (supabaseAdmin as any)
                .from("certificate_email_log")
                .update({
                  status: nextAttempt >= maxAttempts ? "failed" : "pending",
                  error: String(e?.message ?? e).slice(0, 500),
                  attempt: nextAttempt,
                  next_retry_at:
                    nextAttempt >= maxAttempts
                      ? null
                      : new Date(Date.now() + backoffMs).toISOString(),
                })
                .eq("id", row.id);
              failed++;
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              retried,
              succeeded,
              failed,
              timestamp: nowIso,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("retry-cert-emails exception:", err);
          return new Response(
            JSON.stringify({ success: false, error: err?.message || "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
