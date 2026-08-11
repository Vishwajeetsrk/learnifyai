import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendStudentVerificationOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        email: z
          .string()
          .email()
          .refine(
            (val) => /(\.edu|\.ac\.in|\.edu\.in|\.ac\.uk|\.edu\.au|university|college)/i.test(val),
            { message: "Must be a valid student email address (.edu, .ac.in, .edu.in)" },
          ),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const otp = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const { error } = await (supabaseAdmin as any)
      .from("profiles")
      .update({
        student_email: data.email,
        student_verification_otp: otp,
        student_verification_otp_expires: expires,
      })
      .eq("id", context.userId);

    if (error) throw error;

    // Send OTP via email using the platform's multi-provider sendEmail
    try {
      const { sendEmail } = await import("./cert.functions");
      await sendEmail({
        to: data.email,
        subject: "Your Learnify AI Student Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6d28d9;">Student Verification</h2>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6d28d9; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Failed to send verification email:", e);
      // Don't throw — the OTP is stored in DB, user can retry
    }

    return { success: true };
  });

export const verifyStudentOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ otp: z.string().length(6) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error: fetchError } = await (supabaseAdmin as any)
      .from("profiles")
      .select("student_verification_otp, student_verification_otp_expires, student_email")
      .eq("id", context.userId)
      .single();

    if (fetchError) throw fetchError;
    if (!profile) throw new Error("Profile not found");

    if (!profile.student_verification_otp || !profile.student_verification_otp_expires) {
      throw new Error("No verification pending. Please request a new code.");
    }

    const now = new Date();
    const expires = new Date(profile.student_verification_otp_expires);
    if (now > expires) {
      throw new Error("Verification code expired. Please request a new code.");
    }

    if (profile.student_verification_otp !== data.otp) {
      throw new Error("Invalid verification code.");
    }

    // Mark as verified
    const { error: updateError } = await (supabaseAdmin as any)
      .from("profiles")
      .update({
        student_verified: true,
        student_verification_otp: null,
        student_verification_otp_expires: null,
      })
      .eq("id", context.userId);

    if (updateError) throw updateError;

    return { success: true, email: profile.student_email };
  });

export const getStudentVerificationStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data, error } = await (supabaseAdmin as any)
      .from("profiles")
      .select("student_verified, student_email")
      .eq("id", context.userId)
      .single();

    if (error) throw error;

    return {
      verified: data?.student_verified ?? false,
      email: data?.student_email ?? null,
    };
  });

export const adminListStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify admin role
    const { data: userRole } = await (supabaseAdmin as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (!userRole) throw new Error("Unauthorized: Admin access required");

    const { data, error } = await (supabaseAdmin as any)
      .from("profiles")
      .select("id, full_name, email, student_email, student_verified, updated_at, created_at")
      .not("student_email", "is", null)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const adminToggleStudentVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        verified: z.boolean(),
        studentEmail: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: userRole } = await (supabaseAdmin as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (!userRole) throw new Error("Unauthorized: Admin access required");

    const updates: any = { student_verified: data.verified };
    if (data.studentEmail !== undefined) {
      updates.student_email = data.studentEmail;
    }

    const { error } = await (supabaseAdmin as any)
      .from("profiles")
      .update(updates)
      .eq("id", data.userId);

    if (error) throw error;
    return { success: true };
  });
