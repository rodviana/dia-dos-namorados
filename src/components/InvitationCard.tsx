"use client";

import { useCallback, useState } from "react";
import { inviteConfig, type DatePlan } from "@/config/inviteConfig";
import { AcceptanceLoader } from "./AcceptanceLoader";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { DatePlanningForm } from "./DatePlanningForm";
import { EscapingNoButton } from "./EscapingNoButton";
import { FunHintBanner } from "./FunHintBanner";
import { FunToast } from "./FunToast";
import { GrowingYesButton } from "./GrowingYesButton";
import { LoveMeter } from "./LoveMeter";
import { TypewriterText } from "./TypewriterText";

type Phase = "invite" | "loading" | "planning" | "confirmed";

type Props = {
  heartClicks?: number;
};

export function InvitationCard({ heartClicks = 0 }: Props) {
  const { guestName, yourName, title, invitation, noButtonMessages, fun } =
    inviteConfig;
  const [phase, setPhase] = useState<Phase>("invite");
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [escapeCount, setEscapeCount] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [hint, setHint] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const loveLevel = Math.min(
    100,
    10 + escapeCount * 6 + Math.floor(totalDebt / 3) + heartClicks * 4
  );

  const showRandomToast = useCallback(() => {
    const msg = fun.errorToasts[Math.floor(Math.random() * fun.errorToasts.length)];
    setToast(msg);
  }, [fun.errorToasts]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  if (phase === "loading") {
    return <AcceptanceLoader onDone={() => setPhase("planning")} />;
  }

  if (phase === "planning") {
    return (
      <DatePlanningForm
        onConfirm={(selected) => {
          setPlan(selected);
          setPhase("confirmed");
        }}
      />
    );
  }

  if (phase === "confirmed" && plan) {
    return (
      <ConfirmationScreen
        plan={plan}
        stats={{ escapeCount, totalDebt, heartClicks }}
      />
    );
  }

  const noMessage = noButtonMessages[escapeCount % noButtonMessages.length];

  const handleEscape = () => {
    setEscapeCount((c) => {
      const next = c + 1;
      const hints = fun.escapeHints as Record<number, string>;
      const exact = hints[next];
      if (exact) {
        setHint(exact);
      } else {
        const milestone = Object.keys(hints)
          .map(Number)
          .filter((n) => n <= next)
          .sort((a, b) => b - a)[0];
        if (milestone && next > milestone) {
          setHint(hints[milestone]);
        }
      }
      return next;
    });

    if (escapeCount > 0 && escapeCount % 3 === 0) {
      showRandomToast();
    }
  };

  const formatDebt = (debt: number) =>
    debt.toFixed(2).replace(".", ",");

  const handleDebtChange = (debt: number) => {
    setTotalDebt(debt);
    if (debt > 0 && escapeCount > 0) {
      setHint(
        `Dívida subindo... R$ ${formatDebt(debt)} só de perseguir o Não! 💸`
      );
    }
  };

  const handleCaught = (debt: number, auto?: boolean) => {
    setTotalDebt(debt);
    setHint(
      auto
        ? `Multa automática! R$ ${formatDebt(debt)} — parou de caçar o Não! 😤`
        : `R$ ${formatDebt(debt)} em multas! Paga o PIX ou clica no Sim 💸`
    );
    showRandomToast();
    triggerShake();
  };

  const handleFunEvent = (type: "taunt" | "caught" | "auto-fine") => {
    if (type === "caught" || type === "auto-fine") triggerShake();
  };

  return (
    <>
      <div
        className={`flex min-h-[100dvh] flex-col items-center justify-center px-3 py-6 pb-28 sm:px-4 sm:py-12 sm:pb-12 ${shake ? "screen-shake" : ""}`}
      >
        <div className="glass-card card-enter w-full max-w-lg p-5 sm:p-8 md:p-12">
          <div className="mb-6 border-b border-rose-100 pb-6 text-center">
            <p className="mb-3 text-4xl">💌</p>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
              {title}
            </p>
          </div>

          <div className="mb-6">
            <LoveMeter value={loveLevel} />
          </div>

          <div className="mb-8 space-y-4 text-center">
            <p className="text-sm text-rose-500">
              Prezado(a) <strong className="text-rose-700">{guestName}</strong>,
            </p>

            <p className="text-base leading-relaxed text-rose-600/90 sm:text-lg">
              <TypewriterText text={invitation} />
            </p>

            <p className="pt-2 font-serif text-lg italic text-rose-700">
              Aceita sair comigo?
            </p>
          </div>

          {hint && <FunHintBanner message={hint} />}

          <div className="relative flex min-h-[120px] min-w-full flex-wrap items-center justify-center gap-4 sm:min-h-[140px] sm:gap-6">
            <GrowingYesButton
              scale={escapeCount + Math.floor(totalDebt / 5)}
              onClick={() => setPhase("loading")}
            />
            <EscapingNoButton
              escapeCount={escapeCount}
              message={noMessage}
              onEscape={handleEscape}
              onDebtChange={handleDebtChange}
              onCaught={handleCaught}
              onFunEvent={handleFunEvent}
            />
          </div>

          <p className="mt-8 text-center text-xs text-rose-400/70">
            Com carinho,{" "}
            <span className="font-serif italic text-rose-600">{yourName}</span>
          </p>

          {totalDebt > 0 && (
            <p className="debt-badge mt-4 rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-center text-base font-bold text-red-700">
              🧾 Dívida atual: R$ {formatDebt(totalDebt)}
              <span className="mt-1 block text-xs font-normal text-red-500">
                +R$ {formatDebt(inviteConfig.stalking.feePerEscape)} a cada perseguição
              </span>
            </p>
          )}
        </div>
      </div>

      {toast && (
        <FunToast message={toast} onDismiss={() => setToast(null)} />
      )}
    </>
  );
}
