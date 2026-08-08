-- Add 'First Understanding' (top) and 'Suggestions and Tips' (bottom) to all lessons across all courses.

update public.lessons set content_md = $md$## First Understanding

- Every website is a conversation: your **browser asks** for files, a **server answers** — no code required to understand this flow.
- Three languages split the work: **HTML** is the content, **CSS** is the looks, **JavaScript** is the behavior.
- You never see the raw files — the browser translates them into the page you interact with.$md$ || content_md || $md$

## Suggestions and Tips

- Right-click any page → **Inspect** to see exactly which HTML, CSS and JS built it — it's free education.
- Don't memorise code yet; memorise the *roles* of each language first.
- Bookmark this lesson's diagram — it's the map for everything that follows.
$md$ where id = '00000000-0000-4000-8000-000000000121'::uuid;

update public.lessons set content_md = $md$## First Understanding

- HTML is a stack of **tags** — keywords in angle brackets like `<h1>` that give content meaning.
- Most tags come in pairs: an **opening** tag and a **closing** tag with a slash `</h1>`.
- Every template, page and card you have ever seen is just nested tags.$md$ || content_md || $md$

## Suggestions and Tips

- Type `!` in VS Code and press Tab to get a full HTML skeleton instantly (Emmet).
- Keep nesting tidy — indented HTML is readable HTML; browsers don't care, you will.
- Use the Elements panel in DevTools to temporarily edit any page's HTML live.
$md$ where id = '00000000-0000-4000-8000-000000000122'::uuid;

update public.lessons set content_md = $md$## First Understanding

- CSS is written as **selector → property → value**: `p { color: red }` means 'paint every paragraph red'.
- The **cascade** decides conflicts: later rules and more specific selectors win.
- CSS only *paints* — it never moves or changes content, only its appearance.$md$ || content_md || $md$

## Suggestions and Tips

- Put styles in one external `.css` file, not inline — one change updates every page.
- Use **classes** (`.btn`) instead of tag names for styles you plan to reuse.
- Open DevTools → Styles and edit values live to preview before committing.
$md$ where id = '00000000-0000-4000-8000-000000000123'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The professional workflow is a 5-step loop: **download → open → edit → preview → deploy**.
- Text lives in HTML, looks live in CSS — editing a template means editing both, not fighting them.
- A template is a starting line, not a finish line — your edits make it yours.$md$ || content_md || $md$

## Suggestions and Tips

- Edit text in the HTML first and colors in the CSS — that covers 80% of template work.
- Preview in your browser after every small change; save early, save often.
- Pick one template and finish it — editing ten halfway teaches you nothing.
$md$ where id = '00000000-0000-4000-8000-000000000124'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Real pages are **sections stacked vertically**: navbar, hero, features, footer.
- Inside a section, **Flexbox** arranges items in rows or columns and handles spacing.
- Every element is a **box**: content → padding → border → margin — the 'box model'.$md$ || content_md || $md$

## Suggestions and Tips

- `display: flex` plus `gap` solves 90% of alignment problems — no margins needed.
- `flex-direction: column` is the default for most page stacks; switch to `row` for navbars.
- Inspect an element to see its box model highlighted in DevTools — pure clarity.
$md$ where id = '00000000-0000-4000-8000-000000000125'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The **60-30-10 rule**: 60% neutral base, 30% secondary, 10% accent — instantly professional palettes.
- Fonts have personality: pair one display font (headings) with one readable font (body).
- Colors, fonts and images are your brand — the fastest way to make a template feel yours.$md$ || content_md || $md$

## Suggestions and Tips

- Steal palettes from real sites (DevTools → color picker) instead of guessing.
- Compress images before uploading — heavy images are the #1 slow-site cause.
- If in doubt, remove one color rather than adding one.
$md$ where id = '00000000-0000-4000-8000-000000000126'::uuid;

update public.lessons set content_md = $md$## First Understanding

- JavaScript lives in the browser and reacts to **events** — clicks, typing, scrolls.
- It is the only one of the three languages that can *think*: change content, decide, respond.
- You do not need to write everything yourself — modern templates ship with working JS.$md$ || content_md || $md$

## Suggestions and Tips

- Use `console.log()` to see what your code is doing — it's your debugger best friend.
- Prefer `const` for variables that should never change; use `let` only when you must reassign.
- Start with one tiny interaction (`onclick`) instead of reading framework docs.
$md$ where id = '00000000-0000-4000-8000-000000000127'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Forms are how a website becomes an **app** — they take input, JavaScript validates and responds.
- `preventDefault()` stops the page from reloading and wiping your work when a form submits.
- Feedback is the contract: every input should confirm success or explain failure.$md$ || content_md || $md$

## Suggestions and Tips

- Use the `required` attribute for must-haves — validation without writing JS.
- Always label inputs; labels are clickable and accessible.
- Show errors *next to* the field, in plain language, the moment the user can fix them.
$md$ where id = '00000000-0000-4000-8000-000000000128'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Transitions** animate state changes (hover, focus); **keyframes** run continuous animations like floating logos.
- Motion tells the brain what is interactive — it guides, not decorates.
- The right duration (200–300ms) feels natural; too fast is jarring, too slow is sluggish.$md$ || content_md || $md$

## Suggestions and Tips

- Apply `transition` to hover states first — it is the highest-impact, lowest-effort motion.
- Use `ease` or `ease-out` curves; avoid `linear` — it looks robotic.
- If an animation does not communicate something, delete it.
$md$ where id = '00000000-0000-4000-8000-000000000129'::uuid;

update public.lessons set content_md = $md$## First Understanding

