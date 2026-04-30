# Manager Pipeline Orchestration — SKILL.md

> Cross-cutting role — gate failure detection, routing, and pipeline recovery.

---

## When to Use

Whenever any stage fails its exit gate, whenever an Auditor flags a blocking violation, or whenever the pipeline needs to be re-triggered after a recovery. The Manager does not run at a fixed stage — it activates on demand.

---

## Target Files

- Session log (informal — not a pipeline artifact owned by any stage)

---

## Procedure

Follow the Gate Failure Loop below. Activate on demand only — not on a fixed stage cadence.

## Gate Failure Loop

1. **Detect failure.** Receive the failure signal: an agent self-reports an exit gate FAIL, a stage artifact is missing or invalid, or the Auditor flags a blocking violation.
2. **Identify ownership.** Determine which artifact failed and which stage owns it. Consult the Pipeline Stages table in `pipeline.instructions.md`.
3. **Write a failure description.** Produce a specific, actionable description of what failed and why. Vague descriptions ("it didn't work") are not acceptable. Include: the artifact name, the specific failing criterion, and the expected vs observed state.
4. **Route to owning stage.** Direct the owning stage's agent to re-run with the failure description. Do not attempt to fix the artifact yourself.
5. **Wait for re-run.** Monitor the re-run. Do not proceed to downstream stages until the exit gate is PASS. Do not apply time pressure that causes the agent to skip quality checks.
6. **Trigger downstream.** After a confirmed PASS, trigger all downstream stages in order, starting from the stage immediately after the recovered stage.
7. **Log the recovery.** Record in the session log: stage that failed, failure description, routing action, re-run result, recovery confirmation, and downstream re-run sequence.

---

## Explicit Prohibitions

- Do not edit any stage-owned artifact directly.
- Do not skip the re-run of any downstream stage after a recovery.
- Do not close a failure record without a confirmed PASS from the owning stage.
- Do not merge multiple failure loops — resolve one failure completely before addressing another.
- Do not accept a partial fix — the exit gate must fully pass, not just the failing criterion.

---

## Exit Gate

- [ ] No open failure records remain unresolved.
- [ ] Every failure record has a documented routing action and a confirmed PASS outcome.
- [ ] All downstream stages were re-run in order after each recovery.
- [ ] Pipeline is at PASS on all stage exit gates before the Manager session closes.
