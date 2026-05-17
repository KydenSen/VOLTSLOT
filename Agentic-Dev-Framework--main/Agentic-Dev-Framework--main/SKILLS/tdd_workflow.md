# Skill: Test-Driven Development

> **Purpose:** Ensure tests exist alongside implementation, not as an afterthought

## Core Principle
**Tests must exist before finalizing implementation.**

Write tests early. Validate behavior before marking code as complete.

## Red-Green-Refactor Cycle

### RED — Write the Test First
- Write a test that describes the expected behavior
- Run it — confirm it fails for the right reason
- If it passes immediately, the test is too weak

### GREEN — Write Minimal Code
- Write the simplest code that makes the test pass
- Do not optimize, do not refactor — just pass the test
- Run all tests — everything must be green

### REFACTOR — Clean Up
- Improve code structure without changing behavior
- Run tests again — must stay green
- Remove duplication, improve naming

### Repeat
Move to next behavior. One test at a time.

## Test Quality Rules
- Each test tests **ONE** behavior
- Tests must be deterministic and isolated
- Tests must not depend on execution order
- Mock external dependencies
- Use descriptive test names: `test_login_rejects_invalid_password`

## What to Test

| Type | Coverage |
|------|----------|
| Happy path | Required |
| Edge cases | Required (empty, null, boundary) |
| Error paths | Required (invalid input, exceptions) |
| Integration | Required for routes/endpoints |

## Anti-Patterns (Avoid)
- Writing tests after all code is done
- Tests that test implementation details, not behavior
- Tests that depend on other tests
- Skipping tests for "simple" code
- Tests with no assertions

## When Stuck
1. Can't write the test? → The requirement is unclear. Go back to brainstorming.
2. Test is too complex? → The function does too much. Split it.
3. Too many mocks? → The design has too many dependencies. Refactor.
