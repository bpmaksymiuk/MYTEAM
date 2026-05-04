# Test Cases — Cyrillic ↔ Glagolitic Converter

**Run ID:** T-PIPELINE-DASHBOARD-001  
**Date:** 2026-05-02  
**Build:** v0.1.0  

---

| TC-ID | Title | Requirement(s) | Steps | Expected Result |
|-------|-------|----------------|-------|-----------------|
| T-001 | App loads without errors | BR-001 | Navigate to http://localhost:5173 | Page renders with title "Cyrillic ↔ Glagolitic Converter", mode toggle visible, input textarea visible |
| T-002 | Cyrillic→Glagolitic live conversion | BR-001, BR-004 | In default mode, type "АБВ" into input | Output shows "ⰰⰱⰲ" immediately (or uppercase equivalents if case-preserving) |
| T-003 | Unmapped Cyrillic passthrough | BR-002 | Type "А1 Б" (digit and space) | Output preserves "1" and space, only Cyrillic chars are converted |
| T-004 | Non-Cyrillic passthrough | BR-003 | Type "Hello!" | Output is "Hello!" unchanged |
| T-005 | Reference table opens | BR-005 | Click "☰ Mapping" button | Mapping section becomes visible with heading "Character Mapping Reference" |
| T-006 | Reference table has 29 rows | BR-006 | Open mapping section; count tbody rows | Exactly 29 data rows present |
| T-007 | Reference table row content | BR-006 | Open mapping section; check first row | First row contains А, Az, Ⰰ, Az |
| T-008 | Clear button clears both panels | BR-007 | Type text, then click "✕ Clear" | Input textarea and output div are both empty |
| T-009 | Clear returns focus to input | BR-008 | Type text, click "✕ Clear" | Input textarea is focused after clear |
| T-010 | Copy button disabled when output empty | BR-011 | On fresh load (no input) check copy button | Copy button has disabled attribute |
| T-011 | Copy button enabled when output present | BR-009, BR-011 | Type "А" to produce output, check copy button | Copy button is not disabled |
| T-012 | Copy writes to clipboard | BR-009 | Type "А", click "⎘ Copy Output" | Clipboard contains the converted output text |
| T-013 | Toast appears after copy | BR-010 | Click "⎘ Copy Output" | Toast "✓ Copied to clipboard" becomes visible within 500ms |
| T-014 | Mode toggle switches to Glagolitic→Cyrillic | BR-014, UC-005 | Click "Glagolitic → Cyrillic" button | Button becomes active; input label changes to "Input — Glagolitic" |
| T-015 | Mode toggle clears both panels | BR-014 | Type text in cyr-glag mode, then switch mode | Both panels are empty after mode switch |
| T-016 | Glagolitic→Cyrillic live conversion | BR-012 | In glag-cyr mode, type "Ⰰ" | Output shows "А" |
| T-017 | Unmapped Glagolitic passthrough | BR-013 | In glag-cyr mode, type "X" (not a Glagolitic char) | Output shows "X" unchanged |
| T-018 | Mode-reverse CSS class applied | BR-014 | Switch to glag-cyr mode | body element has class "mode-reverse" |
| T-019 | Close mapping section | BR-005 | Open mapping, click "← Back" | Mapping section is hidden |
