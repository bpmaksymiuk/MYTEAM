# Bug Report Writing — SKILL.md

> Stage 10 — document every test failure as a traceable BUG record.

---

## When to Use

After test execution, for every FAIL result in `10-TEST-REPORT.md`. One BUG record per distinct failure. Multiple T-IDs may map to the same BUG if they share a root cause — but each BUG must list all related T-IDs.

---

## Target Files

- `11-BUG-REPORT.md`

---

## Record Schema

```
## BUG-XXX : TITLE

- **SEVERITY:** Critical | High | Medium | Low
- **STAGE:** The pipeline stage responsible for the fix (usually Stage 9 — Developer).
- **DESCRIPTION:** Observed behaviour. Be specific: what happened, where, under what conditions.
- **ROOT CAUSE:** The most likely technical cause. Identify the artifact, file, or function responsible.
- **FIX APPLIED:** What was done to resolve this bug. Write "Pending" if not yet fixed.
- **RELATED:** T-IDs that surfaced this bug; UC-IDs and BR-IDs it violates.
- **STATUS:** Open | Fixed | Verified
```

---

## Severity Guidelines

| Severity | Meaning |
|----------|---------|
| Critical | The product cannot be used; core UC fails completely. |
| High | A major UC or BR is broken; no workaround available. |
| Medium | A UC or BR is impaired but a workaround exists. |
| Low | Minor cosmetic or non-critical issue; does not block a UC. |

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `10-TEST-REPORT.md` and identify every FAIL entry.
3. For each FAIL (or group of FAILs with the same root cause), write one BUG record.
3. Assign BUG-IDs sequentially (BUG-001, BUG-002, …).
4. Set STATUS to `Open` for all new records.
5. Set FIX APPLIED to `Pending` until the Developer resolves it.
6. After a fix is applied and re-verified by the Tester, update STATUS to `Fixed` then `Verified`.
8. Append only — never delete BUG records, even after they are resolved.
9. Report to Manager: list all open BUGs with severity and owning stage for routing.
10. Validate against the exit gate.

---

## Exit Gate

- [ ] Every FAIL in `10-TEST-REPORT.md` maps to at least one BUG record.
- [ ] Every BUG record has a SEVERITY assigned.
- [ ] Every BUG record has a STATUS (Open / Fixed / Verified).
- [ ] Every BUG record's RELATED field references at least one T-ID and one UC-ID or BR-ID.
- [ ] BUG-IDs are sequential and non-reused.
- [ ] No BUG records have been deleted or overwritten.
