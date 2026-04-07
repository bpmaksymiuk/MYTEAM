---
applyTo: "PROJECTS/**/1-USE-CASES*.md"
---

# How To Write Use Cases

## Purpose

Use cases define the business intent and user workflows that drive the pipeline. Stage 1 (`1-USE-CASES.md`) is user-authored and triggers the entire pipeline.

## Stage 0: Proposed Use Cases (Advisory)

**File:** `1-USE-CASES-PROPOSED.md`  
**Owner:** User  
**Approval:** Business Analyst validates schema and quality

### Record Schema

```markdown
## UC-XXX : ACTOR - USE CASE NAME
- STEPS
- ACCEPTANCE CRITERIA
- NOTES
- RELATED
---
```

### Notes

1. This file is user-authored and advisory.
2. Does not replace `1-USE-CASES.md` as the source of pipeline intent.
3. Updating this file does **not** trigger the pipeline.

### Business Analyst Responsibility (Stage 0 Validation)

Whenever `1-USE-CASES-PROPOSED.md` is updated:
1. Validate that each record follows the use-case schema.
2. Verify high-quality, testable acceptance criteria.
3. If quality or format fails, report specific corrections and update only `1-USE-CASES-PROPOSED.md`.
4. **Do not** regenerate `2-REQUIREMENTS.md` unless `1-USE-CASES.md` is also explicitly updated for the pipeline run.

---

## Stage 1: Approved Use Cases

**File:** `1-USE-CASES.md`  
**Owner:** User (Product Owner)  
**Triggers:** Full pipeline (Stages 2–6)

### Record Schema

```markdown
## UC-XXX : ACTOR - USE CASE NAME
- STEPS
- ACCEPTANCE CRITERIA
- NOTES
- RELATED
---
```

### Field Guidance

**ACTOR:** Role or persona performing the use case (e.g., "End User", "Admin", "System")

**STEPS:** Numbered list of sequential user actions or system interactions. Each step should be observable and testable.

**ACCEPTANCE CRITERIA:** Numbered conditions that must be satisfied for the use case to be considered complete. Acceptance criteria should be:
- Testable (measurable, not vague)
- Independent (not dependent on other UCs)
- User-visible (the user can observe the result)

**NOTES:** Optional context, assumptions, constraints, or caveats. If implementation limitations are discovered during Stage 5, add an **IMPLEMENTATION COMMENT** field here.

**RELATED:** Parent UC-XXX or cross-references to related use cases.

### Processing Guidance

1. Each use case represents a complete, end-to-end user workflow.
2. Use cases should be independent; minimize cross-dependencies.
3. Each use case should be testable by Stage 6.
4. Use clear, active language: "User clicks", "System displays", not "clicking" or "displayed".

### Exit Gate (Stage 1)

- Every use case has complete fields (STEPS, ACCEPTANCE CRITERIA, ACTOR).
- Every acceptance criterion is measurable and testable.
- All use cases are numbered sequentially (UC-001, UC-002, etc.).
- IDs are never reused.

### Implementation Caveat Handling

If during Stage 5 (Developer) or Stage 6 (Tester) a use case cannot be fully implemented due to external constraints (e.g., native OS features, real extension context), add:

```markdown
## UC-XXX : ACTOR - USE CASE NAME
- STEPS
- ACCEPTANCE CRITERIA
- NOTES
- **IMPLEMENTATION COMMENT:** Brief explanation of the caveat and why it exists.
- RELATED
---
```

Mirror this caveat in `5-RELEASE-NOTES.md` so Tester knows to expect a PARTIAL result.
