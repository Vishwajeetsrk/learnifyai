-- Playground System: projects, files, runs, challenges, submissions, leaderboard

-- 1. Playground Projects
create table if not exists public.playground_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Project',
  description text,
  language text not null default 'javascript',
  template text default 'blank', -- blank, html-css-js, react, node
  is_public boolean not null default false,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.playground_projects enable row level security;

create policy "Users can CRUD own projects"
  on public.playground_projects
  using (user_id = auth.uid());

create policy "Anyone can read public projects"
  on public.playground_projects for select
  using (is_public = true);

create index idx_playground_projects_user on public.playground_projects(user_id);
create index idx_playground_projects_public on public.playground_projects(is_public);

-- 2. Playground Files (within a project)
create table if not exists public.playground_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.playground_projects(id) on delete cascade,
  name text not null default 'main.txt',
  path text not null default '/',
  content text not null default '',
  language text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.playground_files enable row level security;

create policy "Users can CRUD own project files"
  on public.playground_files
  using (
    exists (
      select 1 from public.playground_projects
      where id = playground_files.project_id
      and (user_id = auth.uid() or is_public = true)
    )
  );

create index idx_playground_files_project on public.playground_files(project_id);

-- 3. Playground Execution Runs (history + analytics)
create table if not exists public.playground_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.playground_projects(id) on delete set null,
  language text not null,
  code text not null,
  stdin text default '',
  stdout text default '',
  stderr text default '',
  exit_code int default -1,
  execution_time_ms int,
  memory_kb int,
  status text not null default 'success', -- success, error, timeout, compile_error
  created_at timestamptz not null default now()
);

alter table public.playground_runs enable row level security;

create policy "Users can insert own runs"
  on public.playground_runs for insert
  with check (user_id = auth.uid());

create policy "Users can read own runs"
  on public.playground_runs for select
  using (user_id = auth.uid());

create index idx_playground_runs_user on public.playground_runs(user_id);
create index idx_playground_runs_language on public.playground_runs(language);
create index idx_playground_runs_created on public.playground_runs(created_at desc);

-- 4. Coding Challenges
create table if not exists public.playground_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null, -- algorithms, data-structures, javascript, python, etc.
  language text, -- null = any language
  starter_code jsonb default '{}', -- { "javascript": "code", "python": "code" }
  test_cases jsonb not null default '[]',
  hidden_test_cases jsonb default '[]',
  solution text,
  hints text[] default '{}',
  points int not null default 10,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.playground_challenges enable row level security;

create policy "Anyone can read published challenges"
  on public.playground_challenges for select
  using (is_published = true);

create policy "Admins can manage challenges"
  on public.playground_challenges
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'super_admin')));

create index idx_playground_challenges_difficulty on public.playground_challenges(difficulty);
create index idx_playground_challenges_category on public.playground_challenges(category);

-- 5. Challenge Submissions
create table if not exists public.playground_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.playground_challenges(id) on delete cascade,
  language text not null,
  code text not null,
  passed boolean not null default false,
  test_results jsonb default '[]',
  score int default 0,
  total_points int default 0,
  execution_time_ms int,
  memory_kb int,
  created_at timestamptz not null default now()
);

alter table public.playground_submissions enable row level security;

create policy "Users can CRUD own submissions"
  on public.playground_submissions
  using (user_id = auth.uid());

create index idx_playground_submissions_user on public.playground_submissions(user_id);
create index idx_playground_submissions_challenge on public.playground_submissions(challenge_id);

-- 6. Leaderboard (aggregated view)
create table if not exists public.playground_leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  total_points int not null default 0,
  challenges_solved int not null default 0,
  easy_solved int not null default 0,
  medium_solved int not null default 0,
  hard_solved int not null default 0,
  total_runs int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.playground_leaderboard enable row level security;

create policy "Anyone can read leaderboard"
  on public.playground_leaderboard for select
  using (true);

create policy "Users can upsert own leaderboard"
  on public.playground_leaderboard for insert
  with check (user_id = auth.uid());

create policy "Users can update own leaderboard"
  on public.playground_leaderboard for update
  using (user_id = auth.uid());

create index idx_playground_leaderboard_points on public.playground_leaderboard(total_points desc);

-- 7. Interview Assessments
create table if not exists public.playground_interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  difficulty text not null,
  duration_minutes int not null default 30,
  status text not null default 'in_progress', -- in_progress, completed, timed_out
  score int,
  total_questions int not null default 0,
  answered int not null default 0,
  correct int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.playground_interviews enable row level security;

create policy "Users can CRUD own interviews"
  on public.playground_interviews
  using (user_id = auth.uid());

create index idx_playground_interviews_user on public.playground_interviews(user_id);

