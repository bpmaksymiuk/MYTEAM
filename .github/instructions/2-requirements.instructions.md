---
applyTo: "PROJECTS/**/2-REQUIREMENTS.md"
---

# How To Write Business Requirements

## Purpose

Business requirements translate use cases into atomic, verifiable statements that can be tested and traced to architecture and design.

## File

**File:** `2-REQUIREMENTS.md`  
**Owner:** Business Analyst (Stage 2)  
**Triggered by:** Update to `1-USE-CASES.md`

### Record Schema

```markdown
## BR-XXX : REQUIREMENT STATEMENT
- TESTABLE CONDITION
- NOTES
- RELATED
---
```

### Field Guidance

**REQUIREMENT STATEMENT:** A single, atomic business capability. Should start with a strong verb:
- "Enable user to..."
- "System shall display..."
- "Grid must support..."
- "User can..."

Examples:
- ✅ BR-001: User can select a cell and see it highlighted
- ❌ BR-001: User can select a cell, edit it, and see the change (too broad — this is 3 requirements)

**TESTABLE CONDITION:** A concrete, observable outcome that can be verified during Stage 6. Must be specific enough for Tester to write an automated check.

Examples:
- ✅ Cell with `active` CSS class is outlined in blue when selected
- ❌ Cell looks selected (vague)

**NOTES:** Optional context, rationale, or constraints.

**RELATED:** Parent UC-XXX from `1-USE-CASES.md`. If a requirement is implied but not traceable to any UC, write `RELATED: (implied)`.

### Processing Guidance

1. **Generate at least one requirement per use-case step.** If a UC step is complex, generate up to 20 BRs.
2. **Each requirement must be atomic.** Avoid "and" in REQUIREMENT STATEMENT; split into separate BRs.
3. **Testable conditions are mandatory.** Tester will use these to write test assertions.
4. Do not duplicate requirements; use RELATED cross-references for shared behavior.
5. May add implied requirements not directly traceable to UCs (e.g., security, performance, accessibility). Mark as `RELATED: (implied)`.
6. **Regenerate this file only when `1-USE-CASES.md` is updated for the pipeline run.** Incremental changes to 2-REQUIREMENTS.md without UC changes are allowed but require explicit notification.
7. Preserve existing BR IDs during incremental updates.

### NASA Requirement Writing Standard

When writing REQUIREMENT STATEMENT and TESTABLE CONDITION, follow https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/:

- Clear, concise, unambiguous language
- Use "shall" for mandatory requirements
- Avoid implementation details
- Quantify whenever possible ("at least 3 items", "within 100ms")
- Single requirement per line

Examples matching NASA standard:
- ✅ BR-012: System shall sort cells in ascending or descending order when user clicks column header
- ✅ BR-013: Grid shall display at least 50 rows and 26 columns
- ❌ BR-012: The grid should be sortable (vague; "should" is not mandatory; "sortable" is implementation)

### Exit Gate (Stage 2)

- Every UC maps to at least 1 BR.
- Every BR statement is atomic and independent.
- Every BR has a testable condition.
- BR IDs are sequential and never reused.
- All RELATED fields reference valid UC-XXX IDs.
