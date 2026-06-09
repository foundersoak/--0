import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSport, LIVE_SPORT_IDS } from "@/sports/registry";

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
  return { title: `How to play ${mod.config.brand} ${mod.config.name}` };
}

export default async function HowToPlay({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const mod = getSport(sport);
  if (!mod) notFound();
  const c = mod.config;

  const rules = [
    `Each round, a slot machine gives you a random franchise and decade.`,
    `Pick one player from that team and era, and slot him at a position he actually played.`,
    `You get ${c.skips.team} team reroll and ${c.skips.era} era reroll, use them wisely.`,
    `Fill all ${c.positions.length} roster spots across different eras.`,
    `Your lineup's stats are run through a season sim. Every category has a floor, one glaring weakness caps your record no matter how stacked the rest is.`,
    `Clear every floor with an elite, balanced roster and you go ${c.brand}.`,
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="text-4xl font-black tabular-nums" style={{ color: c.theme.accent }}>
          {c.brand}
        </div>
        <h1 className="mt-1 text-2xl font-bold text-white">How to play {c.name}</h1>
        <p className="mt-2 text-white/60">{c.blurb}</p>
      </div>

      <ol className="space-y-3">
        {rules.map((r, i) => (
          <li key={i} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <span className="font-black text-amber-400">{i + 1}</span>
            <span className="text-sm text-white/70">{r}</span>
          </li>
        ))}
      </ol>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">
          The {c.name} categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {c.scoring.categories.map((cat) => (
            <span
              key={cat.key}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/70"
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={`/${sport}`}
        className="inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
      >
        Play {c.brand} →
      </Link>
    </div>
  );
}
