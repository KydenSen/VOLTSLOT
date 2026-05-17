# Skill: Error Recovery

> **Purpose:** Gracefully handle failures without breaking the codebase

## When an Error Occurs

### Step 1: Stop
Do not attempt to fix blindly. Read the full error first.

### Step 2: Classify

| Type | Action |
|------|--------|
| Syntax error | Fix immediately — typo or missing character |
| Logic error | Trace data flow, identify wrong assumption |
| Runtime error | Check inputs, null values, missing resources |
| Import error | Verify module exists and path is correct |
| Database error | Check schema matches expected structure |

### Step 3: Contain
- Do not change unrelated code while fixing
- Do not refactor during error recovery
- Fix the error only — nothing else

### Step 4: Verify
- Run the failing operation again
- Confirm existing tests still pass
- Check for regressions in adjacent functionality

### Step 5: Document
If the error was non-obvious:
- Add a comment explaining the fix
- Update `PROJECT_MEMORY/feature_memory.md` if it affects a feature

## Recovery Rules
- Never suppress errors with empty catch blocks
- Never delete code to "fix" an error without understanding root cause
- If the fix exceeds 20 lines → the issue may be architectural. Escalate to architect.
- If the same error recurs → the root cause was not fixed. Start over.
