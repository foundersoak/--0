import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${BRAND.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <h1 className="text-3xl font-black text-white">Contact</h1>
      <p className="text-sm leading-relaxed text-white/70">
        Questions, feedback, a bug, a stat that looks wrong, or a partnership idea? We&apos;d love to
        hear from you.
      </p>
      <a
        href={`mailto:${BRAND.contactEmail}`}
        className="inline-block rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300"
      >
        {BRAND.contactEmail}
      </a>
      <p className="text-xs text-white/40">
        {BRAND.name} is an unofficial fan game and is not affiliated with any league or team.
      </p>
      <Link
        href="/"
        className="inline-block text-sm font-semibold text-white/50 transition hover:text-white/80"
      >
        ← Back
      </Link>
    </div>
  );
}
