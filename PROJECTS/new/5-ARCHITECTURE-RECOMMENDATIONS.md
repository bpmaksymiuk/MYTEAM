# Architecture Recommendations — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Architect
- **SOURCE:** `4-REQUIREMENTS.md`

---

## AR-001 : FRONTEND FRAMEWORK

- **DECISION:** React 18 with TypeScript via Vite.
- **RATIONALE:** React's component model maps naturally to the rewrite tile grid, thread segment list, and panel overlays. TypeScript enforces the typed data structures required by the fidelity score and strategy models. Vite provides fast HMR for iterative development. Alternative considered: Vue 3 — rejected because the team's existing boilerplate (fishtank, glag projects) uses Vite + TS and the ecosystem alignment reduces ramp-up.
- **NOTES:** Target ES2022. Strict mode enabled. No class components.
- **RELATED:** BR-003, BR-004, BR-007, BR-013; PT-001, PT-002.

---

## AR-002 : STATE MANAGEMENT

- **DECISION:** Zustand for global client state.
- **RATIONALE:** Zustand is minimal and avoids Redux boilerplate for a single-page application of this scope. The strategy chip selections, context parameters, and tier state that must persist across components are a natural fit for a flat Zustand store. Alternative considered: React Context + useReducer — rejected because context re-render propagation would affect unrelated tiles on every state change, violating BR-021 (independent tile regeneration).
- **NOTES:** One store per concern: `strategyStore`, `contextParamsStore`, `sessionStore`, `tierStore`.
- **RELATED:** BR-007, BR-008, BR-021; PT-003.

---

## AR-003 : REWRITE GENERATION — BACKEND API

- **DECISION:** Node.js (Express 5) REST API with TypeScript.
- **RATIONALE:** The rewrite generation, fidelity scoring, and ethics guardrail logic must be server-side to prevent prompt injection and key exposure. Express is lightweight and sufficient for the initial endpoint set. Alternative considered: Fastify — rejected to match the simpler dev profile; can be substituted in a later iteration without frontend impact.
- **NOTES:** Runs on port 3001 in development. Production deployment behind a reverse proxy. No direct LLM key exposure in client bundle.
- **RELATED:** BR-001, BR-002, BR-005, BR-034; PT-004, PT-005.

---

## AR-004 : LLM INTEGRATION

- **DECISION:** OpenAI Chat Completions API (GPT-4o) via the `openai` npm SDK.
- **RATIONALE:** GPT-4o provides the semantic richness required by BR-006 (≥ 95% meaning fidelity) and BR-017 (technique references in annotations). Alternative considered: Anthropic Claude 3.5 Sonnet — technically viable, but OpenAI SDK integration is more mature and the Chat Completions format aligns better with the multi-strategy structured output pattern. Both were evaluated on a fidelity test set.
- **NOTES:** One API call per strategy, parallelised on the server. Responses streamed where possible (BR-005 ≤ 3s). System prompt includes strategy definition, fidelity scoring criteria, and ethics guardrail rules.
- **RELATED:** BR-003, BR-005, BR-006, BR-016, BR-017, BR-034; PT-005, PT-006.

---

## AR-005 : MEANING FIDELITY SCORING

- **DECISION:** Semantic similarity computed server-side via `@xenova/transformers` (all-MiniLM-L6-v2 model) running as a Node.js worker.
- **RATIONALE:** Client-side similarity computation would expose the model to bundle size constraints and cross-browser WebAssembly inconsistencies. Running the transformer in a worker thread keeps the main API request path non-blocking. Alternative considered: Cosine similarity on TF-IDF vectors — rejected because it lacks the semantic depth required to reliably detect paraphrase, which is the core use case (BR-006, BR-020).
- **NOTES:** Scores are cached per (input-hash, output-hash) pair within a request to avoid double-computing for regenerated tiles. Tolerance for BR-020 is ± 1%.
- **RELATED:** BR-006, BR-019, BR-020; PT-006.

---

## AR-006 : ETHICS GUARDRAIL EVALUATION

- **DECISION:** Two-tier server-side guardrail: (1) keyword/pattern blocklist for high-severity violations, (2) secondary LLM classification call for low-severity advisory warnings.
- **RATIONALE:** A pure LLM guardrail is too slow (violates BR-005) for high-severity blocks which must always reject immediately. The blocklist catches known patterns (harassment, medical claims, financial guarantees) with deterministic latency. Low-severity advisory cases are sent to a secondary fast model call with a classifier prompt. Alternative considered: OpenAI Moderation API only — rejected because it does not cover domain-specific concerns (e.g. misleading financial advice) required by UC-009.
- **NOTES:** Blocklist is maintained in a server-side JSON configuration file, not in the client bundle. High-severity blocks suppress the output text (BR-036). Low-severity produce advisory labels (BR-035).
- **RELATED:** BR-034, BR-035, BR-036, BR-037; PT-007.

---

## AR-007 : INPUT VALIDATION

- **DECISION:** Shared validation schema using `zod` on both client (pre-submit) and server (guard at API boundary).
- **RATIONALE:** Zod schemas can be imported on both client and server (monorepo or shared package) ensuring the client validation (BR-001, BR-002) and server boundary validation are never out of sync. Alternative considered: Joi (server only, with manual client validation) — rejected because dual maintenance creates drift risk.
- **NOTES:** Client validation is UX-only (no API call fired). Server validation is the authoritative enforcement gate.
- **RELATED:** BR-001, BR-002; PT-008.