- 70% of web traffic is mobile — a desktop-only page is a page half the world cannot use.
- **Media queries** apply different CSS at different screen widths; the pattern is **mobile-first**.
- Responsive pages *reflow* — content stacks and resizes instead of shrinking to unreadable.$md$ || content_md || $md$

## Suggestions and Tips

- Test on a real phone, not just the responsive toggle — touch sizes differ.
- Prefer `rem` over `px` for font sizes so user zoom and accessibility settings work.
- Set breakpoints where the layout *breaks* (375px, 768px, 1024px), not on device names.
$md$ where id = '00000000-0000-4000-8000-000000000130'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Deploying = putting your files on a server the whole world can reach — and it is free.
- Static sites (your template) need no backend: Netlify, Vercel and GitHub Pages serve them directly.
- You get a live URL in minutes; a custom domain makes it look serious.$md$ || content_md || $md$

## Suggestions and Tips

- Drag-and-drop deploy on Netlify is enough for your first site — no terminal needed.
- Change a file? Redeploy — static hosting keeps serving the old version until you push.
- Add your deployed URL to your resume — a live link beats a screenshot every time.
$md$ where id = '00000000-0000-4000-8000-000000000131'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The mission: build a **one-page portfolio** from a template and deploy it — navbar, hero, about, projects, contact.
- This project bundles everything: editing HTML, styling CSS, adding one JS interaction, deploying.
- A finished imperfect site beats a perfect unfinished one.$md$ || content_md || $md$

## Suggestions and Tips

- Follow the checklist lesson by lesson — each requirement maps to a skill you already practiced.
- Deploy even if you are not 100% happy; iterate live, then re-deploy.
- Put the live URL in your resume and on LinkedIn the day you ship it.
$md$ where id = '00000000-0000-4000-8000-000000000132'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A page is **three layers**: HTML content, CSS presentation, JS behavior — the browser merges them.
- The browser **requests** files (HTML, CSS, JS, images) and **renders** them into a page.
- You can peek at any site's recipe with **View Source** or DevTools.$md$ || content_md || $md$

## Suggestions and Tips

- Open DevTools (F12) on your favorite site and explore — 10 minutes here beats 10 hours of theory.
- Build the habit of asking *'which layer is this?'* whenever you see a page element.
- Start every project with HTML first, then CSS, then JS — in that order.
$md$ where id = '00000000-0000-4000-8000-000000004041'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A page is a **document**: `<!DOCTYPE html>`, `<html>`, `<head>` (info) and `<body>` (content).
- Tags nest like boxes inside boxes — closing order mirrors opening order.
- Your first page needs only a title and one heading to be a real webpage.$md$ || content_md || $md$

## Suggestions and Tips

