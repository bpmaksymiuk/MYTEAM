---
description: Run the full software-factory pipeline for one project folder and enforce stage gates from Stage 2 through Stage 10.
---

# Run Full Pipeline

Run all 9 pipeline stages in order for the project: **${input:app:Project name (folder under PROJECTS/)}**

Work in `PROJECTS/${input:app}` as the repository root. Read `.github/instructions/pipeline.instructions.md` first — it is the source of truth for all stage rules, responsibilities, artifact ownership, and exit gates. Then load the stage-appropriate artifact skill from `.github/skills/`.

Use Stage 1 use cases as the approved source of intent. Run downstream stages in order, and do not start a stage until the previous stage passes AND the Auditor signs off:

1. `![Writer](.github/agents/writer.png) (Writer)` via `.github/agents/writer.agent.md` — Stage 2
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 2
2. `![Graphic Artist](.github/agents/graphic-artist.png) (Graphic Artist)` via `.github/agents/graphic-artist.agent.md` — Stage 3
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 3
3. `![Business Analyst](.github/agents/business-analyst.png) (Business Analyst)` via `.github/agents/business-analyst.agent.md` — Stage 4
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 4
4. `![Architect](.github/agents/architect.png) (Architect)` via `.github/agents/architect.agent.md` — Stage 5
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 5
5. `![Technical Lead](.github/agents/technical-lead.png) (Technical Lead)` via `.github/agents/technical-lead.agent.md` — Stage 6
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 6
6. `![Writer](.github/agents/writer.png) (Writer)` via `.github/agents/writer.agent.md` — Stage 7
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 7
7. `![Graphic Artist](.github/agents/graphic-artist.png) (Graphic Artist)` via `.github/agents/graphic-artist.agent.md` — Stage 8
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 8
8. `![Developer](.github/agents/developer.png) (Developer)` via `.github/agents/developer.agent.md` — Stage 9
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 9
9. `![Tester](.github/agents/tester.png) (Tester)` via `.github/agents/tester.agent.md` — Stage 10
   - `![Auditor](.github/agents/auditor.agent.md) (Auditor)` — Audit Stage 10

If any stage fails, route through the Manager workflow and rerun from the failed owning stage forward.
