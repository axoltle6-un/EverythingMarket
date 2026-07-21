import { hashStr, seededRand } from "./format";
import type { Asset } from "./data";

/* =========================================================================
   Company universe
   - Curated real seeds (real ticker + name) materialized instantly.
   - A large synthetic generator that fills out to ~100k companies, built
     LAZILY only when the directory/search is opened (keeps the landing page
     and dashboard instant).
   - All metrics derived deterministically per symbol → stable + no jumps.
   ========================================================================= */

export interface Company {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  country: string;
  currency: string;
  currencySymbol: string;
  region: string;
  marketCap: number; // USD
  price: number;
  change: number;
  changeAbs: number;
  synthetic: boolean;
}

export const REGIONS = ["Americas", "Europe", "Asia", "Oceania"] as const;

export const SECTORS = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer Discretionary",
  "Communication Services",
  "Industrials",
  "Consumer Staples",
  "Energy",
  "Materials",
  "Utilities",
  "Real Estate",
] as const;

interface ExInfo {
  country: string;
  currency: string;
  region: string;
  csym: string;
}
export const EXCHANGE_INFO: Record<string, ExInfo> = {
  NASDAQ: { country: "United States", currency: "USD", region: "Americas", csym: "$" },
  NYSE: { country: "United States", currency: "USD", region: "Americas", csym: "$" },
  TSX: { country: "Canada", currency: "CAD", region: "Americas", csym: "C$" },
  BMV: { country: "Mexico", currency: "MXN", region: "Americas", csym: "MX$" },
  B3: { country: "Brazil", currency: "BRL", region: "Americas", csym: "R$" },
  LSE: { country: "United Kingdom", currency: "GBP", region: "Europe", csym: "£" },
  EPA: { country: "France", currency: "EUR", region: "Europe", csym: "€" },
  AMS: { country: "Netherlands", currency: "EUR", region: "Europe", csym: "€" },
  XETRA: { country: "Germany", currency: "EUR", region: "Europe", csym: "€" },
  MIL: { country: "Italy", currency: "EUR", region: "Europe", csym: "€" },
  BME: { country: "Spain", currency: "EUR", region: "Europe", csym: "€" },
  SWX: { country: "Switzerland", currency: "CHF", region: "Europe", csym: "CHF " },
  STO: { country: "Sweden", currency: "SEK", region: "Europe", csym: "kr " },
  HEL: { country: "Finland", currency: "EUR", region: "Europe", csym: "€" },
  CPH: { country: "Denmark", currency: "DKK", region: "Europe", csym: "kr " },
  TSE: { country: "Japan", currency: "JPY", region: "Asia", csym: "¥" },
  TWSE: { country: "Taiwan", currency: "TWD", region: "Asia", csym: "NT$" },
  KRX: { country: "South Korea", currency: "KRW", region: "Asia", csym: "₩" },
  HKEX: { country: "Hong Kong", currency: "HKD", region: "Asia", csym: "HK$" },
  SSE: { country: "China", currency: "CNY", region: "Asia", csym: "¥" },
  SZSE: { country: "China", currency: "CNY", region: "Asia", csym: "¥" },
  NSE: { country: "India", currency: "INR", region: "Asia", csym: "₹" },
  BSE: { country: "India", currency: "INR", region: "Asia", csym: "₹" },
  ASX: { country: "Australia", currency: "AUD", region: "Oceania", csym: "A$" },
};

const SECTOR_COLOR: Record<string, string> = {
  Technology: "#4f8bff",
  Healthcare: "#34d399",
  Financials: "#f0b909",
  "Consumer Discretionary": "#6f7bf7",
  "Communication Services": "#9460f0",
  Industrials: "#7a8aa0",
  "Consumer Staples": "#5b9bd5",
  Energy: "#e0a040",
  Materials: "#c97b4a",
  Utilities: "#3fbf8f",
  "Real Estate": "#d24b3f",
};
export function colorFor(sector: string) {
  return SECTOR_COLOR[sector] ?? "#6b7280";
}

/* ---------- deterministic metrics per symbol ---------- */
export interface Metrics {
  price: number;
  change: number;
  changeAbs: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: number;
}

