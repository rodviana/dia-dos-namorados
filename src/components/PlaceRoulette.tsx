"use client";

import { useState } from "react";
import type { PlaceOption } from "@/config/inviteConfig";
import { useInviteConfig } from "@/context/InviteConfigContext";

type Place = PlaceOption;

type Props = {
  onSelect: (placeId: string) => void;
  selectedPlaceId?: string;
};

export function PlaceRoulette({ onSelect, selectedPlaceId }: Props) {
  const { placeOptions } = useInviteConfig();
  const places = placeOptions.filter((p) => !p.allowCustom);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Place | null>(null);
  const [display, setDisplay] = useState<Place | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    let ticks = 0;
    const maxTicks = 20 + Math.floor(Math.random() * 10);
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
    }, 90);
  };

  const isWinner =
    result && selectedPlaceId === result.id && !spinning;

  return (
    <div className="roulette-card roulette-glow mb-8 rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-5 text-center shadow-lg shadow-rose-200/50 sm:p-6">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-rose-400">
        ✦ Não sabe? ✦
      </p>
      <h3 className="font-serif text-xl font-bold text-rose-800 sm:text-2xl">
        Gira a roleta do encontro!
      </h3>
      <p className="mt-1 text-sm text-rose-500">
        Deixa o destino escolher o local 🎰
      </p>

      <div
        className={`roulette-wheel relative mx-auto mt-5 max-w-xs overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-inner ${
          spinning
            ? "border-amber-400 roulette-spin"
            : isWinner
              ? "border-emerald-400"
              : "border-rose-200"
        }`}
      >
        {spinning && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-100/40 to-transparent" />
        )}

        <div className="relative min-h-[88px]">
          {display ? (
            <div
              key={display.id + (spinning ? "-spin" : "-done")}
              className={spinning ? "roulette-tick" : "roulette-result-pop"}
            >
              <span className="block text-5xl sm:text-6xl">{display.icon}</span>
              <p className="mt-2 text-lg font-bold text-rose-800">
                {display.name}
              </p>
              {!spinning && result && (
                <p className="mt-1 text-xs text-rose-500">
                  {display.description}
                </p>
              )}
            </div>
          ) : (
            <div className="flex min-h-[88px] flex-col items-center justify-center">
              <span className="text-5xl opacity-40">🎰</span>
              <p className="mt-2 text-sm font-medium text-rose-400">
                Aperta o botão e descobre!
              </p>
            </div>
          )}
        </div>
      </div>

      {isWinner && (
        <p className="roulette-result-pop mt-3 text-sm font-semibold text-emerald-600">
          O destino escolheu! ✨
        </p>
      )}

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="roulette-btn mt-5 w-full max-w-xs rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg shadow-rose-400/40 transition hover:from-amber-600 hover:via-rose-600 hover:to-pink-600 disabled:opacity-70 sm:text-lg"
      >
        {spinning ? "🎲 Girando..." : result ? "🎲 Girar de novo!" : "🎲 GIRAR A ROLETA!"}
      </button>
    </div>
  );
}
