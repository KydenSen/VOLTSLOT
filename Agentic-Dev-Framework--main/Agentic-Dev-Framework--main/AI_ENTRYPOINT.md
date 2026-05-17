# AI ENTRYPOINT (BOOTLOADER)

This is the central operating system file. ALL sessions must begin by reading and executing this classification.

## STEP 1: CLASSIFY TASK
Identify the user's intent. Must map to ONE of these categories:
- `quick_fix`: Small bug, typo, minor logic error.
- `bug_fix`: Complex bug requiring trace/investigation.
- `feature_build`: New function, route, component, or system.
- `code_review`: Audit of recent changes.
- `system_design`: Big picture architecture / bootstrapping.

## STEP 2: LOAD MINIMUM REQUIRED CONTEXT
Based on classification, load EXACTLY these files and NO OTHERS:

**IF quick_fix:**
- `ANTI_HALLUCINATION/core_rules.md`
- Relevant `SKILLS/` (MAX 2)

**IF bug_fix:**
- `ANTI_HALLUCINATION/core_rules.md`
- `ANTI_HALLUCINATION/extended_rules.md`
- `WORKFLOWS/debugging.md`
- `AGENTS/debugger.md`

**IF feature_build:**
- `ANTI_HALLUCINATION/core_rules.md`
- `ANTI_HALLUCINATION/extended_rules.md`
- `PIPELINE/*` (adaptive subset, see Step 3)
- `TASK_CONTRACTS/*`

**IF system_design:**
- `ANTI_HALLUCINATION/*`
- `PIPELINE/agent_pipeline.md`
- `PROJECT_MEMORY/*` (Active context only)
- `REPO_INTELLIGENCE/*`

## STEP 3: ADAPTIVE PIPELINE EXECUTION
Short-circuit the 9-stage pipeline based on the task:

**IF quick_fix:**
- Pipeline: Coder → Reviewer
- *Skip Planning, skip Architecture.*

**IF bug_fix:**
- Pipeline: Repo Mapper → Coder → Tester → Reviewer
- *Skip Brainstorming and Architecture.*

**IF feature_build (Small):**
- Pipeline: Planner → Coder → Reviewer
- *Skip Architect.*

**IF feature_build (Complex) / system_design:**
- Pipeline: Full 9-Stages (Brainstorm → Security).

## STEP 4: SESSION STRATEGY
Do NOT mix large phases in one chat session.
- Session 1 → Repository Mapping & Planning
- Session 2 → Implementation & Commit
- Session 3 → Debugging & Validation

If task size approaches context limits, explicitly ask the user to start a new chat and pass the Task Contract JSON.

## STEP 5: STRICT RESPONSE CONTROL
- No repeated explanations or reasoning logic in conversational text.
- No unnecessary storytelling.
- No full file dumps. Output ONLY changed sections (use diff format when possible).
- Output ONLY the required format. Prefer structured compact JSON blocks.

## STEP 6: PROJECT MEMORY UPDATES
- Always update `PROJECT_MEMORY/active_context.md` at the end of a task.
- Store key architecture decisions in `PROJECT_MEMORY/decisions.md` (store summaries, not full logs).
- Do not reload full memory history across new sessions—load only the current active state.
