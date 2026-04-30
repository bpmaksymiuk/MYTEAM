# MT2 — Business Requirements

> Stage 4 artifact. Produced from `1-USE-CASES.md` and `3-CONCEPT-STORYBOARD.md`.

---

## BR-001 : The pipeline shall define an ordered list of stages numbered 0 through 10 plus Manager and Auditor roles.
- **TESTABLE CONDITION**
  `./build/.github/instructions/pipeline.instructions.md` contains a stage table with entries for stages 0–10, Manager, and Auditor, each with a stage number, owner, artifact, and skill reference.
- **NOTES**
  Derived from UC-001 step 2.
- **RELATED**
  UC-001

---

## BR-002 : Each pipeline stage shall have exactly one owning agent.
- **TESTABLE CONDITION**
  No stage number appears more than once as the owner in the pipeline stage table, and every stage 0–10 has a non-empty owner field.
- **NOTES**
  Derived from UC-001 acceptance criterion 1.
- **RELATED**
  UC-001

---

## BR-003 : Each pipeline stage shall have at least one owned artifact listed in the stage table.
- **TESTABLE CONDITION**
  Every row in the pipeline stage table has a non-empty Artifact(s) column.
- **NOTES**
  Derived from UC-001 acceptance criterion 2.
- **RELATED**
  UC-001

---

## BR-004 : Each pipeline stage shall have measurable acceptance criteria that constitute its exit gate.
- **TESTABLE CONDITION**
  The pipeline instruction file contains an exit-gate section or equivalent per stage, with at least one numbered, testable criterion per stage.
- **NOTES**
  Derived from UC-001 acceptance criterion 3.
- **RELATED**
  UC-001

---

## BR-005 : The pipeline instruction file shall encode governance rules covering stage ownership, cross-edit prohibition, exit-gate logic, and failure-routing policy.
- **TESTABLE CONDITION**
  The pipeline instruction file contains explicit rules for: (a) which agent owns each artifact, (b) that no agent may edit another stage's artifact, (c) what constitutes a gate failure, and (d) how failures are routed back to the owning stage.
- **NOTES**
  Derived from UC-001 acceptance criterion 4.
- **RELATED**
  UC-001

---

## BR-006 : The pipeline instruction file shall be located at `./build/.github/instructions/pipeline.instructions.md`.
- **TESTABLE CONDITION**
  The file exists at that exact path within the MT2 `./build/` directory and is non-empty.
- **NOTES**
  Derived from UC-001 step 5 and acceptance criterion 5.
- **RELATED**
  UC-001

---

## BR-007 : One `.agent.md` configuration file shall exist for each pipeline stage plus Manager and Auditor.
- **TESTABLE CONDITION**
  The directory `./build/.github/agents/` contains at least 13 non-empty `.agent.md` files (one per stage 0–10 plus Manager and Auditor).
- **NOTES**
  Derived from UC-002 acceptance criterion 1.
- **RELATED**
  UC-002

---

## BR-008 : Each agent configuration file shall specify the agent's role description, allowed tools, stage assignment, owned artifact(s), skill reference, and cross-edit prohibitions.
- **TESTABLE CONDITION**
  Opening any `.agent.md` file in `./build/.github/agents/` reveals all six required fields: role, tools, stage, owns, skill, and must-not (or equivalent).
- **NOTES**
  Derived from UC-002 acceptance criterion 2.
- **RELATED**
  UC-002

---

## BR-009 : No two agent configuration files shall claim ownership of the same artifact.
- **TESTABLE CONDITION**
  A scan of all `owns:` fields across all `.agent.md` files in `./build/.github/agents/` shows no duplicate artifact paths.
- **NOTES**
  Derived from UC-002 acceptance criterion 3.
- **RELATED**
  UC-002

---

## BR-010 : All agent configuration files shall be located under `./build/.github/agents/`.
- **TESTABLE CONDITION**
  No `.agent.md` file exists outside `./build/.github/agents/` in the MT2 build output.
- **NOTES**
  Derived from UC-002 acceptance criterion 4.
- **RELATED**
  UC-002

---

