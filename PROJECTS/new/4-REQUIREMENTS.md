# Business Requirements — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Business Analyst
- **SOURCE:** `1-USE-CASES.md` (approved 2026-05-04)

---

## BR-001 : TEXT INPUT MINIMUM LENGTH ENFORCEMENT

The system shall reject any rewrite submission where the input text contains fewer than 50 characters and shall display an inline validation message.

- **TESTABLE CONDITION:** Submit 49-character input. Verify no rewrite request is sent and an inline error message is displayed.
- **NOTES:** The validation must prevent submission — it must not merely warn. Character count is measured after trimming leading and trailing whitespace.
- **RELATED:** UC-001.

---

## BR-002 : TEXT INPUT MAXIMUM LENGTH ENFORCEMENT

The system shall reject any rewrite submission where the input text contains more than 10,000 characters and shall display an inline validation message.

- **TESTABLE CONDITION:** Submit 10,001-character input. Verify no rewrite request is sent and an inline error message is displayed.
- **NOTES:** Character count is measured before any trimming.
- **RELATED:** UC-001.

---

## BR-003 : REWRITE VARIATION COUNT

The system shall generate a minimum of 3 and a maximum of 5 rewrite variations per submission, one per active strategy.

- **TESTABLE CONDITION:** Submit valid text with all 5 strategies active. Verify exactly 5 tiles are rendered, one per strategy.
- **NOTES:** If fewer than 3 strategies are active, the system still produces one variation per active strategy (may produce fewer than 3 tiles when fewer than 3 strategies are selected — see BR-009 for strategy minimum). This BR establishes the ceiling of 5 and the baseline floor when all strategies are active.
- **RELATED:** UC-001, UC-002.

---

## BR-004 : STRATEGY LABEL DISPLAY

The system shall display the strategy name on each rewrite variation tile.

- **TESTABLE CONDITION:** Submit a rewrite with all 5 strategies active. Verify each tile displays one of: "Hook-First", "Controversy-Max", "Authority", "Story-Mode", "Minimalist".
- **NOTES:** Label must be visually distinguishable from the rewrite text.
- **RELATED:** UC-001, UC-002.

---

## BR-005 : REWRITE RESPONSE TIME

The system shall render the first rewrite variation within 3 seconds of a valid submission for standard (single-text) rewrite requests.

- **TESTABLE CONDITION:** Submit a 200-character input with all 5 strategies active. Measure time from button press to first tile rendered. Must be ≤ 3 seconds.
- **NOTES:** Measured under normal load conditions. Batch rewrite (`POST /batch-rewrite`) is excluded from this BR.
- **RELATED:** UC-001.

---

## BR-006 : MEANING FIDELITY SCORE MINIMUM

The system shall not render a rewrite variation with a Meaning Fidelity Score below 95% unless it displays a visible warning indicator on that tile.

- **TESTABLE CONDITION:** Trigger a rewrite known to score below 95%. Verify the tile renders a warning indicator. Verify tiles scoring ≥ 95% do not display the warning.
- **NOTES:** The fidelity score is calculated by semantic similarity comparison against the original input text using a consistent method across all tiles.
- **RELATED:** UC-001, UC-006.

---

## BR-007 : STRATEGY CHIP TOGGLE — INDIVIDUAL CONTROL

The system shall allow the user to individually activate or deactivate each of the five strategy chips independently.

- **TESTABLE CONDITION:** Deactivate "Controversy-Max" only. Submit a rewrite. Verify no Controversy-Max tile is rendered. Verify all other 4 tiles are rendered.
- **NOTES:** Chip state persists for the session.
- **RELATED:** UC-002.

---

## BR-008 : STRATEGY CHIP TOGGLE — PERSIST FOR SESSION

The system shall retain the user's strategy chip selections for the duration of the browser session.

- **TESTABLE CONDITION:** Deactivate "Story-Mode". Submit a rewrite. Without reloading the page, submit a second rewrite. Verify Story-Mode is still deactivated on the second submission.
- **NOTES:** Session persistence is within a single browser session. Cross-session persistence is not required.
- **RELATED:** UC-002.

