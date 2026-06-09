"use client";
import type { Engine, GameState } from "@/engine";

/**
 * Live category meters, our improvement over the original, which hides your
 * progress and only reveals the damage at the end. Reuses the real scoring math
 * (`simulate` is partial-aware) so you watch each floor turn green as you draft.
 */
export function LiveMeters({
  engine,
  state,
  accent,
}: {
  engine: Engine;
  state: GameState;
  accent: string;
}) {
  const total = engine.config.positions.length;
  if (state.filled.length === 0) return null;
  const res = engine.simulate(state.filled);
  const done = state.filled.length >= total;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/40">Team so far</span>
        <span className="text-[11px] tabular-nums text-white/30">
          {state.filled.length}/{total} picked
        </span>
      </div>
      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {res.categories.map((c) => {
          const pct = c.floor > 0 ? Math.min(1, c.value / c.floor) : 1;
          const cleared = c.value >= c.floor;
          return (
            <div key={c.key}>
              <div className="mb-0.5 flex items-baseline justify-between text-[11px]">
                <span className={cleared ? "text-white/70" : "text-white/45"}>
                  {c.label} {cleared ? "✓" : ""}
                </span>
                <span className="tabular-nums text-white/35">
                  {c.value.toFixed(1)} / {c.floor}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct * 100}%`,
                    backgroundColor: cleared ? "#34d399" : done ? "#fb7185" : accent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2.5 text-[11px] text-white/30">Clear every floor to keep an undefeated season alive.</p>
    </div>
  );
}
