---
name: release-notes-writing
description: 'Write or update 9-RELEASE-NOTES.md for Stage 9 implementation and bug-fix reruns. Use for release IDs, microversion increments, changed-file traceability, implementation caveats, UC/BR coverage, and append-only history.'
argument-hint: 'Describe the implementation run or bug-fix run to document.'
---

# Release Notes Writing

## When to Use
- Creating or updating PROJECTS/**/9-RELEASE-NOTES.md
- Documenting a Stage 9 implementation run
- Documenting a Stage 10 bug-fix release

## Target File
- 9-RELEASE-NOTES.md
- Updated for every implementation or bug-fix run

## Record Schema

```markdown
## XYZ-REL-YYYY-MM-DD-NNN

**Release ID:** <Project abbr>-REL-YYYY-MM-DD-NNN
**Date:** YYYY-MM-DD
**Stage:** 9 — Implementation (or "9 + bug-fix rerun")

### Summary
### Changed Files
### Design Decisions Applied
### Use Cases Implemented / Updated
### Browser Requirements Covered
### Implementation Caveats
### Notes

---
```

## Procedure
1. Read the canonical pipeline file first.
2. Read the exact record schema before writing.
3. Prepend a new release entry at the top; never overwrite prior entries.
4. Include changed files and DI mappings.
5. Summarize the implemented DI, UC, BR, and AR scope.
6. Record caveats explicitly, especially for partial implementations or external runtime limits.
7. Use a microversion increment for every new entry.

## Quality Rules
- Preserve historical information.
- Match the schema exactly.
- Keep changed-file entries traceable to implementation work.

## Exit Gate
- New entry created at the top.
- History preserved.
- Caveats documented when relevant.
