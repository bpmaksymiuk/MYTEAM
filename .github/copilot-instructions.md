# GitHub Copilot Workspace Instructions

## Workspace Overview

This is a **multi-project software factory** that converts business intent into verified browser software through a strict, agent-driven pipeline. All projects live under `PROJECTS/` and share the same pipeline definition, agents, and quality gates.

## Repository Structure

```
.github/
  instructions/
    pipeline.instructions.md  ← Pipeline definition and processing rules (source of truth)
  agents/                   ← Custom agent definitions (.agent.md) for each pipeline stage
  copilot-instructions.md   ← This file
PROJECTS/
  <APP>/                    ← One folder per product (browser app, Chrome extension, game, etc.)
resources/                  ← Shared static assets (images, audio, etc.)
```

## The Pipeline

Every project follows the same 6-stage pipeline defined in `.github/instructions/pipeline.instructions.md`:

| Stage | Agent | Artifact |
|-------|-------|----------|
| 1 | User | `1-USE-CASES.md` |
| 2 | Business Analyst | `2-REQUIREMENTS.md` |
| 3 | Architect | `3-ARCHITECTURE-RECOMMENDATIONS.md`, `3-PARTS LIST.md` |
| 4 | Technical Lead | `4-DESIGN-INSTRUCTIONS.md` |
| 5 | Developer | `./build/` + `5-RELEASE-NOTES.md` |
| 6 | Tester | `6-TEST-REPORT.md`, `7-BUG-REPORT.md` |

- **Always read `pipeline.instructions.md`** before acting in any pipeline role — it is the canonical source for processing rules, artifact schemas, and exit gates.
- **Set working directory** to `PROJECTS/<APP>` before any pipeline operation. Use repository-relative paths in all artifacts (e.g., `./build`, not `/home/danio/...`).
- **Never skip stages.** Each stage output is the required input for the next. Resolve ambiguity before coding.

## Agent Roles

Invoke agents by name. Each agent owns one stage:

| Invoke | Role | Stage |
|--------|------|-------|
| `@Business Analyst` | BA | 2 |
| `@Architect` | Architect | 3 |
| `@Technical Lead` | TL | 4 |
| `@Developer` | Developer | 5 |
| `@Tester` | Tester | 6 |
| `@Manager` | Manager | Gate failure loop |

All agents self-identify with a role prefix in chat: `(Tester) ...`, `(Developer) ...`, etc.

## Project Conventions

### Build Output
- All source code goes under `./build/` within the project folder.
- Chrome extensions: `./build/extension/` (manifest.json, background.js, app.js, etc.)
- Browser games: `./build/` or `./build/www/`

### Testing
- Playwright 1.59.1 at `/tmp/node_modules/playwright/index.mjs`
- Tests run with a **visible browser** (`headless: false`, `DISPLAY=:0`)
- Pipeline scripts: `<project>_test_pipeline<NNN>.mjs` saved in the project folder
- Screenshots: `testresults/T-PIPELINE-<PROJECT>-<NNN>/`
- Results JSON: `testresults/T-PIPELINE-<PROJECT>-<NNN>/results.json`
- HTTP serve for extension testing: `python3 -m http.server <PORT> --directory ./build/extension/`

### Bug IDs
Format: `BUG-<PROJECTABBR>-<NNN>` — abbreviation is 2–3 letters derived from the project name

### Artifact IDs
IDs are sequential and never reused: `UC-XXX`, `BR-XXX`, `AR-XXX`, `PT-XXX`, `DI-XXX`, `BUG-XXX`, `T-PIPELINE-XXX`

### Version / Release Notes
Every code change (including bug fixes) appends a new entry to `5-RELEASE-NOTES.md` at the top, with a microversion increment.

## Communication Rules

- Always respond in the role currently active: `(Developer) I will...`
- Role label must change when execution moves to a new stage.
- In full pipeline runs, every stage owner must produce at least one visible message in execution order.

## Key Files To Read First

When starting work on a project, read in this order:
1. `.github/instructions/pipeline.instructions.md` — pipeline rules
2. `PROJECTS/<APP>/1-USE-CASES.md` — business intent
3. `PROJECTS/<APP>/5-RELEASE-NOTES.md` — what's been built
4. `PROJECTS/<APP>/6-TEST-REPORT.md` — test history
