-- Phase 6: JavaScript Zero to Pro expansion — 6 -> 16 lessons, 2 -> 4 modules.
-- Scrimba-informed: projects module (counter, scoreboard, blackjack) + modern JS module.

insert into public.course_modules (id, course_id, title, description, order_index)
values
  ('00000000-0000-4000-8000-000000000037', (select id from public.courses where slug = 'javascript-zero-to-pro'), 'Build with JavaScript', 'Three classic build-along projects that turn syntax into reflexes.', 2),
  ('00000000-0000-4000-8000-000000000038', (select id from public.courses where slug = 'javascript-zero-to-pro'), 'Modern JavaScript', 'Extensions, promises and a full meme app — today''s JavaScript in the wild.', 3);

-- 4221 Conditions & Truthiness (M1)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004221', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000033', 'Conditions & Truthiness', 'if/else thinking and the six falsy values that trip everyone up.', $md$
## First Understanding

- `if` / `else if` / `else` branch your code; `switch` handles many fixed cases.
- Comparison order: `===` (strict) over `==` (loose) — always.
- Six falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN` — everything else is truthy.

## Decisions, decisions

```js
const score = 87;

if (score >= 90) {
  console.log("A grade");
} else if (score >= 75) {
  console.log("B grade");
} else {
  console.log("Keep going!");
}

const day = "Friday";
switch (day) {
  case "Friday": console.log("Weekend loading..."); break;
  case "Monday": console.log("New week, new wins"); break;
  default: console.log("Just another day");
}
```

> [!warning] The == trap
> `0 == ""` is `true` in JavaScript. `0 === ""` is `false`. Strict equality never lies — use `===` and `!==` everywhere.

## Truthiness in the wild

```js
const name = "";

if (name) {
  console.log(`Hello, ${name}`);
} else {
  console.log("Anonymous visitor");
}

const user = { name: "Priya" };
const displayName = user.name ?? "Guest";   // nullish — only falls back on null/undefined
const count = 0 || 10;                      // ⚠ 0 is falsy -> 10 (careful!)
```

> [!tip] ?? vs ||
> `||` falls back on any falsy value (including `0` and `""`); `??` only falls back on `null`/`undefined`. For numbers and strings, `??` is usually what you want.

```diagram
  expression
    |  truthy? -> run block
    |  falsy?  -> skip to else if / else
  falsy list: false  0  ""  null  undefined  NaN
```

```quiz
Q: Which of these is truthy?
A. 0
B. ""
C. "0"
D. null
Correct: C
Explain: "0" is a non-empty string, so it's truthy — only numeric 0 is falsy.
```

## Suggestions and Tips

- Read conditions out loud: "if score is at least 90" matches `>= 90` exactly.
- Use early returns (`if (!user) return;`) to flatten nested ifs.
- Log the values before the condition if a branch never runs — 90% of bugs are wrong data, not wrong logic.
$md$, 7, 8);

-- 4222 Loops & Arrays (M1)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004222', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000033', 'Loops & Arrays', 'Repeat work with for and for...of, and transform data with map/filter.', $md$
## First Understanding

- `for` loops repeat code; `for...of` walks array items cleanly.
- Arrays love methods: `push`, `map`, `filter`, `find`, `includes`, `length`.
- Prefer array methods over hand-written loops — they're shorter and safer.

## The trio you'll use daily

```js
const scores = [45, 82, 67, 91, 58];

for (let i = 0; i < scores.length; i++) {
  console.log(`Score ${i + 1}: ${scores[i]}`);
}

for (const score of scores) {
  if (score >= 60) console.log("Pass:", score);
}

const doubled = scores.map(s => s * 2);              // [90, 164, ...]
const passed = scores.filter(s => s >= 60);          // [82, 67, 91]
const firstFail = scores.find(s => s < 60);          // 45
const hasPerfect = scores.includes(100);             // false
```

> [!info] map vs forEach
> `map` returns a **new array** (transform); `forEach` just runs side effects. If you want the result, use `map`.

## Common array jobs

```js
const cart = ["milk", "bread", "eggs"];

