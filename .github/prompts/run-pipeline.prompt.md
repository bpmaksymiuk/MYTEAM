---
description: Run the full 6-stage software factory pipeline for a project. Invokes all agents in order: Business Analyst → Architect → Technical Lead → Developer → Tester. Use when starting a new feature, updating requirements, or doing a full pipeline run from scratch.
---

# Run Full Pipeline

Run all 6 pipeline stages in order for the project: **${input:app:Project name (folder under PROJECTS/)}**

Work in `PROJECTS/${input:app}` as the repository root. Read `.github/instructions/pipeline.instructions.md` first — it is the source of truth for all stage rules, responsibilities, artifact ownership, and exit gates. Then load the stage-appropriate artifact skill from `.github/skills/`.

Use Stage 1 use cases as the approved source of intent. Invoke each downstream role in order, and do not start the next stage until the prior stage passes its exit gate:

1. `(Business Analyst)` — Stage 2
2. `(Architect)` — Stage 3
3. `(Technical Lead)` — Stage 4
4. `(Developer)` — Stage 5
5. `(Tester)` — Stage 6

If any stage fails, route the work through the Manager workflow and rerun only from the failed owning stage forward.
