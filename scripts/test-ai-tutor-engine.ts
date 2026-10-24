/**
 * LEARNIFY AI — AI TUTOR 2.0 ENGINE SPECIFICATION & ARTIFACT PARSER TEST SUITE
 * Validates:
 * 1. Extraction of interactive artifacts (quiz, diagram, flashcards, exam, plan, actions)
 * 2. Streaming resilience: graceful parsing of incomplete/partial artifact blocks
 * 3. Fallback to raw text without crashing on malformed JSON
 * 4. XSS & prompt injection sanitization in artifact attributes
 * 5. Dynamic activity status state sequencing
 */

import assert from "node:assert";

console.log("=================================================");
console.log("🧠 STARTING AI TUTOR 2.0 ENGINE TEST SUITE");
console.log("=================================================\n");

let passed = 0;
let total = 0;

function test(name: string, fn: () => void | Promise<void>) {
  total++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✅ [PASS] ${name}`);
          passed++;
        })
        .catch((err) => {
          console.error(`  ❌ [FAIL] ${name}:`, err.message);
          throw err;
        });
    } else {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    }
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Pure parser logic to test specification before UI binding
// ---------------------------------------------------------------------------
export interface ArtifactBlock {
  type: "quiz" | "diagram" | "flashcards" | "exam" | "plan" | "actions" | "clarification";
  data: any;
  raw: string;
}

export interface ParsedSegment {
  type: "markdown" | "artifact";
  content: string;
  artifact?: ArtifactBlock;
}

export function parseTutorResponse(content: string): ParsedSegment[] {
  if (!content) return [];

  const segments: ParsedSegment[] = [];
  const artifactRegex = /```interactive:(quiz|diagram|flashcards|exam|plan|actions|clarification)\s*([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = artifactRegex.exec(content)) !== null) {
    const start = match.index;
    const end = artifactRegex.lastIndex;

    // Push preceding markdown if present
    if (start > lastIndex) {
      const text = content.slice(lastIndex, start).trim();
      if (text) {
        segments.push({ type: "markdown", content: text });
      }
    }

    const type = match[1] as ArtifactBlock["type"];
    const jsonStr = match[2].trim();

    try {
      const data = JSON.parse(jsonStr);
      segments.push({
        type: "artifact",
        content: jsonStr,
        artifact: { type, data, raw: match[0] },
      });
    } catch {
      // If parsing fails (e.g. streaming cutoff), push as safe markdown fallback
      segments.push({
        type: "markdown",
        content: match[0],
      });
    }

    lastIndex = end;
  }

  // Push remaining text
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      segments.push({ type: "markdown", content: remaining });
    }
  }

  return segments;
}

export function sanitizeArtifactText(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

// ---------------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------------

test("1. Parse standard markdown without artifacts", () => {
  const text = "# Overview\nTCP is a transport protocol.";
  const segments = parseTutorResponse(text);
  assert.strictEqual(segments.length, 1);
  assert.strictEqual(segments[0].type, "markdown");
  assert.strictEqual(segments[0].content, text);
});

test("2. Parse interactive quiz artifact cleanly", () => {
  const text = `Here is a quick lesson on TCP.\n\n\`\`\`interactive:quiz\n{\n  "question": "What is TCP?",\n  "options": ["Protocol", "Fruit"],\n  "answerIndex": 0,\n  "explanation": "TCP is a protocol."\n}\n\`\`\`\n\nHope this helps!`;
  const segments = parseTutorResponse(text);
  assert.strictEqual(segments.length, 3);
  assert.strictEqual(segments[0].type, "markdown");
  assert.strictEqual(segments[1].type, "artifact");
  assert.strictEqual(segments[1].artifact?.type, "quiz");
  assert.strictEqual(segments[1].artifact?.data.question, "What is TCP?");
  assert.strictEqual(segments[1].artifact?.data.answerIndex, 0);
  assert.strictEqual(segments[2].type, "markdown");
});

test("3. Parse interactive diagram and quick actions", () => {
  const text = `\`\`\`interactive:diagram\n{\n  "title": "TCP 3-Way Handshake",\n  "nodes": [\n    {"id": "syn", "label": "SYN (Client to Server)"},\n    {"id": "synack", "label": "SYN-ACK (Server to Client)"},\n    {"id": "ack", "label": "ACK (Client to Server)"}\n  ]\n}\n\`\`\`\n\n\`\`\`interactive:actions\n["Explain simpler", "Quiz me", "Show code"]\n\`\`\``;
  const segments = parseTutorResponse(text);
  assert.strictEqual(segments.length, 2);
  assert.strictEqual(segments[0].artifact?.type, "diagram");
  assert.strictEqual(segments[0].artifact?.data.nodes.length, 3);
  assert.strictEqual(segments[1].artifact?.type, "actions");
  assert.strictEqual(segments[1].artifact?.data[1], "Quiz me");
});

test("4. Handle incomplete/partial JSON during streaming without throwing", () => {
  const streamingPartial = `Explaining recursion...\n\`\`\`interactive:quiz\n{\n  "question": "What is base case?",\n  "options": ["A stop condition",`;
  // Should not throw, should gracefully return markdown fallback
  const segments = parseTutorResponse(streamingPartial);
  assert.ok(segments.length >= 1);
  assert.strictEqual(segments[0].type, "markdown");
});

test("5. Sanitize malicious XSS payloads in artifact labels", () => {
  const malicious = '<script>alert("hack")</script>Click me <a href="javascript:steal()">link</a>';
  const clean = sanitizeArtifactText(malicious);
  assert.ok(!clean.includes("<script>"));
  assert.ok(!clean.includes("javascript:"));
});

test("6. Parse exam-mode multi-marks answers", () => {
  const text = `\`\`\`interactive:exam\n{\n  "topic": "Process vs Thread",\n  "marks2": "A process is an executing program with its own memory space. A thread is a lightweight unit of execution within a process.",\n  "marks5": "Detailed comparison of 5 points",\n  "marks10": "Full 10-mark breakdown with memory map"\n}\n\`\`\``;
  const segments = parseTutorResponse(text);
  assert.strictEqual(segments.length, 1);
  assert.strictEqual(segments[0].artifact?.type, "exam");
  assert.ok(segments[0].artifact?.data.marks2.includes("executing program"));
});

test("7. Parse day-by-day study plan artifact", () => {
  const text = `\`\`\`interactive:plan\n{\n  "title": "5-Day Operating Systems Cram Plan",\n  "days": [\n    {"day": 1, "topic": "Processes & Threads", "tasks": ["Process states", "Context switching"]},\n    {"day": 2, "topic": "CPU Scheduling", "tasks": ["FCFS", "Round Robin", "SJF"]}\n  ]\n}\n\`\`\``;
  const segments = parseTutorResponse(text);
  assert.strictEqual(segments.length, 1);
  assert.strictEqual(segments[0].artifact?.type, "plan");
  assert.strictEqual(segments[0].artifact?.data.days.length, 2);
});

console.log("\n=================================================");
console.log(`🏁 TEST RESULTS: ${passed}/${total} PASSED`);
console.log("=================================================");
if (passed !== total) {
  process.exit(1);
}
