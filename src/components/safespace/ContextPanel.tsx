import type { ContextAccumulated } from "@/lib/safespace-mock";

export function ContextPanel({ context }: { context: ContextAccumulated }) {
  const hasData =
    context.symptoms.length || context.triggers.length || context.duration || context.severity;
  if (!hasData) return null;

  const stability =
    context.severity === "moderate-high" ? 35 : context.severity === "moderate" ? 65 : 85;

  return (
    <aside className="hidden xl:block w-72 shrink-0 border-l border-border bg-background p-6 overflow-y-auto">
      <h3 className="font-serif italic text-lg mb-1">Conversation context</h3>
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-6">
        What we've discussed
      </p>

      <div className="space-y-5">
        {context.symptoms.length > 0 && (
          <Section title="Symptoms">
            <ChipList items={context.symptoms} />
          </Section>
        )}
        {context.triggers.length > 0 && (
          <Section title="Triggers">
            <ChipList items={context.triggers} />
          </Section>
        )}
        {context.duration && (
          <Section title="Duration">
            <p className="text-sm text-foreground/80">{context.duration}</p>
          </Section>
        )}
        {context.severity && (
          <Section title="Session stability">
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${stability}%` }}
              />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-2">
              {context.severity}
            </p>
          </Section>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground mt-8 leading-relaxed italic">
        This helps SafeSpace understand your situation better across the conversation.
      </p>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
        {title}
      </h4>
      {children}
    </section>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span
          key={i}
          className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/15 text-[11px] text-accent font-medium capitalize"
        >
          {i}
        </span>
      ))}
    </div>
  );
}
