
CREATE POLICY "Users read own submission files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own submission files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own submission files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own submission files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins read all submission files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND has_role(auth.uid(), 'super_admin'::app_role));
