import { fmtPrice, hashStr } from "./format";

export type Category =
  | "Crypto"
  | "Stocks"
  | "ETFs"
  | "Commodities"
  | "Metals"
  | "Forex"
  | "Indices"
  | "Bonds"
  | "Economy";

export type MarketStatus = "open" | "closed" | "pre" | "after";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: Category;
  price: number;
  change24h: number;
  changeAbs: number;
  marketCap: number | null;
  volume: number | null;
  high24h: number;
  low24h: number;
  open24h: number;
  prevClose: number;
  color: string;
  glyph: string;
  status: MarketStatus;
  region?: string;
  about: string;
}

export interface AIInsight {
  sentiment: "Bullish" | "Bearish" | "Neutral";
  riskScore: number;
  confidence: number;
  summary: string;
  bullish: string[];
  bearish: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: Category | "Macro";
  ts: number;
  minutes: number;
  summary: string;
  assetIds: string[];
  featured?: boolean;
}

export interface CalendarEvent {
  id: string;
  day: number; // 0..6 relative offset
  time: string;
  title: string;
  flag: string;
  impact: "high" | "medium" | "low";
  type: "Rates" | "Inflation" | "Growth" | "Earnings" | "Crypto";
  forecast: string;
  previous: string;
}

export interface Holding {
  assetId: string;
  amount: number;
  avgCost: number;
}

export const categories: Category[] = [
  "Crypto",
  "Stocks",
  "ETFs",
  "Indices",
  "Metals",
  "Commodities",
  "Forex",
  "Bonds",
  "Economy",
];

