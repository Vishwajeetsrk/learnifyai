-- ============================================================
-- Template Mastery: rich lesson content + free seed course
-- ============================================================

-- 1. Rich content support
alter table public.lessons
  add column if not exists content_translations jsonb not null default '{}'::jsonb;

alter table public.course_assignments
  add column if not exists difficulty text,
  add column if not exists points_reward integer not null default 0;

alter table public.course_materials
  add column if not exists lesson_id uuid references public.lessons(id) on delete cascade,
  add column if not exists description text;

-- 2. Seed the free "Template Mastery" course (idempotent via on conflict)

insert into public.courses (
  id, title, slug, description, category, level, price_inr,
  instructor, published, cover_url, duration_minutes, created_at, updated_at
) values (
  '00000000-0000-4000-8000-000000000101',
  'Template Mastery',
  'template-mastery',
  'From template to production-ready website. Master HTML, CSS and JavaScript by building real pages, running code in the live IDE, and shipping your own site — 100% free, with a certificate.',
  'Development',
  'Beginner',
  0,
  'Learnify AI Team',
  true,
  '/course-template-mastery.svg',
  265,
  now(), now()
)
on conflict (id) do nothing;

insert into public.course_modules (id, course_id, order_index, title, description) values
  ('00000000-0000-4000-8000-000000000111', '00000000-0000-4000-8000-000000000101', 1, 'Start Here: The Web in Your Hands', 'What a website actually is, and the three languages every page is built from.'),
  ('00000000-0000-4000-8000-000000000112', '00000000-0000-4000-8000-000000000101', 2, 'Template Power', 'Choose, edit and restyle any template like a pro designer.'),
  ('00000000-0000-4000-8000-000000000113', '00000000-0000-4000-8000-000000000101', 3, 'Make It Interactive', 'JavaScript, forms, buttons and motion — no more static pages.'),
  ('00000000-0000-4000-8000-000000000114', '00000000-0000-4000-8000-000000000101', 4, 'Ship It: Build, Deploy & Certify', 'Responsive design, publishing your site, and your final project.')
on conflict (id) do nothing;

