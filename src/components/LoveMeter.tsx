"use client";

type Props = {
  value: number;
};

export function LoveMeter({ value }: Props) {
  const clamped = Math.min(100, Math.max(0, value));

  const label =
    clamped < 20
      ? "Começando..."
      : clamped < 40
        ? "Tá esquentando"
        : clamped < 60
          ? "Quase convencido(a)"
          : clamped < 80
            ? "Difícil resistir"
            : clamped < 100
              ? "Quase lá!"
              : "100% conquistado(a)!";

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-rose-400">Nível de convencimento</span>
        <span className="font-bold text-rose-600">{clamped}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-rose-100">
        <div
          className="love-meter-fill h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-1 text-center text-[11px] text-rose-400/80">{label}</p>
    </div>
  );
}
