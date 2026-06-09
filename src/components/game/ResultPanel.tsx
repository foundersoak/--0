"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { eraAdjustStats, type CategoryResult, type GameState } from "@/engine";
import type { PlayerEntry, SportConfig } from "@/engine/types";
import type { GameModeDef } from "@/lib/modes";
import { dailyDateFromSeed, encodeCard, shareGrid, type ShareCard } from "@/lib/share";
import { recordResult, type RecordOutcome } from "@/lib/store";
import { Leaderboard } from "./Leaderboard";
import { RosterBoard } from "./RosterBoard";
import { RunHistory } from "./RunHistory";

export function ResultPanel({
  config,
  state,
  onPlayAgain,
  mode,
  offered,
}: {
  config: SportConfig;
  state: GameState;
  onPlayAgain: () => void;
  mode?: GameModeDef;
  offered?: PlayerEntry[];
}) {
  const [copied, setCopied] = useState(false);
  const [outcome, setOutcome] = useState<RecordOutcome | null>(null);
  const recordedRef = useRef<string | null>(null);
  const result = state.result;

  useEffect(() => {
    if (!result || recordedRef.current === state.seed) return;
    recordedRef.current = state.seed;
    const roster = config.positions.map((slot) => ({
      slot: slot.abbr,
      name: state.filled.find((f) => f.slotId === slot.id)?.player.name ?? "",
    }));
    setOutcome(
      recordResult({
        sportId: config.id,
        modeId: mode?.id ?? "classic",
        wins: result.wins,
        losses: result.losses,
        grade: result.grade,
        perfect: result.perfect,
        seed: state.seed,
        roster,
        at: Date.now(),
        date: mode?.daily ? dailyDateFromSeed(state.seed) : null,
      }),
    );
  }, [result, state.seed, state.filled, config, mode]);

  // "The one that got away": the best player you passed on for your weak category.
  const missed = useMemo(() => {
    if (
      !result ||
      result.perfect ||
      !result.cappedBy ||
      config.scoring.mode !== "shared" ||
      !offered ||
      offered.length === 0
    )
      return null;
    const weak = result.categories.find((c) => c.label === result.cappedBy);
    if (!weak) return null;
    const onRoster = new Set(state.filled.map((f) => f.player.id));
    let best: { player: PlayerEntry; adj: number } | null = null;
    for (const p of offered) {
      if (onRoster.has(p.id)) continue;
      const adj = eraAdjustStats(p, config)[weak.key] ?? 0;
      if (!best || adj > best.adj) best = { player: p, adj };
    }
    if (!best || best.adj <= 0) return null;
    const statLabel = config.stats.find((s) => s.key === weak.key)?.label ?? weak.key;
    return {
      name: best.player.name,
      raw: best.player.stats[weak.key] ?? 0,
      statLabel,
      category: weak.label,
    };
  }, [result, offered, config, state.filled]);

  const winsCount = useCountUp(result?.wins ?? 0);

  if (!result) return null;

  const share = async () => {
    const card: ShareCard = {
      sport: config.id,
      brand: config.brand,
      name: config.name,
      wins: result.wins,
      losses: result.losses,
      grade: result.grade,
      perfect: result.perfect,
      passes: result.categories.map((c) => c.passed),
      roster: config.positions.map((slot) => ({
        slot: slot.abbr,
        player: state.filled.find((f) => f.slotId === slot.id)?.player.name ?? "",
      })),
      seed: state.seed,
    };
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/${config.id}/share/${encodeCard(card)}`
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
        className="relative flex flex-col items-center"
      >
        {result.perfect ? <Confetti /> : null}
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
            {winsCount}-{result.wins + result.losses - winsCount}
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

      {outcome && (outcome.newBest || mode?.daily) ? (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {outcome.newBest ? (
            <span className="rounded-full bg-emerald-400/90 px-2.5 py-1 font-bold text-black">
              New personal best
            </span>
          ) : null}
          {mode?.daily ? (
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white/70">
              🔥 {outcome.streak}-day streak
              {outcome.alreadyPlayedDaily ? " · already counted today" : ""}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="w-full space-y-2">
        {result.categories.map((c) => (
          <CategoryBar key={c.key} cat={c} />
        ))}
      </div>

      {missed ? (
        <div className="w-full rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-3 py-2.5 text-sm">
          <span className="font-semibold text-rose-200">The one that got away:</span>{" "}
          <span className="font-semibold text-white">{missed.name}</span>{" "}
          <span className="tabular-nums text-white/55">
            ({missed.raw.toFixed(1)} {missed.statLabel})
          </span>{" "}
          was on your board — he&apos;d have shored up your {missed.category}.
        </div>
      ) : null}

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

      {outcome ? (
        <Leaderboard
          sport={config.id}
          mode={mode?.id ?? "classic"}
          date={mode?.daily ? dailyDateFromSeed(state.seed) : null}
          playerIds={config.positions.map(
            (slot) => state.filled.find((f) => f.slotId === slot.id)?.player.id ?? "",
          )}
        />
      ) : null}

      <div className="w-full">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
          Your roster
        </div>
        <RosterBoard config={config} state={state} />
      </div>

      {outcome ? <RunHistory sportId={config.id} modeId={mode?.id ?? "classic"} /> : null}
    </div>
  );
}

function useCountUp(target: number, durationMs = 750): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = typeof performance !== "undefined" ? performance.now() : Date.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3)))); // easeOutCubic
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return n;
}

const CONFETTI_COLORS = ["#FDB927", "#34d399", "#60a5fa", "#f472b6", "#f87171"];

// Built once at module load (not during render) so the component stays render-pure.
const CONFETTI_PIECES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: (Math.random() * 2 - 1) * 280,
  y: (Math.random() * 2 - 1) * 180,
  rot: Math.random() * 720 - 360,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: Math.random() * 0.12,
  size: 6 + Math.random() * 6,
  dur: 1 + Math.random() * 0.7,
}));

function Confetti() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      {CONFETTI_PIECES.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
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
