import type { PlayerDataset, SportConfig, SportId } from "@/engine/types";
import nbaConfig from "./nba/config";

export interface SportModule {
  config: SportConfig;
  /** Lazily load the (code-split) player dataset for this sport. */
  load: () => Promise<PlayerDataset>;
}

/** Live sports: have a config + dataset and are playable. */
export const SPORTS: Partial<Record<SportId, SportModule>> = {
  nba: {
    config: nbaConfig,
    load: () => import("./nba/data.json").then((m) => m.default as unknown as PlayerDataset),
  },
};

/** Display catalog for the hub — includes sports that aren't live yet. */
export interface CatalogEntry {
  id: SportId;
  name: string;
  brand: string;
  blurb: string;
  accent: string;
  live: boolean;
}

const CATALOG: Omit<CatalogEntry, "live">[] = [
  { id: "nba", name: "NBA", brand: "82-0", blurb: "All-time starting fives", accent: "#FDB927" },
  { id: "nfl", name: "NFL", brand: "17-0", blurb: "Build the perfect 53", accent: "#4a90d9" },
  { id: "mlb", name: "MLB", brand: "162-0", blurb: "A flawless lineup card", accent: "#e4002b" },
  { id: "nhl", name: "NHL", brand: "82-0", blurb: "The unbeatable line", accent: "#9aa0a6" },
  { id: "cfb", name: "CFB", brand: "12-0", blurb: "A perfect college season", accent: "#d4a017" },
  { id: "epl", name: "EPL", brand: "38-0", blurb: "An invincible XI", accent: "#7b3ff2" },
];

export const SPORT_CATALOG: CatalogEntry[] = CATALOG.map((c) => ({
  ...c,
  live: Boolean(SPORTS[c.id]),
}));

export const LIVE_SPORT_IDS = SPORT_CATALOG.filter((c) => c.live).map((c) => c.id);

export const getSport = (id: string): SportModule | undefined => SPORTS[id as SportId];
export const getCatalogEntry = (id: string): CatalogEntry | undefined =>
  SPORT_CATALOG.find((c) => c.id === id);
