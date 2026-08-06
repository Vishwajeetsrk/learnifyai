import { DEVELOPER_ROADMAPS } from "@/lib/developer-roadmaps";

/** Normalize a role string for matching: lowercase, strip punctuation, collapse whitespace. */
export function normalizeRole(role: string): string {
  return (role || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "of",
  "to",
  "in",
  "for",
  "and",
  "or",
  "with",
  "on",
  "at",
  "by",
  "developer",
  "engineer",
  "development",
  "engineering",
  "specialist",
  "junior",
  "senior",
  "lead",
  "principal",
  "architect",
  "master",
  "expert",
  "become",
  "job",
]);

/**
 * Find the best matching roadmap.sh id for a target role string.
 * Uses token overlap between the normalized role and roadmap names + ids.
 */
export function findRoadmapId(targetRole: string): string | null {
  const norm = normalizeRole(targetRole);
  if (!norm) return null;
  const tokens = norm.split(" ").filter((t) => t.length > 1 && !STOPWORDS.has(t));

  let best: { id: string; score: number } | null = null;

  for (const r of DEVELOPER_ROADMAPS) {
    let score = 0;
    const nameNorm = normalizeRole(r.name);
    const idNorm = normalizeRole(r.id);
    const nameTokens = nameNorm.split(" ").filter((t) => t.length > 1 && !STOPWORDS.has(t));
    const idTokens = idNorm.split(" ").filter((t) => t.length > 1 && !STOPWORDS.has(t));

    for (const t of tokens) {
      if (nameTokens.includes(t)) score += 2;
      if (idTokens.includes(t)) score += 3;
    }

    // Exact/id containment bonuses
    if (norm.includes(nameNorm)) score += 4;
    if (norm.includes(idNorm)) score += 2;
    if (idNorm.includes(norm)) score += 1;

    if (score > 0 && (!best || score > best.score)) best = { id: r.id, score };
  }

  return best ? best.id : null;
}

/**
 * Build a compact grounding string from a roadmap's curated topics that can be
 * injected into the AI prompt so courses/guides/projects reference real resources.
 */
export function buildGroundingPrompt(
  roadmapId: string,
  data: {
    name: string;
    topics: Array<{
      title: string;
      resources: Array<{ kind: string; title: string; url: string }>;
    }>;
  },
  maxTopics = 25,
): string {
  if (!data || !data.topics?.length) return "";
  const topics = data.topics.slice(0, maxTopics);
  const lines: string[] = [`Official roadmap.sh topic list for "${data.name}":`];
  for (const t of topics) {
    const res = (t.resources || []).slice(0, 3);
    const resStr = res.length
      ? ` Resources: ${res.map((r) => `[${r.kind}] ${r.title} (${r.url})`).join(" | ")}`
      : "";
    lines.push(`- ${t.title}${resStr}`);
  }
  return lines.join("\n");
}
