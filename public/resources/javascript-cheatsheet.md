# JavaScript Quick Reference
By Learnify AI — Vishwajeet

## Variables
```js
let count = 0;        // can change
const name = "You";   // cannot change
```

## Data Types
string, number, boolean, null, undefined, object, array, function

## Functions
```js
function greet(name) { return `Hello, ${name}!`; }
const greet = (name) => `Hello, ${name}!`;  // arrow
```

## Arrays
```js
const arr = [1, 2, 3];
arr.push(4);          // add end
arr.pop();            // remove end
arr.map(x => x * 2);  // transform
arr.filter(x => x > 1); // keep matches
arr.reduce((a, b) => a + b, 0); // total
```

## Objects
```js
const user = { name: "Vish", age: 25 };
user.name;  user["age"];
const { name, age } = user; // destructure
```

## DOM
```js
document.querySelector(".btn").addEventListener("click", () => {
  console.log("Clicked!");
});
```

## Template Literals
```js
const msg = `Total: ${a + b}`;
```

## Async / Await
```js
async function load() {
  const res = await fetch("/api/data");
  const data = await res.json();
}
```

## Common Pitfalls
- == vs === (always use ===)
- const/let scoping (use let inside blocks)
- Arrays/objects are reference types
