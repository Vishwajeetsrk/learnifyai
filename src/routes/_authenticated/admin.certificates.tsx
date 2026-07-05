import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { CertDesignerAdmin } from "@/components/certificate-designer/CertDesignerAdmin";

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  head: () => ({
    meta: [
      { title: "Learnify Credential OS 3.0 — Admin" },
      {
        name: "description",
        content: "Enterprise Credential Operating System: Templates, Designer, Wallet, Verification, and Analytics.",
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

  return <CertDesignerAdmin />;
}
