import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Building2, ChevronDown } from "lucide-react";
import { assets, categories, type Category } from "../lib/data";
import {
  getCompanies,
  COMPANY_COUNT,
  UNIVERSE_MARKET_CAP,
  SECTORS,
  REGIONS,
  type Company,
} from "../lib/universe";
import { useStore } from "../store";
import { fmtCompact, fmtPrice, fmtPct } from "../lib/format";
import { AssetCard } from "../components/AssetCard";
import { Monogram } from "../components/ui";
import { getAsset } from "../lib/data";
import { cn } from "../utils/cn";

type Filter = "All" | Category;
type Sort = "cap" | "gainers" | "losers" | "name";

function StockDirectory() {
  const openAsset = useStore((s) => s.openAsset);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [sector, setSector] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("cap");
  const [visible, setVisible] = useState(50);
  const [all, setAll] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Build the full 100k universe once, deferred so the page paints first.
  useEffect(() => {
    const id = setTimeout(() => {
      setAll(getCompanies());
      setLoading(false);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const query = dq.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = all;
    if (sector !== "All") list = list.filter((c) => c.sector === sector);
    if (region !== "All") list = list.filter((c) => c.region === region);
    if (query) {
      list = list.filter((c) => {
        const sym = c.symbol.toLowerCase();
        const nm = c.name.toLowerCase();
        return sym.includes(query) || nm.includes(query);
      });
    }
    const arr = list.slice();
    if (sort === "cap") arr.sort((a, b) => b.marketCap - a.marketCap);
    else if (sort === "gainers") arr.sort((a, b) => b.change - a.change);
    else if (sort === "losers") arr.sort((a, b) => a.change - b.change);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [all, query, sector, region, sort]);

  const shown = filtered.slice(0, visible);
  const selectCls =
    "h-9 appearance-none rounded-lg border border-white/[0.08] bg-white/[0.03] pl-3 pr-8 text-[13px] text-white/80 focus:outline-none focus:border-white/20";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setVisible(50);
              }}
              placeholder={`Search ${COMPANY_COUNT.toLocaleString()} companies…`}
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-[13px] text-white placeholder:text-white/35 focus:border-white/20 focus:outline-none"
            />
          </div>
          <div className="relative">
            <select value={sector} onChange={(e) => { setSector(e.target.value); setVisible(50); }} className={selectCls} aria-label="Sector">
              <option value="All" className="bg-ink-800">All sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s} className="bg-ink-800">{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>
          <div className="relative">
            <select value={region} onChange={(e) => { setRegion(e.target.value); setVisible(50); }} className={selectCls} aria-label="Region">
              <option value="All" className="bg-ink-800">All regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r} className="bg-ink-800">{r}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls} aria-label="Sort">
              <option value="cap" className="bg-ink-800">Market cap</option>
              <option value="gainers" className="bg-ink-800">Top gainers</option>
              <option value="losers" className="bg-ink-800">Top losers</option>
              <option value="name" className="bg-ink-800">Name A–Z</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2 px-1 text-[12px] text-white/40">
          <Building2 size={12} />
          {loading ? "Indexing companies…" : `${filtered.length.toLocaleString()} of ${COMPANY_COUNT.toLocaleString()} companies`}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
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
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/[0.04]">
                    <td className="px-4 py-3" colSpan={6}>
                      <div className="shimmer h-5 w-full rounded bg-white/[0.04]" />
                    </td>
                  </tr>
                ))
              ) : (
                shown.map((c) => {
                  const up = c.change >= 0;
                  return (
                    <tr
                      key={c.symbol}
                      onClick={() => openAsset("u:" + c.symbol)}
                      className="cursor-pointer border-t border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Monogram text={c.symbol} size={32} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-white">{c.symbol}</span>
                            </div>
                            <div className="max-w-[200px] truncate text-[11.5px] text-white/45">{c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-white/55">{c.sector}</td>
                      <td className="px-3 py-2.5">
                        <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[11px] text-white/55">{c.exchange}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-[13px] tabular-nums text-white">
                        <span className="text-white/45">{c.currencySymbol}</span>
                        {fmtPrice(c.price)}
                      </td>
                      <td className={cn("px-3 py-2.5 text-right text-[13px] font-medium tabular-nums", up ? "text-gain" : "text-loss")}>
                        {fmtPct(c.change)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-[13px] tabular-nums text-white/70">
                        ${fmtCompact(c.marketCap)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && shown.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-white/40">
            No companies match your filters.
          </div>
        )}

        {!loading && shown.length < filtered.length && (
          <div className="border-t border-white/[0.06] p-3 text-center">
            <button
              onClick={() => setVisible((v) => v + 50)}
              className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-5 py-2 text-[13px] font-medium text-white/80 transition-colors hover:border-white/25 hover:text-white"
            >
              Load more ({(filtered.length - shown.length).toLocaleString()} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Markets() {
  const [filter, setFilter] = useState<Filter>("All");
  const live = useStore((s) => s.live);

  const list = useMemo(
    () => (filter === "All" ? assets : assets.filter((a) => a.category === filter)),
    [filter]
  );
  const indexCount = assets.filter((a) => a.category === "Indices").length;

  const stats = useMemo(() => {
    const changes = assets.map((a) => live[a.id]?.change ?? a.change24h);
    const adv = changes.filter((c) => c > 0).length;
    const dec = changes.filter((c) => c < 0).length;
    const avg = changes.reduce((s, c) => s + c, 0) / changes.length;
    return { adv, dec, avg, cap: UNIVERSE_MARKET_CAP };
  }, [live]);

  const filters: Filter[] = ["All", ...categories];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Markets</h1>
        <p className="mt-1 text-[14px] text-white/45">
          Every asset class in one place — plus a directory of {COMPANY_COUNT.toLocaleString()} listed companies.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Companies", value: COMPANY_COUNT.toLocaleString() },
          { label: "Market Cap", value: "$" + fmtCompact(stats.cap) },
          { label: "Advancers", value: stats.adv, tone: "text-gain" },
          { label: "Decliners", value: stats.dec, tone: "text-loss" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-wider text-white/40">{s.label}</div>
            <div className={cn("mt-1.5 text-[20px] font-semibold tabular-nums", s.tone ?? "text-white")}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              filter === f
                ? "bg-white text-ink-950"
                : "bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            {f}
            {f === "Stocks" && (
              <span className={cn("rounded-md px-1 text-[10px]", filter === f ? "bg-black/10" : "bg-white/10")}>
                {COMPANY_COUNT > 999 ? (COMPANY_COUNT / 1000).toFixed(0) + "K" : COMPANY_COUNT}
              </span>
            )}
            {f === "Indices" && (
              <span className={cn("rounded-md px-1 text-[10px]", filter === f ? "bg-black/10" : "bg-white/10")}>
                {indexCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filter === "Stocks" ? (
        <StockDirectory />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((a, i) => (
            <AssetCard key={a.id} asset={getAsset(a.id)!} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
