import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { issueAndEmailCertificate } from "@/lib/cert-email.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  User,
  BookOpen,
  Calendar,
  Hash,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";

type CertificateIssuerProps = {
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  userEmail: string;
  score?: number;
  onIssued?: (certId: string) => void;
};

export function CertificateIssuer({
  courseId,
  courseName,
  userId,
  userName,
  userEmail,
  score = 85,
  onIssued,
}: CertificateIssuerProps) {
  const qc = useQueryClient();
  const [showEditName, setShowEditName] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedCert, setIssuedCert] = useState<any>(null);

  const doIssue = useServerFn(issueAndEmailCertificate);

  // Check if certificate already exists
  const { data: existingCert, isLoading: checkingCert } = useQuery({
    queryKey: ["user-cert", userId, courseId],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from("issued_certificates" as any)
          .select("*")
          .eq("user_id", userId)
          .eq("course_id", courseId)
          .maybeSingle();
        return data;
      } catch {
        return null;
      }
    },
  });

  // Update display name
  const updateName = useMutation({
    mutationFn: async (newName: string) => {
      try {
        await supabase
          .from("profiles" as any)
          .update({ full_name: newName } as any)
          .eq("id", userId);
      } catch {
        // Profile table may not have full_name, just update local state
      }
    },
    onSuccess: () => {
      toast.success("Name updated");
      setShowEditName(false);
    },
  });

  // Issue certificate
  const handleIssue = async () => {
    setIsIssuing(true);
    try {
      const result = await doIssue({
        data: {
          userEmail,
          userName: displayName,
          courseName,
          scorePercentage: score,
          autoEmail: true,
        },
      });
      setIssuedCert(result);
      toast.success("Certificate issued and emailed!");
      onIssued?.((result as any)?.certId || "");
    } catch (e: any) {
      toast.error("Failed to issue: " + e.message);
    } finally {
      setIsIssuing(false);
    }
  };

  const certCode = issuedCert?.certCode || (existingCert as any)?.code || "";
  const verifyUrl = certCode ? `${window.location.origin}/verify/${certCode}` : "";
  const isIssued = !!(existingCert || issuedCert);

  return (
    <div className="space-y-4">
      {/* Certificate Status Card */}
      <Card
        className={
          isIssued ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
        }
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  isIssued ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}
              >
                {isIssued ? <CheckCircle2 className="h-5 w-5" /> : <Award className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle className="text-sm font-bold">
                  {isIssued ? "Certificate Issued" : "Certificate Ready"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isIssued
                    ? "Your certificate has been issued and emailed"
                    : "Complete the course to receive your certificate"}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isIssued ? "default" : "secondary"} className="text-[10px]">
              {isIssued ? "Active" : "Pending"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[10px] text-slate-500">{userEmail}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setShowEditName(true)}
            >
              Edit Name
            </Button>
          </div>

          {/* Course Info */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-900">{courseName}</p>
              <p className="text-[10px] text-slate-500">Score: {score}%</p>
            </div>
          </div>

          {/* Certificate Details (if issued) */}
          {isIssued && certCode && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <Hash className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">Certificate Code</p>
                  <p className="text-xs font-mono font-bold text-slate-900">{certCode}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    navigator.clipboard.writeText(certCode);
                    toast.success("Copied!");
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-500">Issued</p>
                  <p className="text-xs font-bold text-slate-900">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isIssued ? (
              <Button
                onClick={handleIssue}
                disabled={isIssuing || checkingCert}
                className="flex-1 bg-[#6B5BFB] hover:bg-[#5a4be0] text-white text-xs h-9"
              >
                {isIssuing ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1 animate-spin" /> Issuing...
                  </>
                ) : (
                  <>
                    <Award className="h-3.5 w-3.5 mr-1" /> Issue Certificate
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => window.open(verifyUrl, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> Verify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => {
                    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseName)}&organizationName=Learnify+AI&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(certCode)}`;
                    window.open(linkedInUrl, "_blank");
                  }}
                >
                  <Share2 className="h-3 w-3 mr-1" /> LinkedIn
                </Button>
              </>
            )}
          </div>

          {/* Help */}
          <p className="text-[10px] text-slate-400 text-center">
            Need help?{" "}
            <a href="mailto:support@learnify.ai" className="text-[#6B5BFB] hover:underline">
              Contact Learnify Support
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Edit Name Dialog */}
      <Dialog open={showEditName} onOpenChange={setShowEditName}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Display Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              This name will appear on your certificate. You can edit it before the certificate is
              issued.
            </p>
            <div>
              <Label className="text-xs">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditName(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              onClick={() => updateName.mutate(displayName)}
              disabled={!displayName.trim()}
              className="text-xs bg-[#6B5BFB] hover:bg-[#5a4be0] text-white"
            >
              Save Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
