import { useState } from "react";
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import type { ChatMetadata } from "@/lib/safespace-mock";
import { Sources } from "./Sources";
import { MetadataBadges } from "./MetadataBadges";

function renderRichText(text: string) {
  // very light markdown: **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

export function BotMessage({
  text,
  time,
  metadata,
  onRegenerate,
}: {
  text: string;
  time: string;
  metadata: ChatMetadata;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-start gap-4 animate-message">
      <div className="flex items-center gap-3">
        <div
          className="size-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center"
          aria-hidden
        >
          <div className="size-2.5 rounded-full bg-accent" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
          SafeSpace · {time}
        </span>
      </div>

      <div className="max-w-[90%] w-full space-y-4">
        <div className="bg-card ring-1 ring-border px-6 sm:px-7 py-6 rounded-[2rem] rounded-tl-lg shadow-sm">
          <p className="text-[16px] leading-relaxed whitespace-pre-wrap">
            {text.split("\n\n").map((para, i) => (
              <span key={i} className="block mb-3 last:mb-0">
                {renderRichText(para)}
              </span>
            ))}
          </p>

          <Sources sources={metadata.sources} />
        </div>

        <MetadataBadges metadata={metadata} />

        <div className="flex items-center gap-1 -ml-2">
          <button
            type="button"
            onClick={copy}
            className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Copy response"
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          </button>
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              aria-label="Regenerate response"
            >
              <RefreshCw className="size-3.5" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={() => setFeedback("up")}
            className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
              feedback === "up"
                ? "text-accent bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
            aria-label="Mark helpful"
          >
            <ThumbsUp className="size-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setFeedback("down")}
            className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
              feedback === "down"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
            aria-label="Mark not helpful"
          >
            <ThumbsDown className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
