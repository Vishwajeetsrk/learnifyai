import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const generateSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const generateCourseSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => generateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    
    // Optional: verify admin role
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
    const userRoles = (roles ?? []).map((r: any) => r.role);
    if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
      throw new Error("Forbidden");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured.");
    }

    const prompt = `
You are an expert Frontend Developer and Educator. 
Create a realistic interactive course syllabus and DOM architecture tree for a project called "${data.title}".
Project Description: ${data.description}

You must respond ONLY with valid JSON. Do not include markdown formatting like \`\`\`json. The JSON must have two root arrays:
1. "course_modules": An array of exactly 3 or 4 steps. Each step must have:
   - "step": number
   - "title": string (short step title)
   - "text": string (explanation of what we are building)
   - "voice_script": string (conversational AI tutor script for this step)
   - "code_snippet": string (a small React/Tailwind/GSAP code snippet for this step)
   - "quiz": object (a multiple choice knowledge-check for this step) containing:
      - "question": string
      - "options": array of 4 string options
      - "correct_index": number (0-3)
      - "explanation": string (why the answer is correct)

2. "architecture_nodes": An array representing the root DOM tree structure. Each node must have:
   - "id": string (unique slug)
   - "label": string (e.g. "<main className='relative overflow-hidden'>")
   - "type": string (one of: "container", "media", "component", "animation")
   - "children": array of nested nodes with the exact same structure (keep it 2-3 levels deep max)

Example JSON Output:
{
  "course_modules": [
    {
      "step": 1,
      "title": "Building the Foundation",
      "text": "Set up the main container with full screen height.",
      "voice_script": "Welcome! Let's start by laying down the main container...",
      "code_snippet": "<main className='w-full min-h-screen bg-black text-white'>\\n</main>",
      "quiz": {
        "question": "Which Tailwind class is used to set the minimum height to the full viewport?",
        "options": ["h-full", "h-screen", "min-h-screen", "max-h-screen"],
        "correct_index": 2,
        "explanation": "min-h-screen ensures the container is at least the height of the viewport, but can grow if content expands."
      }
    }
  ],
  "architecture_nodes": [
    {
      "id": "root",
      "label": "<main>",
      "type": "container",
      "children": []
    }
  ]
}
`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;
      
      return JSON.parse(text);
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      throw new Error(error.message || "Failed to generate course content");
    }
  });
