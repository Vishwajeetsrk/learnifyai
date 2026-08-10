-- Phase 6: "Today in the Industry" — one short, practice-first lesson per remaining course.
-- New "Today in the Industry" module per course (order after existing modules).

insert into public.course_modules (id, course_id, title, description, order_index)
values
  ('00000000-0000-4000-8000-000000000039', (select id from public.courses where slug = 'vs-code-git-essentials'), 'Today in the Industry', 'What professional developers actually do with AI — and how you can too.', 2),
  ('00000000-0000-4000-8000-000000000040', (select id from public.courses where slug = 'chatgpt-claude-ai'), 'Today in the Industry', 'How the big AI models are actually used at work right now.', 2),
  ('00000000-0000-4000-8000-000000000041', (select id from public.courses where slug = 'python-for-everyone'), 'Today in the Industry', 'Where Python is earning its keep in 2026.', 2),
  ('00000000-0000-4000-8000-000000000042', (select id from public.courses where slug = 'google-workspace-pro'), 'Today in the Industry', 'AI is built into the tools you use every day.', 2),
  ('00000000-0000-4000-8000-000000000043', (select id from public.courses where slug = 'excel-sheets-mastery'), 'Today in the Industry', 'Spreadsheets grew an AI copilot — learn to drive it.', 2),
  ('00000000-0000-4000-8000-000000000044', (select id from public.courses where slug = 'power-bi-visuals'), 'Today in the Industry', 'AI-powered insights are reshaping analytics.', 2),
  ('00000000-0000-4000-8000-000000000045', (select id from public.courses where slug = 'java-fundamentals'), 'Today in the Industry', 'Java''s 2026 landscape: LTS cadence, AI frameworks, jobs.', 2),
  ('00000000-0000-4000-8000-000000000046', (select id from public.courses where slug = 'word-powerpoint-pro'), 'Today in the Industry', 'AI drafts the documents; you make them great.', 2),
  ('00000000-0000-4000-8000-000000000047', (select id from public.courses where slug = 'figma-ui-bootcamp'), 'Today in the Industry', 'AI features inside Figma and how pros use them.', 2),
  ('00000000-0000-4000-8000-000000000048', (select id from public.courses where slug = 'template-mastery'), 'Today in the Industry', 'AI site builders vs templates — where each wins.', 4);

-- 4231 VS Code + Git
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004231', (select id from public.courses where slug = 'vs-code-git-essentials'), '00000000-0000-4000-8000-000000000039', 'Copilot & AI Pair Programming', 'AI-assisted coding is now the default — here''s how to stay in control.', $md$
## First Understanding

- AI completions (Copilot-style) now ship inside VS Code and most editors — knowing how to steer them is a job skill.
- The best prompt is a clear intent: describe the function in a comment, and the model completes it.
- AI suggests; you review. The 2026 skill is critical review, not memorising libraries.

## The pattern

```
// TODO comment -> describes intent:
// function that counts words in a string, ignoring punctuation
```

> [!info] How pros use it
> Write the intent as a comment or function name, accept the suggestion, then immediately read it critically: edge cases (empty input), performance, and security all stay human responsibilities.

## Your daily loop

1. Let the AI complete boilerplate (imports, repetitive lines) — you keep the design.
2. Ask it to explain code you didn't write: select code → "Explain this" in the AI chat.
3. Use it to generate tests — but review them; generated tests can miss the real bug.

> [!warning] The blind-accept trap
> Accepting every suggestion is how bugs become invisible. Suggestion speed ≠ correctness. Verify before committing.

> [!tip] Commit messages too
> AI writes decent commit messages from your diff — saves minutes daily and documents your work.

```quiz
Q: What is the 2026 professional skill when using AI code suggestions?
A. Accepting suggestions faster
B. Critically reviewing every suggestion
C. Writing longer prompts
D. Avoiding AI entirely
Correct: B
Explain: AI boosts speed; humans own correctness, security and intent.
```

## Suggestions and Tips

- Practise writing intent comments: if the AI can't complete them, your intent wasn't clear.
- Never paste proprietary code into a free AI tool — check your employer's policy first.
- Turn suggestions OFF during deep problem-solving, ON during implementation.
$md$, 7, 8);

-- 4232 ChatGPT & Claude
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004232', (select id from public.courses where slug = 'chatgpt-claude-ai'), '00000000-0000-4000-8000-000000000040', 'Claude & GPT at Work in 2026', 'What the flagship models are actually good at — and where they still fail.', $md$
## First Understanding

