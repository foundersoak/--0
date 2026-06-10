/** Parent hub identity. Swap `name` here to rebrand the whole site. */
export const BRAND = {
  name: "Flawless Lineup",
  short: "Flawless Lineup",
  tagline: "Draft an all-time roster. Go undefeated. Or don't.",
  description:
    "Free all-time roster games for the NBA, NFL, MLB, NHL, and more. Spin a random franchise and era, draft legends, and see if your all-time team can go undefeated.",
  // Canonical site URL, drives metadata, sitemap, robots, and OG image URLs.
  // When you point a custom domain at the site, just set NEXT_PUBLIC_SITE_URL in
  // Vercel (no code change). Trailing slashes are trimmed so URLs never double up.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blankand0.vercel.app").replace(/\/+$/, ""),
};
