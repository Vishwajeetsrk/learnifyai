import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, LayoutTemplate, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminContentAction, adminContentQuery } from "@/lib/admin-content.functions";
import { generateCourseSyllabus } from "@/lib/course-generator.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DesignProjectsManager() {
  const qc = useQueryClient();
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);

  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const doGenerate = useServerFn(generateCourseSyllabus);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-design-projects"],
    queryFn: async () => {
      // First try to fetch from DB
      const result = await doQuery({
        data: { table: "design_projects", orderBy: "created_at", ascending: false },
      });
      return (result ?? []) as any[];
    },
  });

  const newProject = () => {
    setEditing({
      id: "",
      slug: "",
      title: "",
      description: "",
      path: "",
      color: "#2563EB",
      teaser_video_url: "",
      course_modules: [],
      architecture_nodes: [],
    });
    setOpen(true);
  };

  const save = async (form: any) => {
    try {
      if (form.id) {
        await doAdminAction({
          data: { table: "design_projects", action: "update", id: form.id, data: form },
        });
        toast.success("Project updated");
      } else {
        const { id, ...data } = form;
        await doAdminAction({
          data: { table: "design_projects", action: "insert", data },
        });
        toast.success("Project created");
      }
      qc.invalidateQueries({ queryKey: ["admin-design-projects"] });
      qc.invalidateQueries({ queryKey: ["design-projects"] });
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save project");
    }
  };

  const handleGenerateAI = async () => {
    if (!editing.title) return toast.error("Please provide a title first.");
    setIsGenerating(true);
    try {
      const result = await doGenerate({
        data: { title: editing.title, description: editing.description || "" },
      });
      setEditing({
        ...editing,
        course_modules: result.course_modules || editing.course_modules,
        architecture_nodes: result.architecture_nodes || editing.architecture_nodes,
      });
      toast.success("AI generated course syllabus successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate AI content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Design Projects (Template Mastery)</h2>
          <p className="text-sm text-muted-foreground">
            Manage templates for the interactive studio.
          </p>
        </div>
        <Button onClick={newProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No projects found. Please run the database migration.
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <LayoutTemplate
                    className="h-5 w-5 text-primary"
                    style={{ color: p.color || "var(--primary)" }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  title="Preview Project Course Page"
                >
                  <a href={`/course/${p.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Preview
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(p.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && editing && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between pb-2">
              <DialogTitle>{editing.id ? "Edit Project" : "New Project"}</DialogTitle>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateAI}
                disabled={isGenerating || !editing.title}
                className="bg-primary/10 text-primary hover:bg-primary/20 mr-4"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-1.5" />
                )}
                AI Generate
              </Button>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="e.g. Acreage Nike"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="e.g. acreage-nike"
                    disabled={!!editing.id}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Project description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Iframe Path URL</Label>
                  <Input
                    value={editing.path || ""}
                    onChange={(e) => setEditing({ ...editing, path: e.target.value })}
                    placeholder="e.g. /templates/acreage/index.html"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Theme Color (Hex)</Label>
                  <Input
                    value={editing.color || ""}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    placeholder="#2563EB"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Teaser Video URL</Label>
                <Input
                  value={editing.teaser_video_url || ""}
                  onChange={(e) => setEditing({ ...editing, teaser_video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <Label>Course Modules (JSON)</Label>
                <Textarea
                  value={
                    typeof editing.course_modules === "string"
                      ? editing.course_modules
                      : JSON.stringify(editing.course_modules, null, 2)
                  }
                  onChange={(e) => {
                    try {
                      setEditing({ ...editing, course_modules: JSON.parse(e.target.value) });
                    } catch {
                      setEditing({ ...editing, course_modules: e.target.value });
                    }
                  }}
                  className="font-mono text-xs h-32"
                />
              </div>
              <div className="space-y-2">
                <Label>Architecture Nodes (JSON)</Label>
                <Textarea
                  value={
                    typeof editing.architecture_nodes === "string"
                      ? editing.architecture_nodes
                      : JSON.stringify(editing.architecture_nodes, null, 2)
                  }
                  onChange={(e) => {
                    try {
                      setEditing({ ...editing, architecture_nodes: JSON.parse(e.target.value) });
                    } catch {
                      setEditing({ ...editing, architecture_nodes: e.target.value });
                    }
                  }}
                  className="font-mono text-xs h-32"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => save(editing)}>Save Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await doAdminAction({
                    data: { table: "design_projects", action: "delete", id: deleteId },
                  });
                  toast.success("Project deleted");
                  qc.invalidateQueries({ queryKey: ["admin-design-projects"] });
                } catch (e: any) {
                  toast.error(e?.message || "Delete failed");
                } finally {
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
