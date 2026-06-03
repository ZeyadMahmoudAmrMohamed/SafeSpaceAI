import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function UserMessage({ text, time }: { text: string; time: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex justify-end animate-message group">
      <div className="flex flex-col items-end gap-1 max-w-[85%]">
        <div className="bg-accent/10 border border-accent/10 px-6 py-4 rounded-[2rem] rounded-tr-lg">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {time}
          </span>
          <button
            type="button"
            onClick={copy}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Copy message"
          >
            {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
