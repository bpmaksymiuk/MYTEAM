# Design Instructions — X-Optimizer / ViralReword

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-04
- **AUTHOR:** Technical Lead
- **SOURCE:** `5-ARCHITECTURE-RECOMMENDATIONS.md`, `5-PARTS LIST.md`, `4-REQUIREMENTS.md`

---

## DI-001 : PROJECT SCAFFOLD — DIRECTORY STRUCTURE

- **SUMMARY:** Create the full directory tree and root configuration files for the monorepo before any code is written.
- **IMPLEMENTATION STEPS:**
  1. Under `build/`, create the following directories if they do not exist: `src/components`, `src/store`, `src/utils`, `src/styles`, `src/data`, `server/src/routes`, `server/src/services`, `server/src/workers`, `server/src/auth`, `server/src/db/migrations`, `server/src/data`, `server/src/middleware`, `shared`.
  2. Create `build/package.json` with `"type": "module"` and the following dev/prod dependencies: `react@18`, `react-dom@18`, `react-router-dom@6`, `zustand@4`, `zod@3`, `@dnd-kit/sortable@7`, `vite@5`, `typescript@5`, `@vitejs/plugin-react`.
  3. Create `build/tsconfig.json` targeting ES2022, with `strict: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`.
  4. Create `build/vite.config.ts` with the React plugin, server proxy for `http://localhost:3001/api` pointing to the Express server.
  5. Create `build/server/package.json` with: `express@5`, `openai@4`, `jsonwebtoken@9`, `bcryptjs@2`, `drizzle-orm@0.30`, `better-sqlite3`, `pg@8`, `zod@3`, `node-cron@3`, `@xenova/transformers@2`, `tsx` (dev), `typescript@5`.
  6. Create `build/server/tsconfig.json` targeting Node 20, `module: "ESNext"`, `moduleResolution: "node"`, `strict: true`.
  7. Create `build/.env.example` with: `OPENAI_API_KEY=`, `JWT_SECRET=`, `JWT_REFRESH_SECRET=`, `DATABASE_URL=./dev.db`, `NODE_ENV=development`.
  8. Add `build/.gitignore` that excludes: `.env`, `*.db`, `node_modules/`, `dist/`, `build/server/dist/`.
- **SKILLSET REQUIRED:** Node.js project configuration, Vite, TypeScript.
- **NOTES:** Do not install packages — only write the package.json files. The Developer runs `npm install` in each sub-directory. No monorepo tooling (nx/turborepo) at v1.
- **RELATED:** AR-001, AR-003; PT-001, PT-004.

---

## DI-002 : DESIGN TOKENS CSS FILE

- **SUMMARY:** Create the CSS custom properties file that provides the Signal & Noise theme tokens to the entire frontend.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/styles/tokens.css`.
  2. Under `:root { }` define these exact custom properties:
     ```
     --color-bg: #0d0f12;
     --color-surface: #1a1d23;
     --color-border: #2a2d35;
     --color-text: #e8eaed;
     --color-text-muted: #888888;
     --color-accent: #00e5a0;
     --color-accent-dim: #00332a;
     --color-warning: #ffb347;
     --color-danger: #ff4d4d;
     --color-info: #4d9fff;
     --radius-sm: 4px;
     --radius-md: 6px;
     --radius-lg: 12px;
     --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
     --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
     --space-xs: 4px;
     --space-sm: 8px;
     --space-md: 16px;
     --space-lg: 24px;
     --space-xl: 40px;
     ```
  3. Add a media query `@media (prefers-reduced-motion: reduce)` that sets `transition: none` on `*`.
  4. Import `tokens.css` as the first import in `build/src/main.tsx`.
- **SKILLSET REQUIRED:** CSS custom properties.
- **NOTES:** All other CSS files use only these custom properties — no hardcoded hex values anywhere else in the codebase.
- **RELATED:** AR-014; PT-015; BR-004.

---

## DI-003 : SHARED ZOD VALIDATION SCHEMAS

- **SUMMARY:** Create the shared Zod validation schemas used by both client and server to validate rewrite input.
- **IMPLEMENTATION STEPS:**
  1. Create `build/shared/schemas.ts`.
  2. Export `StrategyId` as a Zod enum: `z.enum(['hook-first', 'controversy-max', 'authority', 'story-mode', 'minimalist'])`.
  3. Export `ContextParamsSchema`:
     ```typescript
     z.object({
       topicCategory: z.string().max(50).optional(),
       targetAudience: z.string().max(100).optional(),
       toneHint: z.string().max(50).optional(),
       languageVariant: z.string().max(20).optional(),
     })
     ```
  4. Export `RewriteInputSchema`:
     ```typescript
     z.object({
       text: z.string().min(50).max(10000),
       strategies: z.array(StrategyId).min(1).max(5),
       contextParams: ContextParamsSchema.optional(),
     })
     ```
  5. Export `SegmentRegenerateSchema`:
     ```typescript
     z.object({
       segmentText: z.string().min(1).max(280),
       strategyId: StrategyId,
       contextParams: ContextParamsSchema.optional(),
     })
     ```
  6. Export TypeScript types inferred from each schema: `type RewriteInput = z.infer<typeof RewriteInputSchema>` etc.
- **SKILLSET REQUIRED:** Zod, TypeScript.
- **NOTES:** The path `build/shared/schemas.ts` must be resolvable from both `build/src/` (via Vite alias `@shared`) and `build/server/src/` (via relative path `../../shared/schemas.ts`). Configure the Vite alias in `vite.config.ts`: `resolve: { alias: { '@shared': '../shared' } }`.
- **RELATED:** AR-007; PT-008; BR-001, BR-002.

---

## DI-004 : DATABASE SCHEMA AND MIGRATIONS

- **SUMMARY:** Define the Drizzle ORM schema for all tables and generate the initial migration.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/db/schema.ts` with the following tables using Drizzle's `sqliteTable` (or `pgTable` for Postgres — use a conditional export based on `process.env.NODE_ENV`):
     - `users`: `id` (integer primary key autoincrement), `email` (text, unique, not null), `passwordHash` (text, not null), `createdAt` (integer, Unix timestamp, not null).
     - `refreshTokens`: `id` (integer pk), `userId` (integer, FK→users.id, not null), `tokenHash` (text, unique, not null), `expiresAt` (integer, not null), `usedAt` (integer, nullable).
     - `rewriteSessions`: `id` (integer pk), `userId` (integer, FK→users.id, nullable — for unauthenticated sessions store null), `inputText` (text, not null), `strategies` (text — JSON array, not null), `contextParams` (text — JSON object, nullable), `createdAt` (integer, not null).
     - `rewriteVariations`: `id` (integer pk), `sessionId` (integer, FK→rewriteSessions.id, not null), `strategyId` (text, not null), `outputText` (text, not null), `fidelityScore` (real, not null), `annotation` (text, not null), `guardrailStatus` (text — 'ok'|'advisory'|'blocked', not null), `guardrailLabel` (text, nullable).
     - `tierSubscriptions`: `id` (integer pk), `userId` (integer, FK→users.id, unique, not null), `tier` (text — 'free'|'pro', not null, default 'free'), `activatedAt` (integer, nullable).
     - `dailyCounters`: `id` (integer pk), `key` (text, unique, not null — user_<userId> or session_<fingerprint>), `count` (integer, not null, default 0), `date` (text — YYYY-MM-DD, not null).
  2. Create `build/server/src/db/client.ts` that exports a `db` instance: for SQLite use `drizzle(new Database(process.env.DATABASE_URL!))`, for Postgres use `drizzle(new Client({ connectionString: process.env.DATABASE_URL! }))`.
  3. Run `npx drizzle-kit generate:sqlite --schema=src/db/schema.ts --out=src/db/migrations` to generate the initial migration SQL file. Commit the generated migration file.
  4. Create `build/server/src/db/migrate.ts` that calls `migrate(db, { migrationsFolder: './src/db/migrations' })` and is run as a standalone script (`npx tsx src/db/migrate.ts`) before the server starts.
