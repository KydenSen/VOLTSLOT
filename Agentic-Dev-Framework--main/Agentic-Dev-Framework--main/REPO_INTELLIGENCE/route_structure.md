# Route Structure

> **System:** Repo Intelligence  
> **Purpose:** Complete routing tree with methods, auth, and handlers

## Route Map

### Authentication Routes

| Method | Path | Handler | Auth Required |
|--------|------|---------|:-------------:|
| *POST* | */login* | *auth.login* | *No* |
| *POST* | */register* | *auth.register* | *No* |
| *GET* | */logout* | *auth.logout* | *Yes* |

### Student Routes

| Method | Path | Handler | Auth Required |
|--------|------|---------|:-------------:|
| *GET* | */student/dashboard* | *student.dashboard* | *Yes* |
| | | | |

### Admin Routes

| Method | Path | Handler | Auth Required |
|--------|------|---------|:-------------:|
| *GET* | */admin/dashboard* | *admin.dashboard* | *Yes (Admin)* |
| | | | |

### API Routes

| Method | Path | Handler | Auth Required |
|--------|------|---------|:-------------:|
| | | | |

## Blueprint Structure
```
app.py
├── auth_bp (prefix: /)
├── student_bp (prefix: /student)
├── admin_bp (prefix: /admin)
└── api_bp (prefix: /api)
```

---

**Update this file when adding or modifying routes.**
