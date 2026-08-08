import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ─── Public: submit a job application (careers page) ─── */
export const submitJobApplication = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        jobId: z.string().min(1),
        name: z.string().min(2).max(200),
        email: z.string().email().max(200),
        phone: z.string().max(40).optional().nullable(),
        experience: z.string().max(200).optional().nullable(),
        resumeText: z.string().min(10).max(20000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("job_applications").insert({
      job_id: data.jobId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      experience: data.experience?.trim() || null,
      resume_text: data.resumeText.trim(),
      status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Admin: list applications ─── */
export const listJobApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("job_applications")
      .select("*, job_postings:job_id(title, team, location)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ─── Admin: update application status / notes ─── */
export const updateJobApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        applicationId: z.string().uuid(),
        status: z.enum(["new", "reviewed", "shortlisted", "rejected", "hired"]).optional(),
        notes: z.string().max(2000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { applicationId, ...updates } = data;
    const { error } = await supabase
      .from("job_applications")
      .update(updates)
      .eq("id", applicationId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
