# GitHub Copilot Workspace Instructions

This repository is a multi-project software factory. Keep pipeline governance in one place: `.github/instructions/pipeline.instructions.md`.

## Default Operating Order

For product work under `PROJECTS/<APP>/`:
1. Read `.github/instructions/pipeline.instructions.md` first.
2. Change into `PROJECTS/<APP>/` and treat it as the active project root.
3. Load the stage-appropriate skill from `.github/skills/`.
4. Follow the relevant agent and hook rules under `.github/agents/` and `.github/hooks/`.

## Source Of Truth Rule

Do not restate, fork, or override pipeline policy here. Stage order, ownership, artifact mapping, quality gates, and rerun behavior belong in `.github/instructions/pipeline.instructions.md`.

## Non-Pipeline Repo Work

When working on `.github/` customization files, use the appropriate customization workflow for instructions, skills, prompts, agents, and hooks instead of forcing pipeline-stage behavior onto repository-maintenance tasks.

## General Expectations

1. Prefer minimal, stage-correct changes over broad rewrites.
2. Keep paths repository-relative from the active project folder.
3. Preserve existing project structure unless the active design or stage artifact requires a change.
4. For implementation changes, update the project-local release notes and preserve append-only verification history.
