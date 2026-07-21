import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Bitcoin,
  Building2,
  LineChart,
  Gem,
  ArrowLeftRight,
  Percent,
  Globe,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Bell,
  Star,
} from "lucide-react";
import { useStore } from "../store";
import { useAuth } from "../lib/auth";
import { LogoMark } from "../components/Logo";
import { assets, getAsset, getInsight } from "../lib/data";
import { COMPANY_COUNT } from "../lib/universe";
import { fmtPrice, fmtPct } from "../lib/format";
import { Button, Card, AssetTile, ChangeChip, Badge } from "../components/ui";
import { AssetCard } from "../components/AssetCard";
import { MarketTicker } from "../components/MarketTicker";
import { cn } from "../utils/cn";

const LIVE_PREVIEW = ["bitcoin", "ethereum", "gold", "oil", "nasdaq", "sp500", "solana", "dxy"];

const FEATURES = [
  { icon: Bitcoin, title: "Crypto", desc: "Bitcoin, Ethereum & majors with real brand logos, live prices and on-chain-grade detail." },
  { icon: Building2, title: "Stocks", desc: `${(COMPANY_COUNT / 1000).toFixed(0)},000+ companies across 24 global exchanges, instantly searchable.` },
  { icon: LineChart, title: "Indices", desc: "63 benchmarks on six continents — from the S&P 500 to the Nikkei and beyond." },
  { icon: Gem, title: "Metals & Commodities", desc: "Gold, silver, oil, gas and copper with clean OHLC and day-range detail." },
  { icon: ArrowLeftRight, title: "Forex", desc: "Every major currency pair and the Dollar Index, updating in real time." },
  { icon: Percent, title: "Bonds & Economy", desc: "The Treasury yield curve, VIX, CPI and growth nowcasts in one glance." },
];

