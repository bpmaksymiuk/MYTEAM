---
applyTo: "PROJECTS/**/4-DESIGN-INSTRUCTIONS.md"
---

# How To Write Design Instructions

## Purpose

Design instructions translate architecture and requirements into implementation-ready steps that Developers can follow without guesswork.

## File

**File:** `4-DESIGN-INSTRUCTIONS.md`  
**Owner:** Technical Lead (Stage 4)  
**Triggered by:** Update to `3-ARCHITECTURE-RECOMMENDATIONS.md` or `3-PARTS LIST.md`

### Record Schema

```markdown
## DI-XXX : INSTRUCTION
- SUMMARY
- IMPLEMENTATION STEPS
- SKILLSET REQUIRED
- NOTES
- RELATED
---
```

### Field Guidance

**INSTRUCTION:** Short title describing what to implement.
- ✅ DI-001: Build formula parser with SUM, AVERAGE, MIN, MAX, COUNT
- ✅ DI-002: Implement grid state manager with async recalculation
- ❌ DI-001: Implement parser (too vague)

**SUMMARY:** Clear business context and intended approach. Should cover:
- What problem this DI solves (which BR/UC it enables)
- High-level approach (e.g., "recursive-descent parsing", "event-driven state management")
- Key design decisions (e.g., immutability, async patterns, error handling)

**IMPLEMENTATION STEPS:** Detailed, step-by-step instructions. Must be specific enough for Developer to implement without guesswork:
- Proposed file names and folder structure (relative to `./build/`)
- Function/class signatures (pseudocode OK)
- Algorithm or workflow description
- Edge cases and error handling
- Validation checks
- Pitfalls to avoid

Example:
```
1. Create `./build/engine/FormulaParser.js` 
2. Implement tokenizer: regex patterns for operators, cell refs, literals; see pseudo-code below
3. Implement recursive-descent parser with rules:
   - expression → term ('+'/'-' term)*
   - term → factor ('*'/'/' factor)*
   - factor → ... (see BNF)
4. Handle circular references: detect during recalculate, throw "Circular ref" error
5. Cache parsed formulas to avoid re-parsing
```

**SKILLSET REQUIRED:** Explicit list of skills needed to implement this instruction:
- ✅ JavaScript ES6+, Recursive descent parsing, Event-driven architecture
- ❌ Programming (too vague)

**NOTES:** Optional implementation context, links to architecture decisions, or caveats.

**RELATED:** Parent UC-XXX, BR-XXX, and AR-XXX that this DI enables. Format:
```
RELATED: UC-003, UC-004 | BR-011, BR-012 | AR-001, AR-002
```

### Processing Guidance

1. **Read `2-REQUIREMENTS.md`, `3-ARCHITECTURE-RECOMMENDATIONS.md`, and `3-PARTS LIST.md` in full** before generating.
2. One DI per distinct implementation task.
3. **IMPLEMENTATION STEPS must be detailed enough for Developer to proceed without asking clarifying questions.** Include file names, function signatures, pseudocode, and traps.
4. **Do not invent instructions** for requirements or architecture entries that don't exist.
5. Include setup, scaffolding, and dependency instructions as separate DI records if needed (e.g., DI-001: "Set up build environment", DI-002: "Configure linter", DI-003: "Implement core feature").
6. Preserve existing DI IDs during incremental updates.

### Exit Gate (Stage 4)

- Every BR/AR pair has at least 1 DI.
- Every DI SUMMARY clearly describes the problem and approach.
- Every DI IMPLEMENTATION STEPS is actionable and detailed (file names, signatures, pseudocode, traps).
- Every DI SKILLSET REQUIRED is explicit and relevant.
- DI IDs are sequential and never reused.
- All RELATED fields reference valid UC-XXX, BR-XXX, and AR-XXX IDs.

---

### Document Processing

## ⚠️ MANDATORY SCHEMA LOOKUP — DO THIS FIRST

Before writing a single line of `4-DESIGN-INSTRUCTIONS.md`, you MUST:

1. Read `.github/instructions/4-design-instructions.instructions.md` in full.
2. Find the **Record Schema** section. It specifies the exact format every DI entry must follow.
3. Produce output that matches that schema exactly — no extra headers, no ADR tables, no risk matrices, no roadmap sections. Only the schema defined in the instruction file.
4. If you are unsure whether your output matches the schema, re-read the instruction file before writing.

The canonical schema (as of writing) is:
```
## DI-XXX : INSTRUCTION
- SUMMARY
- IMPLEMENTATION STEPS
- SKILLSET REQUIRED
- NOTES
- RELATED
---
```
If the instruction file shows a different schema, that file wins. Do not invent sections.
