# Manager Rerun Templates

Use these templates as starting points. Replace placeholders with concrete stage names, artifact names, failed gate items, and project-specific details.

## Failed Gate Routing

### Generic Stage Failure
```markdown
(Manager) Routing back to Stage <N> <Owner> due to failed <stage name> gate: <failed gate item>. Downstream stages are blocked until <artifact> is corrected and passes its exit gate.
```

### Missing Artifact
```markdown
(Manager) Stage <N> cannot be accepted as complete. <artifact> was not created or was not written successfully. Routing back to Stage <N> <Owner> to create or update the artifact on disk before any downstream rerun.
```

### Incomplete Artifact
```markdown
(Manager) Routing back to Stage <N> <Owner> because <artifact> is incomplete: <specific missing field, schema issue, or traceability gap>. Do not continue downstream until this gate item is repaired.
```

## Common Routing Cases

### Stage 2 Requirement Failure
```markdown
(Manager) Routing back to Stage 2 Business Analyst due to failed requirements gate: <BR issue>. Stage 3 and later must be re-run after 2-REQUIREMENTS.md passes.
```

### Stage 3 Architecture Failure
```markdown
(Manager) Routing back to Stage 3 Architect due to failed architecture gate: <AR/PT issue>. Stage 4 through Stage 6 are blocked until 3-ARCHITECTURE-RECOMMENDATIONS.md and 3-PARTS LIST.md pass together.
```

### Stage 4 Design Failure
```markdown
(Manager) Routing back to Stage 4 Technical Lead due to failed design gate: <DI issue>. Developer implementation must wait until 4-DESIGN-INSTRUCTIONS.md is implementation-ready.
```

### Stage 5 Implementation Failure
```markdown
(Manager) Routing back to Stage 5 Developer due to failed implementation gate: <build, traceability, or release-note issue>. Stage 6 verification is blocked until the build and release notes pass together.
```

### Stage 6 Verification Failure
```markdown
(Manager) Stage 6 did not pass: <test report issue, open bug, or missing evidence>. Routing back to the owning stage for the failed artifact or unresolved defect, then Stage 6 must be re-run.
```

## Downstream Rerun Announcements

### Artifact Ready For Next Stage
```markdown
(Manager) Stage <N> complete. <artifact> is ready for Stage <N+1> <Owner>.
```

### Full Downstream Cascade
```markdown
(Manager) The repaired Stage <N> artifact now passes its gate. Re-running downstream stages in order: <Stage N+1>, <Stage N+2>, <Stage N+3>.
```

## Full Pipeline Handoffs

### Starting Full Run
```markdown
(Manager) Starting the pipeline from the approved Stage 1 use cases. Each stage must load its artifact skill, pass its exit gate, and hand off in execution order.
```

### Visible Role Order Reminder
```markdown
(Manager) Full pipeline communication must stay in execution order: Business Analyst, Architect, Technical Lead, Developer, Tester, then Manager.
```

## Completion States

### Pipeline Pass
```markdown
(Manager) All stage gates pass. Traceability is intact from use case to test evidence, and 6-TEST-REPORT.md records PASS PIPELINE.
```

### Pipeline Still Blocked
```markdown
(Manager) The pipeline is not complete. The active blocker is Stage <N>: <failed gate item>. No release recommendation is valid until this stage passes and downstream reruns complete.
```

## Usage Notes
- Name the exact failed gate item whenever possible.
- Name the owning stage explicitly.
- State which downstream stages are blocked or must be re-run.
- Avoid vague phrases such as "there are issues" when a concrete gate item is known.