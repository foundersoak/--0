import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { GameClient } from "@/components/game/GameClient";
import { getGuideForSport } from "@/content/guides";
import { breadcrumb, videoGame } from "@/lib/seo";
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
  const title = `${c.brand}, ${c.name} Roster Game`;
  return {
    title,
    description: c.tagline,
    alternates: { canonical: `/${sport}` },
    openGraph: { title, description: c.tagline },
  };
}

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const mod = getSport(sport);
  if (!mod) notFound();

  const c = mod.config;
  const accent = getCatalogEntry(sport)?.accent ?? c.theme.accent;
  const guide = getGuideForSport(c.id);
  const jsonLd = [
    videoGame(c, sport),
    breadcrumb([
      { name: "Home", path: "/" },
      { name: `${c.name} ${c.brand}`, path: `/${sport}` },
    ]),
  ];

  return (
    <div className="space-y-6">
      <JsonLd data={jsonLd} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-5xl font-black tabular-nums leading-none" style={{ color: accent }}>
            {c.brand}
          </div>
          <h1 className="mt-1 text-lg font-semibold text-white">
            {c.name},{" "}
            <span className="font-normal text-white/55">{c.tagline}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${sport}/leaderboard`}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/5"
          >
            Leaderboard
          </Link>
          <Link
            href={`/${sport}/how-to-play`}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/5"
          >
            How to play
          </Link>
        </div>
      </div>

      <GameClient sportId={sport} />

      <section className="space-y-4 border-t border-white/10 pt-8">
        <h2 className="text-xl font-bold text-white">The {c.name} all-time roster challenge</h2>
        <p className="text-pretty leading-relaxed text-white/65">
          {c.brand} is a free {c.name} roster-building game. Each round, a slot machine hands you a
          random franchise and era. You draft one real legend at a position he actually played, and
          fill all {c.positions.length} spots. Then your lineup is run through a full{" "}
          {c.seasonGames}-game season to see whether it can do what almost no team ever has and
          finish {c.brand}.
        </p>
        <p className="text-pretty leading-relaxed text-white/65">
          The twist is the gating: every category has a floor, so a single glaring weakness caps your
          record no matter how many superstars you draft. Going {c.brand} takes a balanced, all-time
          lineup that clears every floor, not just one or two huge names.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm font-semibold">
          <Link href={`/${sport}/how-to-play`} className="text-amber-300 hover:text-amber-200">
            How to play {c.brand} →
          </Link>
          <Link href={`/${sport}/leaderboard`} className="text-white/60 hover:text-white">
            {c.name} leaderboard →
          </Link>
          {guide ? (
            <Link href={`/guides/${guide.slug}`} className="text-white/60 hover:text-white">
              {guide.title} →
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
