import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SystemHealthView } from "@/components/admin/SystemHealthView";

export const Route = createFileRoute("/_authenticated/admin/system-health")({
  head: () => ({ meta: [{ title: "System Health — Learnify AI" }] }),
  component: () => (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SystemHealthView />
      </div>
    </AppShell>
  ),
});
