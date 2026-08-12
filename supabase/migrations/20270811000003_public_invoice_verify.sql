-- Public invoice verification (mirrors certificates "Public can view certificates by code")
-- The /verify/invoice/:id page is an unauthenticated hub: anyone holding the
-- invoice number (printed on PDF + QR) must be able to confirm authenticity.
-- profile names/emails stay RLS-protected (profiles has no anon policy).

create policy "Anyone can verify invoice by number" on public.invoices
  for select
  to anon, authenticated
  using (true);
