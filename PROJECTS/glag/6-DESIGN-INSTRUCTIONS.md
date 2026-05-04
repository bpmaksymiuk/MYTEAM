# Design Instructions — Cyrillic ↔ Glagolitic Converter

---

## DI-001 : Project Scaffold

- **SUMMARY:** Create the Vite + TypeScript project structure under `./build/`.
- **IMPLEMENTATION STEPS:**
  1. Create the directory `./build/`.
  2. Create `./build/package.json` with the following exact content:
     ```json
     {
       "name": "glagolitic-converter",
       "version": "0.1.0",
       "private": true,
       "scripts": {
         "dev": "vite",
         "build": "tsc && vite build",
         "preview": "vite preview"
       },
       "devDependencies": {
         "typescript": "^5.4.0",
         "vite": "^5.2.0"
       }
     }
     ```
  3. Create `./build/tsconfig.json` with the following exact content:
     ```json
     {
       "compilerOptions": {
         "target": "ES2020",
         "useDefineForClassFields": true,
         "module": "ESNext",
         "lib": ["ES2020", "DOM", "DOM.Iterable"],
         "moduleResolution": "bundler",
         "resolveJsonModule": true,
         "strict": true,
         "noUnusedLocals": true,
         "noUnusedParameters": true,
         "noImplicitReturns": true,
         "skipLibCheck": true
       },
       "include": ["src"]
     }
     ```
  4. Create `./build/vite.config.ts` with the following exact content:
     ```typescript
     import { defineConfig } from 'vite';
     export default defineConfig({
       build: { outDir: 'dist' }
     });
     ```
  5. Create the directory `./build/src/`.
- **SKILLSET REQUIRED:** Node.js ecosystem, Vite configuration, TypeScript project setup.
- **NOTES:** Do not run `npm install` yet — that is a separate step. The `src/` directory will be populated by subsequent DIs.
- **RELATED:** BR-001–BR-014. AR-001, AR-002. PT-001.

---

## DI-002 : Character Mapping Module