cart.push("butter");          // add to the end
const first = cart.shift();   // remove from the start
const last = cart.pop();      // remove from the end
cart.splice(1, 1);            // remove 1 item at index 1

const total = [10, 20, 30].reduce((sum, n) => sum + n, 0); // 60
```

> [!tip] Loop safety
> Let a `for` loop run while `i < length` — starting from a hard-coded number invites off-by-one bugs. Better: prefer `for...of` and never touch indexes at all.

```quiz
Q: What does scores.filter(s => s >= 60) return?
A. The first score >= 60
B. A new array with all scores >= 60
C. A boolean
D. The original array
Correct: B
Explain: filter returns a NEW array containing every item where the callback returns true.
```

## Suggestions and Tips

- `console.log` the array inside the loop once to see each iteration live.
- Name loop variables by the item's meaning (`score`, `item`), not `i`, when using `for...of`.
- Practise `map`/`filter` on real data (your scores, your grocery list) until they're automatic.
$md$, 8, 8);

-- 4223 Events & Click Handlers (M2)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004223', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000034', 'Events & Click Handlers', 'The moment your page starts reacting — addEventListener and event objects.', $md$
## First Understanding

- `addEventListener("click", fn)` attaches behaviour; the function runs only when the event fires.
- The callback receives an `event` object: `target`, `type`, `key`, `preventDefault()`.
- One listener per responsibility — and never inline `onclick="..."` in HTML.

## The pattern

```html
<button id="like-btn">Like ♥</button>
<p id="likes">0 likes</p>
```

```js
const likeBtn = document.getElementById("like-btn");
const likes = document.getElementById("likes");
let count = 0;

likeBtn.addEventListener("click", (event) => {
  count++;
  likes.textContent = `${count} like${count === 1 ? "" : "s"}`;
  likeBtn.classList.toggle("liked");
});
```

> [!warning] textContent, not innerHTML
> `innerHTML = "..."` reparses HTML and can break scripts or inject text oddly. `textContent` is safe, fast and shows exactly what you set.

## Keyboard and form events

```js
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") console.log("Enter pressed");
});

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page reload
  console.log("Form sent, no reload!");
});

const input = document.querySelector("input");
input.addEventListener("input", () => {
  console.log("Live value:", input.value);
});
```

> [!tip] event.target
> `e.target` is the element the event actually happened on — essential for event delegation (one listener handling many buttons).

```diagram
  user clicks button
       |
       v
  browser creates event object
       |
       v
  addEventListener callback runs
       |
       v
  page updates (textContent / class / style)
```

```quiz
Q: How do you stop a form from reloading the page?
A. return false
B. e.preventDefault()
C. e.stopPropagation()
D. form.reload = false
Correct: B
Explain: preventDefault() cancels the default behaviour (navigation); stopPropagation only stops bubbling.
```

## Suggestions and Tips

- Attach listeners after the elements exist (script at the end of body or DOMContentLoaded).
- Keep the callback small — if it grows past ~10 lines, extract a named function.
- Practise the `likes` counter pattern; it's the seed of every interactive app.
$md$, 9, 8);

-- 4224 Templates & innerHTML (M2)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004224', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000034', 'Templates & innerHTML', 'Render lists and cards with template literals — safely.', $md$
## First Understanding

- Template literals (backticks + `${}`) embed values into strings cleanly.
- Building markup with templates + `innerHTML` renders whole lists in one go.
- Render-then-attach: build the HTML string, set it once, then attach listeners — never in a loop.

## Rendering a list

```js
const apps = ["Notion", "Figma", "VS Code"];

const listHtml = apps
  .map(app => `<li class="app">${app}</li>`)
  .join("");

