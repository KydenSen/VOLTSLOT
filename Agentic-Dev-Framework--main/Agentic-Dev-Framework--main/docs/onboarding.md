# Onboarding & Setup Guide

Welcome to the Agentic Dev Framework. This framework turns your AI coding assistant into a structured, predictable engineering pipeline.

## 1. Setup for Cursor / Antigravity Users

1. Copy the entire `ai-tool-kit/` directory into the root of your project.
2. The framework includes `.cursorrules` and `.antigravityrules` files that tell the IDE "Read AI_ENTRYPOINT.md at the start of every session before doing anything."
3. Open a new chat in Cursor or Antigravity IDE.
4. **What to type:** Simply state your goal. Example: "I need to build a user authentication system."
5. **What happens:** The IDE reads the rules file, boots `AI_ENTRYPOINT.md`, classifies your request (e.g., Feature Build), loads *only* the specific context files needed for that mode, and begins phase 1 (Brainstorming).

## 2. Setup for Windsurf Users

1. Copy the `ai-tool-kit/` directory to the root of your project.
2. The `.windsurfrules` file automatically forces Cascade to read `AI_ENTRYPOINT.md` on boot.
3. Open a new Cascade session.
4. **What to type:** "We have a bug where the form submits twice on mobile."
5. **What happens:** Cascade reads the bootloader, triggers **Debug Mode**, loads the repository mapper and debugger agent, and begins trace analysis without reading the entire 82-file toolkit.

## 3. What the 9-Stage Pipeline Actually Does

When you trigger a "Feature Build", the AI is locked into this flow:

1. **Brainstorming:** The AI acts as a product manager. It asks *you* clarifying questions before it is allowed to write code.
2. **Repository Mapper:** The AI executes a read-only scan of your current file path to ground itself in reality.
3. **Architect:** Evaluates boundaries and proposes the structural approach. Output: `feature_contract.md`.
4. **Planner:** Turns the architecture into sequential tickets. Output: `implementation_plan.md`.
5. **Coder:** Executes the plan using targeted patches. Output: `patch_contract.md`.
6. **Tester:** Requires tests before finalization.
7. **Lint & Validate:** Ensures formatting and typing.
8. **Reviewer:** The AI self-audits its own diffs against the original feature contract.
9. **Security:** A final scan for OWASP issues or leaked credentials.

## 4. How to Read a Task Contract

The AI will output contracts (Markdown files) to prove it completed a stage. Do not ignore these.

- **Feature Contract (`TASK_CONTRACTS/feature_contract.md`):** Look at the **"Out of Scope"** section. If the AI missed constraints, tell it to update the contract before moving to Planner.
- **Implementation Plan (`TASK_CONTRACTS/implementation_plan.md`):** Look at the **"Order of Execution"**. Ensure it isn't trying to build UI before the database schema exists.
- **Patch Contract (`TASK_CONTRACTS/patch_contract.md`):** Look at the **"Files Affected"**. If it hallucinated a path here, stop it.