export function metrics(symbol: string): Metrics {
  const r = seededRand(hashStr("m:" + symbol));
  const tier = r();
  let cap: number;
  if (tier < 0.02) cap = 200e9 + r() * 2.5e12;
  else if (tier < 0.1) cap = 10e9 + r() * 190e9;
  else if (tier < 0.3) cap = 2e9 + r() * 8e9;
  else if (tier < 0.7) cap = 3e8 + r() * 1.7e9;
  else cap = 3e7 + r() * 2.7e8;

  const price = +(0.5 + Math.pow(r(), 1.5) * 420).toFixed(2);
  const dir = r() * 2 - 1;
  const mag = Math.pow(Math.abs(dir), 1.3) * 6;
  const change = +(Math.sign(dir) * mag).toFixed(2);
  const prevClose = +(price / (1 + change / 100)).toFixed(2);
  const changeAbs = +(price - prevClose).toFixed(4);
  const high = +(price * (1 + Math.abs(change) / 100 + r() * 0.012)).toFixed(2);
  const low = +(price * (1 - Math.abs(change) / 100 - r() * 0.012)).toFixed(2);
  const open = +(((high + low) / 2) * (0.99 + r() * 0.02)).toFixed(2);
  const volume = Math.round(cap * (0.001 + r() * 0.02));
  return { price, change, changeAbs, marketCap: Math.round(cap), high, low, open, prevClose, volume };
}

