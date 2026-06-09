"use client";
import { useEffect, useState } from "react";
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
        <div className="relative flex items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute h-full w-full rounded-full bg-amber-400/25"
            animate={{ scale: [1, 1.4], opacity: [0.45, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <button
            type="button"
            onClick={onSpin}
            className="relative rounded-full bg-amber-400 px-12 py-5 text-xl font-black uppercase tracking-widest text-black shadow-lg shadow-amber-400/30 transition hover:scale-[1.04] hover:bg-amber-300 active:scale-95"
          >
            Spin
          </button>
        </div>
        <SkipsHint state={state} />
      </div>
    );
  }

  if (state.phase === "choosing" && state.spin) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {roundLabel}
        </div>
        <SlotReel
          config={config}
          team={state.spin.team}
          era={state.spin.era}
          spinKey={state.draws}
        />
        <div className="flex gap-2">
          <SkipButton label="Reroll Team" count={state.teamSkipsLeft} onClick={onSkipTeam} />
          <SkipButton label="Reroll Era" count={state.eraSkipsLeft} onClick={onSkipEra} />
        </div>
        <p className="text-sm text-white/50">Pick a player below ↓</p>
      </div>
    );
  }

  return null;
}

interface Face {
  name: string;
  era: string;
  color: string;
}

/** A slot-machine reel: flashes random franchises, decelerating onto the real draw. */
function SlotReel({
  config,
  team,
  era,
  spinKey,
}: {
  config: SportConfig;
  team: string;
  era: string;
  spinKey: number;
}) {
  const finalFace: Face = {
    name: teamName(config, team, era),
    era: eraLabel(config, era),
    color: teamColors(config, team)[0],
  };
  const [{ face, step, spinning }, set] = useState<{
    face: Face;
    step: number;
    spinning: boolean;
  }>({ face: finalFace, step: 0, spinning: false });

  useEffect(() => {
    const fillers: Face[] = Array.from({ length: 9 }, () => {
      const f = config.franchises[Math.floor(Math.random() * config.franchises.length)];
      const e = config.eras[Math.floor(Math.random() * config.eras.length)];
      return { name: f.name, era: e.label, color: f.colors[0] };
    });
    let i = 0;
    let s = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (i < fillers.length) {
        s += 1;
        set({ face: fillers[i], step: s, spinning: true });
        const delay = 28 + i * i * 5; // accelerating delays => visually decelerating reel
        i += 1;
        timer = setTimeout(tick, delay);
      } else {
        set({ face: finalFace, step: s + 1, spinning: false });
      }
    };
    // setState only fires inside the deferred tick callback, never synchronously here.
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="flex h-[64px] items-center justify-center overflow-hidden">
      <motion.div
        key={step}
        initial={{ y: spinning ? 26 : 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          spinning
            ? { duration: 0.06, ease: "linear" }
            : { type: "spring", stiffness: 300, damping: 18 }
        }
        className="flex flex-col items-center"
      >
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold tracking-wide text-white/70">
          {face.era}
        </span>
        <span
          className="mt-1 text-center text-2xl font-black leading-tight sm:text-3xl"
          style={{ color: face.color }}
        >
          {face.name}
        </span>
      </motion.div>
    </div>
  );
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
