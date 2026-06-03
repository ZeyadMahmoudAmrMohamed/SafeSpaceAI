import { useCallback, useEffect, useRef } from "react";
type SoundName = "send" | "receive" | "typing" | "open" | "error";

const KEY = "safespace:sound-enabled";

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      enabledRef.current = stored === null ? true : stored === "1";
    } catch {}
  }, []);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, durationMs: number, type: OscillatorType = "sine", gain = 0.06, slideTo?: number) => {
      if (!enabledRef.current) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + durationMs / 1000);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000 + 0.05);
    },
    [ensureCtx],
  );

  const play = useCallback(
    (name: SoundName) => {
      switch (name) {
        case "send":
          tone(520, 110, "sine", 0.07, 880);
          break;
        case "receive":
          tone(440, 90, "sine", 0.05);
          setTimeout(() => tone(660, 140, "sine", 0.05), 70);
          break;
        case "typing":
          tone(1200, 22, "triangle", 0.018);
          break;
        case "open":
          tone(660, 80, "sine", 0.04, 990);
          break;
        case "error":
          tone(220, 180, "sawtooth", 0.04, 110);
          break;
      }
    },
    [tone],
  );

  const setEnabled = useCallback((v: boolean) => {
    enabledRef.current = v;
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  }, []);

  const isEnabled = useCallback(() => enabledRef.current, []);

  return { play, setEnabled, isEnabled };
}
