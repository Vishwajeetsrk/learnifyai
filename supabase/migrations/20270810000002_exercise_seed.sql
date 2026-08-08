-- Seed curated coding exercises for the 18 pilot lessons across 4 courses.
-- All exercises are original Learnify content (challenge patterns inspired by the Scrimba curriculum
-- in "Learn and Developer", written from scratch — no verbatim copying).

insert into public.lesson_exercises (lesson_id, language, instructions, starter_code, solution_code, hint, passing_grade, xp_reward) values
-- ────────────────────────────── JavaScript Zero to Pro ──────────────────────────────
('00000000-0000-4000-8000-000000004047', 'javascript', $i$Create a program that prints exactly three lines:
1. Hello from JavaScript!
2. The page you see runs on this language.
3. You just wrote your first real code.

Use one console.log per line. The order matters — run it and compare with the output panel.$i$, $s$// Use console.log to print the three lines below$s$, $o$console.log("Hello from JavaScript!");
console.log("The page you see runs on this language.");
console.log("You just wrote your first real code.");$o$, $h$Type console.log("your message") on its own line, once per line of output.$h$, 70, 10),
('00000000-0000-4000-8000-000000004048', 'javascript', $i$Build a small bill-splitting program:
- const bill = 240 (already given)
- const tipPercent = 15
- Calculate the tip amount (bill * tipPercent / 100) and the total (bill + tip).
- Print exactly two lines using template literals:
  Tip: $36
  Total: $276
The values must be computed from the variables, not hardcoded.$i$, $s$const bill = 240;
const tipPercent = 15;

// Calculate the tip and the total below, then print them$s$, $o$const bill = 240;
const tipPercent = 15;

const tip = (bill * tipPercent) / 100;
const total = bill + tip;

console.log(`Tip: $${tip}`);
console.log(`Total: $${total}`);$o$, $h$Template literals use backticks: `Tip: $${tip}`. A percent means dividing by 100.$h$, 70, 10),
('00000000-0000-4000-8000-000000004049', 'javascript', $i$Write two functions:
1. greet(name) — a regular function that prints "Hello, <name>!" (template literal).
2. double(n) — an arrow function that returns n * 2.

Then call greet("Learner") and console.log(double(21)).
Expected output:
Hello, Learner!
42$i$, $s$// 1. Declare a regular function greet(name) that prints "Hello, <name>!"
// 2. Declare an arrow function double(n) that returns n * 2

// Call both below$s$, $o$function greet(name) {
  console.log(`Hello, ${name}!`);
}

const double = (n) => n * 2;

greet("Learner");
console.log(double(21));$o$, $h$Arrow functions: const double = (n) => n * 2. For output, print the return value with console.log.$h$, 70, 10),
('00000000-0000-4000-8000-000000004050', 'javascript', $i$Before touching a real page, model what the DOM does. Write:
1. makeClickCount() — returns a function that adds 1 to an internal counter each time it's called and returns the new value (a closure).
2. toListItem(text) — wraps text in an <li> element and returns the string.

Then:
const click = makeClickCount();
click();
click();
console.log(click());                // 3
console.log(toListItem("Buy milk")); // <li>Buy milk</li>

Expected output:
3
<li>Buy milk</li>$i$, $s$// 1. makeClickCount() — closure with an internal counter
// 2. toListItem(text) — wraps text in an <li> element$s$, $o$function makeClickCount() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const toListItem = (text) => `<li>${text}</li>`;

const click = makeClickCount();
click();
click();
console.log(click());
console.log(toListItem("Buy milk"));$o$, $h$The returned function must remember a variable declared in makeClickCount — that's the closure.$h$, 75, 15),
('00000000-0000-4000-8000-000000004051', 'javascript', $i$Write a function totalPrice(items) that sums the price of every item in a cart using .reduce() (a for loop is also fine), then print the result.

const cart = [
  { name: "Notebook", price: 120 },
  { name: "Pen", price: 25 },
  { name: "Backpack", price: 899 },
];

Expected output:
1044$i$, $s$const cart = [
  { name: "Notebook", price: 120 },
  { name: "Pen", price: 25 },
  { name: "Backpack", price: 899 },
];

// Write totalPrice(items), then print the cart total$s$, $o$const totalPrice = (items) =>
  items.reduce((sum, item) => sum + item.price, 0);

console.log(totalPrice(cart));$o$, $h$reduce((sum, item) => sum + item.price, 0) — the 0 is the starting sum.$h$, 70, 10),
('00000000-0000-4000-8000-000000004052', 'javascript', $i$Simulate a real API call. Write an async function fetchUser(id) that:
- waits 300 ms using await new Promise((resolve) => setTimeout(resolve, 300))
- returns { id, name: "Learner " + id }
- does NOT print anything itself

Then call it and print the returned name:
Expected output:
Learner 7$i$, $s$// Write async function fetchUser(id), then call it and print user.name$s$, $o$async function fetchUser(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id, name: `Learner ${id}` };
}

fetchUser(7).then((user) => console.log(user.name));$o$, $h$Async functions always return a Promise — use .then() or await to get the value.$h$, 75, 15),

