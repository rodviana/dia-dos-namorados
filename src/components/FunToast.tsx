"use client";

import { useEffect } from "react";

type Props = {
  message: string;
  onDismiss: () => void;
};

export function FunToast({ message, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3200);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="fun-toast-enter fixed bottom-6 right-4 z-[90] max-w-xs sm:right-6">
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-white px-4 py-3 shadow-xl shadow-rose-900/10">
        <span className="text-lg">⚠️</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
            Sistema
          </p>
          <p className="text-sm font-medium text-rose-800">{message}</p>
        </div>
      </div>
    </div>
  );
}
