# MT2 Pipeline — Getting Started

## What is MT2?

MT2 is a second-generation software factory pipeline delivered as a self-contained set of Markdown files. Install it into any project repository and it gives you a structured, agent-driven workflow that takes a raw idea from a user's goal through to verified, released software — with full traceability at every step.

The pipeline does not require any runtime environment, build system, or external service. Every file is plain Markdown, read natively by VS Code Copilot's agent mode.

## How it works

The pipeline runs in 11 ordered stages (0 through 10). Each stage has exactly one owning agent, one set of artifacts it produces, and an exit gate it must pass before the next stage begins.

- **Stage 0–1:** You define what you want to build (use cases).
- **Stage 2–3:** A Writer and Graphic Artist turn your intent into a narrative vision and concept storyboards.
- **Stage 4–6:** A Business Analyst, Architect, and Technical Lead convert the vision into requirements, architecture decisions, and implementation-ready design instructions.
- **Stage 7–8:** A Writer and Graphic Artist produce all text content and final image assets.
- **Stage 9:** A Developer implements the design in `./build/`.
- **Stage 10:** A Tester verifies every use case and business requirement, then issues a release recommendation.

A Manager role handles gate failures and keeps the pipeline moving. An Auditor observes every stage and records rule violations independently.

## Starting a new project

1. Copy `./build/.github/` from MT2 into your new project's `.github/` folder.
2. Create `PROJECTS/<YOUR-APP>/` and write a `goal.md` describing what you want to build.
3. Open the workspace in VS Code with Copilot enabled.
4. Ask the Business Analyst agent to draft use cases from your `goal.md` into `1-USE-CASES-PROPOSED.md`.
5. Review the proposed use cases and promote them to `1-USE-CASES.md` when satisfied.
6. Ask the Manager to run the pipeline from Stage 2.

The pipeline will run stage by stage. You will be asked to review and approve each stage's output before the next stage begins.

## Key files

| File | Purpose |
|------|---------|
| `.github/instructions/pipeline.instructions.md` | Master governance — read this first |
| `.github/agents/*.agent.md` | One agent definition per role |
| `.github/skills/**/SKILL.md` | Domain knowledge for each stage |
| `1-USE-CASES.md` | Your approved intent — the pipeline's single source of truth |
| `X-AUDIT-REPORT.md` | Append-only record of all pipeline rule violations |

## What the pipeline guarantees

- Every artifact traces back to an approved use case.
- No stage begins until the previous stage passes its exit gate.
- Failures are routed back to the owning stage — never silently absorbed.
- All verification evidence is preserved and never overwritten.
