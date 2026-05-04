# Proposed Use Cases — X-Optimizer / ViralReword

> Stage 0 advisory. Does not trigger the pipeline until promoted to 1-USE-CASES.md.

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** User / BA

---

## UC-001 : CONTENT CREATOR — REWRITE TEXT FOR X OPTIMISATION

- **GOAL:** The Content Creator pastes free-form text and receives multiple X-optimised rewrites in under three seconds, each applying a distinct engagement strategy.
- **STEPS:**
  1. The Content Creator opens the application.
  2. They paste text (50–10,000 characters) into the input area.
  3. They press the Rewrite button (or equivalent trigger).
  4. The system produces 3–5 rewrite variations within 3 seconds, each labelled with its strategy.
  5. The Content Creator reads the variations and identifies the most suitable one.
- **ACCEPTANCE CRITERIA:**
  - AC1: The system returns at least 3 and no more than 5 variations per submission.
  - AC2: Each variation is labelled with its strategy name (Hook-First, Controversy-Max, Authority, Story-Mode, Minimalist).
  - AC3: Response time from submission to first variation rendered is ≤ 3 seconds for standard rewrites.
  - AC4: Each variation retains a Meaning Fidelity Score ≥ 95% relative to the input text.
  - AC5: Input text shorter than 50 characters is rejected with an inline validation message.
  - AC6: Input text longer than 10,000 characters is rejected with an inline validation message.
- **NOTES:** The 3-second latency target applies to standard single-text rewrites. Batch rewrites (UC-009) have a separate latency budget. The tool must not alter factual claims present in the original text.
- **RELATED:** UC-002, UC-003, UC-005.

---

## UC-002 : CONTENT CREATOR — SELECT REWRITE STRATEGIES

- **GOAL:** The Content Creator chooses which of the five optimisation strategies are applied to their rewrite request, enabling focused output relevant to their use case.
- **STEPS:**
  1. Before or after pasting text, the Content Creator views the five strategy options as selectable controls.
  2. They activate or deactivate individual strategy chips (minimum one must remain active).
  3. They submit the rewrite request.
  4. The system produces variations only for the selected strategies.
- **ACCEPTANCE CRITERIA:**
  - AC1: All five strategies (Hook-First, Controversy-Max, Authority, Story-Mode, Minimalist) are displayed as individually toggleable controls.
  - AC2: At least one strategy must remain active; the system prevents the user from deactivating all strategies and surfacing an inline warning if they attempt to.
  - AC3: Output contains exactly one variation per selected strategy, no more, no fewer.
  - AC4: Deselected strategies produce no output tile.
- **NOTES:** Default state is all five strategies active. Strategy selection persists for the session.
- **RELATED:** UC-001.

---

## UC-003 : CONTENT CREATOR — PROVIDE OPTIONAL CONTEXT FOR REWRITING

- **GOAL:** The Content Creator supplies context parameters (target audience, topic category, desired tone, source credibility level) to receive rewrites tailored to a specific communicative context.
- **STEPS:**
  1. The Content Creator opens the context/settings panel.
  2. They optionally specify one or more context parameters: target audience/demographic, topic category (News, Tech, Finance, Health, etc.), desired tone (Authoritative, Casual, Controversial, Curious, Urgent), and source credibility level.
  3. They submit a rewrite request with the context applied.
  4. The system incorporates the context parameters into the rewrite logic for all variations.
- **ACCEPTANCE CRITERIA:**
  - AC1: Each context parameter is individually optional; submitting a rewrite without any context parameters must succeed.
  - AC2: When a topic category is selected, the system incorporates topic-relevant power words and terminology appropriate to that category.
  - AC3: When a desired tone is selected, each variation reflects that tone without contradicting its labelled strategy.
  - AC4: Context parameters persist for the session and are visibly displayed when set.
- **NOTES:** Context parameters are advisory; the rewrite engine applies them on a best-effort basis. They do not override the strategy logic.
- **RELATED:** UC-001, UC-002.

---

## UC-004 : CONTENT CREATOR — COPY A REWRITE WITH ONE ACTION

- **GOAL:** The Content Creator copies any rewrite variation to the clipboard in a single interaction, ready to paste directly into X or another platform.
- **STEPS:**
  1. After rewrites are rendered, the Content Creator identifies the variation they want to use.
  2. They press the copy action on that variation's tile.
  3. The full text of the variation is copied to the clipboard.
  4. The system provides brief inline confirmation that the copy succeeded.
- **ACCEPTANCE CRITERIA:**
  - AC1: Each variation tile exposes a single copy action requiring no more than one click or tap.
  - AC2: The copied text is the exact text of the variation, with no trailing whitespace, HTML, or formatting characters added.
  - AC3: A character count is displayed on each tile before and during copying.
  - AC4: Inline confirmation of successful copy is displayed for ≥ 2 seconds and ≤ 5 seconds without blocking further interaction.
- **NOTES:** One-click copy is a core interaction promise. No confirmation modal or secondary step is permitted.
- **RELATED:** UC-001, UC-007.

