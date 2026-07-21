import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, Command, LogOut, ChevronDown } from "lucide-react";
import { useStore } from "../store";
import { useAuth } from "../lib/auth";
import { usePrefs } from "../lib/prefs";
import { LogoMark } from "./Logo";
import { NAV } from "../nav";

function initialsOf(name?: string | null) {
  if (!name) return "EM";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || name.slice(0, 2).toUpperCase();
}

function ProfileMenu() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const [open, setOpen] = useState(false);
  const initials = initialsOf(user?.name);

  return (
    <div className="relative ml-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1 rounded-full pl-0.5 pr-1.5 text-white transition-colors hover:bg-white/[0.06]"
        style={{ background: "linear-gradient(140deg,#5b6478,#2e3340)" }}
        aria-label="Account menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold">
          {initials}
        </span>
        <ChevronDown size={13} className="text-white/60" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-white/[0.1] bg-ink-800/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
            >
              <div className="border-b border-white/[0.06] px-4 py-3">
                <div className="truncate text-[13px] font-semibold text-white">{user?.name || "Trader"}</div>
                <div className="truncate text-[12px] text-white/45">{user?.email || "—"}</div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopNav() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const setView = useStore((s) => s.setView);
  const view = useStore((s) => s.view);
  const back = useStore((s) => s.back);
  const setNotificationsOpen = usePrefs((s) => s.setNotificationsOpen);
  const setSettingsOpen = usePrefs((s) => s.setSettingsOpen);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-ink-950/70 px-4 backdrop-blur-xl sm:px-6">
      <LogoMark onClick={back} withText textClassName="hidden sm:inline" />

      {/* Search */}
      <div className="mx-auto w-full max-w-md">
        <button
          onClick={() => setSearchOpen(true)}
          className="group flex h-10 w-full items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 text-left text-[13px] text-white/40 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
        >
          <Search size={15} />
          <span className="flex-1 truncate">Search markets, assets…</span>
          <kbd className="hidden items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/40 sm:flex">
            <Command size={9} />K
          </kbd>
        </button>
      </div>

      {/* Inline links */}
      <nav className="hidden items-center gap-0.5 lg:flex">
        {NAV.filter((n) => ["news", "calendar", "insights"].includes(n.view)).map((n) => {
          const Icon = n.icon;
          const active = view === n.view;
          return (
            <button
              key={n.view}
              onClick={() => setView(n.view)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                active ? "bg-white/[0.07] text-white" : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon size={15} />
              {n.label === "AI Insights" ? "AI" : n.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label="Search"
        >
          <Search size={17} />
        </button>
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
          aria-label="Settings"
        >
          <Settings size={17} />
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}
