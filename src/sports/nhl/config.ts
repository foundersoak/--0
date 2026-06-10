import type { SportConfig } from "@/engine/types";
import { NHL_FRANCHISES } from "./franchises.generated";

const nhlConfig: SportConfig = {
  id: "nhl",
  name: "NHL",
  brand: "82-0",
  tagline: "Can your all-time NHL roster go 82-0?",
  blurb:
    "Spin a random franchise and decade, draft one legend at a position he played, build a forward line, a defense pair, and a goalie, and find out if your team can go undefeated.",
  seasonGames: 82,
  requireEraDiversity: true,
  rerolls: 2,
  positions: [
    { id: "C", label: "Center", abbr: "C", accepts: ["C"], group: "Forwards" },
    { id: "LW", label: "Left Wing", abbr: "LW", accepts: ["LW"], group: "Forwards" },
    { id: "RW", label: "Right Wing", abbr: "RW", accepts: ["RW"], group: "Forwards" },
    { id: "D1", label: "Defenseman", abbr: "D", accepts: ["D"], group: "Defense" },
    { id: "D2", label: "Defenseman", abbr: "D", accepts: ["D"], group: "Defense" },
    { id: "G", label: "Goalie", abbr: "G", accepts: ["G"], group: "Goalie" },
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
  franchises: NHL_FRANCHISES,
  stats: [
    { key: "g", label: "G", fullLabel: "Goals", decimals: 0 },
    { key: "a", label: "A", fullLabel: "Assists", decimals: 0 },
    { key: "p", label: "PTS", fullLabel: "Points", decimals: 0 },
    { key: "pm", label: "+/-", fullLabel: "Plus/Minus", decimals: 0 },
    { key: "w", label: "W", fullLabel: "Wins", decimals: 0 },
    { key: "svp", label: "SV%", fullLabel: "Save Percentage", decimals: 3 },
    { key: "gaa", label: "GAA", fullLabel: "Goals-Against Average", higherIsBetter: false, decimals: 2 },
    { key: "so", label: "SO", fullLabel: "Shutouts", decimals: 0 },
  ],
  // Scoring exploded in the 1980s (Gretzky had 90-goal, 160-assist seasons) and
  // cratered in the 2000s dead-puck era. Deflate the high-scoring decades and
  // inflate the low ones so a 1985 winger and a 2024 winger compete fairly;
  // goalie GAA and plus-minus get the same era treatment.
  eraAdjustment: {
    mode: "multiplicative",
    factors: {
      "1960s": { g: 1.05, a: 1.1, p: 1.08, pm: 0.85, gaa: 0.95 },
      "1970s": { g: 0.82, a: 0.8, p: 0.81, pm: 0.7, gaa: 0.9 },
      "1980s": { g: 0.6, a: 0.55, p: 0.57, pm: 0.6, gaa: 0.78 },
      "1990s": { g: 0.82, a: 0.82, p: 0.82, pm: 0.8, gaa: 0.92 },
      "2000s": { g: 1.15, a: 1.15, p: 1.15, pm: 1.0, gaa: 1.05 },
      "2020s": { g: 0.95, a: 0.95, p: 0.95 },
    },
  },
  // Synthetic scoring: forwards drive Scoring and Playmaking, the defense pair
  // anchors Defense (and chips in some offense), and the goalie is Goaltending.
  // Every axis is gated, so a weak goalie, a soft blue line, or no finishing
  // caps the record no matter how loaded the rest of the roster is.
  //
  // Targets calibrated from 2000 random era-diverse rosters:
  //   scoring avg=152 p10=129 p95=183  → target=210 puts avg at ~0.72 strength
  //   playmaking avg=216 p10=184 p95=260  → target=310
  //   defense avg=46 p10=36 p95=69  → target=60
  //   goaltending avg=32 p10=24 p95=41  → target=40
  // Curve midpoint=0.65 + steepness=10 maps p50 roster → ~57 wins,
  // p90 → ~76 wins, top ~5% can reach 82-0 when all gates pass.
  scoring: {
    mode: "synthetic",
    categories: [
      { key: "scoring", label: "Scoring", weight: 1.1, floor: 120, target: 210 },
      { key: "playmaking", label: "Playmaking", weight: 1.1, floor: 165, target: 310 },
      { key: "defense", label: "Defense", weight: 1.0, floor: 34, target: 60 },
      { key: "goaltending", label: "Goaltending", weight: 1.1, floor: 24, target: 40 },
    ],
    positionScoring: [
      {
        positions: ["C", "LW", "RW"],
        contribute: (s) => ({ scoring: s.g ?? 0, playmaking: s.a ?? 0 }),
      },
      {
        // Defensemen anchor Defense (plus-minus + overall value) and chip in some
        // offense from the blue line.
        positions: ["D"],
        contribute: (s) => ({
          defense: (s.pm ?? 0) * 0.4 + (s.p ?? 0) * 0.15,
          scoring: (s.g ?? 0) * 0.6,
          playmaking: (s.a ?? 0) * 0.6,
        }),
      },
      {
        positions: ["G"],
        contribute: (s) => ({
          goaltending:
            ((s.svp ?? 0.88) - 0.88) * 200 +
            Math.max(0, 3.2 - (s.gaa ?? 3.2)) * 8 +
            (s.w ?? 0) * 0.3 +
            (s.so ?? 0) * 0.5,
        }),
      },
    ],
    gateStrength: 1.5,
    curve: { midpoint: 0.69, steepness: 10, maxWinFraction: 1.0 },
    perfectThreshold: 0.93,
  },
  candidateFilters: [
    { label: "Skaters", positions: ["C", "LW", "RW", "D"] },
    { label: "Goalies", positions: ["G"] },
  ],
  theme: { primary: "#0a3161", accent: "#A2AAAD", bg: "#0b0f1a" },
};

export default nhlConfig;
