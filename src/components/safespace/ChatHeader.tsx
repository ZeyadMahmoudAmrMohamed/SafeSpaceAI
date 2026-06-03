import { Menu, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function ChatHeader({
  onToggleSidebar,
  darkMode,
  onToggleDark,
  soundOn,
  onToggleSound,
}: {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden size-9 -ml-1 rounded-lg hover:bg-sidebar-accent flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <div className="md:hidden">
          <Logo size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">SafeSpace Companion</span>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 bg-primary rounded-full animate-pulse" aria-hidden />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
              Active Support Mode
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground uppercase tracking-widest">
        <button
          type="button"
          onClick={onToggleSound}
          className="size-9 rounded-lg hover:bg-sidebar-accent flex items-center justify-center text-foreground/70"
          aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
        >
          {soundOn ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={onToggleDark}
          className="size-9 rounded-lg hover:bg-sidebar-accent flex items-center justify-center text-foreground/70"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
        </button>
        <Link
          to="/about"
          className="hidden sm:inline hover:text-foreground px-3 py-1"
        >
          About
        </Link>
      </div>
    </header>
  );
}
