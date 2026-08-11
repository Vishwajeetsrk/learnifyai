-- Fix: 8 lessons from the HTML/CSS + JS curriculum expansions were inserted with
-- typo'd module_id values (…000031/…000032/…000033/…000034 instead of the real
-- …003031/…003032/…003033/…003034), so they never appeared in the module-based
-- course editor tree and module grouping. Repoint them to the real modules.
-- Global order_index stays untouched (the flat lesson order was already correct).

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003031'
  where id = '00000000-0000-4000-8000-000000004210'; -- Lists, Links & Images (HTML M1)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003031'
  where id = '00000000-0000-4000-8000-000000004211'; -- Forms, Buttons & Feedback (HTML M1)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003032'
  where id = '00000000-0000-4000-8000-000000004212'; -- The Box Model in Action (HTML M2)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003032'
  where id = '00000000-0000-4000-8000-000000004213'; -- Responsive Design for Every Screen (HTML M2)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003033'
  where id = '00000000-0000-4000-8000-000000004221'; -- Conditions & Truthiness (JS M1)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003033'
  where id = '00000000-0000-4000-8000-000000004222'; -- Loops & Arrays (JS M1)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003034'
  where id = '00000000-0000-4000-8000-000000004223'; -- Events & Click Handlers (JS M2)

update public.lessons
  set module_id = '00000000-0000-4000-8000-000000003034'
  where id = '00000000-0000-4000-8000-000000004224'; -- Templates & innerHTML (JS M2)
