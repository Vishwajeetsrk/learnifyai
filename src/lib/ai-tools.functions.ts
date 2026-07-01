import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";
import { z } from "zod";

const QuizInput = z.object({
  action: z.literal("quiz"),
  topic: z.string().min(2).max(500),
  count: z.number().int().min(1).max(20).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});
const DoubtInput = z.object({
  action: z.literal("doubt"),
  question: z.string().min(2).max(4000),
  subject: z.string().max(200).optional(),
  courseId: z.string().uuid().optional(),
});
const CareerInput = z.object({
  action: z.literal("career"),
  goal: z.string().min(2).max(1000),
  background: z.string().max(2000).optional(),
  years: z.number().min(0).max(40).default(0),
});
const ReminderInput = z.object({
  action: z.literal("reminder"),
  task: z.string().min(2).max(500),
  when: z.string().min(1).max(200),
  goal: z.string().max(500).optional(),
});
const SynthInput = z.object({
  action: z.literal("synth"),
  notes: z.string().min(10).max(20000),
});
const FlashInput = z.object({
  action: z.literal("flashcards"),
  topic: z.string().min(2).max(500),
  count: z.number().int().min(3).max(30).default(10),
});

const Input = z.discriminatedUnion("action", [
  QuizInput,
  DoubtInput,
  CareerInput,
  ReminderInput,
  SynthInput,
  FlashInput,
]);

const SYS = `You are Learnify AI — a senior technical mentor and educator. Be accurate, concrete, current (2025-2026), and production-grade. Provide direct, short answers. Use concise bullet points for the best presentation. Avoid fluff and filler.`;

function jsonInstruction(schemaHint: string) {
  return `Respond with ONLY valid minified JSON matching this schema (no markdown, no prose, no code fences):\n${schemaHint}`;
}

function buildMessages(d: z.infer<typeof Input>, ragContext?: string) {
  if (d.action === "quiz") {
    return {
      json: true,
      messages: [
        { role: "system", content: SYS },
        {
          role: "user",
          content: `Generate ${d.count} multiple-choice quiz questions on "${d.topic}" at ${d.difficulty} difficulty. Each question must have exactly 4 distinct options, one correct answer (0-indexed), and a short 1-sentence explanation. ${jsonInstruction(`{"questions":[{"question":string,"options":[string,string,string,string],"answer":0|1|2|3,"explanation":string}]}`)}`,
        },
      ],
    };
  }
  if (d.action === "flashcards") {
    return {
      json: true,
      messages: [
        { role: "system", content: SYS },
        {
          role: "user",
          content: `Create ${d.count} study flashcards on "${d.topic}". Front = concise prompt; Back = very short answer (1-2 sentences). ${jsonInstruction(`{"cards":[{"front":string,"back":string}]}`)}`,
        },
      ],
    };
  }
  if (d.action === "reminder") {
    return {
      json: true,
      messages: [
        { role: "system", content: SYS },
        {
          role: "user",
          content: `Create a smart, motivating study reminder.\nTask: ${d.task}\nWhen: ${d.when}\nGoal: ${d.goal ?? "n/a"}\nReturn a short title (max 60 chars), a focused body (1-2 sentences), and an ISO 8601 suggested_time. ${jsonInstruction(`{"title":string,"body":string,"suggested_time":string}`)}`,
        },
      ],
    };
  }
  if (d.action === "doubt") {
    let systemPrompt = SYS;
    if (ragContext) {
      systemPrompt += `\n\nCOURSE CONTEXT:\nUse the following extracted content from the course to answer the user's doubt. Do NOT hallucinate information outside this context if it's a specific course question.\n\n${ragContext}`;
    }

    return {
      json: false,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Subject: ${d.subject ?? "General"}\nQuestion: ${d.question}\n\nProvide the response using short bullet points:\n## Direct Answer (1-2 sentences)\n## Why / How It Works (bullet points)\n## Worked Example (with code if relevant)\n## Common Mistakes (bullet points)\n## Further Reading (bullet points)`,
        },
      ],
    };
  }
  if (d.action === "career") {
    return {
      json: false,
      messages: [
        { role: "system", content: SYS },
        {
          role: "user",
          content: `Career Goal: ${d.goal}\nExperience: ${d.years} years\nBackground: ${d.background ?? "n/a"}\n\nProvide the response using short bullet points:\n## Reality Check (market 2025-2026, salary USD & INR)\n## Skills Gap (bullets)\n## 12-Week Roadmap (brief milestones)\n## Portfolio Projects (4-6 bullets)\n## Resources (real names)\n## Interview Prep (bullets)\n## Application Strategy (bullets)\n## 30/60/90 Day Milestones`,
        },
      ],
    };
  }
  return {
    json: false,
    messages: [
      { role: "system", content: SYS },
      {
        role: "user",
        content: `Synthesize notes into a short study brief using bullet points:\n\n"""${d.notes}"""\n\n## TL;DR (short summary)\n## Key Concepts (bullets)\n## Definitions (bullets)\n## How It Fits Together\n## Worked Examples\n## Practice Questions (5)\n## Spaced-Repetition Cues (5)`,
      },
    ],
  };
}

function titleFor(d: z.infer<typeof Input>): string {
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

export const runAiTool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data, context }) => {
    let ragContext = "";

    // If it's a doubt and we have a courseId, fetch RAG context
    if (data.action === "doubt" && data.courseId) {
      try {
        const { searchCourseContext } = await import("./rag.functions");
        const matches = await searchCourseContext({
          data: { courseId: data.courseId, query: data.question, limit: 3 },
          context,
        } as any);

        if (matches && matches.length > 0) {
          ragContext = matches.map((m: any) => m.content).join("\n\n---\n\n");
        }
      } catch (e) {
        console.error("Failed to fetch RAG context:", e);
      }
    }

    const { json, messages } = buildMessages(data, ragContext);
    const body: Record<string, unknown> = { messages };
    if (json) body.response_format = { type: "json_object" };

    const res = await callUserAiChat(body as any, "fast");
    if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Top up your AI provider account.");
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "";

    let result: { kind: "markdown" | "json"; content?: string; json?: string };
    if (!json) {
      result = { kind: "markdown", content };
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
      result = { kind: "json", json: jsonStr };
    }

    // Auto-save to history
    try {
      const { supabase, userId } = context;
      await supabase.from("ai_outputs").insert({
        user_id: userId,
        tool: data.action,
        title: titleFor(data),
        payload: { input: data, output: result },
      });
    } catch (e) {
      console.error("ai_outputs save failed", e);
    }

    return result;
  });
