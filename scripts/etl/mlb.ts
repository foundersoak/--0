/**
 * MLB ETL — builds a deep dataset from the Baseball Databank (Lahman), CC BY-SA.
 *
 * Roster the data feeds: 9 hitters (C,1B,2B,3B,SS,LF,CF,RF,DH) + 3 SP + 1 Closer.
 * Per (franchise, decade) bucket we keep the top hitters, starting pitchers, and
 * closers, with peak-decade rate stats (AVG/OBP/SLG, ERA/WHIP) and per-season
 * counting stats (HR/RBI/SB, W/K/SV).
 *
 * Source: chadwickbureau/baseballdatabank core CSVs (Batting, Pitching,
 * Appearances, People, Teams). Outputs:
 *   src/sports/mlb/data.json                (players, committed)
 *   src/sports/mlb/franchises.generated.ts  (franchise defs for the config)
 *
 * Run: pnpm tsx scripts/etl/mlb.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CACHE = join(ROOT, "scripts", "etl", ".cache");
const OUT = join(ROOT, "src", "sports", "mlb", "data.json");
const OUT_FR = join(ROOT, "src", "sports", "mlb", "franchises.generated.ts");

const BASE = "https://raw.githubusercontent.com/chadwickbureau/baseballdatabank/master/core";
const SRC = {
  batting: `${BASE}/Batting.csv`,
  pitching: `${BASE}/Pitching.csv`,
  appearances: `${BASE}/Appearances.csv`,
  people: `${BASE}/People.csv`,
  teams: `${BASE}/Teams.csv`,
};

const ERAS = ["1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
const ALLOWED = new Set(ERAS);
const CAP_BATTERS = 22;
const CAP_SP = 6;
const CAP_CL = 4;
const MIN_AB = 250; // batter, over a decade bucket
const MIN_SP_IPOUTS = 450; // starter (~150 IP / decade)
const MIN_CL_IPOUTS = 240; // closer (~80 IP / decade)
const MIN_SV = 20; // saves over a decade bucket to count as a closer

// Lahman franchID -> stable slug + canonical name + colors.
const FRANCH: Record<string, { slug: string; name: string; abbr: string; colors: [string, string] }> = {
  ANA: { slug: "angels", name: "Los Angeles Angels", abbr: "LAA", colors: ["#BA0021", "#003263"] },
  ARI: { slug: "diamondbacks", name: "Arizona Diamondbacks", abbr: "ARI", colors: ["#A71930", "#E3D4AD"] },
  ATL: { slug: "braves", name: "Atlanta Braves", abbr: "ATL", colors: ["#CE1141", "#13274F"] },
  BAL: { slug: "orioles", name: "Baltimore Orioles", abbr: "BAL", colors: ["#DF4601", "#000000"] },
  BOS: { slug: "redsox", name: "Boston Red Sox", abbr: "BOS", colors: ["#BD3039", "#0C2340"] },
  CHC: { slug: "cubs", name: "Chicago Cubs", abbr: "CHC", colors: ["#0E3386", "#CC3433"] },
  CHW: { slug: "whitesox", name: "Chicago White Sox", abbr: "CHW", colors: ["#27251F", "#C4CED4"] },
  CIN: { slug: "reds", name: "Cincinnati Reds", abbr: "CIN", colors: ["#C6011F", "#000000"] },
  CLE: { slug: "guardians", name: "Cleveland Guardians", abbr: "CLE", colors: ["#00385D", "#E50022"] },
  COL: { slug: "rockies", name: "Colorado Rockies", abbr: "COL", colors: ["#333366", "#C4CED4"] },
  DET: { slug: "tigers", name: "Detroit Tigers", abbr: "DET", colors: ["#0C2340", "#FA4616"] },
  FLA: { slug: "marlins", name: "Miami Marlins", abbr: "MIA", colors: ["#00A3E0", "#EF3340"] },
  HOU: { slug: "astros", name: "Houston Astros", abbr: "HOU", colors: ["#002D62", "#EB6E1F"] },
  KCR: { slug: "royals", name: "Kansas City Royals", abbr: "KC", colors: ["#004687", "#BD9B60"] },
  LAD: { slug: "dodgers", name: "Los Angeles Dodgers", abbr: "LAD", colors: ["#005A9C", "#EF3E42"] },
  MIL: { slug: "brewers", name: "Milwaukee Brewers", abbr: "MIL", colors: ["#12284B", "#FFC52F"] },
  MIN: { slug: "twins", name: "Minnesota Twins", abbr: "MIN", colors: ["#002B5C", "#D31145"] },
  NYM: { slug: "mets", name: "New York Mets", abbr: "NYM", colors: ["#002D72", "#FF5910"] },
  NYY: { slug: "yankees", name: "New York Yankees", abbr: "NYY", colors: ["#003087", "#E4002C"] },
  OAK: { slug: "athletics", name: "Oakland Athletics", abbr: "OAK", colors: ["#003831", "#EFB21E"] },
  PHI: { slug: "phillies", name: "Philadelphia Phillies", abbr: "PHI", colors: ["#E81828", "#002D72"] },
  PIT: { slug: "pirates", name: "Pittsburgh Pirates", abbr: "PIT", colors: ["#27251F", "#FDB827"] },
  SDP: { slug: "padres", name: "San Diego Padres", abbr: "SD", colors: ["#2F241D", "#FFC425"] },
  SEA: { slug: "mariners", name: "Seattle Mariners", abbr: "SEA", colors: ["#0C2C56", "#005C5C"] },
  SFG: { slug: "giants", name: "San Francisco Giants", abbr: "SF", colors: ["#FD5A1E", "#27251F"] },
  STL: { slug: "cardinals", name: "St. Louis Cardinals", abbr: "STL", colors: ["#C41E3A", "#0C2340"] },
  TBD: { slug: "rays", name: "Tampa Bay Rays", abbr: "TB", colors: ["#092C5C", "#8FBCE6"] },
  TEX: { slug: "rangers", name: "Texas Rangers", abbr: "TEX", colors: ["#003278", "#C0111F"] },
  TOR: { slug: "bluejays", name: "Toronto Blue Jays", abbr: "TOR", colors: ["#134A8E", "#1D2D5C"] },
  WSN: { slug: "nationals", name: "Washington Nationals", abbr: "WSN", colors: ["#AB0003", "#14225A"] },
};

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
const rows = (csv: string) =>
  parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true }) as Record<string, string>[];
const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const decadeOf = (y: number): string => `${Math.floor(y / 10) * 10}s`;
const normName = (s: string): string =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.'`]/g, "").trim();
const slugify = (s: string): string =>
  normName(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const POS_COLS: [string, string][] = [
  ["G_c", "C"], ["G_1b", "1B"], ["G_2b", "2B"], ["G_3b", "3B"], ["G_ss", "SS"],
  ["G_lf", "LF"], ["G_cf", "CF"], ["G_rf", "RF"], ["G_dh", "DH"], ["G_p", "P"],
];
// Fielding position -> eligible roster slots (OF interchangeable; all hitters can DH).
function eligibility(pos: string): string[] {
  switch (pos) {
    case "C": return ["C", "DH"];
    case "1B": return ["1B", "DH"];
    case "2B": return ["2B", "DH"];
    case "3B": return ["3B", "DH"];
    case "SS": return ["SS", "DH"];
    case "LF": return ["LF", "RF", "DH"];
    case "RF": return ["RF", "LF", "DH"];
    case "CF": return ["CF", "LF", "RF", "DH"];
    default: return ["DH"];
  }
}

interface Bat {
  ab: number; h: number; b2: number; b3: number; hr: number; r: number; rbi: number;
  bb: number; hbp: number; sf: number; sb: number; g: number; seasons: Set<number>;
}
interface Pit {
  w: number; sv: number; ipouts: number; h: number; er: number; bb: number; so: number;
  g: number; gs: number; seasons: Set<number>;
}
type PosAgg = Record<string, number>;

async function main() {
  console.log("MLB ETL");

  // --- Teams: (yearID,teamID) -> franchID, and per-era display name for aliases ---
  const teamRows = rows(await fetchCached(SRC.teams, "lahman_Teams.csv"));
  const franchOf = new Map<string, string>();
  const eraName = new Map<string, { year: number; name: string }>();
  for (const t of teamRows) {
    const year = num(t.yearID);
    if (!t.franchID) continue;
    franchOf.set(`${year}|${t.teamID}`, t.franchID);
    if (!ALLOWED.has(decadeOf(year))) continue;
    const k = `${t.franchID}|${decadeOf(year)}`;
    const prev = eraName.get(k);
    if (!prev || year >= prev.year) eraName.set(k, { year, name: t.name ?? "" });
  }
  const franchEra = (year: number, teamID: string) => franchOf.get(`${year}|${teamID}`);

  // --- People: playerID -> "First Last" ---
  const nameOf = new Map<string, string>();
  for (const p of rows(await fetchCached(SRC.people, "lahman_People.csv"))) {
    nameOf.set(p.playerID, `${p.nameFirst ?? ""} ${p.nameLast ?? ""}`.trim());
  }

  // --- Appearances: position games per (franch,era,player) ---
  const posAgg = new Map<string, PosAgg>();
  for (const a of rows(await fetchCached(SRC.appearances, "lahman_Appearances.csv"))) {
    const year = num(a.yearID);
    const era = decadeOf(year);
    if (!ALLOWED.has(era)) continue;
    const franch = franchEra(year, a.teamID);
    if (!franch || !FRANCH[franch]) continue;
    const key = `${franch}|${era}|${a.playerID}`;
    let pa = posAgg.get(key);
    if (!pa) { pa = {}; posAgg.set(key, pa); }
    for (const [col, pos] of POS_COLS) pa[pos] = (pa[pos] ?? 0) + num(a[col]);
  }

  // --- Batting + Pitching aggregation ---
  const bat = new Map<string, Bat>();
  for (const r of rows(await fetchCached(SRC.batting, "lahman_Batting.csv"))) {
    const year = num(r.yearID);
    const era = decadeOf(year);
    if (!ALLOWED.has(era)) continue;
    const franch = franchEra(year, r.teamID);
    if (!franch || !FRANCH[franch]) continue;
    const key = `${franch}|${era}|${r.playerID}`;
    let b = bat.get(key);
    if (!b) { b = { ab: 0, h: 0, b2: 0, b3: 0, hr: 0, r: 0, rbi: 0, bb: 0, hbp: 0, sf: 0, sb: 0, g: 0, seasons: new Set() }; bat.set(key, b); }
    b.ab += num(r.AB); b.h += num(r.H); b.b2 += num(r["2B"]); b.b3 += num(r["3B"]); b.hr += num(r.HR);
    b.r += num(r.R); b.rbi += num(r.RBI); b.bb += num(r.BB); b.hbp += num(r.HBP); b.sf += num(r.SF);
    b.sb += num(r.SB); b.g += num(r.G); b.seasons.add(year);
  }
  const pit = new Map<string, Pit>();
  for (const r of rows(await fetchCached(SRC.pitching, "lahman_Pitching.csv"))) {
    const year = num(r.yearID);
    const era = decadeOf(year);
    if (!ALLOWED.has(era)) continue;
    const franch = franchEra(year, r.teamID);
    if (!franch || !FRANCH[franch]) continue;
    const key = `${franch}|${era}|${r.playerID}`;
    let p = pit.get(key);
    if (!p) { p = { w: 0, sv: 0, ipouts: 0, h: 0, er: 0, bb: 0, so: 0, g: 0, gs: 0, seasons: new Set() }; pit.set(key, p); }
    p.w += num(r.W); p.sv += num(r.SV); p.ipouts += num(r.IPouts); p.h += num(r.H); p.er += num(r.ER);
    p.bb += num(r.BB); p.so += num(r.SO); p.g += num(r.G); p.gs += num(r.GS); p.seasons.add(year);
  }

  interface Out {
    id: string; name: string; team: string; era: string; role: "bat" | "sp" | "cl";
    positions: string[]; stats: Record<string, number>; rating: number;
  }
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const r3 = (n: number) => Math.round(n * 1000) / 1000;
  const out: Out[] = [];

  // --- Batters ---
  for (const [key, b] of bat) {
    if (b.ab < MIN_AB) continue;
    const pa = posAgg.get(key) ?? {};
    const pGames = pa.P ?? 0;
    const field = POS_COLS.filter(([, p]) => p !== "P").map(([, p]) => [p, pa[p] ?? 0] as const).sort((x, y) => y[1] - x[1])[0];
    if (pGames > (field?.[1] ?? 0) && pGames > 50) continue; // primarily a pitcher
    const [franch, era, playerID] = key.split("|");
    const name = nameOf.get(playerID);
    if (!name) continue;
    const seasons = Math.max(1, b.seasons.size);
    const perSeason = Math.min(2, 162 / Math.max(60, b.g / seasons));
    const tb = b.h + b.b2 + 2 * b.b3 + 3 * b.hr;
    const obp = b.ab + b.bb + b.hbp + b.sf ? (b.h + b.bb + b.hbp) / (b.ab + b.bb + b.hbp + b.sf) : 0;
    const slg = b.ab ? tb / b.ab : 0;
    const stats = {
      avg: r3(b.ab ? b.h / b.ab : 0),
      hr: Math.round((b.hr / seasons) * perSeason),
      rbi: Math.round((b.rbi / seasons) * perSeason),
      obp: r3(obp),
      slg: r3(slg),
      sb: Math.round((b.sb / seasons) * perSeason),
    };
    const primary = field && field[1] > 0 ? field[0] : "DH";
    out.push({
      id: "", name, team: FRANCH[franch].slug, era, role: "bat",
      positions: eligibility(primary), stats, rating: (obp + slg) * 100 + stats.hr * 0.8,
    });
  }

  // --- Pitchers: starters (SP) and closers (CL) ---
  for (const [key, p] of pit) {
    const [franch, era, playerID] = key.split("|");
    const name = nameOf.get(playerID);
    if (!name) continue;
    const ip = p.ipouts / 3;
    const seasons = Math.max(1, p.seasons.size);
    const era_ = ip ? (p.er * 9) / ip : 9;
    const whip = ip ? (p.bb + p.h) / ip : 2;
    const k = Math.round(p.so / seasons);

    if (p.gs >= 8 && p.ipouts >= MIN_SP_IPOUTS) {
      out.push({
        id: "", name, team: FRANCH[franch].slug, era, role: "sp", positions: ["SP"],
        stats: { w: Math.round(p.w / seasons), era: r1(era_), k, whip: r1(whip) },
        rating: (5 - era_) * 18 + k * 0.05 + (1.45 - whip) * 30,
      });
    } else if (p.sv >= MIN_SV && p.gs < 10 && p.ipouts >= MIN_CL_IPOUTS) {
      out.push({
        id: "", name, team: FRANCH[franch].slug, era, role: "cl", positions: ["CL"],
        stats: { sv: Math.round(p.sv / seasons), era: r1(era_), k, whip: r1(whip) },
        rating: Math.round(p.sv / seasons) * 0.6 + (4 - era_) * 12 + (1.3 - whip) * 25,
      });
    }
  }

  // --- Top-N per (team, decade) by role ---
  const byBucket = new Map<string, Out[]>();
  for (const o of out) {
    const k = `${o.team}|${o.era}`;
    (byBucket.get(k) ?? byBucket.set(k, []).get(k)!).push(o);
  }
  const players: Omit<Out, "rating" | "role">[] = [];
  const usedIds = new Set<string>();
  for (const arr of byBucket.values()) {
    const pick = (role: Out["role"], cap: number) =>
      arr.filter((o) => o.role === role).sort((a, b) => b.rating - a.rating).slice(0, cap);
    for (const o of [...pick("bat", CAP_BATTERS), ...pick("sp", CAP_SP), ...pick("cl", CAP_CL)]) {
      let id = `${slugify(o.name)}-${o.team}-${o.era}`;
      let i = 2;
      while (usedIds.has(id)) id = `${slugify(o.name)}-${o.team}-${o.era}-${i++}`;
      usedIds.add(id);
      players.push({ id, name: o.name, team: o.team, era: o.era, positions: o.positions, stats: o.stats });
    }
  }

  // --- Franchise defs with relocation aliases derived from Teams ---
  const franchises = Object.entries(FRANCH).map(([fid, f]) => {
    const aliases: { era: string; name: string }[] = [];
    for (const era of ERAS) {
      const en = eraName.get(`${fid}|${era}`);
      if (en?.name && en.name !== f.name) aliases.push({ era, name: en.name });
    }
    return { id: f.slug, name: f.name, abbr: f.abbr, colors: f.colors, activeEras: ERAS, ...(aliases.length ? { aliases } : {}) };
  });

  // --- Diagnostics ---
  const counts = { bat: 0, sp: 0, cl: 0 } as Record<string, number>;
  for (const o of out) counts[o.role]++;
  console.log(`  raw pool — batters:${counts.bat} starters:${counts.sp} closers:${counts.cl}`);
  console.log(`  buckets: ${byBucket.size}  total players: ${players.length}`);
  const perEra: Record<string, number> = {};
  for (const p of players) perEra[p.era] = (perEra[p.era] ?? 0) + 1;
  console.log(`  by era: ${ERAS.map((e) => `${e}:${perEra[e] ?? 0}`).join("  ")}`);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify({
      sport: "mlb",
      version: `etl-${new Date().toISOString().slice(0, 10)}`,
      source:
        "Baseball Databank (Lahman), CC BY-SA 3.0 — chadwickbureau/baseballdatabank. Peak-decade rate stats + per-season counting stats.",
      players,
    }),
  );
  writeFileSync(
    OUT_FR,
    `// Generated by scripts/etl/mlb.ts — do not edit by hand.\n` +
      `import type { FranchiseDef } from "@/engine/types";\n\n` +
      `export const MLB_FRANCHISES: FranchiseDef[] = ${JSON.stringify(franchises, null, 2)};\n`,
  );
  console.log(`  wrote ${OUT} (${(JSON.stringify(players).length / 1e6).toFixed(2)}MB) + franchises.generated.ts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
