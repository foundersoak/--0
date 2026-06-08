import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { SPORT_CATALOG } from "@/sports/registry";

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
        {SPORT_CATALOG.map((sport) => {
          const inner = (
            <>
              <div className="flex items-baseline justify-between">
                <span
                  className="text-3xl font-black tabular-nums"
                  style={{ color: sport.accent }}
                >
                  {sport.brand}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-white/40">
                  {sport.name}
                </span>
              </div>
              <div className="mt-3 text-sm text-white/55">{sport.blurb}</div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide">
                {sport.live ? (
                  <span className="text-amber-400">Play now →</span>
                ) : (
                  <span className="text-white/30">Coming soon</span>
                )}
              </div>
            </>
          );

          const cls =
            "block rounded-2xl border p-5 transition " +
            (sport.live
              ? "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
              : "cursor-not-allowed border-white/5 bg-white/[0.01] opacity-60");

          return sport.live ? (
            <Link key={sport.id} href={`/${sport.id}`} className={cls}>
              {inner}
            </Link>
          ) : (
            <div key={sport.id} className={cls}>
              {inner}
            </div>
          );
        })}
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
