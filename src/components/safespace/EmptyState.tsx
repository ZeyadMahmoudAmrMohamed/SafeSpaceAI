const PROMPTS = [
  { text: "I feel anxious", sub: "Let's explore what's on your mind." },
  { text: "Help me sleep", sub: "Breathwork and wind-down tips." },
  { text: "Work pressure", sub: "Talk through deadlines and stress." },
  { text: "Arsenal lost the final :(", sub: "Arteta OUT! Enough Haram ball" },
];

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 pt-8 sm:pt-16 px-4 animate-message relative">
      <div className="space-y-3">
        <h2 className="font-serif italic text-4xl sm:text-5xl tracking-tight text-foreground">
          How are you feeling today?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          A calm, judgment-free space to talk things through. Start anywhere —
          there's no right way to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROMPTS.map((p) => (
          <button
            key={p.text}
            type="button"
            onClick={() => onPick(p.text)}
            className="p-4 text-left border border-border rounded-2xl bg-card/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <p className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
              "{p.text}"
            </p>
            <p className="text-xs text-muted-foreground">{p.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
