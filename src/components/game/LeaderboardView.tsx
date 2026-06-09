"use client";
import { useCallback, useEffect, useState } from "react";
import { GAME_MODES, type GameModeId } from "@/lib/modes";
import type { BoardEntry, Period } from "@/lib/leaderboard";

const PERIODS: { id: Period; label: string }[] = [
  { id: "all", label: "All-time" },
  { id: "month", label: "This month" },
  { id: "week", label: "This week" },
];

/** Read-only, browsable leaderboard: a tab per mode, plus period filters. */
export function LeaderboardView({ sport, accent }: { sport: string; accent: string }) {
  const [modeId, setModeId] = useState<GameModeId>("classic");
  const [period, setPeriod] = useState<Period>("all");
  const [entries, setEntries] = useState<BoardEntry[] | null>(null);
  const isDaily = modeId === "daily";

  const load = useCallback(async () => {
    setEntries(null);
    try {
      const qs = new URLSearchParams({ sport, mode: modeId, limit: "50" });
      if (isDaily) qs.set("date", new Date().toISOString().slice(0, 10));
      else qs.set("period", period);
      const r = await fetch(`/api/leaderboard?${qs.toString()}`, { cache: "no-store" });
      const j = (await r.json()) as { entries?: BoardEntry[] };
      setEntries(j.entries ?? []);
    } catch {
      setEntries([]);
    }
  }, [sport, modeId, period, isDaily]);

  useEffect(() => {
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {GAME_MODES.map((m) => {
          const active = m.id === modeId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setModeId(m.id)}
              className={[
                "rounded-lg px-4 py-2 text-[15px] font-bold transition",
                active ? "text-black" : "text-white/60 hover:text-white",
              ].join(" ")}
              style={active ? { backgroundColor: accent } : undefined}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {isDaily ? (
        <div className="text-xs text-white/40">
          Today&apos;s board · {new Date().toISOString().slice(0, 10)}
        </div>
      ) : (
        <div className="flex gap-2 text-xs">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                period === p.id ? "bg-white/15 text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {entries === null ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-white/40">
          No scores yet — finish a game and submit one to claim the top spot.
        </p>
      ) : (
        <ol className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {entries.map((e, i) => (
            <li
              key={`${e.handle}-${e.at}-${i}`}
              className={`flex items-center justify-between px-4 py-3 ${i < 3 ? "bg-white/[0.02]" : ""}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-7 text-right text-lg font-black tabular-nums text-white/30">
                  {i + 1}
                </span>
                <span className="truncate font-semibold text-white">{e.handle}</span>
                {e.perfect ? <span className="text-xs text-amber-300">🏆</span> : null}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg font-black tabular-nums text-white">
                  {e.wins}-{e.losses}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
                  {e.grade}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