## BR-011 : One `SKILL.md` file shall exist for each pipeline stage.
- **TESTABLE CONDITION**
  The directory `./build/.github/skills/` contains at least 11 subdirectories, each containing a non-empty `SKILL.md` file, one per stage 0–10.
- **NOTES**
  Derived from UC-003 acceptance criterion 1.
- **RELATED**
  UC-003

---

## BR-012 : Each skill file shall contain a purpose statement, list of target files, numbered step-by-step procedure, schema definitions, and an exit-gate checklist.
- **TESTABLE CONDITION**
  Opening any `SKILL.md` in `./build/.github/skills/` reveals all five required sections: purpose/When to Use, Target Files, Procedure, Schema, and Exit Gate.
- **NOTES**
  Derived from UC-003 acceptance criterion 2.
- **RELATED**
  UC-003

---

## BR-013 : All skill files shall be located under `./build/.github/skills/`.
- **TESTABLE CONDITION**
  No `SKILL.md` file exists outside `./build/.github/skills/` in the MT2 build output.
- **NOTES**
  Derived from UC-003 acceptance criterion 3.
- **RELATED**
  UC-003

---

## BR-014 : Every skill file's exit gate shall be traceable to at least one stage acceptance criterion in the pipeline instruction file.
- **TESTABLE CONDITION**
  Each exit-gate item in a `SKILL.md` can be matched to a corresponding criterion in the pipeline stage table or governance rules section of `pipeline.instructions.md`.
- **NOTES**
  Derived from UC-003 acceptance criterion 4.
- **RELATED**
  UC-003

---

## BR-015 : The workspace entry-point file `./build/.github/copilot-instructions.md` shall exist and shall reference the pipeline instruction file.
- **TESTABLE CONDITION**
  The file exists at `./build/.github/copilot-instructions.md` and contains a reference (file path or link) to `pipeline.instructions.md`.
- **NOTES**
  Derived from UC-004 acceptance criterion 1.
- **RELATED**
  UC-004

---

## BR-016 : Every agent defined in the agent configuration files shall be listed in `copilot-instructions.md`.
- **TESTABLE CONDITION**
  Each `.agent.md` filename or agent name found in `./build/.github/agents/` also appears in `./build/.github/copilot-instructions.md`.
- **NOTES**
  Derived from UC-004 acceptance criterion 2.
- **RELATED**
  UC-004

---

## BR-017 : The Auditor agent and its skill file shall be present in the build output.
- **TESTABLE CONDITION**
  `./build/.github/agents/auditor.agent.md` exists and `./build/.github/skills/auditor/SKILL.md` (or equivalent path) exists; both are non-empty and reference `X-AUDIT-REPORT.md`.
- **NOTES**
  Derived from UC-004 acceptance criterion 4.
- **RELATED**
  UC-004

---

## BR-018 : No broken file-path references shall exist in any customisation file in `./build/.github/`.
- **TESTABLE CONDITION**
  Every file path referenced inside `copilot-instructions.md`, any `.agent.md`, or any `SKILL.md` resolves to an existing file within `./build/.github/`.
- **NOTES**
  Derived from UC-004 acceptance criterion 5.
- **RELATED**
  UC-004

---

## BR-019 : Before producing its stage artifact, an agent shall read the pipeline instruction file and confirm its stage ownership and required upstream inputs.
- **TESTABLE CONDITION**
  Each stage agent's skill procedure lists "read pipeline instructions" and "confirm upstream artifacts" as explicit numbered steps before any output-generation steps.
- **NOTES**
  Derived from UC-005 acceptance criterion 1.
- **RELATED**
  UC-005

---

## BR-020 : An agent shall load and follow the procedure defined in its assigned skill file before producing output.
- **TESTABLE CONDITION**
  Each `.agent.md` contains a `skill:` reference and the corresponding `SKILL.md` contains a Procedure section. The agent's output conforms to the schema defined in that skill.
- **NOTES**
  Derived from UC-005 acceptance criteria 2–4.
- **RELATED**
  UC-005

---

