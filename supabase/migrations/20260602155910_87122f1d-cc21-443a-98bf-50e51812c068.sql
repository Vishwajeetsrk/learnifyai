CREATE OR REPLACE FUNCTION public.cleanup_expired_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_hours int;
  v_events_on text;
  v_jobs_on text;
  v_hours_text text;
BEGIN
  SELECT value INTO v_hours_text FROM public.site_settings WHERE key = 'events_auto_delete_hours';
  BEGIN
    v_hours := coalesce(nullif(v_hours_text, ''), '24')::int;
  EXCEPTION WHEN others THEN
    v_hours := 24;
  END;
  IF v_hours < 0 THEN v_hours := 24; END IF;

  SELECT value INTO v_events_on FROM public.site_settings WHERE key = 'events_auto_delete_enabled';
  SELECT value INTO v_jobs_on   FROM public.site_settings WHERE key = 'jobs_auto_close_enabled';

  IF coalesce(v_events_on, 'true') <> 'false' THEN
    DELETE FROM public.events WHERE starts_at < now() - make_interval(hours => v_hours);
  END IF;

  IF coalesce(v_jobs_on, 'true') <> 'false' THEN
    UPDATE public.job_postings SET active = false
      WHERE active = true AND closes_at IS NOT NULL AND closes_at < now();
  END IF;
END;
$$;