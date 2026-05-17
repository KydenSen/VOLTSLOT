# Service Dependency Map

> **System:** Repo Intelligence  
> **Purpose:** Track which services depend on each other and on external systems

## Internal Dependencies

| Service | Depends On | Type |
|---------|-----------|------|
| *e.g. auth_service* | *db_service, email_service* | *Internal* |
| *e.g. student_service* | *db_service, auth_service* | *Internal* |
| | | |

## External Dependencies

| Service | External System | Purpose |
|---------|----------------|---------|
| *e.g. email_service* | *SMTP server* | *Send notification emails* |
| | | |

## Dependency Rules
- Services may depend on other services and models
- Routes may only depend on services
- Models must not depend on services or routes
- No circular dependencies allowed

## Dependency Diagram
```
routes/auth.py → services/auth_service.py → models/user.py
routes/student.py → services/student_service.py → models/student.py
                  → services/db_service.py → [Database]
```

---

**Update this file when adding new service dependencies.**
