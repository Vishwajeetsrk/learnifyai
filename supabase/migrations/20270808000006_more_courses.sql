-- 11 new rich courses with modules, lessons, quizzes, resources and assignments.
-- Idempotent: safe to re-run.

insert into public.courses (id, slug, title, description, cover_url, category, level, price_inr, instructor, duration_minutes, published, created_by, certificate_template_id, enrollment_count, requirements, outcomes, target_audience, language, certificate_enabled, completion_threshold, settings)
select * from (values

('00000000-0000-4000-8000-000000002001'::uuid, 'html-css-essentials', 'HTML & CSS Essentials', 'Build real web pages from scratch. Learn the exact HTML tags and CSS techniques used in modern production sites — with live coding, downloadable cheat sheets, and a certificate.', '/course-logos/html.svg', 'Web Dev', 'Beginner', 0, 'Vishwajeet', 210, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['A computer with any browser (Chrome recommended)', 'No coding experience needed', 'VS Code (free) — optional but recommended']::text[], ARRAY['Write semantic HTML for real pages', 'Style with modern CSS: Flexbox, Grid, animations', 'Build responsive mobile-first layouts', 'Ship a personal portfolio page']::text[], 'Absolute beginners who want to build websites. No prior code required.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002002'::uuid, 'javascript-zero-to-pro', 'JavaScript Zero to Pro', 'JavaScript is the brain of the web. Learn variables, functions, DOM interactivity and async code with live practice — everything a modern front-end role expects.', '/course-logos/js.svg', 'Web Dev', 'Beginner', 0, 'Vishwajeet', 240, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['Basic HTML & CSS (take HTML & CSS Essentials first)', 'Any modern browser', 'VS Code']::text[], ARRAY['Write clean JavaScript with modern syntax', 'Make pages interactive (buttons, forms, menus)', 'Work with arrays, objects and DOM events', 'Fetch data from APIs with async/await']::text[], 'Beginners with basic HTML who want to build interactive web apps.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002003'::uuid, 'python-for-everyone', 'Python for Everyone', 'The friendliest language on Earth — and the #1 skill for AI, data and automation. Learn Python the hands-on way: variables, loops, functions, files and your first real projects.', '/course-logos/python.svg', 'Programming', 'Beginner', 0, 'Vishwajeet', 230, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, 'cef3363b-adb8-47f7-92ac-aa5ef5398b5b'::uuid, 0, ARRAY['No programming experience needed', 'Any computer', 'A browser (we''ll install Python together)']::text[], ARRAY['Write clean Python with modern syntax', 'Automate boring tasks (files, Excel, emails)', 'Build your first CLI projects', 'Understand what makes Python the AI language']::text[], 'Total beginners — students, analysts, or anyone automating daily work.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002004'::uuid, 'java-fundamentals', 'Java Fundamentals', 'Java runs 3 billion devices and pays top salaries. Learn the modern Java way: types, classes, collections, and your first OOP project — no prior coding needed.', '/course-logos/java.svg', 'Programming', 'Beginner', 0, 'Vishwajeet', 235, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['No programming experience needed', 'Any computer (Windows/Mac/Linux)']::text[], ARRAY['Understand Java''s type system and syntax', 'Build classes with OOP: inheritance, encapsulation', 'Use collections: ArrayList, HashMap', 'Compile and run Java like a professional']::text[], 'Beginners wanting a strong, career-grade programming foundation.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002005'::uuid, 'excel-sheets-mastery', 'Excel & Sheets Mastery', 'Excel is still the world''s most-used business tool. Master formulas, tables, pivot tables and dashboards the same way finance and data analysts use them daily.', '/course-logos/excel.svg', 'Productivity', 'Beginner', 0, 'Vishwajeet', 215, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['Microsoft Excel 2019+ or Google Sheets (free)', 'A computer']::text[], ARRAY['Write formulas that save hours of manual work', 'Build pivot tables and charts like an analyst', 'Clean messy data in minutes', 'Automate repeat tasks']::text[], 'Students, working professionals, and anyone who wants data skills for any job.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002006'::uuid, 'word-powerpoint-pro', 'Word & PowerPoint Pro', 'Documents and decks that get you hired and promoted. Learn professional formatting, design rules and AI-powered features in Word and PowerPoint.', '/course-logos/word.svg', 'Productivity', 'Beginner', 0, 'Vishwajeet', 200, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['Microsoft 365 (Word + PowerPoint) — or free web versions']::text[], ARRAY['Format professional reports with styles and TOC', 'Design slides people actually remember', 'Use AI features: Designer, Copilot, dictation', 'Collaborate in real time']::text[], 'Students, job seekers, and professionals creating reports and presentations.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002007'::uuid, 'power-bi-visuals', 'Power BI Data Visualization', 'Turn raw data into executive-ready dashboards. Learn the full Power BI pipeline — data, model, DAX, and visuals — the way professional BI analysts work.', '/course-logos/powerbi.svg', 'Data & Analytics', 'Intermediate', 0, 'Vishwajeet', 240, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['Power BI Desktop (free) installed', 'Basic Excel knowledge (SUM/AVERAGE)', 'A business curiosity for data']::text[], ARRAY['Import and clean data with Power Query', 'Model relationships like a data analyst', 'Write core DAX measures', 'Build and publish a dashboard']::text[], 'Analysts, students and professionals who want dashboard skills that pay.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002008'::uuid, 'figma-ui-bootcamp', 'Figma UI Bootcamp', 'Design real app screens in Figma — the tool used by Google, Airbnb and most product teams. Learn Auto Layout, components, design systems, and developer handoff.', '/course-logos/figma.svg', 'Design', 'Beginner', 0, 'Vishwajeet', 220, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, '2305f446-f4a3-4e07-bcba-67a0833bac2e'::uuid, 0, ARRAY['Figma (free account, browser-based)', 'No design experience needed']::text[], ARRAY['Navigate Figma like a designer', 'Build responsive UI with Auto Layout', 'Create components and design systems', 'Hand off designs to developers with specs']::text[], 'Developers, students, and product people who want design superpowers.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002009'::uuid, 'vs-code-git-essentials', 'VS Code + Git Essentials', 'The toolbelt every developer uses daily. Master VS Code workflows, shortcuts, extensions, and Git for version control — the skills interviewers quietly expect.', '/course-logos/vscode.svg', 'Developer Tools', 'Beginner', 0, 'Vishwajeet', 190, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['Install VS Code (free)', 'Git (free) — we''ll set it up together', 'A GitHub account']::text[], ARRAY['Navigate and edit code like a professional', 'Automate with multi-cursor, Emmet, snippets', 'Version your work with Git and GitHub', 'Fix mistakes with undo/reset without panic']::text[], 'New developers and students who want the daily pro workflow.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002010'::uuid, 'chatgpt-claude-ai', 'ChatGPT & Claude AI Productivity', 'Use AI to work 10x faster — responsibly. Learn prompt engineering, Claude Projects, ChatGPT custom instructions, and AI study/automation workflows for students and pros.', '/course-logos/ai.svg', 'AI & Productivity', 'Beginner', 0, 'Vishwajeet', 210, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, '7b82fa49-84ac-4822-9cf3-de513f52c855'::uuid, 0, ARRAY['A ChatGPT or Claude account (free tier works)', 'Curiosity']::text[], ARRAY['Write prompts that get expert-quality answers', 'Use Claude Projects & ChatGPT custom instructions', 'Turn AI into a tutor, reviewer and automator', 'Spot AI mistakes and protect your data']::text[], 'Students, professionals and creators — anyone working with text or code.', 'en', true, 100, '{}'::jsonb),
('00000000-0000-4000-8000-000000002011'::uuid, 'google-workspace-pro', 'Google Workspace Pro', 'Gmail, Docs, Sheets, Slides, Drive, Calendar and Meet — used by millions of companies daily. Learn the workflows that make you the person who ''just gets things done''.', '/course-logos/google.svg', 'Productivity', 'Beginner', 0, 'Vishwajeet', 200, true, 'aa073db3-bce9-47cd-a490-40a6894a9edf'::uuid, null, 0, ARRAY['A free Google account', 'Any computer or phone']::text[], ARRAY['Run Gmail like an executive with labels & filters', 'Write Docs with @-mentions and voice typing', 'Automate Sheets with formulas & scripts', 'Coordinate teams with Calendar + Meet']::text[], 'Students, freelancers, and professionals in Google-powered workplaces.', 'en', true, 100, '{}'::jsonb)

) as v(id, slug, title, description, cover_url, category, level, price_inr, instructor, duration_minutes, published, created_by, certificate_template_id, enrollment_count, requirements, outcomes, target_audience, language, certificate_enabled, completion_threshold, settings)
on conflict (slug) do nothing;


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003031', '00000000-0000-4000-8000-000000002001', 'HTML Foundations', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003031');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004041', '00000000-0000-4000-8000-000000002001', '00000000-0000-4000-8000-000000003031', 'How a Web Page Is Built', null, $md$Every page you see starts as plain text. Browsers read that text and paint it as a page.

## The three layers

| Layer | Language | Job |
| ----- | -------- | --- |
| Structure | HTML | Headings, paragraphs, images, links |
| Style | CSS | Colors, spacing, fonts, layout |
| Behavior | JavaScript | Clicks, forms, dynamic content |

```diagram
  HTML text  ──►  Browser engine  ──►  Rendered page
      │              │                      │
      │              └── reads CSS ──────────┘
      └── reads JS → reacts to your clicks
```

> [!tip] You will NOT memorize everything. You will learn where things live and how to look things up — that is what professionals actually do.$md$, 1, 12, true, true, 'markdown', ARRAY['html-css-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004041');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004042', '00000000-0000-4000-8000-000000002001', '00000000-0000-4000-8000-000000003031', 'Your First HTML Page', null, $md$Open VS Code, create a file called `index.html`, and type this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, I'm building with HTML!</h1>
  <p>This is a paragraph of text.</p>
</body>
</html>
```

Save and open it in your browser. You just built a web page.

## The anatomy of a tag

```diagram
  <p class="intro">Hello</p>
  |_|  |____|      |_____|  |__|
  tag  attribute   text     closing tag
