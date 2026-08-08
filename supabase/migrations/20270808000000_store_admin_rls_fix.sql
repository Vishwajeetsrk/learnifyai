-- Fix store_items admin RLS: the "Admins can write store items" policy called
-- public.has_role(uuid, text) without the ::app_role cast, producing
-- "operator does not exist: app_role = text" whenever an admin saved a store item.

drop policy if exists "Admins can write store items" on public.store_items;

create policy "Admins can write store items"
  on public.store_items for all
  to authenticated
  using (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    or public.has_role(auth.uid(), 'admin'::app_role)
  )
  with check (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    or public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Ensure authenticated admins actually hold the table privileges to write.
grant insert, update, delete on public.store_items to authenticated;
