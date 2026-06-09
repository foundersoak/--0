/**
 * Local persistence (localStorage) for personal bests, recent runs, and the
 * Daily streak. Browser-only and fully guarded so it's safe to import anywhere.
 * A global leaderboard can layer on top later via a serverless route + KV.
 */

export interface ScoreEntry {
  sportId: string;
  modeId: string;
  wins: number;
  losses: number;
  grade: string;
  perfect: boolean;
  seed: string;
  roster: { slot: string; name: string }[];
  at: number; // epoch ms
  date: string | null; // YYYY-MM-DD for daily runs, else null
}

interface DailyState {
  lastDate: string | null;
  streak: number;
  maxStreak: number;
  history: Record<string, ScoreEntry>;
}

interface Store {
  recent: Record<string, ScoreEntry[]>; // sportId -> newest first
  best: Record<string, ScoreEntry>; // `${sportId}:${modeId}` -> best run
  daily: Record<string, DailyState>; // sportId -> streak/history
}

const KEY = "undefeated:v1";
const empty = (): Store => ({ recent: {}, best: {}, daily: {} });

function read(): Store {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty(), ...(JSON.parse(raw) as Store) } : empty();
  } catch {
    return empty();
  }
}

function write(s: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota exceeded / private mode — ignore */
  }
}

/** A run is "better" if it won more games (perfect breaks ties). */
const isBetter = (a: ScoreEntry, b?: ScoreEntry): boolean =>
  !b || a.wins > b.wins || (a.wins === b.wins && a.perfect && !b.perfect);

function prevDate(date: string): string {
  const dt = new Date(`${date}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

export interface RecordOutcome {
  newBest: boolean;
  alreadyPlayedDaily: boolean;
  streak: number;
}

export function recordResult(entry: ScoreEntry): RecordOutcome {
  const s = read();
  const bestKey = `${entry.sportId}:${entry.modeId}`;
  let newBest = false;
  let alreadyPlayedDaily = false;
  let streak = 0;

  const list = s.recent[entry.sportId] ?? [];
  list.unshift(entry);
  s.recent[entry.sportId] = list.slice(0, 20);

  if (isBetter(entry, s.best[bestKey])) {
    s.best[bestKey] = entry;
    newBest = true;
  }

  if (entry.date) {
    const d: DailyState = s.daily[entry.sportId] ?? {
      lastDate: null,
      streak: 0,
      maxStreak: 0,
      history: {},
    };
    if (d.history[entry.date]) {
      alreadyPlayedDaily = true; // only the first completion per day counts
      streak = d.streak;
    } else {
      d.history[entry.date] = entry;
      d.streak = d.lastDate === prevDate(entry.date) ? d.streak + 1 : 1;
      d.lastDate = entry.date;
      d.maxStreak = Math.max(d.maxStreak, d.streak);
      streak = d.streak;
    }
    s.daily[entry.sportId] = d;
  }

  write(s);
  return { newBest, alreadyPlayedDaily, streak };
}

export function getBest(sportId: string, modeId: string): ScoreEntry | null {
  return read().best[`${sportId}:${modeId}`] ?? null;
}

export function getRecent(sportId: string, limit = 10): ScoreEntry[] {
  return (read().recent[sportId] ?? []).slice(0, limit);
}

export function getDailyState(
  sportId: string,
  today: string,
): { streak: number; maxStreak: number; playedToday: boolean; today: ScoreEntry | null } {
  const d = read().daily[sportId];
  return {
    streak: d?.streak ?? 0,
    maxStreak: d?.maxStreak ?? 0,
    playedToday: Boolean(d?.history?.[today]),
    today: d?.history?.[today] ?? null,
  };
}
