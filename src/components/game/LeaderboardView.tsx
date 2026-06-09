"use client";
import { useCallback, useEffect, useState } from "react";
import { GAME_MODES, getMode, type GameModeId } from "@/lib/modes";
import type { BoardEntry, Period } from "@/lib/leaderboard";
import { getBest, getDailyState, getRecent, type ScoreEntry } from "@/lib/store";

const PERIODS: { id: Period; label: string }[] = [
  { id: "all", label: "All-time" },
  { id: "month", label: "This month" },
  { id: "week", label: "This week" },
];

interface Personal {
  bests: { mode: GameModeId; label: string; entry: ScoreEntry | null }[];
  recent: ScoreEntry[];
  streak: number;
  maxStreak: number;
}
function loadPersonal(sport: string): Personal {
  const daily = getDailyState(sport, new Date().toISOString().slice(0, 10));
  return {
    bests: GAME_MODES.map((m) => ({ mode: m.id, label: m.label, entry: getBest(sport, m.id) })),
    recent: getRecent(sport, 12),
    streak: daily.streak,
    maxStreak: daily.maxStreak,
  };
}

/** Browsable leaderboard with a Global (Redis) and Personal (local) view. */
export function LeaderboardView({ sport, accent }: { sport: string; accent: string }) {
  const [view, setView] = useState<"global" | "personal">("global");
  const [modeId, setModeId] = useState<GameModeId>("classic");
  const [period, setPeriod] = useState<Period>("all");
  const [entries, setEntries] = useState<BoardEntry[] | null>(null);
  const [personal, setPersonal] = useState<Personal | null>(null);
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
  useEffect(() => {
    // localStorage read deferred so it never runs during the (SSR-hydrating) render.
    const id = setTimeout(() => setPersonal(loadPersonal(sport)), 0);
    return () => clearTimeout(id);
  }, [sport]);

  const tab = (active: boolean) =>
    ["rounded-lg px-4 py-2 text-[15px] font-bold transition", active ? "text-black" : "text-white/60 hover:text-white"].join(" ");

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(["global", "personal"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={tab(view === v)}
            style={view === v ? { backgroundColor: accent } : undefined}
          >
            {v === "global" ? "Global" : "Personal"}
          </button>
        ))}
      </div>

      {view === "global" ? (
        <div className="space-y-3">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {GAME_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setModeId(m.id)}
                className={tab(m.id === modeId)}
                style={m.id === modeId ? { backgroundColor: accent } : undefined}
              >
                {m.label}
              </button>
            ))}
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
                    <span className="w-7 text-right text-lg font-black tabular-nums text-white/30">{i + 1}</span>
                    <span className="truncate font-semibold text-white">{e.handle}</span>
                    {e.perfect ? <span className="text-xs text-amber-300">🏆</span> : null}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg font-black tabular-nums text-white">
                      {e.wins}-{e.losses}
                    </span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">{e.grade}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : (
        <PersonalView personal={personal} />
      )}
    </div>
  );
}

function PersonalView({ personal }: { personal: Personal | null }) {
  if (!personal) return <p className="text-sm text-white/40">Loading…</p>;
  const hasBest = personal.bests.some((b) => b.entry);
  if (!hasBest && personal.recent.length === 0) {
    return (
      <p className="text-sm text-white/40">
        No runs yet on this device — play a game and your bests, streak, and history show up here.
        (Stats are saved in this browser; no account needed.)
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {personal.bests.map((b) => (
          <div key={b.mode} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{b.label} best</div>
            {b.entry ? (
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-xl font-black tabular-nums text-white">
                  {b.entry.wins}-{b.entry.losses}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">{b.entry.grade}</span>
                {b.mode === "daily" && personal.streak > 0 ? (
                  <span className="text-[11px] text-amber-300">🔥 {personal.streak}d</span>
                ) : null}
              </div>
            ) : (
              <div className="mt-0.5 text-sm text-white/30">—</div>
            )}
          </div>
        ))}
      </div>

      {personal.recent.length > 0 ? (
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Recent runs</div>
          <ol className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {personal.recent.map((r, i) => (
              <li key={`${r.at}-${i}`} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-white">
                    {r.wins}-{r.losses}
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">{r.grade}</span>
                  {r.date ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/70">daily</span>
                  ) : null}
                </span>
                <span className="text-[11px] text-white/35">{getMode(r.modeId).label}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
