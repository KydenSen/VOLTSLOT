# Database Relationships

> **System:** Repo Intelligence  
> **Purpose:** Entity-relationship mapping with foreign keys and constraints

## Entity Relationship Map

```
[students] 1──────M [complaints]
     │                    
     │ 1                  
     └──────M [marks]     
     │                    
     │ 1                  
     └──────M [attendance]
```

## Table Relationships

| Parent Table | Child Table | Relationship | Foreign Key |
|-------------|-------------|:------------:|-------------|
| *students* | *complaints* | *1:M* | *student_id* |
| *students* | *marks* | *1:M* | *student_id* |
| *students* | *attendance* | *1:M* | *student_id* |
| | | | |

## Indexes

| Table | Column | Type |
|-------|--------|------|
| *students* | *email* | *UNIQUE* |
| *students* | *id* | *PRIMARY KEY* |
| | | |

## Constraints
- All foreign keys must reference existing records
- Cascade delete rules: [define per relationship]
- No orphan records allowed

---

**Update this file when adding tables, columns, or relationships.**
