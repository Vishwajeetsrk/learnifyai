# HTML & CSS Quick Reference
By Learnify AI — Vishwajeet

## HTML Skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
</html>
```

## Essential Tags
| Tag | Purpose |
| --- | --- |
| <h1>..<h6> | Headings (1 = most important) |
| <p> | Paragraph |
| <a href> | Link |
| <img src alt> | Image |
| <ul>/<ol>/<li> | Bullet / numbered lists |
| <table> <tr> <th> <td> | Tables |
| <form> <input> <button> | Forms |
| <div> / <span> | Layout block / inline |

## Semantic HTML
header, nav, main, section, article, aside, footer — better SEO + accessibility.

## CSS Selectors
```css
element { }        .class { }      #id { }
div p { }          /* descendant */
div > p { }        /* direct child */
a:hover { }        /* pseudo-class */
```

## Box Model (outside → in)
margin > border > padding > content

## Flexbox Quick Start
```css
.container { display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; }
```

## Grid Quick Start
```css
.container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
```

## Common Units
px (fixed) · rem (relative to root, best for fonts) · % (relative) · vh/vw (viewport)

## 60-30-10 Color Rule
60% background · 30% secondary · 10% accent

## Mobile First Media Query
```css
@media (min-width: 768px) { .cards { grid-template-columns: repeat(3, 1fr); } }
```

## Handy Links
MDN: developer.mozilla.org · Can I Use: caniuse.com · CSS Tricks: css-tricks.com