document.getElementById("apps").innerHTML = `<ul>${listHtml}</ul>`;
```

> [!info] Why .join("")
> `map` returns an array; `innerHTML` needs a string. `.join("")` merges the items with no separator — one expression, no loops.

## Rendering cards with data

```js
const projects = [
  { title: "Business Card", tech: "HTML/CSS" },
  { title: "Counter App", tech: "JavaScript" },
];

const cards = projects.map(p => `
  <article class="project">
    <h3>${p.title}</h3>
    <p>Built with ${p.tech}</p>
  </article>
`).join("");

document.querySelector("#projects").innerHTML = cards;
```

> [!warning] Only interpolate trusted data
> If `p.title` came from a user, `${p.title}` could inject HTML. Escape `<` and `>` (or use textContent) for anything user-supplied.

## Attach events after render

```js
document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("open"));
});
```

> [!tip] Delegation instead
> One listener on the container using `e.target.closest(".project")` beats N listeners on N cards — it survives re-renders automatically.

```diagram
  data array
     |
     v
  map -> template literals -> array of html strings
     |
     v
  .join("") -> one big string
     |
     v
  container.innerHTML = string  (one DOM write)
```

```quiz
Q: What does ${p.tech} inside a template literal do?
A. Escapes the string
B. Inserts the value of p.tech
C. Creates a comment
D. Nothing
Correct: B
Explain: ${expression} evaluates the expression and inserts its string value into the template.
```

## Suggestions and Tips

- One `innerHTML` assignment per render — touching the DOM 100 times in a loop is slow.
- Always `console.log(listHtml)` once before wiring it in; you'll catch typos instantly.
- Combine with `filter` to render subsets: `data.filter(...).map(...)`.
$md$, 10, 8);

-- 4225 Counter App Project (M3)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004225', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000037', 'Counter App Project', 'Project 1 — the famous build-along: increment, decrement, reset and like.', $md$
## First Understanding

- The counter is the "hello world" of interactive apps — it teaches state + events + rendering.
- State lives in one variable; every button updates state, then re-renders the display.
- Rule: state is the single source of truth — never read text from the DOM as your state.

## The complete mini-app

```html
<div id="counter">
  <h1 id="count-el">0</h1>
  <button id="increment-btn">+</button>
  <button id="decrement-btn">−</button>
  <button id="reset-btn">Reset</button>
</div>
```

```js
let count = 0;                 // state
const countEl = document.getElementById("count-el");

function render() {            // one render function
  countEl.textContent = count;
}

document.getElementById("increment-btn").addEventListener("click", () => {
  count = Math.min(count + 1, 100);
  render();
});

document.getElementById("decrement-btn").addEventListener("click", () => {
  count = Math.max(count - 1, 0);
  render();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  count = 0;
  render();
});

render();                      // initial paint
```

> [!info] Why a render function?
> Every button repeats the same "update display" job. One `render()` call after each change means you update state in one place and the UI follows automatically.

## Level up: show the limit

```js
if (count === 100) {
  countEl.style.color = "#ef4444";
  console.log("Max reached!");
}
```

> [!tip] Min/max clamping
> `Math.min(x, 100)` and `Math.max(x, 0)` keep the counter in bounds with zero if/else branching.

```diagram
  click "+"
     |
     v
  count = count + 1  (state change)
     |
     v
  render() -> textContent update
     |
     v
  UI reflects new state
