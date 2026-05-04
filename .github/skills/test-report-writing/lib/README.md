# Test Report Playwright Helpers

This directory contains helper libraries used by the Stage 10
`test-report-writing` skill for Playwright execution and screenshot capture.

## Expected Responsibilities

- Standardize screenshot naming by T-ID and timestamp.
- Standardize output location under `./build/tests/results/`.
- Provide shared wrappers so test report evidence is consistent across runs.

## Usage Rule

Formal verification runs at Stage 10 should use helpers from this directory.
Developers may use Playwright for iterative coding in Stage 9, but formal
verification evidence remains Tester-owned.
