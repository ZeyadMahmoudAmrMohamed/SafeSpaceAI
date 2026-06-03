import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { emotionEmoji, emotionLabel, intentLabel, type ChatMetadata } from "@/lib/safespace-mock";

const LANG = (code: string) => ({
  ar: "🇸🇦 AR",
  bg: "🇧🇬 BG",
  de: "🇩🇪 DE",
  el: "🇬🇷 EL",
  en: "🇬🇧 EN",
  es: "🇪🇸 ES",
  fr: "🇫🇷 FR",
  hi: "🇮🇳 HI",
  it: "🇮🇹 IT",
  ja: "🇯🇵 JA",
  nl: "🇳🇱 NL",
  pl: "🇵🇱 PL",
  pt: "🇵🇹 PT",
  ru: "🇷🇺 RU",
  sw: "🇰🇪 SW",
  th: "🇹🇭 TH",
  tr: "🇹🇷 TR",
  ur: "🇵🇰 UR",
  vi: "🇻🇳 VI",
  zh: "🇨🇳 ZH"
}[code] ?? code.toUpperCase());

function Badge({ tip, children }: { tip: string; children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-card ring-1 ring-border rounded-full hover:ring-foreground/20 transition-all"
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-xs">
          {tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MetadataBadges({ metadata }: { metadata: ChatMetadata }) {
  const { emotion, intent, language, confidence_scores } = metadata;
  const overallConf = Math.round(
    ((confidence_scores.emotion + confidence_scores.intent + confidence_scores.language) / 3) * 100,
  );
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        tip={`We detected the emotional tone as ${emotionLabel(emotion).toLowerCase()} (${Math.round(
          confidence_scores.emotion * 100,
        )}% confidence).`}
      >
        <span className="text-xs">{emotionEmoji(emotion)}</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Emotion: {emotionLabel(emotion)} ({Math.round(confidence_scores.emotion * 100)}%)
        </span>
      </Badge>

      <Badge
        tip={`Language detected as ${language.toUpperCase()} (${Math.round(
          confidence_scores.language * 100,
        )}% confidence).`}
      >
        <span className="text-xs">🌍</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{LANG(language)}</span>
      </Badge>

      <Badge tip={`We understood your intent as: ${intentLabel(intent)}.`}>
        <span className="text-xs">🎯</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Intent: {intentLabel(intent)}
        </span>
      </Badge>

      <Badge tip="Average confidence across emotion, language, and intent detection.">
        <span className="text-xs">✅</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Confidence: {overallConf}%
        </span>
      </Badge>
    </div>
  );
}
