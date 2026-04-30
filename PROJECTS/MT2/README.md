# MT2 Pipeline Template Repository

A reference software factory framework for artifact-driven multi-stage product development. This template demonstrates a six-stage pipeline with explicit ownership, traceability, and governance rules applicable to software, content, and research projects.

---

## Quick Start

1. **Copy the template**: Clone this repository or copy the `PROJECTS/MT2` directory as your reference.
2. **Define your goal**: Create `PROJECTS/<YOUR-PROJECT>/goal.md` describing your project scope and intended outcomes.
3. **Run the pipeline**: Execute stages in order (Use Cases → Requirements → Architecture → Design → Implementation → Testing), respecting ownership boundaries at each stage.
4. **Track artifacts**: All stage outputs are markdown files with structured records and explicit traceability links (RELATED fields).
5. **Verify coverage**: Use `./.github/scripts/validate.py` to check artifact completeness and traceability before Stage 10 testing.

---

## Pipeline Overview

The MT2 pipeline consists of **10 stages** executed sequentially, plus a **Manager feedback loop** for handling defects.

### Stages

| # | Stage Name | Owner | Primary Artifact | Purpose |
|---|---|---|---|---|
| 0 | Ideation | Product Owner (human) | `goal.md` | Define project intent and scope |
| 1 | Use Cases | BA / Product Owner | `1-USE-CASES.md` | Identify and approve workflows and user interactions |
| 2 | Narrative Vision | Writer | `2-NARRATIVE-VISION.md` | Establish thematic vision, tone, and creative direction |
| 3 | Concept Storyboard | Graphic Artist | `3-CONCEPT-STORYBOARD.md` | Visualize major screens and workflows |
| 4 | Business Requirements | Business Analyst | `4-REQUIREMENTS.md` | Convert use cases into atomic, testable requirements |
| 5 | Architecture | Architect | `5-ARCHITECTURE-RECOMMENDATIONS.md` + `5-PARTS LIST.md` | Define technology decisions and component boundaries |
| 6 | Design | Technical Lead | `6-DESIGN-INSTRUCTIONS.md` | Produce implementation-ready design with file-level steps |
| 7 | Text Content | Writer | `7-TEXT-CONTENT.md` | Generate glossary, phrasebook, and UI/documentation text |
| 8 | Graphic Assets | Graphic Artist | `8-GRAPHIC-ASSETS.md` | Create or specify visual assets and diagrams |
| 9 | Implementation | Developer | `9-RELEASE-NOTES.md` + `./build/**` | Build deliverables and document changes |
| 10 | Testing & Audit | Tester | `10-TEST-CASES.md` + `10-TEST-REPORT.md` | Verify all use cases and requirements; produce test evidence |

### Governance Loop

When Stage 10 (Testing) identifies a defect:
1. **Manager** analyzes the failure and identifies the root-cause stage.
2. **Owning stage** (not a downstream stage) receives the defect for repair.
3. **Downstream stages** are regenerated after the fix.
4. **Full pipeline re-runs** to produce updated test evidence.

---

## Core Principles

### 1. Artifact Ownership

Each stage **exclusively owns** exactly one primary artifact:
- Stage 1 owns `1-USE-CASES.md` exclusively.
- Stage 4 owns `4-REQUIREMENTS.md` exclusively.
- No downstream stage may edit an upstream artifact.

**Why?** Ensures accountability, prevents scope creep through hidden cross-editing, and simplifies defect routing.

### 2. Source of Truth

A stage's artifact becomes a **source of truth** for all downstream stages once it **passes its exit gate**. Exit gates verify:
- Schema compliance (all required fields populated)
- ID sequencing (no gaps, no reuse)
- Traceability (every record has valid RELATED field references)
- Coverage (100% of upstream intent is addressed)

### 3. Traceability Chain

Every downstream artifact explicitly traces back to upstream artifacts via the **RELATED field**:
```
Use Case UC-001 
  → Business Requirement BR-005 (RELATED: UC-001)
    → Architecture Recommendation AR-002 (RELATED: BR-005, UC-001)
      → Part PT-008 (RELATED: AR-002, BR-005, UC-001)
        → Design Instruction DI-006 (RELATED: PT-008, AR-002, BR-005, UC-001)
          → Implementation file (mapped in 9-RELEASE-NOTES.md)
            → Test Evidence (in 10-TEST-REPORT.md)
```

This chain ensures nothing is lost or accidentally omitted during development.

### 4. Testable Conditions

Every **Business Requirement (BR)** in Stage 4 has a **TESTABLE CONDITION** in Given-When-Then format:
```
TESTABLE CONDITION: Given [initial state], when [action], then [observable result].
Example: Given the player is standing on solid ground, when the jump key is pressed, then the player's vertical velocity becomes -350 px/sec.
```

This enables deterministic verification in Stage 10.

### 5. Explicit Promotion

Moving from one stage to the next requires explicit **approval and promotion**:
- Owning stage author signs off: "Approved by [Role] on [Date]."
- Promotion gates list specific criteria verified before handoff.
- No stage begins work until the previous stage's gate is **PASS**.

---

## Adapting MT2 for Different Project Types

