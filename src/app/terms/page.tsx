import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${BRAND.name}.`,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold text-amber-400">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-black text-white">Terms of Use</h1>
        <p className="mt-2 text-sm text-white/50">Effective June 9, 2026</p>
      </div>

      <Section title="The game">
        <p>
          {BRAND.name} is a free, for-entertainment fan game provided &quot;as is,&quot; without
          warranties of any kind. Simulated records and ratings are for fun and don&apos;t reflect
          real-world outcomes.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>
          Please don&apos;t attempt to break, overload, or mass-scrape the service, or submit unlawful
          or offensive content (including leaderboard handles). We may remove content or limit access
          at our discretion.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          {BRAND.name} is an unofficial fan project, not affiliated with or endorsed by any league or
          team. Team and player names are used nominatively to identify the real franchises and
          players; no logos or likenesses are used. See our{" "}
          <Link href="/attribution" className="underline hover:text-white">
            attribution page
          </Link>
          .
        </p>
      </Section>

      <Section title="Liability">
        <p>
          To the fullest extent permitted by law, {BRAND.name} and its operators are not liable for
          any damages arising from use of the site.
        </p>
      </Section>

      <Section title="Changes & contact">
        <p>
          We may update these terms; the effective date above will change accordingly. Questions? Use
          our{" "}
          <Link href="/contact" className="underline hover:text-white">
            contact form
          </Link>
          .
        </p>
      </Section>

      <Link
        href="/"
        className="inline-block text-sm font-semibold text-white/50 transition hover:text-white/80"
      >
        ← Back
      </Link>
    </div>
  );
}
