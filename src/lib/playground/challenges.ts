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
    hints: [
      "Try using a Hash Map for O(N) time complexity.",
      "Store seen numbers as key and index as value.",
    ],
    initial_code: "function twoSum(nums, target) {\n  // Write your solution here\n  \n}",
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
    hints: [
      "Use Regex `/[^a-z0-9]/g` to clean string.",
      "Compare clean string with its reversed version.",
    ],
    initial_code: "function isPalindrome(s) {\n  // Write your solution here\n  \n}",
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
    hints: [
      "Use three pointers: prev, curr, and next.",
      "Iterate through the nodes while reassigning pointers.",
    ],
    initial_code:
      "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  // Complete implementation\n  return prev;\n}",
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
    hints: [
      "Use a sliding window technique with a Set or Map.",
      "Maintain `left` and `right` window bounds.",
    ],
    initial_code:
      "function lengthOfLongestSubstring(s) {\n  // Write your sliding window solution\n  \n}",
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
    hints: ["Use a Queue (BFS approach).", "Track the number of nodes at each level."],
    initial_code:
      "function levelOrder(root) {\n  if (!root) return [];\n  // Complete BFS queue logic\n}",
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
    hints: ["Use a Min-Heap / Priority Queue.", "Divide and conquer merging pairs of lists."],
    initial_code: "function mergeKLists(lists) {\n  // Write optimal merge algorithm\n}",
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
    hints: ["Use syntax: `[x**2 for x in nums if x % 2 == 0]`"],
    initial_code: "def process_numbers(nums):\n    # Return squared even numbers\n    pass",
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
    hints: ["Use `functools.wraps` and `time.perf_counter()`."],
    initial_code:
      "import time\nfrom functools import wraps\n\ndef timeit(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        # Implement timer logic\n        pass\n    return wrapper",
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
    hints: ["Use `LIMIT 1 OFFSET 1` or `DENSE_RANK()` window function."],
    initial_code:
      "SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);",
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
    hints: ["Group by `DATE_TRUNC('month', created_at)` and use `COUNT(DISTINCT user_id)`."],
    initial_code:
      "SELECT \n  DATE_TRUNC('month', login_time) AS month,\n  COUNT(DISTINCT user_id) as active_users\nFROM user_logins\nGROUP BY 1\nORDER BY month DESC;",
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
    hints: [
      "Base62 encoding (`a-z, A-Z, 0-9`) maps 64-bit ID to 7 characters.",
      "Use Redis for hot URL cache with LRU eviction.",
    ],
    initial_code:
      "// System Design Spec & Architecture Document\n// 1. API Endpoints\n// 2. Database Schema (NoSQL vs Relational)\n// 3. Cache Strategy",
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
    hints: [
      "Track timestamps in a Sorted Set (Redis ZSET).",
      "Remove items older than current_time - 60s.",
    ],
    initial_code:
      "class RateLimiter {\n  constructor(limit = 100, windowMs = 60000) {\n    this.limit = limit;\n    this.windowMs = windowMs;\n  }\n  isAllowed(userId) {\n    // Implement sliding window counter\n  }\n}",
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