---

## BR-009 : STRATEGY CHIP MINIMUM — BLOCK ALL-DEACTIVATE

The system shall prevent the user from deactivating all five strategy chips simultaneously and shall display an inline warning when an attempt is made to leave zero chips active.

- **TESTABLE CONDITION:** With 1 chip active, attempt to deactivate it. Verify the chip does not deactivate and an inline warning is displayed.
- **NOTES:** The warning must not use a blocking modal.
- **RELATED:** UC-002.

---

## BR-010 : CONTEXT PARAMETERS — OPTIONAL SUBMISSION

The system shall accept a rewrite submission with no context parameters set without error.

- **TESTABLE CONDITION:** Submit a valid rewrite with all context parameters empty. Verify the rewrite completes successfully and 3–5 tiles are rendered.
- **RELATED:** UC-003.

---

## BR-011 : CONTEXT PARAMETERS — SESSION PERSISTENCE

The system shall retain all context parameter values set by the user for the duration of the browser session.

- **TESTABLE CONDITION:** Set topic category to "Finance". Submit a rewrite. Without reloading the page, verify "Finance" is still selected in the context panel.
- **RELATED:** UC-003.

---

## BR-012 : CONTEXT PARAMETERS — VISIBLE WHEN SET

The system shall display a visible indicator when one or more context parameters are active.

- **TESTABLE CONDITION:** Set at least one context parameter. Verify an indicator (e.g. a badge or highlight on the gear icon or context panel entry point) is visible in the Workspace.
- **RELATED:** UC-003.

---

## BR-013 : ONE-CLICK COPY — SINGLE INTERACTION

The system shall copy the full text of any rewrite variation to the system clipboard in a single click or tap on the copy control.

- **TESTABLE CONDITION:** Click the copy control on any tile. Verify the clipboard contains the variation's text without any extra characters, HTML, or whitespace.
- **NOTES:** No confirmation modal or secondary step is permitted.
- **RELATED:** UC-004.

---

## BR-014 : ONE-CLICK COPY — CHARACTER COUNT DISPLAY

The system shall display the character count of each rewrite variation tile at all times.

- **TESTABLE CONDITION:** Render a tile with a known text length. Verify the displayed character count matches the text length.
- **RELATED:** UC-004.

---

## BR-015 : ONE-CLICK COPY — INLINE CONFIRMATION

The system shall display an inline copy-success confirmation on the copied tile for a duration of between 2 and 5 seconds.

- **TESTABLE CONDITION:** Copy a tile. Verify a confirmation indicator appears within 0.5 seconds and disappears within 5 seconds without blocking interaction with other tiles.
- **RELATED:** UC-004.

---

## BR-016 : WHY THIS WORKS — ANNOTATION PRESENT

The system shall display a non-empty "why this works" annotation on every rendered rewrite variation tile.

- **TESTABLE CONDITION:** Submit a valid rewrite. Verify every rendered tile contains an annotation that is not empty or whitespace-only.
- **RELATED:** UC-005.

---

## BR-017 : WHY THIS WORKS — TECHNIQUE REFERENCE

The system shall include a reference to the specific engagement technique applied in every "why this works" annotation.

- **TESTABLE CONDITION:** For each strategy, verify the annotation references the technique class (e.g. "curiosity gap" for Hook-First, "data authority" for Authority).
- **RELATED:** UC-005.

---

## BR-018 : WHY THIS WORKS — ANNOTATION LENGTH LIMIT

The system shall not render a "why this works" annotation longer than 60 words.

- **TESTABLE CONDITION:** Count the words in every annotation across 10 varied submissions. Verify none exceeds 60 words.
- **RELATED:** UC-005.

---

## BR-019 : MEANING FIDELITY SCORE — DISPLAY ON EVERY TILE

