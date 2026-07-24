import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const DEFAULT_CHALLENGES = [
  {
    id: "c-101",
    title: "Two Sum Problem",
    slug: "two-sum",
    difficulty: "easy",
    category: "algorithms",
    language: "javascript",
    points: 50,
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      { input: "nums = [3,2,4], target = 6", output: "[1, 2]" },
    ],
    hints: [
      "Hint 1: A brute-force approach nested loop takes O(N²) time. Can we do better?",
      "Hint 2: Try using a Hash Map to store numbers you've seen along with their indices.",
      "Hint 3: For each element `nums[i]`, check if `target - nums[i]` exists in your map. If so, you found the pair!",
    ],
    initial_code: "function twoSum(nums, target) {\n  // Write your solution here\n  \n}",
    solution: {
      code: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      explanation:
        "Iterate through the array once. For each number, calculate `diff = target - nums[i]`. Check if `diff` is in our Hash Map. If it is, return `[map.get(diff), i]`. Otherwise, store `nums[i]` with index `i` in the map.",
      time_complexity: "O(N) - Single pass through the array",
      space_complexity: "O(N) - Hash map storing up to N elements",
    },
  },
  {
    id: "c-102",
    title: "Valid Palindrome Check",
    slug: "valid-palindrome",
    difficulty: "easy",
    category: "javascript",
    language: "javascript",
    points: 40,
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      { input: 's = "race a car"', output: "false" },
    ],
    hints: [
      "Hint 1: Clean the string using regular expression `/[^a-z0-9]/g` after converting to lowercase.",
      "Hint 2: Compare the cleaned string with its reverse version `clean.split('').reverse().join('')` or use two pointers.",
    ],
    initial_code: "function isPalindrome(s) {\n  // Write your solution here\n  \n}",
    solution: {
      code: "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}",
      explanation:
        "Normalize the string by stripping non-alphanumeric characters with regex and converting to lower case. Then check equality against its reversed string.",
      time_complexity: "O(N) - String cleaning and reversal",
      space_complexity: "O(N) - Memory allocation for cleaned string",
    },
  },
  {
    id: "c-103",
    title: "Reverse a Linked List",
    slug: "reverse-linked-list",
    difficulty: "medium",
    category: "data-structures",
    language: "javascript",
    points: 75,
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
    ],
    hints: [
      "Hint 1: Maintain three pointers: `prev` initialized to null, `curr` initialized to head, and `next`.",
      "Hint 2: Save `curr.next` before redirecting `curr.next = prev`.",
      "Hint 3: Advance `prev = curr` and `curr = next` until curr becomes null.",
    ],
    initial_code:
      "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  // Complete implementation\n  return prev;\n}",
    solution: {
      code: "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}",
      explanation:
        "Iterate through the list. For each node, store the next node temporarily, point current node's next to previous node, then move `prev` and `curr` forward.",
      time_complexity: "O(N) - Single pass through linked list",
      space_complexity: "O(1) - Constant auxiliary pointers",
    },
  },
  {
    id: "c-104",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating",
    difficulty: "medium",
    category: "algorithms",
    language: "javascript",
    points: 100,
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: "The answer is 'abc', with length 3." },
      { input: 's = "bbbbb"', output: "1" },
    ],
    hints: [
      "Hint 1: Use a sliding window with two pointers `left` and `right`.",
      "Hint 2: Use a Map or Set to track characters in the current window and their indices.",
    ],
    initial_code:
      "function lengthOfLongestSubstring(s) {\n  // Write your sliding window solution\n  \n}",
    solution: {
      code: "function lengthOfLongestSubstring(s) {\n  let map = new Map();\n  let maxLen = 0;\n  let left = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (map.has(s[right])) {\n      left = Math.max(left, map.get(s[right]) + 1);\n    }\n    map.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
      explanation:
        "Maintain a sliding window `[left...right]`. Update `left` bound whenever duplicate character is observed to ensure all characters in window are unique.",
      time_complexity: "O(N) - Single pass over string",
      space_complexity: "O(min(N, M)) - Size of character alphabet map",
    },
  },
  {
    id: "c-105",
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order",
    difficulty: "medium",
    category: "data-structures",
    language: "javascript",
    points: 90,
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
    hints: [
      "Hint 1: Use Breadth-First Search (BFS) with a queue data structure.",
      "Hint 2: For each iteration of the outer loop, take snapshot of `queue.length` to process all nodes of current level.",
    ],
    initial_code:
      "function levelOrder(root) {\n  if (!root) return [];\n  // Complete BFS queue logic\n}",
    solution: {
      code: "function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      currentLevel.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(currentLevel);\n  }\n  return result;\n}",
      explanation:
        "Traverse tree using queue BFS. For each level, dequeue `levelSize` nodes, push their values to `currentLevel`, and enqueue children.",
      time_complexity: "O(N) - Visits every node once",
      space_complexity: "O(N) - Maximum nodes stored in queue at deepest level",
    },
  },
  {
    id: "c-106",
    title: "Merge K Sorted Lists",
    slug: "merge-k-sorted-lists",
    difficulty: "hard",
    category: "data-structures",
    language: "javascript",
    points: 150,
    description:
      "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
    hints: [
      "Hint 1: Brute-force collecting all values and sorting takes O(N log N) time.",
      "Hint 2: Pairwise merge lists using Divide and Conquer to achieve optimal O(N log K) time.",
    ],
    initial_code: "function mergeKLists(lists) {\n  // Write optimal merge algorithm\n}",
    solution: {
      code: "function mergeKLists(lists) {\n  if (!lists || lists.length === 0) return null;\n  while (lists.length > 1) {\n    let merged = [];\n    for (let i = 0; i < lists.length; i += 2) {\n      let l1 = lists[i];\n      let l2 = i + 1 < lists.length ? lists[i + 1] : null;\n      merged.push(mergeTwoLists(l1, l2));\n    }\n    lists = merged;\n  }\n  return lists[0];\n}\nfunction mergeTwoLists(l1, l2) {\n  let dummy = { val: 0, next: null };\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val < l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}",
      explanation:
        "Merge lists pairwise using divide and conquer. In each pass, the number of lists is halved, giving logarithmic recursion depth.",
      time_complexity: "O(N log K) - N total nodes, K lists",
      space_complexity: "O(1) - Iterative pointer reuse",
    },
  },
  {
    id: "c-107",
    title: "Python List Comprehensions & Filtering",
    slug: "python-list-comprehension",
    difficulty: "easy",
    category: "python",
    language: "python",
    points: 40,
    description:
      "Write a function that takes a list of integers and returns only the squared values of even numbers using Python list comprehensions.",
    examples: [{ input: "nums = [1, 2, 3, 4, 5, 6]", output: "[4, 16, 36]" }],
    hints: [
      "Hint 1: Use syntax: `[expression for item in iterable if condition]`",
      "Hint 2: Expression is `x**2` and condition is `x % 2 == 0`.",
    ],
    initial_code: "def process_numbers(nums):\n    # Return squared even numbers\n    pass",
    solution: {
      code: "def process_numbers(nums):\n    return [x**2 for x in nums if x % 2 == 0]",
      explanation:
        "Single-line Python list comprehension that filters even numbers with `if x % 2 == 0` and squares them with `x**2`.",
      time_complexity: "O(N) - Linear pass through list",
      space_complexity: "O(N) - Returns new filtered list",
    },
  },
  {
    id: "c-108",
    title: "Python Decorators & Execution Timer",
    slug: "python-execution-timer-decorator",
    difficulty: "medium",
    category: "python",
    language: "python",
    points: 80,
    description:
      "Build a custom Python decorator `@timeit` that measures and prints execution time.",
    examples: [
      { input: "@timeit\ndef compute(): time.sleep(0.1)", output: "compute took 0.1002 seconds" },
    ],
    hints: [
      "Hint 1: Use `functools.wraps(func)` to preserve original function attributes.",
      "Hint 2: Record start timestamp with `time.perf_counter()` before function call and calculate difference after.",
    ],
    initial_code:
      "import time\nfrom functools import wraps\n\ndef timeit(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        # Implement timer logic\n        pass\n    return wrapper",
    solution: {
      code: "import time\nfrom functools import wraps\n\ndef timeit(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        duration = time.perf_counter() - start\n        print(f'{func.__name__} took {duration:.4f} seconds')\n        return result\n    return wrapper",
      explanation:
        "Decorator wraps function call, uses `time.perf_counter()` for high resolution timing, prints execution time, and returns function result.",
      time_complexity: "O(1) - Constant overhead",
      space_complexity: "O(1) - No extra allocation",
    },
  },
  {
    id: "c-109",
    title: "Find Second Highest Salary in SQL",
    slug: "sql-second-highest-salary",
    difficulty: "easy",
    category: "sql",
    language: "sql",
    points: 45,
    description:
      "Write an SQL query to report the second highest salary from the Employee table. If there is no second highest salary, return NULL.",
    examples: [{ input: "Employee table with salaries: [100, 200, 300]", output: "200" }],
    hints: [
      "Hint 1: Use subquery: `WHERE salary < (SELECT MAX(salary) FROM Employee)`",
      "Hint 2: Wrap in `MAX(salary)` to return NULL if second highest does not exist.",
    ],
    initial_code:
      "SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);",
    solution: {
      code: "SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (\n  SELECT MAX(salary) FROM Employee\n);",
      explanation:
        "Subquery finds overall maximum salary. Outer query finds maximum salary strictly less than the subquery result.",
      time_complexity: "O(N) - Table scan",
      space_complexity: "O(1) - Aggregate value",
    },
  },
  {
    id: "c-110",
    title: "SQL Monthly Active Users (MAU) Query",
    slug: "sql-monthly-active-users",
    difficulty: "medium",
    category: "sql",
    language: "sql",
    points: 85,
    description:
      "Write an SQL query to calculate Monthly Active Users (MAU) and month-over-month retention.",
    examples: [{ input: "Logins table with timestamps", output: "month | active_users" }],
    hints: [
      "Hint 1: Truncate login timestamp to month using `DATE_TRUNC('month', login_time)`.",
      "Hint 2: Group by month and count unique users with `COUNT(DISTINCT user_id)`.",
    ],
    initial_code:
      "SELECT \n  DATE_TRUNC('month', login_time) AS month,\n  COUNT(DISTINCT user_id) as active_users\nFROM user_logins\nGROUP BY 1\nORDER BY month DESC;",
    solution: {
      code: "SELECT \n  DATE_TRUNC('month', login_time) AS month,\n  COUNT(DISTINCT user_id) as active_users\nFROM user_logins\nGROUP BY 1\nORDER BY month DESC;",
      explanation:
        "Group login events by month truncation and aggregate count of distinct user IDs to compute MAU stats.",
      time_complexity: "O(N log N) - Grouping & sorting",
      space_complexity: "O(M) - Monthly aggregated records",
    },
  },
  {
    id: "c-111",
    title: "Design a Scalable URL Shortener (TinyURL)",
    slug: "design-url-shortener",
    difficulty: "hard",
    category: "system-design",
    language: "system-design",
    points: 160,
    description: "Design a high-throughput, fault-tolerant URL Shortening service like Bitly.",
    examples: [
      {
        input: "Long URL: https://learnifyai.in/courses/advanced-system-design",
        output: "Short URL: https://lnfy.in/7xK9a",
      },
    ],
    hints: [
      "Hint 1: Base62 encoding converts 64-bit auto-incrementing ID into a 7-character string.",
      "Hint 2: Use Redis LRU Cache layer to serve 95%+ read traffic without hitting database.",
    ],
    initial_code:
      "// System Design Spec & Architecture Document\n// 1. Base62 Encoder\n// 2. Database Schema (NoSQL vs Relational)\n// 3. Cache Strategy",
    solution: {
      code: "const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';\n\nfunction encodeId(num) {\n  let str = '';\n  while (num > 0) {\n    str = BASE62[num % 62] + str;\n    num = Math.floor(num / 62);\n  }\n  return str.padStart(7, '0');\n}",
      explanation:
        "High throughput architecture using Base62 encoding, Redis caching, and PostgreSQL auto-increment ID generation with partition sharding.",
      time_complexity: "O(1) - Fast lookup",
      space_complexity: "O(1) - Hash string generation",
    },
  },
  {
    id: "c-112",
    title: "Design Rate Limiter Algorithm",
    slug: "design-rate-limiter",
    difficulty: "medium",
    category: "system-design",
    language: "system-design",
    points: 110,
    description: "Implement a Sliding Window Counter rate limiter algorithm preventing API abuse.",
    examples: [
      {
        input: "Limit = 5 requests / 60 seconds per user IP",
        output: "6th request rejected with 429 Too Many Requests",
      },
    ],
    hints: [
      "Hint 1: Store request timestamps in array or Redis Sorted Set (ZSET).",
      "Hint 2: Purge timestamps older than `now - windowMs` before checking length against limit.",
    ],
    initial_code:
      "class RateLimiter {\n  constructor(limit = 100, windowMs = 60000) {\n    this.limit = limit;\n    this.windowMs = windowMs;\n  }\n  isAllowed(userId) {\n    // Implement sliding window counter\n  }\n}",
    solution: {
      code: "class RateLimiter {\n  constructor(limit = 100, windowMs = 60000) {\n    this.limit = limit;\n    this.windowMs = windowMs;\n    this.requests = new Map();\n  }\n\n  isAllowed(userId) {\n    const now = Date.now();\n    if (!this.requests.has(userId)) {\n      this.requests.set(userId, []);\n    }\n    const timestamps = this.requests.get(userId).filter(t => now - t < this.windowMs);\n    if (timestamps.length < this.limit) {\n      timestamps.push(now);\n      this.requests.set(userId, timestamps);\n      return true;\n    }\n    return false;\n  }\n}",
      explanation:
        "Sliding Window Counter algorithm filters request timestamps dynamically within rolling window duration, preventing burst traffic bypass.",
      time_complexity: "O(K) - K timestamps in window",
      space_complexity: "O(N * K) - Active user connections",
    },
  },
];

