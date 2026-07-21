import { cn } from "../utils/cn";

/* New logo: minimal white mark on a near-black tile (Stripe / Polymarket vibe). */
export function LogoGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* rising trend + arrow to the corner */}
      <path d="M4 18.5 18 4.5" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 4.5h9.5V14" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoMark({
  size = 36,
  withText = false,
  onClick,
  className,
  textClassName,
}: {
  size?: number;
  withText?: boolean;
  onClick?: () => void;
  className?: string;
  textClassName?: string;
}) {
  const inner = (
    <span className="flex items-center gap-2.5">
      <span
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          background: "#0a0b0d",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <LogoGlyph size={Math.round(size * 0.62)} />
      </span>
      {withText && (
        <span className={cn("text-[15px] font-semibold tracking-tight text-white", textClassName)}>
          Everything<span className="text-white/45"> Market</span>
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn("transition-opacity hover:opacity-90", className)}
        aria-label="Everything Market — home"
      >
        {inner}
      </button>
    );
  }
  return <span className={className}>{inner}</span>;
}
