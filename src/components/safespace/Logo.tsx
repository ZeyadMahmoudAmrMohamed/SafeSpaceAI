// Change size = 100 to size = 150 (or whatever looks best)
export function Logo({ size = 150, withWordmark = false, className = "" }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/safespace-logo.png"
        alt="SafeSpace logo"
        width={size}
        height={size}
        className="object-contain shrink-0"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span className="font-display font-bold tracking-tight text-foreground text-base">
          SafeSpace<span className="text-primary"> AI</span>
        </span>
      )}
    </div>
  );
}