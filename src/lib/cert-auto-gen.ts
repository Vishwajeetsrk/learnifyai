import { createClient } from "@supabase/supabase-js";
import { generateOpenBadgeV3 } from "./open-badges.functions";

export async function autoGenerateCourseCertificate({
  studentId,
  studentName,
  studentEmail,
  courseId,
  courseName,
}: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
}) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://gnvsqwyexjuuwkjibxrr.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const certId = `LRN-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://learnifyaitool.vercel.app";
  const verificationUrl = `${origin}/verify/${certId}`;

  const { data: cert, error } = await supabase
    .from("certificates")
    .insert({
      certificate_id: certId,
      student_id: studentId,
      course_id: courseId,
      student_name: studentName,
      course_name: courseName,
      status: "verified",
      metadata_json: { verificationUrl },
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting certificate:", error);
  }

  const badgeJson = generateOpenBadgeV3({
    certificateId: certId,
    studentName,
    courseName,
    verificationUrl,
  });

  await supabase.from("certificate_badges").insert({
    certificate_id: certId,
    badge_name: courseName,
    badge_image: "/logo.png",
    w3c_vc_json: badgeJson,
  });

  return { certId, verificationUrl };
}
