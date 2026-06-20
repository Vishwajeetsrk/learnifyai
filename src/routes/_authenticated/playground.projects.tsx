import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createProject, deleteProject, duplicateProject } from "@/lib/playground/projects";
import { Plus, FileCode, Trash2, Copy, ExternalLink, Clock, Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/playground/projects")({
  head: () => ({ meta: [{ title: "Projects — Learnify AI" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const createFn = useServerFn(createProject);
  const deleteFn = useServerFn(deleteProject);
  const duplicateFn = useServerFn(duplicateProject);

  const { data: projects, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["playground-projects"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("playground_projects")
        .select("id, title, description, language, template, is_public, tags, created_at, updated_at")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleCreate = async () => {
    try {
      const project = await createFn({ data: { title: "Untitled Project", language: "javascript", template: "blank" } });
      navigate({ to: "/playground/editor", search: { project: project.id } as any });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteFn({ data: { id } });
      qc.invalidateQueries({ queryKey: ["playground-projects"] });
      toast.success("Project deleted");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateFn({ data: { id } });
      qc.invalidateQueries({ queryKey: ["playground-projects"] });
      toast.success("Project duplicated");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const LANG_ICONS: Record<string, string> = {
    python: "https://cdn.simpleicons.org/python/3776AB",
    javascript: "https://cdn.simpleicons.org/javascript/F7DF1E",
    typescript: "https://cdn.simpleicons.org/typescript/3178C6",
    html: "https://cdn.simpleicons.org/html5/E34F26",
    react: "https://cdn.simpleicons.org/react/61DAFB",
    node: "https://cdn.simpleicons.org/nodedotjs/339933",
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold">My Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your saved playground projects.</p>
          </div>
          <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-1" /> New Project</Button>
        </div>

        {isLoading ? (
          <div className="py-20 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : !projects?.length ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-medium">No projects yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first project to get started.</p>
            <Button onClick={handleCreate} className="mt-4"><Plus className="h-4 w-4 mr-1" /> Create Project</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p: any) => (
              <div key={p.id} className="rounded-xl border bg-card p-4 hover:shadow-md transition group">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {LANG_ICONS[p.language] && <img src={LANG_ICONS[p.language]} alt="" className="w-4 h-4 shrink-0" />}
                      <Link to="/playground/editor" search={{ project: p.id } as any} className="font-semibold text-sm truncate hover:text-primary transition">{p.title}</Link>
                    </div>
                    {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}</span>
                  <span className="capitalize">{p.template?.replace("-", " ")}</span>
                  {p.is_public && <span className="text-primary">Public</span>}
                </div>
                <div className="flex gap-1.5 mt-3 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <Button asChild size="sm" variant="default" className="h-7 text-xs">
                    <Link to="/playground/editor" search={{ project: p.id } as any}><ExternalLink className="h-3 w-3 mr-1" /> Open</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleDuplicate(p.id)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                    {deleting === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
