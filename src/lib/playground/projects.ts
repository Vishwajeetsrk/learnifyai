import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200).default("Untitled Project"),
  description: z.string().max(2000).optional(),
  language: z.string().default("javascript"),
  template: z.enum(["blank", "html-css-js", "react", "node"]).default("blank"),
  github: z.string().url().optional(),
  image_url: z.string().url().optional(),
});

const UpdateProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  language: z.string().optional(),
  is_public: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  screenshot_url: z.string().nullable().optional(),
  github: z.string().url().optional(),
  image_url: z.string().url().optional(),
});

const TEMPLATE_FILES: Record<
  string,
  { name: string; path: string; content: string; language: string }[]
> = {
  blank: [{ name: "main.txt", path: "/", content: "", language: "text" }],
  "html-css-js": [
    {
      name: "index.html",
      path: "/",
      content:
        '<!doctype html>\n<html>\n<head><meta charset="utf-8" /><title>My Page</title><link rel="stylesheet" href="style.css" /></head>\n<body>\n  <h1>Hello, World!</h1>\n  <script src="script.js"></script>\n</body>\n</html>',
      language: "html",
    },
    {
      name: "style.css",
      path: "/",
      content: "body { font-family: system-ui; padding: 2rem; }\nh1 { color: #4f46e5; }",
      language: "css",
    },
    {
      name: "script.js",
      path: "/",
      content: "console.log('Hello from Learnify Playground!');",
      language: "javascript",
    },
  ],
  react: [
    {
      name: "App.jsx",
      path: "/",
      content:
        "import React from 'react';\n\nexport default function App() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div>\n      <h1>React Playground</h1>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n      <button onClick={() => setCount(c => c - 1)}>-</button>\n    </div>\n  );\n}",
      language: "javascript",
    },
    {
      name: "index.jsx",
      path: "/",
      content:
        "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\n\nconst root = createRoot(document.getElementById('root'));\nroot.render(<App />);",
      language: "javascript",
    },
  ],
  node: [
    {
      name: "index.js",
      path: "/",
      content:
        "const greeting = 'Hello, Node.js!';\nconsole.log(greeting);\n\n// Export for testing\nmodule.exports = { greeting };",
      language: "javascript",
    },
  ],
};

export const createProject = createServerFn({ method: "POST" })
  .validator((data: unknown) => CreateProjectSchema.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { title, description, language, template, github, image_url } = data;

    const { data: project, error } = await supabase
      .from("playground_projects")
      .insert({ user_id: userId, title, description, language, template, github, image_url })
      .select()
      .single();
    if (error) throw new Error(error.message);

    const files = TEMPLATE_FILES[template] ?? TEMPLATE_FILES.blank;
    const fileRows = files.map((f) => ({
      project_id: project.id,
      name: f.name,
      path: f.path,
      content: f.content,
      language: f.language,
    }));
    const { error: fileError } = await supabase.from("playground_files").insert(fileRows);
    if (fileError) throw new Error(fileError.message);

    return project;
  });

export const getProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data, error } = await supabase
      .from("playground_projects")
      .select("id, title, description, language, template, is_public, tags, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getProject = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: project, error } = await supabase
      .from("playground_projects")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!project) throw new Error("Project not found");
    if (project.user_id !== userId && !project.is_public) throw new Error("Not authorized");
    return project;
  });

export const updateProject = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateProjectSchema.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { id, ...updates } = data;
    const { data: existing } = await supabase
      .from("playground_projects")
      .select("user_id")
      .eq("id", id)
      .single();
    if (!existing || existing.user_id !== userId) throw new Error("Not authorized");
    (updates as any).updated_at = new Date().toISOString();
    const { data: project, error } = await supabase
      .from("playground_projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return project;
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: existing } = await supabase
      .from("playground_projects")
      .select("user_id")
      .eq("id", data.id)
      .single();
    if (!existing || existing.user_id !== userId) throw new Error("Not authorized");
    const { error } = await supabase.from("playground_projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const duplicateProject = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: project } = await supabase
      .from("playground_projects")
      .select("*")
      .eq("id", data.id)
      .single();
    if (!project) throw new Error("Project not found");
    const { data: files } = await supabase
      .from("playground_files")
      .select("*")
      .eq("project_id", data.id);
    const { data: newProject, error } = await supabase
      .from("playground_projects")
      .insert({
        user_id: userId,
        title: `${project.title} (copy)`,
        language: project.language,
        template: project.template,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    if (files?.length) {
      const fileRows = files.map((f: any) => ({
        project_id: newProject.id,
        name: f.name,
        path: f.path,
        content: f.content,
        language: f.language,
      }));
      await supabase.from("playground_files").insert(fileRows);
    }
    return newProject;
  });

export const getProjectFiles = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ projectId: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: project } = await supabase
      .from("playground_projects")
      .select("user_id, is_public")
      .eq("id", data.projectId)
      .single();
    if (!project) throw new Error("Project not found");
    if (project.user_id !== userId && !project.is_public) throw new Error("Not authorized");
    const { data: files, error } = await supabase
      .from("playground_files")
      .select("*")
      .eq("project_id", data.projectId)
      .order("name");
    if (error) throw new Error(error.message);
    return files ?? [];
  });

