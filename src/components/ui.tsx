import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import type { Asset, MarketStatus } from "../lib/data";
import { fmtPct, fmtSigned } from "../lib/format";
import { AssetMark } from "./AssetIcon";

/* ---------------- Button ---------------- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};
export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
    md: "h-10 px-4 text-sm gap-2 rounded-xl",
    lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
  };
  const variants = {
    primary:
      "bg-accent text-white hover:bg-[#3f7af0] shadow-[0_8px_24px_-8px_rgba(79,139,255,0.7)]",
    secondary:
      "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.07]",
    ghost: "text-white/70 hover:text-white hover:bg-white/[0.06]",
    outline:
      "border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.03]",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({
  className,
  children,
  hover = false,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl",
        hover &&
          "transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ---------------- Badge / Pill ---------------- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gain" | "loss" | "accent" | "warn";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/[0.06] text-white/60 border-white/[0.07]",
    gain: "bg-gain/10 text-gain border-gain/20",
    loss: "bg-loss/10 text-loss border-loss/20",
    accent: "bg-accent/10 text-accent border-accent/25",
    warn: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- ChangeChip ---------------- */
export function ChangeChip({
  value,
  abs,
  className,
  size = "sm",
}: {
  value: number;
  abs?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg font-medium tabular-nums",
        up ? "text-gain bg-gain/10" : "text-loss bg-loss/10",
        size === "sm" ? "px-1.5 py-0.5 text-[12px]" : "px-2 py-1 text-sm",
        className
      )}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" className={up ? "" : "rotate-180"}>
        <path d="M5 1 L9 7 L1 7 Z" fill="currentColor" />
      </svg>
      {fmtPct(value)}
      {abs !== undefined && (
        <span className="opacity-60 hidden sm:inline">· {fmtSigned(abs)}</span>
      )}
    </span>
  );
}

/* ---------------- MarketDot ---------------- */
const STATUS_META: Record<MarketStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "#34d399" },
  pre: { label: "Pre-market", color: "#e0b84a" },
  after: { label: "After-hours", color: "#e0b84a" },
  closed: { label: "Closed", color: "#6b7280" },
};
export function MarketDot({ status }: { status: MarketStatus }) {
  const m = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
      <span className="relative flex h-1.5 w-1.5">
        {status === "open" && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: m.color }}
          />
        )}
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ background: m.color }}
        />
      </span>
      {m.label}
    </span>
  );
}

/* ---------------- AssetTile (white logo/icon on a dark tile) ---------------- */
export function AssetTile({
  asset,
  size = 40,
  className,
}: {
  asset: Asset;
  size?: number;
  className?: string;
}) {
  const mark = AssetMark({ asset, size });
  const fallback = asset.glyph || asset.symbol.slice(0, 2);
  const isEmoji = /\p{Emoji}/u.test(asset.glyph || "");
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: isEmoji ? size * 0.5 : size * 0.34,
        background: "radial-gradient(115% 115% at 32% 26%, rgba(255,255,255,0.08), #0a0b0d 74%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
        borderRadius: Math.max(8, size * 0.28),
      }}
    >
      {mark ?? fallback}
    </div>
  );
}

/* ---------------- Monogram (dark tile + white initials) ---------------- */
export function Monogram({
  text,
  size = 32,
  className,
}: {
  text: string;
  size?: number;
  className?: string;
}) {
  const initials = text.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: "radial-gradient(115% 115% at 32% 26%, rgba(255,255,255,0.08), #0a0b0d 74%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
        borderRadius: Math.max(8, size * 0.28),
      }}
    >
      {initials}
    </div>
  );
}

/* ---------------- SectionHeader ---------------- */
export function SectionHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight text-white sm:text-lg">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-white/45">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("shimmer rounded-lg bg-white/[0.05]", className)} />
  );
}

/* ---------------- StatTile ---------------- */
export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3.5">
      <div className="text-[11px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-1.5 text-[15px] font-semibold tabular-nums text-white">{value}</div>
      {sub && <div className="mt-0.5 text-[12px] text-white/45">{sub}</div>}
    </div>
  );
}
