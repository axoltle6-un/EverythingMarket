import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  YAxis,
} from "recharts";
import { TrendingUp, Wallet } from "lucide-react";
import { holdings, getAsset } from "../lib/data";
import { useStore } from "../store";
import { fmtPrice, fmtCompact, fmtPct, fmtSigned, genPriceSeries } from "../lib/format";
import { Card, AssetTile, Badge } from "../components/ui";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { cn } from "../utils/cn";

export function Portfolio() {
  const live = useStore((s) => s.live);
  const openAsset = useStore((s) => s.openAsset);

  const rows = useMemo(
    () =>
      holdings.map((h) => {
        const a = getAsset(h.assetId)!;
        const price = live[h.assetId]?.price ?? a.price;
        const value = price * h.amount;
        const cost = h.avgCost * h.amount;
        const pl = value - cost;
        const plPct = (pl / cost) * 100;
        const prev = a.prevClose * h.amount;
        const dayPL = value - prev;
        return { a, h, price, value, cost, pl, plPct, dayPL, prevValue: prev };
      }),
    [live]
  );

  const totalValue = rows.reduce((s, r) => s + r.value, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = (totalPL / totalCost) * 100;
  const dayPL = rows.reduce((s, r) => s + r.dayPL, 0);
  const prevTotal = rows.reduce((s, r) => s + r.prevValue, 0);
  const dayPLPct = (dayPL / prevTotal) * 100;

  const pie = rows.map((r) => ({ name: r.a.symbol, value: r.value, color: r.a.color }));
  const perf = useMemo(
    () =>
      genPriceSeries("portfolio-perf", totalValue, 90, totalPLPct * 1.4, 0.018).map((v, i) => ({ i, v })),
    [totalValue, totalPLPct]
  );
  const perfUp = totalPL >= 0;
  const perfColor = perfUp ? "#34d399" : "#f4635f";

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Portfolio</h1>
        <p className="mt-1 text-[14px] text-white/45">Your positions, performance and allocation.</p>
      </div>

      {/* Top summary */}
      <Card className="relative overflow-hidden p-6">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: perfUp ? "radial-gradient(circle,rgba(52,211,153,0.16),transparent 70%)" : "radial-gradient(circle,rgba(244,99,95,0.16),transparent 70%)" }}
        />
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-white/40">
              <Wallet size={13} /> Total Value
            </div>
            <div className="mt-2 text-[32px] font-semibold tracking-tight tabular-nums text-white">
              <AnimatedNumber value={totalValue} format={(n) => "$" + fmtCompact(n)} />
            </div>
            <div className="mt-1 text-[13px] tabular-nums text-white/45">
              Invested ${fmtCompact(totalCost)}
            </div>
          </div>
          <SummaryStat label="Today's P/L" value={dayPL} pct={dayPLPct} />
          <SummaryStat label="Total P/L" value={totalPL} pct={totalPLPct} />
          <div>
            <div className="text-[12px] uppercase tracking-wider text-white/40">Best Position</div>
            {(() => {
              const best = [...rows].sort((a, b) => b.plPct - a.plPct)[0];
              return (
                <button onClick={() => openAsset(best.a.id)} className="mt-2 flex items-center gap-2 text-left">
                  <AssetTile asset={best.a} size={32} />
                  <div>
                    <div className="text-[15px] font-semibold text-white">{best.a.symbol}</div>
                    <div className="text-[13px] tabular-nums text-gain">{fmtPct(best.plPct)}</div>
                  </div>
                </button>
              );
            })()}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Performance */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-white">Performance</h3>
              <p className="text-[12px] text-white/40">90-day portfolio value</p>
            </div>
            <Badge tone={perfUp ? "gain" : "loss"}>
              <TrendingUp size={11} className={perfUp ? "" : "rotate-180"} /> {fmtPct(totalPLPct)}
            </Badge>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perf} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="perf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={perfColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={perfColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
                  content={({ active, payload }: any) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-white/10 bg-ink-800/95 px-3 py-2 text-[13px] font-semibold tabular-nums text-white shadow-xl">
                        ${fmtCompact(payload[0].value)}
                      </div>
                    ) : null
                  }
                  cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
                <Area type="monotone" dataKey="v" stroke={perfColor} strokeWidth={2} fill="url(#perf)" animationDuration={700} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Allocation */}
        <Card className="p-5">
          <h3 className="mb-4 text-[15px] font-semibold text-white">Allocation</h3>
          <div className="relative h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                  animationDuration={700}
                >
                  {pie.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-white/10 bg-ink-800/95 px-3 py-2 text-[13px] text-white shadow-xl">
                        <span className="font-semibold">{payload[0].name}</span>{" "}
                        <span className="tabular-nums text-white/60">
                          {((payload[0].value / totalValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] text-white/40">Holdings</span>
              <span className="text-[18px] font-semibold tabular-nums text-white">{rows.length}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {pie.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-[12px]">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="text-white/60">{p.name}</span>
                <span className="ml-auto tabular-nums text-white/40">
                  {((p.value / totalValue) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Holdings */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h3 className="text-[15px] font-semibold text-white">Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-white/35">
                <th className="px-5 py-3 font-medium">Asset</th>
                <th className="px-3 py-3 text-right font-medium">Amount</th>
                <th className="px-3 py-3 text-right font-medium">Avg Cost</th>
                <th className="px-3 py-3 text-right font-medium">Price</th>
                <th className="px-3 py-3 text-right font-medium">Value</th>
                <th className="px-5 py-3 text-right font-medium">P/L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.a.id}
                  onClick={() => openAsset(r.a.id)}
                  className="cursor-pointer border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <AssetTile asset={r.a} size={30} />
                      <div>
                        <div className="text-[13px] font-medium text-white">{r.a.symbol}</div>
                        <div className="text-[11px] text-white/40">{r.a.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-white/70">{r.h.amount}</td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-white/70">{fmtPrice(r.h.avgCost)}</td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-white/70">{fmtPrice(r.price)}</td>
                  <td className="px-3 py-3 text-right text-[13px] tabular-nums text-white">${fmtCompact(r.value)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className={cn("text-[13px] font-semibold tabular-nums", r.pl >= 0 ? "text-gain" : "text-loss")}>
                      {fmtSigned(r.pl)}
                    </div>
                    <div className={cn("text-[11px] tabular-nums", r.pl >= 0 ? "text-gain/70" : "text-loss/70")}>
                      {fmtPct(r.plPct)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SummaryStat({ label, value, pct }: { label: string; value: number; pct: number }) {
  const up = value >= 0;
  return (
    <div>
      <div className="text-[12px] uppercase tracking-wider text-white/40">{label}</div>
      <motion.div
        key={Math.round(value)}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className={cn("mt-2 text-[26px] font-semibold tracking-tight tabular-nums", up ? "text-gain" : "text-loss")}
      >
        {fmtSigned(value)}
      </motion.div>
      <div className={cn("mt-1 text-[13px] tabular-nums", up ? "text-gain/80" : "text-loss/80")}>{fmtPct(pct)}</div>
    </div>
  );
}
