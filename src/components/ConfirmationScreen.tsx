"use client";

import { useEffect, useMemo, useState } from "react";
import { inviteConfig, type DatePlan } from "@/config/inviteConfig";
import { Confetti } from "./Confetti";

type Props = {
  plan: DatePlan;
  stats?: {
    escapeCount: number;
    totalDebt: number;
    heartClicks: number;
  };
};

function buildSummary(plan: DatePlan) {
  const { guestName, yourName } = inviteConfig;
  const placeDisplay = plan.customPlace
    ? `${plan.placeName}: ${plan.customPlace}`
    : plan.placeName;

  const lines = [
    `💌 Convite confirmado!`,
    ``,
    `${guestName} aceitou sair com ${yourName}!`,
    ``,
    `📅 Data: ${plan.dateLabel}`,
    `🕐 Horário: ${plan.time}`,
    `📍 Local: ${placeDisplay}`,
  ];

  if (plan.note) lines.push(`💬 Obs: ${plan.note}`);

  return lines.join("\n");
}

export function ConfirmationScreen({ plan, stats }: Props) {
  const { guestName, yourName, confirmationMessage, contact } = inviteConfig;
  const [copied, setCopied] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  const placeDisplay = plan.customPlace
    ? `${plan.placeName}: ${plan.customPlace}`
    : plan.placeName;

  const achievement = getAchievement(stats);
  const summary = useMemo(() => buildSummary(plan), [plan]);

  const whatsappNumber = contact.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`;

  useEffect(() => {
    if (!contact.whatsapp || whatsappOpened) return;

    const timer = setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setWhatsappOpened(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [contact.whatsapp, whatsappOpened, whatsappUrl]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="success-enter flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Confetti />

      <div className="glass-card success-card relative z-10 w-full max-w-md p-8 sm:p-10">
        <p className="mb-2 text-5xl">🎉</p>
        <h2 className="mb-2 font-serif text-3xl font-bold text-rose-700">
          Encontro confirmado!
        </h2>
        <p className="mb-4 text-rose-600/90">
          {guestName}, nos vemos em breve. — {yourName}
        </p>

        {whatsappOpened && (
          <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Abrindo WhatsApp para enviar o resumo...
          </p>
        )}

        {achievement && (
          <p className="mb-6 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            {achievement}
          </p>
        )}

        <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/80 p-6 text-left">
          <DetailRow icon="📅" label="Data" value={plan.dateLabel} />
          <DetailRow icon="🕐" label="Horário" value={plan.time} />
          <DetailRow icon="📍" label="Local" value={placeDisplay} />
          {plan.note && (
            <DetailRow icon="💬" label="Observação" value={plan.note} />
          )}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-rose-500/80">
          {confirmationMessage}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            {contact.label}
          </a>

          <button
            type="button"
            onClick={copySummary}
            className="w-full rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            {copied ? "Resumo copiado!" : "Copiar resumo do encontro"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getAchievement(
  stats?: { escapeCount: number; totalDebt: number; heartClicks: number }
) {
  if (!stats) return null;
  if (stats.totalDebt > 20)
    return "🏆 Conquista: Clicou no Não até ficar endividado(a)";
  if (stats.escapeCount > 10)
    return "🏆 Conquista: Perseguidor(a) profissional do botão";
  if (stats.heartClicks > 5)
    return "🏆 Conquista: Caçador(a) de corações";
  if (stats.escapeCount === 0)
    return "🏆 Conquista: Disse sim de primeira — lenda!";
  return null;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-rose-400">
          {label}
        </p>
        <p className="font-medium text-rose-800">{value}</p>
      </div>
    </div>
  );
}
