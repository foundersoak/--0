"use client";
import { useState } from "react";
import { randomSeed, roundsOf } from "@/engine";
import type { PlayerDataset, PlayerEntry, SportConfig } from "@/engine/types";
import { AdSlot } from "@/components/ads/AdSlot";
import { useGame } from "@/lib/useGame";
import type { GameModeDef } from "@/lib/modes";
import { CandidateList } from "./CandidateList";
import { LiveMeters } from "./LiveMeters";
import { ResultPanel } from "./ResultPanel";
import { RosterBoard } from "./RosterBoard";
import { SlotMachine } from "./SlotMachine";

export function GameBoard({
  config,
  dataset,
  seed,
  mode,
  accent,
}: {
  config: SportConfig;
  dataset: PlayerDataset;
  seed: string;
  mode: GameModeDef;
  accent: string;
}) {
  const { engine, state, dispatch } = useGame(config, dataset, seed);
  const complete = state.phase === "complete";
  // Remember every candidate you passed on, for the post-game "one that got away".
  const [offered, setOffered] = useState<PlayerEntry[]>([]);

  const handlePick = (playerId: string, slotId: string) => {
    if (state.spin) {
      const passed = state.spin.candidates.filter((c) => c.id !== playerId);
      if (passed.length) setOffered((prev) => [...prev, ...passed]);
    }
    dispatch({ type: "PICK", playerId, slotId });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Lineup</h2>
          <div className="flex items-baseline gap-3">
            {state.filled.length > 0 ? (
              <button
                type="button"
                onClick={() => dispatch({ type: "UNDO" })}
                className="text-[11px] text-white/40 transition hover:text-white/80"
              >
                ↶ Undo
              </button>
            ) : null}
            <span className="text-xs tabular-nums text-white/35">
              {state.filled.length}/{roundsOf(config)}
            </span>
          </div>
        </div>
        <RosterBoard config={config} state={state} />
      </aside>

      <main className="min-w-0 space-y-5">
        {complete ? (
          <ResultPanel
            config={config}
            state={state}
            mode={mode}
            offered={offered}
            onPlayAgain={() =>
              dispatch({ type: "RESET", seed: mode.daily ? state.seed : randomSeed() })
            }
          />
        ) : (
          <>
            <SlotMachine
              config={config}
              state={state}
              onSpin={() => dispatch({ type: "SPIN" })}
              onReroll={() => dispatch({ type: "REROLL" })}
            />
            {mode.liveMeters ? <LiveMeters engine={engine} state={state} accent={accent} /> : null}
            <CandidateList
              config={config}
              state={state}
              engine={engine}
              hideStats={mode.hideStats}
              onPick={handlePick}
            />
          </>
        )}
        <AdSlot format="leaderboard" className="mt-4" />
      </main>
    </div>
  );
}
