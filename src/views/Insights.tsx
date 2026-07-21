import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, ShieldAlert, Activity } from "lucide-react";
import { assets, categories, getInsight } from "../lib/data";
import { useStore } from "../store";
import { fmtPct } from "../lib/format";
import { Card, AssetTile, Badge, Button } from "../components/ui";
import { cn } from "../utils/cn";

function scoreColor(v: number) {
  if (v < 40) return "#34d399";
  if (v < 65) return "#e0b84a";
  return "#f4635f";
}

export function Insights() {
  const live = useStore((s) => s.live);
  const openAsset = useStore((s) => s.openAsset);

  const data = useMemo(
    () =>
      assets.map((a) => ({
        a,
        ins: getInsight(a),
        change: live[a.id]?.change ?? a.change24h,
      })),
    [live]
  );

  const bullish = data.filter((d) => d.ins.sentiment === "Bullish").length;
  const bearish = data.filter((d) => d.ins.sentiment === "Bearish").length;
  const neutral = data.filter((d) => d.ins.sentiment === "Neutral").length;
  const total = data.length;
  const avgRisk = Math.round(data.reduce((s, d) => s + d.ins.riskScore, 0) / total);
  const avgConf = Math.round(data.reduce((s, d) => s + d.ins.confidence, 0) / total);
  const mood = bullish > bearish ? "Risk-On" : bearish > bullish ? "Risk-Off" : "Balanced";
  const moodTone = bullish > bearish ? "gain" : bearish > bullish ? "loss" : "neutral";

  const deep = [...data].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];

  const categoryPicks = categories
    .map((c) => {
      const inCat = data.filter((d) => d.a.category === c);
      const top = [...inCat].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
      return { c, top };
    })
    .filter((x) => x.top);

  const seg = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          <Sparkles size={22} className="text-accent" /> AI Insights
        </h1>
        <p className="mt-1 text-[14px] text-white/45">Market intelligence synthesized across every asset.</p>
      </div>

      {/* Market pulse */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[12px] uppercase tracking-wider text-white/40">Market Pulse</div>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-[26px] font-semibold tracking-tight text-white">{mood}</span>
                <Badge tone={moodTone as "gain" | "loss" | "neutral"}>{bullish}/{bearish}/{neutral}</Badge>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">Avg Risk</div>
                <div className="mt-1 text-[20px] font-semibold tabular-nums" style={{ color: scoreColor(avgRisk) }}>{avgRisk}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">Confidence</div>
                <div className="mt-1 text-[20px] font-semibold tabular-nums text-white">{avgConf}%</div>
              </div>
            </div>
          </div>

          {/* Sentiment bar */}
          <div className="mt-6">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              <motion.div initial={{ width: 0 }} animate={{ width: seg(bullish) }} transition={{ duration: 0.7 }} className="bg-gain" />
              <motion.div initial={{ width: 0 }} animate={{ width: seg(neutral) }} transition={{ duration: 0.7, delay: 0.1 }} className="bg-white/20" />
              <motion.div initial={{ width: 0 }} animate={{ width: seg(bearish) }} transition={{ duration: 0.7, delay: 0.2 }} className="bg-loss" />
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-[12px]">
              <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-full bg-gain" /> Bullish {bullish}</span>
              <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-full bg-white/30" /> Neutral {neutral}</span>
              <span className="flex items-center gap-1.5 text-white/60"><span className="h-2 w-2 rounded-full bg-loss" /> Bearish {bearish}</span>
            </div>
          </div>
        </Card>

        {/* Deep dive */}
        {deep && (
          <Card className="flex flex-col p-5">
            <Badge tone="accent" className="mb-3 self-start"><Activity size={11} /> Biggest Mover</Badge>
            <div className="flex items-center gap-3">
              <AssetTile asset={deep.a} size={40} />
              <div>
                <div className="text-[15px] font-semibold text-white">{deep.a.symbol}</div>
                <div className={cn("text-[13px] tabular-nums", deep.change >= 0 ? "text-gain" : "text-loss")}>{fmtPct(deep.change)}</div>
              </div>
              <Badge tone={deep.ins.sentiment === "Bullish" ? "gain" : deep.ins.sentiment === "Bearish" ? "loss" : "neutral"} className="ml-auto">
                {deep.ins.sentiment}
              </Badge>
            </div>
            <p className="mt-3 line-clamp-4 text-[12.5px] leading-relaxed text-white/55">{deep.ins.summary}</p>
            <Button variant="secondary" size="sm" className="mt-4 self-start" onClick={() => openAsset(deep.a.id)}>
              Full analysis
            </Button>
          </Card>
        )}
      </div>

      {/* Category deep dives */}
      <div>
        <h2 className="mb-4 text-[16px] font-semibold text-white">Signals by market</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPicks.map(({ c, top }) => (
            <Card key={c} hover className="cursor-pointer p-4" onClick={() => openAsset(top.a.id)}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-white">{c}</span>
                <span className={cn("text-[12px] tabular-nums", top.change >= 0 ? "text-gain" : "text-loss")}>{fmtPct(top.change)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                <AssetTile asset={top.a} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-white">{top.a.name}</div>
                  <div className="text-[11px] text-white/40">{top.ins.sentiment} · risk {top.ins.riskScore}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span>Confidence</span>
                  <span className="tabular-nums text-white/70">{top.ins.confidence}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${top.ins.confidence}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Asset signal list */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-white">Asset Signals</h2>
          <span className="text-[12px] text-white/35">{total} assets analyzed</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[...data]
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
            .slice(0, 10)
            .map(({ a, ins, change }) => (
              <button
                key={a.id}
                onClick={() => openAsset(a.id)}
                className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-white/[0.02]"
              >
                <AssetTile asset={a} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white">{a.symbol}</span>
                    <span className="text-[12px] text-white/40">{a.name}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={cn("flex items-center gap-1 text-[11px] font-medium", ins.sentiment === "Bullish" ? "text-gain" : ins.sentiment === "Bearish" ? "text-loss" : "text-white/50")}>
                      {ins.sentiment === "Bullish" ? <TrendingUp size={11} /> : ins.sentiment === "Bearish" ? <TrendingDown size={11} /> : <ShieldAlert size={11} />}
                      {ins.sentiment}
                    </span>
                    <span className="h-3 w-px bg-white/10" />
                    <span className="text-[11px] text-white/40">Risk</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full" style={{ width: `${ins.riskScore}%`, background: scoreColor(ins.riskScore) }} />
                    </div>
                  </div>
                </div>
                <div className="hidden w-40 sm:block">
                  <div className="flex items-center justify-between text-[11px] text-white/40">
                    <span>Confidence</span>
                    <span className="tabular-nums text-white/70">{ins.confidence}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${ins.confidence}%` }} />
                  </div>
                </div>
                <span className={cn("w-16 text-right text-[13px] font-semibold tabular-nums", change >= 0 ? "text-gain" : "text-loss")}>
                  {fmtPct(change)}
                </span>
              </button>
            ))}
        </div>
      </Card>
    </div>
  );
}
