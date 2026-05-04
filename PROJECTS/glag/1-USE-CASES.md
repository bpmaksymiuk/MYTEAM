Approved: 2026-05-02

# Use Cases — Cyrillic to Glagolitic Converter

---

## UC-001 : User — Convert Cyrillic Text to Glagolitic

- **GOAL:** Enter Ukrainian Cyrillic text and receive the equivalent Glagolitic script output.
- **STEPS:**
  1. User opens the converter application.
  2. User types or pastes Cyrillic text into an input area.
  3. The application maps each Cyrillic character to its Glagolitic equivalent using the defined mapping table.
  4. The application displays the converted Glagolitic output.
- **ACCEPTANCE CRITERIA:**
  - AC1: Each Cyrillic character that has a defined mapping is replaced by the corresponding Glagolitic character in the output.
  - AC2: Cyrillic characters with no defined mapping are passed through to the output unchanged.
  - AC3: Non-Cyrillic characters (spaces, punctuation, digits, Latin letters) are passed through to the output unchanged.
  - AC4: The output updates in response to changes in the input (either live or on a convert action).
- **NOTES:** The mapping supports both directions (see UC-005 for Glagolitic → Cyrillic). The mapping is case-insensitive with respect to Cyrillic input where variants exist.
- **RELATED:** goal.md mapping table, UC-005.

---

## UC-002 : User — View the Mapping Reference

- **GOAL:** Inspect the full Cyrillic-to-Glagolitic character mapping used by the converter.
- **STEPS:**
  1. User opens or navigates to a reference section of the application.
  2. The application displays a table showing each supported Cyrillic character, its Glagolitic equivalent, and the character name for both.
- **ACCEPTANCE CRITERIA:**
  - AC1: All 31 Cyrillic-to-Glagolitic pairs defined in goal.md are displayed in the reference table.
  - AC2: Each row shows the Cyrillic character, the Glagolitic character, and both character names.
  - AC3: The table is readable without specialist knowledge (labels are in English).
- **NOTES:** The table is read-only; it does not need to be editable by the user.
- **RELATED:** UC-001, goal.md mapping table.

---

## UC-003 : User — Clear Input and Output

- **GOAL:** Reset the input and output areas to empty so a new conversion can be started cleanly.
- **STEPS:**
  1. User activates a clear or reset control.
  2. The input area is emptied.
  3. The output area is emptied.
- **ACCEPTANCE CRITERIA:**
  - AC1: After the clear action both the input and output areas contain no text.
  - AC2: The application is ready to accept new input immediately after clearing.
- **NOTES:** No confirmation prompt is required for the clear action.
- **RELATED:** UC-001.

---

## UC-004 : User — Copy the Glagolitic Output

- **GOAL:** Copy the converted Glagolitic text to the clipboard for use elsewhere.
- **STEPS:**
  1. User activates a copy control associated with the output area.
  2. The application copies the current Glagolitic output text to the system clipboard.
  3. The application provides brief visible feedback confirming the copy.
- **ACCEPTANCE CRITERIA:**
  - AC1: The full Glagolitic output text is placed on the system clipboard.
  - AC2: A visible confirmation (e.g. button label change or toast) appears after the copy action.
  - AC3: The copy control is disabled or shows a no-op state when the output is empty.
- **NOTES:** Clipboard access uses the browser Clipboard API. Fallback behaviour on unsupported browsers is out of scope.
- **RELATED:** UC-001.

---

## UC-005 : User — Convert Glagolitic Text to Cyrillic

- **GOAL:** Enter Glagolitic script text and receive the equivalent Ukrainian Cyrillic output.
- **STEPS:**
  1. User selects the reverse (Glagolitic → Cyrillic) conversion mode.
  2. User types or pastes Glagolitic text into the input area.
  3. The application maps each Glagolitic character to its Cyrillic equivalent using the inverse of the defined mapping table.
  4. The application displays the converted Cyrillic output.
- **ACCEPTANCE CRITERIA:**
  - AC1: Each Glagolitic character that has a defined reverse mapping is replaced by the corresponding Cyrillic character in the output.
  - AC2: Glagolitic characters with no defined reverse mapping are passed through to the output unchanged.
  - AC3: Non-Glagolitic characters (spaces, punctuation, digits, Latin letters) are passed through to the output unchanged.
  - AC4: The output updates in response to changes in the input (either live or on a convert action).
  - AC5: A mode selector or toggle allows the user to switch between Cyrillic → Glagolitic and Glagolitic → Cyrillic conversion directions.
- **NOTES:** The reverse mapping is derived directly from the same 31-pair table used for UC-001 — no additional mapping data is required. Only the Glagolitic characters present in that table have a defined reverse mapping.
- **RELATED:** UC-001, goal.md mapping table.
