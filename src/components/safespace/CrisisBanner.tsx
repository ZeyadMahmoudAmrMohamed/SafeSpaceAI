import { AlertTriangle } from "lucide-react";

export function CrisisBanner() {
  return (
    <div className="px-4 sm:px-8 pt-6" role="alert" aria-live="assertive">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4 animate-message max-w-4xl mx-auto w-full">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="size-5 text-primary" aria-hidden />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-primary mb-1">You deserve support right now.</h3>
          <p className="text-sm text-foreground/80 leading-relaxed mb-4">
            If you're feeling overwhelmed, please know there are people who want to listen.
            The 16328 Lifeline is available 24/7 — call, text, or chat.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:16328"
              className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Call or text 16328
            </a>
            <a
              href="sms:16328&body=HOME"
              className="px-4 py-1.5 bg-card border border-primary/20 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors"
            >
              Text HOME to 16328
            </a>
            <a
              href="https://www.mohp.gov.eg/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-card border border-primary/20 text-primary text-xs font-bold rounded-full hover:bg-primary/5 transition-colors"
            >
              Chat online
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