-- ---------------- MODULE 1 ----------------

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url, content_translations) values (
  '00000000-0000-4000-8000-000000000121',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000111',
  1,
  'How Websites Actually Work',
  'The request–response journey, browsers, and the three languages of the web.',
$tm1$
> [!tip] **No code needed yet.** This lesson is a map — read it, then move on.

Every website you have ever opened follows the exact same journey. A **browser** (Chrome, Edge, Safari) is a translator: it reads text files and turns them into the beautiful page you see.

## The journey of a page

```diagram
  YOU                          SERVER
  (browser)                    (host computer)
    |                              |
    | 1. type learnifyai.in        |
    |------------------------------>|
    |                              | 2. finds the page files
    | 3. sends back HTML, CSS, JS  |
    |<------------------------------|
    | 4. browser draws the page    |
    |                              |
```

## The three languages

Every web page is made of exactly three languages. Together they are the whole web:

| Language | What it does | Analogy |
| -------- | ------------ | ------- |
| **HTML** | Structure — headings, text, images, buttons | The skeleton of a body |
| **CSS** | Style — colors, spacing, fonts, layout | The clothes and makeup |
| **JavaScript** | Behavior — clicks, animation, math, logic | The muscles that move |

> [!warning] HTML is not a programming language. HTML has no logic — it cannot "decide" anything. JavaScript does the thinking.

## Key ideas to remember

1. **HTML = content**, **CSS = looks**, **JavaScript = behavior**.
2. The browser always receives the files — the server never renders for you.
3. You can see the code of any page: right-click → **Inspect** (or Ctrl+Shift+I).

## Quick Check

```quiz
Q: Which language decides what happens when a user clicks a button?
A. HTML
B. CSS
C. JavaScript
D. The server
Correct: C
Explain: JavaScript runs in the browser and handles interactions.
```

> [!info] In later lessons you will run all three languages in the built-in IDE — no installations needed.
$tm1$,
  20, true, null,
  jsonb_build_object(
    'hi',
    'हर वेबसाइट एक ही सफर से गुज़रती है। **ब्राउज़र** टेक्स्ट फ़ाइलों को पढ़कर सुंदर पेज बनाता है। वेब का हर पेज तीन भाषाओं से बना है: **HTML** (संरचना), **CSS** (स्टाइल) और **JavaScript** (व्यवहार)। HTML कोई प्रोग्रामिंग भाषा नहीं है — वह केवल सामग्री दिखाती है। जब आप किसी बटन पर क्लिक करते हैं, तो JavaScript ही निर्णय लेती है। किसी भी पेज का कोड देखने के लिए राइट-क्लिक करें और Inspect चुनें।'
  )
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000122',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000111',
  2,
  'HTML — The Skeleton of Every Page',
  'Tags, elements and attributes: write your first real HTML and understand what every template is built from.',
$tm2$
Every template on the internet is built from **tags**. A tag is a keyword wrapped in angle brackets, like `<h1>`. Most tags come in pairs: an opening tag and a closing tag with a slash.

## Anatomy of an element

```diagram
  <p class="intro">Hello, world!</p>
  |_| |____|    |____|  |____|  |_|
  tag  attr     value   text   close
```

## The tags you will use every day

| Tag | Purpose |
| --- | ------- |
| `<h1>` – `<h6>` | Headings, largest to smallest |
| `<p>` | A paragraph of text |
| `<a href="...">` | A link |
| `<img src="...">` | An image (no closing tag) |
| `<ul>` / `<li>` | Unordered list / list item |
| `<div>` | A generic container block |

## Your first page

Copy this into the **Open in IDE** button and run it:

```html
<!doctype html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, I am learning HTML!</h1>
    <p>This is my very first paragraph.</p>
    <a href="https://learnifyai.in">Visit Learnify</a>
  </body>
</html>
```

> [!tip] Attributes give tags extra powers. `href` makes an anchor go somewhere; `src` tells an image where its file lives.

## Flashcards

```flashcards
<h1> is used for…|The most important heading on the page
An attribute is…|Extra information inside a tag, like href="..."
What is a self-closing tag?|A tag without a closing pair, like <img>
The <p> tag stands for…|Paragraph
```

## Quick Check

```quiz
Q: Which tag creates a clickable link?
A. <link>
B. <a>
C. <href>
D. <url>
Correct: B
Explain: The <a> (anchor) tag with an href attribute creates links.
```
$tm2$,
  20, true, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000123',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000111',
  3,
  'CSS — Painting the Web',
  'Selectors, colors, fonts and the box model. Make any template look like yours.',
$tm3$
If HTML is the skeleton, **CSS** is everything anyone sees. CSS picks elements with **selectors** and paints them with **properties**.

## How CSS is written

```css
/* selector { property: value; } */
body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}

h1 {
  color: #818cf8;
  font-size: 2.5rem;
}
```

## The Box Model — the most important idea in web design

Every element on a page is a box, layered like an onion:

```diagram
  ┌─────────────────────────────────┐  margin (outer space)
  │  ┌───────────────────────────┐  │
  │  │  ┌─────────────────────┐  │  │
  │  │  │  ┌───────────────┐  │  │  │
  │  │  │  │   content     │  │  │  │
  │  │  │  └───────────────┘  │  │  │
  │  │  │   padding (inner)   │  │  │
  │  │  └─────────────────────┘  │  │
  │  │   border                  │  │
  │  └───────────────────────────┘  │
  └─────────────────────────────────┘
```

| Property | Controls | Used for |
| -------- | -------- | -------- |
| `padding` | Space **inside** the box | Breathing room around text |
| `border` | The visible edge | Cards, dividers |
| `margin` | Space **outside** the box | Gap between elements |

> [!warning] Confusing padding and margin is the #1 beginner bug. Padding = inside, margin = outside.

## Try it in the IDE

```html
<!doctype html>
<html>
  <head>
    <style>
      body { font-family: system-ui, sans-serif; background: #f1f5f9; padding: 2rem; }
      .card {
        background: white;
        padding: 24px;               /* space inside  */
        margin: 16px auto;           /* space outside */
        border: 2px solid #6366f1;
        border-radius: 16px;
        max-width: 320px;
      }
      .card h2 { color: #4338ca; margin-top: 0; }
      .badge { background: #6366f1; color: white; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">CSS</span>
      <h2>Box model demo</h2>
      <p>Padding is inside me, margin is outside me.</p>
    </div>
  </body>
</html>
```

## Quick Check

```quiz
Q: You want more space between two cards. Which property do you change?
A. padding of the cards
B. margin of the cards
C. border of the cards
D. font-size
Correct: B
Explain: Margins create space outside boxes — between elements.
```
$tm3$,
  22, true, null
)
on conflict (id) do nothing;

