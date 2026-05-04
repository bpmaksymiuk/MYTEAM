# Parts List — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Architect
- **SOURCE:** `5-ARCHITECTURE-RECOMMENDATIONS.md`

---

## PT-001 : FRONTEND APPLICATION ENTRY POINT

- **DESCRIPTION:** Root React application shell — router, global providers, layout.
- **TECHNOLOGY RECOMMENDATIONS:** React 18, React Router 6, Vite 5, TypeScript 5.
- **NOTES:** Entry: `build/src/main.tsx`. Routes: `/` (Workspace), `/thread` (Thread Composer). No lazy loading at v1 (small bundle).
- **RELATED:** AR-001; BR-003, BR-004.

---

## PT-002 : REWRITE WORKSPACE COMPONENT

- **DESCRIPTION:** Core page view: input area, strategy chip bar, context panel toggle, tile grid.
- **TECHNOLOGY RECOMMENDATIONS:** React 18 functional components. CSS Grid for tile layout.
- **NOTES:** File: `build/src/components/Workspace.tsx`. Manages local submission state; reads global strategy and context state from Zustand stores.
- **RELATED:** AR-001, AR-002; BR-001, BR-002, BR-003, BR-004, BR-007, BR-012, BR-013, BR-016.

---

## PT-003 : GLOBAL STATE STORES

- **DESCRIPTION:** Zustand stores for strategy chip selections, context parameters, session (current rewrite), and tier/user status.
- **TECHNOLOGY RECOMMENDATIONS:** Zustand 4.
- **NOTES:** Files: `build/src/store/strategyStore.ts`, `contextParamsStore.ts`, `sessionStore.ts`, `tierStore.ts`.
- **RELATED:** AR-002; BR-007, BR-008, BR-011, BR-021.

---

## PT-004 : BACKEND API SERVER

- **DESCRIPTION:** Express 5 REST API handling rewrite requests, history, and auth endpoints.
- **TECHNOLOGY RECOMMENDATIONS:** Node.js 20 LTS, Express 5, TypeScript 5.
- **NOTES:** Entry: `build/server/index.ts`. Compiled output: `build/server/dist/`. Environment variables loaded from `.env` (not committed).
- **RELATED:** AR-003; BR-001, BR-002, BR-005, BR-034, BR-046.

---

## PT-005 : REWRITE GENERATION SERVICE

- **DESCRIPTION:** Server-side module that builds per-strategy prompts, calls the OpenAI API, and returns raw rewrite text for all active strategies.
- **TECHNOLOGY RECOMMENDATIONS:** `openai` npm SDK 4.x. Parallel calls via `Promise.all`.
- **NOTES:** File: `build/server/src/services/rewriteService.ts`. Strategy definitions are maintained in `build/server/src/data/strategies.json` — each entry includes the strategy name, system prompt fragment, and technique label for BR-017.
- **RELATED:** AR-003, AR-004; BR-003, BR-005, BR-016, BR-017.

---

## PT-006 : FIDELITY SCORING MODULE

- **DESCRIPTION:** Node.js worker thread that computes semantic similarity between original input and each generated rewrite variation.
- **TECHNOLOGY RECOMMENDATIONS:** `@xenova/transformers` 2.x (all-MiniLM-L6-v2 quantised model). Worker threads via Node.js `worker_threads`.
- **NOTES:** File: `build/server/src/workers/fidelityWorker.ts`. Scores returned as float 0–1, converted to percentage. Cache keyed on (input-hash, output-hash).
- **RELATED:** AR-005; BR-006, BR-019, BR-020.

---

## PT-007 : ETHICS GUARDRAIL MODULE

- **DESCRIPTION:** Two-tier server-side guardrail: blocklist pattern matcher and secondary LLM classification call.
- **TECHNOLOGY RECOMMENDATIONS:** Blocklist: JSON pattern file evaluated with native JS regex. Classifier: OpenAI Chat Completions API (GPT-4o-mini) with a classification prompt.
- **NOTES:** Files: `build/server/src/services/guardrailService.ts`, `build/server/src/data/blocklist.json`. High-severity returns `{ blocked: true, reason: string }`. Low-severity returns `{ advisory: true, label: string }`.
- **RELATED:** AR-006; BR-034, BR-035, BR-036, BR-037.

---

## PT-008 : VALIDATION SCHEMAS

- **DESCRIPTION:** Shared Zod schemas for input validation used on both client (pre-submit) and server (API guard).
- **TECHNOLOGY RECOMMENDATIONS:** `zod` 3.x. Shared via `build/shared/schemas.ts`.
- **NOTES:** Defines: `RewriteInputSchema` (text 50–10000 chars, strategies array, context params). Client imports via relative path. Server imports from the same shared file.
- **RELATED:** AR-007; BR-001, BR-002.

---

## PT-009 : AUTHENTICATION MODULE

- **DESCRIPTION:** Sign-up, sign-in, token issue/refresh, sign-out, and JWT middleware for protected routes.
- **TECHNOLOGY RECOMMENDATIONS:** `jsonwebtoken` 9.x (access tokens), `bcryptjs` 2.x (password hashing), HTTP-only cookies for refresh tokens.
- **NOTES:** Files: `build/server/src/auth/authRouter.ts`, `build/server/src/auth/authMiddleware.ts`. Access token expiry: 15 min. Refresh token expiry: 7 days. Token rotation on refresh.
- **RELATED:** AR-008; BR-039, BR-046.

---

