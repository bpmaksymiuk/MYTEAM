# Business Requirements — Cyrillic ↔ Glagolitic Converter

---

## BR-001 : Character Mapping — Cyrillic to Glagolitic

The system shall replace each Cyrillic character that appears in the defined 31-pair mapping table with its corresponding Glagolitic character when operating in Cyrillic → Glagolitic mode.

- **TESTABLE CONDITION:** Given the input character А (U+0410), the output contains ⰀⰀ (U+2C00). Given the input character Я (U+042F), the output contains the mapped Glagolitic equivalent. All 31 mapped pairs produce the correct Glagolitic output character.
- **NOTES:** Mapping applies to each Unicode code point independently; multi-character sequences are not combined.
- **RELATED:** UC-001 (AC1).

---

## BR-002 : Unmapped Cyrillic Passthrough

The system shall pass through any Cyrillic character that does not appear in the 31-pair mapping table to the output unchanged when operating in Cyrillic → Glagolitic mode.

- **TESTABLE CONDITION:** Given a Cyrillic character not in the mapping table (e.g., Ь U+042C), it appears in the output as-is and is not replaced, omitted, or altered.
- **NOTES:** This includes any Ukrainian Cyrillic characters introduced after the mapping table was defined.
- **RELATED:** UC-001 (AC2).

---

## BR-003 : Non-Cyrillic Passthrough

The system shall pass through any non-Cyrillic character — including spaces, punctuation, digits, and Latin letters — to the output unchanged in all conversion modes.

- **TESTABLE CONDITION:** Given input containing a space, a comma, the digit "3", and a Latin letter "A", all four appear unchanged in the output at their original positions.
- **NOTES:** This applies to both Cyrillic → Glagolitic and Glagolitic → Cyrillic modes.
- **RELATED:** UC-001 (AC3), UC-005 (AC3).

---

## BR-004 : Live Output Update

The system shall update the output in response to every change in the input without requiring an explicit convert action.

- **TESTABLE CONDITION:** When the user types a single character into the input area, the output area updates to reflect the conversion of the new input within one rendering frame (no manual button press required).
- **NOTES:** Debouncing by one or two frames for performance is acceptable provided the update is imperceptible to the user.
- **RELATED:** UC-001 (AC4), UC-005 (AC4).

---

## BR-005 : Mapping Reference — All 31 Pairs Displayed

The system shall display all 31 Cyrillic-to-Glagolitic character pairs in the mapping reference table.

- **TESTABLE CONDITION:** The reference table contains exactly 31 data rows, each corresponding to one pair from goal.md. No pair is missing.
- **NOTES:** The table is read-only. Pairs are taken verbatim from goal.md.
- **RELATED:** UC-002 (AC1).

---

## BR-006 : Mapping Reference — Row Content

The system shall display the Cyrillic character, the Glagolitic character, and the name of both characters in each row of the mapping reference table.

- **TESTABLE CONDITION:** Every row in the reference table contains four visible items: the Cyrillic glyph, the Cyrillic character name, the Glagolitic glyph, and the Glagolitic character name. No row has an empty cell.
- **NOTES:** Character names shall be in English.
- **RELATED:** UC-002 (AC2, AC3).

---

## BR-007 : Clear Both Panels

The system shall empty both the input area and the output area when the user activates the clear control.

- **TESTABLE CONDITION:** After activating the clear control, both the input area and the output area contain no text. No characters remain in either panel.
- **NOTES:** No confirmation dialog is required before clearing.
- **RELATED:** UC-003 (AC1).

---

## BR-008 : Ready After Clear

The system shall accept new input immediately after the clear control is activated, without requiring a page reload or any additional user action.

- **TESTABLE CONDITION:** After clearing, typing a new character into the input area produces an updated output in the output area.
- **NOTES:** The input area shall receive focus automatically after clearing.
- **RELATED:** UC-003 (AC2).

---

## BR-009 : Copy Output to Clipboard

The system shall place the full current content of the output area onto the system clipboard when the user activates the copy control.

- **TESTABLE CONDITION:** After activating the copy control, pasting into an external text editor produces the identical text that was displayed in the output area.
- **NOTES:** Uses the browser Clipboard API (navigator.clipboard.writeText). Fallback for unsupported browsers is out of scope.
- **RELATED:** UC-004 (AC1).

---

## BR-010 : Copy Confirmation Feedback

The system shall display a visible confirmation indicator within 500 ms of a successful copy action.

- **TESTABLE CONDITION:** After activating the copy control, a visible element (e.g., a toast notification or button label change) appears and is detectable in the DOM within 500 ms.
- **NOTES:** The confirmation must be visible without scrolling.
- **RELATED:** UC-004 (AC2).

---

## BR-011 : Copy Control Disabled When Empty

The system shall disable the copy control when the output area is empty.

- **TESTABLE CONDITION:** When the output area contains no text, the copy button element has a disabled attribute or equivalent state that prevents activation.
- **NOTES:** Activating a disabled copy control shall produce no clipboard write and no feedback.
- **RELATED:** UC-004 (AC3).

---

## BR-012 : Mode Toggle — Glagolitic to Cyrillic Conversion

The system shall replace each Glagolitic character that appears in the defined 31-pair mapping table with its corresponding Cyrillic character when operating in Glagolitic → Cyrillic mode.

- **TESTABLE CONDITION:** Given the input character Ⰰ (U+2C00), the output contains А (U+0410). All 31 reverse-mapped pairs produce the correct Cyrillic output character.
- **NOTES:** The reverse mapping is the inverse of the forward mapping — no additional data table is needed.
- **RELATED:** UC-005 (AC1).

---

## BR-013 : Unmapped Glagolitic Passthrough

The system shall pass through any Glagolitic character that does not appear in the reverse mapping table to the output unchanged when operating in Glagolitic → Cyrillic mode.

- **TESTABLE CONDITION:** Given a Glagolitic character not in the 31-pair table, it appears in the output unchanged.
- **NOTES:** Only the 31 Glagolitic characters in goal.md have a defined reverse mapping.
- **RELATED:** UC-005 (AC2).

---

## BR-014 : Mode Selector Control

The system shall provide a control that allows the user to switch between Cyrillic → Glagolitic and Glagolitic → Cyrillic conversion modes.

- **TESTABLE CONDITION:** The mode selector control is present and visible on the converter screen. Activating the Glagolitic → Cyrillic option changes the conversion direction; activating the Cyrillic → Glagolitic option restores the forward direction.
- **NOTES:** Switching mode shall clear both input and output panels to prevent confusion.
- **RELATED:** UC-005 (AC5).
