"use client";
import { useState } from "react";
import { getBest, getRecent } from "@/lib/store";

/**
 * A local leaderboard: your personal best for this mode + recent runs. Reads
 * once on mount (rendered only after the current run is recorded), so no effect
 * and no SSR mismatch.
 */
export function RunHistory({ sportId, modeId }: { sportId: string; modeId: string }) {
  const [data] = useState(() => ({
    best: getBest(sportId, modeId),
    recent: getRecent(sportId, 6),
  }));
  if (data.recent.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/40">Your runs</span>
        {data.best ? (
          <span className="text-[11px] text-white/40">
            Best:{" "}
            <span className="font-semibold text-white/70">
              {data.best.wins}-{data.best.losses}
            </span>{" "}
            ({data.best.grade})
          </span>
        ) : null}
      </div>
      <ul className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.02]">
        {data.recent.map((r, i) => (
          <li
            key={`${r.at}-${i}`}
            className="flex items-center justify-between px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="tabular-nums font-semibold text-white">
                {r.wins}-{r.losses}
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
                {r.grade}
              </span>
              {r.date ? (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/70">
                  daily
                </span>
              ) : null}
            </span>
            <span className="text-[11px] capitalize text-white/35">{r.modeId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
