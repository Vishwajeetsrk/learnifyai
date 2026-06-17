-- Phase 3: Business OS & Workspace Schema

-- 1. Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, user_id)
);

-- 2. Projects & Tasks (Kanban)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo', -- todo, in_progress, done
    assigned_to UUID REFERENCES auth.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    position NUMERIC DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CRM Leads & Deals
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, qualified, lost
    value_inr NUMERIC DEFAULT 0,
    source TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.crm_deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    pipeline_stage TEXT DEFAULT 'proposal', -- proposal, negotiation, closed_won, closed_lost
    amount_inr NUMERIC DEFAULT 0,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;

-- Workspace Policies
CREATE POLICY "Users can view workspaces they belong to" ON public.workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_members.workspace_id = workspaces.id 
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert workspaces" ON public.workspaces
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Workspace members can be viewed by members" ON public.workspace_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm 
            WHERE wm.workspace_id = workspace_members.workspace_id 
            AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join workspaces" ON public.workspace_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects Policies
CREATE POLICY "Workspace members can view projects" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_members.workspace_id = projects.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace members can insert projects" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_members.workspace_id = projects.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace members can update projects" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_members.workspace_id = projects.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Tasks Policies
CREATE POLICY "Workspace members can view tasks" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = tasks.project_id AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace members can insert tasks" ON public.tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = tasks.project_id AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace members can update tasks" ON public.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = tasks.project_id AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace members can delete tasks" ON public.tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = tasks.project_id AND wm.user_id = auth.uid()
        )
    );

-- CRM Leads Policies
CREATE POLICY "Workspace members can manage leads" ON public.crm_leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_members.workspace_id = crm_leads.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );

-- CRM Deals Policies
CREATE POLICY "Workspace members can manage deals" ON public.crm_deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members 
            WHERE workspace_members.workspace_id = crm_deals.workspace_id 
            AND workspace_members.user_id = auth.uid()
        )
    );
