import type { GameState } from "@/engine";
import type { SportConfig } from "@/engine/types";
import { eraLabel, teamColors, teamName } from "@/lib/sportHelpers";

export function RosterBoard({ config, state }: { config: SportConfig; state: GameState }) {
  const bySlot = new Map(state.filled.map((f) => [f.slotId, f.player]));

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
      {config.positions.map((slot) => {
        const player = bySlot.get(slot.id);
        const [primary, secondary] = player ? teamColors(config, player.team) : ["#1e293b", "#334155"];
        return (
          <div
            key={slot.id}
            style={{ borderLeftColor: player ? primary : "#334155" }}
            className="flex items-center gap-3 rounded-xl border border-l-4 border-white/10 bg-white/[0.02] px-3 py-2"
          >
            <span className="w-10 shrink-0 text-center text-xs font-bold uppercase tracking-wide text-white/40">
              {slot.abbr}
            </span>
            {player ? (
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{player.name}</div>
                  <div className="truncate text-xs text-white/50">
                    {teamName(config, player.team, player.era)}
                  </div>
                </div>
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold text-black"
                  style={{ backgroundColor: secondary }}
                >
                  {eraLabel(config, player.era)}
                </span>
              </div>
            ) : (
              <span className="flex-1 text-sm text-white/30">{slot.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
