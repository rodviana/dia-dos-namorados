"use client";

type Props = {
  message: string;
  x: number;
  y: number;
};

export function FloatingTaunt({ message, x, y }: Props) {
  return (
    <div
      className="taunt-pop pointer-events-none fixed z-[60] whitespace-nowrap rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
      style={{ left: x, top: y - 40 }}
    >
      {message}
    </div>
  );
}
