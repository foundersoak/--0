/** Compact, URL-safe encoding of a finished roster so a link can reproduce it. */
export function encodeShare(sportId: string, seed: string, orderedPlayerIds: string[]): string {
  return [sportId, seed, orderedPlayerIds.join("~")].join(".");
}

export interface DecodedShare {
  sportId: string;
  seed: string;
  playerIds: string[];
}

export function decodeShare(code: string): DecodedShare | null {
  const parts = code.split(".");
  if (parts.length < 3) return null;
  const [sportId, seed, ids = ""] = parts;
  if (!sportId || !seed) return null;
  return { sportId, seed, playerIds: ids.split("~").filter(Boolean) };
}

/** Wordle-style spoiler-free grid: one square per category, green = floor cleared. */
export function shareGrid(passes: boolean[]): string {
  return passes.map((p) => (p ? "🟩" : "🟥")).join("");
}

/** Pull the YYYY-MM-DD out of a daily seed like "nba-2026-06-09". */
export function dailyDateFromSeed(seed: string): string | null {
  const m = seed.match(/(\d{4}-\d{2}-\d{2})$/);
  return m ? m[1] : null;
}
