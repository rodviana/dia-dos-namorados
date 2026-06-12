"use client";

import { useState } from "react";
import { inviteConfig } from "@/config/inviteConfig";

type Place = (typeof inviteConfig.placeOptions)[number];

type Props = {
  onSelect: (placeId: string) => void;
};

export function PlaceRoulette({ onSelect }: Props) {
  const places = inviteConfig.placeOptions.filter((p) => !p.allowCustom);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Place | null>(null);
  const [display, setDisplay] = useState<Place | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    let ticks = 0;
    const maxTicks = 18 + Math.floor(Math.random() * 8);
    const winner = places[Math.floor(Math.random() * places.length)];

    const interval = setInterval(() => {
      ticks += 1;
      setDisplay(places[ticks % places.length]);

      if (ticks >= maxTicks) {
        clearInterval(interval);
        setDisplay(winner);
        setResult(winner);
        setSpinning(false);
        onSelect(winner.id);
      }
    }, 100);
  };

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-4 text-center">
      <p className="mb-3 text-xs font-medium text-rose-500">
        Indeciso(a)? Deixa o destino decidir 🎰
      </p>

      <div
        className={`mb-3 min-h-[72px] rounded-xl bg-white/80 p-4 transition ${
          spinning ? "roulette-spin" : ""
        }`}
      >
        {display ? (
          <>
            <span className="text-3xl">{display.icon}</span>
            <p className="mt-1 text-sm font-semibold text-rose-800">
              {display.name}
            </p>
          </>
        ) : (
          <p className="py-3 text-sm text-rose-300">Gira pra descobrir!</p>
        )}
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {spinning ? "Girando..." : result ? "Girar de novo" : "Girar a roleta!"}
      </button>
    </div>
  );
}
