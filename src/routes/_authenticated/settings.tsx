import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { SettingsSkeleton } from "@/components/Skeletons";

const SettingsPage = lazy(() => import("@/views/settings.view"));

function SettingsFallback() {
  return (
    <AppShell>
      <SettingsSkeleton />
    </AppShell>
  );
}

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Learnify AI" }] }),
  component: () => (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsPage />
    </Suspense>
  ),
});
