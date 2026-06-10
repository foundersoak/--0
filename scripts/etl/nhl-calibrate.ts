/**
 * NHL calibration diagnostic. Runs 4000 random 6-pick rosters through
 * the simulator and reports record distribution, gating rates, and
 * whether 82-0 is reachable but rare.
 * Run: npx tsx scripts/etl/nhl-calibrate.ts
 */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { simulateSeason, type FilledSlot } from "../../src/engine/simulate";
import nhlConfig from "../../src/sports/nhl/config";
import type { PlayerEntry } from "../../src/engine/types";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dataset = JSON.parse(readFileSync(join(ROOT, "src/sports/nhl/data.json"), "utf8"));
const players: PlayerEntry[] = dataset.players;

const POSITIONS = ["C", "LW", "RW", "D", "D", "G"];
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRoster(): FilledSlot[] | null {
  const usedEras = new Set<string>();
  const slots: FilledSlot[] = [];
  const usedPos = ["C", "LW", "RW", "D", "D", "G"];
  const positions = [...usedPos];
  const availableEras = [...ERAS];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const eligibleEras = availableEras.filter(e => !usedEras.has(e));
    if (eligibleEras.length === 0) return null;

    const era = pickRandom(eligibleEras);
    const pool = players.filter(p =>
      p.positions.includes(pos) && p.era === era
    );
    if (pool.length === 0) return null;
    const player = pickRandom(pool);
    usedEras.add(era);
    slots.push({ slotId: `${pos}${i}`, player });
  }
  return slots;
}

const N = 4000;
const wins: number[] = [];
let perfects = 0;
let gatedCount = 0;
const cappedBy: Record<string, number> = {};
const gradeCount: Record<string, number> = {};
const winBuckets = Array(9).fill(0); // 0-9, 10-19, ... 70-79, 80-82

let attempts = 0;
while (wins.length < N) {
  attempts++;
  if (attempts > N * 20) break;
  const roster = randomRoster();
  if (!roster) continue;
  const result = simulateSeason(roster, nhlConfig);
  wins.push(result.wins);
  if (result.perfect) perfects++;
  if (result.cappedBy) {
    gatedCount++;
    cappedBy[result.cappedBy] = (cappedBy[result.cappedBy] ?? 0) + 1;
  }
  gradeCount[result.grade] = (gradeCount[result.grade] ?? 0) + 1;
  const bucket = Math.min(8, Math.floor(result.wins / 10));
  winBuckets[bucket]++;
}

wins.sort((a, b) => a - b);
const avg = wins.reduce((a, b) => a + b, 0) / wins.length;
const p25 = wins[Math.floor(wins.length * 0.25)];
const p50 = wins[Math.floor(wins.length * 0.5)];
const p75 = wins[Math.floor(wins.length * 0.75)];
const p95 = wins[Math.floor(wins.length * 0.95)];
const p99 = wins[Math.floor(wins.length * 0.99)];

console.log(`\nNHL Calibration (${wins.length} rosters)\n`);
console.log(`  Avg wins: ${avg.toFixed(1)}  (target: ~35-45 range, median ~40)`);
console.log(`  p25/p50/p75/p95/p99: ${p25}/${p50}/${p75}/${p95}/${p99}`);
console.log(`  Perfect (82-0): ${perfects} / ${wins.length} (${(perfects/wins.length*100).toFixed(2)}%)`);
console.log(`  Gated (capped by weakness): ${gatedCount} / ${wins.length} (${(gatedCount/wins.length*100).toFixed(1)}%)`);

console.log(`\n  Win distribution:`);
const labels = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80-82"];
for (let i = 0; i < 9; i++) {
  const pct = (winBuckets[i] / wins.length * 100).toFixed(1);
  const bar = "=".repeat(Math.round(winBuckets[i] / wins.length * 50));
  console.log(`  ${labels[i].padEnd(7)} ${pct.padStart(5)}%  ${bar}`);
}

console.log(`\n  Capped by category:`);
for (const [k, v] of Object.entries(cappedBy).sort(([,a],[,b]) => b - a)) {
  console.log(`    ${k.padEnd(16)} ${v} (${(v/wins.length*100).toFixed(1)}%)`);
}

console.log(`\n  Grade distribution:`);
const GRADES = ["S","A+","A","A-","B+","B","B-","C+","C","C-","D","F"];
for (const g of GRADES) {
  if (gradeCount[g]) console.log(`    ${g.padEnd(4)} ${gradeCount[g]} (${(gradeCount[g]/wins.length*100).toFixed(1)}%)`);
}

// Sample a few elite rosters
console.log(`\n  Top 5 rosters:`);
const topWins = wins.slice(-5).reverse();
console.log(`    Wins: ${topWins.join(", ")}`);