```

## The tags you will use every day

| Tag | Purpose |
| --- | ------- |
| `<h1>`–`<h6>` | Headings (1 is most important) |
| `<p>` | Paragraph |
| `<a href>` | Link |
| `<img src>` | Image |
| `<ul>`, `<ol>`, `<li>` | Lists |
| `<div>`, `<span>` | Layout containers |

> [!warning] Save the file before refreshing the browser. Half of all "nothing changed" moments are unsaved files.$md$, 2, 15, true, true, 'markdown', ARRAY['html-css-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004042');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004043', '00000000-0000-4000-8000-000000002001', '00000000-0000-4000-8000-000000003031', 'Semantic HTML & Best Practices', null, $md$Wrap content in tags that SAY what it is — this is called semantic HTML, and Google loves it.

```html
<header>     <!-- site nav + logo -->
<nav>        <!-- menu links -->
<main>       <!-- the main content -->
<section>    <!-- a themed block -->
<article>    <!-- a self-contained story -->
<aside>      <!-- sidebar / related info -->
<footer>     <!-- bottom of the page -->
```

```diagram
┌──────────────────────────────┐
│ header                       │
├──────────────────────────────┤
│ nav   │ main       │ aside   │
├──────────────────────────────┤
│ footer                       │
└──────────────────────────────┘
```

## 3 rules for production HTML
1. One `<h1>` per page (your page's title)
2. Every image needs `alt` text (accessibility + SEO)
3. Use `main`, `header`, `footer` instead of bare `div`s

> [!tip] Chrome DevTools (right-click → Inspect) lets you edit HTML live in the browser — great for experimenting without breaking files.$md$, 3, 13, false, false, 'markdown', ARRAY['html-css-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004043');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003032', '00000000-0000-4000-8000-000000002001', 'CSS: Make It Beautiful', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003032');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004044', '00000000-0000-4000-8000-000000002001', '00000000-0000-4000-8000-000000003032', 'Styling with CSS', null, $md$CSS = paint. Select elements, apply properties.

```css
body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}
h1 { color: #818cf8; }
.card { background: #1e293b; padding: 1rem; border-radius: 12px; }
```

## Selectors
```css
p { }          /* all paragraphs */
.card { }      /* class */
#hero { }      /* id — use sparingly */
nav a { }      /* descendant */
```

## The Box Model — the most important idea

```diagram
        margin
      ┌─────────────┐
      │  border     │
      │  ┌────────┐ │
      │  │padding │ │
      │  │  content│ │
      │  └────────┘ │
      └─────────────┘
```

> [!tip] Everything on the web is a box. Master the box model and you master layout.$md$, 4, 14, true, true, 'markdown', ARRAY['html-css-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004044');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004045', '00000000-0000-4000-8000-000000002001', '00000000-0000-4000-8000-000000003032', 'Flexbox & Grid — Modern Layouts', null, $md$Two tools handle 95% of modern layouts.

## Flexbox — one row/column of items
```css
.nav { display: flex; justify-content: space-between; align-items: center; }
```

```diagram
  justify-content: space-between
  [Logo]          [Link1] [Link2] [Link3]
```

## Grid — 2D layouts
```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

That one line makes a responsive card grid that works on phones AND desktops.

## When to use which
| Layout | Tool |
| ------ | ---- |
| Navbar, buttons, rows | Flexbox |
| Card grids, page layouts | Grid |
| Centering one element | Flexbox |$md$, 5, 16, false, false, 'markdown', ARRAY['html-css-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004045');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004046', '00000000-0000-4000-8000-000000002001', '00000000-0000-4000-8000-000000003032', 'Colors, Fonts & Finishing Touches', null, $md$Make pages feel premium with three pro moves:

## 1. The 60-30-10 color rule
| Share | Where | Example |
| ----- | ----- | ------- |
| 60% | Background | `#f8fafc` |
| 30% | Cards, sidebar | `#e2e8f0` |
| 10% | Buttons, accents | `#6366f1` |

## 2. Typography that scales
```css
html { font-size: 16px; }
h1 { font-size: 2.5rem; }
p  { font-size: 1rem; }
```

Use `rem` so everything scales when the user changes browser zoom.

## 3. Micro-animations
```css
button { transition: transform 0.15s ease; }
button:hover { transform: translateY(-2px); }
```

> [!tip] Use system font stacks (`system-ui`) first. Custom fonts only when your design demands it — speed matters.$md$, 6, 12, false, false, 'markdown', ARRAY['html-css-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004046');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003033', '00000000-0000-4000-8000-000000002002', 'JavaScript Core', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003033');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004047', '00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000003033', 'What JavaScript Actually Is', null, $md$JavaScript is the only language browsers understand natively. It runs on every phone, laptop and server on Earth.

```diagram
  HTML = structure      CSS = style      JS = behavior
  ┌────────────┐    ┌────────────┐   ┌─────────────────┐
  │ the skeleton │    │ the clothes │   │ the muscles     │
  └────────────┘    └────────────┘   └─────────────────┘
```

## Your first script

```html
<button id="like">Like</button>
<script>
  document.getElementById("like").addEventListener("click", () => {
    alert("You liked this! 🎉");
  });
</script>
```

## Where JavaScript runs
| Environment | Example |
| ----------- | ------- |
| Browser | Web pages, extensions |
| Node.js | Servers, CLIs, scripts |
| Deno / Bun | Modern alternatives to Node |

> [!tip] Open DevTools → Console and type `2 + 2` — your first live JavaScript run.$md$, 1, 12, true, true, 'markdown', ARRAY['javascript-zero-to-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004047');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004048', '00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000003033', 'Variables, Types & Operators', null, $md$Variables are named boxes that hold values.

```js
let score = 0;          // can change later
const player = "Vish";  // cannot change
score = 5;              // ✅ works
player = "Alex";        // ❌ error — const is fixed
```

## Data types you will use daily

| Type | Example | Notes |
| ---- | ------- | ----- |
| string | "hello" | text |
| number | 42 / 3.14 | math |
| boolean | true / false | conditions |
| array | [1, 2, 3] | list |
| object | { name: "Vish" } | key-value |

## Operators

```js
let total = (4 + 5) * 2;   // 18
let passed = total >= 10;  // true
let msg = "Score: " + total;  // string + number → string
```

> [!warning] Use `===` for comparisons, not `==`. `==` does weird type conversions that cause bugs.$md$, 2, 14, true, true, 'markdown', ARRAY['javascript-zero-to-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004048');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004049', '00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000003033', 'Functions & Arrow Functions', null, $md$Functions are reusable blocks of code.

```js
// classic function
function greet(name) {
  return "Hello, " + name + "!";
}

// arrow function (modern, used everywhere)
const greet = (name) => "Hello, " + name + "!";

console.log(greet("Vishwajeet"));
```

## Why arrows everywhere?
- Shorter syntax
- Used heavily in React, Vue, Node
- `() =>` — no params, implicit return when one line

## Exercise
Write a function `calcTotal(items, discountPercent)` that sums an array of prices and applies a discount.

```js
const calcTotal = (items, discount) => {
  const sum = items.reduce((a, b) => a + b, 0);
  return sum * (1 - discount / 100);
};
console.log(calcTotal([100, 200, 50], 10)); // 315
```$md$, 3, 15, false, false, 'markdown', ARRAY['javascript-zero-to-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004049');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003034', '00000000-0000-4000-8000-000000002002', 'Making Pages Interactive', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003034');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004050', '00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000003034', 'The DOM — Talking to the Page', null, $md$The DOM is JavaScript's view of your HTML. With it you can find elements, change them, and listen for clicks.

```js
const btn = document.querySelector("#signup");
btn.textContent = "Joined ✓";
btn.style.background = "#10b981";
```

## Selecting elements
```js
document.querySelector(".card");   // first match
document.querySelectorAll(".card"); // all matches → list
document.getElementById("hero");
```

## Events — the heart of interactivity
```js
btn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Button clicked!", e.target);
});
```

```diagram
  User clicks button
        │
        ▼
  event fires → handler runs → page updates
        ▲
        └───── another event can fire again
```

> [!tip] `e.preventDefault()` stops default behavior — essential for forms so the page doesn't reload.$md$, 4, 15, false, false, 'markdown', ARRAY['javascript-zero-to-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004050');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004051', '00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000003034', 'Arrays & Objects in Real Life', null, $md$Real apps are lists of things: posts, products, messages. Arrays + objects model all of it.

```js
const students = [
  { name: "Vish", xp: 1240 },
  { name: "Nisha", xp: 980 },
];

const totalXP = students.reduce((sum, s) => sum + s.xp, 0);

const top = students.filter(s => s.xp > 1000);
const names = students.map(s => s.name.toUpperCase());
```

## The big three

| Method | Returns | Example use |
| ------ | ------- | ----------- |
| `.map()` | new array | transform every item |
| `.filter()` | new array | keep matching items |
| `.reduce()` | single value | total, max, average |

> [!tip] 80% of front-end interviews test these three methods. Master them.$md$, 5, 13, false, false, 'markdown', ARRAY['javascript-zero-to-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004051');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004052', '00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000003034', 'Async, Fetch & Real APIs', null, $md$Loading data from a server takes time. `async/await` makes that readable.

```js
async function loadPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();
  document.querySelector("#list").innerHTML =
    posts.slice(0, 5).map(p => `<li>${p.title}</li>`).join("");
}
loadPosts();
```

## The async mental model

```diagram
  async function
  ┌────────────────────────────────┐
  │ fetch() ── wait ──► response   │
  │           (await)              │
  │ res.json() ── wait ──► data    │
  └────────────────────────────────┘
  Nothing blocks: the page stays interactive meanwhile.
```

> [!tip] Practice with free APIs: jsonplaceholder.typicode.com, api.chucknorris.io, open-meteo.com (weather).$md$, 6, 16, false, false, 'markdown', ARRAY['javascript-zero-to-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004052');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003035', '00000000-0000-4000-8000-000000002003', 'Python Foundations', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003035');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004053', '00000000-0000-4000-8000-000000002003', '00000000-0000-4000-8000-000000003035', 'Why Python Rules the World', null, $md$Python powers YouTube, Instagram, Spotify, and most of AI. Why?

## What Python is great at

| Domain | Why Python |
| ------ | ---------- |
| AI & ML | TensorFlow, PyTorch, OpenAI SDK |
| Data | Pandas, Excel automation |
| Web | Django, FastAPI |
| Scripting | 10x faster than doing it by hand |

```diagram
  Python code
      │
      ▼
  Interpreter ──► Your computer does the work
      │
      └── 400,000+ libraries: pip install anything
```

## Install (5 minutes)
1. Download from python.org (check "Add to PATH")
2. Open terminal: `python --version`
3. You're ready.

> [!tip] Write code in VS Code with the official Python extension — autocomplete + run button included.$md$, 1, 12, true, true, 'markdown', ARRAY['python-for-everyone']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004053');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004054', '00000000-0000-4000-8000-000000002003', '00000000-0000-4000-8000-000000003035', 'Variables, Types & f-Strings', null, $md$Python reads like English. That's the whole point.

```python
name = "Vishwajeet"   # string
age = 25              # integer
score = 9.5           # float
active = True         # boolean

print(f"Hi {name}, you are {age} years old.")
```

## f-strings — the best feature
```python
price = 199
print(f"Course price: ₹{price}")  # Course price: ₹199
print(f"Score: {score:.1f}")      # Score: 9.5
```

## Types matter

| Type | Example | Used for |
| ---- | ------- | -------- |
| str | "learn" | text |
| int | 42 | whole numbers |
| float | 3.14 | decimals |
| bool | True | yes/no |
| list | [1,2,3] | ordered items |
| dict | {"a": 1} | key → value |

> [!tip] Python is case-sensitive: `Name` and `name` are different variables.$md$, 2, 14, true, true, 'markdown', ARRAY['python-for-everyone']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004054');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004055', '00000000-0000-4000-8000-000000002003', '00000000-0000-4000-8000-000000003035', 'Lists, Dictionaries & Loops', null, $md$Lists hold ordered items; dictionaries hold key-value pairs.

```python
skills = ["python", "data", "ai"]
skills.append("automation")
print(skills[0])      # python
print(len(skills))    # 4

user = {"name": "Vish", "xp": 1200, "streak": 7}
print(user["name"])        # Vish
user["xp"] += 50           # update

for skill in skills:
    print(f"- {skill}")
```

## Loop patterns

```python
for i in range(5): print(i)        # 0..4
for idx, s in enumerate(skills):   # with index
    print(idx, s)
while x < 10: x += 1
```

> [!tip] List comprehension — write it, then use it forever:
```python
prices = [199, 499, 799]
discounted = [p * 0.9 for p in prices]
```$md$, 3, 15, false, false, 'markdown', ARRAY['python-for-everyone']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004055');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003036', '00000000-0000-4000-8000-000000002003', 'Real Python Projects', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003036');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004056', '00000000-0000-4000-8000-000000002003', '00000000-0000-4000-8000-000000003036', 'Functions, Conditions & Error Handling', null, $md$Split code into small functions — it's the #1 professional habit.

```python
def grade(score):
    if score >= 70:
        return "Pass"
    elif score >= 50:
        return "Retake"
    return "Fail"

print(grade(85))  # Pass
```

## Handling errors like a pro
```python
try:
    num = int(input("Enter a number: "))
except ValueError:
    print("That's not a number!")
else:
    print(f"You entered {num}")
```

## Default arguments
```python
def greet(name="Learner"):
    return f"Hello, {name}!"
```

> [!tip] Name functions as verbs: `calc_total()`, `send_email()`, `load_data()`.$md$, 4, 14, false, false, 'markdown', ARRAY['python-for-everyone']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004056');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004057', '00000000-0000-4000-8000-000000002003', '00000000-0000-4000-8000-000000003036', 'Working with Files & CSV', null, $md$Automation starts here: read a file, transform it, save it.

```python
# read
with open("notes.txt", "r") as f:
    content = f.read()
print(content)

# write
with open("output.txt", "w") as f:
    f.write("Generated by Python!
")

# append
with open("log.txt", "a") as f:
    f.write("new entry
")
```

## CSV — the format of business
```python
import csv

with open("students.csv", newline="") as f:
    rows = list(csv.reader(f))

for row in rows[1:]:   # skip header
    print(row[0], "->", row[2])
```

> [!tip] `with` closes files automatically — never forget a close again.$md$, 5, 13, false, false, 'markdown', ARRAY['python-for-everyone']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004057');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004058', '00000000-0000-4000-8000-000000002003', '00000000-0000-4000-8000-000000003036', 'Your First Project: XP Tracker CLI', null, $md$Build a command-line app that tracks learning XP.

```python
import json

log = {}
try:
    with open("xp.json") as f:
        log = json.load(f)
except FileNotFoundError:
    log = {}

def add_xp(task, points):
    log[task] = log.get(task, 0) + points
    with open("xp.json", "w") as f:
        json.dump(log, f, indent=2)
    print(f"✅ +{points} XP for '{task}' — total {sum(log.values())}")

while True:
    task = input("Task (or 'q'): ")
    if task == "q": break
    pts = int(input("XP: "))
    add_xp(task, pts)
```

Run it, earn XP, and you have built a real, persistent application.

