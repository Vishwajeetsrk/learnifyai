-- Phase 6: HTML & CSS Essentials expansion — 6 -> 17 lessons, 2 -> 4 modules.
-- New modules (Scrimba-informed: projects module + accessibility module).

insert into public.course_modules (id, course_id, title, description, order_index)
values
  ('00000000-0000-4000-8000-000000000035', (select id from public.courses where slug = 'html-css-essentials'), 'Build Real Projects', 'Four complete mini-websites — the fastest way to make HTML and CSS stick.', 2),
  ('00000000-0000-4000-8000-000000000036', (select id from public.courses where slug = 'html-css-essentials'), 'Accessible & Essential CSS', 'Contrast, semantics and ARIA — what separates good pages from professional ones.', 3);

-- 4210 Lists, Links & Images (M1)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004210', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000031', 'Lists, Links & Images', 'The three workhorses of every real web page.', $md$
## First Understanding

- **Lists** organize content: `<ul>` (bullets), `<ol>` (numbered), `<dl>` (terms + descriptions).
- **Links** use the `<a>` tag — `href` is the destination, the visible text is what users click.
- **Images** are `<img>` tags with a source `src` and always-descriptive `alt` text.

Every navigation bar, menu, article and gallery on the web is built from these three elements.

## Links that work

```html
<a href="https://learnifyai.in">Learnify AI</a>        <!-- absolute link -->
<a href="/courses/html-css-essentials">Courses</a>     <!-- relative link -->
<a href="mailto:hi@learnifyai.in">Email us</a>          <!-- mail link -->
<a href="index.html" target="_blank" rel="noopener">Open in new tab</a>
```

> [!tip] New-tab safety
> Always add `rel="noopener"` when using `target="_blank"` — it stops the new page from tampering with your tab.

## Lists for every job

```html
<ul>
  <li>Unordered = bullets for facts</li>
</ul>
<ol>
  <li>Ordered = numbered for steps</li>
</ol>
<dl>
  <dt>Definition list</dt>
  <dd>Pairs terms with their descriptions</dd>
</dl>
```

Nest lists by placing a full `<ul>` or `<ol>` inside an `<li>`.

## Images that load fast

```html
<img src="images/team.jpg" alt="The Learnify team at a whiteboard" width="400">
```

> [!warning] Always write alt text
> Screen readers announce `alt` instead of reading the image. `alt=""` is fine for decorative images; never omit the attribute.

```diagram
  <a href="page.html">Read more</a>
  |_| |____|            |_________|
  tag  attr               text
        |_ destination      |_ clickable label
```

```quiz
Q: Which attribute on <img> matters most for accessibility?
A. width
B. height
C. alt
D. title
Correct: C
Explain: alt text is announced by screen readers and shows when the image fails to load.
```

## Suggestions and Tips

- Link visible text should say where it goes — "Download the guide", never "click here".
- Give images `width`/`height` to stop layout jumping while they load.
- Use relative links (`/about`, not `https://site.com/about`) inside your own site — they survive domain changes.
$md$, 7, 8);

-- 4211 Forms, Buttons & Feedback (M1)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004211', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000031', 'Forms, Buttons & Feedback', 'Collect input the accessible way — labels, types and validation.', $md$
## First Understanding

- A `<form>` wraps inputs; each input needs a `<label>` connected by `for`/`id`.
- The `type` attribute decides the keyboard and validation: `email`, `password`, `checkbox`, `radio`…
- Feedback is part of the form: `required`, `placeholder`, and clear error text.

## A form that works

```html
<form action="/signup" method="post">
  <label for="name">Full name</label>
  <input id="name" name="name" type="text" required>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <fieldset>
    <legend>How did you hear about us?</legend>
    <label><input type="radio" name="source" value="social"> Social media</label>
    <label><input type="radio" name="source" value="friend"> A friend</label>
  </fieldset>

  <label><input type="checkbox" name="terms" required> I agree to the terms</label>

  <button type="submit">Create account</button>
</form>
```

> [!info] Buttons vs inputs
> `<button type="submit">` is the modern choice: it can contain icons and styled children. An `<input type="submit">` can only show plain text.

## Pick the right type

| Type | Purpose | Built-in bonus |
|---|---|---|
| `email` | Email addresses | Validates format, mobile keyboard |
| `password` | Hidden text | Masks input |
| `number` | Numeric values | Shows up/down arrows |
| `date` | Dates | Native date picker |
| `checkbox` | On/off choices | Multi-select allowed |
| `radio` | One-of-many | Same `name` = one choice |