- **SUMMARY:** Create `./build/src/mapping.ts` containing the 31-pair Glagolitic↔Cyrillic character mapping tables and the companion name lookup object.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/mapping.ts`.
  2. Define and export `CYRILLIC_TO_GLAGOLITIC: Map<string, string>` containing exactly these 31 entries (Cyrillic → Glagolitic), using the pairs from goal.md:
     | Cyrillic | Glagolitic |
     |----------|-----------|
     | А / а | Ⰰ (U+2C30 lowercase / U+2C00 uppercase — use U+2C00) |
     | Б / б | Ⰱ (U+2C01) |
     | В / в | Ⰲ (U+2C02) |
     | Г / г | Ⰳ (U+2C03) |
     | Д / д | Ⰴ (U+2C04) |
     | Е / е | Ⰵ (U+2C05) |
     | Ж / ж | Ⰶ (U+2C06) |
     | З / з | Ⰸ (U+2C08) |
     | И / и | Ⰹ (U+2C09) |
     | К / к | Ⰽ (U+2C0D) |
     | Л / л | Ⰾ (U+2C0E) |
     | М / м | Ⰿ (U+2C0F) |
     | Н / н | Ⱀ (U+2C10) |
     | О / о | Ⱁ (U+2C11) |
     | П / п | Ⱂ (U+2C12) |
     | Р / р | Ⱃ (U+2C13) |
     | С / с | Ⱄ (U+2C14) |
     | Т / т | Ⱅ (U+2C15) |
     | У / у | Ⱆ (U+2C16) |
     | Ф / ф | Ⱇ (U+2C17) |
     | Х / х | Ⱈ (U+2C18) |
     | Ц / ц | Ⱌ (U+2C1C) |
     | Ч / ч | Ⱎ (U+2C1E) — NOTE: goal.md maps Ш→Ⱎ; Ч maps to Ⱏ |
     | Ш / ш | Ⱎ (U+2C1E) |
     | Ъ / ъ | Ⱐ (U+2C10+8 = U+2C18? — use U+2C30 series) |
     | Ы / ы | Ⱑ (U+2C11) |
     | Ь / ь | Ⱒ (U+2C12) |
     | Ю / ю | Ⱓ (U+2C13) |
     | Я / я | Ⱔ (U+2C14) |

     **Use the exact Glagolitic characters from goal.md verbatim.** The correct mapping entries, taken directly from goal.md (Glagolitic → Cyrillic column) and inverted, are:
     ```typescript
     export const CYRILLIC_TO_GLAGOLITIC: Map<string, string> = new Map([
       ['А', 'Ⰰ'], ['а', 'ⰰ'],
       ['Б', 'Ⰱ'], ['б', 'ⰱ'],
       ['В', 'Ⰲ'], ['в', 'ⰲ'],
       ['Г', 'Ⰳ'], ['г', 'ⰳ'],
       ['Д', 'Ⰴ'], ['д', 'ⰴ'],
       ['Е', 'Ⰵ'], ['е', 'ⰵ'],
       ['Ж', 'Ⰶ'], ['ж', 'ⰶ'],
       ['З', 'Ⰸ'], ['з', 'ⰸ'],
       ['И', 'Ⰹ'], ['и', 'ⰹ'],
       ['К', 'Ⰽ'], ['к', 'ⰽ'],
       ['Л', 'Ⰾ'], ['л', 'ⰾ'],
       ['М', 'Ⰿ'], ['м', 'ⰿ'],
       ['Н', 'Ⱀ'], ['н', 'ⱀ'],
       ['О', 'Ⱁ'], ['о', 'ⱁ'],
       ['П', 'Ⱂ'], ['п', 'ⱂ'],
       ['Р', 'Ⱃ'], ['р', 'ⱃ'],
       ['С', 'Ⱄ'], ['с', 'ⱄ'],
       ['Т', 'Ⱅ'], ['т', 'ⱅ'],
       ['У', 'Ⱆ'], ['у', 'ⱆ'],
       ['Ф', 'Ⱇ'], ['ф', 'ⱇ'],
       ['Х', 'Ⱈ'], ['х', 'ⱈ'],
       ['Ц', 'Ⱌ'], ['ц', 'ⱌ'],
       ['Ш', 'Ⱎ'], ['ш', 'ⱎ'],
       ['Ч', 'Ⱏ'], ['ч', 'ⱏ'],
       ['Ъ', 'Ⱐ'], ['ъ', 'ⱐ'],
       ['Ы', 'Ⱑ'], ['ы', 'ⱑ'],
       ['Ь', 'Ⱒ'], ['ь', 'ⱒ'],
       ['Ю', 'Ⱓ'], ['ю', 'ⱓ'],
       ['Я', 'Ⱔ'], ['я', 'ⱔ'],
     ]);
     ```
  3. Derive and export `GLAGOLITIC_TO_CYRILLIC: Map<string, string>` programmatically:
     ```typescript
     export const GLAGOLITIC_TO_CYRILLIC: Map<string, string> = new Map(
       [...CYRILLIC_TO_GLAGOLITIC.entries()].map(([cyr, glag]) => [glag, cyr])
     );
     ```
  4. Export a companion name lookup for use by the reference table. Add the following after the maps:
     ```typescript
     export interface CharPair {
       cyrillic: string;
       cyrillicName: string;
       glagolitic: string;
       glagoliticName: string;
     }
     export const CHAR_PAIRS: CharPair[] = [
       { cyrillic: 'А', cyrillicName: 'Az',       glagolitic: 'Ⰰ', glagoliticName: 'Az' },
       { cyrillic: 'Б', cyrillicName: 'Buki',     glagolitic: 'Ⰱ', glagoliticName: 'Buky' },
       { cyrillic: 'В', cyrillicName: 'Vedi',     glagolitic: 'Ⰲ', glagoliticName: 'Vidi' },
       { cyrillic: 'Г', cyrillicName: 'Glagoli',  glagolitic: 'Ⰳ', glagoliticName: 'Glagoli' },
       { cyrillic: 'Д', cyrillicName: 'Dobro',    glagolitic: 'Ⰴ', glagoliticName: 'Dobro' },
       { cyrillic: 'Е', cyrillicName: 'Jest',     glagolitic: 'Ⰵ', glagoliticName: 'Jest' },
       { cyrillic: 'Ж', cyrillicName: 'Živete',   glagolitic: 'Ⰶ', glagoliticName: 'Živěte' },
       { cyrillic: 'З', cyrillicName: 'Zemlja',   glagolitic: 'Ⰸ', glagoliticName: 'Ziemlja' },
       { cyrillic: 'И', cyrillicName: 'Izhe',     glagolitic: 'Ⰹ', glagoliticName: 'Izhe' },
       { cyrillic: 'К', cyrillicName: 'Kako',     glagolitic: 'Ⰽ', glagoliticName: 'Kako' },
       { cyrillic: 'Л', cyrillicName: 'Ljudi',    glagolitic: 'Ⰾ', glagoliticName: 'Ljudi' },
       { cyrillic: 'М', cyrillicName: 'Myslite',  glagolitic: 'Ⰿ', glagoliticName: 'Myslite' },
       { cyrillic: 'Н', cyrillicName: 'Naš',      glagolitic: 'Ⱀ', glagoliticName: 'Naš' },
       { cyrillic: 'О', cyrillicName: 'On',       glagolitic: 'Ⱁ', glagoliticName: 'On' },
       { cyrillic: 'П', cyrillicName: 'Pokoj',    glagolitic: 'Ⱂ', glagoliticName: 'Pokoj' },
       { cyrillic: 'Р', cyrillicName: 'Rci',      glagolitic: 'Ⱃ', glagoliticName: 'Rci' },
       { cyrillic: 'С', cyrillicName: 'Slovo',    glagolitic: 'Ⱄ', glagoliticName: 'Slovo' },
       { cyrillic: 'Т', cyrillicName: 'Tvrdo',    glagolitic: 'Ⱅ', glagoliticName: 'Tvrdo' },
       { cyrillic: 'У', cyrillicName: 'Uk',       glagolitic: 'Ⱆ', glagoliticName: 'Uku' },
       { cyrillic: 'Ф', cyrillicName: 'Fert',     glagolitic: 'Ⱇ', glagoliticName: 'Frt' },
       { cyrillic: 'Х', cyrillicName: 'Her',      glagolitic: 'Ⱈ', glagoliticName: 'Her' },
       { cyrillic: 'Ц', cyrillicName: 'Tsi',      glagolitic: 'Ⱌ', glagoliticName: 'Tsi' },
       { cyrillic: 'Ш', cyrillicName: 'Sha',      glagolitic: 'Ⱎ', glagoliticName: 'Sha' },
       { cyrillic: 'Ч', cyrillicName: 'Cherv',    glagolitic: 'Ⱏ', glagoliticName: 'Cherv' },
       { cyrillic: 'Ъ', cyrillicName: 'Jer',      glagolitic: 'Ⱐ', glagoliticName: 'Yer' },
       { cyrillic: 'Ы', cyrillicName: 'Yery',     glagolitic: 'Ⱑ', glagoliticName: 'Yery' },
       { cyrillic: 'Ь', cyrillicName: 'Jer soft', glagolitic: 'Ⱒ', glagoliticName: 'Soft Yer' },
       { cyrillic: 'Ю', cyrillicName: 'Yu',       glagolitic: 'Ⱓ', glagoliticName: 'Yu' },
       { cyrillic: 'Я', cyrillicName: 'Ya',       glagolitic: 'Ⱔ', glagoliticName: 'Ya' },
     ];
     ```
  5. No other exports. No default export.
- **SKILLSET REQUIRED:** TypeScript 5.x, Unicode character literals.
- **NOTES:** This module has no imports and no DOM dependencies. It is a pure data module. The `CHAR_PAIRS` array must have exactly 29 entries (uppercase only for display; lowercase handled by the Map but not shown in the reference table). The Cyrillic З (U+0417) maps to Glagolitic Ⰸ (goal.md row 8 "ziemlja/zemlja"); Ѕ is not in the Ukrainian alphabet and is omitted.
- **RELATED:** BR-001, BR-002, BR-005, BR-006, BR-012, BR-013. AR-004. PT-005.

---

## DI-003 : Converter Logic Module

- **SUMMARY:** Create `./build/src/converter.ts` — a pure function that converts a string character-by-character using the active mapping table.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/converter.ts`.
  2. Import the two maps from `./mapping.ts`:
     ```typescript
     import { CYRILLIC_TO_GLAGOLITIC, GLAGOLITIC_TO_CYRILLIC } from './mapping.js';
     ```
  3. Define and export the direction type and convert function:
     ```typescript
     export type Direction = 'cyrillic-to-glagolitic' | 'glagolitic-to-cyrillic';

     export function convert(input: string, direction: Direction): string {
       const map = direction === 'cyrillic-to-glagolitic'
         ? CYRILLIC_TO_GLAGOLITIC
         : GLAGOLITIC_TO_CYRILLIC;
       let result = '';
       for (const char of input) {
         result += map.get(char) ?? char;
       }
       return result;
     }
     ```
  4. No other exports. No default export.
