---
applyTo: "PROJECTS/**"
---

# Purpose

This file is the single source of pipeline governance. It defines stage order, ownership, gates, recovery, and traceability.

The pipeline runs **Stage B (Brainstorming)** followed by numbered stages 0-10 with two cross-cutting roles (Manager and Auditor). A stage starts only after the previous stage reports PASS. Stage B is the very first stage and is identified by the letter `B` (not a number) so that the established numeric stage labels 0-10 remain stable across all existing projects.

Agents must not invent local policy. If a rule is missing, route to Manager.

This file exists to achieve three goals:

1. **Traceability** — every artifact traces back to an approved use case in `1-USE-CASES.md`.
2. **Predictable quality gates** — each stage has a defined exit gate that must PASS before the next stage starts.
3. **Safe recovery** — failures are routed back to the owning stage, corrected, and downstream stages re-run in order.

---

## Working Directory

- Convention: `PROJECTS/<APP>/`
- Change into the active project folder before running any pipeline stage.
- Treat the project folder as the active root; use relative paths from it.
- Never use machine-specific absolute paths in pipeline artifacts.

---

## Scope

This pipeline applies to all product work under `PROJECTS/<APP>/`:
- Use-case proposals and approvals
- Business requirements
- Architecture and parts decisions
- Design instructions
- Source code and build assets
- Test planning and verification evidence
- Audit records

---

## Foundational Rules

1. Only the owning stage's agent may write or edit that stage's artifact.
2. No agent may edit an artifact it does not own. Route errors upstream instead.
3. When an artifact at stage N has an error, return work to stage N — do not patch it from a later stage.
4. `1-USE-CASES.md` is the single source of approved intent. All downstream artifacts trace to it.
5. `1-USE-CASES-PROPOSED.md` is advisory only. It does not trigger the pipeline until content is promoted to `1-USE-CASES.md`.
6. After any change to `1-USE-CASES.md`, all downstream stages (2–10) must be re-run in order.
7. All generated artifacts must be deterministic and schema-stable across runs.
8. Historical evidence is append-only. Never delete or overwrite prior entries in release notes, test reports, audit reports, or bug reports.
9. Each stage must read and consume all required upstream artifacts before producing its own output.
10. The Auditor runs after every stage completes and documents any violations in `X-AUDIT-REPORT.md`.
11. Stage 9 may use iterative Playwright scripts for development feedback, but formal verification scripts and evidence remain Stage 10 Tester-owned artifacts.
14. Every agent appends to `X-Journal.md` at the start and completion of their stage work. Journal entries are the cross-team turnover record — they capture what was done, how it went, where artifacts are, and what the next agent needs to know. `X-Journal.md` is append-only and shared across all agents.
12. **Hard stop rule:** After completing any stage, the executing agent must stop, explicitly state the gate result (`GATE N: PASS` or `GATE N: FAIL`), and take no further pipeline action until the gate is confirmed PASS. An agent must never begin Stage N+1 in the same action as completing Stage N. Cross-cutting roles (Manager and Auditor) do not declare numbered stage gates.
13. Skill-specific automation scripts, templates, and checks must live under `.github/skills/<skill-name>/automation/`.

---

# Pipeline Stages

