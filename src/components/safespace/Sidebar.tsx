import { Plus, Trash2 } from "lucide-react";
import { Logo } from "./Logo";

type Session = { id: string; title: string; when: string };

const DEMO_SESSIONS: Session[] = [
  { id: "s1", title: "Let it all work out", when: "12 mins ago" },
  { id: "s2", title: "Sleep hygiene check", when: "Yesterday" },
  { id: "s3", title: "Breathing exercises", when: "June 3" },
];

export function Sidebar({
  onNewChat,
  onClear,
}: {
  onNewChat: () => void;
  onClear: () => void;
}) {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-sidebar border-r border-sidebar-border p-6 gap-8 shrink-0">
      <Logo size={52} withWordmark />

      <button
        type="button"
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Plus className="size-4" aria-hidden /> New Conversation
      </button>

      <nav className="flex flex-col gap-1" aria-label="Recent sessions">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
          Recent Sessions
        </p>
        {DEMO_SESSIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="text-left flex flex-col p-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors"
          >
            <span className="text-sm font-medium truncate text-sidebar-foreground">{s.title}</span>
            <span className="text-[11px] text-muted-foreground">{s.when}</span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Trash2 className="size-3.5" aria-hidden /> Clear current chat
      </button>

      <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/15">
        <p className="text-xs font-serif italic text-primary leading-relaxed">
          "The sun is a daily reminder that we too can rise from the darkness."
        </p>
      </div>
    </aside>
  );
}
