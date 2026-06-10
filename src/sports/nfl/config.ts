import type { SportConfig } from "@/engine/types";
import { NFL_FRANCHISES } from "./franchises.generated";

const nflConfig: SportConfig = {
  id: "nfl",
  name: "NFL",
  brand: "17-0",
  tagline: "Can your all-time NFL roster go 17-0?",
  blurb:
    "Spin a random franchise and decade, draft one legend at a position he played, fill an offense and a defense, and find out if your team can run the regular-season table.",
  seasonGames: 17,
  requireEraDiversity: true,
  rerolls: 2,
  positions: [
    { id: "QB", label: "Quarterback", abbr: "QB", accepts: ["QB"], group: "Offense" },
    { id: "RB", label: "Running Back", abbr: "RB", accepts: ["RB"], group: "Offense" },
    { id: "WR1", label: "Wide Receiver", abbr: "WR", accepts: ["WR"], group: "Offense" },
    { id: "WR2", label: "Wide Receiver", abbr: "WR", accepts: ["WR"], group: "Offense" },
    { id: "TE", label: "Tight End", abbr: "TE", accepts: ["TE"], group: "Offense" },
    { id: "OL1", label: "Offensive Line", abbr: "OL", accepts: ["OL"], group: "Offense" },
    { id: "OL2", label: "Offensive Line", abbr: "OL", accepts: ["OL"], group: "Offense" },
    { id: "DL1", label: "Defensive Line", abbr: "DL", accepts: ["DL"], group: "Defense" },
    { id: "DL2", label: "Defensive Line", abbr: "DL", accepts: ["DL"], group: "Defense" },
    { id: "LB", label: "Linebacker", abbr: "LB", accepts: ["LB"], group: "Defense" },
    { id: "DB1", label: "Defensive Back", abbr: "DB", accepts: ["DB"], group: "Defense" },
    { id: "DB2", label: "Defensive Back", abbr: "DB", accepts: ["DB"], group: "Defense" },
  ],
  eras: [
    { id: "1960s", label: "1960s", startYear: 1960, endYear: 1969, required: true },
    { id: "1970s", label: "1970s", startYear: 1970, endYear: 1979, required: true },
    { id: "1980s", label: "1980s", startYear: 1980, endYear: 1989, required: true },
    { id: "1990s", label: "1990s", startYear: 1990, endYear: 1999, required: true },
    { id: "2000s", label: "2000s", startYear: 2000, endYear: 2009, required: true },
    { id: "2010s", label: "2010s", startYear: 2010, endYear: 2019, required: true },
    { id: "2020s", label: "2020s", startYear: 2020, endYear: 2029, required: true },
  ],
  franchises: NFL_FRANCHISES,
  stats: [
    { key: "pyds", label: "PASS YDS", fullLabel: "Passing Yards", decimals: 0 },
    { key: "ptd", label: "PASS TD", fullLabel: "Passing TDs", decimals: 0 },
    { key: "pint", label: "INT", fullLabel: "Interceptions", higherIsBetter: false, decimals: 0 },
    { key: "ryds", label: "RUSH YDS", fullLabel: "Rushing Yards", decimals: 0 },
    { key: "rtd", label: "RUSH TD", fullLabel: "Rushing TDs", decimals: 0 },
    { key: "rec", label: "REC", fullLabel: "Receptions", decimals: 0 },
    { key: "recyds", label: "REC YDS", fullLabel: "Receiving Yards", decimals: 0 },
    { key: "rectd", label: "REC TD", fullLabel: "Receiving TDs", decimals: 0 },
    { key: "apro", label: "ALL-PRO", fullLabel: "First-Team All-Pro selections", decimals: 0 },
    { key: "pb", label: "PRO BOWLS", fullLabel: "Pro Bowl selections", decimals: 0 },
    { key: "sacks", label: "SACKS", fullLabel: "Sacks", decimals: 1 },
    { key: "tkl", label: "TACKLES", fullLabel: "Tackles", decimals: 0 },
    { key: "ff", label: "FF", fullLabel: "Forced Fumbles", decimals: 0 },
    { key: "int", label: "INT", fullLabel: "Interceptions", decimals: 0 },
    { key: "pd", label: "PD", fullLabel: "Passes Defended", decimals: 0 },
  ],
  // Passing and receiving exploded over the decades; deflate modern, inflate the
  // run-first early eras so a 1970s passer competes with a 2010s one. Accolade
  // stats (OL) and defensive counting stats are left as-is.
  eraAdjustment: {
    mode: "multiplicative",
    factors: {
      "1960s": { pyds: 1.5, ptd: 1.3, recyds: 1.4, rectd: 1.2 },
      "1970s": { pyds: 1.4, ptd: 1.25, recyds: 1.35, rectd: 1.2 },
      "1980s": { pyds: 1.15, ptd: 1.08, recyds: 1.15 },
      "1990s": { pyds: 1.05, recyds: 1.05 },
      "2010s": { pyds: 0.9, recyds: 0.92 },
      "2020s": { pyds: 0.9, recyds: 0.92 },
    },
  },
  // Synthetic scoring: the 7 offensive players feed Passing / Rushing /
  // Receiving (the line anchors the run and protection), the 5 defenders feed
  // Pass Rush and Coverage. Every axis is gated, so a roster with no line, no
  // pass rush, or no secondary gets capped no matter how loaded the rest is.
  scoring: {
    mode: "synthetic",
    categories: [
      { key: "passing", label: "Passing", weight: 1.2, floor: 50, target: 120 },
      { key: "rushing", label: "Rushing", weight: 1.0, floor: 23, target: 58 },
      { key: "receiving", label: "Receiving", weight: 1.1, floor: 56, target: 112 },
      { key: "passrush", label: "Pass Rush", weight: 1.1, floor: 28, target: 92 },
      { key: "coverage", label: "Coverage", weight: 1.0, floor: 33, target: 80 },
    ],
    positionScoring: [
      {
        positions: ["QB"],
        contribute: (s) => ({
          passing: (s.pyds ?? 0) / 100 + (s.ptd ?? 0) * 1.4 - (s.pint ?? 0) * 0.7,
        }),
      },
      {
        positions: ["RB"],
        contribute: (s) => ({
          rushing: (s.ryds ?? 0) / 100 + (s.rtd ?? 0) * 1.2 + (s.rec ?? 0) * 0.04,
        }),
      },
      {
        positions: ["WR", "TE"],
        contribute: (s) => ({
          receiving: (s.recyds ?? 0) / 100 + (s.rectd ?? 0) * 1.2 + (s.rec ?? 0) * 0.03,
        }),
      },
      {
        // Offensive line has no box stats: rate by accolades and feed the run
        // game and pass protection.
        positions: ["OL"],
        contribute: (s) => {
          const block = (s.apro ?? 0) * 0.7 + (s.pb ?? 0) * 0.25;
          return { passing: block * 0.5, rushing: block * 0.6 };
        },
      },
      {
        positions: ["DL"],
        contribute: (s) => ({
          passrush: (s.sacks ?? 0) * 1.3 + (s.ff ?? 0) * 1.0 + (s.tkl ?? 0) * 0.05,
        }),
      },
      {
        positions: ["LB"],
        contribute: (s) => ({
          passrush: (s.sacks ?? 0) * 1.0 + (s.tkl ?? 0) * 0.05,
          coverage: (s.int ?? 0) * 2.5 + (s.tkl ?? 0) * 0.03,
        }),
      },
      {
        positions: ["DB"],
        contribute: (s) => ({
          coverage: (s.int ?? 0) * 2.5 + (s.pd ?? 0) * 0.5 + (s.tkl ?? 0) * 0.04,
        }),
      },
    ],
    gateStrength: 1.0,
    curve: { midpoint: 0.6, steepness: 9, maxWinFraction: 1.0 },
    perfectThreshold: 0.97,
  },
  candidateFilters: [
    { label: "Offense", positions: ["QB", "RB", "WR", "TE", "OL"] },
    { label: "Defense", positions: ["DL", "LB", "DB"] },
  ],
  theme: { primary: "#013369", accent: "#D50A0A", bg: "#0b0f1a" },
};

export default nflConfig;
