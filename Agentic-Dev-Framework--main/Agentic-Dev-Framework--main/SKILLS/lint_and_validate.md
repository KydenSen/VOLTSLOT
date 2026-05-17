# Skill: Lint & Validate

> **MANDATORY:** Run validation after EVERY code change.  
> **Rule:** No code is "done" until it passes lint.

## Pipeline Position
```
coder → tester → lint_and_validate → reviewer
```

## Python Validation
```bash
# Lint (fast, modern)
ruff check . --fix

# Security scan
bandit -r . -ll

# Type checking
mypy .
```

## Node.js / TypeScript Validation
```bash
# Lint and fix
npm run lint
# or: npx eslint "src/" --fix

# Type checking
npx tsc --noEmit

# Security audit
npm audit --audit-level=high
```

## The Quality Loop
1. **Write/edit code**
2. **Run lint + type check**
3. **Fix all errors** — do not skip warnings that indicate logic issues
4. **Run again** — must pass clean
5. **Only then** mark task as complete

## Error Handling

| Failure | Action |
|---------|--------|
| Lint fails | Fix style/syntax immediately |
| Type check fails | Correct type mismatches before proceeding |
| Security scan warns | Evaluate risk — fix critical/high issues |
| No linter configured | Check for `.eslintrc`, `pyproject.toml`, `ruff.toml` — suggest creating one |

## Strict Rule
**No code should be committed or reported as "done" without passing these checks.**
