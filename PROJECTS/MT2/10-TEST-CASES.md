# MT2 — Test Cases

> Stage 10 artifact. Written before test execution.
> Covers all UCs (UC-001 through UC-008) and all BRs (BR-001 through BR-030).

---

## T-001 : Pipeline instruction file exists at correct path

- **UC REFERENCE:** UC-001
- **BR REFERENCE:** BR-006
- **PRECONDITIONS:** MT2 Stage 9 implementation is complete.
- **STEPS:**
  1. Navigate to `PROJECTS/MT2/build/.github/instructions/`.
  2. Confirm the file `pipeline.instructions.md` exists.
  3. Open the file and confirm it is non-empty.
- **EXPECTED RESULT:** `./build/.github/instructions/pipeline.instructions.md` exists and contains content.
- **NOTES:** This is the foundational file — all other tests depend on it.

---

## T-002 : Pipeline instruction file has YAML frontmatter with correct applyTo

- **UC REFERENCE:** UC-001
- **BR REFERENCE:** BR-001
- **PRECONDITIONS:** T-001 passes.
- **STEPS:**
  1. Open `./build/.github/instructions/pipeline.instructions.md`.
  2. Check the first 5 lines for YAML frontmatter block.
  3. Confirm the frontmatter contains `applyTo: "PROJECTS/**"`.
- **EXPECTED RESULT:** File begins with `---` and includes `applyTo: "PROJECTS/**"` before the closing `---`.
- **NOTES:** Required for VS Code Copilot to apply instructions to the correct scope.

---

## T-003 : Pipeline stage table has all required rows (0–10, Manager, Auditor)

- **UC REFERENCE:** UC-001
- **BR REFERENCE:** BR-001, BR-002, BR-003
- **PRECONDITIONS:** T-001 passes.
- **STEPS:**
  1. Open `./build/.github/instructions/pipeline.instructions.md`.
  2. Locate the `# Pipeline Stages` section.
  3. Count the rows in the stage table (excluding the header row).
  4. Verify stages 0 through 10 are present (11 numbered stages).
  5. Verify Manager and Auditor rows are present.
  6. Verify every row has non-empty Owner, Artifact(s), and Skill(s) columns.
- **EXPECTED RESULT:** Table has 13 rows (stages 0–10 + Manager + Auditor); no row has an empty Artifact(s) or Skill(s) cell.
- **NOTES:** Covers BR-001 (stage count), BR-002 (one owner per stage), BR-003 (artifacts present).

---

## T-004 : Pipeline instruction file contains all four governance rule categories