```

```quiz
Q: Why does the app use a render() function instead of updating textContent in every listener?
A. It makes the code longer
B. State changes in one place, UI updates in one place
C. Buttons need it to work
D. It's required for counters
Correct: B
Explain: One render keeps the UI in sync with the single source of truth (state) — the pattern behind every real app.
```

## Suggestions and Tips

- Build it, then rebuild it from memory in 5 minutes — that's the goal, not the first version.
- Add a like button with a "Liked ✓" toggle as a stretch goal (your exercise tests it).
- Open DevTools → Sources → set a breakpoint in render() to watch state flow live.
$md$, 11, 12);

-- 4226 Basketball Scoreboard — Solo Project (M3)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004226', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000037', 'Basketball Scoreboard — Solo Project', 'Project 2 — two teams, three score buttons each, plus a period timer.', $md$
## First Understanding

- Your brief: two scoreboards (Home / Guest), each with +1, +2, +3 buttons, and a New Game reset.
- This is a solo project: the plan below is the spec — implement it yourself before peeking at solutions.
- Two states, one render function each — the counter pattern scales to two.

## The spec

```html
<div class="scoreboard">
  <div class="team">
    <h2>HOME</h2>
    <div id="home-score" class="score">0</div>
    <button onclick-lesson: use addEventListener>+1 +2 +3</button>
  </div>
  <div class="team">
    <h2>GUEST</h2>
    <div id="guest-score" class="score">0</div>
    <button>+1 +2 +3</button>
  </div>
</div>
<button id="new-game">New Game</button>
```

## The core logic

```js
let homeScore = 0;
let guestScore = 0;

const homeEl = document.getElementById("home-score");
const guestEl = document.getElementById("guest-score");

function addHome(points) {
  homeScore += points;
  homeEl.textContent = homeScore;
}

function addGuest(points) {
  guestScore += points;
  guestEl.textContent = guestScore;
}

document.getElementById("new-game").addEventListener("click", () => {
  homeScore = 0;
  guestScore = 0;
  homeEl.textContent = 0;
  guestEl.textContent = 0;
});

// +1/+2/+3 buttons call addHome(1) / addHome(2) / addHome(3)
```

> [!tip] One function, three buttons
> `addHome(points)` takes the value, so three buttons share one function — pass 1, 2 or 3 from each listener.

## Stretch goals

- Highlight the leading team's scoreboard in green.
- Add a period counter (Q1–Q4) that resets on New Game.
- Add a 24-second shot clock with `setInterval`.

> [!info] A friendly hint on shot clocks
> `setInterval(() => { ... }, 1000)` runs a function every second; `clearInterval(id)` stops it. Store the interval id in a variable.

```quiz
Q: What's the cleanest way for three buttons to add different points?
A. Three separate functions
B. One function with a points parameter
C. One listener with inline logic
D. A global variable
Correct: B
Explain: addHome(points) with the value passed per button = one function, three behaviours.
```

## Suggestions and Tips

- Style it like a real arena board: dark background, neon numbers, monospace font.
- Test all six buttons plus New Game before styling — logic first, looks later.
- Upload a screenshot when you finish; this is a genuine portfolio piece.
$md$, 12, 12);

-- 4227 Blackjack Game Logic (M3)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004227', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000037', 'Blackjack Game Logic', 'Project 3 — arrays, randomness and win/lose logic in a real game.', $md$
## First Understanding

- Blackjack is the classic logic project: cards are random numbers, rules decide the outcome.
- The heart is game state + a "start" flag that gates every button.
- Win conditions are pure functions — testable without touching the DOM.

## The state machine

```js
let cards = [];
let sum = 0;
let hasBlackjack = false;
let isAlive = false;
let message = "";

function startGame() {
  isAlive = true;
  hasBlackjack = false;
  cards = [randomCard(), randomCard()];
  sum = cards[0] + cards[1];
  renderGame();
}

function randomCard() {
  const value = Math.floor(Math.random() * 13) + 1; // 1-13
  return value > 10 ? 10 : value;                   // J, Q, K = 10
}

function renderGame() {
  if (sum < 21) message = "Draw a new card?";
  else if (sum === 21) { message = "Blackjack! 🎉"; hasBlackjack = true; }
  else { message = "Bust! Game over."; isAlive = false; }
  // update the DOM: cardsEl, sumEl, messageEl
}

