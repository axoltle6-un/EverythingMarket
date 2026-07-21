import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, Sparkles, Globe, Building2 } from "lucide-react";
import { assets, news, getAsset } from "../lib/data";
import { useStore } from "../store";
import { COMPANY_COUNT, PREVIEW_COMPANIES, colorFor } from "../lib/universe";
import { fmtPrice, fmtPct, fmtCompact, timeAgo } from "../lib/format";
import { Button, SectionHeader, Card, AssetTile, ChangeChip, Badge, Monogram } from "../components/ui";
import { AssetCard } from "../components/AssetCard";
import { MarketTicker } from "../components/MarketTicker";
import { Heatmap } from "../components/Heatmap";
import { Sparkline } from "../components/Sparkline";
import { cn } from "../utils/cn";

const OVERVIEW = ["bitcoin", "ethereum", "gold", "silver", "oil", "nasdaq", "sp500", "dxy"];

const directoryPreview = PREVIEW_COMPANIES.map((c) => ({
  symbol: c.symbol,
  name: c.name,
  sector: c.sector,
  exchange: c.exchange,
  price: c.price,
  change: c.change,
  marketCap: c.marketCap,
  csym: c.currencySymbol,
  color: colorFor(c.sector),
}));

function useLive() {
  return useStore((s) => s.live);
}

function TrendingCard({ id }: { id: string }) {
  const live = useLive();
  const openAsset = useStore((s) => s.openAsset);
  const a = getAsset(id)!;
  const l = live[id];
  const change = l?.change ?? a.change24h;
  const price = l?.price ?? a.price;
  const up = change >= 0;
  const spark = useMemo(() => {
    const pts: number[] = [];
    let v = a.price;
    for (let i = 0; i < 24; i++) {
      v = v * (1 + (Math.sin(i / 3 + id.length) + change / 100) * 0.01);
      pts.push(v);
    }
    return pts;
  }, [id]);

  return (
    <button
      onClick={() => openAsset(id)}
      className="group w-64 shrink-0 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition-colors hover:border-white/[0.13] hover:bg-white/[0.045]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AssetTile asset={a} size={36} />
          <div>
            <div className="text-[14px] font-semibold text-white">{a.symbol}</div>
            <div className="text-[11px] text-white/40">{a.category}</div>
          </div>
        </div>
        <ChangeChip value={change} />
      </div>
      <div className="mt-3 text-[20px] font-semibold tabular-nums text-white">{fmtPrice(price)}</div>
      <div className="mt-2 h-12 w-full opacity-90">
        <Sparkline data={spark} positive={up} height={48} />
      </div>
    </button>
  );
}

function LeaderRow({ id, rank }: { id: string; rank: number }) {
  const live = useLive();
  const openAsset = useStore((s) => s.openAsset);
  const a = getAsset(id)!;
  const change = live[id]?.change ?? a.change24h;
  const up = change >= 0;
  const spark = useMemo(() => {
    const pts: number[] = [];
    let v = a.price;
    for (let i = 0; i < 18; i++) {
      v = v * (1 + (Math.sin(i / 2.5 + id.length) + change / 120) * 0.012);
      pts.push(v);
    }
    return pts;
  }, [id, change]);
  return (
    <button
      onClick={() => openAsset(id)}
      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
    >
      <span className="w-4 text-center text-[12px] font-semibold text-white/30">{rank}</span>
      <AssetTile asset={a} size={32} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-white">{a.symbol}</div>
        <div className="truncate text-[11px] text-white/40">{a.name}</div>
      </div>
      <div className="hidden h-7 w-20 sm:block">
        <Sparkline data={spark} positive={up} height={28} />
      </div>
      <div className="w-16 text-right">
        <ChangeChip value={change} />
      </div>
    </button>
  );
}

