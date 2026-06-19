-- Allow users to delete their own withdrawal records
grant delete on public.creator_withdrawals to authenticated;

create policy "Users can delete own withdrawals"
  on public.creator_withdrawals for delete
  to authenticated
  using (auth.uid() = user_id);