The system shall display a Meaning Fidelity Score as a percentage (0–100%) on every rewrite variation tile.

- **TESTABLE CONDITION:** Submit a valid rewrite. Verify every rendered tile displays a numeric percentage value labelled as the Meaning Fidelity Score.
- **RELATED:** UC-006.

---

## BR-020 : MEANING FIDELITY SCORE — CONSISTENT CALCULATION METHOD

The system shall calculate Meaning Fidelity Scores for all tiles in a single submission using the same method.

- **TESTABLE CONDITION:** Submit the same input twice. Verify that the scores for the same strategy are equal or within a documented tolerance (± 1%).
- **RELATED:** UC-006.

---

## BR-021 : TONE SLIDER — SINGLE TILE REGENERATION

The system shall regenerate only the tile whose tone slider was adjusted, leaving all other tiles unchanged.

- **TESTABLE CONDITION:** Adjust the tone slider on tile 2 of 5. Verify tiles 1, 3, 4, and 5 are unchanged. Verify tile 2 renders a new variation.
- **RELATED:** UC-006.

---

## BR-022 : THREAD MODE — AUTO-ACTIVATE ON LONG INPUT

The system shall automatically activate Thread Composer mode when submitted input text exceeds 280 characters.

- **TESTABLE CONDITION:** Submit input of 281 characters. Verify Thread Composer view is rendered, not the standard tile grid.
- **RELATED:** UC-007.

---

## BR-023 : THREAD MODE — MANUAL ACTIVATION

The system shall allow the user to explicitly activate Thread Composer mode for any input length.

- **TESTABLE CONDITION:** Submit input of 100 characters with Thread mode explicitly selected. Verify Thread Composer view renders.
- **RELATED:** UC-007.

---

## BR-024 : THREAD MODE — SEGMENT LENGTH ENFORCEMENT

The system shall ensure every thread segment is 280 characters or fewer.

- **TESTABLE CONDITION:** Submit a 1,000-character input in Thread mode. Verify every generated segment is ≤ 280 characters.
- **RELATED:** UC-007.

---

## BR-025 : THREAD MODE — HOOK TWEET GENERATION

The system shall generate a labelled hook tweet as the first segment of every thread.

- **TESTABLE CONDITION:** Activate Thread mode. Verify the first segment is visually distinguished as the hook tweet and is labelled as such.
- **RELATED:** UC-007.

---

## BR-026 : THREAD MODE — SEQUENTIAL NUMBERING

The system shall number thread segments sequentially in the format "n/total".

- **TESTABLE CONDITION:** Generate a thread with 4 segments. Verify segments are labelled 1/4, 2/4, 3/4, 4/4.
- **NOTES:** Numbering must update correctly when segments are reordered.
- **RELATED:** UC-007.

---

## BR-027 : THREAD MODE — SEGMENT REORDER

The system shall allow the user to reorder thread segments by dragging, and shall update segment numbering accordingly.

- **TESTABLE CONDITION:** Drag segment 3/4 to position 1. Verify it becomes 1/4 and others renumber.
- **RELATED:** UC-007.

---

## BR-028 : THREAD MODE — INDEPENDENT SEGMENT REGENERATION

The system shall allow the user to regenerate any individual thread segment without affecting other segments.

- **TESTABLE CONDITION:** Click regenerate on segment 2/4. Verify segment 2 renders new content. Verify segments 1, 3, and 4 are unchanged.
- **RELATED:** UC-007.

---

## BR-029 : THREAD MODE — COPY ALL

The system shall provide a "copy all" action that copies all thread segments in sequential order, with each segment separated by a double line break.

- **TESTABLE CONDITION:** Use "copy all" on a 3-segment thread. Verify clipboard contains all 3 segments with double line break separators.
- **RELATED:** UC-007.

---

## BR-030 : HASHTAG RECOMMENDATIONS — COUNT

The system shall surface between 3 and 5 hashtag suggestions after a rewrite variation is copied.

