"use client";
import { useState } from "react";
import type { Engine, GameState } from "@/engine";
import type { PlayerEntry, SportConfig } from "@/engine/types";
import { PlayerCard } from "./PlayerCard";

export function CandidateList({
  config,
  state,
  engine,
  onPick,
}: {
  config: SportConfig;
  state: GameState;
  engine: Engine;
  onPick: (playerId: string, slotId: string) => void;
}) {
  const [pending, setPending] = useState<PlayerEntry | null>(null);

  if (state.phase !== "choosing" || !state.spin) return null;

  const select = (player: PlayerEntry) => {
    const slots = engine.eligibleSlots(state, player);
    if (slots.length === 1) {
      onPick(player.id, slots[0].id);
    } else if (slots.length > 1) {
      setPending(player);
    }
  };

  const pendingSlots = pending ? engine.eligibleSlots(state, pending) : [];

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {state.spin.candidates.map((player) => (
          <PlayerCard
            key={player.id}
            config={config}
            player={player}
            onClick={() => select(player)}
            selected={pending?.id === player.id}
          />
        ))}
      </div>

      {pending ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#11161f] p-5 shadow-2xl">
            <div className="text-sm text-white/60">Place</div>
            <div className="text-lg font-bold text-white">{pending.name}</div>
            <div className="mt-3 text-xs uppercase tracking-wide text-white/40">at position</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {pendingSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => {
                    onPick(pending.id, slot.id);
                    setPending(null);
                  }}
                  className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
                >
                  {slot.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="mt-4 text-xs text-white/45 hover:text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