export const getChallenges = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z
      .object({
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        category: z.string().optional(),
      })
      .optional()
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const userId = context.userId;

    let query = supabase
      .from("playground_challenges")
      .select("id, title, slug, difficulty, category, language, points, hints, created_at")
      .eq("is_published", true);
    if (data?.difficulty) query = query.eq("difficulty", data.difficulty);
    if (data?.category) query = query.eq("category", data.category);

    let dbChallenges: any[] = [];
    try {
      const { data: res } = await query.order("points");
      dbChallenges = res || [];
    } catch {
      dbChallenges = [];
    }

    // Fetch user's solved challenge IDs
    let solvedIds = new Set<string>();
    if (userId) {
      try {
        const { data: submissions } = await supabase
          .from("playground_submissions")
          .select("challenge_id")
          .eq("user_id", userId)
          .eq("passed", true);
        solvedIds = new Set((submissions ?? []).map((s: any) => s.challenge_id));
      } catch {}
    }

    let merged = dbChallenges.map((c: any) => ({
      ...c,
      is_solved: solvedIds.has(c.id),
    }));
    const existingSlugs = new Set(dbChallenges.map((c: any) => c.slug));

    for (const def of DEFAULT_CHALLENGES) {
      if (!existingSlugs.has(def.slug)) {
        if (data?.difficulty && def.difficulty !== data.difficulty) continue;
        if (data?.category && def.category !== data.category) continue;
        merged.push({
          ...def,
          is_solved: solvedIds.has(def.id),
        });
      }
    }

    return merged;
  });

