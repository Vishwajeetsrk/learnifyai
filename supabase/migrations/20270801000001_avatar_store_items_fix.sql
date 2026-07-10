-- Update avatar items to also cost 1 XP (so they work in the current XP store)
UPDATE public.store_items SET cost = 1, prime_price = 1 WHERE tags @> ARRAY['avatar'] AND cost = 0;
