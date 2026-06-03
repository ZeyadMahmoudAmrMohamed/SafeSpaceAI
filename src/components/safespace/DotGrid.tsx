import { useEffect, useRef } from "react";

/**
 * Subtle interactive dot grid background.
 * Inspired by reactbits' DotField — lightweight canvas implementation.
 * Uses the theme's primary color via a CSS variable so it adapts to dark mode.
 */
export function DotGrid({
  spacing = 22,
  dotRadius = 1.1,
  cursorRadius = 140,
  bulgeStrength = 6,
  className = "",
}: {
  spacing?: number;
  dotRadius?: number;
  cursorRadius?: number;
  bulgeStrength?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0,
      height = 0;
    const dpr = window.devicePixelRatio || 1;

    const readColor = () => {
      // Read primary color from CSS var (hsl(...) string)
      const v = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      return v || "hsl(18 60% 50%)";
    };
    let baseColor = readColor();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };
    const onLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    let themeWatchTick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      themeWatchTick++;
      if (themeWatchTick % 60 === 0) baseColor = readColor();

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const cr = cursorRadius;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const active = mouse.current.active;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          let r = dotRadius;
          let alpha = 0.18;
          if (active) {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cr) {
              const t = 1 - dist / cr;
              r = dotRadius + t * bulgeStrength;
              alpha = 0.18 + t * 0.55;
            }
          }
          // baseColor like "hsl(18 60% 50%)" — wrap with alpha via hsla? css supports hsl(... / a)
          ctx.fillStyle = baseColor.includes("/")
            ? baseColor
            : baseColor.replace(/hsl\(([^)]+)\)/, `hsl($1 / ${alpha})`);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [spacing, dotRadius, cursorRadius, bulgeStrength]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