MT2 applies to **software, content, and research projects** with the same pipeline structure. Adaptation occurs at the implementation level:

### For Software Projects

**Directory structure:**
```
PROJECTS/YourSoftware/
  6-DESIGN-INSTRUCTIONS.md      ← DI records map to code files
  build/
    src/
      main.ts                    ← DI-001: Project bootstrap
      player.ts                  ← DI-006: Player entity
      level.ts                   ← DI-014: Level loader
      …
    package.json                 ← Dependency manifest (not DI-mapped)
```

**Workflow:**
1. Design Instructions (Stage 6) list concrete file paths and function signatures.
2. Developer (Stage 9) creates files matching the DI specifications.
3. Release Notes (9-RELEASE-NOTES.md) maps each code file to its source DI ID.
4. Tester (Stage 10) verifies code implements each DI and satisfies traced requirements.

### For Content Projects

**Directory structure:**
```
PROJECTS/YourBook/
  7-TEXT-CONTENT.md              ← TC records map to text files
  build/
    text/
      utility/                   ← Glossaries, phrasebooks, UI copy
      narrative/                 ← Chapters, sections, body copy
      …
    images/                      ← Illustrations, diagrams
```

**Workflow:**
1. Design Instructions (Stage 6) describe content structure and key sections.
2. Writer (Stage 7) produces glossary and phrasebook for tone consistency.
3. Developer (Stage 9) authors final text files, linking each to a Design Instruction or Text Content record.
4. Tester (Stage 10) verifies all content is complete, on-brand, and addresses approved use cases.

### For Research Projects

**Directory structure:**
```
PROJECTS/YourStudy/
  6-DESIGN-INSTRUCTIONS.md       ← DI records map to experiment steps or analysis procedures
  build/
    methods.md                    ← Experimental protocol
    data/
      raw/                        ← Input datasets
      processed/                  ← Analysis outputs
    results/
      figures/                    ← Plots, visualizations
      tables/                     ← Summary statistics
```

**Workflow:**
1. Design Instructions (Stage 6) outline experimental steps or analysis procedures.
2. Developer (Stage 9) executes experiments, processes data, and logs outputs with DI traceability.
3. Release Notes (9-RELEASE-NOTES.md) documents which DI steps were executed, any deviations, and caveat notes.
4. Tester (Stage 10) verifies reproducibility: all data, code, and results are versioned and traceable to approved methodology.

---

## Ownership Table

| Stage | Owner | Artifact | Path | Exclusive Editing | Edit Rule |
|-------|-------|----------|------|-------------------|-----------|
| 0 | Product Owner (human) | Goal | `goal.md` | Yes | Owner approves scope; locked after use-case generation begins |
| 1 | BA / Product Owner | Use Cases | `1-USE-CASES.md` | Yes | BA generates from goal; Owner approves; locked after PASS |
| 2 | Writer | Narrative | `2-NARRATIVE-VISION.md` | Yes | Writer generates from UCs; locked after PASS |
| 3 | Graphic Artist | Storyboard | `3-CONCEPT-STORYBOARD.md` | Yes | Artist visualizes narrative and workflows; locked after PASS |
| 4 | Business Analyst | Requirements | `4-REQUIREMENTS.md` | Yes | BA converts UCs to atomic BRs; locked after PASS |
| 5 | Architect | Architecture | `5-ARCHITECTURE-RECOMMENDATIONS.md` + `5-PARTS LIST.md` | Yes | Architect selects tech and defines components; locked after PASS |
| 6 | Technical Lead | Design | `6-DESIGN-INSTRUCTIONS.md` | Yes | Tech Lead produces implementation steps; locked after PASS |
| 7 | Writer | Content | `7-TEXT-CONTENT.md` | Yes | Writer authors glossary, phrasebook, copy; locked after PASS |
| 8 | Graphic Artist | Assets | `8-GRAPHIC-ASSETS.md` | Yes | Artist produces final artwork and diagrams; locked after PASS |
| 9 | Developer | Release Notes | `9-RELEASE-NOTES.md` | Yes | Developer documents changes, DI traceability, caveats; append-only |
| 10 | Tester | Test Report | `10-TEST-REPORT.md` | Yes | Tester executes tests, audit, traceability verification; append-only |

---

## Getting Started: Step-by-Step

### Step 1: Copy the Template
```bash
git clone <mt2-repository-url> my-project
cd my-project/PROJECTS/MT2
```

Or manually copy the PROJECTS/MT2 directory to a new location.

### Step 2: Define Your Project Goal
Edit `goal.md` with a clear, concise description of your project:
```markdown
# Project Goal

**Project Name:** [Your Project Name]
**Domain:** [Software / Content / Research]
**Scope:** [1–2 sentences describing what the project does or produces]
**Intended Outcomes:** [List 3–5 key deliverables or success criteria]
```

### Step 3: Generate Initial Use Cases
Ask the BA agent (or yourself) to review `goal.md` and generate `1-USE-CASES-PROPOSED.md` with 5–10 initial use cases. Review for completeness and clarity.

