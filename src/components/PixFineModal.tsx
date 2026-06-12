"use client";

import { useEffect, useState } from "react";
import { inviteConfig } from "@/config/inviteConfig";

type Fine = (typeof inviteConfig.noFines)[number];

type Props = {
  fine: Fine;
  attempt: number;
  totalDebt: number;
  onClose: () => void;
};

export function PixFineModal({ fine, attempt, totalDebt, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const { pix } = inviteConfig;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(pix.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal
      aria-labelledby="fine-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-rose-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />

      <div className="fine-modal-enter relative z-10 flex max-h-[min(92dvh,640px)] w-full max-w-sm flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl shadow-rose-900/20 sm:max-h-[90dvh] sm:rounded-2xl">
        <div className="shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 text-white sm:px-5 sm:py-4">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/40 sm:hidden" />
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-90 sm:text-xs">
            Notificação oficial
          </p>
          <h2 id="fine-title" className="font-serif text-lg font-bold sm:text-2xl">
            {fine.title}
          </h2>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:space-y-4 sm:p-5">
          <p className="text-xs leading-relaxed text-rose-700/90 sm:text-sm">
            {fine.message}
          </p>

          <div className="rounded-xl border-2 border-dashed border-rose-200 bg-rose-50 p-3 text-center sm:p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-rose-400 sm:text-xs">
              Valor desta multa
            </p>
            <p className="font-serif text-2xl font-bold text-rose-600 sm:text-4xl">
              R$ {fine.amount.toFixed(2).replace(".", ",")}
            </p>
            {attempt > 1 && (
              <p className="mt-1 text-[11px] text-rose-500 sm:mt-2 sm:text-xs">
                Dívida acumulada:{" "}
                <strong>R$ {totalDebt.toFixed(2).replace(".", ",")}</strong>
              </p>
            )}
          </div>

          <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
            <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
              Pague via PIX ({pix.label})
            </p>
            <p className="break-all font-mono text-xs font-semibold text-gray-800 sm:text-sm">
              {"displayKey" in pix && pix.displayKey ? pix.displayKey : pix.key}
            </p>
            <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
              {pix.holderName}
            </p>
          </div>

          <button
            type="button"
            onClick={copyPix}
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 sm:py-3"
          >
            {copied ? "PIX copiado! Cola no app 💚" : "Copiar chave PIX"}
          </button>

          <p className="text-center text-[11px] text-rose-400/80 sm:text-xs">
            Ou clique em <strong>Sim</strong> e a dívida some de graça 😉
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-rose-200 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-50 sm:py-2.5"
          >
            Ok, o botão pode fugir de novo
          </button>
        </div>
      </div>
    </div>
  );
}
