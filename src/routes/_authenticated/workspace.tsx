import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  Calendar,
  FolderKanban,
  MoreVertical,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/AppShell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getMyWorkspace,
  listProjects,
  createProject,
  getProjectTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "@/lib/workspace.functions";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { getProfileBorderClass } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/workspace")({
  component: WorkspacePage,
});

const COLUMNS = [
  { id: "todo", title: "To Do", icon: Circle, color: "text-slate-500" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-amber-500" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

function WorkspacePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const getWs = useServerFn(getMyWorkspace);
  const getProjs = useServerFn(listProjects);
  const getTasks = useServerFn(getProjectTasks);
  const mkProj = useServerFn(createProject);
  const mkTask = useServerFn(createTask);
  const upTask = useServerFn(updateTaskStatus);
  const delTask = useServerFn(deleteTask);

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newProjOpen, setNewProjOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [projName, setProjName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const wsQ = useQuery({ queryKey: ["workspace"], queryFn: () => getWs() });
  const workspaceId = wsQ.data?.id;

  const projsQ = useQuery({
    enabled: !!workspaceId,
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjs({ data: { workspaceId: workspaceId! } }),
  });

  const tasksQ = useQuery({
    enabled: !!activeProjectId,
    queryKey: ["tasks", activeProjectId],
    queryFn: () => getTasks({ data: { projectId: activeProjectId! } }),
  });

  const handleCreateProject = async () => {
    if (!projName.trim() || !workspaceId) return;
    try {
      await mkProj({ data: { workspaceId, name: projName } });
      setProjName("");
      setNewProjOpen(false);
      qc.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project created");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !activeProjectId) return;
    try {
      await mkTask({ data: { projectId: activeProjectId, title: taskTitle, status: taskStatus } });
      setTaskTitle("");
      setNewTaskOpen(false);
      qc.invalidateQueries({ queryKey: ["tasks", activeProjectId] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId || !activeProjectId) return;
    const task = tasksQ.data?.find((t: any) => t.id === draggedTaskId);
    if (task && task.status !== status) {
      // Optimistic update
      qc.setQueryData(["tasks", activeProjectId], (old: any[]) =>
        old?.map((t) => (t.id === draggedTaskId ? { ...t, status } : t)),
      );
      try {
        await upTask({ data: { taskId: draggedTaskId, status } });
      } catch {
        qc.invalidateQueries({ queryKey: ["tasks", activeProjectId] });
        toast.error("Failed to update status");
      }
    }
    setDraggedTaskId(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!activeProjectId) return;
    try {
      await delTask({ data: { taskId } });
      qc.invalidateQueries({ queryKey: ["tasks", activeProjectId] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const projects = projsQ.data || [];
  const tasks = tasksQ.data || [];

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-slate-50/50 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <div className="h-8 w-8 rounded bg-primary/10 text-primary grid place-items-center font-bold text-sm">
              {wsQ.data?.name?.[0] || "W"}
            </div>
            <div className="font-semibold text-sm truncate">{wsQ.data?.name || "Workspace"}</div>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
            Projects
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {projects.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  activeProjectId === p.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <FolderKanban className="h-4 w-4" />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
            <button
              onClick={() => setNewProjOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-slate-100 text-slate-500 border border-dashed mt-2"
            >
              <Plus className="h-4 w-4" /> New Project
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
          {activeProjectId ? (
            <>
              <div className="h-14 border-b bg-white flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                  <h1 className="font-semibold">
                    {projects.find((p: any) => p.id === activeProjectId)?.name}
                  </h1>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 bg-slate-100">
                      <LayoutGrid className="h-4 w-4 mr-2" /> Board
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" /> Calendar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="h-8 w-64 pl-9 text-sm bg-slate-50"
                      placeholder="Search tasks..."
                    />
                  </div>
                  <Button size="sm" onClick={() => setNewTaskOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
              </div>

              {/* Kanban Board */}
              <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
                {COLUMNS.map((col) => (
                  <div
                    key={col.id}
                    className="w-[320px] shrink-0 flex flex-col max-h-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2 font-medium text-sm">
                        <col.icon className={`h-4 w-4 ${col.color}`} />
                        {col.title}
                        <span className="ml-2 text-xs text-muted-foreground bg-slate-200 px-2 py-0.5 rounded-full">
                          {tasks.filter((t: any) => t.status === col.id).length}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus
                          className="h-4 w-4 text-muted-foreground"
                          onClick={() => {
                            setTaskStatus(col.id);
                            setNewTaskOpen(true);
                          }}
                        />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-1 space-y-3 min-h-[150px]">
                      <AnimatePresence>
                        {tasks
                          .filter((t: any) => t.status === col.id)
                          .map((task: any) => (
                            <motion.div
                              key={task.id}
                              layout
                              layoutId={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              draggable
                              onDragStart={() => setDraggedTaskId(task.id)}
                              onDragEnd={() => setDraggedTaskId(null)}
                              className="bg-white p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-sm leading-snug">{task.title}</h3>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex -space-x-1">
                                  {task.assignee?.avatar_url ? (
                                    <img
                                      src={task.assignee.avatar_url}
                                      className={cn(
                                        "h-6 w-6 rounded-full object-cover",
                                        getProfileBorderClass(task.assignee.avatar_url) ||
                                          "ring-2 ring-white",
                                      )}
                                      alt="Assignee"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-slate-200 ring-2 ring-white" />
                                  )}
                                </div>
                                {task.status !== "done" && (
                                  <div className="text-[10px] text-muted-foreground font-medium bg-slate-100 px-2 py-1 rounded">
                                    {new Date(task.created_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>
                      {tasks.filter((t: any) => t.status === col.id).length === 0 && (
                        <div className="h-full w-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-sm text-slate-400 py-6">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-muted-foreground">
              <FolderKanban className="h-16 w-16 mb-4 opacity-20" />
              <h2 className="text-lg font-semibold text-slate-700">No Project Selected</h2>
              <p className="max-w-sm mt-2">
                Select a project from the sidebar or create a new one to start organizing your work.
              </p>
              <Button className="mt-6" onClick={() => setNewProjOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Project
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={newProjOpen} onOpenChange={setNewProjOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              placeholder="Project Name e.g. 'Course Launch'"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Input
              autoFocus
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
