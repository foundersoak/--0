/**
 * The game state machine: rounds, spins, rerolls, and roster filling. A pure
 * reducer so it's fully testable in Node and deterministic given a seed + the
 * sequence of actions.
 */
import { pick, rngFor } from "./rng";
import { simulateSeason, type FilledSlot, type SeasonResult } from "./simulate";
import type { EraId, PlayerEntry, PlayerDataset, PositionSlot, SportConfig, TeamId } from "./types";

export type Phase = "ready" | "choosing" | "complete";

export interface Spin {
  team: TeamId;
  era: EraId;
  candidates: PlayerEntry[]; // players of (team, era) eligible for an open slot
}

export interface GameState {
  seed: string;
  round: number; // 0-based; equals number of filled slots
  phase: Phase;
  spin: Spin | null;
  filled: FilledSlot[];
  rerollsLeft: number;
  usedTeamEras: string[]; // `${team}::${era}` keys already drawn
  draws: number; // count of spins+rerolls, drives the deterministic RNG stream
  result: SeasonResult | null;
}

export type GameAction =
  | { type: "SPIN" }
  | { type: "REROLL" }
  | { type: "PICK"; playerId: string; slotId: string }
  | { type: "UNDO" }
  | { type: "RESET"; seed?: string };

const SEP = "::";
export const keyOf = (team: TeamId, era: EraId): string => `${team}${SEP}${era}`;

/** A spin prefers (team, era) pools offering at least this many eligible
 *  candidates, falling back to thinner pools only when nothing richer fits. */
const MIN_RICH_CANDIDATES = 4;

export interface DataIndex {
  byKey: Map<string, PlayerEntry[]>;
  pairs: { team: TeamId; era: EraId; key: string }[];
}

export function buildIndex(dataset: PlayerDataset): DataIndex {
  const byKey = new Map<string, PlayerEntry[]>();
  for (const p of dataset.players) {
    const k = keyOf(p.team, p.era);
    let arr = byKey.get(k);
    if (!arr) {
      arr = [];
      byKey.set(k, arr);
    }
    arr.push(p);
  }
  const pairs = [...byKey.keys()].map((k) => {
    const idx = k.indexOf(SEP);
    return { team: k.slice(0, idx), era: k.slice(idx + SEP.length), key: k };
  });
  return { byKey, pairs };
}

/** Roster slots not yet filled. */
export function openSlotsOf(config: SportConfig, state: GameState): PositionSlot[] {
  const filledIds = new Set(state.filled.map((f) => f.slotId));
  return config.positions.filter((s) => !filledIds.has(s.id));
}

function playerFitsSlot(player: PlayerEntry, slot: PositionSlot): boolean {
  return slot.accepts.some((a) => player.positions.includes(a));
}

function eligibleForAnyOpen(player: PlayerEntry, openSlots: PositionSlot[]): boolean {
  return openSlots.some((s) => playerFitsSlot(player, s));
}

/** Open slots a given candidate could be placed in. */
export function eligibleSlotsFor(
  config: SportConfig,
  state: GameState,
  player: PlayerEntry,
): PositionSlot[] {
  return openSlotsOf(config, state).filter((s) => playerFitsSlot(player, s));
}

interface DrawOpts {
  excludeTeam?: TeamId;
  excludeEra?: EraId;
  sameEra?: EraId;
}