| Stage | Owner | Type | Artifact(s) | Purpose | Ownership Rule | Skill(s) |
|-------|-------|------|-------------|---------|----------------|----------|
| B | Writer | Brainstorm | `BRAINSTORM.md` (input: user-authored `0-IDEA.md`) | Open-ended creative exploration of what the product could be — graphics, screen flow, mood, colour, UI, metaphors, references | Only Writer may write `BRAINSTORM.md`; `0-IDEA.md` is user-authored input and is never edited by any agent | `.github/skills/brainstorming-authoring/SKILL.md` |
| 0 | User / BA | Advisory | `1-USE-CASES-PROPOSED.md` | Propose and validate use cases before approval | Only User/BA may write proposed use cases | `.github/skills/use-case-authoring/SKILL.md` |
| 1 | Product Owner | Approved Intent | `1-USE-CASES.md` | Approve use cases as the single source of intent | Only Product Owner may write the approved file | `.github/skills/use-case-authoring/SKILL.md` |
| 2 | Writer | Documentation | `2-NARRATIVE-VISION.md` | Establish tone, themes, and world context | Only Writer may edit the narrative vision | `.github/skills/content-writing-authoring/SKILL.md` |
| 3 | Graphic Artist | Documentation | `3-CONCEPT-STORYBOARD.md`, `./build/concept/**` | Produce early visual concepts and screen flows | Only Graphic Artist may write storyboard and concept assets | `.github/skills/concept-storyboard-authoring/SKILL.md` |
| 4 | Business Analyst | Documentation | `4-REQUIREMENTS.md` | Derive testable business requirements from use cases | Only Business Analyst may write requirements | `.github/skills/business-requirements-writing/SKILL.md` |
| 5 | Architect | Documentation | `5-ARCHITECTURE-RECOMMENDATIONS.md`, `5-PARTS LIST.md` | Make concrete technology and component decisions | Only Architect may write architecture and parts | `.github/skills/architecture-and-parts-authoring/SKILL.md` |
| 6 | Technical Lead | Documentation | `6-DESIGN-INSTRUCTIONS.md` | Write implementation-ready instructions for the Developer | Only Technical Lead may write design instructions | `.github/skills/design-instructions-authoring/SKILL.md` |
| 7 | Writer | Documentation | `7-TEXT-CONTENT.md`, `./build/text/**` | Produce all application text, glossary, and phrasebook | Only Writer may write text content | `.github/skills/content-writing-authoring/SKILL.md` |
| 8 | Graphic Artist | Documentation | `8-GRAPHIC-ASSETS.md`, `./build/images/**` | Produce final production-quality graphic assets | Only Graphic Artist may write final image assets | `.github/skills/graphic-artwork-authoring/SKILL.md` |
| 9 | Developer | Implementation | `./build/**`, `9-RELEASE-NOTES.md` | Implement all design instructions; write release notes | Developer owns implementation build files and may use iterative Playwright scripts for coding feedback; formal verification specs remain Tester-owned | `.github/skills/implementation-stage/SKILL.md`, `.github/skills/release-notes-writing/SKILL.md` |
| 10 | Tester | Verification | `10-TEST-CASES.md`, `10-TEST-REPORT.md`, `10-BUG-REPORT.md`, `./build/tests/specs/**` | Write test cases, execute them, record evidence, issue recommendation | Only Tester may write formal verification specs and test/bug artifacts | `.github/skills/test-case-authoring/SKILL.md`, `.github/skills/test-report-writing/SKILL.md`, `.github/skills/bug-report-writing/SKILL.md` |
| — | Manager | Cross-cutting | Session log | Gate failure detection, routing, and recovery | Does not own any stage artifact | `.github/skills/manager-pipeline-orchestration/SKILL.md` |
| — | Auditor | Cross-cutting | `X-AUDIT-REPORT.md` | Observe every stage for compliance violations | Writes only to X-AUDIT-REPORT.md | `.github/skills/auditor/SKILL.md` |
| — | All agents | Cross-cutting | `X-Journal.md` | Shared turnover log; all agents append start and completion entries | All agents may append; no single agent owns it; append-only | — |

---

## Stage Status Board

Track stage state in `PROJECTS/<APP>/PIPELINE-STATUS.md` using this format:

| Stage | Status | Status Updated |
|-------|--------|----------------|
| B | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 0 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 1 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 2 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 3 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 4 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 5 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 6 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 7 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 8 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 9 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |
| 10 | Not Started \| In Progress \| PASS \| FAIL | YYYY-MM-DD |

Update this board after each stage gate result.

---

## Traceability ID Convention

| Prefix | Full Name | Source Artifact |
|--------|-----------|-----------------|
| UC | Use Case | 1-USE-CASES.md |
| BR | Business Requirement | 4-REQUIREMENTS.md |
| AR | Architecture Recommendation | 5-ARCHITECTURE-RECOMMENDATIONS.md |
| PT | Part | 5-PARTS LIST.md |
| DI | Design Instruction | 6-DESIGN-INSTRUCTIONS.md |
| TC | Text Content | 7-TEXT-CONTENT.md |
| GL | Glossary Entry | 7-TEXT-CONTENT.md |
| CB | Concept Board | 3-CONCEPT-STORYBOARD.md |
| GA | Graphic Asset | 8-GRAPHIC-ASSETS.md |
| T | Test Case | 10-TEST-CASES.md |
| BUG | Bug Report | 10-BUG-REPORT.md |
| AUDIT | Audit Entry | X-AUDIT-REPORT.md |
| RN | Release Notes Entry | 9-RELEASE-NOTES.md |
| JN | Journal Entry | X-Journal.md |

