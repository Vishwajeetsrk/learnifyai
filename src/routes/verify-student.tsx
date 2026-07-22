import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  sendStudentVerificationOtp,
  verifyStudentOtp,
  getStudentVerificationStatus,
} from "@/lib/student-verification.functions";

export const Route = createFileRoute("/verify-student")({
  head: () => ({
    meta: [
      { title: "Student Verification — Learnify AI" },
      {
        name: "description",
        content: "Verify your .edu student email to get 20% off all paid plans on Learnify AI.",
      },
    ],
  }),
  component: VerifyStudentPage,
});

function VerifyStudentPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const isStudentEmail = (e: string) => {
    const lower = e.toLowerCase().trim();
    return (
      lower.endsWith(".edu") ||
      lower.endsWith(".ac.in") ||
      lower.endsWith(".edu.in") ||
      lower.endsWith(".ac.uk") ||
      lower.endsWith(".edu.au") ||
      lower.includes("university") ||
      lower.includes("college") ||
      lower.includes("student")
    );
  };

  const statusQuery = useQuery({
    queryKey: ["student-verification-status"],
    queryFn: () => getStudentVerificationStatus({ data: undefined }),
  });

  const sendOtpMutation = useMutation({
    mutationFn: () => sendStudentVerificationOtp({ data: { email } }),
    onSuccess: (result) => {
      setOtpSent(true);
      toast.success("Verification code sent! Check your email.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification code");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () => verifyStudentOtp({ data: { otp } }),
    onSuccess: (result) => {
      setVerified(true);
      qc.invalidateQueries({ queryKey: ["student-verification-status"] });
      toast.success("Student status verified! You now get 20% off all plans.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Verification failed");
    },
  });

  if (statusQuery.data?.verified || verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 grid place-items-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <CardTitle className="text-emerald-600 dark:text-emerald-400">
                Student Verified!
              </CardTitle>
              <CardDescription>
                Your student status has been verified. You get 20% off all paid plans.
                {statusQuery.data?.email && (
                  <span className="block mt-1 text-sm">
                    Verified with: {statusQuery.data.email}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/pricing" search={{ subscribe: undefined }}>
                  Browse Plans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="border-border/80 bg-card/90 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/30 grid place-items-center mb-3 shadow-md">
              <GraduationCap className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 px-3 py-1 rounded-full text-xs font-bold border border-violet-500/30 mx-auto mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>20% Student Discount</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Student Verification</CardTitle>
            <CardDescription className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
              Verify your student email to get 20% off all paid plans on Learnify AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {!otpSent ? (
              <div className="space-y-3.5">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    type="email"
                    placeholder="your.name@university.edu or .ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 text-xs sm:text-sm font-semibold rounded-xl border-border/80 bg-muted/20 focus:ring-1 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isStudentEmail(email)) {
                        sendOtpMutation.mutate();
                      }
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground text-center font-medium">
                  Must be a valid student email address (.edu, .ac.in, .edu.in)
                </p>
                <Button
                  className="w-full h-11 rounded-xl font-bold text-sm cursor-pointer shadow-md"
                  onClick={() => sendOtpMutation.mutate()}
                  disabled={!isStudentEmail(email) || sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Verification Code
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="bg-muted/40 border border-border/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-medium">
                    Code sent to <span className="font-bold text-foreground">{email}</span>
                  </p>
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="pl-10 h-12 text-center text-lg font-bold tracking-[0.3em] rounded-xl border-border/80 bg-muted/20"
                    maxLength={6}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6) {
                        verifyMutation.mutate();
                      }
                    }}
                  />
                </div>
                <Button
                  className="w-full h-11 rounded-xl font-bold text-sm cursor-pointer shadow-md"
                  onClick={() => verifyMutation.mutate()}
                  disabled={otp.length !== 6 || verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  Verify Student Status
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-xs font-semibold rounded-xl"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  Use a different email
                </Button>
              </div>
            )}

            <div className="pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground text-center leading-relaxed font-medium">
                Don't have a .edu email?{" "}
                <Link to="/signup" className="text-primary hover:underline font-bold">
                  Sign up normally
                </Link>{" "}
                or contact support for alternative verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