- **TESTABLE CONDITION:** Copy a tile. Verify between 3 and 5 hashtag suggestions appear.
- **RELATED:** UC-008.

---

## BR-031 : HASHTAG RECOMMENDATIONS — APPEND ON CLICK

The system shall append a hashtag to the clipboard copy of the variation text when the user clicks that hashtag.

- **TESTABLE CONDITION:** Copy a tile. Click hashtag "#tech". Paste clipboard. Verify "#tech" is appended to the pasted text.
- **RELATED:** UC-008.

---

## BR-032 : HASHTAG RECOMMENDATIONS — NON-BLOCKING

The system shall ensure hashtag and timing recommendations do not block or delay the copy action.

- **TESTABLE CONDITION:** Copy a tile. Verify the copy action completes before any hashtag or timing panel appears.
- **RELATED:** UC-008.

---

## BR-033 : POSTING TIME RECOMMENDATION — DISPLAY FORMAT

The system shall display a posting time recommendation as a time-of-day range, not a countdown timer.

- **TESTABLE CONDITION:** Verify the posting time recommendation reads in the format "HH:MM – HH:MM" or equivalent time-range display.
- **RELATED:** UC-008.

---

## BR-034 : ETHICS GUARDRAIL — PRE-RENDER EVALUATION

The system shall evaluate every generated rewrite variation against ethics guardrail logic before rendering it to the user.

- **TESTABLE CONDITION:** Verify (via documented test input known to trigger the guardrail) that the system evaluates the rewrite before the tile renders.
- **RELATED:** UC-009.

---

## BR-035 : ETHICS GUARDRAIL — LOW-SEVERITY WARNING (NON-BLOCKING)

The system shall display a low-severity guardrail warning inline on the tile, without blocking rendering or the copy action, when a minor accuracy concern is detected.

- **TESTABLE CONDITION:** Trigger a low-severity guardrail event. Verify the tile renders with an advisory warning label. Verify the copy button remains enabled.
- **RELATED:** UC-009.

---

## BR-036 : ETHICS GUARDRAIL — HIGH-SEVERITY BLOCK

The system shall render a blocked tile state (no rewrite text displayed) when a high-severity ethics violation is detected, and shall display the reason for the block.

- **TESTABLE CONDITION:** Trigger a high-severity guardrail event. Verify no rewrite text is displayed in the tile. Verify a reason statement is displayed. Verify the copy button is disabled.
- **RELATED:** UC-009.

---

## BR-037 : ETHICS GUARDRAIL — COPY DISABLED ON BLOCKED TILE

The system shall disable the copy action on any blocked tile.

- **TESTABLE CONDITION:** Trigger a blocked tile. Attempt to copy. Verify nothing is copied to the clipboard.
- **RELATED:** UC-009.

---

## BR-038 : TRANSPARENCY MARKING — TOGGLE

The system shall provide a transparency toggle that, when enabled, appends an "AI-optimised version" disclosure label to the text copied from any tile.

- **TESTABLE CONDITION:** Enable transparency marking. Copy a tile. Paste clipboard. Verify the disclosure label is appended. Disable toggle. Copy another tile. Verify no disclosure label is appended.
- **RELATED:** UC-009.

---

## BR-039 : HISTORY — AUTHENTICATION GATE

The system shall display a sign-in prompt to unauthenticated users who attempt to access the History panel, and shall not display any history entries to unauthenticated users.

- **TESTABLE CONDITION:** As an unauthenticated user, open the History panel. Verify a sign-in prompt is displayed and no session entries are visible.
- **RELATED:** UC-010.

---

## BR-040 : HISTORY — REVERSE-CHRONOLOGICAL ORDER

The system shall display history sessions in reverse-chronological order (most recent first).

- **TESTABLE CONDITION:** Create sessions on different dates. Open History. Verify the most recent session appears first.
- **RELATED:** UC-010.

---

## BR-041 : HISTORY — SESSION ENTRY DISPLAY

The system shall display each history session entry with the original input text truncated to 100 characters and the submission date.

