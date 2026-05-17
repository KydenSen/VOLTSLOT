# How It Works: System Architecture

The Agentic Dev Framework is built as an engineered state machine. Its directory structure is not arbitrary.

## AGENTS/ vs TEAM_AGENTS/ (Identity vs Capability)

- **`AGENTS/` (Identity):** These files define *who* the AI is at a macro level (e.g., `architect.md`, `builder.md`). They set conversational tone, core priorities, and primary responsibilities.
- **`TEAM_AGENTS/` (Capability):** These files define *what specific operation* the AI is currently authorized to perform. `planner.md` or `security.md` don't define the AI's entire personality, they provide strict operational boundaries for a single pipeline stage. 

*Why split them?* Because an AI acting as a "Builder" (Identity) still needs to switch hats between "Coder" and "Tester" (Capabilities) during implementation.

## The ANTI_HALLUCINATION/ Layer

LLMs are prone to guessing file paths and mocking abstractions that don't exist.
- Files in this directory (like `repository_mapper.md` and `file_verification.md`) act as safety throttles.
- **Why it is always loaded:** Code generation operates under the assumption of absolute truth. By loading `ANTI_HALLUCINATION` in *every* mode within `AI_ENTRYPOINT.md`, the AI is explicitly blocked from issuing file modifications unless it has performed a read-action on that specific file path first.

## TASK_CONTRACTS/ (Proof of Pipeline)

The pipeline is useless if the AI skips steps internally in its context window.
- Contracts (`feature_contract.md`, `implementation_plan.md`, `patch_contract.md`) act as system "save states" and immutable hand-offs.
- The Planner agent is strictly forbidden from operating unless it consumes an approved Feature Contract. 
- These contracts *prove* the AI actually executed the 9-stage pipeline and didn't jump straight from Brainstorming to Coding.

## PROJECT_MEMORY/ (State Persistence)

LLMs suffer from context decay over long sessions.
- Files like `architecture_memory.md`, `decision_log.md`, and `tech_stack_memory.md` serve as a persistent cache.
- The AI updates these files as it makes global decisions. When you open your IDE tomorrow and start a new session, the AI reads these memory files during the `AI_ENTRYPOINT.md` boot sequence, immediately recovering the context of why certain architectural decisions were made weeks ago.
