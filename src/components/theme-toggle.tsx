import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle color theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-8 w-8 rounded-full border border-border/50 bg-secondary/40 hover:bg-secondary hover:scale-105 transition-all duration-200"
    >
      <Sun className={`h-4 w-4 text-amber-500 transition-all duration-300 ${theme === "dark" ? "scale-0 rotate-90 opacity-0 absolute" : "scale-100 rotate-0 opacity-100"}`} />
      <Moon className={`h-4 w-4 text-sky-400 transition-all duration-300 ${theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0 absolute"}`} />
    </Button>
  );
}