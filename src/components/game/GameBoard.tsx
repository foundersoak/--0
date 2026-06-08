"use client";
import { randomSeed, roundsOf } from "@/engine";
import type { PlayerDataset, SportConfig } from "@/engine/types";
import { AdSlot } from "@/components/ads/AdSlot";
import { useGame } from "@/lib/useGame";
import { CandidateList } from "./CandidateList";
import { ResultPanel } from "./ResultPanel";
import { RosterBoard } from "./RosterBoard";
import { SlotMachine } from "./SlotMachine";

export function GameBoard({
  config,
  dataset,
  seed,
}: {
  config: SportConfig;
  dataset: PlayerDataset;
  seed: string;
}) {
  const { engine, state, dispatch } = useGame(config, dataset, seed);
  const complete = state.phase === "complete";

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Lineup</h2>
          <span className="text-xs tabular-nums text-white/35">
            {state.filled.length}/{roundsOf(config)}
          </span>
        </div>
        <RosterBoard config={config} state={state} />
      </aside>

      <main className="min-w-0 space-y-5">
        {complete ? (
          <ResultPanel
            config={config}
            state={state}
            onPlayAgain={() => dispatch({ type: "RESET", seed: randomSeed() })}
          />
        ) : (
          <>
            <SlotMachine
              config={config}
              state={state}
              onSpin={() => dispatch({ type: "SPIN" })}
              onSkipTeam={() => dispatch({ type: "SKIP_TEAM" })}
              onSkipEra={() => dispatch({ type: "SKIP_ERA" })}
            />
            <CandidateList
              config={config}
              state={state}
              engine={engine}
              onPick={(playerId, slotId) => dispatch({ type: "PICK", playerId, slotId })}
            />
          </>
        )}
        <AdSlot format="leaderboard" className="mt-4" />
      </main>
    </div>
  );
}