export const assets: Asset[] = [
  // ---------- Crypto ----------
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", category: "Crypto", price: 67428.12, change24h: 2.41, changeAbs: 1586.4, marketCap: 1330000000000, volume: 38400000000, high24h: 68120, low24h: 65510, open24h: 65842, prevClose: 65842, color: "#e8a13a", glyph: "₿", status: "open", about: "The largest cryptocurrency by market cap, a decentralized store of value and settlement network." },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", category: "Crypto", price: 3521.66, change24h: 1.88, changeAbs: 65.1, marketCap: 423000000000, volume: 17800000000, high24h: 3560, low24h: 3440, open24h: 3456, prevClose: 3456, color: "#8b93b8", glyph: "Ξ", status: "open", about: "A programmable blockchain powering smart contracts, DeFi and the bulk of on-chain activity." },
  { id: "solana", symbol: "SOL", name: "Solana", category: "Crypto", price: 168.94, change24h: 4.72, changeAbs: 7.62, marketCap: 77000000000, volume: 4200000000, high24h: 172.1, low24h: 160.3, open24h: 161.3, prevClose: 161.3, color: "#3fbf8f", glyph: "◎", status: "open", about: "A high-throughput Layer 1 focused on low-cost, fast finality for consumer apps." },
  { id: "binance", symbol: "BNB", name: "BNB", category: "Crypto", price: 602.18, change24h: -0.64, changeAbs: -3.9, marketCap: 88000000000, volume: 1900000000, high24h: 612, low24h: 598, open24h: 606, prevClose: 606, color: "#d9a23b", glyph: "⬡", status: "open", about: "The native asset of the BNB Chain ecosystem and Binance exchange utility token." },
  { id: "ripple", symbol: "XRP", name: "XRP", category: "Crypto", price: 0.5234, change24h: 1.12, changeAbs: 0.0058, marketCap: 29000000000, volume: 1400000000, high24h: 0.531, low24h: 0.515, open24h: 0.517, prevClose: 0.517, color: "#5b9bd5", glyph: "✕", status: "open", about: "A payment-focused token built for fast cross-border settlement." },
  { id: "cardano", symbol: "ADA", name: "Cardano", category: "Crypto", price: 0.4521, change24h: -1.94, changeAbs: -0.0089, marketCap: 16000000000, volume: 520000000, high24h: 0.468, low24h: 0.448, open24h: 0.461, prevClose: 0.461, color: "#3a7bd5", glyph: "₳", status: "open", about: "A research-driven proof-of-stake blockchain." },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", category: "Crypto", price: 0.1562, change24h: 3.21, changeAbs: 0.0049, marketCap: 22000000000, volume: 1600000000, high24h: 0.159, low24h: 0.15, open24h: 0.1513, prevClose: 0.1513, color: "#c2a633", glyph: "Ð", status: "open", about: "A popular payments and community-driven meme asset." },
  { id: "avalanche", symbol: "AVAX", name: "Avalanche", category: "Crypto", price: 36.42, change24h: 2.05, changeAbs: 0.73, marketCap: 14000000000, volume: 610000000, high24h: 37.1, low24h: 35.4, open24h: 35.69, prevClose: 35.69, color: "#d94f4f", glyph: "▲", status: "open", about: "A scalable multi-chain platform for decentralized apps." },
  { id: "tether", symbol: "USDT", name: "Tether", category: "Crypto", price: 1.0008, change24h: 0.08, changeAbs: 0.0008, marketCap: 112000000000, volume: 45000000000, high24h: 1.0012, low24h: 0.9998, open24h: 1.0, prevClose: 1.0, color: "#2bbd8a", glyph: "₮", status: "open", about: "The largest USD-pegged stablecoin by circulation, a core unit of crypto liquidity." },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", category: "Crypto", price: 6.42, change24h: 1.58, changeAbs: 0.1, marketCap: 9400000000, volume: 280000000, high24h: 6.55, low24h: 6.28, open24h: 6.32, prevClose: 6.32, color: "#e6007a", glyph: "●", status: "open", about: "A multichain protocol enabling cross-chain interoperability between blockchains." },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", category: "Crypto", price: 14.18, change24h: 2.16, changeAbs: 0.3, marketCap: 8400000000, volume: 360000000, high24h: 14.4, low24h: 13.8, open24h: 13.88, prevClose: 13.88, color: "#3a6cf5", glyph: "⬡", status: "open", about: "The leading decentralized oracle network bridging on-chain and real-world data." },
  { id: "polygon", symbol: "POL", name: "Polygon", category: "Crypto", price: 0.521, change24h: -0.95, changeAbs: -0.005, marketCap: 4800000000, volume: 220000000, high24h: 0.531, low24h: 0.518, open24h: 0.526, prevClose: 0.526, color: "#9460f0", glyph: "⬢", status: "open", about: "A scaling framework for Ethereum with a growing ecosystem of rollups." },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", category: "Crypto", price: 84.7, change24h: 0.89, changeAbs: 0.75, marketCap: 6300000000, volume: 410000000, high24h: 85.4, low24h: 83.4, open24h: 83.95, prevClose: 83.95, color: "#7a9be0", glyph: "Ł", status: "open", about: "A peer-to-peer payments coin built for fast, low-cost transactions." },
  { id: "stellar", symbol: "XLM", name: "Stellar", category: "Crypto", price: 0.1125, change24h: 1.26, changeAbs: 0.0014, marketCap: 3300000000, volume: 95000000, high24h: 0.114, low24h: 0.11, open24h: 0.1111, prevClose: 0.1111, color: "#8b6bff", glyph: "✦", status: "open", about: "A payments-focused network optimized for cross-border remittances." },
  { id: "monero", symbol: "XMR", name: "Monero", category: "Crypto", price: 168.2, change24h: -0.41, changeAbs: -0.7, marketCap: 3100000000, volume: 130000000, high24h: 171, low24h: 167, open24h: 168.9, prevClose: 168.9, color: "#ff6600", glyph: "ɱ", status: "open", about: "A privacy-centric cryptocurrency with shielded, untraceable transactions." },
  { id: "internetcomputer", symbol: "ICP", name: "Internet Computer", category: "Crypto", price: 12.35, change24h: 3.09, changeAbs: 0.37, marketCap: 5700000000, volume: 160000000, high24h: 12.6, low24h: 11.8, open24h: 11.98, prevClose: 11.98, color: "#3aaee6", glyph: "∞", status: "open", about: "A blockchain that runs smart contracts at web speed, aiming to host the internet natively." },

  // ---------- Stocks ----------
  { id: "apple", symbol: "AAPL", name: "Apple", category: "Stocks", price: 214.29, change24h: 0.84, changeAbs: 1.78, marketCap: 3300000000000, volume: 52000000, high24h: 215.6, low24h: 211.9, open24h: 212.51, prevClose: 212.51, color: "#9aa0a6", glyph: "", status: "pre", region: "US", about: "Consumer technology giant across hardware, services and wearables." },
  { id: "nvidia", symbol: "NVDA", name: "NVIDIA", category: "Stocks", price: 124.58, change24h: 3.96, changeAbs: 4.75, marketCap: 3060000000000, volume: 240000000, high24h: 125.4, low24h: 119.8, open24h: 119.83, prevClose: 119.83, color: "#76b900", glyph: "", status: "pre", region: "US", about: "Leading designer of GPUs powering the AI compute build-out." },
  { id: "microsoft", symbol: "MSFT", name: "Microsoft", category: "Stocks", price: 442.67, change24h: 1.12, changeAbs: 4.9, marketCap: 3290000000000, volume: 18000000, high24h: 444.2, low24h: 437.6, open24h: 437.77, prevClose: 437.77, color: "#4f8bff", glyph: "", status: "pre", region: "US", about: "Diversified software, cloud and AI platform." },
  { id: "tesla", symbol: "TSLA", name: "Tesla", category: "Stocks", price: 248.5, change24h: -2.18, changeAbs: -5.53, marketCap: 791000000000, volume: 98000000, high24h: 256, low24h: 247, open24h: 254.03, prevClose: 254.03, color: "#d24b3f", glyph: "", status: "pre", region: "US", about: "Electric vehicle and energy storage manufacturer." },
  { id: "amazon", symbol: "AMZN", name: "Amazon", category: "Stocks", price: 186.34, change24h: 0.62, changeAbs: 1.15, marketCap: 1940000000000, volume: 38000000, high24h: 187.5, low24h: 184.2, open24h: 185.19, prevClose: 185.19, color: "#e0a040", glyph: "", status: "pre", region: "US", about: "Global e-commerce, cloud and logistics platform." },
  { id: "google", symbol: "GOOGL", name: "Alphabet", category: "Stocks", price: 175.43, change24h: -0.48, changeAbs: -0.85, marketCap: 2160000000000, volume: 26000000, high24h: 177.1, low24h: 174.6, open24h: 176.28, prevClose: 176.28, color: "#5b9bd5", glyph: "", status: "pre", region: "US", about: "Parent of Google spanning search, cloud, YouTube and AI." },
  { id: "meta", symbol: "META", name: "Meta Platforms", category: "Stocks", price: 512.08, change24h: 1.74, changeAbs: 8.76, marketCap: 1300000000000, volume: 15000000, high24h: 514, low24h: 502, open24h: 503.32, prevClose: 503.32, color: "#6f7bf7", glyph: "", status: "pre", region: "US", about: "Social and advertising leader operating Facebook, Instagram and WhatsApp." },
  { id: "amd", symbol: "AMD", name: "Advanced Micro Devices", category: "Stocks", price: 158.92, change24h: 2.81, changeAbs: 4.34, marketCap: 257000000000, volume: 49000000, high24h: 160.1, low24h: 153.9, open24h: 154.58, prevClose: 154.58, color: "#d24b3f", glyph: "", status: "pre", region: "US", about: "Designer of CPUs and GPUs for compute, gaming and data center." },
  { id: "netflix", symbol: "NFLX", name: "Netflix", category: "Stocks", price: 632.4, change24h: 0.7, changeAbs: 4.4, marketCap: 272000000000, volume: 3500000, high24h: 636, low24h: 626, open24h: 628, prevClose: 628, color: "#e50914", glyph: "", status: "pre", region: "US", about: "Global streaming entertainment service and content studio." },
  { id: "coinbase", symbol: "COIN", name: "Coinbase Global", category: "Stocks", price: 224.8, change24h: 2.32, changeAbs: 5.1, marketCap: 56000000000, volume: 7200000, high24h: 226.5, low24h: 219, open24h: 219.7, prevClose: 219.7, color: "#2f6bff", glyph: "", status: "pre", region: "US", about: "The largest US-based crypto exchange and custodian." },
  { id: "intel", symbol: "INTC", name: "Intel", category: "Stocks", price: 31.2, change24h: -1.11, changeAbs: -0.35, marketCap: 133000000000, volume: 28000000, high24h: 31.7, low24h: 31, open24h: 31.55, prevClose: 31.55, color: "#3aa8ff", glyph: "", status: "pre", region: "US", about: "Legacy semiconductor leader in CPUs and foundry services." },
  { id: "visa", symbol: "V", name: "Visa", category: "Stocks", price: 268.9, change24h: 0.3, changeAbs: 0.8, marketCap: 540000000000, volume: 6000000, high24h: 270, low24h: 267, open24h: 268.1, prevClose: 268.1, color: "#7d8cff", glyph: "", status: "pre", region: "US", about: "Global payments network processing trillions in transactions annually." },
  { id: "mastercard", symbol: "MA", name: "Mastercard", category: "Stocks", price: 448.2, change24h: 0.49, changeAbs: 2.2, marketCap: 415000000000, volume: 2600000, high24h: 450, low24h: 445, open24h: 446, prevClose: 446, color: "#ff5a6a", glyph: "", status: "pre", region: "US", about: "Worldwide payments technology company connecting consumers and merchants." },
  { id: "goldman", symbol: "GS", name: "Goldman Sachs", category: "Stocks", price: 468.7, change24h: 0.9, changeAbs: 4.2, marketCap: 152000000000, volume: 1800000, high24h: 471, low24h: 463, open24h: 464.5, prevClose: 464.5, color: "#9ec14c", glyph: "", status: "pre", region: "US", about: "Leading global investment banking and securities firm." },
  { id: "paypal", symbol: "PYPL", name: "PayPal", category: "Stocks", price: 63.4, change24h: -0.63, changeAbs: -0.4, marketCap: 65000000000, volume: 9000000, high24h: 64.2, low24h: 63.1, open24h: 63.8, prevClose: 63.8, color: "#6f96e8", glyph: "", status: "pre", region: "US", about: "Digital payments platform powering online and peer-to-peer transactions." },
  { id: "spotify", symbol: "SPOT", name: "Spotify", category: "Stocks", price: 312.6, change24h: 1.39, changeAbs: 4.3, marketCap: 62000000000, volume: 1500000, high24h: 315, low24h: 307, open24h: 308.3, prevClose: 308.3, color: "#1db954", glyph: "", status: "pre", region: "US", about: "The world's largest audio streaming subscription service." },

  // ---------- ETFs ----------
  { id: "spy", symbol: "SPY", name: "SPDR S&P 500 ETF", category: "ETFs", price: 553.41, change24h: 0.92, changeAbs: 5.05, marketCap: null, volume: 42000000, high24h: 555, low24h: 548, open24h: 548.36, prevClose: 548.36, color: "#4f8bff", glyph: "", status: "pre", region: "US", about: "The flagship ETF tracking the S&P 500 index." },
  { id: "qqq", symbol: "QQQ", name: "Invesco QQQ Trust", category: "ETFs", price: 481.7, change24h: 1.34, changeAbs: 6.37, marketCap: null, volume: 38000000, high24h: 483, low24h: 474, open24h: 475.33, prevClose: 475.33, color: "#6f7bf7", glyph: "", status: "pre", region: "US", about: "ETF tracking the Nasdaq-100 index of large growth names." },

  // ---------- Indices ----------
  { id: "nasdaq", symbol: "NDX", name: "Nasdaq 100", category: "Indices", price: 18642.55, change24h: 1.46, changeAbs: 268.2, marketCap: null, volume: null, high24h: 18700, low24h: 18380, open24h: 18374, prevClose: 18374, color: "#4f8bff", glyph: "N", status: "open", region: "US", about: "Market-cap weighted index of the 100 largest non-financial Nasdaq companies." },
  { id: "sp500", symbol: "SPX", name: "S&P 500", category: "Indices", price: 5468.32, change24h: 0.79, changeAbs: 42.9, marketCap: null, volume: null, high24h: 5475, low24h: 5425, open24h: 5425.4, prevClose: 5425.4, color: "#34d399", glyph: "S", status: "open", region: "US", about: "The benchmark index of 500 large-cap US equities." },
  { id: "dow", symbol: "DJI", name: "Dow Jones", category: "Indices", price: 39118.06, change24h: 0.31, changeAbs: 120.5, marketCap: null, volume: null, high24h: 39190, low24h: 38920, open24h: 38997.6, prevClose: 38997.6, color: "#e0a040", glyph: "D", status: "open", region: "US", about: "Price-weighted index of 30 prominent US companies." },
  { id: "nikkei", symbol: "N225", name: "Nikkei 225", category: "Indices", price: 38925.4, change24h: -0.52, changeAbs: -203.1, marketCap: null, volume: null, high24h: 39210, low24h: 38800, open24h: 39128.5, prevClose: 39128.5, color: "#d24b3f", glyph: "日", status: "closed", region: "Asia", about: "Japan's premier equity benchmark." },
  { id: "ftse", symbol: "FTSE", name: "FTSE 100", category: "Indices", price: 8204.12, change24h: 0.18, changeAbs: 14.7, marketCap: null, volume: null, high24h: 8221, low24h: 8180, open24h: 8189.4, prevClose: 8189.4, color: "#7a8aa0", glyph: "£", status: "closed", region: "Europe", about: "Index of the 100 largest companies on the London Stock Exchange." },
  { id: "dax", symbol: "DAX", name: "DAX 40", category: "Indices", price: 18472.6, change24h: 0.44, changeAbs: 80.9, marketCap: null, volume: null, high24h: 18510, low24h: 18380, open24h: 18391.7, prevClose: 18391.7, color: "#9aa0a6", glyph: "€", status: "closed", region: "Europe", about: "Germany's blue-chip stock market index." },
  { id: "russell2000", symbol: "RUT", name: "Russell 2000", category: "Indices", price: 2042.3, change24h: 0.4, changeAbs: 8.1, marketCap: null, volume: null, high24h: 2051, low24h: 2028, open24h: 2034.2, prevClose: 2034.2, color: "#6f7bf7", glyph: "R", status: "open", region: "US", about: "A benchmark of 2,000 small-cap US companies, a gauge of domestic risk appetite." },
  { id: "cac", symbol: "CAC", name: "CAC 40", category: "Indices", price: 7602.5, change24h: 0.29, changeAbs: 22.3, marketCap: null, volume: null, high24h: 7620, low24h: 7570, open24h: 7580.2, prevClose: 7580.2, color: "#4f8bff", glyph: "C", status: "closed", region: "Europe", about: "Benchmark index of the 40 largest Euronext Paris-listed companies." },
  { id: "estox", symbol: "SX5E", name: "Euro Stoxx 50", category: "Indices", price: 4952.1, change24h: 0.2, changeAbs: 9.8, marketCap: null, volume: null, high24h: 4968, low24h: 4935, open24h: 4942.3, prevClose: 4942.3, color: "#9aa0a6", glyph: "€50", status: "closed", region: "Europe", about: "The leading blue-chip index for the Eurozone." },
  { id: "shanghai", symbol: "SSEC", name: "Shanghai Composite", category: "Indices", price: 3051.2, change24h: -0.3, changeAbs: -9.2, marketCap: null, volume: null, high24h: 3068, low24h: 3042, open24h: 3060.4, prevClose: 3060.4, color: "#d24b3f", glyph: "沪", status: "closed", region: "Asia", about: "China's broad mainland equity benchmark." },
  { id: "hangseng", symbol: "HSI", name: "Hang Seng", category: "Indices", price: 17651.4, change24h: -0.7, changeAbs: -124.6, marketCap: null, volume: null, high24h: 17820, low24h: 17610, open24h: 17776, prevClose: 17776, color: "#d24b3f", glyph: "港", status: "closed", region: "Asia", about: "Hong Kong's flagship stock market index." },
  { id: "nifty", symbol: "NIFTY", name: "Nifty 50", category: "Indices", price: 23798.4, change24h: 0.5, changeAbs: 118.4, marketCap: null, volume: null, high24h: 23860, low24h: 23670, open24h: 23680, prevClose: 23680, color: "#34d399", glyph: "₹", status: "closed", region: "Asia", about: "India's benchmark index of 50 large-cap companies on the NSE." },
  { id: "bovespa", symbol: "IBOV", name: "Bovespa", category: "Indices", price: 121450, change24h: 0.2, changeAbs: 242, marketCap: null, volume: null, high24h: 121900, low24h: 121100, open24h: 121208, prevClose: 121208, color: "#e0b84a", glyph: "$", status: "closed", region: "LatAm", about: "Brazil's primary stock index, a key gauge of Latin American markets." },
  // ---- Americas (extended) ----
  { id: "nasdaqcomp", symbol: "IXIC", name: "Nasdaq Composite", category: "Indices", price: 17212.4, change24h: 1.51, changeAbs: 256.1, marketCap: null, volume: null, high24h: 17280, low24h: 16920, open24h: 16956.3, prevClose: 16956.3, color: "#4f8bff", glyph: "NQ", status: "open", region: "US", about: "Broad market index of all stocks listed on the Nasdaq stock market." },
  { id: "russell1000", symbol: "RUI", name: "Russell 1000", category: "Indices", price: 3184.6, change24h: 0.72, changeAbs: 22.7, marketCap: null, volume: null, high24h: 3192, low24h: 3152, open24h: 3161.9, prevClose: 3161.9, color: "#6f7bf7", glyph: "R1", status: "open", region: "US", about: "Large-cap index of the largest 1,000 US companies by market cap." },
  { id: "russell3000", symbol: "RUA", name: "Russell 3000", category: "Indices", price: 2724.1, change24h: 0.68, changeAbs: 18.4, marketCap: null, volume: null, high24h: 2730, low24h: 2700, open24h: 2705.7, prevClose: 2705.7, color: "#6f7bf7", glyph: "R3", status: "open", region: "US", about: "Broad index capturing about 98% of investable US equities." },
  { id: "wilshire5000", symbol: "W5000", name: "Wilshire 5000", category: "Indices", price: 54820.7, change24h: 0.74, changeAbs: 402.5, marketCap: null, volume: null, high24h: 54920, low24h: 54380, open24h: 54418.2, prevClose: 54418.2, color: "#9aa0a6", glyph: "W", status: "open", region: "US", about: "The broadest measure of the entire US stock market." },
  { id: "sox", symbol: "SOX", name: "PHLX Semiconductor", category: "Indices", price: 5542.8, change24h: 2.64, changeAbs: 142.4, marketCap: null, volume: null, high24h: 5560, low24h: 5390, open24h: 5400.4, prevClose: 5400.4, color: "#76b900", glyph: "SoC", status: "open", region: "US", about: "The leading benchmark for semiconductor equities, a chip-cycle bellwether." },
  { id: "dowtrans", symbol: "DJT", name: "Dow Jones Transportation", category: "Indices", price: 15842.3, change24h: 0.42, changeAbs: 66.3, marketCap: null, volume: null, high24h: 15900, low24h: 15740, open24h: 15776, prevClose: 15776, color: "#e0a040", glyph: "T", status: "open", region: "US", about: "Tracks 20 major US transportation companies, a key Dow Theory component." },
  { id: "dowutil", symbol: "DJU", name: "Dow Jones Utilities", category: "Indices", price: 988.5, change24h: -0.18, changeAbs: -1.8, marketCap: null, volume: null, high24h: 992, low24h: 985, open24h: 990.3, prevClose: 990.3, color: "#3fbf8f", glyph: "U", status: "open", region: "US", about: "Benchmark of 15 US utility companies, sensitive to rate moves." },
  { id: "tsx", symbol: "GSPTSE", name: "S&P/TSX Composite", category: "Indices", price: 21984.2, change24h: 0.34, changeAbs: 74.5, marketCap: null, volume: null, high24h: 22030, low24h: 21880, open24h: 21909.7, prevClose: 21909.7, color: "#d24b3f", glyph: "🍁", status: "closed", region: "Americas", about: "The flagship benchmark of the Toronto Stock Exchange." },
  { id: "ipc", symbol: "MXX", name: "S&P/BMV IPC", category: "Indices", price: 52718.5, change24h: -0.12, changeAbs: -63.3, marketCap: null, volume: null, high24h: 52950, low24h: 52610, open24h: 52781.8, prevClose: 52781.8, color: "#5b9bd5", glyph: "MX", status: "closed", region: "Americas", about: "Mexico's primary equity benchmark on the BMV exchange." },
  { id: "merval", symbol: "MERV", name: "S&P Merval", category: "Indices", price: 1648300, change24h: 1.84, changeAbs: 29810, marketCap: null, volume: null, high24h: 1660000, low24h: 1605000, open24h: 1618490, prevClose: 1618490, color: "#7aa8e0", glyph: "AR", status: "closed", region: "Americas", about: "The main index of the Buenos Aires Stock Exchange." },
  { id: "ipsa", symbol: "IPSA", name: "SIPS Chile IPSA", category: "Indices", price: 6412.8, change24h: 0.56, changeAbs: 35.7, marketCap: null, volume: null, high24h: 6430, low24h: 6370, open24h: 6377.1, prevClose: 6377.1, color: "#34d399", glyph: "CL", status: "closed", region: "Americas", about: "Chile's benchmark index of the most traded Santiago stocks." },
  { id: "colcap", symbol: "COLCAP", name: "COLCAP", category: "Indices", price: 1284.6, change24h: 0.22, changeAbs: 2.8, marketCap: null, volume: null, high24h: 1290, low24h: 1280, open24h: 1281.8, prevClose: 1281.8, color: "#e0b84a", glyph: "CO", status: "closed", region: "Americas", about: "Colombia's principal stock market indicator." },
  { id: "rtsy", symbol: "RTS", name: "RTS Index", category: "Indices", price: 1148.2, change24h: -0.61, changeAbs: -7.1, marketCap: null, volume: null, high24h: 1160, low24h: 1144, open24h: 1155.3, prevClose: 1155.3, color: "#d24b3f", glyph: "RU", status: "closed", region: "Europe", about: "Russia's dollar-denominated equity benchmark on MOEX." },
  // ---- Europe (extended) ----
  { id: "ftse250", symbol: "MCX", name: "FTSE 250", category: "Indices", price: 20680.4, change24h: 0.27, changeAbs: 55.6, marketCap: null, volume: null, high24h: 20720, low24h: 20590, open24h: 20624.8, prevClose: 20624.8, color: "#7a8aa0", glyph: "250", status: "closed", region: "Europe", about: "Mid-cap index of the 101st–350th largest UK companies." },
  { id: "aex", symbol: "AEX", name: "AEX", category: "Indices", price: 908.4, change24h: 0.31, changeAbs: 2.8, marketCap: null, volume: null, high24h: 912, low24h: 904, open24h: 905.6, prevClose: 905.6, color: "#e0a040", glyph: "NL", status: "closed", region: "Europe", about: "The Netherlands' blue-chip index on Euronext Amsterdam." },
  { id: "bel20", symbol: "BEL", name: "BEL 20", category: "Indices", price: 3872.6, change24h: 0.19, changeAbs: 7.3, marketCap: null, volume: null, high24h: 3880, low24h: 3860, open24h: 3865.3, prevClose: 3865.3, color: "#9aa0a6", glyph: "BE", status: "closed", region: "Europe", about: "Belgium's benchmark index of 20 Euronext Brussels listings." },
  { id: "ibex", symbol: "IBEX", name: "IBEX 35", category: "Indices", price: 11148.2, change24h: 0.36, changeAbs: 40, marketCap: null, volume: null, high24h: 11170, low24h: 11100, open24h: 11108.2, prevClose: 11108.2, color: "#e0a040", glyph: "ES", status: "closed", region: "Europe", about: "Spain's benchmark of 35 leading companies on the BME exchange." },
  { id: "ftsemib", symbol: "FTSEMIB", name: "FTSE MIB", category: "Indices", price: 33580.7, change24h: 0.41, changeAbs: 137.3, marketCap: null, volume: null, high24h: 33640, low24h: 33380, open24h: 33443.4, prevClose: 33443.4, color: "#4f8bff", glyph: "IT", status: "closed", region: "Europe", about: "Italy's primary benchmark of major Borsa Italiana listings." },
  { id: "smi", symbol: "SMI", name: "Swiss Market Index", category: "Indices", price: 11982.4, change24h: 0.24, changeAbs: 28.6, marketCap: null, volume: null, high24h: 12010, low24h: 11940, open24h: 11953.8, prevClose: 11953.8, color: "#d24b3f", glyph: "CH", status: "closed", region: "Europe", about: "Switzerland's blue-chip index of the largest SIX-listed companies." },
  { id: "omxs30", symbol: "OMXS30", name: "OMX Stockholm 30", category: "Indices", price: 2486.5, change24h: 0.33, changeAbs: 8.2, marketCap: null, volume: null, high24h: 2492, low24h: 2474, open24h: 2478.3, prevClose: 2478.3, color: "#5b9bd5", glyph: "SE", status: "closed", region: "Europe", about: "Sweden's benchmark of the 30 most traded Nasdaq Stockholm stocks." },
  { id: "obx", symbol: "OBX", name: "Oslo Børs OBX", category: "Indices", price: 924.8, change24h: -0.22, changeAbs: -2, marketCap: null, volume: null, high24h: 930, low24h: 922, open24h: 926.8, prevClose: 926.8, color: "#7a8aa0", glyph: "NO", status: "closed", region: "Europe", about: "Norway's leading equity index, energy-weighted." },
  { id: "wig20", symbol: "WIG", name: "WIG 20", category: "Indices", price: 2248.6, change24h: 0.47, changeAbs: 10.5, marketCap: null, volume: null, high24h: 2256, low24h: 2234, open24h: 2238.1, prevClose: 2238.1, color: "#d24b3f", glyph: "PL", status: "closed", region: "Europe", about: "Poland's blue-chip index on the Warsaw Stock Exchange." },
  { id: "bist", symbol: "XU100", name: "BIST 100", category: "Indices", price: 10248.3, change24h: 0.9, changeAbs: 91.4, marketCap: null, volume: null, high24h: 10280, low24h: 10120, open24h: 10156.9, prevClose: 10156.9, color: "#e0a040", glyph: "TR", status: "closed", region: "Europe", about: "Turkey's benchmark index on Borsa Istanbul." },
  { id: "atx", symbol: "ATX", name: "Austrian Traded Index", category: "Indices", price: 3842.1, change24h: 0.28, changeAbs: 10.7, marketCap: null, volume: null, high24h: 3852, low24h: 3824, open24h: 3831.4, prevClose: 3831.4, color: "#9aa0a6", glyph: "AT", status: "closed", region: "Europe", about: "Austria's benchmark of the most traded Vienna Stock Exchange shares." },
  { id: "psi", symbol: "PSI20", name: "PSI 20", category: "Indices", price: 6218.4, change24h: 0.15, changeAbs: 9.3, marketCap: null, volume: null, high24h: 6230, low24h: 6200, open24h: 6209.1, prevClose: 6209.1, color: "#4f8bff", glyph: "PT", status: "closed", region: "Europe", about: "Portugal's benchmark index on Euronext Lisbon." },
  { id: "athens", symbol: "ASE", name: "Athens General", category: "Indices", price: 1428.6, change24h: 0.74, changeAbs: 10.5, marketCap: null, volume: null, high24h: 1434, low24h: 1412, open24h: 1418.1, prevClose: 1418.1, color: "#5b9bd5", glyph: "GR", status: "closed", region: "Europe", about: "Greece's benchmark composite index of the Athens Stock Exchange." },
  { id: "px", symbol: "PX", name: "Prague PX", category: "Indices", price: 1452.3, change24h: 0.21, changeAbs: 3, marketCap: null, volume: null, high24h: 1456, low24h: 1446, open24h: 1449.3, prevClose: 1449.3, color: "#7a8aa0", glyph: "CZ", status: "closed", region: "Europe", about: "Czech Republic's broad benchmark on the Prague Stock Exchange." },
  { id: "budapest", symbol: "BUX", name: "Budapest BUX", category: "Indices", price: 65184.2, change24h: 0.38, changeAbs: 246.9, marketCap: null, volume: null, high24h: 65400, low24h: 64820, open24h: 64937.3, prevClose: 64937.3, color: "#9aa0a6", glyph: "HU", status: "closed", region: "Europe", about: "Hungary's blue-chip index on the Budapest Stock Exchange." },
  { id: "iseq", symbol: "ISEQ", name: "ISEQ General", category: "Indices", price: 9428.7, change24h: 0.26, changeAbs: 24.5, marketCap: null, volume: null, high24h: 9440, low24h: 9392, open24h: 9404.2, prevClose: 9404.2, color: "#34d399", glyph: "IE", status: "closed", region: "Europe", about: "Ireland's benchmark index on Euronext Dublin." },
  // ---- Asia-Pacific (extended) ----
  { id: "topix", symbol: "TOPX", name: "TOPIX", category: "Indices", price: 2728.6, change24h: -0.34, changeAbs: -9.3, marketCap: null, volume: null, high24h: 2744, low24h: 2720, open24h: 2737.9, prevClose: 2737.9, color: "#d24b3f", glyph: "日", status: "closed", region: "Asia", about: "Japan's broad market-cap weighted index covering all TSE First Section stocks." },
  { id: "kospi", symbol: "KS11", name: "KOSPI", category: "Indices", price: 2738.4, change24h: 0.62, changeAbs: 16.9, marketCap: null, volume: null, high24h: 2748, low24h: 2718, open24h: 2721.5, prevClose: 2721.5, color: "#4f8bff", glyph: "KR", status: "closed", region: "Asia", about: "South Korea's composite benchmark on the Korea Exchange." },
  { id: "kosdaq", symbol: "KOSDAQ", name: "KOSDAQ", category: "Indices", price: 868.2, change24h: 0.88, changeAbs: 7.6, marketCap: null, volume: null, high24h: 872, low24h: 860, open24h: 860.6, prevClose: 860.6, color: "#6f7bf7", glyph: "KQ", status: "closed", region: "Asia", about: "South Korea's tech and growth-focused market, akin to Nasdaq." },
  { id: "taiex", symbol: "TWII", name: "TAIEX", category: "Indices", price: 22384.5, change24h: 1.12, changeAbs: 248.6, marketCap: null, volume: null, high24h: 22420, low24h: 22090, open24h: 22135.9, prevClose: 22135.9, color: "#5b9bd5", glyph: "TW", status: "closed", region: "Asia", about: "Taiwan's benchmark capitalization-weighted index of the TWSE." },
  { id: "csi300", symbol: "CSI300", name: "CSI 300", category: "Indices", price: 3628.4, change24h: -0.42, changeAbs: -15.3, marketCap: null, volume: null, high24h: 3654, low24h: 3618, open24h: 3643.7, prevClose: 3643.7, color: "#d24b3f", glyph: "A", status: "closed", region: "Asia", about: "China's flagship index of the 300 largest A-share stocks." },
  { id: "szsecomp", symbol: "SZSC", name: "Shenzhen Component", category: "Indices", price: 9486.2, change24h: -0.36, changeAbs: -34.3, marketCap: null, volume: null, high24h: 9540, low24h: 9470, open24h: 9520.5, prevClose: 9520.5, color: "#d24b3f", glyph: "深", status: "closed", region: "Asia", about: "Benchmark of 500 leading stocks on the Shenzhen Stock Exchange." },
  { id: "sensex", symbol: "BSESN", name: "BSE Sensex", category: "Indices", price: 78482.6, change24h: 0.58, changeAbs: 453.7, marketCap: null, volume: null, high24h: 78620, low24h: 77960, open24h: 78028.9, prevClose: 78028.9, color: "#34d399", glyph: "₹", status: "closed", region: "Asia", about: "India's oldest and most widely tracked benchmark of 30 BSE stocks." },
  { id: "niftybank", symbol: "NIFTYBANK", name: "Nifty Bank", category: "Indices", price: 52840.3, change24h: 0.71, changeAbs: 373.4, marketCap: null, volume: null, high24h: 53000, low24h: 52400, open24h: 52466.9, prevClose: 52466.9, color: "#e0a040", glyph: "₹", status: "closed", region: "Asia", about: "Benchmark of India's most liquid and large-capitalized banking stocks." },
  { id: "straits", symbol: "STI", name: "Straits Times", category: "Indices", price: 3348.7, change24h: 0.19, changeAbs: 6.3, marketCap: null, volume: null, high24h: 3354, low24h: 3338, open24h: 3342.4, prevClose: 3342.4, color: "#d24b3f", glyph: "SG", status: "closed", region: "Asia", about: "Singapore's benchmark of 30 SGX-listed companies." },
  { id: "jakarta", symbol: "JKSE", name: "Jakarta Composite", category: "Indices", price: 7284.6, change24h: 0.44, changeAbs: 31.9, marketCap: null, volume: null, high24h: 7300, low24h: 7240, open24h: 7252.7, prevClose: 7252.7, color: "#d24b3f", glyph: "ID", status: "closed", region: "Asia", about: "Indonesia's all-share benchmark on the Indonesia Stock Exchange." },
  { id: "set", symbol: "SET", name: "SET Index", category: "Indices", price: 1372.4, change24h: -0.28, changeAbs: -3.8, marketCap: null, volume: null, high24h: 1380, low24h: 1368, open24h: 1376.2, prevClose: 1376.2, color: "#7aa8e0", glyph: "TH", status: "closed", region: "Asia", about: "Thailand's benchmark composite index on the Stock Exchange of Thailand." },
  { id: "klci", symbol: "KLSE", name: "FTSE Bursa KLCI", category: "Indices", price: 1608.3, change24h: 0.16, changeAbs: 2.6, marketCap: null, volume: null, high24h: 1612, low24h: 1603, open24h: 1605.7, prevClose: 1605.7, color: "#e0a040", glyph: "MY", status: "closed", region: "Asia", about: "Malaysia's benchmark of 30 largest Bursa Malaysia companies." },
  { id: "psei", symbol: "PSEI", name: "PSEi", category: "Indices", price: 6542.1, change24h: -0.51, changeAbs: -33.6, marketCap: null, volume: null, high24h: 6584, low24h: 6530, open24h: 6575.7, prevClose: 6575.7, color: "#5b9bd5", glyph: "PH", status: "closed", region: "Asia", about: "The Philippines' benchmark of 30 leading Philippine Stock Exchange companies." },
  { id: "vnindex", symbol: "VNINDEX", name: "VN-Index", category: "Indices", price: 1278.4, change24h: 0.82, changeAbs: 10.4, marketCap: null, volume: null, high24h: 1284, low24h: 1264, open24h: 1268, prevClose: 1268, color: "#d24b3f", glyph: "VN", status: "closed", region: "Asia", about: "Vietnam's capitalization-weighted benchmark on the Ho Chi Minh Stock Exchange." },
  { id: "asx200", symbol: "AXJO", name: "S&P/ASX 200", category: "Indices", price: 7824.6, change24h: 0.4, changeAbs: 31.2, marketCap: null, volume: null, high24h: 7840, low24h: 7780, open24h: 7793.4, prevClose: 7793.4, color: "#5b9bd5", glyph: "AU", status: "closed", region: "Oceania", about: "Australia's benchmark of the 200 largest ASX-listed companies." },
  { id: "nzx50", symbol: "NZ50", name: "S&P/NZX 50", category: "Indices", price: 11842.7, change24h: 0.22, changeAbs: 26, marketCap: null, volume: null, high24h: 11860, low24h: 11800, open24h: 11816.7, prevClose: 11816.7, color: "#34d399", glyph: "NZ", status: "closed", region: "Oceania", about: "New Zealand's benchmark of the 50 largest NZX-listed companies." },
  { id: "colombo", symbol: "CSE", name: "S&P SL20", category: "Indices", price: 9842.3, change24h: 0.33, changeAbs: 32.4, marketCap: null, volume: null, high24h: 9870, low24h: 9800, open24h: 9809.9, prevClose: 9809.9, color: "#7aa8e0", glyph: "LK", status: "closed", region: "Asia", about: "Sri Lanka's benchmark of leading Colombo Stock Exchange companies." },
  // ---- Middle East & Africa ----
  { id: "tadawul", symbol: "TASI", name: "Tadawul All Share", category: "Indices", price: 11842.6, change24h: 0.54, changeAbs: 63.7, marketCap: null, volume: null, high24h: 11880, low24h: 11760, open24h: 11778.9, prevClose: 11778.9, color: "#34d399", glyph: "SA", status: "open", region: "MiddleEast", about: "Saudi Arabia's benchmark all-share index on the Tadawul exchange." },
  { id: "dfm", symbol: "DFMGI", name: "Dubai General", category: "Indices", price: 4286.4, change24h: 0.31, changeAbs: 13.2, marketCap: null, volume: null, high24h: 4300, low24h: 4268, open24h: 4273.2, prevClose: 4273.2, color: "#e0a040", glyph: "AE", status: "open", region: "MiddleEast", about: "The Dubai Financial Market's broad general index." },
  { id: "adx", symbol: "ADI", name: "Abu Dhabi General", category: "Indices", price: 9184.2, change24h: 0.42, changeAbs: 38.4, marketCap: null, volume: null, high24h: 9200, low24h: 9140, open24h: 9145.8, prevClose: 9145.8, color: "#5b9bd5", glyph: "AD", status: "open", region: "MiddleEast", about: "Abu Dhabi Securities Exchange's general index." },
  { id: "telaviv", symbol: "TA125", name: "Tel Aviv 125", category: "Indices", price: 1968.4, change24h: -0.18, changeAbs: -3.5, marketCap: null, volume: null, high24h: 1980, low24h: 1962, open24h: 1971.9, prevClose: 1971.9, color: "#4f8bff", glyph: "IL", status: "open", region: "MiddleEast", about: "Israel's benchmark of 125 leading Tel Aviv Stock Exchange companies." },
  { id: "qatar", symbol: "QSI", name: "QE General", category: "Indices", price: 10284.6, change24h: 0.36, changeAbs: 36.9, marketCap: null, volume: null, high24h: 10310, low24h: 10230, open24h: 10247.7, prevClose: 10247.7, color: "#7aa8e0", glyph: "QA", status: "open", region: "MiddleEast", about: "Qatar Stock Exchange's general index." },
  { id: "jse", symbol: "JTOPS", name: "FTSE/JSE Top 40", category: "Indices", price: 78284.3, change24h: 0.27, changeAbs: 210.4, marketCap: null, volume: null, high24h: 78500, low24h: 77940, open24h: 78073.9, prevClose: 78073.9, color: "#e0a040", glyph: "ZA", status: "open", region: "Africa", about: "South Africa's benchmark of the 40 largest Johannesburg Stock Exchange companies." },
  { id: "egx30", symbol: "EGX30", name: "EGX 30", category: "Indices", price: 27842.6, change24h: 0.65, changeAbs: 179.7, marketCap: null, volume: null, high24h: 28000, low24h: 27620, open24h: 27662.9, prevClose: 27662.9, color: "#d24b3f", glyph: "EG", status: "open", region: "Africa", about: "Egypt's benchmark of the 30 largest Egyptian Exchange companies." },
  { id: "nseke", symbol: "NSE20", name: "NSE 20", category: "Indices", price: 1824.6, change24h: 0.12, changeAbs: 2.2, marketCap: null, volume: null, high24h: 1830, low24h: 1818, open24h: 1822.4, prevClose: 1822.4, color: "#34d399", glyph: "KE", status: "open", region: "Africa", about: "Kenya's benchmark index of the Nairobi Securities Exchange." },

  // ---------- Metals ----------
  { id: "gold", symbol: "XAU", name: "Gold", category: "Metals", price: 2358.4, change24h: 0.66, changeAbs: 15.5, marketCap: null, volume: null, high24h: 2366, low24h: 2340, open24h: 2342.9, prevClose: 2342.9, color: "#e0b84a", glyph: "Au", status: "open", about: "The traditional safe-haven precious metal and inflation hedge." },
  { id: "silver", symbol: "XAG", name: "Silver", category: "Metals", price: 28.74, change24h: 1.42, changeAbs: 0.4, marketCap: null, volume: null, high24h: 28.9, low24h: 28.2, open24h: 28.34, prevClose: 28.34, color: "#aeb6c2", glyph: "Ag", status: "open", about: "Industrial and monetary metal with strong demand from solar and electronics." },
  { id: "platinum", symbol: "XPT", name: "Platinum", category: "Metals", price: 968.2, change24h: -0.36, changeAbs: -3.5, marketCap: null, volume: null, high24h: 975, low24h: 965, open24h: 971.7, prevClose: 971.7, color: "#b8c0cc", glyph: "Pt", status: "open", about: "Rare precious metal used in catalytic converters and industry." },
  { id: "palladium", symbol: "XPD", name: "Palladium", category: "Metals", price: 962.5, change24h: -1.12, changeAbs: -10.9, marketCap: null, volume: null, high24h: 980, low24h: 958, open24h: 973.4, prevClose: 973.4, color: "#8fa0b3", glyph: "Pd", status: "open", about: "Catalytic converter metal sensitive to auto demand cycles." },

  // ---------- Commodities ----------
  { id: "oil", symbol: "WTI", name: "Crude Oil WTI", category: "Commodities", price: 78.42, change24h: -1.05, changeAbs: -0.83, marketCap: null, volume: null, high24h: 79.8, low24h: 77.9, open24h: 79.25, prevClose: 79.25, color: "#5b6470", glyph: "🛢", status: "open", about: "US benchmark crude oil futures contract." },
  { id: "brent", symbol: "BRENT", name: "Brent Crude", category: "Commodities", price: 82.6, change24h: -0.92, changeAbs: -0.77, marketCap: null, volume: null, high24h: 83.9, low24h: 82.1, open24h: 83.37, prevClose: 83.37, color: "#6b7280", glyph: "🛢", status: "open", about: "Global benchmark for Atlantic basin crude oils." },
  { id: "natgas", symbol: "NG", name: "Natural Gas", category: "Commodities", price: 2.78, change24h: 2.31, changeAbs: 0.063, marketCap: null, volume: null, high24h: 2.81, low24h: 2.71, open24h: 2.717, prevClose: 2.717, color: "#5b9bd5", glyph: "⚛", status: "open", about: "US natural gas Henry Hub futures." },
  { id: "copper", symbol: "HG", name: "Copper", category: "Commodities", price: 4.52, change24h: 0.88, changeAbs: 0.039, marketCap: null, volume: null, high24h: 4.55, low24h: 4.47, open24h: 4.481, prevClose: 4.481, color: "#c97b4a", glyph: "Cu", status: "open", about: "Industrial metal seen as a gauge of global economic health." },

  // ---------- Forex ----------
  { id: "eurusd", symbol: "EUR/USD", name: "Euro / US Dollar", category: "Forex", price: 1.0852, change24h: 0.21, changeAbs: 0.0023, marketCap: null, volume: null, high24h: 1.0871, low24h: 1.0829, open24h: 1.0829, prevClose: 1.0829, color: "#4f8bff", glyph: "€", status: "open", about: "The most traded currency pair in the world." },
  { id: "gbpusd", symbol: "GBP/USD", name: "British Pound / US Dollar", category: "Forex", price: 1.2718, change24h: -0.14, changeAbs: -0.0018, marketCap: null, volume: null, high24h: 1.2745, low24h: 1.2701, open24h: 1.2736, prevClose: 1.2736, color: "#7a8aa0", glyph: "£", status: "open", about: "Major currency pair known as cable." },
  { id: "usdjpy", symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "Forex", price: 156.84, change24h: 0.32, changeAbs: 0.5, marketCap: null, volume: null, high24h: 157.1, low24h: 156.2, open24h: 156.34, prevClose: 156.34, color: "#d24b3f", glyph: "¥", status: "open", about: "Liquid pair sensitive to rate differentials and BoJ policy." },
  { id: "dxy", symbol: "DXY", name: "US Dollar Index", category: "Forex", price: 104.62, change24h: -0.18, changeAbs: -0.19, marketCap: null, volume: null, high24h: 104.9, low24h: 104.4, open24h: 104.81, prevClose: 104.81, color: "#5b9bd5", glyph: "$", status: "open", about: "A measure of the US dollar against a basket of major currencies." },
  { id: "audusd", symbol: "AUD/USD", name: "Australian Dollar / US Dollar", category: "Forex", price: 0.6642, change24h: 0.27, changeAbs: 0.0018, marketCap: null, volume: null, high24h: 0.666, low24h: 0.662, open24h: 0.6624, prevClose: 0.6624, color: "#34d399", glyph: "A$", status: "open", about: "Commodity-linked currency pair." },

  // ---------- Bonds ----------
  { id: "us10y", symbol: "US10Y", name: "US 10-Year Yield", category: "Bonds", price: 4.462, change24h: -0.94, changeAbs: -0.042, marketCap: null, volume: null, high24h: 4.52, low24h: 4.44, open24h: 4.504, prevClose: 4.504, color: "#6f7bf7", glyph: "10", status: "open", about: "Benchmark US Treasury yield, a global risk-free rate reference." },
  { id: "us2y", symbol: "US2Y", name: "US 2-Year Yield", category: "Bonds", price: 4.938, change24h: -0.61, changeAbs: -0.03, marketCap: null, volume: null, high24h: 4.98, low24h: 4.92, open24h: 4.968, prevClose: 4.968, color: "#8b93b8", glyph: "2", status: "open", about: "Short-term Treasury yield sensitive to Fed policy expectations." },
  { id: "us30y", symbol: "US30Y", name: "US 30-Year Yield", category: "Bonds", price: 4.591, change24h: -1.08, changeAbs: -0.05, marketCap: null, volume: null, high24h: 4.66, low24h: 4.57, open24h: 4.641, prevClose: 4.641, color: "#5b6470", glyph: "30", status: "open", about: "Long-duration Treasury yield benchmark." },

  // ---------- Economy ----------
  { id: "vix", symbol: "VIX", name: "Volatility Index", category: "Economy", price: 13.18, change24h: -3.42, changeAbs: -0.47, marketCap: null, volume: null, high24h: 13.8, low24h: 13.05, open24h: 13.65, prevClose: 13.65, color: "#aeb6c2", glyph: "σ", status: "open", about: "The market's fear gauge measuring expected S&P 500 volatility." },
  { id: "cpi", symbol: "CPI", name: "US CPI YoY", category: "Economy", price: 3.3, change24h: 0, changeAbs: 0, marketCap: null, volume: null, high24h: 3.3, low24h: 3.3, open24h: 3.3, prevClose: 3.3, color: "#d24b3f", glyph: "%", status: "closed", about: "Year-over-year consumer price inflation, a core Fed input." },
  { id: "gdpnow", symbol: "GDP", name: "US GDP Nowcast", category: "Economy", price: 2.4, change24h: 0.12, changeAbs: 0.003, marketCap: null, volume: null, high24h: 2.4, low24h: 2.4, open24h: 2.4, prevClose: 2.4, color: "#34d399", glyph: "≈", status: "open", about: "Real-time estimate of US GDP growth." },
];