export const saveFile = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        fileId: z.string().uuid().optional(),
        projectId: z.string().uuid(),
        name: z.string().min(1).max(200),
        path: z.string().default("/"),
        content: z.string().default(""),
        language: z.string().optional(),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: project } = await supabase
      .from("playground_projects")
      .select("user_id")
      .eq("id", data.projectId)
      .single();
    if (!project || project.user_id !== userId) throw new Error("Not authorized");
    if (data.fileId) {
      const { error } = await supabase
        .from("playground_files")
        .update({
          name: data.name,
          content: data.content,
          language: data.language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.fileId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("playground_files").insert({
        project_id: data.projectId,
        name: data.name,
        path: data.path,
        content: data.content,
        language: data.language,
      });
      if (error) throw new Error(error.message);
    }
    await supabase
      .from("playground_projects")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.projectId);
    return { success: true };
  });

export const deleteFile = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ fileId: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: file } = await supabase
      .from("playground_files")
      .select("project_id")
      .eq("id", data.fileId)
      .single();
    if (!file) throw new Error("File not found");
    const { data: project } = await supabase
      .from("playground_projects")
      .select("user_id")
      .eq("id", file.project_id)
      .single();
    if (!project || project.user_id !== userId) throw new Error("Not authorized");
    const { error } = await supabase.from("playground_files").delete().eq("id", data.fileId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const saveEditorCode = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        projectId: z.string().uuid().optional(),
        title: z.string().min(1).max(200).default("Untitled Project"),
        code: z.string().default(""),
        language: z.string().default("javascript"),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { projectId, title, code, language } = data;

    if (projectId) {
      const { data: existing } = await supabase
        .from("playground_projects")
        .select("user_id")
        .eq("id", projectId)
        .single();
      if (!existing || existing.user_id !== userId) throw new Error("Not authorized");

      await supabase
        .from("playground_projects")
        .update({
          title,
          language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      const { data: files } = await supabase
        .from("playground_files")
        .select("id")
        .eq("project_id", projectId)
        .limit(1);
      if (files?.length) {
        await supabase
          .from("playground_files")
          .update({
            content: code,
            language,
            updated_at: new Date().toISOString(),
          })
          .eq("id", files[0].id);
      } else {
        await supabase.from("playground_files").insert({
          project_id: projectId,
          name: `main.${language}`,
          path: "/",
          content: code,
          language,
        });
      }

      return { projectId, created: false };
    }

    const { data: project } = await supabase
      .from("playground_projects")
      .insert({ user_id: userId, title, language, template: "blank" })
      .select()
      .single();
    if (!project) throw new Error("Failed to create project");

    await supabase.from("playground_files").insert({
      project_id: project.id,
      name: `main.${language}`,
      path: "/",
      content: code,
      language,
    });

    return { projectId: project.id, created: true };
  });

export const bulkSyncFiles = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        projectId: z.string().uuid(),
        files: z.record(z.string(), z.string()), // fullPath -> content
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: project } = await supabase
      .from("playground_projects")
      .select("user_id")
      .eq("id", data.projectId)
      .single();
    if (!project || project.user_id !== userId) throw new Error("Not authorized");

    // 1. Fetch existing files
    const { data: existingFiles } = await supabase
      .from("playground_files")
      .select("id, name, path")
      .eq("project_id", data.projectId);

    const existingMap = new Map();
    for (const f of existingFiles || []) {
      const fullPath = (f.path === "/" ? "" : f.path) + "/" + f.name;
      existingMap.set(fullPath, f.id);
    }

    // 2. Process incoming files
    const toInsert = [];
    const toUpdate = [];
    const incomingPaths = new Set();

    for (const [fullPath, content] of Object.entries(data.files)) {
      incomingPaths.add(fullPath);
      const parts = fullPath.split("/");
      const name = parts.pop() || "untitled";
      const path = parts.join("/") || "/";

      const ext = name.split(".").pop() || "txt";
      let language = "text";
      if (ext === "js" || ext === "jsx") language = "javascript";
      if (ext === "ts" || ext === "tsx") language = "typescript";
      if (ext === "css") language = "css";
      if (ext === "html") language = "html";
      if (ext === "json") language = "json";

      if (existingMap.has(fullPath)) {
        toUpdate.push({
          id: existingMap.get(fullPath),
          content,
          updated_at: new Date().toISOString(),
        });
      } else {
        toInsert.push({
          project_id: data.projectId,
          name,
          path,
          content,
          language,
        });
      }
    }

    // 3. Find files to delete
    const toDelete = [];
    for (const [fullPath, id] of existingMap.entries()) {
      if (!incomingPaths.has(fullPath)) {
        toDelete.push(id);
      }
    }

    // 4. Execute DB operations
    if (toInsert.length > 0) {
      await supabase.from("playground_files").insert(toInsert);
    }
    for (const row of toUpdate) {
      await supabase
        .from("playground_files")
        .update({ content: row.content, updated_at: row.updated_at })
        .eq("id", row.id);
    }
    if (toDelete.length > 0) {
      await supabase.from("playground_files").delete().in("id", toDelete);
    }

    await supabase
      .from("playground_projects")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.projectId);

    return { success: true };
  });
