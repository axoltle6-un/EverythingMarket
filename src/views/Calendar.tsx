import { useMemo, useState } from "react";
import { Clock, Globe } from "lucide-react";
import { events, type CalendarEvent } from "../lib/data";
import { Card, Badge } from "../components/ui";
import { cn } from "../utils/cn";

const TYPES: ("All" | CalendarEvent["type"])[] = [
  "All",
  "Rates",
  "Inflation",
  "Growth",
  "Earnings",
  "Crypto",
];

const IMPACT: Record<CalendarEvent["impact"], { color: string; label: string }> = {
  high: { color: "#f4635f", label: "High" },
  medium: { color: "#e0b84a", label: "Medium" },
  low: { color: "#7a8aa0", label: "Low" },
};

function dayLabel(offset: number) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
  return `${wd}, ${mo} ${d.getDate()}`;
}

export function Calendar() {
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("All");

  const grouped = useMemo(() => {
    const filtered = filter === "All" ? events : events.filter((e) => e.type === filter);
    const days = [...new Set(filtered.map((e) => e.day))].sort((a, b) => a - b);
    return days.map((d) => ({ day: d, label: dayLabel(d), items: filtered.filter((e) => e.day === d) }));
  }, [filter]);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Economic Calendar</h1>
          <p className="mt-1 text-[14px] text-white/45">Rates, inflation, growth, earnings and crypto events.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-white/40">
          <Globe size={13} /> Times shown in your local timezone
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              filter === t ? "bg-white text-ink-950" : "bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {grouped.map((g) => (
          <div key={g.day}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[13px] font-semibold text-white">{g.label}</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[12px] text-white/35">{g.items.length} events</span>
            </div>
            <div className="space-y-2">
              {g.items.map((e) => (
                <Card key={e.id} hover className="flex items-center gap-4 p-4">
                  <div className="w-14 shrink-0">
                    <div className="flex items-center gap-1 text-[13px] font-semibold tabular-nums text-white">
                      <Clock size={12} className="text-white/40" /> {e.time}
                    </div>
                  </div>
                  <span className="text-xl">{e.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-medium text-white">{e.title}</span>
                      <Badge>{e.type}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[12px] text-white/45">
                      <span>Forecast <span className="tabular-nums text-white/70">{e.forecast}</span></span>
                      <span>Previous <span className="tabular-nums text-white/70">{e.previous}</span></span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: IMPACT[e.impact].color }} />
                    </span>
                    <span className="hidden text-[12px] text-white/45 sm:inline">{IMPACT[e.impact].label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