function newCard() {
  if (!isAlive || hasBlackjack) return;  // the gate
  const card = randomCard();
  cards.push(card);
  sum += card;
  renderGame();
}
```

> [!warning] The gate matters
> Without `if (!isAlive || hasBlackjack) return;`, players can draw cards after the game ends — the #1 bug in every first Blackjack build.

## Rendering state

```js
function renderGame() {
  // reuse the render pattern:
  document.getElementById("cards").textContent = "Cards: " + cards.join(" ");
  document.getElementById("sum").textContent = "Sum: " + sum;
  document.getElementById("message").textContent = message;
}
```

> [!tip] Write the logic first
> Put `startGame`, `randomCard` and the win check in plain functions that `console.log` — prove the rules work in the console before connecting buttons.

```diagram
  startGame -> isAlive = true, 2 cards
      |
      v
  newCard (only if alive & no blackjack)
      |
      v
  sum < 21 -> "Draw again?"  (keep playing)
  sum = 21 -> "Blackjack!"   (win)
  sum > 21 -> "Bust!"        (game over)
```

```quiz
Q: Why is `if (!isAlive || hasBlackjack) return;` needed in newCard?
A. To make the game faster
B. To block draws after the round ends
C. To clear the cards array
D. To show the message
Correct: B
Explain: The gate prevents play when the round is over — dead players can't draw cards.
```

## Suggestions and Tips

- Ace handling (1 or 11) is the classic stretch goal — start with aces as 1.
- Show each card drawn on screen, not just the sum — visible state = understandable game.
- After you finish, try the meme-app pattern: reuse `renderGame` to re-render on every change.
$md$, 13, 12);

-- 4228 Chrome Extension Essentials (M4)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004228', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000038', 'Chrome Extension Essentials', 'Your JavaScript ships everywhere — build a browser extension that saves links.', $md$
## First Understanding

- A browser extension is three files: `manifest.json`, an HTML popup, and a script.
- `chrome.tabs` lets you read the current tab's URL — the extension superpower.
- `localStorage` persists your data across sessions without a server.

## The manifest

```json
{
  "manifest_version": 3,
  "name": "Link Saver",
  "version": "1.0",
  "action": { "default_popup": "index.html" },
  "permissions": ["tabs"]
}
```

## The popup logic

```html
<input id="input-el" placeholder="Paste a link">
<button id="input-btn">Save Input</button>
<button id="tab-btn">Save Tab</button>
<ul id="ul-el"></ul>
```

```js
const links = JSON.parse(localStorage.getItem("links") || "[]");
const ulEl = document.getElementById("ul-el");

function renderLinks() {
  ulEl.innerHTML = links
    .map(link => `<li><a href="${link}" target="_blank" rel="noopener">${link}</a></li>`)
    .join("");
}

document.getElementById("input-btn").addEventListener("click", () => {
  const value = document.getElementById("input-el").value.trim();
  if (value) {
    links.push(value);
    localStorage.setItem("links", JSON.stringify(links));
    renderLinks();
  }
});

document.getElementById("tab-btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    links.push(tabs[0].url);
    localStorage.setItem("links", JSON.stringify(links));
    renderLinks();
  });
});

renderLinks();
```

> [!info] localStorage
> `localStorage.setItem(key, JSON.stringify(data))` saves; `JSON.parse(localStorage.getItem(key) || "[]")` loads. Data survives browser restarts — no backend needed.

> [!warning] Extension reloads
> After editing manifest.json you must reload the extension on `chrome://extensions`; for popup HTML/JS, just reopen the popup.

> [!tip] Secure links
> `target="_blank"` on user-saved links can be abused — always add `rel="noopener"`, as in the render above.

```quiz
Q: Where does a chrome extension popup's UI live?
A. On a remote server
B. In its own HTML file opened in a small window
C. In the browser's address bar
D. In a new tab page
Correct: B
Explain: The action popup is a local HTML page the browser displays as a small window.
```

## Suggestions and Tips