- **SKILLSET REQUIRED:** Drizzle ORM, SQLite, SQL schema design.
- **NOTES:** `NODE_ENV=production` switches the driver to `pg`. The `strategies` column stores a JSON array string. Parse/stringify at the repository layer, never in routes.
- **RELATED:** AR-009; PT-010; BR-040, BR-041, BR-042, BR-043, BR-044, BR-045, BR-047.

---

## DI-005 : AUTHENTICATION MODULE

- **SUMMARY:** Implement sign-up, sign-in, JWT issue/refresh, and sign-out endpoints, plus a middleware guard for protected routes.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/auth/authHelpers.ts`:
     - `hashPassword(plain: string): Promise<string>` — uses `bcryptjs.hash(plain, 12)`.
     - `verifyPassword(plain: string, hash: string): Promise<boolean>` — uses `bcryptjs.compare`.
     - `issueAccessToken(userId: number): string` — signs `{ sub: userId }` with `process.env.JWT_SECRET`, expiry `'15m'`.
     - `issueRefreshToken(userId: number): { token: string; hash: string; expiresAt: number }` — generates 32-byte random hex, hashes with SHA-256 for storage, sets expiry 7 days.
     - `verifyAccessToken(token: string): { sub: number } | null` — wraps `jwt.verify`, returns null on failure.
  2. Create `build/server/src/auth/authRouter.ts` with Express Router:
     - `POST /auth/signup`: validate `{ email, password }` (email format, password ≥ 8 chars via Zod), check email not already registered, hash password, insert user, insert tier subscription (tier='free'), issue access + refresh tokens, set refresh token as HTTP-only cookie (`SameSite=Strict`, `Secure` in production), return `{ accessToken, user: { id, email, tier } }`.
     - `POST /auth/signin`: validate credentials, verify password hash, issue tokens, same cookie, same response shape.
     - `POST /auth/refresh`: read refresh token cookie, look up in DB, verify not expired and not previously used, mark as usedAt=now, issue new refresh token (rotation), return new accessToken and set new cookie.
     - `POST /auth/signout`: delete refresh token from DB, clear cookie, return `204`.
  3. Create `build/server/src/auth/authMiddleware.ts`:
     - Export `requireAuth`: reads `Authorization: Bearer <token>` header, calls `verifyAccessToken`, if valid sets `req.userId = payload.sub`, calls `next()`. If invalid, returns `401 { error: 'Unauthorized' }`.
     - Export `optionalAuth`: same but never returns 401 — if token absent or invalid, sets `req.userId = null` and calls `next()`.
  4. Mount the auth router in `build/server/src/index.ts`: `app.use('/api', authRouter)`.
- **SKILLSET REQUIRED:** JWT, bcrypt, Express routing, HTTP cookies, OWASP authentication best practices.
- **NOTES:** Never log the raw refresh token. Never store the raw token — only the SHA-256 hash. The `Secure` flag on the cookie must be conditional: `process.env.NODE_ENV === 'production'`.
- **RELATED:** AR-008; PT-009; BR-039, BR-046.

---

## DI-006 : RATE LIMITER MIDDLEWARE

- **SUMMARY:** Implement the server-side daily rewrite counter that enforces the Free tier limit of 5 rewrites per day.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/middleware/rateLimiter.ts`.
  2. Export `checkRateLimit(req, res, next)`:
     - Determine the counter key: if `req.userId` is set, key = `user_${req.userId}`; else read a session fingerprint cookie (name: `xopt_fp`, set as HTTP-only if absent, value = 16-byte random hex), key = `session_${fingerprint}`.
     - Get today's date as `YYYY-MM-DD` (UTC).
     - Query `dailyCounters` where `key = key AND date = today`. If no row, insert with count=0.
     - If the user is Pro tier (`req.userTier === 'pro'`), call `next()` immediately.
     - If `count >= 5`, return `429 { error: 'DailyLimitReached', remaining: 0, resetAt: '<next UTC midnight ISO>' }`.
     - Else increment count in DB and call `next()`.
  3. Create `build/server/src/scheduler/resetCounters.ts` using `node-cron`:
     - Schedule `cron.schedule('0 0 * * *', () => { db.delete(dailyCounters).where(lt(dailyCounters.date, today)) })` to clear counters older than today at UTC midnight.
  4. Import and call the scheduler in `build/server/src/index.ts` on server startup.
  5. Apply `checkRateLimit` middleware to the `POST /api/rewrite` route only (not to `/api/rewrite/segment`).
