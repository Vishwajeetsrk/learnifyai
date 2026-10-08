import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import React, { Component, useState, useEffect, type ReactNode } from "react";
import { Loader2, AlertCircle, RefreshCw, Home, ShieldAlert } from "lucide-react";

const CertDesignerAdmin = React.lazy(() =>
  import("@/components/certificate-designer/CertDesignerAdmin").then((m) => ({
    default: m.CertDesignerAdmin,
  })),
);

interface StudioErrorBoundaryProps {
  children: ReactNode;
}

interface StudioErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class StudioErrorBoundary extends Component<StudioErrorBoundaryProps, StudioErrorBoundaryState> {
  constructor(props: StudioErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): StudioErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CertDesignerAdmin crash caught by StudioErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Certificate Studio Encountered an Issue
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {this.state.error?.message || "An unexpected error occurred while loading the studio."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition"
            >
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  head: () => ({
    meta: [
      { title: "Learnify Credential OS 3.0 — Admin" },
      {
        name: "description",
        content:
          "Enterprise Credential Operating System: Templates, Designer, Wallet, Verification, and Analytics.",
      },
    ],
  }),
  component: AdminCertificatesPage,
});

function AdminCertificatesPage() {
  const { isAdmin, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <AppShell>
        <div className="p-16 text-center text-sm font-bold text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span>Loading Certificate OS Studio...</span>
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-16 p-8 bg-card border border-border rounded-2xl text-center shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Admin Access Required</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            You must be signed in with an administrator account to access the Certificate Operating System.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <StudioErrorBoundary>
        <React.Suspense
          fallback={
            <div className="p-16 text-center text-sm font-bold text-muted-foreground flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span>Loading Certificate OS Studio...</span>
            </div>
          }
        >
          <CertDesignerAdmin />
        </React.Suspense>
      </StudioErrorBoundary>
    </AppShell>
  );
}
