# Agent Pipeline

> **System:** Pipeline  
> **Purpose:** Define the exact execution order and contract flow between agents

## Pipeline Flow

```
brainstorming
    ↓ (understanding confirmed)
repository_mapper
    ↓ (repo map generated)
architect → produces feature_contract
    ↓ (contract approved)
planner → produces implementation_plan
    ↓ (plan approved)
coder → produces patch_contract per file
    ↓ (patches applied)
tester
    ↓ (tests pass)
lint_and_validate
    ↓ (lint clean)
reviewer
    ↓ (code approved)
security
    ↓ (no vulnerabilities)
DONE
```

## Stage Responsibilities

| Stage | Agent | Input | Output |
|:-----:|-------|-------|--------|
| 1 | Brainstorming | User request | Confirmed understanding + decisions |
| 2 | Repository Mapper | Project root | Structural map |
| 3 | Architect | Map + requirements | Feature contract |
| 4 | Planner | Feature contract | Implementation plan |
| 5 | Coder | Implementation plan | Patch contracts + code |
| 6 | Tester | Modified code | Test results |
| 7 | Lint & Validate | Modified code | Lint report |
| 8 | Reviewer | Code + contracts | Approval or rejection |
| 9 | Security | Code | Vulnerability report |

## Gate Rules
- No stage may execute without the previous stage completing
- Each contract must be validated before the next stage begins
- Any stage can **HALT** the pipeline and send it back to an earlier stage
