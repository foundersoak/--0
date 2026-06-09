/**
 * NBA ETL — builds a deep, real dataset from permissively-available open data.
 *
 * Sources (no Sports-Reference):
 *  - peasant98/TheNBACSV `nbaNew.csv`  : the Kaggle "Seasons_Stats" set, 1950-2017,
 *    season totals WITH position + team. Used for seasons up to 2017.
 *  - Brescou/NBA-dataset-stats-player-team : per-game season stats 1996-2023.
 *    Used for 2017-18 onward; positions joined from its player_index.
 *
 * Output: src/sports/nba/data.json (committed). Runtime never hits the network.
 *
 * Run: pnpm tsx scripts/etl/nba.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CACHE = join(ROOT, "scripts", "etl", ".cache");
const OUT = join(ROOT, "src", "sports", "nba", "data.json");

const SRC = {
  historical: "https://raw.githubusercontent.com/peasant98/TheNBACSV/master/nbaNew.csv",
  recent:
    "https://raw.githubusercontent.com/Brescou/NBA-dataset-stats-player-team/main/player/player_stats_traditionnal_rs.csv",
  index:
    "https://raw.githubusercontent.com/Brescou/NBA-dataset-stats-player-team/main/player/player_index.csv",
  box2324:
    "https://raw.githubusercontent.com/NocturneBear/NBA-Data-2010-2024/main/regular_season_box_scores_2010_2024_part_3.csv",
};

// Per-bucket depth: keep the most productive N players per (team, decade).
const CAP_PER_BUCKET = 50;
const MIN_GAMES = 12; // exclude tiny-sample players from a (team, decade)

// Historical + current team abbreviations -> stable franchise slug.
const TEAM_MAP: Record<string, string> = {
  ATL: "hawks", STL: "hawks", MLH: "hawks", TRI: "hawks",
  BOS: "celtics",
  BRK: "nets", BKN: "nets", NJN: "nets", NYN: "nets",
  CHA: "hornets", CHH: "hornets", CHO: "hornets",
  CHI: "bulls",
  CLE: "cavaliers",
  DAL: "mavericks",
  DEN: "nuggets",
  DET: "pistons", FTW: "pistons",
  GSW: "warriors", SFW: "warriors", PHW: "warriors",
  HOU: "rockets", SDR: "rockets",
  IND: "pacers",
  LAC: "clippers", SDC: "clippers", BUF: "clippers",
  LAL: "lakers", MNL: "lakers",
  MEM: "grizzlies", VAN: "grizzlies",
  MIA: "heat",
  MIL: "bucks",
  MIN: "timberwolves",
  NOP: "pelicans", NOH: "pelicans", NOK: "pelicans",
  NYK: "knicks",
  OKC: "thunder", SEA: "thunder",
  ORL: "magic",
  PHI: "sixers", SYR: "sixers",
  PHO: "suns", PHX: "suns",
  POR: "blazers",
  SAC: "kings", KCK: "kings", KCO: "kings", CIN: "kings", ROC: "kings",
  SAS: "spurs",
  TOR: "raptors",
  UTA: "jazz", NOJ: "jazz",
  WAS: "wizards", WSB: "wizards", CAP: "wizards", BAL: "wizards", CHP: "wizards", CHZ: "wizards",
};

const ALLOWED_DECADES = new Set(["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]);

async function fetchCached(url: string, name: string): Promise<string> {
  mkdirSync(CACHE, { recursive: true });
  const f = join(CACHE, name);
  if (existsSync(f)) return readFileSync(f, "utf8");
  process.stdout.write(`  fetching ${name}… `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const text = await res.text();
  writeFileSync(f, text);
  console.log(`${(text.length / 1e6).toFixed(1)}MB`);
  return text;
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const decadeOf = (year: number): string => `${Math.floor(year / 10) * 10}s`;

/** Box-score minutes may be "34:30" (mm:ss) or a decimal. */
function parseMinutes(s: string): number {
  if (!s) return 0;
  if (s.includes(":")) {
    const [m, sec] = s.split(":").map(Number);
    return (m || 0) + (sec || 0) / 60;
  }
  return num(s);
}

