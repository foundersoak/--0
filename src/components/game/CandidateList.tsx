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
  hideStats = false,
}: {
  config: SportConfig;
  state: GameState;
  engine: Engine;
  onPick: (playerId: string, slotId: string) => void;
  hideStats?: boolean;
}) {
  const [pending, setPending] = useState<PlayerEntry | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  if (state.phase !== "choosing" || !state.spin) return null;

  const candidates = state.spin.candidates;
  const matches = (p: PlayerEntry, positions: string[]) => p.positions.some((x) => positions.includes(x));
  // Only the filters that actually appear among this spin's candidates.
  const present = (config.candidateFilters ?? []).filter((f) => candidates.some((p) => matches(p, f.positions)));
  const showFilters = present.length >= 2;
  const active = showFilters && filter ? (present.find((f) => f.label === filter) ?? null) : null;
  const shown = active ? candidates.filter((p) => matches(p, active.positions)) : candidates;

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
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
          {shown.length} {shown.length === 1 ? "player" : "players"} · pick one
        </span>
        <span className="text-[11px] text-white/30">{hideStats ? "stats hidden" : "best first"}</span>
      </div>

      {showFilters ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {[{ label: "All" } as { label: string }, ...present].map((f) => {
            const isActive = f.label === "All" ? !active : active?.label === f.label;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilter(f.label === "All" ? null : f.label)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? "bg-amber-400 text-black"
                    : "border border-white/15 text-white/65 hover:border-white/35 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="grid max-h-[58vh] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {shown.map((player) => (
          <PlayerCard
            key={player.id}
            config={config}
            player={player}
            onClick={() => select(player)}
            selected={pending?.id === player.id}
            hideStats={hideStats}
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
