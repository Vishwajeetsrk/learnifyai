import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { c as callUserAiChat } from "./user-ai-C_P4MEwi.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const Input = objectType({
  action: enumType(["summary", "exercise", "doubt"]),
  courseId: stringType().uuid(),
  lessonId: stringType().uuid(),
  courseTitle: stringType().min(1).max(300),
  lessonTitle: stringType().min(1).max(300),
  lessonDescription: stringType().max(4e3).optional(),
  question: stringType().max(4e3).optional()
});
const SYSTEM = `You are Learnify AI — a senior technical mentor. Respond in clean, professional markdown (H2/H3 headings, numbered steps, fenced code blocks with language tags, bullet lists where useful). No emoji spam, no filler. Be concrete and production-grade.`;
function buildPrompt(d) {
  const ctx = `Course: ${d.courseTitle}
Lesson: ${d.lessonTitle}${d.lessonDescription ? `
Lesson notes: ${d.lessonDescription}` : ""}`;
  if (d.action === "summary") {
    return `${ctx}

Produce a structured lesson summary with these sections:
## Key Takeaways (5-7 bullets)
## Core Concepts Explained
## Real-World Applications
## Quick Recap (3 lines)`;
  }
  if (d.action === "exercise") {
    return `${ctx}

Design a practical, hands-on exercise the learner can build right now. Include:
## Objective
## Prerequisites
## Step-by-Step Instructions (numbered)
## Starter Code (fenced code block)
## Expected Output
## Bonus Challenges (2-3 stretch goals)
## Solution Hints (collapsible thinking, not full solution)`;
  }
  return `${ctx}

Learner's doubt: """${d.question ?? ""}"""

Clear the doubt with:
## Direct Answer
## Why This Happens / How It Works
## Worked Example (with code if applicable)
## Common Mistakes to Avoid
## Further Reading (real, current resources)`;
}
const lessonAiHelper_createServerFn_handler = createServerRpc({
  id: "bc9f1bbb4d7a46ef2c51ed471408f0417d9d858da2193d33c0ff9f36cfe7653e",
  name: "lessonAiHelper",
  filename: "src/lib/lesson-ai.functions.ts"
}, (opts) => lessonAiHelper.__executeServer(opts));
const lessonAiHelper = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(lessonAiHelper_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [{
    data: lesson
  }, {
    data: enrollment
  }, {
    data: progress
  }, {
    data: cert
  }, superAdmin, admin] = await Promise.all([supabase.from("lessons").select("id, course_id").eq("id", data.lessonId).eq("course_id", data.courseId).maybeSingle(), supabase.from("enrollments").select("status, progress_pct").eq("user_id", userId).eq("course_id", data.courseId).maybeSingle(), supabase.from("lesson_progress").select("id").eq("user_id", userId).eq("course_id", data.courseId).limit(1).maybeSingle(), supabase.from("certificates").select("id").eq("user_id", userId).eq("course_id", data.courseId).maybeSingle(), supabase.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin"
  }), supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin"
  })]);
  if (!lesson) throw new Error("Lesson not found for this course.");
  const enrollmentRow = enrollment;
  const enrollmentStatus = enrollmentRow?.status ?? null;
  const enrollmentProgress = enrollmentRow?.progress_pct ?? 0;
  const hasAccess = Boolean(superAdmin.data || admin.data || !!enrollmentRow || enrollmentStatus === "completed" || enrollmentProgress > 0 || progress || cert);
  if (!hasAccess) throw new Error("Full course access is required to use AI hints, suggestions, solving help, and summaries.");
  const res = await callUserAiChat({
    messages: [{
      role: "system",
      content: SYSTEM
    }, {
      role: "user",
      content: buildPrompt(data)
    }]
  });
  if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace.");
  if (!res.ok) throw new Error(`AI provider error (${res.status})`);
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? "";
  return {
    content
  };
});
export {
  lessonAiHelper_createServerFn_handler
};
