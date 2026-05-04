# Release Notes Writing — SKILL.md

> Stage 9 — append-only release notes entry after each implementation run.

---

## When to Use

Invoke at Stage 9 (Developer) when documenting the current implementation run, and again after any Stage 9 bug-fix re-run. Use it to write or append an RN record to `9-RELEASE-NOTES.md` following the append-only convention. Every implementation change and known limitation must be recorded before the Stage 9 exit gate is checked. Write one RN entry per run — never overwrite prior entries.

---

## Target Files

- `9-RELEASE-NOTES.md`

---

## Record Schema

```
## RN-XXX : vX.X.X — YYYY-MM-DD

- **CHANGED FILES:**
  - `./path/to/file.ext` — brief description of change
  - `./path/to/other.ext` — brief description of change
- **IMPLEMENTATION CAVEATS:** Known limitations, partial implementations, deferred work, or observed side effects. Write "None." if there are none.
- **UC/BR COVERAGE:** List of UC-IDs and BR-IDs addressed in this run.
- **NOTES:** Anything the Tester or next Developer needs to know before picking up from here.
```

---

## Versioning Rules

- Increment the **patch** version (X.X.**Y**) for every implementation run within a stage.
- Increment the **minor** version (X.**Y**.0) when a full pipeline run completes (all stages pass).
- The **major** version (X.0.0) is reserved for breaking schema changes or complete rewrites.
- Starting version: `v0.1.0` for the first complete pipeline run.
- Version must always be greater than the previous entry — never repeat or decrease.

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Open `9-RELEASE-NOTES.md`.
3. Identify the last RN entry to determine the current version; increment by one patch.
4. List every file written or modified during this implementation run.
5. For each file, write a brief one-line description of what changed.
6. Complete IMPLEMENTATION CAVEATS — be honest about any shortcuts or known issues.
7. List all UC-IDs and BR-IDs addressed.
8. Add any notes useful for downstream agents (Tester, Manager, Auditor).
9. Append the entry below all prior entries — never insert before or overwrite existing entries.
10. **Validate against the exit gate. Stage completion remains `GATE 9: PASS` or `GATE 9: FAIL`.**

---

## Exit Gate

- [ ] A new RN entry has been appended to `9-RELEASE-NOTES.md`.
- [ ] The version is higher than the previous entry.
- [ ] CHANGED FILES lists every file written or modified in this run.
- [ ] IMPLEMENTATION CAVEATS is present (may be "None.").
- [ ] UC/BR COVERAGE lists at least one UC-ID and one BR-ID.
- [ ] No prior RN entries have been modified or deleted.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 9 with STATUS and STATUS UPDATED date.
