import type { Source } from "@/lib/safespace-mock";
import { ChevronRight } from "lucide-react";

export function Sources({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <div className="border-t border-border pt-4 mt-2">
      <details className="group">
        <summary className="list-none flex items-center gap-2 cursor-pointer text-[10px] font-mono text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">
          <ChevronRight className="size-3 group-open:rotate-90 transition-transform" aria-hidden />
          Evidence-based Sources ({sources.length})
        </summary>
        <div className="mt-4 space-y-3">
          {sources.map((s, i) => (
            <details key={i} className="group/src p-3 bg-background rounded-lg border border-border">
              <summary className="list-none flex justify-between items-center gap-3 cursor-pointer">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold truncate">{s.section}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.source}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-accent/10 text-accent rounded shrink-0">
                  {Math.round(s.confidence * 100)}% Match
                </span>
              </summary>
              <p className="mt-3 text-[12px] text-foreground/80 leading-relaxed italic border-l-2 border-accent/30 pl-3">
                {s.chunk_text}
              </p>
            </details>
          ))}
        </div>
      </details>
    </div>
  );
}
