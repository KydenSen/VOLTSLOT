# Command & Trigger Reference

The `AI_ENTRYPOINT.md` bootloader automatically routes user prompts to specialized modes to save context window. Here are the explicit prompts you can use to trigger the supported workflows.

## Supported Triggers

### 1. Feature Build Mode
**Trigger prompt:** "Build a new feature: [Feature Name]."
**Pipeline Executed:** Full 9-stage pipeline (Brainstorm → Architect → Planner → Coder → Validation → Review → Security).
**Action:** Loads full `SYSTEM_PROMPT.md` and initializes `PROJECT_MEMORY`.

### 2. Quick Fix Mode
**Trigger prompt:** "Quick fix in `[File name]`: [Description of issue]."
**Pipeline Executed:** Direct patch application.
**Action:** Bypasses architecture/planning stages. Loads `coding_rules.md` and `repository_mapper.md`.

### 3. Debug Mode
**Trigger prompt:** "Debug this failure: [Paste Error] in [File Name/Route]."
**Pipeline Executed:** Investigation → Trace → Resolution.
**Action:** Loads `WORKFLOWS/debugging.md` and `AGENTS/debugger.md`. Does not rebuild memory.

### 4. Code Review Mode
**Trigger prompt:** "Code review the recent changes in `[Module/File]`."
**Pipeline Executed:** Audit → Report → Remediation suggestions.
**Action:** Loads `WORKFLOWS/code_review.md` and `AGENTS/core_reviewer.md`.

### 5. Frontend Build Mode
**Trigger prompt:** "Build the UI for [Page/Component]."
**Pipeline Executed:** Design Thinking → Component Plan → Implementation.
**Action:** Explicitly loads `SKILLS/frontend_design.md` alongside standard builder agents to enforce aesthetic and UI requirements.

### 6. Project Bootstrap (Zero-to-One)
**Trigger prompt:** "Bootstrap a new project. Here is the stack and concept: [Details]."
**Pipeline Executed:** Initialization Scaffold → Feature Build.
**Action:** Loads `WORKFLOWS/project_bootstrap.md`, sets up the initial `PROJECT_MEMORY` states, and transitions immediately into the first feature build.

---
> **Note:** Do not ask the AI to "skip planning" if using Feature Build Mode. The framework is strictly designed to halt if stage contracts (`feature_contract.md` or `implementation_plan.md`) are bypassed.
