/**
 * Extended NHL axis diagnostics: 2000 rosters, full percentile breakdown,
 * plus per-era per-position adjusted values, to guide floor/target calibration.
 */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { eraAdjustStats } from "../../src/engine/simulate";
import nhlConfig from "../../src/sports/nhl/config";
import type { PlayerEntry } from "../../src/engine/types";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dataset = JSON.parse(readFileSync(join(ROOT, "src/sports/nhl/data.json"), "utf8"));
const players: PlayerEntry[] = dataset.players;

const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
const POSITIONS = ["C", "LW", "RW", "D", "D", "G"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function computeAxes(slots: { slotId: string; player: PlayerEntry }[]) {
  const totals: Record<string, number> = { scoring: 0, playmaking: 0, defense: 0, goaltending: 0 };
  for (const slot of slots) {
    const adj = eraAdjustStats(slot.player, nhlConfig);
    const pos = slot.player.positions[0];
    if (["C", "LW", "RW"].includes(pos)) {
      totals.scoring += adj.g ?? 0;
      totals.playmaking += adj.a ?? 0;
    } else if (pos === "D") {
      totals.defense += (adj.pm ?? 0) * 0.4 + (adj.p ?? 0) * 0.15;
      totals.scoring += (adj.g ?? 0) * 0.6;
      totals.playmaking += (adj.a ?? 0) * 0.6;
    } else if (pos === "G") {
      totals.goaltending +=
        ((adj.svp ?? 0.88) - 0.88) * 200 +
        Math.max(0, 3.2 - (adj.gaa ?? 3.2)) * 8 +
        (adj.w ?? 0) * 0.3 +
        (adj.so ?? 0) * 0.5;
    }
  }
  return totals;
}

const samples: Record<string, number>[] = [];
let attempts = 0;
while (samples.length < 2000 && attempts < 40000) {
  attempts++;
  const usedEras = new Set<string>();
  const slots: { slotId: string; player: PlayerEntry }[] = [];
  let ok = true;
  for (let i = 0; i < POSITIONS.length; i++) {
    const pos = POSITIONS[i];
    const eligibleEras = ERAS.filter(e => !usedEras.has(e));
    if (eligibleEras.length === 0) { ok = false; break; }
    const era = pickRandom(eligibleEras);
    const pool = players.filter(p => p.positions.includes(pos) && p.era === era);
    if (pool.length === 0) { ok = false; break; }
    usedEras.add(era);
    slots.push({ slotId: pos + i, player: pickRandom(pool) });
  }
  if (ok && slots.length === 6) samples.push(computeAxes(slots));
}

const keys = ["scoring", "playmaking", "defense", "goaltending"];
const pcts = [5, 10, 20, 25, 50, 75, 80, 90, 95];

console.log(`\nNHL axis distribution (${samples.length} rosters)\n`);
for (const k of keys) {
  const vals = samples.map(s => s[k]).sort((a, b) => a - b);
  const stats: string[] = pcts.map(p => {
    const v = vals[Math.floor(vals.length * p / 100)];
    return `p${p}=${v.toFixed(1)}`;
  });
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  console.log(`  ${k.padEnd(16)} avg=${avg.toFixed(1).padStart(6)}  ${stats.join("  ")}`);
}

// Show per-era, per-position era-adjusted values (to understand spread)
console.log(`\nEra-adjusted stat ranges by position:`);
for (const pos of ["C", "LW", "RW", "D", "G"]) {
  const pool = players.filter(p => p.positions.includes(pos));
  const byEra: Record<string, number[]> = {};
  for (const p of pool) {
    const adj = eraAdjustStats(p, nhlConfig);
    let v: number;
    if (pos === "G") {
      v = ((adj.svp ?? 0.88) - 0.88) * 200 + Math.max(0, 3.2 - (adj.gaa ?? 3.2)) * 8 + (adj.w ?? 0) * 0.3 + (adj.so ?? 0) * 0.5;
    } else if (pos === "D") {
      v = (adj.pm ?? 0) * 0.4 + (adj.p ?? 0) * 0.15;  // defense contribution
    } else {
      v = adj.g ?? 0;  // scoring contribution
    }
    (byEra[p.era] ??= []).push(v);
  }
  const allVals = Object.values(byEra).flat().sort((a, b) => a - b);
  const min = allVals[0];
  const max = allVals[allVals.length - 1];
  const avg = allVals.reduce((a, b) => a + b, 0) / allVals.length;
  console.log(`  ${pos}  min=${min.toFixed(1)}  avg=${avg.toFixed(1)}  max=${max.toFixed(1)}  (n=${allVals.length})`);
}