function GroupCard({
  title,
  ids,
  icon,
}: {
  title: string;
  ids: string[];
  icon: string;
}) {
  const live = useLive();
  const openAsset = useStore((s) => s.openAsset);
  const changes = ids.map((id) => live[id]?.change ?? getAsset(id)!.change24h);
  const avg = changes.reduce((s, c) => s + c, 0) / changes.length;
  const up = avg >= 0;
  return (
    <Card hover className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-[13px] font-semibold text-white">{title}</span>
        </div>
        <ChangeChip value={avg} />
      </div>
      <div className="mt-3 space-y-1">
        {ids.map((id) => {
          const a = getAsset(id)!;
          const change = live[id]?.change ?? a.change24h;
          return (
            <button
              key={id}
              onClick={() => openAsset(id)}
              className="flex w-full items-center justify-between rounded-lg px-1.5 py-1 text-left hover:bg-white/[0.04]"
            >
              <span className="text-[12px] text-white/55">{a.symbol}</span>
              <span className={cn("text-[12px] tabular-nums", up ? "text-white/70" : "text-white/70")}>
                <span className={change >= 0 ? "text-gain" : "text-loss"}>{fmtPct(change)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Dashboard() {
  const setView = useStore((s) => s.setView);
  const openAsset = useStore((s) => s.openAsset);
  const live = useLive();
  const trending = ["solana", "nvidia", "ethereum", "silver", "natgas", "amd"];

  const ranked = [...assets].sort(
    (a, b) => (live[b.id]?.change ?? b.change24h) - (live[a.id]?.change ?? a.change24h)
  );
  const gainers = ranked.slice(0, 5).map((a) => a.id);
  const losers = ranked.slice(-5).reverse().map((a) => a.id);
  const featured = news.find((n) => n.featured) ?? news[0];
  const featuredAsset = getAsset(featured.assetIds[0]);

  return (
    <div className="space-y-12 pb-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.06] px-6 py-12 sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(79,139,255,0.22), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-48 left-10 h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.16), transparent 70%)" }}
        />
        <div className="relative max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tone="accent" className="mb-5">
              <Sparkles size={11} /> Live · 9 markets in one view
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[42px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[64px]"
          >
            Everything
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(100deg,#4f8bff,#34d399)" }}
            >
              Market.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-[17px]"
          >
            Track every market in one beautiful dashboard. Crypto, stocks, metals, forex and
            more — with AI insight and real-time clarity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button variant="primary" size="lg" onClick={() => setView("markets")}>
              <Globe size={17} /> Explore Markets
            </Button>
            <Button variant="outline" size="lg" onClick={() => setView("watchlist")}>
              <Star size={17} /> Create Watchlist
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-white/45"
          >
            {[
              [COMPANY_COUNT.toLocaleString(), "Companies listed"],
              ["9", "Asset classes"],
              ["AI", "Market insight"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="text-[15px] font-semibold text-white/80">{v}</div>
                <div>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="-mt-4">
        <MarketTicker />
      </div>

      {/* Market Overview */}
      <Reveal>
        <div>
          <SectionHeader
            title="Market Overview"
            subtitle="A glance at the markets that move the world."
            action={
              <Button variant="ghost" size="sm" onClick={() => setView("markets")}>
                Explore all <ArrowRight size={14} />
              </Button>
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW.map((id, i) => (
              <AssetCard key={id} asset={getAsset(id)!} index={i} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Trending */}
      <Reveal>
        <div>
          <SectionHeader title="Trending Assets" subtitle="What the market is watching right now." />
          <div className="flex gap-3 overflow-x-auto no-scrollbar mask-fade-x pb-2">
            {trending.map((id) => (
              <TrendingCard key={id} id={id} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Gainers / Losers */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-3">
            <div className="flex items-center justify-between px-2.5 pb-1 pt-1">
              <span className="flex items-center gap-2 text-[14px] font-semibold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gain/15 text-gain">
                  <ArrowUpRight size={14} />
                </span>
                Top Gainers
              </span>
              <span className="text-[12px] text-white/35">24h</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {gainers.map((id, i) => (
                <LeaderRow key={id} id={id} rank={i + 1} />
              ))}
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center justify-between px-2.5 pb-1 pt-1">
              <span className="flex items-center gap-2 text-[14px] font-semibold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-loss/15 text-loss">
                  <ArrowUpRight size={14} className="rotate-180" />
                </span>
                Top Losers
              </span>
              <span className="text-[12px] text-white/35">24h</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {losers.map((id, i) => (
                <LeaderRow key={id} id={id} rank={i + 1} />
              ))}
            </div>
          </Card>
        </div>
      </Reveal>

      {/* Global Markets */}
      <Reveal>
        <div>
          <SectionHeader title="Global Markets" subtitle="Performance across every region and asset class." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <GroupCard title="United States" icon="🇺🇸" ids={["nasdaq", "sp500", "dow", "sox"]} />
            <GroupCard title="Europe" icon="🇪🇺" ids={["ftse", "dax", "cac", "estox"]} />
            <GroupCard title="Eurozone" icon="💶" ids={["estox", "aex", "ibex", "ftsemib"]} />
            <GroupCard title="Nordics" icon="❄️" ids={["omxs30", "obx", "ftse", "dax"]} />
            <GroupCard title="Japan & Korea" icon="🗾" ids={["nikkei", "topix", "kospi", "kosdaq"]} />
            <GroupCard title="Greater China" icon="🇨🇳" ids={["hangseng", "shanghai", "csi300", "szsecomp"]} />
            <GroupCard title="South Asia" icon="🇮🇳" ids={["nifty", "sensex", "niftybank", "colombo"]} />
            <GroupCard title="Southeast Asia" icon="🌴" ids={["straits", "jakarta", "set", "klci"]} />
            <GroupCard title="Taiwan & Vietnam" icon="🛸" ids={["taiex", "vnindex", "psei"]} />
            <GroupCard title="Americas" icon="🌎" ids={["tsx", "bovespa", "ipc", "merval"]} />
            <GroupCard title="Middle East" icon="🕌" ids={["tadawul", "dfm", "adx", "telaviv"]} />
            <GroupCard title="Oceania & Africa" icon="🌍" ids={["asx200", "nzx50", "jse", "egx30"]} />
          </div>
        </div>
      </Reveal>

      {/* Company directory teaser */}
      <Reveal>
        <div>
          <SectionHeader
            title="Global Companies"
            subtitle={`${COMPANY_COUNT.toLocaleString()} listed companies across every major exchange.`}
            action={
              <Button variant="ghost" size="sm" onClick={() => setView("markets")}>
                Browse all <ArrowRight size={14} />
              </Button>
            }
            icon={<Building2 size={18} className="text-white/50" />}
          />
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/35">
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-3 py-3 font-medium">Sector</th>
                    <th className="px-3 py-3 font-medium">Exchange</th>
                    <th className="px-3 py-3 text-right font-medium">Price</th>
                    <th className="px-3 py-3 text-right font-medium">24h</th>
                    <th className="px-4 py-3 text-right font-medium">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {directoryPreview.map((c) => {
                    const up = c.change >= 0;
                    return (
                      <tr
                        key={c.symbol}
                        onClick={() => useStore.getState().openAsset("u:" + c.symbol)}
                        className="cursor-pointer border-t border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <Monogram text={c.symbol} size={32} />
                            <div>
                              <div className="text-[13px] font-semibold text-white">{c.symbol}</div>
                              <div className="max-w-[200px] truncate text-[11.5px] text-white/45">{c.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[12px] text-white/55">{c.sector}</td>
                        <td className="px-3 py-2.5">
                          <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[11px] text-white/55">{c.exchange}</span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-[13px] tabular-nums text-white">
                          <span className="text-white/45">{c.csym}</span>
                          {fmtPrice(c.price)}
                        </td>
                        <td className={cn("px-3 py-2.5 text-right text-[13px] font-medium tabular-nums", up ? "text-gain" : "text-loss")}>
                          {fmtPct(c.change)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[13px] tabular-nums text-white/70">${fmtCompact(c.marketCap)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Heatmap */}
      <Reveal>
        <div>
          <SectionHeader
            title="Market Heatmap"
            subtitle="Color intensity reflects 24h movement."
          />
          <Card className="p-4">
            <Heatmap />
          </Card>
        </div>
      </Reveal>

      {/* News teaser */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card hover className="flex cursor-pointer flex-col justify-between p-6 lg:col-span-2" onClick={() => setView("news")}>
            <div>
              <div className="flex items-center gap-2 text-[12px] text-white/40">
                <Badge tone="accent">Featured</Badge>
                <span>{featured.source}</span>
                <span>·</span>
                <span>{timeAgo(featured.ts)}</span>
              </div>
              <h3 className="mt-4 text-[22px] font-semibold leading-snug tracking-tight text-white sm:text-[26px]">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/55">
                {featured.summary}
              </p>
            </div>
            {featuredAsset && (
              <div className="mt-6 flex items-center gap-3">
                <AssetTile asset={featuredAsset} size={36} />
                <div>
                  <div className="text-[14px] font-semibold text-white">{featuredAsset.symbol}</div>
                  <div className="text-[12px] tabular-nums text-white/50">
                    {fmtPrice(live[featuredAsset.id]?.price ?? featuredAsset.price)} ·{" "}
                    {fmtPct(live[featuredAsset.id]?.change ?? featuredAsset.change24h)}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => openAsset(featuredAsset.id)}>
                  View asset <ArrowRight size={13} />
                </Button>
              </div>
            )}
          </Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-white">Latest News</span>
              <Button variant="ghost" size="sm" onClick={() => setView("news")}>
                All <ArrowRight size={13} />
              </Button>
            </div>
            {news.slice(1, 4).map((n) => (
              <button
                key={n.id}
                onClick={() => setView("news")}
                className="block w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 text-left transition-colors hover:bg-white/[0.04]"
              >
                <div className="line-clamp-2 text-[13px] font-medium leading-snug text-white/90">
                  {n.title}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40">
                  <span>{n.source}</span>
                  <span>·</span>
                  <span>{timeAgo(n.ts)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
