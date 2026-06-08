import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameClient } from "@/components/game/GameClient";
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
  const c = mod.config;
  const title = `${c.brand} — ${c.name} Roster Game`;
  return {
    title,
    description: c.tagline,
    openGraph: { title, description: c.tagline },
  };
}

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const mod = getSport(sport);
  if (!mod) notFound();

  const c = mod.config;
  const accent = getCatalogEntry(sport)?.accent ?? c.theme.accent;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-5xl font-black tabular-nums leading-none" style={{ color: accent }}>
            {c.brand}
          </div>
          <h1 className="mt-1 text-lg font-semibold text-white">
            {c.name} <span className="font-normal text-white/55">— {c.tagline}</span>
          </h1>
        </div>
        <Link
          href={`/${sport}/how-to-play`}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/5"
        >
          How to play
        </Link>
      </div>

      <GameClient sportId={sport} />
    </div>
  );
}