## Next steps
Install `pandas` (`pip install pandas`) and try reading an Excel file — you are now an automation engineer.$md$, 6, 18, false, false, 'markdown', ARRAY['python-for-everyone']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004058');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003037', '00000000-0000-4000-8000-000000002004', 'Java from Zero', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003037');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004059', '00000000-0000-4000-8000-000000002004', '00000000-0000-4000-8000-000000003037', 'Why Java (Still) Pays Well', null, $md$Java powers Android, banking, and the biggest enterprise systems on Earth.

## Where Java lives

| Domain | Famous example |
| ------ | -------------- |
| Android apps | Every Android app uses Java/Kotlin |
| Banking | 80%+ of global banks run Java backends |
| Enterprise | SAP, AWS Lambda, Minecraft |

```diagram
  .java source ──► javac compiler ──► .class bytecode ──► JVM (runs anywhere)
      │                                     │                   │
  write once                          portable code          Windows/Mac/Linux
```

## Setup in 5 minutes
1. Install JDK 21 (Adoptium/Temurin — free)
2. Install VS Code + "Extension Pack for Java"
3. Terminal: `java -version`

> [!tip] The JVM is why Java "runs everywhere" — same bytecode, any OS.$md$, 1, 12, true, true, 'markdown', ARRAY['java-fundamentals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004059');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004060', '00000000-0000-4000-8000-000000002004', '00000000-0000-4000-8000-000000003037', 'Hello World & Data Types', null, $md$Java is strict — you must declare what type everything is.

```java
public class Main {
  public static void main(String[] args) {
    String name = "Vishwajeet";
    int age = 25;
    double score = 9.5;
    boolean active = true;

    System.out.println("Hello, " + name + "!");
    System.out.printf("Age: %d | Score: %.1f%n", age, score);
  }
}
```

## Primitive types

| Type | Size | Example |
| ---- | ---- | ------- |
| int | 32-bit | 42 |
| double | 64-bit | 3.14 |
| boolean | — | true/false |
| char | 16-bit | 'A' |
| long | 64-bit | 9999999999L |

## Run it
```bash
javac Main.java
java Main
```

> [!warning] Java is case-sensitive and every statement ends with a semicolon — the two most common beginner errors.$md$, 2, 14, true, true, 'markdown', ARRAY['java-fundamentals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004060');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004061', '00000000-0000-4000-8000-000000002004', '00000000-0000-4000-8000-000000003037', 'Conditionals, Loops & Arrays', null, $md$Control flow in Java is familiar from other languages.

```java
int score = 85;
if (score >= 70) {
  System.out.println("Pass");
} else {
  System.out.println("Retake");
}

for (int i = 0; i < 5; i++) {
  System.out.println(i);
}

int[] nums = {1, 2, 3};
for (int n : nums) { System.out.println(n); }  // enhanced for
```

## Strings & Arrays
```java
String name = "Learnify AI";
System.out.println(name.length());    // 11
System.out.println(name.toUpperCase());
System.out.println(name.contains("AI")); // true

int[] scores = new int[5];   // fixed-size array
scores[0] = 90;
```

> [!tip] Prefer ArrayList for dynamic lists — arrays are fixed-size and that frustrates beginners.$md$, 3, 14, false, false, 'markdown', ARRAY['java-fundamentals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004061');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003038', '00000000-0000-4000-8000-000000002004', 'Object-Oriented Java', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003038');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004062', '00000000-0000-4000-8000-000000002004', '00000000-0000-4000-8000-000000003038', 'Classes & Objects — OOP in 15 Minutes', null, $md$A class is a blueprint; an object is a real thing built from it.

```java
class Student {
  String name;
  int xp;

  Student(String name, int xp) {   // constructor
    this.name = name;
    this.xp = xp;
  }

  void study() {
    xp += 50;
    System.out.println(name + " studied! XP: " + xp);
  }
}

// usage
Student vish = new Student("Vish", 1000);
vish.study();  // Vish studied! XP: 1050
```

## OOP pillars
| Pillar | Meaning |
| ------ | ------- |
| Encapsulation | private fields + public methods |
| Inheritance | extends a parent class |
| Polymorphism | same method, different behavior |

```diagram
      Animal
      │  eat()
  ┌───┴────┐
 Dog      Cat
  bark()   meow()
```

> [!tip] `this.` refers to the current object — it removes the classic name-shadowing bug.$md$, 4, 15, false, false, 'markdown', ARRAY['java-fundamentals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004062');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004063', '00000000-0000-4000-8000-000000002004', '00000000-0000-4000-8000-000000003038', 'Collections: ArrayList & HashMap', null, $md$Real programs manage lists and lookups — Java collections are your tools.

```java
import java.util.*;

List<String> skills = new ArrayList<>();
skills.add("Java");
skills.add("SQL");
skills.remove("SQL");
System.out.println(skills.size());      // 1
System.out.println(skills.get(0));      // Java

Map<String, Integer> xp = new HashMap<>();
xp.put("Java", 1200);
xp.put("SQL", 900);
System.out.println(xp.get("Java"));     // 1200
xp.containsKey("Java");                 // true

for (Map.Entry<String, Integer> e : xp.entrySet()) {
  System.out.println(e.getKey() + " -> " + e.getValue());
}
```

## List vs Map
| Interface | Use for | Analogy |
| --------- | ------- | ------- |
| List | ordered items | a to-do list |
| Map | key → value | a dictionary |

> [!tip] Always declare the interface type (`List`, `Map`) and pick the implementation (`ArrayList`, `HashMap`) — professional style.$md$, 5, 13, false, false, 'markdown', ARRAY['java-fundamentals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004063');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004064', '00000000-0000-4000-8000-000000002004', '00000000-0000-4000-8000-000000003038', 'Project: Student Manager', null, $md$Build a mini student-management system.

```java
import java.util.*;

class Student {
  String name;
  int xp;
  Student(String n, int x) { name = n; xp = x; }
  public String toString() { return name + " (" + xp + " XP)"; }
}

public class Main {
  public static void main(String[] args) {
    List<Student> students = new ArrayList<>();
    students.add(new Student("Vish", 1200));
    students.add(new Student("Nisha", 900));

    // sort by XP (highest first)
    students.sort((a, b) -> b.xp - a.xp);

    for (Student s : students) {
      System.out.println(s);
    }

    // class average
    double avg = students.stream()
      .mapToInt(s -> s.xp)
      .average().orElse(0);
    System.out.println("Average XP: " + avg);
  }
}
```

Add features: add a student, find by name, delete by name. You now write real OOP Java.$md$, 6, 18, false, false, 'markdown', ARRAY['java-fundamentals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004064');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003039', '00000000-0000-4000-8000-000000002005', 'Formulas & Data', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003039');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004065', '00000000-0000-4000-8000-000000002005', '00000000-0000-4000-8000-000000003039', 'Excel Anatomy in 10 Minutes', null, $md$Learn where everything lives — you'll find your way around any spreadsheet.

## The interface map

```diagram
  ┌──────────────────────────────────────┐
  │ Ribbon: Home / Insert / Formulas ... │
  ├──────────────────────────────────────┤
  │ Name box  │  fx function bar          │
  ├──────┬───────────────────────────────┤
  │      │   A   B   C    D             │
  │  R1  │  Name  Score  Grade           │
  │  R2  │  Vish   85    Pass            │
  │  R3  │  Nisha  92    Pass            │
  ├──────┴───────────────────────────────┤
  │ Sheet tabs:  Sheet1 | Sheet2         │
  └──────────────────────────────────────┘
```

## Cell references
- `A1` — column A, row 1
- `B2:B10` — a range
- `$A$1` — absolute (locked) reference
- `Sheet2!A1` — reference another sheet

> [!tip] Press F4 while editing a reference to cycle through locking options.$md$, 1, 12, true, true, 'markdown', ARRAY['excel-sheets-mastery']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004065');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004066', '00000000-0000-4000-8000-000000002005', '00000000-0000-4000-8000-000000003039', 'The 10 Formulas That Do 90% of Work', null, $md$Master these and you can handle almost any spreadsheet task.

```text
=SUM(A1:A10)            total
=AVERAGE(A1:A10)        mean
=MAX(A1:A10) / =MIN()   highest / lowest
=COUNT(A1:A10)          count numbers
=COUNTA(A1:A10)         count non-empty
=IF(A1>=70,"Pass","Fail")    condition
=VLOOKUP(score, table, col, FALSE)   lookup
=XLOOKUP(...)           modern lookup (365)
=CONCATENATE(A1," ",B1) join text
=TEXT(A1,"0.0%")         format values
```

## Real example — grading
```text
=IF(B2>=90,"A",IF(B2>=70,"B","C"))
```

> [!tip] VLOOKUP is legacy; XLOOKUP (Excel 365 / Google Sheets) is easier and faster.$md$, 2, 16, true, true, 'markdown', ARRAY['excel-sheets-mastery']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004066');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004067', '00000000-0000-4000-8000-000000002005', '00000000-0000-4000-8000-000000003039', 'Cleaning Messy Data', null, $md$Real data is messy. Professionals clean it before analyzing.

## The cleanup toolkit
| Task | Tool |
| ---- | ---- |
| Remove duplicates | Data → Remove Duplicates |
| Split one column into two | Data → Text to Columns |
| Fix extra spaces | =TRIM(A1) |
| Fix capitalization | =PROPER(A1) / =UPPER(A1) |
| Find blanks | Go To Special → Blanks |
| Highlight problems | Conditional Formatting |

## Conditional Formatting magic
1. Select the data range
2. Home → Conditional Formatting → Color Scales
3. Instant heatmap — top values glow.

> [!tip] Make a copy of raw data before cleaning (sheet named "RAW"). Analysts never destroy source data.$md$, 3, 13, false, false, 'markdown', ARRAY['excel-sheets-mastery']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004067');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003040', '00000000-0000-4000-8000-000000002005', 'Analysis & Dashboards', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003040');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004068', '00000000-0000-4000-8000-000000002005', '00000000-0000-4000-8000-000000003040', 'Pivot Tables — the Superpower', null, $md$Summarize thousands of rows in 30 seconds.

## 5 steps
1. Select your data → Insert → PivotTable
2. Drag a field to Rows (e.g. Category)
3. Drag a numeric field to Values (e.g. Sales → Sum)
4. Add Filters for slicing
5. Right-click → Refresh after data changes

```diagram
  RAW DATA (5000 rows)            PIVOT
  Product  Region  Sales     Region │ Sum of Sales
  Phone    North   1200     North   │ 4500
  Laptop   South   900      South   │ 6100
  ...                              └──────────────
```

## When to use pivots
| Question | Pivot answer |
| -------- | ------------ |
| Sales by region? | Row = Region, Value = Sum |
| Count of customers by plan? | Row = Plan, Value = Count |

> [!tip] Pivot data must be a flat table: one header row, no blank columns.$md$, 4, 14, false, false, 'markdown', ARRAY['excel-sheets-mastery']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004068');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004069', '00000000-0000-4000-8000-000000002005', '00000000-0000-4000-8000-000000003040', 'Charts That Tell the Truth', null, $md$The right chart makes your point instantly.

## Chart choice guide
| Goal | Chart |
| ---- | ----- |
| Compare categories | Bar / Column |
| Show a trend | Line |
| Share of a whole | Pie (max 5 slices) |
| Part-to-whole over time | Stacked column |
| Ranking | Horizontal bar (sorted!) |

## Formatting rules
- Sort bars descending (except time series)
- Remove gridlines and legends you don't need
- Label the insight, not the axis: title "Q3 Sales beat Q2 by 22%"

> [!tip] In Google Sheets, use Insert → Chart and the Explore button for AI-suggested charts.$md$, 5, 12, false, false, 'markdown', ARRAY['excel-sheets-mastery']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004069');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004070', '00000000-0000-4000-8000-000000002005', '00000000-0000-4000-8000-000000003040', 'Project: Sales Dashboard', null, $md$Build a mini sales dashboard:
1. Create a dataset: 40 rows (Date, Product, Region, Units, Price)
2. Add a Total column with a formula
3. Build a pivot table: sales by Region
4. Add a line chart of sales over months
5. Add conditional formatting: highlight units > 100 in green
Finish by writing the one-sentence insight your dashboard proves.$md$, 6, 18, false, false, 'markdown', ARRAY['excel-sheets-mastery']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004070');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003041', '00000000-0000-4000-8000-000000002006', 'Word Mastery', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003041');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004071', '00000000-0000-4000-8000-000000002006', '00000000-0000-4000-8000-000000003041', 'Styles, Not Manual Formatting', null, $md$Professionals never hand-format. They use styles.

## The styles habit
1. Type your document with plain text
2. Apply Heading 1 / Heading 2 / Normal from the Styles gallery
3. Change the style once → whole document updates

