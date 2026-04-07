---
applyTo: "PROJECTS/**/5-RELEASE-NOTES.md"
---

# How To Write Implementation Release Notes

## Purpose

Release notes document what was implemented, which instructions were applied, and which UCs/BRs were enabled. They provide historical traceability and serve as input for Tester in Stage 6.

## File

**File:** `5-RELEASE-NOTES.md`  
**Owner:** Developer (Stage 5)  
**Updated:** Every time code changes or bug fixes are applied

### Record Schema

```markdown
## XYZ-REL-YYYY-MM-DD-NNN

**Release ID:** <Project abbr>-REL-YYYY-MM-DD-NNN
**Date:** YYYY-MM-DD
**Stage:** 5 — Implementation (or "5 + 6 Bug Fix" if fixes from Tester)

### Summary

Implementation of DI-XXX, DI-YYY, DI-ZZZ enabling UC-ABC, UC-DEF and BR-001, BR-002, BR-003. Applied AR-001, AR-002 architecture decisions.

### Changed Files

- `./build/file1.js` → implemented DI-001, DI-002
- `./build/file2.js` → implemented DI-003
- `./build/index.html` → updated UI per DI-004

### Design Decisions Applied

- AR-001: Formula parser library
- AR-002: Event-driven state management

### Use Cases Implemented / Updated

- UC-001: ✅ PASS
- UC-002: ✅ PASS
- UC-003: ✅ PASS (with IMPLEMENTATION COMMENT)

### Browser Requirements Covered

- BR-001: ✅ Implemented
- BR-002: ✅ Implemented
- BR-003: ⚠️ PARTIAL — requires native OS feature

### Implementation Caveats

(If any runtime limitations discovered, document them here. Mirror UC-level IMPLEMENTATION COMMENT fields.)

### Notes

(Optional context, rationale, or next steps.)

---
```

### Field Guidance

**Release ID:** Format: `<PROJECTABBR>-REL-YYYY-MM-DD-NNN`
- `PROJECTABBR`: 2–3 letter abbreviation (e.g., XL, NP, BG)
- `YYYY-MM-DD`: Date of release
- `NNN`: Sequential number (001, 002, etc.)

Example: `XL-REL-2026-04-07-001`

**Summary:** High-level overview of what was implemented. Should include:
- Which DI instructions were implemented
- Which UCs/BRs are now enabled
- Which AR (architecture) decisions were applied

**Changed Files:** List all modified/created files under `./build` with their DI ID mappings.

**Design Decisions Applied:** Reference the AR-XXX records that this implementation follows.

**Use Cases Implemented / Updated:** List UC-XXX with pass/partial status. Mark IMPLEMENTATION COMMENT cases as `⚠️ PARTIAL`.

**Browser Requirements Covered:** List BR-XXX with implementation status. Mark external-dependency cases as `⚠️ PARTIAL`.

**Implementation Caveats:** If Developer discovers runtime limitations (e.g., "requires real Chrome extension install", "native OS API unavailable"), document them here. Mirror UC-level IMPLEMENTATION COMMENT fields.

### Processing Guidance

1. **Create a new release entry at the top** of the file for every implementation run.
2. **Preserve historical information** — never overwrite or delete prior releases.
3. **Append, never prepend** releases; newest at the top for easy scanning.
4. **Include implemented scope summary and rationale.**
5. **For bug fixes from Stage 6 testing:**
   - Add a new release entry with a microversion increment (e.g., `XL-REL-2026-04-07-001` → `XL-REL-2026-04-07-002`)
   - List all bugs fixed: `BUG-XL-001 (fixed)`, `BUG-XL-002 (fixed)`
   - Reference the T-PIPELINE-XXX run that found the bugs
6. **Mirror IMPLEMENTATION COMMENT fields** from UC-XXX into this document so Tester knows to expect PARTIAL results.

### Versioning Rule

Microversion increment:
- Stage 5 feature implementation: `v1.0.0` → `v1.0.1` (patch for new features, seems weird but this is how projects increment)
- Stage 6 bug fix release: `v1.0.1` → `v1.0.2`
- Increment the last number.

### Exit Gate (Stage 5)

- Release notes created/updated with new entry.
- All changed files traced to at least one DI ID.
- Historical releases preserved (no deletions or overwrites).
- Any runtime caveats documented.
