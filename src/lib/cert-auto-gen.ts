/**
 * cert-auto-gen.ts
 * Auto-generates a certificate when a course is completed.
 * FIXED: now uses correct column names matching the `certificates` table.
 * SECURITY: Uses SUPABASE_SERVICE_ROLE_KEY (server-only, never VITE_ prefix).
 */
import { createClient } from "@supabase/supabase-js";
import { generateOpenBadgeV3 } from "./open-badges.functions";

function generateCertCode(): string {
  const part1 = Math.random().toString(36).slice(2, 8).toUpperCase();
  const part2 = Date.now().toString(36).toUpperCase();
  return `LRN-${part1}-${part2}`;
}

export async function autoGenerateCourseCertificate({
  studentId,
  studentName,
  studentEmail,
  courseId,
  courseName,
  score = 100,
  total = 100,
  templateId,
}: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  score?: number;
  total?: number;
  templateId?: string;
}) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://gnvsqwyexjuuwkjibxrr.supabase.co";
  // SECURITY: Must use service role key, never VITE_ prefix (that exposes it to the browser)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseKey) {
    console.error("[cert-auto-gen] SUPABASE_SERVICE_ROLE_KEY is not set — cannot auto-generate cert");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Idempotency: check if a cert already exists for this student+course
  const { data: existing } = await supabase
    .from("certificates")
    .select("id, code")
    .eq("user_id", studentId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) {
    console.log("[cert-auto-gen] Certificate already exists:", existing.code);
    const origin = process.env.APP_URL || "https://www.learnifyai.in";
    return { certId: existing.code, verificationUrl: `${origin}/verify/${existing.code}` };
  }

  const code = generateCertCode();
  const origin = process.env.APP_URL || "https://www.learnifyai.in";
  const verificationUrl = `${origin}/verify/${code}`;

  // Insert certificate using correct column names from the `certificates` table
  const { data: cert, error: certError } = await supabase
    .from("certificates")
    .insert({
      code,
      user_id: studentId,         // ✅ correct column (was: student_id)
      course_id: courseId,
      recipient_name: studentName, // ✅ correct column (was: student_name)
      score,
      total,
      issued_at: new Date().toISOString(),
      ...(templateId ? { template_id: templateId } : {}),
    })
    .select("id, code")
    .single();

  if (certError) {
    console.error("[cert-auto-gen] Error inserting certificate:", certError);
    return null;
  }

  // Log audit trail
  try {
    await supabase.from("certificate_audit_log").insert({
      certificate_id: cert.code,
      code: cert.code,
      action: "auto_issued",
      issued_by: studentId,
      recipient_user_id: studentId,
      recipient_email: studentEmail,
      recipient_name: studentName,
      course_id: courseId,
      score,
      total,
    });
  } catch (e: any) {
    console.warn("[cert-auto-gen] Audit log insert failed (non-critical):", e?.message);
  }

  // Generate Open Badge V3
  const badgeJson = generateOpenBadgeV3({
    certificateId: code,
    studentName,
    courseName,
    verificationUrl,
  });

  try {
    await supabase
      .from("certificate_badges")
      .insert({
        certificate_id: code,
        badge_name: courseName,
        badge_image: "/logo.png",
        w3c_vc_json: badgeJson,
      });
  } catch (e: any) {
    console.warn("[cert-auto-gen] Badge insert failed (non-critical):", e?.message);
  }

  return { certId: code, verificationUrl };
}