**Rules:**
- IDs are sequential within each prefix and never reused.
- New IDs are always appended — never inserted or renumbered.
- RELATED fields must use valid IDs from this table only.

---

# Execution Model

## Standard Run Procedure

1. Set working directory to `PROJECTS/<APP>/`.
2. Confirm `1-USE-CASES.md` exists and is approved (contains an approval date header).
3. **If the project starts from a raw idea**, run Stage B first: read user-authored `0-IDEA.md`, produce `BRAINSTORM.md`, and declare `GATE B: PASS` before any Stage 0 work begins. Stage B may be skipped only when `1-USE-CASES.md` already exists and the team explicitly waives brainstorming; the waiver must be recorded in `X-Journal.md`.
4. If Stage 0 is in scope, the Manager triggers Stage 1 only after `GATE 0: PASS` is declared.
5. Run stages 2–10 one stage at a time. For each stage:
   a. Load the owning agent role and skill file.
   b. **Append a START entry to `X-Journal.md`** (see Journal Protocol below).
   c. Produce the stage artifact.
   d. Add `## Exit Gate` as the final section in the stage artifact and mirror the skill checklist there.
   e. Run the exit gate checklist from the skill file against the artifact.
   f. **Stop. Report the gate result explicitly: `GATE N: PASS` or `GATE N: FAIL`.**
   g. **Append a COMPLETE entry to `X-Journal.md`** with the gate result, artifacts produced, and handoff notes.
   h. Report the gate result in the current session log or orchestration channel so Manager and Auditor can act on it.
   i. Update `PIPELINE-STATUS.md` with stage status and date.
   j. Run the Auditor.
   k. Only if the gate is PASS, proceed to Stage N+1.
6. On any gate FAIL, activate the Manager skill and do not proceed to Stage N+1 until a re-run achieves PASS.
7. Batching stages — producing artifacts for multiple stages before checking any gate — is a pipeline violation.

---

# Quality Gates

**Global rules that apply at every stage:**
- No stage may begin until the previous stage's exit gate is PASS.
- The gate result must be explicitly stated (`GATE N: PASS` or `GATE N: FAIL`) before any next-stage action is taken.
- Producing an artifact and immediately starting the next stage without reporting the gate is a violation, even if the artifact is correct.
- Gate statements with alternate labels (for example, `RN GATE`, `BUG GATE`, or `GATE 10a`) do not satisfy the hard stop rule.
- Artifacts with missing required schema fields are invalid and fail the gate.
- Vague or unverifiable evidence in test reports constitutes a FAIL.
- Any implementation caveat or known limitation must be documented in `9-RELEASE-NOTES.md` before the stage exit gate can PASS.
- Exit gates are checked checklists — every item must be explicitly confirmed, not assumed.

---

## Markdown Style and Pattern Conventions

All pipeline artifacts are plain Markdown files. Consistency in formatting enables agents to parse records predictably, ensures markdownlint passes at every exit gate, and makes the audit trail readable without tooling.

These conventions are enforced at every stage exit gate. A markdownlint violation in any artifact blocks the stage gate. Agents must apply these rules when producing or amending any artifact — not just the artifact they own.

**Heading hierarchy:**

- H1 (`#`) — document title, first line of every artifact file.
- H2 (`##`) — record headings (e.g., `## BR-001 : REQUIREMENT TITLE`) and major document sections (e.g., `## Exit Gate`).
- H3 (`###`) — sub-sections within records or within major sections.
- Do not skip heading levels.

**Record heading format:**

```markdown
## <ID> : <TITLE IN UPPER CASE>
```

Example: `## BR-001 : PROPOSED USE CASES DERIVABLE WITHOUT DOWNSTREAM ARTIFACTS`

**Record field format:**

```markdown
- **FIELD NAME:** Field value.
```

All field names are bold, uppercase, and followed by a colon and space.

**Required stage status fields (for each stage artifact):**

```markdown
- **STATUS:** Not Started | In Progress | PASS | FAIL
- **STATUS UPDATED:** YYYY-MM-DD
```

**Exit gate format:**
Every artifact's final section must be headed `## Exit Gate` and contain a Markdown checklist (`- [ ]` items) mirroring the skill's exit gate. Checked items use `- [x]`.

**Separator rule:**
Records are separated by a horizontal rule (`---`) on its own line.

**File hygiene:**

- UTF-8 encoding.
- Unix line endings (`\n`).
- Trailing newline on the last line.
- No trailing whitespace on any line.
- No tabs — spaces only.