-- ---------------- MODULE 2 ----------------

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000124',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000112',
  1,
  'Choose & Edit Your First Template',
  'A professional 5-step workflow for editing any template without breaking it.',
$tm4$
Templates save hours — but only if you edit them the right way. This is the exact workflow professionals use:

## The 5-step template workflow

| Step | Action | Why |
| ---- | ------ | --- |
| 1 | Download & unzip the template | Keep a backup copy first |
| 2 | Open the folder in your code editor | See the real file structure |
| 3 | Find `index.html` | That is the homepage |
| 4 | Edit text and images in HTML | Content changes only |
| 5 | Tweak colors in the `.css` file | Style changes only |

> [!tip] **Rule of thumb:** change *content* in HTML, change *looks* in CSS, change *behavior* in JS. Mixing them is how templates break.

## Anatomy of a template folder

```diagram
  my-template/
  ├── index.html      ← the main page
  ├── css/
  │   └── style.css   ← all styling
  ├── js/
  │   └── main.js     ← interactions
  ├── images/         ← photos & icons
  └── README.txt      ← creator's instructions
```

## Rebranding a template

The fastest way to make a template "yours":

1. Replace the **logo** image with your own (same filename keeps it simple).
2. Change the **hero heading** and subtext in `index.html`.
3. Update the **primary color** — search for the `:root` or the first `color:` rules in `style.css`.

## Quick Check

```quiz
Q: Where should you change the text shown on the homepage?
A. style.css
B. index.html
C. main.js
D. images folder
Correct: B
Explain: Content lives in HTML; CSS only styles it.
```
$tm4$,
  20, false, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000125',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000112',
  2,
  'Layouts, Sections & the Box Model in Action',
  'Build real page sections — navbars, heros, cards and footers — with Flexbox.',
$tm5$
Real pages are a stack of **sections**: navbar, hero, features, footer. Inside each section, **Flexbox** lines items up in rows and columns.

## The two layouts that power 90% of the web

```diagram
  FLEX ROW (default)          FLEX COLUMN
  ┌────────────────┐          ┌──┐
  │ [1] [2] [3]    │          │ 1│
  │                │          │ 2│
  │                │          │ 3│
  └────────────────┘          └──┘
  justify-content: center     flex-direction: column
  (horizontal control)        (vertical stacking)
```

## A complete section: navbar + hero + cards

```html
<!doctype html>
<html>
<head>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    nav { display: flex; justify-content: space-between; padding: 16px 32px; background: #0f172a; color: white; }
    nav a { color: #c7d2fe; text-decoration: none; margin-left: 16px; }
    .hero { text-align: center; padding: 64px 24px; background: linear-gradient(135deg, #1e1b4b, #312e81); color: white; }
    .hero h1 { font-size: 2.5rem; margin: 0 0 8px; }
    .cards { display: flex; gap: 16px; justify-content: center; padding: 48px 24px; }
    .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; max-width: 240px; }
    footer { text-align: center; padding: 24px; background: #f1f5f9; }
  </style>
</head>
<body>
  <nav><strong>MySite</strong><div><a href="#">Home</a><a href="#">About</a><a href="#">Contact</a></div></nav>
  <section class="hero"><h1>Build with Templates</h1><p>Learn by editing — not by staring.</p></section>
  <section class="cards">
    <div class="card"><h3>Plan</h3><p>Sketch the sections you need.</p></div>
    <div class="card"><h3>Edit</h3><p>Swap content and colors.</p></div>
    <div class="card"><h3>Launch</h3><p>Ship it to the world.</p></div>
  </section>
  <footer>&copy; 2026 MySite</footer>
</body>
</html>
```

> [!tip] `justify-content: space-between` pushes items to the far edges — perfect for navbars.

## Quick Check

```quiz
Q: Which CSS property stacks items vertically inside a container?
A. display: flex
B. flex-direction: column
C. justify-content: row
D. align-items: block
Correct: B
Explain: flex-direction controls the main axis: row (horizontal) or column (vertical).
```
$tm5$,
  25, false, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000126',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000112',
  3,
  'Images, Fonts & Brand Colors',
  'Make a template feel like your brand: the 60-30-10 color rule and font pairing.',
