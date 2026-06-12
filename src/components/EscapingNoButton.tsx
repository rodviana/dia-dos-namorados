"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { inviteConfig } from "@/config/inviteConfig";
import { FloatingTaunt } from "./FloatingTaunt";
import { PixFineModal } from "./PixFineModal";

type Props = {
  onEscape: () => void;
  onCaught: (totalDebt: number, auto?: boolean) => void;
  onDebtChange?: (totalDebt: number) => void;
  onFunEvent?: (type: "taunt" | "caught" | "auto-fine") => void;
  message: string;
  escapeCount: number;
};

const GRACE_MS = 900;

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

function waitForLayout() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function EscapingNoButton({
  onEscape,
  onCaught,
  onDebtChange,
  onFunEvent,
  message,
  escapeCount,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const fleeingRef = useRef(false);
  const tauntCooldown = useRef(false);
  const modalOpenRef = useRef(false);
  const caughtCountRef = useRef(0);
  const autoFineCountRef = useRef(0);
  const totalDebtRef = useRef(0);
  const positionRef = useRef({ x: 0, y: 0 });
  const fleeCountRef = useRef(0);
  const anchorRef = useRef<{ x: number; y: number } | null>(null);
  const isLooseRef = useRef(false);
  const fleeEnabledRef = useRef(false);

  const { stalking, noFines } = inviteConfig;

  const [isLoose, setIsLoose] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isShaking, setIsShaking] = useState(false);
  const [fleeEnabled, setFleeEnabled] = useState(false);
  const [taunt, setTaunt] = useState<{ msg: string; x: number; y: number } | null>(
    null
  );
  const [activeFine, setActiveFine] = useState<{
    fine: (typeof noFines)[number];
    isAuto: boolean;
  } | null>(null);
  const [fineAttempt, setFineAttempt] = useState(0);

  useEffect(() => {
    isLooseRef.current = isLoose;
  }, [isLoose]);

  useEffect(() => {
    fleeEnabledRef.current = false;
    setFleeEnabled(false);

    const timer = setTimeout(async () => {
      await waitForLayout();
      fleeEnabledRef.current = true;
      setFleeEnabled(true);
    }, GRACE_MS);

    return () => clearTimeout(timer);
  }, []);

  const syncDebt = useCallback(
    (debt: number) => {
      totalDebtRef.current = debt;
      onDebtChange?.(debt);
    },
    [onDebtChange]
  );

  const showFineModal = useCallback(
    (fineIndex: number, isAuto: boolean) => {
      if (modalOpenRef.current) return;

      const fine = noFines[Math.min(fineIndex, noFines.length - 1)];
      const displayFine = isAuto
        ? {
            ...fine,
            message: `${fine.message} ${stalking.autoFineExtra}`,
            title: "Multa automática 📢",
          }
        : fine;

      modalOpenRef.current = true;
      totalDebtRef.current += fine.amount;
      syncDebt(totalDebtRef.current);

      if (isAuto) {
        autoFineCountRef.current += 1;
        setFineAttempt(autoFineCountRef.current);
      } else {
        caughtCountRef.current += 1;
        setFineAttempt(caughtCountRef.current);
      }

      setIsShaking(true);
      setActiveFine({ fine: displayFine, isAuto });
      onCaught(totalDebtRef.current, isAuto);
      onFunEvent?.(isAuto ? "auto-fine" : "caught");

      setTimeout(() => setIsShaking(false), 500);
    },
    [noFines, onCaught, onFunEvent, stalking.autoFineExtra, syncDebt]
  );

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
    async (fromX: number, fromY: number, triggerEscape = true) => {
      if (!fleeEnabledRef.current || fleeingRef.current) return;

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      await waitForLayout();

      const rect = wrapper.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;

      const btnW = rect.width;
      const btnH = rect.height;
      const padding = 12;

      const fleeIndex = fleeCountRef.current;
      const settings = getFleeSettings(fleeIndex);

      const currentX = isLooseRef.current ? positionRef.current.x : rect.left;
      const currentY = isLooseRef.current ? positionRef.current.y : rect.top;
      const centerX = currentX + btnW / 2;
      const centerY = currentY + btnH / 2;

      if (!isLooseRef.current) {
        anchorRef.current = { x: centerX, y: centerY };
        positionRef.current = { x: currentX, y: currentY };
        isLooseRef.current = true;
        setIsLoose(true);
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
        const currentFlee = fleeCountRef.current;

        totalDebtRef.current += stalking.feePerEscape;
        syncDebt(totalDebtRef.current);

        onEscape();
        showTaunt(fromX, fromY);

        if (
          currentFlee >= stalking.autoFineEvery &&
          currentFlee % stalking.autoFineEvery === 0
        ) {
          setTimeout(() => {
            showFineModal(autoFineCountRef.current, true);
          }, 300);
        }

        setTimeout(() => {
          fleeingRef.current = false;
        }, settings.cooldown);
      }
    },
    [
      onEscape,
      showFineModal,
      showTaunt,
      stalking.autoFineEvery,
      stalking.feePerEscape,
      syncDebt,
    ]
  );

  const handleCaught = useCallback(() => {
    showFineModal(caughtCountRef.current, false);
  }, [showFineModal]);

  useEffect(() => {
    if (!fleeEnabled) return;

    const trackMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const wrapper = wrapperRef.current;
      if (!wrapper || fleeingRef.current || modalOpenRef.current) return;

      const rect = wrapper.getBoundingClientRect();
      if (rect.width < 20) return;

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
  }, [fleeEnabled, fleeFrom]);

  const handlePointerNear = () => {
    if (fleeEnabledRef.current && !modalOpenRef.current) {
      fleeFrom(mouseRef.current.x, mouseRef.current.y);
    }
  };

  const closeFine = () => {
    modalOpenRef.current = false;
    setActiveFine(null);
    fleeFrom(mouseRef.current.x, mouseRef.current.y, false);
  };

  const shrink = Math.max(0.7, 1 - escapeCount * 0.03);
  const rotate =
    (escapeCount % 2 === 0 ? 1 : -1) * Math.min(escapeCount * 2, 10);

  const wrapperStyle =
    isLoose && position
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
      {/* Espaço reservado — evita o Sim pular quando o Não solta */}
      <div className="relative inline-flex min-h-[48px] min-w-[100px] items-center justify-center">
        {isLoose && (
          <span
            className="invisible rounded-full px-8 py-3.5 text-sm sm:px-10 sm:text-base"
            aria-hidden
          >
            {message}
          </span>
        )}

        <div
          ref={wrapperRef}
          className={isLoose ? "" : "relative"}
          style={wrapperStyle}
        >
          <button
            type="button"
            className={`no-btn shrink-0 rounded-full border-2 border-rose-200 bg-white/90 px-6 py-3 text-sm font-medium text-rose-500 shadow-md backdrop-blur-sm transition-[transform,box-shadow] duration-150 sm:px-8 sm:py-3.5 sm:text-base ${
              isShaking ? "no-btn-shake" : ""
            } ${isLoose ? "no-btn-loose" : ""} ${
              !fleeEnabled ? "opacity-100" : ""
            }`}
            style={{
              transform: `scale(${shrink}) rotate(${rotate}deg)`,
            }}
            onMouseEnter={handlePointerNear}
            onTouchStart={(e) => {
              e.preventDefault();
              if (fleeEnabledRef.current && !modalOpenRef.current) {
                const touch = e.touches[0];
                fleeFrom(touch.clientX, touch.clientY);
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              handleCaught();
            }}
          >
            {message}
          </button>
        </div>
      </div>

      {taunt && <FloatingTaunt message={taunt.msg} x={taunt.x} y={taunt.y} />}

      {activeFine && (
        <PixFineModal
          fine={activeFine.fine}
          attempt={fineAttempt}
          totalDebt={totalDebtRef.current}
          onClose={closeFine}
        />
      )}
    </>
  );
}
