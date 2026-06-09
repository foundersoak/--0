/**
 * Global leaderboard storage. Auto-selects a backend from env vars:
 *   1. Upstash REST  — KV_REST_API_URL/UPSTASH_REDIS_REST_URL + matching token
 *   2. Redis (TCP)   — REDIS_URL / KV_URL, via ioredis
 *   3. In-memory     — local dev fallback (resets per instance)
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

export function boardKey(sport: string, mode: string, date?: string | null): string {
  return `lb:${sport}:${mode}${date ? `:${date}` : ""}`;
}

const isDailyKey = (key: string): boolean => /\d{4}-\d{2}-\d{2}$/.test(key);
const DAILY_TTL = 60 * 60 * 24 * 45; // dailies expire after ~45 days

export async function submitScore(key: string, entry: BoardEntry): Promise<void> {
  const member = JSON.stringify(entry);
  const score = scoreOf(entry);
  if (backend === "rest") {
    await rest(["ZADD", key, score, member]);
    await rest(["ZREMRANGEBYRANK", key, 0, -101]); // keep only the top 100
    if (isDailyKey(key)) await rest(["EXPIRE", key, DAILY_TTL]);
    return;
  }
  if (backend === "redis") {
    const r = await redis();
    await r.zadd(key, score, member);
    await r.zremrangebyrank(key, 0, -101);
    if (isDailyKey(key)) await r.expire(key, DAILY_TTL);
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