- Type `!` + Tab in VS Code for the HTML skeleton — never type it by hand.
- Save with `.html` and open in your browser — no server needed.
- Break pages on purpose to see what breaks — it teaches how browsers forgive (and don't).
$md$ where id = '00000000-0000-4000-8000-000000004042'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Semantic tags (`header`, `nav`, `main`, `footer`) describe *meaning*, not just appearance.
- Clean structure = better accessibility (screen readers) and better SEO.
- One `<h1>` per page, real links in `<a>`, text in `<p>` — structure before style.$md$ || content_md || $md$

## Suggestions and Tips

- Use `main` once per page — it's the landmark screen readers jump to.
- Add `alt` text to every image; if the image is decoration, `alt=""` is correct.
- When in doubt, pick the most descriptive tag — a `button` beats a `div` that acts like one.
$md$ where id = '00000000-0000-4000-8000-000000004043'::uuid;

update public.lessons set content_md = $md$## First Understanding

- CSS = `selector { property: value }` — you point at elements and paint them.
- Three ways to attach CSS: inline, embedded `<style>`, external file — external wins for real projects.
- The **cascade + specificity** decides which rule wins when rules conflict.$md$ || content_md || $md$

## Suggestions and Tips

- Link one external stylesheet in `<head>` — one change updates the whole site.
- Name classes by *what they do* (`.card`, `.btn-primary`), not how they look.
- DevTools → Styles: edit values live, copy the winning result.
$md$ where id = '00000000-0000-4000-8000-000000004044'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Flexbox** lays out items along one axis (row or column); **Grid** works in two dimensions.
- `display: grid` on the parent creates rows and columns; children flow into cells.
- Both replace floats and magic margins — modern layout is predictable now.$md$ || content_md || $md$

## Suggestions and Tips

- Flexbox for components (navbars, cards), Grid for whole-page layouts — a classic split.
- `gap` handles spacing; delete every margin you added for layout.
- Visualize layout by adding a temporary `outline: 1px solid red` to containers.
$md$ where id = '00000000-0000-4000-8000-000000004045'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **60-30-10**: 60% base, 30% secondary, 10% accent — the fastest professional palette formula.
- Typography carries the mood: a display font for headings, a readable one for body.
- Whitespace is a design element — empty space makes content expensive-looking.$md$ || content_md || $md$

## Suggestions and Tips

- Use CSS custom properties (`:root { --brand: #0ea5e9 }`) to change your whole theme in one line.
- Contrast-check text against its background (webaim.org/contrastchecker) before shipping.
- Pick 2 fonts max — a third is a bug, not a feature.
$md$ where id = '00000000-0000-4000-8000-000000004046'::uuid;

update public.lessons set content_md = $md$## First Understanding

- JavaScript is the **behavior layer** — it runs in the browser, reacts to events, and changes pages live.
- It is a full programming language: variables, functions, loops — not just page effects.
- Every interaction you love (autocomplete, dark mode, infinite scroll) is JS.$md$ || content_md || $md$

## Suggestions and Tips

- `console.log()` is your microscope — log everything while learning.
- Open the Console tab and type code directly; the browser is your playground.
- Write tiny scripts for real annoyances — automating one chore teaches more than 50 tutorials.
$md$ where id = '00000000-0000-4000-8000-000000004047'::uuid;

update public.lessons set content_md = $md$## First Understanding

- `const` for values that never change, `let` for values that do — default to `const`.
- JS types are dynamic: the same variable can hold strings, numbers, booleans.
- `===` compares value *and* type — always prefer it over `==`.$md$ || content_md || $md$

## Suggestions and Tips

- Name variables by intent (`totalPrice`, not `tp`) — future-you will thank present-you.
- Template literals (backticks + `${}`) beat string concatenation for readability.
- Memorize `NaN`, `null`, `undefined` — the three flavors of 'nothing' — before writing logic.
$md$ where id = '00000000-0000-4000-8000-000000004048'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Functions package logic for reuse: `function greet() {}` or the modern `const greet = () => {}`.
- Arrow functions are concise and, unlike `function`, don't rebind `this` — prefer them in modern code.
- Good functions do one job, take inputs, and return outputs — pure and predictable.$md$ || content_md || $md$

## Suggestions and Tips

- Write small functions with clear names; you can read them without comments.
- Pass data in and return data out — avoid functions that mutate global state.
- Default parameters (`(name = 'friend')`) handle missing arguments elegantly.
$md$ where id = '00000000-0000-4000-8000-000000004049'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The **DOM** is the browser's live tree of your page — JavaScript reads and changes it.
- `document.querySelector('.btn')` finds an element; `.textContent` changes it.
- The DOM is *live*: after your script runs, the page shows the new state immediately.$md$ || content_md || $md$

## Suggestions and Tips

- Cache selectors in variables — querying the DOM repeatedly is slow.
- Use **event delegation**: listen on a parent once instead of every child.
- Change content with `.textContent` (safe); `innerHTML` with user data can inject scripts.
$md$ where id = '00000000-0000-4000-8000-000000004050'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Arrays** are ordered lists (`[1, 2, 3]`); **objects** are key-value records (`{name: 'Ada'}`).
- `map`, `filter`, `reduce` transform arrays without messy loops — the modern trio.
- Real apps are mostly 'load data → transform → render'; arrays and objects are the currency.$md$ || content_md || $md$

## Suggestions and Tips

- Use **destructuring** (`const {name} = user`) to pluck values cleanly.
- Prefer creating new arrays (`map`, `spread`) over mutating in place — fewer bugs.
- Print JSON with `JSON.stringify(data, null, 2)` for readable debugging.
$md$ where id = '00000000-0000-4000-8000-000000004051'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Async** means the browser keeps working while data travels — that's what `async/await` expresses.
- `fetch(url)` talks to real APIs and returns a Promise; `await` unpacks the response.
- The network is untrusted: always handle errors and loading states.$md$ || content_md || $md$

## Suggestions and Tips

- Wrap awaits in `try/catch` — a failed API call should show a message, not a blank page.
- Show loading feedback; fetch is fast locally and slow in production.
- Start with free public APIs (JSONPlaceholder, weather) — no auth needed.
$md$ where id = '00000000-0000-4000-8000-000000004052'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Python reads like English — the shortest distance between your idea and running code.
- One language powers web, data science, AI and automation — its ecosystem is its superpower.
- Its philosophy: explicit beats implicit — code says what it does.$md$ || content_md || $md$

## Suggestions and Tips

- Run Python in your terminal (`python`) for instant experiments — no files needed.
- Read error messages from the bottom: the last line names the actual problem.
- Use AI assistants to explain errors, not to write your homework for you.
$md$ where id = '00000000-0000-4000-8000-000000004053'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Variables are labeled boxes: `name = 'Ada'` — types are inferred, not declared.
- **f-strings** (`f"Hi {name}"`) embed values directly into text — the modern way.
- `type()` reveals a variable's type; mismatches are the most common beginner crash.$md$ || content_md || $md$

## Suggestions and Tips

- Use meaningful, lowercase names with underscores (`user_score`, not `us`).
- Add **type hints** (`def add(a: int, b: int) -> int:`) — free documentation, optional at runtime.
- Debug with f-strings: `print(f"score={score}")` beats guessing.
$md$ where id = '00000000-0000-4000-8000-000000004054'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Lists** are ordered sequences `[1, 2, 3]`; **dictionaries** map keys to values `{'name': 'Ada'}`.
- `for` loops iterate anything; `range()` loops a number of times.
- Choose the right container and half your code writes itself.$md$ || content_md || $md$

## Suggestions and Tips

- `dict.get(key, default)` avoids KeyError crashes — prefer it over `dict[key]`.
- List comprehensions `[x*2 for x in nums]` replace loops for simple transforms.
- `enumerate(lst)` gives index and value together — no manual counters.
$md$ where id = '00000000-0000-4000-8000-000000004055'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Functions (`def`) package logic; `if/elif/else` branch; `try/except` catches failures.
- Errors are data, not disasters: catch the ones you expect, let the rest crash loudly.
- Small, single-purpose functions are easier to test and reuse.$md$ || content_md || $md$

## Suggestions and Tips

- **Return early** — handle the failure case first, then the happy path flows cleanly.
- Catch specific exceptions (`except ValueError`), not a blanket `except:`.
- `raise` with a clear message beats silent failure — cryptic bugs are born in silence.
$md$ where id = '00000000-0000-4000-8000-000000004056'::uuid;

update public.lessons set content_md = $md$## First Understanding

- `with open(...) as f:` opens files and *guarantees* they close — the standard pattern.
- The `csv` module reads/writes spreadsheets with three lines of code.
- Files are just text or structured rows — persistence is a solved problem in Python.$md$ || content_md || $md$

## Suggestions and Tips

- Always use `with` — files left open cause corruption on Windows and resource leaks everywhere.
- Specify `encoding='utf-8'` when opening — the #1 cross-platform crash.
- Test with a tiny sample file before running on your real data.
$md$ where id = '00000000-0000-4000-8000-000000004057'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Your first real program: a **CLI that tracks XP** — menu loop, data storage, and persistence combined.
- Project work is where skills stick: you now read errors, structure code, and iterate solo.
- Input → process → output → save: every app you'll ever build is this loop.$md$ || content_md || $md$

## Suggestions and Tips

- Sketch the menu and functions on paper before writing code — planning is 50% of the project.
- Run after every small addition; debug ten lines now, not a hundred later.
- Add one stretch feature (stats, reset) — finishing extra credit is the best confidence boost.
$md$ where id = '00000000-0000-4000-8000-000000004058'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Java runs on the **JVM** — write once, run on any device with a Java runtime.
- It is the backbone of enterprise: banks, Android, and huge backend systems.
- Strong typing catches bugs at compile time — before users ever see them.$md$ || content_md || $md$

## Suggestions and Tips

- Judge the language by its ecosystem and job market, not by hype.
- Install the JDK now; every lesson builds on code you can compile locally.
- Java rewards patience: verbose today, maintainable for decades.
$md$ where id = '00000000-0000-4000-8000-000000004059'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Every Java program needs a `class` and a `main` method — that's the entry point.
- **Primitives** (`int`, `double`, `boolean`) hold values; **objects** hold state and behavior.
- `System.out.println()` is your output window; compile errors are your guide.$md$ || content_md || $md$

## Suggestions and Tips

- Name classes with PascalCase (`StudentManager`) and variables camelCase (`studentName`).
- Fix compile errors one at a time — the first error is usually the real one.
- Use IntelliJ IDEA Community — free, and it auto-completes the boilerplate.
$md$ where id = '00000000-0000-4000-8000-000000004060'::uuid;

update public.lessons set content_md = $md$## First Understanding

- `if/else` branches, `for`/`while` repeat, arrays store lists with **zero-based** indexes.
- These three tools express almost every program you'll write this year.
- Loops + conditions = the thinking machine of Java.$md$ || content_md || $md$

## Suggestions and Tips

- Watch off-by-one errors: array of size 3 has indexes 0, 1, 2.
- Use the enhanced `for` (`for (int x : nums)`) to avoid index arithmetic.
- Break out of loops early (`break`) when you found what you needed.
$md$ where id = '00000000-0000-4000-8000-000000004061'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A **class** is a blueprint; an **object** is a working instance made from it.
- **Encapsulation**: keep fields `private`, expose behavior through methods.
- OOP models the world: a `Student` has state (name, marks) and actions (study).$md$ || content_md || $md$

## Suggestions and Tips

- Start fields `private` and add getters/setters only when needed — less code, fewer bugs.
- One class = one responsibility; if a class does two jobs, split it.
- Constructors set up valid initial state — use them, don't build objects by setters.
$md$ where id = '00000000-0000-4000-8000-000000004062'::uuid;

update public.lessons set content_md = $md$## First Understanding

- `ArrayList` = growable ordered list; `HashMap` = fast key→value lookups.
- Collections replace raw arrays for almost all real code — they manage size for you.
- **Generics** (`List<String>`) declare the element type; the compiler enforces it.$md$ || content_md || $md$

## Suggestions and Tips

- Use interfaces (`List`, `Map`) as variable types; swap implementations without touching code.
- `HashMap` lookup is O(1) — for 'find by id', use a map, not a loop.
- Wrap legacy arrays in `List.of(...)` to use modern collection APIs.
$md$ where id = '00000000-0000-4000-8000-000000004063'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The project: a **Student Manager** — add, list, search and remove students in memory.
- It stitches together: classes, collections, conditionals and loops.
- A working console app proves you can design, not just type.$md$ || content_md || $md$

## Suggestions and Tips

- Design the `Student` class first, then the menu logic, then wire them together.
- Use a `HashMap<Integer, Student>` keyed by roll number — instant lookup.
- Test every menu option in the same order a user would.
$md$ where id = '00000000-0000-4000-8000-000000004064'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A **workbook** holds **sheets**; every sheet is a grid of cells addressed as `A1`, `B2`…
- The ribbon groups features; most pro work needs only 10% of them.
- Excel rewards keyboard-first habits — the mouse is the slow path.$md$ || content_md || $md$

## Suggestions and Tips

- Make `Ctrl+S` a reflex — autosave is not backup.
- `Ctrl+Shift+Arrow` jumps to the edge of data — instant navigation.
- Name your sheets (`Sales`, `Data`) — future-you and coworkers will navigate instantly.
$md$ where id = '00000000-0000-4000-8000-000000004065'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A handful of formulas — `SUM`, `IF`, `VLOOKUP`, `SUMIFS`, `INDEX-MATCH` — cover most real work.
- Formulas should reference **cells**, not typed values — they update when data changes.
- `SUMIFS`/`COUNTIFS` with multiple criteria replace hours of manual filtering.$md$ || content_md || $md$

## Suggestions and Tips

- Press `F4` to lock a reference (`$A$1`) when copying formulas across rows.
- Wrap lookups in `IFERROR(..., "")` so missing values don't scream `#N/A`.
- Build formulas in steps: compute one piece, verify, then combine.
$md$ where id = '00000000-0000-4000-8000-000000004066'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Real data is messy: extra spaces, mixed types, duplicates, inconsistent formats.
- `TRIM`, Text-to-Columns, Remove Duplicates and Find & Replace handle 90% of mess.
- Cleaning is repeatable work — automate it in **Power Query** so it runs forever.$md$ || content_md || $md$

## Suggestions and Tips

- Always copy the raw sheet to a `_raw` tab before touching it.
- Text-to-Columns splits names and dates in one click — a top-3 time saver.
- Promote headers and check data types after every import — garbage in, garbage out.
$md$ where id = '00000000-0000-4000-8000-000000004067'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A **Pivot Table** summarizes thousands of rows with drag-and-drop — no formulas.
- Rows/Columns = categories, Values = numbers, Filters = slices.
- Every 'group by X, sum of Y' question is a pivot.$md$ || content_md || $md$

## Suggestions and Tips

- Format your source as a **Table** (Ctrl+T) first — pivots then auto-expand with new rows.
- Refresh after source changes — pivots do not auto-update.
- Add **slicers** for clickable filters; dashboards are 10 minutes away.
$md$ where id = '00000000-0000-4000-8000-000000004068'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Choose the chart by the question: **bar** = compare, **line** = trend, **pie** = share (≤5 slices).
- A truthful chart has a title, labeled axes, and no misleading scaling.
- The best chart shows one message per glance — clutter is dishonesty.$md$ || content_md || $md$

## Suggestions and Tips

- Delete gridlines and legend clutter; label data directly on the chart.
- Never start bar axes at non-zero — it exaggerates differences.
- Use `Combo` charts to plot two units (sales $ + margin %) on two axes.
$md$ where id = '00000000-0000-4000-8000-000000004069'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The project: a **Sales Dashboard** — one workbook that answers: what sold, when, to whom, and for how much.
- It combines tables, formulas, pivots and charts into a single story.
- A dashboard is a question-answer machine, not a data dump.$md$ || content_md || $md$

## Suggestions and Tips

- Sketch the questions first — dashboards built around questions stay useful.
- Use one slicer set to drive every chart — instant interactivity.
- Test with real numbers: a dashboard that only works on sample data is decoration.
$md$ where id = '00000000-0000-4000-8000-000000004070'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Styles** are named formatting recipes — apply one, and the whole doc follows the rules.
- Never format manually; always restyle via Styles so documents stay consistent.
- Navigation, TOC and heading structure in Word all derive from styles.$md$ || content_md || $md$

## Suggestions and Tips

- Start with heading styles (`Heading 1/2/3`), then modify the style once — the whole doc updates.
- Use the Navigation Pane to see your document structure instantly.
- Save a `template.dotx` with your brand fonts and colors — every new doc starts consistent.
$md$ where id = '00000000-0000-4000-8000-000000004071'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Expensive-looking documents come from **restraint**: consistent alignment, spacing, and a narrow palette.
- Tables organize comparisons; images support content, they don't replace it.
- Whitespace and margins are layout — treat them as design, not emptiness.$md$ || content_md || $md$

## Suggestions and Tips

- Align everything to one margin grid; misalignment is the fastest amateur tell.
- Limit to one accent color + black + one font pair per document.
- Convert text to a table when you see repeated patterns (dates, prices, names).
$md$ where id = '00000000-0000-4000-8000-000000004072'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Word and PowerPoint are built for teams: **Comments, Track Changes and Suggesting mode** keep edits reviewable.
- Version history and OneDrive syncing mean no more `_final_v2.docx` chaos.
- Built-in **AI** (Copilot) drafts, summarizes and rewrites — a drafting partner, not a writer.$md$ || content_md || $md$

## Suggestions and Tips

- Use **Suggesting mode** for edits you want reviewed — accept/reject keeps the record clean.
- Name files by date+version (`2026-08-08_report`) and store in the team folder.
- Let AI produce the first draft, then add your expertise — fastest quality loop.
$md$ where id = '00000000-0000-4000-8000-000000004073'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A slide is a **headline + one idea** — if a slide needs paragraphs, split it.
- Design rules (contrast, alignment, proximity, repetition) prevent boring decks.
- The audience remembers 3 messages; build the deck around 3, not 30.$md$ || content_md || $md$

## Suggestions and Tips

- Use the 6x6 rule: ≤6 bullets, ≤6 words each — as a ceiling, not a goal.
- One slide, one chart, one message; title it as the takeaway, not a label.
- Borrow templates you admire — great design is learnable, not a talent.
$md$ where id = '00000000-0000-4000-8000-000000004074'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Morph** transitions animate objects between slides — text and images glide instead of jumping.
- Animations should *sequence attention*, not decorate; entrance + emphasis is usually enough.
- Keyboard shortcuts are the pro speed multiplier (Ctrl+D, Ctrl+Shift+arrow nudge).$md$ || content_md || $md$

## Suggestions and Tips

- Duplicate a slide and move objects — Morph animates the difference. Magic.
- Use `Fade` as the default transition; reserving Morph for key moments keeps it impactful.
- Set the same object position/size across slides to keep videos and demos stable.
$md$ where id = '00000000-0000-4000-8000-000000004075'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The project: a **Career Pitch Deck** — 8-10 slides: hook, problem, story, skills, proof, ask.
- It applies every lesson: styles, design rules, one-message slides, morph for polish.
- A great deck is a conversation starter, not a report.$md$ || content_md || $md$

## Suggestions and Tips

- Write the 3 core messages first; every slide must serve one of them.
- Get one honest peer review before polishing visuals — substance first, shine later.
- Practice the 60-second version; if you can say it in a minute, the deck is ready.
$md$ where id = '00000000-0000-4000-8000-000000004076'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **BI** turns raw data into decisions: connect → transform → model → visualize → share.
- The pipeline is repeatable: one refresh updates every report and dashboard.
- Plan the *questions* before the visuals — tools follow questions.$md$ || content_md || $md$

## Suggestions and Tips

- Keep the data model simple — fewer tables, clear relationships, less pain.
- Define KPIs in words before touching Power BI; vague metrics make vague dashboards.
- Start with one dataset and one dashboard — breadth is a trap.
$md$ where id = '00000000-0000-4000-8000-000000004077'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Power Query** records every transformation as **steps** — your cleaning runs forever, unattended.
- Promote headers, filter rows, merge and split columns — all recorded, all repeatable.
- The M language behind it is optional — 90% of work is point-and-click.$md$ || content_md || $md$

## Suggestions and Tips

- Rename steps like `Promoted Headers`, `Removed Dupes` — future-you will thank you.
- Never clean in Excel and re-import; that breaks the automated pipeline.
- Use the `First Row` / `Use Headers` toggles instead of manual typing when possible.
$md$ where id = '00000000-0000-4000-8000-000000004078'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Measures** compute on the fly (totals, averages, growth); **columns** store row-level values.
- `CALCULATE` is the workhorse — it changes filter context: *sales of X region in Y period*.
- A good measure answers a business question exactly as asked.$md$ || content_md || $md$

## Suggestions and Tips

- Prefer measures over calculated columns — they're faster and respond to slicers.
- Test every measure with two known rows before trusting it.
- Name measures in plain business language (`Total Sales`), not code-speak.
$md$ where id = '00000000-0000-4000-8000-000000004079'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Match the visual to the question: **bar** = ranking, **line** = trend, **KPI card** = single number, **matrix** = detail.
- Every visual must be readable in 3 seconds — labels, colors and scale do that work.
- Too many visuals = no message; edit ruthlessly.$md$ || content_md || $md$

## Suggestions and Tips

- Skip pie charts past 5 slices — a bar chart tells the same story honestly.
- Use KPI cards for the 3 headline numbers; everything else lives below.
- Sort visuals by value by default — alphabetical order hides the story.
$md$ where id = '00000000-0000-4000-8000-000000004080'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A **dashboard** is a story: headline KPIs on top, supporting visuals beneath, all driven by one slicer.
- **Publishing** to the Power BI service enables scheduled refresh and phone access.
- Consistent formatting (colors, fonts, alignment) makes data believable.$md$ || content_md || $md$

## Suggestions and Tips

- Keep dashboards to 5-7 visuals; every extra visual weakens the story.
- Set scheduled refresh so your report ages gracefully, not rot.
- Pin your KPI cards first — the dashboard grows from them.
$md$ where id = '00000000-0000-4000-8000-000000004081'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The project: a **Sales KPI Dashboard** — revenue, growth, region split, top products, trend line.
- It exercises the full pipeline: query, transform, model, measures, visuals, publish.
- A finished dashboard is a portfolio piece — prove it with real data and clean design.$md$ || content_md || $md$

## Suggestions and Tips

- Build the data model and measures first; visuals last.
- Test each measure against a known number before adding its visual.
- Add a text box with the business question — great dashboards show their intent.
$md$ where id = '00000000-0000-4000-8000-000000004082'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Figma is an **infinite canvas** where **Frames** hold designs and layers stack inside them.
- Shortcuts are the difference between hours and minutes — every pro works keyboard-first.
- The canvas is collaborative: teammates see your cursor in real time.$md$ || content_md || $md$

## Suggestions and Tips

- Learn the top 10 shortcuts (V=move, F=frame, R=rect, T=text, Ctrl+D=duplicate) — this week.
- Name layers as you create them; a design without names is unmaintainable.
- Use `F` frames (not the Artboard tool) — the modern, resizable default.
$md$ where id = '00000000-0000-4000-8000-000000004083'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Auto Layout** makes frames that adjust automatically — spacing, padding and alignment as rules.
- It converts static designs into living layouts — the #1 professional superpower.
- Designs built on Auto Layout survive content changes without re-arranging.$md$ || content_md || $md$

## Suggestions and Tips

- Build every component with Auto Layout from the start — retrofit is painful.
- Use `gap` and `padding` instead of nudging each element into place.
- Toggle `Resize` behavior (fill/hug) to control how text and buttons grow.
$md$ where id = '00000000-0000-4000-8000-000000004084'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Styles** are reusable tokens: color, text and effect styles update everywhere at once.
- A defined palette + type scale = consistent product instantly.
- Design systems are just organized styles and components.$md$ || content_md || $md$

## Suggestions and Tips

- Define palette, text and spacing styles *before* designing screens.
- Use Figma's `Create Style` on any fill — one source of truth.
- Keep to one typeface family + one accent — visual discipline reads as professionalism.
$md$ where id = '00000000-0000-4000-8000-000000004085'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Components** are masters: edit the master, every instance updates.
- **Variants** bundle states (default/hover/disabled) into one component with switchable props.
- Components + variants = a UI that scales to 100 screens consistently.$md$ || content_md || $md$

## Suggestions and Tips

- Component-ize anything used twice; it will change later — you'll thank yourself.
- Model button variants (label, icon, size, state) as properties, not new components.
- Use `Overrides` for one-off tweaks, but keep the master clean.
$md$ where id = '00000000-0000-4000-8000-000000004086'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Design the **first screen** with hierarchy: one clear hero message, then supporting content.
- Start grayscale — lock layout and hierarchy before color distracts you.
- An 8-point grid keeps spacing consistent and aligned.$md$ || content_md || $md$

## Suggestions and Tips

- Design the worst version in 10 minutes, then improve — momentum beats perfection.
- Test readability at 100% zoom, not 400% — real users see the small version.
- Ask for one specific piece of feedback (spacing? hierarchy?) — vague praise teaches nothing.
$md$ where id = '00000000-0000-4000-8000-000000004087'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Dev Mode** hands developers exact specs: dimensions, spacing, colors, and exportable assets.
- A clean file (named layers, styles, components) is a developer's best friend.
- Good handoff = fewer questions, faster builds, fewer 'doesn't match the design' bugs.$md$ || content_md || $md$

## Suggestions and Tips

- Export images from Dev Mode at 1x, 2x, 3x for sharp screens.
- Document interaction states (hover, empty, error) before handoff.
- Share a link, not a PNG — developers can inspect the real file.
$md$ where id = '00000000-0000-4000-8000-000000004088'::uuid;

update public.lessons set content_md = $md$## First Understanding

- VS Code is a **file explorer + editor + terminal + debugger** in one window.
- The Explorer, Search, Source Control, and Extensions icons cover 95% of daily work.
- Settings syncs your setup across machines — one login, same editor everywhere.$md$ || content_md || $md$

## Suggestions and Tips

- Install the **Prettier** and **Live Server** extensions before writing any code.
- Open your *project folder*, not individual files — context is everything.
- Customize a shortcut once a day; within a month you'll have a pro setup.
$md$ where id = '00000000-0000-4000-8000-000000004089'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Multi-cursor** edits many lines at once — the #1 productivity feature in VS Code.
- **Emmet** expands abbreviations (`ul>li*3`) into full HTML instantly.
- **Snippets** are reusable code templates triggered by a prefix.$md$ || content_md || $md$

## Suggestions and Tips

- `Alt+Click` adds cursors; `Ctrl+D` selects the next match — practice on repetitive edits.
- Try `!` + Tab in an HTML file — Emmet's full document skeleton.
- Record your own snippets for code you paste more than twice.
$md$ where id = '00000000-0000-4000-8000-000000004090'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Extensions add capabilities; a small curated set beats 50 installed ones.
- Some settings (format on save, word wrap) are game-changers.
- A fast, clean editor is a professional environment — treat it like one.$md$ || content_md || $md$

## Suggestions and Tips

- Turn on **Format on Save** — Prettier fixes your code automatically forever.
- Install language-specific packs (Python, Live Server) instead of random ones.
- Set `editor.minimap.enabled` if it distracts; keep the panel hidden when not needed.
$md$ where id = '00000000-0000-4000-8000-000000004091'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Git** snapshots your project over time — every commit is a save point you can return to.
- `git add` stages, `git commit` saves, `git push` uploads, `git pull` syncs.
- Branches let you experiment without breaking the main version.$md$ || content_md || $md$

## Suggestions and Tips

- Commit small and often with messages that say *what and why* ('fix: correct total calculation').
- Check `git status` before and after every command until it's a reflex.
- Never commit secrets — a `.gitignore` for `.env` files is non-negotiable.
$md$ where id = '00000000-0000-4000-8000-000000004092'::uuid;

update public.lessons set content_md = $md$## First Understanding

- A **branch** is a parallel timeline; merging folds it back into `main`.
- **Pull Requests** are code reviews in a browser — the professional standard for collaboration.
- Feature → PR → review → merge: the loop that keeps teams shipping clean code.$md$ || content_md || $md$

## Suggestions and Tips

- One branch per feature; merge it and delete it when done — keep the tree tidy.
- Pull `main` before starting a branch so you build on fresh code.
- Write PR descriptions like a mini-spec: what changed and why.
$md$ where id = '00000000-0000-4000-8000-000000004093'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The project: **publish your portfolio** with Git — init, commit, push to GitHub, enable Pages.
- It bundles editor skills, Git fundamentals, and deployment into one deliverable.
- A live portfolio URL is the new resume cover letter.$md$ || content_md || $md$

## Suggestions and Tips

- `git init` → commit the baseline → create the GitHub repo → push. Then iterate.
- Enable GitHub Pages on `main` — your site is live minutes after the first push.
- Keep committing as you improve; the commit history is your work log.
$md$ where id = '00000000-0000-4000-8000-000000004094'::uuid;

update public.lessons set content_md = $md$## First Understanding

- LLMs **predict the next word**, one token at a time — no actual 'thinking' happens inside.
- Everything you get depends on the **context you provide** — quality in, quality out.
- They pattern-match knowledge, so they can be confidently wrong — verification is your job.$md$ || content_md || $md$

## Suggestions and Tips

- Give the model *why* you're asking — task, context, format — and outputs improve dramatically.
- Break big requests into steps instead of one giant prompt.
- Treat every answer as a draft to verify, not a fact to copy.
$md$ where id = '00000000-0000-4000-8000-000000004095'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The **7 prompt patterns**: role, task, context, examples, format, constraints, iteration.
- Patterns stack — a role + examples + format beats any single magic prompt.
- Prompts are iteration, not perfection: refine by what the model gets wrong.$md$ || content_md || $md$

## Suggestions and Tips

- Use **few-shot examples** — one good example is worth ten instructions.
- Request an exact format ('a markdown table', '5 bullets under 12 words') and you'll get it.
- If output misses the mark, tell the model *what to change* — second drafts are cheap.
$md$ where id = '00000000-0000-4000-8000-000000004096'::uuid;

update public.lessons set content_md = $md$## First Understanding

- AI tutors work best with **Socratic prompting** — ask it to quiz and probe you, not just answer.
- It excels at tailored explanations: request a 12-year-old-level analogy and you get one.
- Learning loops: explain → ask it to find gaps → explain again — spaced, active learning.$md$ || content_md || $md$

## Suggestions and Tips

- Demand explanations of *why* an answer is right, not just the answer.
- Have it generate practice questions on today's topic — instant spaced repetition.
- Ask 'what common mistake am I about to make here?' — it knows them all.
$md$ where id = '00000000-0000-4000-8000-000000004097'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Projects** bundle chats, knowledge files and custom instructions into one persistent workspace.
- **Artifacts** let Claude write, show and iterate on documents and code in a live panel.
- Long-running work (docs, codebases, research) belongs in Projects, not single chats.$md$ || content_md || $md$

## Suggestions and Tips

- Upload your key documents to a Project once — every chat in it inherits the context.
- Iterate artifacts in place — ask for changes instead of full rewrites.
- Keep projects small and focused; a project with 50 files confuses the model too.
$md$ where id = '00000000-0000-4000-8000-000000004098'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Custom Instructions** are saved preferences every chat remembers (tone, format, audience).
- **GPTs** (custom GPTs) are specialized agents with instructions, files and tools — one task each.
- Both convert your prompt expertise into reusable assets.$md$ || content_md || $md$

## Suggestions and Tips

- Write custom instructions as an email to a new employee: context, style, boundaries.
- Build a GPT for tasks you repeat weekly — it embeds your best prompts and files.
- Update instructions as your workflow evolves; they're living documents.
$md$ where id = '00000000-0000-4000-8000-000000004099'::uuid;

update public.lessons set content_md = $md$## First Understanding

- AI **hallucinates** — it invents confident-sounding facts, so verify anything that matters.
- Never paste secrets, passwords, or customer data into chat tools.
- The **20% rule**: AI accelerates your output, but you stay responsible for 20% — the important 20%.$md$ || content_md || $md$

## Suggestions and Tips

- Ask 'what's your confidence here?' and check sources for anything you'd bet money on.
- Use AI for drafts, outlines, and first passes; do the final review yourself.
- Read the provider's data policy before sharing sensitive work — it's usually on by default.
$md$ where id = '00000000-0000-4000-8000-000000004100'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Inbox Zero** is a system: triage every email instantly — reply, delegate, archive, or defer.
- **Labels, filters and snooze** turn an inbox from a firehose into a queue you control.
- Archive (not delete) — everything stays searchable forever.$md$ || content_md || $md$

## Suggestions and Tips

- Create filters for newsletters and receipts so they skip the inbox entirely.
- Enable keyboard shortcuts (settings → labs) — `e` archives, `s` snoozes, `c` composes.
- Check mail in timed batches; constant checking fragments your focus.
$md$ where id = '00000000-0000-4000-8000-000000004101'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Drive** is your file system in the cloud; **Docs** are live documents with full version history.
- Sharing is granular: view, comment, or edit — and links, not attachments, are the standard.
- Everything is searchable — your whole org's knowledge, one search box away.$md$ || content_md || $md$

## Suggestions and Tips

- Share as 'viewer' by default; upgrade only people who edit.
- Use **Suggesting mode** for edits you want to review — the record stays clean.
- Learn the version history panel — 'undo' across entire documents lives there.
$md$ where id = '00000000-0000-4000-8000-000000004102'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Sheets = Excel's sibling: **formulas, pivot tables and formatting** with live collaboration.
- **IMPORTRANGE, QUERY and named ranges** link sheets into mini-applications.
- Anything you do twice, automate: templates, data validation, and Apps Script.$md$ || content_md || $md$

## Suggestions and Tips

- Use `IMPORTRANGE` to pull data across sheets — live reports without copy-paste.
- `Ctrl+Shift+4` formats currency; format-first prevents #NUM disasters.
- For weekly chores, record an **Apps Script macro** once and replay forever.
$md$ where id = '00000000-0000-4000-8000-000000004103'::uuid;

update public.lessons set content_md = $md$## First Understanding

- **Slides** = collaborative decks with shared themes; **Calendar** = the team's shared time.
- Slides live in Drive and embed Docs/Sheets/charts — one source of truth.
- Calendar blocking (focus time, prep time) is a professional habit, not selfishness.$md$ || content_md || $md$

## Suggestions and Tips

- Insert live charts from Sheets so slides never go stale.
- Set up **focus time** blocks — they protect the deep work meetings steal.
- Use Calendar's 'Speedy meetings' to end at :25/:55 — respect everyone's buffer.
$md$ where id = '00000000-0000-4000-8000-000000004104'::uuid;

update public.lessons set content_md = $md$## First Understanding

- Meet is live collaboration: **captions, screen share, breakout rooms and recording** in one tool.
- Great online meetings are *prepared*: agenda, owner, and outcome for every item.
- Video presence beats audio-only for connection and comprehension.$md$ || content_md || $md$

## Suggestions and Tips

- Mute by default; unmute to speak — the #1 etiquette rule.
- Turn on **live captions** — clarity for non-native speakers and noisy rooms.
- Record and share the link for anyone who couldn't attend — no recap emails needed.
$md$ where id = '00000000-0000-4000-8000-000000004105'::uuid;

update public.lessons set content_md = $md$## First Understanding

- The project: a **Personal Knowledge System** — Drive folders, a Docs hub, a Sheets tracker, calendar rituals.
- It weaves every tool into one flow: capture, organize, retrieve, and review.
- A system you actually use beats a perfect system you don't.$md$ || content_md || $md$

## Suggestions and Tips

- Start with 3 folders: Inbox, Projects, Archive — move notes daily, archive weekly.
- One master Docs 'hub' page linking everything — your brain's index.
- Schedule a 15-minute weekly review in Calendar — the system grows from that habit.
$md$ where id = '00000000-0000-4000-8000-000000004106'::uuid;
