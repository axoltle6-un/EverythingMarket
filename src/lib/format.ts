// Deterministic randomness + formatting helpers

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRand(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate a realistic price walk that ends exactly at `end`. */
export function genPriceSeries(
  seed: string,
  end: number,
  points: number,
  trendPct: number,
  vol = 0.012
): number[] {
  const rand = seededRand(hashStr(seed));
  const start = end / (1 + trendPct / 100);
  const slope = (end - start) / Math.max(1, points - 1);
  const out: number[] = [];
  let walk = 0;
  for (let i = 0; i < points; i++) {
    walk += (rand() - 0.5) * vol * end;
    walk *= 0.9;
    out.push(start + slope * i + walk);
  }
  out[points - 1] = end;
  return out;
}

export function fmtPrice(n: number): string {
  const abs = Math.abs(n);
  let max = 2;
  if (abs < 1) max = abs < 0.01 ? 6 : 4;
  const min = abs >= 1 ? 2 : 0;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
}

export function fmtCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e12) return sign + (abs / 1e12).toFixed(2) + "T";
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(2) + "K";
  return sign + abs.toFixed(0);
}

export function fmtPct(n: number, digits = 2): string {
  return (n >= 0 ? "+" : "") + n.toFixed(digits) + "%";
}

export function fmtSigned(n: number): string {
  return (n >= 0 ? "+" : "") + n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
