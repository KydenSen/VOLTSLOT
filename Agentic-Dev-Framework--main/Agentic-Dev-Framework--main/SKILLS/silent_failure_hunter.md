# Skill: Silent Failure Hunter

> **Source:** Adapted from Anthropic Claude Code `pr-review-toolkit`
> **Purpose:** Detect and eliminate insidious error handling patterns that hide bugs rather than exposing them.

---

## What to Hunt For

When reviewing or writing code, actively scan for the following silent failure anti-patterns:

### 1. The Black Hole Catch
```javascript
// BAD
try { doSomething(); } catch (e) { /* nothing or just console.error */ }
```
**Fix:** Errors must be handled properly. Either recover, propagate up, or log comprehensively to an observability platform and exit gracefully.

### 2. The Fallback Masking
```javascript
// BAD
const data = fs.readFileSync('config.json') || {}; 
// If it fails due to permissions, you get an empty object instead of knowing it failed.
```
**Fix:** Validate existence properly before falling back. Differentiate between "not found" and "failed to read".

### 3. Ignoring Promise Rejections
```javascript
// BAD
fetch('/api/data'); // Fire and forget without .catch()
```
**Fix:** Always await or append `.catch()`.

### 4. Overly Broad Error Types
```python
# BAD
except Exception: 
```
**Fix:** Catch specific error types (e.g., `FileNotFoundError`, `HTTPError`). Never catch the base `Exception` unless it's at the absolute top boundary of the application for final logging.

### 5. Silent State Mutation Failures
```javascript
// BAD
db.update({ name: 'test' }).where({ id: 999 }); 
// What if id 999 doesn't exist? The update quietly affects 0 rows.
```
**Fix:** Always check return counts/affected rows and throw an error or handle the case when the expected mutation didn't occur.

---

## Application
Run this skill automatically during Phase 6/7 (Code Review) or whenever editing critical systems. If you spot a silent failure, flag it with the `[SILENT FAILURE RISK]` tag.
