
ALTER TABLE public.enrichment_runs
  ADD COLUMN IF NOT EXISTS cancel_requested boolean NOT NULL DEFAULT false;

ALTER TABLE public.enrichment_progress
  ADD COLUMN IF NOT EXISTS from_cache boolean NOT NULL DEFAULT false;

-- Allow course creator + admins to request cancel by updating their own runs
DROP POLICY IF EXISTS "Creator or admin cancel run" ON public.enrichment_runs;
CREATE POLICY "Creator or admin cancel run"
ON public.enrichment_runs
FOR UPDATE
TO authenticated
USING (
  (started_by = auth.uid())
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = enrichment_runs.course_id AND c.created_by = auth.uid())
)
WITH CHECK (
  (started_by = auth.uid())
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = enrichment_runs.course_id AND c.created_by = auth.uid())
);
