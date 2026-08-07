-- Allow image materials and fix mislabeled seed rows
alter table public.course_materials
  drop constraint if exists course_materials_material_type_check;

alter table public.course_materials
  add constraint course_materials_material_type_check
  check (material_type in ('pdf', 'transcript', 'note', 'image', 'video', 'link'));

update public.course_materials
set material_type = 'image'
where id in (
  '00000000-0000-4000-8000-000000000141',
  '00000000-0000-4000-8000-000000000142'
);
