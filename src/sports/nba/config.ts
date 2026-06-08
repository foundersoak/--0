import type { FranchiseDef, SportConfig } from "@/engine/types";

const ALL_ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

// Only display metadata matters to the engine here (spins are drawn from the
// dataset's actual team+era pairs). Colors are [primary, secondary] hex.
const franchises: FranchiseDef[] = [
  { id: "warriors", name: "Golden State Warriors", abbr: "GSW", colors: ["#1D428A", "#FFC72C"], activeEras: ALL_ERAS, aliases: [{ era: "1960s", name: "San Francisco Warriors" }] },
  { id: "celtics", name: "Boston Celtics", abbr: "BOS", colors: ["#007A33", "#BA9653"], activeEras: ALL_ERAS },
  { id: "lakers", name: "Los Angeles Lakers", abbr: "LAL", colors: ["#552583", "#FDB927"], activeEras: ALL_ERAS },
  { id: "kings", name: "Sacramento Kings", abbr: "SAC", colors: ["#5A2D81", "#63727A"], activeEras: ALL_ERAS, aliases: [{ era: "1960s", name: "Cincinnati Royals" }, { era: "1970s", name: "Kansas City Kings" }] },
  { id: "knicks", name: "New York Knicks", abbr: "NYK", colors: ["#006BB6", "#F58426"], activeEras: ALL_ERAS },
  { id: "sixers", name: "Philadelphia 76ers", abbr: "PHI", colors: ["#006BB6", "#ED174C"], activeEras: ALL_ERAS },
  { id: "bucks", name: "Milwaukee Bucks", abbr: "MIL", colors: ["#00471B", "#EEE1C6"], activeEras: ALL_ERAS },
  { id: "jazz", name: "Utah Jazz", abbr: "UTA", colors: ["#002B5C", "#F9A01B"], activeEras: ALL_ERAS, aliases: [{ era: "1970s", name: "New Orleans Jazz" }] },
  { id: "nets", name: "Brooklyn Nets", abbr: "BKN", colors: ["#000000", "#777777"], activeEras: ALL_ERAS, aliases: [{ era: "1970s", name: "New York Nets" }, { era: "1980s", name: "New Jersey Nets" }, { era: "1990s", name: "New Jersey Nets" }, { era: "2000s", name: "New Jersey Nets" }] },
  { id: "rockets", name: "Houston Rockets", abbr: "HOU", colors: ["#CE1141", "#000000"], activeEras: ALL_ERAS, aliases: [{ era: "1960s", name: "San Diego Rockets" }] },
  { id: "clippers", name: "Los Angeles Clippers", abbr: "LAC", colors: ["#C8102E", "#1D428A"], activeEras: ALL_ERAS, aliases: [{ era: "1970s", name: "Buffalo Braves" }] },
  { id: "bulls", name: "Chicago Bulls", abbr: "CHI", colors: ["#CE1141", "#000000"], activeEras: ALL_ERAS },
  { id: "pistons", name: "Detroit Pistons", abbr: "DET", colors: ["#C8102E", "#1D42BA"], activeEras: ALL_ERAS },
  { id: "spurs", name: "San Antonio Spurs", abbr: "SAS", colors: ["#000000", "#C4CED4"], activeEras: ALL_ERAS },
  { id: "suns", name: "Phoenix Suns", abbr: "PHX", colors: ["#1D1160", "#E56020"], activeEras: ALL_ERAS },
  { id: "magic", name: "Orlando Magic", abbr: "ORL", colors: ["#0077C0", "#C4CED4"], activeEras: ALL_ERAS },
  { id: "thunder", name: "Oklahoma City Thunder", abbr: "OKC", colors: ["#007AC1", "#EF3B24"], activeEras: ALL_ERAS, aliases: [{ era: "1960s", name: "Seattle SuperSonics" }, { era: "1970s", name: "Seattle SuperSonics" }, { era: "1980s", name: "Seattle SuperSonics" }, { era: "1990s", name: "Seattle SuperSonics" }, { era: "2000s", name: "Seattle SuperSonics" }] },
  { id: "pacers", name: "Indiana Pacers", abbr: "IND", colors: ["#002D62", "#FDBB30"], activeEras: ALL_ERAS },
  { id: "heat", name: "Miami Heat", abbr: "MIA", colors: ["#98002E", "#F9A01B"], activeEras: ALL_ERAS },
  { id: "timberwolves", name: "Minnesota Timberwolves", abbr: "MIN", colors: ["#0C2340", "#236192"], activeEras: ALL_ERAS },
  { id: "mavericks", name: "Dallas Mavericks", abbr: "DAL", colors: ["#00538C", "#002B5E"], activeEras: ALL_ERAS },
  { id: "cavaliers", name: "Cleveland Cavaliers", abbr: "CLE", colors: ["#860038", "#FDBB30"], activeEras: ALL_ERAS },
  { id: "pelicans", name: "New Orleans Pelicans", abbr: "NOP", colors: ["#0C2340", "#C8102E"], activeEras: ALL_ERAS },
  { id: "blazers", name: "Portland Trail Blazers", abbr: "POR", colors: ["#E03A3E", "#000000"], activeEras: ALL_ERAS },
  { id: "nuggets", name: "Denver Nuggets", abbr: "DEN", colors: ["#0E2240", "#FEC524"], activeEras: ALL_ERAS },
  { id: "hawks", name: "Atlanta Hawks", abbr: "ATL", colors: ["#E03A3E", "#C1D32F"], activeEras: ALL_ERAS, aliases: [{ era: "1960s", name: "St. Louis Hawks" }] },
  { id: "hornets", name: "Charlotte Hornets", abbr: "CHA", colors: ["#1D1160", "#00788C"], activeEras: ALL_ERAS, aliases: [{ era: "2000s", name: "Charlotte Bobcats" }] },
  { id: "wizards", name: "Washington Wizards", abbr: "WAS", colors: ["#002B5C", "#E31837"], activeEras: ALL_ERAS, aliases: [{ era: "1960s", name: "Baltimore Bullets" }, { era: "1970s", name: "Washington Bullets" }, { era: "1980s", name: "Washington Bullets" }, { era: "1990s", name: "Washington Bullets" }] },
  { id: "grizzlies", name: "Memphis Grizzlies", abbr: "MEM", colors: ["#5D76A9", "#12173F"], activeEras: ALL_ERAS, aliases: [{ era: "1990s", name: "Vancouver Grizzlies" }] },
  { id: "raptors", name: "Toronto Raptors", abbr: "TOR", colors: ["#CE1141", "#000000"], activeEras: ALL_ERAS },
];

