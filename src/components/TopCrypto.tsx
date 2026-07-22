import { useStore } from "../store";
import { fmtPrice, fmtCompact, fmtPct } from "../lib/format";
import { Card, Badge } from "./ui";
import { cn } from "../utils/cn";

export function TopCrypto({ limit = 24 }: { limit?: number }) {
  const coins = useStore((s) => s.liveCrypto).slice(0, limit);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
          Top Cryptocurrencies
        </h3>
        <Badge tone="gain" className="gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gain opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gain" />
          </span>
          Live · CoinGecko
        </Badge>
      </div>

      {coins.length === 0 ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer h-9 w-full rounded-lg bg-white/[0.04]" />
          ))}
        </div>
      ) : (
        <div className="max-h-[460px] overflow-y-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="sticky top-0 bg-ink-900/95 backdrop-blur">
              <tr className="text-[11px] uppercase tracking-wider text-white/35">
                <th className="px-4 py-2.5 font-medium">#</th>
                <th className="px-2 py-2.5 font-medium">Asset</th>
                <th className="px-3 py-2.5 text-right font-medium">Price</th>
                <th className="px-3 py-2.5 text-right font-medium">24h</th>
                <th className="px-4 py-2.5 text-right font-medium">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((c, i) => {
                const up = c.change >= 0;
                return (
                  <tr key={c.id} className="border-t border-white/[0.04] transition-colors hover:bg-white/[0.025]">
                    <td className="px-4 py-2.5 text-[12px] tabular-nums text-white/35">{i + 1}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-[26px] w-[26px] shrink-0">
                          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold text-white/70">
                            {c.symbol.slice(0, 2)}
                          </span>
                          <img
                            src={c.image}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                            }}
                            className="absolute inset-0 h-full w-full rounded-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-white">{c.symbol}</div>
                          <div className="max-w-[150px] truncate text-[11.5px] text-white/45">{c.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right text-[13px] font-medium tabular-nums text-white">
                      {fmtPrice(c.price)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={cn("text-[13px] tabular-nums", up ? "text-gain" : "text-loss")}>
                        {fmtPct(c.change)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-[12.5px] tabular-nums text-white/55">
                      ${fmtCompact(c.volume)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
