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
  resumeText: z.string().min(10).max(50000),
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

const ExtractResumeInput = z.object({
  rawText: z.string().min(1).max(100000).optional().default(""),
});

export const extractResumeFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ExtractResumeInput.parse(d || {}))
  .handler(async ({ data }) => {
    const rawText = data.rawText || "";
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
}`,
        },
        {
          role: "user",
          content: `Extract structured info from this resume text:\n"""${rawText}"""`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    };

    let result: any = {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
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
        try {
          result = { ...result, ...JSON.parse(content) };
        } catch {
          const m = content.match(/\{[\s\S]*\}/);
          if (m) result = { ...result, ...JSON.parse(m[0]) };
        }
      }
    } catch {
      // Ignore AI errors and fall through to regex extraction
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

    // Email regex fallback
    if (!result.email) {
      const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) result.email = emailMatch[0];
    }

    // Phone regex fallback
    if (!result.phone) {
      const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (phoneMatch) result.phone = phoneMatch[0];
    }

    // Experience regex fallback
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
