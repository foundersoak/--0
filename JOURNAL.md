# Undefeated — Development Journal

A running log of notable changes. **Newest first.** Each entry notes *what* changed, *why*, and the
commit it landed in. This file is updated as part of every change going forward.

---

## 2026-06-09

### Leaderboard: support REDIS_URL (any Redis), not just Upstash REST
- The store connected on Vercel only exposed `REDIS_URL`, but the code expected the Upstash REST API
  vars, so it silently fell back to in-memory. `lib/leaderboard.ts` now auto-selects a backend:
  Upstash REST → **Redis over TCP via ioredis (`REDIS_URL`/`KV_URL`)** → in-memory. Added
  `serverExternalPackages: ["ioredis"]` so the client is required at runtime, not bundled.

### Browsable leaderboard page
- New **`/[sport]/leaderboard`** page (`LeaderboardView`) with mode tabs (Casual/Expert/Daily) so
  anyone can check standings without finishing a game. Added a **Leaderboard** nav link to the game
  header and a "View full leaderboard →" link on the result screen. Previously the board only
  appeared post-game, so it was undiscoverable.

### Visual polish + UX feedback
- **Slot-machine reel**: spinning now flashes random franchises and decelerates onto your draw
  (`SlotReel`); pulsing ring + bigger Spin button.
