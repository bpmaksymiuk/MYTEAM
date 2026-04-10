# .github Directory Guide

This directory contains the shared GitHub Copilot customization and pipeline-governance assets for the repository.

## Layout

| Path | Purpose |
|------|---------|
| `copilot-instructions.md` | Workspace-level router that points product work to the pipeline source of truth |
| `instructions/pipeline.instructions.md` | Canonical pipeline policy for product work under `PROJECTS/**` |
| `prompts/run-pipeline.prompt.md` | Entry prompt for running the full stage pipeline for one project |
| `agents/*.agent.md` | Stage-specific agents used during pipeline execution |
| `hooks/*.json` | Hook registrations that inject or enforce repository rules |
| `hooks/*.sh` | Shell scripts called by hooks |
| `skills/*/SKILL.md` | Artifact and stage workflows referenced by the pipeline |

## Operating Model

For product work under `PROJECTS/<APP>/`:
1. Read `instructions/pipeline.instructions.md` first.
2. Change into `PROJECTS/<APP>/`.
3. Load the stage skill referenced by the pipeline.
4. Use the matching stage agent when running a full pipeline flow.

For `.github/` maintenance work:
1. Treat this directory as customization infrastructure, not a product pipeline artifact.
2. Prefer concise agent files and place detailed workflow logic in skills.
3. Keep hooks deterministic and keep shell logic readable.

## Agents

The agent files define role, tool access, and stage-entry requirements.

Current stage agents:
- `agents/business-analyst.agent.md`
- `agents/architect.agent.md`
- `agents/technical-lead.agent.md`
- `agents/developer.agent.md`
- `agents/tester.agent.md`
- `agents/manager.agent.md`

Best-practice rule:
- Keep role files short.
- Put detailed production workflow in `skills/`.
- Do not duplicate communication policy already enforced by hooks.

## Hooks

Hook responsibilities:
- `enforce-document-ownership.json` + `check-document-ownership.sh`: prevent accidental cross-stage document edits
- `enforce-pipeline-source-of-truth.json` + `inject-pipeline-source-of-truth.sh`: remind agents that the pipeline file is canonical for product work
- `enforce-agent-communication-protocol.json` + `inject-agent-communication-protocol.sh`: inject role-label and handoff requirements
- `protect-build-boundary.json` + `check-build-boundary.sh`: warn when implementation code is written outside expected project boundaries

Best-practice rule:
- Keep hook messages focused and deterministic.
- Prefer shell scripts for reusable logic instead of dense inline shell in JSON when complexity grows.

## Skills

Skills hold the detailed procedural guidance for each stage artifact. The pipeline file maps each stage to the correct skill.

Examples:
- use case authoring
- business requirements writing
- architecture and parts authoring
- design instructions authoring
- implementation stage
- release notes writing
- test report writing
- bug report writing
- manager pipeline orchestration

## Notes

- This directory currently contains no GitHub Actions workflows.
- If workflows are added later, document them here and keep naming consistent with their trigger and purpose.