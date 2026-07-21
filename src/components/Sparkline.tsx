import { useId } from "react";

export function Sparkline({
  data,
  positive,
  width = 120,
  height = 38,
  strokeWidth = 1.6,
  fill = true,
  className,
}: {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  className?: string;
}) {
  const rawId = useId();
  const gid = "sg" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - pad - ((d - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  const color = positive ? "var(--color-gain)" : "var(--color-loss)";
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
