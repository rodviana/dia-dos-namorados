"use client";

import { useState } from "react";
import { inviteConfig, type DatePlan } from "@/config/inviteConfig";
import { PlaceRoulette } from "./PlaceRoulette";

type Props = {
  onConfirm: (plan: DatePlan) => void;
};

const STEPS = [
  { id: 1, label: "Data", icon: "📅" },
  { id: 2, label: "Horário", icon: "🕐" },
  { id: 3, label: "Local", icon: "📍" },
  { id: 4, label: "Revisão", icon: "✅" },
] as const;

export function DatePlanningForm({ onConfirm }: Props) {
  const { guestName, yourName, dateOptions, timeOptions, placeOptions } =
    inviteConfig;

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [dateId, setDateId] = useState(dateOptions[0]?.id ?? "");
  const [time, setTime] = useState(timeOptions[2] ?? timeOptions[0] ?? "");
  const [placeId, setPlaceId] = useState(placeOptions[0]?.id ?? "");
  const [customPlace, setCustomPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const selectedDate = dateOptions.find((d) => d.id === dateId);
  const selectedPlace = placeOptions.find((p) => p.id === placeId);
  const needsCustomPlace = selectedPlace?.allowCustom;

  const goNext = () => {
    setError("");

    if (step === 1 && !dateId) {
      setError("Escolha uma data para continuar.");
      return;
    }
    if (step === 2 && !time) {
      setError("Escolha um horário para continuar.");
      return;
    }
    if (step === 3) {
      if (!placeId) {
        setError("Escolha um local para continuar.");
        return;
      }
      if (needsCustomPlace && !customPlace.trim()) {
        setError("Conta qual lugar você tem em mente!");
        return;
      }
    }

    setDirection("forward");
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError("");
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedPlace) return;

    onConfirm({
      dateLabel: selectedDate.label,
      time,
      placeName: selectedPlace.name,
      customPlace: needsCustomPlace ? customPlace.trim() : undefined,
      note: note.trim() || undefined,
    });
  };

  const placeDisplay =
    needsCustomPlace && customPlace.trim()
      ? `${selectedPlace?.name}: ${customPlace.trim()}`
      : (selectedPlace?.name ?? "");

  return (
    <div className="success-enter flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="glass-card card-enter w-full max-w-xl p-6 sm:p-10">
        <header className="mb-8 border-b border-rose-100 pb-6 text-center">
          <p className="mb-2 text-4xl">{STEPS[step - 1].icon}</p>
          <h2 className="font-serif text-2xl font-bold text-rose-800 sm:text-3xl">
            {step === 1 && "Qual dia funciona?"}
            {step === 2 && "Que horas?"}
            {step === 3 && "Onde vamos?"}
            {step === 4 && "Tudo certo?"}
          </h2>
          <p className="mt-2 text-sm text-rose-500/90">
            {guestName}, etapa {step} de {STEPS.length}
          </p>
        </header>

        <StepIndicator current={step} />

        <div
          key={step}
          className={`step-content text-left ${direction === "forward" ? "step-forward" : "step-back"}`}
        >
          {step === 1 && (
            <fieldset>
              <legend className="sr-only">Escolha a data</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {dateOptions.map((option) => (
                  <OptionCard
                    key={option.id}
                    selected={dateId === option.id}
                    onSelect={() => {
                      setDateId(option.id);
                      setError("");
                    }}
                  >
                    <span className="text-sm font-medium text-rose-800">
                      {option.label}
                    </span>
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="sr-only">Escolha o horário</legend>
              {selectedDate && (
                <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2 text-center text-sm text-rose-600">
                  Data escolhida: <strong>{selectedDate.label}</strong>
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                {timeOptions.map((option) => (
                  <OptionCard
                    key={option}
                    selected={time === option}
                    onSelect={() => {
                      setTime(option);
                      setError("");
                    }}
                    rounded="full"
                    className="px-5 py-2.5"
                  >
                    <span className="text-sm font-medium text-rose-800">
                      {option}
                    </span>
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend className="sr-only">Escolha o local</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {placeOptions.map((place) => (
                  <OptionCard
                    key={place.id}
                    selected={placeId === place.id}
                    onSelect={() => {
                      setPlaceId(place.id);
                      setError("");
                    }}
                    className="p-4"
                  >
                    <span className="mb-1 block text-xl">{place.icon}</span>
                    <span className="block text-sm font-semibold text-rose-800">
                      {place.name}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-rose-500">
                      {place.description}
                    </span>
                  </OptionCard>
                ))}
              </div>

              {needsCustomPlace && (
                <input
                  type="text"
                  value={customPlace}
                  onChange={(e) => {
                    setCustomPlace(e.target.value);
                    setError("");
                  }}
                  placeholder="Qual lugar você sugere?"
                  className="mt-4 w-full rounded-xl border border-rose-200 bg-white/80 px-4 py-3 text-sm text-rose-800 placeholder:text-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              )}

              <PlaceRoulette
                onSelect={(id) => {
                  setPlaceId(id);
                  setError("");
                }}
              />
            </fieldset>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-3 rounded-2xl border border-rose-100 bg-rose-50/80 p-5">
                <ReviewRow label="Data" value={selectedDate?.label ?? ""} />
                <ReviewRow label="Horário" value={time} />
                <ReviewRow label="Local" value={placeDisplay} />
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-rose-400"
                >
                  Observação (opcional)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Alguma preferência? Restrição alimentar, filme que quer ver..."
                  className="w-full resize-none rounded-xl border border-rose-200 bg-white/80 px-4 py-3 text-sm text-rose-800 placeholder:text-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-rose-600">{error}</p>
        )}

        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 rounded-full border border-rose-200 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
            >
              Voltar
            </button>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-3 font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:from-rose-600 hover:to-pink-600"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-3 font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:from-rose-600 hover:to-pink-600"
            >
              Confirmar com {yourName}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-1">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;

        return (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  active
                    ? "bg-rose-500 text-white shadow-md shadow-rose-300/50"
                    : done
                      ? "bg-rose-200 text-rose-700"
                      : "bg-rose-100 text-rose-300"
                }`}
              >
                {done ? "✓" : s.id}
              </div>
              <span
                className={`hidden text-[10px] font-medium uppercase tracking-wide sm:block ${
                  active ? "text-rose-600" : "text-rose-300"
                }`}
              >
                {s.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`mb-4 h-0.5 flex-1 transition ${
                  current > s.id ? "bg-rose-300" : "bg-rose-100"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OptionCard({
  selected,
  onSelect,
  children,
  rounded = "xl",
  className = "px-4 py-3",
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  rounded?: "xl" | "full";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`option-card w-full cursor-pointer border-2 text-left transition ${
        rounded === "full" ? "rounded-full" : "rounded-xl"
      } ${className} ${
        selected
          ? "border-rose-400 bg-rose-50 shadow-sm"
          : "border-rose-100 bg-white/60 hover:border-rose-200"
      }`}
    >
      {children}
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-rose-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wider text-rose-400">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-rose-800">
        {value}
      </span>
    </div>
  );
}
