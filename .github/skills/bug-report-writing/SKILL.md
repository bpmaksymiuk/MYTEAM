---
name: bug-report-writing
description: 'Write 7-BUG-REPORT.md entries for Stage 6 failures. Use for BUG IDs, severity, technical root cause analysis, fix-applied summaries, append-only defect tracking, and traceability back to T-PIPELINE runs and UC or BR failures.'
argument-hint: 'Describe the defect or verification failure to document.'
---

# Bug Report Writing

## When to Use
- Creating or updating PROJECTS/**/7-BUG-REPORT.md
- Recording a Stage 6 FAIL result
- Documenting root cause and fix status after a rerun

## Target File
- 7-BUG-REPORT.md
- Updated append-only, newest bugs at the top

## Record Schema

```markdown
## BUG-<PROJECTABBR>-<NNN> — <Short Title>

- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Discovered:** T-PIPELINE-XXX Run N
- **UC/BR:** UC-XXX, BR-XXX
- **Description:** <what failed and what the test observed>
- **Root Cause:** <why it failed; technical analysis>
- **Fix Applied:** <what was changed and where>
- **Status:** ✅ Fixed / ❌ Open

---
```

## Procedure
1. Read the canonical pipeline file first.
2. Create one bug section for every FAIL in the test report.
3. Use a new sequential BUG ID; never reuse IDs.
4. Write a technical root cause, including the failing mechanism and changed file when known.
5. Update status only after re-verification confirms the fix.
6. Prepend new bug entries at the top of the file.

## Quality Rules
- Root Cause must be technical and specific.
- Fix Applied must describe the real code change or justify why the bug remains open.
- Every bug must link clearly to the T-PIPELINE run and UC/BR context.

## Exit Gate
- Every FAIL in 6-TEST-REPORT.md has a corresponding bug entry.
- All fixable bugs are marked fixed after rerun.
- No bug IDs are reused.
