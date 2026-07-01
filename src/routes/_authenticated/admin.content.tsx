import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const AdminContentPage = lazy(() => import("@/views/admin.content.view"));

function AdminContentFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({ meta: [{ title: "Content Manager — Learnify AI" }] }),
  component: () => (
    <Suspense fallback={<AdminContentFallback />}>
      <AdminContentPage />
    </Suspense>
  ),
});