export const getChallenge = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    try {
      const { data: challenge } = await supabase
        .from("playground_challenges")
        .select("*")
        .eq("slug", data.slug)
        .eq("is_published", true)
        .single();
      if (challenge) return challenge;
    } catch {
      // Fall through to default challenges
    }

    const fallback = DEFAULT_CHALLENGES.find((c) => c.slug === data.slug);
    if (fallback) return fallback;

    throw new Error("Challenge not found");
  });

export const submitChallenge = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        challengeId: z.string().uuid(),
        language: z.string(),
        code: z.string().min(1),
        testResults: z.any(),
        passed: z.boolean(),
        score: z.number(),
        totalPoints: z.number(),
        executionTimeMs: z.number().optional(),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;

    const { error } = await supabase.from("playground_submissions").insert({
      user_id: userId,
      challenge_id: data.challengeId,
      language: data.language,
      code: data.code,
      passed: data.passed,
      test_results: data.testResults,
      score: data.score,
      total_points: data.totalPoints,
      execution_time_ms: data.executionTimeMs || null,
    });
    if (error) throw new Error(error.message);

    // Update leaderboard
    if (data.passed) {
      const { data: challenge } = await supabase
        .from("playground_challenges")
        .select("difficulty")
        .eq("id", data.challengeId)
        .single();
      const diff = challenge?.difficulty || "easy";
      const { data: existing } = await supabase
        .from("playground_leaderboard")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("playground_leaderboard")
          .update({
            total_points: (existing.total_points || 0) + data.score,
            challenges_solved: (existing.challenges_solved || 0) + 1,
            easy_solved: (existing.easy_solved || 0) + (diff === "easy" ? 1 : 0),
            medium_solved: (existing.medium_solved || 0) + (diff === "medium" ? 1 : 0),
            hard_solved: (existing.hard_solved || 0) + (diff === "hard" ? 1 : 0),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      } else {
        await supabase.from("playground_leaderboard").insert({
          user_id: userId,
          total_points: data.score,
          challenges_solved: 1,
          easy_solved: diff === "easy" ? 1 : 0,
          medium_solved: diff === "medium" ? 1 : 0,
          hard_solved: diff === "hard" ? 1 : 0,
        });
      }
    }

    return { success: true };
  });

