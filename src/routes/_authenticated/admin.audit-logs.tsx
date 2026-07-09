import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AuditLogsView } from "@/components/admin/AuditLogsView";

export const Route = createFileRoute("/_authenticated/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Learnify AI" }] }),
  component: () => (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AuditLogsView />
      </div>
    </AppShell>
  ),
});
