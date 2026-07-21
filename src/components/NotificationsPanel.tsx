import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Newspaper, Target, BellRing } from "lucide-react";
import { useStore } from "../store";
import { usePrefs } from "../lib/prefs";
import { assets, getAsset, news } from "../lib/data";
import { fmtPrice, fmtPct, timeAgo } from "../lib/format";
import { cn } from "../utils/cn";

type Tone = "gain" | "loss" | "accent" | "neutral";
interface Item {
  icon: typeof TrendingUp;
  tone: Tone;
  title: string;
  sub: string;
  time: string;
}

export function NotificationsPanel() {
  const open = usePrefs((s) => s.notificationsOpen);
  const close = () => usePrefs.getState().setNotificationsOpen(false);
  const live = useStore((s) => s.live);
  const alertPrice = useStore((s) => s.alertPrice);
  const openAsset = useStore((s) => s.openAsset);

  const ranked = [...assets].sort(
    (a, b) => Math.abs(live[b.id]?.change ?? b.change24h) - Math.abs(live[a.id]?.change ?? a.change24h)
  );
  const topGain = ranked[0];
  const topLoss = ranked[ranked.length - 1];

  const items: Item[] = [];

  for (const [id, target] of Object.entries(alertPrice)) {
    const a = getAsset(id);
    const p = live[id]?.price;
    if (a && target && p) {
      items.push({
        icon: Target,
        tone: "accent",
        title: `${a.symbol} reached your alert at ${fmtPrice(target)}`,
        sub: `${a.name} · now ${fmtPrice(p)}`,
        time: "now",
      });
    }
  }
  if (topGain) {
    const ch = live[topGain.id]?.change ?? topGain.change24h;
    items.push({
      icon: TrendingUp,
      tone: "gain",
      title: `${topGain.symbol} is the top mover`,
      sub: `${topGain.name} · ${fmtPct(ch)} today`,
      time: "24h",
    });
  }
  if (topLoss && topLoss.id !== topGain.id) {
    const ch = live[topLoss.id]?.change ?? topLoss.change24h;
    items.push({
      icon: TrendingDown,
      tone: "loss",
      title: `${topLoss.symbol} is under pressure`,
      sub: `${topLoss.name} · ${fmtPct(ch)} today`,
      time: "24h",
    });
  }
  for (const n of news.slice(0, 2)) {
    items.push({
      icon: Newspaper,
      tone: "neutral",
      title: n.title,
      sub: `${n.source} · ${n.minutes} min read`,
      time: timeAgo(n.ts),
    });
  }

  const toneCls: Record<Tone, string> = {
    gain: "text-gain bg-gain/12",
    loss: "text-loss bg-loss/12",
    accent: "text-accent bg-accent/12",
    neutral: "text-white/60 bg-white/[0.06]",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[88] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[89] flex h-full w-full max-w-sm flex-col border-l border-white/[0.08] bg-ink-900"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold text-white">
                <BellRing size={16} className="text-accent" /> Notifications
              </h2>
              <button onClick={close} className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 hover:bg-white/[0.06] hover:text-white" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {items.map((it, i) => {
                const Icon = it.icon;
                return (
                  <button
                    key={i}
                    onClick={() => { close(); openAsset("bitcoin"); }}
                    className="flex w-full items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-left transition-colors hover:border-white/12 hover:bg-white/[0.04]"
                  >
                    <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", toneCls[it.tone])}>
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium leading-snug text-white">{it.title}</div>
                      <div className="mt-0.5 line-clamp-2 text-[12px] text-white/45">{it.sub}</div>
                    </div>
                    <span className="shrink-0 text-[11px] text-white/30">{it.time}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/[0.06] px-5 py-3 text-center text-[12px] text-white/35">
              You're all caught up · {items.length} updates
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
