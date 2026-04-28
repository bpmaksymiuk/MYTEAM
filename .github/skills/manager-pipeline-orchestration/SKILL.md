---
name: manager-pipeline-orchestration
description: 'Run the Manager gate-failure loop for the software factory pipeline. Use when diagnosing failed stage gates, routing work back to the owning stage, verifying artifacts were actually written, orchestrating downstream reruns, and enforcing visible stage handoffs.'
argument-hint: 'Describe the failed stage, rerun state, or pipeline orchestration task.'
---

# Manager Pipeline Orchestration

## What This Skill Produces
- A controlled rerun plan when a stage gate fails
- Clear routing back to the owning stage only
- Verification that required artifacts were actually created or updated
- Ordered downstream reruns after the repaired stage passes
- Visible execution-order handoffs across stage owners
- Reusable rerun and handoff wording from `./references/manager-rerun-templates.md`

## When to Use
- A pipeline stage reports success but its exit gate did not actually pass
- An artifact is missing, incomplete, or not written to disk
- A downstream stage must be re-run because an upstream artifact changed
- A full pipeline run needs orchestration across all stage owners
- A Manager agent needs to explain why work is being routed back and what happens next

## Decision Points

### 1. Is there a gate failure?
- If no, continue to the next stage in order.
- If yes, stop downstream progression and identify the failed gate item.

### 2. Which stage owns the failure?
- Route only to the stage that owns the failed artifact or gate item.
- Do not skip upstream ownership boundaries.

### 3. Was the artifact actually written?
- If a stage claims success but the artifact does not exist, is incomplete, or was not updated on disk, treat that as a stage failure.
- Route back to the owning stage with an explicit instruction to create or update the artifact properly.

### 4. What must be re-run afterward?
- Once the repaired stage passes, re-run all downstream stages in order.
- Do not rerun unaffected upstream stages unless the source-of-intent changed.

## Procedure
1. Read `.github/instructions/pipeline.instructions.md` first.
2. Confirm the current working directory is `PROJECTS/<APP>`.
3. Identify whether the run is a clean stage progression or a failure-recovery rerun.
4. If a stage failed, name the exact failed gate item and the owning stage.
5. Verify the owning stage's artifact exists, is complete, and was actually written.
6. Route work back only to that owning stage.
7. After the repaired stage passes, orchestrate downstream reruns in execution order.
8. Announce when an artifact is ready for the next stage.
9. Use the pipeline stages table as the authority for ownership routing and completion criteria.

## Communication Requirements
- Use role-labeled phrasing such as `(Manager) Routing back to Stage 5 Architect due to failed architecture gate: missing AR-to-BR traceability.`
- State which stage is being re-run and why.
- Announce when an artifact is ready for the next stage.
- Do not narrate the entire pipeline only as Manager; ensure each stage owner appears in execution order during full runs.
- Reuse and adapt the canned wording in `./references/manager-rerun-templates.md` for common failure and handoff cases.

## Quality Checks
- The failed gate item is named explicitly.
- Work is routed only to the owning stage.
- Missing or unwritten artifacts are treated as failures.
- Downstream reruns happen in order after repair.
- Final completion requires all stage gates plus PASS PIPELINE evidence.

## Reference
- `./references/manager-rerun-templates.md`: canned messages for rerouting, artifact-ready handoffs, and pipeline completion or failure states.