export const assetMap: Record<string, Asset> = Object.fromEntries(
  assets.map((a) => [a.id, a])
);

export function getAsset(id: string | null | undefined): Asset | undefined {
  if (!id) return undefined;
  return assetMap[id];
}

export function byCategory(cat: Category): Asset[] {
  return assets.filter((a) => a.category === cat);
}

const BULL_BANK = {
  Crypto: ["Spot ETF inflows and structural demand remain supportive.", "Network adoption and active addresses are trending higher.", "On-chain metrics show long-term holders accumulating."],
  Stocks: ["Earnings revisions are drifting higher into the print.", "Buyback activity is providing a bid under price.", "Margin trends and free cash flow look durable."],
  Indices: ["Breadth is improving beneath the index level.", "Earnings growth is broadening across sectors.", "Seasonal flows favor risk into quarter-end."],
  Metals: ["Real yields are easing, lowering the opportunity cost of holding metal.", "Central-bank buying continues to absorb supply.", "Physical demand from industry remains firm."],
  Commodities: ["Supply discipline from producers is keeping the market tight.", "Inventory draws are signaling firm demand.", "Geopolitical risk premium is building."],
  Forex: ["Rate differential expectations are shifting in favor.", "Positioning remains light, leaving room for upside.", "Risk appetite is supporting the higher-yielding leg."],
  Bonds: ["Cooling inflation supports a softer yield path.", "Demand at auction was well bid.", "Recession hedging flows are lifting duration."],
  ETFs: ["Underlying index momentum is constructive.", "Flows into the fund are accelerating.", "Earnings-weighted breadth is healthy."],
  Economy: ["Forward indicators are stabilizing.", "Soft-landing odds are being repriced higher.", "Growth is holding above stall speed."],
};

