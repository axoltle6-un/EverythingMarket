import {
  LayoutDashboard,
  Globe,
  Star,
  PieChart,
  CalendarDays,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { View } from "./store";

export interface NavItem {
  view: View;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "markets", label: "Markets", icon: Globe },
  { view: "watchlist", label: "Watchlist", icon: Star },
  { view: "portfolio", label: "Portfolio", icon: PieChart },
  { view: "calendar", label: "Calendar", icon: CalendarDays },
  { view: "news", label: "News", icon: Newspaper },
  { view: "insights", label: "AI Insights", icon: Sparkles },
];
