/**
 * Shows actual axis totals for sample rosters so we can calibrate floors/targets.
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

// Build 20 random era-diverse rosters and show axes
const POSITIONS = ["C", "LW", "RW", "D", "D", "G"];
const samples: Record<string, number>[] = [];

Math.random; // seed isn't needed for diagnostics
for (let trial = 0; trial < 200; trial++) {
  const usedEras = new Set<string>();
  const slots: { slotId: string; player: PlayerEntry }[] = [];
  const availableEras = [...ERAS];
  let ok = true;
  for (let i = 0; i < POSITIONS.length; i++) {
    const pos = POSITIONS[i];
    const eligibleEras = availableEras.filter(e => !usedEras.has(e));
    if (eligibleEras.length === 0) { ok = false; break; }
    const era = pickRandom(eligibleEras);
    const pool = players.filter(p => p.positions.includes(pos) && p.era === era);
    if (pool.length === 0) { ok = false; break; }
    const player = pickRandom(pool);
    usedEras.add(era);
    slots.push({ slotId: pos + i, player });
  }
  if (!ok) continue;
  samples.push(computeAxes(slots));
  if (samples.length >= 20) break;
}

// Stats across all samples
const keys = ["scoring","playmaking","defense","goaltending"];
console.log("\nNHL axis diagnostics (20 random era-diverse rosters):\n");
console.log("  Roster  | Scoring | Playmaking | Defense | Goaltending");
for (let i = 0; i < samples.length; i++) {
  const s = samples[i];
  console.log(`  ${String(i+1).padStart(2)}      | ${s.scoring.toFixed(1).padStart(7)} | ${s.playmaking.toFixed(1).padStart(10)} | ${s.defense.toFixed(1).padStart(7)} | ${s.goaltending.toFixed(1)}`);
}
const avgs: Record<string, number> = {};
for (const k of keys) avgs[k] = samples.reduce((a, s) => a + s[k], 0) / samples.length;
console.log(`  AVG     | ${avgs.scoring.toFixed(1).padStart(7)} | ${avgs.playmaking.toFixed(1).padStart(10)} | ${avgs.defense.toFixed(1).padStart(7)} | ${avgs.goaltending.toFixed(1)}`);
const mins: Record<string, number> = {};
const maxs: Record<string, number> = {};
for (const k of keys) {
  mins[k] = Math.min(...samples.map(s => s[k]));
  maxs[k] = Math.max(...samples.map(s => s[k]));
}
console.log(`  MIN     | ${mins.scoring.toFixed(1).padStart(7)} | ${mins.playmaking.toFixed(1).padStart(10)} | ${mins.defense.toFixed(1).padStart(7)} | ${mins.goaltending.toFixed(1)}`);
console.log(`  MAX     | ${maxs.scoring.toFixed(1).padStart(7)} | ${maxs.playmaking.toFixed(1).padStart(10)} | ${maxs.defense.toFixed(1).padStart(7)} | ${maxs.goaltending.toFixed(1)}`);

console.log(`\nCurrent config floors/targets:`);
for (const c of nhlConfig.scoring.categories) {
  console.log(`  ${c.key.padEnd(16)} floor=${c.floor}  target=${c.target}`);
}