const normName = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[.'`]/g, "")
    .trim();

const slugify = (s: string): string =>
  normName(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Map a raw position string (fine "SF-PF" or coarse "G"/"F-C") to slot tags. */
function positionTags(pos: string): string[] {
  const toks = pos.split(/[-/]/).map((t) => t.trim().toUpperCase()).filter(Boolean);
  // Prefer explicit fine positions when the source provides them.
  const fine = toks.filter((t) => ["PG", "SG", "SF", "PF", "C"].includes(t));
  if (fine.length) return [...new Set(fine)];
  // Otherwise interpret coarse G/F/C combinations semantically (a center is not
  // a small forward; a guard-forward is a wing, not a point guard or power forward).
  const has = (x: string) => toks.includes(x);
  const out = new Set<string>();
  if (has("G") && has("F")) { out.add("SG"); out.add("SF"); } // wing
  else if (has("F") && has("C")) { out.add("PF"); out.add("C"); } // frontcourt big
  else if (has("G") && has("C")) { out.add("PF"); out.add("C"); } // rare; treat as big
  else if (has("G")) { out.add("PG"); out.add("SG"); }
  else if (has("F")) { out.add("SF"); out.add("PF"); }
  else if (has("C")) { out.add("C"); }
  return [...out];
}

// The historical source truncates some 3-word names; correct the recognizable ones.
const NAME_FIX: Record<string, string> = {
  "Metta World": "Metta World Peace",
  "Joe Barry": "Joe Barry Carroll",
  "Nick Van": "Nick Van Exel",
  "Michael Ray": "Michael Ray Richardson",
  "World B": "World B. Free",
  "Billy Ray": "Billy Ray Bates",
};
const fixName = (n: string): string => NAME_FIX[n] ?? n;

interface Bucket {
  name: string;
  team: string;
  era: string;
  pts: number; trb: number; ast: number; stl: number; blk: number;
  g: number; mp: number;
  maxG: number; pos: string; // position from the highest-games season
}

const buckets = new Map<string, Bucket>();
const unmapped = new Map<string, number>();

function add(
  name: string,
  teamAbbr: string,
  era: string,
  totals: { pts: number; trb: number; ast: number; stl: number; blk: number; g: number; mp: number },
  pos: string,
) {
  const slug = TEAM_MAP[teamAbbr];
  if (!slug) {
    unmapped.set(teamAbbr, (unmapped.get(teamAbbr) ?? 0) + 1);
    return;
  }
  if (!ALLOWED_DECADES.has(era) || totals.g <= 0) return;
  const key = `${slug}|${era}|${normName(name).toLowerCase()}`;
  let b = buckets.get(key);
  if (!b) {
    b = { name, team: slug, era, pts: 0, trb: 0, ast: 0, stl: 0, blk: 0, g: 0, mp: 0, maxG: 0, pos: "" };
    buckets.set(key, b);
  }
  b.pts += totals.pts; b.trb += totals.trb; b.ast += totals.ast;
  b.stl += totals.stl; b.blk += totals.blk; b.g += totals.g; b.mp += totals.mp;
  if (totals.g >= b.maxG) { b.maxG = totals.g; b.pos = pos; }
}

async function main() {
  console.log("NBA ETL");

  // --- Historical (season totals, 1950-2017) ---
  const hist = parse(await fetchCached(SRC.historical, "nbaNew.csv"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];
  let histKept = 0;
  for (const r of hist) {
    const year = num(r.SeasonStart);
    if (year < 1960 || year > 2017) continue;
    const tm = (r.Tm ?? "").toUpperCase();
    if (tm === "TOT" || !tm) continue;
    const g = num(r.G);
    if (g <= 0) continue;
    add(
      (r.PlayerName ?? "").replace(/\*/g, "").trim(),
      tm,
      decadeOf(year),
      { pts: num(r.PTS), trb: num(r.TRB), ast: num(r.AST), stl: num(r.STL), blk: num(r.BLK), g, mp: num(r.MP) },
      r.Pos ?? "",
    );
    histKept++;
  }
  console.log(`  historical rows kept: ${histKept}`);

  // --- Recent (per-game, 2017-18 .. 2022-23) with positions joined by name ---
  const idxRows = parse(await fetchCached(SRC.index, "player_index.csv"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];
  const posByName = new Map<string, string>();
  for (const r of idxRows) {
    const full = `${r.PLAYER_FIRST_NAME ?? ""} ${r.PLAYER_LAST_NAME ?? ""}`;
    if (r.POSITION) posByName.set(normName(full).toLowerCase(), r.POSITION);
  }

  const recent = parse(await fetchCached(SRC.recent, "recent.csv"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record<string, string>[];
  let recentKept = 0;
  for (const r of recent) {
    const startYear = num((r.SEASON ?? "").slice(0, 4));
    if (startYear < 2017) continue; // historical set already covers <= 2016-17
    const gp = num(r.GP);
    if (gp <= 0) continue;
    const name = (r.PLAYER_NAME ?? "").trim();
    const pos = posByName.get(normName(name).toLowerCase()) ?? "G-F";
    add(
      name,
      (r.TEAM_ABBREVIATION ?? "").toUpperCase(),
      decadeOf(startYear),
      {
        pts: num(r.PTS) * gp, trb: num(r.REB) * gp, ast: num(r.AST) * gp,
        stl: num(r.STL) * gp, blk: num(r.BLK) * gp, g: gp, mp: num(r.MIN) * gp,
      },
      pos,
    );
    recentKept++;
  }
  console.log(`  recent rows kept: ${recentKept}`);

  // --- 2023-24 from player box scores (adds the newest season to the 2020s pool) ---
  const boxRaw = await fetchCached(SRC.box2324, "box2324.csv");
  const boxLines = boxRaw.split("\n");
  const filtered = [boxLines[0], ...boxLines.filter((l) => l.startsWith("2023-24,"))].join("\n");
  const box = parse(filtered, { columns: true, skip_empty_lines: true, relax_column_count: true }) as Record<string, string>[];
  const agg = new Map<string, { name: string; team: string; pos: string; pts: number; trb: number; ast: number; stl: number; blk: number; g: number; mp: number }>();
  for (const r of box) {
    const mp = parseMinutes(r.minutes);
    if (mp <= 0) continue; // skip DNPs
    const name = (r.personName ?? "").trim();
    const team = (r.teamTricode ?? "").toUpperCase();
    const key = `${name}|${team}`;
    let a = agg.get(key);
    if (!a) { a = { name, team, pos: "", pts: 0, trb: 0, ast: 0, stl: 0, blk: 0, g: 0, mp: 0 }; agg.set(key, a); }
    a.pts += num(r.points); a.trb += num(r.reboundsTotal); a.ast += num(r.assists);
    a.stl += num(r.steals); a.blk += num(r.blocks); a.g += 1; a.mp += mp;
    if (!a.pos && r.position) a.pos = r.position;
  }
  let boxKept = 0;
  for (const a of agg.values()) {
    const pos = a.pos || posByName.get(normName(a.name).toLowerCase()) || "G-F";
    add(a.name, a.team, "2020s", { pts: a.pts, trb: a.trb, ast: a.ast, stl: a.stl, blk: a.blk, g: a.g, mp: a.mp }, pos);
    boxKept++;
  }
  console.log(`  2023-24 box-score players: ${boxKept}`);

  // --- Finalize per-player buckets -> per-game lines ---
  interface Out {
    id: string; name: string; team: string; era: string;
    positions: string[]; stats: Record<string, number>; rating: number; g: number;
  }
  const finalized: Out[] = [];
  for (const b of buckets.values()) {
    const ppg = b.pts / b.g;
    const rpg = b.trb / b.g;
    const apg = b.ast / b.g;
    let spg = b.stl / b.g;
    let bpg = b.blk / b.g;
    const tags = positionTags(b.pos);
    if (tags.length === 0) continue;
    const big = tags.includes("C") || tags.includes("PF");
    // Steals/blocks untracked before 1973-74: impute modest era-typical values
    // for the 1960s and early-1970s players whose tracked value is exactly zero.
    if (b.era === "1960s" || b.era === "1970s") {
      if (spg < 0.05) spg = big ? 0.6 : 1.0;
      if (bpg < 0.05) bpg = big ? 1.2 : 0.3;
    }
    const round = (n: number) => Math.round(n * 10) / 10;
    const stats = { ppg: round(ppg), rpg: round(rpg), apg: round(apg), spg: round(spg), bpg: round(bpg) };
    const rating = ppg + 1.2 * rpg + 1.5 * apg + 3 * spg + 3 * bpg;
    finalized.push({
      id: "", name: fixName(b.name), team: b.team, era: b.era, positions: tags, stats, rating, g: b.g,
    });
  }

  // --- Top-N per (team, decade) by rating, with stable unique ids ---
  const byBucket = new Map<string, Out[]>();
  for (const o of finalized) {
    if (o.g < MIN_GAMES) continue;
    const k = `${o.team}|${o.era}`;
    (byBucket.get(k) ?? byBucket.set(k, []).get(k)!).push(o);
  }
  const players: Omit<Out, "rating" | "g">[] = [];
  const usedIds = new Set<string>();
  const sizes: number[] = [];
  for (const arr of byBucket.values()) {
    arr.sort((a, b) => b.rating - a.rating);
    const top = arr.slice(0, CAP_PER_BUCKET);
    sizes.push(top.length);
    for (const o of top) {
      let id = `${slugify(o.name)}-${o.team}-${o.era}`;
      let i = 2;
      while (usedIds.has(id)) id = `${slugify(o.name)}-${o.team}-${o.era}-${i++}`;
      usedIds.add(id);
      players.push({ id, name: o.name, team: o.team, era: o.era, positions: o.positions, stats: o.stats });
    }
  }

  // --- Diagnostics ---
  sizes.sort((a, b) => a - b);
  const med = sizes[Math.floor(sizes.length / 2)];
  const perDecade: Record<string, { teams: number; players: number }> = {};
  for (const [k, arr] of byBucket) {
    const era = k.split("|")[1];
    const top = Math.min(arr.length, CAP_PER_BUCKET);
    perDecade[era] ??= { teams: 0, players: 0 };
    perDecade[era].teams++;
    perDecade[era].players += top;
  }
  console.log(`  buckets: ${byBucket.size}  total players: ${players.length}`);
  console.log(`  per-bucket size  min=${sizes[0]} median=${med} max=${sizes[sizes.length - 1]}`);
  console.log("  avg players/team by decade:");
  for (const era of ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]) {
    const d = perDecade[era];
    if (d) console.log(`    ${era}: ${(d.players / d.teams).toFixed(1)} (${d.teams} teams)`);
  }
  if (unmapped.size) {
    const top = [...unmapped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    console.log(`  unmapped team codes (skipped): ${top.map(([k, n]) => `${k}:${n}`).join(", ")}`);
  }

  const dataset = {
    sport: "nba",
    version: `etl-${new Date().toISOString().slice(0, 10)}`,
    source:
      "Open data: Kaggle 'NBA Seasons Stats' 1950-2017 (via peasant98/TheNBACSV) + Brescou/NBA-dataset-stats-player-team 1996-2023. Pre-1974 steals/blocks imputed.",
    players,
  };
  writeFileSync(OUT, JSON.stringify(dataset));
  console.log(`  wrote ${OUT} (${(JSON.stringify(dataset).length / 1e6).toFixed(2)}MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
