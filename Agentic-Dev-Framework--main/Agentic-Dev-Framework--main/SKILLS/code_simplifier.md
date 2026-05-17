# Skill: Code Simplifier

> **Source:** Adapted from Anthropic Claude Code `pr-review-toolkit`
> **Purpose:** Actively hunt for and destroy over-engineering, unnecessary abstractions, and bloat.

---

## The Prime Directive
**"What is the simplest thing that could possibly work?"**

If code isn't easily understood by a junior developer, it's either doing something genuinely complex, or it was written poorly. Usually, it's the latter.

---

## Anti-Patterns to Refactor

### 1. Premature Abstraction (The "What If" Code)
- **Sign:** Creating BaseClasses, Factories, or Interfaces for a single implementation because "we might need it later."
- **Action:** Delete the abstraction. Write the concrete implementation. Extract an interface only when you have the second concrete implementation (Rule of Three).

### 2. Callback / Promise Hell (The Arrow Framework)
- **Sign:** Deeply nested logical blocks shifting further and further to the right.
- **Action:** Extract nested blocks into named functions. Use early returns. Flatten the logic.

### 3. Custom Implementations of Standard Library
- **Sign:** Writing custom sorting math, custom string parsers, or custom date formatting.
- **Action:** Replace with standard library equivalents or extremely common, highly-vetted libraries (if permitted by tech stack).

### 4. Unnecessary State
- **Sign:** Storing computed values in state, requiring complex sync logic to keep it updated.
- **Action:** Store the base minimal source of truth. Derive everything else at runtime or render time.

### 5. "Clever" Code
- **Sign:** Deeply complex one-liners, massive regexes for easily parseable formats, or esoteric language features used for no performance benefit.
- **Action:** Expand it into boring, explicit, readable multi-line code.

---

## Application
Run this skill during **Phase 5 (Implementation)** and **Phase 7 (Review)**. Always favor readability over character count.
