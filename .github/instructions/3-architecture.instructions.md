---
applyTo: "PROJECTS/**/3-ARCHITECTURE*.md"
---

# How To Write Architecture Recommendations And Parts List

## Purpose

Architecture makes technology decisions and identifies components that enable business requirements. Both artifacts are generated in the same Stage 3 run.

## File 1: Architecture Recommendations

**File:** `3-ARCHITECTURE-RECOMMENDATIONS.md`  
**Owner:** Architect (Stage 3)  
**Triggered by:** Update to `2-REQUIREMENTS.md`

### Record Schema

```markdown
## AR-XXX : RECOMMENDATION
- RATIONALE
- NOTES
- RELATED
---
```

### Field Guidance

**RECOMMENDATION:** A concrete technology decision or pattern. Must name a library, API, framework, or design pattern:
- ✅ AR-001: Use recursive-descent parser for formula evaluation
- ✅ AR-002: Use Playwright 1.59.1 for browser testing
- ✅ AR-003: Use CSS Grid for responsive layout
- ❌ AR-001: Use good parsing (too vague)

**RATIONALE:** Why this recommendation is the right choice. Should address:
- Fit to Business Requirement
- Tradeoffs (vs. alternative approaches)
- Justification (performance, maintainability, team expertise, timeline)

**NOTES:** Optional implementation context, dependencies, or caveats. For example, if a library is recommended, note the specific modules or functions to use. Please do not code. Proactively make recommendations for patterns that may be required but not explicitly traceable to requirements (e.g., logging, error handling, configuration management). Mark as `RELATED: (implied)`.

**RELATED:** List parent BR-XXX and UC-XXX that this recommendation enables. Format:
```
RELATED: BR-011, BR-012, BR-013 | UC-003
```

### Processing Guidance

1. **Read `2-REQUIREMENTS.md` in full** before generating.
2. Create one architecture record per distinct technology decision.
3. **Do not invent architecture decisions** for requirements that don't exist.
4. Preserve existing AR IDs during incremental updates.
5. Every RELATED field must list at least one parent BR-XXX and one parent UC-XXX.
6. If multiple decisions enable a single BR, create multiple AR records.

### Exit Gate (Stage 3 Part 1)

- Every BR has at least 1 AR.
- Every AR names a concrete technology or pattern.
- Every AR has explicit RATIONALE.
- AR IDs are sequential and never reused.
- All RELATED fields reference valid BR-XXX and UC-XXX IDs.

---

## File 2: Parts List

**File:** `3-PARTS LIST.md`  
**Owner:** Architect (Stage 3)  
**Triggered by:** Update to `3-ARCHITECTURE-RECOMMENDATIONS.md`  
**Generated with:** Same run as `3-ARCHITECTURE-RECOMMENDATIONS.md`

### Record Schema

```markdown
## PT-XXX : PART/COMPONENT NAME
- DESCRIPTION
- TECHNOLOGY RECOMMENDATIONS
- NOTES
- RELATED
---
```

### Field Guidance

**PART/COMPONENT NAME:** The name of the part or module:
- ✅ PT-001: Formula Parser
- ✅ PT-002: Grid State Manager
- ✅ PT-003: Test Pipeline Script
- ❌ PT-001: Parser (vague — which parser?)

**DESCRIPTION:** What this part does, its scope, and its responsibilities.

**TECHNOLOGY RECOMMENDATIONS:** Reference to parent AR-XXX records that apply to this part. Format:
```
TECHNOLOGY RECOMMENDATIONS: AR-001 (parser library), AR-002 (testing framework)
```

**NOTES:** Optional implementation context, file locations, or interdependencies with other parts.

**RELATED:** Parent UC-XXX, BR-XXX, and AR-XXX that this part enables. Format:
```
RELATED: UC-003, UC-004 | BR-011, BR-012, BR-013 | AR-001, AR-002
```

### Processing Guidance

1. **Generate in the same Stage 3 run** as `3-ARCHITECTURE-RECOMMENDATIONS.md`.
2. Parts represent logical or physical components: files, modules, services, libraries, scripts, utilities.
3. Each part should have clear boundaries and a single responsibility.
4. All RELATED fields must reference existing upstream UC-XXX, BR-XXX, and AR-XXX.
5. Preserve existing PT IDs during incremental updates.

### Exit Gate (Stage 3 Part 2)

- All major components/parts are identified and named.
- Each part has a clear description and responsibility.
- Technology recommendations are mapped to architecture decisions.
- PT IDs are sequential and never reused.
- All RELATED fields reference valid UC-XXX, BR-XXX, and AR-XXX IDs.

---
