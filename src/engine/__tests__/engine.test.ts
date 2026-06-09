import { describe, expect, it } from "vitest";
import {
  createEngine,
  eraAdjustStats,
  simulateSeason,
  type FilledSlot,
  type GameState,
} from "@/engine";
import type { PlayerDataset, PlayerEntry } from "@/engine/types";
import nbaConfig from "@/sports/nba/config";
import nbaData from "@/sports/nba/data.json";

const dataset = nbaData as unknown as PlayerDataset;
const engine = createEngine(nbaConfig, dataset);

function star(name: string, era: string): PlayerEntry {
  const p = dataset.players.find((x) => x.name === name && x.era === era);
  if (!p) throw new Error(`star not found: ${name} (${era})`);
  return p;
}
const lineup = (...players: PlayerEntry[]): FilledSlot[] =>
  players.map((player, i) => ({ slotId: nbaConfig.positions[i].id, player }));

describe("dataset", () => {
  it("has real roster depth per team and decade", () => {
    expect(dataset.players.length).toBeGreaterThan(4000);
    const counts = new Map<string, number>();
    for (const p of dataset.players) {
      const k = `${p.team}|${p.era}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    expect(counts.get("lakers|2010s")!).toBeGreaterThanOrEqual(40);
  });
});

describe("era adjustment", () => {
  it("deflates pace-inflated 1960s scoring", () => {
    const p = dataset.players.find((x) => x.era === "1960s" && x.stats.ppg > 20)!;
    const adj = eraAdjustStats(p, nbaConfig);
    expect(adj.ppg).toBeCloseTo(p.stats.ppg * 0.78, 3);
    expect(adj.ppg).toBeLessThan(p.stats.ppg);
  });
});

describe("simulateSeason", () => {
  it("sends a stacked, balanced all-time lineup to a near-perfect record", () => {
    const res = simulateSeason(
      lineup(
        star("Magic Johnson", "1980s"),
        star("Michael Jordan", "1990s"),
        star("LeBron James", "2010s"),
        star("Tim Duncan", "2000s"),
        star("Hakeem Olajuwon", "1990s"),
      ),
      nbaConfig,
    );
    expect(res.wins).toBeGreaterThanOrEqual(78);
  });

  it("caps a one-dimensional roster via gating (one weak category ruins it)", () => {
    // Five high-scoring guards: lots of points, no rebounding or rim protection.
    const guards = dataset.players
      .filter((p) => p.positions.every((x) => x === "PG" || x === "SG") && p.stats.ppg > 18)
      .slice(0, 5);
    expect(guards).toHaveLength(5);
    const res = simulateSeason(lineup(...guards), nbaConfig);
    expect(res.perfect).toBe(false);
    expect(res.cappedBy).not.toBeNull();
    expect(res.categories.find((c) => c.key === "bpg")!.passed).toBe(false);
    expect(res.wins).toBeLessThan(72);
  });
});

describe("deterministic spins", () => {
  it("same seed => identical first draw", () => {
    const draw = () => {
      const s = engine.reducer(engine.initial("seed-x"), { type: "SPIN" });
      return `${s.spin!.team}:${s.spin!.era}`;
    };
    expect(draw()).toBe(draw());
  });

  it("different seeds => not all identical", () => {
    const draw = (seed: string) =>
      engine.reducer(engine.initial(seed), { type: "SPIN" }).spin!.team;
    const uniq = new Set(["a", "b", "c", "d", "e", "f", "g", "h"].map(draw));
    expect(uniq.size).toBeGreaterThan(1);
  });
});

describe("full playthrough via the reducer", () => {
  it("fills five distinct-era slots and completes with a result", () => {
    let s = engine.initial("playthrough-1");
    for (let r = 0; r < nbaConfig.positions.length; r++) {
      s = engine.reducer(s, { type: "SPIN" });
      expect(s.spin).not.toBeNull();
      const cand = s.spin!.candidates[0];
      const slot = engine.eligibleSlots(s, cand)[0];
      s = engine.reducer(s, { type: "PICK", playerId: cand.id, slotId: slot.id });
    }
    expect(s.phase).toBe("complete");
    expect(s.filled).toHaveLength(5);
    expect(new Set(s.filled.map((f) => f.player.era)).size).toBe(5);
  });

  it("UNDO steps back one pick (and is a no-op on an empty roster)", () => {
    const pickOnce = (st: GameState): GameState => {
      st = engine.reducer(st, { type: "SPIN" });
      const cand = st.spin!.candidates[0];
      const slot = engine.eligibleSlots(st, cand)[0];
      return engine.reducer(st, { type: "PICK", playerId: cand.id, slotId: slot.id });
    };
    let s = pickOnce(pickOnce(engine.initial("undo-1")));
    expect(s.filled).toHaveLength(2);
    s = engine.reducer(s, { type: "UNDO" });
    expect(s.filled).toHaveLength(1);
    expect(s.phase).toBe("ready");
    expect(s.result).toBeNull();
    expect(engine.reducer(engine.initial("undo-2"), { type: "UNDO" }).filled).toHaveLength(0);
  });
});
