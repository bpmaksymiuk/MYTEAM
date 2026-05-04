# Text Content — Cyrillic ↔ Glagolitic Converter

---

## TC-001 : Page Title and Header

- **SUMMARY:** The browser tab title and visible page heading.
- **FILE:** `./build/text/page-title.txt`
- **CATEGORY:** `ui`
- **TONE NOTES:** Concise, bilingual-script-aware. Use the bidirectional arrow ↔ to signal both directions. No marketing language.
- **GLOSSARY REFERENCES:** GL-001, GL-002.
- **TRACEABILITY:** DI-005.

---

## TC-002 : Mode Toggle Labels

- **SUMMARY:** Labels for the two conversion mode buttons.
- **FILE:** `./build/text/mode-toggle-labels.txt`
- **CATEGORY:** `ui`
- **TONE NOTES:** Short (≤ 25 chars each), direction-explicit. Use → arrow. Parallel structure.
- **GLOSSARY REFERENCES:** GL-001, GL-002.
- **TRACEABILITY:** DI-005, DI-007.

---

## TC-003 : Panel Labels

- **SUMMARY:** Labels for the input and output panels in both modes.
- **FILE:** `./build/text/panel-labels.txt`
- **CATEGORY:** `ui`
- **TONE NOTES:** Format: "Input — [Script]" / "Output — [Script]". Short, unambiguous.
- **GLOSSARY REFERENCES:** GL-001, GL-002.
- **TRACEABILITY:** DI-005, DI-007.

---

## TC-004 : Input Placeholder Text

- **SUMMARY:** Placeholder text shown in the input textarea when it is empty.
- **FILE:** `./build/text/placeholders.txt`
- **CATEGORY:** `ui`
- **TONE NOTES:** Inviting, not imperative. Different text for each mode. Should suggest the script type.
- **GLOSSARY REFERENCES:** GL-001, GL-002.
- **TRACEABILITY:** DI-005, DI-007.

---

## TC-005 : Action Button Labels

- **SUMMARY:** Labels for the Clear, Copy Output, and Mapping buttons.
- **FILE:** `./build/text/action-labels.txt`
- **CATEGORY:** `ui`
- **TONE NOTES:** Short verbs. Icon prefix where used. Copy confirmation feedback text also included.
- **GLOSSARY REFERENCES:** GL-003.
- **TRACEABILITY:** DI-005, DI-007.

---

## TC-006 : Mapping Reference Section Copy

- **SUMMARY:** Heading, intro paragraph, and back button label for the character mapping reference section.
- **FILE:** `./build/text/mapping-reference.txt`
- **CATEGORY:** `ui`
- **TONE NOTES:** Informative without being academic. The intro sentence explains what the table shows and what happens to unmapped characters.
- **GLOSSARY REFERENCES:** GL-001, GL-002, GL-004.
- **TRACEABILITY:** DI-004, DI-005.

---

## GLOSSARY

| GL-ID | Term | Definition |
|-------|------|------------|
| GL-001 | Cyrillic | The writing system used for modern Ukrainian, Russian, Bulgarian, and other Slavic languages. In this application it refers specifically to Ukrainian Cyrillic (Unicode range U+0400–U+04FF). |
| GL-002 | Glagolitic | The oldest known Slavic alphabet, created in the 9th century by Saints Cyril and Methodius. Unicode range U+2C00–U+2C5F. |
| GL-003 | Clipboard | The operating system's temporary storage for copied text, accessible via the browser Clipboard API. |
| GL-004 | Mapping | The one-to-one correspondence between a Cyrillic character and its Glagolitic equivalent, as defined in goal.md. |
| GL-005 | Passthrough | The behaviour of the converter when it encounters a character with no mapping entry — the character is output unchanged. |

---

## PHRASEBOOK

| Category | Correct Phrasing | Incorrect Phrasing | Notes |
|----------|-----------------|-------------------|-------|
| UI labels | "Cyrillic → Glagolitic" | "Cyrillic to Glagolitic" | Always use the arrow glyph → in mode labels. |
| UI labels | "Glagolitic → Cyrillic" | "Glagolitic to Cyrillic" | Always use the arrow glyph →. |
| UI labels | "✕ Clear" | "Reset", "Erase", "Delete" | Use ✕ prefix and the word Clear. |
| UI labels | "⎘ Copy Output" | "Copy", "Copy Text" | Use ⎘ prefix and be explicit that it is the output. |
| UI labels | "✓ Copied to clipboard" | "Copied!", "Done" | Confirm the destination (clipboard) in the toast. |
| UI labels | "☰ Mapping" | "Reference", "Table", "Help" | Use ☰ prefix and the word Mapping. |
| UI labels | "← Back" | "Close", "Return", "Hide" | Use ← prefix for the reference section close button. |
| Error/edge | (no text shown) | "Error", "Not found" | Unmapped characters are silently passed through — no error text. |
| Headings | "Cyrillic ↔ Glagolitic Converter" | "Glagolitic Converter" | Always include both scripts and the bidirectional arrow ↔ in the main heading. |
| Headings | "Character Mapping Reference" | "Mapping Table", "Character Map" | Use the full phrase in section headings. |