---

## UC-005 : CONTENT CREATOR — UNDERSTAND WHY A REWRITE WORKS

- **GOAL:** The Content Creator reads a brief explanation of the engagement technique applied in each variation, building their own understanding of effective X writing.
- **STEPS:**
  1. After rewrites are rendered, each variation tile displays a "why this works" annotation below the rewritten text.
  2. The Content Creator reads the annotation to understand the psychological or structural mechanism at play.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every variation tile includes a non-empty "why this works" annotation.
  - AC2: The annotation references the specific technique applied (e.g. curiosity gap, social proof, specificity over generality).
  - AC3: Annotations are no longer than 60 words.
  - AC4: The annotation is visually distinct from the rewrite text (e.g. muted typeface or reduced weight) and does not interfere with the copy action.
- **NOTES:** Annotations are generated contextually per rewrite. They are editorial — not technically prescriptive.
- **RELATED:** UC-001.

---

## UC-006 : CONTENT CREATOR — VIEW AND ADJUST MEANING FIDELITY

- **GOAL:** The Content Creator checks how closely each rewrite matches the original meaning and identifies variations that have drifted from their intent, so they can exercise editorial judgement before posting.
- **STEPS:**
  1. After rewrites are rendered, each variation tile displays a Meaning Fidelity Score (expressed as a percentage).
  2. The Content Creator identifies any variation with a score below their acceptable threshold.
  3. They either discard that variation or use the tone adjustment slider to reduce the aggressiveness of the optimisation and trigger regeneration of that tile only.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every variation tile displays a Meaning Fidelity Score as a percentage (0–100%).
  - AC2: Scores are calculated against the original input text using semantic similarity; the method is consistent across all tiles.
  - AC3: Variations with a Meaning Fidelity Score below 95% display a visible warning indicator on the tile.
  - AC4: The tone slider (subtle → aggressive optimisation) is available on each tile and, when adjusted, triggers regeneration of that single tile without affecting other tiles.
  - AC5: The regenerated tile displays an updated Meaning Fidelity Score.
- **NOTES:** The 95% threshold applies to production output. The Controversy-Max strategy is expected to score at the lower end of the acceptable range; this is by design and must be reflected in user guidance.
- **RELATED:** UC-001, UC-010.

---

## UC-007 : CONTENT CREATOR — STRUCTURE LONG TEXT AS AN X THREAD

- **GOAL:** The Content Creator converts input text that exceeds 280 characters into a structured X thread with a hook tweet and numbered thread segments, preserving the logical flow of the original.
- **STEPS:**
  1. The Content Creator submits input text longer than 280 characters (or explicitly requests Thread mode).
  2. The system detects the length and automatically activates the Thread Composer view, or the Content Creator manually selects Thread mode.
  3. The system generates a hook tweet and numbered thread segments (n/total).
  4. The Content Creator reviews the thread, reorders segments by dragging, and may regenerate individual segments.
  5. They copy individual tweets or the full thread.
- **ACCEPTANCE CRITERIA:**
  - AC1: Thread mode activates automatically when input text exceeds 280 characters or when the user explicitly selects it.
  - AC2: Each thread segment is ≤ 280 characters.
  - AC3: A distinct hook tweet is generated as the first element (tweet 1/n), and its purpose is labelled.
  - AC4: Thread segments are numbered sequentially (e.g. 1/5, 2/5…) and update correctly when segments are reordered.
  - AC5: Individual segments can be regenerated independently without affecting other segments.
  - AC6: A "copy all" action copies all thread segments in order, with each separated by a double line break.
- **NOTES:** Thread mode is additive — users may still use single-tweet strategies alongside.
- **RELATED:** UC-001, UC-004.

---

## UC-008 : CONTENT CREATOR — RECEIVE HASHTAG AND TIMING RECOMMENDATIONS

- **GOAL:** The Content Creator receives 3–5 contextually relevant hashtag suggestions and an optimal posting time recommendation after accepting a rewrite, to maximise the post's discoverability.
- **STEPS:**
  1. After the Content Creator copies or otherwise accepts a rewrite variation, the system surfaces hashtag recommendations and a posting time suggestion below the accepted tile.
  2. The Content Creator reviews the hashtags and clicks any to append them to the copied text.
  3. They note the suggested posting time.
- **ACCEPTANCE CRITERIA:**
  - AC1: Between 3 and 5 hashtag suggestions are surfaced per accepted rewrite.
  - AC2: Hashtags are contextually relevant to the input text's topic and the selected context parameters (if set).
  - AC3: Clicking a hashtag appends it to the clipboard copy of the variation text.
  - AC4: A suggested posting time is displayed as a time-of-day recommendation, not a countdown timer.
  - AC5: Hashtag and timing recommendations are informational only; they do not block or alter the copy action.
- **NOTES:** Hashtag recommendations are based on historical engagement data patterns, not live trending data at v1, unless API access is in scope.
- **RELATED:** UC-001, UC-004.

