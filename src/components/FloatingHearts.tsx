"use client";

import { useState } from "react";
import { useInviteConfig } from "@/context/InviteConfigContext";

const HEARTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 95}%`,
  delay: `${(i * 0.7) % 8}s`,
  duration: `${6 + (i % 5)}s`,
  size: 12 + (i % 4) * 6,
  opacity: 0.15 + (i % 3) * 0.1,
}));

type Props = {
  onHeartClick?: () => void;
};

export function FloatingHearts({ onHeartClick }: Props) {
  const [pop, setPop] = useState<{ id: number; msg: string; x: number; y: number } | null>(
    null
  );
  const { fun } = useInviteConfig();
  const messages = fun.heartClicks;

  const handleClick = (e: React.MouseEvent, id: number) => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setPop({ id, msg, x: e.clientX, y: e.clientY });
    onHeartClick?.();
    setTimeout(() => setPop(null), 1200);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {HEARTS.map((heart) => (
        <button
          key={heart.id}
          type="button"
          className="heart-float heart-clickable absolute cursor-pointer text-rose-400 transition hover:scale-150 hover:text-rose-500"
          style={{
            left: heart.left,
            bottom: "-40px",
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
          onClick={(e) => handleClick(e, heart.id)}
          aria-label="Coração"
        >
          ♥
        </button>
      ))}

      {pop && (
        <span
          className="heart-pop pointer-events-none fixed z-50 rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-600 shadow-lg"
          style={{ left: pop.x, top: pop.y - 30, transform: "translateX(-50%)" }}
        >
          {pop.msg}
        </span>
      )}
    </div>
  );
}
