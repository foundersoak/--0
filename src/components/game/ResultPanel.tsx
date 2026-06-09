"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { CategoryResult, GameState } from "@/engine";
import type { SportConfig } from "@/engine/types";
import type { GameModeDef } from "@/lib/modes";
import { dailyDateFromSeed, encodeShare, shareGrid } from "@/lib/share";
import { RosterBoard } from "./RosterBoard";

export function ResultPanel({
  config,
  state,
  onPlayAgain,
  mode,
}: {
  config: SportConfig;
  state: GameState;
  onPlayAgain: () => void;
  mode?: GameModeDef;
}) {
  const [copied, setCopied] = useState(false);
  const result = state.result;
  if (!result) return null;

  const share = async () => {
    const ordered = config.positions.map(
      (slot) => state.filled.find((f) => f.slotId === slot.id)?.player.id ?? "",
    );
    const code = encodeShare(config.id, state.seed, ordered);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/${config.id}?r=${encodeURIComponent(code)}`
        : "";
    const grid = shareGrid(result.categories.map((c) => c.passed));
    const dailyTag = mode?.daily ? ` · Daily ${dailyDateFromSeed(state.seed) ?? ""}`.trimEnd() : "";
    const headline = result.perfect
      ? `${result.wins}-${result.losses} — UNDEFEATED 🏆`
      : `${result.wins}-${result.losses} (${result.grade})`;
    const text = `${config.brand} ${config.name}${dailyTag}\n${headline}\n${grid}\nCan you go ${config.brand}?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${config.brand} ${config.name}`, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user dismissed the share sheet — no-op */
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex flex-col items-center"
      >
        {mode?.daily ? (
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Daily · {dailyDateFromSeed(state.seed)}
          </div>
        ) : null}
        {result.perfect ? (
          <div className="mb-1 rounded-full bg-amber-400 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-black">
            Undefeated
          </div>
        ) : null}
        <div className="flex items-center gap-3">
          <span className="text-6xl font-black tabular-nums text-white sm:text-7xl">
            {result.wins}-{result.losses}
          </span>
          <span
            className={`rounded-xl px-3 py-1 text-2xl font-black ${
              result.perfect ? "bg-amber-400 text-black" : "bg-white/10 text-white"
            }`}
          >
            {result.grade}
          </span>
        </div>
        {!result.perfect && result.cappedBy ? (
          <p className="mt-2 text-sm text-rose-300">
            Capped by weak <span className="font-semibold">{result.cappedBy}</span>
          </p>
        ) : null}
        {result.perfect ? (
          <p className="mt-2 text-sm text-amber-200/80">A flawless season. Untouchable.</p>
        ) : null}
      </motion.div>

      <div className="w-full space-y-2">
        {result.categories.map((c) => (
          <CategoryBar key={c.key} cat={c} />
        ))}
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={share}
          className="flex-1 rounded-xl bg-amber-400 px-4 py-3 font-bold text-black transition hover:bg-amber-300"
        >
          {copied ? "Link copied!" : "Share result"}
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 rounded-xl border border-white/20 px-4 py-3 font-bold text-white transition hover:bg-white/5"
        >
          Play again
        </button>
      </div>

      <div className="w-full">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
          Your roster
        </div>
        <RosterBoard config={config} state={state} />
      </div>
    </div>
  );
}

function CategoryBar({ cat }: { cat: CategoryResult }) {
  const fillPct = Math.max(0, Math.min(1, cat.target > 0 ? cat.value / cat.target : 0)) * 100;
  const floorPct = Math.max(0, Math.min(1, cat.target > 0 ? cat.floor / cat.target : 0)) * 100;
  return (
    <div>
      <div className="mb-0.5 flex items-baseline justify-between text-xs">
        <span className={cat.passed ? "text-white/70" : "font-semibold text-rose-300"}>
          {cat.label}
        </span>
        <span className="tabular-nums text-white/45">{cat.value.toFixed(1)}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${cat.passed ? "bg-emerald-400/80" : "bg-rose-500/80"}`}
          style={{ width: `${fillPct}%` }}
        />
        <div
          className="absolute top-[-2px] h-[12px] w-0.5 bg-white/60"
          style={{ left: `${floorPct}%` }}
          title="minimum to stay perfect"
        />
      </div>
    </div>
  );
}