$tm6$
Nothing makes a template feel *yours* faster than your own colors, fonts and imagery. Here is the designer's playbook.

## The 60-30-10 color rule

| Share | Where | Example |
| ----- | ----- | ------- |
| **60%** | Background / dominant color | `#f8fafc` |
| **30%** | Secondary elements (cards, sidebar) | `#e2e8f0` |
| **10%** | Accent — buttons, links, highlights | `#6366f1` |

> [!warning] Never use more than 3–4 colors on a page. The 10% accent is what makes a page look "designed".

## Font pairing that always works

- **Headings:** a strong display font (e.g. *Poppins*, *Space Grotesk*).
- **Body:** a clean readable font (e.g. *Inter*, *system-ui*).
- **Rule:** one display + one body = never more.

## Applying it to a template

```css
:root {
  --bg: #f8fafc;        /* 60%  */
  --panel: #ffffff;     /* 30%  */
  --accent: #6366f1;    /* 10%  */
  --ink: #0f172a;
}

body { background: var(--bg); color: var(--ink); }
button { background: var(--accent); color: white; border: none; padding: 10px 18px; border-radius: 10px; }
```

Using **CSS variables** (the `--name` syntax) means one change re-colors your whole site.

## Quick Check

```quiz
Q: In the 60-30-10 rule, where does your brand's accent color belong?
A. On the whole background
B. On most text
C. On buttons, links and highlights
D. On images only
Correct: C
Explain: The 10% accent is reserved for interactive highlights — it is what makes pages look designed.
```
$tm6$,
  22, false, null
)
on conflict (id) do nothing;

-- ---------------- MODULE 3 ----------------

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000127',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000113',
  1,
  'JavaScript — Your First Logic',
  'Variables, functions and events: make your page respond to clicks.',
$tm7$
JavaScript is the muscle of the web. It lives in `<script>` tags, runs in the browser, and reacts to **events** like clicks.

## The three things you need today

| Concept | Example | Meaning |
| ------- | ------- | ------- |
| Variable | `let count = 0` | A named box storing a value |
| Constant | `const name = "You"` | A value that never changes |
| Function | `function greet() {}` | A reusable block of steps |
| Event | `btn.onclick = greet` | "Run this when the button is clicked" |

> [!tip] Use `const` by default. Only use `let` when the value must change.

## A live counter — run it in the IDE

```html
<!doctype html>
<html>
<body style="font-family:system-ui; text-align:center; padding-top:64px">
  <h1 id="counter">0</h1>
  <button id="btn">+1</button>

  <script>
    const counter = document.getElementById("counter");
    const btn = document.getElementById("btn");
    let count = 0;

    function addOne() {
      count = count + 1;          // the logic!
      counter.textContent = count;
    }

    btn.onclick = addOne;         // the event
  </script>
</body>
</html>
```

## Reading the flow

```diagram
  click on button
        │
        ▼
  addOne() runs
        │
        ▼
  count = count + 1   (logic)
        │
        ▼
  counter.textContent = count   (update the page)
```

## Quick Check

```quiz
Q: Which keyword declares a value that can never be reassigned?
A. var
B. let
C. const
D. fix
Correct: C
Explain: const creates a constant binding — use it for everything that should not change.
```
$tm7$,
  25, false, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000128',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000113',
  2,
  'Forms, Buttons & Feedback',
  'Capture user input with forms and show feedback without reloading the page.',
$tm8$
A website becomes an *app* the moment it takes input. Forms do the taking; JavaScript does the thinking.

## Form anatomy

```html
<form id="signup">
  <label>Name <input id="name" required /></label>
  <label>Email <input id="email" type="email" required /></label>
  <button type="submit">Join</button>
</form>
<p id="message" hidden>Thanks — you are on the list! 🎉</p>

<script>
  const form = document.getElementById("signup");
  const message = document.getElementById("message");

  form.onsubmit = (event) => {
    event.preventDefault();                 // stop the page reload
    const name = document.getElementById("name").value;
    message.hidden = false;
    message.textContent = "Welcome, " + name + "!";
  };
</script>
```

> [!warning] Always call `event.preventDefault()` in `onsubmit` — otherwise the browser reloads the page and your JavaScript result vanishes.

## Flashcard review

```flashcards
What does preventDefault() do?|Stops the browser's default behavior (like page reload)
Which HTML type makes a field require a valid email?|type="email"
Where do users type input?|Inside <input> or <textarea> elements
What runs first when a form is submitted?|The submit event handler
```

