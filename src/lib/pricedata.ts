import { finnhubReady, FINNHUB_API_KEY } from "./marketconfig";

export interface PriceUpdate {
  price: number;
  change: number;
  changeAbs: number;
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
}

/* ---------------- HTTP helpers ---------------- */
async function fetchJSON(url: string, timeoutMs = 9000): Promise<any> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/* ---------------- Crypto via Binance (CORS-friendly, no key) ---------------- */
// CoinGecko blocks direct browser calls (CORS) on shared hosting IPs, so we use
// Binance's public market-data endpoint, which allows cross-origin browser access.
const CRYPTO_TICKERS: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  solana: "SOLUSDT",
  binance: "BNBUSDT",
  cardano: "ADAUSDT",
  dogecoin: "DOGEUSDT",
  ripple: "XRPUSDT",
  tether: "USDTUSDT",
  avalanche: "AVAXUSDT",
  polkadot: "DOTUSDT",
  chainlink: "LINKUSDT",
  polygon: "POLUSDT",
  litecoin: "LTCUSDT",
  stellar: "XLMUSDT",
  monero: "XMRUSDT",
  internetcomputer: "ICPUSDT",
};

let binanceCache: { ts: number; data: any[] } | null = null;
async function binanceTickers(): Promise<any[]> {
  if (binanceCache && Date.now() - binanceCache.ts < 45000) return binanceCache.data;
  const data = await fetchJSON("https://data-api.binance.vision/api/v3/ticker/24hr");
  const arr = Array.isArray(data)
    ? data.filter(
        (t: any) =>
          typeof t.symbol === "string" && t.symbol.endsWith("USDT") && parseFloat(t.quoteVolume) > 0
      )
    : [];
  if (arr.length) binanceCache = { ts: Date.now(), data: arr };
  return arr;
}
function logoFor(sym: string) {
  return `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`;
}

async function fetchCrypto(out: Record<string, PriceUpdate>) {
  const ticks = await binanceTickers();
  const byPair = new Map(ticks.map((t: any) => [t.symbol, t]));
  for (const [id, pair] of Object.entries(CRYPTO_TICKERS)) {
    const t = byPair.get(pair);
    if (!t) continue;
    const price = parseFloat(t.lastPrice);
    const change = parseFloat(t.priceChangePercent) || 0;
    const open = parseFloat(t.openPrice || t.prevClosePrice) || price / (1 + change / 100);
    if (price > 0) out[id] = { price, change, changeAbs: price - open };
  }
}

export async function fetchCryptoMarkets(limit = 60): Promise<CoinMarket[]> {
  const ticks = await binanceTickers();
  const top = ticks
    .slice()
    .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, limit);
  return top
    .map((t: any) => {
      const sym = t.symbol.replace(/USDT$/, "");
      return {
        id: t.symbol,
        symbol: sym,
        name: sym,
        image: logoFor(sym),
        price: parseFloat(t.lastPrice) || 0,
        change: parseFloat(t.priceChangePercent) || 0,
        marketCap: 0,
        volume: parseFloat(t.quoteVolume) || 0,
      } as CoinMarket;
    })
    .filter((c) => c.price > 0);
}

/* ---------------- Forex via Frankfurter (no key) ---------------- */
const FOREX: Record<string, string> = {
  eurusd: "EUR",
  gbpusd: "GBP",
  usdjpy: "JPY",
  audusd: "AUD",
};
const forexPrev: Record<string, number> = {};
async function fetchForex(out: Record<string, PriceUpdate>) {
  const data = await fetchJSON("https://api.frankfurter.dev/v1/latest?base=USD");
  const rates = data?.rates;
  if (!rates) return;
  for (const [id, cur] of Object.entries(FOREX)) {
    const rate = rates[cur];
    if (typeof rate !== "number") continue;
    const price = id === "usdjpy" ? rate : 1 / rate;
    const prev = forexPrev[id];
    const change = prev ? ((price - prev) / prev) * 100 : 0;
    forexPrev[id] = price;
    out[id] = { price, change, changeAbs: prev ? price - prev : 0 };
  }
}

