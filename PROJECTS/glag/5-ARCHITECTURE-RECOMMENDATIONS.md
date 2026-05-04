# Architecture Recommendations — Cyrillic ↔ Glagolitic Converter

---

## AR-001 : Static Single-Page Web Application

- **DECISION:** Implement the converter as a static single-page application (SPA) with no backend server. All logic runs client-side in the browser.
- **RATIONALE:** The product has no data persistence, authentication, or server-side computation requirements. A static SPA eliminates operational complexity, has zero server attack surface, and can be deployed to any static host (GitHub Pages, Netlify, local file server). The alternative of a Node.js/Express server was considered and rejected as unnecessary — there is no state to manage server-side.
- **NOTES:** The build output must be a self-contained `./build/dist/` directory of HTML, CSS, and JS files that can be served from any static host or opened locally via a dev server.
- **RELATED:** BR-001–BR-014. PT-001, PT-002, PT-003.

---

## AR-002 : Vite + TypeScript Build Toolchain

- **DECISION:** Use Vite 5.x as the build tool and TypeScript 5.x (strict mode) as the implementation language.
- **RATIONALE:** Vite provides a fast dev server with HMR and a Rollup-based production build with zero config for TypeScript. TypeScript strict mode catches mapping errors and DOM API misuse at compile time. The alternative of plain JavaScript with esbuild was considered but rejected — strict TypeScript catches the character-code arithmetic required for the mapping logic and provides autocomplete for Unicode constants. Webpack was also considered but is heavier than needed for a single-page tool.
- **NOTES:** `tsconfig.json` must set `"strict": true`, `"target": "ES2020"` (for string iteration over Unicode), and `"moduleResolution": "bundler"`.
- **RELATED:** BR-001–BR-014. PT-001, PT-002, PT-004.

---

## AR-003 : Vanilla DOM — No UI Framework

- **DECISION:** Implement the UI using vanilla TypeScript DOM manipulation. No React, Vue, or Svelte.
- **RATIONALE:** The UI consists of two text areas, a toggle, two buttons, and a toast notification — a total of five interactive elements. Introducing a component framework would add hundreds of kilobytes to the bundle and a compilation step for JSX/templates. The alternative of using Svelte (lightweight compiler) was considered but rejected — the DOM surface is too small to justify even minimal framework overhead. Vanilla DOM is fully sufficient and keeps the bundle under 10 KB.
- **NOTES:** All DOM queries must be cached at module load time, not inside event handlers.
- **RELATED:** BR-004, BR-007, BR-008, BR-010, BR-011, BR-014. PT-002, PT-003.

---

## AR-004 : Mapping Data as TypeScript Constant

- **DECISION:** Store the 31-pair character mapping as a TypeScript `Map<string, string>` constant in a dedicated module, with the reverse mapping derived programmatically at module load time by inverting the forward map.
- **RATIONALE:** A `Map<string, string>` provides O(1) lookup per character, which is the correct structure for character-by-character substitution. The alternative of a plain object literal was considered — both are acceptable, but `Map` is semantically correct for key-value character substitution and avoids prototype-chain collisions. Hard-coding a second reverse map was rejected — it introduces a maintenance hazard if the table is ever updated.
- **NOTES:** The module must export both `CYRILLIC_TO_GLAGOLITIC: Map<string, string>` and `GLAGOLITIC_TO_CYRILLIC: Map<string, string>`. Keys and values are single Unicode characters (string of length 1).
- **RELATED:** BR-001, BR-002, BR-012, BR-013. PT-005.

---

## AR-005 : Browser Clipboard API for Copy

- **DECISION:** Use the browser's asynchronous `navigator.clipboard.writeText()` API for copying output to the clipboard.
- **RATIONALE:** This is the current W3C standard for programmatic clipboard writes in modern browsers. The alternative of `document.execCommand('copy')` is deprecated and removed from many browsers. The Clipboard API requires a secure context (HTTPS or localhost) — acceptable given the deployment target.
- **NOTES:** The copy button must be wrapped in a try/catch. On failure (e.g., permission denied), the button should silently revert to its default state with no error thrown to the console.
- **RELATED:** BR-009, BR-010, BR-011. PT-003.

---
