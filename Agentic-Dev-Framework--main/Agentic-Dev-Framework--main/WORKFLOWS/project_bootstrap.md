# Workflow: Project Bootstrap (Zero-to-One)

> **System:** Workflow  
> **Purpose:** Safely start an entirely new project from an empty directory, avoiding hallucinated structures and establishing a solid architectural foundation.

---

## Phase 1: Tech Stack Selection & Scaffolding
1. **Clarify Requirements:** Read `SKILLS/brainstorming.md`. Ask the user about the desired tech stack (Frontend, Backend, Database, Frameworks).
2. **Setup Execution:** Propose the exact CLI commands needed to generate the scaffolding (e.g., `npx create-next-app@latest`, `django-admin startproject`, `npm create vite@latest`).
3. **Wait for Approval:** Do NOT run scaffolding commands without the user's explicit permission.
4. **Execute Initialization:** Once approved, execute the commands to populate the directory.

---

## Phase 2: Memory Initialization
Before writing *any* feature code, initialize the project memory so the AI has a foundation to build on:

1. **Populate `PROJECT_MEMORY/tech_stack_memory.md`**: Log all selected frameworks, versions, and constraints.
2. **Populate `PROJECT_MEMORY/architecture_memory.md`**: Define the directory structure, architectural layers (e.g., routes, services, models), and core data flow.
3. **Populate `PROJECT_MEMORY/decision_log.md`**: Log the initial tech stack selection as Decision #1.

---

## Phase 3: Base Configuration
1. Setup core configuration files (e.g., `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.env.example`).
2. Implement routing foundation (if applicable).
3. Connect the database and verify the connection.
4. Setup `SKILLS/database_operations.md` and define the migration strategy.

---

## Phase 4: Handoff to Feature Pipeline
Once the base is established and memory files are populated:
1. Stop the bootstrap workflow.
2. Transition to `Feature Build Mode` (via `AI_ENTRYPOINT.md`) for all subsequent feature development.

**Rule:** Never use this workflow if the project already has an established codebase or a `package.json`/`requirements.txt` file in the root. Use the standard feature pipeline instead.
