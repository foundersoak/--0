import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/content/guides";
import { BRAND } from "@/lib/brand";
import { getCatalogEntry } from "@/sports/registry";

export const metadata: Metadata = {
  title: "Guides — The Greatest Record Seasons in Sports",
  description: `The greatest record-setting seasons in every sport, and the impossible perfect records ${BRAND.name} dares you to beat.`,
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Guides</h1>
        <p className="mt-2 max-w-xl text-white/55">
          The greatest record-setting seasons in sports history — and the impossible perfect records
          our games dare you to beat.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const cat = getCatalogEntry(g.sport);
          return (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: cat?.accent ?? "#FDB927" }}
              >
                {cat?.name ?? g.sport.toUpperCase()} · {cat?.brand}
              </div>
              <div className="mt-2 font-bold leading-snug text-white">{g.title}</div>
              <div className="mt-2 text-sm text-white/55">{g.description}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