## Quick Check

```quiz
Q: Why do we call event.preventDefault() in form handlers?
A. To make the form invisible
B. To stop the page from reloading
C. To validate the email
D. To send data to a server
Correct: B
Explain: Without it the browser reloads the page and discards your JS output.
```
$tm8$,
  22, false, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000129',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000113',
  3,
  'Motion & Animations',
  'CSS transitions and keyframes: subtle motion that makes pages feel premium.',
$tm9$
Motion tells the brain which elements are interactive. Two tools cover almost everything: **transitions** (smooth changes) and **keyframes** (full animations).

## Transition vs animation

| Tool | Used when | Example |
| ---- | --------- | ------- |
| `transition` | A property changes state | Button hover |
| `@keyframes` | Continuous or multi-step motion | Floating badges, spinners |

## The 3 rules of tasteful motion

1. **150–300ms** — faster feels snappy; slower feels sluggish.
2. **One property per element** — moving everything at once looks chaotic.
3. **Reduce Motion** — respect users who prefer no animation.

## Button hover + floating card

```html
<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui; display: grid; place-items: center; height: 100vh; background: #0f172a; }
    .btn {
      background: #6366f1; color: white; border: none; padding: 14px 28px;
      border-radius: 12px; font-size: 16px; cursor: pointer;
      transition: transform 200ms ease, box-shadow 200ms ease;
    }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(99,102,241,0.4); }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }
    .badge { margin-top: 24px; color: #a5b4fc; animation: float 2.5s ease-in-out infinite; }
  </style>
</head>
<body>
  <button class="btn">Hover me</button>
  <p class="badge">I am floating ✨</p>
</body>
</html>
```

> [!tip] `ease` is the safest easing curve. `cubic-bezier(0.34, 1.56, 0.64, 1)` gives a bouncy, playful feel.

## Quick Check

```quiz
Q: Which tool would you use for a continuously floating logo?
A. transition
B. @keyframes
C. margin
D. flexbox
Correct: B
Explain: Keyframes run continuously; transitions only animate a state change.
```
$tm9$,
  20, false, null
)
on conflict (id) do nothing;

-- ---------------- MODULE 4 ----------------

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000130',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000114',
  1,
  'Responsive Design for Every Screen',
  'Media queries and flexible units: one page, perfect on every device.',
$tm10$
70% of web traffic is mobile. A page that only works on desktop is a page half the world cannot use. **Responsive design** fixes that with one ingredient: media queries.

## The mobile-first pattern

```css
/* base styles = phone */
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* bigger screens get more columns */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

## Responsive units cheat sheet

| Unit | What it scales with | Use for |
| ---- | ------------------- | ------- |
| `%` | Parent width | Layout widths |
| `rem` | Root font size | Font sizes, spacing |
| `vw/vh` | Viewport size | Full-screen sections |
| `flex-basis` | Container space | Auto-fitting items |

> [!warning] Never use fixed `px` for container widths. A `1200px` card overflows every phone.

## Desktop → tablet → phone

```diagram
  DESKTOP        TABLET          PHONE
  ┌──────────┐   ┌──────────┐    ┌──────────┐
  │ [1][2][3]│   │ [1][2]   │    │ [1]      │
  │          │   │ [3]      │    │ [2]      │
  │          │   │          │    │ [3]      │
  └──────────┘   └──────────┘    └──────────┘
  3 columns      2 columns       1 column
