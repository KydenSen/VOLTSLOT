# Anti-Hallucination Core Rules

> Load: EVERY task, no exceptions

## Rule 1 — File Verification (CRITICAL)
- Verify a file actually exists before modifying it. Do NOT guess.
- NEVER write an import path you haven't verified.
- NEVER call a function you haven't explicitly seen in the codebase.
- If unsure → HALT and ask.

## Rule 2 — Minimal Change & Scope Guard
- Edit ONLY what the task explicitly requires.
- Do not modify files outside the defined scope of the contract.
- Bug fix = max 20 lines. Small feature = max 50 lines.

## Rule 3 — Safety & Layer Protection
- Always map repo structure before making cross-file edits.
- Prevent cross-layer modification without validation (e.g., UI should not call DB directly).
- Do not invent variable names, routes, or columns.
- Do not create files unless explicitly approved.

## Failure Response
If any rule is violated:
→ HALT
→ State which rule was broken
→ State what verification is explicitly needed
