# Agent Handoff Rules

> **System:** Pipeline  
> **Purpose:** Define how agents pass work to each other without information loss

## Handoff Protocol

### Rule 1: Contracts Are Mandatory
Every handoff must include a completed contract:
- Architect → Planner: `feature_contract.md`
- Planner → Coder: `implementation_plan.md`
- Coder → Reviewer: `patch_contract.md`

### Rule 2: No Implicit Knowledge
The receiving agent must be able to work from **the contract alone**.
No assumptions about what the previous agent "intended."

### Rule 3: Rejection Flow
If the receiving agent finds the contract incomplete:
1. **HALT** — do not proceed
2. Return to the producing agent with specific issues
3. Producing agent revises the contract
4. Handoff is re-attempted

### Rule 4: Context Preservation
Each handoff must carry:
- The original feature request
- The current contract
- Any decisions logged in `PROJECT_MEMORY/decision_log.md`

### Rule 5: No Stage Skipping
```
architect → planner → coder
```
- Coder cannot receive work directly from architect
- Planner cannot skip architect
- No shortcuts allowed

## Failure Escalation

| Problem | Action |
|---------|--------|
| Contract missing fields | Return to producer |
| Contract contradicts architecture | Escalate to architect |
| Contract requires non-existent files | Escalate to repository mapper |
| Contract exceeds scope | Escalate to brainstorming |
