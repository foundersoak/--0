import type { FranchiseDef, SportConfig } from "@/engine/types";

export function franchiseOf(config: SportConfig, teamId: string): FranchiseDef | undefined {
  return config.franchises.find((f) => f.id === teamId);
}

/** Display name for a team in a given era (honors relocations/renames). */
export function teamName(config: SportConfig, teamId: string, era?: string): string {
  const fr = franchiseOf(config, teamId);
  if (!fr) return teamId;
  if (era) {
    const alias = fr.aliases?.find((a) => a.era === era);
    if (alias) return alias.name;
  }
  return fr.name;
}

export function teamColors(config: SportConfig, teamId: string): [string, string] {
  return franchiseOf(config, teamId)?.colors ?? ["#334155", "#64748b"];
}

export function eraLabel(config: SportConfig, eraId: string): string {
  return config.eras.find((e) => e.id === eraId)?.label ?? eraId;
}

export function fmtStat(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}
