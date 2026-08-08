# Learning Experience Upgrade Plan

**Source**: `C:\Users\vishw\Music\Learn and Developer` (Scrimba course assets, interactive scrim, AI explainer extension, VS Code source, Woblo design exports)
**Constraint**: NO design changes — all upgrades are content, learning-flow, and feature wiring inside existing UI patterns.
**Date**: 2026-08-08

---

## 1. Deep Scan — What Each Resource Is & What It's Worth

| # | Resource | What it is | Size | Usefulness verdict |
|---|----------|------------|------|--------------------|
| 1 | `learn-fullstack-development-main/` | Scrimba "Become a Fullstack Developer" challenge files — a complete production curriculum: 7 modules, 60+ lesson folders, 12 real build projects, per-lesson "Aside" concept deep-dives, "Your turn" challenges, Exercise 1/2 (before/after) pairs, starter HTML/CSS/JS + image/GIF assets per lesson | ~1.2 GB | **USE (highest value)** — a proven project-based pedagogy blueprint |
| 2 | `Scrim-s06icdv/` | A Scrimba interactive scrim (React app with Unsplash API) — the interactive-lesson format: runnable code inline with the lesson, CHALLENGE comments in code, RUN + SUBMIT SOLUTION buttons | 10 KB | **USE as pattern** — the embedded exercise format; code itself is reference only |
| 3 | `scrimba-explain-extension-main/` | Chrome extension: click toolbar icon → extracts page title + readable text (main/article first, 12k char cap) → POSTs to `/api/explain/page` → opens a live-rendering AI explainer guide owned by the user | 32 KB | **ADAPT** — one-click "Explain this" flow; MVP in-app, extension later |
| 4 | `vscode-main/` | The actual Microsoft VS Code open-source repository (MIT) | ~28 MB | **REFERENCE ONLY** — use as a real-world OSS codebase teaching artifact for the VS Code + Git course; never bundle into the app |
| 5 | `ide.*Woblo.*` + `react-todo-app-phase-7.*Woblo.*` | Design-token exports (DTCG tokens JSON, Tailwind v4 / shadcn CSS, full-page HTML) of an IDE interface and a todo-app phase design | ~2 MB | **ARCHIVE / SKIP** — design assets; design is frozen per user constraint |
| 6 | `coding.png`, `coding video with real interactive .png`, `certificate w3school.png` | Screenshots (interactive coding lesson, certificate) | ~310 KB | **REFERENCE** — concept visuals; Learnify's certificate system already exceeds w3schools-style (QR-verified, designer studio). Images could not be visually analyzed by this model (no image input) |
| 7 | `*.h2d` | Scrimba headless-design binary export | 1.7 MB | **SKIP** — binary, not usable |
| 8 | `Scrim-*.zip`, `*main.zip` | Zip mirrors of the above | — | Redundant with extracted folders |

---

## 2. What Learnify AI Already Has (so we build, not duplicate)

- **Rich lesson player**: `RichLessonContent` renderer (markdown, quiz blocks, flashcards, Mermaid diagrams, callouts, code blocks, downloadable resources) in `src/components/course/`.
- **Exercise tab** (per lesson): AI-generated practical exercise via `run("exercise")` in `courses.$slug.tsx`.
- **Code playground tab**: Monaco editor (`CodeMode`) with `gradeExercise` AI grading (score 0–100, pass/fail, suggestions) in `exercise-grader.functions.ts`.
- **Assignments** with difficulty/XP chips per course.
- **Gamification**: XP, streaks, badges, leaderboard (server-side `gamification.functions.ts`).
- **AI**: multi-provider chat (Groq → Gemini → OpenRouter), lesson AI tabs (summary/doubt/visual).
- **Course builder** (admin/creator) + migrations pipeline (`apply-migrations.cjs` style).

**The gap the sources expose**: exercises and the playground are *separate tabs* with a manual flow (generate → copy → grade). Scrimba's model — which drives its famously high completion rates — embeds the exercise *inside the lesson* with starter code, a Run button, and a solution reveal. Our content also lacks the project-per-module cadence and "Aside" micro-lesson rhythm.

---

## 3. The Plan

### Phase 1 — In-Lesson Interactive Exercises ("Your Turn") — HIGH VALUE, MEDIUM EFFORT

Make lessons *runnable*, not just readable, without touching the design system.

**1.1 New lesson content block: `:::exercise` fence**
- Extend `RichLessonContent.tsx` to detect a `:::exercise` fenced block (JSON: `{ language, starterCode, solution, hint, instructions }`).
- Renders the existing Monaco editor (reuse `CodeMode` internals) + Run button (existing code-exec API) + Hint toggle + "Reveal solution" toggle + "I solved it → +XP" button wired to existing gamification functions.
- Zero new UI chrome — lives inside the lesson flow exactly like quiz blocks do today.

**1.2 DB: `lesson_exercises` table** (migration `20270810000001_lesson_exercises.sql`)
- Columns: `id, lesson_id (FK, unique), language, starter_code, solution_code, hint, instructions, passing_grade, created_at`.
- RLS: public read; creator/admin write. Fetched with lesson content.

**1.3 Seed exercises (migration `20270810000002_exercise_seed.sql`)**
Adapt Scrimba's challenge patterns (write your first variable, increment on clicks, add an onclick, render with innerText, template strings, etc.) as original exercises for the first courses:
- `javascript-zero-to-pro` (6 exercises — one per lesson)
- `html-css-essentials` (4 exercises: CSS link, flexbox centering, box model)
- `python-for-everyone` (4 exercises: f-strings, loops, dict.get, files)
- `template-mastery` (4 exercises: edit a real template snippet, button onclick)

