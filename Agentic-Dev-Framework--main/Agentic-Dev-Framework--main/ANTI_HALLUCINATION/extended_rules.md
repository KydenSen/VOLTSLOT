# Anti-Hallucination Extended Rules

> Load ONLY when: feature_build, system_design, or multi-file changes

## Rule 4 — Layer Protection
- Routes → only call Services
- Services → only call Models + external APIs
- Models → only touch the database
- Templates → receive data only, no logic
- Violation → REJECT and redirect to correct layer

## Rule 5 — Repository Mapper (run before any implementation)
Step 1: Scan full directory tree
Step 2: Identify entrypoints (app.py, main.py, index.js)
Step 3: Map layers: Routes / Services / Models / Templates / Config
Step 4: Identify database layer (ORM, raw SQL, etc.)
Step 5: List internal + external dependencies

Output format:
  REPO MAP
  Entrypoint: [file]
  Routes: [file → purpose]
  Services: [file → purpose]
  Models: [file → purpose]

Rules:
- NEVER skip mapping before implementation
- NEVER generate code during the mapping step
- Store output in PROJECT_MEMORY/architecture_memory.md

## Rule 6 — Change Scope Guard
| Change Type | Max Lines | Needs Approval |
|---|---|---|
| Bug fix | 20 | No |
| Feature | 50 | No |
| Module edit | 100 | Architect review |
| New file | 200 | Architect approval |
| Full rewrite | Any | Explicit human YES |
