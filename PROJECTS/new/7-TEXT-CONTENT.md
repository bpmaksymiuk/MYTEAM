# Text Content — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Writer
- **SOURCE:** `6-DESIGN-INSTRUCTIONS.md`, `1-USE-CASES.md`

---

## TC-001 : APP NAME AND TAGLINE

- **SUMMARY:** The product name, subtitle, and one-line tagline used in the page title, logo, and marketing header.
- **FILE:** `./build/text/branding.md`
- **CATEGORY:** narrative
- **TONE NOTES:** Confident, concise. No puns. Avoid "AI-powered" clichés.
- **GLOSSARY REFERENCES:** GL-001.
- **TRACEABILITY:** DI-025.

---

## TC-002 : STRATEGY LABELS AND DESCRIPTIONS

- **SUMMARY:** Display names and short descriptions for all five rewrite strategies, shown in the chip bar and as tooltip text.
- **FILE:** `./build/text/strategies.md`
- **CATEGORY:** ui
- **TONE NOTES:** Each description ≤ 12 words. Active voice. Describes the effect on the reader, not the technique name.
- **GLOSSARY REFERENCES:** GL-002, GL-003, GL-004, GL-005, GL-006.
- **TRACEABILITY:** DI-010, DI-016.

---

## TC-003 : INPUT AREA PLACEHOLDER AND VALIDATION MESSAGES

- **SUMMARY:** Placeholder text for the main input textarea and all inline validation error messages.
- **FILE:** `./build/text/input-messages.md`
- **CATEGORY:** ui
- **TONE NOTES:** Validation errors: plain, non-blaming, specific. Placeholder: instructional but not prescriptive.
- **GLOSSARY REFERENCES:** GL-007.
- **TRACEABILITY:** DI-019, DI-003.

---

## TC-004 : GUARDRAIL AND ETHICS MESSAGES

- **SUMMARY:** All user-facing messages for blocked tiles, advisory warnings, and the transparency disclosure label.
- **FILE:** `./build/text/guardrail-messages.md`
- **CATEGORY:** ui
- **TONE NOTES:** Blocked messages: direct, non-accusatory, brief. Advisory: informational, non-alarmist. Transparency label: neutral factual statement.
- **GLOSSARY REFERENCES:** GL-008, GL-009.
- **TRACEABILITY:** DI-009, DI-018.

---

## TC-005 : TIER AND RATE LIMIT MESSAGES

- **SUMMARY:** All copy for the daily limit banner, upgrade modal, tier indicator label, and upgrade confirmation button.
- **FILE:** `./build/text/tier-messages.md`
- **CATEGORY:** ui
- **TONE NOTES:** Limit messages: matter-of-fact, no guilt. Upgrade copy: benefit-led, not pressure-based. No "premium" — use "Pro".
- **GLOSSARY REFERENCES:** GL-010, GL-011.
- **TRACEABILITY:** DI-020.

---

## TC-006 : HISTORY PANEL MESSAGES

- **SUMMARY:** All copy for the History panel: authentication gate prompt, empty state, search placeholder, entry date format.
- **FILE:** `./build/text/history-messages.md`
- **CATEGORY:** ui
- **TONE NOTES:** Auth gate: welcoming, not demanding. Empty state: encouraging, not apologetic.
- **GLOSSARY REFERENCES:** GL-012.
- **TRACEABILITY:** DI-022.

---

## TC-007 : THREAD COMPOSER MESSAGES

- **SUMMARY:** All labels, instructions, and confirmations in the Thread Composer view.
- **FILE:** `./build/text/thread-messages.md`
- **CATEGORY:** ui
- **TONE NOTES:** Instructional labels: minimal, task-oriented. No marketing language in the tool interface.
- **GLOSSARY REFERENCES:** GL-013.
- **TRACEABILITY:** DI-023.

---

## TC-008 : HASHTAG AND TIMING PANEL MESSAGES

- **SUMMARY:** Labels and informational copy for the hashtag recommendation panel and posting time display.
- **FILE:** `./build/text/hashtag-messages.md`
- **CATEGORY:** ui
- **TONE NOTES:** Informational only. Must communicate that these are suggestions, not guarantees. ≤ 2 sentences of context.
- **GLOSSARY REFERENCES:** GL-014.
- **TRACEABILITY:** DI-014.

---

## TC-009 : "WHY THIS WORKS" ANNOTATION EXAMPLES