### Step 4: Approve and Promote
If proposed use cases are satisfactory:
1. Rename or copy `1-USE-CASES-PROPOSED.md` → `1-USE-CASES.md`.
2. Add approval signature: "**APPROVED BY:** [Your Name] on [Date]."
3. Commit to Git: `git add 1-USE-CASES.md && git commit -m "Stage 1: Approve use cases"`

### Step 5: Generate Each Downstream Stage
For each stage (2–8):
1. Request the owning agent (Writer, BA, Architect, etc.) to generate the stage artifact from the previous stage's source-of-truth artifact.
2. Review for schema compliance, traceability, and coverage.
3. If satisfactory, approve and commit.
4. If defects found, route back to owning stage for repair; then regenerate downstream stages.

### Step 6: Implement (Stage 9)
Once 6-DESIGN-INSTRUCTIONS.md is approved:
1. Create code, content, or data files under `./build/**` as specified in Design Instructions.
2. Update 9-RELEASE-NOTES.md with each file created and its source DI ID.
3. Commit changes: `git add . && git commit -m "Stage 9: Implement [scope]"`

### Step 7: Test and Verify (Stage 10)
1. Tester creates `10-TEST-CASES.md` mapping each UC and BR to a test case.
2. Tester executes tests against `./build/**` and collects evidence.
3. Tester runs `validate.py` to check artifact traceability and completeness.
4. Tester produces `10-TEST-REPORT.md` with PASS or FAIL recommendation.
5. If FAIL, Manager identifies root-cause stage; routes defect; regenerates from that stage.

---

## Validation and Quality Checks

### Before Stage 10 Testing

Run the validation script to check artifact compliance:
```bash
python ./.github/scripts/validate.py PROJECTS/<YOUR-PROJECT>
```

Output:
```
ARTIFACT VALIDATION RESULT
=====================================
STATUS: PASS
```

Or (if issues found):
```
STATUS: FAIL
  - MISSING REQUIRED: 4-REQUIREMENTS.md
  - NON-SEQUENTIAL IDs in 1-USE-CASES.md: [1, 2, 4, 5]
  - INVALID REFERENCE in 4-REQUIREMENTS.md: BR-001 references missing UC-099
```

Fix any reported issues before Stage 10 testing begins.

### Traceability Audit Checklist

In Stage 10, verify:
- [ ] All UC records have unique sequential IDs (UC-001, UC-002, …)?
- [ ] All BR records have a TESTABLE CONDITION and parent UC(s) in RELATED?
- [ ] All AR records have RATIONALE and parent BR(s) in RELATED?
- [ ] All PT records have clear boundaries and map to AR(s)?
- [ ] All DI records have FILE RESPONSIBILITY and parent BR(s) in RELATED?
- [ ] All implementation files map to at least one DI ID in 9-RELEASE-NOTES.md?
- [ ] All test cases map to at least one BR or UC?
- [ ] Test evidence covers 100% of approved use cases?
- [ ] No broken cross-references in RELATED fields?

---

## Troubleshooting

### "Artifact validation fails with non-sequential IDs"
**Problem:** You edited an artifact and accidentally deleted or renumbered a record.
**Solution:** 
1. Git `diff` to see what changed.
2. Restore the missing record or restore the file from a prior commit.
3. Re-run validation.

### "Manager can't identify root cause for a test failure"
**Problem:** The failing test evidence doesn't clearly link to a specific BR or DI.
**Solution:**
1. Update the test case or test report to explicitly state which requirement or design instruction failed.
2. Add traceability: "Failed: BR-015 (collectible items must spawn from level data). See test case TC-009, expected result: item appears at (x,y) after block is struck."
3. Manager can now trace the failure upstream to identify the owning stage.

### "A downstream stage is blocked because an upstream stage won't fix a defect"
**Problem:** Stage 4 (BA) refuses to clarify a requirement that Stage 6 (Tech Lead) claims is ambiguous.
**Solution:**
1. Escalate to Manager or project governance owner.
2. Resolve the dispute (the issue may reveal a process gap, e.g., Stage 3 concept storyboards weren't clear enough).
3. Document the resolution in the artifact (e.g., "BR-015 clarification added on [date] per Stage 6 feedback").
4. Regenerate downstream stages.

---

## Contributing and Evolution

MT2 is a reference template. To adapt it for your organization:

1. **Customize `.github/instructions/pipeline.instructions.md`** to reflect your team structure and governance preferences.
2. **Add project-specific skills** under `.github/skills/` (e.g., domain-specific writing guidance, architecture patterns for your tech stack).
3. **Configure ownership** in `.github/CODEOWNERS` to route reviews to the correct teams.
4. **Document conventions** in project-specific README sections or shared wikis.

---

## License and Attribution

MT2 is provided as a reference template. Use, modify, and adapt it freely for your projects. Include a reference to MT2 in your project documentation to help others discover the pattern.

---

## Contact and Support

For questions or suggestions on MT2:
- Review the governance file: `.github/instructions/pipeline.instructions.md`
- Check the README in your project: `./README.md`
- Consult the skill guides in `.github/skills/`
- Run validation and review the error messages for specific artifact compliance issues

---

*MT2 Version 1.0 — Released April 29, 2026*
