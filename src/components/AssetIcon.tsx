import type { ComponentType, ReactNode } from "react";
import {
  SiBitcoin,
  SiEthereum,
  SiSolana,
  SiBinance,
  SiCardano,
  SiDogecoin,
  SiRipple,
  SiTether,
  SiPolkadot,
  SiChainlink,
  SiPolygon,
  SiLitecoin,
  SiStellar,
  SiMonero,
  SiInternetcomputer,
  SiApple,
  SiNvidia,
  SiTesla,
  SiGoogle,
  SiMeta,
  SiAmd,
  SiNetflix,
  SiCoinbase,
  SiIntel,
  SiVisa,
  SiMastercard,
  SiGoldmansachs,
  SiPaypal,
  SiSpotify,
} from "@icons-pack/react-simple-icons";
import { hashStr } from "../lib/format";
import type { Asset } from "../lib/data";

/* =========================================================================
   Brand logos (crypto + stocks) — rendered in white on a dark tile.
   ========================================================================= */
type IconComp = ComponentType<{ size?: number; color?: string; title?: string }>;

export const BRAND: Record<string, { Comp: IconComp }> = {
  bitcoin: { Comp: SiBitcoin },
  ethereum: { Comp: SiEthereum },
  solana: { Comp: SiSolana },
  binance: { Comp: SiBinance },
  cardano: { Comp: SiCardano },
  dogecoin: { Comp: SiDogecoin },
  ripple: { Comp: SiRipple },
  tether: { Comp: SiTether },
  polkadot: { Comp: SiPolkadot },
  chainlink: { Comp: SiChainlink },
  polygon: { Comp: SiPolygon },
  litecoin: { Comp: SiLitecoin },
  stellar: { Comp: SiStellar },
  monero: { Comp: SiMonero },
  internetcomputer: { Comp: SiInternetcomputer },
  apple: { Comp: SiApple },
  nvidia: { Comp: SiNvidia },
  tesla: { Comp: SiTesla },
  google: { Comp: SiGoogle },
  meta: { Comp: SiMeta },
  amd: { Comp: SiAmd },
  netflix: { Comp: SiNetflix },
  coinbase: { Comp: SiCoinbase },
  intel: { Comp: SiIntel },
  visa: { Comp: SiVisa },
  mastercard: { Comp: SiMastercard },
  goldman: { Comp: SiGoldmansachs },
  paypal: { Comp: SiPaypal },
  spotify: { Comp: SiSpotify },
};

export function hasBrand(id: string): boolean {
  return !!BRAND[id];
}

export function AssetBrandIcon({
  id,
  size = 24,
  color = "#ECECEF",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  const b = BRAND[id];
  if (!b) return null;
  return <b.Comp size={size} color={color} />;
}

/* =========================================================================
   Custom asset-class icons (metals, commodities, bonds, indices, economy).
   All monochrome, drawn with currentColor so they render crisp in white.
   ========================================================================= */
function S({
  size,
  children,
  stroke = false,
}: {
  size: number;
  children: ReactNode;
  stroke?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

type SvgFn = (size: number) => ReactNode;

const ingot: SvgFn = (s) =>
  S({
    size: s,
    children: (
      <>
        <path d="M4 10.4 6.4 6.6A2 2 0 0 1 8 5.6h8a2 2 0 0 1 1.6 1L20 10.4a1 1 0 0 1-.8 1.6H4.8A1 1 0 0 1 4 10.4Z" opacity={0.7} />
        <path d="M4.5 12.5h15V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18v-5.5Z" />
      </>
    ),
  });

const coin: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.4" /></> });

const gem: SvgFn = (s) =>
  S({ size: s, children: <path d="M6 3h12l3 5-9 13L3 8 6 3Z" /> });

const hex: SvgFn = (s) =>
  S({ size: s, children: <path d="M12 2 20.5 7v10L12 22 3.5 17V7 12 2Z" /> });

const barrel: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><rect x="5" y="3.5" width="14" height="17" rx="3" /><path d="M5 9h14M5 15h14" /></> });

const flame: SvgFn = (s) =>
  S({
    size: s,
    children: (
      <path d="M12 2c.6 3 2.2 3.8 3.3 5.4C16.8 9.4 17.5 11.2 17.5 13a5.5 5.5 0 0 1-11 0c0-1.7.8-3 1.7-4C9 8.3 9 6.8 9.6 5.4 10.6 6.8 11.4 7.4 12 8c-.5-2-.2-4 0-6Z" />
    ),
  });

const exchange: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><path d="M4 8h13l-3-3M4 8l3 3" /><path d="M20 16H7l3 3M20 16l-3-3" /></> });

const percent: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><path d="M6 18 18 6" /><circle cx="7.5" cy="7.5" r="1.6" /><circle cx="16.5" cy="16.5" r="1.6" /></> });

const gauge: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><path d="M3.5 17a8.5 8.5 0 0 1 17 0" /><path d="M12 17l3.5-3.5" /><circle cx="12" cy="17" r="1.2" /></> });

const zigzag: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <path d="M3 9l4 2.5 3-6 4 12 2.5-5H21" /> });

const trend: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><path d="M3 17l5-5 3.5 3L17 8" /><path d="M21 8h-4M21 8v4" /></> });

const bars: SvgFn = (s) =>
  S({
    size: s,
    children: <><rect x="4" y="12" width="3.2" height="7" rx="1" /><rect x="10.4" y="7" width="3.2" height="12" rx="1" /><rect x="16.8" y="10" width="3.2" height="9" rx="1" /></>,
  });

const line: SvgFn = (s) =>
  S({ size: s, stroke: true, children: <><path d="M3 15.5 8 10l3.5 3L16 8" /><path d="M21 8h-4M21 8v4" /></> });

const candle: SvgFn = (s) =>
  S({
    size: s,
    stroke: true,
    children: <><path d="M8 3v3M8 16v4M16 4v3M16 15v4" /><rect x="6.4" y="6" width="3.2" height="10" rx="1" /><rect x="14.4" y="7" width="3.2" height="8" rx="1" /></>,
  });

const area: SvgFn = (s) =>
  S({ size: s, children: <path d="M3 17.5 7.5 12l3 2.2L15 7l3.5 2.2L21 7v13H3z" /> });

const INDEX_POOL: SvgFn[] = [bars, line, candle, area];

const CLASS_ICONS: Record<string, SvgFn> = {
  // Metals
  gold: ingot,
  silver: coin,
  platinum: gem,
  palladium: hex,
  // Commodities
  oil: barrel,
  brent: barrel,
  natgas: flame,
  copper: ingot,
  // Bonds
  us10y: percent,
  us2y: percent,
  us30y: percent,
  // Economy
  vix: zigzag,
  cpi: gauge,
  gdpnow: trend,
  // Forex
  eurusd: exchange,
  gbpusd: exchange,
  usdjpy: exchange,
  audusd: exchange,
  dxy: exchange,
};

/* =========================================================================
   Unified resolver: returns the right visual node or null (glyph fallback).
   ========================================================================= */
export function AssetMark({ asset, size = 24 }: { asset: Asset; size?: number }): ReactNode {
  if (hasBrand(asset.id)) {
    return <AssetBrandIcon id={asset.id} size={Math.round(size * 0.5)} />;
  }
  const cls = CLASS_ICONS[asset.id];
  if (cls) return cls(Math.round(size * 0.58));
  if (asset.category === "Indices" || asset.category === "ETFs") {
    const fn = INDEX_POOL[hashStr(asset.id) % INDEX_POOL.length];
    return fn(Math.round(size * 0.58));
  }
  return null;
}
