import type { PlayerEntry, SportConfig } from "@/engine/types";
import { eraLabel, fmtStat, teamColors, teamName } from "@/lib/sportHelpers";

export function StatLine({
  config,
  player,
  className = "",
  hideStats = false,
}: {
  config: SportConfig;
  player: PlayerEntry;
  className?: string;
  hideStats?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {config.stats
        .filter((s) => s.key in player.stats)
        .map((s) => (
        <div key={s.key} className="flex items-baseline gap-1 tabular-nums">
          <span className="text-sm font-semibold text-white">
            {hideStats ? "-" : fmtStat(player.stats[s.key] ?? 0, s.decimals ?? 1)}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/45">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PlayerCard({
  config,
  player,
  onClick,
  selected = false,
  dimmed = false,
  hideStats = false,
}: {
  config: SportConfig;
  player: PlayerEntry;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  hideStats?: boolean;
}) {
  const [primary, secondary] = teamColors(config, player.team);
  const interactive = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      style={{ borderLeftColor: primary }}
      className={[
        "group w-full overflow-hidden rounded-xl border border-l-4 border-white/10 bg-white/[0.03] p-3 text-left transition",
        interactive
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/30 active:translate-y-0"
          : "cursor-default",
        selected ? "ring-2 ring-amber-400" : "",
        dimmed ? "opacity-40" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold leading-tight text-white">{player.name}</div>
          <div className="truncate text-xs text-white/55">
            {teamName(config, player.team, player.era)}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-md border border-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/80">
            {player.positions[0]}
          </span>
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-black"
            style={{ backgroundColor: secondary }}
          >
            {eraLabel(config, player.era)}
          </span>
        </div>
      </div>
      <StatLine config={config} player={player} className="mt-2" hideStats={hideStats} />
      {player.notable ? (
        <div className="mt-2 truncate text-[11px] italic text-white/40">{player.notable}</div>
      ) : null}
    </button>
  );
}
