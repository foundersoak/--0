import { dailySeed, randomSeed } from "@/engine";

export type GameModeId = "classic" | "hoopiq" | "daily";

export interface GameModeDef {
  id: GameModeId;
  label: string;
  blurb: string;
  /** Hoop IQ conceals the box scores — you draft on knowledge alone. */
  hideStats: boolean;
  /** Our improvement on the original: show the team's category progress while drafting. */
  liveMeters: boolean;
  /** A single board shared by everyone for the UTC day. */
  daily: boolean;
}

export const GAME_MODES: GameModeDef[] = [
  {
    id: "classic",
    label: "Casual",
    blurb: "Every player's stats shown + live meters",
    hideStats: false,
    liveMeters: true,
    daily: false,
  },
  {
    id: "hoopiq",
    label: "Expert",
    blurb: "Stats hidden — draft on knowledge",
    hideStats: true,
    liveMeters: false,
    daily: false,
  },
  {
    id: "daily",
    label: "Daily",
    blurb: "Everyone gets today's board — one shot",
    hideStats: false,
    liveMeters: true,
    daily: true,
  },
];

export const getMode = (id: string): GameModeDef =>
  GAME_MODES.find((m) => m.id === id) ?? GAME_MODES[0];

/** The seed a mode starts from. Daily is shared across all players for the UTC day. */
export function seedForMode(mode: GameModeDef, sportId: string): string {
  return mode.daily ? dailySeed(sportId) : randomSeed();
}
