import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";
import { z } from "zod";

const SYSPROMPT = `You are an expert resume writer and career coach. Generate professional, ATS-friendly resume content in clean Markdown.
CRITICAL MANDATES:
1. Do NOT use any emojis.
2. NEVER output Meta-comments, disclaimers, or notes like "Please note that the experience section is empty".
3. ALWAYS include ALL details provided by the candidate under Professional Experience. If the user provided work experience (e.g. "Software Engineer @ Rootbridge"), expand it into strong Google XYZ Formula bullet points ("Accomplished [X] as measured by [Y] by doing [Z]").
4. ALWAYS preserve ALL candidate URLs for LinkedIn, Projects, and Certifications verbatim as clean clickable Markdown links.
5. Include ALL candidate skills categorized by category (e.g., Programming Languages, Frontend, Backend, Databases, Tools).
6. Format cleanly with headers:
# [Candidate Name]
[Contact Line with Email | Phone | LinkedIn]

## Professional Summary
[3-4 high-impact bullet points]

## Technical Skills
[Categorized skills]

## Professional Experience
[Company, Role, Dates, and XYZ Formula bullet points]

## Education
[Degree, Institution, Dates]

## Projects
[Project titles, descriptions, and URLs]

## Certifications
[Certification names and URLs]`;

const ResumeInput = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  linkedin: z.string().max(300).optional(),
  summary: z.string().max(1000).optional(),
  experience: z.string().max(5000),
  education: z.string().max(2000).optional(),
  skills: z.string().max(2000),
  certifications: z.string().max(1000).optional(),
  projects: z.string().max(2000).optional(),
  targetRole: z.string().max(200),
  template: z.enum(["modern", "classic", "minimal", "executive"]).default("modern"),
});

export const generateResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ResumeInput.parse(d))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        { role: "system", content: SYSPROMPT },
        {
          role: "user",
          content: `Generate a professional ATS-optimized resume (${data.template} style) for a ${data.targetRole} role.

Candidate Info:
- Name: ${data.fullName}
- Email: ${data.email}${data.phone ? `\n- Phone: ${data.phone}` : ""}${data.linkedin ? `\n- LinkedIn: ${data.linkedin}` : ""}
${data.summary ? `\nProfessional Summary:\n${data.summary}` : ""}
- Experience:\n${data.experience}
${data.education ? `\n- Education:\n${data.education}` : ""}
- Skills:\n${data.skills}
${data.certifications ? `\n- Certifications:\n${data.certifications}` : ""}
${data.projects ? `\n- Projects:\n${data.projects}` : ""}

STRICT FORMAT & CONTENT RULES:
1. Header: Include Name, Email, Phone, and LinkedIn URL verbatim.
2. Professional Summary: Enhance candidate's summary into 3-4 high-impact bullets.
3. Technical Skills: Categorize ALL user skills (${data.skills}) into sections (e.g., Programming Languages, Frontend, Backend, Databases, Tools).
4. Professional Experience: Format candidate's experience (${data.experience}) into detailed accomplishment bullets using Google XYZ Formula ("Accomplished [X] as measured by [Y] by doing [Z]"). NEVER say "no experience details were provided".
5. Education: Format candidate's education (${data.education || "Degree/Institution"}).
6. Projects: List ALL candidate projects and preserve ALL project URLs verbatim as clickable markdown links (${data.projects || "None"}).
7. Certifications: List ALL candidate certifications and preserve ALL certification URLs verbatim as clickable markdown links (${data.certifications || "None"}).`,
        },
      ],
      temperature: 0.5,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Generation failed (${res.status})`);
    const payload = await res.json();
    let content: string = payload.choices?.[0]?.message?.content ?? "";

    // Clean up any AI disclaimer artifacts if generated
    content = content.replace(/Please note that the experience section is empty[^\n.]*[\n.]?/gi, "");
    content = content.replace(/no experience details were provided[^\n.]*[\n.]?/gi, "");

    // Fallback safety check: if experience section was stripped, append user's real experience formatted!
    if (data.experience && (!content.includes("Experience") || content.length < 100)) {
      content += `\n\n## Professional Experience\n${data.experience}`;
    }

    // Guarantee user URLs for projects and certifications are appended if not present
    if (data.projects && !content.includes(data.projects.trim().slice(0, 20))) {
      content += `\n\n## Key Projects\n${data.projects}`;
    }
    if (data.certifications && !content.includes(data.certifications.trim().slice(0, 20))) {
      content += `\n\n## Certifications\n${data.certifications}`;
    }

    return { content };
  });