const BEAR_BANK = {
  Crypto: ["Regulatory headlines could spark sudden volatility.", "Profit-taking is emerging near prior highs.", "Funding rates are elevated, hinting at leverage."],
  Stocks: ["Valuations are stretched relative to history.", "Guidance commentary has grown more cautious.", "Insider selling has picked up."],
  Indices: ["Concentration risk in mega-caps is elevated.", "Volatility skew is pricing downside demand.", "Late-cycle breadth is narrowing."],
  Metals: ["A stronger dollar typically weighs on pricing.", "Real yields could rise and pressure the metal.", "Jewelry demand is softening seasonally."],
  Commodities: ["Demand destruction risk rises above key levels.", "Mild weather is curbing consumption.", "A demand-led slowdown could pressure the complex."],
  Forex: ["A reversal in rate expectations could unwind gains.", "Central bank intervention risk is non-trivial.", "Liquidity thins around key data releases."],
  Bonds: ["Sticky inflation could push yields higher.", "Heavy supply calendar may weigh on prices.", "Term premium is rebuilding."],
  ETFs: ["Concentration in top holdings magnifies drawdown risk.", "Flows could reverse if momentum fades.", "Multiple compression remains a risk."],
  Economy: ["Inflation progress may stall at these levels.", "Labor market cooling could feed through to demand.", "Fiscal deficits add longer-term uncertainty."],
};

