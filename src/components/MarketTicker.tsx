import { assets } from "../lib/data";
import { useStore } from "../store";
import { fmtPrice, fmtPct } from "../lib/format";
import { cn } from "../utils/cn";
import { AssetMark } from "./AssetIcon";

export function MarketTicker() {
  const live = useStore((s) => s.live);
  const openAsset = useStore((s) => s.openAsset);
  const items = assets.slice(0, 16);

  const Row = ({ keyPrefix }: { keyPrefix: string }) => (
    <div className="flex shrink-0 items-center gap-2 pr-2" aria-hidden={keyPrefix === "b"}>
      {items.map((a) => {
        const l = live[a.id];
        const up = (l?.change ?? 0) >= 0;
        return (
          <button
            key={keyPrefix + a.id}
            onClick={() => openAsset(a.id)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0a0b0d] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              {AssetMark({ asset: a, size: 20 }) ?? (
                <span className="text-[10px] font-bold text-white">
                  {a.glyph || a.symbol.slice(0, 1)}
                </span>
              )}
            </span>
            <span className="text-[12px] font-medium text-white/80">{a.symbol}</span>
            <span className="text-[12px] tabular-nums text-white">{fmtPrice(l?.price ?? a.price)}</span>
            <span className={cn("text-[12px] tabular-nums", up ? "text-gain" : "text-loss")}>
              {fmtPct(l?.change ?? a.change24h)}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="relative overflow-hidden mask-fade-x">
      <div className="flex w-max animate-marquee">
        <Row keyPrefix="a" />
        <Row keyPrefix="b" />
      </div>
    </div>
  );
}