> [!tip] Placeholder is not a label
> `placeholder` disappears when typing — never use it as the only hint. Real `<label>`s survive autofill and screen readers.

```quiz
Q: What connects a label to its input?
A. The id of the label equals the for of the input
B. The name of the label equals the id of the input
C. The label must wrap the input in a div
D. Nothing — labels connect automatically
Correct: A
Explain: <label for="name"> pairs with <input id="name">; wrapping the input inside the label also works.
```

## Suggestions and Tips

- Group related radio buttons in a `<fieldset>` with a `<legend>` for clarity.
- Add `required` and let the browser validate — then style `:invalid` states.
- Every button needs a visible text label, not just an icon.
$md$, 8, 9);

-- 4212 The Box Model in Action (M2)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004212', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000032', 'The Box Model in Action', 'Padding, border and margin — the invisible geometry behind every layout.', $md$
## First Understanding

- Every element is a box: content → padding → border → margin.
- `padding` is space **inside** the border; `margin` is space **outside** it.
- `box-sizing: border-box` keeps width honest — borders and padding stay inside the width you set.

```diagram
        margin (outside, transparent)
    _______________________________
   |         border (visible edge)  |
   |   _________________________   |
   |  |    padding (inner space) |  |
   |  |   ___________________   |  |
   |  |  |     content        |  |  |
   |  |  |___________________|  |  |
   |  |_________________________|  |
   |_______________________________|
```

## The classic card

```css
.card {
  box-sizing: border-box;
  width: 320px;
  padding: 24px;          /* breathing room inside */
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin: 16px auto;      /* centering + outside gap */
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.08);
}
```

> [!warning] The margin collapse gotcha
> Vertical margins of adjacent boxes collapse into the larger one — two cards with `margin-bottom: 20px` and `margin-top: 20px` only get **20px** between them, not 40px.

## Shortcuts that save time

```css
padding: 10px 20px;      /* top/bottom  left/right */
padding: 10px 20px 30px; /* top  left/right  bottom */
margin: 0 auto;          /* auto = centre horizontally */
border-radius: 8px 0 0 8px; /* tl tr br bl */
```

> [!tip] Use your browser
> Right-click any element → Inspect → the layout panel paints the box model live. Change values there to experiment before editing code.

```quiz
Q: Which property adds space INSIDE the border?
A. margin
B. padding
C. outline
D. gap
Correct: B
Explain: Padding pushes content away from the border from the inside; margin pushes the whole box from the outside.
```

## Suggestions and Tips

- Start every stylesheet with `* { box-sizing: border-box; }` — it prevents the classic "width overflow" bug.
- Prefer `margin: 0 auto` + a `max-width` for centered, readable content columns.
- Debug mystery spacing by temporarily adding a bright border to the element — you instantly see which box is which.
$md$, 9, 8);

-- 4213 Responsive Design for Every Screen (M2)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004213', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000032', 'Responsive Design for Every Screen', 'One layout that bends gracefully from phones to wide monitors.', $md$
## First Understanding

- **Mobile-first**: write the small-screen layout first, then enhance with `@media` queries.
- Fluid units (`rem`, `%`, `fr`, `minmax`, `vw`) flex naturally; fixed `px` widths break.
- Responsive = layout, typography and spacing all adapt, not just images.

## The modern stack

```css
:root {
  font-size: 16px; /* 1rem = 16px */
}

.page {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .header { display: flex; justify-content: space-between; }
  .title { font-size: 2.5rem; }
}
```

> [!info] minmax is magic
> `repeat(auto-fit, minmax(280px, 1fr))` gives you a responsive grid with **zero media queries**: cards wrap automatically when the container gets narrow.

## Images and type that scale

```css
img { max-width: 100%; height: auto; } /* never overflow the container */

body {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
}
```

> [!tip] clamp()
> `clamp(min, preferred, max)` makes font size fluid between two bounds — no breakpoint needed for smooth type scaling.

```diagram
  Phone (375px)          Tablet (768px)         Desktop (1200px)
  [one card per row]     [two cards per row]    [three cards per row]
      |                        |                        |
      +---- auto-fit minmax(280px, 1fr) ----+---- flex header / bigger type
```

