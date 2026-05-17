# Development Rules

## Layer Responsibilities
- Routes handle HTTP request/response only — no business logic
- Services contain all business logic — no direct HTTP context
- Database access only through service layer
- Templates/views contain no backend logic

## Code Rules
- All secrets via environment variables
- All inputs validated before processing
- Errors caught and logged at service boundary
- Tests required for new features and bug fixes