## BR-021 : All required upstream artifacts shall be consumed before an agent produces its stage output.
- **TESTABLE CONDITION**
  Each skill Procedure section lists all required upstream artifacts as inputs in its first steps, and the produced artifact's content references those inputs.
- **NOTES**
  Derived from UC-005 acceptance criterion 3.
- **RELATED**
  UC-005

---

## BR-022 : An agent shall self-report its exit-gate result (PASS or FAIL) with specific evidence for each exit-gate criterion after completing its stage.
- **TESTABLE CONDITION**
  After a stage run, the agent produces a visible exit-gate status block enumerating each criterion with a PASS or FAIL indication and supporting evidence.
- **NOTES**
  Derived from UC-005 acceptance criterion 5.
- **RELATED**
  UC-005

---

## BR-023 : The Manager shall never directly edit a stage-owned artifact.
- **TESTABLE CONDITION**
  The Manager skill procedure contains an explicit prohibition on editing stage artifacts; any recovery action routes work back to the owning agent rather than modifying the artifact directly.
- **NOTES**
  Derived from UC-006 acceptance criterion 1.
- **RELATED**
  UC-006

---

## BR-024 : Every stage gate failure shall be routed back to the owning stage's agent with a specific failure description.
- **TESTABLE CONDITION**
  The Manager skill procedure specifies: (a) identify the owning stage of the failed artifact, (b) provide a written failure description to that stage's agent.
- **NOTES**
  Derived from UC-006 acceptance criteria 2–3.
- **RELATED**
  UC-006

---

## BR-025 : The Manager shall confirm a PASS on the exit gate before promoting work to the next stage.
- **TESTABLE CONDITION**
  The Manager skill procedure includes an explicit step that blocks stage promotion until the exit gate reports PASS.
- **NOTES**
  Derived from UC-006 acceptance criterion 5.
- **RELATED**
  UC-006

---

## BR-026 : All gate-failure events and recovery actions shall be recorded by the Manager.
- **TESTABLE CONDITION**
  The Manager skill procedure instructs the Manager to log each failure and resolution; a session log or equivalent record exists after any recovery run.
- **NOTES**
  Derived from UC-006 acceptance criterion 4.
- **RELATED**
  UC-006

---

## BR-027 : A new project initialised using the MT2 pipeline shall be able to run all stages in defined order with no skipped stages.
- **TESTABLE CONDITION**
  A test project using only `./build/.github/` files progresses from Stage 0 through Stage 10 without any stage being omitted, as verified by the presence of all expected stage artifacts.
- **NOTES**
  Derived from UC-007 acceptance criteria 1–3. Validated by UC-008.
- **RELATED**
  UC-007

---

## BR-028 : A user shall be able to review and approve or reject the output of each stage gate before the next stage begins.
- **TESTABLE CONDITION**
  The pipeline instruction file contains an approval step at each stage gate, and the stage does not proceed until the user confirms continuation.
- **NOTES**
  Derived from UC-007 acceptance criterion 4.
- **RELATED**
  UC-007

---

## BR-029 : The Tester shall verify that all cross-references within `./build/.github/` resolve to existing files before issuing a release recommendation.
- **TESTABLE CONDITION**
  The Tester skill procedure includes a structural completeness check that enumerates all file-path references across agent and skill files and confirms each resolves.
- **NOTES**
  Derived from UC-008 acceptance criteria 1–2.
- **RELATED**
  UC-008

---

## BR-030 : The Tester shall issue a release recommendation of PASS, FAIL, or CONDITIONAL with written justification.
- **TESTABLE CONDITION**
  `10-TEST-REPORT.md` contains a release recommendation field with one of the three values and a written rationale. A CONDITIONAL recommendation lists specific caveats.
- **NOTES**
  Derived from UC-008 acceptance criterion 5.
- **RELATED**
  UC-008

---

## Exit Gate — Stage 4

- [x] Every UC (UC-001 through UC-008) maps to at least one BR.
- [x] Every BR has a testable condition.
- [x] BR IDs are sequential (BR-001 through BR-030) and none are reused.
- [x] All RELATED fields point to valid UC IDs from `1-USE-CASES.md`.