-- ────────────────────────────── Python for Everyone ──────────────────────────────
('00000000-0000-4000-8000-000000004053', 'python', $i$Print two lines:
Python is easy to read.
Python powers AI, data, and the web.

Store the language name in a variable and include it in at least one line using an f-string.$i$, $s$# Store "Python" in a variable, then print both lines$s$, $o$language = "Python"
print(f"{language} is easy to read.")
print(f"{language} powers AI, data, and the web.")$o$, $h$f-strings: f"{variable} text" inserts the value of the variable.$h$, 70, 10),
('00000000-0000-4000-8000-000000004054', 'python', $i$You spend 5000 on courses, 2000 on books, and 1200 on coffee every month. Write a program that:
- stores each amount in a variable
- computes the total spend
- prints exactly one line using an f-string: "Total spend: 8200"

The 8200 must be computed, not hardcoded.$i$, $s$# courses = 5000
# books = 2000
# coffee = 1200
# compute total and print it with an f-string$s$, $o$courses = 5000
books = 2000
coffee = 1200
total = courses + books + coffee
print(f"Total spend: {total}")$o$, $h$f"Total spend: {total}" — braces hold the variable.$h$, 70, 10),
('00000000-0000-4000-8000-000000004055', 'python', $i$scores = [72, 95, 88, 64, 91]

Write a loop that prints each score as "Score: <n>", then print the average using sum() and len().

Expected output:
Score: 72
Score: 95
Score: 88
Score: 64
Score: 91
Average: 82.0$i$, $s$scores = [72, 95, 88, 64, 91]

# Loop through scores, printing "Score: <n>" for each
# Then print "Average: <avg>"$s$, $o$scores = [72, 95, 88, 64, 91]

for score in scores:
    print(f"Score: {score}")

average = sum(scores) / len(scores)
print(f"Average: {average}")$o$, $h$for score in scores: — remember the colon and the 4-space indent.$h$, 70, 10),
('00000000-0000-4000-8000-000000004056', 'python', $i$Write a function divide(a, b) that:
- returns a / b when it works
- catches ZeroDivisionError and returns the string "Cannot divide by zero"

Then print divide(10, 2) and divide(10, 0).

Expected output:
5.0
Cannot divide by zero$i$, $s$# Write divide(a, b) with a try/except, then print both calls$s$, $o$def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"

print(divide(10, 2))
print(divide(10, 0))$o$, $h$try: ... except ZeroDivisionError: — the except must name the error type.$h$, 75, 15),

-- ────────────────────────────── HTML & CSS Essentials (JS-flavored) ──────────────────────────────
('00000000-0000-4000-8000-000000004041', 'javascript', $i$Every web page is a string of HTML. Write a function buildPage(title) that returns a complete page skeleton using a template literal:

<!doctype html>
<html>
  <head><title>{title}</title></head>
  <body>
    <h1>Welcome</h1>
  </body>
</html>

Then print buildPage("My First Site"). The output must contain the doctype, a <title> with "My First Site", and <h1>Welcome</h1>.$i$, $s$// Write buildPage(title) using a template literal, then print it$s$, $o$function buildPage(title) {
  return `<!doctype html>
<html>
  <head><title>${title}</title></head>
  <body>
    <h1>Welcome</h1>
  </body>
</html>`;
}

console.log(buildPage("My First Site"));$o$, $h$Backticks let you span multiple lines and insert ${title} inline.$h$, 70, 10),
('00000000-0000-4000-8000-000000004042', 'javascript', $i$Write a function greetingCard(name) that returns an HTML card as a string:

<div class="card">
  <h1>Hello, {name}!</h1>
  <p>Welcome to your first page.</p>
</div>

Then print greetingCard("Aisha").
The output must contain class="card", "Hello, Aisha!", and "Welcome to your first page."$i$, $s$// Write greetingCard(name), then print it with "Aisha"$s$, $o$function greetingCard(name) {
  return `<div class="card">
  <h1>Hello, ${name}!</h1>
  <p>Welcome to your first page.</p>
</div>`;
}

