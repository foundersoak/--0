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
