# Skill: Type & Design Analyzer

> **Source:** Adapted from Anthropic Claude Code `pr-review-toolkit`
> **Purpose:** Elevate code from "working" to "structurally sound" by enforcing strict type boundaries and cohesive design patterns.

---

## What to Eliminate

When reviewing or writing code, actively remove these design anti-patterns:

### 1. The `any` / `dict` Escape Hatch
- **Anti-Pattern:** Using `any` in TypeScript or raw `dict` in Python for complex data.
- **Fix:** Define exact interfaces, types, or Pydantic/dataclass models. If data is truly dynamic, use `Record<string, unknown>` and validate it at the boundary.

### 2. Boolean Paralysis (Flag Soup)
- **Anti-Pattern:** Functions taking 3+ boolean arguments (`render(true, false, true)`).
- **Fix:** Use configuration objects, enums, or discriminated unions. 
  *Example:* `render({ theme: 'dark', showSidebar: false, compact: true })`

### 3. Implicit States
- **Anti-Pattern:** Using multiple independent variables to track state that can conflict. (e.g., `isLoading = true`, `error = "failed"`, `data = null`).
- **Fix:** Use state machines or discriminated unions (e.g., `{ status: 'loading' } | { status: 'error', message: string } | { status: 'success', data: Data }`).

### 4. Over-Mocking in Tests
- **Anti-Pattern:** Tests where everything is mocked, testing the mocks rather than the logic.
- **Fix:** Redesign the code so business logic is pure and decoupled from I/O. Test the pure logic directly.

### 5. Anemic Domain Models
- **Anti-Pattern:** Classes or interfaces that are just bags of getters/setters with no behavior, while external fat "services" manipulate them.
- **Fix:** Push logic into the class where the data lives.

---

## Application
Invoke this skill during **Phase 4 (Architecture)** and **Phase 7 (Review)**. Code must map cleanly to domain concepts.
