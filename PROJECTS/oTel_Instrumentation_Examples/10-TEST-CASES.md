# Test Cases — Performance Architecture OTel Cookbook

Authored at Stage 10 (Tester) before any execution. One T record per use case; the BR coverage matrix from `4-REQUIREMENTS.md` is preserved by listing the BRs each test case verifies.

Test report identifier: **T-PIPELINE-OTEL-003**

---

## TC-001 · Home page — topic hub grid

**BRs covered:** BR-001, BR-002, BR-003, BR-007, BR-008

**Precondition:** Site built (`npm run build`), served at `http://localhost:8080`.

**Steps:**
1. Navigate to `http://localhost:8080/`.
2. Verify page title contains "Performance Architecture OTel Cookbook".
3. Verify ten topic cards are visible on the page.
4. Verify each card links to the correct topic URL (`/quickstart/`, `/traces/`, etc.).
5. Verify no language-selection UI (language tiles) is present on the home page.

**Pass criteria:** All 10 topic cards present with correct hrefs; title matches; no language tile grid.

---

## TC-002 · Topic navigation sidebar

**BRs covered:** BR-008, BR-009, BR-010, BR-011, BR-012

**Precondition:** Same as TC-001.

**Steps:**
1. Navigate to `/quickstart/`.
2. Verify the sidebar navigation lists all 10 topics.
3. Verify the Quickstart link is marked `aria-current="page"`.
4. Click "Traces" in the sidebar.
5. Verify navigation to `/traces/` succeeds.

**Pass criteria:** 10 nav items; active item has `aria-current="page"`; navigation works.

---

## TC-003 · Language tab rendering

**BRs covered:** BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019

**Precondition:** Same as TC-001, JavaScript enabled.

**Steps:**
1. Navigate to `/quickstart/`.
2. Verify a tab list is visible with exactly 4 tabs: JavaScript, Python, .NET, Java.
3. Verify the JavaScript tab is selected by default (aria-selected="true").
4. Verify only the JavaScript panel is visible; other panels are hidden.
5. Click the Python tab.
6. Verify the Python panel becomes visible and JS panel hides.
7. Verify `aria-selected` updates correctly.

**Pass criteria:** Tab list with 4 tabs; correct default; panels toggle on click; aria state correct.

---

## TC-004 · Tab language persistence

**BRs covered:** BR-013, BR-019

**Precondition:** Same as TC-001.

**Steps:**
1. Navigate to `/quickstart/`.
2. Click the ".NET" tab.
3. Navigate to `/traces/`.
4. Verify the .NET tab is pre-selected on the Traces page.

**Pass criteria:** Selected language persists across page navigation via `localStorage`.

---

## TC-005 · Export target config panel — preset labels

**BRs covered:** BR-020, BR-021, BR-022, BR-023, BR-024

**Precondition:** Same as TC-001.

**Steps:**
1. Navigate to `/quickstart/`.
2. Click the "cfg ⚙" button to open the configuration panel.
3. Verify three preset options: "Direct OTLP (HTTP) — no Collector", "Dynatrace", "Local OTel Collector (optional)".
4. Verify "Direct OTLP (HTTP) — no Collector" is selected by default.
5. Verify the OTLP endpoint field is visible.
6. Select "Dynatrace"; verify endpoint field is hidden, tenant URL and API token fields appear.
7. Select "Local OTel Collector (optional)"; verify endpoint field reappears.

**Pass criteria:** All three preset labels correct; field visibility matches preset; default is Direct OTLP.

---

## TC-006 · No-JS fallback

**BRs covered:** BR-013, BR-018

**Precondition:** Same as TC-001 but JavaScript disabled.

**Steps:**
1. Navigate to `/quickstart/` with JavaScript disabled.
2. Verify all language panels (JS, Python, .NET, Java) are visible stacked vertically.
3. Verify no tab button row is rendered.

**Pass criteria:** All panels visible; no tab list; content accessible without JS.

---

## TC-007 · Quickstart sample parity

**BRs covered:** BR-059, BR-060, BR-061, BR-062

**Precondition:** Build environment with Node.js.

**Steps:**
1. Run `node scripts/check-sample-parity.mjs` from the `build/` directory.
2. Verify exit code is 0.
3. Verify output reports at least 1 sample matched.

**Pass criteria:** Exit 0; no failures reported.

---

## TC-008 · All ten topic pages load without error

**BRs covered:** BR-030–BR-054

**Precondition:** Same as TC-001.

**Steps:**
1. Navigate to each of the 10 topic URLs: `/quickstart/`, `/traces/`, `/metrics/`, `/logs/`, `/auto/`, `/resource-attributes/`, `/sampling/`, `/semantic-conventions-http/`, `/batching/`, `/troubleshooting/`.
2. Verify HTTP 200 for each.
3. Verify `<h1>` text matches the topic title.
4. Verify at least one tab panel is visible on each page.

**Pass criteria:** All 10 pages return 200; h1 titles correct; tab panels present.

---

## TC-009 · Collector optional labelling

**BRs covered:** BR-025, BR-026, BR-027

**Precondition:** Same as TC-001.

**Steps:**
1. Open the configuration panel.
2. Verify the third preset card contains the word "optional".
3. Verify no page copy states that a Collector is required.

**Pass criteria:** "optional" present on Collector preset card.

---

## TC-010 · Release notes page

**BRs covered:** BR-047, BR-048

**Precondition:** Same as TC-001.

**Steps:**
1. Navigate to `/release-notes/`.
2. Verify the page loads with HTTP 200.
3. Verify release notes contain at least the RN-001 or RN-002 entry.

**Pass criteria:** Page loads; content visible.