console.log(greetingCard("Aisha"));$o$, $h$Class attributes live inside double quotes: class="card".$h$, 70, 10),
('00000000-0000-4000-8000-000000004043', 'javascript', $i$Semantic HTML means using tags that describe their content. Write a function articleHtml(title, body) that wraps content in semantic tags:

<article>
  <h2>{title}</h2>
  <p>{body}</p>
</article>

Then print articleHtml("Lists are semantic", "Use <ul> for lists, not tables.").
The output must contain <article>, <h2>Lists are semantic</h2>, and a <p> tag.$i$, $s$// Write articleHtml(title, body), then print it with the example content$s$, $o$function articleHtml(title, body) {
  return `<article>
  <h2>${title}</h2>
  <p>${body}</p>
</article>`;
}

console.log(articleHtml("Lists are semantic", "Use <ul> for lists, not tables."));$o$, $h$Insert both arguments with ${title} and ${body} inside the template literal.$h$, 70, 10),
('00000000-0000-4000-8000-000000004044', 'javascript', $i$Write a function buttonStyle(color) that returns a CSS rule as a string:

button {
  background: {color};
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}

Then print buttonStyle("#4f46e5").
The output must contain "button {", "background: #4f46e5;", and "cursor: pointer;".$i$, $s$// Write buttonStyle(color), then print it with "#4f46e5"$s$, $o$function buttonStyle(color) {
  return `button {
  background: ${color};
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}`;
}

console.log(buttonStyle("#4f46e5"));$o$, $h$CSS rules: selector, then { declarations; } — each declaration ends with a semicolon.$h$, 70, 10),

-- ────────────────────────────── Template Mastery ──────────────────────────────
('00000000-0000-4000-8000-000000000121', 'javascript', $i$A browser sends a request and gets a response. Write a function request(url) that returns three lines:

Request: GET {url}
Response: 200 OK
Body: welcome

Then print request("https://learnify.ai/courses").
The output must contain "Request: GET https://learnify.ai/courses", "Response: 200 OK", and "Body: welcome".$i$, $s$// Write request(url), then print it with the example URL$s$, $o$function request(url) {
  return `Request: GET ${url}
Response: 200 OK
Body: welcome`;
}

console.log(request("https://learnify.ai/courses"));$o$, $h$Split lines inside the template literal with real newlines.$h$, 70, 10),
('00000000-0000-4000-8000-000000000122', 'javascript', $i$Write a function navHtml(items) that turns an array of link labels into a navigation menu:

<nav>
  <ul>
    <li>Home</li>
    <li>Courses</li>
    <li>Contact</li>
  </ul>
</nav>

Build each <li> with a loop or .map() so the function works for any array. Print navHtml(["Home", "Courses", "Contact"]).
The output must contain <nav>, a <ul>, and three <li> items with the given labels.$i$, $s$// Write navHtml(items), then print it with ["Home", "Courses", "Contact"]$s$, $o$function navHtml(items) {
  const lis = items.map((item) => `    <li>${item}</li>`).join("\n");
  return `<nav>
  <ul>
${lis}
  </ul>
</nav>`;
}

console.log(navHtml(["Home", "Courses", "Contact"]));$o$, $h$items.map(item => `<li>${item}</li>`).join("\n") builds the rows, then embed them in the template.$h$, 75, 15),
('00000000-0000-4000-8000-000000000125', 'javascript', $i$The box model wraps every element in padding, border, and margin. Write a function styleBox(padding, border) that returns a CSS rule:

.box {
  padding: {padding}px;
  border: {border}px solid #ddd;
  margin: 12px;
}

Then print styleBox(24, 2).
The output must contain ".box {", "padding: 24px;", "border: 2px solid #ddd;", and "margin: 12px;".$i$, $s$// Write styleBox(padding, border), then print it with (24, 2)$s$, $o$function styleBox(padding, border) {
  return `.box {
  padding: ${padding}px;
  border: ${border}px solid #ddd;
  margin: 12px;
}`;
}

console.log(styleBox(24, 2));$o$, $h$Inside the box, from the element outward: padding, border, margin.$h$, 70, 10),
('00000000-0000-4000-8000-000000000127', 'javascript', $i$Dark mode! Write a function toggleTheme(current) that returns "dark" when given "light", and "light" when given "dark". Print both cases.

Expected output:
dark
light$i$, $s$// Write toggleTheme(current), then print toggleTheme("light") and toggleTheme("dark")$s$, $o$function toggleTheme(current) {
  if (current === "light") return "dark";
  return "light";
}

console.log(toggleTheme("light"));
console.log(toggleTheme("dark"));$o$, $h$An if/else on the current value — if it's "light" return "dark", otherwise return "light".$h$, 70, 10);