- **SKILLSET REQUIRED:** Express middleware, Drizzle ORM, node-cron, cookie management.
- **NOTES:** `req.userTier` is populated by a separate `loadTier` middleware (see DI-007) that runs before `checkRateLimit` on the rewrite route.
- **RELATED:** AR-010; PT-011; BR-047, BR-048, BR-049, BR-050.

---

## DI-007 : TIER LOADER MIDDLEWARE

- **SUMMARY:** Implement a middleware that attaches the user's tier to each request for use by the rate limiter and tier status endpoint.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/middleware/loadTier.ts`.
  2. Export `loadTier(req, res, next)`:
     - If `req.userId` is null, set `req.userTier = 'free'`, call `next()`.
     - Else query `tierSubscriptions` where `userId = req.userId`. If no row or `tier = 'free'`, set `req.userTier = 'free'`. If `tier = 'pro'`, set `req.userTier = 'pro'`.
     - Call `next()`.
  3. Extend the Express `Request` type in `build/server/src/types/express.d.ts`:
     ```typescript
     declare global {
       namespace Express {
         interface Request {
           userId: number | null;
           userTier: 'free' | 'pro';
         }
       }
     }
     ```
  4. Apply middleware chain to `POST /api/rewrite`: `optionalAuth`, `loadTier`, `checkRateLimit`, then the rewrite handler.
- **SKILLSET REQUIRED:** Express, TypeScript declaration merging.
- **NOTES:** `loadTier` runs after `optionalAuth` so `req.userId` is already set.
- **RELATED:** AR-008, AR-010; PT-009, PT-011; BR-046, BR-047.

---

## DI-008 : FIDELITY SCORING WORKER

- **SUMMARY:** Implement the Node.js worker thread that computes semantic similarity scores between original input and generated rewrites using a transformer model.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/workers/fidelityWorker.ts`:
     - Import `pipeline` from `@xenova/transformers`.
     - On `parentPort.on('message', async ({ inputText, variations }) => { ... })`:
       - Lazily initialise the feature extraction pipeline once: `const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')`.
       - Compute embedding for `inputText`.
       - For each variation in `variations` (array of `{ id, text }`), compute embedding, then compute cosine similarity with the input embedding. Score = `Math.max(0, Math.min(1, similarity))`. Return as percentage rounded to 1 decimal place.
       - Post back `{ scores: Array<{ id, score }> }` via `parentPort.postMessage`.
  2. Create `build/server/src/services/fidelityService.ts`:
     - Export `scoreFidelity(inputText: string, variations: Array<{ id: string; text: string }>): Promise<Array<{ id: string; score: number }>>`.
     - Creates a `Worker` pointed at `fidelityWorker.ts` (using `new Worker(new URL('./workers/fidelityWorker.ts', import.meta.url))`).
     - Posts the message, resolves with the scores on the reply.
     - Cache: maintain an in-memory `Map<string, number>` keyed on `SHA-256(inputText + variationText)`. Check cache before spinning worker.
- **SKILLSET REQUIRED:** Node.js worker_threads, `@xenova/transformers`, cosine similarity calculation.
- **NOTES:** The model download (~22 MB) happens on first invocation. In production, pre-warm the worker on server startup by sending a short dummy message.
- **RELATED:** AR-005; PT-006; BR-006, BR-019, BR-020.

---

## DI-009 : ETHICS GUARDRAIL SERVICE

