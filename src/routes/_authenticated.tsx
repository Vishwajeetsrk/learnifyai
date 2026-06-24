import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

// Cache whether the onboarding_progress table exists so we skip future queries
let _onboardingTableMissing = false;

function AuthenticatedLayout() {
  const { loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login", replace: true });
  }, [loading, isAuthenticated, navigate]);

  // Check onboarding status for new users
  useEffect(() => {
    if (!user || loading) return;
    if (_onboardingTableMissing) {
      setCheckingOnboarding(false);
      return;
    }

    const checkOnboarding = async () => {
      try {
        const { data, error } = await supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from("onboarding_progress" as any)
          .select("onboarding_completed, current_step")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          if (
            error.code === "42P01" ||
            error.message?.includes("does not exist") ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).status === 404
          ) {
            _onboardingTableMissing = true;
          }
          setCheckingOnboarding(false);
          return;
        }

        if (!data) {
          setCheckingOnboarding(false);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(data as any).onboarding_completed && (data as any).current_step !== "complete") {
          const path = window.location.pathname;
          // Skip redirect for admin routes — admins need full access
          if (path !== "/onboarding" && !path.startsWith("/admin")) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navigate({ to: "/onboarding" as any, replace: true });
            return;
          }
        }
      } catch {
        setCheckingOnboarding(false);
      }
      setCheckingOnboarding(false);
    };

    checkOnboarding();
  }, [user, loading, navigate]);

  if (loading || !isAuthenticated || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <Outlet />;
}
