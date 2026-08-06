-- Allow admins / super admins to add, edit, and delete store items from the admin page.
-- The admin page uses the authenticated client, so RLS must permit admin writes.

ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can write store items"
  ON public.store_items FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Avatar items no longer animate (cursor-tracking eyes / hover smile were removed).
-- Refresh their descriptions so they no longer promise interactive animation.
UPDATE public.store_items
SET description = CASE
  WHEN name = 'Avatar M1' THEN 'Stylish male profile avatar for your Learnify profile.'
  WHEN name = 'Avatar M2' THEN 'Cool male profile avatar for your Learnify profile.'
  WHEN name = 'Avatar M3' THEN 'Bold male profile avatar for your Learnify profile.'
  WHEN name = 'Avatar F1' THEN 'Elegant female profile avatar for your Learnify profile.'
  WHEN name = 'Avatar F2' THEN 'Chic female profile avatar for your Learnify profile.'
  WHEN name = 'Avatar F3' THEN 'Graceful female profile avatar for your Learnify profile.'
  ELSE description
END
WHERE tags @> ARRAY['avatar'];