/* ---------- real company seeds (ticker, name, exchange, sector) ---------- */
const SEEDS: [string, string, string, string][] = [
  // United States — NASDAQ
  ["AAPL", "Apple", "NASDAQ", "Technology"], ["MSFT", "Microsoft", "NASDAQ", "Technology"],
  ["NVDA", "NVIDIA", "NASDAQ", "Technology"], ["AVGO", "Broadcom", "NASDAQ", "Technology"],
  ["GOOGL", "Alphabet", "NASDAQ", "Communication Services"], ["AMZN", "Amazon", "NASDAQ", "Consumer Discretionary"],
  ["META", "Meta Platforms", "NASDAQ", "Communication Services"], ["TSLA", "Tesla", "NASDAQ", "Consumer Discretionary"],
  ["PEP", "PepsiCo", "NASDAQ", "Consumer Staples"], ["COST", "Costco Wholesale", "NASDAQ", "Consumer Staples"],
  ["CSCO", "Cisco Systems", "NASDAQ", "Technology"], ["ADBE", "Adobe", "NASDAQ", "Technology"],
  ["NFLX", "Netflix", "NASDAQ", "Communication Services"], ["INTC", "Intel", "NASDAQ", "Technology"],
  ["AMD", "Advanced Micro Devices", "NASDAQ", "Technology"], ["AMGN", "Amgen", "NASDAQ", "Healthcare"],
  ["QCOM", "Qualcomm", "NASDAQ", "Technology"], ["TXN", "Texas Instruments", "NASDAQ", "Technology"],
  ["ISRG", "Intuitive Surgical", "NASDAQ", "Healthcare"], ["INTU", "Intuit", "NASDAQ", "Technology"],
  ["BKNG", "Booking Holdings", "NASDAQ", "Consumer Discretionary"], ["MDLZ", "Mondelez International", "NASDAQ", "Consumer Staples"],
  ["GILD", "Gilead Sciences", "NASDAQ", "Healthcare"], ["EQIX", "Equinix", "NASDAQ", "Real Estate"],
  ["TMUS", "T-Mobile US", "NASDAQ", "Communication Services"], ["UBER", "Uber Technologies", "NASDAQ", "Technology"],
  ["ABNB", "Airbnb", "NASDAQ", "Consumer Discretionary"], ["PYPL", "PayPal", "NASDAQ", "Financials"],
  ["COIN", "Coinbase Global", "NASDAQ", "Financials"],
  // United States — NYSE
  ["JPM", "JPMorgan Chase", "NYSE", "Financials"], ["V", "Visa", "NYSE", "Financials"],
  ["WMT", "Walmart", "NYSE", "Consumer Staples"], ["JNJ", "Johnson & Johnson", "NYSE", "Healthcare"],
  ["UNH", "UnitedHealth Group", "NYSE", "Healthcare"], ["MA", "Mastercard", "NYSE", "Financials"],
  ["HD", "Home Depot", "NYSE", "Consumer Discretionary"], ["PG", "Procter & Gamble", "NYSE", "Consumer Staples"],
  ["XOM", "Exxon Mobil", "NYSE", "Energy"], ["KO", "Coca-Cola", "NYSE", "Consumer Staples"],
  ["CVX", "Chevron", "NYSE", "Energy"], ["PFE", "Pfizer", "NYSE", "Healthcare"],
  ["LLY", "Eli Lilly", "NYSE", "Healthcare"], ["ABBV", "AbbVie", "NYSE", "Healthcare"],
  ["MRK", "Merck", "NYSE", "Healthcare"], ["T", "AT&T", "NYSE", "Communication Services"],
  ["VZ", "Verizon", "NYSE", "Communication Services"], ["DIS", "Walt Disney", "NYSE", "Communication Services"],
  ["BAC", "Bank of America", "NYSE", "Financials"], ["WFC", "Wells Fargo", "NYSE", "Financials"],
  ["MS", "Morgan Stanley", "NYSE", "Financials"], ["GS", "Goldman Sachs", "NYSE", "Financials"],
  ["BLK", "BlackRock", "NYSE", "Financials"], ["AXP", "American Express", "NYSE", "Financials"],
  ["CAT", "Caterpillar", "NYSE", "Industrials"], ["BA", "Boeing", "NYSE", "Industrials"],
  ["GE", "GE Aerospace", "NYSE", "Industrials"], ["HON", "Honeywell", "NYSE", "Industrials"],
  ["UPS", "United Parcel Service", "NYSE", "Industrials"], ["FDX", "FedEx", "NYSE", "Industrials"],
  ["LMT", "Lockheed Martin", "NYSE", "Industrials"], ["RTX", "RTX Corporation", "NYSE", "Industrials"],
  ["LOW", "Lowe's", "NYSE", "Consumer Discretionary"], ["MCD", "McDonald's", "NYSE", "Consumer Discretionary"],
  ["NKE", "Nike", "NYSE", "Consumer Discretionary"], ["SBUX", "Starbucks", "NYSE", "Consumer Discretionary"],
  ["TMO", "Thermo Fisher", "NYSE", "Healthcare"], ["ABT", "Abbott Laboratories", "NYSE", "Healthcare"],
  ["ORCL", "Oracle", "NYSE", "Technology"], ["CRM", "Salesforce", "NYSE", "Technology"],
  ["NOW", "ServiceNow", "NYSE", "Technology"], ["IBM", "IBM", "NYSE", "Technology"],
  ["SPGI", "S&P Global", "NYSE", "Financials"], ["MCO", "Moody's", "NYSE", "Financials"],
  ["PLTR", "Palantir", "NYSE", "Technology"], ["SNOW", "Snowflake", "NYSE", "Technology"],
  ["SHOP", "Shopify", "NYSE", "Technology"], ["F", "Ford", "NYSE", "Consumer Discretionary"],
  ["GM", "General Motors", "NYSE", "Consumer Discretionary"], ["TGT", "Target", "NYSE", "Consumer Staples"],
  ["CL", "Colgate-Palmolive", "NYSE", "Consumer Staples"], ["DHR", "Danaher", "NYSE", "Healthcare"],
  ["BMY", "Bristol-Myers Squibb", "NYSE", "Healthcare"], ["USB", "U.S. Bancorp", "NYSE", "Financials"],
  ["MET", "MetLife", "NYSE", "Financials"], ["ALL", "Allstate", "NYSE", "Financials"],
  ["MO", "Altria", "NYSE", "Consumer Staples"], ["PM", "Philip Morris", "NYSE", "Consumer Staples"],
  ["DUK", "Duke Energy", "NYSE", "Utilities"], ["NEE", "NextEra Energy", "NYSE", "Utilities"],
  ["AEP", "American Electric Power", "NYSE", "Utilities"], ["PLD", "Prologis", "NYSE", "Real Estate"],
  ["AMT", "American Tower", "NYSE", "Real Estate"], ["O", "Realty Income", "NYSE", "Real Estate"],
  ["LIN", "Linde", "NYSE", "Materials"], ["SHW", "Sherwin-Williams", "NYSE", "Materials"],
  ["FCX", "Freeport-McMoRan", "NYSE", "Materials"], ["NEM", "Newmont", "NYSE", "Materials"],
  ["DPZ", "Domino's Pizza", "NYSE", "Consumer Discretionary"], ["YUM", "Yum! Brands", "NYSE", "Consumer Discretionary"],
  ["SYK", "Stryker", "NYSE", "Healthcare"], ["ZTS", "Zoetis", "NYSE", "Healthcare"],
  ["CI", "Cigna", "NYSE", "Healthcare"], ["CB", "Chubb", "NYSE", "Financials"],
  ["MMC", "Marsh McLennan", "NYSE", "Financials"], ["PNC", "PNC Financial", "NYSE", "Financials"],
  // Europe
  ["SHEL", "Shell", "LSE", "Energy"], ["BP", "BP", "LSE", "Energy"],
  ["AZN", "AstraZeneca", "LSE", "Healthcare"], ["GSK", "GSK", "LSE", "Healthcare"],
  ["ULVR", "Unilever", "LSE", "Consumer Staples"], ["HSBA", "HSBC", "LSE", "Financials"],
  ["BATS", "British American Tobacco", "LSE", "Consumer Staples"], ["GLEN", "Glencore", "LSE", "Materials"],
  ["RIO", "Rio Tinto", "LSE", "Materials"], ["LLOY", "Lloyds Banking", "LSE", "Financials"],
  ["BARC", "Barclays", "LSE", "Financials"], ["TTE", "TotalEnergies", "EPA", "Energy"],
  ["OR", "L'Oréal", "EPA", "Consumer Staples"], ["SAN", "Sanofi", "EPA", "Healthcare"],
  ["BNP", "BNP Paribas", "EPA", "Financials"], ["AIR", "Airbus", "EPA", "Industrials"],
  ["MC", "LVMH", "EPA", "Consumer Discretionary"], ["KER", "Kering", "EPA", "Consumer Discretionary"],
  ["RMS", "Hermès", "EPA", "Consumer Discretionary"], ["AI", "Air Liquide", "EPA", "Materials"],
  ["SAP", "SAP", "XETRA", "Technology"], ["SIE", "Siemens", "XETRA", "Industrials"],
  ["ALV", "Allianz", "XETRA", "Financials"], ["BAS", "BASF", "XETRA", "Materials"],
  ["DTE", "Deutsche Telekom", "XETRA", "Communication Services"], ["VOW3", "Volkswagen", "XETRA", "Consumer Discretionary"],
  ["BMW", "BMW", "XETRA", "Consumer Discretionary"], ["MUV2", "Munich Re", "XETRA", "Financials"],
  ["ITX", "Inditex", "BME", "Consumer Discretionary"], ["SAN2", "Banco Santander", "BME", "Financials"],
  ["BBVA", "BBVA", "BME", "Financials"], ["IBE", "Iberdrola", "BME", "Utilities"],
  ["NESN", "Nestlé", "SWX", "Consumer Staples"], ["NOVN", "Novartis", "SWX", "Healthcare"],
  ["ROG", "Roche", "SWX", "Healthcare"], ["NOVO-B", "Novo Nordisk", "CPH", "Healthcare"],
  ["ZURN", "Zurich Insurance", "SWX", "Financials"], ["NOKIA", "Nokia", "HEL", "Technology"],
  ["ERIC", "Ericsson", "STO", "Technology"], ["VOLV-B", "Volvo", "STO", "Industrials"],
  ["HM-B", "H&M", "STO", "Consumer Discretionary"], ["ATCO-A", "Atlas Copco", "STO", "Industrials"],
  ["KONE", "KONE", "HEL", "Industrials"], ["CLAS-B", "Coloplast", "CPH", "Healthcare"],
  ["STLAM", "Stellantis", "MIL", "Consumer Discretionary"], ["ENEL", "Enel", "MIL", "Utilities"],
  ["ENI", "Eni", "MIL", "Energy"],
  // Asia
  ["7203", "Toyota Motor", "TSE", "Consumer Discretionary"], ["6758", "Sony Group", "TSE", "Technology"],
  ["9984", "SoftBank Group", "TSE", "Financials"], ["6861", "Keyence", "TSE", "Technology"],
  ["7974", "Nintendo", "TSE", "Communication Services"], ["8306", "Mitsubishi UFJ", "TSE", "Financials"],
  ["9432", "NTT", "TSE", "Communication Services"], ["4568", "Daiichi Sankyo", "TSE", "Healthcare"],
  ["4502", "Takeda", "TSE", "Healthcare"], ["7267", "Honda Motor", "TSE", "Consumer Discretionary"],
  ["6902", "Denso", "TSE", "Consumer Discretionary"], ["6981", "Murata Manufacturing", "TSE", "Technology"],
  ["6594", "Nidec", "TSE", "Industrials"], ["6367", "Daikin Industries", "TSE", "Industrials"],
  ["2330", "TSMC", "TWSE", "Technology"], ["2454", "MediaTek", "TWSE", "Technology"],
  ["2317", "Hon Hai Precision", "TWSE", "Technology"], ["005930", "Samsung Electronics", "KRX", "Technology"],
  ["000660", "SK Hynix", "KRX", "Technology"], ["005380", "Hyundai Motor", "KRX", "Consumer Discretionary"],
  ["373220", "LG Energy Solution", "KRX", "Materials"], ["035420", "NAVER", "KRX", "Communication Services"],
  ["9988", "BYD", "HKEX", "Consumer Discretionary"], ["0700", "Tencent", "HKEX", "Communication Services"],
  ["3690", "Meituan", "HKEX", "Consumer Discretionary"], ["1810", "Xiaomi", "HKEX", "Technology"],
  ["0941", "China Mobile", "HKEX", "Communication Services"], ["2318", "Ping An Insurance", "HKEX", "Financials"],
  ["3988", "ICBC", "HKEX", "Financials"], ["1299", "AIA Group", "HKEX", "Financials"],
  ["600519", "Kweichow Moutai", "SSE", "Consumer Staples"], ["601318", "Ping An", "SSE", "Financials"],
  ["601398", "ICBC", "SSE", "Financials"], ["RELIANCE", "Reliance Industries", "NSE", "Energy"],
  ["TCS", "Tata Consultancy", "NSE", "Technology"], ["INFY", "Infosys", "NSE", "Technology"],
  ["HDFCBANK", "HDFC Bank", "NSE", "Financials"], ["ICICIBANK", "ICICI Bank", "NSE", "Financials"],
  ["BHARTIARTL", "Bharti Airtel", "NSE", "Communication Services"], ["SBIN", "State Bank of India", "NSE", "Financials"],
  ["ITC", "ITC", "NSE", "Consumer Staples"], ["LT", "Larsen & Toubro", "NSE", "Industrials"],
  // Oceania & other Americas
  ["CBA", "Commonwealth Bank", "ASX", "Financials"], ["BHP", "BHP Group", "ASX", "Materials"],
  ["NAB", "National Australia Bank", "ASX", "Financials"], ["CSL", "CSL", "ASX", "Healthcare"],
  ["WDS", "Woodside Energy", "ASX", "Energy"], ["RY", "Royal Bank of Canada", "TSX", "Financials"],
  ["TD", "Toronto-Dominion Bank", "TSX", "Financials"], ["PETR4", "Petrobras", "B3", "Energy"],
  ["VALE3", "Vale", "B3", "Materials"], ["ITUB4", "Itaú Unibanco", "B3", "Financials"],
  ["FEMSA", "Fomento Económico Mexicano", "BMV", "Consumer Staples"], ["AMX", "América Móvil", "BMV", "Communication Services"],
];

