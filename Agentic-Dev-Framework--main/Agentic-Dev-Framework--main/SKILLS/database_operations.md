# Skill: Database Operations & Migrations

> **Purpose:** Execute database changes safely, prevent accidental data loss, and enforce robust data modeling.

---

## Core Safety Invariants (NEVER VIOLATE)
1. **Never drop tables in production.**
2. **Never drop columns without a multi-phase deprecation plan.**
3. **Never apply an irreversible migration.** Always provide an `up` and `down` path.
4. **Never rely entirely on ORM auto-sync for production changes.** Generate explicitly verifiable migration files.

---

## Schema Design Rules
1. **Normalization vs. Performance:** Normalize by default (3NF). Denormalize only when a explicit read-performance bottleneck is proven.
2. **Primary Keys:** Default to UUIDs or robust ULIDs unless integer auto-increment is strictly required for legacy integration.
3. **Timestamps:** Every significant table must have `created_at` and `updated_at`.
4. **Soft Deletes:** Default to using a `deleted_at` column instead of hard `DELETE` operations for critical domain entities.
5. **Constraints:** Enforce data integrity at the database level, not just the application level (e.g., Foreign Keys, UNIQUE constraints, NOT NULL).

---

## Migration Workflow
When asked to modify the database:
1. Check `PROJECT_MEMORY/tech_stack_memory.md` for the correct migration tool (e.g., Prisma, Alembic, Flyway).
2. Generate the migration script.
3. Review the script against the Core Safety Invariants.
4. Present the migration script to the user for explicit approval before execution.

---

## Query Generation
- **N+1 Problem:** Always check ORM logic for potential N+1 query loops. Use eager loading (e.g., `.include()`, `.select_related()`) defensively.
- **Indexes:** If adding a query that filters or sorts on a non-indexed column on a large table, propose adding an index in the migration.
