/**
 * NHL build: the player pool is fully curated (recognizable legends only, which
 * suits a game for casual fans), so this just validates the curated entries
 * against the franchise/era lists, assigns ids, and emits the dataset +
 * franchise defs. No network fetch.
 *   src/sports/nhl/data.json + src/sports/nhl/franchises.generated.ts
 * Run: pnpm tsx scripts/etl/nhl.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NHL_PLAYERS, type NhlPlayer } from "./nhl-players";
import { NHL_PLAYERS_EXTRA } from "./nhl-players-extra";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "src", "sports", "nhl", "data.json");
const OUT_FR = join(ROOT, "src", "sports", "nhl", "franchises.generated.ts");
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
const ALLOWED_ERA = new Set(ERAS);
const POS = new Set(["C", "LW", "RW", "D", "G"]);

const FRANCH: Record<string, { name: string; abbr: string; colors: [string, string]; aliases?: { era: string; name: string }[] }> = {
  bruins: { name: "Boston Bruins", abbr: "BOS", colors: ["#FFB81C", "#000000"] },
  sabres: { name: "Buffalo Sabres", abbr: "BUF", colors: ["#003087", "#FFB81C"] },
  flames: { name: "Calgary Flames", abbr: "CGY", colors: ["#C8102E", "#F1BE48"], aliases: [{ era: "1970s", name: "Atlanta Flames" }] },
  hurricanes: { name: "Carolina Hurricanes", abbr: "CAR", colors: ["#CC0000", "#000000"], aliases: [{ era: "1980s", name: "Hartford Whalers" }, { era: "1990s", name: "Hartford Whalers" }] },
  blackhawks: { name: "Chicago Blackhawks", abbr: "CHI", colors: ["#CF0A2C", "#000000"] },
  avalanche: { name: "Colorado Avalanche", abbr: "COL", colors: ["#6F263D", "#236192"], aliases: [{ era: "1980s", name: "Quebec Nordiques" }, { era: "1990s", name: "Quebec Nordiques" }] },
  bluejackets: { name: "Columbus Blue Jackets", abbr: "CBJ", colors: ["#002654", "#CE1126"] },
  stars: { name: "Dallas Stars", abbr: "DAL", colors: ["#006847", "#8F8F8C"], aliases: [{ era: "1960s", name: "Minnesota North Stars" }, { era: "1970s", name: "Minnesota North Stars" }, { era: "1980s", name: "Minnesota North Stars" }] },
  redwings: { name: "Detroit Red Wings", abbr: "DET", colors: ["#CE1126", "#C0C0C0"] },
  oilers: { name: "Edmonton Oilers", abbr: "EDM", colors: ["#FF4C00", "#041E42"] },
  panthers: { name: "Florida Panthers", abbr: "FLA", colors: ["#C8102E", "#041E42"] },
  kings: { name: "Los Angeles Kings", abbr: "LAK", colors: ["#111111", "#A2AAAD"] },
  wild: { name: "Minnesota Wild", abbr: "MIN", colors: ["#154734", "#DDCBA4"] },
  canadiens: { name: "Montreal Canadiens", abbr: "MTL", colors: ["#AF1E2D", "#192168"] },
  predators: { name: "Nashville Predators", abbr: "NSH", colors: ["#FFB81C", "#041E42"] },
  devils: { name: "New Jersey Devils", abbr: "NJD", colors: ["#CE1126", "#000000"], aliases: [{ era: "1970s", name: "Colorado Rockies" }] },
  islanders: { name: "New York Islanders", abbr: "NYI", colors: ["#00539B", "#F47D30"] },
  rangers: { name: "New York Rangers", abbr: "NYR", colors: ["#0038A8", "#CE1126"] },
  senators: { name: "Ottawa Senators", abbr: "OTT", colors: ["#C2912C", "#000000"] },
  flyers: { name: "Philadelphia Flyers", abbr: "PHI", colors: ["#F74902", "#000000"] },
  penguins: { name: "Pittsburgh Penguins", abbr: "PIT", colors: ["#000000", "#FCB514"] },
  sharks: { name: "San Jose Sharks", abbr: "SJS", colors: ["#006D75", "#000000"] },
  kraken: { name: "Seattle Kraken", abbr: "SEA", colors: ["#001628", "#99D9D9"] },
  blues: { name: "St. Louis Blues", abbr: "STL", colors: ["#002F87", "#FCB514"] },
  lightning: { name: "Tampa Bay Lightning", abbr: "TBL", colors: ["#002868", "#FFFFFF"] },
  mapleleafs: { name: "Toronto Maple Leafs", abbr: "TOR", colors: ["#00205B", "#FFFFFF"] },
  canucks: { name: "Vancouver Canucks", abbr: "VAN", colors: ["#00205B", "#00843D"] },
  goldenknights: { name: "Vegas Golden Knights", abbr: "VGK", colors: ["#B4975A", "#333F42"] },
  capitals: { name: "Washington Capitals", abbr: "WSH", colors: ["#041E42", "#C8102E"] },
  jets: { name: "Winnipeg Jets", abbr: "WPG", colors: ["#041E42", "#004C97"], aliases: [{ era: "2000s", name: "Atlanta Thrashers" }] },
  ducks: { name: "Anaheim Ducks", abbr: "ANA", colors: ["#F47A38", "#000000"], aliases: [{ era: "1990s", name: "Mighty Ducks of Anaheim" }, { era: "2000s", name: "Mighty Ducks of Anaheim" }] },
  coyotes: { name: "Arizona Coyotes", abbr: "ARI", colors: ["#8C2633", "#E2D6B5"], aliases: [{ era: "1980s", name: "Winnipeg Jets" }, { era: "1990s", name: "Winnipeg Jets" }, { era: "2000s", name: "Phoenix Coyotes" }, { era: "2010s", name: "Phoenix Coyotes" }] },
};

const slugify = (s: string): string =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function main() {
  const players: { id: string; name: string; team: string; era: string; positions: string[]; stats: Record<string, number>; notable?: string }[] = [];
  const usedIds = new Set<string>();
  const seenIdentity = new Set<string>();
  const issues: string[] = [];
  for (const p of [...NHL_PLAYERS, ...NHL_PLAYERS_EXTRA] as NhlPlayer[]) {
    if (!FRANCH[p.team]) { issues.push(`bad team: ${p.name} -> ${p.team}`); continue; }
    if (!ALLOWED_ERA.has(p.era)) { issues.push(`bad era: ${p.name} -> ${p.era}`); continue; }
    if (!POS.has(p.pos)) { issues.push(`bad pos: ${p.name} -> ${p.pos}`); continue; }
    // Collapse an overlap between the base and extra sets to one card.
    const idk = `${p.name.toLowerCase().trim()}|${p.team}|${p.era}`;
    if (seenIdentity.has(idk)) continue;
    seenIdentity.add(idk);
    let id = `${slugify(p.name)}-${p.team}-${p.era}`;
    let i = 2;
    while (usedIds.has(id)) id = `${slugify(p.name)}-${p.team}-${p.era}-${i++}`;
    usedIds.add(id);
    players.push({ id, name: p.name, team: p.team, era: p.era, positions: [p.pos], stats: p.stats, ...(p.notable ? { notable: p.notable } : {}) });
  }

  const franchises = Object.entries(FRANCH).map(([slug, f]) => ({
    id: slug, name: f.name, abbr: f.abbr, colors: f.colors, activeEras: ERAS, ...(f.aliases ? { aliases: f.aliases } : {}),
  }));

  // Diagnostics: coverage by era x position (must be non-empty for the game to fill rosters).
  const grid: Record<string, Record<string, number>> = {};
  for (const p of players) { const r = p.positions[0]; (grid[p.era] ??= {})[r] = ((grid[p.era] ?? {})[r] ?? 0) + 1; }
  console.log(`NHL build: ${players.length} players, ${issues.length} issues`);
  if (issues.length) console.log("  " + issues.slice(0, 10).join("\n  "));
  console.log("  era \\ pos:  C   LW  RW  D   G");
  for (const e of ERAS) { const g = grid[e] ?? {}; console.log(`  ${e}:  ${["C", "LW", "RW", "D", "G"].map((r) => String(g[r] ?? 0).padStart(3)).join(" ")}`); }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({
    sport: "nhl",
    version: `etl-${new Date().toISOString().slice(0, 10)}`,
    source: "Curated from public records: the most recognizable NHL players of all time, with era-realistic peak stats.",
    players,
  }));
  writeFileSync(OUT_FR,
    `// Generated by scripts/etl/nhl.ts — do not edit by hand.\n` +
    `import type { FranchiseDef } from "@/engine/types";\n\n` +
    `export const NHL_FRANCHISES: FranchiseDef[] = ${JSON.stringify(franchises, null, 2)};\n`);
  console.log(`  wrote ${OUT} + franchises.generated.ts`);
}

main();