/* ---------- synthetic name parts ---------- */
const PREFIXES = [
  "Apex", "Vertex", "Nimbus", "Quanta", "Helix", "Lumen", "Orbit", "Crest",
  "Pinnacle", "Beacon", "Meridian", "Summit", "Pioneer", "Sterling", "Vantage",
  "Horizon", "Cobalt", "Atlas", "Onyx", "Verde", "Nova", "Aether", "Solace",
  "Granite", "Cipher", "Tidal", "Polar", "Ember", "Lattice", "Aurora", "Zenith",
  "Cascade", "Sable", "Vivid", "Ironwood", "Brightline", "Cedar", "Northwind",
  "Silverline", "Halcyon", "Equinox", "Cardinal", "Verra", "Marble", "Cinder",
];
const SUFFIXES = ["Inc.", "Corp.", "Group", "Holdings", "Ltd.", "AG", "S.A.", "N.V.", "Co.", "plc", "K.K.", "LLC"];
const CORE: Record<string, string[]> = {
  Technology: ["Technologies", "Systems", "Software", "Networks", "Compute", "Data", "Labs"],
  Healthcare: ["Pharma", "Bio", "Therapeutics", "Medical", "Health", "Diagnostics", "Biosciences"],
  Financials: ["Capital", "Bancorp", "Financial", "Holdings", "Advisors", "Partners"],
  "Consumer Discretionary": ["Motors", "Apparel", "Hotels", "Leisure", "Home", "Brands"],
  "Communication Services": ["Media", "Communications", "Studios", "Broadcasting", "Networks"],
  Industrials: ["Industries", "Aerospace", "Robotics", "Logistics", "Engineering", "Marine"],
  "Consumer Staples": ["Foods", "Retail", "Goods", "Markets", "Provisions"],
  Energy: ["Energy", "Petroleum", "Power", "Resources", "Renewables"],
  Materials: ["Materials", "Chemicals", "Mining", "Steel", "Minerals", "Polymers"],
  Utilities: ["Utilities", "Electric", "Grid", "Water", "Power"],
  "Real Estate": ["Properties", "Realty", "Estates", "Developments", "Reit"],
};