- **SUMMARY:** Reference annotation examples for each of the five strategies, used by developers to calibrate the system prompt and test tile rendering.
- **FILE:** `./build/text/annotations-reference.md`
- **CATEGORY:** utility
- **TONE NOTES:** Technical but readable. Each annotation ≤ 60 words. Cites the specific technique.
- **GLOSSARY REFERENCES:** GL-002, GL-003, GL-004, GL-005, GL-006.
- **TRACEABILITY:** DI-010, DI-011, DI-018.

---

## TC-010 : ERROR AND SYSTEM MESSAGES

- **SUMMARY:** Generic API error messages, network failure messages, and the loading state label.
- **FILE:** `./build/text/system-messages.md`
- **CATEGORY:** utility
- **TONE NOTES:** Errors: brief, actionable, non-technical. No status codes exposed to the user. "Try again" is the fallback action.
- **GLOSSARY REFERENCES:** None.
- **TRACEABILITY:** DI-019, DI-024.

---

## GLOSSARY

| GL-ID | Term | Definition |
|-------|------|------------|
| GL-001 | ViralReword | The product name. The application that transforms text into X/Twitter-optimised rewrites. |
| GL-002 | Hook-First | A rewrite strategy that leads with a curiosity gap: the most surprising element appears first, the answer is withheld. |
| GL-003 | Controversy-Max | A rewrite strategy that adopts a bold, counterintuitive stance to provoke engagement. Does not use hateful or discriminatory content. |
| GL-004 | Authority | A rewrite strategy that emphasises credentials, data, or expert consensus to earn credibility. |
| GL-005 | Story-Mode | A rewrite strategy that structures the text as a brief narrative arc: setup, tension, resolution. |
| GL-006 | Minimalist | A rewrite strategy that distils the core idea to the fewest possible words; targets ≤ 140 characters where possible. |
| GL-007 | Rewrite | The act of generating one or more X/Twitter-optimised versions of the input text. Never called "generation" or "AI response" in the UI. |
| GL-008 | Meaning Fidelity Score | A numeric percentage (0–100%) indicating how closely a rewrite preserves the semantic meaning of the original input. Displayed on every tile. |
| GL-009 | Ethics Guardrail | The server-side system that evaluates every rewrite variation before display. Blocked rewrites are never shown to the user. |
| GL-010 | Free Tier | The default access level: 5 rewrites per day, 30-session history. |
| GL-011 | Pro | The paid tier: unlimited rewrites, unlimited history retained ≥ 90 days. Price: $9/month. Never called "Premium". |
| GL-012 | Session | A single submission of input text that produces one or more rewrite tiles. History stores sessions, not individual tiles. |
| GL-013 | Thread Composer | The application view that splits a long input text into numbered X/Twitter thread segments of ≤ 280 characters each. |
| GL-014 | Hashtag Suggestions | 3–5 hashtag recommendations shown after a tile is copied. Informational only; not guaranteed to trend. |

---

## PHRASEBOOK

| Category | Correct Phrasing | Incorrect Phrasing | Notes |
|----------|------------------|--------------------|-------|
| Product name | ViralReword | X-Optimizer, XOpt, the optimizer | Use "ViralReword" in all UI copy. |
| Paid tier | Pro | Premium, Plus, Paid | Always "Pro". |
| Free tier | Free tier | Basic, Limited, Freemium | "Free tier" in UI; "Free" in short labels. |
| Rewrite action | Rewrite | Generate, Produce, Create, AI-write | The button and action are always "Rewrite". |
| History item | Session | Query, Record, Entry, Request | A saved submission is a "session". |
| Fidelity | Meaning Fidelity Score | Accuracy score, Similarity score | Use the full term in tooltips, short form "Fidelity: N%" in tile badges. |
| Blocked tile | This variation was blocked. | Error: content flagged, Banned | Non-accusatory. No "error" language. |
| Advisory warning | ⚠ [advisory label text] | Warning: this content may be harmful | Informational prefix ⚠, not alarming. |
| Copy confirmation | ✓ Copied | Copied to clipboard!, Done | Short, no exclamation. |
| Pro upgrade CTA | Upgrade to Pro | Go Pro, Subscribe, Buy now | Consistent with tier name. |
| Daily limit | You've used your 5 free rewrites today. | Limit reached!, Quota exceeded | Matter-of-fact, no guilt framing. |
| Thread segments | segments | tweets, posts, chunks | Always "segments" within Thread Composer. |
| Hook tweet | Hook tweet | Opening tweet, First post | The first segment in a thread is always the "hook tweet". |
| Transparency disclosure | [AI-optimised version] | Generated by AI, Made with AI | Neutral factual statement appended to copy. |
