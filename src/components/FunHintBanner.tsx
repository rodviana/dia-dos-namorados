"use client";

type Variant = "fun" | "alert" | "epic";

type Props = {
  message: string;
  variant?: Variant;
};

const VARIANTS: Record<
  Variant,
  { emoji: string; bg: string; border: string; text: string; label: string }
> = {
  fun: {
    emoji: "👀",
    bg: "bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100",
    border: "border-rose-300",
    text: "text-rose-800",
    label: "Dica da brincadeira",
  },
  alert: {
    emoji: "😈",
    bg: "bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100",
    border: "border-amber-400",
    text: "text-amber-900",
    label: "Atenção!",
  },
  epic: {
    emoji: "💸",
    bg: "bg-gradient-to-r from-red-100 via-rose-100 to-red-100",
    border: "border-red-400",
    text: "text-red-900",
    label: "Multa aplicada",
  },
};

function detectVariant(message: string): Variant {
  if (message.includes("R$") || message.includes("Dívida")) {
    return "epic";
  }
  if (message.includes("PIX") || message.includes("multa") || message.includes("😈")) {
    return "alert";
  }
  return "fun";
}

export function FunHintBanner({ message, variant }: Props) {
  const v = VARIANTS[variant ?? detectVariant(message)];

  return (
    <div
      key={message}
      className={`fun-hint-enter fun-hint-pulse mb-6 rounded-2xl border-2 ${v.border} ${v.bg} p-4 shadow-lg shadow-rose-300/30 sm:p-5`}
      role="status"
      aria-live="polite"
    >
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-rose-500">
        ✦ {v.label} ✦
      </p>
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
        <span className="fun-hint-emoji text-4xl sm:text-5xl">{v.emoji}</span>
        <p
          className={`max-w-sm text-center font-bold leading-snug ${v.text} text-lg sm:text-xl`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
