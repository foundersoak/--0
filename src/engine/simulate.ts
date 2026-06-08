/**
 * The scoring brain. A pure function of the lineup (no RNG): the same roster
 * always produces the same record. This is where the addictive "feel" lives —
 * era adjustment, per-category gating (one weak category caps the record), and
 * a non-linear win curve.
 */
import type { PlayerEntry, SportConfig, StatKey } from "./types";

export interface FilledSlot {
  slotId: string;
  player: PlayerEntry;
}

export interface CategoryResult {
  key: string;
  label: string;
  value: number; // aggregated, era-adjusted
  floor: number;
  target: number;
  passed: boolean;
  deficit: number; // 0..1, fraction below the floor
  score: number; // value / target, normalized strength contribution
}

export interface SeasonResult {
  wins: number;
  losses: number;
  perfect: boolean;
  strength: number; // 0..~1+, weighted & normalized
  winFraction: number;
  categories: CategoryResult[];
  cappedBy: string | null; // label of the binding weak category, if any
  grade: string;
}

/** Apply era-normalization multipliers to a player's raw stat line. */
export function eraAdjustStats(
  player: PlayerEntry,
  config: SportConfig,
): Record<StatKey, number> {
  const factors = config.eraAdjustment.factors[player.era] ?? {};
  const out: Record<StatKey, number> = {};
  for (const [k, v] of Object.entries(player.stats)) {
    out[k] = v * (factors[k] ?? 1);
  }
  return out;
}

/** Aggregate the lineup into team-level category totals. */
function aggregateCategories(
  filled: FilledSlot[],
  config: SportConfig,
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const c of config.scoring.categories) totals[c.key] = 0;
  const { mode, positionScoring } = config.scoring;

  for (const slot of filled) {
    const adj = eraAdjustStats(slot.player, config);
    if (mode === "shared") {
      // category.key is a raw stat key: team total = sum across the roster
      for (const c of config.scoring.categories) {
        totals[c.key] += adj[c.key] ?? 0;
      }
    } else {
      // synthetic: map this player's stats onto axis contributions
      const rule = positionScoring?.find((r) =>
        r.positions.some((p) => slot.player.positions.includes(p)),
      );
      if (rule) {
        for (const [k, v] of Object.entries(rule.contribute(adj))) {
          if (k in totals) totals[k] += v;
        }
      }
    }
  }
  return totals;
}

function gradeFor(winFraction: number, perfect: boolean): string {
  if (perfect) return "S";
  const table: [number, string][] = [
    [0.92, "A+"],
    [0.85, "A"],
    [0.78, "A-"],
    [0.72, "B+"],
    [0.65, "B"],
    [0.58, "B-"],
    [0.5, "C+"],
    [0.42, "C"],
    [0.34, "C-"],
    [0.25, "D"],
  ];
  for (const [threshold, grade] of table) {
    if (winFraction >= threshold) return grade;
  }
  return "F";
}

/** Run a lineup through the season simulation and return its record. */
export function simulateSeason(
  filled: FilledSlot[],
  config: SportConfig,
): SeasonResult {
  const totals = aggregateCategories(filled, config);
  const { categories: cats, curve, gateStrength, perfectThreshold } =
    config.scoring;

  let weightSum = 0;
  let strengthAcc = 0;
  let worst: CategoryResult | null = null;

  const categories: CategoryResult[] = cats.map((c) => {
    const value = totals[c.key] ?? 0;
    const passed = value >= c.floor;
    const deficit = c.floor > 0 ? Math.max(0, (c.floor - value) / c.floor) : 0;
    const score = c.target > 0 ? value / c.target : 0;
    weightSum += c.weight;
    strengthAcc += c.weight * score;
    const r: CategoryResult = {
      key: c.key,
      label: c.label,
      value,
      floor: c.floor,
      target: c.target,
      passed,
      deficit,
      score,
    };
    if (deficit > 0 && (worst === null || deficit > worst.deficit)) worst = r;
    return r;
  });

  const strength = weightSum > 0 ? strengthAcc / weightSum : 0;

  // Non-linear strength -> win fraction.
  const p =
    curve.maxWinFraction /
    (1 + Math.exp(-curve.steepness * (strength - curve.midpoint)));

  // Gating: the worst below-floor category imposes a hard ceiling on wins.
  let cap = 1;
  for (const r of categories) {
    if (r.deficit > 0) cap = Math.min(cap, Math.max(0, 1 - gateStrength * r.deficit));
  }

  const winFraction = Math.min(p, cap);
  const allPass = categories.every((r) => r.passed);
  const perfect = allPass && p >= perfectThreshold;

  const games = config.seasonGames;
  const wins = perfect
    ? games
    : Math.max(0, Math.min(games - 1, Math.round(winFraction * games)));

  return {
    wins,
    losses: games - wins,
    perfect,
    strength,
    winFraction,
    categories,
    cappedBy: worst !== null ? (worst as CategoryResult).label : null,
    grade: gradeFor(winFraction, perfect),
  };
}
