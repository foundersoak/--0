import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.name} handles data, cookies, and advertising.`,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold text-amber-400">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/50">Effective June 9, 2026</p>
      </div>

      <Section title="The short version">
        <p>
          {BRAND.name} is a free game. There are <strong>no accounts and no sign-up</strong>, and we
          don&apos;t ask for your name or email. Your game progress lives in your own browser. The
          only thing that leaves your device is a leaderboard score, and only if you choose to submit
          one.
        </p>
      </Section>

      <Section title="What we store">
        <p>
          <strong>In your browser (localStorage):</strong> your game progress, preferences, chosen
          handle, personal bests, and daily streak. This never leaves your device and you can clear it
          anytime by clearing your browser storage.
        </p>
        <p>
          <strong>On our server (only if you submit a score):</strong> the handle you type and your
          game result (record and grade). These appear publicly on the leaderboards, so please
          don&apos;t use a handle that reveals personal information.
        </p>
        <p>
          <strong>Standard server logs:</strong> our hosting provider records technical data such as
          IP address and browser type to operate and secure the site.
        </p>
      </Section>

      <Section title="Cookies & advertising">
        <p>
          We may display ads through <strong>Google AdSense</strong>. Third-party vendors, including
          Google, use cookies to serve ads based on your prior visits to this and other websites.
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to you
          based on your visits to our site and/or other sites on the Internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{" "}
          <a
            className="underline hover:text-white"
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>{" "}
          or{" "}
          <a
            className="underline hover:text-white"
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          . See also{" "}
          <a
            className="underline hover:text-white"
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            how Google uses information from sites that use its services
          </a>
          .
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          We rely on a few providers to run the site: <strong>Vercel</strong> (hosting),
          a <strong>managed Redis</strong> provider (leaderboard storage), and{" "}
          <strong>Google AdSense</strong> (advertising, when enabled). Each processes data under its
          own privacy policy.
        </p>
      </Section>

      <Section title="Children">
        <p>
          {BRAND.name} is not directed to children under 13, and we do not knowingly collect personal
          information from them.
        </p>
      </Section>

      <Section title="Your choices">
        <p>
          Clear your browser storage to remove all local data, and use the opt-out links above to turn
          off personalized ads. Because we don&apos;t collect accounts or emails, there is no profile
          to delete.
        </p>
      </Section>

      <Section title="Changes & contact">
        <p>
          We may update this policy as the site evolves; the effective date above will change
          accordingly. Questions? Reach us through the{" "}
          <Link className="underline hover:text-white" href="/contact">
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
