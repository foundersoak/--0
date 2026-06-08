import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://undefeated.app"),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  openGraph: { title: BRAND.name, description: BRAND.description, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
            {BRAND.name} is an unofficial fan game and is not affiliated with any league. Player
            stats are curated for entertainment. Built on open data sources — see ATTRIBUTION.
          </div>
        </footer>
      </body>
    </html>
  );
}
