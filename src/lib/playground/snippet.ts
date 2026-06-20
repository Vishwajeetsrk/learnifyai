// Generate client snippets for an HTTP request across multiple languages.
// Zero-dependency string templating.

export interface SnippetInput {
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body: string;
}

export type SnippetLang = "curl" | "fetch" | "axios" | "node" | "python" | "kotlin" | "swift" | "dart";

export const SNIPPET_LANGS: { id: SnippetLang; label: string }[] = [
  { id: "curl",   label: "cURL" },
  { id: "fetch",  label: "JavaScript (fetch)" },
  { id: "axios",  label: "JavaScript (axios)" },
  { id: "node",   label: "Node (https)" },
  { id: "python", label: "Python (requests)" },
  { id: "kotlin", label: "Kotlin (OkHttp)" },
  { id: "swift",  label: "Swift (URLSession)" },
  { id: "dart",   label: "Dart (http)" },
];

function headerEntries(h: SnippetInput["headers"]) {
  return h.filter((x) => x.key.trim()).map((x) => [x.key, x.value] as const);
}
function hasBody(req: SnippetInput) {
  return !["GET", "HEAD"].includes(req.method) && req.body.trim().length > 0;
}
function esc(s: string) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

export function buildSnippet(lang: SnippetLang, req: SnippetInput): string {
  const headers = headerEntries(req.headers);
  switch (lang) {
    case "curl": {
      const parts = [`curl -X ${req.method} "${req.url}"`];
      for (const [k, v] of headers) parts.push(`  -H "${esc(k)}: ${esc(v)}"`);
      if (hasBody(req)) parts.push(`  --data '${req.body.replace(/'/g, "'\\''")}'`);
      return parts.join(" \\\n");
    }
    case "fetch": {
      const init: string[] = [`  method: "${req.method}"`];
      if (headers.length) init.push(`  headers: {\n${headers.map(([k, v]) => `    "${esc(k)}": "${esc(v)}"`).join(",\n")}\n  }`);
      if (hasBody(req)) init.push(`  body: ${JSON.stringify(req.body)}`);
      return `const res = await fetch("${req.url}", {\n${init.join(",\n")}\n});\nconst data = await res.text();\nconsole.log(data);`;
    }
    case "axios": {
      const cfg: string[] = [`  method: "${req.method.toLowerCase()}"`, `  url: "${req.url}"`];
      if (headers.length) cfg.push(`  headers: {\n${headers.map(([k, v]) => `    "${esc(k)}": "${esc(v)}"`).join(",\n")}\n  }`);
      if (hasBody(req)) cfg.push(`  data: ${JSON.stringify(req.body)}`);
      return `import axios from "axios";\nconst res = await axios({\n${cfg.join(",\n")}\n});\nconsole.log(res.data);`;
    }
    case "node": {
      return `import { request } from "node:https";\nconst req = request("${req.url}", {\n  method: "${req.method}",\n  headers: ${JSON.stringify(Object.fromEntries(headers), null, 2)}\n}, (res) => {\n  let body = "";\n  res.on("data", (c) => body += c);\n  res.on("end", () => console.log(res.statusCode, body));\n});\n${hasBody(req) ? `req.write(${JSON.stringify(req.body)});\n` : ""}req.end();`;
    }
    case "python": {
      const lines: string[] = ["import requests", ""];
      lines.push(`headers = ${JSON.stringify(Object.fromEntries(headers), null, 2)}`);
      if (hasBody(req)) lines.push(`data = ${JSON.stringify(req.body)}`);
      lines.push(`res = requests.request("${req.method}", "${req.url}", headers=headers${hasBody(req) ? ", data=data" : ""})`);
      lines.push(`print(res.status_code, res.text)`);
      return lines.join("\n");
    }
    case "kotlin": {
      const lines: string[] = [
        `import okhttp3.*`,
        ``,
        `val client = OkHttpClient()`,
        `val request = Request.Builder()`,
        `  .url("${req.url}")`,
      ];
      for (const [k, v] of headers) lines.push(`  .addHeader("${esc(k)}", "${esc(v)}")`);
      if (hasBody(req)) {
        lines.push(`  .method("${req.method}", "${esc(req.body)}".toRequestBody("application/json".toMediaType()))`);
      } else {
        lines.push(`  .method("${req.method}", null)`);
      }
      lines.push(`  .build()`, ``, `client.newCall(request).execute().use { println(it.body?.string()) }`);
      return lines.join("\n");
    }
    case "swift": {
      const lines: string[] = [
        `import Foundation`,
        ``,
        `var request = URLRequest(url: URL(string: "${req.url}")!)`,
        `request.httpMethod = "${req.method}"`,
      ];
      for (const [k, v] of headers) lines.push(`request.addValue("${esc(v)}", forHTTPHeaderField: "${esc(k)}")`);
      if (hasBody(req)) lines.push(`request.httpBody = ${JSON.stringify(req.body)}.data(using: .utf8)`);
      lines.push(``, `URLSession.shared.dataTask(with: request) { data, _, _ in`, `  if let d = data { print(String(data: d, encoding: .utf8) ?? "") }`, `}.resume()`);
      return lines.join("\n");
    }
    case "dart": {
      const lines: string[] = [
        `import 'package:http/http.dart' as http;`,
        ``,
        `final res = await http.${req.method.toLowerCase()}(`,
        `  Uri.parse('${req.url}'),`,
      ];
      if (headers.length) lines.push(`  headers: ${JSON.stringify(Object.fromEntries(headers))},`);
      if (hasBody(req)) lines.push(`  body: ${JSON.stringify(req.body)},`);
      lines.push(`);`, `print(res.body);`);
      return lines.join("\n");
    }
  }
}