-- Seed some challenges
insert into public.playground_challenges (title, slug, description, difficulty, category, language, starter_code, test_cases, hidden_test_cases, hints, points, is_published) values
(
  'Two Sum',
  'two-sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
  'easy',
  'algorithms',
  'javascript',
  '{"javascript": "function twoSum(nums, target) {\n  // Your code here\n}"}',
  '[{"input": {"nums": [2,7,11,15], "target": 9}, "expected": [0,1]}, {"input": {"nums": [3,2,4], "target": 6}, "expected": [1,2]}, {"input": {"nums": [3,3], "target": 6}, "expected": [0,1]}]',
  '[{"input": {"nums": [1,2,3,4,5], "target": 9}, "expected": [3,4]}, {"input": {"nums": [-1,-2,-3,-4,-5], "target": -8}, "expected": [2,3]}]',
  '{}'::text[],
  10,
  true
),
(
  'Reverse a String',
  'reverse-string',
  'Write a function that reverses a string. The input string is given as an array of characters s.',
  'easy',
  'algorithms',
  null,
  '{"javascript": "function reverseString(s) {\n  // Your code here\n}"}',
  '[{"input": {"s": ["h","e","l","l","o"]}, "expected": ["o","l","l","e","h"]}, {"input": {"s": ["H","a","n","n","a","h"]}, "expected": ["h","a","n","n","a","H"]}]',
  '[]'::jsonb,
  '{"Try using two pointers - one at start, one at end"}'::text[],
  5,
  true
),
(
  'Valid Parentheses',
  'valid-parentheses',
  'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. A string is valid if brackets close in the correct order.',
  'medium',
  'algorithms',
  null,
  '{"javascript": "function isValid(s) {\n  // Your code here\n}"}',
  '[{"input": {"s": "()"}, "expected": true}, {"input": {"s": "()[]{}"}, "expected": true}, {"input": {"s": "(]"}, "expected": false}, {"input": {"s": "([)]"}, "expected": false}]',
  '[{"input": {"s": "{[]}"}, "expected": true}, {"input": {"s": "((()))"}, "expected": true}]',
  '{"Use a stack data structure", "Map closing brackets to their opening counterparts"}'::text[],
  15,
  true
),
(
  'FizzBuzz',
  'fizzbuzz',
  'Write a function that returns an array of strings from 1 to n. For multiples of 3, use "Fizz" instead of the number. For multiples of 5, use "Buzz". For multiples of both 3 and 5, use "FizzBuzz".',
  'easy',
  'javascript',
  'javascript',
  '{"javascript": "function fizzBuzz(n) {\n  // Your code here\n}"}',
  '[{"input": {"n": 3}, "expected": ["1","2","Fizz"]}, {"input": {"n": 5}, "expected": ["1","2","Fizz","4","Buzz"]}, {"input": {"n": 15}, "expected": ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]}]',
  '[]'::jsonb,
  '{}'::text[],
  5,
  true
),
(
  'Palindrome Number',
  'palindrome-number',
  'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.',
  'easy',
  'algorithms',
  null,
  '{"javascript": "function isPalindrome(x) {\n  // Your code here\n}"}',
  '[{"input": {"x": 121}, "expected": true}, {"input": {"x": -121}, "expected": false}, {"input": {"x": 10}, "expected": false}]',
  '[{"input": {"x": 0}, "expected": true}, {"input": {"x": 12321}, "expected": true}]',
  '{"Convert to string and compare with reverse", "Or reverse half the number mathematically"}'::text[],
  5,
  true
),
(
  'Binary Search',
  'binary-search',
  'Given an array of integers nums sorted in ascending order and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
  'medium',
  'algorithms',
  null,
  '{"javascript": "function search(nums, target) {\n  // Your code here\n}"}',
  '[{"input": {"nums": [-1,0,3,5,9,12], "target": 9}, "expected": 4}, {"input": {"nums": [-1,0,3,5,9,12], "target": 2}, "expected": -1}]',
  '[{"input": {"nums": [5], "target": 5}, "expected": 0}, {"input": {"nums": [1,2,3,4,5,6,7,8,9], "target": 1}, "expected": 0}]',
  '{"Use two pointers: left = 0, right = nums.length - 1", "Calculate mid = Math.floor((left + right) / 2)"}'::text[],
  15,
  true
),
(
  'Merge Two Sorted Lists',
  'merge-two-sorted-lists',
  'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
  'hard',
  'algorithms',
  'javascript',
  '{"javascript": "class ListNode {\n  constructor(val, next) {\n    this.val = (val===undefined ? 0 : val);\n    this.next = (next===undefined ? null : next);\n  }\n}\n\nfunction mergeTwoLists(list1, list2) {\n  // Your code here\n}"}',
  '[]'::jsonb,
  '[]'::jsonb,
  '{"Use a dummy head node to simplify the logic", "Compare values and link the smaller one"}'::text[],
  20,
  true
)
on conflict (slug) do nothing;