- Both Claude and GPT-class models are now fast, cheap and multimodal (text, images, files).
- Their sweet spot: drafting, restructuring, explaining, summarising, and paired coding.
- Their weak spot: confident-but-wrong facts ("hallucination") and invented references.

## Choose by job

| Task | Why they're strong | Watch out for |
|---|---|---|
| Drafting emails/docs | Instantly solid structure and tone | Unverified specifics |
| Explaining concepts | Patient, tailored, interactive | Overconfidence |
| Coding with context | Whole-file awareness, refactors | Stale library syntax |
| Data analysis | Reads CSV/XLSX, writes scripts | Silent assumptions |

> [!info] The verification habit
> Treat every output as a strong first draft. Facts, links and numbers need checking — this is your job, forever.

## A prompt that gets results

```
You are a senior [role]. Here is my context: [paste relevant info].
Task: [one clear deliverable]. Constraints: [length, tone, audience].
Give me: [exact format, e.g. bullet list + one-paragraph summary].
```

> [!tip] Iterate, don't retype
> The first answer is a draft. Reply "Make it shorter, more direct, for beginners" — steering beats regenerating.

```quiz
Q: What should you do with a citation a model just invented?
A. Use it anyway
B. Verify it before including it
C. Hide the source
D. Ask it to apologise
Correct: B
Explain: Models can invent plausible references. Verification is mandatory for anything factual.
```

## Suggestions and Tips

- Practise one workflow: paste a messy brief, ask for a structured plan, refine twice.
- Ask for the model's reasoning when the answer surprises you — then judge the logic.
- Know your data policy: never paste personal or company-confidential text into consumer tools.
$md$, 7, 8);

-- 4233 Python
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004233', (select id from public.courses where slug = 'python-for-everyone'), '00000000-0000-4000-8000-000000000041', 'Python + AI Tooling in 2026', 'The language behind the AI boom — and how beginners ride it.', $md$
## First Understanding

- Python powers AI/ML libraries, data pipelines, automation and scripting — its job market keeps growing.
- The beginner-friendly path: Python fundamentals → automation scripts → data with pandas → AI APIs.
- You don't need to build models to benefit: calling AI APIs from Python is 15 lines.

## The realistic ladder

```python
# 1. Automate a boring task (files, emails, renames)
# 2. Data wrangling with pandas
# 3. Calling an AI API:

import requests

response = requests.post(
    "https://api.example.com/v1/chat",
    json={"prompt": "Summarise this paragraph for me", "max_tokens": 100},
    headers={"Authorization": "Bearer YOUR_KEY"},
    timeout=30,
)
print(response.json()["text"])
```

> [!info] API-first AI
> Most teams integrate AI by calling hosted APIs, not training models. That's Python + requests — achievable at beginner level with the right course.

## What employers ask in 2026

- Scripting and automation (files, scheduling, web scraping basics)
- Data handling: pandas, CSV/Excel, basic visualisation
- Comfort with AI APIs and prompt-driven features
- Testing and clean code habits (the boring wins)

> [!warning] Don't start with frameworks
> FastAPI/Django before fundamentals = confusion. Master plain Python, then add one web framework if you need one.

> [!tip] A fun first project
> Build a script that reads a folder of files and renames them by a rule. Ten lines, instant satisfaction, real job skill.

```quiz
Q: Which is the best first Python project for a beginner in 2026?
A. A machine-learning model from scratch
B. An automation script for a real boring task
C. A compiler
D. A blockchain
Correct: B
Explain: Automating a real task teaches fundamentals and delivers value — the best motivator known.
```

## Suggestions and Tips

- Pair your course with small scripts you actually need — motivation compounds.
- Learn `pip install` and virtual environments early; every project needs them.
- Read AI-generated code critically: Python's flexibility makes sloppy code easy.
$md$, 7, 8);

-- 4234 Google Workspace
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004234', (select id from public.courses where slug = 'google-workspace-pro'), '00000000-0000-4000-8000-000000000042', 'Gemini in Workspace: AI at Your Desk', 'Summaries, drafts and automation are built into the apps you already use.', $md$
## First Understanding

- Gemini now lives inside Gmail, Docs, Sheets, Drive and Meet — no separate tool needed.
- Core moves: "Help me write", "Summarise this thread", "Draft reply", "Make a formula".
- The skill is directing it precisely (tone, length, format) and checking the output.

## Everyday AI moves

