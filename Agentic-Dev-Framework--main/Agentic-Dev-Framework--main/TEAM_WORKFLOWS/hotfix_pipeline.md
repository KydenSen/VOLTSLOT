# Hotfix Pipeline

## Flow
debugger → coder → reviewer → security

## Steps
1. **Debugger** — identifies root cause
2. **Coder** — applies minimal targeted fix
3. **Reviewer** — verifies fix is correct and safe
4. **Security** — checks fix doesn't introduce new vulnerability

## Rules
- No feature additions during hotfix
- Fix must be the smallest possible change
- Must include a regression test
