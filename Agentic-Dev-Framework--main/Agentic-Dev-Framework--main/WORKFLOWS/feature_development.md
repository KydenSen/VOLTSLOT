# Feature Development Workflow

## Steps
1. **Architect** — analyzes repo, designs feature, outputs implementation plan
2. **Builder** — implements plan with minimal patch edits
3. **Reviewer** — audits for correctness, style, and architecture compliance
4. **Security** — performs vulnerability check on new code

## Gate Rules
- Never proceed to Builder without Architect sign-off
- Never merge without Reviewer approval
- Security check required for any auth, upload, or data-handling feature
