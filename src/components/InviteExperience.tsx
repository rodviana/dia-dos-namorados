"use client";

import { useState } from "react";
import { FloatingHearts } from "./FloatingHearts";
import { InvitationCard } from "./InvitationCard";
import { MusicPlayer } from "./MusicPlayer";
import { MusicWelcomeGate } from "./MusicWelcomeGate";

export function InviteExperience() {
  const [heartClicks, setHeartClicks] = useState(0);
  const [musicAccepted, setMusicAccepted] = useState(false);

  return (
    <main className="romantic-bg relative min-h-screen overflow-hidden">
      {!musicAccepted && (
        <MusicWelcomeGate onAccept={() => setMusicAccepted(true)} />
      )}

      {musicAccepted && (
        <>
          <FloatingHearts onHeartClick={() => setHeartClicks((c) => c + 1)} />
          <InvitationCard heartClicks={heartClicks} />
        </>
      )}

      <MusicPlayer active={musicAccepted} />
    </main>
  );
}
