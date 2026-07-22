import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Bell,
  Share2,
  Check,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Clock,
} from "lucide-react";
import { getAsset, getInsight, news, assets } from "../lib/data";
import { companyAsset } from "../lib/universe";
import { quoteSymbolFor, refreshQuote } from "../lib/pricedata";
import { finnhubReady } from "../lib/marketconfig";
import { useStore, usePrice } from "../store";
import { fmtPrice, fmtCompact, fmtPct, timeAgo } from "../lib/format";
import { Button, Card, AssetTile, ChangeChip, Badge, StatTile, MarketDot } from "../components/ui";
import { PriceChart } from "../components/PriceChart";
import { AnimatedNumber } from "../components/AnimatedNumber";

function scoreColor(v: number) {
  if (v < 40) return "#34d399";
  if (v < 65) return "#e0b84a";
  return "#f4635f";
}

function Meter({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-white/50">{label}</span>
        <span className="font-semibold tabular-nums text-white">{value}{sub ?? ""}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: scoreColor(value) }}
        />
      </div>
    </div>
  );
}

export function AssetDetail() {
  const selectedId = useStore((s) => s.selectedId);
  const back = useStore((s) => s.back);
  const toggleWatch = useStore((s) => s.toggleWatch);
  const isWatched = useStore((s) => s.isWatched);
  const setAlert = useStore((s) => s.setAlert);
  const pushToast = useStore((s) => s.pushToast);
  const setView = useStore((s) => s.setView);

  const asset = getAsset(selectedId) ?? companyAsset(selectedId ?? "") ?? getAsset("bitcoin")!;
  const { price, change, changeAbs } = usePrice(asset.id);
  const insight = useMemo(() => getInsight(asset), [asset.id]);
  const watched = isWatched(asset.id);
  const up = change >= 0;

  // Fetch a real quote for this asset when opened (stocks/ETFs/companies).
  useEffect(() => {
    let active = true;
    (async () => {
      if (!finnhubReady) return;
      if (useStore.getState().realIds.has(asset.id)) return; // already live
      const sym = quoteSymbolFor(asset.id, asset.symbol);
      if (!sym) return;
      const u = await refreshQuote(sym);
      if (active && u) useStore.getState().applyReal({ [asset.id]: u });
    })();
    return () => {
      active = false;
    };
  }, [asset.id, asset.symbol]);

  const related = useMemo(
    () => getRelated(asset.id, asset.category),
    [asset.id, asset.category]
  );
  const relatedNews = news.filter((n) => n.assetIds.includes(asset.id));
  const newsList = (relatedNews.length ? relatedNews : news).slice(0, 4);

  const rangePct = Math.min(100, Math.max(0, ((price - asset.low24h) / (asset.high24h - asset.low24h)) * 100));

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: asset.name, text: `${asset.name} on Everything Market` });
      else {
        await navigator.clipboard?.writeText(`Everything Market · ${asset.symbol}`);
        pushToast({ title: "Link copied to clipboard", tone: "success" });
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
      <button
        onClick={back}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <AssetTile asset={asset} size={52} />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[26px] font-semibold tracking-tight text-white">{asset.symbol}</h1>
              <Badge>{asset.category}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-2.5 text-[13px] text-white/45">
              <span>{asset.name}</span>
              <span>·</span>
              <MarketDot status={asset.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={watched ? "primary" : "secondary"} size="md" onClick={() => toggleWatch(asset.id)}>
            <Star size={15} className={watched ? "fill-white" : ""} />
            <span className="hidden sm:inline">{watched ? "Watching" : "Watch"}</span>
          </Button>
          <Button variant="secondary" size="md" onClick={() => setAlert(asset.id, price)}>
            <Bell size={15} />
            <span className="hidden sm:inline">Alert</span>
          </Button>
          <Button variant="secondary" size="md" onClick={share}>
            <Share2 size={15} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart + stats */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-[34px] font-semibold leading-none tracking-tight tabular-nums text-white sm:text-[40px]">
                  <AnimatedNumber value={price} format={fmtPrice} />
                </span>
                <ChangeChip value={change} abs={changeAbs} size="md" />
              </div>
              <div className="mt-2 text-[12px] text-white/40">
                24h range · {fmtPct(change, 2)} today
              </div>
            </div>
          </div>

          <div className="mt-5">
            <PriceChart asset={asset} />
          </div>

          {/* Day range */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/40">
              <span>Low {fmtPrice(asset.low24h)}</span>
              <span>24h Range</span>
              <span>High {fmtPrice(asset.high24h)}</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${rangePct}%`, background: up ? "var(--color-gain)" : "var(--color-loss)" }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 bg-white shadow"
                style={{ left: `${rangePct}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <StatTile label="Open" value={fmtPrice(asset.open24h)} />
            <StatTile label="Prev Close" value={fmtPrice(asset.prevClose)} />
            <StatTile label="High 24h" value={fmtPrice(asset.high24h)} />
            <StatTile label="Low 24h" value={fmtPrice(asset.low24h)} />
            <StatTile label="Market Cap" value={asset.marketCap ? "$" + fmtCompact(asset.marketCap) : "—"} />
            <StatTile label="Volume" value={asset.volume ? "$" + fmtCompact(asset.volume) : "—"} />
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Sparkles size={15} />
            </span>
            <span className="text-[15px] font-semibold text-white">AI Insights</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge tone={insight.sentiment === "Bullish" ? "gain" : insight.sentiment === "Bearish" ? "loss" : "neutral"}>
              {insight.sentiment === "Bullish" ? <TrendingUp size={11} /> : insight.sentiment === "Bearish" ? <TrendingDown size={11} /> : <ShieldAlert size={11} />}
              {insight.sentiment}
            </Badge>
            <span className="text-[12px] text-white/40">Market sentiment</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-white/65">{insight.summary}</p>

          <div className="mt-5 space-y-4">
            <Meter label="Risk Score" value={insight.riskScore} />
            <Meter label="Confidence" value={insight.confidence} sub="%" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-gain/15 bg-gain/[0.05] p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-gain">
                <Check size={13} /> Bullish factors
              </div>
              <ul className="space-y-1.5">
                {insight.bullish.map((b, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-white/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gain" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-loss/15 bg-loss/[0.05] p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-loss">
                <ShieldAlert size={13} /> Bearish factors
              </div>
              <ul className="space-y-1.5">
                {insight.bearish.map((b, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-white/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-loss" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* About */}
      <Card className="p-5">
        <h3 className="text-[14px] font-semibold text-white">About {asset.name}</h3>
        <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-white/55">{asset.about}</p>
      </Card>

      {/* Related + News */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <h3 className="px-1 pb-2 text-[14px] font-semibold text-white">Related Assets</h3>
          <div className="space-y-0.5">
            {related.map((id) => (
              <RelatedRow key={id} id={id} />
            ))}
          </div>
        </Card>
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-2">
            <h3 className="text-[14px] font-semibold text-white">Related News</h3>
            <Button variant="ghost" size="sm" onClick={() => setView("news")}>
              All news
            </Button>
          </div>
          <div className="space-y-1">
            {newsList.map((n) => (
              <button
                key={n.id}
                onClick={() => setView("news")}
                className="block w-full rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
              >
                <div className="line-clamp-1 text-[13.5px] font-medium text-white/90">{n.title}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                  <Clock size={11} />
                  {n.source} · {timeAgo(n.ts)} · {n.minutes} min read
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function getRelated(id: string, category: string): string[] {
  return assets
    .filter((a) => a.category === category && a.id !== id)
    .slice(0, 5)
    .map((a) => a.id);
}

function RelatedRow({ id }: { id: string }) {
  const live = useStore((s) => s.live);
  const openAsset = useStore((s) => s.openAsset);
  const asset = getAsset(id)!;
  const change = live[id]?.change ?? asset.change24h;
  return (
    <button
      onClick={() => openAsset(id)}
      className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-white/[0.04]"
    >
      <AssetTile asset={asset} size={30} />
      <span className="flex-1 text-[13px] font-medium text-white">{asset.symbol}</span>
      <ChangeChip value={change} />
    </button>
  );
}