- **TESTABLE CONDITION:** Create a session with input longer than 100 characters. Open History. Verify the entry shows exactly 100 characters of input text (with ellipsis or truncation indicator) and the correct date.
- **RELATED:** UC-010.

---

## BR-042 : HISTORY — SESSION RESTORE

The system shall restore the original input text and all generated variations to the Workspace when a history session is selected.

- **TESTABLE CONDITION:** Create a session, then select it from History. Verify the input area and all tiles reflect the stored session.
- **RELATED:** UC-010.

---

## BR-043 : HISTORY — SEARCH

The system shall allow users to search history entries by input text keywords.

- **TESTABLE CONDITION:** Create sessions with distinct keywords. Search for a keyword. Verify only matching entries are displayed.
- **RELATED:** UC-010.

---

## BR-044 : HISTORY — FREE TIER LIMIT

The system shall limit history to the last 30 sessions for Free tier users.

- **TESTABLE CONDITION:** As a Free tier user, create 31 sessions. Verify only the 30 most recent sessions are accessible.
- **RELATED:** UC-010, UC-011.

---

## BR-045 : HISTORY — PRO TIER RETENTION

The system shall retain Pro tier user history for a minimum of 90 days.

- **TESTABLE CONDITION:** As a Pro tier user, verify sessions older than 30 days but within 90 days remain accessible.
- **RELATED:** UC-010, UC-011.

---

## BR-046 : TIER INDICATOR — ALWAYS VISIBLE TO LOGGED-IN USERS

The system shall display the current tier and remaining daily rewrite count to authenticated users at all times during a session.

- **TESTABLE CONDITION:** Sign in as a Free tier user. Verify tier label and remaining count are visible throughout the session without any interaction required.
- **RELATED:** UC-011.

---

## BR-047 : TIER ENFORCEMENT — FREE TIER DAILY LIMIT BLOCK

The system shall block rewrite submissions from Free tier users who have exhausted the 5-rewrite daily quota, and shall display an inline message and upgrade prompt.

- **TESTABLE CONDITION:** As a Free tier user, submit 5 rewrites. On the 6th attempt, verify the submit action is blocked and an inline message with upgrade prompt is displayed.
- **RELATED:** UC-011.

---

## BR-048 : TIER ENFORCEMENT — UPGRADE FLOW REACHABILITY

The system shall make the upgrade flow reachable within 2 user interactions from the daily limit prompt.

- **TESTABLE CONDITION:** From the daily limit inline message, count the interactions required to reach the upgrade confirmation step. Must be ≤ 2.
- **RELATED:** UC-011.

---

## BR-049 : TIER ENFORCEMENT — PRO TIER NO LIMIT

The system shall not enforce any daily rewrite rate limit for Pro tier users.

- **TESTABLE CONDITION:** As a Pro tier user, submit more than 5 rewrites in a single day. Verify all submissions succeed.
- **RELATED:** UC-011.

---

## BR-050 : UNAUTHENTICATED USERS — FREE TIER TREATMENT

The system shall treat unauthenticated users as Free tier users with a 5-rewrite daily advisory limit.

- **TESTABLE CONDITION:** Without signing in, submit 5 rewrites. On the 6th attempt, verify the advisory limit message is displayed.
- **NOTES:** Enforcement for unauthenticated users is advisory only via session cookie; hard enforcement is not required.
- **RELATED:** UC-011.

---

## Exit Gate

- [x] Every UC (UC-001 through UC-011) maps to at least one BR.
- [x] Every BR uses shall language.
- [x] Every BR is atomic (no compound requirements).
- [x] Every BR has a TESTABLE CONDITION.
- [x] No BR contains implementation details (no technology names, no code references).
- [x] BR IDs are sequential (BR-001 through BR-050) and non-reused.
- [x] RELATED fields reference valid UC-IDs.
- [x] `PIPELINE-STATUS.md` is updated for Stage 4 with STATUS and STATUS UPDATED date.