const nbaConfig: SportConfig = {
  id: "nba",
  name: "NBA",
  brand: "82-0",
  tagline: "Can your all-time NBA roster go 82-0?",
  blurb:
    "Spin a random franchise and decade, draft one legend at a position he played, fill all five spots, and find out if your lineup goes undefeated.",
  seasonGames: 82,
  requireEraDiversity: true,
  skips: { team: 1, era: 1 },
  positions: [
    { id: "PG", label: "Point Guard", abbr: "PG", accepts: ["PG"] },
    { id: "SG", label: "Shooting Guard", abbr: "SG", accepts: ["SG"] },
    { id: "SF", label: "Small Forward", abbr: "SF", accepts: ["SF"] },
    { id: "PF", label: "Power Forward", abbr: "PF", accepts: ["PF"] },
    { id: "C", label: "Center", abbr: "C", accepts: ["C"] },
  ],
  eras: [
    { id: "1960s", label: "60s", startYear: 1960, endYear: 1969, required: true },
    { id: "1970s", label: "70s", startYear: 1970, endYear: 1979, required: true },
    { id: "1980s", label: "80s", startYear: 1980, endYear: 1989, required: true },
    { id: "1990s", label: "90s", startYear: 1990, endYear: 1999, required: true },
    { id: "2000s", label: "00s", startYear: 2000, endYear: 2009, required: true },
    { id: "2010s", label: "10s", startYear: 2010, endYear: 2019, required: true },
    { id: "2020s", label: "20s", startYear: 2020, endYear: 2029, required: true },
  ],
  franchises,
  stats: [
    { key: "ppg", label: "PPG", fullLabel: "Points", decimals: 1 },
    { key: "rpg", label: "RPG", fullLabel: "Rebounds", decimals: 1 },
    { key: "apg", label: "APG", fullLabel: "Assists", decimals: 1 },
    { key: "spg", label: "SPG", fullLabel: "Steals", decimals: 1 },
    { key: "bpg", label: "BPG", fullLabel: "Blocks", decimals: 1 },
  ],
  // Deflate pace-inflated older eras so a 1960s 30 PPG ~ a 2000s 25 PPG.
  // Steals/blocks weren't tracked before 1973-74; the seed data carries
  // reasonable estimates for pre-1974 players, so no factor is applied there.
  eraAdjustment: {
    mode: "multiplicative",
    factors: {
      "1960s": { ppg: 0.78, rpg: 0.7, apg: 0.85 },
      "1970s": { ppg: 0.9, rpg: 0.86, apg: 0.95 },
      "1980s": { ppg: 0.95, rpg: 0.95, apg: 0.98 },
      "1990s": { ppg: 1.0, rpg: 1.0, apg: 1.0 },
      "2000s": { ppg: 1.0, rpg: 1.0, apg: 1.0 },
      "2010s": { ppg: 1.0, rpg: 1.0, apg: 1.0 },
      "2020s": { ppg: 0.98, rpg: 1.0, apg: 0.98 },
    },
  },
  // Team totals = sum of the five starters' (era-adjusted) per-game stats.
  // Each category is gated: one weak category (e.g. no rim protection) caps
  // the record no matter how huge the scoring is.
  scoring: {
    mode: "shared",
    categories: [
      { key: "ppg", label: "Scoring", weight: 1.3, floor: 90, target: 125 },
      { key: "rpg", label: "Rebounding", weight: 1.0, floor: 34, target: 46 },
      { key: "apg", label: "Playmaking", weight: 1.0, floor: 18, target: 28 },
      { key: "spg", label: "Steals", weight: 0.8, floor: 5.8, target: 9 },
      { key: "bpg", label: "Rim Protection", weight: 0.8, floor: 3.8, target: 6.5 },
    ],
    gateStrength: 1.1,
    curve: { midpoint: 0.68, steepness: 9, maxWinFraction: 1.0 },
    perfectThreshold: 0.93,
  },
  theme: { primary: "#C8102E", accent: "#FDB927", bg: "#0b0f1a" },
};

export default nbaConfig;