/* weighted exchange picker */
const EX_WEIGHTS: [string, number][] = [
  ["NASDAQ", 18], ["NYSE", 22], ["LSE", 8], ["EPA", 6], ["AMS", 3], ["XETRA", 8],
  ["SWX", 3], ["STO", 3], ["HEL", 2], ["CPH", 2], ["MIL", 4], ["BME", 3],
  ["TSE", 10], ["TWSE", 4], ["KRX", 5], ["HKEX", 7], ["SSE", 8], ["SZSE", 6],
  ["NSE", 6], ["BSE", 3], ["ASX", 5], ["TSX", 5], ["BMV", 2], ["B3", 3],
];
const EX_POOL: string[] = EX_WEIGHTS.flatMap(([ex, w]) => Array.from({ length: w }, () => ex));

const SYNTHETIC_COUNT = 100000;

/** Advertised total (seeds + synthetic) — available instantly, no build needed. */
export const COMPANY_COUNT = SEEDS.length + SYNTHETIC_COUNT;
/** Approximate total global equity market cap (~$112T). */
export const UNIVERSE_MARKET_CAP = 112_000_000_000_000;

function makeCompany(symbol: string, name: string, exchange: string, sector: string, synthetic: boolean): Company {
  const ex = EXCHANGE_INFO[exchange];
  const m = metrics(symbol);
  return {
    symbol,
    name,
    exchange,
    sector,
    country: ex.country,
    currency: ex.currency,
    currencySymbol: ex.csym,
    region: ex.region,
    marketCap: m.marketCap,
    price: m.price,
    change: m.change,
    changeAbs: m.changeAbs,
    synthetic,
  };
}