- **SUMMARY:** Implement the two-tier server-side guardrail that evaluates every rewrite variation before it is returned to the client.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/data/blocklist.json` as an array of objects: `[{ "pattern": "<regex string>", "severity": "high", "reason": "<human-readable reason>" }, ...]`. Include at minimum patterns for: `\\bkill yourself\\b`, `\\bguaranteed (returns|profits)\\b`, `\\bcure (cancer|diabetes|AIDS)\\b`, `\\b100% (safe|effective)\\b` (with medical claim context).
  2. Create `build/server/src/services/guardrailService.ts`:
     - Export type `GuardrailResult = { status: 'ok' } | { status: 'advisory'; label: string } | { status: 'blocked'; reason: string }`.
     - Export `evaluateGuardrail(text: string): Promise<GuardrailResult>`:
       - Load `blocklist.json` once at module load. For each entry, test `new RegExp(entry.pattern, 'i').test(text)`. If any high-severity pattern matches, immediately return `{ status: 'blocked', reason: entry.reason }`.
       - If no high-severity match, call OpenAI Chat Completions with model `gpt-4o-mini` and the system prompt: `"You are an ethics classifier. Reply only with JSON: { advisory: boolean, label: string }. The label must be ≤ 10 words. Mark advisory=true only if the text contains claims that could mislead readers about factual matters (exaggeration, false urgency, misleading statistics). label is empty string when advisory=false."`. User message: the rewrite text.
       - Parse the JSON response. If `advisory: true`, return `{ status: 'advisory', label }`. Else return `{ status: 'ok' }`.
       - On any OpenAI API error in the classifier call, log the error and return `{ status: 'ok' }` (fail-open for advisory tier to avoid blocking the user).
- **SKILLSET REQUIRED:** Node.js, OpenAI SDK, regex, JSON configuration.
- **NOTES:** The blocklist.json file must never be exposed to the client. The classifier is fire-and-forget for advisory cases — the 3s latency budget (BR-005) applies to the first tile; advisory classification may complete later and be pushed via a websocket update in future versions. At v1, all evaluations complete synchronously before the API response is sent.
- **RELATED:** AR-006; PT-007; BR-034, BR-035, BR-036, BR-037.

---

## DI-010 : STRATEGY DEFINITIONS DATA FILE

- **SUMMARY:** Create the server-side JSON data file that defines each rewrite strategy's prompt fragment and technique label.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/data/strategies.json` as an array of 5 objects, each with:
     - `id`: one of `hook-first`, `controversy-max`, `authority`, `story-mode`, `minimalist`.
     - `label`: display name (e.g. `"Hook-First"`).
     - `systemFragment`: a string appended to the base system prompt to activate the strategy's style.
     - `techniqueLabel`: a short string (≤ 5 words) naming the technique (e.g. `"curiosity gap"` for hook-first, `"provocative framing"` for controversy-max, `"cited expertise"` for authority, `"narrative arc"` for story-mode, `"radical brevity"` for minimalist).
  2. Set `systemFragment` values:
     - `hook-first`: `"Rewrite to open with a curiosity-gap hook. Lead with the most surprising element. Do not reveal the answer in the first sentence."`
     - `controversy-max`: `"Rewrite to take a bold, counterintuitive stance. Challenge conventional wisdom. Avoid hateful or discriminatory language."`
     - `authority`: `"Rewrite to emphasise credentials, data, or expert consensus. Use precise figures. Cite the nature of the evidence without fabricating sources."`
     - `story-mode`: `"Rewrite as a brief narrative arc: setup, tension, resolution. Use first or second person."`
     - `minimalist`: `"Rewrite to convey the core idea in the fewest possible words. Target ≤ 140 characters if the idea permits."`
- **SKILLSET REQUIRED:** JSON, copywriting knowledge.
- **NOTES:** The Developer must not modify the strategy IDs — they are the canonical values referenced by `StrategyId` in the Zod schema.
- **RELATED:** AR-004; PT-005; BR-004, BR-017.

---

## DI-011 : REWRITE GENERATION SERVICE

- **SUMMARY:** Implement the server-side service that calls the OpenAI API for each active strategy in parallel and returns structured variation objects.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/services/rewriteService.ts`.
  2. Load `strategies.json` at module load. Map by `id`.
  3. Export `generateRewrites(input: RewriteInput): Promise<Array<RewriteVariation>>` where:
     ```typescript
     type RewriteVariation = {
       strategyId: string;
       outputText: string;
       annotation: string;
       fidelityScore: number;
       guardrailStatus: 'ok' | 'advisory' | 'blocked';
       guardrailLabel?: string;
     }
     ```
  4. Build the base system prompt:
     ```
     "You are an expert X/Twitter post optimizer. Given the input text and the strategy fragment, produce:
     1. A rewritten post optimised for that strategy.
     2. A 'why this works' annotation (max 60 words) referencing the specific technique.
     Respond in JSON: { rewrite: string, annotation: string }
     The rewrite must preserve the original meaning (target ≥ 95% semantic similarity). Do not add fictional facts."
     ```
  5. For each active `strategyId` in `input.strategies`, call OpenAI Chat Completions (`gpt-4o`, temperature 0.7) with:
     - System: base prompt + strategy systemFragment + (if contextParams present) `"Context: topic=${topicCategory}, audience=${targetAudience}, tone=${toneHint}, language=${languageVariant}."`.
     - User: `input.text`.
     - Response format: `{ response_format: { type: 'json_object' } }`.
  6. Run all strategy calls via `Promise.all`.
  7. Parse each response. Extract `rewrite` and `annotation`. If parse fails, set `outputText = ''` and `annotation = 'Generation failed.'`, set `guardrailStatus = 'blocked'`, `guardrailLabel = 'Response parsing error'`.
  8. For each successful variation, call `evaluateGuardrail(rewrite)`. Merge the result into the variation object.
  9. For each variation where guardrailStatus ≠ 'blocked', call `scoreFidelity(input.text, [{ id: strategyId, text: rewrite }])` and set `fidelityScore`. For blocked variations, set `fidelityScore = 0`.
  10. Return the completed array.
- **SKILLSET REQUIRED:** OpenAI SDK, Promise.all, JSON parsing, error handling.
- **NOTES:** All three operations (LLM call, guardrail, fidelity scoring) are run per-variation. LLM calls are parallelised across strategies (step 6). Guardrail and fidelity run sequentially per variation after the LLM call resolves.
- **RELATED:** AR-004, AR-005, AR-006; PT-005, PT-006, PT-007; BR-003, BR-005, BR-006, BR-016, BR-017, BR-034.

---

## DI-012 : REWRITE API ROUTE

- **SUMMARY:** Implement the `POST /api/rewrite` Express route that validates input, enforces limits, calls the rewrite service, saves the session, and returns results.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/routes/rewriteRouter.ts`.
  2. Register `POST /rewrite` with middleware chain: `[optionalAuth, loadTier, checkRateLimit]`.
  3. In the route handler:
     - Parse and validate request body against `RewriteInputSchema`. On failure, return `400 { error: 'ValidationError', details: zodError.flatten() }`.
     - Call `generateRewrites(validatedInput)`.
     - If user is authenticated, insert a `rewriteSessions` row and one `rewriteVariations` row per variation.
     - Return `200 { sessionId: string | null, variations: RewriteVariation[] }`.
  4. Register `POST /rewrite/segment` for per-segment thread regeneration:
     - Validate against `SegmentRegenerateSchema`.
     - Look up the strategy by `strategyId`, call OpenAI with the strategy fragment.
     - Evaluate guardrail. Score fidelity.
     - Return `200 { variation: RewriteVariation }`.
  5. Mount router in `build/server/src/index.ts`: `app.use('/api', rewriteRouter)`.