- Load it: chrome://extensions → Developer mode → Load unpacked → pick your folder.
- Persist early: save `links` on every mutation so a closed popup never loses data.
- Double-clicking the input and pressing Enter should also save — small touches make it feel real.
$md$, 14, 10);

-- 4229 Promises & Error Handling (M4)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004229', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000038', 'Promises & Error Handling', 'async/await, fetch and try/catch — the foundation of every modern app.', $md$
## First Understanding

- `fetch(url)` returns a Promise — work that finishes later; `await` waits for it.
- `async` functions can use `await`; errors surface via `try` / `catch`.
- Always handle the failure path: networks fail, APIs change, users wait.

## The pattern

```js
async function getQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    document.getElementById("quote").textContent = data.content;
  } catch (err) {
    document.getElementById("quote").textContent = "Couldn't load the quote. Try again later.";
    console.error("Quote error:", err);
  }
}

document.getElementById("new-quote").addEventListener("click", getQuote);
```

> [!info] Two awaits, one fetch
> `await fetch(...)` waits for the response headers; `await response.json()` waits for the body. They're two separate async steps.

## Loading and error states

```js
async function loadData() {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Loading...";

  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error("Bad response");
    const items = await res.json();
    renderItems(items);
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Something went wrong. Please refresh.";
  }
}
```

> [!warning] Never skip catch
> An unhandled rejected promise logs a confusing console error and the user sees a frozen page. `try/catch` with a friendly message is the professional minimum.

```diagram
  click -> async function
     |
     v
  await fetch(url)  ..... network .......
     |
     v
  ok? -> response.json() -> render
  no -> throw -> catch -> friendly error
```

```quiz
Q: What does `await` do inside an async function?
A. Stops the whole page
B. Waits for the promise and unwraps its value
C. Retries the fetch
D. Converts the response to JSON
Correct: B
Explain: await suspends that function until the promise settles, then yields the resolved value — the page stays responsive.
```

## Suggestions and Tips

- Check `response.ok` explicitly — fetch does NOT reject on 404/500, only on network failure.
- Show a loading state before fetch and clear it after — users trust apps that talk to them.
- Use `console.error` (not `log`) in catch blocks so failures stand out in DevTools.
$md$, 15, 10);

