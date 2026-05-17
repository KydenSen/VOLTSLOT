# API Documentation Template

## Endpoint: [METHOD] [Path]

### Description
[What this endpoint does]

### Authentication
- Required: [Yes/No]
- Role: [Any/Admin/Student]

### Request

**Headers:**
| Header | Required | Description |
|--------|:--------:|-------------|
| Authorization | Yes | Bearer token |

**Parameters:**
| Name | Type | Required | Description |
|------|------|:--------:|-------------|
| id | int | Yes | Resource ID |

**Body (JSON):**
```json
{
  "field1": "string",
  "field2": 0
}
```

### Response

**Success (200):**
```json
{
  "status": "success",
  "data": {}
}
```

**Error (400):**
```json
{
  "status": "error",
  "message": "Description of error"
}
```

**Error (401):**
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

### Example
```
curl -X POST /api/endpoint \
  -H "Authorization: Bearer <token>" \
  -d '{"field1": "value"}'
```
