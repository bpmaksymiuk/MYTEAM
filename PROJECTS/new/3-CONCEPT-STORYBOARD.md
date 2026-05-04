# Concept Storyboard — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Graphic Artist
- **TRACEABILITY:** UC-001 through UC-011

---

## CB-001 : REWRITE WORKSPACE — CORE FLOW

- **SUMMARY:** The primary workspace showing the input area, strategy chips, Rewrite button, and the resulting five output tiles with annotations.
- **FILE:** `./build/concept/cb-001-rewrite-workspace.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** Initial empty state; post-rewrite output state; individual tile focus state.
- **STYLE NOTES:** Dark background (`#0d0f12`), signal green (`#00e5a0`) for active elements and CTA, white text. Single-column layout. Input textarea top half; output tile grid lower half (3×2 or 5×1 for wide viewport). Strategy chips rendered as rounded pill toggles. Output tiles are card-style with subtle border and staggered fade-in animation noted.
- **TRACEABILITY:** UC-001, UC-002, UC-004, UC-005, UC-006.
- **RELATED:** CB-002, CB-003.

---

## CB-002 : STRATEGY SELECTION AND CONTEXT PANEL

- **SUMMARY:** The strategy chip toggle controls and the expandable context/settings panel showing optional input parameters.
- **FILE:** `./build/concept/cb-002-strategy-context-panel.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** Strategy chips default state (all active); chips with some deactivated; context panel expanded with four parameter fields.
- **STYLE NOTES:** Strategy chips use signal green for active state, dark charcoal for inactive. Context panel slides in from the right or expands below the input area without displacing the main layout. Fields: audience (text input), topic category (dropdown), desired tone (radio group), credibility level (dropdown). Gear icon entry point is small and non-intrusive.
- **TRACEABILITY:** UC-002, UC-003.
- **RELATED:** CB-001.

---

## CB-003 : OUTPUT TILE DETAIL — FIDELITY, ANNOTATION, TONE SLIDER

- **SUMMARY:** Close-up of a single output tile showing all interactive elements: rewrite text, strategy label, "why this works" annotation, Meaning Fidelity Score badge, tone slider, and copy button.
- **FILE:** `./build/concept/cb-003-output-tile-detail.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** Output tile default state; tile with fidelity warning (score below 95%); tile in blocked state.
- **STYLE NOTES:** Tile uses a dark card with 1px signal-green border. Strategy label is a small chip top-left. Rewrite text is centre, large and readable. "Why this works" annotation is below in muted grey smaller type. Fidelity score badge bottom-right: green for ≥95%, amber for 90–94%, red with lock icon for blocked state. Tone slider (subtle ↔ aggressive) horizontal below the annotation. Copy button bottom-right, prominent.
- **TRACEABILITY:** UC-004, UC-005, UC-006, UC-009.
- **RELATED:** CB-001.

---

## CB-004 : THREAD COMPOSER

- **SUMMARY:** The thread composer view showing a hook tweet at the top and numbered thread segments below, each draggable and independently regeneratable.
- **FILE:** `./build/concept/cb-004-thread-composer.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** Thread composer entry (auto-triggered by long input); hook tweet panel; thread segment panels (n/total); reorder handles; "copy all" action.
- **STYLE NOTES:** Layout shifts to a vertical stack of tweet cards, each with a drag handle on the left, segment number top-right, text centre, character count bottom-right (amber when approaching 280), regenerate and copy icons bottom-left. Hook tweet card has a distinct accent colour (amber) to differentiate its role. "Copy All" is a sticky bottom action.
- **TRACEABILITY:** UC-007, UC-004.
- **RELATED:** CB-001.

---

## CB-005 : HASHTAG AND TIMING PANEL

- **SUMMARY:** The hashtag and timing recommendations surface that appears contextually beneath an accepted/copied rewrite tile.
- **FILE:** `./build/concept/cb-005-hashtag-timing.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** Post-copy contextual panel; hashtag chips; posting time indicator.
- **STYLE NOTES:** Panel appears as a subtle expansion below the copied tile (not a modal). Hashtag chips are clickable rounded pills; clicking appends to clipboard copy. Posting time shown as a clock icon + time label (e.g. "Best time: 18:00–20:00"). Panel collapses after 8 seconds or on next interaction.
- **TRACEABILITY:** UC-008.
- **RELATED:** CB-001, CB-003.

---

## CB-006 : REWRITE HISTORY PANEL

- **SUMMARY:** The slide-in history panel showing past rewrite sessions, with search, restore, and direct-copy actions.
- **FILE:** `./build/concept/cb-006-history-panel.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** History panel closed (clock icon entry); panel open (list view); session detail expand; search active state; unauthenticated prompt.
- **STYLE NOTES:** Panel slides in from the right edge, 360px wide, without replacing the Workspace. Session list items show truncated input text (100 chars), date, and a restore icon. Active search highlights matching text. Unauthenticated state shows a blurred/locked list with "Sign in to access history" message.
- **TRACEABILITY:** UC-010.
- **RELATED:** CB-001.

---

## CB-007 : TIER STATUS AND UPGRADE FLOW

- **SUMMARY:** The rate limit indicator visible during a session and the upgrade prompt triggered when the Free tier daily limit is reached.
- **FILE:** `./build/concept/cb-007-tier-upgrade.svg`
- **FORMAT:** SVG, dark background, labelled regions.
- **SCREENS COVERED:** Free tier indicator (rewrites remaining counter); daily limit reached state; upgrade prompt inline; upgrade flow modal.
- **STYLE NOTES:** Tier indicator is a small persistent element in the top-right of the Workspace (e.g. "3/5 remaining today"). When limit is hit, the Rewrite button disables and an inline banner appears with upgrade CTA. Upgrade modal is minimal — tier comparison (Free vs Pro), price, and a single confirm action. No dark patterns.
- **TRACEABILITY:** UC-011, UC-010.
- **RELATED:** CB-001.

---

## Exit Gate

- [x] `3-CONCEPT-STORYBOARD.md` contains at least one CB record per major UC flow (7 CB records covering all 11 UCs).
- [x] Every CB record follows the schema (SUMMARY, FILE, FORMAT, SCREENS COVERED, STYLE NOTES, TRACEABILITY, RELATED — all fields present).
- [x] Every CB FILE path references a valid SVG path under `./build/concept/`.
- [x] TRACEABILITY fields reference valid UC-IDs.
- [x] `PIPELINE-STATUS.md` is updated for Stage 3 with STATUS and STATUS UPDATED date.
