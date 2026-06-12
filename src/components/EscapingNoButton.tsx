"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { inviteConfig } from "@/config/inviteConfig";
import { FloatingTaunt } from "./FloatingTaunt";
import { PixFineModal } from "./PixFineModal";

type Props = {
  onEscape: () => void;
  onCaught: (totalDebt: number) => void;
  onFunEvent?: (type: "taunt" | "caught") => void;
  message: string;
  escapeCount: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getFleeSettings(fleeIndex: number) {
  return {
    radius: 90 + fleeIndex * 8,
    distance: 28 + fleeIndex * 14,
    maxDistance: Math.min(55 + fleeIndex * 18, 130),
    zoneRadius: 130 + fleeIndex * 40,
    jitter: 8 + fleeIndex * 4,
    cooldown: 220,
  };
}

export function EscapingNoButton({
  onEscape,
  onCaught,
  onFunEvent,
  message,
  escapeCount,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const fleeingRef = useRef(false);
  const tauntCooldown = useRef(false);
  const caughtCountRef = useRef(0);
  const totalDebtRef = useRef(0);
  const positionRef = useRef({ x: 0, y: 0 });
  const fleeCountRef = useRef(0);
  const anchorRef = useRef<{ x: number; y: number } | null>(null);

  const [isLoose, setIsLoose] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const [taunt, setTaunt] = useState<{ msg: string; x: number; y: number } | null>(
    null
  );
  const [activeFine, setActiveFine] = useState<
    (typeof inviteConfig.noFines)[number] | null
  >(null);
  const [fineAttempt, setFineAttempt] = useState(0);

  const showTaunt = useCallback(
    (x: number, y: number) => {
      if (tauntCooldown.current) return;
      tauntCooldown.current = true;

      const taunts = inviteConfig.fun.taunts;
      const msg = taunts[Math.floor(Math.random() * taunts.length)];
      setTaunt({ msg, x, y });
      onFunEvent?.("taunt");

      setTimeout(() => {
        setTaunt(null);
        tauntCooldown.current = false;
      }, 1400);
    },
    [onFunEvent]
  );

  const fleeFrom = useCallback(
    (fromX: number, fromY: number, triggerEscape = true) => {
      if (fleeingRef.current) return;

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const btnW = rect.width;
      const btnH = rect.height;
      const padding = 12;

      const fleeIndex = fleeCountRef.current;
      const settings = getFleeSettings(fleeIndex);

      const currentX = isLoose ? positionRef.current.x : rect.left;
      const currentY = isLoose ? positionRef.current.y : rect.top;
      const centerX = currentX + btnW / 2;
      const centerY = currentY + btnH / 2;

      if (!isLoose) {
        setIsLoose(true);
        positionRef.current = { x: currentX, y: currentY };
        anchorRef.current = { x: centerX, y: centerY };
      }

      let dx = centerX - fromX;
      let dy = centerY - fromY;
      const dist = Math.hypot(dx, dy) || 1;

      const step = Math.min(settings.distance, settings.maxDistance);
      dx = (dx / dist) * step;
      dy = (dy / dist) * step;

      const jitterX = (Math.random() - 0.5) * settings.jitter;
      const jitterY = (Math.random() - 0.5) * settings.jitter;

      let newCenterX = centerX + dx + jitterX;
      let newCenterY = centerY + dy + jitterY;

      const anchor = anchorRef.current;
      if (anchor) {
        const maxZone = Math.min(
          settings.zoneRadius,
          Math.min(window.innerWidth, window.innerHeight) * 0.42
        );
        const adx = newCenterX - anchor.x;
        const ady = newCenterY - anchor.y;
        const adist = Math.hypot(adx, ady);
        if (adist > maxZone) {
          const scale = maxZone / adist;
          newCenterX = anchor.x + adx * scale;
          newCenterY = anchor.y + ady * scale;
        }
      }

      const newX = clamp(
        newCenterX - btnW / 2,
        padding,
        window.innerWidth - btnW - padding
      );
      const newY = clamp(
        newCenterY - btnH / 2,
        padding,
        window.innerHeight - btnH - padding
      );

      positionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });

      if (triggerEscape) {
        fleeingRef.current = true;
        fleeCountRef.current += 1;
        onEscape();
        showTaunt(fromX, fromY);
        setTimeout(() => {
          fleeingRef.current = false;
        }, settings.cooldown);
      }
    },
    [isLoose, onEscape, showTaunt]
  );

  const handleCaught = useCallback(() => {
    const fineIndex = Math.min(
      caughtCountRef.current,
      inviteConfig.noFines.length - 1
    );
    const fine = inviteConfig.noFines[fineIndex];

    caughtCountRef.current += 1;
    totalDebtRef.current += fine.amount;

    setIsShaking(true);
    setFineAttempt(caughtCountRef.current);
    setActiveFine(fine);
    onCaught(totalDebtRef.current);
    onFunEvent?.("caught");

    setTimeout(() => setIsShaking(false), 500);
  }, [onCaught, onFunEvent]);

  useEffect(() => {
    const trackMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const wrapper = wrapperRef.current;
      if (!wrapper || fleeingRef.current) return;

      const rect = wrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - cx, e.clientY - cy);
      const fleeIndex = fleeCountRef.current;
      const { radius } = getFleeSettings(fleeIndex);

      if (distance < radius) {
        fleeFrom(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", trackMouse);
    return () => window.removeEventListener("mousemove", trackMouse);
  }, [fleeFrom]);

  const handlePointerNear = () => {
    fleeFrom(mouseRef.current.x, mouseRef.current.y);
  };

  const closeFine = () => {
    setActiveFine(null);
    fleeFrom(mouseRef.current.x, mouseRef.current.y, false);
  };

  const shrink = Math.max(0.7, 1 - escapeCount * 0.03);
  const rotate =
    (escapeCount % 2 === 0 ? 1 : -1) * Math.min(escapeCount * 2, 10);

  const wrapperStyle = isLoose
    ? {
        position: "fixed" as const,
        left: position.x,
        top: position.y,
        zIndex: 50,
        transition: "left 0.22s ease-out, top 0.22s ease-out",
      }
    : undefined;

  return (
    <>
      <div ref={wrapperRef} style={wrapperStyle}>
        <button
          type="button"
          className={`no-btn shrink-0 rounded-full border-2 border-rose-200 bg-white/90 px-6 py-3 text-sm font-medium text-rose-500 shadow-md backdrop-blur-sm transition-[transform,box-shadow] duration-150 sm:px-8 sm:py-3.5 sm:text-base ${
            isShaking ? "no-btn-shake" : ""
          } ${isLoose ? "no-btn-loose" : ""}`}
          style={{
            transform: `scale(${shrink}) rotate(${rotate}deg)`,
          }}
          onMouseEnter={handlePointerNear}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            fleeFrom(touch.clientX, touch.clientY);
          }}
          onClick={(e) => {
            e.preventDefault();
            handleCaught();
          }}
        >
          {message}
        </button>
      </div>

      {taunt && <FloatingTaunt message={taunt.msg} x={taunt.x} y={taunt.y} />}

      {activeFine && (
        <PixFineModal
          fine={activeFine}
          attempt={fineAttempt}
          totalDebt={totalDebtRef.current}
          onClose={closeFine}
        />
      )}
    </>
  );
}
