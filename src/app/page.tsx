import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { SPORT_CATALOG } from "@/sports/registry";

export const metadata: Metadata = {
  title: "All-Time Roster Games: Go 82-0, 162-0 & Undefeated",
  description:
    "Build an all-time roster and chase a perfect, undefeated season. Go 82-0 in the NBA, 162-0 in MLB, 17-0 in the NFL, plus NHL, college football, and the Premier League. Free, no signup.",
  alternates: { canonical: "/" },
};

export default function HubPage() {
  return (
    <div className="space-y-10">
      <section className="pt-6 text-center">
        <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">
          Can your all-time roster
          <br className="hidden sm:block" /> go{" "}
          <span className="text-amber-400">undefeated</span>?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-white/55">{BRAND.description}</p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SPORT_CATALOG.map((sport) => (
          <div
            key={sport.id}
            className={`flex flex-col rounded-2xl border p-5 transition ${
              sport.live
                ? "border-white/10 bg-white/[0.03] hover:border-white/25"
                : "border-white/5 bg-white/[0.01] opacity-60"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black tabular-nums" style={{ color: sport.accent }}>
                {sport.brand}
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-white/40">
                {sport.name}
              </span>
            </div>
            <div className="mt-3 text-sm text-white/55">{sport.blurb}</div>
            {sport.live ? (
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/${sport.id}`}
                  className="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-center text-sm font-bold text-black transition hover:bg-amber-300"
                >
                  Play now
                </Link>
                <Link
                  href={`/${sport.id}/leaderboard`}
                  className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/5"
                >
                  Leaderboard
                </Link>
              </div>
            ) : (
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/30">
                Coming soon
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold text-white">How it works</h2>
        <ol className="mt-3 grid gap-3 text-sm text-white/60 sm:grid-cols-3">
          <li>
            <span className="font-bold text-amber-400">1.</span> Spin a random franchise + era each
            round.
          </li>
          <li>
            <span className="font-bold text-amber-400">2.</span> Draft one legend into a position he
            actually played.
          </li>
          <li>
            <span className="font-bold text-amber-400">3.</span> Fill the roster and find out if it
            goes undefeated.
          </li>
        </ol>
      </section>
    </div>
  );
}
