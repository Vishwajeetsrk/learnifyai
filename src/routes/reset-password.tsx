import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { validatePasswordStrength } from "@/lib/password-validator";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — Learnify AI" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if session exists immediately (e.g. from recovery link hash)
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSessionReady(true);
      } else {
        // If recovery hash is still parsing, give it a tiny grace period
        setTimeout(async () => {
          const { data: againData } = await supabase.auth.getSession();
          setSessionReady(!!againData.session);
        }, 800);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.isValid) {
      toast.error(pwdCheck.error || "Weak password.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-card">
        <h1 className="text-2xl font-display font-semibold mb-1">Set a new password</h1>
        <p className="text-sm text-muted-foreground mb-6">Pick something strong you'll remember.</p>

        {sessionReady === null && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying reset link…
          </div>
        )}

        {sessionReady === false && (
          <div className="space-y-4">
            <div className="text-sm text-destructive">
              Your reset link is invalid or has expired. Reset links can only be used once and
              expire after a short time.
            </div>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request a new link</Link>
            </Button>
          </div>
        )}

        {sessionReady === true && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
