import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";

interface EldenRingContextType {
  isEldenRing: boolean;
  toggleEldenRing: () => void;
  playSound: (soundType: "click" | "hover" | "toggle" | "tabOpen" | "tabClose" | "typing" | "enter" | "backspace" | "space" | "entering") => void;
  bgMusicEnabled: boolean;
  toggleBgMusic: () => void;
  currentTrack: string;
  setTrack: (track: string) => void;
  isDarkTheme: boolean;
}

const EldenRingContext = createContext<EldenRingContextType | undefined>(undefined);

const KEY = "qf-elden-ring-mode";
const MUSIC_KEY = "qf-elden-ring-music";
const CDN_BASE = "https://cdn.jsdelivr.net/gh/M1D0R1x/batch-quiz-hub@master/public";

export function getMediaUrl(relPath: string): string {
  const path = relPath.startsWith("/") ? relPath : `/${relPath}`;
  return `${CDN_BASE}${path}`;
}

export const TRACKS = [
  { id: "eldenringost", name: "Main Theme", src: getMediaUrl("/elden-ring-music/eldenringost.mp3") },
  { id: "leyndellost", name: "Leyndell, Royal Capital", src: getMediaUrl("/elden-ring-music/leyndellost.mp3") },
  { id: "limgraveost", name: "Limgrave Ambient", src: getMediaUrl("/elden-ring-music/limgraveost.mp3") },
  { id: "roundtableost", name: "Roundtable Hold", src: getMediaUrl("/elden-ring-music/roundtableost.mp3") },
  { id: "siofraost", name: "Siofra River", src: getMediaUrl("/elden-ring-music/siofraost.mp3") },
];

