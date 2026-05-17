# Coding Rules

> **System:** Context  
> **Priority:** HIGH — Enforced on every code change

## Architecture Boundaries

### Routes
- Handle HTTP request/response ONLY
- Validate input parameters
- Call service functions
- Return formatted responses
- **NEVER** contain business logic
- **NEVER** execute database queries

### Services
- Contain ALL business logic
- Orchestrate data flow between models
- Handle data transformation
- Raise domain-specific exceptions
- **NEVER** import HTTP request/response objects
- **NEVER** render templates directly

### Models
- Define database schema
- Execute database queries
- Handle data persistence
- **NEVER** contain business logic
- **NEVER** import routes or services

### Templates
- Render UI with provided data
- Handle display logic only (show/hide, formatting)
- **NEVER** execute backend functions
- **NEVER** make database calls
- **NEVER** import Python/JS modules

## Code Quality Rules
- All secrets via environment variables — never hardcoded
- All user inputs validated and sanitized before processing
- Errors caught and logged at service boundary
- Functions do ONE thing — no god functions
- No dead code or commented-out blocks
- Consistent naming conventions (see `CONTEXT/naming_conventions.md`)
- Tests required for new features and bug fixes

## Import Rules
- Only import what you use
- No circular imports
- No wildcard imports (`from x import *`)
- Group imports: stdlib → third-party → local