```
Gmail:  "Summarise this email thread in 3 bullet points."
Docs:   "Help me write a one-page project brief for a client."
Sheets: "Create a formula that totals column B if column A is 'done'."
Meet:   "Take notes and list action items."  (after recording)
```

> [!info] Where it shines
> Long threads, repetitive formatting, meeting notes and first drafts are the sweet spot. Precision work — final numbers, legal language — stays human.

> [!warning] Watch the data
> Workspace AI is only as safe as your domain settings. Don't paste secrets or customer data into AI features without checking policy.

> [!tip] One skill to practise
> Use "Help me write" with a target tone and length for one email a day. In a week, the drafts become genuinely useful.

```diagram
  you ask in plain language
       |
       v
  Gemini reads your doc/thread/meeting context
       |
       v
  draft / summary / formula returned
       |
       v
  YOU review, fix, approve  (the actual job)
```

```quiz
Q: What is the user's job after Gemini drafts something in Workspace?
A. Approve without reading
B. Review, correct and refine
C. Rewrite from scratch always
D. Delete the draft
Correct: B
Explain: AI produces first drafts; humans own accuracy and final judgment.
```

## Suggestions and Tips

- Try "make it more formal" / "make it friendlier" on the same draft — learn how it steers.
- Gemini in Sheets explains formulas too: ask "what does this formula do?"
- Keep key shortcuts: type "@" in Docs and Sheets to summon the AI chip menu.
$md$, 7, 8);

-- 4235 Excel & Sheets
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004235', (select id from public.courses where slug = 'excel-sheets-mastery'), '00000000-0000-4000-8000-000000000043', 'AI in Spreadsheets: Formula Help & Copilot', 'Describe what you want in English — get a formula, a pivot, or an insight.', $md$
## First Understanding

- Copilot (Excel) and Gemini (Sheets) now turn plain English into formulas, pivots and charts.
- The real skill remains understanding the result: what the formula does, and whether it's right.
- AI also explains existing formulas and suggests data patterns — a learning accelerator.

## The English-to-formula workflow

```
"Total sales for March where region = West"
"Flag rows where revenue dropped more than 20% vs last month"
"Show average order value by product category"
```

> [!info] It's still your data
> The AI reads your workbook and writes the calculation. Data errors, missing values and logic mistakes stay yours to catch — verify with spot checks.

## Read formulas, don't memorise

```
=SUMIFS(Total, Region, "West", Month, "March")
=IF(B2/C2 < 0.8, "FLAG", "OK")
=AVERAGEIFS(OrderValue, Category, A2)
```

> [!tip] Ask "explain this"
> Select any scary formula and ask the AI to explain it in plain English. You'll absorb Excel's vocabulary three times faster.

> [!warning] Check the edge cases
> AI formulas can silently assume your data starts at row 2 or that cells are numbers. A quick sum-check catches it.

```quiz
Q: After AI generates a formula, what should you do first?
A. Trust it — AI is accurate
B. Verify it against a known result
C. Hide it in a helper column
D. Rewrite it manually
Correct: B
Explain: Spot-check against a value you computed by hand; AI can misread headers or ranges.
```

## Suggestions and Tips

- Practise describing a problem in English before reaching for a function — the skill carries over.
- Learn what the generated formula means: each new function learned = permanent skill.
- Use AI to clean messy data (duplicates, inconsistent casing) before analysis.
$md$, 7, 8);

-- 4236 Power BI
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004236', (select id from public.courses where slug = 'power-bi-visuals'), '00000000-0000-4000-8000-000000000044', 'Power BI & AI: Auto Insights', 'Copilot-generated dashboards and "explain the trend" questions.', $md$
## First Understanding

- Power BI now includes Copilot: describe a dashboard, ask questions in natural language, get insight explanations.
- "Why is sales down?" returns a narrative with contributing factors — huge for analysis speed.
- The analyst's craft — data quality, KPI choice, story structure — is exactly what AI can't replace.

## AI moves in Power BI

```
"Create a dashboard showing revenue, margin and new customers by quarter."
"Explain the drop in Q3 revenue."           -> narrative + drivers
"Show me the top 5 products by growth."     -> visual, one click
"Summarise this report for a CFO."          -> narrative summary
```

> [!info] Natural-language questions
> The Q&A feature turns typed questions into visuals: "bar chart of orders by month, filtered to India". Think in verbs and fields.

> [!warning] Narrative ≠ proof
> Copilot's explanations are hypotheses from your data. Verify the driver claims with the underlying table before presenting them.

