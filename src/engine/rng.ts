/**
 * Tiny seedable PRNG so spins are deterministic: the same seed produces the same
 * sequence of (team, era) draws. This is what makes shareable boards and the
 * daily challenge free, encode the seed, replay the exact game.
 */

/** Hash a string into a 32-bit integer seed (xfnv1a). */
export function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG -> function returning floats in [0, 1). */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic RNG for a given seed + salt (e.g. the Nth draw of a game). */
export function rngFor(seed: string, salt: number): () => number {
  return mulberry32(hashSeed(`${seed}:${salt}`));
}

/** Pick a uniformly random element. */
export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Everyone gets the same board on a given UTC day. */
export function dailySeed(sportId: string, date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${sportId}-${y}-${m}-${d}`;
}

/** A fresh random seed for a free-play game. */
export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
