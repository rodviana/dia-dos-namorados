"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInviteConfig } from "@/context/InviteConfigContext";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  unMute: () => void;
  getPlayerState: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoading: Promise<void> | null = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!apiLoading) {
    apiLoading = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };

      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const check = setInterval(() => {
          if (window.YT?.Player) {
            clearInterval(check);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    });
  }

  return apiLoading;
}

type Props = {
  active: boolean;
};

export function MusicPlayer({ active }: Props) {
  const { music } = useInviteConfig();
  const playerRef = useRef<YTPlayer | null>(null);
  const initRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const initPlayer = useCallback(async () => {
    if (!active || initRef.current) return;

    await loadYouTubeApi();
    if (!window.YT?.Player) return;

    const el = document.getElementById("youtube-music-player");
    if (!el) return;

    initRef.current = true;

    playerRef.current = new window.YT.Player("youtube-music-player", {
      videoId: music.youtubeId,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        mute: 0,
        loop: 1,
        playlist: music.youtubeId,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (e) => {
          e.target.unMute();
          e.target.playVideo();
          setPlaying(true);
          setPlayerReady(true);
        },
        onStateChange: (e) => {
          if (!window.YT) return;
          if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
          if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
        },
      },
    });
  }, [active, music.youtubeId]);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => initPlayer(), 100);

    return () => {
      clearTimeout(timer);
      playerRef.current?.destroy();
      playerRef.current = null;
      initRef.current = false;
      setPlayerReady(false);
    };
  }, [active, initPlayer]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player || !window.YT) return;

    const state = player.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  if (!active) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 w-[min(calc(100vw-1.5rem),340px)] pb-[env(safe-area-inset-bottom)] sm:bottom-4 sm:right-4">
      {/* Container do YouTube — sempre no DOM */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded
            ? "music-panel-enter mb-3 rounded-2xl border border-rose-200 bg-black shadow-xl"
            : "mb-0 h-0 w-0 overflow-hidden opacity-0"
        }`}
      >
        {expanded && (
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 text-white">
            <p className="text-xs font-medium opacity-90">Tocando agora</p>
            <p className="font-semibold">{music.title}</p>
            <p className="text-xs opacity-90">{music.artists}</p>
          </div>
        )}

        <div className={expanded ? "aspect-video w-full" : "h-[1px] w-[1px]"}>
          <div id="youtube-music-player" className="h-full w-full" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          disabled={!playerReady}
          className="rounded-full bg-white/95 px-3 py-3 text-rose-600 shadow-lg backdrop-blur-sm disabled:opacity-50"
          aria-label={expanded ? "Minimizar player" : "Ver vídeo"}
        >
          {expanded ? "▼" : "▲"}
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className={`music-btn flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition ${
            playing
              ? "bg-rose-500 text-white shadow-rose-400/50"
              : "bg-white/95 text-rose-700 shadow-rose-200/60 backdrop-blur-sm"
          }`}
          aria-label={playing ? "Pausar música" : "Tocar música"}
        >
          <span className="text-xl">{playing ? "⏸️" : "▶️"}</span>
          <span className="text-sm font-semibold">
            {playing ? "Pausar" : "Tocar"}
          </span>
        </button>
      </div>
    </div>
  );
}
