import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AnnouncementBroadcast } from "@/components/admin/AnnouncementBroadcast";

export const Route = createFileRoute("/_authenticated/admin/announcements")({
  head: () => ({ meta: [{ title: "Announcements — Learnify AI" }] }),
  component: () => (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnnouncementBroadcast />
      </div>
    </AppShell>
  ),
});
