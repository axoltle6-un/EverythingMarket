import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Plus } from "lucide-react";
import { useStore } from "../store";
import { NAV } from "../nav";
import { cn } from "../utils/cn";
import { assets } from "../lib/data";
import { fmtPct } from "../lib/format";
import { Sparkline } from "./Sparkline";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const watchlists = useStore((s) => s.watchlists);
  const live = useStore((s) => s.live);

  const go = (v: typeof view) => {
    setView(v);
    onNavigate?.();
  };

  const featured = ["bitcoin", "sp500", "gold", "us10y"].map((id) => assets.find((a) => a.id === id)!);

  return (
    <div className="flex h-full flex-col gap-6 p-3">
      <nav className="space-y-1">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Menu
        </p>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.view || (view === "asset" && item.view === "markets");
          return (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all",
                active ? "bg-white/[0.07] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent"
                />
              )}
              <Icon size={17} className={active ? "text-accent" : ""} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Watchlists
        </p>
        {watchlists.slice(0, 4).map((w) => (
          <button
            key={w.id}
            onClick={() => go("watchlist")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <span className="truncate">{w.name}</span>
            <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-white/45">
              {w.ids.length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            Live
          </p>
          <div className="space-y-1.5">
            {featured.map((a) => {
              const l = live[a.id];
              const up = (l?.change ?? 0) >= 0;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    useStore.getState().openAsset(a.id);
                    onNavigate?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/[0.03]"
                >
                  <span className="w-9 shrink-0 text-[12px] font-medium text-white/70">{a.symbol}</span>
                  <span className="h-5 flex-1">
                    <Sparkline data={Array.from({ length: 16 }, (_, i) => i)} positive={up} height={20} fill={false} />
                  </span>
                  <span className={cn("w-12 shrink-0 text-right text-[11px] tabular-nums", up ? "text-gain" : "text-loss")}>
                    {fmtPct(l?.change ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{ background: "linear-gradient(150deg, rgba(79,139,255,0.16), rgba(52,211,153,0.08))" }}
        >
          <div className="relative">
            <Sparkles size={16} className="text-accent" />
            <p className="mt-2 text-[13px] font-semibold text-white">Everything Market Pro</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-white/55">
              Unlock AI signals, unlimited alerts and real-time depth.
            </p>
            <button className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ink-950 transition-transform hover:scale-[1.02]">
              <Plus size={12} /> Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-white/[0.06] md:block">
        <div className="h-full overflow-y-auto no-scrollbar">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-[80%] max-w-xs border-r border-white/[0.08] bg-ink-900 md:hidden"
            >
              <button
                onClick={toggleSidebar}
                className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.06]"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <div className="h-full overflow-y-auto no-scrollbar pt-2">
                <SidebarContent onNavigate={toggleSidebar} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function SidebarWrap({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
