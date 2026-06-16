-- Certificate System 2.0 Schema
CREATE TABLE IF NOT EXISTS public.certificate_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'Executive Gold', 'Modern Corporate'
    layout TEXT NOT NULL DEFAULT 'landscape',
    bg_image_url TEXT,
    config_json JSONB DEFAULT '{}'::jsonb,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Add Certificate V2 fields to existing certificates table if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'certificates'
    ) THEN
        ALTER TABLE public.certificates 
        ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.certificate_templates(id),
        ADD COLUMN IF NOT EXISTS verification_url TEXT,
        ADD COLUMN IF NOT EXISTS dynamic_data JSONB DEFAULT '{}'::jsonb;
    ELSE
        -- Fallback if the certificates table doesn't exist natively
        CREATE TABLE public.certificates (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
            code TEXT UNIQUE NOT NULL,
            score NUMERIC,
            total NUMERIC,
            issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            template_id UUID REFERENCES public.certificate_templates(id),
            verification_url TEXT,
            dynamic_data JSONB DEFAULT '{}'::jsonb
        );
    END IF;
END $$;

-- RLS for templates
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone" ON public.certificate_templates
    FOR SELECT USING (true);

CREATE POLICY "Super Admins can insert templates" ON public.certificate_templates
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super Admins can update templates" ON public.certificate_templates
    FOR UPDATE USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super Admins can delete templates" ON public.certificate_templates
    FOR DELETE USING (has_role(auth.uid(), 'super_admin'));

-- Also allow creators to manage their own templates
CREATE POLICY "Creators can insert own templates" ON public.certificate_templates
    FOR INSERT WITH CHECK (auth.uid() = created_by AND has_role(auth.uid(), 'creator'));

CREATE POLICY "Creators can update own templates" ON public.certificate_templates
    FOR UPDATE USING (auth.uid() = created_by AND has_role(auth.uid(), 'creator'));

CREATE POLICY "Creators can delete own templates" ON public.certificate_templates
    FOR DELETE USING (auth.uid() = created_by AND has_role(auth.uid(), 'creator'));
