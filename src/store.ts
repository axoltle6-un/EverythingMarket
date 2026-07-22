import { create } from "zustand";
import { assets, defaultWatchlists } from "./lib/data";
import { universeLive } from "./lib/universe";
import type { CoinMarket } from "./lib/pricedata";

export type View =
  | "dashboard"
  | "asset"
  | "markets"
  | "watchlist"
  | "portfolio"
  | "calendar"
  | "news"
  | "insights";

export type Timeframe = "1H" | "24H" | "7D" | "30D" | "90D" | "1Y" | "ALL";

export const TIMEFRAMES: Timeframe[] = ["1H", "24H", "7D", "30D", "90D", "1Y", "ALL"];

export interface Watchlist {
  id: string;
  name: string;
  ids: string[];
}

interface Live {
  price: number;
  change: number;
  changeAbs: number;
}

export interface Toast {
  id: number;
  title: string;
  body?: string;
  tone: "default" | "success" | "warn";
}

interface State {
  view: View;
  selectedId: string | null;
  searchOpen: boolean;
  timeframe: Timeframe;
  watchlists: Watchlist[];
  activeWatchlistId: string;
  live: Record<string, Live>;
  alertPrice: Record<string, number | undefined>;
  sidebarOpen: boolean;
  toasts: Toast[];
  _toastId: number;
  entered: boolean;

  enter: (view?: View) => void;
  setView: (v: View) => void;
  openAsset: (id: string, view?: View) => void;
  back: () => void;
  setSearchOpen: (b: boolean) => void;
  setTimeframe: (t: Timeframe) => void;
  toggleSidebar: () => void;

  toggleWatch: (id: string) => void;
  isWatched: (id: string) => boolean;
  addWatchlist: (name: string) => void;
  removeWatchlist: (id: string) => void;
  renameWatchlist: (id: string, name: string) => void;
  setActiveWatchlist: (id: string) => void;
  setWatchOrder: (ids: string[]) => void;

  setAlert: (id: string, price: number) => void;

  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;

  realIds: Set<string>;
  applyReal: (updates: Record<string, { price: number; change: number; changeAbs: number }>) => void;
  liveCrypto: CoinMarket[];
  setLiveCrypto: (c: CoinMarket[]) => void;
  liveTick: () => void;
}

function initLive(): Record<string, Live> {
  const out: Record<string, Live> = {};
  for (const a of assets) {
    out[a.id] = {
      price: a.price,
      change: a.change24h,
      changeAbs: a.changeAbs,
    };
  }
  return out;
}