```

## Quick Check

```quiz
Q: What does "responsive design" mean?
A. A site that loads fast
B. A site with animations
C. A site that never uses images
D. A site that adapts to any screen size
Correct: D
Explain: Responsive sites reflow their layout to fit phones, tablets and desktops.
```
$tm10$,
  22, false, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000131',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000114',
  2,
  'Deploy & Share Your Site',
  'Publish your page to the internet — free hosting, custom domains, and the checklist before you ship.',
$tm11$
Building locally is step one; the world only sees your site once it is **deployed**. The good news: free hosting is everywhere.

## Deployment options

| Option | Cost | Best for | Domain |
| ------ | ---- | -------- | ------ |
| GitHub Pages | Free | Personal pages, portfolios | `username.github.io` |
| Netlify / Vercel | Free tier | Projects, apps | `yourname.netlify.app` |
| Cloudflare Pages | Free tier | Fast global CDN | `yourname.pages.dev` |

## The 4-step deploy on any platform

1. **Push** your template folder to a GitHub repository.
2. **Import** the repo in the hosting dashboard.
3. **Build command:** leave empty for plain HTML (it is static!).
4. **Ship it** — you get a public URL in seconds.

> [!tip] Static sites (pure HTML/CSS/JS) need **no** build step — hosting serves the files as-is. That is why templates deploy in under a minute.

## Pre-launch checklist

- [ ] Tested on a phone — open the deployed URL on mobile
- [ ] Images compressed — big photos slow every visitor
- [ ] Title tag set — shows in browser tabs and search results
- [ ] Contact link works
- [ ] Favicon added

## Quick Check

```quiz
Q: For a plain HTML/CSS/JS template, what build command do you set on Netlify?
A. npm run build
B. Leave it empty — files are served as-is
C. python server.py
D. docker build
Correct: B
Explain: Static templates need no compilation — hosting serves files directly.
```
$tm11$,
  20, false, null
)
on conflict (id) do nothing;

insert into public.lessons (id, course_id, module_id, order_index, title, description, content_md, duration_minutes, is_preview, video_url) values (
  '00000000-0000-4000-8000-000000000132',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000114',
  3,
  'Final Project — Build It & Certify',
  'Your capstone: a complete one-page portfolio from a template, then earn your certificate.',
$tm12$
You have the full toolkit now. Time to build something real.

## The mission

Build a **one-page personal portfolio** starting from a template, then deploy it. Your page must include:

1. A **navbar** with your name and 3 links
2. A **hero** with your name, role and a call-to-action button
3. A **skills section** showing 4 skills as cards
4. **One interactive element** — a working form or a JavaScript counter
5. **Responsive layout** — perfect on mobile and desktop
6. **Your brand** — your own colors and font pairing

> [!info] Use the assignment below — the starter code already has the navbar and hero; you complete the skills section and the interactive part.

## Marking rubric

| Criteria | What earns full marks |
| -------- | --------------------- |
| Structure | Semantic HTML: `header`, `section`, `footer` |
| Style | 60-30-10 color rule, consistent spacing |
| Logic | A working JS interaction with no console errors |
| Responsive | Mobile view has no horizontal scroll |
| Deployment | Public URL opens in a new tab |

## When you are done

1. Deploy your page and copy the URL.
2. Finish every lesson (mark complete on each).
3. Pass the **final test** below with 70%+.
4. Your certificate is generated instantly — download it from the Certificate tab.

Good luck — go ship it! 🚀

## Practice test

```quiz
Q: Which layout tool should you use to align three skill cards side by side?
A. CSS Flexbox or Grid
B. <table> tags
C. Absolutely positioned divs
D. Margins only
Correct: A
Explain: Flexbox and Grid are built for component layout — tables and absolute positioning are not.
```
$tm12$,
  25, false, null
)
on conflict (id) do nothing;

-- ---------------- Final test MCQs (10 questions) ----------------

insert into public.mcq_questions (course_id, order_index, question, options, answer, explanation) values
  ('00000000-0000-4000-8000-000000000101', 1, 'Which tag wraps the visible content of a web page?',
   '["<html>", "<head>", "<body>", "<title>"]'::jsonb, 2,
   'The <body> element holds everything a visitor sees.'),
  ('00000000-0000-4000-8000-000000000101', 2, 'Which CSS property changes the color of text?',
   '["color", "background", "font", "text-style"]'::jsonb, 0,
   'color sets text color; background paints behind the element.'),
  ('00000000-0000-4000-8000-000000000101', 3, 'Which layers make up the CSS box model, from inside out?',
   '["border, padding, content, margin", "margin, border, padding, content", "content, padding, border, margin", "padding, margin, content, border"]'::jsonb, 2,
   'Content sits inside padding, which sits inside the border, surrounded by margin.'),
  ('00000000-0000-4000-8000-000000000101', 4, 'Which element creates a clickable link?',
   '["<link>", "<a>", "<href>", "<url>"]'::jsonb, 1,
   'The anchor tag <a> with an href attribute creates links.'),
  ('00000000-0000-4000-8000-000000000101', 5, 'What does CSS stand for?',
   '["Computer Style Sheets", "Creative Style System", "Cascading Sheet Syntax", "Cascading Style Sheets"]'::jsonb, 3,
   'CSS = Cascading Style Sheets.'),
  ('00000000-0000-4000-8000-000000000101', 6, 'Which layout tool is the best choice for centering items in a single row?',
   '["Fixed widths with margins", "Flexbox", "A table", "Absolute positioning"]'::jsonb, 1,
   'Flexbox is built for one-dimensional row/column layout with easy alignment.'),
  ('00000000-0000-4000-8000-000000000101', 7, 'Which tag should be used for the most important heading?',
   '["<h1>", "<h6>", "<heading>", "<title>"]'::jsonb, 0,
   '<h1> is the top-level heading — use exactly one per page.'),
  ('00000000-0000-4000-8000-000000000101', 8, 'What does "responsive design" mean?',
   '["A site that loads quickly", "A site with animations", "A site with no images", "A site that adapts to any screen size"]'::jsonb, 3,
   'Responsive layouts reflow to fit phones, tablets and desktops.'),
  ('00000000-0000-4000-8000-000000000101', 9, 'Which keyword declares a value that can never be reassigned?',
   '["let", "var", "const", "static"]'::jsonb, 2,
   'const creates a constant binding.'),
  ('00000000-0000-4000-8000-000000000101', 10, 'What is the default display value of a <div>?',
   '["block", "inline", "flex", "grid"]'::jsonb, 0,
   '<div> is a block-level element: it starts on a new line and fills its container width.');

-- ---------------- Assignments ----------------

insert into public.course_assignments (id, course_id, lesson_id, order_index, title, prompt, starter_code, difficulty, points_reward) values
  ('00000000-0000-4000-8000-000000000151',
   '00000000-0000-4000-8000-000000000101',
   '00000000-0000-4000-8000-000000000125',
   1,
   'Build a three-card features section',
   'Create a responsive features section with three cards using Flexbox. Each card needs an icon, a bold title, and a short description. Cards must sit side by side on desktop and stack on mobile. Style it with the 60-30-10 rule.',
   '<section class="features">
  <div class="feature-card">
    <div class="icon">🚀</div>
    <h3>Fast</h3>
    <p>Describe the first feature here.</p>
  </div>
  <!-- add two more cards -->
</section>

<style>
  .features { display: flex; gap: 16px; justify-content: center; }
  .feature-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; max-width: 240px; }
  @media (max-width: 768px) { .features { flex-direction: column; align-items: center; } }
</style>',
   'easy', 25),
  ('00000000-0000-4000-8000-000000000152',
   '00000000-0000-4000-8000-000000000101',
   '00000000-0000-4000-8000-000000000128',
   2,
   'Build a working signup form',
   'Build a signup form with name + email fields. When submitted (without reloading), show a personalized thank-you message and disable the button.',
   '<form id="signup">
  <label>Name <input id="name" required /></label>
  <label>Email <input id="email" type="email" required /></label>
  <button type="submit">Join</button>
</form>
<p id="message" hidden></p>',
   'medium', 35),
  ('00000000-0000-4000-8000-000000000153',
   '00000000-0000-4000-8000-000000000101',
   '00000000-0000-4000-8000-000000000132',
   3,
   'Final project: deploy your one-page portfolio',
   'Complete your one-page portfolio (navbar, hero, skills cards, one interactive element, responsive). Deploy it on Netlify, Vercel or GitHub Pages and keep the public URL — you will attach it to your certificate submission.',
   null,
   'hard', 60)
on conflict (id) do nothing;

-- ---------------- Materials (downloads) ----------------

insert into public.course_materials (id, course_id, lesson_id, title, file_url, material_type, description) values
  ('00000000-0000-4000-8000-000000000141',
   '00000000-0000-4000-8000-000000000101', null,
   'Learnify Brand Logo (PNG)', '/logo.png', 'note', 'Official logo — use it in your portfolio projects.'),
  ('00000000-0000-4000-8000-000000000142',
   '00000000-0000-4000-8000-000000000101', null,
   'Certificate Template Pack (Design)', '/certificate.png', 'note', 'Sample certificate designs to study layout, typography and color.'),
  ('00000000-0000-4000-8000-000000000143',
   '00000000-0000-4000-8000-000000000101', null,
   'Bonus: 3D Character Kit (PDF)', '/avatars/eric/Renderpeople_Renderpoints_Voucher.pdf', 'pdf', 'Bonus asset pack for hero sections and mockups.')
on conflict (id) do nothing;
