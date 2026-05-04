# Bug Report — oTel Instrumentation Examples

Append-only. One BUG record per distinct failure root cause; multiple T-IDs may map to the same BUG.

---

## BUG-001 : Eleventy build fails — unescaped `{{` in troubleshooting index breaks Nunjucks parser

- **SEVERITY:** Critical
- **STAGE:** Stage 9 — Developer
- **DESCRIPTION:** Running `npm run build` from `./build/` fails with the following Nunjucks parser error:

  ```
  [11ty] Problem writing Eleventy templates:
  [11ty] 1. Having trouble rendering njk template ./src/troubleshooting/index.md (via TemplateContentRenderError)
  [11ty] 2. (./src/troubleshooting/index.md) [Line 57, Column 33]
  [11ty]   expected variable end (via Template render error)
  ```

  The same error blocks `npm run dev`, which means the Playwright `webServer` cannot start either. Captured evidence: `tests/results/build-error.txt`, `tests/results/playwright-run.txt`. As a result, no page in the site can be served, and every browser-based test case (T-001 through T-012) is BLOCKED.

  The sample-parity build gate (`node scripts/check-sample-parity.mjs`) passes cleanly — `✓ 4 sample(s) match their recipes` — so the defect is isolated to template authoring.

- **ROOT CAUSE:** `./build/src/troubleshooting/index.md` line 62 (Eleventy reports line 57 for the post-frontmatter offset) contains a heading with the literal token sequence:

  ```
  ### Value contains literal `{{` placeholder
  ```

  Markdown templating defaults to Nunjucks (`htmlTemplateEngine: 'njk'`, `markdownTemplateEngine: 'njk'`), and Nunjucks treats `{{` as the start of a variable expression. The literal `{{` inside the inline-code span is consumed by the Nunjucks parser before markdown-it ever sees it, and the parser fails because no matching `}}` closes a variable expression.

- **FIX APPLIED:** RN-002 v0.1.1 — added `templateEngineOverride: md` to `./build/src/troubleshooting/index.md` frontmatter. Eleventy build now exits 0; dev server starts on `http://localhost:8080/`; all 11 Playwright specs pass (T-PIPELINE-OTEL-002).

- **RELATED:** T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011, T-012 (all BLOCKED on the build); UC-001..UC-012 (none can be observably verified until the site builds); BR-001..BR-064 (browser-side verification deferred).

- **STATUS:** Verified

---

## BUG-002 : Java sigil colour reuses Dynatrace cyan — visual destination-neutrality concern

- **SEVERITY:** Low
- **STAGE:** Stage 8 — Graphic Artist (Stage 5 may also apply if a colour-token decision is required at the architecture layer)
- **DESCRIPTION:** Open item carried forward from `X-Journal.md` JN-021. The Java language sigil SVG (`./build/images/sigil-java.svg`, GA-008) reuses the Dynatrace cyan token `#1496ff`. The narrative-vision (Stage 2) and use-case set (UC-001 AC2; BR-004) require Dynatrace to be presented as one supported destination, not the required one. Reusing the Dynatrace brand colour for a language sigil weakens that visual neutrality — a casual reader could plausibly misread the cyan glyph as a Dynatrace affiliation marker.
- **ROOT CAUSE:** `./build/images/sigil-java.svg` uses fill colour `#1496ff`, which is the same value as the `--dt` design token defined in `./build/src/assets/styles.css`. Stage 6 design instructions did not mandate a specific sigil colour; Stage 8 selected cyan from the palette without disambiguating the brand-vs-language meaning.
- **FIX APPLIED:** Pending. Recommended Developer/Graphic Artist fix: pick a Java sigil colour distinct from `--dt` (for example a warm orange aligned with `--otel`, or a neutral grey from the palette) so that no language tile renders in the Dynatrace brand colour.
- **RELATED:** T-001 (visual-neutrality observation; not a hard FAIL on this run because T-001 is BLOCKED upstream); UC-001, BR-004.
- **STATUS:** Open
