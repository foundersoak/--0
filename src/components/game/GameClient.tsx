"use client";
import { useEffect, useState } from "react";
import type { PlayerDataset } from "@/engine/types";
import { getCatalogEntry, getSport } from "@/sports/registry";
import { getMode, seedForMode, type GameModeId } from "@/lib/modes";
import { GameBoard } from "./GameBoard";
import { ModeTabs } from "./ModeTabs";

export function GameClient({ sportId }: { sportId: string }) {
  const mod = getSport(sportId);
  const accent = getCatalogEntry(sportId)?.accent ?? "#FDB927";
  const [dataset, setDataset] = useState<PlayerDataset | null>(null);
  const [modeId, setModeId] = useState<GameModeId>("classic");
  const mode = getMode(modeId);
  const [seed, setSeed] = useState(() => seedForMode(getMode("classic"), sportId));

  useEffect(() => {
    let alive = true;
    mod?.load().then((d) => {
      if (alive) setDataset(d);
    });
    return () => {
      alive = false;
    };
  }, [mod]);

  const selectMode = (id: GameModeId) => {
    setModeId(id);
    setSeed(seedForMode(getMode(id), sportId));
  };

  if (!mod) {
    return <p className="text-white/50">This sport isn&apos;t available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModeTabs current={modeId} onSelect={selectMode} accent={accent} />
        <p className="text-xs text-white/40">{mode.blurb}</p>
      </div>
      {!dataset ? (
        <div className="flex h-40 items-center justify-center text-white/40">
          <span className="animate-pulse">Loading legends…</span>
        </div>
      ) : (
        <GameBoard
          key={`${modeId}:${seed}`}
          config={mod.config}
          dataset={dataset}
          seed={seed}
          mode={mode}
          accent={accent}
        />
      )}
    </div>
  );
}