---

## AR-008 : USER AUTHENTICATION

- **DECISION:** Email/password authentication with JWT access tokens (short-lived, 15 min) and HTTP-only refresh tokens (7 days), stored server-side in a refresh token table.
- **RATIONALE:** JWT access tokens avoid database reads on every rewrite request (BR-005 latency). HTTP-only cookies for refresh tokens prevent XSS token theft. Alternative considered: Session cookies only (server-side sessions) — rejected because session storage at scale requires a shared session store, adding infrastructure complexity at v1.
- **NOTES:** No social OAuth at v1. Refresh token rotation on every use. Invalidation on sign-out. Follows OWASP Authentication recommendations.
- **RELATED:** BR-039, BR-046; PT-009.

---

## AR-009 : DATABASE

- **DECISION:** SQLite (via `better-sqlite3`) for development; PostgreSQL 16 (via `pg`) for production.
- **RATIONALE:** SQLite provides zero-infrastructure local development for history and tier storage. The query layer is abstracted behind a repository pattern so switching to PostgreSQL for production is a configuration change. Alternative considered: MongoDB — rejected because relational joins between users, sessions, rewrites, and tier records are simpler in SQL.
- **NOTES:** Migrations managed via `drizzle-orm`. Schema covers: users, refresh_tokens, rewrite_sessions, rewrite_variations, tier_subscriptions.
- **RELATED:** BR-040, BR-041, BR-042, BR-043, BR-044, BR-045, BR-046, BR-047; PT-010.

---

## AR-010 : DAILY RATE LIMITING

- **DECISION:** Server-side daily rewrite counter stored in the database, keyed by user_id (authenticated) or session cookie fingerprint (unauthenticated). Reset at UTC midnight via a scheduled background task.
- **RATIONALE:** Client-side rate limiting is trivially bypassed. A database counter is durable across server restarts. Alternative considered: Redis with TTL-based counters — deferred to post-v1 as an optimisation; database counter is sufficient at v1 scale.
- **NOTES:** Free tier limit: 5. Pro tier: unlimited (counter not enforced). Unauthenticated: 5 advisory (BR-050).
- **RELATED:** BR-047, BR-048, BR-049, BR-050; PT-011.

---

## AR-011 : THREAD COMPOSER

- **DECISION:** Client-side text segmentation using a custom splitting algorithm (280-char boundary aware, sentence-preserving), rendered in a separate React route/view.
- **RATIONALE:** Thread segmentation is a deterministic rule-based operation that does not require server computation. Client-side execution means instant feedback on reorder operations (BR-027). Alternative considered: Server-side segmentation — rejected because the drag-reorder and per-segment regenerate pattern requires instant local state updates without round-trips.
- **NOTES:** Per-segment regeneration does trigger a server API call for LLM content (BR-028). Thread view is a separate React route: `/thread`.
- **RELATED:** BR-022, BR-023, BR-024, BR-025, BR-026, BR-027, BR-028, BR-029; PT-012.

---

## AR-012 : HASHTAG AND TIMING RECOMMENDATION

- **DECISION:** Static taxonomy of hashtag suggestions keyed by topic category (from context parameters), served from a server-side JSON dataset. Timing recommendations are pre-computed from published X posting-time research (no live API).
- **RATIONALE:** Live X API integration is deferred post-v1 per the Product Owner's scope note. A static taxonomy with category keying satisfies UC-008 without external API dependency. Alternative considered: Third-party hashtag API (e.g. Hashtagify) — deferred post-v1.
- **NOTES:** Dataset is version-controlled in `build/src/data/hashtags.json`. Timing recommendations are expressed as time-of-day ranges, not countdowns (BR-033).
- **RELATED:** BR-030, BR-031, BR-032, BR-033; PT-013.

---

## AR-013 : CLIPBOARD API

- **DECISION:** Native browser `navigator.clipboard.writeText()` API for all copy operations.
- **RATIONALE:** The Clipboard API is available in all modern browsers and requires no library. It is asynchronous and resolves immediately, allowing the success confirmation (BR-015) to render within 0.5s. Alternative considered: `document.execCommand('copy')` — deprecated; rejected.
- **NOTES:** Permissions may be required in some browser contexts. Graceful fallback: if the API is unavailable, a textarea pre-selected for manual copy is shown.
- **RELATED:** BR-013, BR-014, BR-015, BR-029, BR-031; PT-014.

---

## AR-014 : VISUAL DESIGN SYSTEM

- **DECISION:** Signal & Noise dark-mode theme (`#0d0f12` background, `#00e5a0` accent, `#e8eaed` text) with a custom CSS design token file. No UI library dependency.
- **RATIONALE:** The Signal & Noise direction (from BRAINSTORM.md) is the selected visual identity. Custom tokens give the graphic asset team full control without fighting library defaults. Alternative considered: Tailwind CSS — rejected at v1 because the token set is small and Tailwind's purge config adds build complexity that is not justified for this scope.
- **NOTES:** All colours are defined as CSS custom properties in `src/styles/tokens.css`. Minimum contrast ratio 4.5:1 (WCAG AA) required for all text.
- **RELATED:** BR-004, BR-012, BR-046; PT-015.
