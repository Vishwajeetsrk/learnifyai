import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import React from "react";
import { Loader2 } from "lucide-react";

const CertDesignerAdmin = React.lazy(() =>
  import("@/components/certificate-designer/CertDesignerAdmin").then((m) => ({
    default: m.CertDesignerAdmin,
  })),
);

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
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="p-10 text-center text-slate-500 font-medium">Unauthorized</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
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
    </AppShell>
  );
}
