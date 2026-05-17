# Skill: Brainstorming — Ideas Into Designs

> **Pipeline Position:** 1st (before Repository Mapper)  
> **Purpose:** Ensure full understanding before any design or code

## When to Use
- New feature requests
- Architecture changes
- Module redesigns
- Any task with unclear or ambiguous requirements

## The Process

### 1️⃣ Understand Current Context (Mandatory First Step)
Before asking any questions:
- Review current project state (files, docs, prior decisions)
- Read `PROJECT_MEMORY/` files
- Identify what already exists vs. what is proposed
- Note implicit constraints

**Do not design yet.**

### 2️⃣ Understand the Idea (One Question at a Time)
- Ask **one question per message** — not a wall of questions
- Prefer **multiple-choice questions** when possible
- Focus on: purpose, target users, constraints, success criteria, non-goals

### 3️⃣ Non-Functional Requirements
Clarify or propose reasonable defaults for:
- Performance expectations
- Scale (users, data, traffic)
- Security or privacy constraints
- Maintenance expectations

Mark any assumptions explicitly as **[ASSUMPTION]**.

### 4️⃣ Understanding Lock (Hard Gate)
Before proposing ANY design, produce:

**Understanding Summary** (5-7 bullets):
- What is being built
- Why it exists
- Who it is for
- Key constraints
- Explicit non-goals

Then ask:
> "Does this accurately reflect your intent? Confirm or correct before we move to design."

**Do NOT proceed until confirmation.**

### 5️⃣ Explore Design Approaches
- Propose **2-3 viable approaches**
- Lead with recommended option
- Explain trade-offs: complexity, extensibility, risk, maintenance
- Apply YAGNI — avoid premature optimization

### 6️⃣ Decision Log
Record every major decision in `PROJECT_MEMORY/decision_log.md`:
- What was decided
- Alternatives considered
- Why this option was chosen

## Exit → Hand off to Repository Mapper + Architect
