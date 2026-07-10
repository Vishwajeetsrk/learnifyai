import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MonitorPlay, Plus, Pencil, Trash2, Search, ArrowLeft, Save, GripVertical, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/system-design" as any)({
  head: () => ({ meta: [{ title: "System Design — Admin — Learnify AI" }] }),
  component: AdminSystemDesignPage,
});

function AdminSystemDesignPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    topic_id: "", title: "", subtitle: "", description: "", icon: "MonitorPlay",
    difficulty: "intermediate", duration: "30 min", enabled: true, sort_order: 0,
  });

  const topicsQuery = useQuery({
    queryKey: ["admin-system-design"],
    queryFn: async () => {
      const { data } = await supabase.from("system_design_topics").select("*").order("sort_order", { ascending: true });
      return data ?? [];
    },
  });

  const topics = topicsQuery.data ?? [];
  const filtered = search ? topics.filter((t: any) => t.title?.toLowerCase().includes(search.toLowerCase()) || t.topic_id?.toLowerCase().includes(search.toLowerCase())) : topics;

  const openNew = () => {
    setEditing(null);
    setForm({ topic_id: "", title: "", subtitle: "", description: "", icon: "MonitorPlay", difficulty: "intermediate", duration: "30 min", enabled: true, sort_order: topics.length });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      topic_id: item.topic_id, title: item.title, subtitle: item.subtitle || "", description: item.description || "",
      icon: item.icon || "MonitorPlay", difficulty: item.difficulty, duration: item.duration, enabled: item.enabled, sort_order: item.sort_order,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.topic_id.trim()) return toast.error("Topic ID is required");
    const payload = {
      topic_id: form.topic_id.trim().toLowerCase().replace(/\s+/g, "-"),
      title: form.title.trim(), subtitle: form.subtitle.trim(), description: form.description.trim(),
      icon: form.icon, difficulty: form.difficulty, duration: form.duration,
      enabled: form.enabled, sort_order: form.sort_order,
    };
    try {
      if (editing) {
        const { error } = await supabase.from("system_design_topics").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Topic updated");
      } else {
        const { error } = await supabase.from("system_design_topics").insert(payload);
        if (error) throw error;
        toast.success("Topic created");
      }
      setDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-system-design"] });
    } catch (e: any) { toast.error(e.message); }
  };

  const deleteTopic = async (id: string) => {
    if (!window.confirm("Delete this topic? This cannot be undone.")) return;
    const { error } = await supabase.from("system_design_topics").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Topic deleted");
    qc.invalidateQueries({ queryKey: ["admin-system-design"] });
  };

  const toggleEnabled = async (id: string, current: boolean) => {
    const { error } = await supabase.from("system_design_topics").update({ enabled: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-system-design"] });
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin" })}><ArrowLeft className="h-4 w-4" /></Button>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MonitorPlay className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">System Design Academy</h1>
              <p className="text-xs text-muted-foreground">{topics.length} topics · Manage curriculum</p>
            </div>
          </div>
          <Button size="sm" onClick={openNew}><Plus className="h-3.5 w-3.5 mr-1" /> Add Topic</Button>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics..." className="pl-8 h-9 text-xs" />
        </div>

        {topicsQuery.isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No topics found</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((topic: any) => (
              <Card key={topic.id} className={cn("border-l-4", !topic.enabled && "opacity-60", topic.difficulty === "advanced" ? "border-l-red-500" : topic.difficulty === "intermediate" ? "border-l-yellow-500" : "border-l-green-500")}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                        <MonitorPlay className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{topic.title}</p>
                          <Badge variant="outline" className="text-[9px] capitalize">{topic.difficulty}</Badge>
                          <Badge variant="secondary" className="text-[9px]">{topic.duration}</Badge>
                          {!topic.enabled && <Badge variant="outline" className="text-[9px] text-muted-foreground">Disabled</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{topic.subtitle || topic.description?.slice(0, 80)}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">ID: {topic.topic_id} · Sections: {topic.sections?.length || 0} · Quiz: {topic.quiz?.length || 0} Q</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleEnabled(topic.id, topic.enabled)}>
                        {topic.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(topic)}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteTopic(topic.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle><MonitorPlay className="h-4 w-4 inline mr-1" /> {editing ? "Edit Topic" : "Add Topic"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Topic ID *</Label>
                  <Input value={form.topic_id} onChange={(e) => setForm((f) => ({ ...f, topic_id: e.target.value }))} placeholder="netflix" className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label>Sort Order</Label>
                  <Input type="number" min={0} value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Netflix" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Subtitle</Label>
                  <Input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="Video Streaming Architecture" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe what this system design topic covers..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Duration</Label>
                  <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="45 min" />
                </div>
                <div className="space-y-1.5">
                  <Label>Icon name</Label>
                  <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="MonitorPlay" />
                </div>
                <div className="space-y-1.5 flex items-end pb-2">
                  <div className="flex items-center gap-2">
                    <Label className="cursor-pointer">Enabled</Label>
                    <Switch checked={form.enabled} onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={save}><Save className="h-3.5 w-3.5 mr-1" /> {editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
