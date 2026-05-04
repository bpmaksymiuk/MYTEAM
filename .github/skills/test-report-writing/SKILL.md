# Test Report Writing — SKILL.md

> Stage 10 (second half) — execute test cases, record evidence, issue release recommendation.

---

## When to Use

Invoke at Stage 10 (Tester) after test execution. Use it when executing formal verification specs and recording the outcome of each test case with evidence-backed results in `10-TEST-REPORT.md`. Every TC must have a corresponding TR; every passing TR must cite observable evidence (screenshot, trace, or assertion output). Use the Playwright helper libraries under `.github/skills/test-report-writing/lib/` for execution and screenshot handling. Do not use headless execution — observable evidence is required.

---

## Target Files

- `10-TEST-REPORT.md`
- `./tests/playwright.config.mjs` (inside `./tests/`, NOT at the project root, NOT inside `./build/`)
- `./tests/specs/**` (Playwright spec files)
- `./tests/package.json` (`@playwright/test` devDependency — installed via `npm install` inside `./tests/`)
- `.github/skills/test-report-writing/lib/**` (Playwright helper libraries)
- `./tests/results/**` (evidence output and screenshots)
- `./tests/test-results/**` (Playwright failure artefacts)

---

## Playwright Library Convention

- Skill-local helper libraries live under `.github/skills/test-report-writing/lib/`.
- Test execution and screenshot collection at Stage 10 must use these helpers.
- Helpers may be extended, but existing helper interfaces should remain backward compatible for prior specs.

### Spec file conventions

All Playwright test artefacts live under `./tests/` (project root). Nothing test-related goes inside `./build/`.

```
PROJECTS/<APP>/
├── tests/
│   ├── package.json          ← { devDependencies: { "@playwright/test": "^1.x" } }
│   ├── package-lock.json
│   ├── playwright.config.mjs ← config lives here
│   ├── specs/                ← spec files live here
│   │   └── *.spec.mjs
│   ├── results/              ← evidence files (screenshots, .txt)
│   └── test-results/         ← Playwright failure artefacts
└── build/                    ← app source only
```

Tests are run from `./tests/`:

```
cd PROJECTS/<APP>/tests
npx playwright test --config=playwright.config.mjs --headed
```

Or from the project root:
```
npm --prefix tests test
```

Within each spec file (at `tests/specs/`):
```js
// evidence-helper import — 4 levels up from tests/specs/ to the MYTEAM workspace root
import { ensureResultsDir, writeEvidence } from '../../../../.github/skills/test-report-writing/lib/evidence-helper.mjs';

// evidence output dir — sibling of specs/ inside tests/
const RESULTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../results');
```

`playwright.config.mjs` settings (inside `tests/`):
```js
testDir: './specs',
outputDir: './test-results',
reporter: [['list'], ['json', { outputFile: './results/playwright-report.json' }]],
webServer: { command: 'npm --prefix ../build run dev', url: 'http://localhost:5173', ... },
```

`@playwright/test` is installed in `./tests/node_modules/` — **not** at the project root and **not** inside `./build/`.

---

## Report Structure

```markdown
# T-PIPELINE-<APP>-<NNN> — Test Report

- **Run ID:** T-PIPELINE-<APP>-<NNN>
- **Date:** YYYY-MM-DD
- **Product:** <product name>
- **Build Path:** ./build/

## Results

| T-ID | Description | Result | Evidence |
|------|-------------|--------|----------|
| T-001 | Test case name | PASS / FAIL | Screenshot filename or inline note |

## Summary

- **Total:** N
- **Pass:** N
- **Fail:** N

## Recommendation

**PASS** / **FAIL** / **CONDITIONAL PASS**

> Justification: one paragraph explaining the recommendation based on the results above.

## Evidence

### T-XXX — [brief title]
[Screenshot or output snippet. For FAIL: include exact error message or observed behaviour.]
```

---

## Procedure

1. Read `.github/instructions/pipeline.instructions.md`.
2. Read `10-TEST-CASES.md` in full.
3. Load Playwright helper libraries from `.github/skills/test-report-writing/lib/`.
4. Execute formal verification specs in a visible browser using Playwright.
5. Open the product in a **visible browser** when manual corroboration is needed.
6. Execute each test case in T-ID order:
   a. Follow the STEPS exactly as written.
   b. Record the actual result (PASS or FAIL).
   c. Capture screenshots via Playwright helpers in `.github/skills/test-report-writing/lib/` and store them under `./tests/results/` (never inside `./build/`).
   d. For FAIL: record the exact observed behaviour vs the expected result.
7. Populate the Results table and Summary counts.
8. Write the Recommendation with a clear justification:
   - **PASS:** All test cases passed.
   - **FAIL:** One or more critical test cases failed.
   - **CONDITIONAL PASS:** Minor failures noted; recommend fix before next release.
9. Attach evidence for every FAIL entry.
10. Assign a unique Run ID: `T-PIPELINE-<APP>-<NNN>` (increment NNN from prior runs).
11. Append the report below any prior test reports — do not overwrite.
12. Validate against the exit gate.
13. **Stop. State `GATE 10: PASS` or `GATE 10: FAIL` before taking any further pipeline action.**

---

## Exit Gate

- [ ] All test cases in `10-TEST-CASES.md` have been executed.
- [ ] Every T-ID appears in the Results table.
- [ ] Every FAIL entry has concrete evidence (screenshot or error log excerpt).
- [ ] Playwright execution and screenshot capture used helper libraries under `.github/skills/test-report-writing/lib/`.
- [ ] A Recommendation (PASS / FAIL / CONDITIONAL PASS) has been issued with written justification.
- [ ] A unique Run ID has been assigned.
- [ ] No prior test report entries have been modified or deleted.
- [ ] `PIPELINE-STATUS.md` is updated for Stage 10 with STATUS and STATUS UPDATED date.
