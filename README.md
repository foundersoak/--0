# Undefeated

A viral-style, multi-sport **roster-building game**. Spin a random franchise and era,
draft real legends into your lineup, and find out if your all-time team can go **undefeated**.
Inspired by [82-0.com](https://82-0.com) — one hub, every major league.

- **NBA — 82‑0** — live and deep (8,000+ players, real per-team/decade rosters).
- **NFL 17‑0 · MLB 162‑0 · NHL 82‑0 · CFB 12‑0 · EPL 38‑0** — coming soon (same engine, per-sport data).

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000  → click NBA, or go to /nba
```

Other scripts:

```bash
pnpm build        # production build (static per-sport pages)
pnpm test         # engine unit tests (Vitest)
pnpm tsx scripts/etl/nba.ts   # rebuild the NBA dataset from open sources
```

## Deploying (for real playtesting + ads later)

It's a standard Next.js app with **no required env vars**, so it deploys to **Vercel** in a couple of clicks:

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repo (`foundersoak/--0`).
2. Accept the defaults (Vercel detects Next.js) and **Deploy**.
3. You get a live URL. Pushes to the branch auto-deploy.

## How the game works

Each round a slot machine assigns a random **franchise + decade**; you pick one real player and
slot him at a position he actually played. You get one team reroll and one era reroll. When the
lineup is full, its stats run through a season simulation:

- **Era adjustment** — pace-inflated old-era numbers are deflated, so a 1960s 30 PPG ≈ a 2000s 25.
- **Per-category gating** — every category (scoring, rebounding, playmaking, steals, rim protection)
  has a floor. One glaring weakness **caps your record** no matter how huge the rest is. This is the
  addictive part.
- **Non-linear win curve** — a stacked, balanced all-time lineup goes 82‑0; good lineups land
  mid-pack; one-dimensional rosters get gated.

## Architecture

One **framework-agnostic engine** (`src/engine`) is parameterized by a per-sport **`SportConfig`**
(`src/sports/<id>/config.ts`) plus a bundled, code-split **dataset** (`src/sports/<id>/data.json`).
Adding a league = add a config + run its ETL; the engine and UI are shared.

```
src/engine        types · seedable RNG · state machine · season simulation (+ tests)
src/sports/<id>   config.ts (positions, eras, franchises, scoring) + data.json
src/components     slot machine, roster board, candidate picker, result card, ad slots
src/app           hub (/) + per-sport routes (/[sport], /[sport]/how-to-play)
scripts/etl       build-time data pipelines (open data → committed JSON)
```

## Data

Player data is built at **build time** from permissively-available open datasets and committed to
the repo, so the live game never depends on the network. See [ATTRIBUTION.md](./ATTRIBUTION.md).
This is an unofficial fan project, not affiliated with any league; no logos or player likenesses
are used.
