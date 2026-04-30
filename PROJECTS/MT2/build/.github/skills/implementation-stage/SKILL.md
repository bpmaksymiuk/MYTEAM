# Implementation Stage — SKILL.md

> Stage 9 — implement all design instructions into ./build/ from 6-DESIGN-INSTRUCTIONS.md.

---

## When to Use

At Stage 9, after all documentation stages (0–8) have passed their exit gates. Reads `6-DESIGN-INSTRUCTIONS.md` in full and implements every DI in order. Does not design, refactor, or extend beyond what is specified.

---

## Target Files

- `./build/**` (all files specified in DIs)
- `9-RELEASE-NOTES.md` (updated after implementation)

---

## Record Schema

See `release-notes-writing/SKILL.md` for the RN record schema.

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md` in full.
2. Read `6-DESIGN-INSTRUCTIONS.md` in full before writing any file. Build a mental model of all required outputs before starting.
3. Implement DIs in order (DI-001, DI-002, …). Respect dependency ordering — scaffolding DIs before file-writing DIs.
4. For each DI:
   a. Re-read the DI immediately before implementing it.
   b. Write or edit only the files specified in that DI.
   c. Use exact file paths as stated — do not invent paths.
   d. After writing, run `get_errors` to check for unresolved issues.
   e. Do not proceed to the next DI until the current one is error-free.
5. **Do not add:**
   - Features not specified in a DI
   - Refactors of existing code
   - Comments, docstrings, or type annotations on code not changed
   - Error handling for scenarios not mentioned in the DI
   - Helper utilities created "just in case"
6. After all DIs are implemented, load `release-notes-writing/SKILL.md` and write an RN entry.
7. Run the exit gate checklist.

---

## Exit Gate

- [ ] Every file specified in every DI exists at the correct path.
- [ ] No unresolved compile or lint errors in any `./build/` file.
- [ ] No files in `./build/` that are not traceable to a DI.
- [ ] `9-RELEASE-NOTES.md` has been updated with a new RN entry for this run.
- [ ] Every DI has been implemented — none skipped, none partially implemented.