- **UC REFERENCE:** UC-001
- **BR REFERENCE:** BR-005
- **PRECONDITIONS:** T-001 passes.
- **STEPS:**
  1. Open `./build/.github/instructions/pipeline.instructions.md`.
  2. Locate the `## Foundational Rules` section.
  3. Check for a rule about stage ownership (which agent may write each artifact).
  4. Check for a rule prohibiting cross-editing (agents may not edit others' artifacts).
  5. Check for a rule defining exit-gate failure conditions.
  6. Check for a rule about routing failures back to the owning stage.
- **EXPECTED RESULT:** The Foundational Rules section contains at least one rule for each of: ownership, cross-edit prohibition, gate failure, and failure routing.
- **NOTES:** Covers BR-005.

---

## T-005 : Pipeline instruction file contains Traceability ID Convention table

- **UC REFERENCE:** UC-001, UC-008
- **BR REFERENCE:** BR-001
- **PRECONDITIONS:** T-001 passes.
- **STEPS:**
  1. Open `./build/.github/instructions/pipeline.instructions.md`.
  2. Search for `## Traceability ID Convention`.
  3. Confirm the table contains all 12 prefix rows: UC, BR, AR, PT, DI, TC, GL, GA, T, BUG, AUDIT, RN.
- **EXPECTED RESULT:** Section exists with a 12-row ID prefix table and sequencing rules.
- **NOTES:** Required per DI-010.

---

## T-006 : Agent directory contains correct number of .agent.md files

- **UC REFERENCE:** UC-002
- **BR REFERENCE:** BR-007, BR-010
- **PRECONDITIONS:** MT2 Stage 9 complete.
- **STEPS:**
  1. List all files in `./build/.github/agents/`.
  2. Count files ending in `.agent.md`.
  3. Verify count is 11 (the pipeline has 11 unique agent files covering 13 stage-role assignments).
  4. Verify no `.agent.md` files exist outside `./build/.github/agents/`.
- **EXPECTED RESULT:** Exactly 11 `.agent.md` files exist in `./build/.github/agents/` and nowhere else.
- **NOTES:** 11 files because Writer covers stages 2 & 7 and Graphic Artist covers stages 3 & 8.

---

## T-007 : Each agent file contains all required sections

- **UC REFERENCE:** UC-002
- **BR REFERENCE:** BR-008
- **PRECONDITIONS:** T-006 passes.
- **STEPS:**
  1. Open each of the 11 `.agent.md` files in turn.
  2. For each file, verify presence of: YAML frontmatter with `name`, `description`, and `tools`, plus Markdown sections `## Role`, `## Stage Assignment`, `## Skill`, `## Must Not`, `## Procedure`.
- **EXPECTED RESULT:** All 11 files contain YAML frontmatter (name, description, tools) and all five Markdown body sections.
- **NOTES:** Manager has an additional `## Gate Failure Loop` section; Auditor has `## Observation Scope` and `## Write Target`.

---

## T-008 : No two agent files claim the same artifact ownership

- **UC REFERENCE:** UC-002
- **BR REFERENCE:** BR-009
- **PRECONDITIONS:** T-006 passes.
- **STEPS:**
  1. Open each `.agent.md` file.
  2. From `## Stage Assignment`, extract the `Owns:` artifact paths.
  3. Confirm no two files list the same artifact path.
- **EXPECTED RESULT:** All agent-owned artifact paths are unique across all 11 agent files.
- **NOTES:** Covers BR-009.

---

## T-009 : Skills directory contains required SKILL.md files

- **UC REFERENCE:** UC-003
- **BR REFERENCE:** BR-011, BR-013
- **PRECONDITIONS:** MT2 Stage 9 complete.
- **STEPS:**
  1. List all `SKILL.md` files under `./build/.github/skills/`.
  2. Count them — expected: 14 files across 14 subdirectories.
  3. Confirm no `SKILL.md` exists outside `./build/.github/skills/`.
- **EXPECTED RESULT:** 14 non-empty `SKILL.md` files exist under `./build/.github/skills/`, one per skill directory.
- **NOTES:** 14 skills because implementation and release-notes are separate, and test-case/test-report/bug-report are separate, and manager/auditor have their own skills.

---

## T-010 : Each skill file contains all five required sections

- **UC REFERENCE:** UC-003
- **BR REFERENCE:** BR-012
- **PRECONDITIONS:** T-009 passes.
- **STEPS:**
  1. Open each of the 14 `SKILL.md` files in turn.
  2. For each file, verify presence of: `## When to Use`, `## Target Files`, a procedure section, a schema or record section (where applicable), and `## Exit Gate`.
- **EXPECTED RESULT:** All 14 skill files contain all five required sections. No section is missing or empty.
- **NOTES:** Schema section may be titled `## Record Schema` or similar. "When to Use" satisfies the purpose requirement.

---

## T-011 : Each skill procedure starts with "read pipeline instructions"

- **UC REFERENCE:** UC-005
- **BR REFERENCE:** BR-019, BR-021
- **PRECONDITIONS:** T-009 passes.
- **STEPS:**
  1. Open each stage-specific `SKILL.md` file (use-case-authoring, content-writing, concept-storyboard, business-requirements, architecture-and-parts, design-instructions, graphic-artwork, implementation-stage, test-case-authoring, test-report-writing, bug-report-writing).
  2. Locate the `## Procedure` section.
  3. Verify step 1 references reading the pipeline instruction file or governance file.
- **EXPECTED RESULT:** Step 1 of the Procedure section in each skill file refers to reading `pipeline.instructions.md` or the governance file.
- **NOTES:** Covers BR-019. Manager and Auditor skills also checked for this.

---

## T-012 : copilot-instructions.md exists and references pipeline instruction file

- **UC REFERENCE:** UC-004
- **BR REFERENCE:** BR-015
- **PRECONDITIONS:** MT2 Stage 9 complete.
- **STEPS:**
  1. Confirm `./build/.github/copilot-instructions.md` exists and is non-empty.
  2. Open the file and search for a reference to `pipeline.instructions.md`.
- **EXPECTED RESULT:** File exists and contains a reference to `.github/instructions/pipeline.instructions.md`.
- **NOTES:** Covers BR-015.

---

## T-013 : copilot-instructions.md lists all 11 agent files

- **UC REFERENCE:** UC-004
- **BR REFERENCE:** BR-016
- **PRECONDITIONS:** T-012 passes.
- **STEPS:**
  1. Open `./build/.github/copilot-instructions.md`.
  2. Locate the `## Agents` section.
  3. Verify all 11 agent file paths appear: user-ba, product-owner, writer, graphic-artist, business-analyst, architect, technical-lead, developer, tester, manager, auditor.
- **EXPECTED RESULT:** All 11 agent file paths are listed in the Agents section.
- **NOTES:** Covers BR-016.

---

## T-014 : Auditor agent and skill files are present and reference X-AUDIT-REPORT.md

- **UC REFERENCE:** UC-004
- **BR REFERENCE:** BR-017
- **PRECONDITIONS:** MT2 Stage 9 complete.
- **STEPS:**
  1. Confirm `./build/.github/agents/auditor.agent.md` exists and is non-empty.
  2. Confirm `./build/.github/skills/auditor/SKILL.md` exists and is non-empty.
  3. Open each file and verify it contains a reference to `X-AUDIT-REPORT.md`.
- **EXPECTED RESULT:** Both files exist and both reference `X-AUDIT-REPORT.md`.
- **NOTES:** Covers BR-017.

---

## T-015 : All file-path references in copilot-instructions.md resolve

- **UC REFERENCE:** UC-004
- **BR REFERENCE:** BR-018, BR-029
- **PRECONDITIONS:** T-012 passes.
- **STEPS:**
  1. Open `./build/.github/copilot-instructions.md`.
  2. Extract all file paths referenced (links or inline paths).
  3. For each path, confirm the file exists within `./build/.github/`.
- **EXPECTED RESULT:** Every file path referenced in `copilot-instructions.md` resolves to an existing file.
- **NOTES:** Covers BR-018 (no broken references).

---

## T-016 : All skill paths referenced in agent files resolve

- **UC REFERENCE:** UC-004, UC-005
- **BR REFERENCE:** BR-018, BR-020
- **PRECONDITIONS:** T-006, T-009 pass.
- **STEPS:**
  1. Open each `.agent.md` file.
  2. Extract the `## Skill` section path from each file.
  3. Confirm each skill path resolves to an existing `SKILL.md` within `./build/.github/skills/`.
- **EXPECTED RESULT:** Every skill path in every agent file resolves to an existing file.
- **NOTES:** Covers BR-020 (skill reference) and BR-018 (no broken refs).

---

## T-017 : Manager skill contains gate failure loop and explicit prohibition on editing artifacts

- **UC REFERENCE:** UC-006
- **BR REFERENCE:** BR-023, BR-024, BR-025, BR-026
- **PRECONDITIONS:** T-009 passes.
- **STEPS:**
  1. Open `./build/.github/skills/manager-pipeline-orchestration/SKILL.md`.
  2. Verify the file contains a numbered gate failure procedure (detect → identify → route → wait → trigger → log).
  3. Verify the file contains an explicit prohibition on editing stage-owned artifacts.
  4. Verify the file contains a step that blocks stage promotion until exit gate is PASS.
  5. Verify the file contains a logging/record step.
- **EXPECTED RESULT:** Manager skill has a complete gate failure loop with all four required behaviours (BR-023–026).
- **NOTES:** Critical governance behaviour — must be explicitly documented.

---

## T-018 : X-AUDIT-REPORT.md shell exists in build output

- **UC REFERENCE:** UC-004
- **BR REFERENCE:** BR-017
- **PRECONDITIONS:** MT2 Stage 9 complete.
- **STEPS:**
  1. Confirm `./build/.github/X-AUDIT-REPORT.md` exists.
  2. Open the file and verify it contains the audit entry schema block.
  3. Verify it is marked as append-only.
- **EXPECTED RESULT:** File exists, contains schema, and has append-only instruction.
- **NOTES:** Required for the Auditor to append entries without creating the file.

---

## T-019 : Pipeline package is self-contained (no references to machine-specific absolute paths)

- **UC REFERENCE:** UC-007
- **BR REFERENCE:** BR-027
- **PRECONDITIONS:** MT2 Stage 9 complete.
- **STEPS:**
  1. Search all files in `./build/.github/` for absolute paths beginning with `/home/`, `/Users/`, or `C:\`.
  2. Search for references to `MYTEAM` workspace path that would break portability.
- **EXPECTED RESULT:** No absolute machine-specific paths appear in any `./build/.github/` file.
- **NOTES:** Covers BR-027 (portable installation). All paths must be relative to `.github/`.

---

## T-020 : Tester skill instructs visible browser use and screenshot capture

- **UC REFERENCE:** UC-008
- **BR REFERENCE:** BR-029, BR-030
- **PRECONDITIONS:** T-009 passes.
- **STEPS:**
  1. Open `./build/.github/skills/test-report-writing/SKILL.md`.
  2. Verify the Procedure section explicitly instructs use of a visible browser (not headless).
  3. Verify the Procedure section instructs capturing screenshots as evidence.
  4. Open `./build/.github/skills/test-case-authoring/SKILL.md`.
  5. Verify it instructs test cases to be written before execution.
- **EXPECTED RESULT:** test-report-writing SKILL.md requires visible browser + screenshots; test-case-authoring SKILL.md requires test cases written before execution.
- **NOTES:** Covers BR-029 (structural verification step) and BR-030 (recommendation issued).