function buildSeedCompanies(): Company[] {
  const seen = new Set<string>();
  const out: Company[] = [];
  for (const [symbol, name, exchange, sector] of SEEDS) {
    if (!EXCHANGE_INFO[exchange] || seen.has(symbol)) continue;
    seen.add(symbol);
    out.push(makeCompany(symbol, name, exchange, sector, false));
  }
  out.sort((a, b) => b.marketCap - a.marketCap);
  return out;
}

function buildCompanies(): Company[] {
  const seeds = buildSeedCompanies();
  const used = new Set(seeds.map((c) => c.symbol));
  const out: Company[] = seeds.slice();

  let i = 0;
  const target = SEEDS.length + SYNTHETIC_COUNT;
  while (out.length < target && i < SYNTHETIC_COUNT * 2) {
    i++;
    const rng = seededRand(hashStr("c:" + i));
    const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rng() * arr.length)];
    const sector = pick(SECTORS);
    const exchange = EX_POOL[Math.floor(rng() * EX_POOL.length)];
    const prefix = pick(PREFIXES);
    const core = pick(CORE[sector]);
    const style = Math.floor(rng() * 3);
    const name =
      style === 0 ? `${prefix} ${core}`
      : style === 1 ? `${prefix} ${core} ${pick(SUFFIXES)}`
      : `${core} ${pick(SUFFIXES)}`;

    let symbol = name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).join("").toUpperCase().slice(0, 4);
    if (symbol.length < 2) symbol = "ZX";
    let n = 0;
    const base = symbol;
    while (used.has(symbol)) {
      n++;
      symbol = base + (n > 26 ? n : String.fromCharCode(64 + (n % 27)));
    }
    used.add(symbol);
    out.push(makeCompany(symbol, name, exchange, sector, true));
  }

  out.sort((a, b) => b.marketCap - a.marketCap);
  return out;
}

