"use client";
import { useCallback, useEffect, useState } from "react";
import { GAME_MODES, type GameModeId } from "@/lib/modes";
import type { BoardEntry } from "@/lib/leaderboard";

/** Read-only, browsable leaderboard with a tab per mode. */
export function LeaderboardView({ sport, accent }: { sport: string; accent: string }) {
  const [modeId, setModeId] = useState<GameModeId>("classic");
  const [entries, setEntries] = useState<BoardEntry[] | null>(null);

  const load = useCallback(
    async (mode: GameModeId) => {
      setEntries(null);
      try {
        const qs = new URLSearchParams({ sport, mode });
        if (mode === "daily") qs.set("date", new Date().toISOString().slice(0, 10));
        const r = await fetch(`/api/leaderboard?${qs.toString()}`, { cache: "no-store" });
        const j = (await r.json()) as { entries?: BoardEntry[] };
        setEntries(j.entries ?? []);
      } catch {
        setEntries([]);
      }
    },
    [sport],
  );

  useEffect(() => {
    const id = setTimeout(() => void load(modeId), 0);
    return () => clearTimeout(id);
  }, [load, modeId]);

  return (
    <div>
      <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
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
                <span className="w-6 text-right text-lg font-black tabular-nums text-white/30">
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
