/**
 * Global leaderboard storage. Uses a Vercel KV / Upstash Redis REST endpoint
 * when configured (KV_REST_API_URL + KV_REST_API_TOKEN), otherwise falls back to
 * an in-memory board for local dev. Server-only (imported by the API route).
 */

export interface BoardEntry {
  handle: string;
  wins: number;
  losses: number;
  grade: string;
  perfect: boolean;
  at: number;
}

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
export const hasKV = Boolean(KV_URL && KV_TOKEN);

const mem = new Map<string, BoardEntry[]>();

async function kv<T = unknown>(cmd: (string | number)[]): Promise<T> {
  const res = await fetch(KV_URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`kv error ${res.status}`);
  const json = (await res.json()) as { result: T };
  return json.result;
}

export function boardKey(sport: string, mode: string, date?: string | null): string {
  return `lb:${sport}:${mode}${date ? `:${date}` : ""}`;
}

// Sort score: wins dominate, perfect breaks ties, fewer losses wins the rest.
const scoreOf = (e: BoardEntry): number => e.wins * 100000 + (e.perfect ? 50000 : 0) - e.losses;

export async function submitScore(key: string, entry: BoardEntry): Promise<void> {
  if (hasKV) {
    await kv(["ZADD", key, scoreOf(entry), JSON.stringify(entry)]);
    await kv(["ZREMRANGEBYRANK", key, 0, -101]); // keep only the top 100
    if (/\d{4}-\d{2}-\d{2}$/.test(key)) await kv(["EXPIRE", key, 60 * 60 * 24 * 45]); // dailies expire
    return;
  }
  const arr = mem.get(key) ?? [];
  arr.push(entry);
  arr.sort((a, b) => scoreOf(b) - scoreOf(a));
  mem.set(key, arr.slice(0, 100));
}

export async function topScores(key: string, n = 20): Promise<BoardEntry[]> {
  if (hasKV) {
    const raw = await kv<string[]>(["ZREVRANGE", key, 0, n - 1]);
    return raw.map((s) => JSON.parse(s) as BoardEntry);
  }
  return (mem.get(key) ?? []).slice(0, n);
}