```quiz
Q: Which unit is best for scalable font sizes?
A. px
B. rem
C. vh
D. cm
Correct: B
Explain: rem scales with the root font size, so users with larger text settings get a larger page.
```

## Suggestions and Tips

- Test with the device toolbar in DevTools (Ctrl+Shift+M) — drag widths, don't guess.
- Use `max-width: 100%` on every image so wide images never break narrow layouts.
- Design the phone view first: if the mobile page is usable, desktop is usually easy.
$md$, 10, 9);

-- 4214 Personal Business Card (M3 project)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004214', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000035', 'Personal Business Card', 'Project 1 — a centered flexbox card with your name, role and links.', $md$
## First Understanding

- This is the classic first project: a single centered card that proves you understand structure + styling.
- You'll use flexbox to centre, spacing to breathe, and one accent colour for personality.
- Finished example: a card ~340px wide with your photo or initials, name, role, a short line and social links.

## Build it in four parts

```html
<div class="card">
  <img class="avatar" src="avatar.jpg" alt="Your name">
  <h1 class="name">Aarav Sharma</h1>
  <p class="role">Frontend Developer</p>
  <p class="bio">I turn coffee into responsive, accessible websites.</p>
  <div class="links">
    <a href="https://github.com/aarav" rel="noopener">GitHub</a>
    <a href="https://linkedin.com/in/aarav" rel="noopener">LinkedIn</a>
  </div>
</div>
```

```css
body {
  margin: 0;
  min-height: 100vh;
  display: flex;            /* flexbox on the body */
  justify-content: center;  /* centre horizontally */
  align-items: center;      /* centre vertically */
  background: linear-gradient(135deg, #0f172a, #1e293b);
  font-family: sans-serif;
}

.card {
  width: 340px;
  padding: 2rem;
  border-radius: 16px;
  background: #f8fafc;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.avatar {
  width: 96px; height: 96px;
  border-radius: 50%;
  object-fit: cover;
}

.links a {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  text-decoration: none;
}
```

> [!tip] The centring pattern
> `display: flex` + `justify-content: center` + `align-items: center` on a `min-height: 100vh` parent centres anything, forever.

## Checklist before you're done

- [x] Card has padding, border-radius and a soft shadow
- [x] Name, role and bio are clearly separated visually
- [x] Links look like buttons and open in new tabs
- [x] Page stays centred on any screen size

```quiz
Q: What makes the card horizontally centred?
A. text-align on the card
B. justify-content: center on the flex parent
C. margin: 0 on body
D. border-radius
Correct: B
Explain: justify-content: center aligns flex items along the main axis — here, horizontally.
```

## Suggestions and Tips

- Use `object-fit: cover` on a fixed-size avatar so any photo crops cleanly.
- Add `:hover` feedback to links — a subtle colour shift feels premium.
- After finishing, change the accent colour and fonts to make it yours before the assignment.
$md$, 11, 12);

-- 4215 Space Exploration Page (M3 project)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004215', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000035', 'Space Exploration Page', 'Project 2 — a hero section with layered gradients and a call to action.', $md$
## First Understanding

- Hero sections sell a page in the first second — big heading, subtext, one button.
- You don't need images for drama: stacked `linear-gradient` backgrounds make a starfield.
- The vertical rhythm (space between heading, subtext, button) does the design work.

