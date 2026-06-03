import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Shield, Sparkles, Brain, MessageCircle, BookOpen } from "lucide-react";
import { Logo } from "@/components/safespace/Logo";
import { DotGrid } from "@/components/safespace/DotGrid";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SafeSpace — A judgment-free space to talk" },
      {
        name: "description",
        content:
          "SafeSpace is a retrieval-augmented mental health companion. Emotion-aware, source-cited, and built with care by Mohamed Emad Zaky and Ziad Mahmoud Amr.",
      },
      { property: "og:title", content: "About SafeSpace" },
      {
        property: "og:description",
        content: "An empathetic AI companion grounded in professional counseling literature.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-20 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={32} withWordmark />
          <div className="flex items-center gap-4 text-sm">
            <a href="#features" className="hidden sm:inline text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hidden sm:inline text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#team" className="hidden sm:inline text-muted-foreground hover:text-foreground transition-colors">Team</a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Open SafeSpace <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 opacity-60">
          <DotGrid spacing={26} dotRadius={1.2} cursorRadius={180} bulgeStrength={8} />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
          <div className="flex justify-center mb-8 animate-float">
            <Logo size={96} />
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary mb-6 animate-fade-up">
            ◆ A retrieval-augmented mental health companion
          </p>
          <h1 className="font-serif italic text-5xl sm:text-7xl tracking-tight leading-[1.05] mb-6 animate-fade-up [animation-delay:80ms]">
            Talk through it,<br />without judgment.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up [animation-delay:160ms]">
            SafeSpace listens with empathy, detects emotion and intent, and grounds every
            response in evidence from professional counseling literature — so you always know
            where the help is coming from.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:240ms]">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
            >
              Start a conversation <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full text-sm font-medium hover:bg-card transition-colors"
            >
              See how it works
            </a>
          </div>

          <p className="mt-12 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/80">
            Not a replacement for therapy or crisis intervention. In emergencies dial 988 (US) or findahelpline.com
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary mb-4">
              ◆ What it does
            </p>
            <h2 className="font-serif italic text-4xl sm:text-5xl tracking-tight mb-4">
              Empathy, grounded in evidence.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every reply is shaped by an NLP pipeline that understands you, then sourced from a
              vector index over 17k professional counseling pairs and a curated PDF library.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature
              icon={<Brain className="size-5" />}
              title="Emotion-aware"
              body="DistilBERT classifies emotional tone across fear, sadness, joy, anger and more — visible inline, never guessed."
            />
            <Feature
              icon={<MessageCircle className="size-5" />}
              title="Intent routing"
              body="Zero-shot intent classification routes greetings, questions, and crises through the right pathway."
            />
            <Feature
              icon={<BookOpen className="size-5" />}
              title="Evidence-based sources"
              body="Hybrid BM25 + semantic retrieval cites the actual passages behind each response."
            />
            <Feature
              icon={<Shield className="size-5" />}
              title="Crisis safety net"
              body="Keyword and signal detection surface 988, Crisis Text Line and chat resources the moment they're needed."
            />
            <Feature
              icon={<Sparkles className="size-5" />}
              title="Multilingual detection"
              body="TF-IDF language ID across 20 languages so we always meet you in the language you're typing."
            />
            <Feature
              icon={<Heart className="size-5" />}
              title="Context across turns"
              body="Symptoms, triggers, severity and duration accumulate as you talk — never re-explain yourself."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24 border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary mb-4">
              ◆ Under the hood
            </p>
            <h2 className="font-serif italic text-4xl sm:text-5xl tracking-tight mb-4">
              A pipeline, not a black box.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From your first sentence to the final answer, every step is visible.
            </p>
          </div>

          <ol className="space-y-4">
            {[
              ["01", "Language detection", "TF-IDF + Logistic Regression across 20 languages."],
              ["02", "Emotion classification", "DistilBERT fine-tuned on 6k labelled messages."],
              ["03", "Intent routing", "Zero-shot via Groq LLM — greeting, gratitude, mental-health, out-of-scope."],
              ["04", "NER + query rewrite", "Extract symptoms, triggers; rewrite for retrieval."],
              ["05", "Hybrid search", "BM25 keywords + semantic similarity over the Qdrant index."],
              ["06", "Grounded generation", "LLM composes a response strictly from retrieved chunks, with citations."],
            ].map(([num, title, desc]) => (
              <li
                key={num}
                className="group flex gap-6 items-start p-5 rounded-2xl border border-border bg-background hover:border-primary/40 transition-colors"
              >
                <span className="font-mono text-[11px] text-primary tracking-widest pt-1">{num}</span>
                <div>
                  <h3 className="font-serif italic text-xl mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="relative py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary mb-4">
              ◆ The team
            </p>
            <h2 className="font-serif italic text-4xl sm:text-5xl tracking-tight">
              Built with care.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { name: "Mohamed Emad Zaky", role: "ML & Backend" },
              { name: "Ziad Mahmoud Amr", role: "ML & Backend" },
            ].map((p) => (
              <div
                key={p.name}
                className="p-8 rounded-3xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all"
              >
                <div className="size-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif italic text-xl mb-5">
                  {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <h3 className="font-serif italic text-2xl mb-1">{p.name}</h3>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {p.role}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-12 font-mono uppercase tracking-widest">
            Tech · Python · PyTorch · Hugging Face · Qdrant · FastAPI · Groq
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <DotGrid spacing={22} dotRadius={1} cursorRadius={140} bulgeStrength={6} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif italic text-4xl sm:text-6xl tracking-tight mb-6">
            Whenever you're ready.
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            There's no right way to start. Just a sentence is enough.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
          >
            Open SafeSpace <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        SafeSpace · An educational project · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all">
      <div className="size-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-serif italic text-xl mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
