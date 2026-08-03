import { useEffect, useState } from "react";
import { useEldenRing } from "@/hooks/use-elden-ring";

export type EldenRingBannerType = "GOD_SLAIN" | "DEMIGOD_FELLED" | "YOU_DIED" | null;

interface EldenRingBannerProps {
  type: EldenRingBannerType;
  onClose?: () => void;
}

export function EldenRingBanner({ type, onClose }: EldenRingBannerProps) {
  const { isEldenRing } = useEldenRing();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type && isEldenRing) {
      setVisible(true);

      // Play specific sound based on result
      let audioPath = "/elden-ring-sounds/entering.mp3";
      if (type === "YOU_DIED") {
        audioPath = "/elden-ring-sounds/closetap.mp3";
      } else if (type === "GOD_SLAIN") {
        audioPath = "/elden-ring-sounds/entering.mp3";
      } else {
        audioPath = "/elden-ring-sounds/option.mp3";
      }

      try {
        const audio = new Audio(audioPath);
        audio.volume = 0.6;
        audio.play().catch(() => {});
      } catch (e) {}

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [type, isEldenRing]);

  if (!visible || !type || !isEldenRing) return null;

  const isYouDied = type === "YOU_DIED";
  const isGodSlain = type === "GOD_SLAIN";

  return (
    <div
      onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md cursor-pointer animate-in fade-in duration-500"
    >
      {/* Elden Ring Iconic Horizontal Banner Bar */}
      <div className="relative w-full py-12 flex flex-col items-center justify-center overflow-hidden">
        {/* Top & Bottom Golden/Crimson Lines */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isYouDied
              ? "bg-gradient-to-r from-transparent via-red-700 to-transparent shadow-[0_0_15px_#dc2626]"
              : "bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_15px_#ffd700]"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-[2px] ${
            isYouDied
              ? "bg-gradient-to-r from-transparent via-red-700 to-transparent shadow-[0_0_15px_#dc2626]"
              : "bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_15px_#ffd700]"
          }`}
        />

        {/* Banner Inner Glow Overlay */}
        <div
          className={`absolute inset-0 ${
            isYouDied
              ? "bg-gradient-to-r from-black via-red-950/80 to-black"
              : isGodSlain
              ? "bg-gradient-to-r from-black via-[#3a2e10]/90 to-black"
              : "bg-gradient-to-r from-black via-[#261d0b]/80 to-black"
          }`}
        />

        {/* Content Typography */}
        <div className="relative z-10 text-center space-y-2 px-4">
          <h1
            className={`font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.25em] uppercase select-none transition-transform duration-1000 scale-105 ${
              isYouDied
                ? "text-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.9)] animate-pulse"
                : isGodSlain
                ? "text-[#fff2bc] drop-shadow-[0_0_30px_rgba(255,215,0,0.9)] text-amber-200"
                : "text-[#f5e6be] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
            }`}
          >
            {isYouDied && "YOU DIED"}
            {isGodSlain && "GOD SLAIN"}
            {type === "DEMIGOD_FELLED" && "DEMIGOD FELLED"}
          </h1>

          <p
            className={`font-serif text-xs sm:text-sm tracking-[0.3em] uppercase opacity-90 ${
              isYouDied ? "text-red-400" : "text-amber-300/90"
            }`}
          >
            {isYouDied && "Thou art unfit to join the Golden Order. Rise & try again."}
            {isGodSlain && "Legendary Victory! Thy power echoes through the Erdtree."}
            {type === "DEMIGOD_FELLED" && "Great Foe Defeated. Glory to the Tarnished."}
          </p>

          <span className="inline-block mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/60 animate-bounce">
            (Click anywhere to dismiss)
          </span>
        </div>
      </div>
    </div>
  );
}
