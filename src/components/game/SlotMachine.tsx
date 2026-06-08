"use client";
import { motion } from "motion/react";
import { roundsOf, type GameState } from "@/engine";
import type { SportConfig } from "@/engine/types";
import { eraLabel, teamColors, teamName } from "@/lib/sportHelpers";

export function SlotMachine({
  config,
  state,
  onSpin,
  onSkipTeam,
  onSkipEra,
}: {
  config: SportConfig;
  state: GameState;
  onSpin: () => void;
  onSkipTeam: () => void;
  onSkipEra: () => void;
}) {
  const rounds = roundsOf(config);
  const roundLabel = `Round ${Math.min(state.round + 1, rounds)} of ${rounds}`;

  if (state.phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {roundLabel}
        </div>
        <button
          type="button"
          onClick={onSpin}
          className="rounded-full bg-amber-400 px-10 py-4 text-lg font-black uppercase tracking-widest text-black shadow-lg shadow-amber-400/20 transition hover:scale-[1.03] hover:bg-amber-300 active:scale-95"
        >
          Spin
        </button>
        <SkipsHint state={state} />
      </div>
    );
  }

  if (state.phase === "choosing" && state.spin) {
    const [primary] = teamColors(config, state.spin.team);
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {roundLabel}
        </div>
        <motion.div
          key={`${state.spin.team}:${state.spin.era}:${state.draws}`}
          initial={{ scale: 0.85, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="flex flex-col items-center"
        >
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold tracking-wide text-white/70">
            {eraLabel(config, state.spin.era)}
          </span>
          <span
            className="mt-1 text-center text-2xl font-black leading-tight sm:text-3xl"
            style={{ color: primary }}
          >
            {teamName(config, state.spin.team, state.spin.era)}
          </span>
        </motion.div>

        <div className="flex gap-2">
          <SkipButton
            label="Reroll Team"
            count={state.teamSkipsLeft}
            onClick={onSkipTeam}
          />
          <SkipButton label="Reroll Era" count={state.eraSkipsLeft} onClick={onSkipEra} />
        </div>
        <p className="text-sm text-white/50">Pick a player below ↓</p>
      </div>
    );
  }

  return null;
}

function SkipButton({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  const disabled = count <= 0;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:enabled:border-white/40 hover:enabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {label} <span className="tabular-nums text-white/50">({count})</span>
    </button>
  );
}

function SkipsHint({ state }: { state: GameState }) {
  return (
    <div className="text-[11px] text-white/35">
      Rerolls left — Team {state.teamSkipsLeft} · Era {state.eraSkipsLeft}
    </div>
  );
}
