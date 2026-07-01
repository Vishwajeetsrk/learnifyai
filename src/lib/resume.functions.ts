import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";
import { z } from "zod";

const SYSPROMPT = `You are an expert resume writer and career coach. Generate professional, ATS-friendly resume content. Use current industry standards (2025-2026). Return structured markdown. Be specific, quantifiable, and impactful.`;

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
${data.summary ? `\nProfessional Summary: ${data.summary}` : ""}
- Experience: ${data.experience}
${data.education ? `\n- Education: ${data.education}` : ""}
- Skills: ${data.skills}
${data.certifications ? `\n- Certifications: ${data.certifications}` : ""}
${data.projects ? `\n- Projects: ${data.projects}` : ""}

Format the resume with:
## Professional Summary (3-4 impactful bullet points)
## Skills (organized by category)
## Professional Experience (bullet points with metrics)
## Education
## Certifications (if any)
## Projects (if any)

Use strong action verbs, quantify achievements, include relevant keywords for ${data.targetRole}.`,
        },
      ],
      temperature: 0.7,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Generation failed (${res.status})`);
    const payload = await res.json();
    return { content: payload.choices?.[0]?.message?.content ?? "" };
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

Return ONLY valid JSON (no markdown, no prose):
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
          content: `You are an expert career coach and learning path designer. Create detailed, actionable career roadmaps. Current year: 2025-2026. Be specific with resources, projects, and milestones.`,
        },
        {
          role: "user",
          content: `Create a ${data.timeline} career roadmap to become a ${data.targetRole}.

Current Situation:
${data.currentRole ? `- Current Role: ${data.currentRole}` : ""}
- Current Skills: ${data.skills}
${data.experience ? `- Experience: ${data.experience}` : ""}
${data.education ? `- Education: ${data.education}` : ""}
- Learning Preference: ${data.learningStyle}

Return in markdown with these sections:
## Phase 1: Foundation (Month 1-${data.timeline === "3 months" ? "1" : data.timeline === "6 months" ? "2" : "3"})
- Skills to learn with specific topics
- Free resources (real courses, docs, YouTube channels)
- Mini projects to build

## Phase 2: Intermediate (Month ${data.timeline === "3 months" ? "2" : data.timeline === "6 months" ? "3" : "4-6"})
- Advanced skills
- Practice platforms
- Portfolio projects with descriptions

## Phase 3: Advanced (Month ${data.timeline === "3 months" ? "3" : data.timeline === "6 months" ? "4-6" : "7-12"})
- Specialization areas
- Real-world projects
- Certification recommendations

## Skill Gap Analysis
- Current vs required skills
- Priority order

## Monthly Milestones
- Specific, measurable goals per month

## Resources
- Best courses (free + paid)
- Books, blogs, communities
- Practice platforms

## Portfolio Projects
- 4-6 project ideas with tech stacks

## Interview Preparation
- Key topics to master
- Practice platforms
- Common questions`,
        },
      ],
      temperature: 0.7,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Roadmap generation failed (${res.status})`);
    const payload = await res.json();
    return { content: payload.choices?.[0]?.message?.content ?? "" };
  });

const ExtractResumeInput = z.object({
  rawText: z.string().min(20).max(100000),
});

export const extractResumeFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ExtractResumeInput.parse(d))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Extract structured information from the resume text. Return ONLY valid JSON matching this schema, no markdown, no code fences:
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
If a field cannot be found, set it to an empty string. Merge all work history into the experience field. Merge all education entries into the education field.`,
        },
        { role: "user", content: `Extract structured info from this resume:\n"""${data.rawText}"""` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    };

    const res = await callUserAiChat(body as any, "fast");
    if (!res.ok) throw new Error(`Resume parsing failed (${res.status})`);
    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw new Error("Failed to parse resume data");
    }
  });

const PortfolioInput = z.object({
  fullName: z.string().min(1).max(200),
  tagline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.string().max(2000),
  projects: z.string().max(3000).optional(),
  socialLinks: z.string().max(1000).optional(),
  experience: z.string().max(2000).optional(),
  education: z.string().max(1000).optional(),
  style: z.enum(["developer", "designer", "minimal", "creative"]).default("developer"),
});

export const generatePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => PortfolioInput.parse(d))
  .handler(async ({ data }) => {
    const body = {
      messages: [
        {
          role: "system",
          content: `You are an expert portfolio consultant and web developer. Generate detailed portfolio content and structure optimized for recruiters. Current trends: 2025-2026.`,
        },
        {
          role: "user",
          content: `Create a professional portfolio plan (${data.style} style) for ${data.fullName}.

${data.tagline ? `Tagline: ${data.tagline}` : ""}
${data.bio ? `Bio: ${data.bio}` : ""}
Skills: ${data.skills}
${data.projects ? `Projects: ${data.projects}` : ""}
${data.socialLinks ? `Links: ${data.socialLinks}` : ""}
${data.experience ? `Experience: ${data.experience}` : ""}
${data.education ? `Education: ${data.education}` : ""}

Return in markdown:
## Portfolio Structure
- Pages/sections to include
- Navigation flow

## Content for Each Section
- Hero section text
- About me (compelling bio)
- Skills (organized with proficiency levels)
- Project descriptions (with tech stack, impact)
- Experience timeline
- Education & certifications

## Design Recommendations
- Color scheme suggestions
- Typography choices
- Layout patterns
- Animations to include

## Technical Recommendations
- Best framework/stack for this style
- Hosting options
- SEO tips
- Performance optimizations

## Content Suggestions
- Blog post topics to showcase expertise
- Open source contributions to highlight
- GitHub profile optimization tips`,
        },
      ],
      temperature: 0.7,
    };

    const res = await callUserAiChat(body as any, "pro");
    if (!res.ok) throw new Error(`Portfolio generation failed (${res.status})`);
    const payload = await res.json();
    return { content: payload.choices?.[0]?.message?.content ?? "" };
  });
