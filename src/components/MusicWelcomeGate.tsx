"use client";

import { inviteConfig } from "@/config/inviteConfig";

type Props = {
  onAccept: () => void;
};

export function MusicWelcomeGate({ onAccept }: Props) {
  const { guestName, yourName, music } = inviteConfig;

  return (
    <div className="music-gate fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="music-gate-card relative z-10 w-full max-w-md p-8 text-center sm:p-12">
        <p className="mb-4 text-6xl music-gate-pulse">💌</p>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400">
          Convite especial
        </p>

        <h1 className="mt-3 font-serif text-3xl font-bold text-rose-800 sm:text-4xl">
          Oi, {guestName}!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-rose-600/90">
          {yourName} preparou uma surpresa para você.
          <br />
          Para começar, aceite iniciar a trilha sonora.
        </p>

        <div className="music-gate-song mx-auto mt-8 max-w-xs rounded-2xl border-2 border-rose-200 bg-rose-50/90 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
            Tocando em seguida
          </p>
          <p className="mt-1 text-lg font-bold text-rose-800">{music.title}</p>
          <p className="text-sm text-rose-500">{music.artists}</p>
        </div>

        <button
          type="button"
          onClick={onAccept}
          className="music-gate-btn mt-10 w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 py-5 text-lg font-bold text-white shadow-xl shadow-rose-400/40 transition hover:from-rose-600 hover:via-pink-600 hover:to-rose-600"
        >
          Aceitar e iniciar a música 🎵
        </button>

        <p className="mt-4 text-xs text-rose-400/80">
          Um clique e a experiência começa
        </p>
      </div>
    </div>
  );
}