const AtsInput = z.object({
  resumeText: z.string().min(50).max(50000),
  targetRole: z.string().min(2).max(200),
  industry: z.string().max(200).optional(),
});

export const checkAtsScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => AtsInput.parse(d))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert ATS (Applicant Tracking System) analyst. Analyze resumes against target roles and return a detailed JSON report. Be strict and honest. Current year: 2025-2026.`,
        },
        {
          role: "user",
          content: `Analyze this resume for a ${data.targetRole} role${data.industry ? ` in ${data.industry}` : ""}.

Resume:
"""${data.resumeText}"""

Return ONLY valid JSON (no markdown, no code fences):
{
  "overall_score": <0-100>,
  "format_score": <0-100>,
  "keywords_score": <0-100>,
  "readability_score": <0-100>,
  "impact_score": <0-100>,
  "missing_keywords": [<strings>],
  "present_keywords": [<strings>],
  "strengths": [<strings>],
  "weaknesses": [<strings>],
  "improvement_suggestions": [<strings>],
  "section_order_ok": <bool>,
  "length_ok": <bool>,
  "contact_info_present": <bool>,
  "grade": "A"|"B"|"C"|"D"|"F"
}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    };

    const res = await callUserAiChat(body as any, "fast");
    if (!res.ok) throw new Error(`ATS check failed (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw new Error("Invalid ATS analysis response");
    }
  });

const CareerInput = z.object({
  currentRole: z.string().max(200).optional(),
  targetRole: z.string().min(2).max(200),
  skills: z.string().max(2000),
  experience: z.string().max(1000).optional(),
  education: z.string().max(500).optional(),
  timeline: z.enum(["3 months", "6 months", "12 months", "24 months"]).default("12 months"),
  learningStyle: z.enum(["self-paced", "structured", "mentor-led"]).default("self-paced"),
});

export const generateCareerRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => CareerInput.parse(d))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert career coach and learning path designer. Create detailed, actionable career roadmaps. Current year: 2025-2026. Be specific with resources, projects, and milestones. Return ONLY valid JSON matching this schema, no markdown, no code fences:

{
  "title": string,
  "summary": string (2-3 sentence overview),
  "timeline_months": number,
  "current_skills": string[],
  "target_skills": string[],
  "skill_gap": [
    {
      "skill": string,
      "priority": "high" | "medium" | "low",
      "why": string
    }
  ],
  "phases": [
    {
      "title": string (e.g. "Foundation"),
      "subtitle": string (e.g. "Months 1-3"),
      "color": string (hex color like "#3b82f6"),
      "description": string,
      "skills": [
        {
          "name": string,
          "topics": string[] (specific topics to learn)
        }
      ],
      "courses": [
        {
          "title": string,
          "provider": string (e.g. "Coursera", "freeCodeCamp", "YouTube"),
          "url": string (real URL if known, else ""),
          "is_free": boolean,
          "duration": string
        }
      ],
      "projects": [
        {
          "title": string,
          "description": string,
          "tech_stack": string[],
          "difficulty": "beginner" | "intermediate" | "advanced"
        }
      ],
      "milestones": string[]
    }
  ],
  "monthly_milestones": [
    {
      "month": number,
      "goal": string,
      "deliverable": string
    }
  ],
  "interview_prep": {
    "topics": string[],
    "platforms": string[],
    "questions": string[]
  }
}`,
        },
        {
          role: "user",
          content: `Create a ${data.timeline} career roadmap to become a ${data.targetRole}.

Current Situation:
${data.currentRole ? `- Current Role: ${data.currentRole}` : ""}
- Current Skills: ${data.skills}
${data.experience ? `- Experience: ${data.experience}` : ""}
${data.education ? `- Education: ${data.education}` : ""}
- Learning Preference: ${data.learningStyle}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Roadmap generation failed (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return { roadmap: JSON.parse(content) };
    } catch {
      return { roadmap: null, rawContent: content };
    }
  });

const ExtractResumeInput = z.object({
  rawText: z.string().min(20).max(100000),
});

export const extractResumeFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ExtractResumeInput.parse(d))
  .handler(async ({ data }) => {
    const rawText = data.rawText;
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert resume parser. Extract structured information from the candidate's resume text. Return ONLY valid JSON matching this schema:
{
  "fullName": string,
  "email": string,
  "phone": string,
  "linkedin": string,
  "summary": string,
  "experience": string,
  "education": string,
  "skills": string,
  "certifications": string,
  "projects": string,
  "targetRole": string
}
CRITICAL RULES:
- Do NOT skip any details.
- Capture ALL work history and job entries into the "experience" field.
- Capture ALL project names and URLs (GitHub, Vercel, live demos) into the "projects" field.
- Capture ALL certification names and URLs (Coursera, Great Learning, Simplilearn, Forage) into the "certifications" field.
- Capture ALL technical skills mentioned in the resume into the "skills" field.
- If a field is missing, set it to an empty string.`,
        },
        {
          role: "user",
          content: `Extract structured info from this resume text:\n"""${rawText}"""`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    };

    const res = await callUserAiChat(body as any, "fast");
    let result: any = {};
    if (res.ok) {
      const payload = await res.json();
      const content: string = payload.choices?.[0]?.message?.content ?? "{}";
      try {
        result = JSON.parse(content);
      } catch {
        const m = content.match(/\{[\s\S]*\}/);
        if (m) result = JSON.parse(m[0]);
      }
    }

    // Comprehensive Fallback & Enhancer for URLs, Experience, Skills, Education
    const urlRegex = /(https?:\/\/[^\s,">]+)/gi;
    const urls = Array.from(new Set(rawText.match(urlRegex) || []));

    if (urls.length > 0) {
      if (!result.linkedin) {
        const linkedinUrl = urls.find((u) => u.includes("linkedin.com"));
        if (linkedinUrl) result.linkedin = linkedinUrl;
      }

      const projUrls = urls.filter(
        (u) =>
          u.includes("github.com") ||
          u.includes("vercel.app") ||
          u.includes("learnifyai.in") ||
          u.includes("github.io") ||
          (!u.includes("linkedin.com") &&
            !u.includes("coursera") &&
            !u.includes("greatlearning") &&
            !u.includes("simplilearn") &&
            !u.includes("forage")),
      );
      if (projUrls.length > 0) {
        const existingProj = result.projects || "";
        const missingProj = projUrls.filter((u) => !existingProj.includes(u));
        if (missingProj.length > 0) {
          result.projects = (existingProj ? existingProj + "\n" : "") + missingProj.join("\n");
        }
      }

      const certUrls = urls.filter(
        (u) =>
          u.includes("coursera") ||
          u.includes("greatlearning") ||
          u.includes("simplilearn") ||
          u.includes("forage") ||
          u.includes("certificate") ||
          u.includes("completion"),
      );
      if (certUrls.length > 0) {
        const existingCert = result.certifications || "";
        const missingCert = certUrls.filter((u) => !existingCert.includes(u));
        if (missingCert.length > 0) {
          result.certifications = (existingCert ? existingCert + "\n" : "") + missingCert.join("\n");
        }
      }
    }

    // Ensure experience is captured if rawText contains work experience lines
    if (!result.experience || result.experience.trim().length < 10) {
      const expMatch = rawText.match(
        /(?:Experience|Work History|Employment|History)[\s\S]*?(?=(?:Education|Skills|Projects|Certifications|$))/i,
      );
      if (expMatch) {
        result.experience = expMatch[0]
          .replace(/^(?:Experience|Work History|Employment|History)[\s:]*/i, "")
          .trim();
      }
    }

    return result;
  });
