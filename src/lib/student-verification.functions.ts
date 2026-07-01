import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendStudentVerificationOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ email: z.string().email().regex(/\.edu$/i, "Must be a .edu email") }).parse(d),
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

    // Send OTP via email (using Resend or any email service)
    // For now, we'll use Supabase's built-in email or a simple webhook
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Learnify AI <verification@learnifyai.in>",
            to: data.email,
            subject: "Your Student Verification Code",
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #6d28d9;">Student Verification</h2>
                <p>Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6d28d9; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
              </div>
            `,
          }),
        });
      } catch (e) {
        console.error("Failed to send verification email:", e);
      }
    }

    return { success: true, otpPreview: otp }; // otpPreview for dev only
  });

export const verifyStudentOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ otp: z.string().length(6) }).parse(d),
  )
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