## PT-010 : DATABASE LAYER

- **DESCRIPTION:** Database schema, migrations, and repository modules for users, sessions, variations, and tiers.
- **TECHNOLOGY RECOMMENDATIONS:** `drizzle-orm` 0.30.x with `better-sqlite3` (development) or `pg` 8.x (production) driver. Drizzle Kit for migrations.
- **NOTES:** Schema files: `build/server/src/db/schema.ts`. Migration files: `build/server/src/db/migrations/`. Tables: `users`, `refresh_tokens`, `rewrite_sessions`, `rewrite_variations`, `tier_subscriptions`, `daily_counters`.
- **RELATED:** AR-009; BR-040, BR-041, BR-042, BR-043, BR-044, BR-045, BR-047.

---

## PT-011 : RATE LIMITER MODULE

- **DESCRIPTION:** Server-side daily rewrite counter enforced per user (authenticated) or session fingerprint (unauthenticated).
- **TECHNOLOGY RECOMMENDATIONS:** In-database counter via `daily_counters` table (Drizzle ORM). Reset via `node-cron` 3.x scheduled at UTC midnight.
- **NOTES:** File: `build/server/src/middleware/rateLimiter.ts`. Free tier limit: 5. Pro: limit bypassed. Unauthenticated: 5 (advisory enforcement only — session cookie fingerprint).
- **RELATED:** AR-010; BR-047, BR-048, BR-049, BR-050.

---

## PT-012 : THREAD COMPOSER COMPONENT

- **DESCRIPTION:** Thread Composer view: auto-/manual-segmentation, segment list with drag-reorder, per-segment regeneration, Copy All.
- **TECHNOLOGY RECOMMENDATIONS:** React 18. Drag-and-drop: `@dnd-kit/sortable` 7.x (replaces drag events directly on DOM). Route: `/thread`.
- **NOTES:** File: `build/src/components/ThreadComposer.tsx`. Segmentation util: `build/src/utils/segmentText.ts`. Per-segment LLM regeneration triggers a `POST /api/rewrite/segment` endpoint.
- **RELATED:** AR-011; BR-022, BR-023, BR-024, BR-025, BR-026, BR-027, BR-028, BR-029.

---

## PT-013 : HASHTAG AND TIMING DATA MODULE

- **DESCRIPTION:** Static dataset and server-side endpoint returning 3–5 hashtags and a posting-time range keyed by topic category.
- **TECHNOLOGY RECOMMENDATIONS:** Static JSON dataset. Express route `GET /api/hashtags?category=<category>`.
- **NOTES:** Files: `build/server/src/data/hashtags.json`, `build/server/src/routes/hashtagRouter.ts`. Timing ranges are hardcoded from published X posting-time research. No external API.
- **RELATED:** AR-012; BR-030, BR-031, BR-032, BR-033.

---

## PT-014 : CLIPBOARD UTILITY

- **DESCRIPTION:** Client-side helper wrapping `navigator.clipboard.writeText()` with fallback and success callback for confirmation rendering.
- **TECHNOLOGY RECOMMENDATIONS:** Native browser Clipboard API. Fallback: `textarea` selection method.
- **NOTES:** File: `build/src/utils/clipboard.ts`. Exports `copyToClipboard(text: string): Promise<void>`. Caller handles success state (confirmation animation).
- **RELATED:** AR-013; BR-013, BR-014, BR-015, BR-029, BR-031.

---

## PT-015 : DESIGN TOKEN FILE

- **DESCRIPTION:** CSS custom properties for all colours, spacing, and typography. Single source of truth for the Signal & Noise theme.
- **TECHNOLOGY RECOMMENDATIONS:** CSS custom properties. No preprocessor dependency.
- **NOTES:** File: `build/src/styles/tokens.css`. Imported globally in `main.tsx`. Key tokens: `--color-bg: #0d0f12`, `--color-accent: #00e5a0`, `--color-text: #e8eaed`, `--color-warning: #ffb347`, `--color-danger: #ff4d4d`.
- **RELATED:** AR-014; BR-004, BR-012, BR-046.

---

## PT-016 : HISTORY PANEL COMPONENT

- **DESCRIPTION:** Right-side slide-in panel: session list (reverse-chronological), keyword search, restore action, authentication gate.
- **TECHNOLOGY RECOMMENDATIONS:** React 18. History entries fetched from `GET /api/history` (authenticated endpoint).
- **NOTES:** File: `build/src/components/HistoryPanel.tsx`. Unauthenticated state renders sign-in prompt only. Pagination: 30-entry page size on Free tier; server enforces retention limits.
- **RELATED:** AR-001, AR-002, AR-008, AR-009; BR-039, BR-040, BR-041, BR-042, BR-043, BR-044, BR-045.

---

## PT-017 : TIER STATUS COMPONENT

- **DESCRIPTION:** Persistent tier indicator and daily counter displayed in the workspace header. Upgrade CTA and modal for Free tier users at limit.
- **TECHNOLOGY RECOMMENDATIONS:** React 18. Reads from `tierStore` (Zustand). Upgrade modal is client-rendered, inline — no external payment integration at v1 (placeholder flow).
- **NOTES:** File: `build/src/components/TierStatus.tsx`. Upgrade flow at v1 is a confirmation placeholder — actual payment integration is post-v1. The UI must still satisfy BR-048 reachability (≤ 2 interactions).
- **RELATED:** AR-002, AR-010; BR-046, BR-047, BR-048, BR-049.
