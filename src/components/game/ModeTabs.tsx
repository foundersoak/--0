"use client";
import { GAME_MODES, type GameModeId } from "@/lib/modes";

export function ModeTabs({
  current,
  onSelect,
  accent,
}: {
  current: GameModeId;
  onSelect: (id: GameModeId) => void;
  accent: string;
}) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1 text-sm">
      {GAME_MODES.map((m) => {
        const active = m.id === current;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            title={m.blurb}
            className={[
              "rounded-lg px-3 py-1.5 font-semibold transition",
              active ? "text-black" : "text-white/60 hover:text-white",
            ].join(" ")}
            style={active ? { backgroundColor: accent } : undefined}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
