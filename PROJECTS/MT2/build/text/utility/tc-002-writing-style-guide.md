# MT2 Pipeline — Writing Style Guide

> Canonical writing conventions for all MT2 pipeline files.
> Follow these rules when authoring skill files, agent files, governance rules, and artifact records.

---

## 1. Governance Rules

**Tone:** Authoritative. Non-negotiable.
**Voice:** Third person — "the agent", "the stage", "the artifact".
**Avoid:** "you should", "consider", "try to", "it is recommended that".

**Correct:** `Only the owning stage edits its artifact.`
**Incorrect:** `You should try to have only one stage edit each artifact.`

---

## 2. Procedure Steps

**Tone:** Directive, unambiguous.
**Voice:** Imperative — verb-first, numbered.
**Avoid:** Passive constructions, hedging, multi-action steps.

**Correct:** `Read the pipeline instruction file first.`
**Incorrect:** `The pipeline instruction file should be read before proceeding.`

Each step does exactly one thing. If a step requires two actions, split it into two steps.

---

## 3. Exit Gate Items

**Tone:** Objective, verifiable.
**Voice:** Passive observable — the criterion describes a state that exists, not an action.
**Avoid:** Subjective adjectives ("good", "clear", "sufficient"), action verbs ("ensure", "check").

**Correct:** `Every UC maps to at least one BR.`
**Incorrect:** `Ensure that all use cases have been mapped to business requirements.`

Exit gate items must be checkable by the Auditor from document content alone (for stages 0–8).

---

## 4. Business Requirement (BR) Statements

**Tone:** Mandatory, atomic.
**Voice:** Subject + `shall` + predicate.
**Avoid:** `must`, `will`, `should`, `may`. Do not combine multiple conditions in one BR.

**Correct:** `The pipeline instruction file shall be located at \`./build/.github/instructions/pipeline.instructions.md\`.`
**Incorrect:** `The pipeline instruction file must exist and should be at the correct path and contain governance rules.`

One BR = one testable condition. If two conditions must both hold, write two BRs.

---

## 5. Error and Failure Descriptions

**Tone:** Precise, actionable.
**Voice:** Declarative — state the fact, identify the artifact, reference the ID.
**Avoid:** Vague blame ("someone edited it wrong"), emotional language, speculation.

**Correct:** `Stage 4 exit gate FAIL: BR-007 missing TESTABLE CONDITION field.`
**Incorrect:** `The BA didn't do a good job on the requirements.`

Every failure description must identify: the stage, the artifact or record, and the specific missing or incorrect element.

---

## 6. Skill File Summaries (When to Use)

**Tone:** Concise, purposeful.
**Voice:** Third person — "this skill", "the agent".
**Avoid:** First person, marketing language, scope beyond the stage.

**Correct:** `This skill encodes the domain knowledge for Stage 4 business requirements.`
**Incorrect:** `I will help you write great business requirements that everyone will love!`

---

## 7. Agent Role Descriptions

**Tone:** Specialist, bounded.
**Voice:** Third person — name the role, describe what it does, state what it does not do.
**Avoid:** Generalist framing ("handles whatever is needed"), scope creep.

**Correct:** `The Architect selects technology and makes architecture decisions per business requirements. The Architect does not write code or design UI.`
**Incorrect:** `The Architect can help with many things including design, code, and architecture.`

---

## 8. Audit Entries

**Tone:** Factual, traceable.
**Voice:** Passive or declarative — describe the observed state, not the intention behind it.
**Avoid:** Speculation, interpretation, moral judgement.

**Correct:** `Stage 5 artifact \`5-ARCHITECTURE-RECOMMENDATIONS.md\` modified by a non-owning agent.`
**Incorrect:** `Someone deliberately tried to bypass the pipeline rules in Stage 5.`

Every audit entry must include: stage, artifact, specific evidence, severity, and status.

---

## 9. Release Notes Entries

**Tone:** Informative, complete.
**Voice:** Past tense declarative.
**Avoid:** Future tense, incomplete file references, vague summaries.

**Correct:** `Implemented DI-003 through DI-008. Added 13 agent files to \`./build/.github/agents/\`.`
**Incorrect:** `Added some agent files and skills.`

Release notes entries are append-only. Never edit a prior entry.

---

## ID Reference Format

When referencing pipeline artifact IDs in any text:
- Use the canonical prefix-and-number format: `UC-001`, `BR-007`, `DI-011`.
- Wrap in backticks when inline in Markdown prose.
- In table cells, no backticks needed.
- Never abbreviate or paraphrase an ID — use the exact assigned ID.