export function getInsight(a: Asset): AIInsight {
  const h = hashStr(a.id);
  const pick = <T,>(arr: T[]): T => arr[h % arr.length];
  const up = a.change24h >= 0;
  const sentiment: AIInsight["sentiment"] =
    a.change24h > 1.2 ? "Bullish" : a.change24h < -1.2 ? "Bearish" : "Neutral";
  const riskScore = Math.round(26 + (h % 54));
  const confidence = Math.round(62 + (h % 33));
  const state = pick(["is firm", "has tapered", "remains average", "is building"]);
  const outcome = pick(["follow-through", "consolidation", "stability", "a near-term base"]);
  const summary = up
    ? `${a.name} is holding above its session open with momentum favoring buyers. Volume ${state}, and the structure suggests ${outcome} as participants absorb the latest macro data. Key support holds near ${fmtPrice(a.low24h)}, with resistance into ${fmtPrice(a.high24h)}.`
    : `${a.name} is trading under pressure, slipping from its opening level as sellers retain control. ${pick(["Volatility is elevated", "Bid support is thinning", "Momentum has cooled"])}, pointing to ${outcome} unless sentiment improves. A reclaim of ${fmtPrice(a.open24h)} would stabilize the tape.`;
  return {
    sentiment,
    riskScore,
    confidence,
    summary,
    bullish: [
      pick(BULL_BANK[a.category]),
      `${pick(["Institutional flows", "Derivatives positioning", "Order-book depth"])} indicate ${pick(["accumulation", "constructive demand", "stabilizing interest"])}.`,
      `Sentiment across ${a.category.toLowerCase()} ${pick(["remains supportive", "is improving", "has stabilized"])}.`,
    ],
    bearish: [
      pick(BEAR_BANK[a.category]),
      `Macro headwinds ${pick(["could cap upside", "add to volatility", "may pressure valuations"])}.`,
      `A break below ${fmtPrice(a.low24h)} ${pick(["would weaken structure", "may trigger stops", "shifts momentum lower"])}.`,
    ],
  };
}

