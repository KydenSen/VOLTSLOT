# Changelog

## [v3.1] - Current
- Introduced `AI_ENTRYPOINT.md` as a smart bootloader to reduce context window usage across 6 specialized modes.
- Added explicit Security agent validation at the end of the 9-stage pipeline.
- Enforced strict frontend aesthetics and component design workflows.
- Extracted and renamed core vs team reviewers to prevent persona overlap.
- Moved third-party capability scripts to community-skills block.

## [v3.0]
- Formalized the 9-stage mandatory execution pipeline (Brainstorm → Security).
- Introduced the `ANTI_HALLUCINATION/repository_mapper.md` to force read-only discovery before writing.
- Splintered agent identity definitions into `AGENTS/` (core persona) and `TEAM_AGENTS/` (specialized capabilities).
- Integrated TDD workflow mandates.
- Codified strict agent handoff rules prohibiting implicit knowledge transfer.

## [v2.0]
- Formalized structured Markdown contracts (`feature_contract.md`, `implementation_plan.md`, `patch_contract.md`).
- Integrated automated file existence verification checks before patch generation.
- Segregated responsibilities between architect, planner, and coder roles.
- Defined system boundary protections to prevent vertical architecture layer bleeding.
- Introduced elite code analysis skills (simplifier, silent failure hunter).

## [v1.0]
- Established the base concept of prompted AI workflow boundaries.
- Introduced foundational `PROJECT_MEMORY` to persist decisions across single chat sessions.
- Created `brainstorming.md` to require requirement clarification prior to generation.
- Added base global coding style constraints.
- Initial concept of anti-hallucination rules introduced.
