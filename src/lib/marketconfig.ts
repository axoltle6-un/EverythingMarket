/* =========================================================================
   Market data provider configuration
   -------------------------------------------------------------------------
   • Crypto  → CoinGecko (free, NO key required)        → live, always on
   • Forex   → Frankfurter (free, NO key required)      → live, always on
   • Stocks  → Finnhub (free key, 60 req/min)           → live when key set

   To enable REAL stock/ETF prices:
   1. Create a free key at https://finnhub.io
   2. Paste it below (or set VITE_FINNHUB_KEY in a .env file)

   Until a key is present, stocks/indices fall back to the simulated feed
   while crypto and forex are always real.
   ========================================================================= */

const env = ((import.meta as any).env ?? {}) as Record<string, string | undefined>;

export const FINNHUB_API_KEY: string = env.VITE_FINNHUB_KEY ?? "PASTE_FINNHUB_KEY";
export const finnhubReady = FINNHUB_API_KEY !== "PASTE_FINNHUB_KEY";