## The starfield trick

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background:
    radial-gradient(1px 1px at 20% 30%, #fff, transparent),
    radial-gradient(1px 1px at 70% 20%, #fff, transparent),
    radial-gradient(1px 1px at 40% 70%, #fff, transparent),
    radial-gradient(1px 1px at 85% 60%, #fff, transparent),
    linear-gradient(180deg, #020617, #1e1b4b);
}
```

> [!info] Many layers, one background
> `background` accepts a comma-separated stack; the first layer paints on top. Tiny radial "stars" over a dark gradient = instant night sky, zero image files.

## The content

```html
<section class="hero">
  <h1>Take the leap<br>into space</h1>
  <p>Join 10,000+ explorers who already started.</p>
  <button class="cta">Begin mission</button>
</section>
```

```css
.hero h1 { font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 0.5em; }
.hero p  { color: #cbd5e1; margin-bottom: 2em; }
.cta {
  padding: 0.9rem 2.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
}
.cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4); }
```

> [!tip] CTA hover
> A tiny `translateY(-2px)` lift plus a coloured glow makes buttons feel alive — the cheapest "premium" effect in CSS.

```diagram
  [ h1 — big, clamp() sized       ]
  [ p — muted subtitle            ]
  [ (button) — gradient pill      ]
  [        stacked radial stars   ]
  [        + dark gradient        ]
```

```quiz
Q: In a stacked background list, which layer appears on TOP?
A. The last one listed
B. The first one listed
C. The darkest one
D. None — they blend randomly
Correct: B
Explain: The first layer in a comma-separated background list is painted topmost.
```

## Suggestions and Tips

- Give the hero `min-height: 100vh` so it fills the screen — the defining move of a "space page".
- Keep the button text an action ("Begin mission"), never generic ("Click here").
- Add a subtle floating `@keyframes` animation to the heading for extra life — later module will show you how.
$md$, 12, 12);

-- 4216 Birthday Gift Website (M3 project)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004216', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000035', 'Birthday Gift Website', 'Project 3 — hover interactions, emoji gifts and a layout with personality.', $md$
## First Understanding

- The brief: a joyful one-pager for someone's birthday, with "gift" sections that reveal on hover.
- You'll master `:hover` transforms, emoji as visuals, and a section-based page structure.
- Interactivity without JavaScript is the whole point of this project.

## The gift reveal pattern

```html
<section class="gift">
  <h2>Here's a surprise for you 🎁</h2>
  <div class="gift-box">🎉</div>
  <p class="reveal">Hover to see what's inside!</p>
</section>
```

```css
.gift-box {
  font-size: 5rem;
  transition: transform 0.3s ease;
}
.gift:hover .gift-box {
  transform: scale(1.25) rotate(6deg);
  animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}
```

> [!info] The cascade reads right to left
> `.gift:hover .gift-box` means: when a `.gift` is hovered, style its **descendant** `.gift-box`. No JS, no classes toggled.

## A page with rhythm

```css
section {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}
section:nth-of-type(2) { background: linear-gradient(180deg, #fff7ed, #ffedd5); }
```

```html
<main>
  <section><h1>Happy Birthday, Diya! 🎂</h1>
    <p>Today is all about you — scroll for surprises.</p></section>
  <section class="gift"><h2>First, a fact</h2>…</section>
  <section class="gift"><h2>Then, your favourite playlist</h2>…</section>
  <footer>Made with ♥ by Learnify</footer>
</main>
```

> [!tip] nth-of-type alternation
> `section:nth-of-type(2n)` can alternate background tints across sections automatically — instant visual rhythm.

```quiz
Q: Which selector styles .box when a .gift ancestor is hovered?
A. .box:hover
B. .gift .box:hover
C. .gift:hover .box
D. .gift > .box
Correct: C
Explain: .gift:hover .box = descendant .box of a hovered .gift.
```

## Suggestions and Tips

- Keep the hover state obvious: scale + rotate + a color change is enough.
- Use emoji freely — they load instantly and add personality without images.
- Make at least one section do something different (color flip, emoji swap) so the page feels alive.
$md$, 13, 12);

-- 4217 NFT Landing Page (M3 project)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004217', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000035', 'NFT Landing Page', 'Project 4 — a dark, gradient-heavy landing page with a collection grid.', $md$
## First Understanding

- Modern product pages are dark, gradient-soaked and grid-based — this project teaches all three.
- You'll build a fictional NFT collection page with a hero, a card grid and a footer.
- The core skill: layered gradients + `grid` cards with hover lifts.

## The card grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
.card {
  background: linear-gradient(160deg, #1e293b, #0f172a);
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 1.5rem;
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  border-color: #818cf8;
}
.card .art {
  height: 140px;
  border-radius: 10px;
  background:
    radial-gradient(circle at 30% 30%, #818cf8, transparent 60%),
    linear-gradient(135deg, #4c1d95, #0f172a);
}
.card h3 { color: #e2e8f0; }
.card .price { color: #a5b4fc; font-weight: bold; }
```

> [!info] Gradient "art"
> Conic and radial gradients can fake artwork — `conic-gradient` gives you kaleidoscope swirls perfect for NFT thumbnails with zero image assets.

## Hero with a glow

```css
.hero {
  text-align: center;
  padding: 5rem 1rem;
  background:
    radial-gradient(600px 300px at 50% 0%, rgba(129, 140, 248, 0.25), transparent 70%),
    #0f172a;
}
.hero h1 { font-size: clamp(2.2rem, 7vw, 4.5rem); background: linear-gradient(90deg, #a5b4fc, #f472b6); -webkit-background-clip: text; background-clip: text; color: transparent; }
```

> [!tip] Gradient text
> Transparent `color` + `background-clip: text` paints gradient words — the signature look of modern landing pages.

```diagram
      [ gradient glow hero          ]
      [ "CYBER ORBS" gradient text  ]
      [ (Explore collection) button ]
  [card] [card] [card]   <- auto-fit grid
  [card] [card] [card]      hover: lift
      [ footer — links row ]
```

```quiz
Q: What does background-clip: text do with transparent color?
A. Crops the background to the text shape
B. Adds a shadow behind text
C. Makes text glow
D. Nothing visible
Correct: A
Explain: Combined with color: transparent, the gradient background shows only through the letters.
```

## Suggestions and Tips

- Keep a strict dark palette (slate + indigo + one pink accent) — restraint reads as expensive.
- Hover lifts belong on every interactive card: consistent motion = professional feel.
- Add a sticky header later using the JS module — classic landing page pattern.
$md$, 14, 12);

-- 4218 Text Contrast, Color & Fonts (M4)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004218', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000036', 'Text Contrast, Color & Fonts', 'Readable type and accessible color — the 30-60-10 rule in action.', $md$
## First Understanding

- **Contrast is accessibility**: normal text needs a 4.5:1 ratio against its background; large text 3:1.
- Font size in the range 16–18px with line-height 1.5–1.7 is the comfortable reading zone.
- The **60-30-10 rule** keeps palettes calm: 60% dominant, 30% secondary, 10% accent.

## Check contrast like a pro

| Pairing | Ratio | Verdict |
|---|---|---|
| `#111827` on `#ffffff` | 16:1 | Excellent |
| `#94a3b8` on `#ffffff` | 2.7:1 | Fails — too light |
| `#f8fafc` on `#1e293b` | 13:1 | Excellent (dark mode) |
| `#f87171` on `#ffffff` | 3.2:1 | OK only for large text |

> [!warning] The #94a3b8 trap
> Light gray text on white looks elegant and fails every audit. If it's body copy, darken it to `#475569` or darker.

## A palette that works

```css
:root {
  --dominant: #f8fafc;   /* 60% — page background   */
  --secondary: #e2e8f0;  /* 30% — cards, sections   */
  --accent: #2563eb;     /* 10% — buttons, links    */
  --ink: #0f172a;        /* text on light           */
  --ink-muted: #475569;  /* secondary text (passes) */
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1.0625rem;      /* 17px — comfortable */
  line-height: 1.6;
  color: var(--ink);
  background: var(--dominant);
}
```

> [!tip] system-ui fonts
> `system-ui` uses the device's native font — zero download, perfect rendering, no FOUT (flash of unstyled text).

```diagram
  60%  ██████████████  background (dominant)
  30%  ████████       cards, nav, sections
  10%  ███            buttons, links, highlights
```

```quiz
Q: What is the minimum contrast ratio for normal-size text?
A. 2:1
B. 3:1
C. 4.5:1
D. 7:1
Correct: C
Explain: WCAG AA requires 4.5:1 for normal text; large text (24px+) may use 3:1.
```

## Suggestions and Tips

- Test palettes with a contrast checker (web.dev or browser DevTools) before shipping.
- Never style text with the same gray as placeholder/hint color — users will skip it.
- Accent color is for interactive things; muted neutrals carry the reading text.
$md$, 15, 10);

-- 4219 Semantic Layouts, Headings & ARIA (M4)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004219', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000036', 'Semantic Layouts, Headings & ARIA', 'Structure that machines understand — nav, main, landmark regions and one h1.', $md$
## First Understanding

- Semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`) give the page meaning — and free accessibility for free.
- One `<h1>` per page; headings descend in order — screen reader users navigate by them.
- ARIA (`aria-label`, `role`, `aria-live`) is the escape hatch when semantics aren't enough.

## The skeleton

```html
<body>
  <header>                       <!-- site-wide brand -->
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>                         <!-- one main per page -->
    <h1>Learnify Courses</h1>
    <section aria-labelledby="web-heading">
      <h2 id="web-heading">Web Development</h2>
      <p>HTML, CSS and JavaScript — free forever.</p>
    </section>
  </main>

  <footer>© 2026 Learnify AI</footer>
</body>
```

> [!info] Landmarks are shortcuts
> Screen reader users jump between `header`, `nav`, `main` and `footer` with one keystroke. Skip your `<div id="content">` habit — these regions are the map.

## When you need ARIA

```html
<button aria-label="Close dialog">×</button>   <!-- icon-only buttons -->
<div role="alert" aria-live="assertive">Your session expired.</div>  <!-- dynamic updates -->
```

> [!tip] First rule of ARIA
> Don't use ARIA when a native element does the job — `<button>` beats `role="button"` on a div. ARIA only rescues when semantics are missing.

```diagram
  header ─ brand + nav (landmark)
  main   ─ h1
    section ─ h2 ─ article content
    section ─ h2 ─ article content
  footer ─ legal links
```

```quiz
Q: How many <h1> headings should a page have?
A. As many as sections
B. Exactly one
C. One per article
D. None
Correct: B
Explain: One h1 defines the page topic; the rest of the outline descends from it.
```

## Suggestions and Tips

- Run a quick test: DevTools → Accessibility tab — every landmark shows up if your structure is semantic.
- Label icon-only buttons with `aria-label`, never leave them unlabeled.
- Keep heading levels sequential (h1 → h2 → h3); skipping h1→h3 confuses navigation.
$md$, 16, 10);

-- 4220 Portfolio Site Project (M4 capstone)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004220', (select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000000036', 'Portfolio Site Project', 'Capstone — combine everything into a responsive, accessible portfolio you can actually show.', $md$
## First Understanding

- This capstone pulls the whole course together: semantic structure, responsive grid, accessible color and polished motion.
- Sections: hero → skills → projects (grid) → contact form → footer.
- A portfolio is a living document — building one now means you have a real artifact to share.

## The plan

```html
<body>
  <header>
    <nav aria-label="Main">
      <ul> <li><a href="#hero">Home</a></li> <li><a href="#skills">Skills</a></li>
           <li><a href="#projects">Projects</a></li> <li><a href="#contact">Contact</a></li> </ul>
    </nav>
  </header>
  <main>
    <section id="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Hi, I'm Priya 👋</h1>
      <p>I build responsive, accessible web pages.</p>
    </section>
    <section id="skills" aria-labelledby="skills-title">…</section>
    <section id="projects" aria-labelledby="projects-title">…</section>
    <section id="contact" aria-labelledby="contact-title">…</section>
  </main>
  <footer>© 2026 Priya · <a href="mailto:priya@example.com">priya@example.com</a></footer>
</body>
```

## The glue

```css
:root {
  --accent: #0891b2;
  --ink: #0f172a;
  --bg: #f8fafc;
  --card: #ffffff;
}
body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; color: var(--ink); background: var(--bg); }
nav ul { display: flex; gap: 1.5rem; list-style: none; justify-content: center; padding: 1rem 0; }
nav a { color: var(--ink); text-decoration: none; }
nav a:hover { color: var(--accent); }

#projects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
.project { background: var(--card); border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
.project:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12); }

#contact form { display: flex; flex-direction: column; gap: 1rem; max-width: 480px; margin: 0 auto; }
label { font-weight: 600; }
input, textarea { padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; }
button { padding: 0.75rem 1.5rem; border: none; border-radius: 999px; background: var(--accent); color: white; font-size: 1rem; cursor: pointer; }
button:hover { filter: brightness(1.1); }
```

> [!tip] Sections scroll smoothly
> `html { scroll-behavior: smooth; }` — nav links glide to each section. One line, feels like a real product.

```diagram
  nav (sticky, flex)
  hero ─ h1 + subtitle
  skills ─ 3 cards (grid auto-fit)
  projects ─ 3 project cards (hover lift)
  contact ─ labelled form
  footer ─ copyright + mail link
```

```quiz
Q: Why does the projects section use minmax(260px, 1fr)?
A. It forces exactly 3 columns
B. Cards wrap to fit any screen width
C. It makes images round
D. It speeds up loading
Correct: B
Explain: auto-fit + minmax creates as many columns as fit, wrapping gracefully on phones.
```

## Suggestions and Tips

- Write real content for 2–3 projects you're proud of; quality beats quantity.
- Validate the whole page with DevTools Accessibility audit — then fix what it flags.
- Deploy it free (GitHub Pages or Vercel) — a live link is the real prize.
$md$, 17, 15);

-- Exercises for the four project lessons
insert into public.lesson_exercises (lesson_id, language, instructions, starter_code, solution_code, hint, passing_grade, xp_reward)
values
('00000000-0000-4000-8000-000000004214', 'javascript', $i$Write a function that returns the CSS needed to centre a .card on the page vertically and horizontally using flexbox. Return the three style rules as a string.$i$,
 $s$function centerCard() {
  // Return the CSS string that centers .card in a 100vh body
  return "";
}$s$,
 $o$function centerCard() {
  return `
body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}`;
}$o$,
 $h$The body needs min-height: 100vh, display: flex, justify-content: center and align-items: center.$h$,
 70, 15),

('00000000-0000-4000-8000-000000004215', 'javascript', $i$Write buildStarfield() that returns a CSS background value: three tiny radial-gradient stars (white, 1px) at 20% 30%, 70% 20%, 40% 70%, layered over a linear-gradient from #020617 to #1e1b4b. Stars must be listed BEFORE the linear-gradient.$i$,
 $s$function buildStarfield() {
  // Return the multi-layer background value
  return "";
}$s$,
 $o$function buildStarfield() {
  return `
