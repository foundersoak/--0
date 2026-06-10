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

/**
 * A fully self-contained share card: everything needed to render the result +
 * the OG image lives in the URL, so the share page / OG route never loads the
 * dataset. Encoded as URL-safe base64 (works in both browser and Node/edge).
 */
export interface ShareCard {
  sport: string;
  brand: string;
  name: string;
  wins: number;
  losses: number;
  grade: string;
  perfect: boolean;
  passes: boolean[];
}

function b64urlEncode(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(code: string): string {
  const bin = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeCard(card: ShareCard): string {
  const compact = {
    s: card.sport,
    b: card.brand,
    n: card.name,
    w: card.wins,
    l: card.losses,
    g: card.grade,
    p: card.perfect ? 1 : 0,
    c: card.passes.map((x) => (x ? 1 : 0)).join(""),
  };
  return b64urlEncode(JSON.stringify(compact));
}

export function decodeCard(code: string): ShareCard | null {
  try {
    const c = JSON.parse(b64urlDecode(code));
    if (!c || typeof c.s !== "string") return null;
    return {
      sport: c.s,
      brand: c.b ?? "",
      name: c.n ?? "",
      wins: Number(c.w) || 0,
      losses: Number(c.l) || 0,
      grade: c.g ?? "",
      perfect: c.p === 1,
      passes: String(c.c ?? "")
        .split("")
        .map((x) => x === "1"),
    };
  } catch {
    return null;
  }
}