- **SKILLSET REQUIRED:** Express routing, Zod, async error handling.
- **NOTES:** Wrap the entire handler in try/catch. On unexpected errors return `500 { error: 'InternalError' }` — never expose stack traces.
- **RELATED:** AR-003; PT-004, PT-005; BR-001, BR-002, BR-003, BR-005.

---

## DI-013 : HISTORY API ROUTES

- **SUMMARY:** Implement the history endpoints: list, search, and restore session.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/routes/historyRouter.ts`.
  2. All routes apply `requireAuth` middleware (authenticated users only — BR-039).
  3. `GET /history`:
     - Query `rewriteSessions` for the authenticated user, ordered by `createdAt DESC`.
     - Free tier: `LIMIT 30`. Pro tier: no limit.
     - Return array of `{ id, inputText: inputText.slice(0, 100), createdAt, strategyCount }`.
  4. `GET /history/search?q=<keyword>`:
     - Query `rewriteSessions` where `inputText LIKE '%<sanitised keyword>%'` for the authenticated user.
     - Apply same tier-based limit.
     - Return same shape as GET /history.
  5. `GET /history/:sessionId`:
     - Query `rewriteSessions` and its `rewriteVariations` for the given sessionId, scoped to `req.userId`.
     - Return `{ id, inputText, strategies, contextParams, createdAt, variations: RewriteVariation[] }`.
     - Return `404` if session not found or does not belong to the user.
  6. Mount router: `app.use('/api', historyRouter)`.
- **SKILLSET REQUIRED:** Express, Drizzle ORM, SQL parameterised queries.
- **NOTES:** The LIKE query in search must use parameterised binding — never string concatenation — to prevent SQL injection.
- **RELATED:** AR-009; PT-010, PT-016; BR-039, BR-040, BR-041, BR-042, BR-043, BR-044, BR-045.

---

## DI-014 : HASHTAG AND TIMING API ROUTE

- **SUMMARY:** Implement the endpoint that returns 3–5 hashtag suggestions and a posting time range for a given topic category.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/data/hashtags.json` as an object keyed by category name (lowercase, matching `topicCategory` context param values):
     ```json
     {
       "technology": { "hashtags": ["#tech", "#innovation", "#AI", "#startup", "#coding"], "postingWindow": "08:00–10:00 UTC" },
       "finance": { "hashtags": ["#investing", "#finance", "#markets", "#wealth", "#stocks"], "postingWindow": "07:00–09:00 UTC" },
       "health": { "hashtags": ["#health", "#wellness", "#fitness", "#mentalhealth", "#nutrition"], "postingWindow": "07:00–09:00 UTC" },
       "marketing": { "hashtags": ["#marketing", "#growth", "#branding", "#socialmedia", "#SEO"], "postingWindow": "09:00–11:00 UTC" },
       "general": { "hashtags": ["#trending", "#viral", "#perspective", "#insight", "#thread"], "postingWindow": "12:00–14:00 UTC" }
     }
     ```
  2. Create `build/server/src/routes/hashtagRouter.ts`.
  3. `GET /hashtags?category=<category>`:
     - Read `category` query param. Normalise to lowercase. Look up in hashtags.json. If not found, use `"general"` as fallback.
     - Return `{ hashtags: string[3-5], postingWindow: string }`.
  4. Mount: `app.use('/api', hashtagRouter)`.
- **SKILLSET REQUIRED:** Express, JSON file reading.
- **NOTES:** No authentication required. No external API call. `postingWindow` is a static string in HH:MM–HH:MM UTC format (BR-033).
- **RELATED:** AR-012; PT-013; BR-030, BR-031, BR-032, BR-033.

---

## DI-015 : ZUSTAND STORES

- **SUMMARY:** Implement the four client-side Zustand stores for strategy state, context params, current session, and tier/user status.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/store/strategyStore.ts`:
     ```typescript
     type StrategyStore = {
       activeStrategies: Set<StrategyId>;
       toggle: (id: StrategyId) => void;
     }
     ```
     Initial state: all 5 strategies active. `toggle`: if removing the last strategy, do nothing (BR-009). Else toggle.
  2. Create `build/src/store/contextParamsStore.ts`:
     ```typescript
     type ContextParamsStore = {
       params: ContextParams;
       setParam: (key: keyof ContextParams, value: string) => void;
       clearAll: () => void;
       hasActiveParams: () => boolean;
     }
     ```
     `hasActiveParams` returns true if any param is non-empty (BR-012).
  3. Create `build/src/store/sessionStore.ts`:
     ```typescript
     type SessionStore = {
       inputText: string;
       variations: RewriteVariation[];
       isLoading: boolean;
       error: string | null;
       setInput: (text: string) => void;
       setVariations: (v: RewriteVariation[]) => void;
       setLoading: (v: boolean) => void;
       setError: (e: string | null) => void;
       updateVariation: (strategyId: string, patch: Partial<RewriteVariation>) => void;
     }
     ```
     `updateVariation` replaces only the matching tile, leaving others unchanged (BR-021).
  4. Create `build/src/store/tierStore.ts`:
     ```typescript
     type TierStore = {
       userId: number | null;
       tier: 'free' | 'pro';
       remaining: number;
       setUser: (userId: number, tier: 'free' | 'pro') => void;
       decrementRemaining: () => void;
       setTier: (tier: 'free' | 'pro') => void;
     }
     ```
- **SKILLSET REQUIRED:** Zustand, TypeScript.
- **NOTES:** Stores are session-scoped (in-memory). No localStorage persistence at v1.
- **RELATED:** AR-002; PT-003; BR-007, BR-008, BR-009, BR-011, BR-012, BR-021.

---

## DI-016 : STRATEGY CHIP BAR COMPONENT

- **SUMMARY:** Implement the row of five strategy chip toggles with minimum-active enforcement.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/components/StrategyChipBar.tsx`.
  2. Render 5 chips in a flex row. Each chip shows the strategy label. Active chips have `background: var(--color-accent)`, `color: var(--color-bg)`. Inactive chips: `background: var(--color-surface)`, `color: var(--color-text-muted)`, `border: 1px solid var(--color-border)`.
  3. On click, call `strategyStore.toggle(id)`.
  4. If `strategyStore.activeStrategies.size === 1`, the single remaining chip must display a lock indicator (e.g. a padlock icon) and its click must be a no-op (BR-009). Show an inline warning `<span>` beneath the chip bar: `"At least one strategy must be active."` This span is visible only when a no-op click was attempted and disappears after 3 seconds.
  5. Chips are rendered in fixed order: Hook-First, Controversy-Max, Authority, Story-Mode, Minimalist.
