---
applyTo: "PROJECTS/**/7-BUG-REPORT.md"
---

# How To Write Bug Reports

## Purpose

Bug reports document defects found during testing: root cause, impact, reproduction steps, and fix applied. They are append-only and provide traceability for Stage 6 testing.

## File

**File:** `7-BUG-REPORT.md`  
**Owner:** Tester (Stage 6)  
**Updated:** Append-only; one section per bug. Never overwrite prior bugs.

### Record Schema

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

### Field Guidance

**BUG ID:** Format: `BUG-<PROJECTABBR>-<NNN>`
- `PROJECTABBR`: 2–3 letter abbreviation of project name
- `NNN`: Sequential number per project (001, 002, etc.; never reused)

Examples: `BUG-XL-001`, `BUG-BG-007`, `BUG-NP-002`

**Short Title:** One-line description of the bug (e.g., "Ctrl+Z Undo Not Implemented", "Tab Key Double-Processes")

**Severity:**
- **CRITICAL:** Pipeline cannot complete; blocks release
- **HIGH:** Major feature fails; must fix before release
- **MEDIUM:** Feature degraded but workaround exists
- **LOW:** Minor issue; nice to fix but not blocking

**Discovered:** Which T-PIPELINE-XXX run and iteration found this bug (e.g., `T-PIPELINE-XL-001 Run 3`)

**UC/BR:** Which use case and business requirement triggered the bug (e.g., `UC-008, BR-029`)

**Description:** What the test observed:
- Expected behavior vs. actual behavior
- Test steps that triggered the bug
- Example: "Pressing Tab in edit mode moved active cell two columns right instead of one. Expected: move to B1. Observed: move to D1."

**Root Cause:** Technical analysis of why it failed:
- Code location (file, function, line range)
- Mechanism of failure
- Why the code produced wrong output
- Example: "`commitEdit()` set `editMode=false`, then global `document` keydown handler also processed Tab because `e.stopPropagation()` was missing from `editInput` keydown handler."

**Fix Applied:** What was changed:
- File(s) modified
- What changed
- How it fixes the bug
- Example: "Added `e.stopPropagation()` to Enter/Escape/Tab branches in `editInput` keydown handler in `app.js` to prevent bubbling to global document listener."

**Status:** Bug resolution:
- ✅ Fixed — bug was repaired and confirmed by pipeline re-run
- ❌ Open — bug remains; release must document caveat or fix pending

### Processing Guidance

1. **Create a new section for every FAIL result** in pipeline testing.
2. **Never overwrite or delete prior bugs** — this file is append-only.
3. **Root Cause must be technical and specific**, not generic ("code was wrong", "developer mistake").
4. **Fix Applied must be traceable** to implementation. Reference the exact file and code change.
5. **Status reflects final resolution:**
   - ✅ Fixed = bug was corrected and verified by re-run
   - ❌ Open = bug persists; document reason (external dependency, design decision, deferred work)
6. **Link back to `6-TEST-REPORT.md`** via T-PIPELINE-XXX reference so traceability chain is clear.

### Entry Order

Newest bugs appended at the top of the file (same pattern as `5-RELEASE-NOTES.md`). This makes recent bugs easy to find.

### Exit Gate (Stage 6)

- Every FAIL in `6-TEST-REPORT.md` has a corresponding bug report.
- Every bug report has:
  - Correct BUG ID (format, no reuse)
  - Severity assigned
  - Root cause analysis (technical, specific)
  - Fix applied (if fixed) or reason for open status
- All fixable bugs marked ✅ Fixed.
- 0 open bugs (unless explicitly deferred and documented in caveat).
