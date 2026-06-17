import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getMyWorkspace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    // Get the first workspace the user belongs to, or create one if none
    const { data: member } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (member?.workspace_id) {
      const { data: ws } = await supabase.from("workspaces").select("*").eq("id", member.workspace_id).single();
      return ws;
    } else {
      // Auto-create personal workspace
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
      const name = user.user?.user_metadata?.full_name ? `${user.user.user_metadata.full_name}'s Workspace` : "Personal Workspace";
      
      const { data: ws, error } = await supabaseAdmin.from("workspaces").insert({ name, created_by: userId }).select().single();
      if (error) throw new Error(error.message);

      await supabaseAdmin.from("workspace_members").insert({ workspace_id: ws.id, user_id: userId, role: "owner" });
      return ws;
    }
  });

export const listProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ workspaceId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("workspace_id", data.workspaceId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return projects;
  });

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ workspaceId: z.string(), name: z.string(), description: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("projects").insert({
      workspace_id: data.workspaceId,
      name: data.name,
      description: data.description,
      created_by: userId
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getProjectTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ projectId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assigned_to_fkey(full_name, avatar_url)")
      .eq("project_id", data.projectId)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return tasks;
  });

export const createTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ projectId: z.string(), title: z.string(), status: z.string(), description: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("tasks").insert({
      project_id: data.projectId,
      title: data.title,
      status: data.status,
      description: data.description,
      created_by: userId
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateTaskStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ taskId: z.string(), status: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("tasks").update({ status: data.status }).eq("id", data.taskId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ taskId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("tasks").delete().eq("id", data.taskId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
