import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SiteScripts } from "@/components/SiteScripts";
import { BRAND } from "@/lib/brand";
import { siteGraph } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name}, ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  openGraph: { title: BRAND.name, description: BRAND.description, type: "website" },
  twitter: { card: "summary_large_image" },
  // Ownership verification meta tags, rendered server-side into <head> (where
  // Google's verifiers look). GOOGLE_SITE_VERIFICATION = the Search Console
  // HTML-tag token; the AdSense account meta lets AdSense verify via its "Meta
  // tag" method without depending on where the ad script loads.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT
      ? { other: { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT } }
      : {}),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteScripts />
        <JsonLd data={siteGraph()} />
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-black tracking-tight text-white">
              {BRAND.name}
              <span className="text-amber-400">.</span>
            </Link>
            <span className="hidden text-xs text-white/40 sm:block">
              Can your all-time roster go undefeated?
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-white/35">
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
              <Link href="/guides" className="transition hover:text-white/70">
                Guides
              </Link>
              <Link href="/attribution" className="transition hover:text-white/70">
                Attribution &amp; legal
              </Link>
              <Link href="/privacy" className="transition hover:text-white/70">
                Privacy
              </Link>
              <Link href="/contact" className="transition hover:text-white/70">
                Contact
              </Link>
              <Link href="/terms" className="transition hover:text-white/70">
                Terms
              </Link>
            </div>
            {BRAND.name} is an unofficial fan game, not affiliated with any league. Player names and
            statistics are used for identification; no team logos or player photos.
          </div>
        </footer>
      </body>
    </html>
  );
}
