import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeCard } from "@/lib/share";
import { getCatalogEntry, getSport } from "@/sports/registry";

type Params = Promise<{ sport: string; code: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { code } = await params;
  const card = decodeCard(code);
  if (!card) return { title: "Result" };
  const title = `${card.wins}-${card.losses} (${card.grade}), ${card.brand} ${card.name}`;
  const description = card.perfect
    ? `An undefeated ${card.brand} ${card.name} season. Can you match it?`
    : `I went ${card.wins}-${card.losses} on ${card.brand} ${card.name}. Can you go ${card.brand}?`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharePage({ params }: { params: Params }) {
  const { sport, code } = await params;
  const card = decodeCard(code);
  if (!card || card.sport !== sport || !getSport(sport)) notFound();
  const accent = getCatalogEntry(sport)?.accent ?? "#FDB927";

  return (
    <div className="mx-auto max-w-lg space-y-6 py-6 text-center">
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
        {card.name} · {card.brand}
      </div>
      {card.perfect ? (
        <div className="inline-block rounded-full bg-amber-400 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-black">
          Undefeated
        </div>
      ) : null}
      <div className="flex items-center justify-center gap-3">
        <span className="text-7xl font-black tabular-nums" style={{ color: accent }}>
          {card.wins}-{card.losses}
        </span>
        <span className="rounded-xl bg-white/10 px-3 py-1 text-2xl font-black text-white">
          {card.grade}
        </span>
      </div>
      <div className="flex justify-center gap-2">
        {card.passes.map((ok, i) => (
          <span
            key={`p-${i}`}
            className={`h-5 w-5 rounded ${ok ? "bg-emerald-400" : "bg-rose-500"}`}
          />
        ))}
      </div>
      <Link
        href={`/${sport}`}
        className="inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300"
      >
        Play your own {card.brand} →
      </Link>
    </div>
  );
}
