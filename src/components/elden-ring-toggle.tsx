import { useEldenRing, TRACKS } from "@/hooks/use-elden-ring";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Disc, Flame, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function EldenRingToggle() {
  const {
    isEldenRing,
    toggleEldenRing,
    playSound,
    bgMusicEnabled,
    toggleBgMusic,
    currentTrack,
    setTrack,
  } = useEldenRing();

  return (
    <div className="flex items-center gap-1">
      {/* Main Elden Ring Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          toggleEldenRing();
          if (!isEldenRing) {
            toast("GREETINGS, FELLOW TARNISHED", {
              icon: "👑",
              description: "Arise now, ye in search of the Elden Ring. May the Grace guide thy path.",
              duration: 5000,
            });
          } else {
            toast("GRACE RECEDES...", {
              icon: "✨",
              description: "You have departed the Lands Between. Returned to the ordinary realm.",
              duration: 4000,
            });
          }
        }}
        onMouseEnter={() => playSound("hover")}
        aria-label="Toggle Elden Ring Mode"
        title={isEldenRing ? "Disable Elden Ring Mode" : "Enable Elden Ring Mode (Custom Theme & Ambient Sound)"}
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-300 ${
          isEldenRing
            ? "border-[#d4af37] bg-[#1c160c] text-[#f5e6be] shadow-[0_0_15px_rgba(212,175,55,0.4)] er-grace-glow"
            : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/60"
        }`}
      >
        <img
          src="/elden-ring-icon.png"
          alt="Elden Ring"
          className={`w-4 h-4 rounded-full transition-transform duration-500 ${
            isEldenRing ? "rotate-[360deg] scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" : "opacity-80"
          }`}
          onError={(e) => {
            // Fallback icon if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <Flame className={`w-3.5 h-3.5 text-amber-400 ${isEldenRing ? "animate-pulse" : "hidden"}`} />
        <span className="hidden sm:inline font-display tracking-wider">
          {isEldenRing ? "Elden Mode" : "Elden Ring"}
        </span>
      </Button>

      {/* Music & Sound Settings Dropdown when active */}
      {isEldenRing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onMouseEnter={() => playSound("hover")}
              className="h-8 w-8 rounded-full border border-[#d4af37]/40 bg-[#140f09] text-[#e8c872] hover:bg-[#241a0e] hover:border-[#d4af37]"
              title="Elden Ring Audio Settings"
            >
              {bgMusicEnabled ? (
                <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#16120b]/95 border-[#d4af37]/40 text-[#f0e2c5] backdrop-blur-md"
          >
            <DropdownMenuLabel className="flex items-center gap-2 font-display text-amber-400 text-xs">
              <Disc className="w-3.5 h-3.5" /> Elden Ring Soundtrack
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#d4af37]/20" />

            <DropdownMenuItem
              onClick={() => {
                toggleBgMusic();
                playSound("click");
              }}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#281f14] focus:bg-[#281f14]"
            >
              <span>Background Music</span>
              <span className="font-semibold text-amber-400">
                {bgMusicEnabled ? "ON" : "OFF"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#d4af37]/20" />
            <DropdownMenuLabel className="text-[10px] text-amber-300/60 uppercase tracking-widest">
              Select OST Track
            </DropdownMenuLabel>

            {TRACKS.map((track) => (
              <DropdownMenuItem
                key={track.id}
                onClick={() => {
                  setTrack(track.id);
                  playSound("click");
                  toast.success(`Playing: ${track.name}`);
                }}
                className={`text-xs cursor-pointer flex items-center justify-between hover:bg-[#281f14] focus:bg-[#281f14] ${
                  currentTrack === track.id ? "text-amber-400 font-semibold bg-[#241b10]" : "text-[#d1c3a5]"
                }`}
              >
                <span className="truncate">{track.name}</span>
                {currentTrack === track.id && (
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
