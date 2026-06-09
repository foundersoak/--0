import { NextResponse } from "next/server";
import { simulateSeason, type FilledSlot } from "@/engine";
import { boardKey, submitScore, topScores, type BoardEntry } from "@/lib/leaderboard";
import { getSport } from "@/sports/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") ?? "";
  const mode = searchParams.get("mode") ?? "classic";
  const date = searchParams.get("date");
  if (!getSport(sport)) return NextResponse.json({ error: "unknown sport" }, { status: 400 });
  const entries = await topScores(boardKey(sport, mode, date), 20);
  return NextResponse.json({ entries });
}

interface SubmitBody {
  sport?: string;
  mode?: string;
  date?: string | null;
  handle?: string;
  playerIds?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const mod = getSport(body.sport ?? "");
  if (!mod || !Array.isArray(body.playerIds)) {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
  const cfg = mod.config;
  const ids = body.playerIds as string[];
  if (ids.length !== cfg.positions.length) {
    return NextResponse.json({ error: "bad roster size" }, { status: 400 });
  }

  // Server-side verification: rebuild the lineup and re-simulate so the stored
  // record is the engine's truth — submitted scores can't be faked.
  const dataset = await mod.load();
  const byId = new Map(dataset.players.map((p) => [p.id, p]));
  const filled: FilledSlot[] = [];
  for (let i = 0; i < ids.length; i++) {
    const player = byId.get(ids[i]);
    if (!player) return NextResponse.json({ error: "unknown player" }, { status: 400 });
    filled.push({ slotId: cfg.positions[i].id, player });
  }
  if (cfg.requireEraDiversity) {
    const eras = new Set(filled.map((f) => f.player.era));
    if (eras.size !== filled.length) {
      return NextResponse.json({ error: "era diversity required" }, { status: 400 });
    }
  }

  const result = simulateSeason(filled, cfg);
  const handle =
    String(body.handle ?? "anon")
      .slice(0, 20)
      .replace(/[^\w \-]/g, "")
      .trim() || "anon";
  const entry: BoardEntry = {
    handle,
    wins: result.wins,
    losses: result.losses,
    grade: result.grade,
    perfect: result.perfect,
    at: Date.now(),
  };
  await submitScore(boardKey(body.sport ?? "", body.mode ?? "classic", body.date ?? null), entry);
  return NextResponse.json({
    ok: true,
    wins: result.wins,
    losses: result.losses,
    grade: result.grade,
    perfect: result.perfect,
  });
}
