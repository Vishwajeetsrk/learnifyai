import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { CourseSystemAdmin } from "@/components/admin/CourseSystemAdmin";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  head: () => ({
    meta: [
      { title: "Course System — Learnify AI Admin" },
      { name: "description", content: "Manage courses, modules, lessons, and track enrollments." },
    ],
  }),
  component: AdminCoursesPage,
});

function AdminCoursesPage() {
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
      <CourseSystemAdmin />
    </AppShell>
  );
}
