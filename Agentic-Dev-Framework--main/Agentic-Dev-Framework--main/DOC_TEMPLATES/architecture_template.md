# Architecture Overview

## System Layers
- **Routes** — HTTP entry points, input validation only
- **Services** — Business logic, orchestration
- **Models** — Data access, schema definitions
- **Templates/Views** — Presentation only, no backend logic

## Data Flow
[Request] → Route → Service → Model → [Response]

## Key Design Decisions
- [Decision 1 and rationale]
- [Decision 2 and rationale]
