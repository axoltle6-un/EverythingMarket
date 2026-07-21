import { finnhubReady, FINNHUB_API_KEY } from "./marketconfig";

export interface PriceUpdate {
  price: number;
  change: number;
  changeAbs: number;
}

/* ---------------- provider symbol maps ---------------- */
// CoinGecko coin ids for the curated crypto set
const COINGECKO: Record<string, string> = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  solana: "solana",
  binance: "binancecoin",
  cardano: "cardano",
  dogecoin: "dogecoin",
  ripple: "ripple",
  tether: "tether",
  avalanche: "avalanche-2",
  polkadot: "polkadot",
  chainlink: "chainlink",
  polygon: "polygon-ecosystem-token",
  litecoin: "litecoin",
  stellar: "stellar",
  monero: "monero",
  internetcomputer: "internet-computer",
};
const CG_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(COINGECKO).map(([id, cg]) => [cg, id])
);

// Forex pairs → the foreign currency (quoted against USD via Frankfurter base=USD)
const FOREX: Record<string, string> = {
  eurusd: "EUR",
  gbpusd: "GBP",
  usdjpy: "JPY",
  audusd: "AUD",
};

// Curated US stocks/ETFs → Finnhub ticker
const FINNHUB_SYMBOLS: Record<string, string> = {
  apple: "AAPL",
  nvidia: "NVDA",
  microsoft: "MSFT",
  tesla: "TSLA",
  amazon: "AMZN",
  google: "GOOGL",
  meta: "META",
  amd: "AMD",
  netflix: "NFLX",
  coinbase: "COIN",
  intel: "INTC",
  visa: "V",
  mastercard: "MA",
  goldman: "GS",
  paypal: "PYPL",
  spotify: "SPOT",
  spy: "SPY",
  qqq: "QQQ",
};

async function fetchJSON(url: string, timeoutMs = 8000): Promise<any> {
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

/* ---------------- crypto (CoinGecko, no key) ---------------- */
async function fetchCrypto(out: Record<string, PriceUpdate>) {
  const ids = Object.values(COINGECKO);
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
    ","
  )}&vs_currencies=usd&include_24hr_change=true`;
  const data = await fetchJSON(url);
  if (!data) return;
  for (const [cg, v] of Object.entries<any>(data)) {
    const id = CG_REVERSE[cg];
    if (!id || typeof v?.usd !== "number") continue;
    const price = v.usd;
    const change = v.usd_24h_change ?? 0;
    const changeAbs = price - price / (1 + change / 100);
    if (price > 0) out[id] = { price, change, changeAbs };
  }
}

/* ---------------- forex (Frankfurter, no key) ---------------- */
const forexPrev: Record<string, number> = {};
async function fetchForex(out: Record<string, PriceUpdate>) {
  const data = await fetchJSON("https://api.frankfurter.dev/v1/latest?base=USD");
  const rates = data?.rates;
  if (!rates) return;
  for (const [id, cur] of Object.entries(FOREX)) {
    const rate = rates[cur]; // units of `cur` per 1 USD
    if (typeof rate !== "number") continue;
    const price = id === "usdjpy" ? rate : 1 / rate;
    const prev = forexPrev[id];
    const change = prev ? ((price - prev) / prev) * 100 : 0;
    forexPrev[id] = price;
    out[id] = { price, change, changeAbs: prev ? price - prev : 0 };
  }
}

/* ---------------- stocks (Finnhub, free key) ---------------- */
async function fetchStocks(out: Record<string, PriceUpdate>) {
  if (!finnhubReady) return;
  await Promise.all(
    Object.entries(FINNHUB_SYMBOLS).map(async ([id, sym]) => {
      const q = await fetchJSON(
        `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${FINNHUB_API_KEY}`
      );
      if (q && typeof q.c === "number" && q.c > 0) {
        out[id] = { price: q.c, change: q.dp ?? 0, changeAbs: q.d ?? 0 };
      }
    })
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

/** On-demand quote for a single symbol (used on asset/company detail pages). */
export async function refreshQuote(symbol: string): Promise<PriceUpdate | null> {
  if (!finnhubReady) return null;
  const q = await fetchJSON(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`
  );
  if (q && typeof q.c === "number" && q.c > 0) {
    return { price: q.c, change: q.dp ?? 0, changeAbs: q.d ?? 0 };
  }
  return null;
}

/**
 * Fetch real prices across all available providers.
 * @param includeStocks stocks are fetched less often (Finnhub daily quota).
 */
export async function refreshRealPrices(includeStocks = true): Promise<Record<string, PriceUpdate>> {
  const out: Record<string, PriceUpdate> = {};
  await Promise.allSettled([fetchCrypto(out), fetchForex(out), includeStocks ? fetchStocks(out) : Promise.resolve()]);
  return out;
}
