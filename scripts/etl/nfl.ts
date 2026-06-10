/**
 * NFL ETL (hybrid): modern depth from nflverse (2000+) merged with a curated
 * legends + offensive-line set (scripts/etl/nfl-legends.ts) for the eras and
 * positions open data can't cover.
 *
 * nflverse offense: per-season player_stats_YYYY.csv (passing/rushing/receiving)
 * nflverse defense: player_stats_def.csv (sacks/tackles/TFL/INT/PD), 1999-2024
 *
 * Roster the data feeds: QB, RB, 2 WR, TE, 2 OL (offense) + 2 DL, LB, 2 DB (def).
 * Outputs src/sports/nfl/data.json + src/sports/nfl/franchises.generated.ts.
 * Run: pnpm tsx scripts/etl/nfl.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import { NFL_LEGENDS, type LegendEntry } from "./nfl-legends";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CACHE = join(ROOT, "scripts", "etl", ".cache");
const OUT = join(ROOT, "src", "sports", "nfl", "data.json");
const OUT_FR = join(ROOT, "src", "sports", "nfl", "franchises.generated.ts");

const REL = "https://github.com/nflverse/nflverse-data/releases/download/player_stats";
const MODERN_START = 2000;
const MODERN_END = 2024;
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
const ALLOWED = new Set(ERAS);

// Per (franchise, era, role) caps.
const CAP = { QB: 3, RB: 4, WR: 6, TE: 3, DL: 5, LB: 4, DB: 5 } as Record<string, number>;
// Minimum per-season production to count (filters scrubs).
const MIN = { passYds: 1500, rushYds: 500, recYds: 450, def: 2.0 };

// nflverse team abbreviation -> franchise slug. Covers relocations in-window.
const TEAM2SLUG: Record<string, string> = {
  ARI: "cardinals", ATL: "falcons", BAL: "ravens", BUF: "bills", CAR: "panthers",
  CHI: "bears", CIN: "bengals", CLE: "browns", DAL: "cowboys", DEN: "broncos",
  DET: "lions", GB: "packers", HOU: "texans", IND: "colts", JAX: "jaguars", JAC: "jaguars",
  KC: "chiefs", LV: "raiders", OAK: "raiders", LAC: "chargers", SD: "chargers",
  LA: "rams", LAR: "rams", STL: "rams", MIA: "dolphins", MIN: "vikings",
  NE: "patriots", NO: "saints", NYG: "giants", NYJ: "jets", PHI: "eagles",
  PIT: "steelers", SF: "49ers", SEA: "seahawks", TB: "buccaneers", TEN: "titans",
  WAS: "commanders", WSH: "commanders",
};

// Franchise display defs (slug -> name/abbr/colors + era aliases for relocations).
const FRANCH: Record<string, { name: string; abbr: string; colors: [string, string]; aliases?: { era: string; name: string }[] }> = {
  cardinals: { name: "Arizona Cardinals", abbr: "ARI", colors: ["#97233F", "#000000"], aliases: [{ era: "1960s", name: "St. Louis Cardinals" }, { era: "1970s", name: "St. Louis Cardinals" }, { era: "1980s", name: "St. Louis Cardinals" }] },
  falcons: { name: "Atlanta Falcons", abbr: "ATL", colors: ["#A71930", "#000000"] },
  ravens: { name: "Baltimore Ravens", abbr: "BAL", colors: ["#241773", "#000000"] },
  bills: { name: "Buffalo Bills", abbr: "BUF", colors: ["#00338D", "#C60C30"] },
  panthers: { name: "Carolina Panthers", abbr: "CAR", colors: ["#0085CA", "#101820"] },
  bears: { name: "Chicago Bears", abbr: "CHI", colors: ["#0B162A", "#C83803"] },
  bengals: { name: "Cincinnati Bengals", abbr: "CIN", colors: ["#FB4F14", "#000000"] },
  browns: { name: "Cleveland Browns", abbr: "CLE", colors: ["#311D00", "#FF3C00"] },
  cowboys: { name: "Dallas Cowboys", abbr: "DAL", colors: ["#003594", "#869397"] },
  broncos: { name: "Denver Broncos", abbr: "DEN", colors: ["#FB4F14", "#002244"] },
  lions: { name: "Detroit Lions", abbr: "DET", colors: ["#0076B6", "#B0B7BC"] },
  packers: { name: "Green Bay Packers", abbr: "GB", colors: ["#203731", "#FFB612"] },
  texans: { name: "Houston Texans", abbr: "HOU", colors: ["#03202F", "#A71930"] },
  colts: { name: "Indianapolis Colts", abbr: "IND", colors: ["#002C5F", "#A2AAAD"], aliases: [{ era: "1960s", name: "Baltimore Colts" }, { era: "1970s", name: "Baltimore Colts" }, { era: "1980s", name: "Baltimore Colts" }] },
  jaguars: { name: "Jacksonville Jaguars", abbr: "JAX", colors: ["#101820", "#D7A22A"] },
  chiefs: { name: "Kansas City Chiefs", abbr: "KC", colors: ["#E31837", "#FFB81C"] },
  raiders: { name: "Las Vegas Raiders", abbr: "LV", colors: ["#000000", "#A5ACAF"], aliases: [{ era: "1960s", name: "Oakland Raiders" }, { era: "1970s", name: "Oakland Raiders" }, { era: "1980s", name: "Los Angeles Raiders" }, { era: "1990s", name: "Oakland Raiders" }, { era: "2000s", name: "Oakland Raiders" }, { era: "2010s", name: "Oakland Raiders" }] },
  chargers: { name: "Los Angeles Chargers", abbr: "LAC", colors: ["#0080C6", "#FFC20E"], aliases: [{ era: "1960s", name: "San Diego Chargers" }, { era: "1970s", name: "San Diego Chargers" }, { era: "1980s", name: "San Diego Chargers" }, { era: "1990s", name: "San Diego Chargers" }, { era: "2000s", name: "San Diego Chargers" }, { era: "2010s", name: "San Diego Chargers" }] },
  rams: { name: "Los Angeles Rams", abbr: "LAR", colors: ["#003594", "#FFA300"], aliases: [{ era: "1990s", name: "St. Louis Rams" }, { era: "2000s", name: "St. Louis Rams" }, { era: "2010s", name: "St. Louis Rams" }] },
  dolphins: { name: "Miami Dolphins", abbr: "MIA", colors: ["#008E97", "#FC4C02"] },
  vikings: { name: "Minnesota Vikings", abbr: "MIN", colors: ["#4F2683", "#FFC62F"] },
  patriots: { name: "New England Patriots", abbr: "NE", colors: ["#002244", "#C60C30"] },
  saints: { name: "New Orleans Saints", abbr: "NO", colors: ["#D3BC8D", "#101820"] },
  giants: { name: "New York Giants", abbr: "NYG", colors: ["#0B2265", "#A71930"] },
  jets: { name: "New York Jets", abbr: "NYJ", colors: ["#125740", "#000000"] },
  eagles: { name: "Philadelphia Eagles", abbr: "PHI", colors: ["#004C54", "#A5ACAF"] },
  steelers: { name: "Pittsburgh Steelers", abbr: "PIT", colors: ["#FFB612", "#101820"] },
  "49ers": { name: "San Francisco 49ers", abbr: "SF", colors: ["#AA0000", "#B3995D"] },
  seahawks: { name: "Seattle Seahawks", abbr: "SEA", colors: ["#002244", "#69BE28"] },
  buccaneers: { name: "Tampa Bay Buccaneers", abbr: "TB", colors: ["#D50A0A", "#34302B"] },
  titans: { name: "Tennessee Titans", abbr: "TEN", colors: ["#0C2340", "#4B92DB"], aliases: [{ era: "1960s", name: "Houston Oilers" }, { era: "1970s", name: "Houston Oilers" }, { era: "1980s", name: "Houston Oilers" }, { era: "1990s", name: "Houston Oilers" }] },
  commanders: { name: "Washington Commanders", abbr: "WAS", colors: ["#5A1414", "#FFB612"], aliases: [{ era: "1960s", name: "Washington" }, { era: "1970s", name: "Washington" }, { era: "1980s", name: "Washington" }, { era: "1990s", name: "Washington" }, { era: "2000s", name: "Washington" }, { era: "2010s", name: "Washington" }] },
};

async function fetchCached(url: string, name: string): Promise<string | null> {
  mkdirSync(CACHE, { recursive: true });
  const f = join(CACHE, name);
  if (existsSync(f)) return readFileSync(f, "utf8");
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  writeFileSync(f, text);
  return text;
}
const rows = (csv: string) =>
  parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true }) as Record<string, string>[];
const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const decadeOf = (y: number): string => `${Math.floor(y / 10) * 10}s`;
const slugify = (s: string): string =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

interface Acc {
  seasons: Set<number>;
  pYds: number; pTd: number; pInt: number;
  rYds: number; rTd: number;
  rec: number; recYds: number; recTd: number;
  sacks: number; tkl: number; tfl: number; def_int: number; pd: number; ff: number;
  pos: string;
}
const blank = (): Acc => ({
  seasons: new Set(), pYds: 0, pTd: 0, pInt: 0, rYds: 0, rTd: 0, rec: 0, recYds: 0,
  recTd: 0, sacks: 0, tkl: 0, tfl: 0, def_int: 0, pd: 0, ff: 0, pos: "",
});

async function main() {
  console.log("NFL ETL (hybrid)");
  const acc = new Map<string, Acc>();
  const key = (name: string, slug: string, era: string) => `${name}|${slug}|${era}`;

  // --- Offense: per-season files ---
  for (let y = MODERN_START; y <= MODERN_END; y++) {
    const era = decadeOf(y);
    const csv = await fetchCached(`${REL}/player_stats_${y}.csv`, `nfl_off_${y}.csv`);
    if (!csv) continue;
    for (const r of rows(csv)) {
      if ((r.season_type ?? "REG") !== "REG") continue;
      const slug = TEAM2SLUG[r.recent_team ?? ""];
      const pos = r.position ?? "";
      if (!slug || !ALLOWED.has(era)) continue;
      if (!["QB", "RB", "WR", "TE", "FB"].includes(pos)) continue;
      const k = key(r.player_display_name ?? r.player_name ?? "", slug, era);
      let a = acc.get(k);
      if (!a) { a = blank(); a.pos = pos === "FB" ? "RB" : pos; acc.set(k, a); }
      a.seasons.add(num(r.season));
      a.pYds += num(r.passing_yards); a.pTd += num(r.passing_tds); a.pInt += num(r.interceptions);
      a.rYds += num(r.rushing_yards); a.rTd += num(r.rushing_tds);
      a.rec += num(r.receptions); a.recYds += num(r.receiving_yards); a.recTd += num(r.receiving_tds);
    }
    process.stdout.write(`  offense ${y}\r`);
  }

  // --- Defense: one combined file ---
  const dcsv = await fetchCached(`${REL}/player_stats_def.csv`, "nfl_def.csv");
  if (dcsv) {
    for (const r of rows(dcsv)) {
      if ((r.season_type ?? "REG") !== "REG") continue;
      const y = num(r.season);
      const era = decadeOf(y);
      const slug = TEAM2SLUG[r.team ?? ""];
      if (!slug || y < MODERN_START || !ALLOWED.has(era)) continue;
      const pg = r.position_group ?? "";
      const role = pg === "DL" ? "DL" : pg === "LB" ? "LB" : pg === "DB" ? "DB" : null;
      if (!role) continue;
      const k = key(r.player_display_name ?? r.player_name ?? "", slug, era);
      let a = acc.get(k);
      if (!a) { a = blank(); a.pos = role; acc.set(k, a); }
      else if (!["DL", "LB", "DB"].includes(a.pos)) a.pos = role;
      a.seasons.add(y);
      a.sacks += num(r.def_sacks); a.tkl += num(r.def_tackles); a.tfl += num(r.def_tackles_for_loss);
      a.def_int += num(r.def_interceptions); a.pd += num(r.def_pass_defended); a.ff += num(r.def_fumbles_forced);
    }
  }
  console.log("\n  aggregated nflverse buckets:", acc.size);

  // --- Build modern player entries with per-season rate stats + rating ---
  interface Out { id: string; name: string; team: string; era: string; role: string; positions: string[]; stats: Record<string, number>; rating: number; }
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const modern: Out[] = [];
  for (const [k, a] of acc) {
    const [name, slug, era] = k.split("|");
    const s = Math.max(1, a.seasons.size);
    const per = (x: number) => Math.round(x / s);
    const role = a.pos;
    let stats: Record<string, number> = {};
    let rating = 0;
    if (role === "QB") {
      if (a.pYds / s < MIN.passYds) continue;
      stats = { pyds: per(a.pYds), ptd: per(a.pTd), pint: per(a.pInt) };
      rating = a.pYds / s / 35 + (a.pTd / s) * 4 - (a.pInt / s) * 2;
    } else if (role === "RB") {
      if (a.rYds / s < MIN.rushYds) continue;
      stats = { ryds: per(a.rYds), rtd: per(a.rTd), rec: per(a.rec) };
      rating = a.rYds / s / 12 + (a.rTd / s) * 6 + (a.rec / s) * 1.5;
    } else if (role === "WR" || role === "TE") {
      if (a.recYds / s < MIN.recYds) continue;
      stats = { rec: per(a.rec), recyds: per(a.recYds), rectd: per(a.recTd) };
      rating = a.recYds / s / 12 + (a.recTd / s) * 6 + (a.rec / s) * 1.2;
    } else if (role === "DL" || role === "LB" || role === "DB") {
      const score = a.sacks / s + a.def_int / s + a.ff / s + a.tfl / s * 0.5;
      if (score < MIN.def) continue;
      stats = role === "DB"
        ? { int: per(a.def_int), pd: per(a.pd), tkl: per(a.tkl) }
        : role === "DL"
          ? { sacks: r1(a.sacks / s), tkl: per(a.tkl), ff: per(a.ff) }
          : { tkl: per(a.tkl), sacks: r1(a.sacks / s), int: per(a.def_int) };
      rating = (a.sacks / s) * 4 + (a.def_int / s) * 5 + (a.tfl / s) * 1.2 + (a.tkl / s) * 0.3 + (a.pd / s) * 1.5 + (a.ff / s) * 2;
    } else continue;
    modern.push({ id: "", name, team: slug, era, role, positions: [role], stats, rating });
  }
  console.log("  modern players (post-filter):", modern.length);

  // --- Merge curated legends ---
  const legends: Out[] = (NFL_LEGENDS as LegendEntry[]).map((l) => ({
    id: "", name: l.name, team: l.team, era: l.era, role: l.pos, positions: [l.pos], stats: l.stats, rating: l.rating ?? 50,
  }));
  console.log("  curated legends:", legends.length);

  // --- Top-N per (team, era, role) ---
  const byBucket = new Map<string, Out[]>();
  for (const o of [...modern, ...legends]) {
    const bk = `${o.team}|${o.era}|${o.role}`;
    (byBucket.get(bk) ?? byBucket.set(bk, []).get(bk)!).push(o);
  }
  const players: Omit<Out, "rating" | "role">[] = [];
  const usedIds = new Set<string>();
  for (const [bk, arr] of byBucket) {
    const role = bk.split("|")[2];
    arr.sort((a, b) => b.rating - a.rating);
    for (const o of arr.slice(0, CAP[role] ?? 4)) {
      let id = `${slugify(o.name)}-${o.team}-${o.era}`;
      let i = 2;
      while (usedIds.has(id)) id = `${slugify(o.name)}-${o.team}-${o.era}-${i++}`;
      usedIds.add(id);
      players.push({ id, name: o.name, team: o.team, era: o.era, positions: o.positions, stats: o.stats });
    }
  }

  // --- Franchise defs ---
  const franchises = Object.entries(FRANCH).map(([slug, f]) => ({
    id: slug, name: f.name, abbr: f.abbr, colors: f.colors, activeEras: ERAS, ...(f.aliases ? { aliases: f.aliases } : {}),
  }));

  // --- Diagnostics ---
  const perEra: Record<string, number> = {};
  const perRole: Record<string, number> = {};
  for (const p of players) { perEra[p.era] = (perEra[p.era] ?? 0) + 1; const r = p.positions[0]; perRole[r] = (perRole[r] ?? 0) + 1; }
  console.log(`  total players: ${players.length}`);
  console.log(`  by era:  ${ERAS.map((e) => `${e}:${perEra[e] ?? 0}`).join("  ")}`);
  console.log(`  by role: ${Object.entries(perRole).map(([r, n]) => `${r}:${n}`).join("  ")}`);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({
    sport: "nfl",
    version: `etl-${new Date().toISOString().slice(0, 10)}`,
    source: "Modern stats from nflverse (player_stats, 2000-2024), open data. Pre-2000 legends and offensive linemen curated from public records.",
    players,
  }));
  writeFileSync(OUT_FR,
    `// Generated by scripts/etl/nfl.ts — do not edit by hand.\n` +
    `import type { FranchiseDef } from "@/engine/types";\n\n` +
    `export const NFL_FRANCHISES: FranchiseDef[] = ${JSON.stringify(franchises, null, 2)};\n`);
  console.log(`  wrote ${OUT} + franchises.generated.ts`);
}

main().catch((e) => { console.error(e); process.exit(1); });
