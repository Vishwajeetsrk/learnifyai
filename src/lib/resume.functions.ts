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
  fullName: z.string().min(1).max(200).default("Developer"),
  email: z.string().max(200).optional().default(""),
  phone: z.string().max(50).optional().default(""),
  linkedin: z.string().max(300).optional().default(""),
  github: z.string().max(300).optional().default(""),
  website: z.string().max(300).optional().default(""),
  summary: z.string().max(2000).optional().default(""),
  experience: z.string().max(10000).optional().default(""),
  education: z.string().max(4000).optional().default(""),
  skills: z.string().max(4000).optional().default(""),
  certifications: z.string().max(2000).optional().default(""),
  projects: z.string().max(4000).optional().default(""),
  targetRole: z.string().max(200).optional().default("Software Engineer"),
  template: z
    .enum(["dreamsync", "modern", "classic", "minimal", "executive", "creative"])
    .optional()
    .default("dreamsync"),
});

export const generateResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ResumeInput.parse(d || {}))
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

    content = content.replace(/Please note that the experience section is empty[^\n.]*[\n.]?/gi, "");
    content = content.replace(/no experience details were provided[^\n.]*[\n.]?/gi, "");

    if (data.experience && (!content.includes("Experience") || content.length < 100)) {
      content += `\n\n## Professional Experience\n${data.experience}`;
    }

    if (data.projects && !content.includes(data.projects.trim().slice(0, 20))) {
      content += `\n\n## Key Projects\n${data.projects}`;
    }
    if (data.certifications && !content.includes(data.certifications.trim().slice(0, 20))) {
      content += `\n\n## Certifications\n${data.certifications}`;
    }

    return { content };
  });

const AtsInput = z.object({
  resumeText: z.string().min(5).max(50000),
  targetRole: z.string().min(1).max(200).optional().default("Software Engineer"),
  industry: z.string().max(200).optional().default(""),
});

export const checkAtsScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => AtsInput.parse(d || {}))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert ATS (Applicant Tracking System) analyst. Analyze resumes against target roles and return a detailed JSON report. Current year: 2025-2026.`,
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
  currentRole: z.string().max(200).optional().default(""),
  targetRole: z.string().min(1).max(200).optional().default("Software Engineer"),
  skills: z.string().max(2000).optional().default(""),
  experience: z.string().max(1000).optional().default(""),
  education: z.string().max(500).optional().default(""),
  timeline: z.enum(["3 months", "6 months", "12 months", "24 months"]).optional().default("12 months"),
  learningStyle: z.enum(["self-paced", "structured", "mentor-led"]).optional().default("self-paced"),
});

const ROADMAP_SCHEMA = `{
  "title": string,
  "summary": string,
  "timeline_months": number,
  "current_skills": string[],
  "target_skills": string[],
  "skill_gap": [{ "skill": string, "priority": "high" | "medium" | "low", "why": string }],
  "phases": [
    {
      "title": string,
      "subtitle": string,
      "color": string,
      "description": string,
      "skills": [{ "name": string, "topics": string[] }],
      "courses": [{ "title": string, "provider": string, "url": string, "is_free": boolean, "duration": string }],
      "projects": [{ "title": string, "description": string, "tech_stack": string[], "difficulty": "beginner" | "intermediate" | "advanced" }],
      "milestones": string[]
    }
  ],
  "monthly_milestones": [{ "month": number, "goal": string, "deliverable": string }],
  "interview_prep": { "topics": string[], "platforms": string[], "questions": string[] }
}`;

function extractJsonObject(content: string): any {
  const m = content.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON object found in response");
  return JSON.parse(m[0]);
}

export const generateCareerRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => CareerInput.parse(d || {}))
  .handler(async ({ data }) => {
    const { findRoadmapId, buildGroundingPrompt } = await import("@/lib/roadmap-content");
    const roadmapId = findRoadmapId(data.targetRole);
    let grounding = "";
    if (roadmapId) {
      try {
        const { ROADMAP_CONTENT } = await import("@/lib/roadmap-content.generated");
        const rd = ROADMAP_CONTENT[roadmapId];
        if (rd) grounding = buildGroundingPrompt(roadmapId, rd);
      } catch (e) {
        console.warn("Failed to load roadmap grounding:", e);
      }
    }

    const userContent = `Create a ${data.timeline} career roadmap to become a ${data.targetRole}.

CURRENT PROFILE:
- Current role: ${data.currentRole || "Not provided"}
- Current skills: ${data.skills || "Not provided"}
- Experience: ${data.experience || "Not provided"}
- Education: ${data.education || "Not provided"}
- Preferred learning style: ${data.learningStyle}