- **SKILLSET REQUIRED:** React, CSS custom properties.
- **NOTES:** Do not use a modal for the warning — it must be an inline element (BR-009).
- **RELATED:** AR-001, AR-002; PT-002; BR-007, BR-008, BR-009.

---

## DI-017 : CONTEXT PARAMS PANEL COMPONENT

- **SUMMARY:** Implement the collapsible context parameters panel with four fields and an active-state indicator.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/components/ContextParamsPanel.tsx`.
  2. Render a toggle button (gear icon + label "Context") that shows/hides the panel. If `contextParamsStore.hasActiveParams()` is true, render a green dot badge on the toggle button (BR-012).
  3. The panel contains 4 fields, each a labelled `<select>` or `<input>`:
     - `topicCategory`: `<select>` with options: (empty), Technology, Finance, Health, Marketing, General.
     - `targetAudience`: `<input type="text" maxLength={100} placeholder="e.g. early-stage founders">`.
     - `toneHint`: `<select>` with options: (empty), Professional, Conversational, Urgent, Inspirational.
     - `languageVariant`: `<select>` with options: (empty), en-US, en-GB, en-AU.
  4. Each field calls `contextParamsStore.setParam(key, value)` on change.
  5. Panel state (open/closed) is local React state — not in Zustand.
- **SKILLSET REQUIRED:** React, CSS.
- **NOTES:** Panel is accessible: all fields have associated `<label>` elements with `htmlFor`. Panel closes on Escape key.
- **RELATED:** AR-001, AR-002; PT-002; BR-010, BR-011, BR-012.

---

## DI-018 : REWRITE TILE COMPONENT

- **SUMMARY:** Implement the individual rewrite variation tile with fidelity badge, annotation, copy button, tone slider, and guardrail states.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/components/RewriteTile.tsx`. Props: `{ variation: RewriteVariation; onToneChange: (strategyId: string, tone: number) => void }`.
  2. Render structure (top-to-bottom):
     - Strategy label (small caps, muted).
     - Fidelity score badge: `≥ 95` → green (`var(--color-accent)`), `90–94` → amber (`var(--color-warning)`), `< 90` → red (`var(--color-danger)`).
     - Rewrite text body (or blocked state — see step 6).
     - Character count (below the text).
     - "Why this works" annotation in a collapsible section (collapsed by default, expands on click).
     - Tone slider: `<input type="range" min={0} max={100} step={10}>`. On change (debounced 300ms), call `onToneChange(variation.strategyId, value)`.
     - Copy button (bottom right).
  3. Implement copy with `copyToClipboard(variation.outputText)` (from PT-014). On success, set local state `copied = true` for 3 seconds, rendering a "✓ Copied" label over the button (BR-015).
  4. Character count = `variation.outputText.length` displayed as `"N chars"` (BR-014).
  5. If `fidelityScore < 95` and `guardrailStatus === 'ok'`, show the amber fidelity badge with a tooltip: `"Meaning fidelity below 95% — review before posting."` (BR-006).
  6. Blocked state (`guardrailStatus === 'blocked'`): replace rewrite text body with `"⛔ This variation was blocked."` + `guardrailLabel` (BR-036). Copy button is disabled (`disabled`, `aria-disabled="true"`) (BR-037). Fidelity badge shows `"—"`.
  7. Advisory state (`guardrailStatus === 'advisory'`): render text normally. Show an amber advisory label below the annotation: `"⚠ " + guardrailLabel` (BR-035). Copy button remains enabled (BR-035).
  8. Transparency toggle: this is a global toggle rendered in the workspace header (see DI-019). When enabled, `copyToClipboard` appends `\n\n[AI-optimised version]` to the copied text (BR-038).
- **SKILLSET REQUIRED:** React, debounce, CSS.
- **NOTES:** The annotation must never exceed 60 words — truncate client-side if the API returns longer text and log a warning to the console.
- **RELATED:** AR-001, AR-002; PT-002; BR-004, BR-006, BR-013, BR-014, BR-015, BR-016, BR-017, BR-018, BR-019, BR-035, BR-036, BR-037, BR-038.

---

## DI-019 : WORKSPACE PAGE COMPONENT

