import { useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft, TrendingUp, Building2 } from "lucide-react";
import { useStore } from "../store";
import { assets } from "../lib/data";
import { searchUniverse, COMPANY_COUNT, colorFor, type Company } from "../lib/universe";
import { fmtPrice, fmtCompact } from "../lib/format";
import { AssetTile, ChangeChip, Monogram } from "./ui";
import { cn } from "../utils/cn";

type Item =
  | { kind: "asset"; id: string; symbol: string; name: string; price: number; change: number; sub: string; color: string }
  | { kind: "company"; id: string; symbol: string; name: string; price: number; change: number; sub: string; color: string };

export function SearchModal() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const openAsset = useStore((s) => s.openAsset);
  const live = useStore((s) => s.live);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = dq.trim().toLowerCase();

  const { assetItems, companyItems } = useMemo(() => {
    if (!query) {
      return {
        assetItems: [...assets]
          .map((a) => ({ a, score: Math.abs(a.change24h) }))
          .sort((x, y) => y.score - x.score)
          .slice(0, 5)
          .map(({ a }) => a),
        companyItems: [] as Company[],
      };
    }
    return {
      assetItems: assets
        .map((a) => {
          const sym = a.symbol.toLowerCase();
          const name = a.name.toLowerCase();
          let score = -1;
          if (sym === query || name === query) score = 100;
          else if (sym.startsWith(query) || name.startsWith(query)) score = 82;
          else if (sym.includes(query) || name.includes(query)) score = 50;
          else if (a.category.toLowerCase().includes(query)) score = 20;
          return { a, score };
        })
        .filter((x) => x.score >= 0)
        .sort((x, y) => y.score - x.score)
        .slice(0, 5)
        .map((x) => x.a),
      companyItems: searchUniverse(query, 8),
    };
  }, [query]);

  const items: Item[] = useMemo(() => {
    const a: Item[] = assetItems.map((x) => ({
      kind: "asset",
      id: x.id,
      symbol: x.symbol,
      name: x.name,
      price: live[x.id]?.price ?? x.price,
      change: live[x.id]?.change ?? x.change24h,
      sub: x.category,
      color: x.color,
    }));
    const c: Item[] = companyItems.map((x) => ({
      kind: "company",
      id: "u:" + x.symbol,
      symbol: x.symbol,
      name: x.name,
      price: x.price,
      change: x.change,
      sub: `${x.exchange} · ${x.sector}`,
      color: colorFor(x.sector),
    }));
    return [...a, ...c];
  }, [assetItems, companyItems, live]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => setActive(0), [dq]);

  if (!open) return null;

  const select = (id: string) => {
    openAsset(id);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && items[active]) {
      e.preventDefault();
      select(items[active].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh] sm:pt-[14vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.1] bg-ink-900 shadow-2xl shadow-black/50"
            role="dialog"
            aria-modal="true"
            aria-label="Search markets"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
              <Search size={18} className="text-white/40" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search any company, stock, crypto, forex…"
                className="h-14 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-white/45"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <div className="px-3 py-8 text-center text-[13px] text-white/40">
                  No matches for “{q}”.
                </div>
              )}

              {assetItems.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-white/35">
                    <TrendingUp size={12} />
                    {query ? "Markets" : "Trending now"}
                  </div>
                  {items.slice(0, assetItems.length).map((it, i) => {
                    const a = assetItems.find((x) => x.id === it.id)!;
                    const isActive = i === active;
                    return (
                      <button
                        key={it.id}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => select(it.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                        )}
                      >
                        <AssetTile asset={a} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-[14px] font-medium text-white">{it.symbol}</span>
                            <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/40">
                              {it.sub}
                            </span>
                          </div>
                          <div className="truncate text-[12px] text-white/45">{it.name}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[13px] font-semibold tabular-nums text-white">
                            {fmtPrice(it.price)}
                          </span>
                          <ChangeChip value={it.change} />
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {companyItems.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-white/35">
                    <Building2 size={12} /> Companies ({COMPANY_COUNT.toLocaleString()} listed)
                  </div>
                  {companyItems.map((c, idx) => {
                    const i = assetItems.length + idx;
                    const isActive = i === active;
                    return (
                      <button
                        key={"u:" + c.symbol}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => select("u:" + c.symbol)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                        )}
                      >
                        <Monogram text={c.symbol} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-[14px] font-medium text-white">{c.symbol}</span>
                            <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/40">
                              {c.exchange}
                            </span>
                          </div>
                          <div className="truncate text-[12px] text-white/45">{c.name}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[13px] font-semibold tabular-nums text-white">
                            {c.currencySymbol}
                            {fmtPrice(c.price)}
                          </span>
                          <span className="text-[10px] tabular-nums text-white/35">
                            {fmtCompact(c.marketCap)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-white/35">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <CornerDownLeft size={11} /> Open
                </span>
                <span className="flex items-center gap-1">↑↓ Navigate</span>
              </span>
              <span>{COMPANY_COUNT.toLocaleString()} companies · {assets.length} markets</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