${grounding ? "REAL ROADMAP.SH TOPICS AND RESOURCES TO GROUND YOUR ANSWER:\n" + grounding + "\n\nUse these topics to structure phases, skills, courses and projects. Where provided, use the real resource URLs for course URLs and enrich course details (provider, free/paid, duration) from them.\n" : ""}
Return ONLY a valid JSON object matching the schema. Every phase must include courses, projects, and milestones arrays.`;

    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert career coach and learning path designer. Create detailed, actionable career roadmaps. Current year: 2025-2026. Return ONLY valid JSON matching this schema (no markdown fences, no prose):
${ROADMAP_SCHEMA}`,
        },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Roadmap generation failed (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return { roadmap: extractJsonObject(content), rawContent: null };
    } catch {
      return { roadmap: null, rawContent: content };
    }
  });

export const getRoadmapGuide = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: { roadmapId?: string; targetRole?: string }) =>
    z.object({ roadmapId: z.string().optional(), targetRole: z.string().optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { findRoadmapId } = await import("@/lib/roadmap-content");
    const { ROADMAP_CONTENT } = await import("@/lib/roadmap-content.generated");
    const id = data.roadmapId || findRoadmapId(data.targetRole || "");
    if (!id) return { roadmapId: null, roadmap: null };
    const rd = ROADMAP_CONTENT[id];
    if (!rd) return { roadmapId: id, roadmap: null };
    return { roadmapId: id, roadmap: rd };
  });

const ExtractResumeInput = z.object({
  rawText: z.string().min(1).max(100000).optional().default(""),
});

function cleanAndParseJson(text: string): any {
  if (!text) return {};
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?/gi, "").replace(/```$/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {}

  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const sanitized = m[0].replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(sanitized);
    } catch {}
  }
  return {};
}

export const extractResumeFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ExtractResumeInput.parse(d || {}))
  .handler(async ({ data }) => {
    const rawText = data.rawText || "";
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert resume parser. Extract structured information from the candidate's resume text. Return ONLY a valid JSON object with keys:
"fullName", "email", "phone", "linkedin", "github", "summary", "experience", "education", "skills", "certifications", "projects", "targetRole".

STRICT RULES:
1. experience: Extract EVERY job entry as one line each: "Role @ Company (Start - End): Achievements". Preserve ALL companies, roles, dates and achievements.
2. projects: Extract EVERY project: "- Name (URL): Description [tech1, tech2]".
3. skills: List ALL skills separated by commas, e.g. "React, Node.js, Python, AWS, SQL, Git".
4. education: "Degree — Institution (Year)" per line.
5. summary: 2-3 sentence professional summary.
6. targetRole: Target job title (e.g. "Full Stack Developer").
7. Use "" for missing fields. Do not wrap in markdown fences.`,
        },
        {
          role: "user",
          content: `Extract structured info from this resume text:\n"""${rawText}"""`,
        },
      ],
      temperature: 0.1,
    };

    let result: any = {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      summary: "",
      experience: "",
      education: "",
      skills: "",
      certifications: "",
      projects: "",
      targetRole: "",
    };

    try {
      const res = await callUserAiChat(body as any, "fast");
      if (res.ok) {
        const payload = await res.json();
        const content: string = payload.choices?.[0]?.message?.content ?? "{}";
        const parsed = cleanAndParseJson(content);
        result = { ...result, ...parsed };
      }
    } catch (err) {
      console.warn("AI extraction warning, applying fallback regex extraction:", err);
    }

    const urlRegex = /(https?:\/\/[^\s,">]+)/gi;
    const urls = Array.from(new Set(rawText.match(urlRegex) || []));

    if (urls.length > 0) {
      if (!result.linkedin) {
        const linkedinUrl = urls.find((u) => u.includes("linkedin.com"));
        if (linkedinUrl) result.linkedin = linkedinUrl;
      }
      if (!result.github) {
        const githubUrl = urls.find((u) => u.includes("github.com"));
        if (githubUrl) result.github = githubUrl;
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
    }

    if (!result.fullName || result.fullName.length < 2) {
      const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines.slice(0, 5)) {
        if (
          line.length > 2 &&
          line.length < 40 &&
          !line.includes("@") &&
          !line.includes("http") &&
          !/resume|curriculum|cv|phone|email/i.test(line)
        ) {
          result.fullName = line;
          break;
        }
      }
    }

    if (!result.email) {
      const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) result.email = emailMatch[0];
    }

    if (!result.phone) {
      const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (phoneMatch) result.phone = phoneMatch[0];
    }

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

    if (!result.skills || result.skills.trim().length < 3) {
      const skillsMatch = rawText.match(
        /(?:Skills|Technical Skills|Core Competencies|Expertise|Proficiencies)[\s\S]*?(?=(?:Experience|Work History|Employment|Education|Projects|Certifications|$))/i,
      );
      if (skillsMatch) {
        result.skills = skillsMatch[0]
          .replace(/^(?:Skills|Technical Skills|Core Competencies|Expertise|Proficiencies)[\s:]*/i, "")
          .replace(/\n{2,}/g, "\n")
          .trim();
      }
    }

    if (!result.education || result.education.trim().length < 3) {
      const eduMatch = rawText.match(
        /(?:Education|Academic Background|Qualifications)[\s\S]*?(?=(?:Experience|Skills|Projects|Certifications|$))/i,
      );
      if (eduMatch) {
        result.education = eduMatch[0]
          .replace(/^(?:Education|Academic Background|Qualifications)[\s:]*/i, "")
          .replace(/\n{2,}/g, "\n")
          .trim();
      }
    }

    if (!result.projects || result.projects.trim().length < 3) {
      const projMatch = rawText.match(
        /(?:Projects|Key Projects|Portfolio|Project Experience)[\s\S]*?(?=(?:Experience|Skills|Education|Certifications|$))/i,
      );
      if (projMatch) {
        result.projects = projMatch[0]
          .replace(/^(?:Projects|Key Projects|Portfolio|Project Experience)[\s:]*/i, "")
          .replace(/\n{2,}/g, "\n")
          .trim();
      }
    }

    return result;
  });