> [!tip] The 5-minute demo skill
> Practise: load sample data → ask for a dashboard → refine with "make it cleaner, add a trend line". It's a portable demo for interviews.

```diagram
  data model (cleaned, shaped)
        |
        v
  ask in English: "why did X fall?"
        |
        v
  Copilot: narrative + candidate drivers
        |
        v
  YOU verify against raw tables -> publish story
```

```quiz
Q: When Copilot explains why sales fell, what must the analyst still do?
A. Nothing — trust it
B. Verify drivers against the raw data
C. Delete the explanation
D. Rebuild the data model
Correct: B
Explain: AI narratives are hypotheses; verification against source data is the analyst's core job.
```

## Suggestions and Tips

- Keep your data model clean (types, relationships) — AI insight quality depends on it.
- Use "explain" features on dashboards you already understand, to learn what the AI notices.
- Practise writing the question with and without filters — precision in questions = precision in answers.
$md$, 7, 8);

-- 4237 Java
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004237', (select id from public.courses where slug = 'java-fundamentals'), '00000000-0000-4000-8000-000000000045', 'Java in 2026: LTS, AI & Jobs', 'Where Java stands today and how newcomers fit in.', $md$
## First Understanding

- Java remains a top-tier enterprise language: banking, e-commerce, cloud backends run on it.
- The LTS cadence (21, 25, 29…) means stable upgrades — knowing LTS versions matters in interviews.
- AI-assisted Java dev is normal now; the demand for solid fundamentals is higher than ever.

## What's current

| Area | 2026 state |
|---|---|
| Versions | LTS 21/25 widely deployed; virtual threads (21+) reduce concurrency pain |
| Frameworks | Spring Boot 4.x dominates services |
| AI tooling | Copilot-style completions + AI review in IntelliJ/VS Code |
| Jobs | Backend engineer roles remain plentiful; Java + cloud + SQL is the core stack |

> [!info] Virtual threads
> Java 21+ virtual threads make high-concurrency servers far simpler — a genuinely new era for the platform.

## The newcomer's path

1. Solid syntax and OOP (classes, interfaces, generics) — never skip.
2. Build small real things: a CLI tool, a REST endpoint with Spring Boot.
3. Learn testing (JUnit) early — enterprise codebases live on tests.
4. Use AI as a tutor: paste an error, ask "why" — then write the fix yourself.

> [!warning] Don't chase frameworks early
> Spring Boot before classes and collections = impostor mode. The basics are the interview filter.

> [!tip] Read the stack traces
> Java error messages are famously detailed. Learning to read them is the #1 skill AI can't give you automatically — actually, let AI explain it, then find the fix yourself.

```quiz
Q: Which Java skill matters most for a first backend job?
A. Memorising Spring annotations
B. Solid OOP and language fundamentals
C. Knowing every JVM flag
D. Writing code without testing
Correct: B
Explain: Interviews filter on fundamentals; frameworks are learned quickly with solid basics.
```

## Suggestions and Tips

- Install an LTS JDK (21 or 25) and IntelliJ — the default professional setup.
- Practise one pattern: build a small CRUD app with tests, then extend it with AI help.
- Read one Stack Overflow answer a day about exceptions — the craft shows in interviews.
$md$, 7, 8);

-- 4238 Word & PowerPoint
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004238', (select id from public.courses where slug = 'word-powerpoint-pro'), '00000000-0000-4000-8000-000000000046', 'Word & PPT with Copilot: AI Documents', 'Draft, design and summarise with AI — then add the human polish.', $md$
## First Understanding

- Microsoft 365 Copilot drafts documents, decks and emails from a prompt — with your content in mind.
- PowerPoint Copilot can generate a whole deck from a Word doc or a one-line brief.
- The premium skill: directing the AI and editing its output into something that sounds like you.

## Document moves

```
Word:  "Draft a one-page proposal for a website redesign, professional tone."
       "Summarise this report into 3 key takeaways."
PowerPoint: "Create a 10-slide deck from the attached Word doc, clean style."
       "Add a comparison slide for option A vs B."
```

> [!info] It reads your context
> Copilot references your document, meeting notes and email — that's why results are better than generic chat. It's also why you should review: context can be stale.

> [!warning] Design language
> AI slides default to generic. Apply your brand theme (colours, fonts) from the design tab afterwards — that's the polish that separates decks.

> [!tip] The two-pass edit
> First pass: cut AI filler. Second pass: add your specifics (names, numbers, opinions). Result: fast + authentically yours.