- **SKILLSET REQUIRED:** TypeScript 5.x.
- **NOTES:** `for...of` over a string iterates Unicode code points (not UTF-16 code units), which is correct for multi-byte characters. The `??` operator ensures passthrough for unmapped characters (BR-002, BR-003, BR-013).
- **RELATED:** BR-001, BR-002, BR-003, BR-004, BR-012, BR-013. AR-002, AR-004. PT-004.

---

## DI-004 : Reference Table Module

- **SUMMARY:** Create `./build/src/referenceTable.ts` — a module that builds the HTML mapping reference table from `CHAR_PAIRS` and inserts it into a given container element.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/referenceTable.ts`.
  2. Import `CHAR_PAIRS` from `./mapping.js`:
     ```typescript
     import { CHAR_PAIRS } from './mapping.js';
     ```
  3. Define and export the `buildReferenceTable` function:
     ```typescript
     export function buildReferenceTable(container: HTMLElement): void {
       const table = document.createElement('table');
       table.className = 'mapping-table';

       const thead = table.createTHead();
       const headerRow = thead.insertRow();
       ['Cyrillic', 'Cyrillic Name', 'Glagolitic', 'Glagolitic Name'].forEach(text => {
         const th = document.createElement('th');
         th.textContent = text;
         headerRow.appendChild(th);
       });

       const tbody = table.createTBody();
       CHAR_PAIRS.forEach(pair => {
         const row = tbody.insertRow();
         [pair.cyrillic, pair.cyrillicName, pair.glagolitic, pair.glagoliticName].forEach(text => {
           const td = row.insertCell();
           td.textContent = text;
         });
       });

       container.appendChild(table);
     }
     ```
  4. No other exports. No default export.
- **SKILLSET REQUIRED:** TypeScript 5.x, vanilla DOM APIs.
- **NOTES:** The function appends the table to `container`; it does not clear it first. It must be called only once at load time.
- **RELATED:** BR-005, BR-006. AR-003. PT-006.

---

## DI-005 : HTML Markup

- **SUMMARY:** Create `./build/index.html` with the full page structure: title bar, mode toggle, two-panel converter section, action button row, and reference table section.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/index.html` with the following structure:
     ```html
     <!doctype html>
     <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Cyrillic ↔ Glagolitic Converter</title>
       <link rel="stylesheet" href="/src/style.css" />
     </head>
     <body>
       <header class="app-header">
         <h1>Cyrillic ↔ Glagolitic Converter</h1>
       </header>

       <main>
         <section class="mode-toggle" role="group" aria-label="Conversion mode">
           <button id="btn-mode-cyr-glag" class="mode-btn active" type="button">
             Cyrillic → Glagolitic
           </button>
           <button id="btn-mode-glag-cyr" class="mode-btn" type="button">
             Glagolitic → Cyrillic
           </button>
         </section>

         <section class="converter-panels">
           <div class="panel panel-input">
             <label id="label-input" for="input-text" class="panel-label">Input — Cyrillic</label>
             <textarea id="input-text" class="panel-textarea"
               placeholder="Type or paste text here…"
               aria-labelledby="label-input"
               spellcheck="false"
               autocomplete="off"></textarea>
           </div>

           <div class="panel panel-output">
             <label id="label-output" class="panel-label">Output — Glagolitic</label>
             <div id="output-text" class="panel-output-text" aria-labelledby="label-output" aria-live="polite"></div>
           </div>
         </section>

         <section class="action-row">
           <button id="btn-clear" class="btn-action btn-clear" type="button">✕ Clear</button>
           <button id="btn-copy" class="btn-action btn-copy" type="button" disabled>⎘ Copy Output</button>
           <button id="btn-mapping" class="btn-action btn-mapping" type="button">☰ Mapping</button>
         </section>

         <div id="toast" class="toast" aria-live="assertive" aria-atomic="true" hidden>
           ✓ Copied to clipboard
         </div>

         <section id="section-mapping" class="section-mapping" hidden>
           <div class="mapping-header">
             <h2>Character Mapping Reference</h2>
             <button id="btn-close-mapping" class="btn-action" type="button">← Back</button>
           </div>
           <p class="mapping-intro">29 uppercase character pairs. Lowercase variants are also mapped. Characters not listed pass through unchanged.</p>
           <div id="mapping-table-container"></div>
         </section>
       </main>

       <script type="module" src="/src/main.ts"></script>
     </body>
     </html>
     ```
  2. No inline styles or inline scripts.
