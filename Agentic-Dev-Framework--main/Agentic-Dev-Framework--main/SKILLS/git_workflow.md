# Skill: Git Workflow

> **Purpose:** Version control conventions for clean project history

## Branch Naming
```
feature/<name>       → new features
fix/<name>           → bug fixes
refactor/<name>      → code improvements
hotfix/<name>        → urgent production fixes
```

## Commit Format
```
type(scope): message
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`

**Examples:**
```
feat(labs): add lab seat layout
fix(auth): correct session validation
refactor(routes): extract student service
test(marks): add edge case coverage
docs(readme): update setup instructions
```

## Commit Rules
- Small, atomic commits — one logical change per commit
- Write in imperative mood: "add feature" not "added feature"
- Never commit secrets, `.env` files, or debug code
- Never commit broken code to main branch

## PR Basics
- Title matches commit format
- Description explains **what** and **why**
- Link related issues
- Request review before merge
