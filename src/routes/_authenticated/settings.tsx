import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const SettingsPage = lazy(() => import("@/views/settings.view"));

function SettingsFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
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
