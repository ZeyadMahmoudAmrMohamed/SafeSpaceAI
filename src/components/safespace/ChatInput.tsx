import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export function ChatInput({
  onSend,
  disabled,
  draft,
  onDraftChange,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
  draft: string;
  onDraftChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const baseDraftRef = useRef("");
  const { listening, transcribing, transcript, supported, error, start, stop } =
    useSpeechRecognition();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [draft]);

  // Place the completed transcript into the textarea after recording stops.
  useEffect(() => {
    if (transcript) {
      const next = (baseDraftRef.current ? baseDraftRef.current + " " : "") + transcript;
      onDraftChange(next);
    }
  }, [transcript, onDraftChange]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const submit = () => {
    const t = draft.trim();
    if (!t || disabled) return;
    if (listening) stop();
    onSend(t);
    onDraftChange("");
  };

  const toggleMic = () => {
    if (!supported) {
      toast.error("Voice input isn't supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }
    if (listening) {
      stop();
    } else {
      baseDraftRef.current = draft;
      start();
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto relative">
      <div
        className={`relative flex items-end gap-3 bg-card p-2 pl-4 sm:pl-6 rounded-[2rem] shadow-xl shadow-black/5 ring-1 transition-all ${
          focused ? "ring-ring" : listening ? "ring-primary/50" : "ring-border"
        }`}
      >
        <textarea
          ref={ref}
          rows={1}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={disabled}
          placeholder={
            listening
              ? "Listening… tap the mic when you're done"
              : transcribing
                ? "Transcribing your voice..."
                : disabled
                  ? "SafeSpace is responding..."
                  : "Share what's on your mind..."
          }
          className="flex-1 py-4 bg-transparent border-none outline-none resize-none text-[15px] placeholder:text-muted-foreground/60 disabled:opacity-60"
          aria-label="Message input"
        />
        <div className="flex items-center gap-1 p-1">
          <button
            type="button"
            onClick={toggleMic}
            disabled={transcribing}
            className={`size-10 flex items-center justify-center rounded-full transition-all ${
              listening
                ? "bg-primary text-primary-foreground animate-pulse"
                : "hover:bg-sidebar-accent text-muted-foreground disabled:opacity-40"
            }`}
            aria-label={
              listening
                ? "Stop voice input"
                : transcribing
                  ? "Transcribing voice input"
                  : "Start voice input"
            }
          >
            {listening ? (
              <MicOff className="size-4" aria-hidden />
            ) : (
              <Mic className="size-4" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={disabled || !draft.trim()}
            className="size-10 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <p className="text-center mt-4 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
        SafeSpace AI can make mistakes. Not a substitute for clinical care.
      </p>
    </div>
  );
}
