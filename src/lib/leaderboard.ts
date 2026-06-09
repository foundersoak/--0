/**
 * Global leaderboard storage. Auto-selects a backend from env vars:
 *   1. Upstash REST: KV_REST_API_URL/UPSTASH_REDIS_REST_URL + matching token
 *   2. Redis (TCP):  REDIS_URL / KV_URL, via ioredis
 *   3. In-memory:    local dev fallback (resets per instance)
 * Server-only (imported by the API route, which runs on the Node.js runtime).
 */
import type IORedis from "ioredis";

export interface BoardEntry {
  handle: string;
  wins: number;
  losses: number;
  grade: string;
  perfect: boolean;
  at: number;
}

export type Period = "all" | "month" | "week" | "day";

const REST_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_URL = process.env.REDIS_URL ?? process.env.KV_URL;

type Backend = "rest" | "redis" | "memory";
const backend: Backend = REST_URL && REST_TOKEN ? "rest" : REDIS_URL ? "redis" : "memory";
export const hasPersistence = backend !== "memory";

// --- Upstash REST (HTTP) ---
async function rest<T>(cmd: (string | number)[]): Promise<T> {
  const res = await fetch(REST_URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`leaderboard REST error ${res.status}`);
  return ((await res.json()) as { result: T }).result;
}

// --- Redis over TCP (ioredis), reused across warm invocations ---
let client: IORedis | null = null;
async function redis(): Promise<IORedis> {
  if (!client) {
    const { default: Redis } = await import("ioredis");
    client = new Redis(REDIS_URL as string, { maxRetriesPerRequest: 3 });
  }
  return client;
}

// --- in-memory ---
const mem = new Map<string, BoardEntry[]>();

const scoreOf = (e: BoardEntry): number => e.wins * 100000 + (e.perfect ? 50000 : 0) - e.losses;

// ---- board keys ----
function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function ym(d: Date): string {
  return d.toISOString().slice(0, 7);
}
function isoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  date.setUTCDate(date.getUTCDate() - day + 3); // Thursday of this week
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const fdDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fdDay + 3);
  const week = 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

const DAY = 60 * 60 * 24;

/** The single board to read for a (mode, period) view. */
export function boardKeyForView(
  sport: string,
  mode: string,
  period: Period,
  dailyDate?: string | null,
): string {
  if (mode === "daily") return `lb:${sport}:daily:${dailyDate ?? ymd(new Date())}`;
  const now = new Date();
  if (period === "month") return `lb:${sport}:${mode}:m:${ym(now)}`;
  if (period === "week") return `lb:${sport}:${mode}:w:${isoWeek(now)}`;
  return `lb:${sport}:${mode}`; // all-time
}

/** Every board a submission should be written to, with optional TTLs. */
export function boardKeysForSubmit(
  sport: string,
  mode: string,
  dailyDate?: string | null,
): { key: string; ttl?: number }[] {
  if (mode === "daily") {
    return [{ key: `lb:${sport}:daily:${dailyDate ?? ymd(new Date())}`, ttl: 45 * DAY }];
  }
  const now = new Date();
  return [
    { key: `lb:${sport}:${mode}` }, // all-time (no expiry)
    { key: `lb:${sport}:${mode}:m:${ym(now)}`, ttl: 70 * DAY }, // monthly
    { key: `lb:${sport}:${mode}:w:${isoWeek(now)}`, ttl: 21 * DAY }, // weekly
  ];
}

export async function submitScore(key: string, entry: BoardEntry, ttl?: number): Promise<void> {
  const member = JSON.stringify(entry);
  const score = scoreOf(entry);
  if (backend === "rest") {
    await rest(["ZADD", key, score, member]);
    await rest(["ZREMRANGEBYRANK", key, 0, -101]); // keep only the top 100
    if (ttl) await rest(["EXPIRE", key, ttl]);
    return;
  }
  if (backend === "redis") {
    const r = await redis();
    await r.zadd(key, score, member);
    await r.zremrangebyrank(key, 0, -101);
    if (ttl) await r.expire(key, ttl);
    return;
  }
  const arr = mem.get(key) ?? [];
  arr.push(entry);
  arr.sort((a, b) => scoreOf(b) - scoreOf(a));
  mem.set(key, arr.slice(0, 100));
}

export async function topScores(key: string, n = 20): Promise<BoardEntry[]> {
  try {
    let raw: string[] = [];
    if (backend === "rest") {
      raw = await rest<string[]>(["ZREVRANGE", key, 0, n - 1]);
    } else if (backend === "redis") {
      raw = await (await redis()).zrevrange(key, 0, n - 1);
    } else {
      return (mem.get(key) ?? []).slice(0, n);
    }
    return raw.map((s) => JSON.parse(s) as BoardEntry);
  } catch {
    return []; // never break the board on a read error
  }
}

/** 1-based rank of an entry within a board, plus the board size. */
export async function rankAndTotal(
  key: string,
  entry: BoardEntry,
): Promise<{ rank: number | null; total: number }> {
  const member = JSON.stringify(entry);
  try {
    if (backend === "rest") {
      const rank = await rest<number | null>(["ZREVRANK", key, member]);
      const total = await rest<number>(["ZCARD", key]);
      return { rank: rank === null ? null : rank + 1, total };
    }
    if (backend === "redis") {
      const r = await redis();
      const rank = await r.zrevrank(key, member);
      const total = await r.zcard(key);
      return { rank: rank === null ? null : rank + 1, total };
    }
    const arr = mem.get(key) ?? [];
    const idx = arr.findIndex((e) => JSON.stringify(e) === member);
    return { rank: idx >= 0 ? idx + 1 : null, total: arr.length };
  } catch {
    return { rank: null, total: 0 };
  }
}
