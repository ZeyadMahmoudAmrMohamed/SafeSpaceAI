export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-message" aria-live="polite" aria-label="SafeSpace is typing">
      <div className="size-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center" aria-hidden>
        <div className="size-2.5 rounded-full bg-accent" />
      </div>
      <div className="bg-card ring-1 ring-border px-5 py-4 rounded-2xl rounded-tl-lg shadow-sm flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
