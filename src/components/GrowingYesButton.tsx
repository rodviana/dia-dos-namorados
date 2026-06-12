"use client";

import { useInviteConfig } from "@/context/InviteConfigContext";

type Props = {
  scale: number;
  onClick: () => void;
};

export function GrowingYesButton({ scale, onClick }: Props) {
  const { fun } = useInviteConfig();
  const labels = fun.yesLabels;
  const labelIndex = Math.min(scale, labels.length - 1);
  const fontSize = Math.min(1 + scale * 0.08, 1.6);

  return (
    <button
      type="button"
      className="yes-btn shrink-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-rose-300/50 transition-all duration-300 hover:from-rose-600 hover:to-pink-600 hover:shadow-xl sm:px-10 sm:py-4"
      style={{
        transform: `scale(${1 + scale * 0.12})`,
        fontSize: `${fontSize}rem`,
      }}
      onClick={onClick}
    >
      {labels[labelIndex]}
    </button>
  );
}
