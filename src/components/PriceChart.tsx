import { useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import type { Asset } from "../lib/data";
import { genPriceSeries, fmtPrice } from "../lib/format";
import { useStore, TIMEFRAMES, type Timeframe } from "../store";
import { cn } from "../utils/cn";

const TF_POINTS: Record<Timeframe, number> = {
  "1H": 30,
  "24H": 48,
  "7D": 56,
  "30D": 64,
  "90D": 90,
  "1Y": 120,
  ALL: 160,
};
const TF_TREND: Record<Timeframe, number> = {
  "1H": 0.35,
  "24H": 1,
  "7D": 2.6,
  "30D": 5.5,
  "90D": 11,
  "1Y": 19,
  ALL: 26,
};
const TF_VOL: Record<Timeframe, number> = {
  "1H": 0.005,
  "24H": 0.011,
  "7D": 0.02,
  "30D": 0.03,
  "90D": 0.045,
  "1Y": 0.06,
  ALL: 0.08,
};

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value as number;
  return (
    <div className="rounded-lg border border-white/10 bg-ink-800/95 px-3 py-2 shadow-xl backdrop-blur">
      <div className="text-[15px] font-semibold tabular-nums text-white">{fmtPrice(v)}</div>
      <div className="text-[11px] text-white/40">Historical point</div>
    </div>
  );
}

export function PriceChart({ asset }: { asset: Asset }) {
  const timeframe = useStore((s) => s.timeframe);
  const setTimeframe = useStore((s) => s.setTimeframe);

  const data = useMemo(() => {
    const points = TF_POINTS[timeframe];
    const trend = asset.change24h * TF_TREND[timeframe];
    const series = genPriceSeries(
      asset.id + "-" + timeframe,
      asset.price,
      points,
      trend,
      TF_VOL[timeframe]
    );
    return series.map((p, i) => ({ i, p }));
  }, [asset.id, asset.price, asset.change24h, timeframe]);

  const positive = (data[data.length - 1]?.p ?? asset.price) >= (data[0]?.p ?? asset.price);
  const color = positive ? "#34d399" : "#f4635f";
  const gid = "pc-" + asset.id;

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              timeframe === tf
                ? "bg-white/[0.08] text-white"
                : "text-white/45 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="h-[260px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="p"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gid})`}
              isAnimationActive
              animationDuration={600}
              activeDot={{ r: 4, fill: color, stroke: "#0c0e12", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
