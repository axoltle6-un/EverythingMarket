import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { assets, categories, type Category } from "../lib/data";
import { useStore } from "../store";
import { fmtPct } from "../lib/format";
import { cn } from "../utils/cn";

type Filter = "All" | Category;

function weight(a: (typeof assets)[number]) {
  return a.marketCap ?? a.volume ?? a.price * 1e6;
}

export function Heatmap() {
  const [filter, setFilter] = useState<Filter>("All");
  const live = useStore((s) => s.live);
  const openAsset = useStore((s) => s.openAsset);

  const cells = useMemo(() => {
    const pool = filter === "All" ? assets : assets.filter((a) => a.category === filter);
    return [...pool].sort((a, b) => weight(b) - weight(a));
  }, [filter]);

  const filters: Filter[] = ["All", ...categories];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
              filter === f
                ? "bg-white text-ink-950"
                : "bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {cells.map((a, i) => {
          const change = live[a.id]?.change ?? a.change24h;
          const up = change >= 0;
          const alpha = Math.min(0.55, Math.max(0.1, Math.abs(change) / 4.5) + 0.1);
          const bg = up
            ? `rgba(52,211,153,${alpha.toFixed(2)})`
            : `rgba(244,99,95,${alpha.toFixed(2)})`;
          const big = i === 0 && filter === "All";
          return (
            <motion.button
              key={a.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.25) }}
              whileHover={{ scale: 1.03, zIndex: 5 }}
              onClick={() => openAsset(a.id)}
              className={cn(
                "relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-xl p-3 text-left ring-1 ring-inset ring-white/[0.06] transition-shadow hover:ring-white/20",
                big && "col-span-2 sm:aspect-[10/4]"
              )}
              style={{ background: bg }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-white drop-shadow-sm">{a.symbol}</span>
              </div>
              <div>
                <div className="text-[11px] font-medium tabular-nums text-white/80">
                  {big ? a.name : a.category}
                </div>
                <div
                  className={cn(
                    "font-bold tabular-nums text-white drop-shadow-sm",
                    big ? "mt-1 text-2xl" : "text-[15px]"
                  )}
                >
                  {fmtPct(change)}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