const InterviewQuestionInput = z.object({
  role: z.string().min(1).max(100).optional().default("Software Engineer"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
  category: z.enum(["technical", "behavioral", "system_design", "hr"]).optional().default("technical"),
  previousQuestions: z.array(z.string()).optional(),
});

export const generateInterviewQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => InterviewQuestionInput.parse(d || {}))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are a senior tech interviewer. Generate realistic interview questions for a ${data.role} position. Difficulty: ${data.difficulty}. Category: ${data.category}. Return ONLY valid JSON matching:
{
  "question": string,
  "hints": string[],
  "keyConcepts": string[],
  "idealAnswerOutline": string[]
}`,
        },
        {
          role: "user",
          content: `Generate a ${data.difficulty} ${data.category} question for ${data.role}.${data.previousQuestions?.length ? ` Avoid these previous questions: ${data.previousQuestions.join("; ")}` : ""}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    };

    const res = await callUserAiChat(body as any, "fast");
    if (!res.ok) throw new Error(`Failed to generate question (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw new Error("Invalid interview question format");
    }
  });

const EvaluateAnswerInput = z.object({
  question: z.string().min(1).optional().default("Technical Question"),
  answer: z.string().min(1).optional().default("Answer"),
  role: z.string().optional().default("Software Engineer"),
});

export const evaluateInterviewAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => EvaluateAnswerInput.parse(d || {}))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert tech interviewer evaluating a candidate's answer. Return ONLY valid JSON matching:
{
  "score": number (0-100),
  "feedback": string,
  "strengths": string[],
  "improvements": string[],
  "modelAnswer": string
}`,
        },
        {
          role: "user",
          content: `Question: ${data.question}\n\nCandidate Answer: ${data.answer}${data.role ? `\nRole: ${data.role}` : ""}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    };

    const res = await callUserAiChat(body as any, "fast");
    if (!res.ok) throw new Error(`Evaluation failed (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw new Error("Invalid evaluation format");
    }
  });

const PortfolioInput = z.object({
  fullName: z.string().optional().default("Developer"),
  title: z.string().optional().default("Full Stack Developer"),
  tagline: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  skills: z.union([z.string(), z.array(z.string())]).optional().default(""),
  softSkills: z.string().optional().default(""),
  tools: z.string().optional().default(""),
  projects: z.any().optional().default(""),
  socials: z.any().optional().default(""),
  socialLinks: z.string().optional().default(""),
  experience: z.any().optional().default(""),
  education: z.any().optional().default(""),
  style: z.string().optional().default("developer"),
});

export const generatePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => PortfolioInput.parse(d || {}))
  .handler(async ({ data }) => {
    const titleVal = data.title || data.tagline || "Full Stack Developer";
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert web portfolio designer and copywriter. Generate professional developer portfolio content. Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: `Generate a structured portfolio for: Name: ${data.fullName}, Title: ${titleVal}, Skills: ${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Portfolio generation failed (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      return { content, rawContent: content };
    }
  });
