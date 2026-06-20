-- Add requirement columns for non-XP badge categories
alter table public.badges
  add column if not exists streak_required integer,
  add column if not exists course_required integer,
  add column if not exists test_required integer,
  add column if not exists challenge_required integer;

-- Seed badges across all categories
insert into public.badges (name, description, icon_url, category, xp_required, streak_required, course_required, test_required, challenge_required) values
  -- XP Milestones
  ('First Steps',    'Reached 50 XP',            'https://img.icons8.com/color/96/medal2.png',       'xp', 50, null, null, null, null),
  ('Dedicated',      'Reached 250 XP',           'https://img.icons8.com/color/96/medal.png',        'xp', 250, null, null, null, null),
  ('Scholar',        'Reached 500 XP',           'https://img.icons8.com/color/96/trophy.png',       'xp', 500, null, null, null, null),
  ('Master',         'Reached 1000 XP',          'https://img.icons8.com/color/96/crown.png',        'xp', 1000, null, null, null, null),
  ('Legend',         'Reached 2500 XP',          'https://img.icons8.com/color/96/star.png',         'xp', 2500, null, null, null, null),
  ('Grandmaster',    'Reached 5000 XP',          'https://img.icons8.com/color/96/diamond.png',      'xp', 5000, null, null, null, null),
  ('Omega',          'Reached 10000 XP',         'https://img.icons8.com/color/96/prize.png',        'xp', 10000, null, null, null, null),

  -- Streak Mastery
  ('On Fire',        '3-day learning streak',    'https://img.icons8.com/color/96/fire-element.png', 'streak', null, 3, null, null, null),
  ('Unstoppable',    '7-day learning streak',    'https://img.icons8.com/color/96/fire.png',         'streak', null, 7, null, null, null),
  ('Dedicated Soul', '30-day learning streak',   'https://img.icons8.com/color/96/sun.png',          'streak', null, 30, null, null, null),
  ('Immortal',       '100-day learning streak',  'https://img.icons8.com/color/96/phoenix.png',      'streak', null, 100, null, null, null),

  -- Course Badges
  ('First Graduate', 'Completed 1 course',       'https://img.icons8.com/color/96/diploma.png',      'course', null, null, 1, null, null),
  ('Knowledge Seeker', 'Completed 5 courses',    'https://img.icons8.com/color/96/books.png',        'course', null, null, 5, null, null),
  ('Scholar Path',   'Completed 10 courses',     'https://img.icons8.com/color/96/library.png',      'course', null, null, 10, null, null),
  ('Education Guru', 'Completed 25 courses',     'https://img.icons8.com/color/96/graduation.png',   'course', null, null, 25, null, null),

  -- Test Champion
  ('Test Passer',    'Passed first test',        'https://img.icons8.com/color/96/checkmark.png',    'test', null, null, null, 1, null),
  ('Quiz Master',    'Passed 10 tests',          'https://img.icons8.com/color/96/quiz.png',         'test', null, null, null, 10, null),
  ('Brainiac',       'Passed 50 tests',          'https://img.icons8.com/color/96/brain.png',        'test', null, null, null, 50, null),
  ('Perfect Score',  'Got 100% on any test',     'https://img.icons8.com/color/96/star--v1.png',    'test', null, null, null, null, null),

  -- Course Badges (continued)
  ('Grand Scholar',  'Completed 50 courses',    'https://img.icons8.com/color/96/globe.png',        'course', null, null, 50, null, null),

  -- Challenge Solver
  ('First Hack',     'Solved 1 coding challenge','https://img.icons8.com/color/96/code.png',        'challenge', null, null, null, null, 1),
  ('Code Warrior',   'Solved 10 challenges',    'https://img.icons8.com/color/96/laptop-coding.png','challenge', null, null, null, null, 10),
  ('Algorithm Ace',  'Solved 50 challenges',    'https://img.icons8.com/color/96/algorithm.png',    'challenge', null, null, null, null, 50),
  ('Master Architect','Solved 100 challenges',   'https://img.icons8.com/color/96/networking.png',   'challenge', null, null, null, null, 100);

-- Update existing badges to have proper categories
update public.badges set category = 'xp' where category is null or category = '';
