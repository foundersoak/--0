import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Attribution & legal",
  description: `Data sources, attribution, and disclaimers for ${BRAND.name}.`,
};

const NBA_SOURCES = [
  {
    href: "https://github.com/peasant98/TheNBACSV",
    label: "peasant98/TheNBACSV",
    note: 'Kaggle "NBA Seasons Stats" (1950–2017)',
  },
  {
    href: "https://github.com/Brescou/NBA-dataset-stats-player-team",
    label: "Brescou/NBA-dataset-stats-player-team",
    note: "per-game season stats (1996–2023)",
  },
  {
    href: "https://github.com/NocturneBear/NBA-Data-2010-2024",
    label: "NocturneBear/NBA-Data-2010-2024",
    note: "recent box scores (2010–2024)",
  },
];

export default function AttributionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-black text-white">Attribution &amp; legal</h1>
        <p className="mt-2 text-sm text-white/50">
          What {BRAND.name} is, and where its data comes from.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-amber-400">Unofficial fan game</h2>
        <p className="text-sm leading-relaxed text-white/70">
          {BRAND.name} is an independent, unofficial fan project. It is{" "}
          <strong>not affiliated with, endorsed by, or sponsored by</strong> the NBA, NFL, MLB, NHL,
          NCAA, the Premier League, or any team, league, or player. Team names and colors are used
          only to identify the real franchises.{" "}
          <strong>No team logos and no player photos or likenesses are used.</strong>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-amber-400">Player data</h2>
        <p className="text-sm leading-relaxed text-white/70">
          Player records are factual statistics (points, rebounds, assists, etc.) compiled at build
          time from permissively-available open datasets and bundled into the game. Individual
          statistical facts are not copyrightable. We do <strong>not</strong> scrape or redistribute
          Sports-Reference data.
        </p>
        <p className="text-sm font-semibold text-white/80">NBA sources</p>
        <ul className="space-y-1 text-sm text-white/60">
          {NBA_SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                {s.label}
              </a>{" "}
              — {s.note}.
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-white/40">
          Pre-1974 steals/blocks are imputed (they weren&apos;t tracked then). Other leagues will be
          added with their own attributed open sources — Lahman for MLB, nflverse for NFL, MoneyPuck
          for NHL, StatsBomb for soccer. CC BY-SA-derived data, where used, is kept in clearly marked
          files and shared under the same license.
        </p>
      </section>

      <Link
        href="/"
        className="inline-block text-sm font-semibold text-white/50 transition hover:text-white/80"
      >
        ← Back
      </Link>
    </div>
  );
}
