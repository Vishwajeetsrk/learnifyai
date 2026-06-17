CREATE TABLE IF NOT EXISTS public.group_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_group_messages_cohort ON public.group_messages(cohort_id, created_at DESC);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read group messages"
    ON public.group_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.cohort_members
            WHERE cohort_members.cohort_id = group_messages.cohort_id
            AND cohort_members.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Members can insert group messages"
    ON public.group_messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.cohort_members
            WHERE cohort_members.cohort_id = group_messages.cohort_id
            AND cohort_members.user_id = auth.uid()
        )
    );

-- Enable realtime for group_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