const now = Date.now();
export const news: NewsItem[] = [
  { id: "n1", title: "Bitcoin holds firm above $67K as ETF inflows accelerate into quarter-end", source: "Market Wire", category: "Crypto", ts: now - 9 * 60000, minutes: 4, summary: "Spot Bitcoin ETFs logged a fourth consecutive session of net inflows, bolstering demand-side structure as macro risk appetite improves.", assetIds: ["bitcoin", "ethereum"], featured: true },
  { id: "n2", title: "Nvidia extends AI rally as data-center demand outlook brightens", source: "Tech Brief", category: "Stocks", ts: now - 34 * 60000, minutes: 5, summary: "Suppliers flagged tightening capacity for high-bandwidth memory, reinforcing the compute build-out narrative.", assetIds: ["nvidia", "amd"] },
  { id: "n3", title: "Gold steadies near record as real yields ease and central banks accumulate", source: "Macro Desk", category: "Metals", ts: now - 62 * 60000, minutes: 3, summary: "Official-sector buying continues to absorb supply, underpinning prices even as the dollar stabilizes.", assetIds: ["gold", "silver"] },
  { id: "n4", title: "Oil slips as demand worries outweigh geopolitical risk premium", source: "Energy Daily", category: "Commodities", ts: now - 95 * 60000, minutes: 4, summary: "Mild weather and soft gasoline demand data weighed on crude despite ongoing supply tensions.", assetIds: ["oil", "brent"] },
  { id: "n5", title: "Fed officials signal patience as inflation cools toward target", source: "Central Bank Watch", category: "Macro", ts: now - 140 * 60000, minutes: 6, summary: "Speakers emphasized a data-dependent approach, keeping rate-cut timing uncertain.", assetIds: ["us10y", "dxy", "sp500"] },
  { id: "n6", title: "Solana leads majors higher on record decentralized-exchange volume", source: "On-Chain Times", category: "Crypto", ts: now - 200 * 60000, minutes: 3, summary: "Activity on the network hit a fresh high, reflecting strong user demand for low-fee applications.", assetIds: ["solana", "ethereum"] },
  { id: "n7", title: "Nasdaq 100 notches fresh high on mega-cap strength", source: "Index Note", category: "Indices", ts: now - 280 * 60000, minutes: 4, summary: "Breadth improved as semiconductors joined the advance, lifting the growth-heavy benchmark.", assetIds: ["nasdaq", "sp500", "qqq"] },
  { id: "n8", title: "Yen pares losses as traders eye intervention zone", source: "FX Pulse", category: "Forex", ts: now - 360 * 60000, minutes: 3, summary: "The pair retreated from multi-year highs amid renewed intervention rhetoric.", assetIds: ["usdjpy", "dxy"] },
];

