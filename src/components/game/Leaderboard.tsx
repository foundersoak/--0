"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { BoardEntry } from "@/lib/leaderboard";

type Status = "idle" | "submitting" | "done" | "error";

export function Leaderboard({
  sport,
  mode,
  date,
  playerIds,
}: {
  sport: string;
  mode: string;
  date: string | null;
  playerIds: string[];
}) {
  const [handle, setHandle] = useState(() => {
    try {
      return localStorage.getItem("undefeated:handle") ?? "";
    } catch {
      return "";
    }
  });
  const [entries, setEntries] = useState<BoardEntry[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ sport, mode });
      if (date) qs.set("date", date);
      const r = await fetch(`/api/leaderboard?${qs.toString()}`, { cache: "no-store" });
      const j = (await r.json()) as { entries?: BoardEntry[] };
      setEntries(j.entries ?? []);
    } catch {
      setEntries([]);
    }
  }, [sport, mode, date]);

  useEffect(() => {
    // Defer so the setState inside load() never runs synchronously in the effect.
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  const submit = async () => {
    setStatus("submitting");
    try {
      localStorage.setItem("undefeated:handle", handle);
    } catch {
      /* ignore */
    }
    try {
      const r = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport, mode, date, handle: handle || "anon", playerIds }),
      });
      if (!r.ok) throw new Error("submit failed");
      setStatus("done");
      await load();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
          Global leaderboard{date ? " · today" : ""}
        </span>
        <span className="text-[11px] capitalize text-white/30">{mode}</span>
      </div>

      {status !== "done" ? (
        <div className="mb-2 flex gap-2">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="your handle"
            maxLength={20}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={status === "submitting"}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-50"
          >
            {status === "submitting" ? "…" : "Submit"}
          </button>
        </div>
      ) : (
        <p className="mb-2 text-xs text-emerald-300">Submitted as {handle || "anon"} ✓</p>
      )}
      {status === "error" ? (
        <p className="mb-2 text-xs text-rose-300">Couldn&apos;t submit — try again.</p>
      ) : null}

      {entries === null ? (
        <p className="text-xs text-white/30">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-xs text-white/30">No scores yet — be the first.</p>
      ) : (
        <ol className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.02]">
          {entries.map((e, i) => (
            <li
              key={`${e.handle}-${e.at}-${i}`}
              className={`flex items-center justify-between px-3 py-2 text-sm ${
                e.handle === handle ? "bg-amber-400/10" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-5 tabular-nums text-white/35">{i + 1}</span>
                <span className="truncate font-medium text-white">{e.handle}</span>
                {e.perfect ? <span className="text-[10px] text-amber-300">🏆</span> : null}
              </span>
              <span className="flex items-center gap-2">
                <span className="tabular-nums font-semibold text-white">
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
      <Link
        href={`/${sport}/leaderboard`}
        className="mt-3 inline-block text-xs font-semibold text-white/50 transition hover:text-white/80"
      >
        View full leaderboard →
      </Link>
    </div>
  );
}
