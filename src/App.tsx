import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Bell, X, Info } from "lucide-react";
import { useStore } from "./store";
import { TopNav } from "./components/TopNav";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { SearchModal } from "./components/SearchModal";
import { Dashboard } from "./views/Dashboard";
import { AssetDetail } from "./views/AssetDetail";
import { Markets } from "./views/Markets";
import { Watchlist } from "./views/Watchlist";
import { Portfolio } from "./views/Portfolio";
import { Calendar } from "./views/Calendar";
import { News } from "./views/News";
import { Insights } from "./views/Insights";
import { LandingPage } from "./views/LandingPage";
import { useAuth } from "./lib/auth";
import { usePrefs } from "./lib/prefs";
import { refreshRealPrices, fetchCryptoMarkets } from "./lib/pricedata";
import { AuthModal } from "./components/AuthModal";
import { SettingsModal } from "./components/SettingsModal";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { LogoMark } from "./components/Logo";

function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);

  const icon = (tone: string) => {
    if (tone === "success") return <Check size={14} />;
    if (tone === "warn") return <Bell size={14} />;
    return <Info size={14} />;
  };
  const color = (tone: string) =>
    tone === "success" ? "text-gain bg-gain/15" : tone === "warn" ? "text-amber-300 bg-amber-400/15" : "text-accent bg-accent/15";

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/[0.1] bg-ink-800/95 p-3.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${color(t.tone)}`}>
              {icon(t.tone)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-white">{t.title}</div>
              {t.body && <div className="mt-0.5 text-[12px] text-white/50">{t.body}</div>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-white/35 transition-colors hover:text-white"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Splash() {
  return (
    <div className="app-aura relative flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <LogoMark size={48} />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="h-1 w-24 overflow-hidden rounded-full bg-white/[0.06]"
        >
          <motion.span
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            className="block h-full w-1/2 rounded-full bg-white/40"
          />
        </motion.span>
      </div>
    </div>
  );
}

export default function App() {
  const view = useStore((s) => s.view);
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const liveTick = useStore((s) => s.liveTick);
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  const reducedMotion = usePrefs((s) => s.reducedMotion);

  // Live price simulation (respects the Settings toggle)
  useEffect(() => {
    const id = setInterval(() => {
      if (usePrefs.getState().liveUpdates) liveTick();
    }, 2400);
    return () => clearInterval(id);
  }, [liveTick]);

  // Apply reduce-motion preference globally
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
  }, [reducedMotion]);

  // Real market data: crypto (CoinGecko) + forex (Frankfurter) every minute,
  // stocks (Finnhub) every ~5 min. Falls back silently to the simulated feed.
  useEffect(() => {
    let n = 0;
    let active = true;
    const run = async () => {
      n++;
      const [updates, coins] = await Promise.all([
        refreshRealPrices(n % 5 === 1),
        fetchCryptoMarkets(60),
      ]);
      if (active && updates && Object.keys(updates).length) {
        useStore.getState().applyReal(updates);
      }
      if (active && coins && coins.length) {
        useStore.getState().setLiveCrypto(coins);
      }
    };
    run();
    const id = setInterval(run, 60000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Global search shortcut (only inside the authenticated app)
  useEffect(() => {
    if (!user) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSearchOpen, user]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const render = () => {
    switch (view) {
      case "asset":
        return <AssetDetail />;
      case "markets":
        return <Markets />;
      case "watchlist":
        return <Watchlist />;
      case "portfolio":
        return <Portfolio />;
      case "calendar":
        return <Calendar />;
      case "news":
        return <News />;
      case "insights":
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  // Still resolving the auth session → branded splash
  if (status === "loading") {
    return <Splash />;
  }

  // Not signed in → landing page (with the auth modal available)
  if (!user) {
    return (
      <>
        <LandingPage />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="app-aura relative min-h-screen">
      <TopNav />
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 md:pb-12 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {render()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
      <SearchModal />
      <SettingsModal />
      <NotificationsPanel />
      <Toaster />
    </div>
  );
}