---

## UC-009 : CONTENT CREATOR — APPLY ETHICS GUARDRAILS AND FLAG PROBLEMATIC REWRITES

- **GOAL:** The Content Creator is protected from inadvertently publishing a rewrite that introduces unsubstantiated claims, changes implications, or crosses an accuracy threshold, through inline flagging and blocking.
- **STEPS:**
  1. The system evaluates each generated rewrite against the ethics guardrail logic before rendering the tile.
  2. If a rewrite introduces an unsubstantiated claim or materially changes the implication of the original, the system flags the tile with an inline warning.
  3. For high-severity violations (e.g. clear factual inversion), the system blocks the tile from rendering and replaces it with a "could not produce a safe rewrite for this strategy" message.
  4. The Content Creator reads the warning, decides whether to proceed, and may regenerate or discard the flagged tile.
- **ACCEPTANCE CRITERIA:**
  - AC1: Every generated variation is evaluated by the guardrail logic before being rendered to the user.
  - AC2: Low-severity issues (minor sensationalisation below a defined threshold) surface as inline advisory warnings on the tile, not blocking modals.
  - AC3: High-severity issues (factual inversion, introduction of unverifiable claims, change of stated implications) cause the tile to render a "blocked" state rather than the rewrite text.
  - AC4: Blocked tiles display a brief explanation of why the rewrite was blocked (e.g. "This version introduced a claim not present in the original text").
  - AC5: The user may never copy a blocked tile's text.
  - AC6: The Transparency option ("AI-optimised version" marking) is available as a toggleable setting and, when enabled, appends a disclosure label to all copied rewrites.
- **NOTES:** The guardrail is a safeguard, not a content moderator. It does not evaluate political sentiment, opinion, or editorial framing — only factual accuracy relative to the input.
- **RELATED:** UC-001, UC-006.

---

## UC-010 : REGISTERED USER — ACCESS REWRITE HISTORY

- **GOAL:** The Registered User reviews, restores, and re-uses past rewrites from previous sessions, reducing redundant work for recurring content themes.
- **STEPS:**
  1. The Registered User opens the History panel.
  2. They browse a reverse-chronological list of past rewrite sessions, each showing the original input text (truncated) and the date.
  3. They select a past session to restore it to the Workspace.
  4. They optionally copy a past variation directly from the History panel.
- **ACCEPTANCE CRITERIA:**
  - AC1: The History panel is accessible from the main Workspace without navigating away.
  - AC2: Sessions are listed in reverse-chronological order, most recent first.
  - AC3: Each session entry displays the original input text truncated to 100 characters and the date of submission.
  - AC4: Selecting a session restores the original input and all generated variations to the Workspace.
  - AC5: History is only available to logged-in (Registered) users; unauthenticated users see a prompt to sign in to access this feature.
  - AC6: History entries are searchable by input keywords.
- **NOTES:** History is a logged-in-only feature. Free tier users have history limited to the last 30 sessions; Pro tier users have unlimited history. History data must be retained for a minimum of 90 days for Pro users.
- **RELATED:** UC-001, UC-011.

---

## UC-011 : REGISTERED USER — MANAGE USAGE TIER AND RATE LIMITS

- **GOAL:** The Registered User understands their current usage tier, remaining daily rewrite quota, and how to upgrade to the Pro tier, so they can plan their usage and access unlimited rewrites when needed.
- **STEPS:**
  1. The Registered User views their current tier (Free: 5 rewrites/day; Pro: unlimited) and remaining daily quota in the interface.
  2. On reaching the Free tier daily limit, they see a prompt explaining the limit and offering a path to upgrade.
  3. They select the upgrade path and complete the upgrade flow.
  4. After upgrading, their quota resets immediately and all Pro features are unlocked.
- **ACCEPTANCE CRITERIA:**
  - AC1: The current tier and remaining daily rewrite count are visible to logged-in users at all times during a session.
  - AC2: Free tier users are blocked from submitting a rewrite once the daily quota (5) is reached; an inline message explains the limit and offers an upgrade prompt.
  - AC3: The upgrade flow is reachable within 2 interactions from the daily limit prompt.
  - AC4: Pro tier users have no rewrite rate limit enforced.
  - AC5: Unauthenticated users are treated as Free tier users (5 rewrites/day) until they sign in.
- **NOTES:** Rate limits apply per user account, not per IP. Unauthenticated rate limiting is advisory only; enforcement requires a session cookie or similar lightweight mechanism.
- **RELATED:** UC-010.

---

## Exit Gate

- [x] All UC records follow the schema (GOAL, STEPS, ACCEPTANCE CRITERIA, NOTES, RELATED).
- [x] UC IDs are sequential starting from UC-001 through UC-011.
- [x] Every acceptance criterion is independently testable.
- [x] File contains the Stage 0 advisory header.
- [x] `PIPELINE-STATUS.md` is updated for Stage 0 with STATUS and STATUS UPDATED date.