-- 4230 Build a Meme App (M4 capstone)
insert into public.lessons (id, course_id, module_id, title, description, content_md, order_index, duration_minutes)
values ('00000000-0000-4000-8000-000000004230', (select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000000038', 'Build a Meme App', 'Capstone — fetch real data, render cards, and add randomness. Your JS toolkit complete.', $md$
## First Understanding

- The capstone fetches memes from an API, renders them as cards, and lets you jump to a random one.
- It combines everything: fetch, async/await, map/render, events, and error states.
- With this app built, you have shipped data-driven UI — the core of modern web work.

## The app

```html
<div class="toolbar">
  <button id="shuffle-btn">Shuffle meme 🎲</button>
</div>
<main id="memes"></main>
```

```js
const memesEl = document.getElementById("memes");

async function fetchMemes() {
  try {
    const res = await fetch("https://api.imgflip.com/get_memes");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data.memes;
  } catch (err) {
    memesEl.innerHTML = "<p class='error'>Couldn't load memes. Check your connection.</p>";
    console.error("Meme fetch failed:", err);
    return [];
  }
}

function renderMemes(memes) {
  memesEl.innerHTML = memes
    .map(m => `
      <article class="meme">
        <img src="${m.url}" alt="${m.name}" loading="lazy">
        <h3>${m.name}</h3>
      </article>
    `)
    .join("");
}

document.getElementById("shuffle-btn").addEventListener("click", async () => {
  const memes = await fetchMemes();
  if (memes.length) {
    const pick = memes[Math.floor(Math.random() * memes.length)];
    memesEl.innerHTML = `
      <article class="meme spotlight">
        <img src="${pick.url}" alt="${pick.name}">
        <h3>${pick.name}</h3>
      </article>`;
  }
});

fetchMemes().then(renderMemes);
```

> [!info] loading="lazy"
> `loading="lazy"` defers off-screen images until they're near the viewport — instant page weight win on image-heavy pages.

> [!tip] .then as a style choice
> `fetchMemes().then(renderMemes)` reads like English: fetch, then render. Both async/await and .then are valid — use whichever reads clearer.

```diagram
  load page -> fetchMemes() -> await fetch -> memes array
                          |
                          v
  renderMemes() -> cards (map + template + innerHTML)
                          |
  click shuffle -> fetch again -> random pick -> single card
```

```quiz
Q: Why wrap fetch in try/catch even though fetch looks simple?
A. fetch can fail silently
B. Network errors and bad responses happen and users deserve a message
C. It makes code slower
D. try/catch is required by browsers
Correct: B
Explain: fetch throws on network failure and needs response.ok checks — catch turns both into a friendly UI message.
```

## Suggestions and Tips

- After it works, add a "search" input that filters memes by name — ten lines, huge satisfaction.
- Try rebuilding the shuffle with a `refresh` of the full grid instead of one card.
- You now have the complete toolkit: state, events, rendering, async, persistence. Build anything.
$md$, 16, 12);

-- Exercises for project lessons
insert into public.lesson_exercises (lesson_id, language, instructions, starter_code, solution_code, hint, passing_grade, xp_reward)
values
('00000000-0000-4000-8000-000000004225', 'javascript', $i$Write counterState() that returns an object with: increment(), decrement(), reset(), getValue(). increment clamps at 100 and sets message "Max reached!", decrement clamps at 0, reset zeroes both.$i$,
 $s$function counterState() {
  let value = 0;
  let message = "";
  // return { increment, decrement, reset, getValue }
  return {
    increment() { },
    decrement() { },
    reset() { },
    getValue() { return value; }
  };
}$s$,
 $o$function counterState() {
  let value = 0;
  let message = "";
  return {
    increment() {
      value = Math.min(value + 1, 100);
      message = value === 100 ? "Max reached!" : "";
    },
    decrement() {
      value = Math.max(value - 1, 0);
      message = value === 0 ? "At zero" : "";
    },
    reset() { value = 0; message = ""; },
    getValue() { return value; },
    getMessage() { return message; }
  };
}$o$,
 $h$Use Math.min(value + 1, 100) to clamp the top and Math.max(value - 1, 0) for the bottom.$h$,
 70, 15),

('00000000-0000-4000-8000-000000004226', 'javascript', $i$Write scoreboard() returning addHome(points), addGuest(points), newGame(), getScores(). Points are 1, 2 or 3. newGame resets both to 0. Never go negative.$i$,
 $s$function scoreboard() {
  let home = 0;
  let guest = 0;
  return {
    addHome(points) { },
    addGuest(points) { },
    newGame() { },
    getScores() { return { home, guest }; }
  };
}$s$,
 $o$function scoreboard() {
  let home = 0;
  let guest = 0;
  return {
    addHome(points) { home = Math.max(home + points, 0); },
    addGuest(points) { guest = Math.max(guest + points, 0); },
    newGame() { home = 0; guest = 0; },
    getScores() { return { home, guest }; }
  };
}$o$,
 $h$Each method updates only its own variable; newGame zeroes both; guard with Math.max to stay non-negative.$h$,
 70, 15),

('00000000-0000-4000-8000-000000004227', 'javascript', $i$Write judgeGame(sum, cards) returning an object: { message, isAlive, hasBlackjack }. If sum < 21: message "Draw a new card?", alive true. If sum === 21: "Blackjack! You win!", blackjack true. Else "Bust! Game over.", alive false. Also return the first card only if cards length is 2: { firstCard: cards[0], secondCard: cards[1] } — omit both when length !== 2 (undefined is fine).$i$,
 $s$function judgeGame(sum, cards) {
  return {};
}$s$,
 $o$function judgeGame(sum, cards) {
  let message, isAlive = true, hasBlackjack = false;
  if (sum < 21) {
    message = "Draw a new card?";
  } else if (sum === 21) {
    message = "Blackjack! You win!";
    hasBlackjack = true;
  } else {
    message = "Bust! Game over.";
    isAlive = false;
  }
  return { message, isAlive, hasBlackjack, firstCard: cards[0], secondCard: cards[1] };
}$o$,
 $h$Three branches: < 21 keep playing, === 21 blackjack (hasBlackjack true), > 21 bust (isAlive false).$h$,
 70, 15),

('00000000-0000-4000-8000-000000004228', 'javascript', $i$Write linksStore() returning load() and save(links). load() parses JSON from the string "stored" using localStorage-style keys via a mock object { getItem, setItem } passed in — return [] on missing/invalid data. save(links) writes JSON.stringify(links). Use the storage object parameter.$i$,
 $s$function linksStore(storage) {
  return {
    load() { },
    save(links) { }
  };
}$s$,
 $o$function linksStore(storage) {
  const KEY = "links";
  return {
    load() {
      const raw = storage.getItem(KEY);
      if (!raw) return [];
      try { return JSON.parse(raw); } catch { return []; }
    },
    save(links) {
      storage.setItem(KEY, JSON.stringify(links));
    }
  };
}$o$,
 $h$getItem returns null when missing — treat null as []. Wrap JSON.parse in try/catch to survive corrupt data.$h$,
 70, 15),

('00000000-0000-4000-8000-000000004230', 'javascript', $i$Write async loadMeme(api) where api is a function returning a promise (like fetch). If it resolves with an object { ok: true, data: url } return the url. If { ok: false, data: msg } throw new Error(msg). On any error, return "Couldn't load the meme. Try again later."$i$,
 $s$async function loadMeme(api) {
  // api() -> Promise<{ ok, data }>
}$s$,
 $o$async function loadMeme(api) {
  try {
    const res = await api();
    if (res.ok) return res.data;
    throw new Error(res.data);
  } catch (err) {
    return "Couldn't load the meme. Try again later.";
  }
}$o$,
 $h$await api() inside try; if !res.ok throw new Error(res.data); catch returns the friendly fallback string.$h$,
 70, 15);

-- Assignments for project lessons
insert into public.course_assignments (course_id, lesson_id, title, prompt, difficulty, points_reward, order_index)
values
((select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000004226', 'Basketball Scoreboard — Solo Project', $a$Build the scoreboard app from the lesson brief:

1. Two teams (Home / Guest) with +1, +2, +3 buttons each
2. A New Game button that resets both scores
3. Highlight the leading team in green
4. Stretch: a period counter (Q1-Q4) or a 24-second shot clock

Use the counter pattern: state in variables, one render path. Test every button. When done, list what you changed from the lesson plan.$a$, 'Beginner', 50, 1),
((select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000004227', 'Blackjack Game', $a$Build a playable single-player Blackjack game:

1. Start button deals two cards and shows sum and message
2. New Card draws while the game is alive
3. Correct win/lose logic (21 = blackjack, over 21 = bust)
4. Show each drawn card on screen
5. Stretch: aces worth 11 (then 1), or a chips/points counter

Use the gate pattern so no cards can be drawn after the round ends.$a$, 'Beginner', 50, 2),
((select id from public.courses where slug = 'javascript-zero-to-pro'), '00000000-0000-4000-8000-000000004230', 'Build a Meme App', $a$Build the meme app with real data:

1. Fetch memes from an API on load and render them as cards
2. A Shuffle button that shows one random meme
3. Loading and error states (friendly messages, console errors)
4. Search input that filters memes by name (stretch)
5. Images use alt text and lazy loading

This is your capstone — combine state, render, events, async and error handling.$a$, 'Beginner', 50, 3);
