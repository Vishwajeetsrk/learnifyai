import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const GEMINI_EMBEDDING_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent";

/**
 * Generate a 768-dimensional embedding using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");

  const response = await fetch(`${GEMINI_EMBEDDING_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/text-embedding-004",
      content: { parts: [{ text }] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to generate embedding: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

/**
 * Split text into roughly equal-sized chunks without breaking words completely
 */
function chunkText(text: string, maxCharsPerChunk = 1500): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  const paragraphs = text.split("\n\n");

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxCharsPerChunk && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += paragraph + "\n\n";
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const ProcessMaterialInput = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2),
  type: z.enum(["pdf", "transcript", "note"]),
  content: z.string().min(10), // The actual text to embed
});

export const processCourseMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProcessMaterialInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. Verify user is creator of course
    const { data: course, error: courseErr } = await supabase
      .from("courses" as any)
      .select("created_by")
      .eq("id", data.courseId)
      .single() as any;

    if (courseErr || !course || course.created_by !== userId) {
      throw new Error("Unauthorized to add materials to this course.");
    }

    // 2. Insert material record
    const { data: material, error: matErr } = await supabase
      .from("course_materials" as any)
      .insert({
        course_id: data.courseId,
        title: data.title,
        material_type: data.type,
      })
      .select()
      .single() as any;

    if (matErr || !material) throw new Error("Failed to create material record.");

    // 3. Chunk text
    const chunks = chunkText(data.content);

    // 4. Generate embeddings and insert
    // We do this sequentially to avoid rate limits on free Gemini tier, or chunk them.
    for (const textChunk of chunks) {
      try {
        const embedding = await generateEmbedding(textChunk);
        
        await supabase
          .from("material_chunks" as any)
          .insert({
            material_id: material.id,
            course_id: data.courseId,
            content: textChunk,
            embedding, // inserting vector array directly is supported by supabase-js
          });
      } catch (e) {
        console.error("Embedding chunk failed:", e);
        // Continue with other chunks even if one fails
      }
    }

    return { success: true, chunksProcessed: chunks.length };
  });

const SearchInput = z.object({
  courseId: z.string().uuid(),
  query: z.string().min(3),
  limit: z.number().min(1).max(10).default(3),
});

export const searchCourseContext = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SearchInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // 1. Embed query
    const queryEmbedding = await generateEmbedding(data.query);

    // 2. Call RPC
    const { data: matches, error } = await supabase.rpc("match_material_chunks" as any, {
      query_embedding: queryEmbedding,
      match_threshold: 0.7, // Only return relevant matches
      match_count: data.limit,
      filter_course_id: data.courseId,
    });

    if (error) {
      console.error("RPC Error:", error);
      throw new Error("Failed to search course content");
    }

    return matches as unknown as Array<{ id: string; content: string; similarity: number }>;
  });