export const events: CalendarEvent[] = [
  { id: "e1", day: 0, time: "08:30", title: "Core CPI (MoM)", flag: "🇺🇸", impact: "high", type: "Inflation", forecast: "0.3%", previous: "0.4%" },
  { id: "e2", day: 0, time: "14:00", title: "FOMC Interest Rate Decision", flag: "🇺🇸", impact: "high", type: "Rates", forecast: "5.50%", previous: "5.50%" },
  { id: "e3", day: 1, time: "09:00", title: "Eurozone GDP (QoQ)", flag: "🇪🇺", impact: "medium", type: "Growth", forecast: "0.4%", previous: "0.3%" },
  { id: "e4", day: 1, time: "16:05", title: "NVIDIA Earnings", flag: "🇺🇸", impact: "high", type: "Earnings", forecast: "EPS 0.64", previous: "EPS 0.61" },
  { id: "e5", day: 2, time: "08:30", title: "Initial Jobless Claims", flag: "🇺🇸", impact: "medium", type: "Growth", forecast: "221K", previous: "219K" },
  { id: "e6", day: 2, time: "03:00", title: "Solana Network Upgrade", flag: "🌐", impact: "low", type: "Crypto", forecast: "v1.18", previous: "—" },
  { id: "e7", day: 3, time: "10:00", title: "Consumer Sentiment", flag: "🇺🇸", impact: "low", type: "Growth", forecast: "72.0", previous: "70.8" },
  { id: "e8", day: 3, time: "06:00", title: "BoJ Policy Statement", flag: "🇯🇵", impact: "high", type: "Rates", forecast: "0.10%", previous: "0.10%" },
  { id: "e9", day: 4, time: "16:05", title: "Apple Earnings", flag: "🇺🇸", impact: "high", type: "Earnings", forecast: "EPS 1.39", previous: "EPS 1.36" },
  { id: "e10", day: 5, time: "08:30", title: "PCE Price Index", flag: "🇺🇸", impact: "high", type: "Inflation", forecast: "0.2%", previous: "0.3%" },
];

export const holdings: Holding[] = [
  { assetId: "bitcoin", amount: 1.85, avgCost: 58200 },
  { assetId: "ethereum", amount: 14.2, avgCost: 2980 },
  { assetId: "nvidia", amount: 120, avgCost: 88.4 },
  { assetId: "apple", amount: 180, avgCost: 189.3 },
  { assetId: "gold", amount: 9, avgCost: 2120 },
  { assetId: "solana", amount: 95, avgCost: 128 },
  { assetId: "sp500", amount: 22, avgCost: 4980 },
];

export const defaultWatchlists = [
  { id: "wl-core", name: "Core", ids: ["bitcoin", "ethereum", "solana", "nvidia", "gold", "sp500"] },
  { id: "wl-metals", name: "Metals & Energy", ids: ["gold", "silver", "oil", "copper", "platinum"] },
];
