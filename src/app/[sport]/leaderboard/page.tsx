import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeaderboardView } from "@/components/game/LeaderboardView";
import { getCatalogEntry, getSport, LIVE_SPORT_IDS } from "@/sports/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIVE_SPORT_IDS.map((sport) => ({ sport }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport } = await params;
  const mod = getSport(sport);
  if (!mod) return {};
  const title = `${mod.config.brand} ${mod.config.name}, Leaderboard`;
  return { title, description: `Top undefeated runs on ${mod.config.brand} ${mod.config.name}.` };
}

export default async function LeaderboardPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const mod = getSport(sport);
  if (!mod) notFound();
  const c = mod.config;
  const accent = getCatalogEntry(sport)?.accent ?? c.theme.accent;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-4xl font-black leading-none tabular-nums" style={{ color: accent }}>
            {c.brand}
          </div>
          <h1 className="mt-1 text-lg font-semibold text-white">{c.name} Leaderboard</h1>
        </div>
        <Link
          href={`/${sport}`}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/5"
        >
          ← Back to game
        </Link>
      </div>
      <LeaderboardView sport={sport} accent={accent} />
    </div>
  );
}
