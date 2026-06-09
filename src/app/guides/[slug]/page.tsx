import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/content/guides";
import { BRAND } from "@/lib/brand";
import { getCatalogEntry, getSport } from "@/sports/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      title: g.metaTitle,
      description: g.description,
      type: "article",
      publishedTime: g.published,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const cat = getCatalogEntry(g.sport);
  const live = Boolean(getSport(g.sport));
  const accent = cat?.accent ?? "#FDB927";
  const brand = cat?.brand ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.published,
    dateModified: g.published,
    author: { "@type": "Organization", name: BRAND.name },
    publisher: { "@type": "Organization", name: BRAND.name },
    mainEntityOfPage: `${BRAND.url}/guides/${g.slug}`,
  };

  return (
    <article className="mx-auto max-w-2xl space-y-6 py-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {cat?.name ?? g.sport.toUpperCase()} · {brand}
      </div>
      <h1 className="text-balance text-3xl font-black leading-tight text-white sm:text-4xl">
        {g.title}
      </h1>
      {g.intro.map((p) => (
        <p key={p.slice(0, 24)} className="text-pretty leading-relaxed text-white/70">
          {p}
        </p>
      ))}

      <ol className="space-y-3">
        {g.records.map((r, i) => (
          <li key={`${r.team}-${r.season}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-bold text-white">
                <span className="mr-2 tabular-nums" style={{ color: accent }}>
                  {i + 1}.
                </span>
                {r.team} <span className="font-normal text-white/50">· {r.season}</span>
              </h2>
              <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1 text-sm font-black tabular-nums text-white">
                {r.record}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{r.blurb}</p>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] p-5 text-center">
        <p className="text-pretty font-semibold text-amber-100">{g.cta}</p>
        <Link
          href={live ? `/${g.sport}` : "/"}
          className="mt-3 inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300"
        >
          {live ? `Play ${brand} →` : "Play now →"}
        </Link>
      </div>

      <section className="space-y-1 border-t border-white/10 pt-4 text-xs text-white/40">
        <div className="font-semibold uppercase tracking-wide">Sources</div>
        <ul className="space-y-0.5">
          {g.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link href="/guides" className="font-semibold text-white/60 hover:text-white">
          ← All guides
        </Link>
        <Link href="/" className="font-semibold text-white/60 hover:text-white">
          Home
        </Link>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