## Why styles win
| Using styles | Manual formatting |
| ------------ | ----------------- |
| Auto table of contents | None (hand-made) |
| Navigation pane works | No |
| Rebrand in one click | Reformat everything |
| Accessible for screen readers | No |

## Build a TOC in 10 seconds
References → Table of Contents → choose a style.

> [!tip] Ctrl+Enter = page break. Shift+Enter = line break (no new paragraph).$md$, 1, 13, true, true, 'markdown', ARRAY['word-powerpoint-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004071');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004072', '00000000-0000-4000-8000-000000002006', '00000000-0000-4000-8000-000000003041', 'Tables, Images & Layout That Look Expensive', null, $md$Three moves separate amateurs from pros.

## Tables that behave
- Insert → Table, then check "Repeat header row" (Layout tab) so headers repeat across pages
- Use borders sparingly: white borders + shading = modern look

## Images that flow
- Select image → Layout Options → Wrap Text → Square
- Now drag it anywhere; text flows around it

## The golden layout rules
1. One idea per section
2. White space is your friend — don't fill everything
3. Max 2 fonts per document

> [!tip] F4 repeats your last action — format one heading, then F4-F4-F4 across the rest.$md$, 2, 13, false, false, 'markdown', ARRAY['word-powerpoint-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004072');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004073', '00000000-0000-4000-8000-000000002006', '00000000-0000-4000-8000-000000003041', 'Collaboration, Review & AI', null, $md$Modern documents are team projects.

## Track changes
Review → Track Changes → edit → colleagues see exactly what you changed, and can Accept/Reject.

## Comments & @mentions
Highlight text → New Comment → type @Name to notify them (Office 365).

## AI features in Word
- Dictation: Home → Dictate — speak your draft
- Copilot (M365): "Summarize this document" / "Rewrite this section more formally"

> [!tip] Always Share (top-right) with link before emailing files — version control lives in the cloud.$md$, 3, 10, false, false, 'markdown', ARRAY['word-powerpoint-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004073');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003042', '00000000-0000-4000-8000-000000002006', 'PowerPoint Pro', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003042');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004074', '00000000-0000-4000-8000-000000002006', '00000000-0000-4000-8000-000000003042', 'Design Rules That Prevent Boring Decks', null, $md$Bad slides are a design problem, not a tool problem.

## The rules
| Rule | Detail |
| ---- | ------ |
| One idea per slide | Split dense slides |
| 6 words per bullet max | Speak the rest |
| 30pt font minimum | If it doesn't fit, cut text |
| Max 2 fonts + brand colors | Consistency = trust |
| Images beat text walls | Screenshots, icons, photos |

## The 10-20-30 rule (Guy Kawasaki)
10 slides · 20 minutes · 30pt font.

> [!tip] Use the Designer pane (Design → Designer) — it generates professional layouts from your content with AI.$md$, 4, 14, true, true, 'markdown', ARRAY['word-powerpoint-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004074');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004075', '00000000-0000-4000-8000-000000002006', '00000000-0000-4000-8000-000000003042', 'Morph, Animations & Pro Shortcuts', null, $md$Motion is polish — done right it makes you look like a pro.

## The Morph transition
1. Duplicate a slide (Ctrl+D)
2. Move/resize an object on the copy
3. Transitions → Morph

```diagram
  Slide 5:  ● logo (small, left)
  Slide 6:  ● logo (large, center)
  Transition: Morph → smooth cinematic zoom
```

## Shortcuts that save hours
| Shortcut | Action |
| -------- | ------ |
| Ctrl+M | new slide |
| Ctrl+D | duplicate slide/object |
| F5 | start show from start |
| Shift+F5 | start from current slide |
| Alt+Shift+↑/↓ | promote/demote outline |
| B / W | black / white screen during show |

> [!tip] Animation ≠ decoration: use Entrance for points you discuss, and nothing else. Subtle beats flashy.$md$, 5, 12, false, false, 'markdown', ARRAY['word-powerpoint-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004075');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004076', '00000000-0000-4000-8000-000000002006', '00000000-0000-4000-8000-000000003042', 'Project: Your Career Pitch Deck', null, $md$Build a 7-slide personal pitch deck:
1. Title (your name, role, brand colors)
2. About (3 bullets + photo)
3. Skills (grid of icons/skill bars)
4. Experience (timeline, not paragraphs)
5. Projects (screenshots + one-line results)
6. Education & Certifications
7. Contact + call-to-action
Apply: one idea per slide, 6-word bullets, 30pt+ font, Designer layouts, and a Morph transition.$md$, 6, 18, false, false, 'markdown', ARRAY['word-powerpoint-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004076');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003043', '00000000-0000-4000-8000-000000002007', 'Data & Model', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003043');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004077', '00000000-0000-4000-8000-000000002007', '00000000-0000-4000-8000-000000003043', 'The BI Pipeline', null, $md$Power BI turns messy business data into decisions.

```diagram
  Get Data ─► Power Query ─► Data Model ─► DAX ─► Visuals ─► Publish
     │          (clean)      (relations)  (measures)  (report)   (share)
  Excel,CSV,  remove rows,   star schema   CALCULATE    charts    workspace
  SQL,API     fix types      + filters     SUMX, etc.   KPIs      + refresh
```

## The four stages
| Stage | You do |
| ----- | ------ |
| Import | Get Data from Excel/CSV/SQL/API |
| Transform | Clean: remove blanks, split, rename, fix types |
| Model | Link tables with relationships |
| Visualize | Drag fields, write measures, design |

> [!tip] Import mode (not DirectQuery) for almost everything — it's faster and free-tier friendly.$md$, 1, 14, true, true, 'markdown', ARRAY['power-bi-visuals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004077');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004078', '00000000-0000-4000-8000-000000002007', '00000000-0000-4000-8000-000000003043', 'Power Query — Cleaning Like a Pro', null, $md$80% of analysis time is cleaning data. Power Query does it without code.

## The 10 essential transforms
| Transform | How |
| --------- | --- |
| Remove columns | Right-click → Remove |
| Remove blanks | Filter arrows → deselect (blank) |
| Split column | Split Column → by delimiter |
| Fix data type | Column header icon → Text/Number/Date |
| Fill down | Transform → Fill → Down (for merged cells) |
| Unpivot | Select ID column → Unpivot Other Columns |
| Merge | Home → Merge Queries (join) |
| Append | Home → Append (stack rows) |
| Add column from examples | Add Column → Column From Examples |
| Replace values | Transform → Replace Values |

## Star schema — the professional model
```diagram
        Fact: Sales
        (date_id, product_id, amount)
           │            │
      Date table   Product table
      (dimension)   (dimension)
```

> [!tip] Never merge dimensions into facts. A separate Date table (Modeling → New Table) unlocks all time intelligence.$md$, 2, 15, false, false, 'markdown', ARRAY['power-bi-visuals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004078');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004079', '00000000-0000-4000-8000-000000002007', '00000000-0000-4000-8000-000000003043', 'DAX — Measures That Do the Thinking', null, $md$Measures are calculations that respond to your filters.

```dax
Total Sales = SUM(Sales[Amount])

Avg Order = AVERAGE(Sales[Amount])

Total Profit = SUMX(Sales, Sales[Amount] - Sales[Cost])

YoY Sales =
  CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))

YTD Sales = TOTALYTD([Total Sales], 'Date'[Date])

India Sales = CALCULATE([Total Sales], 'Region'[Name] = "India")
```

## Measure vs calculated column
| Measure | Calculated column |
| ------- | ----------------- |
| Evaluated at query time | Stored per row |
| Respects filters (dynamic) | Static |
| Use for KPIs | Use rarely |

> [!tip] Rule: if it aggregates (sum, avg, %, YoY) it's a MEASURE.$md$, 3, 16, false, false, 'markdown', ARRAY['power-bi-visuals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004079');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003044', '00000000-0000-4000-8000-000000002007', 'Visuals & Delivery', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003044');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004080', '00000000-0000-4000-8000-000000002007', '00000000-0000-4000-8000-000000003044', 'Choosing the Right Visual', null, $md$Right visual, right message.

## The decision map
| Insight you want | Visual |
| ---------------- | ------ |
| Trend over time | Line |
| Compare categories | Bar (sorted!) |
| Share of total | Donut (≤5 slices) |
| Exact values + hierarchy | Matrix |
| Geography | Map |
| Top 3 | Ranked bar or card |
| Single KPI | Card / KPI visual |

## Formatting that signals "professional"
- Remove default gridlines and axis clutter
- Sort categories by value, not alphabet
- One accent color + neutral palette
- Titles = insights ("Sales up 22% YoY"), not labels ("Chart 1")

> [!tip] Use consistent colors for the same entity across visuals — your audience learns the color language.$md$, 4, 13, true, true, 'markdown', ARRAY['power-bi-visuals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004080');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004081', '00000000-0000-4000-8000-000000002007', '00000000-0000-4000-8000-000000003044', 'Dashboards & Publishing', null, $md$A dashboard is a story, not a screen full of charts.

## Dashboard design order
1. Top row: 3-4 KPI cards (the summary)
2. Middle: the main chart that proves the headline
3. Bottom: breakdowns (by product, region, month)
4. Right rail: filters (slicers) + drill-through

## Publish & share
1. Save → Publish to Workspace
2. Create an App → share link
3. Schedule refresh: Settings → Datasets → Scheduled refresh (Gateway for on-prem data)
4. Row-level security: Security tab → Roles + DAX filter per role

> [!tip] Preview the report on mobile: View → Phone layout — executives open dashboards on phones.$md$, 5, 14, false, false, 'markdown', ARRAY['power-bi-visuals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004081');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004082', '00000000-0000-4000-8000-000000002007', '00000000-0000-4000-8000-000000003044', 'Project: Sales KPI Dashboard', null, $md$Build a 4-page Power BI dashboard:
1. Import the sample "Financial Sample" (File → New → sample data)
2. Clean in Power Query: correct date type, rename columns
3. Model: Date table + relationship to sales
4. Measures: Total Sales, Profit %, YoY Sales, YTD
5. Page 1: 4 KPI cards + line chart of monthly sales
6. Page 2: sales by product (bar) + by segment (donut)
7. Page 3: matrix by year × country + slicers
Publish it and share the link.$md$, 6, 20, false, false, 'markdown', ARRAY['power-bi-visuals']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004082');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003045', '00000000-0000-4000-8000-000000002008', 'Figma Foundations', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003045');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004083', '00000000-0000-4000-8000-000000002008', '00000000-0000-4000-8000-000000003045', 'The Figma Canvas & Shortcuts', null, $md$Figma lives in the browser — zero installs, real-time collaboration.

## The workspace
```diagram
  ┌───────────────────────────────────────┐
  │ Toolbar: Move Frame Text Shape Pen     │
  ├──────────┬────────────────────────────┤
  │ Layers   │  Canvas (infinite)         │
  │ (left)   │   [Frame 1] [Frame 2]      │
  ├──────────┴────────────────────────────┤
  │ Properties (right): X Y W H, fill     │
  └───────────────────────────────────────┘
```

## Shortcuts that 10x your speed
| Shortcut | Action |
| -------- | ------ |
| V / F / T / R | Move / Frame / Text / Rectangle |
| Shift+A | Auto Layout |
| Ctrl+D | duplicate |
| Alt+drag | duplicate + move |
| Ctrl+G | group |
| Shift+1 | zoom to fit |
| Ctrl+Shift+K | create component |

> [!tip] Always start with a FRAME (F), not the background. Frames are your screens.$md$, 1, 13, true, true, 'markdown', ARRAY['figma-ui-bootcamp']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004083');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004084', '00000000-0000-4000-8000-000000002008', '00000000-0000-4000-8000-000000003045', 'Auto Layout — the Superpower', null, $md$Auto Layout is Figma's Flexbox. Everything you build should use it.

## Why Auto Layout wins
| Without Auto Layout | With Auto Layout |
| ------------------- | ---------------- |
| Manual positioning | Elements flow |
| Rebuild on edit | Padding/gap auto-adjust |
| Breaks when text grows | Grows gracefully |

## Build a button
1. Draw rectangle (R)
2. Add text (T) inside it
3. Select both → Shift+A
4. Set padding 12/24, gap 8, radius 8

```diagram
  ┌──────────────────────────┐
  │  (icon)  "Get Started"   │  ← one Auto Layout frame
  └──────────────────────────┘
     padding 12 16 · gap 8 · centered
```

> [!tip] Nested Auto Layout frames = full page layouts that reflow when content changes.$md$, 2, 14, true, true, 'markdown', ARRAY['figma-ui-bootcamp']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004084');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004085', '00000000-0000-4000-8000-000000002008', '00000000-0000-4000-8000-000000003045', 'Colors, Text & Styles', null, $md$Design tokens = consistency.

