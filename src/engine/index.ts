/**
 * Public engine API. A sport = a SportConfig (module) + a PlayerDataset (JSON).
 * `createEngine` binds them together into a reducer + selectors the React layer
 * drives. Everything here is framework-agnostic and unit-tested in Node.
 */
import {
  buildIndex,
  createInitialState,
  eligibleSlotsFor,
  makeReducer,
  openSlotsOf,
  type DataIndex,
  type GameAction,
  type GameState,
} from "./state";
import { simulateSeason, type FilledSlot, type SeasonResult } from "./simulate";
import type { PlayerDataset, PlayerEntry, PositionSlot, SportConfig } from "./types";

export * from "./types";
export * from "./rng";
export {
  simulateSeason,
  eraAdjustStats,
  type FilledSlot,
  type SeasonResult,
  type CategoryResult,
} from "./simulate";
export {
  createInitialState,
  makeReducer,
  openSlotsOf,
  eligibleSlotsFor,
  buildIndex,
  keyOf,
  type GameState,
  type GameAction,
  type Phase,
  type Spin,
} from "./state";

export interface Engine {
  config: SportConfig;
  dataset: PlayerDataset;
  index: DataIndex;
  initial: (seed: string) => GameState;
  reducer: (state: GameState, action: GameAction) => GameState;
  simulate: (filled: FilledSlot[]) => SeasonResult;
  openSlots: (state: GameState) => PositionSlot[];
  eligibleSlots: (state: GameState, player: PlayerEntry) => PositionSlot[];
}

export function createEngine(config: SportConfig, dataset: PlayerDataset): Engine {
  const index = buildIndex(dataset);
  const reducer = makeReducer(config, index);
  return {
    config,
    dataset,
    index,
    initial: (seed) => createInitialState(config, seed),
    reducer,
    simulate: (filled) => simulateSeason(filled, config),
    openSlots: (state) => openSlotsOf(config, state),
    eligibleSlots: (state, player) => eligibleSlotsFor(config, state, player),
  };
}
