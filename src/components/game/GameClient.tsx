"use client";
import { useEffect, useState } from "react";
import { randomSeed } from "@/engine";
import type { PlayerDataset } from "@/engine/types";
import { getSport } from "@/sports/registry";
import { GameBoard } from "./GameBoard";

export function GameClient({ sportId }: { sportId: string }) {
  const mod = getSport(sportId);
  const [dataset, setDataset] = useState<PlayerDataset | null>(null);
  const [seed] = useState(() => randomSeed());

  useEffect(() => {
    let alive = true;
    mod?.load().then((d) => {
      if (alive) setDataset(d);
    });
    return () => {
      alive = false;
    };
  }, [mod]);

  if (!mod) {
    return <p className="text-white/50">This sport isn&apos;t available yet.</p>;
  }
  if (!dataset) {
    return (
      <div className="flex h-40 items-center justify-center text-white/40">
        <span className="animate-pulse">Loading legends…</span>
      </div>
    );
  }
  return <GameBoard config={mod.config} dataset={dataset} seed={seed} />;
}