- **SUMMARY:** Assemble the full Workspace page that composes the input area, strategy chip bar, context panel, tile grid, tier status header, and transparency toggle.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/components/Workspace.tsx`.
  2. Layout: header bar (top), input area (left), tile grid (right). Use CSS Grid: `grid-template-columns: 380px 1fr`. On viewport < 900px, collapse to single column.
  3. Header bar contains (left to right): app logo/name, transparency toggle (checkbox + label "Mark as AI-optimised"), tier status component (PT-017 via `build/src/components/TierStatus.tsx`), history button.
  4. Input area: `<textarea>` bound to `sessionStore.inputText`. Below it: character counter `"N / 10,000"`. Above the submit button: the StrategyChipBar (DI-016) and ContextParamsPanel (DI-017).
  5. Submit button: label "Rewrite". On click:
     - Run client-side Zod validation (`RewriteInputSchema`). On failure, display inline error below the textarea.
     - Set `sessionStore.setLoading(true)`.
     - POST to `/api/rewrite` with `{ text, strategies: [...activeStrategies], contextParams }`.
     - On `429` response: display the daily limit banner (see DI-020). Do not call `setLoading(false)` until the error is handled.
     - On `200`: call `sessionStore.setVariations(data.variations)`. Call `tierStore.decrementRemaining()`.
     - On other error: call `sessionStore.setError('An error occurred. Please try again.')`.
     - Always call `sessionStore.setLoading(false)` in the finally block.
  6. Tile grid: map `sessionStore.variations` to `<RewriteTile>` components. Pass `onToneChange` that calls `sessionStore.updateVariation` and triggers a `POST /api/rewrite/segment` for the changed tile only (BR-021).
  7. If `inputText.length > 280`, render a "Switch to Thread mode" banner above the tile grid that links to `/thread?text=<encodedText>`.
  8. If `sessionStore.isLoading`, render a skeleton loader in the tile grid (4 placeholder tiles with pulse animation).
- **SKILLSET REQUIRED:** React, CSS Grid, async fetch, Zustand.
- **NOTES:** Pass transparency toggle state as React state (not Zustand) into each `RewriteTile` via prop drilling — it does not need to be global.
- **RELATED:** AR-001, AR-002; PT-002; BR-001, BR-002, BR-003, BR-005, BR-007, BR-012, BR-021, BR-022.

---

## DI-020 : TIER STATUS AND UPGRADE COMPONENT

- **SUMMARY:** Implement the persistent tier indicator, daily limit banner, and upgrade modal.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/components/TierStatus.tsx`. Props: none (reads from `tierStore`).
  2. Render in header: `"FREE TIER"` or `"PRO"` label + remaining count `"N/5 today"` (Free) or `"Unlimited"` (Pro).
  3. When the Workspace POST returns 429:
     - Show an inline banner above the submit button: `"You've used your 5 free rewrites today. Resets at midnight UTC · "` + a link `"Upgrade to Pro →"`.
     - Disable the submit button.
  4. The "Upgrade to Pro" link opens an upgrade modal (local React state).
  5. Upgrade modal contains:
     - Free tier column: features list (5 rewrites/day, 30-session history), "Current plan" label.
     - Pro tier column (highlighted with `var(--color-accent)` border): Unlimited rewrites, unlimited history, $9/month.
     - "Confirm upgrade — $9/month" button. At v1 this button calls `POST /api/tier/upgrade` (placeholder endpoint that sets `tier = 'pro'` in DB without payment). After success, call `tierStore.setTier('pro')` and close modal.
  6. The upgrade flow must be reachable in ≤ 2 interactions from the limit banner: interaction 1 = click "Upgrade to Pro →", interaction 2 = click "Confirm upgrade" (BR-048).
- **SKILLSET REQUIRED:** React, CSS, fetch.
- **NOTES:** The upgrade endpoint `POST /api/tier/upgrade` must be implemented server-side: `requireAuth` middleware, then update `tierSubscriptions` set `tier = 'pro'` for `req.userId`. Return `204`.
- **RELATED:** AR-010; PT-017; BR-046, BR-047, BR-048, BR-049.

---

## DI-021 : CLIPBOARD UTILITY

- **SUMMARY:** Implement the client-side clipboard helper with Clipboard API and fallback.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/utils/clipboard.ts`.
  2. Export `async function copyToClipboard(text: string): Promise<void>`:
     - If `navigator.clipboard?.writeText` is available, call it and await.
     - Fallback: create a `<textarea>`, set its value, append to body, call `.select()`, call `document.execCommand('copy')`, remove the textarea.
     - Both paths must resolve the promise on success, reject on failure.
  3. Export `function buildCopyText(text: string, hashtags: string[], transparencyEnabled: boolean): string`:
     - Start with `text`.
     - If `hashtags.length > 0`, append `'\n' + hashtags.join(' ')`.
     - If `transparencyEnabled`, append `'\n\n[AI-optimised version]'`.
     - Return the composed string.
- **SKILLSET REQUIRED:** TypeScript, DOM APIs.
- **NOTES:** `buildCopyText` is called in `RewriteTile` when the copy button is clicked — the tile fetches hashtags from the API then calls `copyToClipboard(buildCopyText(...))`.
- **RELATED:** AR-013; PT-014; BR-013, BR-014, BR-015, BR-029, BR-031, BR-038.

---

## DI-022 : HISTORY PANEL COMPONENT

- **SUMMARY:** Implement the right-side slide-in History panel with session list, search, restore, and authentication gate.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/components/HistoryPanel.tsx`. Props: `{ isOpen: boolean; onClose: () => void }`.
  2. Render as a fixed right-side panel (`position: fixed; right: 0; top: 0; height: 100%; width: 340px`) with slide-in animation (`transform: translateX(0)` when open, `translateX(100%)` when closed, `transition: transform 0.25s ease`).
  3. If `tierStore.userId === null`, render only: a lock icon, `"Sign in to view your history"`, and a sign-in button (links to auth flow).
  4. If authenticated:
     - Render a search input at the top. On change (debounced 400ms), fetch `GET /api/history/search?q=<term>`. On empty, fetch `GET /api/history`.
     - Render session list: each entry shows the truncated input (100 chars) and `createdAt` date formatted as `"DD Mon YYYY"`.
     - On entry click, fetch `GET /api/history/:sessionId`, then call `sessionStore.setInput(session.inputText)` and `sessionStore.setVariations(session.variations)`. Close the panel.
  5. Close on Escape key and on overlay click.
- **SKILLSET REQUIRED:** React, CSS transforms, fetch, keyboard events.
- **NOTES:** Fetch history on panel open, not on app load. Show a loading spinner during fetch. Show `"No history yet."` if the array is empty.
- **RELATED:** AR-001, AR-009; PT-016; BR-039, BR-040, BR-041, BR-042, BR-043.

