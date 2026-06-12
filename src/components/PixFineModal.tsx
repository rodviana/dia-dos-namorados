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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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

      <div className="fine-modal-enter relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl shadow-rose-900/20">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
            Notificação oficial
          </p>
          <h2 id="fine-title" className="font-serif text-2xl font-bold">
            {fine.title}
          </h2>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-rose-700/90">
            {fine.message}
          </p>

          <div className="rounded-xl border-2 border-dashed border-rose-200 bg-rose-50 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-rose-400">
              Valor desta multa
            </p>
            <p className="font-serif text-4xl font-bold text-rose-600">
              R$ {fine.amount.toFixed(2).replace(".", ",")}
            </p>
            {attempt > 1 && (
              <p className="mt-2 text-xs text-rose-500">
                Dívida acumulada:{" "}
                <strong>R$ {totalDebt.toFixed(2).replace(".", ",")}</strong>
              </p>
            )}
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-1 text-xs font-medium text-gray-500">
              Pague via PIX ({pix.label})
            </p>
            <p className="break-all font-mono text-sm font-semibold text-gray-800">
              {"displayKey" in pix && pix.displayKey ? pix.displayKey : pix.key}
            </p>
            <p className="mt-1 text-xs text-gray-500">{pix.holderName}</p>
          </div>

          <button
            type="button"
            onClick={copyPix}
            className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600"
          >
            {copied ? "PIX copiado! Cola no app 💚" : "Copiar chave PIX"}
          </button>

          <p className="text-center text-xs text-rose-400/80">
            Ou clique em <strong>Sim</strong> e a dívida some de graça 😉
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
          >
            Ok, o botão pode fugir de novo
          </button>
        </div>
      </div>
    </div>
  );
}
