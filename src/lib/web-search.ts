/**
 * Server-side web search helper shared by all agent tool executors.
 * Providers are tried in order: Tavily → SearchAPI → SerpAPI.
 * The API key is only ever sent via header or in-flight URL on the server;
 * it is never logged or returned to the client.
 */

export interface WebSearchResult {
  title: string;
  snippet: string;
  link: string;
}

interface TavilyResult {
  title?: string;
  content?: string;
  url?: string;
}

interface OrganicResult {
  title?: string;
  snippet?: string;
  link?: string;
}

const SEARCH_TIMEOUT_MS = 8000;
const MAX_RESULTS = 5;

async function searchTavily(query: string): Promise<WebSearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("tavily_not_configured");
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      max_results: MAX_RESULTS,
      include_answer: false,
      include_raw_content: false,
    }),
    signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`tavily_http_${res.status}`);
  const json = (await res.json()) as { results?: TavilyResult[] };
  return (json.results ?? [])
    .slice(0, MAX_RESULTS)
    .map((r) => ({ title: r.title ?? "", snippet: r.content ?? "", link: r.url ?? "" }))
    .filter((r) => r.link);
}

async function searchSearchApi(query: string): Promise<WebSearchResult[]> {
  const apiKey = process.env.SEARCHAPI_API_KEY;
  if (!apiKey) throw new Error("searchapi_not_configured");
  const url = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`searchapi_http_${res.status}`);
  const json = (await res.json()) as { organic_results?: OrganicResult[] };
  return (json.organic_results ?? [])
    .slice(0, MAX_RESULTS)
    .map((r) => ({ title: r.title ?? "", snippet: r.snippet ?? "", link: r.link ?? "" }))
    .filter((r) => r.link);
}

async function searchSerpApi(query: string): Promise<WebSearchResult[]> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) throw new Error("serpapi_not_configured");
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`serpapi_http_${res.status}`);
  const json = (await res.json()) as { organic_results?: OrganicResult[] };
  return (json.organic_results ?? [])
    .slice(0, MAX_RESULTS)
    .map((r) => ({ title: r.title ?? "", snippet: r.snippet ?? "", link: r.link ?? "" }))
    .filter((r) => r.link);
}

/**
 * Runs a web search against the first configured, working provider.
 * Always resolves to a JSON string — the exact shape agent tool callers expect:
 * - success: JSON array of results
 * - no results: { message: "No results" }
 * - all providers failing / none configured: { message: "Search unavailable" }
 */
export async function runWebSearch(query: string): Promise<string> {
  const providers: Array<() => Promise<WebSearchResult[]>> = [];
  if (process.env.TAVILY_API_KEY) providers.push(() => searchTavily(query));
  if (process.env.SEARCHAPI_API_KEY) providers.push(() => searchSearchApi(query));
  if (process.env.SERPAPI_API_KEY) providers.push(() => searchSerpApi(query));

  if (providers.length === 0) {
    return JSON.stringify({ message: "Search unavailable" });
  }

  for (const search of providers) {
    try {
      const results = await search();
      return JSON.stringify(results.length ? results : { message: "No results" });
    } catch {
      // Provider failed or not configured — try the next one.
    }
  }

  return JSON.stringify({ message: "Search unavailable" });
}
