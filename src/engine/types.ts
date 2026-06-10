/**
 * The generic contract that every sport plugs into. The engine and UI depend
 * ONLY on these types, they know nothing about basketball, football, etc.
 * A "sport" is just a {@link SportConfig} object + a {@link PlayerDataset}.
 */

export type SportId = "nba" | "nhl" | "nfl" | "cfb" | "mlb" | "epl";

/** Decade-ish bucket, e.g. "1990s". */
export type EraId = string;
/** Stable franchise slug, era-independent, e.g. "bulls". */
export type TeamId = string;
/** Position tag, e.g. "PG", "QB", "GK". */
export type PosId = string;
/** Raw stat key shown on cards / fed into scoring, e.g. "ppg". */
export type StatKey = string;
export type PlayerId = string;

/** One slot on the roster board. Slots are pre-expanded (two FLEX => FLEX1, FLEX2). */
export interface PositionSlot {
  id: string; // unique slot id within the roster, e.g. "PG" or "FLEX1"
  label: string; // "Point Guard"
  abbr: string; // "PG"
  accepts: PosId[]; // which player position tags may fill this slot
  group?: string; // "offense" | "defense" | "pitching"... for synthetic scoring
}

export interface EraDef {
  id: EraId; // "1990s"
  label: string; // "90s"
  startYear: number;
  endYear: number;
  /** If true, era diversity draws decades without replacement across rounds. */
  required?: boolean;
}

export interface FranchiseDef {
  id: TeamId; // "bulls"
  name: string; // canonical "Chicago Bulls"
  abbr: string; // "CHI"
  colors: [string, string]; // [primary, secondary] hex
  /** Decades this franchise can be drawn in (handles expansion/relocation/defunct). */
  activeEras: EraId[];
  /** Era-keyed historical names for relocations/renames (Sonics -> Thunder). */
  aliases?: { era: EraId; name: string }[];
}

/** A stat displayed on a player card. */
export interface StatDef {
  key: StatKey;
  label: string; // short, "PPG"
  fullLabel?: string; // "Points Per Game"
  higherIsBetter?: boolean; // default true (false for ERA, GAA, goals-against...)
  decimals?: number; // display precision (default 1)
}

/** A single (player, franchise, era) entry in the draftable pool. */
export interface PlayerEntry {
  id: PlayerId;
  name: string;
  team: TeamId;
  era: EraId;
  positions: PosId[]; // eligibility (multi: ["SG","SF"])
  stats: Record<StatKey, number>; // RAW era stats (pre-adjustment)
  /** 0-100 strength vs era+position peers; precomputed in ETL, HIDDEN in the UI. */
  rating?: number;
  notable?: string; // "MVP, 6x champ" flavor for the result card
}

export interface PlayerDataset {
  sport: SportId;
  version: string;
  source: string; // attribution string
  players: PlayerEntry[];
}

/** Era normalization: adjusted = raw * factors[era][stat] (missing => 1.0). */
export interface EraAdjustment {
  mode: "multiplicative";
  factors: Record<EraId, Partial<Record<StatKey, number>>>;
}

/**
 * A team-level category that is aggregated across the lineup and GATED.
 * - shared mode: `key` is a raw stat key; value = sum of that stat across the roster.
 * - synthetic mode: `key` is an axis filled by {@link PositionContribution} rules.
 */
export interface ScoringCategory {
  key: string;
  label: string;
  weight: number; // contribution to overall strength
  floor: number; // gating floor on the aggregated (era-adjusted) value
  target: number; // "elite" aggregated value, used to normalize strength to ~1.0
}

/** Maps a player's era-adjusted stats onto synthetic axis contributions. */
export interface PositionContribution {
  positions: PosId[]; // which player position tags this rule applies to
  contribute: (adjusted: Record<StatKey, number>) => Record<string, number>;
}

export interface ScoringConfig {
  mode: "shared" | "synthetic";
  categories: ScoringCategory[];
  positionScoring?: PositionContribution[]; // required for synthetic mode
  /** How harshly a below-floor category caps the win fraction (bigger = harsher). */
  gateStrength: number;
  /** Logistic curve mapping overall strength -> win fraction. */
  curve: { midpoint: number; steepness: number; maxWinFraction: number };
  /** All gates pass AND winFraction >= this => undefeated season. */
  perfectThreshold: number;
}

export interface SportConfig {
  id: SportId;
  name: string; // "NBA"
  brand: string; // "82-0"
  tagline: string; // marketing line for the landing page
  blurb?: string; // 1-2 sentence how-it-works
  seasonGames: number; // 82, 17, 162, 38, 12
  positions: PositionSlot[]; // ordered; length === rounds
  /** How many times you can reroll a spin (a fresh team + era) per game. */
  rerolls: number;
  /** When true, each round draws a distinct decade (era diversity). */
  requireEraDiversity: boolean;
  eras: EraDef[];
  franchises: FranchiseDef[];
  stats: StatDef[]; // stats shown on player cards
  eraAdjustment: EraAdjustment;
  scoring: ScoringConfig;
  /**
   * Optional quick filters for the candidate picker, for sports whose spins can
   * surface many players at once (e.g. MLB hitters vs pitchers). The toggle is
   * only shown when a spin's candidates span more than one of these groups.
   */
  candidateFilters?: { label: string; positions: PosId[] }[];
  theme: { primary: string; accent: string; bg?: string };
}

/** Number of rounds == number of roster slots. */
export function roundsOf(config: SportConfig): number {
  return config.positions.length;
}