## Create styles (the pro habit)
1. Select a color → right side → Styles → Create style
2. Name by ROLE, not color: `brand/primary` (not `blue/500`)
3. Same for text styles: `text/heading`, `text/body`

## The 8pt grid
All spacing = multiples of 8 (8, 16, 24, 32). Align everything to an 8pt grid frame.

## 60-30-10 again
60% surface · 30% secondary · 10% accent — apply it in every screen.

> [!tip] Rename layers as you create them: `Button / Primary / Default` beats `Frame 42`. Teams live in your layers.$md$, 3, 12, false, false, 'markdown', ARRAY['figma-ui-bootcamp']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004085');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003046', '00000000-0000-4000-8000-000000002008', 'Design Systems & Handoff', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003046');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004086', '00000000-0000-4000-8000-000000002008', '00000000-0000-4000-8000-000000003046', 'Components & Variants', null, $md$One master, infinite instances.

## Create a component
1. Design the button
2. Ctrl+Alt+K (or the diamond icon)
3. Instances update when you edit the master

## Variants = states
Add variants: Default / Hover / Disabled / Loading — same component, different properties.

```diagram
  Button / Primary
  ├── Default
  ├── Hover
  ├── Disabled
  └── Loading
```

## When to component-ize
| Use components | Don't bother |
| -------------- | ------------ |
| Buttons, inputs, cards | One-off hero art |
| Navbars, icons | Backgrounds |
| Anything repeated 3x+ | Mockup decoration |

> [!tip] Change color via variant/props, not by editing each instance — that's the whole point.$md$, 4, 13, false, false, 'markdown', ARRAY['figma-ui-bootcamp']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004086');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004087', '00000000-0000-4000-8000-000000002008', '00000000-0000-4000-8000-000000003046', 'Designing Your First Screen', null, $md$Let's design a real screen: a course player UI.

## The plan
1. Frame: 390×844 (iPhone) + 1440×900 (desktop)
2. Desktop: sidebar + header + content using nested Auto Layout
3. A course card component (thumbnail, title, progress bar, button)
4. Navigation component with active state
5. Constraints: sidebar fixed, content fill

## Check your design
- All spacing on 8pt grid? ✅
- Text hierarchy: heading/body/caption? ✅
- Buttons from components? ✅
- Contrast: text vs background (use Contrast plugin)? ✅

> [!tip] Design mobile FIRST, then scale to desktop with Auto Layout + constraints — same as responsive CSS.$md$, 5, 16, false, false, 'markdown', ARRAY['figma-ui-bootcamp']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004087');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004088', '00000000-0000-4000-8000-000000002008', '00000000-0000-4000-8000-000000003046', 'Handoff to Developers', null, $md$Dev Mode turns your design into specs developers can build from.

## What Dev Mode gives
| Item | Example |
| ---- | ------- |
| CSS | font-size, padding, border-radius |
| Assets | exported PNG/SVG at 1x, 2x, 3x |
| Tokens | color/typography variables |

## The handoff checklist
1. Components used everywhere (no stray frames)
2. Styles with meaningful names
3. A "Specs" frame: spacing, grid, type scale
4. Export assets marked ✓
5. Prototype links for interaction flow

> [!tip] Developers are your users. A clean Figma file is professional courtesy AND a faster build.$md$, 6, 12, false, false, 'markdown', ARRAY['figma-ui-bootcamp']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004088');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003047', '00000000-0000-4000-8000-000000002009', 'VS Code Superpowers', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003047');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004089', '00000000-0000-4000-8000-000000002009', '00000000-0000-4000-8000-000000003047', 'Your First Hour in VS Code', null, $md$The most popular code editor on Earth — and you can master it.

## The layout
```diagram
  ┌────────┬───────────────────┬──────────┐
  │ Explorer│  Editor           │ Terminal │
  │ (files) │  (your code)      │ (bash)   │
  ├────────┴───────────────────┴──────────┤
  │ Status bar: branch, errors, encoding   │
  └────────────────────────────────────────┘
```

## Life-changing shortcuts
| Shortcut | Action |
| -------- | ------ |
| Ctrl+P | open any file by name |
| Ctrl+Shift+P | command palette |
| Ctrl+B | toggle sidebar |
| Ctrl+` | terminal |
| Ctrl+Shift+L | select all occurrences |
| Alt+↑/↓ | move line |
| Ctrl+/ | comment |

> [!tip] Ctrl+P is the #1 shortcut — pros never click folders.$md$, 1, 12, true, true, 'markdown', ARRAY['vs-code-git-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004089');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004090', '00000000-0000-4000-8000-000000002009', '00000000-0000-4000-8000-000000003047', 'Multi-Cursor, Emmet & Snippets', null, $md$Type less, do more.

## Multi-cursor magic
1. Alt+Click → cursors everywhere
2. Ctrl+Shift+L → select all matches, edit at once
3. Ctrl+D → select next occurrence each press

## Emmet — HTML at lightning speed
```html
ul>li*3  + Tab   → <ul><li></li><li></li><li></li></ul>
h1 + Tab         → <h1></h1>
.card>.title     → nested class div
```

## Snippets
File → Preferences → User Snippets — define your own blocks, type prefix + Tab.

> [!tip] Watch someone type `ul>li*3` + Tab once. You'll never write HTML longhand again.$md$, 2, 12, true, true, 'markdown', ARRAY['vs-code-git-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004090');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004091', '00000000-0000-4000-8000-000000002009', '00000000-0000-4000-8000-000000003047', 'Extensions & Settings Worth Configuring', null, $md$VS Code is 10% editor, 90% extensions.

## The starter pack
| Extension | Why |
| --------- | --- |
| Prettier | format on save |
| ESLint | catch bugs live |
| Live Server | instant HTML preview |
| GitLens | blame/history in editor |
| Error Lens | errors inline |
| Auto Rename Tag | rename pairs together |

## 3 settings everyone should set
```json
{
  "editor.formatOnSave": true,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay"
}
```

> [!tip] Ctrl+Shift+P → "sync settings" → sign in → your setup follows you to any machine.$md$, 3, 11, false, false, 'markdown', ARRAY['vs-code-git-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004091');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003048', '00000000-0000-4000-8000-000000002009', 'Git & GitHub', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003048');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004092', '00000000-0000-4000-8000-000000002009', '00000000-0000-4000-8000-000000003048', 'Git — The Time Machine for Code', null, $md$Git tracks every change so you can experiment without fear.

## The mental model
```diagram
  Working dir ──git add──► Staging ──git commit──► Repository
      │                                          (snapshot)
  edit files                       branch: main ──► push ──► GitHub
```

## The daily loop
```bash
git status                 # what changed?
git add .                  # stage everything
git commit -m "feat: add login"   # snapshot
git push                   # save to GitHub
```

> [!tip] Commit messages: short verb + what. "fix: broken nav link" — never "stuff".$md$, 4, 13, true, true, 'markdown', ARRAY['vs-code-git-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004092');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004093', '00000000-0000-4000-8000-000000002009', '00000000-0000-4000-8000-000000003048', 'Branches & Pull Requests', null, $md$Branches let many features live at once.

## Branch workflow
```bash
git checkout -b feature-nav   # create + switch
git add . && git commit -m "feat: navbar"
git push -u origin feature-nav
```

Then on GitHub: Compare & pull request → review → merge.

## Pull request anatomy
1. Branch with your changes pushed
2. PR describes WHAT + WHY
3. Review comments → fix → push again
4. Merge → delete branch

## Undo without panic
```bash
git restore file.txt      # discard uncommitted changes
git reset HEAD~1          # undo last commit, keep files
git log --oneline         # see history
```

> [!tip] `git log --oneline` is your map. When lost, read the log first.$md$, 5, 14, false, false, 'markdown', ARRAY['vs-code-git-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004093');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004094', '00000000-0000-4000-8000-000000002009', '00000000-0000-4000-8000-000000003048', 'Project: Publish Your Portfolio', null, $md$Ship your first repo to GitHub:

1. Create a folder with index.html + style.css (reuse your HTML/CSS skills!)
2. `git init` → `git add .` → `git commit -m "feat: portfolio"`
3. GitHub → New Repository → copy the commands → push
4. Open GitHub → Settings → Pages → deploy main branch
5. Share your `username.github.io` link 🎉

Every deployment from now on is the same 3 commands.$md$, 6, 18, false, false, 'markdown', ARRAY['vs-code-git-essentials']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004094');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003049', '00000000-0000-4000-8000-000000002010', 'Prompting Like a Pro', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003049');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004095', '00000000-0000-4000-8000-000000002010', '00000000-0000-4000-8000-000000003049', 'How AI Actually Thinks (Simplified)', null, $md$Understanding the tool makes you better at using it.

## What a language model is
```diagram
  Your prompt (text)
        │
        ▼
  Model predicts the most likely next word,
  one token at a time — trillions of patterns
        │
        ▼
  Response (text)
```

## What that means for you
- More context = better guesses
- Clear roles = right style
- Examples = right format

## The golden formula
```text
ROLE + TASK + CONTEXT + FORMAT + EXAMPLE

"You are a senior Python instructor.
Explain list comprehensions to a beginner.
Use a real example (prices → discounts).
End with a challenge + solution."
```

> [!tip] Treat the model like a brilliant intern: give it the full brief, then check its work.$md$, 1, 13, true, true, 'markdown', ARRAY['chatgpt-claude-ai']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004095');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004096', '00000000-0000-4000-8000-000000002010', '00000000-0000-4000-8000-000000003049', 'The 7 Prompt Patterns', null, $md$These patterns cover 90% of expert prompting.

| Pattern | Formula | Use for |
| ------- | ------- | ------- |
| Persona | "You are a [role]" | expert voice |
| Few-shot | 2 examples of output | consistent format |
| Chain of thought | "Think step by step" | math, logic, planning |
| Constraints | "Max 150 words, bullets" | controlled output |
| Iterate | "Make it shorter/simpler" | refinement |
| Reverse | "Find the flaws in my answer" | self-check |
| Structured | "Return a table/JSON" | data extraction |

## One prompt, three iterations
1. "Draft a study plan" → 2. "Make it 7 days, 1 hour/day" → 3. "Turn it into a table"

> [!tip] Iteration beats rewriting. Refine the SAME conversation — models remember context.$md$, 2, 14, true, true, 'markdown', ARRAY['chatgpt-claude-ai']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004096');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004097', '00000000-0000-4000-8000-000000002010', '00000000-0000-4000-8000-000000003049', 'AI as Your Personal Tutor', null, $md$Turn AI into the best study partner you've ever had.

## The study loop
```diagram
  Learn (course lesson)
      │
      ▼
  AI quiz (10 questions) ── wrong? ──► AI explains that topic
      │ right
      ▼
  AI flashcards (spaced repetition)
      │
      ▼
  Teach it back: "Quiz me like an interviewer"
```

## Prompt bank
```text
"Quiz me on [topic], 10 questions, adaptive difficulty.
Wait for each answer before the next question."

"Create 20 flashcards from this lesson, front/back format."

