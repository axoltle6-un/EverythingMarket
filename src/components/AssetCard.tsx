import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Asset } from "../lib/data";
import { usePrice, useIsLive } from "../store";
import { genPriceSeries, fmtPrice } from "../lib/format";
import { AssetTile, ChangeChip, MarketDot } from "./ui";
import { Sparkline } from "./Sparkline";
import { AnimatedNumber } from "./AnimatedNumber";
import { useStore } from "../store";

export function AssetCard({ asset, index = 0 }: { asset: Asset; index?: number }) {
  const { price, change } = usePrice(asset.id);
  const openAsset = useStore((s) => s.openAsset);
  const isLive = useIsLive(asset.id);
  const positive = change >= 0;

  const spark = useMemo(
    () => genPriceSeries(asset.id + "card", asset.price, 32, asset.change24h, 0.011),
    [asset.id, asset.price, asset.change24h]
  );

  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      onClick={() => openAsset(asset.id)}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-left backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.13] hover:bg-white/[0.045]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <AssetTile asset={asset} size={38} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold text-white">{asset.symbol}</span>
            </div>
            <div className="truncate text-[12px] text-white/45">{asset.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isLive && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gain/12 px-1.5 py-0.5 text-[10px] font-semibold text-gain">
              <span className="h-1 w-1 rounded-full bg-gain" /> LIVE
            </span>
          )}
          <MarketDot status={asset.status} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <div className="text-[22px] font-semibold leading-none tracking-tight tabular-nums text-white">
            <AnimatedNumber value={price} format={fmtPrice} />
          </div>
          <div className="mt-2">
            <ChangeChip value={change} />
          </div>
        </div>
        <div className="h-9 w-[44%] max-w-[110px] opacity-90 transition-opacity duration-300 group-hover:opacity-100">
          <Sparkline data={spark} positive={positive} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute -bottom-px left-0 h-px w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${asset.color}66, transparent)`,
        }}
      />
    </motion.button>
  );
}