**1.4 XP hook** — solving an exercise grants XP via existing `gamification.functions.ts`; track solved exercises for future analytics.

**Files**: `src/components/course/ExerciseBlock.tsx` (new), `RichLessonContent.tsx` (extend), `src/lib/exercise-grader.functions.ts` (reuse), 2 migrations + seed script.

---

### Phase 2 — Project-per-Module & "Aside" Rhythm (CONTENT-DRIVEN) — HIGH VALUE, CONTENT EFFORT

Adopt Scrimba's proven cadence in existing web-dev courses: **concept → build → aside → build → solo project**.

**2.1 Solo Project material type**
- New table `course_projects` (or extend `course_materials` with type `project`): `id, course_id, module_id, title, brief, starter_zip_url, solution_zip_url, rubric_json, xp_reward`.
- Starter packs: real small zips (index.html/css/js) uploaded to Supabase Storage `course-materials` bucket; rendered via existing Resources tab pattern (no new UI).
- Seed 6 solo projects (original, adapted from the curriculum ideas):
  1. Personal Business Card (HTML/CSS — html-css-essentials)
  2. Counter App (JS — javascript-zero-to-pro)
  3. Basketball Scoreboard (JS — javascript-zero-to-pro)
  4. NFT-Style Landing Page (CSS — html-css-essentials)
  5. Personal Portfolio Site (CSS — html-css-essentials)
  6. Cookie-Consent Modal (JS — javascript-zero-to-pro)
  Each with brief + rubric + starter code; solution available to admins only.

**2.2 "Aside" micro-lessons**
- Insert 2–3 short "Aside" lessons per web course (existing `lessons` rows, `is_preview` false): 3–5 minute concept deep-dives that the main build flow references — e.g., "Aside: margin auto on flexbox children", "Aside: argument vs parameter", "Aside: specificity".
- Reuse existing `[!info]`/`[!tip]` callouts for the aside badge (already rendered — no design change).

**2.3 Module-ending projects**
- Restructure module 2 of the JS/HTML courses so the final lesson of each module IS the project (reorder `order_index` only; no schema change).

**Files**: 1 migration, storage upload script, seed SQL, content markdown updates in 3 courses.

---

### Phase 3 — "Explain This Lesson" (Scrimba-Explain Pattern, In-App) — MEDIUM VALUE, LOW EFFORT

**3.1 In-app explain**
- Add an "Explain this lesson" action inside the existing Lesson AI tabs (summary/doubt already exist — wire a one-click explain that streams a plain-language guide of the current lesson using `callUserAiChat` multi-provider fallback). Reuses existing panel; no new design.
- Save guides to `lesson_guides` table (optional, owner = user, like Scrimba's ownership model).

**3.2 Browser extension (later, optional)**
- Port `scrimba-explain-extension` pattern to learnifyai: click icon → extract page text (reuse `extract.js` logic, 12k cap, main/article first) → POST to new `/api/explain/page` → open live guide at `/explain/{id}`.
- Requires: backend endpoint + explain page route + extension repo. **Deferred** until in-app version proves value.

**Files**: `LessonAiTabs` wiring (existing component), `src/lib/user-ai.ts` reuse, optional migration.

---

### Phase 4 — Real-Codebase Learning (VS Code + Git Course) — LOW EFFORT, NICE DIFFERENTIATOR

- Author `public/resources/vscode-codebase-walkthrough.md`: how a real OSS codebase (vscode-main) is organized — `src/`, `extensions/`, `build/`, package.json, PR workflow — with a guided read-through mapped to the course's Git/Branches lessons.
- Link it as a material in `vs-code-git-essentials` course (existing material mechanism).
- Do NOT copy vscode source into the repo — reference GitHub + README structure only.

**Files**: 1 markdown resource + 1 material row (seed).

---

### Phase 5 — Measurement & Polish

- Track exercise completions + project submissions in `lesson_exercises`/`course_projects` tables.
- Dashboard/admin query: completion rate of lessons with exercises vs. without (existing admin patterns).
- Award first-time badge "First to Code" via existing achievements system (optional).

---

## 4. What We Explicitly Will NOT Do

- ❌ No design changes (per constraint) — Woblo tokens/CSS archived, not applied.
- ❌ No bundling vscode-main source into the app/repo.
- ❌ No importing `.h2d` binaries or legacy webpack scrim builds.
- ❌ No verbatim copying of Scrimba lesson text/code (copyright) — only the *pedagogy* (challenge → aside → project cadence) and original re-implementations of the project *ideas*.
- ❌ No changes to the marketplace/course-card design (current upgrade stays as-is).

---

## 5. Suggested Order & Effort

| Phase | Effort | Ships |
|-------|--------|-------|
| **P1 In-lesson exercises** | 1–2 days | Exercise blocks live in 3 courses; XP rewards; highest learner-engagement win |
| **P2 Projects & asides** | 2–3 days | 6 solo projects + 8–10 aside lessons; module-ending projects |
| **P3 Explain feature** | 0.5–1 day | One-click lesson explain (in-app); extension deferred |
| **P4 Real-codebase resource** | 0.5 day | VS Code walkthrough resource |
| **P5 Measurement** | 1 day | Analytics + badge |

**Recommended start: Phase 1** (reuses the most existing infra — Monaco, graders, gamification — and delivers the biggest learning-quality jump).