```quiz
Q: What makes Copilot's document results better than generic chat prompts?
A. It writes faster
B. It references your own files and context
C. It never makes mistakes
D. It checks grammar perfectly
Correct: B
Explain: Copilot grounds answers in your documents, meetings and mail — context beats generic knowledge.
```

## Suggestions and Tips

- Give every deck a prompt with audience, length and one goal — specificity pays off.
- Use "Rewrite" on your own paragraphs for tone options; steal the best phrasing.
- Always check speaker notes: AI fills them with useful cues you can refine.
$md$, 7, 8);

-- 4239 Figma
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004239', (select id from public.courses where slug = 'figma-ui-bootcamp'), '00000000-0000-4000-8000-000000000047', 'Figma AI: Design at Machine Speed', 'First draft to polished screens with AI — and why craft still wins.', $md$
## First Understanding

- Figma's AI features turn prompts and screenshots into editable designs and components.
- The workflow: AI produces the first draft, you refine with real craft (spacing, hierarchy, tokens).
- Portfolio expectations moved up: recruiters want polished, systematic design, not just concepts.

## AI workflows

```
"Generate a landing page for a meditation app"   -> editable frames
Paste a screenshot -> "Rebuild this as a component set"
"Make a mobile variant of this desktop screen"
"Clean up the layers / auto-layout this group"
```

> [!info] Editable output
> The point of Figma AI (vs image generators) is that results are real design files — layers, text, styles you can restructure.

> [!warning] Design systems still rule
> AI drafts won't use your tokens, spacing scale or accessibility contrast. Re-apply the system — that's the professional value-add.

> [!tip] The 15-minute portfolio exercise
> Take any app you love → screenshot → rebuild it in Figma with AI help → refine to a component library. Instant portfolio upgrade.

```diagram
  prompt / screenshot
       |
       v
  Figma AI -> editable frames + components
       |
       v
  YOUR craft: tokens, spacing, hierarchy, a11y
       |
       v
  polished, systematic design
```

```quiz
Q: What separates a senior designer's AI workflow from a beginner's?
A. Better prompts only
B. Re-applying craft: systems, tokens and accessibility
C. Faster clicking
D. Using more plugins
Correct: B
Explain: AI speeds the draft; the design system and polish remain human craft.
```

## Suggestions and Tips

- Always ask for editable frames, not images — the file is the deliverable.
- Rebuild 2–3 real products with AI help to learn what the tool does well.
- Keep a checklist: spacing scale, type scale, contrast, states — apply it to every AI draft.
$md$, 7, 8);

-- 4240 Template Mastery
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004240', (select id from public.courses where slug = 'template-mastery'), '00000000-0000-4000-8000-000000000048', 'AI Site Builders vs Templates', 'When to use a template, when to let AI build, and when to hand-code.', $md$
## First Understanding

- AI site builders (prompt → full site) are real and fast; templates give you design control.
- Decision framework: speed vs control vs cost — each tool wins in different situations.
- The 2026 advantage: knowing all three, and when to mix them (AI draft → template polish).

## The decision grid

| Goal | Best tool | Why |
|---|---|---|
| Landing page today | AI builder | Instant, zero setup |
| Branded business site | Template + customisation | Design quality + control |
| Portfolio / blog | Template | Focus on content |
| Web app / custom logic | Hand-coded | Full flexibility |
| Internal tool | AI builder or code | Speed wins |

> [!info] The hybrid workflow
> Draft with AI, restructure inside a template's editor, hand-code the touches the tools can't do. Pros mix all three in one project.

> [!warning] The lock-in check
> AI builders can make exporting painful. Before committing, confirm you can export code or content — your site should never be a hostage.

> [!tip] Reuse your Template Mastery skills
> Everything you learned editing templates — sections, themes, responsiveness, publishing — applies unchanged to AI-generated sites.

```quiz
Q: When is an AI site builder the right choice?
A. When you need full backend logic
B. When speed beats custom requirements
C. When you need strict brand control
D. When the site has 50 pages
Correct: B
Explain: AI builders win on speed for simple sites; control and complexity favour templates or code.
```

## Suggestions and Tips

- Build the same small site three ways (AI builder, template, hand-coded) once — then you'll know each tool's true ceiling.
- Keep a folder of strong template sections to mix into AI outputs.
- Your next project: pick the tool from the grid, then explain why — that's the 2026 planning skill.
$md$, 13, 10);
