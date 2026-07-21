import { useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, X, Plus, Star, Inbox } from "lucide-react";
import { useStore } from "../store";
import { getAsset } from "../lib/data";
import { fmtPrice } from "../lib/format";
import { AssetTile, ChangeChip, Button, Card } from "../components/ui";
import { Sparkline } from "../components/Sparkline";
import { cn } from "../utils/cn";

function spark(seed: string, change: number) {
  const pts: number[] = [];
  let v = 50;
  for (let i = 0; i < 20; i++) {
    v += (Math.sin(i / 2 + seed.length) + change / 50) * 3;
    pts.push(v);
  }
  return pts;
}

export function Watchlist() {
  const watchlists = useStore((s) => s.watchlists);
  const activeId = useStore((s) => s.activeWatchlistId);
  const setActiveWatchlist = useStore((s) => s.setActiveWatchlist);
  const setWatchOrder = useStore((s) => s.setWatchOrder);
  const toggleWatch = useStore((s) => s.toggleWatch);
  const addWatchlist = useStore((s) => s.addWatchlist);
  const removeWatchlist = useStore((s) => s.removeWatchlist);
  const renameWatchlist = useStore((s) => s.renameWatchlist);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const openAsset = useStore((s) => s.openAsset);
  const live = useStore((s) => s.live);

  const active = watchlists.find((w) => w.id === activeId) ?? watchlists[0];
  const [name, setName] = useState(active.name);

  const stop = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Watchlist</h1>
          <p className="mt-1 text-[14px] text-white/45">Pin favorites, reorder by drag, track in real time.</p>
        </div>
      </div>

      {/* Watchlist tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {watchlists.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setActiveWatchlist(w.id);
              setName(w.name);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              w.id === activeId
                ? "bg-white text-ink-950"
                : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            {w.name}
            <span className={cn("rounded-md px-1 text-[11px]", w.id === activeId ? "bg-black/10" : "bg-white/10")}>
              {w.ids.length}
            </span>
            {watchlists.length > 1 && w.id === activeId && (
              <X
                size={13}
                className="opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeWatchlist(w.id);
                }}
              />
            )}
          </button>
        ))}
        <button
          onClick={() => {
            addWatchlist("New List");
          }}
          className="flex items-center gap-1 rounded-full border border-dashed border-white/15 px-3 py-1.5 text-[13px] font-medium text-white/55 transition-colors hover:border-white/30 hover:text-white"
        >
          <Plus size={13} /> New list
        </button>
      </div>

      {/* Active list header */}
      <div className="flex items-center justify-between gap-3">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            renameWatchlist(activeId, e.target.value);
          }}
          className="w-full max-w-xs rounded-lg bg-transparent text-[17px] font-semibold text-white focus:outline-none"
          aria-label="Rename watchlist"
        />
        <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
          <Plus size={14} /> Add assets
        </Button>
      </div>

      {active.ids.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
            <Inbox size={20} className="text-white/40" />
          </div>
          <p className="mt-4 text-[15px] font-medium text-white">This list is empty</p>
          <p className="mt-1 text-[13px] text-white/45">Search and add assets to start tracking.</p>
          <Button variant="primary" size="md" className="mt-5" onClick={() => setSearchOpen(true)}>
            <Plus size={15} /> Add your first asset
          </Button>
        </Card>
      ) : (
        <Reorder.Group
          axis="y"
          values={active.ids}
          onReorder={setWatchOrder}
          className="space-y-2"
        >
          {active.ids.map((id) => {
            const a = getAsset(id);
            if (!a) return null;
            const l = live[id];
            const change = l?.change ?? a.change24h;
            return (
              <Reorder.Item
                key={id}
                value={id}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 backdrop-blur-xl"
                whileDrag={{ scale: 1.015, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.6)", zIndex: 20 }}
              >
                <GripVertical size={16} className="shrink-0 cursor-grab text-white/25 active:cursor-grabbing" />
                <button onClick={() => openAsset(id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <AssetTile asset={a} size={38} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-white">{a.symbol}</span>
                      <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/40">{a.category}</span>
                    </div>
                    <div className="truncate text-[12px] text-white/45">{a.name}</div>
                  </div>
                </button>
                <div className="hidden h-8 w-24 sm:block">
                  <Sparkline data={spark(id, change)} positive={change >= 0} height={32} />
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-[14px] font-semibold tabular-nums text-white">{fmtPrice(l?.price ?? a.price)}</div>
                  <div className="mt-1">
                    <ChangeChip value={change} />
                  </div>
                </div>
                <button
                  onPointerDown={stop}
                  onClick={() => toggleWatch(id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-loss"
                  aria-label="Remove from watchlist"
                >
                  <X size={15} />
                </button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      <div className="flex items-center gap-2 text-[12px] text-white/35">
        <Star size={12} className="text-white/30" /> Tip: drag rows to reorder. Updates stream live.
      </div>
    </div>
  );
}