export const useStore = create<State>((set, get) => ({
  view: "dashboard",
  selectedId: null,
  searchOpen: false,
  timeframe: "24H",
  watchlists: defaultWatchlists,
  activeWatchlistId: defaultWatchlists[0].id,
  live: initLive(),
  realIds: new Set<string>(),
  liveCrypto: [],
  alertPrice: {},
  sidebarOpen: false,
  toasts: [],
  _toastId: 1,
  entered: typeof sessionStorage !== "undefined" && sessionStorage.getItem("em_entered") === "1",

  enter: (view) => {
    try {
      sessionStorage.setItem("em_entered", "1");
    } catch {
      /* ignore */
    }
    set({ entered: true, view: view ?? get().view });
  },

  setView: (v) => set({ view: v, selectedId: v === "asset" ? get().selectedId : get().selectedId }),
  openAsset: (id, view = "asset") => set({ selectedId: id, view }),
  back: () => set({ view: "dashboard", selectedId: null }),
  setSearchOpen: (b) => set({ searchOpen: b }),
  setTimeframe: (t) => set({ timeframe: t }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  isWatched: (id) => {
    const wl = get().watchlists.find((w) => w.id === get().activeWatchlistId);
    return !!wl?.ids.includes(id);
  },
  toggleWatch: (id) => {
    const activeId = get().activeWatchlistId;
    set((s) => ({
      watchlists: s.watchlists.map((w) => {
        if (w.id !== activeId) return w;
        const has = w.ids.includes(id);
        return { ...w, ids: has ? w.ids.filter((x) => x !== id) : [...w.ids, id] };
      }),
    }));
    const now = get().isWatched(id);
    const a = assets.find((x) => x.id === id);
    get().pushToast({
      title: now ? "Added to watchlist" : "Removed from watchlist",
      body: a ? `${a.symbol} · ${get().watchlists.find((w) => w.id === activeId)?.name}` : undefined,
      tone: now ? "success" : "default",
    });
  },
  addWatchlist: (name) =>
    set((s) => {
      const id = "wl-" + Math.random().toString(36).slice(2, 7);
      return {
        watchlists: [...s.watchlists, { id, name: name || "New List", ids: [] }],
        activeWatchlistId: id,
      };
    }),
  removeWatchlist: (id) =>
    set((s) => {
      if (s.watchlists.length <= 1) return s;
      const next = s.watchlists.filter((w) => w.id !== id);
      return {
        watchlists: next,
        activeWatchlistId: s.activeWatchlistId === id ? next[0].id : s.activeWatchlistId,
      };
    }),
  renameWatchlist: (id, name) =>
    set((s) => ({
      watchlists: s.watchlists.map((w) => (w.id === id ? { ...w, name } : w)),
    })),
  setActiveWatchlist: (id) => set({ activeWatchlistId: id }),
  setWatchOrder: (ids) =>
    set((s) => ({
      watchlists: s.watchlists.map((w) =>
        w.id === s.activeWatchlistId ? { ...w, ids } : w
      ),
    })),

  setAlert: (id, price) => {
    set((s) => ({ alertPrice: { ...s.alertPrice, [id]: price } }));
    const a = assets.find((x) => x.id === id);
    get().pushToast({
      title: "Price alert set",
      body: a ? `Notify when ${a.symbol} hits ${price}` : undefined,
      tone: "default",
    });
  },

  pushToast: (t) =>
    set((s) => {
      const id = s._toastId + 1;
      const toast: Toast = { id, ...t };
      setTimeout(() => get().dismissToast(id), 4200);
      return { toasts: [...s.toasts, toast], _toastId: id };
    }),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  applyReal: (updates) =>
    set((s) => {
      const live = { ...s.live };
      const realIds = new Set(s.realIds);
      for (const [id, u] of Object.entries(updates)) {
        live[id] = { price: u.price, change: u.change, changeAbs: u.changeAbs };
        realIds.add(id);
      }
      return { live, realIds };
    }),

  setLiveCrypto: (c) => set({ liveCrypto: c }),

  liveTick: () =>
    set((s) => {
      const next: Record<string, Live> = {};
      for (const a of assets) {
        // Real (API) prices are authoritative — don't drift them.
        if (s.realIds.has(a.id)) {
          next[a.id] = s.live[a.id];
          continue;
        }
        const cur = s.live[a.id] ?? { price: a.price, change: a.change24h, changeAbs: a.changeAbs };
        // tiny random walk, biased gently by current change for life-like motion
        const drift = (Math.random() - 0.48) * 0.0016;
        const vol = a.price < 5 ? 0.0022 : 0.0009;
        let price = cur.price * (1 + drift * (a.price < 5 ? 1 : 1) + (Math.random() - 0.5) * vol);
        if (price <= 0) price = cur.price;
        const change = ((price - a.prevClose) / a.prevClose) * 100;
        const changeAbs = price - a.prevClose;
        next[a.id] = { price, change, changeAbs };
      }
      return { live: next };
    }),
}));

export function usePrice(id: string): Live {
  const l = useStore((s) => s.live[id]);
  return l ?? universeLive(id) ?? { price: 0, change: 0, changeAbs: 0 };
}

export function useIsLive(id: string): boolean {
  return useStore((s) => s.realIds.has(id));
}