/** Draw a (team, era) the player can actually use, honoring constraints + diversity. */
function drawSpin(
  config: SportConfig,
  index: DataIndex,
  rng: () => number,
  state: GameState,
  opts: DrawOpts,
): Spin {
  const open = openSlotsOf(config, state);
  const used = new Set(state.usedTeamEras);
  const usedEras = new Set(state.filled.map((f) => f.player.era));

  const usable = (key: string): boolean => {
    const players = index.byKey.get(key);
    return !!players && !used.has(key) && players.some((p) => eligibleForAnyOpen(p, open));
  };

  let pairs = index.pairs.filter((pr) => usable(pr.key));

  // Narrowing helper: apply a filter only if it leaves at least one option.
  const narrow = (pred: (pr: DataIndex["pairs"][number]) => boolean) => {
    const f = pairs.filter(pred);
    if (f.length) pairs = f;
  };

  if (config.requireEraDiversity) narrow((pr) => !usedEras.has(pr.era));
  if (opts.sameEra) narrow((pr) => pr.era === opts.sameEra);
  if (opts.excludeEra) narrow((pr) => pr.era !== opts.excludeEra);
  if (opts.excludeTeam) narrow((pr) => pr.team !== opts.excludeTeam);

  // Prefer pools that actually offer a choice: bias toward (team, era) buckets
  // with several players still eligible for an open slot, so a spin rarely
  // surfaces just one or two names. Applied last and only when it leaves an
  // option, so a thin-but-required era still works as a graceful fallback.
  const eligibleCount = (key: string): number =>
    index.byKey.get(key)!.filter((p) => eligibleForAnyOpen(p, open)).length;
  narrow((pr) => eligibleCount(pr.key) >= MIN_RICH_CANDIDATES);

  // Ultimate fallback: any usable pair (ignores diversity/exclusions).
  if (pairs.length === 0) pairs = index.pairs.filter((pr) => usable(pr.key));

  const chosen = pick(rng, pairs);
  const candidates = index.byKey
    .get(chosen.key)!
    .filter((p) => eligibleForAnyOpen(p, open));
  return { team: chosen.team, era: chosen.era, candidates };
}

export function createInitialState(config: SportConfig, seed: string): GameState {
  return {
    seed,
    round: 0,
    phase: "ready",
    spin: null,
    filled: [],
    rerollsLeft: config.rerolls,
    usedTeamEras: [],
    draws: 0,
    result: null,
  };
}

/** Build the reducer bound to a sport's config + data index. */
export function makeReducer(config: SportConfig, index: DataIndex) {
  return function reducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case "SPIN": {
        if (state.phase === "complete") return state;
        const rng = rngFor(state.seed, state.draws);
        const spin = drawSpin(config, index, rng, state, {});
        return { ...state, spin, phase: "choosing", draws: state.draws + 1 };
      }
      case "REROLL": {
        // One general reroll: redraw a fresh spin. Excluding the current team
        // guarantees a visibly different franchise (era follows the diversity
        // rules), rather than quietly changing only one dimension.
        if (!state.spin || state.rerollsLeft <= 0) return state;
        const rng = rngFor(state.seed, state.draws);
        const spin = drawSpin(config, index, rng, state, { excludeTeam: state.spin.team });
        return { ...state, spin, rerollsLeft: state.rerollsLeft - 1, draws: state.draws + 1 };
      }
      case "PICK": {
        if (!state.spin || state.phase !== "choosing") return state;
        const slot = config.positions.find((s) => s.id === action.slotId);
        if (!slot || state.filled.some((f) => f.slotId === slot.id)) return state;
        const player = state.spin.candidates.find((p) => p.id === action.playerId);
        if (!player || !playerFitsSlot(player, slot)) return state;

        const filled = [...state.filled, { slotId: slot.id, player }];
        const usedTeamEras = [...state.usedTeamEras, keyOf(state.spin.team, state.spin.era)];
        const done = filled.length >= config.positions.length;
        return {
          ...state,
          filled,
          usedTeamEras,
          spin: null,
          round: state.round + 1,
          phase: done ? "complete" : "ready",
          result: done ? simulateSeason(filled, config) : null,
        };
      }
      case "UNDO": {
        // Step back one pick (works even after the season is simulated).
        if (state.filled.length === 0) return state;
        return {
          ...state,
          filled: state.filled.slice(0, -1),
          usedTeamEras: state.usedTeamEras.slice(0, -1),
          spin: null,
          round: Math.max(0, state.round - 1),
          phase: "ready",
          result: null,
        };
      }
      case "RESET":
        return createInitialState(config, action.seed ?? state.seed);
      default:
        return state;
    }
  };
}
