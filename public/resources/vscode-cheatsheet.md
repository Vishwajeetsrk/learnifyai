# VS Code + Git Quick Reference
By Learnify AI — Vishwajeet

## Essential Shortcuts
Ctrl+P → quick open file · Ctrl+Shift+P → command palette · Ctrl+B → toggle sidebar · Ctrl+` → terminal · Ctrl+Shift+L → select all occurrences · Alt+↑/↓ → move line · Ctrl+D → select next match · Ctrl+/ → comment

## Multi-Cursor Magic
Alt+Click anywhere → multiple cursors. Ctrl+Shift+L on a word → edit all at once.

## Top Settings
```json
{
  "editor.formatOnSave": true,
  "editor.fontSize": 15,
  "editor.wordWrap": "on",
  "workbench.colorTheme": "One Dark Pro",
  "files.autoSave": "afterDelay"
}
```

## Must-Have Extensions
- Prettier (formatter)
- ESLint
- Live Server (HTML preview)
- GitLens
- Error Lens
- ES7+ React Snippets
- Python / Java extensions by Microsoft

## Git Basics
```bash
git init
git add .
git commit -m "message"
git push
git pull
git status
git log --oneline
```

## Branching
```bash
git checkout -b feature-name
git merge feature-name
git branch -d feature-name
```

## Undo
git restore file → discard changes · git reset HEAD~1 → undo last commit (keep files)

## VS Code + Git
Source Control tab → stage files with + → type message → commit → push. Learn this, it's your daily workflow.

## Emmet (built-in)
Type "ul>li*3" then Tab → generates an HTML list of 3 items. h1 → <h1></h1>