"Explain [concept] like I'm 12, then like a PhD student."
```

> [!tip] Ask for "your hardest 3 questions on this topic" — that's where real learning happens.$md$, 3, 13, false, false, 'markdown', ARRAY['chatgpt-claude-ai']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004097');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003050', '00000000-0000-4000-8000-000000002010', 'Claude & ChatGPT Power Features', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003050');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004098', '00000000-0000-4000-8000-000000002010', '00000000-0000-4000-8000-000000003050', 'Claude Projects & Artifacts', null, $md$Claude's killer features for real work.

## Projects (Claude.ai)
1. Projects → New → add a knowledge base (docs, code, notes)
2. Claude answers using YOUR context — not generic info
3. Use for: your codebase, your course notes, your SOPs

## Artifacts
- Claude builds mini apps/snippets IN the chat
- Edit them live, preview, copy out
- Use for: calculators, tables, small web demos

## Claude Code (developers)
```bash
claude "add dark mode to the header"
```
It reads your repo, edits files, and explains changes — you review and accept.

> [!tip] Attach files with @ — "Compare this resume with this JD and list gaps."$md$, 4, 13, true, true, 'markdown', ARRAY['chatgpt-claude-ai']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004098');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004099', '00000000-0000-4000-8000-000000002010', '00000000-0000-4000-8000-000000003050', 'ChatGPT Custom Instructions & GPTs', null, $md$Make ChatGPT know you before you type.

## Custom instructions (Settings → Personalization)
Tell it once:
```text
I'm a student learning web dev. I prefer short,
practical explanations with code examples and a
challenge after each topic. I'm from India — use ₹.
```
Every future answer adapts.

## Projects / GPTs
- Create saved assistants: "Resume Writer", "Code Reviewer", "Hindi Tutor"
- Upload context files per GPT

## Power combos
| Task | Prompt |
| ---- | ------ |
| Summarize a video/article | paste link → "5 bullet summary" |
| Extract data from PDF | upload → "output as table" |
| Fix English | "rewrite formally, keep meaning" |
| Generate quiz | "10 mcqs with answer key" |

> [!tip] Use images: upload a screenshot of an error and ask "what's wrong?" — fastest debugging you'll ever do.$md$, 5, 12, false, false, 'markdown', ARRAY['chatgpt-claude-ai']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004099');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004100', '00000000-0000-4000-8000-000000002010', '00000000-0000-4000-8000-000000003050', 'AI Safety, Ethics & the 20% Rule', null, $md$Powerful tools demand discipline.

## The rules
1. **Never paste secrets**: API keys, passwords, personal data
2. **Verify code before running** — especially delete/format commands
3. **The 20% rule**: AI is 80% right; the last 20% is your job
4. **Cite & check facts** — AI can hallucinate confidently
5. **Own your work** — review, refine, add your voice

## Red flags in AI output
- Looks perfect but wrong details (names, numbers, dates)
- Confident nonsense (hallucinations)
- Outdated info — ask for sources/dates

> [!tip] The best AI users are skeptical. "Show your work" prompts reduce hallucination massively.$md$, 6, 12, false, false, 'markdown', ARRAY['chatgpt-claude-ai']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004100');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003051', '00000000-0000-4000-8000-000000002011', 'Gmail, Drive & Docs', 1
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003051');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004101', '00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000003051', 'Gmail — Inbox Zero Workflow', null, $md$Email is a system, not a chore.

## The 4-step inbox system
1. **Label everything** — create labels: Projects, Clients, Personal
2. **Filters** — Settings → Filters: auto-label, archive, star
3. **Keyboard** — C compose · E archive · Shift+U unread
4. **Snooze** — right-click → Snooze (reappears later)

## Search operators
```text
from:boss has:attachment is:unread older_than:7d
```

## Pro features
- Scheduled send (clock icon)
- Canned responses (Settings → Templates)
- Confidential mode (expiry + no forwarding)

> [!tip] Starred = needs action. Archived = done. Labeled = filed. Inbox = only new + urgent.$md$, 1, 13, true, true, 'markdown', ARRAY['google-workspace-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004101');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004102', '00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000003051', 'Google Drive & Docs Superpowers', null, $md$Shared docs are where modern work happens.

## Drive habits
- Shift+Z → file in multiple folders (no copies!)
- Right-click → Get link → set permission (Viewer/Editor)
- Star important files · Offline mode for travel

## Docs that work
- Type "/" → insert table, chips, headers
- @ mention → notify a person, add a date or file
- Tools → Voice typing (Ctrl+Shift+S)
- Version history: File → Version history → restore anything

```diagram
  Doc (live) ──► @Nisha ──► notified in email
        │
        └── Comment → Assign → resolved thread