- **SKILLSET REQUIRED:** HTML5 semantic markup, ARIA attributes.
- **NOTES:** The `hidden` attribute on `#section-mapping` and `#toast` controls visibility via HTML attribute toggling in JS. The output panel uses a `<div>` (not a `<textarea>`) so it is read-only by default. Both mode buttons are present; the `active` class marks the current mode.
- **RELATED:** BR-004, BR-007, BR-008, BR-010, BR-011, BR-014. AR-001, AR-003. PT-003.

---

## DI-006 : CSS Styles

- **SUMMARY:** Create `./build/src/style.css` with the full application styles: dark theme, two-panel layout, mode toggle, buttons, reference table, and toast.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/style.css` with the following content:
     ```css
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

     :root {
       --bg-deep: #0d1117;
       --bg-surface: #161b22;
       --bg-raised: #21262d;
       --border: #30363d;
       --text-primary: #e6edf3;
       --text-secondary: #c9d1d9;
       --text-muted: #8b949e;
       --text-faint: #484f58;
       --accent-blue: #58a6ff;
       --accent-blue-fill: #1f6feb;
       --accent-green: #3fb950;
       --accent-red: #f85149;
       --font-mono: 'Consolas', 'Courier New', monospace;
       --font-ui: 'Segoe UI', system-ui, sans-serif;
       --radius: 6px;
     }

     body {
       background: var(--bg-deep);
       color: var(--text-primary);
       font-family: var(--font-ui);
       min-height: 100vh;
       padding: 1.5rem;
     }

     .app-header {
       border-bottom: 1px solid var(--border);
       padding-bottom: 1rem;
       margin-bottom: 1.5rem;
     }
     .app-header h1 {
       font-size: 1.4rem;
       font-weight: 700;
       color: var(--text-primary);
     }

     /* MODE TOGGLE */
     .mode-toggle {
       display: flex;
       gap: 0.5rem;
       margin-bottom: 1.25rem;
       background: var(--bg-surface);
       border: 1px solid var(--border);
       border-radius: var(--radius);
       padding: 0.375rem;
       width: fit-content;
     }
     .mode-btn {
       padding: 0.375rem 1rem;
       border-radius: calc(var(--radius) - 2px);
       border: 1px solid transparent;
       background: transparent;
       color: var(--text-muted);
       font-family: var(--font-ui);
       font-size: 0.9rem;
       cursor: pointer;
       transition: background 0.15s, color 0.15s, border-color 0.15s;
     }
     .mode-btn.active {
       background: var(--accent-blue-fill);
       border-color: var(--accent-blue);
       color: var(--text-primary);
       font-weight: 600;
     }
     .mode-btn:not(.active):hover {
       background: var(--bg-raised);
       color: var(--text-secondary);
     }

     /* CONVERTER PANELS */
     .converter-panels {
       display: grid;
       grid-template-columns: 1fr 1fr;
       gap: 1rem;
       margin-bottom: 1rem;
     }
     @media (max-width: 640px) {
       .converter-panels { grid-template-columns: 1fr; }
     }
     .panel {
       background: var(--bg-surface);
       border: 1px solid var(--border);
       border-radius: var(--radius);
       overflow: hidden;
     }
     .panel-input { border-color: var(--accent-blue); }
     .panel-output { border-color: var(--accent-green); }

     .panel-label {
       display: block;
       padding: 0.5rem 0.75rem;
       font-size: 0.75rem;
       font-weight: 700;
       letter-spacing: 0.05em;
       text-transform: uppercase;
       border-bottom: 1px solid var(--border);
     }
     .panel-input .panel-label { color: var(--accent-blue); }
     .panel-output .panel-label { color: var(--accent-green); }

     .panel-textarea {
       width: 100%;
       min-height: 180px;
       padding: 0.75rem;
       background: transparent;
       border: none;
       color: var(--text-primary);
       font-family: var(--font-mono);
       font-size: 1.1rem;
       resize: vertical;
       outline: none;
     }
     .panel-textarea::placeholder { color: var(--text-faint); font-style: italic; }

     .panel-output-text {
       min-height: 180px;
       padding: 0.75rem;
       font-family: var(--font-mono);
       font-size: 1.1rem;
       color: var(--text-secondary);
       white-space: pre-wrap;
       word-break: break-word;
     }

     /* ACTION ROW */
     .action-row {
       display: flex;
       gap: 0.625rem;
       margin-bottom: 1rem;
       flex-wrap: wrap;
     }
     .btn-action {
       padding: 0.4rem 0.875rem;
       border-radius: var(--radius);
       border: 1px solid var(--border);
       background: var(--bg-raised);
       color: var(--text-secondary);
       font-family: var(--font-ui);
       font-size: 0.875rem;
       cursor: pointer;
       transition: background 0.15s, border-color 0.15s, color 0.15s;
     }
     .btn-clear { border-color: var(--accent-red); color: var(--accent-red); }
     .btn-clear:hover { background: rgba(248, 81, 73, 0.1); }
     .btn-copy { border-color: var(--accent-blue); color: var(--accent-blue); }
     .btn-copy:hover:not(:disabled) { background: rgba(88, 166, 255, 0.1); }
     .btn-copy:disabled { opacity: 0.35; cursor: not-allowed; border-color: var(--border); color: var(--text-faint); }
     .btn-mapping:hover { border-color: var(--text-muted); color: var(--text-primary); }

     /* TOAST */
     .toast {
       position: fixed;
       bottom: 2rem;
       right: 2rem;
       background: #238636;
       border: 1px solid #2ea043;
       color: var(--text-primary);
       padding: 0.625rem 1.25rem;
       border-radius: var(--radius);
       font-size: 0.9rem;
       z-index: 100;
       transition: opacity 0.3s;
     }
     .toast[hidden] { display: none; }

     /* MAPPING SECTION */
     .section-mapping[hidden] { display: none; }
     .section-mapping { margin-top: 1rem; }
     .mapping-header {
       display: flex;
       align-items: center;
       gap: 1rem;
       margin-bottom: 0.75rem;
     }
     .mapping-header h2 { font-size: 1.1rem; font-weight: 600; }
     .mapping-intro {
       font-size: 0.85rem;
       color: var(--text-muted);
       margin-bottom: 0.75rem;
     }

     .mapping-table {
       border-collapse: collapse;
       width: 100%;
       max-width: 700px;
       font-size: 0.9rem;
     }
     .mapping-table th {
       background: var(--bg-raised);
       color: var(--text-muted);
       font-weight: 700;
       font-size: 0.75rem;
       letter-spacing: 0.05em;
       text-transform: uppercase;
       padding: 0.5rem 0.75rem;
       border: 1px solid var(--border);
       text-align: left;
     }
     .mapping-table td {
       padding: 0.4rem 0.75rem;
       border: 1px solid var(--border);
       color: var(--text-secondary);
       font-family: var(--font-mono);
     }
     .mapping-table td:nth-child(2),
     .mapping-table td:nth-child(4) {
       font-family: var(--font-ui);
       color: var(--text-muted);
       font-size: 0.8rem;
     }
     .mapping-table td:nth-child(3) { color: var(--accent-green); }
     .mapping-table tbody tr:nth-child(odd) { background: var(--bg-surface); }
     .mapping-table tbody tr:nth-child(even) { background: var(--bg-deep); }
     ```
- **SKILLSET REQUIRED:** CSS custom properties, CSS Grid, responsive design.
- **NOTES:** No CSS framework. The `.panel-input` and `.panel-output` border colours swap when the mode is reversed — this is handled by JS adding/removing a class on the `<body>` (see DI-007). Specifically, add class `mode-reverse` to `<body>` in Glagolitic→Cyrillic mode, and add these overrides at the end of the CSS:
  ```css
  body.mode-reverse .panel-input { border-color: var(--accent-green); }
  body.mode-reverse .panel-input .panel-label { color: var(--accent-green); }
  body.mode-reverse .panel-output { border-color: var(--accent-blue); }
  body.mode-reverse .panel-output .panel-label { color: var(--accent-blue); }
  ```
- **RELATED:** BR-004, BR-007, BR-008, BR-010, BR-011, BR-014. AR-001, AR-003. PT-003.

---

## DI-007 : Application Entry Point

- **SUMMARY:** Create `./build/src/main.ts` — wires all DOM elements to converter logic, handles mode toggle, clear, copy, and mapping navigation.
- **IMPLEMENTATION STEPS:**
  1. Create `./build/src/main.ts`.
  2. Import dependencies:
     ```typescript
     import { convert, Direction } from './converter.js';
     import { buildReferenceTable } from './referenceTable.js';
     ```
  3. Query and cache DOM elements. Use non-null assertions with type casts — these elements are always present per DI-005:
     ```typescript
     const inputEl = document.getElementById('input-text') as HTMLTextAreaElement;
     const outputEl = document.getElementById('output-text') as HTMLDivElement;
     const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;
     const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;
     const btnMapping = document.getElementById('btn-mapping') as HTMLButtonElement;
     const btnCloseMapping = document.getElementById('btn-close-mapping') as HTMLButtonElement;
     const btnModeCyrGlag = document.getElementById('btn-mode-cyr-glag') as HTMLButtonElement;
     const btnModeGlagCyr = document.getElementById('btn-mode-glag-cyr') as HTMLButtonElement;
     const sectionMapping = document.getElementById('section-mapping') as HTMLElement;
     const mappingContainer = document.getElementById('mapping-table-container') as HTMLDivElement;
     const toast = document.getElementById('toast') as HTMLDivElement;
     ```
  4. Initialise state and build reference table:
     ```typescript
     let direction: Direction = 'cyrillic-to-glagolitic';
     buildReferenceTable(mappingContainer);
     ```
  5. Helper — update labels based on current direction:
     ```typescript
     function updateLabels(): void {
       const inputLabel = document.getElementById('label-input') as HTMLElement;
       const outputLabel = document.getElementById('label-output') as HTMLElement;
       if (direction === 'cyrillic-to-glagolitic') {
         inputLabel.textContent = 'Input — Cyrillic';
         outputLabel.textContent = 'Output — Glagolitic';
         inputEl.placeholder = 'Type or paste Cyrillic text here…';
         document.body.classList.remove('mode-reverse');
       } else {
         inputLabel.textContent = 'Input — Glagolitic';
         outputLabel.textContent = 'Output — Cyrillic';
         inputEl.placeholder = 'Type or paste Glagolitic text here…';
         document.body.classList.add('mode-reverse');
       }
     }
     ```
  6. Helper — run conversion and update copy button state:
     ```typescript
     function runConversion(): void {
       const result = convert(inputEl.value, direction);
       outputEl.textContent = result;
       btnCopy.disabled = result.length === 0;
     }
     ```
  7. Event listener — live input:
     ```typescript
     inputEl.addEventListener('input', runConversion);
     ```
  8. Event listener — clear:
     ```typescript
     btnClear.addEventListener('click', () => {
       inputEl.value = '';
       outputEl.textContent = '';
       btnCopy.disabled = true;
       inputEl.focus();
     });
     ```
  9. Event listener — copy:
     ```typescript
     let toastTimer: ReturnType<typeof setTimeout> | undefined;
     btnCopy.addEventListener('click', async () => {
       try {
         await navigator.clipboard.writeText(outputEl.textContent ?? '');
         toast.hidden = false;
         clearTimeout(toastTimer);
         toastTimer = setTimeout(() => { toast.hidden = true; }, 2000);
       } catch {
         // Clipboard unavailable — fail silently.
       }
     });
     ```
  10. Event listener — mode toggle:
      ```typescript
      function setMode(newDirection: Direction): void {
        if (direction === newDirection) return;
        direction = newDirection;
        inputEl.value = '';
        outputEl.textContent = '';
        btnCopy.disabled = true;
        btnModeCyrGlag.classList.toggle('active', direction === 'cyrillic-to-glagolitic');
        btnModeGlagCyr.classList.toggle('active', direction === 'glagolitic-to-cyrillic');
        updateLabels();
        inputEl.focus();
      }
      btnModeCyrGlag.addEventListener('click', () => setMode('cyrillic-to-glagolitic'));
      btnModeGlagCyr.addEventListener('click', () => setMode('glagolitic-to-cyrillic'));
      ```
  11. Event listener — mapping toggle:
      ```typescript
      btnMapping.addEventListener('click', () => { sectionMapping.hidden = false; });
      btnCloseMapping.addEventListener('click', () => { sectionMapping.hidden = true; });
      ```
  12. Initial label update:
      ```typescript
      updateLabels();
      ```
- **SKILLSET REQUIRED:** TypeScript 5.x, vanilla DOM, browser Clipboard API, async/await.
- **NOTES:** `toastTimer` uses `ReturnType<typeof setTimeout>` for cross-environment compatibility. The empty `catch` is intentional — clipboard failure is silent per BR-009 and AR-005. All DOM queries are cached at module level, not inside handlers.
- **RELATED:** BR-001–BR-014. AR-002, AR-003, AR-005. PT-002.
