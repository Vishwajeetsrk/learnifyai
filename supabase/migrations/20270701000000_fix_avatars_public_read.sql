-- Make avatars bucket publicly readable so profile photos show for all users
UPDATE storage.buckets SET public = true WHERE id = 'avatars';

-- Allow anonymous and authenticated users to read any avatar
CREATE POLICY "Avatars: public read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'avatars');