**Comment blocks (HTML comments):**
Section dividers between UC groups in requirements or architecture files may use the pattern:

```html
<!-- ═══════════ SECTION TITLE ═══════════ -->
```

These conventions are enforced at every stage exit gate. A markdownlint violation in an artifact blocks the stage gate.

---

## SVG Visual Style Conventions

All visual artifacts (concept boards at Stage 3, handoff diagrams at Stage 8) are SVG files rendered in GitHub's dark-mode environment. Consistent colour coding and shape conventions allow any reader to immediately identify the owning role for a region, distinguish stage boxes from gate markers, and follow flow arrows without a legend.

A concept or handoff SVG that does not follow these conventions fails the visual artifact exit gate. Colour additions or changes require an amendment to `pipeline.instructions.md` approved by the Product Owner.

**Canvas:**

- Background: `#0d1117` (GitHub dark background) / `#161b22` (surface)
- Default text colour: `#e6edf3` (primary) / `#c9d1d9` (secondary)
- Muted text / borders: `#8b949e` / `#21262d` / `#3d444d`
- Font family: `'Segoe UI', system-ui, sans-serif`
- Mono font: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`
- Font size: 13px for labels, 11px for annotations

**Role colour coding (accent colours for stage labels and borders):**

| Role | Border | Text |
| ---- | ------ | ---- |
| User/BA, Product Owner, Business Analyst, Technical Lead | `#1f6feb` | `#79c0ff` |
| Writer, Tester | `#2ea043` | `#3fb950` |
| Graphic Artist, Manager, Auditor | `#9e6a03` | `#d29922` |
| Architect, Developer | `#b91c1c` | `#f78166` |
| Gates | `#3fb950` | `#3fb950` |

**Shape conventions:**

- Stage boxes: `rx="8"` large, `rx="6"` small; stroke-width 1.5; fill `#161b22`
- Gate markers: diamond shape; stroke `#3fb950`; fill `#0d1117`
- Arrows: `marker-end` with arrowhead; stroke `#8b949e`; stroke-width 1.5
- Labels inside shapes: centred `<text>` elements with `dominant-baseline="middle"` and `text-anchor="middle"`

**Required SVG elements:**

- Root `<svg>` with `xmlns`, `viewBox`, `width`, `height` attributes
- A `<title>` element describing the diagram
- At least one `<g>` group with an `id` attribute for each logical region
- All interactive/logical elements must have a text label

---

# Journal Protocol

`X-Journal.md` is the shared, append-only turnover log for all pipeline agents. It answers the questions every incoming agent needs before they start: *What happened before me? Where are the artifacts? What should I watch out for?*

## When to write

- **START entry:** Append at the beginning of stage work, before producing any artifact.
- **COMPLETE entry:** Append immediately after declaring the stage gate result.
- Cross-cutting agents (Manager, Auditor) append as appropriate when they act — e.g., at the start of an audit pass or when issuing a recovery routing instruction.

## Entry schema

```markdown
## JN-NNN : <AGENT> — Stage <N> — <START | COMPLETE> — <YYYY-MM-DD>

- **AGENT:** <role name>
- **STAGE:** <stage number or "Cross-cutting">
- **EVENT:** Start | Complete
- **DATE:** YYYY-MM-DD
- **GATE RESULT:** (COMPLETE entries only) PASS | FAIL | N/A
- **ARTIFACTS READ:** <comma-separated list of files consumed>
- **ARTIFACTS WRITTEN:** <comma-separated list of files produced or appended>
- **SUMMARY:** One to three sentences: what was done and how it went.
- **ISSUES:** Any blockers, surprises, or decisions made mid-stage. Use "None." if clean.
- **HANDOFF NOTES:** What the next agent or downstream stage needs to know. Artifact locations, constraints, open questions.
```

## Rules

- IDs are sequential (`JN-001`, `JN-002`, …) and never reused.
- Entries are always appended — never edited or deleted after writing.
- Every entry must include all schema fields; omitting a field is a journal violation and must be flagged by the Auditor.
- GATE RESULT is required on COMPLETE entries; leave it out on START entries.
- `X-Journal.md` must not be modified by any agent other than by appending a new entry.
- The Auditor checks that journal entries exist for every completed stage and flags missing START or COMPLETE entries as a violation in `X-AUDIT-REPORT.md`.

## File location

`PROJECTS/<APP>/X-Journal.md`

