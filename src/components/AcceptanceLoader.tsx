"use client";

import { useEffect, useState } from "react";
import { useInviteConfig } from "@/context/InviteConfigContext";

type Props = {
  onDone: () => void;
};

export function AcceptanceLoader({ onDone }: Props) {
  const { fun } = useInviteConfig();
  const messages = fun.loadingMessages;
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, 700);

    const progInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 120);

    const doneTimer = setTimeout(onDone, messages.length * 700 + 400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      clearTimeout(doneTimer);
    };
  }, [messages.length, onDone]);

  return (
    <div className="success-enter flex min-h-screen flex-col items-center justify-center px-6">
      <div className="glass-card w-full max-w-md p-8 text-center sm:p-10">
        <p className="mb-4 text-5xl loader-bounce">💖</p>
        <h2 className="mb-2 font-serif text-2xl font-bold text-rose-800">
          Processando o sim...
        </h2>
        <p className="mb-6 h-6 text-sm text-rose-500 transition-all">
          {messages[index]}
        </p>

        <div className="h-3 overflow-hidden rounded-full bg-rose-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-xs text-rose-300">
          Não feche essa janela do coração
        </p>
      </div>
    </div>
  );
}
