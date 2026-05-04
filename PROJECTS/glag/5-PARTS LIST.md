# Parts List — Cyrillic ↔ Glagolitic Converter

---

## PT-001 : Project Scaffold & Build Configuration

- **DESCRIPTION:** The Vite project structure, package.json, tsconfig.json, and index.html entry point that bootstraps the application.
- **TECHNOLOGY RECOMMENDATIONS:** Vite 5.x (`npm create vite` or manual init). TypeScript 5.x. `index.html` as the Vite entry point. `vite.config.ts` with `build.outDir: 'dist'`.
- **NOTES:** `package.json` scripts: `"dev": "vite"`, `"build": "tsc && vite build"`, `"preview": "vite preview"`. `tsconfig.json`: strict, ES2020 target, bundler moduleResolution.
- **RELATED:** AR-001, AR-002. BR-001–BR-014.

---

## PT-002 : Application Entry Point & DOM Wiring

- **DESCRIPTION:** `src/main.ts` — the TypeScript entry point that queries DOM elements, initialises the converter, and wires all event listeners.
- **TECHNOLOGY RECOMMENDATIONS:** TypeScript 5.x, vanilla DOM APIs (`document.getElementById`, `addEventListener`).
- **NOTES:** All DOM queries run once at module load. Event listeners: input event on the input textarea (live update), click on clear button, click on copy button, change/click on mode toggle. No global state beyond the current mode value.
- **RELATED:** AR-002, AR-003. BR-004, BR-007, BR-008, BR-010, BR-011, BR-014.

---

## PT-003 : UI Layout — index.html + style.css

- **DESCRIPTION:** `index.html` (markup) and `src/style.css` (styles) defining the two-panel converter layout, mode toggle, action button row, reference table section, and toast notification.
- **TECHNOLOGY RECOMMENDATIONS:** HTML5 semantic elements. CSS custom properties for theme tokens. CSS Grid for the two-panel layout. No CSS framework (no Tailwind, Bootstrap, etc.).
- **NOTES:** The converter section and the reference table section are both present in the DOM at all times; visibility toggled via a CSS class. The toast is absolutely positioned and hidden by default; shown by adding a class.
- **RELATED:** AR-001, AR-003. BR-004–BR-011, BR-014.

---

## PT-004 : Converter Logic Module

- **DESCRIPTION:** `src/converter.ts` — pure function that accepts an input string and a direction enum, and returns the converted output string by substituting each character via the mapping table.
- **TECHNOLOGY RECOMMENDATIONS:** TypeScript 5.x. Pure function, no DOM dependencies, no side effects.
- **NOTES:** Function signature: `convert(input: string, direction: 'cyrillic-to-glagolitic' | 'glagolitic-to-cyrillic'): string`. Iterates over `input` using `for...of` (Unicode-safe), maps each character, concatenates result. Characters not in the active map are passed through unchanged.
- **RELATED:** AR-002, AR-004. BR-001, BR-002, BR-003, BR-004, BR-012, BR-013.

---

## PT-005 : Character Mapping Data Module

- **DESCRIPTION:** `src/mapping.ts` — module exporting the forward and reverse character mapping tables as `Map<string, string>` constants.
- **TECHNOLOGY RECOMMENDATIONS:** TypeScript 5.x. Single source of truth for all 31 character pairs from goal.md. Reverse map derived programmatically by inverting the forward map at module load time.
- **NOTES:** Export `CYRILLIC_TO_GLAGOLITIC: Map<string, string>` and `GLAGOLITIC_TO_CYRILLIC: Map<string, string>`. Keys are single-character strings. Both uppercase and lowercase Cyrillic variants must be included where both forms exist in Ukrainian.
- **RELATED:** AR-004. BR-001, BR-002, BR-005, BR-012, BR-013.

---

## PT-006 : Reference Table Renderer

- **DESCRIPTION:** `src/referenceTable.ts` — module that programmatically builds the HTML mapping reference table from the `CYRILLIC_TO_GLAGOLITIC` map and inserts it into the reference section of the DOM.
- **TECHNOLOGY RECOMMENDATIONS:** TypeScript 5.x, vanilla DOM (`document.createElement`, `appendChild`). Table is built once at load time from PT-005 data.
- **NOTES:** Table columns: Cyrillic character | Cyrillic name | Glagolitic character | Glagolitic name. Character names are stored as a companion lookup object in `src/mapping.ts`. The table must not be hardcoded in HTML — it is generated from the map to ensure consistency.
- **RELATED:** AR-003, AR-004. BR-005, BR-006.

---
