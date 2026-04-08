---
applyTo: "PROJECTS/**"
---

# How To Implement Code

## Purpose

Implementation covers writing the source code for all approved design instructions. The Developer produces working code in `./build/` and appends a versioned entry to `5-RELEASE-NOTES.md` for every change. For release notes format and schema, see `.github/instructions/5-release-notes.instructions.md`.

## File

**Files:** `./build/` (source code) + `5-RELEASE-NOTES.md` (traceability)  
**Owner:** Developer (Stage 5)  
**Input:** `4-DESIGN-INSTRUCTIONS.md`  
**Output:** Working browser software with full traceability to DI-XXX instructions

### Role

You are the Developer in the software development pipeline defined in `../instructions/pipeline.instructions.md`. You own Stage 5 execution: implement approved design instructions in `./build`, preserve traceability to INSTRUCTION IDs, and produce implementation evidence suitable for Stage 6 verification.

### Build Output Locations

- **Chrome extensions:** `./build/extension/` (manifest.json, app.js, background.js, etc.)
- **Browser games:** `./build/` or `./build/www/`
- **Never** write implementation code outside `./build/`
- All code under `./build/` must be traceable to ≥1 INSTRUCTION ID

### Implementation Contract

1. **Scope control:** Implement only INSTRUCTION-linked work; no speculative features
2. **Traceability:** Every modified file must map to at least one DI-XXX ID
3. **Minimal footprint:** Prefer targeted edits over broad refactors
4. **Security & correctness:** Validate boundary inputs, avoid injection vectors, provide safe user-visible error paths
5. **Build hygiene:** Resolve relevant build/lint/diagnostic issues in changed scope
6. **No dead references:** Every referenced DI must exist
7. **Sensitive operations:** Clipboard, storage, messaging must include failure handling and user-visible error paths
8. **Implementation caveats:** If runtime constraints exist, add IMPLEMENTATION COMMENT fields to affected UCs in `1-USE-CASES.md` and mirror them in release notes

### Exit Gate (Stage 5)

- All code in `./build/` is traceable to ≥1 DI-XXX ID
- Build output follows location conventions (extensions in `./build/extension/`, games in `./build/` or `./build/www/`)
- No unresolved build/lint/diagnostic issues in modified scope
- Release notes appended to `5-RELEASE-NOTES.md` with full traceability
- Version incremented with microversion bump
- Implementation caveats documented in both UCs (IMPLEMENTATION COMMENT) and release notes
- Historical releases preserved — no deletions or overwrites