const PRINCIPLES = [
  { icon: Sparkles, title: "Minimal by design", desc: "No clutter, no casino colors — just clarity and intention in every pixel." },
  { icon: Zap, title: "Feels instant", desc: "Lazy loading, deferred search and cached lookups keep interactions crisp." },
  { icon: ShieldCheck, title: "Accessible", desc: "Keyboard nav, ARIA labels, reduced-motion support and high-contrast type." },
];

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const live = useStore((s) => s.live);
  const openAuth = useAuth((s) => s.openAuth);

  const sample = getInsight(getAsset("bitcoin")!);
  const indexCount = assets.filter((a) => a.category === "Indices").length;

  return (
    <div className="app-aura relative min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <LogoMark withText />
          <nav className="hidden items-center gap-7 text-[13px] text-white/55 md:flex">
            <a href="#markets" className="transition-colors hover:text-white">Markets</a>
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#insights" className="transition-colors hover:text-white">AI</a>
            <a href="#stats" className="transition-colors hover:text-white">Coverage</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => openAuth("signin")}>
              Sign in
            </Button>
            <Button variant="primary" size="sm" onClick={() => openAuth("signup")}>
              Get started <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(79,139,255,0.22), transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-56 left-0 h-[30rem] w-[30rem] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.16), transparent 70%)" }} />

        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-20 text-center sm:px-8 sm:pt-28">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tone="accent" className="mx-auto mb-6">
              <Sparkles size={11} /> Everything Market · Live
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mx-auto max-w-4xl text-[40px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[68px]"
          >
            Track every market in one{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#4f8bff,#34d399)" }}>
              beautiful dashboard.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 sm:text-[18px]"
          >
            Crypto, stocks, metals, forex, indices and {COMPANY_COUNT.toLocaleString()}+ companies —
            with AI insight and real-time clarity. A Bloomberg terminal, reimagined by Apple.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button variant="primary" size="lg" onClick={() => openAuth("signup")}>
              Get started free <ArrowRight size={17} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => openAuth("signin", "markets")}>
              <Globe size={17} /> Explore markets
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-[12.5px] text-white/35"
          >
            Free to try · No credit card · Live data simulation
          </motion.p>
        </div>

        {/* Ticker */}
        <div className="relative mx-auto max-w-6xl px-5 pb-6 sm:px-8">
          <MarketTicker />
        </div>
      </section>

      {/* Live market preview */}
      <section id="markets" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="mb-8 text-center">
            <h2 className="text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              Live markets, at a glance
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/50">
              Prices stream in real time. Sign in to dive into any asset's chart, stats and AI analysis.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIVE_PREVIEW.map((id, i) => (
            <Reveal key={id} delay={i * 0.05}>
              <AssetCard asset={getAsset(id)!} index={0} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="secondary" size="md" onClick={() => openAuth("signin", "markets")}>
            Browse all markets <ArrowRight size={15} />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <Badge className="mx-auto mb-4">Coverage</Badge>
            <h2 className="text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              One dashboard for every asset class
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/50">
              Nine markets, unified under a single clean interface.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.06}>
                <Card hover className="h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-accent ring-1 ring-white/[0.06]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-[16px] font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">{f.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* AI Insights highlight */}
      <section id="insights" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <Badge tone="accent" className="mb-4"><Sparkles size={11} /> AI Insights</Badge>
              <h2 className="text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
                AI that explains the market
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/55">
                Every asset ships with a synthesized read: sentiment, risk score, confidence,
                and the key bullish and bearish factors — so you understand a market in seconds.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Bullish & bearish factor breakdowns",
                  "Risk score and confidence meters",
                  "Market pulse across all asset classes",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-[14px] text-white/70">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gain/15 text-gain">
                      <Sparkles size={11} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="md" className="mt-7" onClick={() => openAuth("signup", "insights")}>
                Try AI Insights <ArrowRight size={15} />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AssetTile asset={getAsset("bitcoin")!} size={44} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-white">BTC</span>
                      <Badge tone={sample.sentiment === "Bullish" ? "gain" : "neutral"}>{sample.sentiment}</Badge>
                    </div>
                    <div className="text-[12px] text-white/45">AI market read</div>
                  </div>
                </div>
                <ChangeChip value={live.bitcoin?.change ?? 0} />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/60">{sample.summary}</p>
              <div className="mt-5 space-y-4">
                {[
                  { label: "Risk score", value: sample.riskScore },
                  { label: "Confidence", value: sample.confidence, suffix: "%" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-white/50">{m.label}</span>
                      <span className="font-semibold tabular-nums text-white">{m.value}{m.suffix ?? ""}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: m.value < 40 ? "#34d399" : m.value < 65 ? "#e0b84a" : "#4f8bff" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section id="stats" className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Reveal>
          <Card className="grid grid-cols-2 gap-6 p-8 sm:grid-cols-4">
            {[
              [`${(COMPANY_COUNT / 1000).toFixed(0)}K+`, "Companies"],
              [`${indexCount}`, "Global indices"],
              ["9", "Asset classes"],
              ["Real-time", "Live updates"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">{v}</div>
                <div className="mt-1 text-[13px] text-white/45">{l}</div>
              </div>
            ))}
          </Card>
        </Reveal>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              Built for clarity, speed and trust
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <Card hover className="h-full p-6 text-center">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-gain ring-1 ring-white/[0.06]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/50">{p.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Movers strip */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
              <TrendingUp size={16} className="text-gain" /> Today's movers
            </h3>
            <Button variant="ghost" size="sm" onClick={() => openAuth("signin", "markets")}>See all <ArrowRight size={13} /></Button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {[...assets]
              .sort((a, b) => Math.abs(live[b.id]?.change ?? b.change24h) - Math.abs(live[a.id]?.change ?? a.change24h))
              .slice(0, 6)
              .map((a) => {
                const change = live[a.id]?.change ?? a.change24h;
                const up = change >= 0;
                return (
                  <button
                    key={a.id}
                    onClick={() => openAuth("signin")}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2">
                      <AssetTile asset={a} size={28} />
                      <span className="text-[13px] font-semibold text-white">{a.symbol}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[12px] tabular-nums text-white/70">{fmtPrice(live[a.id]?.price ?? a.price)}</span>
                      <span className={cn("text-[12px] tabular-nums", up ? "text-gain" : "text-loss")}>{fmtPct(change)}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 120% at 50% 0%, rgba(79,139,255,0.18), transparent 70%)" }} />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-[30px] font-semibold tracking-tight text-white sm:text-[42px]">
                Ready to see everything?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-white/55">
                Create a free account and track the entire world of markets in one place.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" size="lg" onClick={() => openAuth("signup")}>
                  Get started free <ArrowRight size={17} />
                </Button>
                <Button variant="outline" size="lg" onClick={() => openAuth("signin", "portfolio")}>
                  I have an account
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <LogoMark withText />
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/40">
                The premium way to track every market in one beautiful dashboard.
              </p>
            </div>
            {[
              { h: "Markets", items: ["Crypto", "Stocks", "Indices", "Forex"] },
              { h: "Product", items: ["Dashboard", "Watchlists", "Portfolio", "AI Insights"] },
              { h: "Company", items: ["About", "Pricing", "Careers", "Contact"] },
            ].map((col) => (
              <div key={col.h}>
                <div className="text-[12px] font-semibold uppercase tracking-wider text-white/40">{col.h}</div>
                <ul className="mt-3 space-y-2">
                  {col.items.map((it) => (
                    <li key={it}>
                      <button onClick={() => openAuth("signin")} className="text-[13px] text-white/55 transition-colors hover:text-white">
                        {it}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-white/35 sm:flex-row">
            <span>© {new Date().getFullYear()} Everything Market. All rights reserved.</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={11} /> Markets simulated for demo</span>
              <span className="flex items-center gap-1"><Bell size={11} /> Real-time engine</span>
              <span className="flex items-center gap-1"><Star size={11} /> Premium UI</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
