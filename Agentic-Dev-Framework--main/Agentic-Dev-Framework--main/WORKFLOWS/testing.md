# Testing Workflow

## Purpose
Validate implemented features through structured test phases.

## Steps

### Phase 1: Unit Tests
1. Identify all new or modified functions
2. Generate unit tests for each function
3. Cover: happy path, edge cases, error cases
4. Mock external dependencies
5. Run tests and confirm all pass

### Phase 2: Integration Tests
1. Identify affected routes and service interactions
2. Generate integration tests for each endpoint
3. Test request → response flow end-to-end
4. Test with valid and invalid inputs
5. Verify correct HTTP status codes

### Phase 3: Validation
1. Verify database operations work correctly
2. Verify UI renders without errors (if applicable)
3. Check for console errors or warnings
4. Verify no regressions in existing functionality

## Test Quality Rules
- Tests must be deterministic and isolated
- Tests must not depend on execution order
- Tests must clean up after themselves
- No hardcoded test data that couples to implementation
- Each test tests ONE thing

## Exit Criteria
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No regressions detected
- [ ] Edge cases covered
- [ ] Error paths tested
