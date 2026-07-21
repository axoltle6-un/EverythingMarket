import { LayoutDashboard, Globe, Star, PieChart, Menu } from "lucide-react";
import { useStore } from "../store";
import type { View } from "../store";
import { cn } from "../utils/cn";

const ITEMS: { view: View; label: string; icon: typeof Globe }[] = [
  { view: "dashboard", label: "Home", icon: LayoutDashboard },
  { view: "markets", label: "Markets", icon: Globe },
  { view: "watchlist", label: "Lists", icon: Star },
  { view: "portfolio", label: "Folio", icon: PieChart },
];

export function MobileNav() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  const activeView = view === "asset" ? "markets" : view;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/[0.07] bg-ink-950/85 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl md:hidden"
      style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors",
              active ? "text-white" : "text-white/45"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-12 items-center justify-center rounded-lg transition-colors",
                active ? "bg-accent/15" : ""
              )}
            >
              <Icon size={18} className={active ? "text-accent" : ""} />
            </span>
            {item.label}
          </button>
        );
      })}
      <button
        onClick={toggleSidebar}
        className="flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium text-white/45"
      >
        <span className="flex h-7 w-12 items-center justify-center">
          <Menu size={18} />
        </span>
        More
      </button>
    </nav>
  );
}