/* ---------------- Stocks via Finnhub (throttled, key required) ---------------- */
const FINNHUB_SYMBOLS: Record<string, string> = {
  apple: "AAPL", nvidia: "NVDA", microsoft: "MSFT", tesla: "TSLA", amazon: "AMZN",
  google: "GOOGL", meta: "META", amd: "AMD", netflix: "NFLX", coinbase: "COIN",
  intel: "INTC", visa: "V", mastercard: "MA", goldman: "GS", paypal: "PYPL",
  spotify: "SPOT", oracle: "ORCL", salesforce: "CRM", adobe: "ADBE", broadcom: "AVGO",
  cisco: "CSCO", qualcomm: "QCOM", walmart: "WMT", costco: "COST", "home-depot": "HD",
  mcdonalds: "MCD", "coca-cola": "KO", jpmorgan: "JPM", exxon: "XOM", pfizer: "PFE",
  lockheed: "LMT", caterpillar: "CAT", uber: "UBER", spy: "SPY", qqq: "QQQ",
};

// Back off entirely for 60s whenever Finnhub returns 429 (rate limited).
let finnhubPauseUntil = 0;
// Short-lived cache so repeated views don't re-hit the API.
const quoteCache = new Map<string, { u: PriceUpdate; ts: number }>();
const QUOTE_TTL = 50000;

async function finnhubQuote(symbol: string): Promise<PriceUpdate | null> {
  if (!finnhubReady) return null;
  if (Date.now() < finnhubPauseUntil) return null;
  const cached = quoteCache.get(symbol);
  if (cached && Date.now() - cached.ts < QUOTE_TTL) return cached.u;

  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`,
      { signal: ctrl.signal }
    );
    if (r.status === 429) {
      finnhubPauseUntil = Date.now() + 60000;
      return null;
    }
    if (!r.ok) return null;
    const q = await r.json();
    if (q && typeof q.c === "number" && q.c > 0) {
      const u: PriceUpdate = { price: q.c, change: q.dp ?? 0, changeAbs: q.d ?? 0 };
      quoteCache.set(symbol, { u, ts: Date.now() });
      return u;
    }
  } catch {
    /* ignore */
  } finally {
    clearTimeout(tid);
  }
  return null;
}

/** Concurrency-limited runner so we never burst past Finnhub's rate limit. */
async function runPool<T>(items: T[], worker: (item: T) => Promise<void>, concurrency = 3, delayMs = 250) {
  let i = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length || 1) }, async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx]);
      await sleep(delayMs);
    }
  });
  await Promise.all(runners);
}

async function fetchStocks(out: Record<string, PriceUpdate>) {
  if (!finnhubReady) return;
  await runPool(
    Object.entries(FINNHUB_SYMBOLS),
    async ([id, sym]) => {
      const u = await finnhubQuote(sym);
      if (u) out[id] = u;
    },
    3,
    250
  );
}

/** Resolve a Finnhub ticker for a curated asset or any company detail page. */
export function quoteSymbolFor(id: string, symbol: string): string | null {
  if (FINNHUB_SYMBOLS[id]) return FINNHUB_SYMBOLS[id];
  if (id.startsWith("u:")) {
    const s = symbol.replace(/[^A-Za-z0-9.\-]/g, "").toUpperCase();
    if (s.length >= 1 && s.length <= 6) return s;
  }
  return null;
}

/** On-demand quote for a single symbol (asset/company detail pages). */
export async function refreshQuote(symbol: string): Promise<PriceUpdate | null> {
  return finnhubQuote(symbol);
}

/** Bulk real quotes by ticker. */
export async function fetchQuotesFor(symbols: string[]): Promise<Record<string, PriceUpdate>> {
  const out: Record<string, PriceUpdate> = {};
  if (!finnhubReady) return out;
  await runPool(
    symbols,
    async (sym) => {
      const u = await finnhubQuote(sym);
      if (u) out[sym] = u;
    },
    3,
    250
  );
  return out;
}

/**
 * Fetch real prices across all available providers.
 * @param includeStocks stocks are fetched less often (Finnhub rate limits).
 */
export async function refreshRealPrices(includeStocks = true): Promise<Record<string, PriceUpdate>> {
  const out: Record<string, PriceUpdate> = {};
  await Promise.allSettled([
    fetchCrypto(out),
    fetchForex(out),
    includeStocks ? fetchStocks(out) : Promise.resolve(),
  ]);
  return out;
}
