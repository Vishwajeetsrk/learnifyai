import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
  lessonTitle: z.string().min(1).max(500),
  lessonContent: z.string().min(1).max(10000),
});

export const generateConceptGraph = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { callUserAiChat } = await import("./user-ai");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const existing = await supabaseAdmin
      .from("concept_graphs")
      .select("nodes, edges")
      .eq("lesson_id", data.lessonId)
      .maybeSingle();

    if (existing.data) {
      return { nodes: existing.data.nodes, edges: existing.data.edges, cached: true };
    }

    const prompt = `You are a curriculum designer. Analyze this lesson and extract an interconnected concept map.\n\nLesson Title: \"${data.lessonTitle}\"\nContent:\n${data.lessonContent.slice(0, 8000)}\n\nRespond with ONLY valid JSON (no markdown, no code fences):\n{\n  \"nodes\": [\n    { \"id\": \"concept_1\", \"label\": \"Concept Name\", \"type\": \"core\", \"description\": \"Brief 1-line definition\", \"difficulty\": 1 },\n    { \"id\": \"concept_2\", \"label\": \"Another Concept\", \"type\": \"prerequisite\", \"description\": \"Brief definition\", \"difficulty\": 1 }\n  ],\n  \"edges\": [\n    { \"from\": \"concept_1\", \"to\": \"concept_2\", \"label\": \"depends_on\", \"strength\": 1 },\n    { \"from\": \"concept_2\", \"to\": \"concept_3\", \"label\": \"implements\", \"strength\": 2 }\n  ]\n}\n\nRules:\n- 4-10 nodes covering the core concepts\n- type: \"core\" | \"prerequisite\" | \"example\" | \"definition\" | \"application\"\n- label: \"depends_on\" | \"implements\" | \"extends\" | \"example_of\" | \"relates_to\"\n- difficulty: 1-5\n- Keep descriptions under 80 chars`;

    const res = await callUserAiChat({
      messages: [
        { role: "system", content: "You are a concept mapping expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
    });

    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { nodes: [], edges: [] };

    const nodes = parsed.nodes || [];
    const edges = parsed.edges || [];

    await supabaseAdmin.from("concept_graphs").upsert({
      lesson_id: data.lessonId,
      course_id: data.courseId,
      nodes,
      edges,
      generated_at: new Date().toISOString(),
    });

    return { nodes, edges, cached: false };
  });

export const regenerateConceptGraph = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin
      .from("concept_graphs")
      .delete()
      .eq("lesson_id", data.lessonId);

    const { generateConceptGraph: gen } = await import("./concept-graph.functions");
    return gen({ data, context } as any);
  });
