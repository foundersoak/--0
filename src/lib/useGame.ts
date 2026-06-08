"use client";
import { useMemo, useReducer } from "react";
import { createEngine } from "@/engine";
import type { PlayerDataset, SportConfig } from "@/engine/types";

/** Bind a sport's engine to React state. */
export function useGame(config: SportConfig, dataset: PlayerDataset, seed: string) {
  const engine = useMemo(() => createEngine(config, dataset), [config, dataset]);
  const [state, dispatch] = useReducer(engine.reducer, seed, (s) => engine.initial(s));
  return { engine, state, dispatch };
}