```

> [!tip] "Compare documents" (Tools) finds differences between versions — great for contracts.$md$, 2, 13, true, true, 'markdown', ARRAY['google-workspace-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004102');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004103', '00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000003051', 'Google Sheets — Formulas & Automation', null, $md$Spreadsheets + automation = personal superpowers.

## Formulas that matter
```text
=SUM(B2:B20)     =AVERAGE(B2:B20)
=VLOOKUP(id, A2:C20, 3, FALSE)
=IF(B2>70, "Pass", "Fail")
=TEXT(NOW(), "DD MMM")
```

## The Explore button (bottom-right)
Click it → auto-suggested charts and insights from your data.

## Apps Script — code your automation
```js
function sendReminder() {
  MailApp.sendEmail("me@example.com",
    "Reminder", "Finish the Google Sheets module!");
}
```
Extensions → Apps Script → set a trigger (menu, time, on edit).

> [!tip] Conditional formatting + named ranges make big sheets readable.$md$, 3, 13, false, false, 'markdown', ARRAY['google-workspace-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004103');


insert into public.course_modules (id, course_id, title, order_index)
select '00000000-0000-4000-8000-000000003052', '00000000-0000-4000-8000-000000002011', 'Slides, Calendar & Meet', 2
where not exists (select 1 from course_modules where id = '00000000-0000-4000-8000-000000003052');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004104', '00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000003052', 'Slides + Calendar Team Coordination', null, $md$Meetings and decks run on these two apps.

## Slides speed
- Explore → AI-generated layouts from bullets
- Ctrl+D duplicate · F5 present
- Insert → Speaker notes + live captions (CC)

## Calendar power moves
- Create event → check "Add Google Meet" → link auto-sent
- "Find a time" → see when everyone is free
- Focus time blocks for deep work
- Multiple calendars (work/personal/team) with colors

> [!tip] Calendar is a promise. Show, don't just tell: block 1 hour daily for focused learning.$md$, 4, 12, true, true, 'markdown', ARRAY['google-workspace-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004104');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004105', '00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000003052', 'Google Meet Like a Pro', null, $md$Video meetings that don't waste time.

## Setup checklist
- Camera at eye level, light in front
- "Present now" → share tab vs window vs whole screen
- Captions: CC button (auto-transcribe!)
- Background blur / virtual backgrounds
- Pinning: pin the speaker; spotlight up to 7

## Meeting etiquette
1. Agenda in the calendar invite
2. Notes in Docs (open "Notes" template)
3. Assign action items with @mention
4. Record only when needed — record to Drive

> [!tip] Use Meet's live captions during lectures — instant, free subtitles for any language video call.$md$, 5, 10, false, false, 'markdown', ARRAY['google-workspace-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004105');


insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes, is_preview, is_free_preview, content_format, tags)
select '00000000-0000-4000-8000-000000004106', '00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000003052', 'Project: Personal Knowledge System', null, $md$Build your own second brain in Google Workspace:

1. Gmail: 3 labels + 2 filters (auto-label + archive)
2. Drive: folder structure (Courses / Work / Personal) + star 2 items
3. Docs: "Learning Notes" doc with @-mention to yourself, heading structure
4. Sheets: XP tracker with =SUM, a bar chart, conditional formatting
5. Calendar: repeat study block ×7 + one Google Meet link
6. Share the Docs link with Viewer permission$md$, 6, 16, false, false, 'markdown', ARRAY['google-workspace-pro']
where not exists (select 1 from lessons where id = '00000000-0000-4000-8000-000000004106');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005051', '00000000-0000-4000-8000-000000002001', 'Which HTML tag marks the most important heading?', '["<h6>","<h1>","<head>","<title>"]'::jsonb, 1, '<h1> is the most important heading; use exactly one per page.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005051');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005052', '00000000-0000-4000-8000-000000002001', 'What does CSS stand for?', '["Creative Style Sheets","Cascading Style Sheets","Computer Styled Sections","Colorful Style System"]'::jsonb, 1, 'CSS = Cascading Style Sheets.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005052');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005053', '00000000-0000-4000-8000-000000002001', 'Which selector targets elements with class="card"?', '["#card",".card","card","*card"]'::jsonb, 1, 'A dot (.) before the name targets a class.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005053');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005054', '00000000-0000-4000-8000-000000002001', 'What is the correct box-model order (outside → in)?', '["padding, margin, border, content","margin, border, padding, content","border, margin, padding, content","content, padding, border, margin"]'::jsonb, 1, 'Margin sits outside, then border, then padding, then content.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005054');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005055', '00000000-0000-4000-8000-000000002001', 'Which CSS layout tool is best for a responsive card grid?', '["Float","Flexbox only","CSS Grid","Table"]'::jsonb, 2, 'Grid handles 2D layouts like card grids beautifully.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005055');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005056', '00000000-0000-4000-8000-000000002001', 'What does the alt attribute on <img> do?', '["Shows a tooltip","Provides accessible text when the image can''t load","Speeds up the image","Makes the image clickable"]'::jsonb, 1, 'alt text is read by screen readers and shows when images fail.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005056');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005057', '00000000-0000-4000-8000-000000002001', 'Which is a semantic HTML element?', '["<div>","<span>","<main>","<b>"]'::jsonb, 2, '<main> describes its meaning; div/span are generic.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005057');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005058', '00000000-0000-4000-8000-000000002001', 'What unit is best for responsive font sizes?', '["px","pt","rem","mm"]'::jsonb, 2, 'rem scales relative to the root font size.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005058');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005059', '00000000-0000-4000-8000-000000002002', 'Which keyword declares a variable that CANNOT be reassigned?', '["let","var","const","static"]'::jsonb, 2, 'const variables cannot be reassigned.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005059');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005060', '00000000-0000-4000-8000-000000002002', 'What does document.querySelector(''.btn'') return?', '["All buttons","The first element matching .btn","A button element by id","Nothing"]'::jsonb, 1, 'querySelector returns the first matching element.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005060');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005061', '00000000-0000-4000-8000-000000002002', 'What does .map() do?', '["Filters items","Changes the array in place","Creates a new transformed array","Counts items"]'::jsonb, 2, 'map transforms each element into a new array.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005061');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005062', '00000000-0000-4000-8000-000000002002', 'Which is correct async syntax?', '["async function f() { await fetch(...) }","function async f() { fetch(...) }","await function f()","async => await f()"]'::jsonb, 0, 'async keyword comes before function; await inside.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005062');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005063', '00000000-0000-4000-8000-000000002002', 'What does e.preventDefault() do in a form handler?', '["Submits the form","Stops the default browser behavior","Stops other listeners","Reloads the page"]'::jsonb, 1, 'It stops the default behavior (e.g. page reload on submit).', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005063');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005064', '00000000-0000-4000-8000-000000002002', 'What is the result of typeof [1,2,3]?', '["array","object","list","number"]'::jsonb, 1, 'Arrays are objects in JavaScript — a classic interview gotcha.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005064');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005065', '00000000-0000-4000-8000-000000002002', 'Which method finds the first element matching a CSS selector?', '["getElementById","querySelector","getElementsByTagName","document.all"]'::jsonb, 1, 'querySelector uses full CSS selector syntax.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005065');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005066', '00000000-0000-4000-8000-000000002002', 'How do you add a click handler?', '["button.onclick = fn","button.addEventListener(''click'', fn)","button.addEventListener(fn, ''click'')","button.click(fn)"]'::jsonb, 1, 'addEventListener(''click'', fn) is the modern standard.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005066');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005067', '00000000-0000-4000-8000-000000002003', 'What does f"Hello {name}" do?', '["Multiplies strings","Formats the value of name into the string","Only works with numbers","Errors always"]'::jsonb, 1, 'f-strings embed variable values into strings.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005067');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005068', '00000000-0000-4000-8000-000000002003', 'Which is a valid dictionary?', '["[1, 2, 3]","{\"name\": \"Vish\"}","(\"a\", \"b\")","{\"name\"}"]'::jsonb, 1, 'Dictionaries use key: value pairs in curly braces.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005068');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005069', '00000000-0000-4000-8000-000000002003', 'What is the output of len([1, 2, 3])?', '["2","3","4","Error"]'::jsonb, 1, 'len() returns the number of items.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005069');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005070', '00000000-0000-4000-8000-000000002003', 'How do you catch errors?', '["try / except","if / error","catch / except","try / finally only"]'::jsonb, 0, 'try/except wraps risky code.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005070');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005071', '00000000-0000-4000-8000-000000002003', 'What does .append() do to a list?', '["Removes an item","Adds an item at the end","Sorts the list","Copies the list"]'::jsonb, 1, 'append adds one item to the end.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005071');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005072', '00000000-0000-4000-8000-000000002003', 'Which command installs packages?', '["python install","pip install pandas","import install","setup pandas"]'::jsonb, 1, 'pip is Python''s package installer.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005072');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005073', '00000000-0000-4000-8000-000000002003', 'What does with open(...) as f: guarantee?', '["Faster code","File is closed automatically","File is encrypted","Nothing"]'::jsonb, 1, 'The with statement auto-closes the file.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005073');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005074', '00000000-0000-4000-8000-000000002003', 'Which is correct for a list comprehension?', '["[x * 2 for x in nums]","for x in nums: x * 2","nums.map(x => x*2)","[x * 2 if nums]"]'::jsonb, 0, 'Comprehensions: [expression for item in iterable].', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005074');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005075', '00000000-0000-4000-8000-000000002004', 'What does the JVM do?', '["Compiles Java to machine code once","Runs compiled bytecode on any OS","Only debugs code","Is a text editor"]'::jsonb, 1, 'The JVM executes portable .class bytecode on any platform.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005075');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005076', '00000000-0000-4000-8000-000000002004', 'Which declares a constant text value?', '["var name = \"X\"","String name = \"X\"","constant name = \"X\"","name := \"X\""]'::jsonb, 1, 'Java is statically typed — declare String explicitly.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005076');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005077', '00000000-0000-4000-8000-000000002004', 'What is encapsulation?', '["Making all fields public","Hiding data via private fields + public methods","Copying classes","Using only one class"]'::jsonb, 1, 'Encapsulation protects data behind methods.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005077');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005078', '00000000-0000-4000-8000-000000002004', 'Which collection is best for key-value lookups?', '["ArrayList","HashMap","int[]","LinkedList only"]'::jsonb, 1, 'HashMap provides O(1) key lookups.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005078');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005079', '00000000-0000-4000-8000-000000002004', 'What does .size() return on an ArrayList?', '["The last index","The number of elements","The capacity","The first element"]'::jsonb, 1, 'size() = element count (unlike length of arrays).', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005079');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005080', '00000000-0000-4000-8000-000000002004', 'Which keyword creates an object?', '["new","create","object","make"]'::jsonb, 0, 'new Student(...) allocates an object.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005080');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005081', '00000000-0000-4000-8000-000000002004', 'What is the entry point of every Java app?', '["public static void main(String[] args)","private void start()","void run()","public init()"]'::jsonb, 0, 'The JVM looks for main(String[] args).', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005081');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005082', '00000000-0000-4000-8000-000000002004', 'How do you print to the console?', '["print.out()","System.out.println()","console.log()","echo()"]'::jsonb, 1, 'System.out.println() is Java''s print statement.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005082');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005083', '00000000-0000-4000-8000-000000002005', 'Which formula sums a range?', '["=SUM(A1:A10)","=ADD(A1:A10)","=TOTAL(A1:A10)","=PLUS(A1:A10)"]'::jsonb, 0, 'SUM is the addition function.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005083');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005084', '00000000-0000-4000-8000-000000002005', 'What does $A$1 mean?', '["A formula error","An absolute (locked) reference","A range","A sheet name"]'::jsonb, 1, '$ locks both column and row.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005084');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005085', '00000000-0000-4000-8000-000000002005', 'Which function returns the highest value?', '["=MAX()","=TOP()","=HIGH()","=BIG()"]'::jsonb, 0, 'MAX returns the largest number in a range.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005085');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005086', '00000000-0000-4000-8000-000000002005', 'What is a pivot table best for?', '["Printing","Summarizing large data in seconds","Writing macros","Formatting colors"]'::jsonb, 1, 'Pivots summarize and group data instantly.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005086');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005087', '00000000-0000-4000-8000-000000002005', 'How do you remove duplicate rows?', '["Data → Remove Duplicates","Home → Delete","Formulas → Clear","View → Duplicates"]'::jsonb, 0, 'Remove Duplicates lives on the Data tab.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005087');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005088', '00000000-0000-4000-8000-000000002005', 'Which chart shows a trend over time best?', '["Pie","Line","Donut","Radar"]'::jsonb, 1, 'Line charts show trends clearly.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005088');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005089', '00000000-0000-4000-8000-000000002005', 'What does =TRIM(A1) do?', '["Cuts the cell","Removes extra spaces","Deletes text","Merges cells"]'::jsonb, 1, 'TRIM strips leading/trailing/extra spaces.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005089');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005090', '00000000-0000-4000-8000-000000002005', 'Which lookup works in both Excel 365 and Google Sheets?', '["VLOOKUP","XLOOKUP","HLOOKUP","FINDUP"]'::jsonb, 1, 'XLOOKUP is the modern, easier lookup.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005090');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005091', '00000000-0000-4000-8000-000000002006', 'What is the biggest benefit of Word styles?', '["Faster typing","Automatic TOC and consistent formatting","More fonts","Smaller files"]'::jsonb, 1, 'Styles enable TOC, navigation and global updates.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005091');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005092', '00000000-0000-4000-8000-000000002006', 'Which shortcut repeats your last action?', '["Ctrl+Z","F4","Ctrl+V","F1"]'::jsonb, 1, 'F4 repeats the previous action.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005092');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005093', '00000000-0000-4000-8000-000000002006', 'What does Track Changes do?', '["Deletes changes","Records edits for review/approval","Locks the document","Prints changes"]'::jsonb, 1, 'Track Changes shows every edit to review later.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005093');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005094', '00000000-0000-4000-8000-000000002006', 'What is the recommended max font size rule for slides?', '["10pt","30pt minimum","72pt","12pt"]'::jsonb, 1, '30pt minimum keeps slides readable from the back row.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005094');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005095', '00000000-0000-4000-8000-000000002006', 'What does the Morph transition do?', '["Fades between slides","Animates movement between duplicated slides","Plays video","Adds sound"]'::jsonb, 1, 'Morph animates object movement between slides.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005095');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005096', '00000000-0000-4000-8000-000000002006', 'How do you repeat header rows in a Word table?', '["Copy-paste the header","Layout tab → Repeat Header Rows","Insert → Repeat","It''s automatic"]'::jsonb, 1, 'Repeat Header Rows keeps the header on every page.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005096');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005097', '00000000-0000-4000-8000-000000002006', 'Which key starts the slideshow from the beginning?', '["F1","F5","F12","Esc"]'::jsonb, 1, 'F5 starts from slide 1; Shift+F5 from current.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005097');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005098', '00000000-0000-4000-8000-000000002006', 'What does the Designer pane do?', '["Prints slides","Generates professional layouts with AI","Records narration","Translates slides"]'::jsonb, 1, 'Designer suggests layouts from your content.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005098');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005099', '00000000-0000-4000-8000-000000002007', 'What is the correct BI pipeline order?', '["Visualize → Model → Import","Import → Clean → Model → Visualize","Model → Import → Clean","Clean → Publish → Import"]'::jsonb, 1, 'Import, transform, model, then visualize.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005099');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005100', '00000000-0000-4000-8000-000000002007', 'What is a star schema?', '["A chart type","Fact table + dimension tables","A dashboard theme","A DAX function"]'::jsonb, 1, 'Star schema = central fact + surrounding dimensions.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005100');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005101', '00000000-0000-4000-8000-000000002007', 'What does CALCULATE do?', '["Formats numbers","Modifies filter context of a calculation","Creates a column","Sorts tables"]'::jsonb, 1, 'CALCULATE evaluates an expression under modified filters.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005101');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005102', '00000000-0000-4000-8000-000000002007', 'Which visual is best for a trend over time?', '["Donut","Line chart","Matrix","Card"]'::jsonb, 1, 'Line charts show time trends best.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005102');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005103', '00000000-0000-4000-8000-000000002007', 'When should you use a measure instead of a calculated column?', '["Always use columns","For aggregations that respect filters","For row-level text","Never"]'::jsonb, 1, 'Measures compute dynamically with filters — perfect for KPIs.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005103');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005104', '00000000-0000-4000-8000-000000002007', 'What does Unpivot do in Power Query?', '["Removes columns","Turns wide crosstab data into tall rows","Merges tables","Renames columns"]'::jsonb, 1, 'Unpivot converts cross-tab layouts to analyzable rows.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005104');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005105', '00000000-0000-4000-8000-000000002007', 'Which DAX function compares to the same period last year?', '["LASTYEAR","SAMEPERIODLASTYEAR","PREVIOUSYEAR","YEARAGO"]'::jsonb, 1, 'SAMEPERIODLASTYEAR shifts the date window one year back.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005105');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005106', '00000000-0000-4000-8000-000000002007', 'How do you share a dashboard with your team?', '["Email the .pbix","Publish to workspace + app link","Screenshot it","Print it"]'::jsonb, 1, 'Publish to a workspace and share the app/link.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005106');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005107', '00000000-0000-4000-8000-000000002008', 'What is the shortcut to create Auto Layout?', '["Ctrl+A","Shift+A","Ctrl+Shift+A","F4"]'::jsonb, 1, 'Select layers → Shift+A wraps them in Auto Layout.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005107');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005108', '00000000-0000-4000-8000-000000002008', 'What is a Frame in Figma?', '["A picture","A container for a screen or component","A text box","A plugin"]'::jsonb, 1, 'Frames are containers — your screens and components.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005108');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005109', '00000000-0000-4000-8000-000000002008', 'Why use design styles?', '["To add filters","Consistent colors/text via reusable tokens","To speed up export","They''re required"]'::jsonb, 1, 'Styles are reusable tokens for colors and text.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005109');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005110', '00000000-0000-4000-8000-000000002008', 'What do Variants do?', '["Add animation","Define states of a component","Resize frames","Change fonts"]'::jsonb, 1, 'Variants model states like hover/disabled.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005110');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005111', '00000000-0000-4000-8000-000000002008', 'What does the 8pt grid mean?', '["Use 8px stroke","Space everything in multiples of 8","8 columns","8pt font"]'::jsonb, 1, 'Spacing multiples of 8 keeps UI consistent.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005111');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005112', '00000000-0000-4000-8000-000000002008', 'How do developers get CSS from a design?', '["Screenshot","Dev Mode / Inspect","Guess","Figma exports automatically"]'::jsonb, 1, 'Dev Mode gives CSS, assets and tokens.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005112');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005113', '00000000-0000-4000-8000-000000002008', 'What is an instance?', '["A copy of a frame","A use of a component linked to its master","A group","A plugin"]'::jsonb, 1, 'Instances stay linked to the master component.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005113');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005114', '00000000-0000-4000-8000-000000002008', 'Which layout tool makes designs responsive?', '["Frames","Auto Layout + constraints","Groups","Sections"]'::jsonb, 1, 'Auto Layout with constraints reflows like CSS.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005114');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005115', '00000000-0000-4000-8000-000000002009', 'Which shortcut opens any file by name?', '["Ctrl+F","Ctrl+P","Ctrl+O","Ctrl+N"]'::jsonb, 1, 'Ctrl+P is the quick-open palette.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005115');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005116', '00000000-0000-4000-8000-000000002009', 'What does Ctrl+Shift+L do?', '["Selects the whole line","Selects all occurrences of a word","Closes the editor","Opens terminal"]'::jsonb, 1, 'It multi-selects every occurrence for batch edits.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005116');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005117', '00000000-0000-4000-8000-000000002009', 'What is Emmet used for?', '["Formatting CSS","Fast HTML generation with abbreviations","Running tests","Managing git"]'::jsonb, 1, 'Emmet expands abbreviations like ul>li*3.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005117');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005118', '00000000-0000-4000-8000-000000002009', 'Which command stages all changes?', '["git commit -m","git add .","git push","git stage"]'::jsonb, 1, 'git add . moves changes into staging.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005118');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005119', '00000000-0000-4000-8000-000000002009', 'What does git commit create?', '["A backup file","A snapshot with a message","A branch","A pull request"]'::jsonb, 1, 'Commits are labeled snapshots of your work.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005119');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005120', '00000000-0000-4000-8000-000000002009', 'How do you discard uncommitted changes to a file?', '["git delete","git restore file","git reset --push","git undo"]'::jsonb, 1, 'git restore brings the file back to the last commit.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005120');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005121', '00000000-0000-4000-8000-000000002009', 'What is a pull request?', '["A request to push","A proposal to merge a branch via review","A git command","A bug report"]'::jsonb, 1, 'PRs propose and review changes before merging.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005121');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005122', '00000000-0000-4000-8000-000000002009', 'What does formatOnSave do?', '["Saves automatically","Formats code every time you save","Deletes whitespace","Runs git"]'::jsonb, 1, 'Prettier formats on every save — consistent code for free.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005122');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005123', '00000000-0000-4000-8000-000000002010', 'What is the golden prompt formula?', '["Role + Task + Context + Format + Example","Just a question","A paragraph of text","Keywords only"]'::jsonb, 0, 'Role, task, context, format and examples give expert results.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005123');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005124', '00000000-0000-4000-8000-000000002010', 'What does chain-of-thought prompting ask for?', '["Faster answers","Step-by-step reasoning","Shorter answers","More keywords"]'::jsonb, 1, 'Asking for step-by-step reasoning improves accuracy.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005124');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005125', '00000000-0000-4000-8000-000000002010', 'What is an Artifact in Claude?', '["A saved chat","A mini app/snippet you can edit in the chat","A plugin","A PDF"]'::jsonb, 1, 'Artifacts are editable mini apps built in conversation.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005125');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005126', '00000000-0000-4000-8000-000000002010', 'What do Claude Projects add?', '["More chat colors","A knowledge base for your context","Faster replies","Voice calls"]'::jsonb, 1, 'Projects ground answers in your own documents.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005126');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005127', '00000000-0000-4000-8000-000000002010', 'What do ChatGPT Custom Instructions do?', '["Change the theme","Pre-train the model to know you","Add emojis","Block ads"]'::jsonb, 1, 'Custom instructions personalize every response.', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005127');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005128', '00000000-0000-4000-8000-000000002010', 'What is the 20% rule?', '["AI needs 20% more RAM","Verify the last 20% of AI output yourself","AI is 20% accurate","Wait 20 minutes"]'::jsonb, 1, 'AI is ~80% right — your review is essential.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005128');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005129', '00000000-0000-4000-8000-000000002010', 'What should you NEVER paste into an AI chat?', '["Course notes","API keys and passwords","Code snippets","English text"]'::jsonb, 1, 'Secrets and personal data must never go into chats.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005129');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005130', '00000000-0000-4000-8000-000000002010', 'Which iteration improves an AI answer?', '["Start a new chat every time","Refine in the same conversation","Ask once only","Copy the output"]'::jsonb, 1, 'Same-conversation iteration leverages context.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005130');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005131', '00000000-0000-4000-8000-000000002011', 'Which Gmail shortcut archives a message?', '["C","E","A","S"]'::jsonb, 1, 'E archives; C composes.', 0
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005131');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005132', '00000000-0000-4000-8000-000000002011', 'What do Gmail filters do?', '["Delete emails automatically","Auto-label, archive or forward based on rules","Block senders","Create labels"]'::jsonb, 1, 'Filters run rules on incoming mail automatically.', 1
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005132');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005133', '00000000-0000-4000-8000-000000002011', 'How do you place one file in two Drive folders?', '["Copy it","Shift+Z add to folder","Move it twice","You can''t"]'::jsonb, 1, 'Shift+Z adds the same file to another folder.', 2
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005133');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005134', '00000000-0000-4000-8000-000000002011', 'What does @mention do in Docs?', '["Formats text","Notifies a person and links them","Adds a table","Checks spelling"]'::jsonb, 1, '@ mentions notify people and embed entities.', 3
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005134');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005135', '00000000-0000-4000-8000-000000002011', 'Which Docs feature types your words?', '["Auto-correct","Voice typing","Dictation only on mobile","Magic write"]'::jsonb, 1, 'Tools → Voice typing (Ctrl+Shift+S).', 4
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005135');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005136', '00000000-0000-4000-8000-000000002011', 'What does the Explore button in Sheets do?', '["Searches the web","Suggests charts and insights from data","Adds emojis","Prints"]'::jsonb, 1, 'Explore auto-generates charts and analysis.', 5
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005136');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005137', '00000000-0000-4000-8000-000000002011', 'How do you add a Meet link to an event?', '["Add URL manually","Check ''Add Google Meet'' when creating","It''s automatic always","Ask attendees"]'::jsonb, 1, 'Events created with the Meet option get a link.', 6
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005137');


insert into public.mcq_questions (id, course_id, question, options, answer, explanation, order_index)
select '00000000-0000-4000-8000-000000005138', '00000000-0000-4000-8000-000000002011', 'What is ''Focus time'' in Calendar?', '["A vacation","A block you set for deep work","A meeting type","A notification"]'::jsonb, 1, 'Focus time reserves distraction-free blocks.', 7
where not exists (select 1 from mcq_questions where id = '00000000-0000-4000-8000-000000005138');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006083', '00000000-0000-4000-8000-000000002001', 'HTML & CSS Cheat Sheet', 'note', '/resources/html-css-cheatsheet.md', 'Every tag, selector and layout pattern in one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006083');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006084', '00000000-0000-4000-8000-000000002001', 'Official Docs & Latest Resources', 'link', 'https://developer.mozilla.org/en-US/docs/Learn_web_development', 'MDN Learn — the industry-standard reference.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006084');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006085', '00000000-0000-4000-8000-000000002002', 'JavaScript Cheat Sheet', 'note', '/resources/javascript-cheatsheet.md', 'Syntax, arrays, objects, async — quick lookup.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006085');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006086', '00000000-0000-4000-8000-000000002002', 'MDN JavaScript Guide', 'link', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'The authoritative JavaScript reference.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006086');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006087', '00000000-0000-4000-8000-000000002003', 'Python Cheat Sheet', 'note', '/resources/python-cheatsheet.md', 'Syntax, data types, loops and files — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006087');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006088', '00000000-0000-4000-8000-000000002003', 'Official Python Docs', 'link', 'https://docs.python.org/3/tutorial/', 'The official tutorial — free, complete.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006088');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006089', '00000000-0000-4000-8000-000000002004', 'Java Cheat Sheet', 'note', '/resources/java-cheatsheet.md', 'Syntax, OOP, collections — quick lookup.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006089');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006090', '00000000-0000-4000-8000-000000002004', 'Oracle Java Tutorials', 'link', 'https://docs.oracle.com/javase/tutorial/', 'Official free Java tutorials.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006090');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006091', '00000000-0000-4000-8000-000000002005', 'Excel & Sheets Cheat Sheet', 'note', '/resources/excel-cheatsheet.md', 'Formulas, shortcuts, pivots — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006091');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006092', '00000000-0000-4000-8000-000000002005', 'Microsoft Excel Training', 'link', 'https://support.microsoft.com/en-us/training', 'Free official Excel tutorials.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006092');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006093', '00000000-0000-4000-8000-000000002006', 'Word & PowerPoint Cheat Sheet', 'note', '/resources/office-cheatsheet.md', 'Formatting, design rules, shortcuts — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006093');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006094', '00000000-0000-4000-8000-000000002006', 'Microsoft 365 Training Hub', 'link', 'https://support.microsoft.com/en-us/training', 'Free official Word + PowerPoint courses.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006094');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006095', '00000000-0000-4000-8000-000000002007', 'Power BI Cheat Sheet', 'note', '/resources/powerbi-cheatsheet.md', 'Pipeline, DAX, visuals — quick lookup.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006095');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006096', '00000000-0000-4000-8000-000000002007', 'Microsoft Learn: Power BI', 'link', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', 'Free official Power BI learning path.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006096');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006097', '00000000-0000-4000-8000-000000002008', 'Figma Cheat Sheet', 'note', '/resources/figma-cheatsheet.md', 'Shortcuts, Auto Layout, components — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006097');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006098', '00000000-0000-4000-8000-000000002008', 'Figma Learn Hub', 'link', 'https://help.figma.com/hc/en-us', 'Official Figma documentation & tutorials.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006098');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006099', '00000000-0000-4000-8000-000000002009', 'VS Code + Git Cheat Sheet', 'note', '/resources/vscode-cheatsheet.md', 'Shortcuts, extensions, git commands — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006099');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006100', '00000000-0000-4000-8000-000000002009', 'Git Official Docs', 'link', 'https://git-scm.com/doc', 'The definitive Git documentation.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006100');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006101', '00000000-0000-4000-8000-000000002010', 'ChatGPT & Claude Cheat Sheet', 'note', '/resources/ai-cheatsheet.md', 'Prompt patterns, tips, safety rules — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006101');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006102', '00000000-0000-4000-8000-000000002010', 'Prompt Engineering Guide', 'link', 'https://www.promptingguide.ai', 'The open-source prompting bible.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006102');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006103', '00000000-0000-4000-8000-000000002011', 'Google Workspace Cheat Sheet', 'note', '/resources/google-workspace-cheatsheet.md', 'Gmail, Docs, Sheets, Slides, Drive — one page.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006103');


insert into public.course_materials (id, course_id, title, material_type, file_url, description, created_at)
select '00000000-0000-4000-8000-000000006104', '00000000-0000-4000-8000-000000002011', 'Google Workspace Learning Center', 'link', 'https://workspace.google.com/learning-center/', 'Free official Google Workspace training.', now()
where not exists (select 1 from course_materials where id = '00000000-0000-4000-8000-000000006104');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007071', '00000000-0000-4000-8000-000000002001', 'Build Your First Landing Page', 'Build a one-page landing page with:
1. A header with your name/logo and 3 nav links
2. A hero section with an <h1>, a subtitle and a call-to-action button
3. A 3-card feature section using CSS Grid
4. A footer with links
Style it with a dark theme, use the 60-30-10 rule, and make it responsive with minmax grid columns.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007071');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007072', '00000000-0000-4000-8000-000000002002', 'Interactive Counter App', 'Build a counter app:
1. A big number display
2. + and - buttons that update it
3. A Reset button
4. A Like button that turns green and shows "Liked ✓" after click
Bonus: cap the counter between 0 and 100 and show a message when it hits the limit. Use addEventListener and textContent — no innerHTML hacks.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007072');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007073', '00000000-0000-4000-8000-000000002003', 'Gradebook App', 'Write a Python script that:
1. Reads a CSV of students: name, score
2. Computes pass/fail (>= 70) and the class average
3. Prints a summary table
4. Saves results to results.txt
Create a sample CSV yourself with 8 students. Bonus: use a dict comprehension and handle a missing file gracefully with try/except.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007073');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007074', '00000000-0000-4000-8000-000000002004', 'Course Catalog', 'Build a Course class (title, category, durationMinutes, free boolean) and a Main that:
1. Creates 5 courses
2. Prints only free courses
3. Sorts by duration (shortest first)
4. Prints the average duration
Use ArrayList, a stream pipeline, and a constructor. Bonus: add a findByName method.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007074');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007075', '00000000-0000-4000-8000-000000002005', 'Personal Budget Tracker', 'Build a monthly budget workbook:
1. Income sheet: 3-5 income sources
2. Expenses sheet: 15+ expenses with Category and Date columns
3. A SUM of expenses by category (pivot or SUMIF)
4. Savings formula: income − expenses
5. A donut chart of spending by category
6. Conditional formatting: any category over 30% of income highlighted red', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007075');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007076', '00000000-0000-4000-8000-000000002006', 'One-Page Report', 'Create a one-page professional report:
1. Title + subtitle with styles
2. Three sections with Heading 1 + paragraph each
3. One 3-column table with repeat header
4. One wrapped image
5. Auto-generated table of contents
6. A footer with page number
Export as PDF from File → Export.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007076');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007077', '00000000-0000-4000-8000-000000002007', 'Executive One-Pager', 'Using the Financial Sample dataset:
1. One page dashboard
2. 4 KPI cards (Sales, Profit, Profit %, Avg Order)
3. Line chart: monthly sales with YoY comparison
4. Bar chart: sales by product (sorted desc)
5. Matrix: country × year with totals
6. 2 slicers (segment, product)
7. Title that states the key insight
Publish and share.', 0, 'Intermediate', 60, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007077');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007078', '00000000-0000-4000-8000-000000002008', 'Course Card Component', 'Design a reusable Course Card:
1. Component: thumbnail image, title, instructor, progress bar, "Continue" button
2. Variants: Default / Hover / Completed
3. Auto Layout with 12px padding, 8pt spacing
4. Desktop (360px wide) and mobile (fill) versions
5. Create styles: brand/primary, text/heading, text/body
Export one instance as PNG 2x via Dev Mode.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007078');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007079', '00000000-0000-4000-8000-000000002009', 'My First Repo', 'Create and publish a repository:
1. index.html + style.css + README.md
2. Commit: "feat: initial page"
3. Second commit: "fix: responsive grid"
4. Create branch feature-dark-mode → switch → modify → commit → merge back
5. Push to GitHub and enable GitHub Pages
Submit the URL.', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007079');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007080', '00000000-0000-4000-8000-000000002010', 'Your AI Study System', 'Build a personal AI study system:
1. Write custom instructions for ChatGPT (learner profile + format preferences)
2. Create a Claude Project with your course notes as knowledge base
3. Generate a 7-day study plan for your current course
4. Run an AI quiz on lesson 1 and note 2 mistakes
5. Ask Claude to review your resume vs a real job description
6. Document your best 3 prompts in a markdown file', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007080');


insert into public.course_assignments (id, course_id, title, prompt, order_index, difficulty, points_reward, created_at)
select '00000000-0000-4000-8000-000000007081', '00000000-0000-4000-8000-000000002011', 'Team Project Simulator', 'Simulate a team project:
1. Create a shared Drive folder + share as Editor
2. Docs: project brief with 3 sections + @-mention a classmate
3. Sheets: task tracker (Owner, Status, Due date) with conditional formatting + a chart
4. Slides: 4-slide status deck using Explore layouts
5. Calendar: schedule the kickoff with a Meet link
6. Gmail: label it and set a filter for reminders', 0, 'Beginner', 50, now()
where not exists (select 1 from course_assignments where id = '00000000-0000-4000-8000-000000007081');


update public.courses set updated_at = now() where slug in ('html-css-essentials', 'javascript-zero-to-pro', 'python-for-everyone', 'java-fundamentals', 'excel-sheets-mastery', 'word-powerpoint-pro', 'power-bi-visuals', 'figma-ui-bootcamp', 'vs-code-git-essentials', 'chatgpt-claude-ai', 'google-workspace-pro');
