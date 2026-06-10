import type { SportConfig } from "@/engine/types";
import { MLB_FRANCHISES } from "./franchises.generated";

const mlbConfig: SportConfig = {
  id: "mlb",
  name: "MLB",
  brand: "162-0",
  tagline: "Can your all-time MLB roster go 162-0?",
  blurb:
    "Spin a random franchise and decade, draft one legend at a position he played, fill a full lineup plus a rotation and a closer, and find out if your team can run the table.",
  seasonGames: 162,
  requireEraDiversity: true,
  // 13 roster spots, 12 decades: the first dozen draws are distinct decades and
  // the last reuses one (the engine relaxes diversity when it would block a draw).
  skips: { team: 1, era: 1 },
  positions: [
    { id: "C", label: "Catcher", abbr: "C", accepts: ["C"], group: "Lineup" },
    { id: "1B", label: "First Base", abbr: "1B", accepts: ["1B"], group: "Lineup" },
    { id: "2B", label: "Second Base", abbr: "2B", accepts: ["2B"], group: "Lineup" },
    { id: "3B", label: "Third Base", abbr: "3B", accepts: ["3B"], group: "Lineup" },
    { id: "SS", label: "Shortstop", abbr: "SS", accepts: ["SS"], group: "Lineup" },
    { id: "LF", label: "Left Field", abbr: "LF", accepts: ["LF"], group: "Lineup" },
    { id: "CF", label: "Center Field", abbr: "CF", accepts: ["CF"], group: "Lineup" },
    { id: "RF", label: "Right Field", abbr: "RF", accepts: ["RF"], group: "Lineup" },
    { id: "DH", label: "Designated Hitter", abbr: "DH", accepts: ["DH"], group: "Lineup" },
    { id: "SP1", label: "Starting Pitcher", abbr: "SP", accepts: ["SP"], group: "Rotation" },
    { id: "SP2", label: "Starting Pitcher", abbr: "SP", accepts: ["SP"], group: "Rotation" },
    { id: "SP3", label: "Starting Pitcher", abbr: "SP", accepts: ["SP"], group: "Rotation" },
    { id: "CL", label: "Closer", abbr: "CL", accepts: ["CL"], group: "Bullpen" },
  ],
  eras: [
    { id: "1910s", label: "10s", startYear: 1910, endYear: 1919, required: true },
    { id: "1920s", label: "20s", startYear: 1920, endYear: 1929, required: true },
    { id: "1930s", label: "30s", startYear: 1930, endYear: 1939, required: true },
    { id: "1940s", label: "40s", startYear: 1940, endYear: 1949, required: true },
    { id: "1950s", label: "50s", startYear: 1950, endYear: 1959, required: true },
    { id: "1960s", label: "60s", startYear: 1960, endYear: 1969, required: true },
    { id: "1970s", label: "70s", startYear: 1970, endYear: 1979, required: true },
    { id: "1980s", label: "80s", startYear: 1980, endYear: 1989, required: true },
    { id: "1990s", label: "90s", startYear: 1990, endYear: 1999, required: true },
    { id: "2000s", label: "00s", startYear: 2000, endYear: 2009, required: true },
    { id: "2010s", label: "10s", startYear: 2010, endYear: 2019, required: true },
    { id: "2020s", label: "20s", startYear: 2020, endYear: 2029, required: true },
  ],
  franchises: MLB_FRANCHISES,
  stats: [
    { key: "avg", label: "AVG", fullLabel: "Batting Average", decimals: 3 },
    { key: "hr", label: "HR", fullLabel: "Home Runs", decimals: 0 },
    { key: "rbi", label: "RBI", fullLabel: "Runs Batted In", decimals: 0 },
    { key: "obp", label: "OBP", fullLabel: "On-Base %", decimals: 3 },
    { key: "slg", label: "SLG", fullLabel: "Slugging %", decimals: 3 },
    { key: "sb", label: "SB", fullLabel: "Stolen Bases", decimals: 0 },
    { key: "w", label: "W", fullLabel: "Wins", decimals: 0 },
    { key: "era", label: "ERA", fullLabel: "Earned Run Average", higherIsBetter: false, decimals: 2 },
    { key: "k", label: "K", fullLabel: "Strikeouts", decimals: 0 },
    { key: "whip", label: "WHIP", fullLabel: "Walks + Hits per IP", higherIsBetter: false, decimals: 2 },
    { key: "sv", label: "SV", fullLabel: "Saves", decimals: 0 },
  ],
  // Era normalization: deflate live-ball/steroid offense, boost dead-ball power
  // and 1960s pitching-era hitting, and re-context pitcher ERA. Adjusted stats
  // feed scoring only; player cards show the real (raw) numbers.
  eraAdjustment: {
    mode: "multiplicative",
    factors: {
      "1910s": { slg: 1.18, era: 1.06 },
      "1920s": { avg: 0.96, slg: 0.97, era: 0.92, whip: 0.97 },
      "1930s": { avg: 0.96, slg: 0.97, era: 0.92, whip: 0.97 },
      "1960s": { avg: 1.04, obp: 1.03, slg: 1.05, era: 1.05 },
      "1970s": { slg: 1.02, era: 1.02 },
      "1990s": { slg: 0.96, era: 0.94 },
      "2000s": { slg: 0.94, era: 0.92 },
    },
  },
  // Synthetic scoring: each player maps onto team axes. Nine hitters feed
  // Contact / Power / On-Base; three starters feed the Rotation; the closer is
  // the Bullpen. Every axis is gated, so punting one (no real arms, all
  // slap-hitters, no closer) caps the record no matter how loaded the rest is.
  scoring: {
    mode: "synthetic",
    categories: [
      { key: "contact", label: "Contact", weight: 1.0, floor: 2.45, target: 3.0 },
      { key: "power", label: "Power", weight: 1.1, floor: 3.85, target: 5.25 },
      { key: "onbase", label: "On-Base", weight: 1.0, floor: 3.05, target: 3.85 },
      { key: "rotation", label: "Rotation", weight: 1.3, floor: 12.5, target: 19.5 },
      { key: "bullpen", label: "Bullpen", weight: 0.6, floor: 2.6, target: 6.0 },
    ],
    positionScoring: [
      {
        positions: ["C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
        contribute: (s) => ({ contact: s.avg ?? 0, power: s.slg ?? 0, onbase: s.obp ?? 0 }),
      },
      {
        positions: ["SP"],
        contribute: (s) => ({
          rotation:
            Math.max(0, 6.2 - (s.era ?? 9)) +
            Math.max(0, 1.55 - (s.whip ?? 2)) * 3 +
            (s.k ?? 0) * 0.006,
        }),
      },
      {
        positions: ["CL"],
        contribute: (s) => ({
          bullpen:
            (s.sv ?? 0) * 0.05 +
            Math.max(0, 4.5 - (s.era ?? 9)) * 0.9 +
            Math.max(0, 1.4 - (s.whip ?? 2)) * 4,
        }),
      },
    ],
    gateStrength: 1.0,
    curve: { midpoint: 0.78, steepness: 14, maxWinFraction: 1.0 },
    perfectThreshold: 0.96,
  },
  theme: { primary: "#002D72", accent: "#E4002C", bg: "#0b0f1a" },
};

export default mlbConfig;
