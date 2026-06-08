import { describe, expect, it } from "vitest";
import { createEngine, eraAdjustStats, simulateSeason, type FilledSlot } from "@/engine";
import type { PlayerDataset } from "@/engine/types";
import nbaConfig from "@/sports/nba/config";
import nbaData from "@/sports/nba/data.json";

const dataset = nbaData as PlayerDataset;
const engine = createEngine(nbaConfig, dataset);
const byId = new Map(dataset.players.map((p) => [p.id, p]));

/** Build a 5-slot lineup from player ids (slot order = config order). */
const lineup = (...ids: string[]): FilledSlot[] =>
  ids.map((id, i) => {
    const player = byId.get(id);
    if (!player) throw new Error(`unknown player ${id}`);
    return { slotId: nbaConfig.positions[i].id, player };
  });

describe("era adjustment", () => {
  it("deflates pace-inflated 1960s scoring", () => {
    const wilt = byId.get("wilt-1960s")!;
    const adj = eraAdjustStats(wilt, nbaConfig);
    expect(adj.ppg).toBeCloseTo(39.6 * 0.78, 3);
    expect(adj.ppg).toBeLessThan(wilt.stats.ppg);
  });
});

describe("simulateSeason", () => {
  it("sends a stacked, balanced all-time lineup to 82-0", () => {
    const res = simulateSeason(
      lineup("luka-2020s", "jordan-1990s", "lebron-2000s", "giannis-2020s", "robinson-1990s"),
      nbaConfig,
    );
    expect(res.perfect).toBe(true);
    expect(res.wins).toBe(82);
    expect(res.losses).toBe(0);
  });

  it("caps a one-dimensional roster via gating (one weak category ruins it)", () => {
    // Five guards: huge scoring + playmaking, but no boards or rim protection.
    const res = simulateSeason(
      lineup("robertson-1960s", "west-1960s", "curry-2020s", "harden-2010s", "sga-2020s"),
      nbaConfig,
    );
    expect(res.perfect).toBe(false);
    const scoring = res.categories.find((c) => c.key === "ppg")!;
    const rim = res.categories.find((c) => c.key === "bpg")!;
    expect(scoring.passed).toBe(true); // scoring is elite...
    expect(rim.passed).toBe(false); // ...but rim protection fails
    expect(res.cappedBy).not.toBeNull();
    expect(res.wins).toBeLessThan(70); // capped despite the scoring
  });

  it("produces a believable spread, not just perfect-or-zero", () => {
    const res = simulateSeason(
      lineup("nash-2000s", "miller-1990s", "pippen-1990s", "dirk-2000s", "yao-2000s"),
      nbaConfig,
    );
    expect(res.wins).toBeGreaterThan(20);
    expect(res.wins).toBeLessThan(82);
  });
});

describe("deterministic spins", () => {
  it("same seed => identical first draw", () => {
    const draw = () => {
      const s = engine.reducer(engine.initial("test-seed"), { type: "SPIN" });
      return `${s.spin!.team}:${s.spin!.era}`;
    };
    expect(draw()).toBe(draw());
  });

  it("different seeds => not all identical", () => {
    const draw = (seed: string) => {
      const s = engine.reducer(engine.initial(seed), { type: "SPIN" });
      return `${s.spin!.team}:${s.spin!.era}`;
    };
    const uniq = new Set(["a", "b", "c", "d", "e", "f", "g", "h"].map(draw));
    expect(uniq.size).toBeGreaterThan(1);
  });
});

describe("full playthrough via the reducer", () => {
  it("fills five distinct-era slots and completes with a result", () => {
    let s = engine.initial("playthrough-1");
    for (let round = 0; round < nbaConfig.positions.length; round++) {
      s = engine.reducer(s, { type: "SPIN" });
      expect(s.spin).not.toBeNull();
      const cand = s.spin!.candidates[0];
      const slot = engine.eligibleSlots(s, cand)[0];
      s = engine.reducer(s, { type: "PICK", playerId: cand.id, slotId: slot.id });
    }
    expect(s.phase).toBe("complete");
    expect(s.filled).toHaveLength(5);
    expect(s.result).not.toBeNull();
    const eras = new Set(s.filled.map((f) => f.player.era));
    expect(eras.size).toBe(5); // era diversity enforced
  });
});