export function EldenRingProvider({ children }: { children: ReactNode }) {
  const [isEldenRing, setIsEldenRing] = useState<boolean>(false);
  const [bgMusicEnabled, setBgMusicEnabled] = useState<boolean>(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Detect dark / light theme on documentElement
  useEffect(() => {
    const updateThemeState = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkTheme(isDark);
    };

    updateThemeState();

    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Initialize state from localStorage
  useEffect(() => {
    const storedER = localStorage.getItem(KEY) === "true";
    const storedMusic = localStorage.getItem(MUSIC_KEY) !== "false"; // default true
    setIsEldenRing(storedER);
    setBgMusicEnabled(storedMusic);

    if (storedER) {
      document.documentElement.classList.add("elden-ring");
    }
  }, []);

  // Sync classes on <html> & keyboard sound events
  useEffect(() => {
    const root = document.documentElement;
    if (isEldenRing) {
      root.classList.add("elden-ring");
      if (isDarkTheme) {
        root.classList.add("elden-ring-ranni");
        root.classList.remove("elden-ring-godfrey");
      } else {
        root.classList.add("elden-ring-godfrey");
        root.classList.remove("elden-ring-ranni");
      }
    } else {
      root.classList.remove("elden-ring", "elden-ring-ranni", "elden-ring-godfrey");
    }

    if (!isEldenRing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't play if modifier keys are pressed alone
      if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) return;

      if (e.key === "Enter") {
        playSound("enter");
      } else if (e.key === "Backspace" || e.key === "Delete") {
        playSound("backspace");
      } else if (e.key === " ") {
        playSound("space");
      } else {
        playSound("typing");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEldenRing, isDarkTheme]);

  // Progressive Low-Priority Background Media Preloader & Caching
  useEffect(() => {
    if (!isEldenRing) return;

    const assetsToCache = [
      "/elden-ring-sounds/key1.mp3",
      "/elden-ring-sounds/option.mp3",
      "/elden-ring-sounds/entering.mp3",
      "/elden-ring-sounds/closetap.mp3",
      "/elden-ring-sounds/tyspace.mp3",
      "/elden-ring-sounds/tyback.mp3",
      "/elden-ring-music/limgraveost.mp3",
      "/elden-ring-music/roundtableost.mp3",
      "/elden-ring-wallpaper/ranni.webm",
      "/elden-ring-wallpaper/godfrey.webm",
    ];

    let cancelled = false;
    let index = 0;

    const cacheNext = async () => {
      if (cancelled || index >= assetsToCache.length) return;
      const asset = assetsToCache[index++];
      const url = getMediaUrl(asset);
      try {
        if ('caches' in window) {
          const cache = await caches.open('elden-ring-media-v1');
          const existing = await cache.match(url);
          if (!existing) {
            await cache.add(url);
          }
        }
      } catch (e) {
        // Silent catch for low-priority background caching
      }
      if (!cancelled) {
        setTimeout(cacheNext, 3000); // 3-second delay between assets to avoid UI thread lag
      }
    };

    const timer = setTimeout(cacheNext, 2500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isEldenRing]);

  // Background Music Controller
  useEffect(() => {
    if (!isEldenRing || !bgMusicEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    const currentTrack = TRACKS[currentTrackIndex];
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    // Only update src if it actually changed to prevent resetting playing track
    if (!audioRef.current.src.endsWith(currentTrack.src)) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.currentTime = 0;
    }

    // Fallback loop handler in case native loop attribute drops
    audioRef.current.onended = () => {
      if (audioRef.current && isEldenRing && bgMusicEnabled) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    if (audioRef.current.paused) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Elden Ring OST autoplay prevented:", err);
        });
      }
    }

    return () => {
      // Keep audio ref intact unless unmounting or explicitly turned off
    };
  }, [isEldenRing, bgMusicEnabled, currentTrackIndex]);

  const toggleEldenRing = () => {
    setIsEldenRing((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, String(next));
      if (next) {
        playSoundEffect("/elden-ring-sounds/entering.mp3", 0.6);
      } else {
        playSoundEffect("/elden-ring-sounds/closetap.mp3", 0.5);
      }
      return next;
    });
  };

  const toggleBgMusic = () => {
    setBgMusicEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(MUSIC_KEY, String(next));
      return next;
    });
  };

  const playSoundEffect = (relPath: string, volume = 0.4) => {
    try {
      const sound = new Audio(getMediaUrl(relPath));
      sound.volume = volume;
      sound.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  };

  const playSound = (
    soundType: "click" | "hover" | "toggle" | "tabOpen" | "tabClose" | "typing" | "enter" | "backspace" | "space" | "entering"
  ) => {
    if (!isEldenRing) return;

    const soundMap: Record<string, { src: string; volume?: number }> = {
      click: { src: "/elden-ring-sounds/key1.mp3", volume: 0.3 },
      hover: { src: "/elden-ring-sounds/key1.mp3", volume: 0.15 },
      toggle: { src: "/elden-ring-sounds/option.mp3", volume: 0.5 },
      tabOpen: { src: "/elden-ring-sounds/newtap.wav", volume: 0.4 },
      tabClose: { src: "/elden-ring-sounds/closetap.mp3", volume: 0.4 },
      typing: { src: "/elden-ring-sounds/key1.mp3", volume: 0.2 },
      enter: { src: "/elden-ring-sounds/entering.mp3", volume: 0.5 },
      backspace: { src: "/elden-ring-sounds/tyback.mp3", volume: 0.3 },
      space: { src: "/elden-ring-sounds/tyspace.mp3", volume: 0.3 },
      entering: { src: "/elden-ring-sounds/entering.mp3", volume: 0.6 },
    };

    const target = soundMap[soundType];
    if (target) {
      playSoundEffect(target.src, target.volume ?? 0.3);
    }
  };

  const setTrack = (trackId: string) => {
    const idx = TRACKS.findIndex((t) => t.id === trackId);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    }
  };

  return (
    <EldenRingContext.Provider
      value={{
        isEldenRing,
        toggleEldenRing,
        playSound,
        bgMusicEnabled,
        toggleBgMusic,
        currentTrack: TRACKS[currentTrackIndex].id,
        setTrack,
        isDarkTheme,
      }}
    >
      {children}
      {isEldenRing && <EldenRingBackgroundOverlay isDark={isDarkTheme} />}
    </EldenRingContext.Provider>
  );
}

function EldenRingBackgroundOverlay({ isDark }: { isDark: boolean }) {
  // Night mode (Dark) uses Ranni theme & wallpaper
  // Day mode (Light) uses Godfrey theme & wallpaper
  const videoSrc = getMediaUrl(
    isDark ? "/elden-ring-wallpaper/ranni.webm" : "/elden-ring-wallpaper/godfrey.webm"
  );
  const posterSrc = getMediaUrl(
    isDark ? "/elden-ring-wallpaper/ranni2.jpg" : "/elden-ring-wallpaper/godfrey2.jpg"
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-35 transition-all duration-1000">
      <video
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        className="h-full w-full object-cover filter contrast-[1.15] brightness-[0.65] transition-all duration-1000"
      >
        <source src={videoSrc} type="video/webm" />
      </video>
      <div
        className={`absolute inset-0 bg-gradient-to-t transition-colors duration-1000 ${
          isDark
            ? "from-[#050b14] via-[#07101f]/50 to-[#040810]/90"
            : "from-[#1a1208] via-[#26190a]/50 to-[#140e06]/90"
        }`}
      />
      <div className="elden-ring-vignette absolute inset-0" />
    </div>
  );
}

export function useEldenRing() {
  const context = useContext(EldenRingContext);
  if (!context) {
    throw new Error("useEldenRing must be used within an EldenRingProvider");
  }
  return context;
}