export const getUserSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data, error } = await supabase
      .from("playground_submissions")
      .select(
        "id, challenge_id, language, passed, score, total_points, execution_time_ms, created_at, challenge:challenge_id(title, slug, difficulty)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getLeaderboard = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = (await import("@/integrations/supabase/client")).supabase as any;
  const { data, error } = await supabase
    .from("playground_leaderboard")
    .select(
      "user_id, total_points, challenges_solved, easy_solved, medium_solved, hard_solved, total_runs, updated_at",
    )
    .order("total_points", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  // Fetch profiles separately
  const userIds = (data ?? []).map((r: any) => r.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
  return (data ?? []).map((r: any) => ({
    ...r,
    profile: profileMap.get(r.user_id) || null,
  }));
});

export const createInterview = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        title: z.string().min(1).max(200),
        difficulty: z.enum(["easy", "medium", "hard"]),
        durationMinutes: z.number().min(5).max(180).default(30),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: challenges, error } = await supabase
      .from("playground_challenges")
      .select("id, title, difficulty, points")
      .eq("is_published", true)
      .eq("difficulty", data.difficulty)
      .limit(10);
    if (error) throw new Error(error.message);
    const { data: interview, error: iError } = await supabase
      .from("playground_interviews")
      .insert({
        user_id: userId,
        title: data.title,
        difficulty: data.difficulty,
        duration_minutes: data.durationMinutes,
        total_questions: (challenges ?? []).length,
      })
      .select()
      .single();
    if (iError) throw new Error(iError.message);
    return { interview, questions: challenges ?? [] };
  });