- **Result reveal**: animated count-up on the record + a confetti burst on an undefeated season.
- **Mode renames** (clearer, sport-agnostic): Classic→**Casual**, Hoop IQ→**Expert** (ids kept stable
  so saved scores/leaderboard keys don't break); Daily unchanged.
- **Bigger fonts + more tactile**: larger player names, hover-lift on player cards, bigger mode tabs,
  filled-slot highlight on the roster board.
- **Ads hidden until real**: `AdSlot` renders nothing unless `NEXT_PUBLIC_ENABLE_ADS=true` (no more
  empty "Advertisement" box).
- **Leaderboard KV-compat**: accepts either `KV_REST_API_*` or `UPSTASH_REDIS_REST_*` env names.

### Deploy hardening (Vercel)
- Confirmed production auto-deploys from this branch (Vercel dashboard shows every commit "Ready" in
  ~30s; `be7410e` is live).
- Added `vercel.json` pinning `framework: nextjs` + pnpm frozen install + `next build` (matches
  Vercel's auto-detected defaults, so it's a no-op for the working build but makes settings explicit).
- Added `.env.example` documenting the optional KV leaderboard vars, plus a `!.env.example` gitignore
  exception so it's tracked.
- Created a stable **`main`** branch as the long-term production line so this branch can be used for
  preview deploys. To activate: set the Vercel Production Branch (and GitHub default) to `main`; ship
  to prod by merging this branch → `main`.

### Global leaderboard (server-verified, KV-ready)
- `GET/POST /api/leaderboard` (`app/api/leaderboard/route.ts`) + `lib/leaderboard.ts`: per
  sport/mode/day boards; `Leaderboard` component (handle + submit + top 20) on the result screen.
- **Anti-cheat**: POST re-simulates the submitted roster server-side and enforces era diversity, so
  the stored record is the engine's truth — fake scores are rejected. Verified in-process: valid
  roster → 200 (82-0, S); 5 same-era → 400; unknown player → 400; GET returns the stored entry.
- Storage uses **Vercel KV / Upstash REST** when `KV_REST_API_URL` + `KV_REST_API_TOKEN` are set,
  else an in-memory dev fallback. Going live globally = add a free KV store + those env vars (no code
  change).

### Branding → blankand0 + dynamic OG share cards
- Rebranded the hub to **blankand0** (`lib/brand.ts`, `metadataBase` → https://blankand0.vercel.app)
  to match the live Vercel deploy.
- **Self-contained share cards**: a finished result encodes into a URL-safe base64 card
  (`encodeCard`/`decodeCard` in `lib/share.ts`), so a new `/[sport]/share/[code]` page + a `next/og`
  `opengraph-image` render a rich **1200×630 PNG** (record, grade, green/red category pattern, full
  roster) with **no dataset load** at request time.
- Verified end-to-end against the production server: OG route returns `200 image/png` (53KB, valid
  PNG), and the share page emits `og:image` / `og:title` / `twitter:card` pointing at the absolute URL.

### "One that got away" + Undo (post-game polish, both improvements on the original)
- After a non-perfect game, `ResultPanel` replays your passed-over candidates (tracked in
  `GameBoard`) to name the best player you skipped for your weakest/capped category — e.g. capped by
  Steals → "Maurice Cheeks (2.3 SPG) was on your board." Real "one more try" fuel.
- **Undo last pick** (`UNDO` engine action + button) — works even from the result screen; the
  original has no undo. Covered by a new engine test (8 total).

### Local leaderboard + Daily streak (`src/lib/store.ts`)
- **Personal bests + recent runs** per sport/mode, surfaced as a "Your runs" panel on the result
  screen (`RunHistory`), plus a "New personal best" badge.
- **Daily streak**: completing the Daily bumps a 🔥 streak (consecutive days); only the first
  completion each day counts, and a banner flags when today's board is already done.
- All localStorage + SSR-safe. A global leaderboard can layer on later via a serverless route + KV.

### Game modes + live category meters (making it *better*, not a copy)
- **Three modes** (`src/lib/modes.ts`, `ModeTabs`): **Classic** (full stats + live meters),
  **Hoop IQ** (stats *and* meters hidden — a pure-knowledge hard mode), **Daily** (one shared board
  per UTC day, seeded by date).
- **Live category meters** (`LiveMeters`) — our improvement on the original: reuse the real
  partial-lineup simulation so you watch each of the five floors turn green as you draft, instead of
  only learning you failed at the very end.
- **Wordle-style spoiler-free share** (`shareGrid` in `lib/share.ts`): 🟩/🟥 per category + the
  record, with a Daily date tag — the emoji grid was the actual viral engine behind Wordle.
- Threaded `hideStats` / `liveMeters` through GameClient → GameBoard → CandidateList / PlayerCard.

### NBA data-quality fixes — found by playtesting / reviewing
- **Positions tightened:** coarse "F"/"C-F" no longer makes centers eligible at small forward
  (174 → 0; e.g. Joel Embiid is now C-only). A guard-forward maps to the wing (SG/SF) instead of all
  four perimeter slots, so players can only be placed where they actually played.
- **Pre-1974 steals/blocks:** imputation now covers the early 1970s as well as the 1960s (344 1970s
  players previously carried 0 → now 0), so "Steals" is no longer an artificial bottleneck.
- **Name truncation:** corrected recognizable 3-word names the historical source truncated
  (Joe Barry Carroll, Metta World Peace, Nick Van Exel, Michael Ray Richardson, World B. Free).
- *Why:* a deep review of both 82-0 versions + a few played games surfaced these; fixes keep the NBA
  feel honest before fanning out to other leagues.

## 2026-06-08

### Journal added
- Created this `JOURNAL.md` to track all changes now and going forward.

### Playtest polish + README — `90571ba`
- **Candidate picker** now scrolls within a fixed height and shows a "*N players · pick one · best
  first*" caption, so the deep (up to 50/spin) rosters stay tidy and the spin/reroll controls stay in
  view.
- Replaced the scaffold **README** with real run/test/ETL/deploy (Vercel) instructions + an
  architecture map.
- *Why:* user paused new leagues to **playtest NBA first**; this makes the deep data pleasant to use
  and the app easy to run/deploy.

### Deep NBA dataset via open-data ETL + franchise relocation handling — `03a7f49`
- Added a build-time ETL (`scripts/etl/nba.ts`) that ingests permissively-available open data
  (Kaggle "NBA Seasons Stats" 1950–2017 via peasant98/TheNBACSV, Brescou per-game 1996–2023, and
  the 2023–24 NocturneBear box scores — **no Sports-Reference**), buckets every player by
  team+decade, and keeps the top ~50 per bucket by production.
- Result: **8,113 players** with real roster depth — **~36/team in the 1960s up to 50/team in the
  2000s–2010s** (2020s ≈ 34, limited by elapsed seasons; auto-deepens over time).
- Mapped historical team abbreviations → stable franchise slugs; expanded to **all 30 franchises**
  with **era-keyed aliases** so relocations/renames always show the period-correct name (1990s OKC →
  *Seattle SuperSonics*, 1960s WAS → *Baltimore Bullets*, etc.) and **no team appears before it
  existed** (the data simply has no bucket for it).
- Pre-1974 steals/blocks imputed (untracked era). Retuned scoring/gating to the decade-average scale
  (stacked all-time fives go 82-0; good lineups land mid-pack; one-dimensional rosters get gated).
- *Why:* user required **20–30 players/team for older decades, 40–50 for recent** — only achievable
  via bulk open-data ETL, not hand-curation; and **correct franchise relocation/era handling**.

### Engine + NBA flagship — `977f7a5`
- **Framework-agnostic game engine** (`src/engine`): `types` (the `SportConfig` contract), seedable
  `rng` (enables shareable boards + daily challenge), `state` machine (spin / reroll / pick with
  validity invariants), and `simulate` (era adjustment → per-category **gating** → non-linear win
  curve). 7 passing Vitest tests.
- **NBA `82-0`** as the reference sport: config (positions, eras, franchises, scoring) + an initial
  curated seed dataset, later replaced by the ETL above.
- **UI** (`src/components/game`): slot machine, roster board, candidate picker, result card with a
  shareable summary, reserved ad slots. **Next.js 16 App Router** hub (`/`) + per-sport routes
  (`/[sport]`, `/[sport]/how-to-play`), static/SEO-friendly, dark theme.
- *Why:* prove the whole loop on one sport before fanning out; lock the engine + `SportConfig`
  schema that every other league will plug into.

### Planning & locked decisions
- Researched the viral game [82-0.com](https://82-0.com) (roster builder: spin franchise+era → draft
  one player → hidden strength rating with category gating → undefeated-or-not → share).
- **Stack:** Next.js (App Router) + TypeScript + Tailwind on Vercel.
- **Architecture:** one shared engine parameterized by per-sport `SportConfig` + bundled, code-split
  dataset → all leagues build in parallel.
- **Brand:** parent hub "Undefeated"; each sport branded by its regular-season game count — NBA
  **82-0**, NHL **82-0**, NFL **17-0**, CFB **12-0**, MLB **162-0**, EPL **38-0**. Soccer = Premier
  League only.
- **Data:** permissively-licensed open datasets + curated gaps; **not** Sports-Reference (its ToS
  forbids use in a public/monetized tool); SR usable only as a human reference for curation.
- Full plan: `/root/.claude/plans/i-would-like-to-snug-conway.md`.

---

### Status
- ✅ **NBA** — live, deep, deployable; awaiting user playtest feedback.
- ⏳ **MLB · NHL · NFL · CFB · EPL** — planned; each = its own open-data ETL + synthetic-axes scoring,
  to be built after NBA feedback. (NFL roster 12 across offense/defense; MLB lineup + pitcher; NHL
  C/LW/RW/2D/G; EPL 4-3-3.)

<!-- New entries go above this line, under today's date (newest first). -->
