import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Sparkles, Eye, LogOut, User } from "lucide-react";
import { usePrefs } from "../lib/prefs";
import { useAuth } from "../lib/auth";
import { useStore, type View } from "../store";
import { Button } from "./ui";

function Toggle({
  checked,
  onChange,
  icon,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/70">
          {icon}
        </span>
        <div>
          <div className="text-[13.5px] font-medium text-white">{label}</div>
          <div className="mt-0.5 text-[12px] leading-relaxed text-white/45">{desc}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-white/[0.12]"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? "right-0.5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

const VIEWS: { v: View; label: string }[] = [
  { v: "dashboard", label: "Dashboard" },
  { v: "markets", label: "Markets" },
  { v: "watchlist", label: "Watchlist" },
  { v: "portfolio", label: "Portfolio" },
  { v: "insights", label: "AI Insights" },
  { v: "news", label: "News" },
  { v: "calendar", label: "Calendar" },
];

export function SettingsModal() {
  const open = usePrefs((s) => s.settingsOpen);
  const close = () => usePrefs.getState().setSettingsOpen(false);
  const { liveUpdates, reducedMotion, defaultView, setLiveUpdates, setReducedMotion, setDefaultView } = usePrefs();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const openAsset = useStore((s) => s.openAsset);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.1] bg-ink-900 p-6 shadow-2xl shadow-black/60"
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold tracking-tight text-white">Settings</h2>
              <button onClick={close} className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 hover:bg-white/[0.06] hover:text-white" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Account */}
            <section>
              <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">Account</h3>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/70">
                  <User size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-white">{user?.name || "Trader"}</div>
                  <div className="truncate text-[12px] text-white/45">{user?.email || "—"}</div>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut size={14} /> Sign out
                </Button>
              </div>
            </section>

            {/* Preferences */}
            <section className="mt-6">
              <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">Preferences</h3>
              <div className="divide-y divide-white/[0.05]">
                <Toggle
                  checked={liveUpdates}
                  onChange={setLiveUpdates}
                  icon={<Zap size={15} />}
                  label="Live price updates"
                  desc="Stream real-time prices across the dashboard."
                />
                <Toggle
                  checked={reducedMotion}
                  onChange={setReducedMotion}
                  icon={<Sparkles size={15} />}
                  label="Reduce motion"
                  desc="Minimize animations and transitions."
                />
                <Toggle
                  checked={false}
                  onChange={() => {}}
                  icon={<Eye size={15} />}
                  label="Sound effects"
                  desc="Audio cues for alerts and trades (coming soon)."
                />
              </div>
            </section>

            {/* Default view */}
            <section className="mt-6">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Default view after sign-in</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {VIEWS.map((v) => (
                  <button
                    key={v.v}
                    onClick={() => setDefaultView(v.v)}
                    className={`rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors ${
                      defaultView === v.v
                        ? "border-accent/40 bg-accent/10 text-white"
                        : "border-white/[0.07] bg-white/[0.02] text-white/55 hover:text-white"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[12px] text-white/35">
              <span>Everything Market · v1.0</span>
              <button onClick={() => { close(); openAsset("bitcoin"); }} className="hover:text-white">Demo data</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
