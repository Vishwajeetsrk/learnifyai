import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:%23KingKhan15112003@db.gnvsqwyexjuuwkjibxrr.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

const sql = `
-- Add category and course_id to badges
alter table public.badges
  add column if not exists category text not null default 'xp'
  check (category in ('xp', 'course', 'streak', 'test', 'challenge'));
alter table public.badges
  add column if not exists course_id uuid references public.courses(id) on delete cascade;
create index if not exists idx_badges_category on public.badges(category);
create index if not exists idx_badges_course on public.badges(course_id);

-- Add requirement columns for non-XP badge categories
alter table public.badges
  add column if not exists streak_required integer,
  add column if not exists course_required integer,
  add column if not exists test_required integer,
  add column if not exists challenge_required integer;

-- Make xp_required nullable (non-XP badges don't need it)
alter table public.badges
  alter column xp_required drop not null;

-- Update existing badges to proper category
update public.badges set category = 'xp' where category is null or category = '';

-- Seed badges across all categories (skip duplicates by name)
insert into public.badges (name, description, icon_url, category, xp_required, streak_required, course_required, test_required, challenge_required)
select * from (values
  ('First Steps',    'Reached 50 XP',            'https://img.icons8.com/color/96/medal2.png',       'xp', 50, null, null, null, null),
  ('Dedicated',      'Reached 250 XP',           'https://img.icons8.com/color/96/medal.png',        'xp', 250, null, null, null, null),
  ('Legend',         'Reached 2500 XP',          'https://img.icons8.com/color/96/star.png',         'xp', 2500, null, null, null, null),
  ('Grandmaster',    'Reached 5000 XP',          'https://img.icons8.com/color/96/diamond.png',      'xp', 5000, null, null, null, null),
  ('Omega',          'Reached 10000 XP',         'https://img.icons8.com/color/96/prize.png',        'xp', 10000, null, null, null, null),
  ('On Fire',        '3-day learning streak',    'https://img.icons8.com/color/96/fire-element.png', 'streak', null, 3, null, null, null),
  ('Unstoppable',    '7-day learning streak',    'https://img.icons8.com/color/96/fire.png',         'streak', null, 7, null, null, null),
  ('Dedicated Soul', '30-day learning streak',   'https://img.icons8.com/color/96/sun.png',          'streak', null, 30, null, null, null),
  ('Immortal',       '100-day learning streak',  'https://img.icons8.com/color/96/phoenix.png',      'streak', null, 100, null, null, null),
  ('First Graduate', 'Completed 1 course',       'https://img.icons8.com/color/96/diploma.png',      'course', null, null, 1, null, null),
  ('Knowledge Seeker', 'Completed 5 courses',    'https://img.icons8.com/color/96/books.png',        'course', null, null, 5, null, null),
  ('Scholar Path',   'Completed 10 courses',     'https://img.icons8.com/color/96/library.png',      'course', null, null, 10, null, null),
  ('Education Guru', 'Completed 25 courses',     'https://img.icons8.com/color/96/graduation.png',   'course', null, null, 25, null, null),
  ('Test Passer',    'Passed first test',        'https://img.icons8.com/color/96/checkmark.png',    'test', null, null, null, 1, null),
  ('Quiz Master',    'Passed 10 tests',          'https://img.icons8.com/color/96/quiz.png',         'test', null, null, null, 10, null),
  ('Brainiac',       'Passed 50 tests',          'https://img.icons8.com/color/96/brain.png',        'test', null, null, null, 50, null),
  ('Perfect Score',  'Got 100% on any test',     'https://img.icons8.com/color/96/star--v1.png',    'test', null, null, null, null, null),
  ('First Hack',     'Solved 1 coding challenge','https://img.icons8.com/color/96/code.png',        'challenge', null, null, null, null, 1),
  ('Code Warrior',   'Solved 10 challenges',    'https://img.icons8.com/color/96/laptop-coding.png','challenge', null, null, null, null, 10),
  ('Algorithm Ace',  'Solved 50 challenges',    'https://img.icons8.com/color/96/algorithm.png',    'challenge', null, null, null, null, 50)
) as v(name, description, icon_url, category, xp_required, streak_required, course_required, test_required, challenge_required)
where not exists (select 1 from public.badges b where b.name = v.name);
`;

try {
  await pool.query(sql);
  console.log("Badges migration + seed applied successfully");

  const result = await pool.query("select * from badges order by category, xp_required nulls last");
  console.log(`Total badges: ${result.rows.length}`);
  for (const b of result.rows) {
    console.log(`  [${b.category}] ${b.name} (xp=${b.xp_required}, streak=${b.streak_required}, course=${b.course_required}, test=${b.test_required}, challenge=${b.challenge_required})`);
  }
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await pool.end();
}
