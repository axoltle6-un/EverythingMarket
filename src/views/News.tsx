import { useMemo, useState } from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import { news, getAsset, type NewsItem } from "../lib/data";
import { useStore } from "../store";
import { timeAgo, fmtPct } from "../lib/format";
import { Card, AssetTile, Badge, Button } from "../components/ui";
import { cn } from "../utils/cn";

const FILTERS = ["All", "Macro", "Crypto", "Stocks", "Indices", "Metals", "Commodities", "Forex"] as const;

export function News() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const openAsset = useStore((s) => s.openAsset);
  const live = useStore((s) => s.live);

  const featured = news.find((n) => n.featured) ?? news[0];
  const list = useMemo(
    () => news.filter((n) => n.id !== featured.id && (filter === "All" || n.category === filter)),
    [filter, featured.id]
  );

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">News</h1>
        <p className="mt-1 text-[14px] text-white/45">Curated market headlines, filtered by asset class.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              filter === f ? "bg-white text-ink-950" : "bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Featured */}
      <Card hover className="overflow-hidden p-0">
        <div className="relative p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle,rgba(79,139,255,0.18),transparent 70%)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 text-[12px] text-white/45">
              <Badge tone="accent">Featured</Badge>
              <span>{featured.source}</span>
              <span>·</span>
              <span>{timeAgo(featured.ts)}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {featured.minutes} min read</span>
            </div>
            <h2 className="mt-4 max-w-3xl text-[24px] font-semibold leading-snug tracking-tight text-white sm:text-[30px]">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/55">{featured.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {featured.assetIds.map((id) => {
                const a = getAsset(id);
                if (!a) return null;
                const up = (live[id]?.change ?? a.change24h) >= 0;
                return (
                  <button
                    key={id}
                    onClick={() => openAsset(id)}
                    className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pl-1 pr-3 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <AssetTile asset={a} size={24} />
                    <span className="text-[12px] font-medium text-white">{a.symbol}</span>
                    <span className={cn("text-[12px] tabular-nums", up ? "text-gain" : "text-loss")}>
                      {fmtPct(live[id]?.change ?? a.change24h)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((n) => (
          <NewsCard key={n.id} n={n} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ n }: { n: NewsItem }) {
  const openAsset = useStore((s) => s.openAsset);
  return (
    <Card hover className="flex cursor-pointer flex-col p-5">
      <div className="flex items-center gap-2 text-[11px] text-white/40">
        <Badge>{n.category}</Badge>
        <span>{n.source}</span>
      </div>
      <h3 className="mt-3 line-clamp-3 text-[15px] font-semibold leading-snug text-white">{n.title}</h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/50">{n.summary}</p>
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <div className="flex -space-x-2">
          {n.assetIds.slice(0, 3).map((id) => {
            const a = getAsset(id);
            return a ? <AssetTile key={id} asset={a} size={24} className="ring-2 ring-ink-900" /> : null;
          })}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          <span>{timeAgo(n.ts)}</span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {n.minutes}m
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 -mb-1 self-start px-2 text-white/50"
        onClick={(e) => {
          e.stopPropagation();
          const a = getAsset(n.assetIds[0]);
          if (a) openAsset(a.id);
        }}
      >
        Read & trade <ArrowUpRight size={13} />
      </Button>
    </Card>
  );
}
