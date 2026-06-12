"use client";

import { useState } from "react";
import { FloatingHearts } from "./FloatingHearts";
import { InvitationCard } from "./InvitationCard";

export function InviteExperience() {
  const [heartClicks, setHeartClicks] = useState(0);

  return (
    <main className="romantic-bg relative min-h-screen overflow-hidden">
      <FloatingHearts onHeartClick={() => setHeartClicks((c) => c + 1)} />
      <InvitationCard heartClicks={heartClicks} />
    </main>
  );
}
