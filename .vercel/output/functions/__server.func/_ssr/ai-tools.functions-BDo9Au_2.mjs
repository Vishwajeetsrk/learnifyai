import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { c as callUserAiChat } from "./user-ai-C_P4MEwi.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, n as numberType, s as stringType, l as literalType, d as discriminatedUnionType } from "../_libs/zod.mjs";
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
const QuizInput = objectType({
  action: literalType("quiz"),
  topic: stringType().min(2).max(500),
  count: numberType().int().min(1).max(20).default(5),
  difficulty: enumType(["easy", "medium", "hard"]).default("medium")
});
const DoubtInput = objectType({
  action: literalType("doubt"),
  question: stringType().min(2).max(4e3),
  subject: stringType().max(200).optional()
});
const CareerInput = objectType({
  action: literalType("career"),
  goal: stringType().min(2).max(1e3),
  background: stringType().max(2e3).optional(),
  years: numberType().min(0).max(40).default(0)
});
const ReminderInput = objectType({
  action: literalType("reminder"),
  task: stringType().min(2).max(500),
  when: stringType().min(1).max(200),
  goal: stringType().max(500).optional()
});
const SynthInput = objectType({
  action: literalType("synth"),
  notes: stringType().min(10).max(2e4)
});
const FlashInput = objectType({
  action: literalType("flashcards"),
  topic: stringType().min(2).max(500),
  count: numberType().int().min(3).max(30).default(10)
});
const Input = discriminatedUnionType("action", [QuizInput, DoubtInput, CareerInput, ReminderInput, SynthInput, FlashInput]);
const SYS = `You are Learnify AI — a senior technical mentor and educator. Be accurate, concrete, current (2025-2026), and production-grade. Avoid filler.`;
function jsonInstruction(schemaHint) {
  return `Respond with ONLY valid minified JSON matching this schema (no markdown, no prose, no code fences):
${schemaHint}`;
}
function buildMessages(d) {
  if (d.action === "quiz") {
    return {
      json: true,
      messages: [{
        role: "system",
        content: SYS
      }, {
        role: "user",
        content: `Generate ${d.count} multiple-choice quiz questions on "${d.topic}" at ${d.difficulty} difficulty. Each question must have exactly 4 distinct options, one correct answer (0-indexed), and a 1-2 sentence explanation. ${jsonInstruction(`{"questions":[{"question":string,"options":[string,string,string,string],"answer":0|1|2|3,"explanation":string}]}`)}`
      }]
    };
  }
  if (d.action === "flashcards") {
    return {
      json: true,
      messages: [{
        role: "system",
        content: SYS
      }, {
        role: "user",
        content: `Create ${d.count} study flashcards on "${d.topic}". Front = concise prompt; Back = clear answer (1-3 sentences with tiny example if useful). ${jsonInstruction(`{"cards":[{"front":string,"back":string}]}`)}`
      }]
    };
  }
  if (d.action === "reminder") {
    return {
      json: true,
      messages: [{
        role: "system",
        content: SYS
      }, {
        role: "user",
        content: `Create a smart, motivating study reminder.
Task: ${d.task}
When: ${d.when}
Goal: ${d.goal ?? "n/a"}
Return a short title (max 60 chars), a focused body (2-3 sentences with one concrete action), and an ISO 8601 suggested_time. ${jsonInstruction(`{"title":string,"body":string,"suggested_time":string}`)}`
      }]
    };
  }
  if (d.action === "doubt") {
    return {
      json: false,
      messages: [{
        role: "system",
        content: SYS
      }, {
        role: "user",
        content: `Subject: ${d.subject ?? "General"}
Question: ${d.question}

## Direct Answer
## Why / How It Works
## Worked Example (with code if relevant)
## Common Mistakes
## Further Reading`
      }]
    };
  }
  if (d.action === "career") {
    return {
      json: false,
      messages: [{
        role: "system",
        content: SYS
      }, {
        role: "user",
        content: `Career Goal: ${d.goal}
Experience: ${d.years} years
Background: ${d.background ?? "n/a"}

## Reality Check (market 2025-2026, salary USD & INR)
## Skills Gap
## 12-Week Roadmap
## Portfolio Projects (4-6)
## Resources (real names)
## Interview Prep
## Application Strategy
## 30/60/90 Day Milestones`
      }]
    };
  }
  return {
    json: false,
    messages: [{
      role: "system",
      content: SYS
    }, {
      role: "user",
      content: `Synthesize notes into a study brief:

"""${d.notes}"""

## TL;DR
## Key Concepts
## Definitions
## How It Fits Together
## Worked Examples
## Practice Questions (5)
## Spaced-Repetition Cues (5)`
    }]
  };
}
function titleFor(d) {
  switch (d.action) {
    case "quiz":
      return `Quiz · ${d.topic}`;
    case "flashcards":
      return `Flashcards · ${d.topic}`;
    case "reminder":
      return `Reminder · ${d.task.slice(0, 60)}`;
    case "doubt":
      return `Doubt · ${d.question.slice(0, 60)}`;
    case "career":
      return `Career plan · ${d.goal.slice(0, 60)}`;
    case "synth":
      return `Synthesis · ${d.notes.slice(0, 50)}…`;
  }
}
const runAiTool_createServerFn_handler = createServerRpc({
  id: "33af551c8f8394d9f57af892e3af12cb6f428728b849520f0b91d27807f95f0e",
  name: "runAiTool",
  filename: "src/lib/ai-tools.functions.ts"
}, (opts) => runAiTool.__executeServer(opts));
const runAiTool = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(runAiTool_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    json,
    messages
  } = buildMessages(data);
  const body = {
    messages
  };
  if (json) body.response_format = {
    type: "json_object"
  };
  const res = await callUserAiChat(body, "fast");
  if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Top up your AI provider account.");
  if (!res.ok) throw new Error(`AI provider error (${res.status})`);
  const payload = await res.json();
  const content = payload.choices?.[0]?.message?.content ?? "";
  let result;
  if (!json) {
    result = {
      kind: "markdown",
      content
    };
  } else {
    let jsonStr = content;
    try {
      JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned invalid JSON. Try again.");
      jsonStr = m[0];
      JSON.parse(jsonStr);
    }
    result = {
      kind: "json",
      json: jsonStr
    };
  }
  try {
    const {
      supabase,
      userId
    } = context;
    await supabase.from("ai_outputs").insert({
      user_id: userId,
      tool: data.action,
      title: titleFor(data),
      payload: {
        input: data,
        output: result
      }
    });
  } catch (e) {
    console.error("ai_outputs save failed", e);
  }
  return result;
});
export {
  runAiTool_createServerFn_handler
};
