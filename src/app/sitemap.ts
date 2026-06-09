import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { LIVE_SPORT_IDS } from "@/sports/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/attribution",
    "/privacy",
    "/terms",
    "/contact",
    ...LIVE_SPORT_IDS.flatMap((s) => [`/${s}`, `/${s}/how-to-play`, `/${s}/leaderboard`]),
  ];
  return paths.map((p) => ({ url: `${BRAND.url}${p}`, lastModified: now }));
}