radial-gradient(1px 1px at 20% 30%, #fff, transparent),
radial-gradient(1px 1px at 70% 20%, #fff, transparent),
radial-gradient(1px 1px at 40% 70%, #fff, transparent),
linear-gradient(180deg, #020617, #1e1b4b)`;
}$o$,
 $h$Comma-separated layers: three radial-gradient(1px 1px at X% Y%, #fff, transparent) first, then the linear-gradient last.$h$,
 70, 15),

('00000000-0000-4000-8000-000000004216', 'javascript', $i$Write giftHover() that returns the CSS for: .gift-box has transition transform 0.3s ease; and .gift:hover .gift-box scales to 1.25 with a 6deg rotation.$i$,
 $s$function giftHover() {
  // Return the CSS string
  return "";
}$s$,
 $o$function giftHover() {
  return `
.gift-box { transition: transform 0.3s ease; }
.gift:hover .gift-box { transform: scale(1.25) rotate(6deg); }`;
}$o$,
 $h$The parent .gift gets :hover; the child .gift-box gets the transform, with a transition on the child.$h$,
 70, 15),

('00000000-0000-4000-8000-000000004217', 'javascript', $i$Write nftArt(glow, base) that returns a background value: radial-gradient(circle at 30% 30%, glow, transparent 60%) over linear-gradient(135deg, base, #0f172a). Parameters are already colors like #818cf8 and #4c1d95.$i$,
 $s$function nftArt(glow, base) {
  // Return the two-layer background
  return "";
}$s$,
 $o$function nftArt(glow, base) {
  return `radial-gradient(circle at 30% 30%, ${glow}, transparent 60%),
linear-gradient(135deg, ${base}, #0f172a)`;
}$o$,
 $h$First layer: radial-gradient(circle at 30% 30%, glow, transparent 60%). Second: linear-gradient(135deg, base, #0f172a). Join with a newline.$h$,
 70, 15);

-- Assignments for project lessons
insert into public.course_assignments (course_id, lesson_id, title, prompt, difficulty, points_reward, order_index)
values
((select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000004214', 'Build Your Personal Business Card', $a$Build a real business card page for yourself:

1. A card (~340px) centred on the screen with flexbox
2. Your avatar or stylish initials
3. Your name, role, and a one-line bio
4. Two social links styled as pill buttons
5. A hover effect on the card or links

Use the 60-30-10 rule for color and keep the design personal. When done, describe what makes your card yours.$a$, 'Beginner', 50, 1),
((select id from public.courses where slug = 'html-css-essentials'), '00000000-0000-4000-8000-000000004220', 'Build a One-Page Portfolio', $a$Create a complete one-page portfolio:

1. Sticky semantic nav with 4 links (Home, Skills, Projects, Contact)
2. A hero with your name and a one-line pitch
3. A skills section with 3+ cards
4. A projects grid (auto-fit minmax) with 2-3 real projects
5. A labelled contact form (name, email, message)
6. Accessible: one h1, alt text, 4.5:1 contrast, smooth scrolling

Validate with DevTools Accessibility audit and fix every issue it finds.$a$, 'Beginner', 50, 2);