/* ---------- lazy singletons ---------- */
let _companies: Company[] | null = null;
let _bySymbol: Map<string, Company> | null = null;

export function getCompanies(): Company[] {
  if (!_companies) _companies = buildCompanies();
  return _companies;
}
export function getCompanyMap(): Map<string, Company> {
  if (!_bySymbol) _bySymbol = new Map(getCompanies().map((c) => [c.symbol, c]));
  return _bySymbol;
}

/** Instant preview (real seeds only) for the dashboard — no heavy build. */
export const PREVIEW_COMPANIES: Company[] = buildSeedCompanies().slice(0, 8);

export function searchUniverse(query: string, limit: number): Company[] {
  const companies = getCompanies();
  const q = query.trim().toLowerCase();
  if (!q) return companies.slice(0, limit);
  const hits: { c: Company; score: number }[] = [];
  for (const c of companies) {
    const sym = c.symbol.toLowerCase();
    const nm = c.name.toLowerCase();
    let score = -1;
    if (sym === q || nm === q) score = 100;
    else if (sym.startsWith(q)) score = 88;
    else if (nm.startsWith(q)) score = 74;
    else if (sym.includes(q) || nm.includes(q)) score = 52;
    if (score >= 0) {
      hits.push({ c, score });
      if (hits.length >= 600) break;
    }
  }
  hits.sort((a, b) => b.score - a.score || b.c.marketCap - a.c.marketCap);
  return hits.slice(0, limit).map((h) => h.c);
}

/* ---------- adapt a company to the Asset shape ---------- */
export function companyAsset(id: string): Asset | null {
  const symbol = id.startsWith("u:") ? id.slice(2) : id;
  const c = getCompanyMap().get(symbol);
  if (!c) return null;
  const m = metrics(c.symbol);
  return {
    id: "u:" + c.symbol,
    symbol: c.symbol,
    name: c.name,
    category: "Stocks",
    price: c.price,
    change24h: c.change,
    changeAbs: c.changeAbs,
    marketCap: c.marketCap,
    volume: m.volume,
    high24h: m.high,
    low24h: m.low,
    open24h: m.open,
    prevClose: m.prevClose,
    color: colorFor(c.sector),
    glyph: "",
    status: "open",
    region: c.region,
    about: `${c.name} (${c.symbol}) trades on the ${c.exchange} and operates in the ${c.sector.toLowerCase()} sector, headquartered in ${c.country}.`,
  };
}

const liveCache = new Map<string, { price: number; change: number; changeAbs: number }>();
export function universeLive(id: string): { price: number; change: number; changeAbs: number } | null {
  if (!id.startsWith("u:")) return null;
  let v = liveCache.get(id);
  if (!v) {
    const symbol = id.slice(2);
    const c = getCompanyMap().get(symbol);
    if (!c) return null;
    v = { price: c.price, change: c.change, changeAbs: c.changeAbs };
    liveCache.set(id, v);
  }
  return v;
}