---

## DI-023 : THREAD COMPOSER COMPONENT

- **SUMMARY:** Implement the Thread Composer view at `/thread` with auto-segmentation, drag-reorder, per-segment regeneration, and Copy All.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/utils/segmentText.ts`. Export `segmentText(text: string, maxChars: number = 280): string[]`:
     - Split on sentence boundaries (`. `, `! `, `? `) while keeping the punctuation.
     - Accumulate sentences into the current segment until adding the next would exceed `maxChars`.
     - Force-split sentences longer than `maxChars` at the last word boundary before the limit.
     - Return an array of segments, each ≤ `maxChars` characters.
  2. Create `build/src/components/ThreadComposer.tsx`. Read `inputText` from URL query param `?text=` (decode URI component).
  3. On mount, call `segmentText(inputText)`. The first segment is the hook tweet (render with amber top border + "Hook" label).
  4. Render the segment list using `@dnd-kit/sortable`. Each segment card shows:
     - Segment number `n/total` (updated on reorder).
     - Editable `<textarea>` containing the segment text.
     - Character count `"N / 280"`, coloured red if `N > 280`.
     - A regenerate button. On click, POST to `/api/rewrite/segment` with `{ segmentText, strategyId: 'hook-first' (for hook), else 'story-mode' }`. On response, replace only that segment's text.
  5. Implement drag-reorder: on `DragEndEvent`, reorder the segments array and recompute numbering.
  6. Render a sticky "Copy All" button at the bottom. On click, call `copyToClipboard(segments.join('\n\n'))`.
  7. Render a "← Back to Workspace" link that navigates to `/`.
- **SKILLSET REQUIRED:** React, `@dnd-kit/sortable`, fetch.
- **NOTES:** The Thread Composer is a client-side-only route. No session saving for thread compositions at v1.
- **RELATED:** AR-011; PT-012; BR-022, BR-023, BR-024, BR-025, BR-026, BR-027, BR-028, BR-029.

---

## DI-024 : EXPRESS SERVER ENTRY POINT AND STARTUP

- **SUMMARY:** Implement the main Express server file that wires all routers, middleware, and scheduler.
- **IMPLEMENTATION STEPS:**
  1. Create `build/server/src/index.ts`.
  2. Initialise Express app:
     ```typescript
     const app = express();
     app.use(express.json({ limit: '50kb' }));
     app.use(cookieParser());
     ```
  3. Mount routers in order: `authRouter` (`/api`), `rewriteRouter` (`/api`), `historyRouter` (`/api`), `hashtagRouter` (`/api`).
  4. Add a `POST /api/tier/upgrade` route (inline in index.ts for brevity): `requireAuth`, update `tierSubscriptions`, return 204.
  5. Add a global error handler `(err, req, res, next)` that logs the error server-side and returns `500 { error: 'InternalError' }`. Never include `err.stack` or `err.message` in the response.
  6. Import and call `startResetScheduler()` from `build/server/src/scheduler/resetCounters.ts`.
  7. Import and call `prewarmFidelityWorker()` from `build/server/src/services/fidelityService.ts` (sends a dummy message to initialise the model on startup).
  8. Call `app.listen(process.env.PORT ?? 3001, () => console.log('Server started'))`.
  9. Ensure CORS is configured: allow `http://localhost:5173` (Vite dev server) with `credentials: true`. In production, set allowed origin to the production domain from `process.env.ALLOWED_ORIGIN`.
- **SKILLSET REQUIRED:** Express, CORS, cookie-parser, TypeScript.
- **NOTES:** Do not serve static files from the Express server — Vite serves the frontend in dev, and a separate static host serves it in production.
- **RELATED:** AR-003; PT-004; BR-005, BR-034.

---

## DI-025 : MAIN REACT ENTRY AND ROUTING

- **SUMMARY:** Implement the React app entry point, routing, and global CSS import.
- **IMPLEMENTATION STEPS:**
  1. Create `build/src/main.tsx`:
     ```tsx
     import './styles/tokens.css';
     import React from 'react';
     import { createRoot } from 'react-dom/client';
     import { BrowserRouter, Routes, Route } from 'react-router-dom';
     import Workspace from './components/Workspace';
     import ThreadComposer from './components/ThreadComposer';

     createRoot(document.getElementById('root')!).render(
       <React.StrictMode>
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<Workspace />} />
             <Route path="/thread" element={<ThreadComposer />} />
           </Routes>
         </BrowserRouter>
       </React.StrictMode>
     );
     ```
  2. Create `build/index.html`:
     ```html
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>ViralReword</title>
       </head>
       <body>
         <div id="root"></div>
         <script type="module" src="/src/main.tsx"></script>
       </body>
     </html>
     ```
  3. Create `build/src/vite-env.d.ts` with `/// <reference types="vite/client" />`.
- **SKILLSET REQUIRED:** React 18, React Router 6, Vite.
- **NOTES:** The `#root` div must exist before any script runs — it is in `index.html`. No server-side rendering at v1.
- **RELATED:** AR-001; PT-001; BR-003.

---

## Exit Gate

- [x] Every BR/AR pair has at least one DI.
- [x] Every DI has all five schema sections (SUMMARY, IMPLEMENTATION STEPS, SKILLSET REQUIRED, NOTES, RELATED).
- [x] No DI contains "TBD", placeholder text, or steps that defer work to the Developer's judgment.
- [x] Every file path in implementation steps is complete and relative to `build/`.
- [x] DI IDs are sequential (DI-001 through DI-025) and non-reused.
- [x] RELATED fields reference valid BR-IDs, AR-IDs, and PT-IDs.
- [x] `PIPELINE-STATUS.md` is updated for Stage 6 with STATUS and STATUS UPDATED date.
