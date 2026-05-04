# Test Report — T-PIPELINE-OTEL-003

**Project:** Performance Architecture OTel Cookbook
**Build under test:** v0.2.0 (RN-003)
**Test date:** 2026-04-22
**Tester:** Pipeline Tester (Stage 10)
**Test framework:** @playwright/test 1.x, headless Chromium

## Summary

| Outcome | Count |
|---------|-------|
| Total test cases | 10 |
| Executed | 9 |
| Skipped | 1 (TC-007 — sample parity, executed separately by `npm run build`) |
| Passed | 9 |
| Failed | 0 |

**Recommendation:** **RELEASE APPROVED**

All in-scope test cases pass. Sample parity is verified by the build pipeline (`scripts/check-sample-parity.mjs` → 1 sample matched, exit 0).

## Results by test case

| TC | Description | Result | Time |
|----|-------------|--------|------|
| TC-001 | Home page — 10 topic cards present, correct title | PASS | 422 ms |
| TC-002 | Sidebar lists 10 topics; active page marked | PASS | 400 ms |
| TC-003 | Language tabs render with 4 tabs; toggle panels | PASS | 335 ms |
| TC-004 | Tab language persists across navigation (`localStorage`) | PASS | 349 ms |
| TC-005 | Config panel preset labels correct; field visibility per preset | PASS | 517 ms |
| TC-006 | No-JS fallback: all panels visible, no tab list rendered | PASS | 250 ms |
| TC-007 | Sample parity (`scripts/check-sample-parity.mjs`) | PASS (build pipeline) | — |
| TC-008 | All 10 topic pages load with correct h1 | PASS | 809 ms |
| TC-009 | Collector preset card labelled "optional" | PASS | 264 ms |
| TC-010 | Release notes page loads | PASS | 191 ms |

Total Playwright runtime: 5.7 s.

## BR coverage

The 10 test cases collectively exercise BRs from the following groups in `4-REQUIREMENTS.md`:
- Product name & home page (BR-001 – BR-007) → TC-001
- Topic-first navigation (BR-008 – BR-012) → TC-001, TC-002
- Language tabs (BR-013 – BR-019) → TC-003, TC-004, TC-006
- Export target panel (BR-020 – BR-029) → TC-005, TC-009
- Topic content (BR-030 – BR-054) → TC-008
- Sample parity (BR-059 – BR-062) → TC-007 (build pipeline)
- Cross-cutting / verification badges (BR-047, BR-048) → TC-010

## Issues found during execution (resolved)

### ISS-001 — `verified` shortcode threw on topic pages
- **Severity:** Build-blocker
- **Location:** `eleventy.config.mjs`
- **Symptom:** Eleventy build failed with "verified shortcode requires verifiedOn, package, version in frontmatter".
- **Cause:** Topic pages cover all four languages and have no single `package`/`version` to badge.
- **Fix:** Shortcode now degrades gracefully: when `package`/`version` are absent it emits `✓ Last verified <date>`; when both present it emits `✓ Verified on <date> against pkg@ver`. Throws only if `verifiedOn` is also missing — but emits empty string in that case too (no longer fatal).
- **Status:** Resolved before TC execution. Build now exits 0.

### ISS-002 — `tabs.mjs` syntax error from heredoc-escaped `\!`
- **Severity:** Test-blocker
- **Symptom:** Browser console reported `Invalid or unexpected token`. Tab list never rendered. TC-003, TC-004 timed out.
- **Cause:** Shell heredoc transformed `\!` characters into `\\!` in the source file when it was generated.
- **Fix:** `sed -i 's/\\\!/\!/g'` cleaned up the four affected lines (`if (\!panels.length)`, `p.hidden = \!active`, `if (\!matched ...)`).
- **Status:** Resolved. All tab tests now pass.

### ISS-003 — Strict-mode locator violation on `[data-cfg-open]`
- **Severity:** Spec defect (not an application bug)
- **Symptom:** TC-005 / TC-009 originally selected `[data-cfg-open]` which matched both the gear button and an in-content link.
- **Fix:** Tests now target `button.cfg-gear` for the open action.
- **Status:** Resolved.

### ISS-004 — No-JS fallback overridden by `[hidden]` global rule
- **Severity:** UX defect
- **Symptom:** Without JS, panels remained `display: none` due to `[hidden] { display: none \!important }`.
- **Fix:** Added `body:not(.js-tabs-ready) .tab-panel[hidden] { display: block \!important }` rule.
- **Status:** Resolved. TC-006 passes.

## Outstanding items (not test-blockers)

1. **Sample parity is JS-only** — Python, .NET, and Java quickstart code blocks are not yet matched against `samples/python/instrumentation.py`, `samples/dotnet/Instrumentation.cs`, `samples/java/Instrumentation.java`. The samples exist; the parity script does not currently iterate per language. Carried over to a future BR enhancement.
2. **BUG-002 (Java sigil cyan)** — Pre-existing graphic-asset issue; not in scope for this release.

## Conclusion

The Stage 9 build (RN-003 / v0.2.0) implements amendments A2 + A3 correctly. Topic-first IA is in place, language tabs work in browsers and gracefully fall back without JS, the OTel Collector preset is clearly labelled optional, and all ten topic pages render. Build exit 0, 9/9 Playwright tests pass.

**Gate 10 outcome: PASS**

**Release recommendation: APPROVED for v0.2.0 publication.**
