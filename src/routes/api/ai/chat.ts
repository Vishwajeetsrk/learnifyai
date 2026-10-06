import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { redisRateLimit, RedisUnavailableError } from "@/lib/redis";
import { generateEmbedding } from "@/lib/rag.functions";
import { z } from "zod";

// Redis rate limit: 15 requests per 60 seconds per user
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW = 60;
const memoryBuckets = new Map<string, number[]>();

async function isRateLimited(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const result = await redisRateLimit(`ai:chat:${userId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    return { allowed: result.allowed, remaining: result.remaining };
  } catch (err) {
    if (!(err instanceof RedisUnavailableError)) {
      console.warn("[ai-api] Redis unavailable, using in-memory rate limiter");
    }
    const now = Date.now();
    const timestamps = memoryBuckets.get(userId) ?? [];
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW * 1000);
    if (valid.length >= RATE_LIMIT_MAX) {
      memoryBuckets.set(userId, valid);
      return { allowed: false, remaining: 0 };
    }
    valid.push(now);
    memoryBuckets.set(userId, valid);
    return { allowed: true, remaining: RATE_LIMIT_MAX - valid.length };
  }
}

const BodySchema = z.object({
  message: z.string().min(1).max(10000),
  courseId: z.string().uuid().optional(),
  model: z.string().optional().default("gemini-flash-lite-latest"),
  conversationId: z.string().uuid().optional(),
});

export const Route = (createFileRoute as any)("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = request.headers.get("authorization");
        const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) {
          return new Response(JSON.stringify({ error: "Authentication required" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
        if (userErr || !userData.user) {
          return new Response(JSON.stringify({ error: "Invalid session token" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        const userId = userData.user.id;

        // 1. Redis Rate Limiting
        const rateCheck = await isRateLimited(userId);
        if (!rateCheck.allowed) {
          return new Response(
            JSON.stringify({
              error: "Rate limit exceeded. Maximum 15 requests per minute.",
              retryAfterSeconds: RATE_LIMIT_WINDOW,
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
                "X-RateLimit-Remaining": "0",
                "Retry-After": String(RATE_LIMIT_WINDOW),
              },
            },
          );
        }

        // 2. Credits check & metering
        const { data: creditRow } = await supabaseAdmin
          .from("ai_credits")
          .select("credits_remaining")
          .eq("user_id", userId)
          .maybeSingle();

        let credits = creditRow?.credits_remaining ?? 100;
        if (credits < 1) {
          return new Response(
            JSON.stringify({ error: "Insufficient AI credits. Please recharge your wallet." }),
            { status: 402, headers: { "Content-Type": "application/json" } },
          );
        }

        let body;
        try {
          body = BodySchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 3. Vector RAG Search on Course Materials (if courseId provided)
        let ragContext = "";
        if (body.courseId) {
          try {
            const queryEmbedding = await generateEmbedding(body.message);
            const { data: matches, error: rpcErr } = await supabaseAdmin.rpc(
              "match_material_chunks" as any,
              {
                query_embedding: queryEmbedding,
                match_threshold: 0.65,
                match_count: 3,
                filter_course_id: body.courseId,
              },
            );

            if (!rpcErr && matches && (matches as any[]).length > 0) {
              ragContext = (matches as any[])
                .map((m, i) => `[Course Material Excerpt ${i + 1}]:\n${m.content}`)
                .join("\n\n");
            }
          } catch (ragErr) {
            console.warn("Vector RAG search bypassed:", ragErr);
          }
        }

        // 4. Construct System Prompt with Grounded RAG
        const systemPrompt = `You are Learnify AI Tutor, an elite technical educator.
${ragContext ? `\nGROUNDED COURSE MATERIALS KNOWLEDGE:\n${ragContext}\nAlways answer using the exact course context above when applicable.` : ""}
Provide comprehensive, structured, step-by-step technical explanations with clean code snippets and actionable examples.`;

        // 5. Call Gemini API
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          return new Response(JSON.stringify({ error: "AI service configuration error" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        const promptChars = systemPrompt.length + body.message.length;
        const estimatedPromptTokens = Math.ceil(promptChars / 4);

        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${geminiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: body.model || "gemini-flash-lite-latest",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: body.message },
              ],
              max_tokens: 2500,
            }),
          },
        );

        if (!aiResponse.ok) {
          return new Response(JSON.stringify({ error: "AI engine busy. Please retry." }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || "";
        const completionTokens = aiData.usage?.completion_tokens || Math.ceil(content.length / 4);
        const totalTokens = (aiData.usage?.prompt_tokens || estimatedPromptTokens) + completionTokens;

        // Deduct 1 credit & log usage
        const newCredits = Math.max(0, credits - 1);
        await supabaseAdmin
          .from("ai_credits")
          .update({ credits_remaining: newCredits, updated_at: new Date().toISOString() })
          .eq("user_id", userId);

        return new Response(
          JSON.stringify({
            content,
            ragGrounded: Boolean(ragContext),
            metering: {
              promptTokens: aiData.usage?.prompt_tokens || estimatedPromptTokens,
              completionTokens,
              totalTokens,
              creditsRemaining: newCredits,
              lowCreditAlert: newCredits < 15,
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
              "X-RateLimit-Remaining": String(rateCheck.remaining),
            },
          },
        );
      },
    },
  },
});
